import dbConnection from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { SellerModel } from "@/model/seller";
import { OrderModel } from "@/model/seller";
import UserModel from "@/model/User";
import ProductModel from "@/model/Product";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await dbConnection();

    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { products } = body;
    // Extract productIds using map
    const productIds = products.map((product: { productId: string }) => product.productId);
    const userId = session.user._id;
    const getsellerIdfromProduct = await ProductModel.findById( productIds );
    if (!getsellerIdfromProduct) {
      return NextResponse.json(
        { message: "Seller not found" },
        { status: 404 }
      );
    }

    const sellerId = getsellerIdfromProduct.Product_Seller;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { message: "No products provided" },
        { status: 400 }
      );
    }

    const createdOrders = [];

    for (const product of products) {
      const { productId, price, quantity } = product; // Ensure productId is sent

      // Validate required fields
      if (!productId || price === undefined || quantity === undefined) {
        return NextResponse.json(
          { message: "Missing productId, price, or quantity for a product" },
          { status: 400 }
        );
      }

      // Check if order already exists using productId
      const existingOrder = await OrderModel.findOne({ userId, productId });
      if (existingOrder) {
        // Get the product name for the response
        const existingProduct = await ProductModel.findById(productId);
        if (existingProduct) {
          return NextResponse.json(
            {
              message: `Order for product "${existingProduct?.Name}" already exists`,
            },
            { status: 400 }
          );
        }
      }

      // Create new order
      const newOrder = await OrderModel.create({
        userId,
        sellerId,
        productId,
        totalAmount: price,
        status: "Pending",
        paymentClear: false,
        quantity,
        createdAt: new Date(),
      });

      createdOrders.push(newOrder);
    }

    return NextResponse.json({ orders: createdOrders }, { status: 201 });
  } catch (error) {
    console.error("Error creating orders:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// handle update orders after payment
export async function PUT(req: NextRequest) {
  try {
    // Establish database connection
    await dbConnection();

    // Parse the request body
    const { paymentClear, orderIdsArray } = await req.json();
    const session = await getServerSession(authOptions);
    const userId = session?.user._id;
    // Check if both paymentClear and orderIdsArray are present
    if (
      typeof paymentClear === "boolean" &&
      Array.isArray(orderIdsArray) &&
      orderIdsArray.length > 0
    ) {
      // Update the orders matching the IDs in orderIdsArray
      const updatedOrders = await OrderModel.updateMany(
        { _id: { $in: orderIdsArray } }, // Find orders by their IDs
        { paymentClear: paymentClear } // Set paymentClear to the provided value (true or false)
      );
      // Check if any documents were modified
      if (updatedOrders.modifiedCount > 0) {
        // Remove products from the user's cart if payment is confirmed
        if (paymentClear) {
          // Find the orders that were updated to get the product IDs
          const orders = await OrderModel.find({
            _id: { $in: orderIdsArray },
            paymentClear: true,
          });

          // Extract product IDs from the updated orders
          const productIdsToRemove = orders.map((order) => order.productId); // Adjust field name as needed

          await UserModel.updateOne(
            { _id: userId }, // Find the user by their ID
            {
              $pull: {
                cardProducts: { productId: { $in: productIdsToRemove } },
              },
            } // Remove products from the cart
          );
        }

        // Respond with success if the orders were updated
        return NextResponse.json(
          { message: "Orders updated successfully", updatedOrders },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            message:
              "No orders were updated; check the order IDs or paymentClear value",
          },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating orders:", error);
    return NextResponse.json(
      { message: "Error updating orders" },
      { status: 500 }
    );
  }
}

// get order for user
export async function GET(req: NextRequest) {
  try {
    await dbConnection();

    // Get the current user's session
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user._id;
    // Fetch the seller associated with the userId
    const getUserOrders = await OrderModel.find({ userId });
    if (!getUserOrders) {
      return NextResponse.json(
        { message: "You have no order yet" },
        { status: 201 }
      );
    }

    // Respond with the created order
    return NextResponse.json({ orders: getUserOrders }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// handle delete order

export async function DELETE(req: Request) {
  console.log("Received DELETE request");
  try {
    await dbConnection();

    // Get the current user's session
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user._id;
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId"); // Assuming you're passing orderId instead of productId
    console.log(orderId);
    // Check if the orderId is provided
    if (!orderId) {
      return NextResponse.json(
        { message: "Order ID is required" },
        { status: 400 }
      );
    }

    console.log("User ID:", userId);
    console.log("Order ID:", orderId);

    // Convert userId and orderId to ObjectId if necessary
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    const orderIdObjectId = new mongoose.Types.ObjectId(orderId);

    // Find and delete the order that matches both userId and orderId
    const order = await OrderModel.findOneAndDelete({
      userId: userIdObjectId, // Confirming the userId matches the order's userId
      _id: orderIdObjectId, // Confirming the orderId matches the order's ID
    });

    // Check if the order was found and deleted
    if (!order) {
      return NextResponse.json(
        {
          message:
            "Order not found or you are not authorized to delete this order",
        },
        { status: 404 }
      );
    }

    // If successful, return a success response
    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during deletion:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
