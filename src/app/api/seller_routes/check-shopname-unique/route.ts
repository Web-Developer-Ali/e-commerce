import { NextRequest, NextResponse } from 'next/server';
import dbConnection from '@/lib/dbConnect'; // Ensure this path is correct
import { SellerModel } from '@/model/seller'; // Ensure this path is correct

export async function GET(req: NextRequest) {
  await dbConnection();

  const { searchParams } = new URL(req.url);
  const shopName = searchParams.get('shopName');
  console.log(shopName)
  if (!shopName) {
    return NextResponse.json({ message: 'Shop name is required' }, { status: 400 });
  }

  try {
    // Check if a seller with the given shopName exists
    const seller = await SellerModel.findOne({ shopName });
    if (seller) {
      return NextResponse.json({ message: 'Shop name is already taken' }, { status: 409 });
    }

    return NextResponse.json({ message: 'Shop name is valid' });
  } catch (error) {
    console.error('Error checking shop name uniqueness:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
