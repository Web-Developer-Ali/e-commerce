import dbConnection from "@/lib/dbConnect"; 
import UserModel from "@/model/User";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request): Promise<Response> {
  await dbConnection();
  try {
    const { username, email, password } = await request.json();

    // Check if username is already taken
    const existingUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserByUsername) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username already taken! Please use another username.",
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "User with this email already exists.",
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.expireVerifyCode = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 10);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        expireVerifyCode: expireTime,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, verifyCode, username);
    const emailResponseData = await emailResponse.json();
    if (!emailResponseData.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: emailResponseData.message,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send response to user
    return new Response(
      JSON.stringify({
        success: true,
        message: "User registered successfully. Please verify your email.",
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.log("Error registering User:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error registering user.",
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
