import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponce } from "@/types/ApiResponce";
import StarRating from "./StarRating";
import Image from "next/image";

interface ProductCardProps {
  imageSrc: string;
  title: string;
  price: string;
  rating: number;
  id: string;
  imageWidth: number;  // Added width property
  imageHeight: number; // Added height property
}

function TopProductCard({
  imageSrc,
  title,
  price,
  rating,
  id,
  imageWidth,  // Added width property
  imageHeight, // Added height property
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [responseMessage, setResponseMessage] = useState(""); // State for storing API response message
  const router = useRouter();

  const addProductToWishList = async () => {
    try {
      const response = await axios.post(`/api/wishlist_products`, { productId: id });
      setResponseMessage(response.data.message || "Product added to wishlist!");
      setIsLiked(true);
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      const axiosError = error as AxiosError<ApiResponce>;
      let errorMessage = axiosError.response?.data.message ?? "Failed to add product to wishlist."; // Provide default message
      setResponseMessage(errorMessage);
    }
  };

  const handleImageClick = () => {
    router.push(`/product_page/${id}`);
  };

  return (
    <div className="relative flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700">
      <div
        className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl cursor-pointer"
        onClick={handleImageClick}
      >
        <Image
          loading="lazy"
          className="object-cover w-full h-full"
          src={imageSrc}
          alt="product image"
          width={imageWidth}   // Added width property
          height={imageHeight} // Added height property
        />
      </div>
      <div className="mt-4 px-5 pb-5">
        <div>
          <h5
            className="text-xl font-semibold text-slate-900 dark:text-white overflow-hidden overflow-ellipsis whitespace-nowrap"
            style={{ width: "200px" }}
          >
            {title}
          </h5>
        </div>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{price}</span>
          </p>
          <div className="flex items-center">
            <StarRating rating={rating} />
            <span className="mr-2 ml-3 rounded bg-yellow-200 dark:bg-yellow-300 px-2.5 py-0.5 text-xs font-semibold">
              {rating}
            </span>
          </div>
        </div>
        <button
          onClick={addProductToWishList}
          className={`${
            isLiked ? "text-red-500" : "text-gray-500 dark:text-gray-400"
          } flex items-center justify-center rounded-md bg-slate-900 dark:bg-slate-600 px-10 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 dark:hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-gray-500`}
        >
          {isLiked ? "Liked" : "Like"}
        </button>
        {/* Display the response message if it exists */}
        {responseMessage && (
          <p className="mt-2 text-sm text-green-500 dark:text-green-400">
            {responseMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default TopProductCard;
