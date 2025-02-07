"use client";
import toast from "react-hot-toast";
import ResidentialComponent from "./Residential";
import usePropertyIdStore from "@/Store/propertyid";
import useBuilderGallaryDetail from "@/hooks/BuilderFormHooks/useBuilderGallary";
import GallaryUploadBroucher from "./GallaryUploadBroucher";

interface ResidentialComponentProps {
  type: string;
  fieldName: string; // Add fieldName to accept dynamic field names (e.g., property_images, society_images)
  onFileChange: (files: File[]) => void;
  files: File[];
}

interface GalleryComponentProps {
  onNext: () => void; // Receive `onNext` as a prop
}
export default function BuilderGallary({ onNext }: GalleryComponentProps) {
  const { id } = usePropertyIdStore();
  const userid = id!;
  const { mutate, error } = useBuilderGallaryDetail({
    onSuccess: (data: any) => {
      toast.success(`${data.message}`);
      onNext();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    const gallary = { id: Number(userid), step_id: 4 };
    mutate(gallary);
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex gap-4  flex-col">
        <p className="text-md font-bold">
          Upload Photos
          <span className="text-[#A4A4A4] text-sm font-normal">
            (by selecting category)
          </span>
        </p>
        <ResidentialComponent
          options={[
            "Main Image",
            "Entrance Image",
            "Plot Photo",
            "Road Photo",
            "Garden Photo",
            "Temple Photo",
            "Others",
          ]}
        />
      </div>
      <div className="flex gap-4  flex-col">
        <p className="text-md font-bold">Add video to get better response</p>
        <ResidentialComponent options={["Video"]} />
      </div>
      <div className="flex gap-4  flex-col">
        <p className="text-md font-bold">Verify your property</p>
        <ResidentialComponent
          options={["Layout Plan", "Property Agreement", "DA&PA", "7/12 or 8A"]}
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-5 w-full justify-around">
        <div className="">
          <p className="text-md font-bold">Upload Brochure</p>
          <GallaryUploadBroucher
            title={"Add File "}
            label={"Upload Brochure here"}
          />
        </div>
        <div className="">
          <p className="text-md font-bold">Upload RERA QR code</p>
          <GallaryUploadBroucher
            title={" Add Photo"}
            label={"Upload your Rera QR Code here"}
          />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="mt-8 w-full max-w-48 flex self-center text-center text-white py-2 px-6 rounded-md bg-primary hover:bg-primary transition-colors"
      >
        Save and Next
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-4">Error: {error.message}</p>
      )}
    </div>
  );
}
