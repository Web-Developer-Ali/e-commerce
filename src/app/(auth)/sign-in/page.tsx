'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { singInSchema } from '@/schemas/signInSchema'; // Adjust the path as necessary
import nprogress from 'nprogress'; // Import nprogress
import 'nprogress/nprogress.css'; // Import nprogress styles

const SignInPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  // Use react-hook-form with zod for form validation
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof singInSchema>>({
    resolver: zodResolver(singInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  // Form submission handler
  const onSubmit = async (data: z.infer<typeof singInSchema>) => {
    setIsSubmitting(true);
    nprogress.start(); // Start loading bar
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.identifier,
        password: data.password,
      });
      console.log(result)
      if (result?.error) {
        if (result.error.includes('User not found')) {
          toast({
            title: "User not found",
            description: "No account found with the provided email. Please check your credentials.",
            variant: "destructive",
          });
        } else if (result.error.includes('credentials')) {
          toast({
            title: "Incorrect Credentials",
            description: "The email or password you entered is incorrect.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign in failed",
            description: result.error || "An unexpected error occurred.",
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
      } else if (result?.url) {
        router.replace('/');
      }
      
    } catch (error) {
      console.error("Error in signing in user:", error);
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      nprogress.done(); // Stop loading bar
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="identifier" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input
                  type="email"
                  id="identifier"
                  {...register('identifier')}
                  className={`bg-gray-50 border text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>
                </div>
                <Link href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{' '}
                <Link href="/sign-up" className="font-medium text-green-600 hover:underline dark:text-primary-500">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignInPage;
