"use client";

import { Button } from "@/ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/ui/card";
import { Input } from "@/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/Store/jwtTokenStore";
import Image from "next/image";
import usePostPropertyform from "@/hooks/Postpropertyhooks/postpropertyform";
import { jwtTokenDecodeAll } from "@/lib/jwtTokenDecodeAll";
import Link from "next/link";
import useDialogStore from "@/Store/useDialogStore ";
import useBuilderform from "@/hooks/BuilderFormHooks/useBuilderstep1";
import useGetProfileDetails from "@/hooks/useGetProfileDetails";

export const HoverCardComponent = () => {
  const { isDialogOpen, openDialog, closeDialog } = useDialogStore();

  return (
    <>
      <Card>
        <CardContent className="bg-white border border-gray-200 shadow-lg rounded-md p-4 flex flex-col items-center">
          <p className="text-gray-800 text-sm mb-3">
            You need to login to post a property.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                openDialog(); // Open the dialog
              }}
            >
              LOGIN
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* {isDialogOpen && (
        <div className="absolute top-0 left-0 w-screen h-screen">
          <div className="flex justify-center items-center h-full rounded-md p-4">
            <div className="z-50 max-w-[450px] flex w-full absolute top-10 bg-white rounded-md p-8 h-fit">
              <MultiStepForm />

              <MdOutlineClose
                className="absolute top-2 right-2"
                onClick={() => closeDialog()}
              />
            </div>

            <div className="fixed inset-0 bg-black/80 z-10"></div>
          </div>
        </div>
      )} */}
    </>
  );
};

