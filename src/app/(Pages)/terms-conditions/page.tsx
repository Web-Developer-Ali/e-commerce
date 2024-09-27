// src/pages/TermsConditions.js
import React from 'react';

const TermsConditions = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-16 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-4xl w-full p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">Terms and Conditions</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">1. Introduction</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Welcome to [Your Company Name]. By accessing or using our website, you agree to comply with and be 
            bound by the following terms and conditions. Please read them carefully before using our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">2. User Accounts</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            To use certain features of our website, you may be required to create an account. You are responsible 
            for maintaining the confidentiality of your account information and for all activities that occur under 
            your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">3. Intellectual Property</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            All content and materials on our website, including text, graphics, logos, and images, are the property 
            of [Your Company Name] or its licensors and are protected by intellectual property laws. You may not 
            use any content from our website without our express written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">4. Limitation of Liability</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            [Your Company Name] is not liable for any damages arising from the use or inability to use our website, 
            including but not limited to direct, indirect, incidental, or consequential damages.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">5. Changes to Terms</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            We may update these terms and conditions from time to time. We will notify you of any changes by posting 
            the new terms on our website. Your continued use of our website after any changes constitutes your 
            acceptance of the new terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">6. Contact Us</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            If you have any questions about these terms and conditions, please contact us at:
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Email: <a href="mailto:support@yourcompany.com" className="text-blue-500 dark:text-blue-300">support@yourcompany.com</a><br />
            Phone: <a href="tel:+1234567890" className="text-blue-500 dark:text-blue-300">+1 (234) 567-890</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsConditions;
