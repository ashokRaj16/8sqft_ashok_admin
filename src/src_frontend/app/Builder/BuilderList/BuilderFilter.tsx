import { Card, CardContent } from "@/ui/card";
import { Slider } from "@/ui/slider";
import { RotateCcw } from "lucide-react";
import React, { useState } from "react";

export default function Frame() {
  // Data for road width options
  const roadWidthOptions = [
    { value: "10-20", label: "+ 10-20 ft" },
    { value: "20-50", label: "+ 20-50 ft" },
    { value: "50+", label: "+ 50+ ft" },
  ];

  // Data for ownership options
  const ownershipOptions = [
    { id: "freehold", label: "Freehold" },
    { id: "cooperative", label: "Co-operative Society" },
    { id: "leasehold", label: "Leasehold" },
  ];

  // Data for amenities options
  const amenitiesOptions = [
    { id: "concert-road", label: "Concert Road" },
    { id: "electricity", label: "Electricity" },
    { id: "park", label: "Park" },
    { id: "security", label: "Security" },
    { id: "boundary-wall", label: "Boundary Wall" },
  ];
  const [selectedRoadWidths, setSelectedRoadWidths] = useState<string[]>([]);

  const handleRoadWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSelectedRoadWidths(prevState =>
          prevState.includes(value)
              ? prevState.filter(item => item !== value)
              : [...prevState, value]
      );
  };
  return (
    <Card className="w-[309px] border-r border-b border-l border-[#22222233]">
      <div className="h-[42px] border-t border-[#22222233]">
        <div className="h-9 flex items-center justify-between px-5 py-2 border-b border-[#fc6600] shadow-[0px_2px_2px_#00000033]">
          <span className="font-medium text-[#fc6600] text-xs">Filters</span>
          <button className="inline-flex items-center gap-1">
            <span className="font-medium text-[#222222] text-xs">Reset</span>
            <RotateCcw className="w-[10.66px] h-[10.66px]" />
          </button>
        </div>
      </div>

      <CardContent className="p-2">
        <div className="flex-col w-[293px] items-start gap-3 flex">
          {/* Price Range Section */}
          <div className="w-full">
            <div className="p-2">
              <h3 className="font-semibold text-[#222222cc] text-base">
                Price Range : â‚¹ 0 to â‚¹ 5 Cr
              </h3>
            </div>
            <div className="px-2">
              <Slider defaultValue={[0, 100]} max={100} step={1} />
            </div>
          </div>

          {/* Plot Area Section */}
          <div className="w-full">
            <div className="p-2">
              <h3 className="font-semibold text-[#222222cc] text-base">
                Plot area(sq. ft.) : 0 to 1,00,000 sqft
              </h3>
            </div>
            <div className="px-2">
              <Slider defaultValue={[0, 100]} max={100} step={1} />
            </div>
          </div>

          {/* Road Width Section */}
          <div className="w-full">
            <div className="p-2">
              <h3 className="font-semibold text-[#222222cc] text-base">
                Width of Facing Road
              </h3>
            </div>
            <div className="space-y-1 px-2">
              {roadWidthOptions.map((option) => (
                <div key={option.value} className="flex items-center gap-2 p-2">
                  <input
                    type="checkbox"
                    value={option.value}
                    onChange={handleRoadWidthChange}
                    checked={selectedRoadWidths.includes(option.value)}
                    className="w-4 h-4 border-[#22222280]"
                  />
                  <label
                    htmlFor={option.value}
                    className="font-medium text-[#222222cc] text-sm"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {/* Ownership Section */}
          <div className="w-full">
            <div className="p-2">
              <h3 className="font-semibold text-[#222222cc] text-base">
                Ownership
              </h3>
            </div>
            <div className="space-y-1">
              {ownershipOptions.map((option) => (
                <div key={option.id} className="flex items-center gap-2 p-2">
                  <input
                    type="checkbox"
                    id={option.id}
                    className="w-4 h-4 border-[#22222280]"
                  />
                  <label
                    htmlFor={option.id}
                    className="font-medium text-[#222222cc] text-sm"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities Section */}
          <div className="w-full">
            <div className="p-2">
              <h3 className="font-semibold text-[#222222cc] text-base">
                Amenities
              </h3>
            </div>
            <div className="space-y-1">
              {amenitiesOptions.map((option) => (
                <div key={option.id} className="flex items-center gap-2 p-2">
                  <input
                    type="checkbox"
                    id={option.id}
                    className="w-4 h-4 border-[#22222280]"
                  />
                  <label
                    htmlFor={option.id}
                    className="font-medium text-[#222222cc] text-sm"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
