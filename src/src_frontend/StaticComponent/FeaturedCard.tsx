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

'use client ';
import { Button } from "@/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React from "react";
import { BiRightArrowAlt } from "react-icons/bi";

interface FeaturedCardProps {
  id:number
  title: string;
  location: string;
   imageUrl: string;
  beds: number;
  washrooms: number|undefined;
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
  const moveToDetailsHandler =(id:number) => {
    router.push(`/PropertyDetailsPage/${id}`); 
  }
  

  return (
  

<Card className="w-[348px] h-[420px] rounded-lg overflow-hidden shadow-lg flex-shrink-0 mb-4 relative bg-white">
<CardContent className="p-4 flex flex-col justify-between h-full">
  {/* Image */}
  <Image
    src={imageUrl}
    alt={title}
    width={150}
    height={50}
    className="w-full h-40 object-cover rounded-md"
  />

  {/* Title & Location */}
  <CardHeader className="text-left p-0">
    <CardTitle className="text-md sm:text-lg font-semibold truncate">
      {title.length > 30 ? title.substring(0, 30) + "..." : title}
    </CardTitle>
    <p className="text-[10px] md:text-sm text-muted-foreground">{location}</p>
  </CardHeader>

  {/* Property Details */}
  <div className="flex justify-between text-[10px] sm:text-sm text-muted-foreground my-3">
    <div className="flex flex-col space-y-1">
      <div className="flex items-center gap-1">
        <Image src="/assets/FeaturedCard/beds.svg" alt="Beds" width={15} height={10} />
        <p>{beds} Beds</p>
      </div>
      <div className="flex items-center gap-1">
        <Image src="/assets/FeaturedCard/washroon.svg" alt="Washrooms" width={15} height={10} />
        <p>{washrooms} Washrooms</p>
      </div>
    </div>
    <div className="flex flex-col space-y-1">
      <div className="flex items-center gap-1">
        <Image src="/assets/FeaturedCard/balcony.svg" alt="Balconies" width={15} height={10} />
        <p>{balconies} Balconies</p>
      </div>
      <div className="flex items-center gap-1">
        <Image src="/assets/FeaturedCard/sqft.svg" alt="Area" width={15} height={10} />
        <p>{area} sqft</p>
      </div>
    </div>
  </div>

  {/* Pricing & Button */}
  <div className="flex justify-between items-center gap-3">
    <div className="w-full flex flex-col border border-gray-300 rounded-md p-3">
      <p className="text-left text-[10px] lg:text-sm">For Rent</p>
      <div className="flex items-center">
        <span className="text-sm lg:text-lg font-semibold text-primary">
          Rs {price}
        </span>
        <span className="text-[10px] text-primary">{priceType}</span>
      </div>
    </div>
    <Button onClick={() => moveToDetailsHandler(id)} className="bg-primary text-white h-full py-5">
      <BiRightArrowAlt size={30} />
    </Button>
  </div>
</CardContent>
</Card>
 

  );
};

export default FeaturedCard;

