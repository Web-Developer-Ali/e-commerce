"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

// Define the structure of a Product object
interface Product {
  _id: string;
  Name: string;
  AboutProduct: string;
  Price: number;
  Stock: number;
  ColorOfProsuct: string[];
  SizeOfProduct: string[];
  ProductDescription: string;
  Product_Images: { public_id: string; url: string }[];
  ProductCategories: {
    category: string;
    sub_categories?: string[];
  }[];
  Product_Seller: string;
}

const InventoryManagement = () => {
  // State to hold the list of products
  const [products, setProducts] = useState<Product[]>([]);
  // State to control visibility of the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // State to control visibility of the update product modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  // State to store the ID of the product to be deleted
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  // State to store the product details for editing
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  // State to handle new price and stock input for updating product
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newStock, setNewStock] = useState<number>(0);
  // State to show loading while data fetching
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Toast notification hook for user feedback
  const { toast } = useToast();

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Get user session to retrieve user ID
        const session = await getSession();
        const userId = session?.user?._id;

        if (!userId) {
          throw new Error("User ID not found in session.");
        }

        // Make API call to get products
        const response = await axios.post("/api/seller_routes/inventry", {
          userId: userId,
        });
        // Update products state with fetched data
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to fetch products.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchProducts();
  }, [toast]);

  // Handle updating product details
  const handleUpdateProduct = async () => {
    if (editProduct) {
      try {
        // Get user session to retrieve user ID
        const session = await getSession();
        const userId = session?.user?._id;

        if (!userId) {
          throw new Error("User ID not found in session.");
        }

        // Make API call to update product details
        await axios.put("/api/seller_routes/inventry", {
          id: editProduct._id,
          price: newPrice,
          stockQuantity: newStock,
        });

        // Update products state with new price and stock
        const updatedProducts = products.map((product) =>
          product._id === editProduct._id
            ? { ...product, Prise: newPrice, Stock: newStock }
            : product
        );
        setProducts(updatedProducts);
        setShowUpdateModal(false);
        setEditProduct(null);
        setNewPrice(0);
        setNewStock(0);
        toast({
          title: "Success",
          description: "Product updated successfully.",
        });
      } catch (error) {
        console.error("Error updating product:", error);
        toast({
          title: "Error",
          description: "Failed to update product.",
          variant: "destructive",
        });
      }
    }
  };

  // Handle initiating product deletion
  const handleDeleteProduct = (id: string) => {
    setDeleteProductId(id);
    setShowDeleteModal(true);
  };

  // Confirm and handle product deletion
  const confirmDelete = async () => {
    try {
      if (deleteProductId) {
        // Make API call to delete the product
        await axios.delete(`/api/seller_routes/inventry`, {
          params: { id: deleteProductId },
        });

        // Remove deleted product from state
        setProducts(products.filter((product) => product._id !== deleteProductId));
        setShowDeleteModal(false);
        setDeleteProductId(null);
        toast({
          title: "Success",
          description: "Product deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  // Cancel product deletion
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteProductId(null);
  };

  // Open the update product modal with product details
  const openUpdateModal = (product: Product) => {
    setEditProduct(product);
    setNewPrice(product.Price);
    setNewStock(product.Stock);
    setShowUpdateModal(true);
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-white">
      {/* Page title */}
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      {/* Link to add new product */}
      <Link
        href="/admin/addProduct"
        className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
      >
        Add New Product
      </Link>
      {/* Product table */}
      <table className="w-full mt-6 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md rounded-lg border border-gray-200 dark:border-gray-600">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-3 text-left border-b dark:border-gray-600">Name</th>
            <th className="p-3 text-left border-b dark:border-gray-600">SKU</th>
            <th className="p-3 text-left border-b dark:border-gray-600">Price</th>
            <th className="p-3 text-left border-b dark:border-gray-600">Stock Quantity</th>
            <th className="p-3 text-left border-b dark:border-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="p-3 text-center">Loading...</td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-3 text-center">No products available</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300"
              >
                <td className="p-3 border-b dark:border-gray-600">{product.Name}</td>
                <td className="p-3 border-b dark:border-gray-600">{product._id}</td>
                <td className="p-3 border-b dark:border-gray-600">${product.Price}</td>
                <td className="p-3 border-b dark:border-gray-600">{product.Stock}</td>
                <td className="p-3 border-b flex gap-2">
                  {/* Update button */}
                  <button
                    onClick={() => openUpdateModal(product)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition duration-300"
                  >
                    Update
                  </button>
                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Update Product Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Update Product</h2>
            <label className="block mb-2">
              Price:
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="block w-full mt-1 p-2 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />
            </label>
            <label className="block mb-4">
              Stock Quantity:
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
                className="block w-full mt-1 p-2 border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleUpdateProduct}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this product?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
              >
                Confirm
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
