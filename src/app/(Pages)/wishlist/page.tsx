'use client';

import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponce } from '@/types/ApiResponce';
import axios, { AxiosError } from 'axios';
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useSWR from 'swr';

// Define the Product and ProductImage types
interface ProductImage {
  public_id: string;
  url: string;
  _id: string;
}

interface Product {
  _id: string;
  Name: string;
  AboutProduct: string;
  Price: number;
  Stock: number;
  ColorOfProsuct: string[];
  SizeOfProduct: string[];
  ProductDescription: string;
  Product_Images: ProductImage[];
  Product_Seller: string;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const LikedProductsPage = () => {
  const { toast } = useToast(); // Initialize toast
  const router = useRouter(); // Initialize router

  // Fetch wishlist products using SWR
  const { data: products = [], mutate } = useSWR<Product[]>('/api/wishlist_products', fetcher, {
    revalidateOnFocus: false,
  });

  const handleRemove = async (productId: string) => {
    // Optimistically update the UI
    const productToRemove = products.find((product) => product._id === productId);
    mutate(products.filter((product) => product._id !== productId), false);

    try {
      const response = await axios.delete(`/api/wishlist_products?productId=${productId}`);
      toast({
        title: 'Success',
        description: response.data.message,
      });
    } catch (error) {
      // Rollback if API call fails
      mutate(products, false);
      console.error('Error removing product from wishlist:', error);
      const axiosError = error as AxiosError<ApiResponce>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: 'Error',
        description: errorMessage || 'An error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(`/product_page/${productId}`);
  };

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 p-4">
      <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product._id} // Use unique _id as key
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6"
                  >
                    <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                      <div className="flex flex-col items-center md:flex-row">
                        <div
                          className="relative h-32 w-32 cursor-pointer"
                          onClick={() => handleProductClick(product._id)}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            {product.Product_Images.length > 0 ? (
                              <Image
                                className="h-full w-full object-cover rounded"
                                src={product.Product_Images[0].url}
                                alt={product.Name}
                                height={100}
                                width={100}
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-gray-200 rounded">
                                No Image
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:order-3 md:justify-end">
                        <div className="text-end md:order-4 md:w-32">
                          <p className="text-base font-bold text-gray-900 dark:text-white">
                            ${product.Price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                        <a
                          href="#"
                          className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                          onClick={() => handleProductClick(product._id)} // Add onClick handler for redirect
                        >
                          {product.Name}
                        </a>

                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                            onClick={() => handleRemove(product._id)}
                          >
                            <svg
                              className="me-1.5 h-5 w-5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18 17.94 6M18 18 6.06 6"
                              />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Your wishlist is empty.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LikedProductsPage;
