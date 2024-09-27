import dbConnection from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import bcrypt from 'bcrypt';
export async function DELETE(req: Request) {
  try {
    await dbConnection();

    // Get the current user's session
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user._id;

    // Delete the user from the database
    const deleteUser = await UserModel.findByIdAndDelete(userId);

    if (!deleteUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Clear NextAuth session cookie
    const response = NextResponse.json({ message: "User account deleted successfully" }, { status: 200 });
    
    // Set the cookies to expire to effectively sign out the user
    response.cookies.set("next-auth.session-token", "", { maxAge: -1 });
    response.cookies.set("next-auth.callback-url", "", { maxAge: -1 });

    return response;

  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


// Function to change user password
export async function GET(req: Request) {
  try {
    await dbConnection(); // Await the database connection

    const session = await getServerSession(authOptions);
    // Check if the user is authenticated
    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user._id;
    const userEmail = session.user.email;
    const username = session.user.username;
console.log(userId)
    // Generate a new verification code and reset code expire time
    const ChangeUserVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 10);
    // Send verification email
    const emailResponse = await sendVerificationEmail(userEmail, ChangeUserVerificationCode, username);

    // Check if the email sending was successful
    const emailResponseData = await emailResponse.json();
    console.log(emailResponseData)
    if (!emailResponseData.success) {
      return NextResponse.json({ message: emailResponseData.message }, { status: 500 });
    }

    // Update the user's verification code in the database
    const user = await UserModel.findByIdAndUpdate(userId, {
      $set: {
        verifyCode: ChangeUserVerificationCode,
        expireVerifyCode: expireTime, // Set the new expiration time
        otpVerified:true
      },
    });
console.log(user)
    if (!user) {
      return NextResponse.json({ message: "Something went wrong" }, { status: 404 });
    }

    // Return a success response
    return NextResponse.json({ message: "Success" }, { status: 201 });

  } catch (error) {
    console.error("Error updating verification code:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


// Handle user password change
export async function PUT(req: Request) {
  try {
    // Establish database connection
    dbConnection();

    // Extract the current password, new password, and confirm password from the request body
    const { currentPassword, password, confirmPassword } = await req.json();

    // Get the session to verify if the user is authenticated
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get the user's ID from the session
    const userId = session.user._id;

    // Find the user in the database by their ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    // Compare the current password with the stored password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      // Return an error if the current password does not match
      return NextResponse.json({ message: "Entered wrong current password" }, { status: 400 });
    }

    // Check if the new password and confirm password match
    const checkPasswordAndConfirmPassword = password === confirmPassword;
    if (!checkPasswordAndConfirmPassword) {
      // Return an error if the new password and confirm password do not match
      return NextResponse.json({ message: "Password and confirm password are not the same" }, { status: 400 });
    }

    // Hash the new password using bcrypt
    const hashedNewPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    user.password = hashedNewPassword;
    user.otpVerified = false;

    await user.save(); // Save the updated user information

    // Return a success response indicating the password has been changed
    return NextResponse.json({ message: "Password changed successfully!" }, { status: 200 });

  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error changing password:", error);
    // Return a generic error response
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
