"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { formatNumber } from "@/utils/priceFormatter";
import { Card, CardContent } from "@/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const StatsCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const textRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRefs = useRef<NodeJS.Timeout[]>([]);
  
  // Initialize with null to distinguish between initial state and loaded state
  const [data, setData] = useState<{
    brokerageSaved: number | null;
    customersConnected: number | null;
    propertyListings: number | null;
    // brokerageSavedStatic: number | null;
  }>({
    brokerageSaved: null,
    customersConnected: null,
    propertyListings: null,
    // brokerageSavedStatic: null,
  });

  const [animatedData, setAnimatedData] = useState({
    brokerageSaved: 0,
    customersConnected: 0,
    propertyListings: 0,
    // brokerageSavedStatic: 0,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api.8sqft.com/api/v1/front/count_info",
        {
          headers: {
            "x-api-key": "A8SQFT7767",
          },
        }
      );

      const { totalSavedBrokerage, userCount, propertyCount } = response.data.data;

      // Fix base date (should be in the past)
      const baseDate = new Date(2020, 0, 1); // Changed to 2020
      const now = new Date();
      const daysElapsed = Math.ceil((now.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
      // const brokerageSavedStatic = daysElapsed * 100000;

      setData({
        brokerageSaved: totalSavedBrokerage || 0,
        customersConnected: (userCount || 0) ,
        propertyListings: propertyCount || 0,
        // brokerageSavedStatic,
      });
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Animation system
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated && data.propertyListings !== null) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (textRef.current) observer.observe(textRef.current);
    return () => {
      if (textRef.current) observer.unobserve(textRef.current);
      intervalRefs.current.forEach(clearInterval);
    };
  }, [hasAnimated, data.propertyListings]);

  useEffect(() => {
    if (!isVisible || data.propertyListings === null) return;

    intervalRefs.current.forEach(clearInterval);
    intervalRefs.current = [];

    const animateValue = (
      key: keyof typeof data,
      target: number,
      duration: number
    ) => {
      let start = 0;
      const startTime = Date.now();

      const update = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(progress * target);
        setAnimatedData(prev => ({ ...prev, [key]: current }));

        if (progress < 1) {
          const interval = requestAnimationFrame(update);
          intervalRefs.current.push(interval as unknown as NodeJS.Timeout);
        }
      };

      update();
    };

    const duration = 1500;
    animateValue('brokerageSaved', data.brokerageSaved!, duration);
    animateValue('customersConnected', data.customersConnected!, duration);
    animateValue('propertyListings', data.propertyListings!, duration);

    return () => intervalRefs.current.forEach(clearInterval);
  }, [isVisible, data]);

  if (loading) {
    return (
      <>
        <p className="lg:text-2xl text-xl font-medium lg:font-semibold my-5 text-center">
          Trusted by Many
        </p>
        <div className="container">
          <div className="flex justify-center flex-wrap gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex flex-col space-y-3">
                <Skeleton className="h-[90px] w-80 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div ref={textRef} className="w-full flex flex-col items-center mx-auto my-4 lg:p-6 bg-white rounded-lg">
      <h2 className="lg:text-2xl text-xl font-medium lg:font-semibold my-5 text-center">
        Trusted by Many
      </h2>

      <div className="flex flex-col gap-4 w-full lg:flex-row mt-1 justify-between sm:flex-row items-center">
        <Card className="bg-[#FFF4ED] text-primary p-4 border border-primary w-full text-start">
          <CardContent className="p-0">
            <h3 className="lg:text-4xl text-2xl font-semibold">
              {formatNumber(animatedData.brokerageSaved).toLocaleString()}+
            </h3>
            <p className="text-black text-sm">Total Brokerage Saved</p>
          </CardContent>
        </Card>

        <Card className="bg-[#FFF4ED] text-primary p-4 border border-primary w-full text-start">
          <CardContent className="p-0">
            <h3 className="lg:text-4xl text-2xl font-semibold">
              {formatNumber(animatedData.customersConnected).toLocaleString()}+
            </h3>
            <p className="text-black text-sm">Total Customers Connected</p>
          </CardContent>
        </Card>

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