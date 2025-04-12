'use client';

import { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Card, CardContent, CardHeader } from '@/ui/card';
import Image from 'next/image';
import { hexToRgba } from '@/utils/hexToRGB';
import { formatNumber } from '@/utils/priceFormatter';
import useDialogStore from '@/Store/useDialogStore ';
import { useAuthStore } from '@/Store/jwtTokenStore';
import useShareContactDetail from '@/hooks/Postpropertyhooks/useShareContact';
import useShareWhatsappDetail from '@/hooks/Postpropertyhooks/useShareWhatsappDetail';


interface FloorPlansProps {
  themeColors: {
    themeColorDark: string;
    [key: string]: any;
  };
  builderResponseData: any; 
  propertyId: any;
}

export default function FloorPlans({
  themeColors,
  builderResponseData,
  propertyId

}: FloorPlansProps) {
  const propertyData=builderResponseData?.property;
  const configurationData=builderResponseData?.configuration;

  const groupedApartments = useMemo(() => {
    return configurationData.reduce((acc: any, apt: any) => {
      const key =
      propertyData.property_type === "RESIDENTIAL"
          ? apt.unit_name
          : apt.carpet_area;
  
      if (!acc[key]) {
        acc[key] = [];
      }
  
      acc[key].push(apt);
      return acc;
    }, {} as Record<string, typeof configurationData>);
  }, [configurationData]);
  

  const unitTypes = Object.keys(groupedApartments);
  const [selectedTab, setSelectedTab] = useState(unitTypes[0]);




  // contact builder 
    const [dialogOpen, setDialogOpen] = useState(false);
    const { isDialogOpen, openDialog, closeDialog } = useDialogStore();
      const token = useAuthStore((state) => state.token);
   const handleOwnerContactClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (token) {
    
          handleClick();
        } else {
          openDialog();
        }
      }
    
      const handleClick = () => {
        if (propertyId !== null) {
          shareContact({ propertyId: propertyId });
          shareWhatsapp({ propertyId: propertyId });
        }
        setDialogOpen(true);
      };
      const { mutate: shareContact } = useShareContactDetail({
        onSuccess: (data) => {
          console.log("Successfully sent contact details", data);
        },
        onError: (error) => {
          console.log("Error in sending contact details", error);
        },
      });
    
      const { mutate: shareWhatsapp } = useShareWhatsappDetail({
        onSuccess: (data) => {
          console.log("Successfully sent contact details", data);
        },
        onError: (error) => {
          console.log("Error in sending contact details", error);
        },
      });
  return (
    <div className="my-4" style={{color: themeColors.themeColorDark}}>
      <h3 className="font-semibold my-2 text-lg">{propertyData.property_type === "RESIDENTIAL"? 'Floor':'Plot'} Plans</h3>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-4">
        <TabsList className="gap-4 overflow-x-auto justify-start w-full h-10 overflow-y-hidden">
          {unitTypes.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className={`${selectedTab === tab ? ' text-white' : ''} rounded-full py-2 border`}
              style={{
                backgroundColor: selectedTab === tab ?  themeColors.themeColorDark : '',
                borderColor:  themeColors.themeColorDark,
              }}
            >
              {tab} {propertyData.property_type === "RESIDENTIAL"?'Apartment' :'sqft Residential'}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedTab}>
          <p className="opacity-80 mb-4">
            {groupedApartments[selectedTab].length} {propertyData.property_type === "RESIDENTIAL"? 'Floor':'Plot'} Plans Available
          </p>
          <div className="flex gap-4 overflow-x-auto">
            {groupedApartments[selectedTab].map((item:any) => (
              <Card
                key={item.id}
                className="border rounded-lg p-0 overflow-hidden min-w-72"
                style={{ borderColor: themeColors.themeColorDark }}
              >
                <CardHeader className="items-center p-0 bg-[#f3f5f4]">
                  <Image
                    src={item.unit_img_url}
                    alt={item.unit_name+'image'}
                    width={200}
                    height={200}
                    className=" w-full h-52"
                  />
                </CardHeader>
                <CardContent className="px-2 py-2 flex flex-col items-center">
                  <p className="font-semibold "> ₹ {formatNumber(item.carpet_price)}</p>
                  <p className="text-sm opacity-80">{propertyData.property_current_status}</p>
                  <p className="text-sm opacity-80">{item.carpet_area} sqft</p>
                  <button
                   onClick={handleOwnerContactClick}
                    className="mt-2 w-full p-1 border rounded-md opacity-80 hover:bg-gray hover:text-white"
                    style={{ borderColor: themeColors.themeColorDark }}
                  >
                    Request Call
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="relative  ">
            {dialogOpen && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex justify-center items-center z-50">
                <div className="bg-white p-5 border border-gray-300 rounded-md shadow-md max-w-sm w-full">
                  <h1 className="font-bold">Contact Details Sent</h1>
                  <p className="text-sm">
                    We have successfully sent the owner contact details on your
                    WhatsApp and Email. Feel free to contact the owner directly.
                  </p>
                  <div className="w-full ">
                    <button
                      className="bg-primary text-white px-4 py-2 rounded-md my-3 self-center w-full"
                      onClick={() => setDialogOpen(false)} // Close the dialog
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
    </div>
  );
}
