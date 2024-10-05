import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/context/AuthProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-commerce",
  icons: {
    icon: ["/favicon.jpg"],
    apple:["apple-touch-icon.png?v=4"],
    shortcut:["/apple-touch-icon.png"]
  },
  description: "This is e-commerce practice web-side",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.className}>
          <Toaster />
          <Navbar />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
