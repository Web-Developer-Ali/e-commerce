import { NextResponse, NextRequest } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import { OrderModel, SellerModel } from '@/model/seller';
import ProductModel from '@/model/Product';

export async function POST(req: NextRequest) {
  try {
    // Extract userId from the request body
    const { userId } = await req.json();
    // Connect to the database
    await dbConnect();

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid userId' }, { status: 400 });
    }

    // Find the seller by userId
    const seller = await SellerModel.findOne({ userId });

    if (!seller) {
      return NextResponse.json({ message: 'Seller not found' }, { status: 404 });
    }

    // Explicitly type the seller._id as mongoose.Types.ObjectId
    const sellerObjectId = seller._id as mongoose.Types.ObjectId;

    // Calculate the total sales, total orders, and inventory count for the seller
    const [totalSales, totalOrders, inventoryCount] = await Promise.all([
      OrderModel.aggregate([
        { $match: { sellerId: sellerObjectId, status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      OrderModel.countDocuments({ sellerId: sellerObjectId }),
      ProductModel.countDocuments({ Product_Seller: sellerObjectId })
    ]);

    const total = totalSales.length > 0 ? totalSales[0].total : 0;
    const totalOrderCount = totalOrders || 0;

    // Update the seller's total_sales, total_orders, and inventory_count
    await SellerModel.findByIdAndUpdate(sellerObjectId, {
      total_sales: total.toString(), // Store as string if required by your schema
      total_orders: totalOrderCount.toString(), // Assuming you want to store as string
      inventory_count: inventoryCount.toString(), // Assuming you want to store as string
    });

    return NextResponse.json({
      message: 'Total sales, orders, and inventory updated', 
      total, 
      totalOrderCount,
      inventoryCount
    });
  } catch (error) {
    console.error('Error updating total sales, orders, and inventory:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
