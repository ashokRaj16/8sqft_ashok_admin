import HeroComponent from "./HomeStatic/hero-component";
import RecommendationComponent from "./HomeStatic/Recommendation";
import FeaturedComponent from "./HomeStatic/Featured";
import WhyChooseComponent from "./HomeStatic/WhyChoose";
import StatsCard   from "./HomeStatic/Counter"

import ReviewsComponent from "./HomeStatic/ReviewsComponent";
import Spotlight from "./HomeStatic/Spotlight";
import ClientsSection from "./HomeStatic/ClientSection";


export default function MainComponent() {
  return (
    <div className="w-full h-full ">
      <HeroComponent />
      <div className="container mx-auto mt-10">
        <div className="text-center mt-6">
           <StatsCard/>
        </div>

        <div className="text-center mt-6">
        <RecommendationComponent />
         
        </div>

        <div className="text-center mt-6">
          {/* <div> */}
        <p className="text-2xl font-bold my-5 text-start ml-4">Spotlight</p>
        {/* </div> */}
        < Spotlight/>
         
        </div>

        <div className="text-center mt-6">
          <FeaturedComponent />
        </div>

        <div className="text-center  mt-6">
          <ReviewsComponent />
        </div>
       
        <div className="text-center  mt-6">
          <ClientsSection />
        </div>

        <div className="text-center  mt-6">
          <WhyChooseComponent />
        </div>

        {/* <div className="text-center  mt-6">
          <ClientsSection />
        </div> */}


      </div>
    </div>
  );
}