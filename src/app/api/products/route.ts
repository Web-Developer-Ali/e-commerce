import { NextRequest, NextResponse } from 'next/server';
import dbConnection from '@/lib/dbConnect';
import ProductModel, { Product } from '@/model/Product';

// Handler for GET requests
export async function GET(req: NextRequest) {
   // Extract product ID from the URL query parameters
   const url = new URL(req.url);
   const category = url.searchParams.get('CategoryTypes');
  try {
    await dbConnection();

    // Define the query object
    const query: any = {};

    if (category) {
      query['ProductCategories.category'] = category;
    }

    // Fetch products based on the category and optional subcategory
    const products: Product[] = await ProductModel.find(query);

    if (!products.length) {
      return NextResponse.json(
        { success: false, message: 'No products found in this category.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
