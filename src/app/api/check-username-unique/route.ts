// Example: /api/check-username-unique/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User'; // Adjust the import as needed

// Mark this API route as non-static
export const dynamic = 'force-dynamic'; // This ensures the route isn't statically rendered

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Use the URL object to parse the query parameters
    const url = new URL(req.url);
    const username = url.searchParams.get('username');

    if (!username) {
      return NextResponse.json({ message: 'Username is required' }, { status: 400 });
    }

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return NextResponse.json({
        success: false,
        message: "User name is alrady taken",
      },
      { status: 400 })
    }

    return NextResponse.json( {
        success: true,
        message: "User name is valid",
      },
      { status: 200 });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
