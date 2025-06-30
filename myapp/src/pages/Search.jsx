import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaComments, FaUser, FaArrowLeft } from "react-icons/fa";
import {
  Eye,
  User,
  FileText,
  Bell,
  Star,
  TrendingUp,
  Calendar,
  Clock,
} from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

const SearchPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchUsers, setSearchUsers] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setError("");

    if (!query.trim()) {
      setSearchUsers([]);
      setIsSearchActive(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/searchUser`,
        {
          params: {
            query: query,
            clerkId: user.id,
          },
        }
      );
      setSearchUsers(res.data);
      setIsSearchActive(true);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search users. Please try again.");
      setSearchUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserClick = async (userId) => {
    navigate("/NetworkProfile", {
      state: { userData: { userId } },
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchUsers([]);
    setIsSearchActive(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100">
      {/* Header Section */}
      <div className="border-b border-gray-500/50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">
            Search Users
          </h1>
          <p className="mt-2 text-gray-400 text-sm sm:text-base">
            Find and connect with other users
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div ref={searchRef} className="relative mb-8">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search for users..."
              value={searchQuery}
              onChange={handleChange}
              className="w-full px-6 py-4 pl-14 text-lg focus:border-blue-500/50 border-gray-500/50 rounded-2xl 
                focus:outline-none placeholder:text-gray-400/50 text-gray-100 
                bg-gradient-to-br from-gray-800/50 via-gray-700/30 to-gray-800/50 
                backdrop-blur-sm transition-all duration-300 hover:border-gray-400/50
                focus:shadow-lg focus:shadow-blue-500/20"
              autoFocus
            />
            <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 
                  hover:text-gray-200 transition-colors duration-300"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isSearchActive && (searchUsers.length > 0 || isLoading || error) && (
            <div
              className="absolute left-0 right-0 mt-3 bg-gradient-to-br from-gray-800/95 via-gray-700/90 to-gray-800/95 
                border border-gray-500/30 shadow-2xl rounded-2xl z-50 max-h-80 overflow-y-auto backdrop-blur-md"
            >
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-300">Searching...</span>
                </div>
              )}

              {error && (
                <div className="px-6 py-4 text-red-400 text-center bg-red-500/10 border-b border-red-500/20">
                  {error}
                </div>
              )}

              {!isLoading &&
                !error &&
                searchUsers.length === 0 &&
                searchQuery && (
                  <div className="px-6 py-8 text-gray-400 text-center">
                    <div className="text-4xl mb-3">🔍</div>
                    <p>No users found for "{searchQuery}"</p>
                  </div>
                )}

              {!isLoading &&
                !error &&
                searchUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center px-6 py-4 hover:bg-white/5 cursor-pointer transition-all duration-300 
                        border-b border-gray-500/20 last:border-b-0 group"
                    onClick={() => handleUserClick(user._id)}
                  >
                    <div className="relative mr-4">
                      <img
                        src={user.profileImage || "/default-avatar.png"}
                        alt={`${user.fullName}'s avatar`}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20 
                            group-hover:ring-blue-400/50 transition-all duration-300"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div
                        className="hidden w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 
                          items-center justify-center ring-2 ring-white/20"
                      >
                        <User size={20} className="text-gray-300" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-100 font-semibold block group-hover:text-blue-400 transition-colors duration-300">
                        {user.fullName}
                      </span>
                      {user.username && (
                        <span className="text-gray-400 text-sm">
                          @{user.username}
                        </span>
                      )}
                    </div>
                    <Eye
                      size={18}
                      className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
                    />
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Search Tips */}
        {!searchQuery && (
          <div
            className="bg-gradient-to-br from-gray-800/30 via-gray-700/20 to-gray-800/30 rounded-2xl p-8 
            border border-gray-500/30 backdrop-blur-sm"
          >
            <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
              <FileText size={24} className="text-blue-400" />
              Search Tips
            </h3>
            <ul className="text-gray-300 space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Type a name to find users
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Search is case-insensitive
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Click on any result to view their profile
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Use partial names for broader results
              </li>
            </ul>
          </div>
        )}

        {/* Recent Results */}
        {searchUsers.length > 0 && !isSearchActive && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
              <TrendingUp size={24} className="text-blue-400" />
              Recent Results
            </h3>
            <div className="grid gap-4">
              {searchUsers.slice(0, 5).map((user) => (
                <div
                  key={user._id}
                  className="group relative overflow-hidden rounded-2xl transition-all duration-500 ease-out
                    bg-gradient-to-br from-gray-500/20 via-gray-600/10 to-gray-700/5 
                    border border-gray-500/30 
                    hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/30
                    transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleUserClick(user._id)}
                >
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-white/20 to-transparent rounded-full blur-2xl"></div>
                  </div>

                  <div className="relative p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={user.profileImage || "/default-avatar.png"}
                            alt={`${user.fullName}'s avatar`}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20 
                              group-hover:ring-blue-400/50 transition-all duration-300"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                          <div
                            className="hidden w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 
                            items-center justify-center ring-2 ring-white/20"
                          >
                            <User size={24} className="text-gray-300" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        </div>
                        <div>
                          <span className="text-gray-100 font-semibold block group-hover:text-blue-400 transition-colors duration-300">
                            {user.fullName}
                          </span>
                          {user.username && (
                            <span className="text-gray-400 text-sm">
                              @{user.username}
                            </span>
                          )}
                        </div>
                      </div>
                      <Eye
                        size={20}
                        className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
                      />
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  ></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
