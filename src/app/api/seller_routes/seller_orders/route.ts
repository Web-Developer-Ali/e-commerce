// Example: /api/seller_routes/seller_orders/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { OrderModel } from '@/model/seller';  // Adjust the import as needed
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

// Mark this API route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const sellerId = session?.user?._id;

    if (!sellerId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const orders = await OrderModel.find({ sellerId }).sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
