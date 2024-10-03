"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FaHeart,
  FaShoppingCart,
  FaBalanceScale,
  FaUser,
  FaSearch,
  FaSun,
  FaMoon
} from "react-icons/fa";
import Logo from "../../public/images.png";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();
  // handle account routing
  const handleAccountClick = (e: React.MouseEvent) => {
    const screenWidth = window.innerWidth;
    
    // Check if the screen size is for computers (e.g., >= 1024px)
    if (screenWidth >= 1024) {
      e.preventDefault(); // Prevent immediate navigation
      
      // Reload the home page
      router.refresh();
      
      // Add a slight delay to allow page reload, then navigate to account page
      setTimeout(() => {
        router.push("/account");
      }, 500); // 500ms delay to ensure the page reloads
    }
  };
  
  // Handle theme change
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(systemPrefersDark);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setIsDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode !== null) {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (category) {
      router.push(`/category/${category}`);
    }
  }, [category, router]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 p-3 shadow-md z-0">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Image src={Logo} alt="Logo" className="h-8 w-8 mr-2" />
          <div className="text-gray-900 dark:text-gray-100 text-lg font-bold font-mono font-medium">
            <Link href="/">E-Commerce</Link>
          </div>
          <div className="hidden lg:flex items-center ml-5 relative border-2 border-gray-300 dark:border-gray-700 rounded">
            <div className="relative group">
              <button className="p-2 h-10 w-32 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-l focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition transform hover:scale-105 text-left truncate">
                {category || "All Categories"}
              </button>
              <ul className="absolute hidden group-hover:block bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded w-full mt-1 z-50">
                               <li
                  onClick={() => setCategory("Electronics")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Electronics
                </li>
                <li
                  onClick={() => setCategory("Fashion")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Fashion
                </li>
                <li
                  onClick={() => setCategory("Home")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Home
                </li>
                <li
                  onClick={() => setCategory("Beauty")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Beauty
                </li>
                <li
                  onClick={() => setCategory("Sports")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Sports
                </li>
              </ul>
            </div>

            <div className="h-10 w-0.5 bg-gray-300 dark:bg-gray-600 mx-0"></div>

            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search..."
                className="p-2 h-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-80 focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-700 rounded-r"
              />
              <button className="absolute right-0 top-1 mt-2 mr-2">
                <FaSearch className="h-4 w-4 text-gray-900 dark:text-gray-100" />
              </button>
            </div>
          </div>
          <div className="hidden lg:flex ml-5 rounded">
            <div className="relative group">
              <button className="p-2 w-36 h-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition transform hover:scale-105">
                {location || "Select Location"}
              </button>
              <ul className="absolute hidden group-hover:block bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded w-full mt-1 z-50">
                <li
                  onClick={() => setLocation("Punjab")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Punjab
                </li>
                <li
                  onClick={() => setLocation("Sindh")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Sindh
                </li>
                <li
                  onClick={() => setLocation("Islamabad")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Islamabad
                </li>
                <li
                  onClick={() => setLocation("Balochistan")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Balochistan
                </li>
                <li
                  onClick={() => setLocation("Pakhtunkhwa")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Pakhtunkhwa
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="hidden md:flex space-x-7">
          <Link
            href="/wishlist"
            className="text-green-600 dark:text-gray-100 hover:text-green-700 dark:hover:text-gray-300 flex items-center"
          >
            <FaHeart className="mr-1" />
            Wishlist
          </Link>
          <Link
            href="/addtocard"
            className="text-green-600 dark:text-gray-100 hover:text-green-700 dark:hover:text-gray-300 flex items-center"
          >
            <FaShoppingCart className="mr-1" />
            Cart
          </Link>
          <a
            href="/account"
            onClick={handleAccountClick}
            className="text-green-600 dark:text-gray-100 hover:text-green-700 dark:hover:text-gray-300 flex items-center"
          >
            <FaUser className="mr-1" />
            Account
          </a>
        </div>
        <div className="flex items-center">
          {!isOpen && (
            <>
              <button
                onClick={toggleTheme}
                className="text-gray-900 dark:text-gray-100 focus:outline-none mr-4 md:mr-0"
              >
                {isDarkMode ? (
                  <FaSun className="h-6 w-6" />
                ) : (
                  <FaMoon className="h-6 w-6" />
                )}
              </button>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-900 dark:text-gray-100 focus:outline-none mr-4 md:hidden"
              >
                <FaSearch className="h-6 w-6" />
              </button>
            </>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-900 dark:text-gray-100 focus:outline-none md:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke={isOpen ? "red" : "currentColor"} // Red color for cross, default color otherwise
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              ></path>
            </svg>
          </button>
        </div>
      </div>
      {isSearchOpen && (
        <div className="flex items-center p-3 border-t border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
          <div className="flex items-center relative w-full">
            <div className="relative group">
              <button className="p-2 h-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-l focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-700 border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition transform hover:scale-105">
                {category || "All Categories"}
              </button>
              <ul className="absolute hidden group-hover:block bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded w-full mt-1 z-50">
                <li
                  onClick={() => setCategory("All Categories")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  All Categories
                </li>
                <li
                  onClick={() => setCategory("Electronics")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Electronics
                </li>
                <li
                  onClick={() => setCategory("Fashion")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Fashion
                </li>
                <li
                  onClick={() => setCategory("Home")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Home
                </li>
                <li
                  onClick={() => setCategory("Beauty")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Beauty
                </li>
                <li
                  onClick={() => setCategory("Sports")}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  Sports
                </li>
              </ul>
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="p-6 h-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-700 rounded-r"
            />
            <button className="absolute right-0 top-1 mt-2 mr-2">
              <FaSearch className="h-4 w-4 text-gray-900 dark:text-gray-100" />
            </button>
          </div>
        </div>
      )}
      {isOpen && (
        <div className="md:hidden">
          <div className="flex flex-col space-y-2 mt-2 p-2">
           
            <Link
              href="/compare"
              className="text-green-600 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 flex items-center mt-2"
            >
              <FaBalanceScale className="mr-1" />
              Compare
            </Link>
            <Link
              href="/wishlist"
              className="text-green-600 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 flex items-center"
            >
              <FaHeart className="mr-1" />
              Wishlist
            </Link>
            <Link
              href="/addtocard"
              className="text-green-600 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 flex items-center"
            >
              <FaShoppingCart className="mr-1" />
              Cart
            </Link>
            <Link
              href="/account"
              className="text-green-600 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 flex items-center"
            >
              <FaUser className="mr-1" />
              Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
