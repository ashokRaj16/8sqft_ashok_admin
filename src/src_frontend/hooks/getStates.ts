import { useQuery } from "@tanstack/react-query";
import axios from ".";

// Interface for individual state item
interface City {
    id: number,
    city_name: string,
    state_id: number,
    status: string,
}

// Response interface
interface getStatesListResponse {
    status: boolean;
    message: string;
    data: City[];
}

// Hook definition
const useGetCitylist = () => {
    return useQuery<getStatesListResponse>({
        queryKey: ["getStateslist"],
        queryFn: async () => {
            const response = await axios.get(`https://api.8sqft.com/api/v1/location/cities`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
    });
};

export default useGetCitylist;
