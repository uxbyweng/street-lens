import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db/mongodb";
import { User } from "@/lib/models/user";

const isPreview = process.env.VERCEL_ENV === "preview";

const providers = [
  GitHub,
  Google,
  ...(isPreview
    ? [
        Credentials({
          name: "Preview Login",
          credentials: {
            username: {
              label: "Username",
              type: "text",
              placeholder: "username",
            },
            password: {
              label: "Password",
              type: "password",
              placeholder: "password",
            },
          },
          async authorize(credentials) {
            if (
              credentials?.username !== "fisch" ||
              credentials?.password !== "fisch"
            ) {
              return null;
            }

            await connectDB();

            const provider = "credentials";
            const providerAccountId = "preview-fisch-user";

            const previewUser = await User.findOneAndUpdate(
              { provider, providerAccountId },
              {
                provider,
                providerAccountId,
                username: "fisch",
                name: "Neuer Fisch",
                email: "test@example.com",
                image: "",
                role: "admin",
              },
              {
                new: true,
                upsert: true,
              }
            );

            return {
              id: previewUser._id.toString(),
              name: previewUser.name,
              email: previewUser.email,
              image: previewUser.image,
              provider: previewUser.provider,
              providerAccountId: previewUser.providerAccountId,
              role: previewUser.role,
              username: previewUser.username,
            };
          },
        }),
      ]
    : []),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account) return false;

      if (account.provider === "credentials") {
        return true;
      }

      if (account.provider !== "github" && account.provider !== "google") {
        return false;
      }

      if (!profile) return false;

      await connectDB();

      const provider = account.provider;
      const providerAccountId = String(profile.sub ?? profile.id ?? "");

      if (!providerAccountId) {
        return false;
      }

      let username = "";
      if (provider === "github") {
        username = (profile as { login?: string }).login ?? "";
      }

      await User.findOneAndUpdate(
        { provider, providerAccountId },
        {
          provider,
          providerAccountId,
          username,
          name: user.name ?? "",
          email: user.email ?? "",
          image: user.image ?? "",
          $setOnInsert: {
            role: "standard",
          },
        },
        {
          new: true,
          upsert: true,
        }
      );

      return true;
    },

    async jwt({ token, account, profile, user }) {
      await connectDB();

      if (account?.provider === "credentials" && user) {
        token.userId = user.id;
        token.provider =
          "provider" in user && typeof user.provider === "string"
            ? user.provider
            : "credentials";
        token.providerAccountId =
          "providerAccountId" in user &&
          typeof user.providerAccountId === "string"
            ? user.providerAccountId
            : "preview-fisch-user";
        token.role =
          "role" in user && user.role === "admin" ? "admin" : "standard";
        token.username =
          "username" in user && typeof user.username === "string"
            ? user.username
            : "fisch";

        return token;
      }

      const provider = account?.provider ?? token.provider;
      const providerAccountId =
        account && profile
          ? String(profile.sub ?? profile.id ?? "")
          : token.providerAccountId;

      if (provider && providerAccountId) {
        const dbUser = await User.findOne({
          provider,
          providerAccountId,
        }).lean();

        if (dbUser) {
          token.userId = dbUser._id.toString();
          token.provider = dbUser.provider;
          token.providerAccountId = dbUser.providerAccountId;
          token.role = dbUser.role;
          token.username = dbUser.username ?? "";
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId ?? "");
        session.user.provider = String(token.provider ?? "");
        session.user.providerAccountId = String(token.providerAccountId ?? "");
        session.user.role = (token.role as "admin" | "standard") ?? "standard";
        session.user.username = String(token.username ?? "");
      }

      return session;
    },
  },
});
