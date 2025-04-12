import Image from "next/image";
import { Card, CardContent } from "@/ui/card";

const properties = [
  { name: "SWAPGANDHA SOCIETY", location: "SWARGATE, PUNE", image: "/assets/Home_page/balcony_side_view.jpg" },
  { name: "RIVERFRONT HEAVEN", location: "SWARGATE, PUNE", image: "/assets/Home_page/luxury_banglow.jpg" },
  { name: "LUXOR", location: "KARVE NAGAR", image: "/assets/Home_page/pool_view.jpg" },
  { name: "LUXOR", location: "KARVE NAGAR", image: "/assets/Home_page/balcony_side_view.jpg" },
  { name: "LUXOR", location: "KARVE NAGAR", image: "/assets/Home_page/luxury_banglow.jpg" },
  { name: "SWAPGANDHA SOCIETY", location: "SWARGATE, PUNE", image: "/assets/Home_page/pool_view.jpg" }
];

export default function OtherProject(primaryColor:any) {
  return (
    <div className="my-4" style={{color:primaryColor.primaryColor[0]}}>
        <h3 className="font-semibold my-2  text-lg">Other Project (by same builder)</h3>
    <div className="grid lg:grid-cols-4 lg:gap-4 gap-2">
      {properties.map((property, index) => (
         <Card
         key={index}
         className={`relative overflow-hidden rounded-2xl border-0 Imgshine ${
           index % 6 === 0 ? "col-span-2" : index % 6 === 2 ? "col-span-1" : index % 6 === 3 ? "col-span-1" : index % 6 === 5 ? "col-span-2" : "col-span-1"
         }`}
       >
          <Image
            src={property.image}
            alt={property.name}
            width={400}
            height={300}
            className="w-full lg:h-64 h-52 object-cover"
          />
          <CardContent className="absolute inset-0 flex flex-col justify-start p-4 bg-gradient-to-t from-transparent via-black/50 to-black/70">
            <h3 className="text-white text-sm lg:text-base font-semibold">{property.name}</h3>
            <p className="text-white text-xs">{property.location}</p>
          </CardContent>
        </Card>
      ))}
      </div>
    </div>
  );
}
