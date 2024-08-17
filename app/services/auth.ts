import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { User, Session, Account, Profile, NextAuthResult } from "next-auth";
import { createUser, getUser, getUserById } from "./supabase/actions";
import { cookies } from "next/headers";

type NextAuthOptions = {
  providers: any[];
  callbacks: {
    authorized: (params: { auth: any; request: any }) => boolean;
    signIn: (params: {
      user: User;
      account: Account | null;
      profile?: Profile;
    }) => Promise<boolean>;
    // session: (params: { session: Session; user: User }) => Promise<Session>;
  };
  pages: {
    signIn: string;
  };
};

const authConfig: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      try {
        const userObJ = {
          user_id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
        const existingGuest = await getUser(user.email);
        if (!existingGuest) {
          await createUser(userObJ);
        }

        const cookie = cookies();
        cookie.set("curuser", user.email ?? "", {
          httpOnly: true,
          path: "/",
        });

        return true;
      } catch (error) {
        console.error("SignIn Error:", error);

        return false;
      }
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
