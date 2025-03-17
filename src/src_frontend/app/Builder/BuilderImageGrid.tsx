// import { ReusableCarousel } from "@/Compound-component/Reusable-Carousel";
// import {BuilderPageReusableCarousel} from "@/Compound-component/BuilderDetails-Reusable-Carousel"
// import { Card, CardContent } from "@/ui/card";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import { useMediaQuery } from "usehooks-ts";
// import { formatPrice } from "./BuilderLayout/overview-mobile";
// import usePdfStore from "@/Store/fileStore";
// import Autoplay from "embla-carousel-autoplay";
// import { Button } from "@/ui/Button";
// import { Phone } from "lucide-react";

// interface ImageProps {
//   url: string;
//   file_type?: string;
//   title?:string;
// }



// interface ImageGridProps {
//   images?: ImageProps[];
// }



// const defaultImages: ImageProps[] = [
//   { url: "https://via.placeholder.com/300x200", file_type: "" },
//   { url: "https://via.placeholder.com/300x200", file_type: "" },
//   { url: "https://via.placeholder.com/300x200", file_type: "" },
// ];



// interface configuration {
//   id: number;
//   unit_type?: string | null;
//   unit_name?: string | null;
//   length?: number;
//   width?: number;
//   carpet_area?: number;
//   carpet_price?: number;
//   width_unit?: string;
//   length_unit?: string;
//   unit_img_url: string;
//   file_type?: string;

// }
// [];

// interface config {
//   img_url: string;
// }



// interface ImageGridProps {
//   images?: ImageProps[];
//   configration: configuration[] | undefined;
//   per_sqft_amount: number | null | undefined;
//   possession_date: string | null | undefined;
//   property_title?: string | null | undefined;
// }




// const BuilderImageGrid: React.FC<ImageGridProps> = ({
//   images = defaultImages,
//   configration,
//   per_sqft_amount,
//   possession_date,
//   property_title,
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   // const [activeImageIndex, setActiveImageIndex] = useState(0);
//   const displayedImages = images?.slice(0, 3);
//   const isMobile = useMediaQuery("(max-width: 640px)");
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const maxCarpetArea = configration
//     ? Math.max(...configration.map((item) => item.carpet_area || 0))
//     : null;

//   const minCarpetArea = configration
//     ? Math.min(...configration.map((item) => item.carpet_area || 0))
//     : null;
//   const minCarpetprice = configration
//     ? Math.min(...configration.map((item) => item.carpet_price || 0))
//     : null;
//   const maxCarpetprice = configration
//     ? Math.min(...configration.map((item) => item.carpet_price || 0))
//     : null;
//   const propertyDetail = [
//     {
//       title: `${minCarpetArea}-${maxCarpetArea} sqft`,
//       subtitle: "Configurations",
//     },
//     {
//       title: `${possession_date}`,
//       subtitle: "Possession Starts",
//     },
//     {
//       title: ` ${formatPrice(Number(per_sqft_amount))}/sq.ft`,
//       subtitle: "Avg. Price",
//     },
//   ];


//   console.log("images", images)

//   const handleImageClick = (index: number) => {
//     setCurrentImageIndex(index);
//     setIsModalOpen(true);
//   };

//   console.log("Current Image Index:", currentImageIndex);


//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };
//   const { setPdfUrl } = usePdfStore();
//   useEffect(() => {
//     images.forEach((image) => {
//       console.log(image);


//       const fileExtension = image.url?.split(".").pop()?.toLowerCase();

//       if (fileExtension === "pdf") {
//         setPdfUrl(image.url);
//       } else {
//         console.warn(`Unsupported or unknown file type for URL: ${image.url}`);
//       }
//     });
//   }, [images, setPdfUrl]);
//   return (
//     <div className="w-full h-full ">
//       {isModalOpen && (

