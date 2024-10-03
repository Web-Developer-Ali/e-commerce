import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/:path*"], // Matches every route on the website
};

export async function middleware(request: NextRequest) {
  const secret = process.env.NAXTAUTH_SECRET;
  // Remove the encryption property here
  const token = await getToken({ req: request, secret });
  const url = request.nextUrl;

  // If the user is authenticated and tries to access login or sign-up pages, redirect to the dashboard
  if (
    token !== null &&
    (url.pathname.startsWith("/sign-in") || url.pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  } else if (
    token !== null &&
    token.role === "Seller" &&
    url.pathname.startsWith("/admin/seller_registration_form")
  ) {
    return NextResponse.redirect(new URL("/admin/adminHomePage", request.url));
  } else if (
    token !== null &&
    token.role === "User" &&
    url.pathname.startsWith("/admin/adminHomePage")
  ) {
    return NextResponse.redirect(
      new URL("/admin/seller_registration_form", request.url)
    );
  }

  // If the user is not authenticated and tries to access a protected page, redirect to sign-in
  if (
    !token &&
    (url.pathname.startsWith("/account") ||
      url.pathname.startsWith("/addtocard") ||
      url.pathname.startsWith("/wishlist"))
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Check if the user is trying to access `/change_user_password`
  if (url.pathname.startsWith("/change_user_password")) {
    if (token && token.otpVerified) {
      // Allow access if OTP is verified without redirection
      return NextResponse.next(); // Allow access to the page
    } else {
      // Redirect to /account if OTP is not verified
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return NextResponse.next();
}
