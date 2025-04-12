import { useState } from "react";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";


interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
  color?: string;
  filledColor?: string;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = 5,
  color = "gray",
  filledColor = "orange",
  readOnly = false,
}) => {
  const [hover, setHover] = useState(0); // Temporary hover rating

  const handleMouseMove = (event: React.MouseEvent, ratingValue: number) => {
    const { clientX, currentTarget } = event;
    const { left, width } = currentTarget.getBoundingClientRect();
    const isHalf = clientX - left < width / 2;
    setHover(isHalf ? ratingValue - 0.5 : ratingValue);
  };

  const handleClick = (event: React.MouseEvent, ratingValue: number) => {
    if (readOnly || !onChange) return; // Ignore clicks in read-only mode

    const { clientX, currentTarget } = event;
    const { left, width } = currentTarget.getBoundingClientRect();
    const isHalf = clientX - left < width / 2;
    const newRating = isHalf ? ratingValue - 0.5 : ratingValue;
    onChange(newRating);
  };



  
    return  <div className="flex gap-1 !m-0">
    {[1, 2, 3, 4, 5].map((ratingValue) => {
      const isFull = value >= ratingValue;
      const isHalf = value === ratingValue - 0.5;

      return (
        <div
          key={ratingValue}
          className={`relative ${readOnly ? "" : "cursor-pointer"}`}
          onClick={(event) => handleClick(event, ratingValue)}
        >
          {isFull ? (
            <IoStar className={`w-${size} h-${size}`} style={{ color: filledColor }} />
          ) : isHalf ? (
            <IoStarHalf className={`w-${size} h-${size}`} style={{ color: filledColor }} />
          ) : (
            <IoStarOutline className={`w-${size} h-${size}`} style={{ color }} />
          )}
        </div>
      );
    })}
  </div>;
  };
  
  export default StarRating;