import { NextResponse } from "next/server";
import dbConnection from "@/lib/dbConnect";
import ProductModel, { Product } from "@/model/Product";
import { SellerModel } from "@/model/seller";
import uploadOnCloudinary from "@/lib/cloudinary";
import fs from "fs";
import path from "path";
import os from "os";
import { promisify } from "util";

// Promisify unlink function for async use
const unlinkAsync = promisify(fs.unlink);

// Define temporary directory path for image uploads
const tempDir = path.join(os.tmpdir(), "ecommerce");

// Ensure the temporary directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// POST request handler for creating a new product
export async function POST(request: Request) {
  // Connect to the database
  dbConnection();

  try {
    // Parse form data from the request
    const formData = await request.formData();

    // Extract fields from form data
    const Name = formData.get("Name") as string;
    const AboutProduct = formData.get("AboutProduct") as string;
    const Price = formData.get("Price") as string;
    const Stock = formData.get("Stock") as string;
    const ColorOfProsuctString = formData.get("ColorOfProsuct") as string;
    const SizeOfProductString = formData.get("SizeOfProduct") as string;
    const ProductCategoryString = formData.get("Categories") as string;
    const ProductSubCategoriesString = formData.get("SubCategories") as string;
    const Product_SallerID = formData.get("Product_Saller") as string;
    const ProductDescription = formData.get("ProductDescription") as string;
    const Images = formData.getAll("Product_Images") as File[];

    // Validate required fields
    if (
      !Name ||
      !AboutProduct ||
      isNaN(Number(Price)) ||
      isNaN(Number(Stock)) ||
      !ProductCategoryString ||
      !ProductSubCategoriesString ||
      !Product_SallerID
    ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided and valid." },
        { status: 400 }
      );
    }

    // Ensure at least one image is provided
    if (Images.length < 1) {
      return NextResponse.json(
        { success: false, message: "At least 1 image is required." },
        { status: 400 }
      );
    }

    // Upload images to Cloudinary and collect their URLs and IDs
    const uploadedImages = [];
    for (const image of Images) {
      const buffer = await image.arrayBuffer();
      const bytes = Buffer.from(buffer);

      // Save image to temporary directory
      const tempFilePath = path.join(tempDir, image.name);
      fs.writeFileSync(tempFilePath, bytes);

      // Upload to Cloudinary
      const cloudinaryResponse = await uploadOnCloudinary(tempFilePath, "E-commerce");
      if (cloudinaryResponse) {
        uploadedImages.push({
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        });
      }

      // Remove the temporary file
      await unlinkAsync(tempFilePath);
    }

    // Parse and validate ColorOfProsuct and SizeOfProduct arrays
    let ColorOfProsuct: string[] = [];
    let SizeOfProduct: string[] = [];
    let ProductCategory: string[] = [];
    let ProductSubCategories: string[] = [];

    try {
      // Convert strings to arrays
      ColorOfProsuct = JSON.parse(ColorOfProsuctString);
      SizeOfProduct = JSON.parse(SizeOfProductString);
      ProductCategory = JSON.parse(ProductCategoryString);
      ProductSubCategories = JSON.parse(ProductSubCategoriesString);

      // Validate parsed arrays
      if (
        !Array.isArray(ColorOfProsuct) ||
        !ColorOfProsuct.every((item) => typeof item === "string")
      ) {
        return NextResponse.json({
          success: false,
          message: "Invalid format for ColorOfProsuct.",
        }, { status: 400 });
      }
      if (
        !Array.isArray(SizeOfProduct) ||
        !SizeOfProduct.every((item) => typeof item === "string")
      ) {
        return NextResponse.json({
          success: false,
          message: "Invalid format for SizeOfProduct.",
        }, { status: 400 });
      }
      if (typeof ProductCategory !== "string") {
        return NextResponse.json({
          success: false,
          message: "Invalid format for ProductCategory. It should be a non-empty string.",
        }, { status: 400 });
      }
      if (typeof ProductSubCategories !== "string") {
        return NextResponse.json({
          success: false,
          message: "Invalid format for ProductSubCategories. It should be a non-empty string.",
        }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : "Invalid input format." },
        { status: 400 }
      );
    }

    // Get product seller from seller_Id
    const sellerId = await SellerModel.findOne({ userId: Product_SallerID });
    if (!sellerId) {
      return NextResponse.json(
        { success: false, message: "Seller Not Found" },
        { status: 400 }
      );
    }

    // Create a new product document
    const newProduct: Product = new ProductModel({
      Name,
      AboutProduct,
      Price: Number(Price),
      Stock,
      ColorOfProsuct,
      SizeOfProduct,
      ProductDescription,
      Product_Images: uploadedImages,
      ProductCategories: [
        {
          category: ProductCategory,
          sub_categories: ProductSubCategories,
        },
      ],
      Product_Seller: sellerId._id,
    });

    // Save the new product document to the database
    await newProduct.save();

    return NextResponse.json({
      success: true,
      message: "Product created successfully!",
    });
  } catch (error) {
    // Log error and return a response indicating failure
    console.error("Error creating product:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
