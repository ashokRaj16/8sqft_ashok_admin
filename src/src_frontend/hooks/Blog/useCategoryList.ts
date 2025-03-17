import { useState, useEffect } from "react";
import axios from "@/hooks";
import { useAuthStore } from "@/Store/jwtTokenStore";

interface Category {
  id: number;
  title: string;
}

const useCategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token) || "";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<{ status: boolean; data: { category: Category[] } }>(
          "/api/v1/front/blog/category",
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "A8SQFT7767",
              // Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          setCategories(response.data.data.category);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (err: any) {
        console.error("Category Fetch Error:", err.message || err);
        setError("Error fetching categories");
        setCategories([]); // Ensure state consistency on failure
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Removed token dependency since it's not used

  return { categories, loading, error };
};

export default useCategoryList;
