// import { MdClose, MdImage } from "react-icons/md";

// export function ResidentialComponent({
//     type,
//     fieldName,
//     onFileChange,
//     files,
//   }: ResidentialComponentProps) {
//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//       const selectedFiles = event.target.files;
//       if (selectedFiles) {
//         const allowedTypes = ["image/jpeg", "image/png"];
//         const filesArray = Array.from(selectedFiles).filter((file) =>
//           allowedTypes.includes(file.type)
//         );
  
//         if (filesArray.length + files.length > 5) {
//           alert("You can only upload up to 5 files.");
//           return;
//         }
  
//         const updatedFiles = [...files, ...filesArray];
//         onFileChange(updatedFiles);
//       }
//     };
  
//     const handleRemoveFile = (index: number) => {
//       const newFiles = files.filter((_, i) => i !== index);
//       onFileChange(newFiles);
//     };
    
//     return (
//       <div className="relative border border-gray-200 rounded-md p-4 w-full max-w-sm overflow-y-auto h-80">
//         <div className="border border-primary text-black p-1 w-fit rounded-sm">
//           Upload Photo of {type}
//         </div>
//         <p className="text-sm text-gray mb-4">
//           Add your documents here. You can upload up to five images max.
//         </p>
//         <input
//           type="file"
//           multiple
//           onChange={handleFileChange}
//           className="max-h-[80px] flex h-full"
//         />
//         <p className="text-beach text-sm my-3">
//           Only support .jpg, .png files.
//         </p>
//         <div className="flex flex-col gap-2 mt-2 overflow-y-auto h-10">
//           {files.map((file, index) => (
//             <div
//               key={index}
//               className="flex items-center justify-between border border-gray p-1 rounded-sm"
//             >
//               <MdImage className="h-6 w-6" />
//               <p className="text-[8px] text-gray-500 text-ellipsis overflow-hidden w-32">
//                 {file.name}
//               </p>
//               <button
//                 className="text-gray-500 hover:text-gray-700 transition-colors"
//                 onClick={() => handleRemoveFile(index)}
//               >
//                 <MdClose />
//               </button>
//             </div>
//           ))}
//         </div>
//         <div className="w-full bg-gray h-[1px]"></div>
//       </div>
//     );
//   }