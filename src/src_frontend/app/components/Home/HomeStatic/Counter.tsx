// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const StatsCard = () => {

//   const [brokerageSavedStatic, setBrokerageSavedStatic] = useState(0);

//   const [data, setData] = useState({
//     brokerageSaved: 0,
//     customersConnected: 0,
//     propertyListings: 0,
//   });

//   const fetchData = async () => {
//     try {
//       const response = await axios.get('https://api.8sqft.com/api/v1/front/count_info', {
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": "A8SQFT7767",
//         }
//       });

//     const { totalSavedBrokerage, userCount, propertyCount } = response.data.data;
//       console.log("Response", response.data.data)

//        setData({
//         brokerageSaved: totalSavedBrokerage || 0,
//         customersConnected: userCount || 0,
//         propertyListings: propertyCount || 0,
//       });

//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(()=>{
//     const now = new Date();
//     const baseDate = new Date(2025, 0, 1);
//     const daysElapsed = Math.floor((now.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
//    setBrokerageSavedStatic(daysElapsed * 100000);
//   },[])

//   const { brokerageSaved, customersConnected, propertyListings } = data;
//    const totalCust=10000;

//   return (
//     <div className="w-full flex flex-col items-center mx-auto my-8 lg:p-6 bg-white rounded-lg">
//     <h2 className="text-center lg:text-2xl text-xl font-medium lg:font-semibold">Trusted by Many</h2>
//     <div className="lg:flex flex-col gap-4 lg:flex-row mt-1 justify-between sm:flex-row items-center">

//       <div className="text-white flex flex-col items-center justify-center rounded-lg px-4 w-full lg:w-1/4">

//           <span className="my-1 text-sm text-black whitespace-nowrap">Total Brokerage Saved</span>
//         <span className="text-2xl bg-primary px-4 py-2 rounded-lg">
//           {brokerageSavedStatic
//             .toLocaleString('en-US', { minimumIntegerDigits: 8, useGrouping: false })
//             .split('')
//             .map((digit, index) => (
//               <span key={index} className="px-[0.4rem]">
//                 {digit}
//               </span>
//             ))}
//         </span>
//       </div>

//       <div className="text-white flex flex-col items-center justify-center rounded-md lg:px-6 w-full lg:w-1/4">
//           <span className="my-1 text-sm text-black whitespace-nowrap">Total Customers Connected</span>
//         <span className="text-2xl bg-primary px-4 py-2 rounded-lg">
//           {(customersConnected + 100000)
//             .toLocaleString('en-US', { minimumIntegerDigits: 8, useGrouping: false })
//             .split('')
//             .map((digit, index) => (
//          <span key={index} className="px-[0.4rem]">
//                 {digit}
//               </span>
//             ))}
//         </span>
//       </div>

//       <div className="text-white flex flex-col items-center justify-center rounded-md px-4 w-full lg:w-1/4">
//           <span className="my-1 text-sm text-black whitespace-nowrap">Total Property Listings</span>
//         <span className="text-2xl bg-primary px-4 py-2 rounded-lg">
//           {propertyListings
//             .toLocaleString('en-US', { minimumIntegerDigits: 8, useGrouping: false })
//             .split('')
//             .map((digit, index) => (
//          <span key={index} className="px-[0.4rem]">
//                 {digit}
//               </span>
//             ))}
//         </span>
//       </div>
//     </div>
//   </div>

//   );
// };

// export default StatsCard;

"use client"; // Required in Next.js App Router
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { formatNumber } from "@/utils/priceFormatter";
import { Card, CardContent } from "@/ui/card";

const StatsCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const textRef = useRef(null);
  const [brokerageSavedStatic, setBrokerageSavedStatic] = useState(0);

  const [data, setData] = useState({
    brokerageSaved: 0,
    customersConnected: 0,
    propertyListings: 0,
    brokerageSavedStatic: 0, // Adding the new counter to the state
  });

  const [animatedData, setAnimatedData] = useState({
    brokerageSaved: 0,
    customersConnected: 0,
    propertyListings: 0,
    brokerageSavedStatic: 0,
  });

  // Calculate brokerageSavedStatic
  useEffect(() => {
    const now = new Date();
    const baseDate = new Date(2025, 0, 1);
    const daysElapsed = Math.floor((now.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    setBrokerageSavedStatic(daysElapsed * 100000);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://api.8sqft.com/api/v1/front/count_info",
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "A8SQFT7767",
          },
        }
      );

      const { totalSavedBrokerage, userCount, propertyCount } = response.data.data;

      setData((prev) => ({
        ...prev,
        brokerageSaved: totalSavedBrokerage || 0,
        customersConnected: userCount + 100000 || 0,
        propertyListings: propertyCount || 0,
        brokerageSavedStatic, // Update new counter in data state
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [brokerageSavedStatic]); // Ensure it updates when brokerageSavedStatic changes

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, []);

  // Animate counters when visible
  useEffect(() => {
    if (isVisible) {
      const duration = 1500; // Animation duration in ms
      const frameRate = 60; // Frame rate
      const totalFrames = Math.round(duration / frameRate);

      (Object.keys(data) as (keyof typeof data)[]).forEach((key) => {
        let count = 0;
        const increment = Math.ceil(data[key] / totalFrames);

        const interval = setInterval(() => {
          count += increment;
          if (count >= data[key]) {
            count = data[key];
            clearInterval(interval);
          }
          setAnimatedData((prev) => ({ ...prev, [key]: count }));
        }, frameRate);
      });
    } else {
      // Reset animation when out of view
      setAnimatedData({
        brokerageSaved: 0,
        customersConnected: 0,
        propertyListings: 0,
        brokerageSavedStatic: 0,
      });
    }
  }, [isVisible, data]);

  return (
    <div ref={textRef} className="w-full flex flex-col items-center mx-auto my-8 lg:p-6 bg-white rounded-lg">
      <h2 className="text-center lg:text-2xl text-xl font-medium lg:font-semibold">
        Trusted by Many
      </h2>

      <div className="flex flex-col gap-4 w-full lg:flex-row mt-1 justify-between sm:flex-row items-center">
        {/* Total Brokerage Saved (API + Static) */}
        <Card className="bg-[#FFF4ED] text-primary p-4 border border-primary w-full text-start">
          <CardContent className="p-0">
            <h3 className="lg:text-4xl text-2xl font-semibold">
              {formatNumber(animatedData.brokerageSavedStatic).toLocaleString()}+
            </h3>
            <p className="text-black text-sm">Total Brokerage Saved</p>
          </CardContent>
        </Card>

        {/* Total Customers Connected */}
        <Card className="bg-[#FFF4ED] text-primary p-4 border border-primary w-full text-start">
          <CardContent className="p-0">
            <h3 className="lg:text-4xl text-2xl font-semibold">
              {formatNumber(animatedData.customersConnected).toLocaleString()}+
            </h3>
            <p className="text-black text-sm">Total Customers Connected</p>
          </CardContent>
        </Card>

        {/* Total Property Listings */}
        <Card className="bg-[#FFF4ED] text-primary p-4 border border-primary w-full text-start">
          <CardContent className="p-0">
            <h3 className="lg:text-4xl text-2xl font-semibold">
              {formatNumber(animatedData.propertyListings).toLocaleString()}+
            </h3>
            <p className="text-black text-sm">Total Property Listings</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsCard;

