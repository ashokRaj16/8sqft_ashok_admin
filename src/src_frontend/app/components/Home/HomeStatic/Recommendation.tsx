// import React from "react";
// import { ReusableCarousel } from "@/Compound-component/Reusable-Carousel";
// import RecomandationCard from "@/StaticComponent/RecomandationCard";
// import { CarouselNext, CarouselPrevious } from "@/ui/carousel";
// export default function RecommendationComponent() {
//   const properties = [
//     {
//       id: 1,
//       image: "/assets/Home_page/luxury_banglow.JPG",
//       alt: "Modern Luxury Villa with Pool",
//       title: "Modern Luxury Villa with Pool",
//       location: "Pune, India",
//       area: "4500 sqft",
//       deposit: "₹20,000",
//       rent: "₹5,000/month",
//     },

//     {
//       id: 2,
//       image: "/assets/Home_page/luxury_banglow.JPG",
//       alt: "Modern Luxury Villa with Pool",
//       title: "Modern Luxury Villa with Pool",
//       location: "Nagpur, India",
//       area: "4500 sqft",
//       deposit: "₹20,000",
//       rent: "₹5,000/month",
//     },
//     {
//       id: 3,
//       image: "/assets/Home_page/living_room.jpg",
//       alt: "Contemporary Urban Apartment",
//       title: "Contemporary Urban Apartment",
//       location: "Nashik, Pune",
//       area: "1200 sqft",
//       deposit: "₹5,000",
//       rent: "₹2,500/month",
//     },
//     {
//       id: 4,
//       image: "/assets/Home_page/luxury_banglow.JPG",
//       alt: "Modern Luxury Villa with Pool",
//       title: "Modern Luxury Villa with Pool",
//       location: "Pune, India",
//       area: "4500 sqft",
//       deposit: "₹20,000",
//       rent: "₹5,000/month",
//     },

//     {
//       id: 5,
//       image: "/assets/Home_page/luxury_banglow.JPG",
//       alt: "Modern Luxury Villa with Pool",
//       title: "Modern Luxury Villa with Pool",
//       location: "Nagpur, India",
//       area: "4500 sqft",
//       deposit: "₹20,000",
//       rent: "₹5,000/month",
//     },
//     {
//       id: 6,
//       image: "/assets/Home_page/living_room.jpg",
//       alt: "Contemporary Urban Apartment",
//       title: "Contemporary Urban Apartment",
//       location: "Nashik, Pune",
//       area: "1200 sqft",
//       deposit: "₹5,000",
//       rent: "₹2,500/month",
//     },
//   ];

//   return (
//     <>
//     <div className="container ">
//       <p className="text-2xl font-bold my-5 text-start">Recomandation </p>
//       <ReusableCarousel className="w-full ">
//         {properties.map((property) => (
//           <RecomandationCard
//             key={property.id}
//             title={property.title}
//             location={property.location}
//             area={property.area}
//             deposit={property.deposit}
//             rent={property.rent}
//             imageUrl={property.image}
//           /> 
//         ))}
//       </ReusableCarousel>
//     </div>
//     <div>
      
//     </div>
//     </>
//   );
// }


import React, { useState, useEffect } from "react";
import axios from "axios";
import { ReusableCarousel } from "@/Compound-component/Reusable-Carousel";
import RecomandationCard from "@/StaticComponent/RecomandationCard";

// Define the Property type
type Property = {
  id: number;
  property_title: string;
  landmark: string;
  land_area: string;
  deposite_amount: string;
  rent_amount: string;
  image?: string; // Optional because we provide a fallback image
  property_img_url?:string
};

export default function RecommendationComponent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const fallbackImage = "/assets/Home_page/luxury_banglow.JPG"; // Fallback image if API has no image

  // Fetch data from API
  const fetchRecommendations = async () => {
    try {
      const response = await axios.get("https://api.8sqft.com/api/v1/front/recommendations?property_rent_buy=RENT", {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "A8SQFT7767", 
        },
      });

      const recommendations = response.data.data || [];
      console.log("API Response:", recommendations);


 


      const obj =[{property_title:""}]

      // Map response data to the required format
      const formattedProperties: Property[] = recommendations.map((property: any, index: number) => ({
        id: property.id || index, // Use a unique id or fallback to index
        property_title: property.property_title || "No Title Provided",
        landmark: property.landmark || "No Location Provided",
        land_area: ` ${property.land_area ? property.land_area || "N/A"  + property.land_area_unit || "" : ''}`,
        deposite_amount: property.deposite_amount || "No Deposit Info",
        rent_amount: property.rent_amount || "No Rent Info",
        property_img_url: property. property_img_url, // Use fallback image as the API doesn't return an image
      }));

      setProperties(formattedProperties);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="container">
      <p className="text-2xl font-bold my-5 text-start">Recommendation</p>
      
      
      <ReusableCarousel className="w-full" enableAutoplay>
        {properties.map((property) => (
          <RecomandationCard
            key={property.id}
            id={property.id}
            title={property. property_title}
            location={property.landmark}
            area={property.land_area}
            deposit={property.deposite_amount}
            rent={property.rent_amount}
            imageUrl={property.property_img_url || fallbackImage} // Always use the fallback image
          />
        ))}
      </ReusableCarousel>
    </div>
  );
}