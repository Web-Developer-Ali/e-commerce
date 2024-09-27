"use client";
import { ApiResponce } from "@/types/ApiResponce";
import axios, { AxiosError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import StarRating from "@/components/StarRating";
import Image from "next/image";
import { debounce } from "lodash";
type Product = {
  _id: string;
  Name: string;
  Price: number;
  Product_Images: Array<{ url: string }>;
  Product_Seller?: string;
  AboutProduct?: string;
  SizeOfProduct?: string[];
  ColorOfProsuct?: string[];
  Stock?: number;
  ProductCategories?: Array<{ category: string; sub_categories?: string[] }>;
  Rating: [];
  avgRating: number;
  numberOfRatings: number; // Add this field
};

function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [likedProducts, setLikedProducts] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();

  const addProductToWishList = useCallback(
    async (productId: string) => {
      setLikedProducts((prevLikedProducts) => ({
        ...prevLikedProducts,
        [productId]: true,
      }));

      try {
        const response = await axios.post(`/api/wishlist_products`, {
          productId,
        });
        toast({
          title: "Success",
          description: response.data.message,
        });
      } catch (error) {
        console.error("Error adding product to wishlist:", error);
        const axiosError = error as AxiosError<ApiResponce>;
        let errorMessage =
          axiosError.response?.data.message ??
          "Failed to add product to wishlist.";
        toast({
          title: "Error",
          description: errorMessage || "An error occurred.",
          variant: "destructive",
        });
        setLikedProducts((prevLikedProducts) => ({
          ...prevLikedProducts,
          [productId]: false,
        }));
      }
    },
    [toast]
  );

  const handleAddToCard = useCallback(
    (id: string) => {
      router.push(`/product_page/${id}`);
    },
    [router]
  );

  const fetchProductDebounced = useCallback(
    debounce(async (category: string | undefined) => {
      try {
        if (category) {
          const response = await axios.get(
            `/api/products?CategoryTypes=${category}`
          );
          console.log(response);
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }, 500),
    [] // Empty dependency array, since debounce has no external dependencies
  );

  useEffect(() => {
    const category = Array.isArray(params.category)
      ? params.category[0]
      : params.category;
    fetchProductDebounced(category);

    // Cleanup debounce
    return () => {
      fetchProductDebounced.cancel();
    };
  }, [params.category]);
  return (
    <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        {/* Heading & Filters */}
        <div className="mb-4 items-end justify-between space-y-4 sm:flex sm:space-y-0 md:mb-8">
          <div>
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <a
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    <svg
                      className="me-2.5 h-3 w-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    Home
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400 rtl:rotate-180"
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
                        d="m9 5 7 7-7 7"
                      />
                    </svg>
                    <a
                      href="#"
                      className="ms-1 text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white md:ms-2"
                    >
                      Products
                    </a>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400 rtl:rotate-180"
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
                        strokeLinejoin="round" // Corrected property name
                        strokeWidth="2"
                        d="m9 5 7 7-7 7"
                      />
                    </svg>

                    <span className="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ms-2">
                      {params.category}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {/* Filter and Sort buttons */}
            {/* ... */}
          </div>
        </div>
        {/* Products */}
        <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="h-56 w-full">
                <a href="#">
                  <Image
                    className="mx-auto h-full dark:hidden rounded"
                    src={product.Product_Images[0]?.url}
                    alt={product.Name}
                    width={400}
                    height={200}
                  />
                  <Image
                    className="mx-auto hidden h-full dark:block rounded"
                    src={product.Product_Images[0]?.url}
                    alt={product.Name}
                    width={300}
                    height={200}
                  />
                </a>
              </div>

              <div className="pt-6">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="me-2 rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                    {" "}
                    Up to 15% off{" "}
                  </span>

                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => addProductToWishList(product._id)}
                      className={`rounded-lg p-2 ${
                        likedProducts[product._id]
                          ? "text-red-500"
                          : "text-gray-500"
                      } hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                    >
                      <span className="sr-only">Add to favorites</span>
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill={
                          likedProducts[product._id] ? "currentColor" : "none"
                        }
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <a
                  href="#"
                  className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
                >
                  {product.Name.length > 20
                    ? product.Name.substring(0, 20) + "..."
                    : product.Name}
                </a>

                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center">
                    <StarRating rating={product?.avgRating} />
                  </div>

                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {product?.avgRating ? product.avgRating.toFixed(1) : 0}
                  </p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    ({product.Rating.length})
                  </p>
                </div>

                <ul className="mt-2 flex items-center gap-4">
                  <li className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Best Seller
                    </p>
                  </li>

                  <li className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Best Price
                    </p>
                  </li>
                </ul>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white">
                    ${product.Price}
                  </p>

                  <button
                    onClick={() => handleAddToCard(product._id)}
                    type="button"
                    className="inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Page;
