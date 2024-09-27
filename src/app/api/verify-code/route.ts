import dbConnection from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnection();
  try {
    const { username, code } = await request.json();
         const user = await UserModel.findOne({username});
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }
    const isValidCode = user.verifyCode === code;
    const isCodeExpire = new Date(user.expireVerifyCode) > new Date();

    if (isValidCode && isCodeExpire) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "User Successfully Verified",
        },
        { status: 200 }
      );
    } else if(!isCodeExpire){
        return Response.json(
            {
              success: false,
              message: "Verification code Expire.",
            },
            { status: 400 }
          );
    } else {
        return Response.json(
            {
              success: false,
              message: "Incorrect Verification code",
            },
            { status: 400 }
          );
    }

  } catch (error) {
    console.error("Error in verfication:", error);
    return Response.json(
      {
        success: false,
        message: "Error in verfication",
      },
      { status: 500 }
    );
  }
}
