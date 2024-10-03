"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast"; // Import useToast from shadcn/toast
import { ApiResponce } from "@/types/ApiResponce";

const SellerRegistrationForm: React.FC = () => {
  // State variables for form inputs and messages
  const [shopName, setShopName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [shippingType, setShippingType] = useState<string>("Standard");
  const [shopNameMessage, setShopNameMessage] = useState("");
  const [isCheckingShopname, setIsCheckingShopname] = useState(false);
  // Router for navigation
  const router = useRouter();
  const { toast } = useToast(); // Use the toast hook from shadcn/toast

  // Debounce hook to delay checking shop name uniqueness
  const debounced = useDebounceCallback(setShopName, 1000);

  // Effect to check shop name uniqueness with debounce
  useEffect(() => {
    const checkShopNameUnique = async () => {
      if (shopName) {
        setIsCheckingShopname(true);
        setShopNameMessage("");
        try {
          const response = await axios.get(
            `/api/seller_routes/check-shopname-unique?shopName=${shopName}`
          );
          setShopNameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponce>;
          setShopNameMessage(
            axiosError.response?.data.message ??
              "Error in checking shop name uniqueness"
          );
        } finally {
          setIsCheckingShopname(false);
        }
      }
    };

    checkShopNameUnique();
  }, [shopName]);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/auth/register-seller", {
        shopName,
        address,
        countryCode,
        phoneNumber,
        shippingType,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });

      // Redirect to admin home page upon successful registration
      router.push("/admin/adminHomePage");
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponce>;
      let errorMessage =
        axiosError.response?.data.message || "Something went wrong";

      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive", // Variant for error
      });
    }
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-800 bg-white">
      <h2 className="text-2xl font-bold mb-4 dark:text-white text-black">
        Register as a Seller
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display error and success messages */}
        {shopNameMessage && (
          <p
            className={`text-sm ${
              shopNameMessage === "Shop name is valid"
                ? "text-green-500"
                : "text-red-500"
            } mt-1`}
          >
            {shopNameMessage}
          </p>
        )}

        {/* Shop Name Input */}
        <div>
          <label htmlFor="shopName" className="block mb-1 dark:text-white">
            Shop Name
          </label>
          <input
            type="text"
            id="shopName"
            value={shopName}
            onChange={(e) => {
              setShopName(e.target.value);
              debounced(e.target.value);
            }}
            className="border p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Address Input */}
        <div>
          <label htmlFor="address" className="block mb-1 dark:text-white">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Country Code Input */}
        <div>
          <label htmlFor="countryCode" className="block mb-1 dark:text-white">
            Country Code
          </label>
          <input
            type="text"
            id="countryCode"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="border p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Phone Number Input */}
        <div>
          <label htmlFor="phoneNumber" className="block mb-1 dark:text-white">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Shipping Type Select */}
        <div>
          <label htmlFor="shippingType" className="block mb-1 dark:text-white">
            Shipping Type
          </label>
          <select
            id="shippingType"
            value={shippingType}
            onChange={(e) => setShippingType(e.target.value)}
            className="border p-2 w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="Standard">Standard</option>
            <option value="Express">Express</option>
            <option value="NextDay">Next Day</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Register as Seller
        </button>
      </form>
    </div>
  );
};

export default SellerRegistrationForm;
