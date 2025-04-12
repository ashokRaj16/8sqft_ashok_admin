// import { BuilderPageReusableCarousel } from "@/Compound-component/BuilderDetails-Reusable-Carousel";
// import Image from "next/image";
// import React, { useEffect, useRef, useState } from "react";
// import { useMediaQuery } from "usehooks-ts";
// import { formatPrice } from "./BuilderLayout/overview-mobile";
// import usePdfStore from "@/Store/fileStore";
// import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
// import ShareShortlist from "../components/common/ShareShortlist";
// import { useParams } from "next/navigation";

// interface ImageProps {
//   url: string;
//   file_type?: string;
//   title?: string;
// }

// interface ImageGridProps {
//   images?: ImageProps[];
//   configration: configuration[] | undefined;
//   per_sqft_amount: number | null | undefined;
//   possession_date: string | null | undefined;
//   property_title?: string | null | undefined;
//   propertyId?: any;
// }

// const defaultImages: ImageProps[] = [
//   { url: "https://via.placeholder.com/300x200", title: "Image 1", file_type: "image" },
//   { url: "https://via.placeholder.com/300x200", title: "Image 2", file_type: "image" },
//   { url: "https://via.placeholder.com/300x200", title: "Image 3", file_type: "image" },
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

// const BuilderImageGrid: React.FC<ImageGridProps> = ({
//   // images = defaultImages,
//   // property_title,
//   images = defaultImages,
//   configration,
//   per_sqft_amount,
//   possession_date,
//   property_title,
//   propertyId,
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const isMobile = useMediaQuery("(max-width: 640px)");
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const { setPdfUrl } = usePdfStore();

//   const params = useParams();
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
//     ? Math.max(...configration.map((item) => item.carpet_price || 0))
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

//   // useEffect(() => {

//   //   images.forEach((image) => {
//   //     const fileExtension = image.url?.split(".").pop()?.toLowerCase();
//   //     console.log("pdfff",image.url);
//   //     if (fileExtension === "pdf") {
//   //       console.log("found")
//   //       setPdfUrl(image.url);
//   //     }
//   //   });
//   // }, [images, setPdfUrl]);

//   // const { setPdfUrl } = usePdfStore();
//   console.log(images, 'property_title')
//   useEffect(() => {
//     images.forEach((image) => {
//       console.log("images:::", image);

//       // Extract file extension from the URL
//       const fileExtension = image.url?.split(".").pop()?.toLowerCase();

//       if (fileExtension === "pdf") {
//         setPdfUrl(image.url); // Store PDF URL in Zustand or state
//       } else {
//         console.warn(`Unsupported or unknown file type for URL: ${image.url}`);
//       }
//     });
//   }, [images, setPdfUrl]);

//   const handleImageClick = (index: number) => {
//     setCurrentImageIndex(index);
//     setIsModalOpen(true);
//   };

//   const scrollContainerRef = useRef<HTMLDivElement | null>(null);
//   const scroll = useRef<HTMLDivElement | null>(null);

//   const handleScroll = (direction: "prev" | "next") => {
//     const container = scrollContainerRef.current;

//     if (container) {
//       const scrollAmount = 300;
//       const totalItems = images.length;

//       if (direction === "next") {
//         // Increment the current image index, and if it reaches the end, loop back
//         setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalItems);
//       } else if (direction === "prev") {
//         // Decrement the current image index, and if it goes below 0, loop to the end
//         setCurrentImageIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
//       }

//       container.scrollBy({
//         left: direction === "next" ? scrollAmount : -scrollAmount,
//         behavior: "smooth",
//       });
//     }
//   };

//   const [imageSizes, setImageSizes] = useState<Record<number, { width: string; height: string }>>({});

//   const [isPlaying, setIsPlaying] = useState(true); // Default: autoplay enabled

//   useEffect(() => {
//     const loadImages = async () => {
//       const sizes: Record<number, { width: string; height: string }> = {};

//       await Promise.all(
//         images.map((image, index) => {
//           return new Promise<void>((resolve) => {
//             const img = new window.Image();
//             img.src = image.url;
//             img.onload = () => {
//               console.log("images", imageSizes, img.width, img.height)
//               const aspectRatio = img.width / img.height;
//               sizes[index] = aspectRatio > 1
//                 ? { width: "90vw", height: "auto" }  // Landscape
//                 : { width: "auto", height: "80vh" }; // Portrait
//               resolve();
//             };
//           });
//         })
//       );

//       setImageSizes(sizes);
//     };

//     loadImages();
//   }, [images]);

