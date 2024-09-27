// src/app/api/seller_routes/inventry.ts
import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/model/Product";
import mongoose from "mongoose";
import { SellerModel } from "@/model/seller";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    // Find the seller by userId
    const seller = await SellerModel.findOne({ userId });

    if (!seller) {
      return NextResponse.json({ message: "Seller not found" }, { status: 404 });
    }

    // Get all products of seller 
    const products = await ProductModel.find({ Product_Seller: seller._id });

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, stockQuantity, price } = await req.json();

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    // Update the product's stock quantity and price
    const product = await ProductModel.findByIdAndUpdate(
      id,
      { Stock: stockQuantity, Price: price },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    // Delete the product
    const result = await ProductModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
