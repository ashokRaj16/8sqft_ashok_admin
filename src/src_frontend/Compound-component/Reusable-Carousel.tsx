import { Carousel, CarouselContent, CarouselItem } from "@/ui/carousel";
import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface ReusableCarouselProps {
  children: React.ReactNode;
  itemsPerView?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
  enableAutoplay?: boolean;

}

export function ReusableCarousel({
  children,
  itemsPerView = { default: 1, md: 2, lg: 3 },
  className = "",
  enableAutoplay,
}: ReusableCarouselProps) {

  const childrenArray = React.Children.toArray(children);



  // useEffect(() => {
  //   console.log("Received Active Index in Carousel:", activeIndex);
  //   console.log("Embla API:", emblaApi);
  
  //   if (emblaApi) {
  //     console.log("Scrolling to index:", activeIndex);
  //     emblaApi.scrollTo(activeIndex);
  //   } else {
  //     console.warn("emblaApi is not initialized yet!");
  //   }
  // }, [activeIndex, emblaApi]);
  


  return (
    <div className="relative w-full h-full">
      <Carousel
         // Ensure ref is correctly assigned
        className={`relative lg:w-full h-full ${className}`}
        plugins={enableAutoplay ? [Autoplay({ delay: 3000 })] : []}
      >
        <CarouselContent className="flex lg:w-full items-center gap-4 -ml-4">
          {childrenArray.map((child, index) => (
            <CarouselItem key={index} className={`lg:pl-4 basis-1/${itemsPerView.default}`}>
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

// import React, { useEffect, useState, useCallback } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";

// interface ReusableCarouselProps {
//   children: React.ReactNode;
//   itemsPerView?: {
//     default: number;
//     sm?: number;
//     md?: number;
//     lg?: number;
//     xl?: number;
//   };
//   className?: string;
//   enableAutoplay?: boolean;
//   activeIndex?: number;
// }

// export function ReusableCarousel({
//   children,
//   itemsPerView = { default: 1, md: 2, lg: 3 },
//   className = "",
//   enableAutoplay = false,
//   activeIndex = 0,
// }: ReusableCarouselProps) {
//   const childrenArray = React.Children.toArray(children);
//   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

//   // Scroll to active image when `activeIndex` updates
//   useEffect(() => {
//     if (emblaApi) {
//       console.log("📸 Scrolling to image index:", activeIndex);
//       emblaApi.scrollTo(activeIndex, true);
//     }
//   }, [activeIndex, emblaApi]);

//   return (
//     <div className="relative w-full h-full">
//       <div
//         ref={emblaRef} // Assign Embla ref for scrolling
//         className={`overflow-hidden w-full ${className}`}
//       >
//         <div className="flex gap-4">
//           {childrenArray.map((child, index) => (
//             <div key={index} className={`flex-shrink-0 w-full basis-1/${itemsPerView.default}`}>
//               {child}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
