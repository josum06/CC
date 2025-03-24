import { SignOutButton } from "@clerk/clerk-react";
import React from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoSettings } from "react-icons/io5";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`fixed top-0 right-0 w-64 h-full bg-white  shadow-lg z-50 transform transition-transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 ">
        <h2 className="text-lg font-bold"></h2>
        <FaTimes className="text-xl cursor-pointer" onClick={toggleSidebar} />
      </div>

      <div className="p-4">
          <div className="py-2 -mt-5 px-1 flex justify-between items-center mb-2"><span className="text-lg text-black">Anugrah Singh</span> <img className="w-10 h-10 rounded-full" src="https://images.pexels.com/photos/14653174/pexels-photo-14653174.jpeg" alt="profile photo" /> </div>
          <button onClick={() => { navigate("/CompleteYourProfile");toggleSidebar();}}  className="py-2  mb-2 bg-orange-400 hover:bg-orange-500 hover:shadow w-full px-4 py-2 text-white  font-semibold rounded-md cursor-pointer justify-center flex items-center ">Complete your Profile</button>
          <button onClick={() => { navigate("/ClassRoom");toggleSidebar();}}  className="py-2  mb-2 bg-blue-400 hover:bg-blue-500 hover:shadow w-full px-4 py-2 text-white  font-semibold rounded-md cursor-pointer justify-center flex items-center ">Class Room</button>
          <button onClick={() => { navigate("/Settings");toggleSidebar();}} className="py-2  mb-2 bg-gray-200 hover:bg-gray-300 hover:shadow w-full px-4 py-2 text-gray-900 font-semibold rounded-md cursor-pointer justify-center flex items-center "><IoSettings className="me-1" />Settings</button>
          <SignOutButton onClick={toggleSidebar} className="bg-red-400 w-full px-4 py-2 hover:bg-red-500 hover:shadow text-white font-semibold rounded-md cursor-pointer" redirectUrl="/Signup"/>
      </div>
    </div>
  );
};

export default Sidebar;
