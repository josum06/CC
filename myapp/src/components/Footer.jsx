import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaBell, FaCalendar, FaBook, FaUsers, FaBuilding, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 w-full bg-transparent shadow-md  overflow-x-hidden">
      <div className="container mx-auto px-2 py-2 flex justify-center items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">

        {/* Left Icons */}
        <button onClick={() => navigate("/Notice")} className="flex flex-col items-center cursor-pointer hover:text-blue-500">
          <FaBell className="text-sm sm:text-lg md:text-xl" />
          <span className="text-[8px] sm:text-xs md:text-sm">Notice</span>
        </button>

        <button onClick={() => navigate("/Events")} className="flex flex-col items-center cursor-pointer hover:text-blue-500">
          <FaCalendar className="text-sm sm:text-lg md:text-xl" />
          <span className="text-[8px] sm:text-xs md:text-sm">Events</span>
        </button>

        <button onClick={() => navigate("/Academics")} className="flex flex-col items-center cursor-pointer hover:text-blue-500">
          <FaBook className="text-sm sm:text-lg md:text-xl" />
          <span className="text-[8px] sm:text-xs md:text-sm">Academics</span>
        </button>

        {/* Center + Icon with "Post" label */}
        <div className="flex flex-col items-center">
          <button  onClick={() => navigate("/Post")} className="bg-blue-500 text-white rounded-full w-8 cursor-pointer h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg hover:bg-blue-600 transition">
            <FaPlus className="text-lg sm:text-xl md:text-2xl" />
          </button>
          <span className="text-[8px] sm:text-xs md:text-sm mt-1">Post</span>
        </div>

        {/* Right Icons */}
        <button onClick={() => navigate("/Network")}  className="flex flex-col items-center cursor-pointer hover:text-blue-500">
          <FaUsers className="text-sm sm:text-lg md:text-xl" />
          <span className="text-[8px] sm:text-xs md:text-sm">Network</span>
        </button>

        <button onClick={() => navigate("/Companies")}  className="flex flex-col items-center cursor-pointer hover:text-blue-500">
          <FaBuilding className="text-sm sm:text-lg md:text-xl" />
          <span className="text-[8px] sm:text-xs md:text-sm">Companies</span>
        </button>

        <button onClick={() => navigate("/Contact")} className="flex flex-col items-center cursor-pointer hover:text-blue-500">
          <FaEnvelope className="text-sm sm:text-lg md:text-xl" />
          <span className="text-[8px] sm:text-xs md:text-sm">Contact</span>
        </button>

      </div>
    </div>
  );
};

export default Footer;
