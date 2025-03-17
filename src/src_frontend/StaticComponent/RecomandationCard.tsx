// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardTitle,
// } from "@/ui/card";
// import Image from "next/image";

// interface RecomandationCardProps {
//   title: string;
//   location: string;
//   area: string;
//   deposit: string;
//   rent: string;
//   imageUrl: string;
// }
// const imageProps = {
//   imageUrl: '',
  
// }
// export default function RecomandationCard({
//   title,
//   location,
//   area,
//   deposit,
//   rent,
//   imageUrl,
// }: RecomandationCardProps) {
//   return (
//     <Card className="relative w-[400px] h-[240px] rounded-lg overflow-hidden ">
     
//       <div className="absolute inset-0">
//         <Image
//           src={imageUrl}
//           alt="Background"
   
//           priority
//           width={530}
//           height={200}
//           style={{objectFit : 'cover'}}
//         />
//       </div>

//       <div className="relative w-full h-full flex flex-col justify-end p-4">
//         <CardContent />
//         <CardFooter  className=" bg-gradient-to-r from-blue-dark to-primary-light bg-opacity-80 cursor-pointer">
   
//           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-90"></div>
         
//           <div className="relative flex justify-between w-full p-4">
//             <div>
//               <CardTitle className="text-sm font-semibold leading-tight line-clamp-2 text-white">
//                 {title}
//               </CardTitle>
//               <CardDescription className="text-xs font-medium text-white">
//                 {location}
//               </CardDescription>
//             </div>
//             <div className="text-right space-y-1">
//               <p className="text-xs font-medium text-white">{area}</p>
//               <p className="text-xs font-medium text-white">{deposit}</p>
//               <p className="text-xs font-medium text-white">{rent}</p>
//             </div>
//           </div>
//         </CardFooter>
//       </div>
//     </Card>
//   );
// }
  
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/ui/card";
import { formatNumber } from "@/utils/priceFormatter";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RecommendationCardProps {
  id:number,
  title: string;
  location: string;
  area: string;
  deposit: string;
  rent: string;
  imageUrl: string;
}


export default function RecommendationCard({
  id,
  title,
  location,
  area,
  deposit,
  rent,
  imageUrl,
}: RecommendationCardProps) {

  const router = useRouter();
  const moveToDetailsHandler =(id:number) => {
    router.push(`/PropertyDetailsPage/${id}`); 
  }
  return (
   
   <>

<Card onClick={()=>moveToDetailsHandler(id)} className="relative h-[200px] rounded-lg overflow-hidden shadow-lg  " >
      {/* Background image with gradient overlay */}
      <div
     
      className="absolute   inset-0 bg-gradient-to-t from-transparent to-black/80">
        <Image
          src={imageUrl}
          alt="Property"
          priority
          fill
          style={{
            objectFit: "cover",
            // background: "linear-gradient(rgba(0, 0, 0, 0.00), rgba(0, 0, 0, 0.00), transparent), rgb(94, 63, 224)",
            borderRadius: "8px",
            position: "absolute",
            inset: "0",
          }}
        />
      </div>

      {/* Content with Gradient Footer */}
      <div  style={{background: "linear-gradient(359.32deg, #000000c2 12.37%, transparent 65.77%)"}} 
       className="relative w-full h-full flex flex-col justify-end">
        <CardFooter className="relative bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 rounded-b-lg align-middle">
          <div className="flex justify-between w-full   ">
            <div className="flex flex-col justify-end mr-4">
              <CardTitle className="text-base font-bold text-white leading-tight whitespace-nowrap text-ellipsis w-10 ">
              {title.length > 10 ? `${title.slice(0, 10)}...` : title}
              </CardTitle>
              <CardDescription className="text-sm text-white">
                {location.length > 18 ? `${location.slice(0, 15)}...` : location}
              </CardDescription>
            </div>
            <div className="text-right whitespace-nowrap">
              {/* <p className="text-sm text-white">{area || ''}</p> */}
              <p className="text-sm text-white">Deposit: ₹ {formatNumber(Number(deposit))}</p>
              <p className="text-sm text-white">Rent: ₹ {formatNumber(Number(rent))}</p>
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
   </>
    
  );
}