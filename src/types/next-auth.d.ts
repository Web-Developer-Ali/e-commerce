import "next-auth";


declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    email?: string;
    username?: string;
    role?:string;
    otpVerified?:boolean
  }
  interface Session {
    user: {
      _id?:string;
      isVerified?: boolean;
      email?: string;
      username?: string;
      otpVerified?:booleans
    } & DefaultSession['user'];
  }
}
