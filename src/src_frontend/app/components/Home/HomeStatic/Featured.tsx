import { ReusableCarousel } from "@/Compound-component/Reusable-Carousel";
import FeaturedCard from "@/StaticComponent/FeaturedCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./scroll.css"
import { useAuthStore } from "@/Store/jwtTokenStore";

type Property = {
  id: number;
  property_title: string;
  landmark: string;
  builtup_area: number;
  deposite_amount: string;
  rent_amount: string;
  image?: string;
  property_img_url?: string;
  washrooms?: number;

};
type cardData = {
  landmark: string;
  property_img_url: string;
  bed_rooms: number;
  washrooms?: number;
  balcony: number;
  builtup_area: number;
  rent_amount: string;
  property_title: string;
  id: number;

}

export default function FeaturedComponent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState("sell");
  const [sellCardData, setSellCardData] = useState<cardData[]>([]);
  const [rentCardData, setRentCardData] = useState<cardData[]>([]);
  const token = useAuthStore((state) => state.token);
  console.log(sellCardData, 'sellCardData')
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("https://api.8sqft.com/api/v1/front/recommendations?property_rent_buy=RENT", {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "A8SQFT7767",
            Authorization: `Bearer ${token}`,
          },

        });

        const recommendations = response.data.data || [];

        const sellData = recommendations.filter((property: { property_rent_buy: string }) => property.property_rent_buy === "RENT");

        const rentData = recommendations.filter((property: { property_rent_buy: string }) => property.property_rent_buy === "RENT");

        console.log("Recomendations", recommendations)

        setSellCardData(sellData);
        setRentCardData(rentData);

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchProperties();
  }, [activeTab]);


  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scroll = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: "prev" | "next") => {
    const container = scrollContainerRef.current;

    // Ensure the container exists before attempting to scroll
    if (container) {
      const scrollAmount = 300; // Adjust scroll amount as needed
      container.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollReviews = (direction: string) => {
    if (scroll.current) {
      const scrollAmount = 300; // Adjust as needed for the scroll distance
      const currentScroll = scroll.current.scrollLeft;

      if (direction === "prev") {
        scroll.current.scrollTo({
          left: currentScroll - scrollAmount,
          behavior: "smooth",
        });
      } else if (direction === "next") {
        scroll.current.scrollTo({
          left: currentScroll + scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };
  return (

    <div className=" w-full h-full relative pt-5">
      <p className="lg:text-3xl text-xl font-medium lg:font-semibold my-5 text-primary lg:hidden text-center">
        Explore the Featured Properties
      </p>
      <Tabs defaultValue="sell" onValueChange={(value) => setActiveTab(value)}>
        <div className="flex items-center justify-center relative mb-2">
          <TabsList className="flex justify-center gap-5">

            <TabsTrigger
              value="sell"
              className="text-black data-[state=active]:bg-[#FFF3EB] data-[state=active]:text-primary bg-[#EFEFEF] px-6 py-3 rounded-sm w-full lg:w-auto"
            >
              For Sell
            </TabsTrigger>


            <TabsTrigger
              value="rent"
              className="text-black data-[state=active]:bg-[#FFF3EB] data-[state=active]:text-primary bg-[#EFEFEF] px-6 py-3 rounded-sm w-full lg:w-auto"
            >
              For Rent
            </TabsTrigger>
          </TabsList>
          <div className="z-10 lg:flex flex-row items-center absolute right-0 hidden">
            <button className=" shadow-md p-2 rounded-full  border-2 border-primary" onClick={() => handleScroll("prev")}>
              <ArrowLeft size={18} className="text-primary" />
            </button>

            <button className=" shadow-md p-2 ml-2 rounded-full  border-2 border-primary" onClick={() => handleScroll("next")}>
              <ArrowRight size={18} className="text-primary" />
            </button>
          </div>
        </div>

        <div className=" w-full sm:w-[60vw] md:w-full">
          <div className="relative flex flex-col items-center">
            {/* <div className="relative w-1/2 h-[90vh] hidden lg:block rounded-lg p-10 overflow-hidden">
              <div className="h-[90vh] bg-[#FFF3EB] rounded-lg">
                <div
                  className="absolute inset-0 bg-no-repeat"
                  style={{
                    backgroundImage: "url('/assets/Home_page/HorizontalDots.svg')",
                    backgroundPosition: "left center",
                    backgroundSize: "20% auto",
                  }}
                ></div>

                <div
                  className="absolute inset-0 bg-no-repeat"
                  style={{
                    backgroundImage: "url('/assets/Home_page/verticalDots.svg')",
                    backgroundPosition: "right 30px top 0px",
                  }}
                ></div>

                <div className="relative z-20 flex flex-row absolute mr-16">
                  <p className="text-4xl font-semibold text-primary leading-tight pt-4">
                    Explore the Featured Properties
                  </p>
                </div>

                <div className="relative z-10 flex flex-row mt-[290px] ml-[120px] absolute bottom-10">


                  <button className=" shadow-md p-2 rounded-full  border-2 border-primary" onClick={() => handleScroll("prev")}>
                    <ArrowLeft size={18} className="text-primary" />
                  </button>

                  <button className=" shadow-md p-2 ml-[20px] rounded-full  border-2 border-primary" onClick={() => handleScroll("next")}>
                    <ArrowRight size={18} className="text-primary" />
                  </button>


                </div>


              </div>
            </div> */}



            <div className="w-full h-fit relative  ">
              <div ref={scrollContainerRef} className="overflow-x-auto scroll-smooth flex flex-row gap-4 scrollbar-hide  ">
                <TabsContent value="sell">
                  <ReusableCarousel className="w-full">

                    {sellCardData.map((data) => (
                      <FeaturedCard

                        priceType={""}
                        title={data.property_title}
                        location={data.landmark}
                        imageUrl={data.property_img_url}
                        beds={data.bed_rooms}
                        washrooms={data.washrooms}
                        balconies={data.balcony}
                        area={data.builtup_area}
                        price={data.rent_amount}
                        key={data.id} {...data} />
                    ))}
                  </ReusableCarousel>
                </TabsContent>



                <TabsContent value="rent">
                  <ReusableCarousel className="lg:w-full mb-4" >

                    {rentCardData.map((data) => (
                      <FeaturedCard

                        className="bg-transparent"
                        priceType={""}
                        title={data.property_title}
                        location={data.landmark}
                        imageUrl={data.property_img_url}
                        beds={data.bed_rooms}
                        washrooms={data.washrooms}
                        balconies={data.balcony}
                        area={data.builtup_area}
                        price={data.rent_amount}
                        key={data.id} {...data} />
                    ))}

                  </ReusableCarousel>
                </TabsContent>
              </div>
            </div>
          </div>
        </div>
      </Tabs>
    </div>

  );
}

