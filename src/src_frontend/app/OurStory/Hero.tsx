
import HeroImg from "@/public/assets/OurStory/heroimg.svg";
import Image from "next/image";
import Link from "next/link";
import { FaArrowDownLong } from "react-icons/fa6";
  export default function Hero() {
    return (
     <>
     <div className="relative">
        <Image src={HeroImg} alt="hero img" width={400} height={400} className="w-full"/>
        <Link href={'#growBusiness'} className="rounded-full bg-black/70 p-1 w-12 h-12 lg:flex items-center justify-center absolute bottom-5 left-[50%] translate-x-[-50%] animate-bounce cursor-pointer hidden">
        <FaArrowDownLong size={26} color="#fff"/>
        </Link>
     </div>
     </>
    );
  }
  