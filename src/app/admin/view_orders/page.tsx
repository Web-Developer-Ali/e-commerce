'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Order {
  _id: string;
  sellerId: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

const ViewOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/seller_routes/seller_orders');
        setOrders(response.data);
      } catch (error) {
        setError('Failed to load orders.');
        toast({
          title: "Error",
          description: 'Unable to fetch orders data.',
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchOrders();
    }
  }, [session, toast]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await axios.patch(`/api/seller_routes/seller_orders`, { status: newStatus, orderId });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: response.data.status } : order
      ));
      toast({
        title: "Success",
        description: `Order status updated to ${newStatus}.`,
        variant: "default",
      });
    } catch (error) {
      setError('Failed to update order status.');
      toast({
        title: "Error",
        description: 'Unable to update order status.',
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-4 dark:text-white">View Orders</h1>

      {error && (
        <Alert className="dark:bg-red-900">
          <AlertTitle className="dark:text-red-500">Error</AlertTitle>
          <AlertDescription className="dark:text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      {orders.length === 0 ? (
        <p className="dark:text-white">No orders found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1">
          <table className="min-w-full bg-white dark:bg-gray-800 hidden md:table">
            <thead className="dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-xs md:text-sm lg:text-base dark:text-white">Order ID</th>
                <th className="px-4 py-2 text-xs md:text-sm lg:text-base dark:text-white">Product ID</th>
                <th className="px-4 py-2 text-xs md:text-sm lg:text-base dark:text-white">Quantity</th>
                <th className="px-4 py-2 text-xs md:text-sm lg:text-base dark:text-white">Total Amount</th>
                <th className="px-4 py-2 text-xs md:text-sm lg:text-base dark:text-white">Status</th>
                <th className="px-4 py-2 text-xs md:text-sm lg:text-base dark:text-white">Date</th>
                <th className="px-4 py-2 text-xs md:text-sm lg:text-base dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="dark:bg-gray-700 dark:text-white">
                  <td className="border px-2 py-1 text-xs md:px-4 md:py-2 dark:border-gray-600">{order._id}</td>
                  <td className="border px-2 py-1 text-xs md:px-4 md:py-2 dark:border-gray-600">{order.productId}</td>
                  <td className="border px-2 py-1 text-xs md:px-4 md:py-2 dark:border-gray-600">{order.quantity}</td>
                  <td className="border px-2 py-1 text-xs md:px-4 md:py-2 dark:border-gray-600">${order.totalAmount.toFixed(2)}</td>
                  <td className={`border px-2 py-1 text-xs md:px-4 md:py-2 dark:border-gray-600 ${order.status === 'Completed' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    {order.status}
                  </td>
                  <td className="border px-2 py-1 text-xs md:px-4 md:py-2 dark:border-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="border px-2 py-1 text-xs md:px-4 md:py-2 dark:border-gray-600">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="border p-1 rounded text-xs md:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Canceled">Canceled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile View - Cards */}
          <div className="block md:hidden space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
                <div className="text-sm">
                  <strong className="dark:text-white">Order ID:</strong> {order._id}
                </div>
                <div className="text-sm">
                  <strong className="dark:text-white">Product ID:</strong> {order.productId}
                </div>
                <div className="text-sm">
                  <strong className="dark:text-white">Quantity:</strong> {order.quantity}
                </div>
                <div className="text-sm">
                  <strong className="dark:text-white">Total Amount:</strong> ${order.totalAmount.toFixed(2)}
                </div>
                <div className={`text-sm ${order.status === 'Completed' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                  <strong>Status:</strong> {order.status}
                </div>
                <div className="text-sm dark:text-white">
                  <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div className="text-sm mt-2">
                  <label htmlFor="status" className="dark:text-white">Change Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="border p-1 rounded text-xs md:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white w-full mt-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOrders;
