'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FaCaretDown, FaTimes } from 'react-icons/fa';

const StickyBar = () => {
  const [Groceries, setGroceries] = useState('');
  const [Fashion, setFashion] = useState('');
  const [Electronics, setElectronics] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="h-16 w-full bg-white dark:bg-gray-900 p-3 shadow-md sticky top-0 text-gray-900 dark:text-gray-100 z-20 border border-gray-300 dark:border-gray-700">
      <div className="container mx-auto flex items-center justify-between">
        {/* Main Links (Left Aligned) */}
        <div className="flex space-x-4 md:mr-auto">
          <Link href="/" className="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded transition-all duration-200">
            Home
          </Link>
          <Link href="/aboutUs" className="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded transition-all duration-200">
            About
          </Link>
          <Link href="/contactUs" className="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded transition-all duration-200">
            Contact
          </Link>
        </div>

        {/* Responsive code */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-900 dark:text-gray-100 focus:outline-none md:hidden relative"
        >
          {isOpen ? (
             <FaTimes className="h-6 w-6 text-red-600" />
          ) : (
            <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
          )}
        </button>

        {/* End responsive design */}

        {/* Main Links for Desktop */}
        <div className={`md:flex-grow hidden md:flex md:items-center md:justify-between ${isOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-grow justify-evenly space-x-4">
            {/* Groceries Dropdown */}
            <div className="relative group">
              <button className="p-2 h-10 w-32 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-md focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-between">
                {Groceries || 'Groceries'}
                <FaCaretDown className="ml-4" />
              </button>
              <ul className="absolute hidden group-hover:block bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg mt-1 z-50 transition-transform transform scale-0 group-hover:scale-100 origin-top-right">
                <li onClick={() => setGroceries('Fruits')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Fruits</li>
                <li onClick={() => setGroceries('Vegetables')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Vegetables</li>
                <li onClick={() => setGroceries('Dairy')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Dairy</li>
              </ul>
            </div>

            {/* Shop DropDown */}
            <div className="relative group">
              <button className="p-2 h-10 w-30 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-md focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-between">
                Shop
                <FaCaretDown className="ml-6" />
              </button>
              <div className="absolute hidden group-hover:block bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg  z-50 transition-transform transform scale-0 group-hover:scale-100 origin-top-right">
                <div className="flex">
                  {/* Groceries */}
                  <div className="flex-1">
                    <div className="p-2 w-full text-left">
                      <div className="font-semibold p-2 border-b border-gray-300 dark:border-gray-700">{Groceries || 'Groceries'}</div>
                      <ul className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                        <li onClick={() => setGroceries('Fruits')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Fruits</li>
                        <li onClick={() => setGroceries('Vegetables')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Vegetables</li>
                        <li onClick={() => setGroceries('Dairy')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Dairy</li>
                      </ul>
                    </div>
                  </div>

                  {/* Electronics */}
                  <div className="flex-1 text-center">
                    <div className="p-2 w-full text-left">
                      <div className="font-semibold p-2 border-b border-gray-300 dark:border-gray-700">{Electronics || 'Electronics'}</div>
                      <ul className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                        <li onClick={() => setElectronics('Phone')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Phone</li>
                        <li onClick={() => setElectronics('Laptop')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Laptop</li>
                        <li onClick={() => setElectronics('Cameras')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Cameras</li>
                        <li onClick={() => setElectronics('TV')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">TV</li>
                        <li onClick={() => setElectronics('Headphones')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Headphones</li>
                      </ul>
                    </div>
                  </div>

                  {/* Fashion */}
                  <div className="flex-1 text-right">
                    <div className="p-2 w-full text-left">
                      <div className="font-semibold p-2 border-b border-gray-300 dark:border-gray-700">{Fashion || 'Fashion'}</div>
                      <ul className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                        <li onClick={() => setFashion('Shirts')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Shirts</li>
                        <li onClick={() => setFashion('Jeans')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Jeans</li>
                        <li onClick={() => setFashion('Boys Clothing')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Boys&apos; Clothing</li>
                        <li onClick={() => setFashion('Girls Clothing')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Girls&apos; Clothing</li>
                        <li onClick={() => setFashion('Mens Accessories')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Men&apos;s Accessories</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Electronics Dropdown */}
            <div className="relative group">
              <button className="p-2 h-10 w-32 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-md focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-between">
                {Electronics || 'Electronics'}
                <FaCaretDown className="ml-4" />
              </button>
              <ul className="absolute hidden group-hover:block bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg mt-1 z-50 transition-transform transform scale-0 group-hover:scale-100 origin-top-right">
                <li onClick={() => setElectronics('Phone')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Phone</li>
                <li onClick={() => setElectronics('Laptop')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Laptop</li>
                <li onClick={() => setElectronics('Cameras')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Cameras</li>
                <li onClick={() => setElectronics('TV')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">TV</li>
                <li onClick={() => setElectronics('Headphones')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Headphones</li>
              </ul>
            </div>

            {/* Fashion Dropdown */}
            <div className="relative group">
              <button className="p-2 h-10 w-32 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-md focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-between">
                {Fashion || 'Fashion'}
                <FaCaretDown className="ml-4" />
              </button>
              <ul className="absolute hidden group-hover:block bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-lg mt-1 z-50 transition-transform transform scale-0 group-hover:scale-100 origin-top-right">
                <li onClick={() => setFashion('Shirts')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Shirts</li>
                <li onClick={() => setFashion('Jeans')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Jeans</li>
                <li onClick={() => setFashion('Boys Clothing')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Boys&apos; Clothing</li>
                <li onClick={() => setFashion('Girls Clothing')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Girls&apos; Clothing</li>
                <li onClick={() => setFashion('Mens Accessories')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">Men&apos;s Accessories</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyBar;
