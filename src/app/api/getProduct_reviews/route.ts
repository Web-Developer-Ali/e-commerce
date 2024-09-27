import mongoose from "mongoose";
import ReviewModel from "@/model/Review";
import dbConnection from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import ProductModel from "@/model/Product";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('id'); // Assuming the parameter is 'id'
  
  if (!productId) {
    return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
  }

  try {
    // Ensure database connection
    await dbConnection();

    // Validate that productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
    }

    // Find reviews by productId
    const reviews = await ReviewModel.find({ Product_id: productId }).exec();

    if (reviews.length === 0) {
      return NextResponse.json({ message: 'No reviews found for this product' }, { status: 404 });
    }

    // Calculate average rating
    const averageRating = 
      reviews.reduce((sum, review) => sum + review.Rating, 0) / reviews.length;

    // Send response with reviews and average rating
    return NextResponse.json({ reviews, averageRating }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ message: 'An error occurred while fetching reviews' }, { status: 500 });
  }
}


export async function POST(req: NextRequest ) {
    const { UserName, productId, comment, rating } = await req.json();

  try {
    // Ensure database connection
    await dbConnection();

    // Validate that productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
    }

    if (!UserName || !productId || !comment || !rating) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Create a new review
    const newReview = new ReviewModel({
      UserName,
      Comment: comment,
      Rating: rating,
      Product_id: productId,
    });

    // Save the review to the database
    const savedReview = await newReview.save();

    // Update the product's Rating array by pushing the new rating
    const updateProductRating = await ProductModel.findByIdAndUpdate(
      productId,
      { $push: { Rating: rating } },  // Use $push to add to the array
      { new: true }  // Return the updated document
    );
    if (!updateProductRating) {
      return NextResponse.json({ message: 'Error occur while updating product Reating'},{ status: 400 });
    }
    return NextResponse.json({ message: 'Review submitted successfully', savedReview },{ status: 201 });

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'An error occurred while creating the review.' },{ status: 500 });
  }
}