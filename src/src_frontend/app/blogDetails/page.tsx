"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/ui/Button";
import axios from "@/hooks";
import { useAuthStore } from "@/Store/jwtTokenStore";
import useCategoryList from "@/hooks/Blog/useCategoryList"; // Import your hook

// import "./scroll.css";
// Define the Blog Details interface
interface BlogDetails {
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
  youtube_url: string;
}

interface RecentBlog {
  id: number;
  title: string;
  banner_image: string;
  category_title: string;
  tags: string;
  short_description:string;
}

const BlogDetailsPage = () => {
  const [blog, setBlog] = useState<BlogDetails | null>(null);
  const [loadingBlog, setLoadingBlog] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");
  const [recentBlogs, setRecentBlogs] = useState<RecentBlog[]>([]);
  const { categories, loading: loadingCategories, error } = useCategoryList(); // Fetch categories
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      if (!blogId) return;
      try {
        const response = await axios.get<{ status: boolean; data: BlogDetails }>(
          `/api/v1/front/blog/${blogId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "A8SQFT7767",
            },
          }
        );
        if (response.data.status) {
          setBlog(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        setLoadingBlog(false);
      }
    };

    fetchBlogDetails();
  }, [blogId]);

  useEffect(() => {
    if (!blogId) return;

    // Retrieve blog list from localStorage
    const storedBlogs = JSON.parse(localStorage.getItem("blogsData") || "[]");

    // Find the current blog
    const currentBlog = storedBlogs.find((b: any) => b.id === Number(blogId));

    if (currentBlog) {
      setBlog(currentBlog);
    }

    // Filter out the current blog from recent articles
    setRecentBlogs(storedBlogs.filter((b: any) => b.id !== Number(blogId)));
  }, [blogId]);

  const handleBlogClick = (id: number) => {
    router.push(`/blogDetails?id=${id}`);
  };

  const handleCategoryClick = (categoryTitle: string, ID: number) => {
    router.push(`/blog?category=${encodeURIComponent(categoryTitle)}&catID=${ID}`);
  };

  const handleTagClick = (tag: string) => {
    router.push(`/blog?tag=${tag}`);
  };


  if (loadingBlog) {
    return <p className="text-center text-gray-500 mt-6">Loading blog details...</p>;
  }

  if (!blog) {
    return <p className="text-center text-red-500 mt-6">Blog not found.</p>;
  }
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200; // Adjust as needed
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-[#222222] min-h-screen text-white">
      <div className="relative w-full rounded-lg overflow-hidden">
        {/* Blog Header Image with Reduced Height */}
        <Image
          src="/assets/Blog/Blog Details- Desktop.jpg"
          alt="Blog Header"
          width={1200}
          height={300} // Reduced height
          className="w-full h-[150px] object-cover rounded-lg"
        />

        {/* Overlay Section */}
        <div className="absolute inset-0 flex flex-col justify-center bg-black bg-opacity-50 p-6">
          {/* Blog Title */}
          <h1 className="text-lg md:text-2xl font-semibold md:font-bold text-white ml-4 md:ml-8 w-[90%] md:w-[70%] leading-tight">
            {blog.title}
          </h1>

          {/* Blog Short Description */}
          <p className="text-xs md:text-sm font-light md:font-normal text-white ml-4 md:ml-8 w-[90%] md:w-[70%] mt-1 leading-tight">
            {blog.short_description.split(" ").slice(0, 10).join(" ")}
            {blog.short_description.split(" ").length > 10 && " ..."}
          </p>

          {/* Date and Author Section */}
          <div className="absolute bottom-4 mr-2  right-4 flex flex-row md:flex-row items-start md:items-center gap-1 md:gap-2 text-xs md:text-lg">
            {/* Author Name */}
            <div className="flex items-center gap-1 md:gap-2">  
            <Image
                src="/assets/Blog/Profile.svg"
                alt="Calendar Icon"
                width={16}
                height={16}
                className="h-auto"
              />
               <span className="text-white font-light md:font-normal">{blog.author_name}</span>
               </div>
         

            {/* Calendar Icon & Date */}
            <div className="flex items-center gap-1 md:gap-2">
              <Image
                src="/assets/Blog/calender.svg"
                alt="Calendar Icon"
                width={16}
                height={16}
                className="h-auto"
              />
              <span className="text-white font-light md:font-normal">
                {new Date(blog.publish_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>


      </div>

      <div className="flex flex-col md:flex-row gap-8 m-8 mr-12">
        <div className="w-full md:w-[70%] flex flex-col">
          <Image
            src={blog.banner_image}
            alt="Blog Header"
            width={1312}
            height={350}
            className="w-full h-[350px] object-cover rounded-lg"
          />

          <div className="pt-6 w-full pr-0">
            <div
              dangerouslySetInnerHTML={{ __html: blog.description }}
              className="text-gray-300 leading-relaxed"
            />
          </div>

          {blog.youtube_url && (
            <div className="mt-6 w-full">
              <iframe
                width="100%"
                height="350"
                src={`https://www.youtube.com/embed/${new URL(blog.youtube_url).searchParams.get("v")}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          )}



        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-[30%] flex flex-col justify-start">
          {/* <div className="mb-6">
            <h1 className="text-lg font-bold">Similar Articles</h1>
            <div className="flex flex-col gap-3 mt-2">
              {recentBlogs.map((post) => (
                <div key={post.id} className="flex items-center gap-2">
                  <span className="block w-2 h-2 bg-white"></span>
                  <h3 className="text-sm">{post.title}</h3>
                </div>
              ))}
            </div>
          </div> */}

<div className="mb-6">
  <h1 className="text-lg font-bold text-white mb-3">Similar Articles</h1>
  <div className="flex flex-col gap-4">
    {recentBlogs.map((post) => (
      <div
        key={post.id}
        onClick={() => handleBlogClick(post.id)}
        className="bg-[#2c2c2c] rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition"
      >
        {/* Article Image */}
        <Image
          src={post.banner_image}
          alt={post.title}
          width={350}
          height={200}
          className="w-full h-32 object-cover"
        />

        {/* Article Content */}
        <div className="p-4">
          <div className="flex flex-row w-full justify-between">
          <h3 className="text-white font-semibold text-sm">
            {post.title.length > 30 ? post.title.substring(0, 30) + "..." : post.title}
          </h3>
          <div className="flex justify-end mt-2">
            <Image
              src="/assets/Blog/Icon wrap.svg" // Change to actual icon path
              alt="Open Article"
              width={16}
              height={16}
              className="opacity-70 hover:opacity-100 transition"
            />
          </div>
          </div>
      
          <p className="text-gray-400 text-xs mt-1">{post.short_description}</p> {/* Added Description */}
          
          {/* External Link Icon */}
        
        </div>
      </div>
    ))}
  </div>
</div>


          <div className="mb-6">
            <h1 className="text-lg font-bold">Tags</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {blog.tags.split(",").map((tag, index) => (
                <button
                  key={index}
                  onClick={() => handleTagClick(tag.trim())}
                  className="px-3 py-1 text-sm bg-gray-700 text-red bg-white rounded-full hover:bg-gray-600 transition"
                >
                  {tag.trim()}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-lg font-bold">Categories</h1>
            {loadingCategories ? (
              <p className="text-gray-400 mt-2">Loading categories...</p>
            ) : error ? (
              <p className="text-red-400 mt-2">Error loading categories</p>
            ) : (
              <div className="flex flex-row gap-2 mt-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.title, category.id)}
                    className="text-sm bg-white px-3 py-1 rounded-full text-red"
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 w-[90%] mx-auto relative">
        <h2 className="text-2xl font-semibold text-white">Recent Articles</h2>

        {/* Scrollable Container */}
        <div className="relative">
          {/* Prev Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-3 rounded-full text-white z-10"
          >
            ◀
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 mt-6 scrollbar-hide no-scrollbar"
            style={{ scrollBehavior: "smooth" }}
          >
            {recentBlogs.map((post) => (
              <div key={post.id} className="min-w-[300px] bg-[#333] shadow-md rounded-lg overflow-hidden">
                <Image
                  src={post.banner_image}
                  alt={post.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-400">{post.category_title}</p>
                  <button
                    onClick={() => handleBlogClick(post.id)}
                    className="text-primary border-b-[1px] border-primary mt-2"
                  >
                    Read More..
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-3 rounded-full text-white z-10"
          >
            ▶
          </button>
        </div>
      </div>

      <div className="relative w-full mt-10 rounded-lg overflow-hidden">
        <Image
          src="/assets/Blog/Wrapper.png"
          alt="Construction Banner"
          width={1200}
          height={400}
          className="w-full h-auto rounded-lg"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-black bg-opacity-50 p-6">
          <h2 className="text-white  font-bold">Time to build something truly groundbreaking!</h2>
          <div className="mt-4 gap-4">
            <Button className="bg-white text-black font-semibold mx-2">View Our Team</Button>
            <Button className="bg-white text-black mx-2">View Our Services</Button>
          </div>
        </div>
      </div>
    </div>
  );


};

export default BlogDetailsPage;
