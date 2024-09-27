"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponce } from "@/types/ApiResponce";
import Image from "next/image";

interface Review {
  id: number;
  UserName: string;
  rating: number;
  Comment: string;
  Rating: number;
}

interface Product {
  id: number;
  Name: string;
  ProductDescription: string;
  price: number;
  discountedPrice?: number;
  imageSrc: string;
  Rating: number;
  stock: number;
  thumbnails: string[];
  ColorOfProsuct: string[];
  SizeOfProduct: string[];
  ProductCategories: Array<{
    category: string;
    sub_categories?: string[];
  }>;
  Product_Images: Array<{
    public_id: string;
    url: string;
  }>;
}

const ProductPage: React.FC = () => {
  // state variable to store api responce 
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [username, setUsername] = useState("");
  const [rating, setRating] = useState<number>(1);
  const [comment, setComment] = useState("");
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [allReviewsVisible, setAllReviewsVisible] = useState(false);
  const params = useParams();
  const { toast } = useToast();
// fatch product from api
  const fetchProduct = useCallback(async () => {
    if (!params) return;

    try {
      const productResponse = await axios.get(
        `/api/product_fetching?id=${params.ProductId}`
      );
      const data = productResponse.data;
      const mappedProduct: Product = {
        id: data._id,
        Name: data.Name,
        ProductDescription: data.ProductDescription,
        price: data.Price,
        discountedPrice: data.discountedPrice || 0,
        imageSrc: data.Product_Images[0].url,
        Rating: 4.5,
        stock: data.Stock,
        thumbnails: data.Product_Images.map((image: any) => image.url),
        ColorOfProsuct: data.ColorOfProsuct,
        SizeOfProduct: data.SizeOfProduct,
        ProductCategories: data.ProductCategories,
        Product_Images: data.Product_Images,
      };

      setProduct(mappedProduct);
      setMainImage(mappedProduct.imageSrc);
      setLoading(false);

      const reviewsResponse = await axios.get(
        `/api/getProduct_reviews?id=${params.ProductId}`
      );
      setReviews(reviewsResponse.data.reviews);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = useCallback(async () => {
    if (!product) return; // Ensure product is available

    // Prepare the product object with necessary fields
    const productData = {
      productId: product.id, 
      name: product.Name, 
      pic: product.imageSrc, 
      price: product.price, 
      size: selectedSize, 
      color: selectedColor,
    };

    try {
      // Send POST request to the API
      const response = await axios.post("/api/order_track", {
        product: productData,
      });

      // Handle response
      console.log("Product added to cart successfully:", response.data);
      toast({
        title: "Product Added",
        description:
          response.data.message || "The product has been added to your cart.",
      });
    } catch (error) {
      // Handle error
      console.error("Error adding product to cart:", error);
      const axiosError = error as AxiosError<ApiResponce>;
      let errorMessage =
        axiosError.response?.data.message ??
        "Failed to add product to wishlist."; // Provide default message
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [product, selectedSize, selectedColor, toast]);
// function to add product to user wishlist
  const handleAddWishlist = useCallback(async () => {
    try {
      if (!product) return; // Ensure product is available

      // Use product.id instead of id
      const response = await axios.post(`/api/wishlist_products`, {
        productId: product.id,
      });
      toast({
        title: "Product Added",
        description:
          response.data.message ||
          "The product has been added to your wishlist.",
      });
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      const axiosError = error as AxiosError<ApiResponce>;
      let errorMessage =
        axiosError.response?.data.message ??
        "Failed to add product to wishlist."; // Provide default message
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [product, toast]);
// function for reviews submitt
  const handleReviewSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (username && comment && rating && product) {
        try {
          const response = await axios.post("/api/getProduct_reviews", {
            UserName: username,
            productId: product.id,
            comment,
            rating,
          });
          console.log(response);
          setReviews((prevReviews) => [
            ...prevReviews,
            {
              id: prevReviews.length + 1,
              UserName: username,
              rating,
              Comment: comment,
              Rating: rating, // Ensure Rating is set, for example, using the same rating value
            },
          ]);

          if (reviews.length + 1 > 3) {
            setAllReviewsVisible(false);
          }

          setUsername("");
          setRating(1);
          setComment("");

          toast({
            title: "Review submitted",
            description: response.data.message,
          });
        } catch (error: any) {
          console.error("Error submitting review:", error.message);
          const axiosError = error as AxiosError<ApiResponce>;
          let errorMessage = axiosError.response?.data.message;
          toast({
            title: "Error",
            description: errorMessage || "An error occurred.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Missing information",
          description: "Please fill in all fields.",
          variant: "destructive",
        });
      }
    },
    [username, comment, rating, product, reviews, toast]
  );
// function show all reviews
  const handleShowMore = useCallback(() => {
    setVisibleReviews((prevVisibleReviews) =>
      allReviewsVisible ? 3 : reviews.length
    );
    setAllReviewsVisible((prevAllReviewsVisible) => !prevAllReviewsVisible);
  }, [allReviewsVisible, reviews.length]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!product) {
    return <div>No product found</div>;
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-8 mb-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row -mx-4">
          <div className="md:flex-1 px-4">
            <div className="relative w-full h-0 pb-[100%] bg-gray-300 dark:bg-gray-700 mb-4 overflow-hidden group">
              {mainImage && (
                <div className="absolute inset-0">
                  <Image
                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                    src={mainImage}
                    alt="Product Image"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                  />
                </div>
              )}
            </div>

            <div className="flex space-x-2 mb-4">
              {product?.thumbnails?.map((thumbnail, index) => (
                <button
                  key={index}
                  className="h-20 w-20 bg-gray-300 dark:bg-gray-700 rounded-lg overflow-hidden focus:outline-none"
                  onClick={() => setMainImage(thumbnail)}
                >
                  <Image
                    className="w-full h-full object-cover"
                    src={thumbnail}
                    alt={`Thumbnail ${index + 1}`}
                    height={80}
                    width={80}
                  />
                </button>
              ))}
            </div>

            <div className="flex -mx-2 mb-4">
              <div className="w-1/2 px-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700"
                >
                  Add to Cart
                </button>
              </div>
              <div className="w-1/2 px-2">
                <button
                  onClick={handleAddWishlist}
                  className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
          <div className="md:flex-1 px-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {product.Name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {product.ProductDescription}
            </p>
            <div className="flex mb-4">
              <div className="mr-4">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Price:
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Availability:
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                Colors
              </h3>
              <div className="flex flex-wrap">
                {product.ColorOfProsuct.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full mx-1 ${
                      selectedColor === color
                        ? "border-2 border-gray-800 dark:border-gray-300"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                Sizes
              </h3>
              <div className="flex flex-wrap">
                {product.SizeOfProduct.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full mx-1 border ${
                      selectedSize === size
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                    }`}
                    aria-label={`Select size ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* reviws */}
      <form onSubmit={handleReviewSubmit} className="m-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
          Leave a Review
        </h3>
        <div className="mb-2">
          <label
            htmlFor="username"
            className="block text-gray-700 dark:text-gray-300"
          >
            Name
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100"
            required
          />
        </div>
        <div className="mb-2">
          <label
            htmlFor="rating"
            className="block text-gray-700 dark:text-gray-300"
          >
            Rating
          </label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100"
            required
          >
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
        <div className="mb-2">
          <label
            htmlFor="comment"
            className="block text-gray-700 dark:text-gray-300"
          >
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 dark:text-gray-100"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700"
        >
          Submit Review
        </button>
      </form>

      <div className="m-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
          Reviews ({reviews.length})
        </h3>
        <ul>
          {reviews.slice(0, visibleReviews).map((review) => (
            <li
              key={review.id}
              className="mb-4 p-4 bg-white dark:bg-gray-900 rounded-md shadow-sm"
            >
              <div className="flex items-center mb-2">
                <span className="font-bold text-gray-800 dark:text-white">
                  {review.UserName}
                </span>
                <span className="ml-2 text-yellow-500">
                  {"★".repeat(review.Rating) + "☆".repeat(5 - review.Rating)}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {review.Comment}
              </p>
            </li>
          ))}
        </ul>
        {reviews.length > 3 && (
          <button
            onClick={handleShowMore}
            className="text-blue-500 hover:underline dark:text-blue-300"
          >
            {allReviewsVisible ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;
