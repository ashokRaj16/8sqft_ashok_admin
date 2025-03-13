import React from "react";
import { FaCircleUser } from "react-icons/fa6";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "./menu";
import MyProfile from "@/app/my-profile/MyProfile";
import { useRouter } from "next/navigation";

interface UserCardProps {
  name: string;
  onLogout: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ name, onLogout }) => {

  const router = useRouter();
  const handleProfileClick = () => {
    router.push("/my-profile"); 
  };

  return (
    <Menubar className="border-none">
      <MenubarMenu>
        {/* Trigger with Icon and User Name */}
        <MenubarTrigger className="flex items-center gap-2 cursor-pointer px-3 py-2 border-0 ">
          <FaCircleUser size={24} className="text-white" />
          <span className="text-sm text-white font-medium text-gray-700">{name}</span>
        </MenubarTrigger>

        {/* Dropdown Menu Content */}
        <MenubarContent className="bg-white rounded-lg shadow-lg border-none z-50 w-48">
          {/* <div className="flex flex-col divide-y divide-gray-200"> */}
          <MenubarItem>
            {/* My Profile Option */}
            <button  onClick={handleProfileClick} className="px-4 py-1 text-left text-sm text-gray-700 hover:bg-gray-100">
              My Profile
            </button>
            
          </MenubarItem>
          <hr/>
          <MenubarItem>

            {/* Sign Out Option */}
            <button
              onClick={onLogout}
              className="px-4 py-1 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
              Sign Out
            </button>
          </MenubarItem>
          {/* </div> */}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default UserCard;