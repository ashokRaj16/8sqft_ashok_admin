import { useMediaQuery } from "usehooks-ts";
import Image from "next/image";
import { useEffect, useState } from "react";
// import axios from "axios";
import axios from "@/hooks/index";
import { useAuthStore } from "@/Store/jwtTokenStore";
import { filter } from "lodash";
import useDialogStore from "@/Store/useDialogStore ";
import useShareContactDetail from "@/hooks/Postpropertyhooks/useShareContact";
import useShareWhatsappDetail from "@/hooks/Postpropertyhooks/useShareWhatsappDetail";
import { useRouter } from "next/navigation";
import "./scrolls.css"
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useShortlistDelete from "@/hooks/Shortlist/useShortlistDelete";
import toast from "react-hot-toast";

interface BasicProfileProps {
    setActiveSection: (section: string) => void;
}

interface Property {
    id: number;
    user_id: number;
    form_step_id: string;
    form_status: string;
    user_type: string;
    property_title: string;
    company_name: string;
    description: string;
    short_description?: string | null;
    building_name?: string | null;
    landmark: string;
    locality: string;
    city_id: number;
    state_id: number;
    city_name: string;
    state_name: string;
    pincode?: string | null;
    latitude: string;
    longitude: string;
    land_area?: string | null;
    land_area_unit?: string | null;
    property_availibility_type?: string | null;
    is_maintenance?: string | null;
    property_variety_type?: string | null;
    builtup_area?: string | null;
    builtup_area_unit?: string | null;
    rent_amount?: string | null | number;
    deposite_amount?: string | null;
    property_type: string;
    bed_rooms?: string | null;
    washrooms?: string | null;
    floor_number?: string | null;
    total_floors?: string | null;
    property_floors?: string | null;
    balcony?: string | null;
    is_wings?: string | null;
    wings_count?: string | null;
    unit_number?: string | null;
    total_wing?: string | null;
    wing_name?: string | null;
    property_variety: string;
    property_rent_buy: string;
    rent_is_nogotiable?: string | null;
    deposite_is_negotiable?: string | null;
    availability_date?: string | null;
    availability_duration?: string | null;
    property_age?: string | null;
    furnishing_status?: string | null;
    parking?: string | null;
    water_supply: string;
    washroom_type?: string | null;
    granted_security: string;
    other_amenities?: string | null;
    door_facing?: string | null;
    preferred_tenent?: string | null;
    pet_allowed?: string | null;
    non_veg_allowed?: string | null;
    expected_amount?: string | null;
    drink_allowed?: string | null;
    smoke_allowed?: string | null;
    pg_rules?: string | null;
    exected_amount_sqft?: string | null;
    per_sqft_amount: number;
    monthly_maintenance?: string | null;
    ownership_type?: string | null;
    dimension_length?: string | null;
    dimension_width?: string | null;
    width_facing_road: number;
    sewage_connection: string;
    electricity_connection: string;
    rera_number?: string | null;
    is_rera_number: string;
    property_current_status: string;
    possession_status?: string | null;
    possession_date?: string | null;
    total_towers?: string | null;
    total_units: number;
    project_area: number;
    project_area_unit: string;
    contact_view_count: number;
    unique_view_count: number;
    ip_address: string;
    user_agent: string;
    host_name: string;
    status: string;
    status_text: string;
    is_deleted: string;
    added_by?: string | null;
    updated_by: number;
    publish_date: string;
    created_at: string;
    updated_at: string;
    property_id: number;
    property_img_url: string;
    img_title?: string | null;
    image_category?: string | null;
    file_type: string;
    image_size: string;
    img_description?: string | null;
}


const filterOptions = [
    "All",
    "Residential-Rent",
    "Residential-Sell",
    "Commercial-Rent",
    "Commercial-Sell",
    "PG/Hostel",
    "Open Plot",
    "Projects",
];


