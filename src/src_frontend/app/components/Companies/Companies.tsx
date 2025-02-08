// "use client"
// import { Icon } from "@radix-ui/react-select";
// import Image from "next/image";
// import React, { Component, ReactNode } from "react";
// import { FaFacebook, FaGoogle, FaGraduationCap, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
// import Slider from "react-slick";

// // IMAGES DATA FOR CAROUSEL
// interface Data {
//     id: number;
//     icon: ReactNode; // For React components like icons
//     label: string;
//     link: string;
//   }

// const data : Data[] = [
//   { id: 1, icon: <FaFacebook />, label: "Facebook", link: "https://facebook.com" },
//   { id: 2, icon: <FaInstagram />, label: "Instagram", link: "https://instagram.com" },
//   { id: 3, icon: <FaLinkedin />, label: "LinkedIn", link: "https://linkedin.com" },
//   { id: 4, icon: <FaYoutube />, label: "YouTube", link: "https://youtube.com" },
//   { id: 5, icon: <FaGoogle />, label: "Google", link: "https://google.com" },
//   { id: 6, icon: <FaGraduationCap />, label: "Udemy", link: "https://udemy.com" },
// ];


// // CAROUSEL SETTINGS
// export default class MultipleItems extends Component {
//     render() {
//         const settings = {
//             dots: false,
//             infinite: true,
//             slidesToShow: 4,
//             slidesToScroll: 1,
//             arrows: false,
//             autoplay: true,
//             speed: 2000,
//             autoplaySpeed: 2000,
//             cssEase: "linear",
//             responsive: [
//                 {
//                     breakpoint: 1024,
//                     settings: {
//                         slidesToShow: 4,
//                         slidesToScroll: 1,
//                         infinite: true,
//                         dots: false
//                     }
//                 },
//                 {
//                     breakpoint: 700,
//                     settings: {
//                         slidesToShow: 2,
//                         slidesToScroll: 1,
//                         infinite: true,
//                         dots: false
//                     }
//                 },
//                 {
//                     breakpoint: 500,
//                     settings: {
//                         slidesToShow: 1,
//                         slidesToScroll: 1,
//                         infinite: true,
//                         dots: false
//                     }
//                 }
//             ]
//         };

//         return (

//             <div className='text-center'>
//                 <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
//                     <div className="py-14">
//                         <Slider {...settings}>
//                             {data.map((item, i) =>
//                                <div key={item.id} className="flex flex-col items-center justify-center ">
//                                <div className="text-blue-500 text-4xl">{item.icon}</div>
                               
//                              </div>
//                             )}
//                         </Slider>
//                     </div>
//                     <hr />
//                 </div>
//             </div>

//         )
//     }
// }
