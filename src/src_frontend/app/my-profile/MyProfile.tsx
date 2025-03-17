

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/hooks/index";
import Image from "next/image";
import MyProperties from "./MyProperties";
import Shortlist from "./Shortlist";
import Contacted from "./Contacted";
import MyProjects from "./MyProjects";
import BasicProfileComponent from "./BasicProfileComponent";
import { useAuthStore } from "@/Store/jwtTokenStore";
import { useMediaQuery } from "usehooks-ts";
import MyPayment from "./MyPayment";
import { FaCircleUser } from "react-icons/fa6";
import Subscription from "./Subscription";
const MyProfile = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768 ? "Dashboard" : "My Profile"
  );

  // const [profileData, setProfileData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>({
    fname: "",
    email: "",
    profile_image: "",
  });
  const [userType, setUserType] = useState<string[] | null>(null);
  const [paymentId, setPaymentId] = useState<number[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const isMobile = useMediaQuery("(max-width: 768px)");
  // console.log("Profi);
  // console.log("tokennn", token)
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        // router.push("/");
        // console.log("No token found, skipping fetch...");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("/api/v1/front/profile", {
          headers: {
            "x-api-key": "A8SQFT7767",
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = response.data.data || [];

        console.log("response...........", data);

        setProfileData(data);
        setError(null);
      } catch (err: any) {
        // console.log(err)
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);
    console.log("payyyy",paymentId)
  // console.log("UserType in MyProfile:", userType);
  useEffect(() => {
    // Prevent redirect on refresh if token exists
    if (!token) {
      // console.log("Redirecting to home due to missing token...");
      // router.push("/");
    }
  }, [token, router]);

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem("authToken");
    router.push("/");
    // console.log("User logged out successfully.");
  };

  const sections = [
    "My Profile",
    "Shortlist",
    "You Contacted",
    "My Properties",
    "My Projects",
    "Subscription",
    "Payment History",
  ];

  if (isMobile) {
    return (
      <div className="w-full min-h-screen bg-white ">

        {/* <div className="flex flex-row items-center  pb-2">

          {activeSection === "Dashboard" &&
          
          }
        </div> */}

        {activeSection === "Dashboard" ? (
          <>
            <div className=" w-full flex items-center py-4   pb-4 gap-4  border-b-[1px] relative">
              <button onClick={() => router.back()} className="text-2xl ml-2 left-0">{"<"}</button>
              <h2 className=" text-lg text-[#222222] font-medium align-middle mx-auto">User Dashboard</h2>
            </div>
            <div className="flex flex-row items-center  gap-2 border-b pb-[15px]">
              <div>

                <FaCircleUser size={38} className="text-black ml-2" />

              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold mt-2">{profileData?.fname || "User"}</h2>
                <p className="text-sm text-gray-500">{profileData?.email || "No email available"}</p>
              </div>
            </div>

            <nav className="">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className="w-full flex justify-between items-center py-3 px-4 border-b transition  group hover:bg-primary hover:text-white"
                >
                  {section} <span className="text-primary hover:text-white">{">"} </span>
                </button>
              ))}
            </nav>

            <div className="mt-6 flex justify-center">
              <button onClick={handleLogout} className="px-6 py-2 border rounded-md text-primary">Sign out</button>
            </div>
          </>
        ) : (
          <div className="mt-2">
            {activeSection === "My Profile" && <BasicProfileComponent setActiveSection={setActiveSection} profileData={profileData}  />}
            {activeSection === "Shortlist" && <Shortlist setActiveSection={setActiveSection} />}
            {activeSection === "You Contacted" && <Contacted setActiveSection={setActiveSection} />}

            {activeSection === "My Properties" && (
              <MyProperties setActiveSection={setActiveSection} userType={setUserType} />
            )}
            {activeSection === "My Projects" && <MyProjects setActiveSection={setActiveSection} userType={setUserType} />}
            {activeSection==="Subscription" && <Subscription setActiveSection={setActiveSection} setPaymentId={setPaymentId}  />}
            {activeSection === "Payment History" && <MyPayment setActiveSection={setActiveSection} paymentId={paymentId} />}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center mt-10 w-full">
      <div className="p-10 flex rounded-lg shadow-lg overflow-hidden w-[90%] h-[80%] bg-black">
        <aside className="w-64 bg-black text-white p-6 flex-shrink-0">
          <div className="flex flex-col items-start gap-4">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full overflow-hidden">

                  <FaCircleUser size={38} className="text-white ml-2" />

                </div>
                <div className="border-b-2 border-primary pb-2">
                  <h2 className="text-lg font-semibold">{profileData?.fname || "User"}</h2>
                  <p className="text-sm text-gray-400">{profileData?.email || "No email available"}</p>
                </div>
              </>
            )}
          </div>

          <nav className="space-y-4 mr-4">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`block py-2 rounded-md w-full text-left text-gray ${activeSection === section ? " text-white" : ""
                  }`}
              >
                {section}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8 bg-white rounded-lg overflow-y-auto">
          {activeSection === "My Profile" && <BasicProfileComponent setActiveSection={setActiveSection} profileData={profileData}  />}
          {activeSection === "Shortlist" && <Shortlist setActiveSection={setActiveSection} />}
          {activeSection === "You Contacted" && <Contacted setActiveSection={setActiveSection} />}

          {activeSection === "My Properties" && (
            <MyProperties setActiveSection={setActiveSection} userType={setUserType} />
          )}
          {activeSection === "My Projects" && <MyProjects setActiveSection={setActiveSection} userType={setUserType} />}

          {activeSection==="Subscription" && <Subscription setActiveSection={setActiveSection} setPaymentId={setPaymentId}/>}

          {activeSection === "Payment History" && <MyPayment setActiveSection={setActiveSection} paymentId={paymentId} />}
        </main>
      </div>
    </div>
  );
};

export default MyProfile;



