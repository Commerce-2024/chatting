import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // X 나중에 할거
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
    }),
    // X 나중에 할거
    CredentialsProvider({
      session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60, // 30 days in seconds
      },
      name: "Credentials",
      credentials: {
        loginId: { label: "Login ID", type: "text", placeholder: "ID" },
        loginPassword: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { loginId, loginPassword } = credentials;

        const user = await prisma.tbl_user.findUnique({
          where: { user_id: loginId },
        });

        if (!user) {
          throw new Error("존재하지 않는 사용자입니다.");
        }

        const isMatch = await bcrypt.compare(loginPassword, user.user_password);
        if (!isMatch) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }

        return {
          id: user.user_id,
          name: user.user_name,
          birth: user.user_birth,
        };
        //로그인 정보
      },
    }),
  ],
  pages: {
    signIn: "/user/login",
    //로그인 하는 파일위치
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.birth = user.birth;
      }
      return token;
    },
    async session({ session, token }) {
      const user = await prisma.tbl_user.findUnique({
        where: { user_id: token.id },
      });

      if (user) {
        session.user.id = user.user_id;
        session.user.name = user.user_name;
        session.user.birth = user.user_birth;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
