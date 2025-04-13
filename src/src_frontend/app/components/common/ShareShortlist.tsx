import axios from '@/hooks';
import { useAuthStore } from '@/Store/jwtTokenStore';
import useDialogStore from '@/Store/useDialogStore ';
import { Button } from '@/ui/Button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/dialog';
import { Heart, Share2, X } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface ShareShortlistProps {
    btnHeight?:string;
    btnWidth?:string;
    btnPadding?:string;
    background?: string;
    shadow?: string;
    rounded?: string;
    fontSize?: string;
    textTransform?: string;
    fontWeight?: string;
    hoverBackground?: string;
    hoverTextColor?: string;
    iconColor?: string;
    iconHoverColor?: string;
    propertyId?: any;
    propertyIdSlug?: any;
    btnSaveText?: string;
    showBtnText?: boolean;
    tooltip?: string;
    tooltipArrow?: string;
}

const ShareShortlist: React.FC<ShareShortlistProps> = ({
    btnHeight="h-auto",
    btnWidth="w-auto",
    btnPadding="w-auto",
    background = "bg-white",
    shadow = "shadow-lg",
    rounded = "rounded-lg",
    fontSize = "text-xs",
    textTransform = "uppercase",
    fontWeight = "font-light",
    hoverBackground = "hover:bg-primary",
    hoverTextColor = "hover:text-white",
    iconColor = "text-primary",
    iconHoverColor = "group-hover:text-white",
    btnSaveText = "Save",
    showBtnText = true,
    tooltip = "absolute lg:top-12 top-10 -translate-x-1/2 left-1/2",
    tooltipArrow = "absolute top-0 left-[50%] transform -translate-x-1/2 -translate-y-full border-8 border-transparent border-b-black",
    propertyId,
    propertyIdSlug,
}) => {
    const token = useAuthStore((state) => state.token);
      const params = useParams();
    const { isDialogOpen, openDialog, closeDialog } = useDialogStore();
    const currentPath = "https://8sqft.com/Builder/" + propertyIdSlug;
    const [isVisible, setIsVisible] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleButtonClick = async () => {
        setLoading(true);
        const extractId = (propertyId: any) => {
            if (!propertyId || typeof propertyId !== "string") return null; // Ensure it's a string
            const match = propertyId.match(/-(\d+)$/);
            return match ? match[1] : null;
        };
        const id = extractId(propertyId);
        console.log(id, 'propertyId123')

        try {
            const response = await axios.post("/api/v1/front/shortlist",
                { propertyId: propertyId },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": "A8SQFT7767",
                        Authorization: `Bearer ${token}`,

                    }
                }
            );

            if (response.data.status) {
                // Simulating an API call
                setTimeout(() => {
                    setLoading(false);
                    setShowPopup(true); // Show popup

                    // Hide message after 3 seconds
                    setTimeout(() => setShowPopup(false), 3000);
                }, 1000); // Simulating delay

            } else {
                console.log(response.data.message || "Something went wrong");
            }
        } catch (err) {
            console.log("Failed to add property to wishlist. Please try again.");
        } finally {
            setLoading(false);
        }
    };




    const handleCopy = () => {
        navigator.clipboard.writeText(currentPath);
        alert("Link copied to clipboard!");
    };

    const handleShortListClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (token) {

            handleButtonClick();
        } else {
            openDialog();
        }
    }
    useEffect(() => {
        if (isVisible) {
            // Ensure script is loaded
            const scriptId = "sharethis-script";
            if (!document.getElementById(scriptId)) {
                const script = document.createElement("script");
                script.id = scriptId;
                script.src =
                    "https://platform-api.sharethis.com/js/sharethis.js#property=679778caeec4bb0012d85a05&product=inline-share-buttons";
                script.async = true;
                document.body.appendChild(script);

                script.onload = () => {
                    if (window.__sharethis__) {
                        window.__sharethis__.initialize();
                    }
                };
            } else {
                // Reinitialize ShareThis buttons on every open
                setTimeout(() => {
                    if (window.__sharethis__) {
                        window.__sharethis__.initialize();
                    }
                }, 500);
            }
        }
    }, [isVisible]);

    return (
        <>
            <div className="flex gap-2">

                <Dialog>
                    <DialogTrigger asChild>
                        <Button onClick={(e) => { e.stopPropagation(), setIsVisible(true); }} className={`group ${background} ${shadow} ${rounded} ${fontSize} ${textTransform} ${fontWeight} ${hoverBackground} ${hoverTextColor} ${btnHeight} ${btnWidth} ${btnPadding}`}>
                            <Share2 className={`h-5 w-5 ${iconColor} ${iconHoverColor}`} />
                            {showBtnText && (<span>Share</span>)}
                        </Button>

                    </DialogTrigger>
                    <DialogContent onClick={(e) => e.stopPropagation()} className="sm:max-w-[425px] bg-black max-w-sm p-6 rounded-lg shadow-lg left-1/2 right-1/2 -translate-y-1/2 -translate-x-1/2">
                        <DialogClose asChild>
                            <button className="absolute top-4 right-4 text-white hover:text-red-700 z-10">
                                <X className="h-6 w-6" />
                            </button>
                        </DialogClose>
                        <DialogHeader>
                            <DialogTitle className='text-white'>Share</DialogTitle>
                            {/* <DialogDescription>
                        <div className=" sharethis-inline-share-buttons gap-1" style={{ marginLeft: "8px", gap: "6px" }}></div>
                        </DialogDescription> */}
                        </DialogHeader>
                        <div className="grid gap-4 ">

                            <div className="relative ">

                                <div className="">
                                    <div className="bg-black  w-full max-w-sm rounded-lg shadow-lg">


                                        <div className=" sharethis-inline-share-buttons gap-1 mb-2" style={{ marginLeft: "8px", gap: "6px" }}></div>


                                        <div className="mb-4">
                                            <div className="flex items-center space-x-2 p-4  rounded-full  border-[1px] border-gray" >
                                                <input
                                                    type="currentPath"
                                                    value={currentPath}
                                                    readOnly
                                                    className="p-2 w-full  rounded-md  "
                                                />
                                                <button
                                                    onClick={handleCopy}
                                                    className="bg-blue text-white px-4 py-2 rounded-full  border-white"
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>

                        </div>
                        {/* <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter> */}
                    </DialogContent>
                </Dialog>


                <div className="relative">
                    <Button onClick={(e) => { e.stopPropagation(), handleShortListClick(e) }} className={`group ${background} ${shadow} ${rounded} ${fontSize} ${textTransform} ${fontWeight} ${hoverBackground} ${hoverTextColor} ${btnHeight} ${btnWidth} ${btnPadding}`}>
                        <Heart className={`h-5 w-5 ${iconColor} ${iconHoverColor}`} /> {showBtnText && (btnSaveText)}
                    </Button>
                    {showPopup && (
                        <div className={`${tooltip}`}>
                            <div className="bg-[#222222] lg:min-w-max p-1 shadow-lg rounded-2xl">
                                <p className="text-[10px] text-center text-white whitespace-nowrap">
                                    Property Shortlisted
                                </p>
                                <div className={`${tooltipArrow}`}></div>
                            </div>
                        </div>
                    )}
                </div>

            </div>






        </>
    );
};

export default ShareShortlist;
