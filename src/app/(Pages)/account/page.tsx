"use client";

import React, { useEffect, useState } from "react";
import { getSession, signOut , useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponce } from "@/types/ApiResponce";
import nprogress from "nprogress";
import 'nprogress/nprogress.css';  // Import the nprogress CSS

const AccountPage: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [orders, setOrders] = useState<any[]>([]); // Ensure orders is initialized as an array
  const [showDeleteModal, setShowDeleteModal] = useState(false); // For the modal
  const {data: status , update} = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSession = async () => {
      nprogress.start(); // Start the loading bar
      const sessionData = await getSession();
      setSession(sessionData);
      nprogress.done(); // Stop the loading bar after fetching session
    };
    
    const GetAllUserOrders = async () => {
      nprogress.start(); // Start the loading bar
      try {
        const response = await axios.get("/api/handle_order");
        setOrders(response.data.orders); // Adjust based on your API response structure
      } catch (error) {
        toast({
          title: "Error",
          description: "Unable to load orders.",
          variant: "destructive",
        });
      } finally {
        nprogress.done(); // Stop the loading bar after orders are fetched
      }
    };

    GetAllUserOrders();
    fetchSession();
  }, []);

  const Logout = async () => {
    nprogress.start(); // Start the loading bar for logout
    try {
      await signOut({ redirect: true, callbackUrl: "/sign-in" });
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      nprogress.done(); // Stop the loading bar after logout
    }
  };

  const deleteUser = async()=> {
    nprogress.start(); // Start the loading bar for delete action
    try {
      const response = await axios.delete(`/api/handleUser_account`);
      toast({
        title: "User Deleted Successfully",
        description: response.data.message,
      });
      await signOut({ redirect: true, callbackUrl: "/sign-in" });
    } catch (error) {
      console.log("Error while Deleting User:", error);
      const axiosError = error as AxiosError<ApiResponce>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      nprogress.done(); // Stop the loading bar after delete action
    }
  };

  const handleChangeUserPassword = async () => {
    nprogress.start(); // Start the loading bar for password change
    const username = session?.user?.username;
    if (!username) {
      toast({
        title: "Error",
        description: "User is not authenticated",
        variant: "destructive",
      });
      nprogress.done();
      return;
    }
    
    try {
      const response = await axios.get("/api/handleUser_account");
      if (response.status === 200 || response.status === 201) {
        update({ otpVerified: true });
        router.replace(`verify/username=${encodeURIComponent(username)}&respass=true`);
      } else {
        throw new Error("Token update failed");
      }
    } catch (error) {
      console.error("Error while changing user token:", error);
      const axiosError = error as AxiosError<ApiResponce>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to update token",
        variant: "destructive",
      });
    } finally {
      nprogress.done(); // Stop the loading bar after password change
    }
  };

  const handleSellerProfileRedirect = (route: string) => {
    nprogress.start();
    router.push(`/admin/${route}`);
    nprogress.done();
  };

  const handleUserOrderRedirect = (route: string) => {
    nprogress.start();
    router.push(`/${route}`);
    nprogress.done();
  };
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          My Account
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="col-span-1 bg-white dark:bg-gray-800 p-4 shadow-sm rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Profile
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your profile information
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <label className="w-24 text-sm text-gray-700 dark:text-gray-400">
                  Name:
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {session?.user?.username || "N/A"}
                </p>
              </div>
              <div className="flex items-center">
                <label className="w-24 text-sm text-gray-700 dark:text-gray-400">
                  Email:
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {session?.user?.email || "N/A"}
                </p>
              </div>
              <div className="flex items-center">
                <label className="w-24 text-sm text-gray-700 dark:text-gray-400">
                  Phone:
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {session?.user?.phone || "N/A"}
                </p>
              </div>
              <button className="mt-4 w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Seller Profile Manager Section (Conditional) */}
          {session?.user?.role === "Seller" && (
            <div className="col-span-1 bg-white dark:bg-gray-800 p-4 shadow-sm rounded-lg">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Seller Profile Manager
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your seller profile and product listings
              </p>
              <button
                onClick={() => handleSellerProfileRedirect("adminHomePage")}
                className="mt-4 w-full py-2 px-4 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Manage Seller Profile
              </button>
              <button
                onClick={() => handleSellerProfileRedirect("manage-inventry")}
                className="mt-2 w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Manage Inventory
              </button>
              <button
                onClick={() => handleSellerProfileRedirect("addProduct")}
                className="mt-2 w-full py-2 px-4 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Add New Product
              </button>
            </div>
          )}

          {/* Orders Section */}
          <div className="col-span-1 bg-white dark:bg-gray-800 p-4 shadow-sm rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Orders
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View your recent orders
            </p>
            <ul className="mt-4 space-y-2">
              {orders && orders.length > 0 ? (
                orders.slice(0, 3).map((order: any, index: number) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {`Order #${order._id}`}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {order.status}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No orders available.
                </p>
              )}
            </ul>

            <button
              onClick={() => handleUserOrderRedirect("order_overview")}
              className="mt-4 w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              View All Orders
            </button>
          </div>

          {/* Addresses Section */}
          <div className="col-span-1 bg-white dark:bg-gray-800 p-4 shadow-sm rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Addresses
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your shipping addresses
            </p>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-900 dark:text-white">
                123 Main St, Springfield, IL
              </li>
              <li className="text-sm text-gray-900 dark:text-white">
                456 Oak Ave, San Francisco, CA
              </li>
            </ul>
            <button className="mt-4 w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Manage Addresses
            </button>
          </div>

          {/* Account Settings Section */}
          <div className="col-span-1 bg-white dark:bg-gray-800 p-4 shadow-sm rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Account Settings
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your account settings
            </p>
            <div className="mt-4 space-y-2">
              <button onClick={()=>handleChangeUserPassword()} className="w-full py-2 px-4 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600">
                Change Password
              </button>
              <button
                onClick={Logout}
                className="w-full py-2 px-4 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Log out
              </button>
              <button  onClick={() => setShowDeleteModal(true)}  className="w-full py-2 px-4 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
                Delete Account
              </button>
            </div>
          </div>
           {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Are you sure you want to delete your account?
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This action is irreversible, and your account will be permanently deleted.
              </p>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    deleteUser();
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
