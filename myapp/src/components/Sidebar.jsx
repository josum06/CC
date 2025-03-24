import { SignOutButton } from "@clerk/clerk-react";
import React from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoSettings } from "react-icons/io5";
import { useUser } from "@clerk/clerk-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  return (
    <div
      className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4">
        <h2 className="text-lg font-bold">Sidebar</h2>
        <FaTimes className="text-xl cursor-pointer" onClick={toggleSidebar} />
      </div>

      <div className="p-4">
        <div className="py-2 -mt-5 px-1 flex justify-between items-center mb-2">
          <span className="text-lg text-black">{user?.fullName}</span>
          <img
            className="w-10 h-10 rounded-full"
            src={user?.imageUrl}
            alt="user img"
          />
        </div>

         <button
          onClick={() => {
            navigate("/YourAccount");
            toggleSidebar();
          }}
          className="mb-2 bg-purple-400 hover:bg-purple-500 hover:shadow w-full px-4 py-2 text-white font-semibold rounded-md cursor-pointer justify-center flex items-center"
        >
          Account
        </button>


        <button
          onClick={() => {
            navigate("/YourProfile");
            toggleSidebar();
          }}
          className="mb-2 bg-orange-400 hover:bg-orange-500 hover:shadow w-full px-4 py-2 text-white font-semibold rounded-md cursor-pointer justify-center flex items-center"
        >
          Profile
        </button>

        <button
          onClick={() => {
            navigate("/ClassRoom");
            toggleSidebar();
          }}
          className="mb-2 bg-blue-400 hover:bg-blue-500 hover:shadow w-full px-4 py-2 text-white font-semibold rounded-md cursor-pointer justify-center flex items-center"
        >
          Class Room
        </button>

        <button
          onClick={() => {
            navigate("/Settings");
            toggleSidebar();
          }}
          className="mb-2 bg-gray-200 hover:bg-gray-300 hover:shadow w-full px-4 py-2 text-gray-900 font-semibold rounded-md cursor-pointer justify-center flex items-center"
        >
          <IoSettings className="me-1" /> Settings
        </button>

        <SignOutButton
          onClick={toggleSidebar}
          className="bg-red-400 w-full px-4 py-2 hover:bg-red-500 hover:shadow text-white font-semibold rounded-md cursor-pointer"
          redirectUrl="/Signup"
        />
      </div>
    </div>
  );
};

export default Sidebar;
