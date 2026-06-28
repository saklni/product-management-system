import { DefaultSession } from "next-auth";

/**
 * By default NextAuth's `session.user` only has name/email/image.
 * This app adds `id` and `role` in the jwt/session callbacks (see src/lib/auth.ts),
 * so we extend the types here instead of casting `as any` everywhere it's used.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
