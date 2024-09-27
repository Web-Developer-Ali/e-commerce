import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import mongoose from "mongoose";
import UserModel from "@/model/User";
import dbConnection from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options"; // Adjust the path to your auth options

// Handle GET requests to fetch user's wishlist
export async function GET(req: NextRequest) {
  // Retrieve the session to check if the user is authenticated
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user?._id;

  if (!userId) {
    return NextResponse.json(
      { message: "User ID not found in session" },
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    await dbConnection();
    // Find the user and populate their wishlist products
    const user = await UserModel.findById(userId).populate(
      "whishlist_products"
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return the user's wishlist products
    return NextResponse.json(user.whishlist_products, { status: 200 });
  } catch (error) {
    // Handle errors, distinguishing between known and unknown errors
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Internal server error", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}

// Handle POST requests to add a product to the user's wishlist
export async function POST(req: NextRequest) {
  // Retrieve the session to check if the user is authenticated
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user?._id;
  if (!userId) {
    return NextResponse.json(
      { message: "User ID not found in session" },
      { status: 400 }
    );
  }

  // Extract product ID from the request body
  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json(
      { message: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    await dbConnection();
    // Find the user by ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Convert product ID to MongoDB ObjectId
    const productObjectId = new mongoose.Types.ObjectId(
      productId
    ) as unknown as mongoose.Schema.Types.ObjectId;

    // Check if the product is already in the wishlist
    if (!user.whishlist_products.includes(productObjectId)) {
      // Add the product to the wishlist and save the user
      user.whishlist_products.push(productObjectId);
      await user.save();
      return NextResponse.json(
        { message: "Product added to wishlist" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Product is already in the wishlist" },
      { status: 400 }
    );
  } catch (error) {
    // Handle errors, distinguishing between known and unknown errors
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Internal server error", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}

// Handle DELETE requests to remove a product from the user's wishlist
export async function DELETE(req: NextRequest) {
  // Retrieve the session to check if the user is authenticated
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user?._id;

  if (!userId) {
    return NextResponse.json(
      { message: "User ID not found in session" },
      { status: 400 }
    );
  }

  // Extract product ID from the URL query parameters
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { message: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    // Connect to the database
    await dbConnection();
    // Find the user by ID
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Convert product ID to MongoDB ObjectId
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Remove the product from the wishlist
    user.whishlist_products = user.whishlist_products.filter(
      (id) => id.toString() !== productObjectId.toString()
    );

    // Save the updated user
    await user.save();
    return NextResponse.json(
      { message: "Product removed from wishlist" },
      { status: 200 }
    );
  } catch (error) {
    // Handle errors, distinguishing between known and unknown errors
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Internal server error", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
