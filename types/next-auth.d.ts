import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      provider: string;
      providerAccountId: string;
      role: "admin" | "standard";
      username?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    provider: string;
    providerAccountId: string;
    role: "admin" | "standard";
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    provider?: string;
    providerAccountId?: string;
    role?: "admin" | "standard";
    username?: string;
  }
}
