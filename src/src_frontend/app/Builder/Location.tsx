import { Button } from "@/ui/Button";
import { Card, CardContent } from "@/ui/card";
import { MapPinIcon } from "lucide-react";
import React from "react";

const locationData = {
  label: "Property Location",
  address: "Sr. no. 18/2 Gatha Mandir, Gandhar Vihar road, Dehu gaon, Pune",
};

export default function PropertyLocation() {
  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex flex-col gap-1 px-[180px] py-5">
        <div className="flex items-center gap-5 pl-5">
          <div className="flex flex-col items-center w-[37px]">
            <MapPinIcon className="w-5 h-[26px] text-[#fc6600]" />
            <div className="w-full h-[9px] -mt-1 bg-[#fc660033] rounded-[18.5px/4.5px]" />
          </div>

          <div className="flex flex-col gap-0.5 w-[382px]">
            <span className="font-light text-[#808080] text-sm leading-[26px]">
              {locationData.label}
            </span>
            <span className="font-normal text-[#222222] text-xs leading-6">
              {locationData.address}
            </span>
          </div>
        </div>

        <div className="flex justify-start w-full">
          <Button
            variant="link"
            className="h-10 p-1 text-[#fc6600] text-sm leading-[26px] hover:no-underline"
          >
            View more on Maps
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
