import { Card, CardContent } from "@/ui/card";
import { Progress } from "@/ui/progress";
import { FileIcon } from "lucide-react";
import { ImBin } from "react-icons/im";
import React, { useState } from "react";
import usePropertyIdStore from "@/Store/propertyid";
import useGallaryPostDetail from "@/hooks/GallaryEdit/useGallaryPost";
import toast from "react-hot-toast";
import useGallaryPostDeleteDetail from "@/hooks/GallaryEdit/useGallaryDelete";

type gallaryPostImges = {
  property_id: number;
  img_title: string;
  images: File;
  image_category:string

};

interface FileUploadComponentProps {
  title?: string;
  label: string;
  imageCategory: string;
}

export default function FileUploadComponent({
  title,
  imageCategory="RERA",
  label,
}: FileUploadComponentProps) {
  const [files, setFiles] = useState<any[]>([]); // Uploaded files
  const [uploadingFiles, setUploadingFiles] = useState<any[]>([]); // Files currently being uploaded
console.log( imageCategory,'imageCategory')
  const { id } = usePropertyIdStore(); // Assume usePropertyIdStore gives property_id
  const propertyId = id!;

  const { mutate: uploadFile } = useGallaryPostDetail({
    onSuccess: (response: any) => {
      try {
        // Check if response.data exists and has keys
        if (response.data && typeof response.data === "object") {
          const uploadedImages = Object.values(response.data)
            .flat() // Flatten arrays within the object (like the "Default" key)
            .map((image: any) => ({
              id: image.id,
              url: image.imageUrl,
            }));
    
          if (uploadedImages.length > 0) {
            setFiles((prevFiles) => [...prevFiles, ...uploadedImages]);
            toast.success("Files uploaded successfully!");
          } else {
            toast.error("No valid file data found in the response.");
          }
        } else {
          toast.error("Invalid response structure.");
        }
      } catch (error) {
        console.error("Error processing upload response:", error);
        toast.error("An unexpected error occurred during upload.");
      }
    },
  });

  const { mutate: deleteFile } = useGallaryPostDeleteDetail({
    onSuccess: () => {
      toast.success("File deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "File deletion failed.");
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      const filesArray = Array.from(selectedFiles).filter((file) =>
        allowedTypes.includes(file.type)
      );

      if (filesArray.length + files.length > 25) {
        toast.error("You can only upload up to 25 files.");
        return;
      }

      filesArray.forEach((file) => {
        const payload: gallaryPostImges = {
          property_id: Number(propertyId),
          img_title: "Default", // Fixed type for all files
          image_category: imageCategory,
          images: file,
        };

        // Add to uploading state
        setUploadingFiles((prev) => [
          ...prev,
          { name: file.name, progress: 0 },
        ]);

        // Simulate progress
        const simulateProgress = setInterval(() => {
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.name === file.name
                ? { ...f, progress: Math.min(f.progress + 20, 100) }
                : f
            )
          );
        }, 500);

        // Call the uploadFile mutation
        uploadFile(payload, {
          onSuccess: () => {
            clearInterval(simulateProgress);
            setUploadingFiles((prev) =>
              prev.filter((f) => f.name !== file.name)
            );
          },
          onError: () => {
            clearInterval(simulateProgress);
            setUploadingFiles((prev) =>
              prev.filter((f) => f.name !== file.name)
            );
          },
        });
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
    });
  };

  return (
    <>
    <div className="flex flex-col gap-10 p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
    
      {/* Header */}
      {title && (
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-2xl text-[#222222]">{label}</h2>
        </div>
      )}
      {/* File Upload Card */}
      <Card className="w-[350px] bg-[#f8f8f8] border border-[#b6b6b6] rounded-lg">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
          <label
          onClick={()=>console.log(imageCategory,'clicked')}
            htmlFor="fileUpload"
            className="w-full max-w-[140px] h-10 bg-[#fc6600] hover:bg-[#fc6600]/90 text-lg text-white flex items-center justify-center cursor-pointer rounded"
          >
            {title}
            <input
              id="fileUpload"
              type="file"
              accept=".pdf,.jpeg,.png"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </CardContent>
      </Card>

    </div>

     {/* Files List */}
     <div className="flex flex-col gap-6 mt-6">
        {files.map((file, index) => (
          <div
            key={file.id}
            className="flex items-center gap-6 bg-[#f8f8f8] p-4 rounded-lg"
          >
            <div className="w-[48px] h-[48px]">
              <FileIcon className="w-full h-full text-[#222222]" />
            </div>
            <div className="flex flex-col w-full gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg text-[#222222]">
                  {file.url}
                </span>
                <ImBin
                  className="w-5 h-5 text-red-600 cursor-pointer"
                  onClick={() => handleRemoveFile(index)}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Uploading Files */}
        {uploadingFiles.map((file) => (
          <div
            key={file.name}
            className="flex items-center gap-6 bg-[#f8f8f8] p-4 rounded-lg"
          >
            <div className="w-[48px] h-[48px]">
              <FileIcon className="w-full h-full text-[#222222]" />
            </div>
            <div className="flex flex-col w-full gap-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg text-[#222222]">
                  {file.name}
                </span>
                <span className="font-medium text-lg text-[#222222]">
                  {file.progress}%
                </span>
              </div>
              <Progress
                value={file.progress}
                className="w-full h-3 bg-[#d9d9d9] rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
