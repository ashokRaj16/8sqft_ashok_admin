import React, { useState } from "react";
import toast from "react-hot-toast";
import { LuCamera } from "react-icons/lu";
import useGallaryPostDetail from "@/hooks/GallaryEdit/useGallaryPost";
import useGallaryPostDeleteDetail from "@/hooks/GallaryEdit/useGallaryDelete";
import { FiTrash } from "react-icons/fi";
import usePropertyIdStore from "@/Store/propertyid";
type ResidentialComponentProps = {  
  options?: string[]; // Dropdown options
};
type gallaryPostImges = {
  property_id: number;
  img_title: string;
  image_category? : string;
  images: File;
};
const ResidentialComponent: React.FC<ResidentialComponentProps> = ({
  options,
}) => {
  const [files, setFiles] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState(""); // Determines the current type based on dropdown selection
  const { id } = usePropertyIdStore();
  const userid = id!;
  // Use hook for posting files
  const { mutate: uploadFile } = useGallaryPostDetail({
    onSuccess: (response: any) => {
      if (response.data && response.data[selectedType]?.length > 0) {
        const uploadedImages = response.data[selectedType];
        const newFiles = uploadedImages.map((image: any) => ({
          id: image.id,
          url: image.imageUrl,
          category: selectedType,
        }));

        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        toast.success(`${selectedType} uploaded successfully!`);
      } else {
        toast.error(`No image data received for ${selectedType}.`);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "File upload failed.");
    },
  });

  // Use hook for deleting files
  const { mutate: deleteFile } = useGallaryPostDeleteDetail({
    onSuccess: (data) => {
      toast.success("File deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "File deletion failed.");
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    if (!selectedType) {
      toast.error("Please select a type before uploading an image.");
      return;
    }
  
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];
      const filesArray = Array.from(selectedFiles).filter((file) =>
        allowedTypes.includes(file.type)
      );

      if (filesArray.length + files.length > 25) {
        toast.error("You can only upload up to 25 files.");
        return;
      }

      filesArray.forEach((file) => {
        const payload: gallaryPostImges = {
          property_id: Number(userid), // Replace with the actual property_id
          img_title: selectedType, // Use selectedType as the title
          images: file, // Add the file itself          
        };

        // Upload the file using useGallaryPostDetail
        uploadFile(payload);
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    const fileToRemove = files[index];
    if (!fileToRemove || !fileToRemove.id) {
      toast.error("File ID not found for deletion.");
      return;
    }

    deleteFile(fileToRemove.id, {
      onSuccess: () => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to delete the file.");
      },
    });
  };

  return (
    <div id="main" className="p-7 flex flex-col items-center font-sans">
      {/* Dropdown Section */}
      <div
        id="first"
        className="w-full max-w-sm p-6 border-b-4 border-gray-300 rounded-lg"
      >
        <select
          className="w-full px-3 py-2 text-gray-800 bg-white border rounded"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="" className="text-gray-500">
            Select type
          </option>
          {options?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* File Upload Section */}
      <div
        id="second"
        className="w-full max-w-sm mx-auto p-6 border border-gray-300 rounded-lg text-center shadow-md mt-6"
      >
        <div className="mb-6 flex items-center justify-center w-full">
          <LuCamera size={30} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Add photos to get better response
        </h3>
        <p className="text-m text-base " style={{ color: "#B6B6B6" }}>
          Maximum you can upload 5 photos
        </p>
        <p className="text-xs p-1 text-gray-600 mb-6">
          90% tenants contact on properties with photos.
        </p>
        <input
          type="file"
          multiple
          accept=".jpeg,.jpg,.png,.mp4"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
        />
      </div>

      {/* Uploaded Images Section */}
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {files.map((file, index) => (
          <div key={index} className="w-48 border rounded-lg p-2 shadow-md">
            {file.url.includes(".mp4") ? (
              // Video Card
              <div>
                <video
                  controls
                  src={file.url}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <p className="text-sm font-semibold text-gray-800 mt-2">
                  {file.category}
                </p>
              </div>
            ) : (
              // Image Card
              <div>
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <p className="text-sm font-semibold text-gray-800 mt-2">
                  {file.category}
                </p>
              </div>
            )}
            <button
              onClick={() => handleRemoveFile(index)}
              className="bg-red-500 text-black px-3 py-1 rounded mt-2 flex items-center justify-center gap-2"
            >
              <FiTrash size={16} />
              
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResidentialComponent;
