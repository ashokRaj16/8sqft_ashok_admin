
import React, { useEffect, useRef, useState } from 'react'
import builderLogo from "@/public/assets/OurStory/builderLogo.svg";
import Image from 'next/image';
import { formatNumber } from '@/utils/priceFormatter';
export default function Hero() {
    const textRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);
    const intervalRefs = useRef<NodeJS.Timeout[]>([]);
    const [animatedData, setAnimatedData] = useState({
        siteVisit: 0,
        siteVisitDirect: 0,
        booking: 0,
        revenue: 0,
    });
    const [data, setData] = useState<{
        siteVisit: number | null;
        siteVisitDirect: number | null;
        booking: number | null;
        revenue: number | null;
    }>({
        siteVisit: 1700,
        siteVisitDirect: 800,
        booking: 174,
        revenue: 700000000,
    });

    // Animation system
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated && data.booking !== null) {
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
    }, [hasAnimated, data.booking]);

    useEffect(() => {
        if (!isVisible || data.booking === null) return;

        intervalRefs.current.forEach(clearInterval);
        intervalRefs.current = [];

        const animateValue = (
            key: keyof typeof data,
            target: number,
            duration: number
        ) => {
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
        animateValue('siteVisit', data.siteVisit!, duration);
        animateValue('siteVisitDirect', data.siteVisitDirect!, duration);
        animateValue('booking', data.booking!, duration);
        animateValue('revenue', data.revenue!, duration);

        return () => intervalRefs.current.forEach(clearInterval);
    }, [isVisible, data]);
  return (
<>
<div ref={textRef} className='overflow-hidden relative bg-[url(/assets/OurStory/hero_detail.svg)] bg-cover bg-no-repeat w-full h-[400px] lg:h-[calc(90vh-100px)] '>
                <div className="flex flex-col items-center justify-evenly h-full gap-2">
                  <div className='flex flex-col items-center justify-center gap-2'>
                  <div className='bg-white/10 p-4 rounded-xl backdrop-blur-[2px]'>
                        <Image src={builderLogo} alt='logo' width={200} height={200} />
                    </div>
                    <h1 className='text-white text-xl uppercase'>Show the tagline of builder</h1>
                  </div>
                    <div className="flex flex-col gap-4 w-full lg:flex-row mt-1 justify-center sm:flex-row items-center">
                    <div className=" text-white p-4  w-full text-center">
                        <div className="p-0">
                            <h3 className="lg:text-4xl text-2xl font-semibold">
                                {formatNumber(animatedData.siteVisit).toLocaleString()}+
                            </h3>
                            <p className="text-white text-sm">Site Visits</p>
                        </div>
                    </div>

                    <div className=" text-white p-4  w-full text-center">
                        <div className="p-0">
                            <h3 className="lg:text-4xl text-2xl font-semibold">
                                {formatNumber(animatedData.siteVisitDirect).toLocaleString()}+
                            </h3>
                            <p className="text-white text-sm">Site Visits through Direct</p>
                        </div>
                    </div>

                    <div className=" text-white p-4  w-full text-center">
                        <div className="p-0">
                            <h3 className="lg:text-4xl text-2xl font-semibold">
                                {formatNumber(animatedData.booking).toLocaleString()}+
                            </h3>
                            <p className="text-white text-sm">Booking</p>
                        </div>
                    </div>
                    <div className=" text-white p-4  w-full text-center">
                        <div className="p-0">
                            <h3 className="lg:text-4xl text-2xl font-semibold">
                                {formatNumber(animatedData.revenue).toLocaleString()}+
                            </h3>
                            <p className="text-white text-sm">Revenue</p>
                        </div>
                    </div>
                </div>
                </div>
               
            </div>
</>
  )
}