//         <div
//           className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 "
//           onClick={handleCloseModal}
//         >
//           <div
//             className="relative w-[90vw] h-[80vh] bg-black rounded-lg overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="lg:flex flex-row w-full justify-between mt-5  sm: flex flex-row  ">
//               <div className="mx-10 ">
//                 <h1 className="text-2xl font-medium text-white whitespace-wrap">
//                   {property_title || "Property Title"}
//                 </h1>
//                 <div className="text-white text-sm  leading-[22px]">
//                   {`${formatPrice(Number(minCarpetprice))} - ${formatPrice(
//                     Number(maxCarpetprice)
//                   )}`}
//                 </div>
//                 <div className="flex flex-row gap-2 mt-2 flex-wrap sm:flex flex-row gap-2 mt-2 flex-wrap mb-4">
//                   {images?.map((image,index) => (
//                      <button
//                      key={index}
//                      className={`px-3 py-1 text-white border-2 border-primary rounded-full text-sm transition-all duration-300 
//                        ${currentImageIndex === index ? "bg-primary" : "bg-gray-700"}`}
//                        onClick={() => {
//                         setCurrentImageIndex(index);
//                       }}
//                    >
//                      {image.title}
//                    </button>
//                   ))}

//                 </div>

//               </div>
//               <div className="">

//               </div>
//             </div>
//             <button
//               className="fixed top-10 right-14 text-white bg-opacity-50 p-2 rounded-full"
//               onClick={() => setIsModalOpen(false)}
//             >
//               ✕
//             </button>

//             <div className="h-full w-full p-5">
//               <BuilderPageReusableCarousel    >
//                 {images?.map((image, index) => (
//                   <div
//                     key={index}
//                     className="w-[80vw] h-[80vh] flex justify-center items-center  "
//                   >
//                     {image.url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
//                       <Image
//                         src={image.url}
//                         alt={`Image ${index + 1}`}
//                         width={800}
//                         height={800}
//                         className="rounded-lg object-cover w-full h-full"
//                       />
//                     ) : image.url.match(/\.(mp4|webm|ogg)$/i) ? (
//                       <video
//                         src={image.url}
//                         controls
//                         className="rounded-lg w-full h-full"
//                       />
//                     ) : null}
//                   </div>
//                 ))}
//               </BuilderPageReusableCarousel>
//             </div>
//           </div>
//         </div>
//       )}

//       {isMobile ? (
//         <BuilderPageReusableCarousel  className="">
//           {images?.map((image, index) => (
//             <div
//               key={index}
//               className="w-[100vw] h-[60vh] flex "
//               onClick={() => handleImageClick(index)} 
//             >
//               <Image
//                 src={image.url}
//                 alt={`Image ${index + 1}`}
//                 width={500}
//                 height={1000}
//                 className="rounded-lg object-cover w-full h-full"
//               />
//             </div>
//           ))}
//         </BuilderPageReusableCarousel>
//       ) : (
//         <>
//           <div className="grid grid-cols-3 grid-rows-2 gap-2 rounded-lg overflow-hidden h-[50vh]">
//             {displayedImages[0] && (
//               <div
//                 className="col-span-2 row-span-2"
//                 onClick={() => handleImageClick(0)} 
//               >
//                 <Image
//                   src={displayedImages[0].url}
//                   alt="Primary Image"
//                   width={500}
//                   height={400}
//                   className="w-full h-full object-cover rounded-lg"
//                 />
//               </div>
//             )}

//             {displayedImages[1] && (
//               <div
//                 className="col-span-1 row-span-1"
//                 onClick={() => handleImageClick(1)} 
//               >
//                 <Image
//                   src={displayedImages[1].url}
//                   alt="Secondary Image"
//                   width={500}
//                   height={400}
//                   className="w-full h-full object-cover rounded-lg"
//                 />
//               </div>
//             )}

