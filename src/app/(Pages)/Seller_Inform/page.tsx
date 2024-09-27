'use client';
import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const SellerInfoPage: React.FC = () => {
  const { data: session } = useSession();
  
  // Check if session exists and extract the user role
  const userRole = session?.user?.role; // Adjust based on how role is stored in session

  return (
    <div className="mt-8 p-6 max-w-4xl mx-auto dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome to Our Seller Platform!</h1>
      
      <p className="text-lg mb-4">
        We&apos;re excited to have you join our platform as a seller. To get started, follow the steps below:
      </p>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Complete Your Seller Profile</h2>
        <p className="mb-2">
          Make sure to fill out all the necessary details in your profile. This helps us understand your business and allows us to provide better support.
        </p>
        <Link href="/admin/seller_registration_form" className="text-blue-500 hover:underline dark:text-blue-400">
          Complete Profile
        </Link>
      </div>

      {userRole === 'Seller' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Add Your Products</h2>
          <p className="mb-2">
            Start adding your products to our catalog. Make sure to provide accurate descriptions and high-quality images to attract buyers.
          </p>
          <Link href="/admin/addProduct" className="text-blue-500 hover:underline dark:text-blue-400">
            Add Products
          </Link>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Explore Seller Resources</h2>
        <p className="mb-2">
          Check out our resources to learn more about how to optimize your store and drive sales.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">4. Get Support</h2>
        <p className="mb-2">
          If you have any questions or need assistance, our support team is here to help. Don&apos;t hesitate to reach out!
        </p>
      </div>
    </div>
  );
};

export default SellerInfoPage;
