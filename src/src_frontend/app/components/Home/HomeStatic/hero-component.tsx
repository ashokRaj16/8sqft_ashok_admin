import SearchComponent from "./Seachbar/search-bar";

export default function HeroComponent() {
  return (
    <>
     

     <section
  className="relative w-full bg-cover bg-center overflow-hidden"
  style={{ backgroundImage: "url('/assets/Home_page/Maskgroup.png')" }}
>
  {/* Overlay for better text visibility */}
  <div className="absolute inset-0 "></div>

  {/* Centered Text */}
  <div className="relative w-full z-10 flex flex-col items-center justify-center text-primary text-center px-4">
    <p className="absolute top-10 lg:top-4 text-lg sm:text-3xl font-bold tracking-wide sm:top-40 text-lg sm:text-3xl font-bold tracking-wide">
      India&apos;s Fastest C to C Property Portal With Zero Brokerage
    </p>
  </div>

  {/* Search Bar */}
  <div className="absolute top-32 sm:top-64 w-full sm:flex justify-center px-4 z-10">
    <SearchComponent />
  </div>

  {/* Mobile Responsiveness */}
  <style jsx>{`
    @media (max-width: 640px) {
      .relative {
        height: 60vh; /* Reduce height for mobile */
      }
    }

    /* Desktop View (default height) */
    @media (min-width: 641px) {
      .relative {
        height: 100vh; /* Full height on desktop */
      }
    }
  `}</style>
</section>












    </>
  );
}
