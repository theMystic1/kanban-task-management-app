import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: ["profile", "email"],
    }),
  ],
  callbacks: {
    async signIn(user, account, profile, session, token) {
      return {
        ...session,
        user,
      };
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
});
