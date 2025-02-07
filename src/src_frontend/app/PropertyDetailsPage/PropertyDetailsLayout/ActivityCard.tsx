// components/ActivityCard.tsx

interface ActivityItem {
  label: string;
  icon: string;
  count: number;
}

const activityData: ActivityItem[] = [
  {
    label: "Unique Views",
    icon: "/assets/property-list-asset/property-detail-asset/UniqueViews.svg",
    count: 0,
  },
  {
    label: "Shortlists",
    icon: "/assets/property-list-asset/property-detail-asset/Shortlists.svg",
    count: 0,
  },
  {
    label: "Contacted",
    icon: "/assets/property-list-asset/property-detail-asset/Contacted.svg",
    count: 0,
  },
];

const ActivityCard: React.FC = () => {
  return (
    <div className="p-4  rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Activity On This Property</h2>
      <div className="flex  gap-4 ">
        {activityData.map((activity, index) => (
          <div key={index} className='bg-[#FFF0E5] p-3 rounded-md w-full'>
            <div
              
              className="flex items-center gap-4 "
            >
              <img
                src={activity.icon}
                alt={activity.label}
                className="w-6 h-6 object-contain self-start flex"
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
};

export default ActivityCard;
