import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaComments, FaUser } from "react-icons/fa";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
const Navbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchUsers, setSearchUsers] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchActive(false);
        setSearchUsers([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = async (e) => {
    const searchQuery = e.target.value;
    if (!searchQuery.trim()) {
      setSearchUsers([]);
      setIsSearchActive(false);
      return;
    }
    // Perform search logic here, e.g., API call to fetch search results
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/user/searchUser`,
      {
        params: {
          query: searchQuery,
          clerkId: user.id,
        },
      }
    );
    setSearchUsers(res.data);
    setIsSearchActive(true);
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClick = async (userId) => {
    // Navigate with ID first, URL will be updated automatically with name
    navigate(`/NetworkProfile/${userId}`);
  };
  return (
    <div className="sticky top-0 left-0 right-0 z-10">
      {/* Navbar */}
      <nav className="w-full bg-[#02040a] shadow-md z-50 border-b border-gray-600">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => navigate("/")}>
            <div className="text-2xl font-bold text-gray-100 cursor-pointer">
              🚀Company
            </div>
          </button>

          {/* Search Bar with Button Inside */}

          {/* Icons */}
          <div className="flex items-center gap-1">
            <div className="hidden md:flex items-center w-full max-w-md relative">
              <input
                type="text"
                placeholder="Search..."
                onChange={handleChange}
                className="w-full px-3 py-1 border text-md me-2 focus:border-blue-500 border-gray-500 rounded-2xl pr-10 focus:outline-none placeholder:text-gray-400/50 text-gray-100 placeholder:text-sm"
              />
            </div>
            <button
              onClick={() => navigate("/Chats")}
              className="hover:bg-gray-500/50 p-2 rounded-full cursor-pointer"
            >
              <FaComments className="text-xl  text-gray-100" />
            </button>
            <button
              onClick={toggleSidebar}
              className="hover:bg-gray-500/50 p-2 rounded-full cursor-pointer"
            >
              <FaUser className="text-lg  text-gray-100" />
            </button>
          </div>
        </div>

        {/* Responsive Search Bar */}
        <div className="md:hidden px-4 py-2 bg-gray-100 relative">
          <input
            type="text"
            placeholder="Search..."
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md pr-10 focus:outline-none"
          />
          <button className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-100 hover:text-blue-500">
            <FaSearch />
          </button>
        </div>
        <div ref={searchRef} className="relative">
          {isSearchActive && searchUsers.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg rounded-md z-50 max-h-64 overflow-y-auto">
              {searchUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleClick(user._id)}
                >
                  <img
                    src={user.profileImage}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-sm font-semibold">{user.fullName}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>
      {/* /api/user/searchUser */}
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default Navbar;
