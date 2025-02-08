// "use client";
// import React, { useState } from "react";
// import { FaUserCircle } from "react-icons/fa";

// const sections = ["Basic Profile", "My Properties", "Shortlist", "Interested", "Your Projects", "My Payment"];

// const ProfilePage = () => {
//   const [activeSection, setActiveSection] = useState("Basic Profile");

//   return (
//      <div className="">
//     <div className="h-30 flex bg-black m-8">

//       <aside className=" bg-black text-white ">
//         <div className="flex flex-col items-center gap-4 mb-8  ">
//           <FaUserCircle size={48} className="text-gray-300" />
//           <div>
//             <h2 className="text-lg font-semibold pl-4">Prakash Rathwa</h2>
//             <p className="text-sm text-gray-400 pl-4">prakashrathwa80@gmail.com</p>
//           </div>
//         </div>

//         <nav className="space-y-4">
//           {sections.map((section) => (
//             <button
//               key={section}
//               onClick={() => setActiveSection(section)}
//               className={`block py-2 px-4 rounded-md w-full text-left ${
//                 activeSection === section
//                   ? "bg-orange-500 text-white"
//                   : "hover:bg-gray-700"
//               }`}
//             >
//               {section}
//             </button>
//           ))}
//         </nav>
//       </aside>

//       <main className="flex-1 p-10 bg-white shadow-lg rounded-lg ml-8 w-30">
//         {activeSection === "Basic Profile" && (
//           <div>
//             <h1 className="text-2xl font-semibold mb-6 border-b pb-2">
//               Edit Your Profile
//             </h1>
//             <form className="space-y-6">
//               <div className="flex flex-col">
//                 <label htmlFor="name" className="font-medium mb-2">
//                   Name:
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   placeholder="Enter your name"
//                 />
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="email" className="font-medium mb-2">
//                   Email Address:
//                 </label>
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="email"
//                     id="email"
//                     className="border border-gray-300 rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     placeholder="Enter your email"
//                   />
//                   <button
//                     type="button"
//                     className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
//                   >
//                     Resend Verification
//                   </button>
//                 </div>
//               </div>

//               <div className="flex flex-col">
//                 <label htmlFor="mobile" className="font-medium mb-2">
//                   Mobile Number:
//                 </label>
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="tel"
//                     id="mobile"
//                     className="border border-gray-300 rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     placeholder="Enter your mobile number"
//                   />
//                   <button
//                     type="button"
//                     className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
//                   >
//                     Number Verified
//                   </button>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   id="whatsapp-updates"
//                   className="w-5 h-5 border-gray-300 rounded"
//                 />
//                 <label
//                   htmlFor="whatsapp-updates"
//                   className="text-sm text-gray-700"
//                 >
//                   Get Updates on WhatsApp
//                 </label>
//               </div>

//               <button
//                 type="submit"
//                 className="px-6 py-3 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
//                 disabled
//               >
//                 Save Profile
//               </button>
//             </form>
//           </div>
//         )}

//         {activeSection !== "Basic Profile" && (
//           <h1 className="text-2xl font-semibold">
//             {activeSection} Section Content Coming Soon!
//           </h1>
//         )}
//       </main>
//     </div>
//     </div>
//   );
// };

// export default ProfilePage;
"use client";
"use client";
import React, { useState } from "react";

import Image from 'next/image';
const sections = ["Basic Profile", "My Properties", "Shortlist", "Interested", "My Projects", "My Payment"];

