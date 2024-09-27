// Example: /api/product_fetching/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/model/Product';  // Adjust the import as needed

// Mark this API route as non-static
export const dynamic = 'force-dynamic';  // This ensures the route isn't statically rendered

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // Extract query parameters from the URL
    const url = new URL(req.url);
    const productId = url.searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