const Shortlist: React.FC<BasicProfileProps> = ({ setActiveSection }) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedFilter, setSelectedFilter] = useState("All");

    const [visibleProperties, setVisibleProperties] = useState([]);
    const [showAll, setShowAll] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const { isDialogOpen, openDialog, closeDialog } = useDialogStore();
    const token = useAuthStore((state) => state.token);
    const [propertyId, setPropertyId] = useState<number | null>(null);
    const propertyIdNumber = Array.isArray(propertyId)
        ? Number(propertyId[0])
        : Number(propertyId);
    const [isClicked, setIsClicked] = useState(false);
    const [available,setAvailable] = useState<boolean>(true);
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


        fetchShortlistedProperties(1, true);
    }, [token]);
    const fetchShortlistedProperties = async (pageNumber: number, isInitial = false) => {
        try {
            // console.log("updated token", token);
            const response = await axios.get(`/api/v1/front/profile/shortlisted_properties?limit=${limit}&page=${pageNumber}`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "A8SQFT7767",
                    Authorization: `Bearer ${token}`,
                },
            });



            const shortlisted = response.data.data.property || [];
            // console.log("API Response:", shortlisted);

            const totalCounts = response.data.data.totalCounts;
            const calculatedTotalPages = Math.ceil(totalCounts / limit);
            setTotalPages(calculatedTotalPages);

            const formattedProperties: Property[] = shortlisted.map((property: any, index: number) => ({
                id: property.id || index,
                property_title: property.property_title || "No Title Provided",
                description: property.description || "No descrp Provided",
                rent_amount: property.rent_amount || "-",
                city_name: property.city_name || "No city name",
                property_type: property.property_type || "No Rent Info",

                property_img_url: property.property_img_url,
                property_rent_buy: property.property_rent_buy || "-",
                per_sqft_amount: property.per_sqft_amount || "-",
                builtup_area: property.builtup_area || "-",
                landmark: property.landmark,
                project_area: property.project_area,
                project_area_unit: property.project_area_unit,
                expected_amount: property.expected_amount,
                status:property.status,


            }));


            setProperties((prev) => (isInitial ? formattedProperties : [...prev, ...formattedProperties]));

            setPropertyId(formattedProperties.length > 0 ? formattedProperties[0].id : null);

        } catch (error) {
            // console.error("Error fetching shortlisted properties:", error);
        }
    };

    const handleShowMore = () => {
        if (page < totalPages) {
            const nextPage = page + 1;
            fetchShortlistedProperties(nextPage);
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
        switch (selectedFilter) {
            case "All":
                return true;
            case "Residential-Rent":
                return property.property_rent_buy === "RENT" && property.property_type?.toLocaleLowerCase() === "residential";
            case "Residential-Sell":
                return property.property_rent_buy === "SELL"  && property.property_type?.toLocaleLowerCase() === "residential";
            case "Commercial-Rent":
                return property.property_rent_buy === "RENT" && property.property_type.toLowerCase().includes("commercial");
            case "Commercial-Sell":
                return property.property_rent_buy === "SELL" && property.property_type.toLowerCase().includes("commercial");
            case "PG/Hostel":
                return property.property_type.toLowerCase().includes("pg");
            case "Open Plot":
                return property.property_type.toLowerCase()==="openland" || property.property_type.toLowerCase().includes("pg");
            case "Projects":
                return property.property_rent_buy === "PROJECT";
            default:
                return true;
        }
    })  .filter((property) => (available ? Number(property.status) === 2 : true)); 




   

    const { mutate: deleteProperty } = useShortlistDelete({
        onSuccess: () => {
            toast.success("Property removed successfully!");
            setProperties((prev) => prev.filter((prop) => prop.id !== propertyId));
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to remove property.");
        },
    });



    const handleOwnerContactClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (token) {

            handleClick();
        } else {
            openDialog();
        }
    }

    const handleClick = () => {
        shareContact({ propertyId: propertyIdNumber });
        shareWhatsapp({ propertyId: propertyIdNumber });
        setDialogOpen(true);
    };

    const { mutate: shareContact } = useShareContactDetail({
        onSuccess: (data) => {
            // console.log("Successfully sent contact details", data);
        },
        onError: (error) => {
            // console.log("Error in sending contact details", error);
        },
    });

    const { mutate: shareWhatsapp } = useShareWhatsappDetail({
        onSuccess: (data) => {
            // console.log("Successfully sent contact details", data);
        },
        onError: (error) => {
            // console.log("Error in sending contact details", error);
        },
    });
    const router = useRouter();

    const moveToDetailsHandler = async (id: number) => {


        router.push(`/Builder/${id}`);
    };


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
                            <h1 className="text-lg text-[#222222] font-medium align-middle mx-auto pb-2">Your Shortlist</h1>
                        </div>
                        <div className="flex items-center gap-4 pb-4">
                            <label className="text-sm text-gray-700">Currently Available </label>
                            <button type="button" onClick={() => setAvailable(!available)}>
                                <Image
                                    src={
                                        available
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






                    {/* Check if there are shortlisted properties */}
                    {filteredProperties.length === 0 ? (
                        <p className="text-center text-gray-500">Currently, there is no shortlist.</p>
                    ) : (
                        <>
                            <div className="flex flex-col gap-4">
                                {filteredProperties.map((property) => (
                                    <div key={property.id} className="border p-3 rounded-lg shadow-sm relative">
                                        {/* Property Image and Details */}
                                        <div className="flex flex-row sm:flex-row gap-4">
                                            <div onClick={() => moveToDetailsHandler(property.id)} className="relative w-full sm:w-40 h-40">
                                                <Image
                                                    src={property.property_img_url || "/placeholder.jpg"}
                                                    alt={property.property_title || "Property Image"}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="rounded-md"
                                                />
                                            </div>

                                            <div className="flex flex-col">

                                                <div onClick={() => moveToDetailsHandler(property.id)} className="flex-1 ">
                                                    <h3 className="font-semibold text-sm">
                                                        {property.property_title && property.property_title.length > 15
                                                            ? `${property.property_title.slice(0, 15)}...`
                                                            : property.property_title}
                                                    </h3>

                                                    <p className="text-[#A4A4A4] text-sm">
                                                        {property.landmark && property.landmark?.length > 15 ? `${property.landmark.slice(0, 15)}...` : property.landmark}</p>



                                                    {selectedFilter === "Residential-Rent" && property.property_rent_buy === "RENT" && property.property_type?.toLocaleLowerCase() === "residential"&& (
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

                                                    {selectedFilter === "Open Plot" &&
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
                                                                        <span className="text-[#A4A4A4]">Project Area:</span> {property.project_area ? property.project_area : "-"}{property.project_area_unit}
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

                                                <div className="flex flex-row sm:flex-row gap-2 mt-1 h-[38px]">
                                                    <button
                                                        onClick={handleOwnerContactClick}
                                                        className={`w-full sm:w-auto p-1 rounded-md border-2 text-center text-[12px]  whitespace-nowrap
                                                    ${isClicked ? "bg-primary text-white border-orange-500" : "text-primary border-primary"}`}
                                                    >
                                                        Get Owner Details
                                                    </button>
                                                    {/* Contact Dialog */}
                                                    {dialogOpen && (
                                                        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center z-50">
                                                            <div className="bg-white p-5 border border-gray-300 rounded-md shadow-md max-w-sm w-full">
                                                                <h1 className="font-bold">Contact Details Sent</h1>
                                                                <p className="text-sm">
                                                                    We have successfully sent the owner contact details on your
                                                                    WhatsApp and Email. Feel free to contact the owner directly.
                                                                </p>
                                                                <button
                                                                    className="bg-primary text-white px-4 py-2 rounded-md my-3 w-full"
                                                                    onClick={() => setDialogOpen(false)}
                                                                >
                                                                    Close
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={() => deleteProperty(property.id)}
                                                        className="text-primary border-[2px] text-[12px] border-primary p-1 rounded-md  w-full sm:w-auto"
                                                    >
                                                        Remove
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
                    <h1 className="text-xl font-semibold mb-4 border-b-2 border-black">Your Shortlist</h1>

                    <div className="flex items-center gap-4 pb-4">
                        <label className="text-sm text-gray-700">Currently Available </label>
                        <button type="button" onClick={() => setAvailable(!available)}>
                            <Image
                                src={
                                    available
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
                        <p className="text-center text-gray-500">Currently, there is no shortlist.</p>
                    ) : (


                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredProperties.map((property) => (
                                    <div
                                        key={property.id}
                                        className="border p-2 rounded-lg shadow-sm flex flex-row gap-4 w-full"
                                    >
                                        {/* Image Section with equal width */}
                                        <div onClick={() => moveToDetailsHandler(property.id)} className="relative w-1/2 h-42 min-h-[150px]">
                                            <Image
                                                src={property.property_img_url || "/placeholder.jpg"}
                                                alt={property.property_title || "Property Image"}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-md"
                                            />
                                        </div>

                                        {/* Property Details Section with equal width */}
                                        <div className="w-1/2 flex flex-col justify-between">
                                            <div onClick={() => moveToDetailsHandler(property.id)}>
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




                                                {/* Display fields based on selected filter */}
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

                                                {selectedFilter === "Open Plot" &&
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
                                                        {property.property_rent_buy === "RENT" && property.property_type?.toLocaleLowerCase() === "residential"? (
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
                                                                    <span className="text-[#A4A4A4]">Project Area:</span> {property.project_area ? property.project_area : "-"}{property.project_area_unit}
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
                                            <div className="flex flex-row w-full gap-2 ">
                                                <button
                                                    onClick={handleOwnerContactClick}
                                                    className={` text-sm p-[0.5px] rounded-md border-2 
                                                  ${isClicked
                                                            ? "bg-primary text-white border-primary"
                                                            : "text-primary border-primary"
                                                        }`}
                                                >
                                                    Get Owner Details
                                                </button>

                                                {/* Dialog for Contact Confirmation */}
                                                {dialogOpen && (
                                                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center z-50">
                                                        <div className="bg-white p-5 border border-gray-300 rounded-md shadow-md max-w-sm w-full">
                                                            <h1 className="font-bold">Contact Details Sent</h1>
                                                            <p className="text-sm">
                                                                We have successfully sent the owner contact details on your
                                                                WhatsApp and Email. Feel free to contact the owner directly.
                                                            </p>
                                                            <button
                                                                className="bg-primary text-white px-4 py-2 rounded-md my-3 self-center w-full"
                                                                onClick={() => setDialogOpen(false)}
                                                            >
                                                                Close
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                <button
                                                    onClick={() => deleteProperty(property.id)}
                                                    className="text-primary border-2 border-primary p-1 rounded-md"
                                                >
                                                    Remove
                                                </button>
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
    );
};

export default Shortlist;
