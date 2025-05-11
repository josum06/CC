import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaComments, FaUser } from "react-icons/fa";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
const Navbar = () => {
  const {user} = useUser();
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
    const res = await axios.get("http://localhost:3000/api/user/searchUser", {
      params: {
        query: searchQuery,
        clerkId: user.id,
      },
    });
    setSearchUsers(res.data);
    console.log(res.data);
    setIsSearchActive(true);
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClick = async (userId) => {
    // console.log(userId);

    navigate("/NetworkProfile", {
      state: { userData: { userId } },
    });
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
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md pr-10 focus:outline-none"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500">
              <FaSearch />
            </button>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/Chats")} className="">
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
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md pr-10 focus:outline-none"
          />
          <button className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500">
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
