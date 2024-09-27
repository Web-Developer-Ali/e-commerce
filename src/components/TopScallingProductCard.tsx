import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHeart } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

interface ProductCardProps {
  imageSrc: string;
  title: string;
  price: string;
  discountedPrice: string;
  ProductScaller: string;
  rating: number;
  imageWidth: number;  // Added width property
  imageHeight: number; // Added height property
}

function TopScallingProductCard({
  imageSrc,
  title,
  price,
  discountedPrice,
  ProductScaller,
  rating,
  imageWidth,  // Added width property
  imageHeight, // Added height property
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="max-w-80 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600 flex relative cursor-pointer mb-4">
      <Image
        className="w-1/3 h-24 object-cover rounded-l-lg mt-4"
        src={imageSrc}
        alt="Product Picture"
        width={imageWidth}   // Added width property
        height={imageHeight} // Added height property
      />
      <div className="p-4 flex flex-col justify-between w-2/3">
        <div>
          <h5 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
            {title}
          </h5>
          <div className="flex items-center mb-2">
            {Array.from({ length: 5 }, (_, index) => (
              <FontAwesomeIcon
                key={index}
                icon={faStar}
                className={`text-yellow-400 ${index < rating ? 'opacity-100' : 'opacity-50'}`}
                size="sm"
              />
            ))}
          </div>
          <p className="mb-2 text-xs text-gray-700 dark:text-gray-400">
            Product By <span className="text-green-500">{ProductScaller}</span>
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-green-500">
            {discountedPrice}
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white line-through">
            {price}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TopScallingProductCard;
