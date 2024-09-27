"use client";
import { useEffect } from "react";
import Image from "next/image";
import image1 from "../../public/crausel1.jpeg";
import image2 from "../../public/crausel2.jpeg";
import image3 from "../../public/crausel3.webp";
import image4 from "../../public/crausel4.jpeg";

function Carousel() {
  useEffect(() => {
    let index = 0;
    const items = document.querySelectorAll("[data-carousel-item]");
    const totalItems = items.length;
    let interval: NodeJS.Timeout;

    const showSlide = (i: number) => {
      items.forEach((item, idx) => {
        if (idx === i) {
          item.classList.remove("opacity-0", "hidden");
          item.classList.add("opacity-100", "block");
        } else {
          item.classList.add("opacity-0", "hidden");
          item.classList.remove("opacity-100", "block");
        }
      });
    };

    const nextSlide = () => {
      index = (index + 1) % totalItems;
      showSlide(index);
    };

    const prevSlide = () => {
      index = (index - 1 + totalItems) % totalItems;
      showSlide(index);
    };

    const startAutoSlide = () => {
      interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    };

    const stopAutoSlide = () => {
      clearInterval(interval);
    };

    const nextButton = document.querySelector("[data-carousel-next]");
    const prevButton = document.querySelector("[data-carousel-prev]");

    nextButton?.addEventListener("click", () => {
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    });
    prevButton?.addEventListener("click", () => {
      stopAutoSlide();
      prevSlide();
      startAutoSlide();
    });

    // Initialize the first slide
    showSlide(index);
    startAutoSlide();

    // Clean up event listeners and interval on unmount
    return () => {
      nextButton?.removeEventListener("click", nextSlide);
      prevButton?.removeEventListener("click", prevSlide);
      stopAutoSlide();
    };
  }, []);

  return (
    <div id="controls-carousel" className="relative w-full" data-carousel="static">
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        <div className="block opacity-100 duration-700 ease-in-out" data-carousel-item>
          <Image
            src={image1}
            alt="Slide 1"
            width={1920}
            height={1080}
            priority // Loads image faster and with better quality
            className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          />
        </div>

        <div className="hidden opacity-0 duration-700 ease-in-out" data-carousel-item>
          <Image
            src={image2}
            alt="Slide 2"
            width={1920}
            height={1080}
            priority
            className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          />
        </div>

        <div className="hidden opacity-0 duration-700 ease-in-out" data-carousel-item>
          <Image
            src={image3}
            alt="Slide 3"
            width={1920}
            height={1080}
            priority
            className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          />
        </div>

        <div className="hidden opacity-0 duration-700 ease-in-out" data-carousel-item>
          <Image
            src={image4}
            alt="Slide 4"
            width={1920}
            height={1080}
            priority
            className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          />
        </div>
      </div>

      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-prev
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        data-carousel-next
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
}

export default Carousel;
