// import { useQuery } from "@tanstack/react-query";
// import axios from ".";

// // Interface for individual city item
// interface City {
//   id: number;
//   city_name: string;
//   state_id: number;
//   status: string;
// }

// // Response interface
// interface getCitiesListResponse {
//   status: boolean;
//   message: string;
//   data: City[];
// }

// // Hook definition
// const usegetCitieslist = (stateId: number | null) => {
//   return useQuery<getCitiesListResponse>(
//     async () => {
//       if (stateId === null) {
//         throw new Error("State ID is required to fetch cities.");
//       }

//       const response = await axios.post(
//         `https://api.8sqft.com/api/v1/location/cities`,
//         { state_id: stateId }, // Sending stateId in the request body
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       return response.data;
//     },
//   );
// };

// export default usegetCitieslist;
