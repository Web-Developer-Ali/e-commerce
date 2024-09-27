'use client';

import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { Suspense } from 'react';
import nprogress from 'nprogress';  // Import nprogress
import 'nprogress/nprogress.css';  // Import nprogress styles
import { useSearchParams } from 'next/navigation'; // Ensure this is imported at the top

const PaymentForm = () => {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const router = useRouter();

  const orderIds = searchParams.get('orderIds');
  const orderIdsArray = orderIds ? orderIds.split(',') : [];

  const handleOrderCreation = async () => {
    try {
      nprogress.start();

      const response = await axios.put('/api/handle_order', {
        orderIdsArray,
        paymentClear: true,
      });

      toast({
        title: 'Order placed successfully!',
        description: response.data.message,
      });
      router.push("order_overview");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      let errorMessage = axiosError.response?.data?.message || 'Failed to place the order.';
      
      toast({
        title: "Failed to place order",
        description: errorMessage,
        variant: "destructive",
      });

    } finally {
      nprogress.done();
    }
  };

  return (
    <form className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 lg:max-w-xl lg:p-8">
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Full name (as displayed on card)*
          </label>
          <input
            type="text"
            id="full_name"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
            placeholder="Bonnie Green"
            required
          />
        </div>

        {/* Other inputs for card number, expiration, CVV */}
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor="card-number-input" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Card number*
          </label>
          <input
            type="text"
            id="card-number-input"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
            placeholder="xxxx-xxxx-xxxx-xxxx"
            required
          />
        </div>

        <div>
          <label htmlFor="card-expiration-input" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Card expiration*
          </label>
          <input
            type="text"
            id="card-expiration-input"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="12/23"
            required
          />
        </div>

        <div>
          <label htmlFor="cvv-input" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            CVV*
          </label>
          <input
            type="number"
            id="cvv-input"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
            placeholder="•••"
            required
          />
        </div>
      </div>

      <button onClick={handleOrderCreation} type="button" className="flex w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
        Pay now
      </button>
    </form>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Payment</h2>
            <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12">
              <PaymentForm />
              {/* Total price display */}
              <div className="mt-6 grow sm:mt-8 lg:mt-0">
                <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                  <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Total Price:</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">$</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Suspense>
  );
};

export default Page;