//   const titleMap = new Map();
//   images
//     ?.filter((item) => !item.url.toLowerCase().endsWith(".pdf"))
//     ?.forEach((item, originalIndex) => {
//       if (!titleMap.has(item.title)) {
//         titleMap.set(item.title, { index: originalIndex, count: 1 });
//       } else {
//         titleMap.get(item.title).count += 1;
//       }
//     });
//   return (
//     <div className="w-full h-full">
//       {isModalOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]"
//           onClick={() => setIsModalOpen(false)}
//         >
//           <div
//             className="relative w-full h-full bg-black rounded-lg overflow-hidden "
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="mx-10 mt-2">
//               <h1 className="text-2xl font-medium text-white">{property_title || "Property Title"}</h1>

//               <div className="text-white text-sm  leading-[22px]">
//                 {`${formatPrice(Number(minCarpetprice))} - ${formatPrice(
//                   Number(maxCarpetprice)
//                 )}`}
//               </div>
//               {/* <div className="flex gap-2 mt-2 overflow-x-auto whitespace-nowrap scrollbar-hidden">

//                 {images?.filter(item => !item.url.toLowerCase().endsWith('.pdf')) // Exclude PDFs
//                   ?.map((image, index) => (
//                     <button
//                       key={index}
//                       className={`px-3 py-1 text-white border-2 border-primary rounded-full text-sm transition-all duration-300
//         ${currentImageIndex === index ? "bg-primary" : "bg-gray-700"}`}
//                       onClick={() => setCurrentImageIndex(index)}
//                     >
//                       {image.title === "Default" ? "Other" : image.title}
//                     </button>
//                   ))}

//               </div> */}

// <div className="flex gap-2 mt-2 overflow-x-auto whitespace-nowrap scrollbar-hidden">
//   {[...titleMap.entries()].map(([title, { index, count }]) => (
//     <button
//       key={index}
//       className={`px-3 py-1 text-white border-2 border-primary rounded-full text-sm transition-all duration-300
//         ${currentImageIndex === index ? "bg-primary" : "bg-gray-700"}`}
//       onClick={() => setCurrentImageIndex(index)}
//     >
//       {title === "Default" ? "Other" : title} {count > 1 ? `(${count})` : ""}
//     </button>
//   ))}
// </div>

//             </div>

//             <button className="fixed top-10 right-14 text-white p-2 rounded-full" onClick={() => setIsModalOpen(false)}>
//               ✕
//             </button>

//             <div className=" flex flex-row justify-center items-center ">

//               <button className=" shadow-md  m-4 p-2 rounded-full  border-2 border-white" onClick={() => handleScroll("prev")}>
//                 <ArrowLeft size={18} className="text-white" />
//               </button>
//                 {/* Pause/Play Button */}
//   <button
//     className="absolute top-1/2 -translate-y-4 left-3 border-2 border-white p-2 rounded-full"
//     onClick={() => setIsPlaying(!isPlaying)}
//   >
//    {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
//   </button>

//               <div
//                 ref={scrollContainerRef}
//                 className="overflow-x-auto flex no-scrollbar"
//               >
//                 <BuilderPageReusableCarousel activeIndex={currentImageIndex} enableAutoplay={isPlaying}>
//                   {images?.filter(item => !item.url.toLowerCase().endsWith('.pdf'))?.map((image, index) => (
//                     <div key={index} className="flex justify-center items-center">
//                       {image.url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
//                         <Image
//                           src={image.url}
//                           alt={`Image ${index + 1}`}
//                           // width={Number(imageSizes[index]?.width || 90)}
//                           // height={Number(imageSizes[index]?.height || 80)}
//                           width={0}
//                           height={0}
//                           sizes="90vw"
//                           className="rounded-lg object-contain max-w-full m-5"
//                           style={{ width: imageSizes[index]?.width || '90vw', height: imageSizes[index]?.height || '80vh', maxHeight: '80vh' }}
//                         />
//                       ) : image.url.match(/\.(mp4|webm|ogg)$/i) ? (
//                         <video
//                           src={image.url}
//                           width={0}
//                           height={0}
//                           controls
//                           className="rounded-lg object-contain max-w-full m-5"
//                           style={{ width: imageSizes[index]?.width || '90vw', height: imageSizes[index]?.height || '80vh', maxHeight: '90vh' }}
//                         />
//                       ) : null}
//                     </div>
//                   ))}
//                 </BuilderPageReusableCarousel>
//                 {/* <BuilderPageReusableCarousel activeIndex={currentImageIndex} enableAutoplay>
//                   {images?.map((image, index) => (
//                     <div key={index} className="flex justify-center items-center w-full h-full">
//                       {image.url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
//                         <Image src={image.url} alt={`Image ${index + 1}`} width={800} height={600} className="rounded-lg object-cover w-full h-full" />
//                       ) : image.url.match(/\.(mp4|webm|ogg)$/i) ? (
//                         <video src={image.url} width={800} height={600} controls className="rounded-lg object-cover w-full h-full" />
//                       ) : null}
//                     </div>
//                   ))}
//                 </BuilderPageReusableCarousel> */}
//               </div>
//               <button className=" shadow-md p-2 m-4 rounded-full  border-2 border-white" onClick={() => handleScroll("next")}>
//                 <ArrowRight size={18} className="text-white" />
//               </button>

