"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSession } from "next-auth/react"; // Import getSession

// Dashboard statistics interface
interface DashboardStats {
  total: number;
  totalOrderCount: number;
  inventoryCount: number;
}

// Admin Home Page Component
const AdminHomePage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get the session to extract the seller ID
        const session = await getSession();
        const userId = session?.user?._id;
        if (!userId) {
          throw new Error("Seller ID not found in session");
        }

        // Fetch dashboard statistics
        const response = await axios.post("/api/seller_routes/dashboardStats", {
          userId: userId,
        });
console.log(response)
        setStats(response.data);
      } catch (error) {
        setError("Failed to load dashboard statistics.");
        toast({
          title: "Error",
          description: "Unable to fetch dashboard data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  if (loading)
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );

  return (
    <div className="mt-8 p-6 dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Dashboard Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Total Sales</h2>
          <p className="text-2xl font-bold">${stats?.total.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Total Orders</h2>
          <p className="text-2xl font-bold">
            {stats?.totalOrderCount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Inventory Count</h2>
          <p className="text-2xl font-bold">
            {stats?.inventoryCount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/addProduct"
          className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Add Products
        </Link>
        <Link
          href="/admin/view_orders"
          className="bg-green-500 text-white p-4 rounded-lg shadow-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
        >
          View Orders
        </Link>
        <Link
          href="/admin/manage-inventry"
          className="bg-yellow-500 text-white p-4 rounded-lg shadow-md hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
        >
          Manage Inventory
        </Link>
        <Link
          href="/admin/withdrawal"
          className="bg-red-500 text-white p-4 rounded-lg shadow-md hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
        >
          Withdrawal
        </Link>
      </div>

      {/* Display error alert if there is an error */}
      {error && (
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AdminHomePage;
