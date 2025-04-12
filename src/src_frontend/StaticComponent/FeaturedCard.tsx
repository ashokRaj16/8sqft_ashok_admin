// 'use client ';
// import { Button } from "@/ui/Button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// import React from "react";
// import { BiRightArrowAlt } from "react-icons/bi";

// interface FeaturedCardProps {
//   id:number
//   title: string;
//   location: string;
//    imageUrl: string;
//   beds: number;
//   washrooms: number|undefined;
//   balconies: number;
//   area: number;
//   price: string;
//   priceType: string;
//   badgeImageUrl?: string;
//   className?: string;

// }

// const FeaturedCard: React.FC<FeaturedCardProps> = ({
//   id,
//   title,
//   location,
//   imageUrl,
//   beds,
//   washrooms,
//   balconies,
//   area,
//   price,
//   priceType,

// }) => {

//     const router = useRouter();
//   const moveToDetailsHandler =(id:number) => {
//     router.push(`/PropertyDetailsPage/${id}`);
//   }

//   return (

// <Card className="w-[350px] min-h-[380px] rounded-lg overflow-hidden shadow-lg flex-shrink-0 mb-4 relative bg-white flex flex-col">

//   <CardContent className="p-4 flex flex-col h-full">
//     <Image
//       src={imageUrl}
//       alt={title}
//       width={150}
//       height={50}
//       className="w-full h-40 object-cover rounded-md"
//     />

//     <CardHeader className="space-y-1 text-left p-0 flex-1">
//       <CardTitle className="text-md sm:text-lg font-semibold truncate line-clamp-2">
//         {title}
//       </CardTitle>
//       <p className="text-[10px] md:text-sm text-muted-foreground">{location}</p>
//     </CardHeader>

//     <div className="flex justify-between text-[10px] sm:text-sm text-muted-foreground my-3">
//       <div className="flex flex-col space-y-1">
//         <div className="flex items-center gap-1">
//           <Image src="/assets/FeaturedCard/beds.svg" alt="Beds" width={15} height={10} />
//           <p>{beds} Beds</p>
//         </div>
//         <div className="flex items-center gap-1">
//           <Image src="/assets/FeaturedCard/washroon.svg" alt="Washrooms" width={15} height={10} />
//           <p>{washrooms} Washrooms</p>
//         </div>
//       </div>
//       <div className="flex flex-col space-y-1">
//         <div className="flex items-center gap-1">
//           <Image src="/assets/FeaturedCard/balcony.svg" alt="Balconies" width={15} height={10} />
//           <p>{balconies} Balconies</p>
//         </div>
//         <div className="flex items-center gap-1">
//           <Image src="/assets/FeaturedCard/sqft.svg" alt="Area" width={15} height={10} />
//           <p>{area} sqft</p>
//         </div>
//       </div>
//     </div>

//     <div className="flex justify-between items-center gap-3 mt-auto">
//       <div className="w-full flex flex-col border border-gray-300 rounded-md p-3">
//         <p className="text-left text-[10px] lg:text-sm">For Rent</p>
//         <div className="flex items-center">
//           <span className="text-sm lg:text-lg font-semibold text-primary">
//             Rs {price}
//           </span>
//           <span className="text-[10px] text-primary">{priceType}</span>
//         </div>
//       </div>
//       <Button onClick={() => moveToDetailsHandler(id)} className="bg-primary text-white h-full py-5">
//         <BiRightArrowAlt size={30} />
//       </Button>
//     </div>
//   </CardContent>
// </Card>
// );
// };

// export default FeaturedCard;

"use client ";
import ShareShortlist from "@/app/components/common/ShareShortlist";
import { Button } from "@/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React from "react";
import { CiLocationOn } from "react-icons/ci";
import { IoIosArrowRoundForward } from "react-icons/io";

interface FeaturedCardProps {
  id: number;
  title: string;
  propertyIdSlug?: string;
  location: string;
  imageUrl: string;
  beds: number;
  washrooms: number | undefined;
  balconies: number;
  area: number;
  price: string;
  priceType: string;
  badgeImageUrl?: string;
  className?: string;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({
  id,
  title,
  propertyIdSlug,
  location,
  imageUrl,
  beds,
  washrooms,
  balconies,
  area,
  price,
  priceType,
}) => {
  const router = useRouter();
  const moveToDetailsHandler = (id: number) => {
    router.push(`/PropertyDetailsPage/${id}`);
  };
  return (
    <Card className="lg:w-[348px] rounded-2xl border-0 overflow-hidden shadow-lg flex-shrink-0 mb-4 relative bg-white">
      {/* Title & Location */}
      <CardHeader className="text-left px-3 pb-0 space-y-0">
        {/* Image */}
       <div className="relative">
       <Image
          src={imageUrl}
          alt={title}
          width={150}
          height={50}
          className="w-full h-44 object-cover rounded-2xl shadow-lg"
        />
           <div className="absolute right-4 top-3">
            <ShareShortlist
            btnHeight="h-9"
            btnWidth="w-9"
            btnPadding="p-2"
              background={"bg-white"}
              shadow={"shadow-lg"}
              rounded={"rounded-full"}
              fontSize={"text-xs"}
              textTransform={"uppercase"}
              fontWeight={"font-light"}
              hoverBackground={"hover:bg-primary"}
              hoverTextColor={"hover:text-white"}
              iconColor={"text-primary"}
              iconHoverColor={"group-hover:text-white"}
              propertyId={id}
              propertyIdSlug={propertyIdSlug}
              btnSaveText={"Save"}
              showBtnText={false}
               />
          </div>
       </div>

        <CardTitle className="text-md sm:text-lg font-semibold truncate text-primary-black mt-3">
          {title.length > 30 ? title.substring(0, 30) + "..." : title}
        </CardTitle>
        <p className="text-[10px] lg:text-xs text-[#636363] flex gap-1 items-center mb-2">
          <CiLocationOn size={15}/>
          {location}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col justify-between h-full px-3">
        {/* Property Details */}
        <div className="flex justify-between text-[10px] sm:text-sm ">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-1">
              <Image
                src="/assets/FeaturedCard/beds.svg"
                alt="Beds"
                width={20}
                height={20}
              />
              <p className="text-[#636363]">{beds} Beds</p>
            </div>
            <div className="flex items-center gap-1">
              <Image
                src="/assets/FeaturedCard/washroon.svg"
                alt="Washrooms"
                width={20}
                height={20}
              />
              <p className="text-[#636363]">{washrooms} Washrooms</p>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-1">
              <Image
                src="/assets/FeaturedCard/balcony.svg"
                alt="Balconies"
                width={20}
                height={20}
              />
              <p className="text-[#636363]">{balconies} Balconies</p>
            </div>
            <div className="flex items-center gap-1">
              <Image
                src="/assets/FeaturedCard/sqft.svg"
                alt="Area"
                width={20}
                height={20}
              />
              <p className="text-[#636363]">{area} sqft</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center gap-3 px-3">
        <div className="w-full flex flex-col">
          <p className="text-left text-[10px] lg:text-sm text-primary-black">
            For Rent
          </p>
          <div className="flex items-center">
            <span className="text-sm lg:text-lg font-semibold text-primary">
              Rs {price}
            </span>
           {priceType&&( <span className="text-xs lg:text-sm text-primary">
              /{priceType}
            </span>)}
          </div>
        </div>
        <Button
          onClick={() => moveToDetailsHandler(id)}
          className="bg-primary text-white h-10 w-10 rounded-full p-2"
        >
          <IoIosArrowRoundForward size={25} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeaturedCard;
