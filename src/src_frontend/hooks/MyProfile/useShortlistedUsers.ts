
import { useAuthStore } from "@/Store/jwtTokenStore";
import axios from "..";
import { useEffect, useState } from "react";

interface UserData {
    id: number;
    fname: string;
    mname?: string;
    lname: string;
    email: string;
    mobile: number;
    address_1?: string | null;
    user_id: number;
    date: string;
    fullName: string;
}

const useShortlistedUsers = (propertyId: number | null) => {
    const limit = 4;
    const [totalPages, setTotalPages] = useState(1);
    const token = useAuthStore((state) => state.token);
    const [users, setUsers] = useState<UserData[]>([]);

    useEffect(() => {
        if (token && propertyId) {
            fetchContactedDetails(1, true);
        }
    }, [token, propertyId]); // ✅ Add propertyId dependency

    const fetchContactedDetails = async (pageNumber: number, isInitial = false) => {
        if (!propertyId) return;

        try {
            console.log("Fetching contacted users for propertyId:", propertyId);
            const response = await axios.get(`/api/v1/front/profile/shortlisted_users/${propertyId}?limit=${limit}&page=${pageNumber}`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "A8SQFT7767",
                    Authorization: `Bearer ${token}`,
                },
            });

            const allUsers = response.data.data.users || [];
            const totalCounts = response.data.data.totalCounts;
            const calculatedTotalPages = Math.ceil(totalCounts / limit);
            setTotalPages(calculatedTotalPages);

            const formattedUsers: UserData[] = allUsers.map((user: any, index: number) => ({
                id: user.id || index,
                fname: user.fname || "-",
                lname: user.lname || "-",
                mobile: user.mobile || "-",
                email: user.email || "-",
                address_1: user.address_1 || "-",
                date: user.date || "-",
                fullName: `${user.fname} ${user.lname}`,
            }));

            setUsers(formattedUsers);
        } catch (error) {
            console.error("Error fetching Contacted Users:", error);
        }
    };

    return { users, totalPages, fetchContactedDetails };
};

export default useShortlistedUsers;



