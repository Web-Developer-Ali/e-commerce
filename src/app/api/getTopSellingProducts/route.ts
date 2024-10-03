import { OrderModel } from "@/model/seller"; // Ensure this path is correct
import ProductModel from "@/model/Product"; // Ensure this path is correct
import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/dbConnect"; // Ensure this path is correct

// Top Selling Products (based on quantity sold)
export async function GET(req: NextRequest) {
    try {
        // Initialize the database connection
        await dbConnection();

        // Get top selling products
        const topSellingProducts = await OrderModel.aggregate([
            {
                $group: {
                    _id: "$productId", // Group by product ID
                    totalSold: { $sum: "$quantity" }, // Sum of quantities sold
                },
            },
            {
                $sort: { totalSold: -1 }, // Sort by total sold in descending order
            },
            {
                $limit: 3, // Limit to top 3 products
            },
            {
                $lookup: {
                    from: "products", // The name of your product collection
                    localField: "_id",
                    foreignField: "_id",
                    as: "product", // Rename to "product"
                },
            },
            {
                $unwind: "$product", // Flatten the product array
            },
            {
                $project: {
                    _id: 1,
                    totalSold: 1,
                    "product.Name": 1, // Directly include product fields
                    "product.Price": 1,
                    "product.avgRating": 1,
                    "product.Product_Images": 1,
                },
            },
        ]);

        // Recently Added Products (sorted by creation date)
        const recentlyAddedProducts = await ProductModel.find({})
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .limit(3); // Limit to 3 recently added products

        // Collect IDs of recently added products
        const recentlyAddedIds = recentlyAddedProducts.map(product => product._id);

        // Top Rated Products (excluding recently added products)
        const topRatedProducts = await ProductModel.find({
            _id: { $nin: recentlyAddedIds }, // Exclude recently added products
        })
            .sort({ avgRating: -1 }) // Sort by avgRating in descending order
            .limit(3); // Limit to 3 top-rated products

        // Respond with the product categories
        return NextResponse.json({
            topSellingProducts,
            recentlyAddedProducts,
            topRatedProducts,
        });
    } catch (error) {
        console.error("Error fetching product categories:", error);
        return NextResponse.json({ error: 'Error fetching product categories' }, { status: 500 });
    }
}
