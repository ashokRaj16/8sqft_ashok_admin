import { Skeleton } from "@/components/ui/skeleton";


export default function ProjectSkeleton() {
  return (
    <>
   <div className="w-full max-w-7xl mx-auto px-4 px-lg:0 my-2">
   <div className="flex flex-col md:flex-row my-5 text-white lg:p-6 mt-5 lg:border-b gap-6">
      {/* Left Panel */}
      <div className="flex-1 space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-28" />

        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>

        <div className="flex gap-4 pt-4">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
      </div>

      {/* Right Panel (Image + Price tag + dots) */}
      <div className="flex-1 relative">
        <Skeleton className="h-[300px] w-full rounded-xl" />

        <div className="absolute bottom-4 left-4">
          <Skeleton className="h-10 w-48 rounded-lg" />
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-3 rounded-full" />
          ))}
        </div>
      </div>
    </div>

    <div className="flex flex-col lg:flex-row gap-6 ">
      {/* Left Section */}
      <div className="flex-1 space-y-6">
        {/* Logo + Icons Row */}
      <div className="border p-2 rounded-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 ">
          <div className="flex justify-center items-center flex-col gap-2">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex gap-3 flex-wrap">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-28 rounded-md" />
            ))}
          </div>
        </div>
      </div>

        {/* Overview Title */}
        <Skeleton className="h-6 w-64" />

        {/* Grid of Details */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-36" />
            </div>
          ))}
        </div>

        <div className="space-y-6 border-t pt-2">
      {/* Section Title */}
      <Skeleton className="h-6 w-48" />

      {/* Tabs (Photos / Videos) */}
      <div className="flex gap-4">
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="h-5 w-20 rounded-md" />
      </div>

      {/* Image Carousel */}
      <div className="flex gap-4 overflow-hidden border p-4 rounded-xl">
        {[...Array(3)].map((_, i) => (
          <Skeleton
            key={i}
            className="h-[200px] w-[160px] md:h-[240px] md:w-[200px] rounded-xl"
          />
        ))}
      </div>

      {/* Amenities Title */}
      <Skeleton className="h-6 w-32" />

      {/* Amenities Grid */}
      <div className="flex gap-4 overflow-x-auto border p-4 rounded-xl">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-40 rounded-xl" />
        ))}
      </div>
    </div>

    <div className="space-y-8">
      {/* RERA Header */}
      <Skeleton className="h-6 w-72" />

      {/* RERA Section */}
      <div className="flex flex-col md:flex-row justify-between gap-6 bg-muted p-6 rounded-xl border">
        {/* Left Content */}
        <div className="space-y-4 flex-1">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* QR Code Placeholder */}
        <div className="flex flex-col items-center justify-center gap-2">
          <Skeleton className="h-24 w-24 rounded-md" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-52" />
        </div>
      </div>

      {/* Customer Review Header */}
      <Skeleton className="h-6 w-52 " />

      {/* Reviews */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border p-4 space-y-3 bg-background shadow-sm"
          >
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center gap-3 pt-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 my-1" />
                <Skeleton className="h-3 w-20 my-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
      </div>

      {/* Right Section: Contact Builder Form */}
      <div className="w-full lg:w-[300px] border rounded-xl p-4 h-fit space-y-4 sticky top-24">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />

        <Skeleton className="h-5 w-40" />
        <div className="flex gap-2 flex-wrap">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-md" />
          ))}
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-60" />
          <Skeleton className="h-4 w-60" />
        </div>

        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
   </div>
    </>
  );
}