//             </div>
//           </div>
//         </div>
//       )}

//       {isMobile ? (
//        <div className="relatvie">
//          <BuilderPageReusableCarousel activeIndex={currentImageIndex} enableAutoplay>
//           {images?.filter((i) => i.file_type !== "application/pdf").map((image, index) => (
//             <div key={index} className="w-[100vw] h-[60vh]" onClick={() => handleImageClick(index)}>
//               {image.url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
//                 <Image
//                   src={image.url}
//                   alt={`Image ${index + 1}`}
//                   width={0}
//                   height={0}
//                   sizes="(max-width: 768px) 100vw, 50vw"
//                   className="rounded-lg object-cover w-[95vw] h-[500px] m-2"
//                 />
//               ) : image.url.match(/\.(mp4|webm|ogg)$/i) ? (
//                 <video
//                   src={image.url}
//                   controls
//                   // sizes="(max-width: 768px) 100vw, 50vw"
//                   // className="rounded-lg object-cover w-full h-full"
//                   className="rounded-lg object-cover w-[95vw] h-[500px] m-2"
//                 />
//               ) : null}
//             </div>
//           ))}
//         </BuilderPageReusableCarousel>

//         <div className="absolute right-4 top-3">
//             <ShareShortlist
//               background={"bg-white"}
//               shadow={"shadow-lg"}
//               rounded={"rounded-lg"}
//               fontSize={"text-xs"}
//               textTransform={"uppercase"}
//               fontWeight={"font-light"}
//               hoverBackground={"hover:bg-primary"}
//               hoverTextColor={"hover:text-white"}
//               iconColor={"text-primary"}
//               iconHoverColor={"group-hover:text-white"}
//               propertyId={propertyId}
//               propertyIdSlug={params?.id}
//               btnSaveText={"Save"}
//               showBtnText={false}
//                />
//           </div>
//        </div>
//       ) : (
//         // <div className="grid grid-cols-3 grid-rows-2 gap-2 rounded-lg overflow-hidden h-[50vh] relative">
//         //   {images.filter((i) => i.file_type !== "application/pdf").slice(0, 3).map((image, index) => (
//         //     <div key={index} className={`relative ${index === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}`} onClick={() => handleImageClick(index)}>
//         //       {image.url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
//         //         <Image
//         //           src={image.url}
//         //           alt={`Image ${index + 1}`}
//         //           width={500}
//         //           height={400}
//         //           className="w-full h-full object-cover rounded-lg" />
//         //       ) : image.url.match(/\.(mp4|webm|ogg)$/i) ? (
//         //         <video
//         //           src={image.url}
//         //           controls
//         //           className="w-full h-full object-cover rounded-lg" />
//         //       ) : null}
//         //     </div>
//         //   ))}
//         <div className="grid grid-cols-3 grid-rows-2 gap-2 rounded-lg overflow-hidden h-[50vh] relative">
//   {images
//     .filter((i) => i.file_type !== "application/pdf")
//     .slice(0, 3)
//     .map((image, index) => (
//       <div
//         key={index}
//         className={`relative ${index === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}`}
//         onClick={() => handleImageClick(index)}
//       >
//         {image.url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
//           <Image
//             src={image.url}
//             alt={`Image ${index + 1}`}
//             width={500}
//             height={400}
//             className="w-full h-full object-cover rounded-lg"
//           />
//         ) : image.url.match(/\.(mp4|webm|ogg)$/i) ? (
//           <video src={image.url} controls className="w-full h-full object-cover rounded-lg" />
//         ) : null}

//         {/* Overlay for last column if there are more images */}
//         {index === 2 && images.length > 3 && (
//           <div className="absolute cursor-pointer inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-medium rounded-lg">
//             {images.length - 3}+ More
//           </div>
//         )}
//       </div>
//     ))}