const MyProfile = () => {
    const [activeSection, setActiveSection] = useState("Basic Profile");

    return (
        <div className="flex items-center justify-center m-5 mt-10">
            {/* Container for Sidebar and Main Content */}
            <div className="p-10 flex rounded-lg shadow-lg overflow-hidden w-[90%] h-[80%] bg-black">
                {/* Sidebar */}

                <aside className="w-64 bg-black text-white p-6 flex-shrink-0">
                    {/* User Info */}
                    {/* <div className="flex flex-col items-center gap-4 mb-8 ">
            <FaUserCircle size={48} className="text-gray-300 " />
            <div>
              <h2 className="text-lg font-semibold text-start">Prakash Rathwa</h2>
              <p className="text-sm text-gray-400 text-center">prakashrathwa80@gmail.com</p>
            </div>
          </div> */}


                    <div className="flex flex-col items-start gap-4 ">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                            <Image
                                src="/assets/ProfileImg/unsplash_SoVpY7e4D5A.svg"
                                alt="Profile"
                                width={48}
                                height={48}
                                className="object-cover "
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Prakash Rathwa</h2>
                            <p className="text-sm text-gray-400">prakashrathwa80@gmail.com</p>
                        </div>
                    </div>


                    {/* Menu Items */}
                    <nav className="space-y-4 mr-4">
                        {sections.map((section) => (
                            <button
                                key={section}
                                onClick={() => setActiveSection(section)}
                                className={`block py-2  rounded-md w-full text-left ${activeSection === section
                                    ? "bg-orange text-white"
                                    : "hover:bg-gray-700"
                                    }`}
                            >
                                {section}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Section */}
                <main className="flex-1 p-8 bg-white rounded-lg overflow-y-auto ">
                    {activeSection === "Basic Profile" && (
                        <div>
                            <h1 className="text-2xl font-semibold mb-6 border-b pb-2">
                                Edit Your Profile
                            </h1>
                            <form className="space-y-6">
                                {/* Name Field */}
                                <div className="flex flex-row items-center ml-16">
                                    <label htmlFor="name" className="font-medium mb-2">
                                        Name:
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="flex flex-row items-center">
                                    <label htmlFor="email" className="font-medium mb-2">
                                        Email Address:
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="email"
                                            id="email"
                                            className="border border-gray-300 rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            placeholder="Enter your email"
                                        />
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                                        >
                                            Resend Verification
                                        </button>
                                    </div>
                                </div>

                                {/* Mobile Number Field */}
                                <div className="flex flex-row items-center">
                                    <label htmlFor="mobile" className="font-medium mb-2">
                                        Mobile Number:
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="tel"
                                            id="mobile"
                                            className="border border-gray-300 rounded-md px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            placeholder="Enter your mobile number"
                                        />
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                                        >
                                            Number Verified
                                        </button>
                                    </div>
                                </div>

                                {/* WhatsApp Updates Checkbox */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="whatsapp-updates"
                                        className="w-5 h-5 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor="whatsapp-updates"
                                        className="text-sm text-gray-700"
                                    >
                                        Get Updates on WhatsApp
                                    </label>
                                </div>

                                {/* Save Profile Button */}
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
                                    disabled
                                >
                                    Save Profile
                                </button>
                            </form>
                        </div>
                    )}

                    {/* {activeSection !== "Basic Profile" && (
            <h1 className="text-2xl font-semibold">
              {activeSection} Section Content Coming Soon!
            </h1>
          )} */}


                    {/* {activeSection === "My Properties" && (
                        <div>
                            <div className="border-b">
                                <div>
                                    <h1 className="text-2xl font-semibold  pb-2 ">
                                        My Properties
                                    </h1>
                                    <p>Currently Available</p>
                                </div>
                            </div>
                            


                        </div>

                    )} */}
                    {activeSection === "My Properties" && (
                        <div className="p-4">
                            {/* Header Section */}
                            <div className="border-b pb-4 mb-4">
                                <h1 className="text-2xl font-semibold">My Properties</h1>
                                <p className="text-gray-600">Currently Available</p>
                            </div>

                            {/* Filter Section */}
                            <div className="flex gap-2  pb-4 border-b mb-4">
                                {[
                                    "All",
                                    "Current Status",
                                    "Rent",
                                    "Sell",
                                    "Commercial-Rent",
                                    "Commercial-Sell",
                                    "PG/Hostel",
                                    "Land/Plot",
                                    "Projects",
                                ].map((filter, index) => (
                                    <button
                                        key={index}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${filter === "All"
                                            ? "bg-primary text-white border-orange-500"
                                            : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>

                            {/* Property Cards Section */}
                            <div className="flex gap-4 overflow-x-auto">
                                {[1, 2].map((property, index) => (
                                    <div
                                        key={index}
                                        className="w-80 border rounded-lg overflow-hidden shadow-md bg-white"
                                    >
                                        {/* Image Section */}
                                        <div className="h-40 w-full">
                                            <Image
                                                src="/path-to-property-image.jpg"
                                                alt="Property"
                                                width={320}
                                                height={160}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-4">
                                            <p className="text-sm text-gray-500">In Progress</p>
                                            <h2 className="text-lg font-semibold">
                                                Shop in City Avenues, Pune
                                            </h2>
                                            <p className="text-sm text-gray-400">
                                                City Avenue, Wakad
                                            </p>
                                            <p className="text-lg font-semibold text-orange-600">
                                                Sell: ₹50,00,000
                                            </p>
                                            <div className="mt-4 flex gap-2">
                                                <button className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600">
                                                    Edit
                                                </button>
                                                <button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-100">
                                                    Go Luxury
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}




                    {activeSection === "Shortlist" && (
                        <div>
                            <h1 className="text-2xl font-semibold mb-6 border-b pb-2">
                                Your Shortlist
                            </h1>
                            <p>Currently, there is no shortlist.</p>
                        </div>
                    )}


                    {/* {activeSection === "Interested" && (
                        <div>
                            <h1 className="text-2xl font-semibold mb-6 border-b pb-2">
                                Current Status
                            </h1>
                        </div>
                    )} */}
                    {activeSection === "Interested" && (
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            {/* Header Section */}
                            <h1 className="text-2xl font-semibold mb-4">What’s your contact</h1>
                            <p className="text-gray-600 mb-6">Currently Interested Properties</p>

                            {/* Filter Section */}
                            <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
                                {[
                                    "All",
                                    "Rent",
                                    "Sell",
                                    "Commercial-Rent",
                                    "Commercial-Sale",
                                    "PG/Hostel",
                                    "Land/Plot",
                                    "Projects",
                                ].map((filter, index) => (
                                    <button
                                        key={index}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${filter === "All"
                                            ? "bg-primary text-white border-orange-500"
                                            : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>

                            {/* Table Section */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-primary text-white">
                                            <th className="px-4 py-2 border border-gray-300 text-left">Your Property</th>
                                            <th className="px-4 py-2 border border-gray-300 text-left">Name</th>
                                            <th className="px-4 py-2 border border-gray-300 text-left">Mobile</th>
                                            <th className="px-4 py-2 border border-gray-300 text-left">Email</th>
                                            <th className="px-4 py-2 border border-gray-300 text-left">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[1, 2].map((_, index) => (
                                            <tr key={index} className="text-gray-700">
                                                <td className="px-4 py-2 border border-gray-300">
                                                    2 BHK House for Rent in City Avenue
                                                </td>
                                                <td className="px-4 py-2 border border-gray-300">Prakash Rathwa</td>
                                                <td className="px-4 py-2 border border-gray-300">+91 ********89</td>
                                                <td className="px-4 py-2 border border-gray-300">
                                                    rathwaprakash80@gmail.com
                                                </td>
                                                <td className="px-4 py-2 border border-gray-300">
                                                    2025-01-01 04:00:00 PM
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}



                    {activeSection === "My Projects" && (
                        <div>
                            <h1 className="text-2xl font-semibold mb-6 border-b pb-2">
                                Current Status
                            </h1>
                            <p>Currently, there is no listout projects.</p>
                        </div>
                    )}


                    {activeSection === "My Payment" && (
                        <div>
                            <h1 className="text-2xl font-semibold mb-6 border-b pb-2">
                                Payment Status
                            </h1>
                            <p>Currently, there is no payment history.</p>
                        </div>
                    )}




                </main>
            </div>
        </div>
    );
};

export default MyProfile;
