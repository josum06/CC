import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaComments, FaUser } from "react-icons/fa";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="sticky top-0 left-0 right-0 z-10">
      {/* Navbar */}
      <nav className="w-full bg-transparent shadow-md z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo */}
          <div className="text-2xl font-bold">🚀 Company</div>

          {/* Search Bar with Button Inside */}
          <div className="hidden md:flex items-center w-full max-w-md relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border rounded-md pr-10 focus:outline-none"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500">
              <FaSearch />
            </button>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/Chats")}  className="">
            <FaComments className="text-xl cursor-pointer" />
            </button>
            <FaUser
              className="text-xl cursor-pointer"
              onClick={toggleSidebar}
            />
          </div>
        </div>

        {/* Responsive Search Bar */}
        <div className="md:hidden px-4 py-2 bg-gray-100 relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 border rounded-md pr-10 focus:outline-none"
          />
          <button className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500">
            <FaSearch />
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default Navbar;
