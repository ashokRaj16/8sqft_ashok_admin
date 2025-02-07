// components/ActivityCard.tsx
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
  viewCount?:number;
}
export default function ActivityCard({ title ,shortlistedCount,intrestedCount,viewCount}: ActivityCard) {
  const activityData: ActivityItem[] = [
    {
      label: "Views",
      icon: "/assets/ActivityCard/UniqueViews.svg",
      count: viewCount || 0,
    },
    {
      label: "Shortlisted",
      icon: "/assets/ActivityCard/Contacted.svg",
      count: shortlistedCount || 0,
    },
    {
      label: "Contacted",
      icon: "/assets/ActivityCard/Shortlisted.svg",
      count: intrestedCount || 0,
    },
    {
      label: "Engagement",
      icon: "/assets/ActivityCard/Engagement.svg",
      count: 0,
    },
  ];
  return (
    <div className="p-0 rounded-lg my-3 w-full mx-w-md">
      <h2 className="text-lg font-semibold mb-1">
        Activity On This  {title || "Property"}
      </h2>
      <div className="flex  gap-1  items-start">
        {activityData.map((activity, index) => (
          <div key={index} className="bg-[#FFF0E5] p-2 rounded-md ml-1">
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
                <span className="text-sm font-bold ">{activity.count}</span>
              </div>
            </div>
            <span className="text-[10px] font-medium">{activity.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
