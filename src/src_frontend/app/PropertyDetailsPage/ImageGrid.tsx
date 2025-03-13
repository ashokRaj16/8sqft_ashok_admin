import { ReusableCarousel } from "@/Compound-component/Reusable-Carousel";
import Image from "next/image";
import React, { useState } from "react";
import { useMediaQuery } from "usehooks-ts";

// ✅ Define Image Interface
interface ImageProps {
  url: string;
}

// ✅ Props Interface
interface ImageGridProps {
  images?: ImageProps[];
}

// ✅ Default Placeholder Images
const defaultImages: ImageProps[] = [
  { url: "https://via.placeholder.com/300x200" },
  { url: "https://via.placeholder.com/300x200" },
  { url: "https://via.placeholder.com/300x200" },
];

const ImageGrid: React.FC<ImageGridProps> = ({ images = defaultImages }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0); // State to track the active image index
  const displayedImages = images?.slice(0, 3); // Show first 3 images
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Function to open modal when an image is clicked
  const handleImageClick = (index: number) => {
    setActiveImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full h-full">
      {isModalOpen && (
        // ✅ Modal for Desktop View Carousel
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center 
          "
          onClick={handleCloseModal}
        >
          <div
            className="relative w-[90vw] h-[80vh] bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent click from closing the modal when inside
          >
            {/* Close Button */}
            <button
              className="fixed top-10 right-14 text-white bg-opacity-50 p-2 rounded-full"
              onClick={()=>setIsModalOpen(false)}
            >
              ✕
            </button>

            {/* Carousel Box */}
            <div className="h-full w-full">
              <ReusableCarousel>
                {images?.map((image, index) => (
                  <div
                    key={index}
                    className="w-[80vw] h-[80vh] flex justify-center items-center p-10"
                  >
                    <Image
                      src={image.url}
                      alt={`Image ${index + 1}`}
                      width={800} // Adjust width and height to ensure image is full
                      height={600}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                ))}
              </ReusableCarousel>
            </div>
          </div>
        </div>
      )}

      {isMobile ? (
        // ✅ Mobile View: Carousel
        <ReusableCarousel>
          {images?.map((image, index) => (
            <div
              key={index}
              className="w-[80vw] h-[40vh] flex justify-center items-center"
              onClick={() => handleImageClick(index)} // Handle click to open in modal
            >
              <Image
                src={image.url}
                alt={`Image ${index + 1}`}
                width={500}
                height={400}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          ))}
        </ReusableCarousel>
      ) : (
        // ✅ Desktop View: Grid
        <div className="grid grid-cols-3 grid-rows-2 gap-2 rounded-lg overflow-hidden h-80">
          {/* First Large Image */}
          {displayedImages[0] && (
            <div
              className="col-span-2 row-span-2"
              onClick={() => handleImageClick(0)} // Handle click to open in modal
            >
              <Image
                src={displayedImages[0].url}
                alt="Primary Image"
                width={500}
                height={400}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}

          {/* Second Image */}
          {displayedImages[1] && (
            <div
              className="col-span-1 row-span-1"
              onClick={() => handleImageClick(1)} // Handle click to open in modal
            >
              <Image
                src={displayedImages[1].url}
                alt="Secondary Image"
                width={500}
                height={400}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}

          {/* Third Image with Counter */}
          {displayedImages[2] && (
            <div
              className="col-span-1 row-span-1 relative"
              onClick={() => handleImageClick(2)} // Handle click to open in modal
            >
              <Image
                src={displayedImages[2].url}
                alt="Tertiary Image"
                width={500}
                height={400}
                className="w-full h-full object-cover rounded-lg"
              />
              {images.length > 3 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <span className="text-white text-lg font-medium">
                    +{images.length - 3}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
