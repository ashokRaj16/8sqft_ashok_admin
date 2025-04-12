import { hexToRgba } from "@/utils/hexToRGB";
import TransitInfo from "../Builder/BuilderLayout/TransitInfo";
import BuilderLocation from "../Builder/BuilderLocation"
const nearbyLocations = [
  {
    location_categories: "Transit",
    category_details: {
      name: "Railway Station",
      icon_url: "https://8sqft-images.s3.eu-north-1.amazonaws.com/nearby_icons/transit-Icon/RailwayStation.svg",
      locations: [
        {
          id: 3,
          distance: "2",
          latitude: "73.55228500",
          longitude: "18.76696540",
          time_to_reach: "2",
          location_title: "Kamshet Railway Station",
        },
      ],
    },
  },
  {
    location_categories: "Utility",
    category_details: {
      name: "EV Charging Station",
      icon_url: "https://8sqft-images.s3.eu-north-1.amazonaws.com/nearby_icons/utility-Icon/EVChargingStation.svg",
      locations: [
        {
          id: 4,
          distance: "3",
          latitude: "73.55039600",
          longitude: "18.76567400",
          time_to_reach: "5",
          location_title: "Kamshet Jain Temple",
        },
      ],
    },
  },
];

interface LocationProps {
  themeColors: {
    themeColorDark: string;
    [key: string]: any;
  };
  builderResponseData: any; 
}
export default function Location({
  themeColors,
  builderResponseData
}: LocationProps)  {
  const propertyData=builderResponseData?.property;
  const nearbyLocationsData=builderResponseData?.nearbyLocations;
    return (
     <>
    <div className="my-4" style={{color:themeColors.themeColorDark}}>
      <h3 className="font-semibold my-2  text-lg">Location & Near by places</h3>
     
                     <div className="grid lg:grid-cols-3 grid-cols-2 lg:gap-2 justify-center px-2" id="Location" style={{backgroundColor: themeColors.themeColorLight}}>
                     <div className={`${nearbyLocationsData.length>0?'lg:col-span-2':'lg:col-span-3'} col-span-2 lg:mt-2`}>
                     <BuilderLocation
                       lat={propertyData?.latitude}
                       lng={propertyData?.longitude}
                     />
                     </div>
                     
                     <div className=" lg:mt-2 lg:col-span-1 col-span-2">
                     
                     <TransitInfo color={themeColors.themeColorDark} NearbyLocations={nearbyLocationsData || []} />
                     </div>
                     </div>
     </div>
     </>
    );
  }
  