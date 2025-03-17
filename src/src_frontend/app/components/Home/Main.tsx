import HeroComponent from "./HomeStatic/hero-component";
import RecommendationComponent from "./HomeStatic/Recommendation";
import FeaturedComponent from "./HomeStatic/Featured";
import WhyChooseComponent from "./HomeStatic/WhyChoose";
import StatsCard   from "./HomeStatic/Counter"

import ReviewsComponent from "./HomeStatic/ReviewsComponent";
import Spotlight from "./HomeStatic/Spotlight";
import ClientsSection from "./HomeStatic/ClientSection";
import SpotlightSlider from "../common/Spotlight";
import MobSpotlightSlider from "../common/MobSpotlightSlider";


export default function MainComponent() {
  return (
    <div className="w-full h-full ">
      <HeroComponent />
      <div className="container mx-auto mt-10">
      <div className="text-center mt-6">
        <RecommendationComponent />
         
        </div>
        <div className="text-center mt-6">
           <StatsCard/>
        </div>

 

        <div className="text-center mt-6">
        
        <p className="lg:text-2xl text-xl font-medium lg:font-semibold my-5 text-center ml-4">Spotlight</p>
     
        <div className="block lg:hidden">
        {/* < Spotlight/> */}        
      <MobSpotlightSlider/>
        </div>
       <div className="hidden lg:block">
       < SpotlightSlider/>
       </div>
        </div>

        <div className="text-center mt-6">
          <FeaturedComponent />
        </div>

        <div className="text-center  mt-6">
          <ReviewsComponent />
        </div>
       
        <div className="text-center  mt-6">
          {/* <ClientsSection /> */}
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