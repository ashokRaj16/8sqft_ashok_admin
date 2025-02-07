// // components/ReraBadge.tsx

// import { FC } from "react";

// interface ReraBadgeProps {
//   title?: string;
// }

// const ReraBadge: FC<ReraBadgeProps> = ({ title }) => {
//   return (
//     <div className="relative flex items-center mx-auto">
//       {/* RERA Badge */}
//       <div className="absolute left-0 flex w-[64px] h-[18px] pt-[2px] pr-0 pb-[2px] pl-0 flex-col gap-[4px] justify-center items-center flex-nowrap bg-[#f4f4f4] border-solid border border-[#e6e6e6]">
//         <div className="flex w-[58.11px] gap-[5px] items-center shrink-0 flex-nowrap relative">
//           <div className="w-[8.61px] h-[7px] shrink-0 bg-cover bg-no-repeat relative z-[1]" />
//           <div className="flex w-[25px] gap-[4px] justify-center items-center shrink-0 flex-nowrap relative z-[2]">
//             <span className="h-[12px] shrink-0 basis-auto text-[10px] font-normal leading-[12px] text-[#222222] tracking-[0.2px] relative text-left whitespace-nowrap z-[3]">
//               RERA
//             </span>
//           </div>
//           <div className="w-[14.5px] h-[14.5px] shrink-0 bg-cover bg-no-repeat relative z-[4]" />
//         </div>
//       </div>

//       {/* Title */}
//       <h1 className="ml-[70px] text-xl font-semibold">{title}</h1>
//     </div>
//   );
// };

// export default ReraBadge;
