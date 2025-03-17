"use client";
import Link from "next/link";
import CircleImg from "@/public/assets/AboutUs/circle.svg";
import Image from "next/image";
const CallToAction = () => {
  return (
    <section className="px-4 lg:px-16 lg:py-11 pb-4 bg-[#222222] text-white">
      <div className="bg-[#69330d] text-white py-16 px-6 md:px-12 rounded-lg relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center z-40">
          <p className="text-4xl md:text-5xl font-normal">
            Time to build something
          </p>
            <p className="text-4xl md:text-5xl font-semibold ">truly groundbreaking!</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="#"
              className="bg-white text-black text-sm lg:text-base px-2 lg:px-6 py-3 z-40 rounded-md font-medium shadow-md hover:bg-gray-200"
            >
              View our team
            </Link>
            <Link
              href="#"
              className="bg-white text-black text-sm lg:text-base px-2 lg:px-6 py-3 z-40 rounded-md font-medium shadow-md hover:bg-gray-200"
            >
              View our services
            </Link>
          </div>
        </div>
        <div
          className="absolute top-24 left-24  bg-transparent opacity-40"
          style={{ transform: "translate(-50%, -50%) rotate(185deg)" }}
        >
          <Image src={CircleImg} alt="img circle" width={200} height={200} />
        </div>
        <div
          className="absolute bottom-14 right-14   bg-transparent opacity-60"
          style={{ transform: "translate(50%, 50%) rotate(0deg)" }}
        >
          <Image src={CircleImg} alt="img circle" width={150} height={150} />
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
