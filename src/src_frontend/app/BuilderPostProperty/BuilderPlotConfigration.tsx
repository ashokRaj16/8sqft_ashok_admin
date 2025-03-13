import React, { useEffect, useState } from "react";
import ReusableRedTagComponent from "../CompoundComponent/ReusableRedTag";
import Image from "next/image";
import useBuilderConfigration from "@/hooks/BuilderFormHooks/useBuilderConfigration";
import toast from "react-hot-toast";
import usePropertyIdStore from "@/Store/propertyid";
import useDeleteBuilderImageDetail from "@/hooks/BuilderFormHooks/useDeleteBuilderImage";
import { formatNumber } from "@/utils/priceFormatter";
interface ConfigurationProps {
  currentVariety: string;
  residentialVariety: string;
}
const ResidentialType = ["Studio", "1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK", "Other"];
export default function BuilderPlotConfigration({ currentVariety, residentialVariety }: ConfigurationProps) {

  const [formattedValue, setFormattedValue] = useState("");
  const [plots, setPlots] = useState<any[]>([
    {
      length: "",
      width: "",
      carpetArea: "",
      apartmentType: "",
      priceCategory: "",
      price: "",
      image: null,
      submitted: false,
      id: null, // id to track images for delete
      imageUrl: "",
    },
  ]);

  const { id } = usePropertyIdStore();
  const userid = id!;

  const getFilteredOptions = (residentialVariety: any) => {
    if (["Penthouse", "Other"].includes(residentialVariety)) {
      return ResidentialType.slice(3);
    } else if (["Row House", "Villa", "Bungalow"].includes(residentialVariety)) {
      return ResidentialType.slice(2);
    } else if (residentialVariety === "Apartment") {
      return ResidentialType;
    } else {
      return [];
    }
  };

  // Handle file selection and API request for each plot
  const handleFileChange = (index: number, file: File | null) => {
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Only JPEG and PNG formats are allowed.");
      return;
    }

    if (file) {
      const updatedPlots = [...plots];
      updatedPlots[index].image = file;
      setPlots(updatedPlots);

      // Trigger API mutation
      mutate({
        property_id: userid,
        carpet_area: updatedPlots[index].carpetArea,
        unit_name: updatedPlots[index]?.apartmentType,
        unit_price_type: updatedPlots[index]?.priceCategory,
        length: updatedPlots[index].length,
        width: updatedPlots[index].width,
        width_unit: "sq ft",
        length_unit: "sq ft",
        carpet_price: updatedPlots[index].price,
        images: file,
      });
    }
  };

  const { mutate } = useBuilderConfigration({
    onSuccess: (data: any) => {
      if (data?.message) {
        toast.success(`${data.message}`);
        setPlots((prev) => {
          const updatedPlots = [...prev];
          updatedPlots[updatedPlots.length - 1].id = data.data?.configuration[0].id;
          updatedPlots[updatedPlots.length - 1].imageUrl = data.data?.configuration[0].imageUrl;
          updatedPlots[updatedPlots.length - 1].submitted = true;
          return updatedPlots;
        });
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || "An error occurred.");
    },
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { mutate: deleteBuilderImage } = useDeleteBuilderImageDetail({
    onSuccess: () => {
      console.log("Image deleted successfully");
      // Remove the deleted image from the plots state
      setPlots((prev) => prev.filter((plot) => plot.id !== deleteId));
    },
    onError: (error) => {
      console.error("Error deleting image:", error);
    },
  });

  // Handle Delete action
  const handleDelete = (id: string) => {
    // Prevent deleting the last "uploading" entry
    if (plots.length === 1 && !plots[0].submitted) {
      toast.error("Cannot delete the uploading entry.");
      return;
    }

    setDeleteId(id); // Set the ID of the image to delete
    deleteBuilderImage(Number(id)); // Call the delete API with the image ID
  };

  // Add a new blank row
  const handleAddNewRow = () => {
    setPlots((prev) => [
      ...prev,
      {
        length: "",
        width: "",
        carpetArea: "",
        apartmentType: "",
        priceCategory: "",
        price: "",
        image: null,
        submitted: false,
        id: null,
        imageUrl: "",
      },
    ]);
  };

  return (
    <div className="flex flex-col w-full border-gray-200 py-4">
      {/* Title Section */}
      <div className="flex items-center gap-2">
        <h3 className="text-base font-semibold whitespace-nowrap">

          Unit Configuration
        </h3>
        <ReusableRedTagComponent />
      </div>

      {/* Plot Rows */}
      {plots.map((plot, index) => (
        <div key={index} className="flex items-center gap-4 mt-4 flex-wrap">

          {currentVariety === "Residential" && (<div>
            <select
              onChange={(e) => {
                const updatedPlots = [...plots];
                updatedPlots[index].apartmentType = e.target.value;
                setPlots(updatedPlots);
              }}
              className=" h-[38px] px-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              //   onChange={(e) =>
              //     setSelectedProjectAreaType(e.target.value)
              //   }
              value={plot.apartmentType}
            >
              <option value="" disabled>
                Select {residentialVariety} type
              </option>
              {getFilteredOptions(residentialVariety).map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>

          </div>)}

          {currentVariety === "Open Land" && (
            <div className="flex gap-2 items-center">
              {/* Length */}
              <input
                type="text"
                value={plot.length}
                onChange={(e) => {
                  const updatedPlots = [...plots];
                  updatedPlots[index].length = e.target.value;
                  setPlots(updatedPlots);
                }}
                placeholder="Length"
                className="w-20 p-2 border rounded-md text-sm"
                disabled={plot.submitted}
              />
              <span className="text-[#2222226c]">X</span>

              {/* Width */}
              <input
                type="text"
                value={plot.width}
                onChange={(e) => {
                  const updatedPlots = [...plots];
                  updatedPlots[index].width = e.target.value;
                  setPlots(updatedPlots);
                }}
                placeholder="Width"
                className="w-20 p-2 border rounded-md text-sm"
                disabled={plot.submitted}
              />
              <span className="text-[#2222226c]">Sq.ft.</span>
            </div>
          )}

          {/* Carpet Area */}
          <input
            type="text"
            value={plot.carpetArea}
            onChange={(e) => {
              const updatedPlots = [...plots];
              updatedPlots[index].carpetArea = e.target.value;
              setPlots(updatedPlots);
            }}
            placeholder={`${currentVariety === "Open Land" ? "Plot Area in Sqft" : "Carpet Area in Sqft"}`}
            className="w-32 p-2 border rounded-md text-sm"
            disabled={plot.submitted}
          />

          {/* Price */}
          <div className="relative">
            {/* Price */}
            <input
              type="text"
              value={plot.price}
              onChange={(e) => {
                const updatedPlots = [...plots];
                updatedPlots[index].price = e.target.value.replace(/\D/g, "");
                setPlots(updatedPlots);
                setFormattedValue(formatNumber(Number(e.target.value.replace(/\D/g, "")))); // Format display
              }}
              placeholder="Enter Price"
              className="w-28 p-2 border rounded-md text-sm"
              disabled={plot.submitted}
            />
            {formattedValue && !plot.submitted && (<label className="absolute -bottom-4 right-0 text-xs text-[#FC6600] px-1">
              {formattedValue}
            </label>)}
          </div>
          <div>
            <select
              onChange={(e) => {
                const updatedPlots = [...plots];
                updatedPlots[index].priceCategory = e.target.value;
                setPlots(updatedPlots);
              }}
              className=" h-[38px] px-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              //   onChange={(e) =>
              //     setSelectedProjectAreaType(e.target.value)
              //   }
              value={plot.priceCategory}
            >
              <option value="" disabled>
                Select Price Type
              </option>
              <option value="All Inclusive">
                All Inclusive
              </option>
              <option value="Starting">Starting</option>
              <option value="Basic Cost">Basic Cost</option>
            </select>

          </div>

   <div className="flex items-center gap-2">
           {/* File Input */}
           {!plot.submitted && (
            <div>
              <label
                htmlFor={`file-input-${index}`}
                className="cursor-pointer p-2 text-center bg-primary text-[13px] text-white rounded-md"
              >
                {currentVariety === "Open Land" ? 'Add Plot Plan Photos' : 'Add Floor Plan Photos'}
              </label>
              <input
                id={`file-input-${index}`}
                type="file"
                accept="image/jpeg, image/png"
                className="hidden"
                onChange={(e) =>
                  handleFileChange(
                    index,
                    e.target.files ? e.target.files[0] : null
                  )
                }
              />
            </div>
          )}

          {/* Display Image and Delete Button */}
          {plot.imageUrl && (
            <div className="flex items-center gap-4 ">
              <img
                src={plot.imageUrl}
                alt={`Plot image ${index}`}
                width={80}
                height={80}
              />
              <Image
                src="/assets/Builder_postProperty/delete.svg"
                alt="delete"
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={() => handleDelete(plot.id!)} // Pass plot.id here
              />
            </div>
          )}

          {/* Plus Icon to add new row */}
          {plot.submitted && index === plots.length - 1 && (
            <Image
              src="/assets/Builder_postProperty/plus.svg"
              alt="plus"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={handleAddNewRow}
            />
          )}
   </div>
        </div>
      ))}
    </div>
  );
}
