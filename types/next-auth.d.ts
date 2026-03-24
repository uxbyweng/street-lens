import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      githubId: string;
      role: "admin" | "standard";
      username?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    githubId?: string;
    role?: "admin" | "standard";
    username?: string;
  }
}
