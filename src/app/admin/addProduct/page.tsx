'use client';

import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useToast } from "@/components/ui/use-toast";
import { ApiResponce } from '@/types/ApiResponce';
import nprogress from "nprogress"; // Import nprogress for progress bar
import "nprogress/nprogress.css"; // Import nprogress styles for the progress bar
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import Image from 'next/image';

// Function to validate if the color is a valid CSS color
const isValidColor = (color: string) => {
  const style = new Option().style;
  style.color = color;
  return style.color !== '';
}

const ProductEntryPage = () => {
  // State variables for form inputs
  const [name, setName] = useState('');
  const [aboutProduct, setAboutProduct] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [description, setDescription] = useState('');
  const [subCategories, setSubCategories] = useState<string>('');
  const [categories, setCategories] = useState<string>(''); 
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [sallerID, setSallerID] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const { data: session, status } = useSession();

  // Update sallerID when session changes
  useEffect(() => {
    if (session?.user?._id) {
      setSallerID(session.user._id);
    }
  }, [session]);

  // Clean up image previews on component unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      // Append form data to FormData object
      formData.append('Name', name);
      formData.append('AboutProduct', aboutProduct);
      formData.append('Price', price.toString());
      formData.append('Stock', JSON.stringify(stock));
      formData.append('ColorOfProsuct', JSON.stringify(colors));
      formData.append('SizeOfProduct', JSON.stringify(sizes));
      formData.append('ProductDescription', description);
      formData.append('Product_Saller', sallerID);
      formData.append('Categories', JSON.stringify(categories));
      formData.append('SubCategories', JSON.stringify(subCategories));

      // Append images to FormData
      images.forEach((file) => formData.append('Product_Images', file));

      nprogress.start(); // Start loading bar
      const response = await axios.post('/api/seller_routes/addProduct', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Display success toast message
      toast({
        title: "Success",
        description: response.data.message,
      });

      // Reset form state after successful submission
      setName('');
      setAboutProduct('');
      setPrice('');
      setStock('');
      setColors([]);
      setSizes([]);
      setNewColor('');
      setNewSize('');
      setDescription('');
      setSubCategories('');
      setCategories('');
      setSallerID('');
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      setError('Failed to submit the form. Please try again.');
      const axiosError = error as AxiosError<ApiResponce>;
      let errorMessage = axiosError.response?.data.message;

      // Display error toast message
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      nprogress.done(); // Stop loading bar
    }
  };

  // Handle file input changes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      if (images.length + filesArray.length <= 4) {
        // Update images and previews state
        setImages(prevImages => [...prevImages, ...filesArray]);
        const previews = filesArray.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...previews]);
        setError(null);
      } else {
        setError('You can only select up to 4 images.');
      }
    }
  };

  // Add a new color to the list of colors
  const handleAddColor = () => {
    const color = newColor.trim();

    if (!color) {
      toast({
        title: "Invalid Color",
        description: 'Color cannot be empty. Please enter a valid color.',
        variant: "destructive",
      });
      return;
    }

    if (!isValidColor(color)) {
      toast({
        title: "Invalid Color",
        description: 'The color entered is not a valid color. Please enter a valid color name or hex code.',
        variant: "destructive",
      });
      return;
    }

    if (colors.includes(color)) {
      toast({
        title: "Duplicate Color",
        description: 'This color has already been added.',
        variant: "destructive",
      });
      return;
    }

    setColors([...colors, color]);
    setNewColor('');
  };

  // Remove a color from the list of colors
  const handleRemoveColor = (colorToRemove: string) => {
    setColors(colors.filter(color => color !== colorToRemove));
  };

  // Add a new size to the list of sizes
  const handleAddSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize]);
      setNewSize('');
    }
  };

  // Remove a size from the list of sizes
  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes(sizes.filter(size => size !== sizeToRemove));
  };

  // Handle color input change
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewColor(event.target.value);
  };

  // Handle size input change
  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewSize(event.target.value);
  };

  // Predefined category options
  const categoryOptions = ["Electronics", "Fashion", "Home", "Beauty", "Sports"];

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl mb-4">Add New Product</h1>

        {/* Product Name Input */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        {/* About Product Textarea */}
        <div className="mb-4">
          <label htmlFor="aboutProduct" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            About Product
          </label>
          <textarea
            id="aboutProduct"
            value={aboutProduct}
            onChange={(e) => setAboutProduct(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        {/* Product Price Input */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Price
          </label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        {/* Stock Input */}
        <div className="mb-4">
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Stock
          </label>
          <input
            id="stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        {/* Color Input and List */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Colors
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newColor}
              onChange={handleColorChange}
              placeholder="Add color"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddColor}
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm dark:bg-blue-600"
            >
              Add Color
            </button>
          </div>
          <div className="mt-2">
            {colors.map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <span className="block w-6 h-6 rounded-full" style={{ backgroundColor: color }}></span>
                <span>{color}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveColor(color)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Size Input and List */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sizes
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSize}
              onChange={handleSizeChange}
              placeholder="Add size"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddSize}
              className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm dark:bg-blue-600"
            >
              Add Size
            </button>
          </div>
          <div className="mt-2">
            {sizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <span>{size}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSize(size)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Description Textarea */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        {/* Category Selection */}
        <div className="mb-4">
          <label htmlFor="categories" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            id="categories"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            required
          >
            <option value="">Select a category</option>
            {categoryOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Subcategory Input */}
        <div className="mb-4">
          <label htmlFor="subCategories" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Subcategory
          </label>
          <input
            id="subCategories"
            type="text"
            value={subCategories}
            onChange={(e) => setSubCategories(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* File Input and Image Previews */}
        <div className="mb-4">
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Product Images (up to 4)
          </label>
          <input
            id="images"
            type="file"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <div className="mt-2 flex space-x-2">
            {imagePreviews.map((preview, index) => (
              <Image
                key={index}
                src={preview}
                height={80}
                width={80}
                alt={`Image preview ${index + 1}`}
                className="w-24 h-24 object-cover border rounded-md"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm dark:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
};

export default ProductEntryPage;