//           <div className="absolute right-4 top-3">
//             <ShareShortlist
//               background={"bg-white"}
//               shadow={"shadow-lg"}
//               rounded={"rounded-lg"}
//               fontSize={"text-xs"}
//               textTransform={"uppercase"}
//               fontWeight={"font-light"}
//               hoverBackground={"hover:bg-primary"}
//               hoverTextColor={"hover:text-white"}
//               iconColor={"text-primary"}
//               iconHoverColor={"group-hover:text-white"}
//               propertyId={propertyId}
//               propertyIdSlug={params?.id}
//               btnSaveText={"Save"}
//               showBtnText={true}
//                />
//           </div>
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
import { ArrowLeft, ArrowRight, ImageIcon, Pause, Play } from "lucide-react";
import ShareShortlist from "../components/common/ShareShortlist";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import type SwiperType from "swiper";
import { FaLongArrowAltLeft } from "react-icons/fa";
import MobileGallery from "./MobileGallery";
import { IoImagesOutline } from "react-icons/io5";
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
  {
    url: "https://via.placeholder.com/300x200",
    title: "Image 1",
    file_type: "image",
  },
  {
    url: "https://via.placeholder.com/300x200",
    title: "Image 2",
    file_type: "image",
  },
  {
    url: "https://via.placeholder.com/300x200",
    title: "Image 3",
    file_type: "image",
  },
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

  useEffect(() => {
    images.forEach((image) => {
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

  const [imageSizes, setImageSizes] = useState<
    Record<number, { width: string; height: string }>
  >({});

  useEffect(() => {
    const loadImages = async () => {
      const sizes: Record<number, { width: string; height: string }> = {};

      await Promise.all(
        images.map((image, index) => {
          return new Promise<void>((resolve) => {
            const img = new window.Image();
            img.src = image.url;
            img.onload = () => {
              const aspectRatio = img.width / img.height;
              sizes[index] =
                aspectRatio > 1
                  ? { width: "90vw", height: "auto" } // Landscape
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

  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);

  // Preserve original indexes while filtering
  const filteredImages = images
    ?.map((item, originalIndex) => ({ ...item, originalIndex }))
    ?.filter((item) => !item.url.toLowerCase().endsWith(".pdf"));
  // console.log(filteredImages,'filteredImages')
  // Sync Swiper with currentImageIndex
  useEffect(() => {
    if (swiperRef && !swiperRef.destroyed) {
      swiperRef.slideTo(currentImageIndex);
    }
  }, [currentImageIndex, swiperRef]);

  // Create title map using original indexes
  const titleMap = new Map();
  images?.forEach((image, originalIndex) => {
    const title = image.title || "Default";
    if (!titleMap.has(title)) {
      titleMap.set(title, { index: originalIndex, count: 0 });
    }
    titleMap.get(title).count++;
  });

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
    swiperRef?.autoplay?.stop();
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
    swiperRef?.autoplay?.start();
  };
  return (
    <div className="w-full h-full">
      {isModalOpen && (
        <div className="block lg:hidden bg-white fixed inset-0 items-center justify-center z-50 p-4">
          <label
            onClick={() => setIsModalOpen(false)}
            className=" flex gap-2 items-center"
          >
            <FaLongArrowAltLeft />
            Gallery
          </label>
          <MobileGallery filteredImages={filteredImages} />
        </div>
      )}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 lg:flex items-center justify-center lg:z-[9999] hidden"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full h-full bg-black rounded-lg overflow-hidden "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-10 mt-2">
              <h1 className="text-2xl font-medium text-white">
                {property_title || "Property Title"}
              </h1>

              <div className="text-white text-sm  leading-[22px]">
                {`${formatPrice(Number(minCarpetprice))} - ${formatPrice(
                  Number(maxCarpetprice)
                )}`}
              </div>

              <div className="flex gap-2 mt-2 overflow-x-auto whitespace-nowrap scrollbar-hidden">
                {[...titleMap.entries()].map(
                  ([title, { index: firstIndex, count }]) => {
                    // Get all indexes for this category
                    const categoryIndexes = filteredImages
                      .map((img, idx) => (img.title === title ? idx : null))
                      .filter((idx) => idx !== null);

                    // Check if current slide belongs to this title
                    const isActiveCategory =
                      categoryIndexes.includes(currentImageIndex);

                    return (
                      <button
                        key={firstIndex}
                        className={`px-3 py-1 text-white border-2 border-primary rounded-full lg:text-sm text-xs transition-all duration-300 
          ${isActiveCategory ? "bg-primary" : ""}`}
                        onClick={() => {
                          // Find the first filtered index that matches this category
                          const targetIndex = filteredImages.findIndex(
                            (item) => item.title === title
                          );
                          if (targetIndex !== -1) {
                            setCurrentImageIndex(targetIndex);
                          }
                        }}
                      >
                        {title === "Default" ? "Other" : title}
                        {count > 1 ? `(${count})` : ""}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <button
              className="fixed top-0 right-10 text-white text-lg p-2 rounded-full"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            <div className="  mt-2">
              <Swiper
                autoHeight={true}
                onSwiper={setSwiperRef}
                initialSlide={currentImageIndex}
                modules={[Autoplay, Navigation, Pagination, EffectCoverflow]}
                effect={isMobile ? undefined : "coverflow"}
                grabCursor={!isMobile && !isVideoPlaying}
                centeredSlides={!isMobile}
                slidesPerView={isMobile ? 1 : "auto"}
                coverflowEffect={
                  isMobile
                    ? undefined
                    : {
                        rotate: 0,
                        stretch: 80,
                        depth: 250,
                        modifier: 1,
                        slideShadows: true,
                      }
                }
                speed={1000}
                autoplay={
                  isVideoPlaying
                    ? false // Disable autoplay while video is playing
                    : {
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }
                }
                navigation={!isMobile}
                pagination={{
                  type: "progressbar",
                }}
                allowTouchMove={!isVideoPlaying} // Prevent slide movement while video is playing
                onSlideChange={(swiper) =>
                  setCurrentImageIndex(swiper.activeIndex)
                }
                className={isMobile ? "mobile-swiper" : "blur-swiper"}
              >
                {filteredImages?.map((image, filteredIndex) => (
                  <SwiperSlide
                    key={filteredIndex}
                    className={
                      isMobile
                        ? ""
                        : "!w-[65%] transition-transform duration-300"
                    }
                  >
                    <div className="flex justify-center items-center h-full">
                      {image.url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                        <div className="relative">
                          <img
                            src={image.url}
                            alt={`Image ${filteredIndex + 1}`}
                            className="rounded-lg lg:h-[calc(100vh-150px)] object-contain shadow-xl"
                          />
                          {image.title && (
                            <label className="bg-black/50 text-white text-xs absolute top-4 right-4 p-1 rounded flex gap-1 items-center">
                              <ImageIcon size={15} /> {image.title}
                            </label>
                          )}
                        </div>
                      ) : image.url.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video
                          src={image.url}
                          controls
                          className="rounded-lg object-contain max-w-full m-5 bg-black"
                          style={{
                            width: imageSizes[filteredIndex]?.width || "90vw",
                            height: imageSizes[filteredIndex]?.height || "80vh",
                            maxHeight: "90vh",
                          }}
                          onPlay={handleVideoPlay}
                          onPause={handleVideoPause}
                        />
                      ) : null}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="flex justify-center">
                <label className="text-sm text-white">
                  {currentImageIndex + 1} / {images.length}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {isMobile ? (
        <div className="relative">
          <h1 className="absolute bottom-4 right-8 z-40 bg-white/80 text-sm px-2 flex gap-1 items-center rounded shadow-custom">
            <IoImagesOutline />
            {images.length}+
          </h1>
          <BuilderPageReusableCarousel
            activeIndex={currentImageIndex}
            enableAutoplay
          >
            {images
              ?.filter((i) => i.file_type !== "application/pdf")
              .map((image, index) => (
                <div
                  key={index}
                  className="w-[100vw]"
                  onClick={() => handleImageClick(index)}
                >
                  {image.url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                    <Image
                      src={image.url}
                      alt={`Image ${index + 1}`}
                      width={0}
                      height={0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="rounded-lg object-cover w-[95vw] h-[340px] m-2"
                    />
                  ) : image.url.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={image.url}
                      controls
                      className="rounded-lg object-cover w-[95vw] h-[340px] m-2"
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
          {images
            .filter((i) => i.file_type !== "application/pdf")
            .slice(0, 3)
            .map((image, index) => (
              <div
                key={index}
                className={`relative ${
                  index === 0
                    ? "col-span-2 row-span-2"
                    : "col-span-1 row-span-1"
                }`}
                onClick={() => handleImageClick(index)}
              >
                {image.url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                  <Image
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    width={500}
                    height={400}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : image.url.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video
                    src={image.url}
                    controls
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : null}

                {/* Overlay for last column if there are more images */}
                {index === 2 && images.length > 3 && (
                  <div className="absolute cursor-pointer inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-2xl font-medium rounded-lg">
                    {images.length - 3}+ More
                  </div>
                )}
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
