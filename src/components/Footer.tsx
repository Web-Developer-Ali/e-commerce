import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-white dark:bg-gray-800 text-neutral-900 dark:text-white border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {/* Company Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xl mb-6 dark:text-white">Company Name</h4>
            <p className="text-sm dark:text-white">
              123 E-commerce St.<br />
              City, State, ZIP Code<br />
              Country
            </p>
            <p className="text-sm mt-3 dark:text-white">Email: <a href="mailto:support@company.com" className="hover:underline text-green-400 dark:text-green-400">support@company.com</a></p>
            <p className="text-sm dark:text-white">Phone: <a href="tel:+12345678901" className="hover:underline text-green-400 dark:text-green-400">+1 (234) 567-8901</a></p>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xl mb-6 dark:text-white">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <a href="/Seller_Inform" className="text-sm hover:text-green-400 dark:hover:text-green-300">HowToSell</a>
              </li>
              <li>
                <a href="/shipping-returns" className="text-sm hover:text-green-400 dark:hover:text-green-300">Shipping & Returns</a>
              </li>
              <li>
                <a href="/contactUs" className="text-sm hover:text-green-400 dark:hover:text-green-300">Contact Us</a>
              </li>
              <li>
                <a href="/support" className="text-sm hover:text-green-400 dark:hover:text-green-300">Support Center</a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xl mb-6 dark:text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/shop" className="text-sm hover:text-green-400 dark:hover:text-green-300">Shop</a>
              </li>
              <li>
                <a href="/aboutUs" className="text-sm hover:text-green-400 dark:hover:text-green-300">About Us</a>
              </li>
              <li>
                <a href="/terms-conditions" className="text-sm hover:text-green-400 dark:hover:text-green-300">Terms & Conditions</a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-sm hover:text-green-400 dark:hover:text-green-300">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xl mb-6 dark:text-white">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 dark:hover:text-green-300">
                <FaFacebookF className="text-xl" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 dark:hover:text-green-300">
                <FaTwitter className="text-xl" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 dark:hover:text-green-300">
                <FaInstagram className="text-xl" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 dark:hover:text-green-300">
                <FaLinkedinIn className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t mt-12 pt-6 border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm dark:text-white">&copy; 2024 Company Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
