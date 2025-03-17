import { useState } from "react";
import { IoClose } from "react-icons/io5";
import useContactedUsers from "@/hooks/MyProfile/useContactedUsers";
type User = {
    name: string;
    mobile: string;
    location: string;
    email: string;
    date: string;
    created_at:string;
};

type ContactedUsersProps = {
    isOpen: boolean;
    onClose: () => void;

};

const ContactedUsers = ({ isOpen, onClose, propertyId }: { isOpen: boolean; onClose: () => void; propertyId: number | null }) => {
    const { users } = useContactedUsers(propertyId);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[80%] max-w-4xl p-5">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Contacted User</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-black">
                        <IoClose size={24} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-primary text-black">
                                <th className="p-2 border">Name</th>
                                <th className="p-2 border">Mobile</th>
                                <th className="p-2 border">User Location</th>
                                <th className="p-2 border">Email</th>
                                <th className="p-2 border">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index} className="text-center border">
                                    <td className="p-2 border">{user.fullName}</td>
                                    <td className="p-2 border">{user.mobile}</td>
                                    <td className="p-2 border">{user.address_1}</td>
                                    <td className="p-2 border">{user.email}</td>
                                    <td className="p-2 border">{user.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ContactedUsers;

