import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import useUpdateProfile from "@/hooks/MyProfile/useUpdateProfile"
import { useSendOtpWhatsapp, useVerifyOtpWhatsapp } from "@/hooks/MyProfile/useSendOtpWhatsapp";
import { useEmailOtp, useVerifyOtpMail } from "@/hooks/MyProfile/useEmailOtp"
interface ProfileFields {

    id: number;
    profile_picture_url: string | null;
    is_company_verified: string;
    password_hash: string | null;
    auth_provider: string | null;
    oauth_token: string | null;
    latitude: number | null;
    longitude: number | null;
    plan_id: number | null;
    role_id: number;
    state_id: number | null;
    city_id: number | null;
    pincode: number | null;
    contact_2: string | null;
    address_1: string | null;
    status: string;
    is_verified: string;
    ip_address: string | null;
    hostname: string | null;
    user_agent: string | null;
    is_deleted: string;
    created_at: string;
    updated_at: string;
    isBuilder: any;
    isowner: any;
    instagram_url: boolean;
    youtube_url: boolean;
    facebook_url: boolean;
    company_name: boolean;
    aadhar: string;
    fname: string;
    email: string;
    mobile: string;
    whatsapp_notification: string;
    is_mobile_verified: string;
    is_email_verified: string;

}
interface EditableFields {
    company_name: boolean;
    instagram_url: boolean;
    facebook_url: boolean;
    youtube_url: boolean;
}
interface BasicProfileProps {
    setActiveSection: (section: string) => void;
    profileData: any;

}
const BasicProfileComponent: React.FC<BasicProfileProps> = ({ setActiveSection,
    profileData
}) => {

    const [whatsappEnabled, setWhatsappEnabled] = useState<boolean>();
    const [aadharVerified, setAadharVerified] = useState<boolean>(false);
    const [mobileVerified, setMobileVerified] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState<string>("");
    const { sendOtp, loading: sendingOtp } = useSendOtpWhatsapp();
    const { verifyOtp, loading: verifyingOtp } = useVerifyOtpWhatsapp();
    const [isOtpValid, setIsOtpValid] = useState(false);


    const [emailVerified, setEmailVerified] = useState(false);
    const [isEmailOtpValid, setIsEmailOtpValid] = useState(false);

    const { sendOtpMail, loading: sendLoading, error: sendError, otpSentEmail } = useEmailOtp();
    const { verifyOtpMail, loading: verifyLoading, error: verifyError } = useVerifyOtpMail();
    const [emailOtp, setEmailOtp] = useState("");
    const [showSuccessTooltip, setShowSuccessTooltip] = useState(false);

    const [isEdited, setIsEdited] = useState<boolean>(false);
    const [isChanged, setIsChanged] = useState(false);
    const [originalFields, setOriginalFields] = useState(profileData || {});
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const updateProfile = useUpdateProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [isChange, setIsChange] = useState(false);
    const [fields, setFields] = useState<ProfileFields>(
        profileData || {
            aadhar: "",
            fname: "",
            email: "",
            mobile: "",
            company_name: false,
            instagram_url
                : false,
            facebook_url: false,
            youtube_url: false,
            id: 0,
            profile_picture_url: "",
            is_company_verified: "",
            status: "",
            whatsapp_notification: "",


        }
    );

    useEffect(() => {
        setMobileVerified(profileData.is_mobile_verified === "1");
        setEmailVerified(profileData.is_email_verified === "1");
    }, [profileData]);


    const handleSendOtp = async () => {
        const response = await sendOtp(profileData.mobile);
        if (response?.status) {
            setOtpSent(true);
        }
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setOtp(value);
        setIsOtpValid(value.length === 6);
    };

    const handleVerifyOtp = async () => {
        if (!isOtpValid) return;

        const response = await verifyOtp(profileData.mobile, Number(otp));
        if (response?.status) {
            setMobileVerified(true);
            setOtpSent(false);
            setOtp("");
            setIsOtpValid(false);
            alert("Mobile number verified successfully!");
        } else {
            alert("Invalid OTP. Try again.");
        }
    };


    // Send Email OTP
    const handleSendEmailOtp = async () => {
        const response = await sendOtpMail(fields.email);
        if (response?.status) {
            setShowSuccessTooltip(false);
        }
    };

    // Verify Email OTP
    const handleVerifyEmailOtp = async () => {
        if (!emailOtp) return;
        const response = await verifyOtpMail(profileData.email, Number(emailOtp));
        if (response?.status) {
            setEmailVerified(true);
            setShowSuccessTooltip(true);

            // Hide success tooltip after 3 seconds
            setTimeout(() => setShowSuccessTooltip(false), 3000);
        }
    };

    const handleEmailOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmailOtp(value);
        setIsEmailOtpValid(value.length === 6); // ✅ Enable Verify button only for 6-digit OTP
    };





    useEffect(() => {
        if (profileData) {
            setFields(profileData);
            // profileData?.whatsapp_notification
        }
        if (profileData?.whatsapp_notification === "1") {
            setWhatsappEnabled(true)
        }
    }, [profileData]);

    useEffect(() => {
        if (profileData) {
            setEmailVerified(profileData.is_email_verified === "1");
            setMobileVerified(profileData.is_mobile_verified === "1");
        }
    }, [profileData]);
    console.log("mobile verify", profileData.is_email_verified);



    const [editable, setEditable] = useState<EditableFields>({
        company_name: false,
        instagram_url: false,
        facebook_url: false,
        youtube_url: false
    });

    const labelMapping: { [key in keyof EditableFields]: string } = {
        company_name: "Company",
        instagram_url: "Instagram",
        facebook_url: "Facebook",
        youtube_url: "YouTube",
    };



    const handleToggleEdit = () => {
        setIsEditing(true);
        setEditable({
            company_name: true,
            instagram_url: true,
            facebook_url: true,
            youtube_url: true,
        });
    };


    const handleUpdate = async () => {
        if (JSON.stringify(fields) === JSON.stringify(originalFields)) {
            // ✅ If no changes, show message and reset button
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                setIsEditing(false);
            }, 2000);
            return;
        }

        try {
            await updateProfile.mutateAsync(fields);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                setIsEditing(false);
                setIsChanged(false); // Reset isChanged after successful update
                setOriginalFields(fields); // Update original fields after saving
            }, 2000);
        } catch (error) {
            // console.error("Profile update failed", error);
        }
    };
    useEffect(() => {
        if (profileData) {
            setFields(profileData);
            setOriginalFields(profileData); // Update original fields when new profileData comes in
        }
    }, [profileData]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFields(prev => ({ ...prev, [id]: value }));

        // Compare with original data to check if any changes are made
        if (originalFields[id] !== value) {
            setIsChanged(true);
        } else {
            setIsChanged(false);
        }
    };




    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile.mutateAsync(fields);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 2000);
            setIsEdited(false);
        } catch (error) {
            // console.error("Profile update failed", error);
        }
    };


    const handleWhatsAppToggle = async () => {
        const newStatus = whatsappEnabled ? "0" : "1"; // Toggle between "0" and "1"

        // ✅ Update both UI and tracking state
        setWhatsappEnabled(!whatsappEnabled);
        setFields(prev => ({ ...prev, whatsapp_notification: newStatus }));

        // ✅ Mark the form as changed for "Update" button to be enabled
        if (originalFields.whatsapp_notification !== newStatus) {
            setIsChanged(true);
        } else {
            setIsChanged(false);
        }
    };





    // const isBuilderOrOwner = userType?.some((type) => type === "BUILDER" || type === "OWNER");
    const isBuilderOrOwner = profileData?.isBuilder || profileData?.isowner;

    return (
        <div className=" relative">
            {isMobile ? (
                // ✅ MOBILE VIEW
                <div className="px-4 py-2 ">
                    <div className="flex flex-row border-b pb-2 mb-2  gap-4 w-full">
                        <button
                            onClick={() => setActiveSection("Dashboard")} // ✅ Correct navigation
                            className="text-xl "
                        >
                            {"<"}
                        </button>
                        <div className="flex flex-row justify-between gap-12 items-start   w-full">
                            <h1 className="text-lg text-[#222222] font-medium align-middle mx-auto pb-2">Edit Your Profile</h1>
                            {/* <button type="button" onClick={handleToggleEdit} className=" items-center  ">
                                <Image
                                    src={isEditing ? "/assets/my-profile/cross.svg" : "/assets/my-profile/editable.svg"}
                                    alt="Edit"
                                    width={20}
                                    height={20}
                                />
                            </button> */}
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>

                        {/* Aadhar Card Field */}
                        <div className="flex flex-col gap-2">
                            {/* <label className="text-sm font-medium">Aadhar Card:</label> */}
                            <div className="flex items-center w-full gap-4">
                                {/* <input
                                    type="text"
                                    id="aadhar"
                                    value={fields.aadhar}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md px-4 py-2 text-sm w-[90%]"
                                /> */}

                                <div className="relative group inline-block">
                                    {/* <button className="" type="button" onClick={() => setAadharVerified(!aadharVerified)}>
                                        <Image
                                            src={aadharVerified ? "/assets/my-profile/verified.svg" : "/assets/my-profile/notVerified.svg"}
                                            alt="Verification Status"
                                            width={20}
                                            height={20}
                                        />
                                    </button> */}
                                    {/* Tooltip */}
                                    {/* <span className="absolute  -translate-x-1/2 -top-8 text-xs text-white bg-gray px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity  mb-[26px] whitespace-nowrap">
                                        {aadharVerified ? "Aadhar Verified" : "Aadhar Not Verified"}
                                    </span> */}
                                </div>
                            </div>
                        </div>


                        <div className="flex flex-col gap-2 w-[94%]">
                            <label className="text-sm font-medium">Name:</label>
                            <input
                                type="text"
                                value={fields.fname ?? ""}
                                onChange={handleChange}
                                id="fname"
                                disabled={!isEditing}  // ✅ Enable editing when the Edit button is clicked
                                className={`border border-gray-300 rounded-md px-4 py-2 text-sm w-full bg-gray-100  ${isEditing ? "bg-white border-black" : "bg-gray-100"}`}
                            />
                        </div>


                        <div className="flex flex-col gap-2 w-full">
                            {/* Email Label */}
                            <label className="text-sm font-medium">Email:</label>

                            {/* Email Input */}
                            <div className="flex flex-row gap-[2px]">
                                <input
                                    type="email"
                                    value={fields.email ?? ""}
                                    onChange={handleChange}
                                    // Editable only if not verified and in edit mode.
                                    disabled={profileData.is_email_verified === "1" ? true : !isEditing}
                                    className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full bg-gray-100"
                                />

                                {/* Email Verification Icon (Now Below the Input) */}
                                <div className="relative group inline-block self-start mt-2">
                                    <Image
                                        src={emailVerified ? "/assets/my-profile/verified.svg" : "/assets/my-profile/notVerified.svg"}
                                        alt="Verification Status"
                                        width={20}
                                        height={20}
                                    />
                                    <span className="absolute -translate-x-1/2 -top-8 text-xs text-primary bg-gray-700 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {emailVerified ? "Email Verified" : "Email Not Verified"}
                                    </span>
                                </div>
                            </div>


                            {/* Email OTP Verification Section */}
                            {!emailVerified && (
                                <div className="flex flex-col gap-2 w-full">
                                    {/* Send OTP Button Below Input */}
                                    {!otpSentEmail ? (
                                        <button
                                            type="button"
                                            onClick={handleSendEmailOtp}
                                            className="border-2 px-2 border-primary w-[100px] ml-4   text-primary  "
                                            disabled={sendLoading}
                                        >
                                            {sendLoading ? "Sending..." : (
                                                <>
                                                    {/* <Image
                                                        src="/assets/my-profile/send1.svg"
                                                        alt="Send OTP"
                                                        width={20}
                                                        height={20}
                                                        className=""
                                                    /> */}
                                                    Send OTP
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <>
                                            {/* OTP Input Field Below Send OTP */}
                                            <div className="flex flex-row ">
                                                <input
                                                    type="text"
                                                    placeholder="Enter OTP"
                                                    value={emailOtp}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                                                        setEmailOtp(val);
                                                    }}
                                                    className="border-[1px]  px-3 py-1 border-black w-[100px] "
                                                />

                                                {/* Verify OTP Button Below OTP Input */}
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyEmailOtp}
                                                    className={` px-3 py-1  flex items-center justify-start  w-[100px] ${emailOtp.length === 6 ? "border-black" : "border-gray-400 cursor-not-allowed"
                                                        }`}
                                                    disabled={emailOtp.length !== 6 || verifyLoading}
                                                >
                                                    {verifyLoading ? (
                                                        <span className="text-xs">Verifying...</span>
                                                    ) : (
                                                        <Image
                                                            src="/assets/my-profile/verified.svg"
                                                            alt="Verify OTP"
                                                            width={20}
                                                            height={20}
                                                            className="fill-blue"
                                                        />
                                                    )}
                                                </button>
                                            </div>

                                        </>
                                    )}
                                </div>
                            )}

                            {/* Error Messages */}
                            {sendError && <p className="text-red-500 text-sm mt-2">{sendError}</p>}
                            {verifyError && <p className="text-red-500 text-sm mt-2">{verifyError}</p>}
                        </div>



                        <div className="flex flex-col  gap-4">
                            {/* Label */}
                            <label className="text-sm font-medium">Mobile No:</label>

                            {/* Mobile Number Input */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="tel"
                                    value={profileData.mobile}
                                    onChange={handleChange}
                                    // Editable only if not verified and in edit mode.
                                    disabled={profileData.is_mobile_verified === "1" ? true : !isEditing}
                                    className="border border-gray-300 rounded-md px-2 py-1 w-96 bg-gray-100"
                                />

                                {/* Verification Icon */}
                                <div className="relative group">
                                    {mobileVerified ? (
                                        <div className="relative group">
                                            <Image src="/assets/my-profile/verified.svg" alt="Verified" width={20} height={20} />
                                            <span className="absolute -translate-x-1/2 -top-8 text-xs text-primary bg-gray-700 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ml-[10px] mb-[28px] whitespace-nowrap">
                                                Mobile Number Verified
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="relative group">
                                            <Image src="/assets/my-profile/notVerified.svg" alt="Not Verified" width={20} height={20} />
                                            <span className="absolute -translate-x-1/2 -top-8 text-xs text-primary bg-red-500 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ml-[10px] mb-[28px] whitespace-nowrap">
                                                Mobile Number Not Verified
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* OTP Verification Section */}
                            {!mobileVerified && (
                                <div className="flex items-center gap-2 mt-2">
                                    {otpSent ? (
                                        <>
                                            {/* OTP Input */}
                                            <input
                                                type="text"
                                                placeholder="Enter OTP"
                                                value={otp}
                                                onChange={handleOtpChange}
                                                className="border border-gray-300 p-1 w-24 "
                                            />

                                            {/* Verify Button (Disabled until valid OTP is entered) */}
                                            <button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                disabled={!isOtpValid}
                                                className={`border-[1px] border-primary text-primary p-[2px] ${isOtpValid ? "opacity-100" : "opacity-50 cursor-not-allowed"}`}
                                            >
                                                Verify OTP
                                            </button>
                                        </>
                                    ) : (
                                        <button type="button" onClick={handleSendOtp} className="text-primary border-[1px] border-primary px-2 py-1 rounded-md">
                                            Send OTP
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>



                        {(profileData?.isBuilder || profileData?.isowner) && (
                            Object.keys(editable).map((field) => (
                                <div key={field} className="flex flex-col gap-2">
                                    <label className="text-sm font-medium capitalize"> {labelMapping[field as keyof EditableFields] || field}:</label>
                                    <div className="flex items-center w-[94%] gap-4">
                                        <input
                                            type="text"
                                            id={field}
                                            value={fields[field as keyof ProfileFields] || ""}
                                            onChange={handleChange}
                                            disabled={!editable[field as keyof EditableFields]}
                                            className={`border border-gray-300 rounded-md px-4 py-2 text-sm w-full ${editable[field as keyof EditableFields] ? "border-black  cursor-text" : "cursor-pointer bg-gray- border-gray-300"
                                                }`}
                                        />

                                    </div>
                                </div>
                            )))}

                        {/* WhatsApp Toggle */}
                        <div className="flex flex-row items-center justify-start gap-4 ">
                            <label className="text-sm text-gray-700">Get Updates on WhatsApp</label>
                            <button type="button" onClick={handleWhatsAppToggle}>
                                <Image
                                    src={whatsappEnabled ? "/assets/my-profile/Green.svg" : "/assets/my-profile/Notification_Button.svg"}
                                    alt="WhatsApp Toggle"
                                    width={30}
                                    height={30}
                                />
                            </button>
                        </div>

                        {/* Save Profile Button */}
                        <div className="flex justify-center">

                            <button
                                type="button"
                                className={`px-6 py-2 rounded-md 
                                   ${isEditing
                                        ? isChanged
                                            ? "bg-primary text-white cursor-pointer"
                                            : "bg-gray-300 text-white cursor-not-allowed"
                                        : "bg-primary text-white cursor-pointer"
                                    }`}
                                onClick={isEditing ? handleUpdate : handleToggleEdit}
                            >
                                {isEditing ? "Update" : "Edit"}
                            </button>
                        </div>

                        {/* Success Popup */}

                        {showPopup && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white text-black px-6 py-4 rounded-lg shadow-lg text-center transition-opacity duration-200 ease-in-out">
                                    <p className="font-medium">
                                        {isChanged ? "✅ Profile updated successfully!" : "⚠️ No changes made!"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            ) : (
                // ✅ DESKTOP VIEW
                <div className="p-6 relative">
                    <div className="flex flex-row justify-between items-start border-b pb-2 mb-6">
                        <h1 className="text-2xl font-semibold  ">Edit Your Profile</h1>

                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="flex items-center gap-4">
                            {/* <label className="w-32 font-medium">Aadhar Card:</label> */}
                            {/* <input
                                type="text"
                                id="aadhar"

                                value={fields.aadhar}
                                onChange={handleChange}
                                className="border cursor-pointer border-gray-300 rounded-md px-4 w-96"
                            /> */}

                            <div className="relative group inline-block">
                                {/* <button type="button" onClick={() => setAadharVerified(!aadharVerified)}>
                                    <Image
                                        src={aadharVerified ? "/assets/my-profile/verified.svg" : "/assets/my-profile/notVerified.svg"}
                                        alt="Verification Status"
                                        width={20}
                                        height={20}
                                    />
                                </button> */}
                                {/* Tooltip */}
                                {/* <span className="absolute  -translate-x-1/2 -top-8 text-xs text-white bg-gray px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ml-[36px] mb-[26px] whitespace-nowrap">
                                    {aadharVerified ? "Aadhar Verified" : "Aadhar Not Verified"}
                                </span> */}
                            </div>

                        </div>
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium w-32">Name:</label>
                            <input
                                type="text"
                                value={fields.fname ?? ""}
                                onChange={handleChange}
                                id="fname"
                                disabled={!isEditing}  // ✅ Enable editing when the Edit button is clicked
                                className={`border rounded-md px-2 py-1 w-96  ${isEditing ? "bg-white border-black" : "bg-gray-100"}`}
                            />
                        </div>


                        <div>
                            {/* Email Verification */}
                            <div className="flex items-center gap-4">
                                <label className="w-32 font-medium">Email:</label>
                                <input
                                    type="email"
                                    value={fields.email}
                                    onChange={handleChange}
                                    // Editable only if not verified and in edit mode.
                                    disabled={profileData.is_email_verified === "1" ? true : !isEditing}
                                    className="border border-gray-300 rounded-md px-2 py-1 w-96 bg-gray-100"
                                />

                                {/* Verification Icon & Tooltip */}
                                <div className="relative group inline-block">
                                    {emailVerified ? (
                                        <div className="relative group">
                                            <Image
                                                src="/assets/my-profile/verified.svg"
                                                alt="Verified"
                                                width={20}
                                                height={20}
                                            />
                                            <span className="absolute -translate-x-1/2 -top-8 text-xs text-primary bg-gray-700 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ml-[10px] mb-[28px] whitespace-nowrap">
                                                Email Verified
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="relative group">
                                            <Image
                                                src="/assets/my-profile/notVerified.svg"
                                                alt="Not Verified"
                                                width={20}
                                                height={20}
                                            />
                                            <span className="absolute -translate-x-1/2 -top-8 text-xs text-primary bg-red-500 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ml-[10px] mb-[28px] whitespace-nowrap">
                                                Email Not Verified
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* OTP Verification Section */}
                                {!emailVerified && (
                                    <div className="flex items-center gap-2">
                                        {!otpSentEmail ? (
                                            <button
                                                type="button"
                                                onClick={handleSendEmailOtp}
                                                className="border-[1px] border-primary text-primary px-2 py-1 rounded-md"
                                                disabled={sendLoading}
                                            >
                                                {sendLoading ? "Sending..." : "Send OTP"}
                                            </button>
                                        ) : (
                                            <>
                                                <input
                                                    type="text"
                                                    placeholder="Enter OTP"
                                                    value={emailOtp}
                                                    onChange={handleEmailOtpChange}
                                                    className="border p-[1px] w-24"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyEmailOtp}
                                                    className={`border-[1px] border-primary text-primary p-[2px]  ${isEmailOtpValid ? "opacity-100" : "opacity-50 cursor-not-allowed"
                                                        }`}
                                                    disabled={!isEmailOtpValid || verifyLoading}
                                                >
                                                    {verifyLoading ? "Verifying..." : "Verify OTP"}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Success Tooltip after Verification */}
                                {showSuccessTooltip && (
                                    <span className="absolute -translate-x-1/2 -top-8 text-xs text-primary bg-green-500 px-2 py-1 rounded-md transition-opacity ml-[10px] whitespace-nowrap">
                                        Email Verified Successfully!
                                    </span>
                                )}
                            </div>

                            {/* Error Messages */}
                            {sendError && <p className="text-red-500 text-sm mt-2">{sendError}</p>}
                            {verifyError && <p className="text-red-500 text-sm mt-2">{verifyError}</p>}
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Label */}
                            <label className="w-32 font-medium">Mobile Number:</label>

                            {/* Mobile Number Input */}
                            <input
                                type="tel"
                                value={profileData.mobile}
                                onChange={handleChange}
                                // Editable only if not verified and in edit mode.
                                disabled={profileData.is_mobile_verified === "1" ? true : !isEditing}
                                className="border border-gray-300 rounded-md px-2 py-1 w-96 bg-gray-100"
                            />

                            {/* Verification Icon */}
                            <div className="relative group inline-block">
                                {mobileVerified ? (
                                    <div className="relative group">
                                        <Image src="/assets/my-profile/verified.svg" alt="Verified" width={20} height={20} />
                                        <span className="absolute -translate-x-1/2 -top-8 text-xs text-primary bg-gray-700 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ml-[10px] mb-[28px] whitespace-nowrap">
                                            Mobile Number Verified
                                        </span>
                                    </div>
                                ) : (
                                    <div className="relative group">
                                        <Image src="/assets/my-profile/notVerified.svg" alt="Not Verified" width={20} height={20} />
                                        <span className="absolute -translate-x-1/2 -top-8 text-xs text-primary bg-red-500 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ml-[10px] mb-[28px] whitespace-nowrap">
                                            Mobile Number Not Verified
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* OTP Verification Section */}
                            {!mobileVerified && (
                                <div className="flex items-center gap-2">
                                    {otpSent ? (
                                        <>
                                            {/* OTP Input */}
                                            <input
                                                type="text"
                                                placeholder="Enter OTP"
                                                value={otp}
                                                onChange={handleOtpChange}
                                                className="border p-[1px] w-24"
                                            />

                                            {/* Verify Button (Disabled until valid OTP is entered) */}
                                            <button
                                                type="button"
                                                onClick={handleVerifyOtp}
                                                disabled={!isOtpValid}
                                                className={`border-[1px] border-primary text-primary p-[2px] ${isOtpValid ? "opacity-100" : "opacity-50  cursor-not-allowed"}`}
                                            >
                                                Verify OTP
                                            </button>
                                        </>
                                    ) : (
                                        <button type="button" onClick={handleSendOtp} className="text-primary border-[1px] border-primary px-2 py-1 rounded-md">
                                            Send OTP
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>



                        {isBuilderOrOwner && (
                            Object.keys(editable).map((field) => (
                                <div key={field} className="flex items-center gap-4">
                                    <label className="w-32 font-medium capitalize">{labelMapping[field as keyof EditableFields] || field}:</label>
                                    <input
                                        type="text"
                                        id={field}
                                        value={fields[field as keyof ProfileFields] || ""}
                                        onChange={handleChange}
                                        disabled={!editable[field as keyof EditableFields]}
                                        className={`border rounded-md px-2 py-1 w-96 
        ${editable[field as keyof EditableFields] ? "border-black  cursor-text" : "cursor-pointer bg-gray- border-gray-300"}`}
                                    />


                                </div>
                            )))}



                        <div className="flex items-center gap-4">
                            <label className="text-sm text-gray-700">Get Updates on WhatsApp</label>

                            <button type="button" onClick={handleWhatsAppToggle}>
                                <Image
                                    src={whatsappEnabled ? "/assets/my-profile/Green.svg" : "/assets/my-profile/Notification_Button.svg"}
                                    alt="WhatsApp Toggle"
                                    width={30}
                                    height={30}
                                />
                            </button>
                        </div>
                        <div className="flex justify-center">


                            <button
                                type="button"
                                className={`px-6 py-2 rounded-md 
                                   ${isEditing
                                        ? isChanged
                                            ? "bg-primary text-white cursor-pointer"
                                            : "bg-gray-300 text-white cursor-not-allowed"
                                        : "bg-primary text-white cursor-pointer"
                                    }`}
                                onClick={isEditing ? handleUpdate : handleToggleEdit}
                            >
                                {isEditing ? "Update" : "Edit"}
                            </button>



                        </div>
                    </form>

                    {showPopup && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white text-black px-6 py-4 rounded-lg shadow-lg text-center transition-opacity duration-200 ease-in-out">
                                <p className="font-medium">
                                    {isChanged ? "✅ Profile updated successfully!" : "⚠️ No changes made!"}
                                </p>
                            </div>
                        </div>
                    )}

                </div>

            )}
        </div>
    );

}
export default BasicProfileComponent;































