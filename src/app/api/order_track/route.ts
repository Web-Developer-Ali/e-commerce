import UserModel, { ICardProduct } from "@/model/User";
import dbConnection from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";


/**
 * Handles the POST request to add a product to the user's cart.
 * 
 * @param req - The request object containing product details.
 * @returns A JSON response indicating the result of the operation.
 */
export async function POST(req: Request) {
  try {
    // Connect to the database
    await dbConnection();

    // Get the current user's session
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user._id;
    const body = await req.json();
    const { product } = body;
    // Validate the presence of product details
    if (!product) {
      return NextResponse.json(
        { message: "Product details are required" },
        { status: 400 }
      );
    }

    const { productId, name, pic, price, size, color } = product;
    // Ensure all required product details are provided
    if (!productId || !name || !pic || price === undefined || price === null) {
      return NextResponse.json(
        { message: "Incomplete product details" },
        { status: 401 }
      );
    }

    // Validate that the price is a number
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      return NextResponse.json(
        { message: "Invalid price value" },
        { status: 402 }
      );
    }

    // Create a new product object
    const newProduct: ICardProduct = { productId, name, pic, price: numericPrice, size, color };

    // Fetch the user from the database
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Ensure cardProducts is an array
    if (!Array.isArray(user.cardProducts)) {
      user.cardProducts = [];
    }

    // Check if the product is already in the cart using the productId
    const productExists = user.cardProducts.some(
      (product) => product.productId === productId
    );
    if (productExists) {
      return NextResponse.json({ message: "This product is already in the cart" }, { status: 400 });
    }

    // Add the new product to the user's cart
    user.cardProducts.push(newProduct);
    await user.save();

    // Respond with a success message and the updated cart
    return NextResponse.json(
      {
        message: "Product added to cart successfully"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handles the GET request to retrieve the user's cart and suggested products.
 * 
 * @param req - The request object.
 * @returns A JSON response with the user's cart and suggested products.
 */
export async function GET(req: Request) {
  try {
    // Connect to the database
    await dbConnection();

    // Get the current user's session
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
console.log(session)
    const userId = session.user._id;

    // Fetch the user from the database
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Respond with the user's cart and suggested products
    return NextResponse.json(
      {
        cart: user.cardProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving cart and suggested products:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


/**
 * Handles the DELETE request to remove a product from the user's cart.
 * 
 * @param req - The request object.
 * @returns A JSON response indicating success or failure.
 */
export async function DELETE(req: Request) {
  try {
    // Connect to the database
    await dbConnection();

    // Get the current user's session
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user._id;

    // Extract product ID from query parameters
    const url = new URL(req.url);
    const productId = url.searchParams.get('productId');
    if (!productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    // Fetch the user from the database
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Remove the product from the user's cart
    user.cardProducts = user.cardProducts.filter(product => product.productId !== productId);
    await user.save();

    return NextResponse.json({ message: "Product removed from cart" }, { status: 200 });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}