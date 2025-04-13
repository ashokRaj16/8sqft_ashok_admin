


// import { useState } from "react";
// import axios from "axios";
// import { useMutation } from "@tanstack/react-query";
// import  usePropertyIdStore from "@/Store/propertyid" 
// import { useAuthStore } from "@/Store/jwtTokenStore";

// const ReportForm: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => {
//   const [description, setDescription] = useState("");
//   const isFormValid = description.trim().length > 0;

//   const propertyId = usePropertyIdStore((state) => state.id); 
//   const token = useAuthStore((state) => state.token);
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false); 

//   const mutation = useMutation({
//     mutationFn: async () => {
//       return axios.post(
//         "https://api.8sqft.com/api/v1/front/property_report",
//         {
//           property_id: propertyId,
//           request_type: title,
//           request_reason: description,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "x-api-key": "A8SQFT7767",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//     },
//     onSuccess: () => {
//       setShowSuccessPopup(true); 
//       setTimeout(onClose, 3000); 
//     },
//     onError: (error) => {
//       setShowSuccessPopup(false);
//       console.error("Report submission error:", error);
//     },
//   });

//   return (
//     <>
//       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//         <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">Report Form</h2>
//             <button onClick={onClose} className="text-gray-500">&times;</button>
//           </div>
//           <p className="text-sm text-gray-500 mb-4">A simple message is required before submitting.</p>

//           <label className="block text-sm font-medium mb-1">Title</label>
//           <input
//             type="text"
//             value={title}
//             disabled
//             className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-700 mb-4"
//           />

//           <label className="block text-sm font-medium mb-1">Description</label>
//           <textarea
//             placeholder="We use this feedback to improve our guidelines."
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded resize-none h-24"
//           />

//           <button
//             disabled={!isFormValid || mutation.isPending}
//             onClick={() => mutation.mutate()}
//             className={`w-full mt-4 p-2 rounded text-white ${isFormValid ? 'bg-primary' : 'bg-black cursor-not-allowed'}`}
//           >
//             {mutation.isPending ? "Submitting..." : "Submit"}
//           </button>
//         </div>
//       </div>

//       {showSuccessPopup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
//             <h2 className="text-lg font-semibold text-black">Thank You!</h2>
//             <p className="text-black text-sm mt-2">
//               Your complaint has been submitted. Our team will review your issue.
//             </p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// const BadgesSection: React.FC = () => {
//   const [activeForm, setActiveForm] = useState<string | null>(null);
//   const propertyId =  usePropertyIdStore((state) => state.id); 

//   return (
//     <div className="flex gap-2 justify-center my-4">
//       {["Listed by Broker", "Sell Out", "Wrong Info", "Other"].map((badge) => (
//         <button
//           key={badge}
//           onClick={() => setActiveForm(badge)}
//           className="bg-white border border-gray text-black text-xs px-2 py-1 rounded-sm"
//         >
//           {badge}
//         </button>
//       ))}
//       {activeForm && <ReportForm title={activeForm} onClose={() => setActiveForm(null)} />}
//     </div>
//   );
// };

// export default BadgesSection;



import { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import usePropertyIdStore from "@/Store/propertyid";
import { useAuthStore } from "@/Store/jwtTokenStore";

const ReportForm: React.FC<{ title: string; onClose: () => void; onShowSuccess: () => void }> = ({ title, onClose, onShowSuccess }) => {
  const [description, setDescription] = useState("");
  const isFormValid = description.trim().length > 0;

  const propertyId = usePropertyIdStore((state) => state.id);
  const token = useAuthStore((state) => state.token);

  const mutation = useMutation({
    mutationFn: async () => {
      return axios.post(
        "https://api.8sqft.com/api/v1/front/property_report",
        {
          property_id: propertyId,
          request_type: title,
          request_reason: description,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "A8SQFT7767",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      onClose(); // ✅ Close form FIRST
      setTimeout(onShowSuccess, 100); // ✅ Show popup IMMEDIATELY after
    },
    onError: (error) => {
      console.error("Report submission error:", error);
    },
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Report Form</h2>
          <button onClick={onClose} className="text-gray-500">&times;</button>
        </div>
        <p className="text-sm text-gray-500 mb-4">A simple message is required before submitting.</p>

        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          disabled
          className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-700 mb-4"
        />

        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          placeholder="We use this feedback to improve our guidelines."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded resize-none h-24"
        />

        <button
          disabled={!isFormValid || mutation.isPending}
          onClick={() => mutation.mutate()}
          className={`w-full mt-4 p-2 rounded text-white ${isFormValid ? 'bg-primary' : 'bg-black cursor-not-allowed'}`}
        >
          {mutation.isPending ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

const BadgesSection: React.FC = () => {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const propertyId = usePropertyIdStore((state) => state.id);

  return (
    <div className="flex flex-col items-center my-4">
      <div className="flex gap-2 justify-center">
        {["Listed by Broker", "Sell Out", "Wrong Info", "Other"].map((badge) => (
          <button
            key={badge}
            onClick={() => setActiveForm(badge)}
            className="bg-white border border-gray text-black text-xs p-1"
          >
            {badge}
          </button>
        ))}
      </div>

      {activeForm && (
        <ReportForm
          title={activeForm}
          onClose={() => setActiveForm(null)}
          onShowSuccess={() => {
            setShowSuccessPopup(true);
            setTimeout(() => setShowSuccessPopup(false), 3000); // ✅ Hide popup after 3s
          }}
        />
      )}

      {/* ✅ Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold text-black">Thank You!</h2>
            <p className="text-black text-sm mt-2">
              Your complaint has been submitted. Our team will review your issue.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgesSection;






