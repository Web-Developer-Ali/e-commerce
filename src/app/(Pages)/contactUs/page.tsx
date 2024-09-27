import React from 'react';

const ContactUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">We&apos;d Love to Hear From You!</h2>
          <p className="mb-6">If you have any questions or need support, please fill out the form below or reach out to us through the contact information provided.</p>
          
          <form action="#" method="POST">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                <input type="text" id="name" name="name" className="block w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                <input type="email" id="email" name="email" className="block w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
              <textarea id="message" name="message" rows={4} className="block w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required></textarea>
            </div>
            
            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md dark:bg-green-600 dark:hover:bg-green-500">Send Message</button>
          </form>
        </div>

        <div className="max-w-2xl mx-auto mt-12 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p className="mb-4">You can also reach us through the following methods:</p>
          <ul className="space-y-3">
            <li>
              <h3 className="text-lg font-medium">Email:</h3>
              <p><a href="mailto:support@company.com" className="text-green-500 hover:underline">support@company.com</a></p>
            </li>
            <li>
              <h3 className="text-lg font-medium">Phone:</h3>
              <p><a href="tel:+12345678901" className="text-green-500 hover:underline">+1 (234) 567-8901</a></p>
            </li>
            <li>
              <h3 className="text-lg font-medium">Address:</h3>
              <p>123 E-commerce St., City, State, ZIP Code, Country</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
