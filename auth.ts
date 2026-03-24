import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db/mongodb";
import { User } from "@/lib/models/user";

const isPreview = process.env.VERCEL_ENV === "preview";

const providers = [
  GitHub,
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

            const previewGithubId = "preview-fisch-user";

            const previewUser = await User.findOneAndUpdate(
              { githubId: previewGithubId },
              {
                githubId: previewGithubId,
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
              githubId: previewUser.githubId,
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

      if (account.provider !== "github") return false;
      if (!profile) return false;

      await connectDB();

      const githubProfile = profile as {
        id?: string | number;
        login?: string;
        name?: string;
        email?: string;
        avatar_url?: string;
      };

      if (!githubProfile.id) {
        return false;
      }

      await User.findOneAndUpdate(
        { githubId: String(githubProfile.id) },
        {
          githubId: String(githubProfile.id),
          username: githubProfile.login ?? "",
          name: user.name ?? githubProfile.name ?? "",
          email: user.email ?? githubProfile.email ?? "",
          image: user.image ?? githubProfile.avatar_url ?? "",
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
        token.githubId =
          "githubId" in user && typeof user.githubId === "string"
            ? user.githubId
            : "preview-fisch-user";
        token.role =
          "role" in user && user.role === "admin" ? "admin" : "standard";
        token.username =
          "username" in user && typeof user.username === "string"
            ? user.username
            : "fisch";

        return token;
      }

      const githubId =
        account?.provider === "github" && profile
          ? String((profile as { id: string | number }).id)
          : token.githubId;

      if (githubId) {
        const dbUser = await User.findOne({ githubId }).lean();

        if (dbUser) {
          token.userId = dbUser._id.toString();
          token.githubId = dbUser.githubId;
          token.role = dbUser.role;
          token.username = dbUser.username ?? "";
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId ?? "");
        session.user.githubId = String(token.githubId ?? "");
        session.user.role = (token.role as "admin" | "standard") ?? "standard";
        session.user.username = String(token.username ?? "");
      }

      return session;
    },
  },
});
