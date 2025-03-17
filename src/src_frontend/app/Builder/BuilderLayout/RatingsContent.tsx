'use client';
import { Button } from "@/ui/Button";
import { Card, CardContent } from "@/ui/card";
import { Input } from "@/ui/FormField";
import { ErrorMessage, Field } from "formik";
import { Star } from "lucide-react";
import React from "react";

const RatingsContent = () => {
  // Data for star rating
  const stars = Array(5).fill(0);

  return (
    <div className="flex flex-col  gap-5 p-4 bg-white border rounded-lg">
      <section className="flex flex-col gap-5">
        <h1 className="font-light text-2xl text-black">Review</h1>

        <Card className="bg-[#e6e6e6] border-[#908f8f]">
          <CardContent className="flex items-center gap-6 p-2">
            <span className="font-normal text-base text-[#222222]">
              No Reviews
            </span>
            <span className="font-normal text-base text-[#22222280]">
              There are no reviews for this project yet
            </span>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-light text-xl text-[#222222]">Write a review</h2>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#22222280]">Rate</span>
          <div className="flex gap-1">
            {stars.map((_, index) => (
              <Star
                key={index}
                className="w-5 h-5 text-gray-300 cursor-pointer hover:text-[#fc6600]"
              />
            ))}
          </div>
        </div>

        <Input
          className="h-[37px] font-light text-base"
          placeholder="Review Title"
        />

        {/* <Field
          as="textarea"
          name="description"
          className="w-full p-2 border rounded-md"
          placeholder="Enter description (up to 5000 characters)"
          rows="8"
        />
        <ErrorMessage
          name="description"
          component="div"
          className="text-red-600 text-sm"
        /> */}

        <div className="flex justify-end gap-2.5">
          <Button
            variant="outline"
            className="w-20 h-10 border-[#fc6600] text-[#fc6600] hover:bg-[#fc6600] hover:text-white"
          >
            Cancel
          </Button>
          <Button className="w-20 h-10 bg-[#fc6600] text-white hover:bg-[#e55a00]">
            Post
          </Button>
        </div>
      </section>
    </div>
  );
};

export default RatingsContent;
