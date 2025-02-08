import { useQuery } from "@tanstack/react-query";
import axios from "."; // Ensure this path matches your project structure

// ✅ Define types for the API response structure
interface SearchResult {
  id: number;
  city: string;
  postal_name: string;
}

interface SearchQueryResponse {
  status: boolean;
  message?: string;
  data?: SearchResult[]; // ✅ Define the data structure
}

interface SearchQueryError {
  message?: string;
}

// ✅ Define query data type
// Update the SearchQueryData interface in the useSearchQuery hook
interface SearchQueryData {
  city: string;
  searchKeyword: string;
}

// Updated useSearchQuery hook to match the new structure
const useSearchQuery = ({ city, searchKeyword }: SearchQueryData) => {
  return useQuery<SearchQueryResponse, SearchQueryError>({
    queryKey: ["searchKeyword", city, searchKeyword], // Add city_name to the queryKey
    queryFn: async () => {
      const response = await axios.get(`https://api.8sqft.com/api/v1/front/search_dropdown?searchLimit=40`, {
        params: { city, searchKeyword }, // Pass both city_name and searchKeyword
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
    enabled: !!searchKeyword, // Only run if searchKeyword is provided
  });
};

export default useSearchQuery