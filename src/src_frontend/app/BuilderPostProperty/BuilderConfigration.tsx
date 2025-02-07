import React, { useState } from "react";
import ReusableRedTagComponent from "../CompoundComponent/ReusableRedTag";
import Image from "next/image";
import useBuilderConfigration from "@/hooks/BuilderFormHooks/useBuilderConfigration";
import toast from "react-hot-toast";
import usePropertyIdStore from "@/Store/propertyid";
import useDeleteBuilderImageDetail from "@/hooks/BuilderFormHooks/useDeleteBuilderImage";

export default function BuilderConfigration() {
  const [plots, setPlots] = useState<any[]>([
    {
      length: "",
      width: "",
      carpetArea: "",
      price: "",
      image: null,
      submitted: false,
      id: null, // id to track images for delete
      imageUrl: "",
    },
  ]);

  const { id } = usePropertyIdStore();
  const userid = id!;

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
          updatedPlots[updatedPlots.length - 1].id =
            data.data.configuration[0].id;
          updatedPlots[updatedPlots.length - 1].imageUrl =
            data.data.configuration[0].imageUrl;
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
          Plot Configuration
        </h3>
        <ReusableRedTagComponent />
      </div>

      {/* Plot Rows */}
      {plots.map((plot, index) => (
        <div key={index} className="flex items-center gap-4 mt-4">
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
          <span className="text-gray">X</span>

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
          <span>Sq.ft.</span>

          {/* Carpet Area */}
          <input
            type="text"
            value={plot.carpetArea}
            onChange={(e) => {
              const updatedPlots = [...plots];
              updatedPlots[index].carpetArea = e.target.value;
              setPlots(updatedPlots);
            }}
            placeholder="Plot Area in Sqft"
            className="w-40 p-2 border rounded-md text-sm"
            disabled={plot.submitted}
          />

          {/* Price */}
          <input
            type="text"
            value={plot.price}
            onChange={(e) => {
              const updatedPlots = [...plots];
              updatedPlots[index].price = e.target.value;
              setPlots(updatedPlots);
            }}
            placeholder="Enter Price"
            className="w-28 p-2 border rounded-md text-sm"
            disabled={plot.submitted}
          />

          {/* File Input */}
          {!plot.submitted && (
            <div>
              <label
                htmlFor={`file-input-${index}`}
                className="cursor-pointer p-2 text-center bg-primary text-white rounded-md"
              >
                Add Plot Plan Photos
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
            <div className="flex items-center gap-4 mt-4">
              <img
                src={plot.imageUrl}
                alt={`Plot image ${index}`}
                width={100}
                height={100}
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
      ))}
    </div>
  );
}
