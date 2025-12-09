import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extends the built-in session.user type
   */
  interface User extends DefaultUser {
    accessToken?: string;
    id: string;
    firstName?: string;
    lastName?: string;
    role?: "user" | "admin";
  }

  interface Session extends DefaultSession {
    user?: User;
    error?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  /** Extends the built-in JWT type */
  interface JWT {
    accessToken?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    role?: "user" | "admin";
  }
}
