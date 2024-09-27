"use client";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import React, { useEffect, useState } from "react";
import nprogress from "nprogress";
import "nprogress/nprogress.css";  
interface Order {
  _id: string; // Changed 'id' to '_id' to match your order data structure
  createdAt: string; // Changed 'date' to 'createdAt' to match your order data structure
  price: string; // Assuming price is a string, update if it's a number
  status: string;
  totalAmount: number; // Ensure totalAmount matches your API data
  quantity: number; // Ensure quantity matches your API data
}

function Page() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("All orders");
  const [dateFilter, setDateFilter] = useState("this week");

  useEffect(() => {
    const GetAllUserOrders = async () => {
      try {
        const response = await axios.get("/api/handle_order");
        setOrders(response.data.orders); // Adjust based on your API response structure
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Failed to fetch orders");
        toast({
          title: "Error",
          description: "Unable to load orders.",
          variant: "destructive",
        });
      }
    };
    GetAllUserOrders();
  }, [toast]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilter(e.target.value);
  };

  const filterOrders = () => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "All orders" || order.status === statusFilter;

      const matchesDate = (() => {
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        switch (dateFilter) {
          case "this week":
            return orderDate > new Date(now.setDate(now.getDate() - 7));
          case "this month":
            return orderDate > new Date(now.setMonth(now.getMonth() - 1));
          case "last 3 months":
            return orderDate > new Date(now.setMonth(now.getMonth() - 3));
          case "last 6 months":
            return orderDate > new Date(now.setMonth(now.getMonth() - 6));
          case "this year":
            return orderDate > new Date(now.setFullYear(now.getFullYear() - 1));
          default:
            return true;
        }
      })();

      return matchesStatus && matchesDate;
    });
  };

  const handleCancelOrder = async (orderId: string) => {
    nprogress.start(); // Start the progress bar
    try {
      const response = await axios.delete(`/api/handle_order?orderId=${orderId}`);
      console.log("Order canceled:", response.data);
  
      // Update the orders state by removing the canceled order
      setOrders((prevOrders) => prevOrders.filter(order => order._id !== orderId));
  
      toast({
        title: "Success",
        description: "Order has been canceled.",
      
      });
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast({
        title: "Error",
        description: "Unable to cancel order.",
        variant: "destructive",
      });
    } finally {
      nprogress.done(); // Complete the progress bar
    }
  };
  
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">
          <div className="gap-4 sm:flex sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              My orders
            </h2>

            <div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
              <div>
                <label
                  htmlFor="order-type"
                  className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select order type
                </label>
                <select
                  id="order-type"
                  className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  value={statusFilter}
                  onChange={handleStatusChange}
                >
                  <option selected>All orders</option>
                  <option value="Pending">Pending</option>
                  <option value="Shipped">In transit</option>
                  <option value="Completed">Confirmed</option>
                </select>
              </div>

              <span className="inline-block text-gray-500 dark:text-gray-400">
                {" "}
                from{" "}
              </span>

              <div>
                <label
                  htmlFor="duration"
                  className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select duration
                </label>
                <select
                  id="duration"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                  value={dateFilter}
                  onChange={handleDateChange}
                >
                  <option selected>this week</option>
                  <option value="this month">this month</option>
                  <option value="last 3 months">the last 3 months</option>
                  <option value="last 6 months">the last 6 months</option>
                  <option value="this year">this year</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flow-root sm:mt-8">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filterOrders().length > 0 ? (
                filterOrders().map((order, index) => (
                  <div
                    key={order._id}
                    className="flex flex-wrap items-center gap-y-4 py-6"
                  >
                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                        Order ID:
                      </dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                        <a href="#" className="hover:underline">
                          {order._id}
                        </a>
                      </dd>
                    </dl>

                    <dl className="ml-10 w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                        Date:
                      </dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                        Total Price:
                      </dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900 dark:text-white">
                        {order.totalAmount} USD
                      </dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500 dark:text-gray-400">
                        Status:
                      </dt>
                      <dd
                        className={`me-2 mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${statusClass(
                          order.status
                        )}`}
                      >
                        <StatusIcon status={order.status} />
                        {order.status}
                      </dd>
                    </dl>

                    <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(order._id)}
                        className={`w-full rounded-lg ${cancelButtonClass(
                          order.status
                        )} px-3 py-2 text-center text-sm font-medium ${cancelButtonTextColor(
                          order.status
                        )} hover:bg-red-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900 lg:w-auto`}
                      >
                        Cancel order
                      </button>

                      <a
                        href="#"
                        className="w-full inline-flex justify-center rounded-lg  border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 lg:w-auto"
                      >
                        View details
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p>No orders found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const statusClass = (status: string) => {
  switch (status) {
    case "In transit":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Pre-order":
      return "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300";
    case "Confirmed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "";
  }
};

const cancelButtonClass = (status: string) =>
  status === "Confirmed" ? "border-blue-700 bg-blue-700" : "border-red-700";

const cancelButtonTextColor = (status: string) =>
  status === "Confirmed" ? "text-white" : "text-red-700";

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "In transit":
      return (
        <svg
          className="me-1 h-3 w-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 2a1 1 0 0 1 1 1v1h2a2 2 0 0 1 1.85 2.85l-5 12A2 2 0 0 1 7 19H5a1 1 0 0 1-1-1v-1h2a2 2 0 0 1 1.85-2.85l5-12A2 2 0 0 1 13 2h-3V1a1 1 0 0 1 1-1z" />
        </svg>
      );
    case "Pre-order":
      return (
        <svg
          className="me-1 h-3 w-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 1a1 1 0 0 1 1 1v1h2a2 2 0 0 1 1.85 2.85l-5 12A2 2 0 0 1 7 19H5a1 1 0 0 1-1-1v-1h2a2 2 0 0 1 1.85-2.85l5-12A2 2 0 0 1 13 1h-3V0a1 1 0 0 1 1-1z" />
        </svg>
      );
    case "Confirmed":
      return (
        <svg
          className="me-1 h-3 w-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 1a1 1 0 0 1 1 1v1h2a2 2 0 0 1 1.85 2.85l-5 12A2 2 0 0 1 7 19H5a1 1 0 0 1-1-1v-1h2a2 2 0 0 1 1.85-2.85l5-12A2 2 0 0 1 13 1h-3V0a1 1 0 0 1 1-1z" />
        </svg>
      );
    case "Cancelled":
      return (
        <svg
          className="me-1 h-3 w-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 1a1 1 0 0 1 1 1v1h2a2 2 0 0 1 1.85 2.85l-5 12A2 2 0 0 1 7 19H5a1 1 0 0 1-1-1v-1h2a2 2 0 0 1 1.85-2.85l5-12A2 2 0 0 1 13 1h-3V0a1 1 0 0 1 1-1z" />
        </svg>
      );
    default:
      return null;
  }
};

export default Page;
