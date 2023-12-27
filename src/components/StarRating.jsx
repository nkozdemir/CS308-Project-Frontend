// Updated StarRating component
import { useState } from "react";

// eslint-disable-next-line react/prop-types
const StarRating = ({ onStarClick, disabled }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  return (
    <div>
      {[...Array(5)].map((star, index) => {
        const starValue = index + 1;

        return (
          <span
            key={index}
            style={{ cursor: disabled ? "not-allowed" : "pointer" }}
            onClick={() => !disabled && onStarClick(starValue)}
            onMouseEnter={() => !disabled && setHover(starValue)}
            onMouseLeave={() => !disabled && setHover(null)}
          >
            {starValue <= (hover || rating) ? "★" : "☆"}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
