import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { connectDB } from "@/lib/db/mongodb";
import { User } from "@/lib/models/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [GitHub],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || account.provider !== "github") return false;
      if (!profile) return false;

      await connectDB();

      const githubProfile = profile as {
        id: number;
        login?: string;
        name?: string;
        email?: string;
        avatar_url?: string;
      };

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

    async jwt({ token, account, profile }) {
      await connectDB();

      const githubId =
        account?.provider === "github" && profile
          ? String((profile as { id: number }).id)
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
