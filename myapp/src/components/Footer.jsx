import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaBell,
  FaCalendar,
  FaUsers,
  FaBuilding,
} from "react-icons/fa";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

const Footer = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [currentUserRole, setCurrentUserRole] = useState("student");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile/${user.id}`
      );
      const data = response.data;
      setCurrentUserRole(data?.role);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  const handlePostClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (option) => {
    switch (option) {
      case "faculty":
        navigate("/FacultyPost");
        break;
      case "project":
        navigate("/PostProject");
        break;
      case "student":
        navigate("/StudentPost");
        break;
      default:
        break;
    }
    setDropdownOpen(false);
  };

  return (
    <div className="relative">
      <div className="sticky bottom-0 left-0 right-0 z-10 w-full bg-[#02040a] border-t border-gray-600 shadow-md overflow-x-hidden">
        <div className="container mx-auto px-2 py-2 flex justify-center items-center gap-7 sm:gap-9 md:gap-11 lg:gap-13">
          {/* Left Icons */}
          <button
            onClick={() => navigate("/Notice")}
            className="flex flex-col items-center text-gray-100 cursor-pointer hover:text-blue-500"
          >
            <FaBell className="text-sm sm:text-lg md:text-xl" />
            <span className="text-[8px] sm:text-xs md:text-sm">Notice</span>
          </button>

          <button
            onClick={() => navigate("/Events")}
            className="flex flex-col items-center text-gray-100 cursor-pointer hover:text-blue-500"
          >
            <FaCalendar className="text-sm sm:text-lg md:text-xl" />
            <span className="text-[8px] sm:text-xs md:text-sm">Events</span>
          </button>

          {/* Center + Icon with "Post" label */}
          <div className="flex flex-col items-center">
            <button
              onClick={handlePostClick}
              className="bg-blue-500 text-white text-gray-100 rounded-full w-8 cursor-pointer h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg hover:bg-blue-600 transition"
            >
              <FaPlus className="text-lg sm:text-xl md:text-2xl" />
            </button>
            <span className="text-[8px] sm:text-xs md:text-sm mt-1">Post</span>
          </div>

          {/* Right Icons */}
          <button
            onClick={() => navigate("/Network")}
            className="flex flex-col items-center text-gray-100 cursor-pointer hover:text-blue-500"
          >
            <FaUsers className="text-sm sm:text-lg md:text-xl" />
            <span className="text-[8px] sm:text-xs md:text-sm">Network</span>
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg w-48 z-20 transition-all duration-300 ease-in-out">
          <ul className="py-2">
            <li
              onClick={() => handleOptionClick("faculty")}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer transition rounded-lg"
            >
              Faculty Post
            </li>
            <li
              onClick={() => handleOptionClick("project")}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer transition rounded-lg"
            >
              Post Project
            </li>
            <li
              onClick={() => handleOptionClick("student")}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer transition rounded-lg"
            >
              Student Post
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Footer;
