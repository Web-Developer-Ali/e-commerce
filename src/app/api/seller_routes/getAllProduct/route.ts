// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import dbConnection from '@/lib/dbConnect';
import ProductModel from '@/model/Product';

export async function GET() {
  await dbConnection();

  try {
    const products = await ProductModel.find({}); // Fetch all products
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}