//             {displayedImages[2] && (
//               <div
//                 className="col-span-1 row-span-1 relative"
//                 onClick={() => handleImageClick(2)} 
//               >
//                 <Image
//                   src={displayedImages[2].url}
//                   alt="Tertiary Image"
//                   width={500}
//                   height={400}
//                   className="w-full h-full object-cover rounded-lg"
//                 />
//                 {images.length > 3 && (
//                   <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
//                     <span className="text-white text-lg font-medium">
//                       +{images.length - 3}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="flex h-20 items-start justify-center relative self-stretch w-full bg-white">
//             {propertyDetail.map((detail, index) => (
//               <Card
//                 key={index}
//                 className="w-[266px] h-[71px] rounded-none border-0 shadow-none"
//               >
//                 <CardContent className="flex flex-col items-center gap-0.5 h-full p-0 justify-center border-r-2 border-[#e6e6e6] last:border-r-0">
//                   <div className="text-[#222222] text-base text-center leading-[22px]">
//                     {detail.title}
//                   </div>
//                   <div className="text-[#222222] text-sm text-center font-light">
//                     {detail.subtitle}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default BuilderImageGrid;


// import { BuilderPageReusableCarousel } from "@/Compound-component/BuilderDetails-Reusable-Carousel"
// import Image from "next/image";
// import React, { useState } from "react";
// import { useMediaQuery } from "usehooks-ts";
// import { formatPrice } from "./BuilderLayout/overview-mobile";

// interface ImageProps {
//   url: string;
//   title?: string;
// }

// interface ImageGridProps {
//   images?: ImageProps[];
//   property_title?: string;
// }

// const defaultImages: ImageProps[] = [
//   { url: "https://via.placeholder.com/300x200", title: "Image 1" },
//   { url: "https://via.placeholder.com/300x200", title: "Image 2" },
//   { url: "https://via.placeholder.com/300x200", title: "Image 3" },
// ];

