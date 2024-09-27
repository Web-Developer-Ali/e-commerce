'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { ApiResponce } from '@/types/ApiResponce';
import { useToast } from '@/components/ui/use-toast';
import { signOut } from "next-auth/react";
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';  // Import nprogress CSS

const PasswordChange: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { toast } = useToast();
  const route = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      nprogress.start(); // Start the loading bar before the API call
      // Call API to change password using Axios
      const response = await axios.put('/api/handleUser_account', {
        currentPassword,
        password: newPassword,
        confirmPassword,
      });

      // Set success message if the password change was successful
      setSuccess(response.data.message);
      await signOut({ redirect: true, callbackUrl: "/sign-in" });
    } catch (error: any) {
      // Set error message if there was an issue with the API call
      setError(error.response?.data.message || 'Something went wrong');
      const axiosError = error as AxiosError<ApiResponce>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      nprogress.done(); // Stop the loading bar after the API call is finished
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">Change Password</h2>
        
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              required
              autoComplete="current-password"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              required
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordChange;
