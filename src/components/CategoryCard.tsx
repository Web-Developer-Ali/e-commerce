import Image from 'next/image';
import React from 'react';

interface CategoryCardProps {
  imageSrc: string;
  altText: string;
  title: string;
  linkHref: string;
  bgColor: string; // Background color prop
  imageWidth: number;  // Added width property
  imageHeight: number; // Added height property
}

function CategoryCard({
  imageSrc,
  altText,
  title,
  linkHref,
  bgColor,
  imageWidth,  // Added width property
  imageHeight, // Added height property
}: CategoryCardProps) {
  return (
    <div
      className={`w-40 ${bgColor} ml-6 border border-gray-200 rounded-lg shadow transform transition duration-300 hover:scale-105`}
    >
      <a href={linkHref} className="flex justify-center">
        <Image
          className="w-32 h-20 rounded-t-lg object-contain"
          src={imageSrc}
          alt={altText}
          width={imageWidth}   // Added width property
          height={imageHeight} // Added height property
        />
      </a>
      <div className="p-2">
        <a href={linkHref}>
          <h5 className="mb-1 text-base font-bold tracking-tight text-gray-900">
            {title}
          </h5>
        </a>
      </div>
    </div>
  );
}

export default CategoryCard;