const ContactInput = () => {
  const token = useAuthStore((state) => state.token);
  const value = token ? jwtTokenDecodeAll(token) : null;
  console.log(value,'value12')
  return (
    <>
      {token ? (
        <div className="w-full p-1">
          <div className="flex gap-2 w-full">
            <Image
              src="/assets/postproperty/whatsapp1.svg"
              alt="email-image"
              width={15}
              height={15}
            />
            <p className="flex-1 text-black text-sm w-fit">
              {value?.mobile || ""}
            </p>
          </div>
          <div className="flex items-center gap-2  my-3">
            <Image
              src="/assets/postproperty/email.svg"
              alt="email-image"
              width={15}
              height={15}
            />
            <p className="flex-1 text-black text-sm w-fit">
              {value?.email || ""}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
};
interface CompanyInput {
  setCompanyName?: (value: string) => void;
  setWhatsappNumber?: (value: string) => void;
  setEmailId?: (value: string) => void;
  whatsappNumber?: string;
  emailId?: string;
  companyName?: string;
}
const CompanyInput = ({ 
  setCompanyName, 
  setWhatsappNumber, 
  setEmailId,whatsappNumber,emailId,companyName  }: CompanyInput) => {
    
    const token = useAuthStore((state) => state.token);
    const value = token ? jwtTokenDecodeAll(token) : null;
    return(
      <div className="flex flex-col items-center gap-2  justify-center">
        <div className="flex items-center gap-2 w-full border-b border-gray-300 focus-within:border-[#fc6600]">
          <Image
            src="/assets/postproperty/C.svg"
            alt="company-icon"
            width={15}
            height={15}
          />
          <Input
            id="company"
            name="company"
            type="text"
            placeholder="Enter Company Name"
            value={companyName}
            onChange={(e) => {
              if (setCompanyName) {
                setCompanyName(e.target.value); 
              }
            }}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 placeholder-gray-400 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 w-full border-b border-gray-300 focus-within:border-[#fc6600]">
          <Image
            src="/assets/postproperty/whatsapp1.svg"
            alt="email-image"
            width={15}
            height={15}
          />
          <Input
            id="whatapp"
            name="whatapp"
            type="text"
            value={whatsappNumber}
            placeholder="Enter Whatsapp Number"
            onChange={(e) => {
              if (setWhatsappNumber) {
                setWhatsappNumber(e.target.value); 
              }
            }}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 placeholder-gray-400 text-sm"
          />
        </div>
        <div className="flex items-center gap-2 w-full border-b border-gray-300 focus-within:border-[#fc6600]">
          <Image
            src="/assets/postproperty/email.svg"
            alt="email-image"
            width={15}
            height={15}
          />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email id"
            value={emailId}
            onChange={(e) => {
              if (setEmailId) {
                setEmailId(e.target.value); 
              }
            }}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 placeholder-gray-400 text-sm"
          />
        </div>
    
    
      </div>
    );
  }

const TabsContentWrapper = ({
  propertyType,
  options,
  onChange,
}: {
  propertyType: string;
  options: string[];
  onChange: (value: string) => void;
}) => (
  <TabsContent value={propertyType} className="space-y-3">
    <p>Looking to:</p>
    <Tabs defaultValue={options[0]} className="w-full" onValueChange={onChange}>
      <TabsList className="flex gap-3">
        {options.map((option) => (
          <TabsTrigger
            key={option}
            value={option}
            className="border border-gray text-gray-700 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-primary"
          >
            {option}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
    {propertyType === "Builder" && <CompanyInput />}
    {/* <ContactInput /> */}
  </TabsContent>
);

const PostPropertyFormComponent = () => {
  const [userData, setUserData] = useState<any>(null)
  const { profile, loading, error } = useGetProfileDetails();



  console.log(userData,'datadata')
  const { isDialogOpen, openDialog, closeDialog } = useDialogStore();
  const [ownerType, setOwnerType] = useState("Owner");
  const [propertyType, setPropertyType] = useState("Residential");
  const [lookingFor, setLookingFor] = useState("Rent");
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
 console.log(companyName,'comname')
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [emailId, setEmailId] = useState("");
  const { mutate: BuilderMutate } = useBuilderform({
    onSuccess: (data: any) => {
      toast.success(`Start your property listing here.`);
      router.push("/BuilderPostProperty");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });


  const { mutate } = usePostPropertyform({
    onSuccess: (data: any) => {
      toast.success(`Start your property listing here.`);
      router.push("/Post-PropertyformResidential");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });


  
 
console.log(isDialogOpen,'isDialogOpen')
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      openDialog();
      toast.error("You need to login to post a property.");
      return;
    }

    else if (!token || !ownerType || !propertyType || !lookingFor) {
      toast.error("Please select all required fields.");
      return;
    }
    else if (propertyType === "Builder" && !companyName) {
      toast.error("Please enter company name.");
      return;
    }
    else if (propertyType === "Builder" && !whatsappNumber) {
      toast.error("Please enter whatsapp number.");
      return;
    }
    else if (propertyType === "Builder" && !emailId) {
      toast.error("Please enter email address.");
      return;
    }
    // console.log(ownerType);

    if (ownerType === "Builder") {
      BuilderMutate({
        step_id: "1",
        property_rent_buy: "PROJECT",
        user_type: ownerType,
        company_name: companyName,
        phone: whatsappNumber,
        mobile: whatsappNumber,
        email: emailId
      });
    }
    else {
      mutate({
        step_id: "1",
        property_type: propertyType,
        property_rent_buy: lookingFor,
        user_type: ownerType,
      });
    }
  };

  const getLookingOptions = () => {
    if (propertyType === "Commercial") return ["Rent", "Sell"];
    if (propertyType === "Land/Plot") return ["Sell"];
    return ["Rent", "Sell", "PG"];
  };

  const token = useAuthStore((state) => state.token);
  const value = token ? jwtTokenDecodeAll(token) : null;
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked); // Update the state with the checkbox value
  };

  useEffect(() => {
    setUserData(profile?.data)
    setWhatsappNumber(profile?.data?.mobile?.toString() || "")
    setCompanyName(profile?.data?.company_name || "")
    setEmailId(profile?.data?.email || "")
  }, [isDialogOpen,profile?.data])
  return (
    <form onSubmit={handleSubmit}>
      <Tabs
        defaultValue="Owner"
        className="container min-w-[330px] lg:min-w-[400px] bg-transparent rounded-md mt-5"
        onValueChange={(value) => setOwnerType(value)}
      >
        <TabsList className="grid w-3/4 grid-cols-2 p-0 h-auto">
          {["Owner", "Builder"].map((type) => (
            <TabsTrigger
              key={type}
              value={type}
              className="bg-white text-primary data-[state=active]:bg-primary data-[state=active]:text-white p-3 rounded-t-lg rounded-b-none"
            >
              {type}
            </TabsTrigger>
          ))}
        </TabsList>
        {["Owner", "Builder"].map((type) => (
          <TabsContent
            key={type}
            value={type}
            className="overflow-hidden mt-0"
          >
            <Card className="bg-white lg:w-[500px] w-auto lg:h-[400px] border-none  rounded-tl-none rounded-br-lg rounded-tr-lg">
              <CardHeader>
                <p>
                  New to <span className="font-bold">8SQFT</span>? Let&apos;s
                  get you started
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                {type === "Owner" && (
                  <Tabs
                    value={propertyType} // Bind to the state directly
                    className="w-full"
                    onValueChange={(value) => setPropertyType(value)} // Ensure state updates properly
                  >
                    <TabsList className="flex gap-5">
                      {["Residential", "Commercial", "Land/Plot"].map(
                        (propType) => (
                          <TabsTrigger
                            key={propType}
                            value={propType}
                            className="border border-gray p-[10px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-primary"
                          >
                            {propType}
                          </TabsTrigger>
                        )
                      )}
                    </TabsList>

                    {/* Dynamically render the correct TabsContentWrapper based on propertyType */}
                    {["Residential", "Commercial", "Land/Plot"].map((type) => (
                      <TabsContent
                        key={type}
                        value={type} // Ensure this matches the current tab value
                      >
                        <TabsContentWrapper
                          propertyType={type}
                          options={getLookingOptions()}
                          onChange={setLookingFor}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
                {type === "Builder" && (
                  <>
                    <CompanyInput setCompanyName={setCompanyName} setWhatsappNumber={setWhatsappNumber}
                    setEmailId={setEmailId}
                    whatsappNumber={whatsappNumber}
                    emailId={emailId}
                    companyName={companyName}
                    />
                    {/* <ContactInput /> */}
                  </>
                )}
                <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <p className="text-[10px] ml-3">
                    I accepts the
                    <Link href="/TermsandCondition" className="text-blue">
                      Terms & Conditions
                    </Link>
                  </p>
                </div>
              </CardContent>
        
                
  

              <CardFooter>
           
                  <Button
                    variant="default"
                    className={                    
                        (  isChecked && ownerType === "Builder" && companyName?.trim() && emailId?.trim()  && whatsappNumber?.trim())
                        ? "w-full text-white bg-primary"
                        : "bg-primary-light w-full"
                    }
                    type="submit"
                    disabled={                     
                      !isChecked || (ownerType === "Builder" && (!companyName?.trim() || !emailId?.trim() || !whatsappNumber?.trim()))
                    }
                  >
                    Proceed
                  </Button>
         
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </form>
  );
};

export default PostPropertyFormComponent;
