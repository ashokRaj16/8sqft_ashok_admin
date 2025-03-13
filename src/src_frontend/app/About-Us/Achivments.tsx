"use client";
import { Card, CardContent } from "@/ui/card";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import TrophyImg from "@/public/assets/AboutUs/trophy.svg";
import { formatNumber } from "@/utils/priceFormatter";
const useOnScreen = (ref: any) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isIntersecting;
};

const Counter = ({ end, startCount }: { end: number; startCount: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCount) return;
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 10);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 10);
    return () => clearInterval(timer);
  }, [end, startCount]);

  return <span>{formatNumber(count).toLocaleString()}</span>;
};

const Achievements = () => {
  const ref = useRef(null);
  const isVisible = useOnScreen(ref);

  return (
    <section ref={ref} className="px-4 lg:px-16 pb-11 bg-[#222222] text-white">
      <div className=" mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:mb-16 mb-5">
          <Image
            className="w-24 lg:w-auto"
            src={TrophyImg}
            alt="Trophy"
            width={150}
            height={150}
          />
          <div>
            <h2 className="lg:text-5xl text-2xl text-center lg:text-start font-bold mb-4 capitalize lg:uppercase">
              Our Achievements
            </h2>
            <p className="text-[#C0C0BF] text-center text-sm max-w-xl mx-auto">
            With the company now serving over 12 cities. Our customer base is diverse and global, with a strong presence in Maharashtra, Delhi & Bangalore.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-6 mb-2 lg:mb-6">
          {[
            { title: 10000, subtitle: "Happy Clients" },
            { title: 500, subtitle: "Projects" },
            { title: 12, subtitle: "Citites" },
            { title: 100, subtitle: "Team Size" },
          ].map((item, index) => (
            <Card key={index} className="bg-black text-white p-4 border-0">
              <CardContent className=" p-0">
                <h3 className="lg:text-4xl text-2xl font-medium">
                  <Counter end={item.title} startCount={isVisible} />+
                </h3>
                <p className="text-[#C0C0BF] text-sm">{item.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-6">
          {[
            { year: "2021", text: '"Sustainable Design Award" from (USGBC)' },
            { year: "2020", text: '"Builder of the Year" award' },
            { year: "2022", text: '"Top 50 Fastest-Growing Companies"' },
          ].map((award, index) => (
            <Card key={index} className="bg-black text-white p-4 border-0">
              <CardContent className="p-0">
                <h3 className="lg:text-4xl text-2xl font-medium">
                  {award.year}
                </h3>
                <p className="text-[#C0C0BF] text-sm">{award.text}</p>
              </CardContent>
            </Card>
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default Achievements;
