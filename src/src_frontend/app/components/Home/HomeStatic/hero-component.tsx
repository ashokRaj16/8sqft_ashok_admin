import { useRouter } from "next/navigation";
import SearchComponent from "./Seachbar/search-bar";
import Img from '@/public/assets/Home_page/KamalRAJ.png'
import Image from "next/image";
export default function HeroComponent() {
  const router = useRouter();
  return (
    <>
      <div className="h-[400px] lg:h-[510px]"> 
      <section
        className="relative w-full bg-center overflow-hidden heroImage  cursor-pointer" onClick={() => router.push("https://8sqft.com/Builder/kamalraj-athens-pimpri-chinchwad-pune-808")}>

          {/* <Image src={Img} height={380} width={1300} alt="image"/> */}
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 "></div>

        {/* Centered Text */}
        <div className="relative w-full z-10 flex flex-col items-center justify-center text-primary text-center px-4">
          {/* <p className="absolute top-10 lg:top-4 text-lg sm:text-3xl font-bold tracking-wide sm:top-40 text-lg sm:text-3xl font-bold tracking-wide">
            India&apos;s Fastest C to C Property Portal With Zero Brokerage
          </p> */}
        </div>

        {/* Mobile Responsiveness */}
        <style jsx>{`
          @media (max-width: 640px) {
            .relative {
              height: 38vh; /* Reduce height for mobile */
            }
          }

          /* Desktop View (default height) */
          @media (min-width: 641px) {
            .relative {
              height: 460px; /* Full height on desktop */
            }
          }
        `}</style>
      </section>

      {/* Search Bar */}
      <div className="absolute top-[17rem] sm:top-[30rem] w-full sm:flex justify-center px-4 z-10">
        <SearchComponent />
      </div>

      </div>

      
    </>
  );
}
