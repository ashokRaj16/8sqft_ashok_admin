import { Card } from "@/ui/card";
import { useEffect, useRef, useState } from "react";

interface ConstructionStatusProps {
  themeColors: {
    themeColorDark: string;
    [key: string]: any;
  };
  builderResponseData: any;
}
export default function ConstructionStatus({
  themeColors,
  builderResponseData
}: ConstructionStatusProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* <div className="my-4" style={{ color: themeColors.themeColorDark }}>
        <h3 className="font-semibold my-2  text-lg">Construction Status</h3>
        <div className=" flex flex-col lg:flex-row gap-4">
          {builderResponseData?.constructionPhases.map((item: any, index: number) => (
            <Card key={index} className="lg:w-52 p-4 text-white rounded-lg shadow-lg relative overflow-hidden bg-[url('/assets/BuilderShowcase/construction_bg.png')] backdrop-blur-lg bg-cover bg-center" style={{ backgroundImage: `url(${item.ref_image_url})` }}>
              <div className="absolute inset-0 opacity-80" style={{ backgroundColor: themeColors.themeColorDark }}></div>
              <div className="relative z-10 flex lg:flex-col flex-row items-center justify-evenly text-center">
                <div className="flex flex-col">
                  <h2 className=" font-semibold">{item.phase_name}</h2>
                  <p className="text-xs text-white/70"> {item.completion_status == 0 ? 'Possession :' : 'Completed on '} {item.posession_date}</p>
                </div>
                <div className="mt-4 relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-24 h-24" viewBox="0 0 100 100">
                    <circle
                      className="text-gray"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className="text-white"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset={(1 - item.completion_percentage / 100) * 251.2}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="absolute font-medium">{item.completion_percentage}%</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div> */}
      <div ref={sectionRef} className="my-4" style={{ color: themeColors.themeColorDark }}>
      <h3 className="font-semibold my-2 text-lg">Construction Status</h3>
      <div className="flex flex-col lg:flex-row gap-4">
        {builderResponseData?.constructionPhases.map((item: any, index: number) => {
          const circumference = 2 * Math.PI * 40;
          const progress = item.completion_percentage;

          return (
            <Card
            key={index}
            className="lg:w-52 p-4 text-white rounded-lg shadow-lg relative overflow-hidden bg-[url('/assets/BuilderShowcase/construction_bg.png')] backdrop-blur-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${item.ref_image_url})` }}
          >
            <div className="absolute inset-0 opacity-80" style={{ backgroundColor: themeColors.themeColorDark }}></div>
            <div className="relative z-10 flex lg:flex-col flex-row items-center justify-evenly text-center">
              <div className="flex flex-col">
                <h2 className="font-semibold">{item.phase_name}</h2>
                <p className="text-xs text-white/70">
                  {item.completion_status == 0 ? 'Possession :' : 'Completed on '}
                  {item.posession_date}
                </p>
              </div>
              <div className="mt-4 relative w-24 h-24 flex items-center justify-center">
                <svg className="w-24 h-24" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-300"
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-white progress-ring"
                    strokeWidth="9"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    style={{
                      strokeDashoffset: circumference,
                      animation: isVisible ? `progress-${index} 1.5s ease-out forwards` : "none"
                    }}
                    transform="rotate(-90 50 50)"
                  />
                  <style>{`
                    @keyframes progress-${index} {
                      from {
                        stroke-dashoffset: ${circumference};
                      }
                      to {
                        stroke-dashoffset: ${circumference - (progress / 100) * circumference};
                      }
                    }
                  `}</style>
                </svg>
                <span className="absolute font-medium text-sm">{progress}%</span>
              </div>
            </div>
          </Card>
          );
        })}
      </div>
    </div>
    </>
  );
}
