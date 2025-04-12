import { Skeleton } from "@/components/ui/skeleton";

export default function DetailSkeleton() {
  return (
    <div className="p-4 max-w-7xl mx-auto my-4 min-h-[1600px]">
      {/* Header Title */}
      <div className="lg:flex justify-between items-center hidden">
        <Skeleton className="h-8 w-1/2" />
      </div>

      {/* Sub Heading (By + Location) */}
      <div className="mt-2">
        <Skeleton className="h-4 w-1/3" />
      </div>

      {/* Ratings & Review Button */}
      <div className="flex items-center gap-3 mt-4">
        <Skeleton className="h-8 w-10 rounded-full" />
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Price & Action Buttons */}
      <div className="mt-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>

      {/* Main Image Grid - 10 Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 mt-6">
        <div className="lg:col-span-6">
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-4">
          <Skeleton className="h-[245px] w-full rounded-lg" />
          <Skeleton className="h-[245px] w-full rounded-lg" />
        </div>
      </div>

      {/* Share and Save */}
      {/* <div className="flex justify-end gap-3 mt-4">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div> */}

      <Skeleton className="h-[2px] w-full my-6" />

      {/* Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton key={idx} className="h-9 w-full rounded-md" />
        ))}
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Skeleton className="h-28 w-full rounded-md" />
        <Skeleton className="h-28 w-full rounded-md" />
        <Skeleton className="h-28 w-full rounded-md" />
      </div>

      {/* Property Details */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        
        <Skeleton className="h-28 w-full rounded-md" />
      </div> */}

<div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-6">
  {/* Left Section (8 columns) */}
  <div className="md:col-span-8 space-y-4">
    {/* First row: full width */}
    <Skeleton className="h-28 w-full rounded-md" />

    {/* Second row: 2 columns */}
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      <Skeleton className="h-60 w-full rounded-md" />
    </div>

    <Skeleton className="h-28 w-full rounded-md" />

{/* Second row: 2 columns */}
<div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      <Skeleton className="h-60 w-full rounded-md" />
    </div>
  </div>


  {/* Right Section (4 columns) */}
  <div className="md:col-span-4 space-y-4">
  <Skeleton className="h-[500px] w-full rounded-md" />
  <Skeleton className="h-28 w-full rounded-md" />

  </div>
</div>

      <div className="mt-8">
        <Skeleton className="h-6 w-1/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-2" />
      </div>

      {/* Amenities Section */}
      <div className="mt-8">
        <Skeleton className="h-6 w-1/4 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Skeleton key={idx} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </div>

      {/* Nearby Locations */}
      <div className="mt-8">
        <Skeleton className="h-6 w-1/4 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full rounded-md" />
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-8">
        <Skeleton className="h-6 w-1/4 mb-4" />
        <Skeleton className="h-10 w-full rounded-md mb-2" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}


