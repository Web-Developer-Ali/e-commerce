import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnection();
        try {
          const user = await UserModel.findOne({
            $or: [{ email: credentials.email }, { username: credentials.username }],
          });
          // check user is there or not
          if (!user) {
            throw new Error("User not found");
          }
          // check user is verified or not
          if (!user.isVerified) {
            throw new Error("Please verified your account first");
          }
          // Compare user password with data_base password
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user , session , trigger }) {
     
      if (trigger === 'update' && session?.otpVerified) {
        token.otpVerified = session.otpVerified
      }
      // When a user logs in, we can set the token properties
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
        token.otpVerified = user.otpVerified;
      } else {
        // If the user object is not provided, fetch the user from the database
        await dbConnection();
        const dbUser = await UserModel.findById(token._id);
  
        if (dbUser) {
          token.role = dbUser.role; // Update the token role if it has changed in the database
        }
      }
      return token;
    },
  
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.otpVerified = token.otpVerified;
      }
           return session;
    },
  },
  
  pages: {
    signIn: "/auth/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
   secret: process.env.NAXTAUTH_SECRET,
};