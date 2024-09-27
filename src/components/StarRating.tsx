import React from "react";

type StarRatingProps = {
  rating: number;
  maxStars?: number;
};

const StarRating: React.FC<StarRatingProps> = ({ rating, maxStars = 5 }) => {
  const stars = Array.from({ length: maxStars }, (_, index) => index + 1);

  return (
    <div className="flex items-center">
      {stars.map((star) => {
        const starRatingClass =
          star <= rating
            ? "text-yellow-500"
            : star === Math.ceil(rating) && rating % 1 !== 0
            ? "text-yellow-500 half-star"
            : "text-gray-300 dark:text-gray-600";

        return (
          <svg
            key={star}
            className={`h-5 w-5 ${starRatingClass}`}
            xmlns="http://www.w3.org/2000/svg"
            fill={star <= rating ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 17.27l-6.18 3.73 1.64-7.19L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.57 1.64 7.19z"
            />
            {star === Math.ceil(rating) && rating % 1 !== 0 && (
              <path
                fill="currentColor"
                clipPath="polygon(0 0, 50% 0, 50% 100%, 0% 100%)"
                d="M12 17.27l-6.18 3.73 1.64-7.19L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.57 1.64 7.19z"
              />
            )}
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;
