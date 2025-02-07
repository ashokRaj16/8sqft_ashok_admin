"use client";

import useGallaryDetail from "@/hooks/Postpropertyhooks/useGallary";
import { useAuthStore } from "@/Store/jwtTokenStore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdClose, MdImage } from "react-icons/md";
import VerificationComponent from "./VerificationComponent";
import ResidentialComponent from "./Residential";
import usePropertyIdStore from "@/Store/propertyid";

interface ResidentialComponentProps {
  type: string;
  fieldName: string; // Add fieldName to accept dynamic field names (e.g., property_images, society_images)
  onFileChange: (files: File[]) => void;
  files: File[];
}

interface GalleryComponentProps {
  onNext: () => void; // Receive `onNext` as a prop
}
export default function GalleryComponent({ onNext }: GalleryComponentProps) {
 
  const { id } = usePropertyIdStore();
  const userid = id!;
  const { mutate, error } = useGallaryDetail({
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
            "Main image",
            "Kitchen",
            "Bedroom",
            "Dining Hall",
            "Drawing",
            "RoomMain",
            "HallBathroom",
            "Lobby",
            "Study",
            "Balcony",
            " Floor Plan",
            "Utilities",
            "Outside View",
            "Other",
          ]}
        />
      </div>
      <div className="flex gap-4  flex-col">
        <p className="text-md font-bold">Upload Video</p>
        <ResidentialComponent
          options={[
            "video",
          ]}
        />
      </div>
      <div className="flex gap-4  flex-col">
        <p className="text-md font-bold">Verify your property</p>
        <ResidentialComponent
          options={[
            "Light Bill",
            " Property Tax",
            "Water Bill",
            "Property Agreement",
            "Power of Attorney",
          ]}
        />
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
