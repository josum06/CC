import { SignOutButton } from "@clerk/clerk-react";
import React from "react";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold">Sidebar</h2>
        <FaTimes className="text-xl cursor-pointer" onClick={toggleSidebar} />
      </div>

      <div className="p-4">
        <ul>
          <Link  to='/Profile'className="py-2 border-b">Profile</Link>
          <li className="py-2 border-b">Settings</li>
          <SignOutButton redirectUrl="/Signup"/>

        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
