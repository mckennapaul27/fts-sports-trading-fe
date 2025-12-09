import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const res = await fetch(`${apiUrl}/api/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const contentType = res.headers.get("content-type");
          if (
            !res.ok ||
            !contentType ||
            !contentType.includes("application/json")
          ) {
            const textResponse = await res.text();
            console.error("Login response was not valid JSON.", {
              status: res.status,
              statusText: res.statusText,
              body: textResponse,
            });
            throw new Error("Invalid credentials");
          }

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Invalid credentials");
          }

          // Return only essential user info for the session/JWT
          return {
            id: data.user.id || data.user._id,
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            role: data.user.role,
            accessToken: data.token,
          };
        } catch (error) {
          console.error("Login error (auth-helpers):", error); // Keep for debugging if needed
          // Rethrow a generic error to avoid exposing too much detail
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // The `user` object is the one returned from the `authorize` callback
      if (user) {
        return {
          ...token, // Keep existing token properties
          id: user.id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email ?? "", // Ensure email is always a string
          accessToken: user.accessToken,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Here, `token` is the JWT object from the `jwt` callback
      // We want to ensure the `session.user` object gets the necessary fields from the token
      if (session.user) {
        session.user.id = token.id as string; // id should always be present from authorize
        session.user.firstName = token.firstName as string | undefined; // Allow for undefined
        session.user.lastName = token.lastName as string | undefined; // Allow for undefined
        session.user.role = token.role as "user" | "admin" | undefined;
        session.user.email = token.email ?? session.user.email ?? "";
      }
      // Ensure accessToken is consistently passed to the session object itself
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error", // Optional: A page to display authentication errors
  },
  session: {
    strategy: "jwt",
    maxAge: 365 * 24 * 60 * 60 * 1000, // Example: 1 year session
  },
  secret: process.env.NEXTAUTH_SECRET,
};
