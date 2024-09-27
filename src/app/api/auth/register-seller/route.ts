import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/dbConnect";
import { SellerModel } from "@/model/seller";
import UserModel from "@/model/User";
import { getToken } from "next-auth/jwt";

const secret = process.env.NAXTAUTH_SECRET;

export async function POST(req: NextRequest) {
  await dbConnection();

  const token = await getToken({ req, secret });
  if (!token || !token._id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { shopName, address, countryCode, phoneNumber, shippingType } = await req.json();

  if (!shopName || !address || !countryCode || !phoneNumber) {
    return NextResponse.json(
      {
        message: "All fields (shopName, address, countryCode, phoneNumber) are required.",
      },
      { status: 400 }
    );
  }

  try {
    const userId = token._id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.role === "Seller") {
      return NextResponse.json(
        { message: "User is already a seller" },
        { status: 400 }
      );
    }

    const existingSeller = await SellerModel.findOne({
      "phoneNumber.number": phoneNumber,
    });

    if (existingSeller) {
      return NextResponse.json(
        { message: "Phone number already in use" },
        { status: 400 }
      );
    }

    await SellerModel.create({
      userId: userId,
      shopName,
      address,
      phoneNumber: {
        countryCode,
        number: phoneNumber,
      },
      shippingType: shippingType || "Standard",
    });

    // Update the user's role in the database
    await UserModel.findByIdAndUpdate(userId, { role: "Seller" });
    return NextResponse.json({message:"You are successfully regiseter as a seller in our Web-Side"})
  } catch (error) {
    console.error("Error upgrading user to seller:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
