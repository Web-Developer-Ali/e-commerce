"use client";
import Carousel from "@/components/Carousel";
import CategoryCard from "@/components/CategoryCard";
import React, { useEffect, useState } from "react";
import axios from "axios";
import GroceriesPic from "../../../../public/GroseriesPic.png";
import JewelryPic from "../../../../public/JewelryPic.png";
import Health_Beautify from "../../../../public/Health & Beautify.png";
import Kitchen from "../../../../public/Kitchen.png";
import ProductCard from "@/components/ProductCard";
import StickyBar from "@/components/StickyBar";
import TopScallingProductCard from "@/components/TopScallingProductCard";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  Name: string;
  Price: number;
  Product_Images: { public_id: string; url: string }[];
  ProductScaller: string; // Add this if your Product interface includes a scaler
  discountedPrice: number; // Add this if you have discountedPrice in your data
  rating: number; // Add this if you have rating in your data
  AboutProduct: string;
  avgRating: number;
}

function Page() {
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);
  const [category,setCategory] = useState('')
  const router = useRouter();
const gotoCategoryPage = (selectedCategory: string) => {
  // Set the category state and navigate using the selectedCategory directly
  setCategory(selectedCategory);
  router.push(`/category/${selectedCategory}`);
};

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const response = await axios.get("/api/homepage_products");
        setRandomProducts(response.data);
      } catch (error) {
        console.error("Error fetching random products:", error);
      }
    };

    fetchRandomProducts();
  }, []);
  return (
    <div className="dark:bg-gray-900">
      <StickyBar />
      <Carousel />
      <h3 className="mt-4 ml-6 font-bold">FEATURED CATEGORIES</h3>
      <div className="overflow-x-auto whitespace-nowrap hide-scrollbar">
        <div className="flex space-x-2 mt-2">
          <CategoryCard
            imageSrc={GroceriesPic.src}
            altText="Groceries"
            title="Groceries"
            bgColor="bg-green-100"
            linkHref="#"
            imageWidth={256}
            imageHeight={160}
          />
          <CategoryCard
            imageSrc={Health_Beautify.src}
            altText="Beauty & Health"
            title="Beauty & Health"
            bgColor="bg-yellow-100"
            linkHref="#"
            imageWidth={256}
            imageHeight={160}
          />
          <CategoryCard
            imageSrc={Kitchen.src}
            altText="Home & Kitchen"
            title="Home & Kitchen"
            bgColor="bg-orange-100"
            linkHref="#"
            imageWidth={256}
            imageHeight={160}
          />
          <CategoryCard
            imageSrc={JewelryPic.src}
            altText="Jewellery"
            title="Jewellery"
            bgColor="bg-pink-100"
            linkHref="#"
            imageWidth={256}
            imageHeight={160}
          />
        </div>
      </div>
      {/* Popular Products */}
      <div className="overflow-x-auto whitespace-nowrap p-2 hide-scrollbar mt-4">
        <div className="flex space-x-8 ml-6">
          <h1 className="font-bold">Popular Products</h1>
          <h4 onClick={() => gotoCategoryPage('Electronics')} className="ml-12 cursor-pointer hover:text-green-500">
  Electronics
</h4>
<h4 onClick={() => gotoCategoryPage("Fashion")} className="cursor-pointer hover:text-green-500">
  Fashion
</h4>
<h4 onClick={() => gotoCategoryPage("Home")} className="cursor-pointer hover:text-green-500">
  Home
</h4>
<h4 onClick={() => gotoCategoryPage("Beauty")} className="cursor-pointer hover:text-green-500">
  Beauty
</h4>
<h4 onClick={() => gotoCategoryPage("Sports")} className="cursor-pointer hover:text-green-500">
  Sports
</h4>

        </div>
      </div>

      <div className="m-4">
        {/* For small screens */}
        <div className="overflow-x-auto whitespace-nowrap p-2 hide-scrollbar md:hidden">
          <div className="flex space-x-6">
            {randomProducts.map((product) => (
              <div key={product._id} className="min-w-max">
                <ProductCard
                  id={product._id}
                  imageSrc={product.Product_Images[0]?.url || GroceriesPic.src}
                  title={product.Name}
                  price={`$${product.Price}`}
                  rating={product.avgRating || 0}
                  imageWidth={500}
                  imageHeight={300}
                />
              </div>
            ))}
          </div>
        </div>

        {/* For medium and large screens */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {randomProducts.map((product) => (
            <ProductCard
              id={product._id}
              key={product._id}
              imageSrc={product.Product_Images[0]?.url}
              title={product.Name}
              price={`$${product.Price}`}
              rating={product.avgRating || 0}
              imageWidth={500}
              imageHeight={300}
            />
          ))}
        </div>
      </div>

      {/* Inform About trending and latest products */}
      <div className="flex flex-wrap justify-between mt-6 dark:bg-gray-900">
        {/* Top Selling */}
        <div className="w-full lg:w-1/3 px-4 mb-6">
          <h2 className="text-xl dark:text-white font-bold text-gray-800 tracking-wide mb-3 border-b-2 border-green-500 pb-1">
            Top Selling
          </h2>
          <TopScallingProductCard
            imageSrc={GroceriesPic.src}
            title={"Hello from Card"}
            ProductScaller={"Ali"}
            price={"$200"}
            discountedPrice={"$100"}
            rating={4}
            imageWidth={500}
            imageHeight={300}
          />
          <TopScallingProductCard
            imageSrc={GroceriesPic.src}
            title={"Hello from Card"}
            ProductScaller={"Ali"}
            price={"$200"}
            discountedPrice={"$100"}
            rating={4}
            imageWidth={500}
            imageHeight={300}
          />
          <TopScallingProductCard
            imageSrc={GroceriesPic.src}
            title={"Hello from Card"}
            ProductScaller={"Ali"}
            price={"$200"}
            discountedPrice={"$100"}
            rating={4}
            imageWidth={500}
            imageHeight={300}
          />
        </div>
        {/* Recently Added */}
        <div className="w-full lg:w-1/3 px-4 mb-6">
          <h2 className="text-xl dark:text-white font-bold text-gray-800 tracking-wide mb-3 border-b-2 border-green-500 pb-1">
            Recently Added
          </h2>
          <TopScallingProductCard
            imageSrc={GroceriesPic.src}
            title={"Hello from Card"}
            ProductScaller={"Ali"}
            price={"$200"}
            discountedPrice={"$100"}
            rating={4}
            imageWidth={500}
            imageHeight={300}
          />
          <TopScallingProductCard
            imageSrc={GroceriesPic.src}
            title={"Hello from Card"}
            ProductScaller={"Ali"}
            price={"$200"}
            discountedPrice={"$100"}
            rating={4}
            imageWidth={500}
            imageHeight={300}
          />
          <TopScallingProductCard
            imageSrc={GroceriesPic.src}
            title={"Hello from Card"}
            ProductScaller={"Ali"}
            price={"$200"}
            discountedPrice={"$100"}
            rating={4}
            imageWidth={500}
            imageHeight={300}
          />
        </div>
        {/* Top Rated */}
        <div className="w-full lg:w-1/3 px-4 mb-6">
          <h2 className="text-xl dark:text-white font-bold text-gray-800 tracking-wide mb-3 border-b-2 border-green-500 pb-1">
            Top Rated
          </h2>
          <TopScallingProductCard
            imageSrc={GroceriesPic.src}
            title={"Hello from Card"}
            ProductScaller={"Ali"}
            price={"$200"}
            discountedPrice={"$100"}
            rating={4}
            imageWidth={500}
            imageHeight={300}
          />
          <TopScallingProductCard
            imageSrc={GroceriesPic.src}
            title={"Hello from Card"}
            ProductScaller={"Ali"}
            price={"$200"}
            discountedPrice={"$100"}
            rating={4}
            imageWidth={500}
            imageHeight={300}
          />
          <TopScallingProductCard
            imageSrc={GroceriesPic.src}
            title={"Hello from Card"}
            ProductScaller={"Ali"}
            price={"$200"}
            discountedPrice={"$100"}
            rating={4}
            imageWidth={500}
            imageHeight={300}
          />
        </div>
      </div>

      {/* \Footer */}
      <Footer />
    </div>
  );
}

export default Page;
