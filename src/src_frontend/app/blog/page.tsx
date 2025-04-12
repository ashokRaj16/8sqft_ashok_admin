
"use client";
import React, { useEffect, useState } from "react";
import axios from "@/hooks";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export interface Blog {
  id: number;
  title: string;
  description: string;
  short_description: string;
  banner_image: string;
  banner_video: string | null;
  cat_id: number;
  tags: string;
  added_by: number;
  comment_enabled: string | null;
  author_name: string;
  meta_title: string;
  meta_description: string;
  meta_keyword: string;
  canonical_url: string | null;
  is_deleted: string;
  status: string;
  created_at: string;
  updated_by: string;
  category_title: string;
  publish_date: string;
}

interface BlogResponse {
  status: boolean;
  message: string;
  data: {
    blogs: Blog[];
    totalCounts: number;
  };
}

const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<Number>(1);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const selectedCatID = searchParams.get("catID");
  const selectedTag = searchParams.get("tag");
  const [totalBlogs, setTotalBlogs] = useState<number>(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const params = new URLSearchParams( {
          cat_id: selectedCatID || '',
          tag : selectedTag || '',
          page : String(page)
        })
        const response = await axios.get<BlogResponse>("/api/v1/front/blog", { params,
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "A8SQFT7767",
          },
        });

        if (response.data.status) {
          let filteredBlogs = response.data.data.blogs;

          setBlogs(filteredBlogs);
          setTotalBlogs(filteredBlogs.length);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleBlogClick = (blogId: number) => {
    router.push(`/blogDetails?id=${blogId}`);
  };

  const handleViewAll = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  // Group blogs by category_title
  const groupedBlogs = blogs.reduce((acc, blog) => {
    if (!acc[blog.category_title]) {
      acc[blog.category_title] = [];
    }
    acc[blog.category_title].push(blog);
    return acc;
  }, {} as Record<string, Blog[]>);

  return (
    <div className="w-full flex flex-col items-center py-3">
      <div className="relative w-full h-[270px] md:h-[300px]">
        <Image
          src="/assets/Blog/Main.jpg"
          alt="Blog Header"
          width={1200}
          height={300}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {loading ? (
        <p className="text-gray-500 mt-4">Loading blogs...</p>
      ) : (
        Object.entries(groupedBlogs).map(([category, categoryBlogs]) => {
          const isExpanded = expandedCategory === category;
          const displayedBlogs = isExpanded ? categoryBlogs : categoryBlogs.slice(0, 3);

          return (
            <div key={category} className="w-full px-4 md:px-14 mt-6">
              <div className="flex flex-row w-full justify-between items-center">
                <h2 className="text-2xl font-bold">{category}</h2>
                {categoryBlogs.length > 3 && (
                  <button onClick={() => handleViewAll(category)} className="text-primary border-b border-primary">
                    {isExpanded ? "Show Less" : "View All"}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {displayedBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer"
                  >
                    <Image
                      src={blog.banner_image}
                      alt={blog.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{blog.title}</h3>
                      <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>
                          {new Date(blog.publish_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <button
                          onClick={() => handleBlogClick(blog.id)}
                          className="text-primary border-b border-primary"
                        >
                          Read More..
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Blog;
