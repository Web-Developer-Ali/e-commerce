import dbConnection from "@/lib/dbConnect";
import ProductModel from "@/model/Product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnection();

    // Fetch 10 random products and calculate avgRating
    const randomProducts = await ProductModel.aggregate([
      { $sample: { size: 8 } },
      {
        $addFields: {
          avgRating: { $avg: "$Rating" }, // Calculate the average of the Rating array
        },
      },
    ]);

    return NextResponse.json(randomProducts);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching random products', error }, { status: 500 });
  }
}
