"use client";
import React, { useEffect, useMemo, useState } from "react";
import ProjectInfo from "../ProjectInfo";
import DownloadBrochure from "../DownloadBrochure";
import About from "../About";
import ConstructionStatus from "../ConstructionStatus";
import PriceRange from "../PriceRange";
import FloorPlans from "../FloorPlans";
import ProjectTour from "../ProjectTour";
import Amenities from "../Amenities";
import Location from "../Location";
import Rera from "../Rera";
import OtherProject from "../OtherProject";
import CustomerReview from "../Review";
import ContactBuilder from "../ContactBuilder";
import axios from "@/hooks";
import Overview from "../Overview";
import { useParams } from "next/navigation";
import usePdfStore from "@/Store/fileStore";
import useColorStore from "@/Store/colorStore";
import ProjectSkeleton from "../ProjectSkeleton";
import Faqs from "../FAQ";

interface Review {
  id: number;
  user_id: number;
  property_id: number;
  rating: number;
  review: string;
  status: string;
  feature_name: string | null;
  created_at: string;
  updated_at: string;
  fname: string;
  lname: string;
  profile_picture_url: string | null;
}

interface ReviewData {
  reviews: Review[];
  rating_distribution: Record<string, number>;
  average_rating: number;
  total_count: number;
}
const PropertyShowcase: React.FC = () => {
  const primaryColor = ["#243E68", "#F4F8FF"];

  const [builderResponseData, setBuilderResponseData] = useState<any>({});
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const propertyData = builderResponseData?.property;
  const configurationData = builderResponseData?.configuration;
  const imagesData = builderResponseData?.images;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams(); 
  const extractId = (url: any) => {
    if (!url || typeof url !== "string") return null; 
    const match = url.match(/-(\d+)$/);
    return match ? match[1] : null;
  };
  const propertyId = extractId(params.id);

  const { setPdfUrl } = usePdfStore();
  const currentPdfUrl = usePdfStore(state => state.pdfUrl);
  const images = useMemo(() => {
    return (
      imagesData?.map((img: any) => ({
        url: img.property_img_url,
        file_type: img.file_type,
        title: img.img_title
      })) || []
    );
  }, [imagesData]);


    useEffect(() => {
      images.forEach((image: any) => {
        const fileExtension = image.url?.split(".").pop()?.toLowerCase();
    
        if (fileExtension === "pdf" && image.url !== currentPdfUrl) {
          console.log(image.url, "PDF URL found");
          setPdfUrl(image.url);
        }
      });
    }, [images, setPdfUrl]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/v1/front/spotlight/hero_banner/${propertyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "A8SQFT7767",
          },
        }
      );

      const SortedResponse = response.data.data || [];
      setBuilderResponseData(SortedResponse);
    } catch (err) {
      setError("Failed to fetch properties. Please try again later.");
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`/api/v1/front/property/reviews/${propertyId}`, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "A8SQFT7767",
          },
        });
        if (response.data.status) {
          setReviewData(response?.data?.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReview();
  }, []);

  const colors =  builderResponseData?.property?.colors;
  console.log(colors?.themeColorDark, "colorscolors") 
  const setColor = useColorStore((state) => state.setColor)
  useEffect(() => {
  if (colors) {
    setColor(colors?.themeColorDark);
  }
  }, [setColor,colors])
  // const colors ={
  //  themeColorDark: "#233655",
  //  themeColorLight: "#deebff",
  //  themeColorGradient: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(141,15,193,1) 33%, rgba(0,212,255,1) 100%)"

  // }

  
  if (loading) {
    return <>
    <ProjectSkeleton/>
    </>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <main>
      <ProjectInfo
        data={builderResponseData?.sponsaredImages ?? []}
        builderResponseData={builderResponseData}
        themeColors={colors}
        propertyId={propertyId}
      />
      <div className="my-10 grid grid-cols-4 gap-4 w-full max-w-7xl mx-auto">
        <div className="lg:col-span-3 col-span-4 px-4 lg:px-0">
          <DownloadBrochure
            themeColors={colors}
            builderResponseData={builderResponseData}
            reviewData={reviewData}
            propertyId={propertyId}
          />
          <Overview
            themeColors={colors}
            builderResponseData={builderResponseData}
            title={propertyData?.property_title}
            projectArea={propertyData?.project_area}
            configration={configurationData}
            per_sqft_amount={propertyData?.per_sqft_amount}
            property_variety={propertyData?.property_variety}
            publish_date={propertyData?.publish_date}
            unit_type={propertyData?.project_area_unit}
            rera={propertyData?.rera_number}
            propertyCurrentStatus={propertyData?.property_current_status}
            widthFacingRoad={propertyData?.width_facing_road}
            totalUnits={propertyData?.total_units}
            floorNumber={propertyData?.total_floors}
            propertyType={propertyData?.property_type}
            totalTowers={propertyData?.total_towers}
          />
          <About
            themeColors={colors}
            builderResponseData={builderResponseData}
          />
          <ConstructionStatus
            themeColors={colors}
            builderResponseData={builderResponseData}
          />
          <PriceRange
            themeColors={colors}
            builderResponseData={builderResponseData}
          />
          <FloorPlans
            themeColors={colors}
            builderResponseData={builderResponseData}
            propertyId={propertyId}
          />
          <ProjectTour
            themeColors={colors}
            builderResponseData={builderResponseData}
          />
          <Amenities
            themeColors={colors}
            builderResponseData={builderResponseData}
            otherAmenities={propertyData?.other_amenities}
            parking={propertyData?.parking}
            waterSupply={propertyData?.water_supply}
            grantedSecurity={propertyData?.granted_security}
            sewageConnection={propertyData?.sewage_connection}
            electricityConnection={propertyData?.electricity_connection}
            washroomType={propertyData?.washroom_type}
            furnishingStatus={propertyData?.furnishing_status}
          />
          <Location
            themeColors={colors}
            builderResponseData={builderResponseData}
          />
          <Rera
            themeColors={colors}
            builderResponseData={builderResponseData}
          />
          {/* <OtherProject primaryColor={primaryColor}/> */}
          <CustomerReview
            themeColors={colors}
            builderResponseData={builderResponseData}
            reviewData={reviewData}
          />
          <Faqs  themeColors={colors} builderResponseData={builderResponseData}/>
        </div>

        <div className="lg:col-span-1 col-span-4 px-4 lg:px-0">
          <ContactBuilder themeColors={colors}
           configration={configurationData}
           propertyVariety={propertyData?.property_variety}
           propertytype={propertyData?.property_type} 
           propertyId={propertyId}
          />
        </div>
      </div>
    </main>
  );
};

export default PropertyShowcase;
