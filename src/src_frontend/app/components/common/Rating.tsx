import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";

interface StarRatingProps {
  rating: number;
}

const StarRating = ({ rating }: StarRatingProps) => {
    const renderStars = () => {
      const stars = [];
      const fullStars = Math.floor(rating); // Full stars
      const hasHalfStar = rating % 1 !== 0; // Check if there is a half star
      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars
  
      // Add full stars
      for (let i = 0; i < fullStars; i++) {
        stars.push(<IoStar key={`full-${i}`} className="text-[#FABB42]" />);
      }
  
      // Add half star if applicable
      if (hasHalfStar) {
        stars.push(<IoStarHalf key="half" className="text-[#FABB42]" />);
      }
  
      // Add empty stars
      for (let i = 0; i < emptyStars; i++) {
        stars.push(<IoStarOutline key={`empty-${i}`} className="text-[#FABB42]" />);
      }
  
      return stars;
    };
  
    return <div className="flex justify-center lg:justify-start gap-1">{renderStars()}</div>;
  };
  
  export default StarRating;