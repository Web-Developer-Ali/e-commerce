// Example: /api/seller_routes/seller_orders/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { OrderModel, SellerModel } from '@/model/seller';  // Adjust the import as needed
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

// Mark this API route as dynamic
export const dynamic = 'force-dynamic';

// GET handler for fetching orders
export async function GET(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user._id;

    // Get seller by userId
    const seller = await SellerModel.findOne({ userId });
    if (!seller) {
      return NextResponse.json({ message: 'Seller not found' }, { status: 404 });
    }

    // Get orders for the seller using the seller's ID
    const orders = await OrderModel.find({ sellerId: seller._id }).sort({ createdAt: -1 });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}



export async function PATCH(req: Request, { params }: { params: { orderId: string } }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    // Check if the session exists and user ID is available
    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    
    const { status , orderId } = await req.json(); // Extract status from the request body

    // Find the order by ID and update the status
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }  // Return the updated document
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
