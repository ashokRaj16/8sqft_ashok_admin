// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const links = [
//   { name: "Contract", step: 1, link: "/Rental-Agreement/contract" },
//   { name: "Property", step: 2, link: "/Rental-Agreement/property" },
//   { name: "Landlord", step: 3, link: "/Rental-Agreement/landlord" },
//   { name: "Tenant", step: 4, link: "/Rental-Agreement/tenant" },
// ];

// export default function RentalNav() {
//   const pathname = usePathname(); // Get the current pathname using usePathname hook

//   return (
//     <div className="rental-nav bg-ui-text-dark w-full h-[30vh] py-8 px-48">
//       <div className="w-full h-full max-w-7xl mx-auto relative">
//         <div className="flex self-end">
//           {links.map((link, index) => (
//             <span key={index} className="flex items-center">
//               <Link href={link.link}>
//                 <span
//                   className={`border rounded-full px-3 py-1 ${
//                     pathname === link.link ? "text-black bg-white" : "text-gray"
//                   }`}
//                 >
//                   {link.step}
//                 </span>

//                 <span
//                   className={`${
//                     pathname === link.link ? "text-white" : "text-gray"
//                   }`}
//                 >
//                   {link.name}
//                 </span>
//               </Link>

//               {index !== links.length - 1 && (
//                 <span
//                   className={`${
//                     pathname === link.link ? "bg-white" : "bg-gray"
//                   }`}
//                 >
//                   <hr className="w-[10vw] bg-white self-center" />
//                 </span>
//               )}
//             </span>
//           ))}
//         </div>
        
//       </div>
//     </div>
//   );
// }