// const BuilderImageGrid: React.FC<ImageGridProps> = ({
//   images = defaultImages,
//   property_title,
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const isMobile = useMediaQuery("(max-width: 640px)");
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const handleImageClick = (index: number) => {
//     setCurrentImageIndex(index);
//     setIsModalOpen(true);
//   };

//   return (
//     <div className="w-full h-full">
//       {isModalOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
//           onClick={() => setIsModalOpen(false)}
//         >
//           <div
//             className="relative w-[90vw] h-[80vh] bg-black rounded-lg overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="mx-10 mt-2">
//               <h1 className="text-2xl font-medium text-white">{property_title || "Property Title"}</h1>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {images?.map((image, index) => (
//                   <button
//                     key={index}
//                     className={`px-3 py-1 text-white border-2 border-primary rounded-full text-sm transition-all duration-300 
//                       ${currentImageIndex === index ? "bg-primary" : "bg-gray-700"}`}
//                     onClick={() => setCurrentImageIndex(index)}
//                   >
//                     {image.title}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <button className="fixed top-10 right-14 text-white p-2 rounded-full" onClick={() => setIsModalOpen(false)}>
//               ✕
//             </button>



//             <div className="h-full w-full flex justify-center items-center  ">
//               <BuilderPageReusableCarousel activeIndex={currentImageIndex} enableAutoplay>
//                 {images?.map((image, index) => (
//                   <div key={index} className="flex justify-center items-center ">
//                     <Image
//                       src={image.url}
//                       alt={`Image ${index + 1}`}
//                       width={500}
//                       height={500}
//                       className="rounded-lg object-contain max-w-full  m-5"
//                     />
//                   </div>
//                 ))}
//               </BuilderPageReusableCarousel>
//             </div>



//           </div>
//         </div>
//       )}

//       {isMobile ? (
//         <BuilderPageReusableCarousel activeIndex={currentImageIndex} enableAutoplay >
//           {images?.map((image, index) => (
//             <div key={index} className="w-[100vw] h-[60vh]" onClick={() => handleImageClick(index)}>
//               <Image src={image.url} alt={`Image ${index + 1}`} width={500} height={1000} className="rounded-lg object-cover w-full h-full" />
//             </div>
//           ))}
//         </BuilderPageReusableCarousel>
//       ) : (
//         <div className="grid grid-cols-3 grid-rows-2 gap-2 rounded-lg overflow-hidden h-[50vh]">
//           {images.slice(0, 3).map((image, index) => (
//             <div key={index} className={`relative ${index === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}`} onClick={() => handleImageClick(index)}>
//               <Image src={image.url} alt={`Image ${index + 1}`} width={500} height={400} className="w-full h-full object-cover rounded-lg" />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BuilderImageGrid;










import { BuilderPageReusableCarousel } from "@/Compound-component/BuilderDetails-Reusable-Carousel";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { formatPrice } from "./BuilderLayout/overview-mobile";
import usePdfStore from "@/Store/fileStore";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import ShareShortlist from "../components/common/ShareShortlist";
import { useParams } from "next/navigation";

interface ImageProps {
  url: string;
  file_type?: string;
  title?: string;
}

interface ImageGridProps {
  images?: ImageProps[];
  configration: configuration[] | undefined;
  per_sqft_amount: number | null | undefined;
  possession_date: string | null | undefined;
  property_title?: string | null | undefined;
  propertyId?: any;
}

const defaultImages: ImageProps[] = [
  { url: "https://via.placeholder.com/300x200", title: "Image 1", file_type: "image" },
  { url: "https://via.placeholder.com/300x200", title: "Image 2", file_type: "image" },
  { url: "https://via.placeholder.com/300x200", title: "Image 3", file_type: "image" },
];

interface configuration {
  id: number;
  unit_type?: string | null;
  unit_name?: string | null;
  length?: number;
  width?: number;
  carpet_area?: number;
  carpet_price?: number;
  width_unit?: string;
  length_unit?: string;
  unit_img_url: string;
  file_type?: string;

}

const BuilderImageGrid: React.FC<ImageGridProps> = ({
  // images = defaultImages,
  // property_title,
  images = defaultImages,
  configration,
  per_sqft_amount,
  possession_date,
  property_title,
  propertyId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { setPdfUrl } = usePdfStore();

  const params = useParams();
  const maxCarpetArea = configration
    ? Math.max(...configration.map((item) => item.carpet_area || 0))
    : null;

  const minCarpetArea = configration
    ? Math.min(...configration.map((item) => item.carpet_area || 0))
    : null;
  const minCarpetprice = configration
    ? Math.min(...configration.map((item) => item.carpet_price || 0))
    : null;
  const maxCarpetprice = configration
    ? Math.max(...configration.map((item) => item.carpet_price || 0))
    : null;

  const propertyDetail = [
    {
      title: `${minCarpetArea}-${maxCarpetArea} sqft`,
      subtitle: "Configurations",
    },
    {
      title: `${possession_date}`,
      subtitle: "Possession Starts",
    },
    {
      title: ` ${formatPrice(Number(per_sqft_amount))}/sq.ft`,
      subtitle: "Avg. Price",
    },
  ];

  // useEffect(() => {

  //   images.forEach((image) => {
  //     const fileExtension = image.url?.split(".").pop()?.toLowerCase();
  //     console.log("pdfff",image.url);
  //     if (fileExtension === "pdf") {
  //       console.log("found")
  //       setPdfUrl(image.url);
  //     }
  //   });
  // }, [images, setPdfUrl]);

  // const { setPdfUrl } = usePdfStore();
  console.log(images, 'property_title')
  useEffect(() => {
    images.forEach((image) => {
      console.log("images:::", image);

      // Extract file extension from the URL
      const fileExtension = image.url?.split(".").pop()?.toLowerCase();

      if (fileExtension === "pdf") {
        setPdfUrl(image.url); // Store PDF URL in Zustand or state
      } else {
        console.warn(`Unsupported or unknown file type for URL: ${image.url}`);
      }
    });
  }, [images, setPdfUrl]);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scroll = useRef<HTMLDivElement | null>(null);



  const handleScroll = (direction: "prev" | "next") => {
    const container = scrollContainerRef.current;

    if (container) {
      const scrollAmount = 300;
      const totalItems = images.length;

      if (direction === "next") {
        // Increment the current image index, and if it reaches the end, loop back
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalItems);
      } else if (direction === "prev") {
        // Decrement the current image index, and if it goes below 0, loop to the end
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
      }

      container.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };



  const [imageSizes, setImageSizes] = useState<Record<number, { width: string; height: string }>>({});

  const [isPlaying, setIsPlaying] = useState(true); // Default: autoplay enabled

  useEffect(() => {
    const loadImages = async () => {
      const sizes: Record<number, { width: string; height: string }> = {};

      await Promise.all(
        images.map((image, index) => {
          return new Promise<void>((resolve) => {
            const img = new window.Image();
            img.src = image.url;
            img.onload = () => {
              console.log("images", imageSizes, img.width, img.height)
              const aspectRatio = img.width / img.height;
              sizes[index] = aspectRatio > 1
                ? { width: "90vw", height: "auto" }  // Landscape
                : { width: "auto", height: "80vh" }; // Portrait
              resolve();
            };
          });
        })
      );

      setImageSizes(sizes);
    };

    loadImages();
  }, [images]);

  const titleMap = new Map();
  images
    ?.filter((item) => !item.url.toLowerCase().endsWith(".pdf"))
    ?.forEach((item, originalIndex) => {
      if (!titleMap.has(item.title)) {
        titleMap.set(item.title, { index: originalIndex, count: 1 });
      } else {
        titleMap.get(item.title).count += 1;
      }
    });
  return (
    <div className="w-full h-full">
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full h-full bg-black rounded-lg overflow-hidden "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-10 mt-2">
              <h1 className="text-2xl font-medium text-white">{property_title || "Property Title"}</h1>

              <div className="text-white text-sm  leading-[22px]">
                {`${formatPrice(Number(minCarpetprice))} - ${formatPrice(
                  Number(maxCarpetprice)
                )}`}
              </div>
              {/* <div className="flex gap-2 mt-2 overflow-x-auto whitespace-nowrap scrollbar-hidden">

                {images?.filter(item => !item.url.toLowerCase().endsWith('.pdf')) // Exclude PDFs
                  ?.map((image, index) => (
                    <button
                      key={index}
                      className={`px-3 py-1 text-white border-2 border-primary rounded-full text-sm transition-all duration-300 
        ${currentImageIndex === index ? "bg-primary" : "bg-gray-700"}`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      {image.title === "Default" ? "Other" : image.title}
                    </button>
                  ))}

              </div> */}
     

<div className="flex gap-2 mt-2 overflow-x-auto whitespace-nowrap scrollbar-hidden">
  {[...titleMap.entries()].map(([title, { index, count }]) => (
    <button
      key={index}
      className={`px-3 py-1 text-white border-2 border-primary rounded-full text-sm transition-all duration-300 
        ${currentImageIndex === index ? "bg-primary" : "bg-gray-700"}`}
      onClick={() => setCurrentImageIndex(index)} 
    >
      {title === "Default" ? "Other" : title} {count > 1 ? `(${count})` : ""}
    </button>
  ))}
</div>

            </div>

            <button className="fixed top-10 right-14 text-white p-2 rounded-full" onClick={() => setIsModalOpen(false)}>
              ✕
            </button>

            <div className=" flex flex-row justify-center items-center ">

              <button className=" shadow-md  m-4 p-2 rounded-full  border-2 border-white" onClick={() => handleScroll("prev")}>
                <ArrowLeft size={18} className="text-white" />
              </button>
                {/* Pause/Play Button */}
  <button 
    className="absolute top-1/2 -translate-y-4 left-3 border-2 border-white p-2 rounded-full"
    onClick={() => setIsPlaying(!isPlaying)}
  >
   {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
  </button>

              <div
                ref={scrollContainerRef}
                className="overflow-x-auto flex no-scrollbar"
              >
                <BuilderPageReusableCarousel activeIndex={currentImageIndex} enableAutoplay={isPlaying}>
                  {images?.filter(item => !item.url.toLowerCase().endsWith('.pdf'))?.map((image, index) => (
                    <div key={index} className="flex justify-center items-center">
                      {image.url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                        <Image
                          src={image.url}
                          alt={`Image ${index + 1}`}
                          // width={Number(imageSizes[index]?.width || 90)}
                          // height={Number(imageSizes[index]?.height || 80)}
                          width={0}
                          height={0}
                          sizes="90vw"
                          className="rounded-lg object-contain max-w-full m-5"
                          style={{ width: imageSizes[index]?.width || '90vw', height: imageSizes[index]?.height || '80vh', maxHeight: '80vh' }}
                        />
                      ) : image.url.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video
                          src={image.url}
                          width={0}
                          height={0}
                          controls
                          className="rounded-lg object-contain max-w-full m-5"
                          style={{ width: imageSizes[index]?.width || '90vw', height: imageSizes[index]?.height || '80vh', maxHeight: '90vh' }}
                        />
                      ) : null}
                    </div>
                  ))}
                </BuilderPageReusableCarousel>
                {/* <BuilderPageReusableCarousel activeIndex={currentImageIndex} enableAutoplay>
                  {images?.map((image, index) => (
                    <div key={index} className="flex justify-center items-center w-full h-full">
                      {image.url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                        <Image src={image.url} alt={`Image ${index + 1}`} width={800} height={600} className="rounded-lg object-cover w-full h-full" />
                      ) : image.url.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video src={image.url} width={800} height={600} controls className="rounded-lg object-cover w-full h-full" />
                      ) : null}
                    </div>
                  ))}
                </BuilderPageReusableCarousel> */}
              </div>
              <button className=" shadow-md p-2 m-4 rounded-full  border-2 border-white" onClick={() => handleScroll("next")}>
                <ArrowRight size={18} className="text-white" />
              </button>

            </div>
          </div>
        </div>
      )}

      {isMobile ? (
       <div className="relatvie">
         <BuilderPageReusableCarousel activeIndex={currentImageIndex} enableAutoplay>
          {images?.filter((i) => i.file_type !== "application/pdf").map((image, index) => (
            <div key={index} className="w-[100vw] h-[60vh]" onClick={() => handleImageClick(index)}>
              {image.url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                <Image
                  src={image.url}
                  alt={`Image ${index + 1}`}
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded-lg object-cover w-[95vw] h-[500px] m-2"
                />
              ) : image.url.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  src={image.url}
                  controls
                  // sizes="(max-width: 768px) 100vw, 50vw"
                  // className="rounded-lg object-cover w-full h-full"
                  className="rounded-lg object-cover w-[95vw] h-[500px] m-2"
                />
              ) : null}
            </div>
          ))}
        </BuilderPageReusableCarousel>

        <div className="absolute right-4 top-3">
            <ShareShortlist
              background={"bg-white"}
              shadow={"shadow-lg"}
              rounded={"rounded-lg"}
              fontSize={"text-xs"}
              textTransform={"uppercase"}
              fontWeight={"font-light"}
              hoverBackground={"hover:bg-primary"}
              hoverTextColor={"hover:text-white"}
              iconColor={"text-primary"}
              iconHoverColor={"group-hover:text-white"}
              propertyId={propertyId}
              propertyIdSlug={params?.id}
              btnSaveText={"Save"}
              showBtnText={false}
               />
          </div>
       </div>
      ) : (
        <div className="grid grid-cols-3 grid-rows-2 gap-2 rounded-lg overflow-hidden h-[50vh] relative">
          {images.filter((i) => i.file_type !== "application/pdf").slice(0, 3).map((image, index) => (
            <div key={index} className={`relative ${index === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}`} onClick={() => handleImageClick(index)}>
              {image.url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                <Image
                  src={image.url}
                  alt={`Image ${index + 1}`}
                  width={500}
                  height={400}
                  className="w-full h-full object-cover rounded-lg" />
              ) : image.url.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  src={image.url}
                  controls
                  className="w-full h-full object-cover rounded-lg" />
              ) : null}
            </div>
          ))}

          <div className="absolute right-4 top-3">
            <ShareShortlist
              background={"bg-white"}
              shadow={"shadow-lg"}
              rounded={"rounded-lg"}
              fontSize={"text-xs"}
              textTransform={"uppercase"}
              fontWeight={"font-light"}
              hoverBackground={"hover:bg-primary"}
              hoverTextColor={"hover:text-white"}
              iconColor={"text-primary"}
              iconHoverColor={"group-hover:text-white"}
              propertyId={propertyId}
              propertyIdSlug={params?.id}
              btnSaveText={"Save"}
              showBtnText={true}
               />
          </div>
        </div>
      )}
    </div>
  );
};

export default BuilderImageGrid;