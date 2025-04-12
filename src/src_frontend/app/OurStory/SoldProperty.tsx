
import React from "react";
import Image from "next/image";
import logo from "@/public/assets/logo/Only-8.svg";
import sqftText from "@/public/assets/logo/sqft_text.svg";
import curveSm from "@/public/assets/OurStory/curve_sm.svg";
import curveMd from "@/public/assets/OurStory/curve_md.svg";
import curveLg from "@/public/assets/OurStory/curve_lg.svg";
import curveXl from "@/public/assets/OurStory/curve_xl.svg";
import { Card } from "@/ui/card";
const data = [
    {
        id: 1,
        title: "We make selling easier",
        description:
            "We guide you through every step of property sales, from planning to execution, so you can reach your goals smoothly.",
    },
    {
        id: 2,
        title: "Pricing Strategy",
        description:
            "Creating a detailed cost sheet, setting clear pricing and discounts, and offering financial guidance with financing options for buyers.",
    },
    {
        id: 3,
        title: "Creative Marketing",
        description:
            "We develop unique marketing ideas and materials to help your project stand out and sell faster.",
    },
    {
        id: 4,
        title: "Sales Strategy",
        description:
            "Strengthening sales through partner networks, strategic activations, and team training.",
    },
    {
        id: 5,
        title: "Market Analysis",
        description:
            "We analyse your competitors, pricing, and market trends to help you position your property effectively.",
    },
    {
        id: 6,
        title: "Go-To-Market Strategy",
        description:
            "We help you find the right buyers, build partnerships, and launch your project successfully with detailed planning.",
    },
    {
        id: 7,
        title: "Enhancing Experience",
        description:
            "Enhancing customer experience with optimized sales office layouts, on-site branding, and F&B guidance for a better sales journey.",
    },
    {
        id: 8,
        title: "Pre-Sales Support",
        description:
            "Driving conversions through lead engagement, clear project details, and consistent follow-ups.",
    },
];
export default function SoldProperty() {
    return (
        <>
            <div className="w-full max-w-7xl mx-auto lg:pb-4 px-4">
                <div className="text-center">
                    <h1 className="lg:text-3xl text-lg font-semibold tracking-widest">
                        How Your Property?
                    </h1>
                    <h1 className="lg:text-3xl text-lg font-semibold tracking-widest text-primary">
                        Sold Faster & Smarter
                    </h1>
                </div>

                <div className="block lg:hidden">
                    <div className="space-y-6 ">
                        {data.map((step, idx) => {
                            const isOdd = (idx + 1) % 2 !== 0;
                            const numberBoxClasses = isOdd
                                ? "bg-primary"
                                : "bg-primary-black";
                            const textColor = isOdd ? "text-primary" : "text-primary-black";

                            return (
                                <div key={step.id} className="flex items-center gap-4">
                                    {isOdd ? (
                                        <>
                                            {/* Text first */}
                                            <div className="p-2 w-full">
                                                <div className={`text-xs font-bold uppercase tracking-wide mb-1 ${textColor}`}>
                                                    {step.title}
                                                </div>
                                                <p className="text-xs">
                                                    {step.description}
                                                </p>
                                            </div>
                                            {/* Number box */}
                                            <div
                                                className={`p-2 h-[85px] w-[75px] rounded-r-xl relative ${numberBoxClasses}`}
                                            >
                                                <div className="absolute top-1/2 -left-4 -translate-y-1/2 border-4 border-white shadow-our-story-counter-left bg-[#E7E8EA] h-[70px] w-[70px] rounded-lg flex justify-center items-center">
                                                    <label
                                                        className={`lg:text-3xl text-2xl font-bold ${textColor}`}
                                                    >
                                                        {String(step.id).padStart(2, '0')}
                                                    </label>
                                                </div>

                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* Number box */}
                                            <div
                                                className={`p-2 h-[85px] w-[75px] rounded-l-xl relative ${numberBoxClasses}`}
                                            >
                                                <div className="absolute top-1/2 -right-4 -translate-y-1/2 border-4 border-white shadow-our-story-counter-right bg-[#E7E8EA] h-[70px] w-[70px] rounded-lg flex justify-center items-center">
                                                    <label
                                                        className={`lg:text-3xl text-2xl font-bold ${textColor}`}
                                                    >
                                                        {String(step.id).padStart(2, '0')}
                                                    </label>
                                                </div>

                                            </div>

                                            {/* Text */}
                                            <div className="p-2 w-full">
                                                <div className={`text-xs font-bold uppercase tracking-wide mb-1 ${textColor}`}>
                                                    {step.title}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="hidden lg:grid grid-cols-3 pt-5">
                    <div className="mt-36">
                        {data.slice(0, 4).map((item, index) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-3 items-center space-y-4 justify-items-center"
                            >
                                <div className="col-span-2">
                                    <div className="flex flex-col p-2">
                                        <h2
                                            className={`text-lg font-bold uppercase ${index % 2 === 0 ? "text-primary" : "text-primary-black"
                                                }`}
                                        >
                                            {item.title}
                                        </h2>
                                        <p className="text-xs text-black/80 line-clamp-3">{item.description}</p>
                                    </div>
                                </div>
                                <div
                                    className={`p-4 h-[100px] w-[85px] rounded-r-xl relative ${index % 2 === 0 ? "bg-primary" : "bg-primary-black"
                                        }`}
                                >
                                    <div className="absolute top-1/2 -left-2 -translate-y-1/2 border-4 border-white shadow-our-story-counter-left bg-[#E7E8EA] h-[85px] w-[85px] rounded-lg flex justify-center items-center">
                                        <label
                                            className={`text-3xl font-bold ${index % 2 === 0 ? "text-primary" : "text-primary-black"
                                                }`}
                                        >
                                            0{item.id}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="relative">
                        <div className="flex justify-center items-end gap-2 bg-primary-black py-4 rounded-2xl shadow-our-story-primary Imgshine">
                            <Image className="w-20 h-20" src={logo} width={90} height={90} alt="logo" />
                            <Image className="" src={sqftText} width={150} height={150} alt="sqftText" />
                        </div>

                        <div>
                            <Image className="absolute -left-4 mt-4" src={curveSm} width={45} height={45} alt="sqftText" />
                            <Image className="absolute -left-4 mt-4" src={curveMd} width={80} height={80} alt="sqftText" />
                            <Image className="absolute -left-4 mt-4" src={curveLg} width={120} height={120} alt="sqftText" />
                            <Image className="absolute -left-4 mt-4" src={curveXl} width={160} height={160} alt="sqftText" />
                        </div>
                        <div className="scale-x-[-1]">
                            <Image className="absolute -left-4 mt-4" src={curveSm} width={45} height={45} alt="sqftText" />
                            <Image className="absolute -left-4 mt-4" src={curveMd} width={80} height={80} alt="sqftText" />
                            <Image className="absolute -left-4 mt-4" src={curveLg} width={120} height={120} alt="sqftText" />
                            <Image className="absolute -left-4 mt-4" src={curveXl} width={160} height={160} alt="sqftText" />
                        </div>
                    </div>
                    <div className="mt-36">
                        {data.slice(4, 8).map((item, index) => (
                            <div
                                key={item.id}
                                className="grid grid-cols-3 items-end space-y-6 justify-items-center"
                            >
                                <div
                                    className={`p-4 h-[100px] w-[85px] rounded-l-xl relative ${index % 2 === 0 ? "bg-primary" : "bg-primary-black"
                                        }`}
                                >
                                    <div className="absolute top-1/2 -right-2 -translate-y-1/2 border-4 border-white shadow-our-story-counter-right bg-[#E7E8EA] h-[85px] w-[85px] rounded-lg flex justify-center items-center">
                                        <label
                                            className={`text-3xl font-bold ${index % 2 === 0 ? "text-primary" : "text-primary-black"
                                                }`}
                                        >
                                            0{item.id}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="flex flex-col p-2">
                                        <h2
                                            className={`text-lg font-bold uppercase ${index % 2 === 0 ? "text-primary" : "text-primary-black"
                                                }`}
                                        >
                                            {item.title}
                                        </h2>
                                        <p className="text-xs text-black/80 line-clamp-3">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
