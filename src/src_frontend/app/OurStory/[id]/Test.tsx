import React, { useState } from 'react';
import Img from '@/public/assets/OurStory/Image-1.png';
import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';
const panes = [

  {
    title: 'Build',
    subtitle: 'Realize your vision',
    color: 'primary',
    icon: 'apple-alt',
    bgClass: 'bg-yellow-img',
  },
  {
    title: 'Explore',
    subtitle: 'Discover the world',
    color: 'green',
    icon: 'tree',
    bgClass: 'bg-green-img',
  },
  {
    title: 'Adapt',
    subtitle: 'Embrace the times',
    color: 'blue',
    icon: 'tint',
    bgClass: 'bg-blue-img',
  },
  {
    title: 'Inspire',
    subtitle: 'Share your potential',
    color: 'primary',
    icon: 'palette',
    bgClass: 'bg-purple-img',
  },
];

const PaneGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="text-primary-black antialiased bg-[#FFF3E6E5] flex flex-col sm:flex-row items-stretch sm:items-center ">
      <div className="flex flex-col sm:flex-row flex-grow items-stretch max-w-full min-w-md w-full sm:h-[85vh] sm:overflow-hidden">
        {panes.map((pane, index) => (
          <div
            key={index}
          
            className={`cursor-pointer duration-700 ease-in-out flex-grow overflow-hidden pane relative transition-all ${
              activeIndex === index ? 'active' : ''
            }`}
          >
              <label   onClick={() => setActiveIndex(index)} className='flex justify-center items-center'  style={{writingMode: 'sideways-lr'}}>
          {pane.title}
          <div>{activeIndex === index ?<Minus/> : <Plus/>}</div>
          </label>
            {/* <div
              className={`absolute flex items-center justify-center inset-0 z-10 bg-center bg-cover bg-no-repeat duration-700 ease-in-out scale-105 transition-all bg-[#FFF3E6E5]`}
            >
          <label className=' vertical-rl' style={{writingMode: 'vertical-rl'}}>
          {pane.title}
          </label>
            </div> */}
            {/* <div className="absolute inset-x-0 bottom-0 h-1/2 translate-y-1/2 bg-gradient-to-b from-transparent to-black opacity-0 shadow transform transition-all duration-700 ease-in-out z-20"></div> */}
            <div className="absolute bottom-0 left-0 flex ml-4 label transition-all duration-700 ease-in-out z-30">
          
              {/* <div
                className={`w-10 h-10 mr-3 flex items-center justify-center rounded-full text-${pane.color}-500 bg-[#0f1011]`}
              >
                <i className={`fas fa-${pane.icon}`}></i>
              </div> */}
              <div className="flex flex-col justify-center leading-tight text-white whitespace-pre content relative">
                <div className="font-bold opacity-0 transform translate-x-8 duration-700 ease-in-out transition-all relative">
              <Image src={Img} alt='img' width={900} height={500} className='w-full h-full'/>
                </div>
                <div className="absolute opacity-0 transform translate-x-8 delay-100 duration-700 ease-in-out transition-all ">
                  {pane.title}
                  {pane.subtitle}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaneGallery;










// "use client";
// import { useState } from 'react';
// import Img from '@/public/assets/OurStory/Image-1.png';
// import Image from 'next/image';
// const PaneGallery = () => {
//   const [activeIndex, setActiveIndex] = useState<number | null>(null);

//   const items = [
//     {
//       title: "Enhanced Space",
//       content: "At Yashraj Nakshatra, there is always room for more. Explore the largest master bedroom in the locale.",    
//     },
//     {
//       title: "Sparkling Views",
//       content: "At Yashraj Nakshatra, there is always room for more. Explore the largest master bedroom in the locale.",    
//     },
//     {
//       title: "Ample Light & Ventilation",
//       content: "At Yashraj Nakshatra, there is always room for more. Explore the largest master bedroom in the locale.",    
//     },
//     {
//       title: "Life Above All",
//       content: "At Yashraj Nakshatra, there is always room for more. Explore the largest master bedroom in the locale.",    
//     },
//     {
//       title: "The New Normal",
//       content: "At Yashraj Nakshatra, there is always room for more. Explore the largest master bedroom in the locale.",    
//     },
//     {
//       title: "The Water Closet",
//       content: "At Yashraj Nakshatra, there is always room for more. Explore the largest master bedroom in the locale.",    
//     },
//   ];


//   return (
//      <div className="w-[500px] mx-auto  -rotate-90 text-primary-black">
//     {items.map((item, index) => (
//       <div 
//         key={index}
//         className={`rounded-lg overflow-hidden transition-all duration-300 bg-white`}
//       >
//         <button
//           className="w-full p-6 text-left flex items-start justify-between"
//           onClick={() => setActiveIndex(activeIndex === index ? null : index)}
//         >
//           <div className="flex items-start gap-4">
         
//             <div>
//               <h3 className="text-xl font-semibold text-gray-800 mb-1">
//                 {item.title}
//               </h3>
//             </div>
//           </div>
//           <span className="text-gray-600 text-xl mt-2">
//             {activeIndex === index ? '−' : '+'}
//           </span>
//         </button>
        
//         <div
//           className={`transition-all duration-300 overflow-hidden ${
//             activeIndex === index ? ' opacity-100' : 'max-h-0 opacity-0'
//           }`}
//         >
//           <div className="px-6 pb-6 pt-2 border-gray-100 rotate-90 relative w-[900px] h-[500px]">
//           <div className="absolute">
//           <Image src={Img} alt='img' width={500} height={300} className='w-full'/>
//             <p className="absolute top-1/2">
//               {item.content}
//             </p>
//           </div>
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
//   );
// };

// export default PaneGallery;