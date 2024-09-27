"use client";
import Footer from "@/components/Footer";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import nprogress from "nprogress"; // Import nprogress
import "nprogress/nprogress.css"; // Import nprogress styles

interface Product {
  _id: string;
  productId: string;
  name: string;
  price: number;
  color: string | null;
  size: string | null;
  pic: string;
  quantity: number;
}

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = debounce(async () => {
      try {
        setLoading(true);
        nprogress.start(); // Start the progress bar
        const response = await axios.get("/api/order_track");
        setProducts(
          response.data.cart.map((item: Product) => ({
            ...item,
            quantity: 1,
          }))
        );
      } catch (error) {
        setError("Error fetching products.");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
        nprogress.done(); // Complete the progress bar
      }
    }, 300);

    fetchProducts();

    return () => {
      fetchProducts.cancel();
    };
  }, []);

  const handleRemoveCard = async (productId: string) => {
    try {
      nprogress.start(); // Start the progress bar
      await axios.delete(`/api/order_track?productId=${productId}`);
      setProducts(
        products.filter((product) => product.productId !== productId)
      );
    } catch (error) {
      setError("Error removing product.");
      console.error("Error removing product:", error);
    } finally {
      nprogress.done(); // Complete the progress bar
    }
  };

  const handleQuantityChange = (productId: string, change: number) => {
    setProducts(
      products.map((product) =>
        product.productId === productId
          ? { ...product, quantity: Math.max(1, product.quantity + change) }
          : product
      )
    );
  };

  const ProductPrice = useMemo(
    () =>
      products.reduce((sum, product) => {
        const discountedPrice = Math.max(product.price - 2, 0);
        return sum + discountedPrice * product.quantity;
      }, 0),
    [products]
  );

  const TotalSavings = useMemo(
    () =>
      products.reduce((sum, product) => {
        const originalPrice = product.price * product.quantity;
        const discountedPrice =
          Math.max(product.price - 2, 0) * product.quantity;
        return sum + (originalPrice - discountedPrice);
      }, 0),
    [products]
  );

  const Tax = 2;
  const TotalPrice = ProductPrice + Tax;

  const handleCheckout = async () => {
    if (products.length > 0) {
      try {
        nprogress.start(); // Start the progress bar
        const response = await axios.post("/api/handle_order", { products });

        // Extract the array of orders from the response
        const orders = response.data.orders;

        // Collect all the order IDs
        const orderIds = orders.map((order: any) => order._id);

        // Convert the orderIds array into a comma-separated string
        const orderIdsString = orderIds.join(",");

        // Redirect to the payment form with orderIds as a query parameter
        router.push(`/payment_form?orderIds=${orderIdsString}`);
      } catch (error) {
        console.error(error);
        const axiosError = error as AxiosError<{ message: string }>;
        let errorMessage =
          axiosError.response?.data?.message || "Failed to place the order.";

        toast({
          title: "Failed to place order",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        nprogress.done(); // Complete the progress bar
      }
    } else {
      toast({
        title: "Failed to place order",
        description: "Add product in your card then check-out",
        variant: "destructive",
      });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            Shopping Cart
          </h2>
          <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
              <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                  <div className="space-y-6">
                    {products.map((product) => (
                      <div
                        key={product._id}
                        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6"
                      >
                        <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                          <a href="#" className="shrink-0 md:order-1">
                            <Image
                              className="h-20 w-20 rounded"
                              src={product.pic}
                              alt={product.name}
                              height={100}
                              width={100}
                            />
                          </a>

                          <label htmlFor="counter-input" className="sr-only">
                            Choose quantity:
                          </label>
                          <div className="flex items-center justify-between md:order-3 md:justify-end">
                            <div className="flex items-center">
                              <button
                                type="button"
                                id={`decrement-button-${product._id}`}
                                onClick={() =>
                                  handleQuantityChange(product.productId, -1)
                                }
                                data-input-counter-decrement="counter-input-2"
                                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                              >
                                <svg
                                  className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 18 2"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M1 1h16"
                                  />
                                </svg>
                              </button>
                              <input
                                type="text"
                                id={`counter-input-${product._id}`}
                                data-input-counter
                                className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                                placeholder=""
                                value={product.quantity}
                                readOnly
                              />
                              <button
                                type="button"
                                id={`increment-button-${product._id}`}
                                onClick={() =>
                                  handleQuantityChange(product.productId, 1)
                                }

                                data-input-counter-increment="counter-input-2"
                                className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                              >
                                <svg
                                  className="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 18 18"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 1v16M1 9h16"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="text-end md:order-4 md:w-32">
                              <p className="text-base font-bold text-gray-900 dark:text-white">
                              ${Math.max(product.price - 2, 0).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                            <a
                              href="#"
                              className="text-base font-medium text-gray-900 hover:underline dark:text-white"
                            >
                             {product.name}
                            </a>

                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
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
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                                  />
                                </svg>
                                Add to Favorites
                              </button>

                              <button
                                type="button"
                                onClick={() => handleRemoveCard(product.productId)}
                                className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
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
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18 17.94 6M18 18 6.06 6"
                                  />
                                </svg>
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
                      <div className="space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Subtotal
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            ${ProductPrice.toFixed(2)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Tax
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            ${Tax.toFixed(2)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Total Savings
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            ${TotalSavings.toFixed(2)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Total
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            ${TotalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-center">
                        <button
                          type="button"
                          onClick={handleCheckout}
                          className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Page;
