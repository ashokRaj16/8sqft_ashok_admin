// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import axios from "axios";

// const Carousel = ({ items, itemsPerSlide, interval }: { items: string[], itemsPerSlide: number, interval: number }) => {
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const slideInterval = setInterval(() => {
//       setIndex((prevIndex) => (prevIndex + 1) % (items.length - itemsPerSlide + 1));
//     }, interval);

//     return () => clearInterval(slideInterval);
//   }, [items.length, itemsPerSlide, interval]);

//   return (
//     <div className="relative w-full max-w-4xl overflow-hidden">
//       <div className="flex gap-[2rem] justify-center">
//         {items.slice(index, index + itemsPerSlide).map((logo, i) => (
//           <div key={i} className="w-40 h-40  p-18 flex justify-center items-center  ">
//             <Image
//               src={logo} 
//               alt={`Client ${i}`} 
//               width={90} 
//               height={60} 
//               className="object-contain" 
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const ClientsSection = () => {
//   const [clientLogos, setClientLogos] = useState<string[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchClientLogos = async () => {
//       try {
//         const response = await axios.get("https://api.8sqft.com/api/v1/front/brands", {
//           headers: {
//             "Content-Type": "application/json",
//             "x-api-key": "A8SQFT7767", 
//           },
//         });

//         setClientLogos(response.data.data.map((brand: any) => brand.client_logo)); 
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching client logos", err);
//         setError("Error fetching client logos");
//         setLoading(false);
//       }
//     };

//     fetchClientLogos();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="w-full flex flex-col items-center py-8">
//       <h2 className="text-xl font-bold mb-4">OUR CLIENTS</h2>

//       <Carousel items={clientLogos} itemsPerSlide={7} interval={2000} />


//     </div>
//   );
// };

// export default ClientsSection;


"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

// Carousel Component
const Carousel = ({ items, itemsPerSlide, interval }: { items: string[], itemsPerSlide: number, interval: number }) => {
  const [index, setIndex] = useState(0);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const adjustedItemsPerSlide = isMobile ? 3 : itemsPerSlide; // 3 for mobile, 7 for desktop

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % (items.length - adjustedItemsPerSlide + 1));
    }, interval);

    return () => clearInterval(slideInterval);
  }, [items.length, adjustedItemsPerSlide, interval]);

  return (
    <div className="relative w-full max-w-5xl overflow-hidden">
      <div className="flex flex-nowrap gap-8 justify-center">
        {items.slice(index, index + adjustedItemsPerSlide).map((logo, i) => (
          <div key={i} className="w-40 h-40 sm:w-32 sm:h-32 flex justify-center items-center">
            <Image
              src={logo} 
              alt={`Client ${i}`} 
              width={120} 
              height={80} 
              className="object-contain w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Clients Section
const ClientsSection = () => {
  const [clientLogos, setClientLogos] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch client logos from API
    const fetchClientLogos = async () => {
      try {
        const response = await axios.get("https://api.8sqft.com/api/v1/front/brands", {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "A8SQFT7767", // Replace with your actual API key
          },
        });

        setClientLogos(response.data.data.map((brand: any) => brand.client_logo));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching client logos", err);
        setError("Error fetching client logos");
        setLoading(false);
      }
    };

    fetchClientLogos();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full flex flex-col items-center py-8">
      <h2 className="text-xl font-bold mb-4">OUR CLIENTS</h2>
      <Carousel items={clientLogos} itemsPerSlide={7} interval={2000} />
    </div>
  );
};

export default ClientsSection;
