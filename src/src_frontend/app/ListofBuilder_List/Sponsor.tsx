import axios from "@/hooks";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/ui/Button";
import { formatNumber } from "@/utils/priceFormatter";
import { useRouter } from "next/navigation";

const Sponsor = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/front/spotlight`, {
        params: {
          categories: "SPOTLIGHT",
        },
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "A8SQFT7767", // Replace with your actual API key
        },
      });

      const propertiesData = response.data.data || [];

      console.log("API propertiesData:", propertiesData);
      setProperties(propertiesData);
    } catch (err) {
      setError("Failed to fetch properties. Please try again later.");
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []); // Rerun the fetch when the city or search keyword changes

  const moveToDetailsHandler = async (id: string) => {
    router.push(`/Builder/${id}`);
  };
  console.log(properties, "properties");
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="bg-white shadow-custom p-1 rounded-lg mx-auto top-36 lg:sticky mt-1">
        {properties.filter(
          (property: any) => property.property_rent_buy === "PROJECT"
        ) && (
          <div  onClick={() => moveToDetailsHandler(properties[0].title_slug)} className="relative bg-gray-300 text-white rounded-xl overflow-hidden shadow-lg cursor-pointer">
            <Image
              src={properties[0].property_img_url}
              alt="Starlit Property"
              width={500}
              height={300}
              className="w-full h-64 object-cover"
            />
            <span className="absolute top-2 right-2 bg-[#222222] text-white text-xs px-2 py-1 rounded">
              Sponsored
            </span>
            <div className="bg-gradient-to-b from-[#22222210] via-[#22222250] to-[#222222] w-full h-64 absolute bottom-0"></div>
            <div className="p-4 gap-3 justify-between flex absolute items-center bottom-0">
              <div>
                <h2 className="text-xs text-white">
                  {properties[0].property_rent_buy === "RENT"
                    ? `₹ ${formatNumber(properties[0].rent_amount)}/month`
                    : `₹ ${formatNumber(properties[0].config_carpet_price)}`}
                </h2>
                <p className="text-xs text-white">
                  by {properties[0].company_name} {properties[0].locality},
                  {properties[0].city_name}
                </p>
              </div>
              <div className="mt-3 flex gap-2">
              <Button                      variant="outline"
                      className="text-xs py-0  font-normal text-white"
                    >
                      View Details
                    </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {properties
            .filter((property: any) => property.property_rent_buy === "PROJECT")
            .slice(1, 3)
            .map((property, index) => (
              <div
              onClick={() => moveToDetailsHandler(property.title_slug)}
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
              >
                <Image
                  src={property.property_img_url}
                  alt={property.property_title}
                  width={300}
                  height={200}
                  className="w-full lg:h-32 h-56 object-cover"
                />
                <div className="p-2">
                  <p className={`text-xs text-balck font-semibold`}>
                    {property.property_rent_buy === "RENT"
                      ? `₹ ${formatNumber(property.rent_amount)}/month`
                      : `₹ ${formatNumber(property.config_carpet_price)}`}
                  </p>
                  <p className={`text-xs text-[#22222270] `}>
                    {" "}
                    by {property.company_name} {property.locality},
                    {property.city_name}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* <div className="grid grid-rows-2 md:grid-rows-3 gap-4 bg-white shadow-md p-1 rounded-lg  top-36">
        {properties
          .filter((property: any) => property.property_rent_buy === "PROJECT")
          .slice(0, 3)
          .map((property, index) => (
            <div
              onClick={() => moveToDetailsHandler(property.title_slug)}
              key={property.id}
              className={`relative rounded-lg overflow-hidden cursor-pointer ${
                index === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <Image
                src={property.property_img_url}
                alt={property.property_title}
                width={200}
                height={200}
                className={`w-full object-cover rounded-lg  ${
                  index === 0 ? "h-fit" : "lg:h-28 h-fit"
                }`}
              />
              <div
                className={`p-2 flex gap-2 items-center justify-between  ${
                  index === 0
                    ? " absolute lg:bottom-0 lg:top-auto top-0 bg-[#22222230] w-full"
                    : " absolute lg:bottom-7 lg:top-auto top-0 bg-[#22222230] w-full"
                }`}
              >
                <div className="">
                  <p className={`text-xs text-white `}>
                    {property.property_rent_buy === "RENT"
                      ? `₹${formatNumber(property.rent_amount)}/month`
                      : `₹${formatNumber(property.config_carpet_price)}`}
                  </p>
                  <p className={`text-xs text-white `}>
                    {" "}
                    by {property.company_name} {property.locality},
                    {property.city_name}
                  </p>
                </div>

                {index === 0 ? (
                  <div className="mt-2 flex space-x-2">
                    <Button
                      variant="outline"
                      className="text-sm p-1 font-normal text-white"
                    >
                      View Details
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
      </div> */}
    </>
  );
};

export default Sponsor;
