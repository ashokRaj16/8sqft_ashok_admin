// components/ActivityCard.tsx
import { formatNumber } from "@/utils/priceFormatter";
import Image from "next/image";
interface ActivityItem {
  label: string;
  icon: string;
  count: number;
}

interface ActivityCard {
  title?: string;
  shortlistedCount?: number;
  intrestedCount?: number;
  viewCount?: number;
}
export default function ActivityCard({ title, shortlistedCount, intrestedCount, viewCount }: ActivityCard) {
  const engagement = viewCount ? viewCount > 0 ? Math.floor(viewCount / 2) : 0 : 0;
  const isViewCount=viewCount? viewCount>0 :0
  const activityData: ActivityItem[] = [
    {
      label: "Views",
      icon: "/assets/ActivityCard/Engagement.svg",
      count: viewCount || 0,
    },
    {
      label: "Shortlisted",
      icon: "/assets/ActivityCard/UniqueViews.svg",
      count: shortlistedCount || 0,
    },
    {
      label: "Contacted",
      icon: "/assets/ActivityCard/Shortlisted.svg",
      count: intrestedCount || 0,
    },
    {
      label: "Engaged",
      icon: "/assets/ActivityCard/Contacted.svg",
      count: isViewCount? engagement+1 : 0,
    },
  ];
  return (
    <div className="pb-2 lg:pt-1 lg:my-3 w-full mx-w-md shadow-custom lg:shadow-none lg:border-b border-dashed bg-white px-2 lg:px-0">
      <h2 className="font-semibold lg:text-base text-sm text-primary-black py-2">
        {/* Activity On This  {title || "Property"} */}
        Milestone Map
      </h2>
      <div className="flex  gap-1 justify-between  items-start">
        {activityData.map((activity, index) => (
          <div key={index} className="bg-[#FFF0E5] p-2 rounded-md w-full">
            <div className="flex items-center gap-1 ">
              {/* <img
                src={activity.icon}
                alt={activity.label}
                className="w-6 h-6 object-contain self-start flex"
              /> */}
              <Image
                src={activity.icon}
                alt={activity.label}
                width={15}
                height={15}
                className="w-4 h-4"
              />
              <div className="flex flex-col self-start">
                <span className="text-sm font-bold">{formatNumber(activity.count)}</span>
              </div>
            </div>
            <span className="text-[10px] font-medium text-[#22222280]">{activity.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
