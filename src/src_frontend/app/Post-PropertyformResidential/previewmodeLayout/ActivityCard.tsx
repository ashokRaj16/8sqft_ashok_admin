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
      label: "Engagement",
      icon: "/assets/ActivityCard/Contacted.svg",
      count: isViewCount? engagement+1 : 0,
    },
  ];
  return (
    <div className="pb-2  my-3 w-full mx-w-md  border-b border-dashed">
      <h2 className="text-lg font-semibold mb-1 text-[#222222CC]">
        Activity On This  {title || "Property"}
      </h2>
      <div className="flex  gap-1 justify-between  items-start">
        {activityData.map((activity, index) => (
          <div key={index} className="bg-[#FFF0E5] p-2 rounded-md ml-1 w-full">
            <div className="flex items-center gap-2 ">
              {/* <img
                src={activity.icon}
                alt={activity.label}
                className="w-6 h-6 object-contain self-start flex"
              /> */}
              <Image
                src={activity.icon}
                alt={activity.label}
                width={20}
                height={20}
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
