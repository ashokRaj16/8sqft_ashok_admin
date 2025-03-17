import { useMediaQuery } from "usehooks-ts";
import Image from "next/image";
import { useEffect, useState } from "react";
// import axios from "axios";
import axios from "@/hooks/index";
import { useAuthStore } from "@/Store/jwtTokenStore";
import { filter } from "lodash";
import useDialogStore from "@/Store/useDialogStore ";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ContactedUsers from "./ContactedUsers"
import ShortlistedUsers from "./ShortlistedUsers"
interface BasicProfileProps {
    setActiveSection: (section: string) => void;
    userType: (userTypes: string[]) => void;

}

interface Property {
    id: number;
    user_id: number;
    form_step_id: string;
    form_status: string;
    user_type: string;
    property_title: string | null;
    company_name: string;
    description: string | null;
    short_description: string | null;
    building_name: string | null;
    landmark: string | null;
    locality: string | null;
    city_id: number | null;
    state_id: number | null;
    city_name: string | null;
    state_name: string | null;
    pincode: string | null;
    latitude: number | null;
    longitude: number | null;
    land_area: number | null;
    land_area_unit: string | null;
    property_availibility_type: string | null;
    is_maintenance: boolean | null;
    property_variety_type: string | null;
    builtup_area: number | null;
    builtup_area_unit: string | null;
    rent_amount: number | null;
    deposite_amount: number | null;
    property_type: string;
    bed_rooms: number | null;
    washrooms: number | null;
    floor_number: number | null;
    total_floors: number | null;
    property_floors: number | null;
    balcony: number | null;
    is_wings: boolean | null;
    wings_count: number | null;
    unit_number: string | null;
    total_wing: number | null;
    wing_name: string | null;
    property_variety: string | null;
    property_rent_buy: string;
    rent_is_nogotiable: boolean | null;
    deposite_is_negotiable: boolean | null;
    availability_date: string | null;
    availability_duration: string | null;
    property_age: string | null;
    furnishing_status: string | null;
    parking: string | null;
    water_supply: string | null;
    washroom_type: string | null;
    granted_security: string | null;
    other_amenities: string | null;
    door_facing: string | null;
    preferred_tenent: string | null;
    pet_allowed: boolean;
    non_veg_allowed: boolean;
    expected_amount: number | null;
    drink_allowed: boolean | null;
    smoke_allowed: boolean | null;
    pg_rules: string | null;
    exected_amount_sqft: number | null;
    per_sqft_amount: number | null;
    monthly_maintenance: number | null;
    ownership_type: string | null;
    dimension_length: number | null;
    dimension_width: number | null;
    width_facing_road: number | null;
    sewage_connection: boolean;
    electricity_connection: boolean;
    rera_number: string | null;
    is_rera_number: boolean | null;
    property_current_status: string | null;
    possession_status: string | null;
    possession_date: string | null;
    total_towers: number | null;
    total_units: number | null;
    project_area: number | null;
    project_area_unit: string | null;
    contact_view_count: number;
    unique_view_count: number;
    ip_address: string;
    user_agent: string;
    host_name: string;
    status: string;
    status_text: string;
    is_deleted: boolean;
    added_by: string | null;
    updated_by: string | null;
    publish_date: string | null;
    created_at: string;
    updated_at: string;
    property_img_url: string | null;
    image_category: string | null;
    file_type: string | null;
    shortlistedCount: number;
    contactedCount: number;
    leadCount: number;
}
const filterOptions = [
    "All",
    "Residential-Rent",
    "Residential-Sell",
    "Commercial-Rent",
    "Commercial-Sell",
    "PG/Hostel",
    // "OpenPlot",
    // "Projects",
];
// const MyProperties: React.FC<BasicProfileProps> = ({ setActiveSection,userType  }) => {
const MyProperties: React.FC<BasicProfileProps> = ({ setActiveSection, userType }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isShortlistedModalOpen,setShortlistedModalOpen] =useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedFilter, setSelectedFilter] = useState("All");
    const [dialogOpen, setDialogOpen] = useState(false);
    const { isDialogOpen, openDialog, closeDialog } = useDialogStore();
    const token = useAuthStore((state) => state.token);
    const [propertyId, setPropertyId] = useState<number | null>(null);
    const propertyIdNumber = Array.isArray(propertyId)
        ? Number(propertyId[0])
        : Number(propertyId);
    const [isClicked, setIsClicked] = useState(false);
    const [whatsappEnabled, setWhatsappEnabled] = useState<boolean>(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 4;


    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 200; // Adjust as needed
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {


        fetchMyProperties(1, true);
    }, [token]);

    const fetchMyProperties = async (pageNumber: number, isInitial = false) => {
        try {
            // console.log("updated token", token);
            const response = await axios.get(`/api/v1/front/profile/listed_properties?limit=${limit}&page=${pageNumber}`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "A8SQFT7767",
                    Authorization: `Bearer ${token}`,
                },
            });



            const allProperties = response.data.data.property || [];
            // console.log("API Response Properties :", allProperties[0].user_type);

            const userTypeList: string[] = allProperties.map((property: Property) => property.user_type);
            // console.log("user_types", userTypeList)
            userType(userTypeList); // Send only user_type values to parent

            const totalCounts = response.data.data.totalCounts;
            const calculatedTotalPages = Math.ceil(totalCounts / limit);
            setTotalPages(calculatedTotalPages);

            const formattedProperties: Property[] = allProperties.map((property: any, index: number) => ({

                id: property.id || index,
                property_title: property.property_title || "No Title Provided",
                description: property.description || "No descrp Provided",
                rent_amount: property.rent_amount || "-",
                city_name: property.city_name || "No city name",
                property_type: property.property_type || "No Rent Info",
                // status: string;  
                property_img_url: property.property_img_url || "/assets/dummy-img/placeholder image-Orange.png",
                property_rent_buy: property.property_rent_buy || "-",
                per_sqft_amount: property.per_sqft_amount || "-",
                builtup_area: property.builtup_area || "-",
                landmark: property.landmark,
                project_area: property.project_area,
                project_area_unit: property.project_area_unit,
                expected_amount: property.expected_amount,
                shortlistedCount: property.shortlistedCount,
                contactedCount: property.contactedCount,
                leadCount: property.leadCount,
                status: property.status,
            }));
            setProperties((prev) => (isInitial ? formattedProperties : [...prev, ...formattedProperties]));
            setPropertyId(formattedProperties.length > 0 ? formattedProperties[0].id : null);

        } catch (error) {
            // console.error("Error fetching My properties:", error);
        }
    };

    const handleOpenModal = (propertyId: number) => {
        setSelectedPropertyId(propertyId);
        setIsModalOpen(true);
    };
    const ShortlistedOpenModal =(propertyId: number) => {
        setSelectedPropertyId(propertyId);
        setShortlistedModalOpen(true);
    };

    const handleShowMore = () => {
        if (page < totalPages) {
            const nextPage = page + 1;
            fetchMyProperties(nextPage);
            setPage(nextPage);
        }
    };

    const handleShowLess = () => {
        if (page > 1) {
            const newPage = page - 1;
            setProperties((prev) => prev.slice(0, newPage * limit));
            setPage(newPage);
        }
    };



    const filteredProperties = properties.filter((property) => {
        // Exclude unwanted properties in all cases
        if (
            property.property_rent_buy === "PROJECT" ||
            property.property_type?.toLowerCase() === "openland" ||
            property.property_type?.toLowerCase() === "pg"
        ) {
            return false;
        }

        switch (selectedFilter) {
            case "All":
                return true; // Already filtered out unwanted properties above
            case "Residential-Rent":
                return property.property_rent_buy === "RENT" && property.property_type?.toLocaleLowerCase() === "residential";
            case "Residential-Sell":
                return property.property_rent_buy === "SELL" && property.property_type?.toLocaleLowerCase() === "residential";
            case "Commercial-Rent":
                return property.property_rent_buy === "RENT" && property.property_type?.toLowerCase() === "commercial";
            case "Commercial-Sell":
                return property.property_rent_buy === "SELL" && property.property_type?.toLowerCase() === "commercial";
            case "PG/Hostel":
                return property.property_rent_buy === "";
            default:
                return true;
        }
    }).filter((property) => (whatsappEnabled ? Number(property.status) === 2 : true));


    return (
        <>

            {isMobile ? (

                <div className="p-2">
                    {/* Header Section */}
                    <div className="flex flex-col">
                        <div className="flex flex-row items-center gap-4 mb-4">
                            <button
                                onClick={() => setActiveSection("Dashboard")}
                                className="text-xl"
                            >
                                {"<"}
                            </button>
                            <h1 className="text-lg text-[#222222] font-medium align-middle mx-auto pb-2">My Properties</h1>
                        </div>
                        <div className="flex items-center gap-4 pb-4">
                            <label className="text-sm text-gray-700">Currently Available </label>
                            <button type="button" onClick={() => setWhatsappEnabled(!whatsappEnabled)}>
                                <Image
                                    src={
                                        whatsappEnabled
                                            ? "/assets/my-profile/Green.svg"
                                            : "/assets/my-profile/Notification_Button.svg"
                                    }
                                    alt="WhatsApp Toggle"
                                    width={30}
                                    height={30}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    {/* <div className="scrollbar-hide  sticky top-0 z-10  p-4 overflow-x-auto flex gap-1 mb-4 flex-nowrap ">
                        {filterOptions.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-3 py-1 text-[10px] rounded-full border transition-all duration-200 whitespace-nowrap
                            ${selectedFilter === filter ? "bg-primary text-white border-none" : "bg-gray-200 "}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div> */}
                    <div className="relative flex justify-between items-center gap-2">
                        {/* Prev Button (Outside Scrollable Section) */}
                        <button
                            className="bg-white border   p-2 shadow rounded-full"
                            onClick={() => scroll("left")}
                        >
                            <ChevronLeft className="text-gray" size={14} />
                        </button>

                        {/* Scrollable Filter Buttons (Fixed Width) */}
                        <div
                            ref={scrollRef}
                            className=" overflow-x-auto flex gap-2 py-4 flex-nowrap scrollbar-hide scroll-smooth "
                        >
                            {filterOptions.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setSelectedFilter(filter)}
                                    className={`px-4 py-2  text-sm rounded-full border whitespace-nowrap ${selectedFilter === filter ? "bg-primary text-white border-none" : "bg-gray-200"
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {/* Next Button (Outside Scrollable Section) */}
                        <button
                            className="bg-white border p-2 shadow rounded-full"
                            onClick={() => scroll("right")}
                        >
                            <ChevronRight className="text-gray" size={14} />
                        </button>
                    </div>

                    {filteredProperties.length === 0 ? (
                        <p className="text-center text-gray-500">Currently, there is no properties.</p>
                    ) : (
                        <>
                            <div className="flex flex-col gap-4">
                                {filteredProperties.map((property) => Number(property.status) === 1 ? (
                                    <div key={property.id} className="border p-3 rounded-lg shadow-sm relative">
                                        {/* Property Image and Details */}
                                        <div className="flex flex-row sm:flex-row gap-2">
                                            <div className="relative w-[40%] sm:w-40 h-40">
                                                <Image
                                                    src={property.property_img_url || "/placeholder.jpg"}
                                                    alt={property.property_title || "Property Image"}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="rounded-md"
                                                />
                                            </div>

                                            <div className="flex flex-col w-[60%]">

                                                <div className="flex-1 ">
                                                    <h3 className="font-semibold text-sm">
                                                        {property.property_title && property.property_title.length > 15
                                                            ? `${property.property_title.slice(0, 15)}...`
                                                            : property.property_title}
                                                    </h3>

                                                    {selectedFilter === "Residential-Rent" && property.property_rent_buy === "RENT" && property.property_type?.toLocaleLowerCase() === "residential" && (
                                                        <>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area}
                                                            </p>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area || "N/A"}
                                                            </p>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Expected Rent:</span> ₹{property.rent_amount}
                                                            </p>
                                                        </>
                                                    )}

                                                    {selectedFilter === "Projects" && property.property_rent_buy === "PROJECT" && (
                                                        <>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Project Area:</span> {property.project_area}{property.project_area_unit}
                                                            </p>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Per Sqft Price:</span> ₹{property.per_sqft_amount}
                                                            </p>
                                                        </>
                                                    )}

                                                    {selectedFilter === "Commercial-Rent" &&
                                                        property.property_rent_buy === "SELL" &&
                                                        property.property_type.toLowerCase().includes("commercial") && (
                                                            <>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Expected Rent:</span> ₹{property.rent_amount}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area}
                                                                </p>
                                                            </>
                                                        )}


                                                    {selectedFilter === "Commercial-Sell" &&
                                                        property.property_rent_buy === "SELL" &&
                                                        property.property_type.toLowerCase().includes("commercial") && (
                                                            <>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Expected Price:</span> ₹{property.expected_amount}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area}
                                                                </p>
                                                            </>
                                                        )}

                                                    {selectedFilter === "OpenPlot" &&
                                                        (property.property_type.toLowerCase().includes("openland") ||
                                                            property.property_type.toLowerCase().includes("pg")) && (
                                                            <>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Expected Price:</span> ₹{property.rent_amount}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area}
                                                                </p>
                                                            </>
                                                        )}




                                                    {selectedFilter === "All" && (
                                                        <>
                                                            {/* Rent Properties */}
                                                            {property.property_rent_buy === "RENT" && property.property_type?.toLocaleLowerCase() === "residential" ? (
                                                                <>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area ? property.builtup_area : "-"}
                                                                    </p>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area ? property.land_area : "-"}
                                                                    </p>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Expected Rent:</span> ₹{property.rent_amount ? property.rent_amount : "-"}
                                                                    </p>
                                                                </>
                                                            ) : property.property_rent_buy === "SELL" && property.property_type?.toLocaleLowerCase() === "residential" ? (
                                                                <>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area ? property.builtup_area : "-"}
                                                                    </p>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area ? property.land_area : "-"}
                                                                    </p>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Expected Price:</span> ₹{property.rent_amount ? property.rent_amount : "-"}
                                                                    </p>
                                                                </>
                                                            ) : null}

                                                            {/* Commercial Properties */}
                                                            {property.property_type.toLowerCase().includes("commercial") ? (
                                                                <>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area ? property.builtup_area : "-"}
                                                                    </p>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Per Sqft Price:</span> ₹{property.per_sqft_amount ? property.per_sqft_amount : "-"}
                                                                    </p>
                                                                </>
                                                            ) : null}

                                                            {/* Projects */}


                                                            {/* OpenPlot or PG/Hostel */}
                                                            {(property.property_type.toLowerCase().includes("openland") ||
                                                                property.property_type.toLowerCase().includes("pg")) ? (
                                                                <>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area ? property.land_area : "-"}
                                                                    </p>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Expected Price:</span> ₹{property.rent_amount ? property.rent_amount : "-"}
                                                                    </p>
                                                                </>
                                                            ) : null}
                                                        </>
                                                    )}


                                                    <p className="font-sm"><span className="text-[#A4A4A4]">Builtup Area:</span>{property.builtup_area}</p>

                                                </div>

                                                <div className="flex flex-row sm:flex-row gap-2 mt-1 h-[38px]">
                                                    <button

                                                        className={`w-full text-sm sm:w-auto p-[1px] rounded-md border-2 text-center 
                                                            ${isClicked ? "bg-primary text-white border-orange-500" : "text-primary border-primary"} `}
                                                    >
                                                        Edit
                                                    </button>


                                                    <button

                                                        className="text-primary text-sm border-[2px] border-primary p-[1px] rounded-md text-sm w-full "
                                                    >
                                                        Remove
                                                    </button>
                                                </div>

                                            </div>
                                        </div>





                                    </div>
                                ) : (
                                    <div key={property.id} className="border p-3 rounded-lg shadow-sm relative">
                                        {/* Property Image and Details */}
                                        <div className="flex flex-row sm:flex-row gap-2">
                                            <div className="relative w-[40%] sm:w-40 h-40">
                                                <Image
                                                    src={property.property_img_url || "/placeholder.jpg"}
                                                    alt={property.property_title || "Property Image"}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="rounded-md"
                                                />
                                            </div>

                                            <div className="flex flex-col w-[60%]">

                                                <div className="flex-1 ">
                                                    <h3 className="font-semibold text-sm">
                                                        {property.property_title && property.property_title.length > 15
                                                            ? `${property.property_title.slice(0, 15)}...`
                                                            : property.property_title}
                                                    </h3>



                                                    {selectedFilter === "Residential-Rent" && property.property_rent_buy === "RENT" && property.property_type?.toLocaleLowerCase() === "residential" && (
                                                        <>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area}
                                                            </p>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area || "N/A"}
                                                            </p>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Expected Rent:</span> ₹{property.rent_amount}
                                                            </p>
                                                        </>
                                                    )}

                                                    {selectedFilter === "Projects" && property.property_rent_buy === "PROJECT" && (
                                                        <>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Project Area:</span> {property.project_area}{property.project_area_unit}
                                                            </p>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Per Sqft Price:</span> ₹{property.per_sqft_amount}
                                                            </p>
                                                        </>
                                                    )}

                                                    {selectedFilter === "Commercial-Rent" &&
                                                        property.property_rent_buy === "SELL" &&
                                                        property.property_type.toLowerCase().includes("commercial") && (
                                                            <>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Expected Rent:</span> ₹{property.rent_amount}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area}
                                                                </p>
                                                            </>
                                                        )}


                                                    {selectedFilter === "Commercial-Sell" &&
                                                        property.property_rent_buy === "SELL" &&
                                                        property.property_type.toLowerCase().includes("commercial") && (
                                                            <>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Expected Price:</span> ₹{property.expected_amount}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area}
                                                                </p>
                                                            </>
                                                        )}

                                                    {selectedFilter === "OpenPlot" &&
                                                        (property.property_type.toLowerCase().includes("openland") ||
                                                            property.property_type.toLowerCase().includes("pg")) && (
                                                            <>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Expected Price:</span> ₹{property.rent_amount}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area}
                                                                </p>
                                                            </>
                                                        )}




                                                    {selectedFilter === "All" && (
                                                        <>
                                                            {/* Rent Properties */}
                                                            {property.property_rent_buy === "RENT" && property.property_type?.toLocaleLowerCase() === "residential" ? (
                                                                <>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area ? property.builtup_area : "-"}
                                                                    </p>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area ? property.land_area : "-"}
                                                                    </p>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Expected Rent:</span> ₹{property.rent_amount ? property.rent_amount : "-"}
                                                                    </p>
                                                                </>
                                                            ) : property.property_rent_buy === "SELL" && property.property_type?.toLocaleLowerCase() === "residential" ? (
                                                                <>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area ? property.builtup_area : "-"}
                                                                    </p>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area ? property.land_area : "-"}
                                                                    </p>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Expected Price:</span> ₹{property.rent_amount ? property.rent_amount : "-"}
                                                                    </p>
                                                                </>
                                                            ) : null}

                                                            {/* Commercial Properties */}
                                                            {property.property_type.toLowerCase().includes("commercial") ? (
                                                                <>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area ? property.builtup_area : "-"}
                                                                    </p>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Per Sqft Price:</span> ₹{property.per_sqft_amount ? property.per_sqft_amount : "-"}
                                                                    </p>
                                                                </>
                                                            ) : null}

                                                            {/* Projects */}


                                                            {/* OpenPlot or PG/Hostel */}
                                                            {(property.property_type.toLowerCase().includes("openland") ||
                                                                property.property_type.toLowerCase().includes("pg")) ? (
                                                                <>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area ? property.land_area : "-"}
                                                                    </p>
                                                                    <p className="font-sm">
                                                                        <span className="text-[#A4A4A4]">Expected Price:</span> ₹{property.rent_amount ? property.rent_amount : "-"}
                                                                    </p>
                                                                </>
                                                            ) : null}
                                                        </>
                                                    )}


                                                    <p className="font-sm"><span className="text-[#A4A4A4]">Builtup Area:</span>{property.builtup_area}</p>

                                                </div>

                                                <div className="flex flex-row sm:flex-row gap-2 mt-1 h-[38px]">
                                                    <button

                                                        className={`w-full text-sm sm:w-auto p-[1px] rounded-md border-2 text-center 
                                                            ${isClicked ? "bg-primary text-white border-orange-500" : "text-primary border-primary"} `}
                                                    >
                                                        Shortlisted:{property.shortlistedCount}
                                                    </button>


                                                    <button

                                                        className="text-primary text-sm border-[2px] border-primary p-[1px] rounded-md text-sm w-full "
                                                    >
                                                        Contacted:{property.contactedCount + property.leadCount}
                                                    </button>
                                                </div>

                                            </div>
                                        </div>





                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center mt-4">
                                {page < totalPages && (
                                    <button
                                        className="px-4 py-1 text-sm text-white bg-primary rounded-md mr-2"
                                        onClick={handleShowMore}
                                    >
                                        Show More
                                    </button>
                                )}
                                {page > 1 && (
                                    <button
                                        className="px-4 py-1 text-sm text-white bg-[#222222] rounded-md"
                                        onClick={handleShowLess}
                                    >
                                        Show Less
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>


            ) : (

                <div className="p-4">
                    <h1 className="text-xl font-semibold mb-4 border-b-2 border-black">My Properties</h1>

                    <div className="flex items-center gap-4 pb-4">
                        <label className="text-sm text-gray-700">Currently Available </label>
                        <button type="button" onClick={() => setWhatsappEnabled(!whatsappEnabled)}>
                            <Image
                                src={
                                    whatsappEnabled
                                        ? "/assets/my-profile/Green.svg"
                                        : "/assets/my-profile/Notification_Button.svg"
                                }
                                alt="WhatsApp Toggle"
                                width={30}
                                height={30}
                            />
                        </button>
                    </div>


                    <div className="relative flex justify-between items-center gap-2">
                        {/* Prev Button (Outside Scrollable Section) */}
                        <button
                            className="bg-white border   p-2 shadow rounded-full"
                            onClick={() => scroll("left")}
                        >
                            <ChevronLeft className="text-gray" size={14} />
                        </button>

                        {/* Scrollable Filter Buttons (Fixed Width) */}
                        <div
                            ref={scrollRef}
                            className=" overflow-x-auto flex gap-2 py-4 flex-nowrap scrollbar-hide scroll-smooth "
                        >
                            {filterOptions.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setSelectedFilter(filter)}
                                    className={`px-4 py-2  text-sm rounded-full border whitespace-nowrap ${selectedFilter === filter ? "bg-primary text-white border-none" : "bg-gray-200"
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        {/* Next Button (Outside Scrollable Section) */}
                        <button
                            className="bg-white border p-2 shadow rounded-full"
                            onClick={() => scroll("right")}
                        >
                            <ChevronRight className="text-gray" size={14} />
                        </button>
                    </div>



                    {filteredProperties.length === 0 ? (
                        <p className="text-center text-gray-500">Currently, there is no properties.</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredProperties.map((property) => Number(property.status) === 1 ? (
                                    <div
                                        key={property.id}
                                        className="border p-2 rounded-lg shadow-sm flex flex-row gap-3 w-full"
                                    >
                                        {/* Image Section with equal width */}
                                        <div className="relative w-[40%] h-42 min-h-[150px]">
                                            <Image
                                                src={property.property_img_url || "/placeholder.jpg"}
                                                alt={property.property_title || "Property Image"}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-md"
                                            />
                                        </div>

                                        {/* Property Details Section with equal width */}
                                        <div className="w-[60%] flex flex-col justify-between">
                                            <div >
                                                <h3 className="font-semibold">
                                                    {property.property_title && property.property_title.length > 16
                                                        ? `${property.property_title.slice(0, 16)}...`
                                                        : property.property_title}
                                                </h3>

                                                <p className="text-[#A4A4A4] text-sm">
                                                    {property.landmark && property.landmark.length > 18
                                                        ? `${property.landmark.slice(0, 18)}...`
                                                        : property.landmark}
                                                </p>



                                                {selectedFilter === "Residential-Rent" && property.property_rent_buy === "RENT" && property.property_type?.toLocaleLowerCase() === "residential" && (
                                                    <>
                                                        <p className="font-sm">
                                                            <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area}
                                                        </p>
                                                        <p className="font-sm">
                                                            <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area || "N/A"}
                                                        </p>
                                                        <p className="font-sm">
                                                            <span className="text-[#A4A4A4]">Expected Rent:</span> ₹{property.rent_amount}
                                                        </p>
                                                    </>
                                                )}

                                                {selectedFilter === "Residential-Sell" && property.property_rent_buy === "SELL" && (
                                                    <>
                                                        <p className="font-sm">
                                                            <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area}
                                                        </p>
                                                        <p className="font-sm">
                                                            <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area || "N/A"}
                                                        </p>
                                                        <p className="font-sm">
                                                            <span className="text-[#A4A4A4]">Expected Price:</span> ₹{property.rent_amount}
                                                        </p>
                                                    </>
                                                )}



                                                {selectedFilter === "Commercial-Rent" &&
                                                    property.property_rent_buy === "SELL" &&
                                                    property.property_type.toLowerCase().includes("commercial") && (
                                                        <>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Expected Rent:</span> ₹{property.rent_amount}
                                                            </p>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area}
                                                            </p>
                                                        </>
                                                    )}


                                                {selectedFilter === "Commercial-Sale" &&
                                                    property.property_rent_buy === "SELL" &&
                                                    property.property_type.toLowerCase().includes("commercial") && (
                                                        <>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Expected Price:</span> ₹{property.expected_amount}
                                                            </p>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area}
                                                            </p>
                                                        </>
                                                    )}

                                                {selectedFilter === "OpenPlot" &&
                                                    (property.property_type.toLowerCase().includes("openland") ||
                                                        property.property_type.toLowerCase().includes("pg")) && (
                                                        <>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Expected Price:</span> ₹{property.rent_amount}
                                                            </p>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area}
                                                            </p>
                                                        </>
                                                    )}




                                                {selectedFilter === "All" && (
                                                    <>
                                                        {/* Rent Properties */}
                                                        {property.property_rent_buy === "RENT" && property.property_type?.toLocaleLowerCase() === "residential" ? (
                                                            <>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area ? property.builtup_area : "-"}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area ? property.land_area : "-"}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Expected Rent:</span> ₹{property.rent_amount ? property.rent_amount : "-"}
                                                                </p>
                                                            </>
                                                        ) : property.property_rent_buy === "SELL" ? (
                                                            <>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area ? property.builtup_area : "-"}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area ? property.land_area : "-"}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Expected Price:</span> ₹{property.rent_amount ? property.rent_amount : "-"}
                                                                </p>
                                                            </>
                                                        ) : null}

                                                        {/* Commercial Properties */}
                                                        {property.property_type.toLowerCase().includes("commercial") ? (
                                                            <>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area ? property.builtup_area : "-"}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Per Sqft Price:</span> ₹{property.per_sqft_amount ? property.per_sqft_amount : "-"}
                                                                </p>
                                                            </>
                                                        ) : null}

                                                        {/* Projects */}
                                                        {property.property_rent_buy === "PROJECT" ? (
                                                            <>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Project Area:</span> {property.project_area ? property.project_area : "-"}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Per Sqft Price:</span> ₹{property.per_sqft_amount ? property.per_sqft_amount : "-"}
                                                                </p>
                                                            </>
                                                        ) : null}

                                                        {/* OpenPlot or PG/Hostel */}
                                                        {(property.property_type.toLowerCase().includes("openland") ||
                                                            property.property_type.toLowerCase().includes("pg")) ? (
                                                            <>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area ? property.land_area : "-"}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Expected Price:</span> ₹{property.rent_amount ? property.rent_amount : "-"}
                                                                </p>
                                                            </>
                                                        ) : null}
                                                    </>
                                                )}



                                            </div>

                                            {/* Buttons Section */}
                                            <div className="flex flex-row w-full gap-2 mr-4 ">
                                                <button 

                                                    className={` text-sm p-[4px] rounded-md border-2 
                                                 ${isClicked
                                                            ? "bg-primary text-white border-primary"
                                                            : "text-primary border-primary"
                                                        }`}
                                                >
                                                    Edit
                                                </button>




                                                <button

                                                    className="text-primary text-sm border-2 border-primary p-[4px] rounded-md"
                                                >
                                                    Remove
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        key={property.id}
                                        className="border p-2 rounded-lg shadow-sm flex flex-row gap-3 w-full"
                                    >
                                        {/* Image Section with equal width */}
                                        <div className="relative w-[40%] h-42 min-h-[150px]">
                                            <Image
                                                src={property.property_img_url || "/placeholder.jpg"}
                                                alt={property.property_title || "Property Image"}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-md"
                                            />
                                        </div>

                                        {/* Property Details Section with equal width */}
                                        <div className="w-[60%] flex flex-col justify-between">
                                            <div >
                                                <h3 className="font-semibold">
                                                    {property.property_title && property.property_title.length > 16
                                                        ? `${property.property_title.slice(0, 16)}...`
                                                        : property.property_title}
                                                </h3>

                                                <p className="text-[#A4A4A4] text-sm">
                                                    {property.landmark && property.landmark.length > 18
                                                        ? `${property.landmark.slice(0, 18)}...`
                                                        : property.landmark}
                                                </p>



                                                {selectedFilter === "Residential-Rent" && property.property_rent_buy === "RENT" && property.property_type?.toLocaleLowerCase() === "residential" && (
                                                    <>
                                                        <p className="font-sm">
                                                            <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area}
                                                        </p>
                                                        <p className="font-sm">
                                                            <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area || "N/A"}
                                                        </p>
                                                        <p className="font-sm">
                                                            <span className="text-[#A4A4A4]">Expected Rent:</span> ₹{property.rent_amount}
                                                        </p>
                                                    </>
                                                )}

                                                {selectedFilter === "Residential-Sell" && property.property_rent_buy === "SELL" && (
                                                    <>
                                                        <p className="font-sm">
                                                            <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area}
                                                        </p>
                                                        <p className="font-sm">
                                                            <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area || "N/A"}
                                                        </p>
                                                        <p className="font-sm">
                                                            <span className="text-[#A4A4A4]">Expected Price:</span> ₹{property.rent_amount}
                                                        </p>
                                                    </>
                                                )}



                                                {selectedFilter === "Commercial-Rent" &&
                                                    property.property_rent_buy === "SELL" &&
                                                    property.property_type.toLowerCase().includes("commercial") && (
                                                        <>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Expected Rent:</span> ₹{property.rent_amount}
                                                            </p>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area}
                                                            </p>
                                                        </>
                                                    )}


                                                {selectedFilter === "Commercial-Sale" &&
                                                    property.property_rent_buy === "SELL" &&
                                                    property.property_type.toLowerCase().includes("commercial") && (
                                                        <>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Expected Price:</span> ₹{property.expected_amount}
                                                            </p>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area}
                                                            </p>
                                                        </>
                                                    )}

                                                {selectedFilter === "OpenPlot" &&
                                                    (property.property_type.toLowerCase().includes("openland") ||
                                                        property.property_type.toLowerCase().includes("pg")) && (
                                                        <>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Expected Price:</span> ₹{property.rent_amount}
                                                            </p>
                                                            <p className="font-sm">
                                                                <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area}
                                                            </p>
                                                        </>
                                                    )}




                                                {selectedFilter === "All" && (
                                                    <>
                                                        {/* Rent Properties */}
                                                        {property.property_rent_buy === "RENT" && property.property_type?.toLocaleLowerCase() === "residential" ? (
                                                            <>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area ? property.builtup_area : "-"}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area ? property.land_area : "-"}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Expected Rent:</span> ₹{property.rent_amount ? property.rent_amount : "-"}
                                                                </p>
                                                            </>
                                                        ) : property.property_rent_buy === "SELL" ? (
                                                            <>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area ? property.builtup_area : "-"}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area ? property.land_area : "-"}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Expected Price:</span> ₹{property.rent_amount ? property.rent_amount : "-"}
                                                                </p>
                                                            </>
                                                        ) : null}

                                                        {/* Commercial Properties */}
                                                        {property.property_type.toLowerCase().includes("commercial") ? (
                                                            <>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Builtup Area:</span> {property.builtup_area ? property.builtup_area : "-"}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Per Sqft Price:</span> ₹{property.per_sqft_amount ? property.per_sqft_amount : "-"}
                                                                </p>
                                                            </>
                                                        ) : null}

                                                        {/* Projects */}
                                                        {property.property_rent_buy === "PROJECT" ? (
                                                            <>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Project Area:</span> {property.project_area ? property.project_area : "-"}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Per Sqft Price:</span> ₹{property.per_sqft_amount ? property.per_sqft_amount : "-"}
                                                                </p>
                                                            </>
                                                        ) : null}

                                                        {/* OpenPlot or PG/Hostel */}
                                                        {(property.property_type.toLowerCase().includes("openland") ||
                                                            property.property_type.toLowerCase().includes("pg")) ? (
                                                            <>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Land Area:</span> {property.land_area ? property.land_area : "-"}
                                                                </p>
                                                                <p className="font-sm">
                                                                    <span className="text-[#A4A4A4]">Expected Price:</span> ₹{property.rent_amount ? property.rent_amount : "-"}
                                                                </p>
                                                            </>
                                                        ) : null}
                                                    </>
                                                )}



                                            </div>

                                            {/* Buttons Section */}
                                            <div className="flex flex-row w-full gap-2 mr-4 ">
                                                <button onClick={() => ShortlistedOpenModal(property.id)}

                                                    className={` text-sm p-[2px] rounded-md border-2 
                                                 ${isClicked
                                                            ? "bg-primary text-white border-primary"
                                                            : "text-primary border-primary"
                                                        }`}
                                                >
                                                    Shortlisted:{property.shortlistedCount}
                                                </button>
                                                <ShortlistedUsers isOpenShortlist={isShortlistedModalOpen} onClose={() => setShortlistedModalOpen(false)} propertyId={selectedPropertyId} />



                                                <button onClick={() => handleOpenModal(property.id)}

                                                    className="text-primary text-sm border-2 border-primary p-[2px] rounded-md"
                                                >
                                                    Contacted:{property.contactedCount}
                                                </button>
                                                <ContactedUsers isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} propertyId={selectedPropertyId} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center mt-4">
                                {page < totalPages && (
                                    <button
                                        className="px-4 py-1 text-sm text-white bg-primary rounded-md mr-2"
                                        onClick={handleShowMore}
                                    >
                                        Show More
                                    </button>
                                )}
                                {page > 1 && (
                                    <button
                                        className="px-4 py-1 text-sm text-white bg-[#222222] rounded-md"
                                        onClick={handleShowLess}
                                    >
                                        Show Less
                                    </button>
                                )}
                            </div>
                        </>


                    )}
                </div>

            )}

        </>
    )
}
export default MyProperties;