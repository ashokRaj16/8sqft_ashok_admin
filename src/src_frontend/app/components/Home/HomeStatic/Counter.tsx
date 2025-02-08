import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatsCard = () => {

  //FOR STATIC BROKERAGE SAVED
  const [brokerageSavedStatic, setBrokerageSavedStatic] = useState(0);

  const [data, setData] = useState({
    brokerageSaved: 0,
    customersConnected: 0,
    propertyListings: 0,
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('https://api.8sqft.com/api/v1/front/count_info', {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "A8SQFT7767",
        }
      });

    const { totalSavedBrokerage, userCount, propertyCount } = response.data.data;
      console.log("Response", response.data.data)

       setData({
        brokerageSaved: totalSavedBrokerage || 0,
        customersConnected: userCount || 0,
        propertyListings: propertyCount || 0,
      });

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  
  useEffect(()=>{
    const now = new Date();
    const baseDate = new Date(2025, 0, 1); 
    const daysElapsed = Math.floor((now.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
   setBrokerageSavedStatic(daysElapsed * 100000);
  },[])



  const { brokerageSaved, customersConnected, propertyListings } = data;
   const totalCust=10000;


  return (
    <div className="w-full flex flex-col items-center mx-auto my-8 p-6 bg-white rounded-lg">
    <h2 className="text-center text-xl font-semibold">Trusted by Many</h2>
    <div className="lg:flex flex-col gap-4 lg:flex-row items-center justify-center gap-[14rem] mt-6 sm:flex-row items-center justify-center gap-8">
      {/* Total Brokerage Saved */}
      <div className="text-white flex flex-col items-center justify-center rounded-lg p-4 w-full lg:w-1/4">
        {/* Uncommented block */}
        {/* <span className="text-2xl bg-primary px-4 py-2 rounded-lg">
          {brokerageSaved
            .toLocaleString('en-US', { minimumIntegerDigits: 8, useGrouping: false })
            .split('')
            .map((digit, index) => (
              <span key={index} className="px-[0.2rem]">
                {digit}
              </span>
            ))}
        </span> */}
        {/* Original commented block */}
        <span className="text-2xl bg-primary px-4 py-2 rounded-lg">
          {brokerageSavedStatic
            .toLocaleString('en-US', { minimumIntegerDigits: 8, useGrouping: false })
            .split('')
            .map((digit, index) => (
              <span key={index} className="px-[0.2rem]">
                {digit}
              </span>
            ))}
        </span>
        <span className="mt-2 text-sm text-black whitespace-nowrap">Total Brokerage Saved</span>
      </div>
  
      {/* Total Customers Connected */}
      <div className="text-white flex flex-col items-center justify-center rounded-md p-6 w-full lg:w-1/4">
        <span className="text-2xl bg-primary px-4 py-2 rounded-lg">
          {(customersConnected + 10000)
            .toLocaleString('en-US', { minimumIntegerDigits: 8, useGrouping: false })
            .split('')
            .map((digit, index) => (
              <span key={index} className="px-[0.2rem]">
                {digit}
              </span>
            ))}
        </span>
        <span className="mt-2 text-sm text-black whitespace-nowrap">Total Customers Connected</span>
      </div>
  
      {/* Total Property Listings */}
      <div className="text-white flex flex-col items-center justify-center rounded-md p-4 w-full lg:w-1/4">
        <span className="text-2xl bg-primary px-4 py-2 rounded-lg">
          {propertyListings
            .toLocaleString('en-US', { minimumIntegerDigits: 8, useGrouping: false })
            .split('')
            .map((digit, index) => (
              <span key={index} className="px-[0.2rem]">
                {digit}
              </span>
            ))}
        </span>
        <span className="mt-2 text-sm text-black whitespace-nowrap">Total Property Listings</span>
      </div>
    </div>
  </div>
  
  );
};

export default StatsCard;
