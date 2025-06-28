import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaComments, FaUser, FaArrowLeft } from "react-icons/fa";
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
      const res = await axios.get("http://localhost:3000/api/user/searchUser", {
        params: {
          query: query,
          clerkId: user.id,
        },
      });
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
    <div className="min-h-screen bg-[#02040a]">
      {/* Main Search Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Search Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-100 mb-2">
              Search Users
            </h1>
            <p className="text-gray-400">Find and connect with other users</p>
          </div>

          {/* Search Bar */}
          <div ref={searchRef} className="relative mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for users..."
                value={searchQuery}
                onChange={handleChange}
                className="w-full px-4 py-3 pl-12 border text-lg focus:border-blue-500 border-gray-500 rounded-2xl focus:outline-none placeholder:text-gray-400/50 text-gray-100 bg-gray-800/50 placeholder:text-base"
                autoFocus
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchActive &&
              (searchUsers.length > 0 || isLoading || error) && (
                <div className="absolute left-0 right-0 mt-2 bg-gray-800 border border-gray-600 shadow-lg rounded-lg z-50 max-h-80 overflow-y-auto">
                  {isLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <span className="ml-2 text-gray-300">Searching...</span>
                    </div>
                  )}

                  {error && (
                    <div className="px-4 py-3 text-red-400 text-center">
                      {error}
                    </div>
                  )}

                  {!isLoading &&
                    !error &&
                    searchUsers.length === 0 &&
                    searchQuery && (
                      <div className="px-4 py-6 text-gray-400 text-center">
                        No users found for "{searchQuery}"
                      </div>
                    )}

                  {!isLoading &&
                    !error &&
                    searchUsers.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0"
                        onClick={() => handleUserClick(user._id)}
                      >
                        <img
                          src={user.profileImage || "/default-avatar.png"}
                          alt={`${user.fullName}'s avatar`}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                        <div className="flex-1">
                          <span className="text-gray-100 font-semibold block">
                            {user.fullName}
                          </span>
                          {user.username && (
                            <span className="text-gray-400 text-sm">
                              @{user.username}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
          </div>

          {/* Search Tips */}
          {!searchQuery && (
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-gray-100 mb-3">
                Search Tips
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Type a name to find users</li>
                <li>• Search is case-insensitive</li>
                <li>• Click on any result to view their profile</li>
                <li>• Use partial names for broader results</li>
              </ul>
            </div>
          )}

          {/* Recent Searches or Suggestions could go here */}
          {searchUsers.length > 0 && !isSearchActive && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                Recent Results
              </h3>
              <div className="grid gap-3">
                {searchUsers.slice(0, 5).map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors border border-gray-700"
                    onClick={() => handleUserClick(user._id)}
                  >
                    <img
                      src={user.profileImage || "/default-avatar.png"}
                      alt={`${user.fullName}'s avatar`}
                      className="w-8 h-8 rounded-full mr-3 object-cover"
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                    <div className="flex-1">
                      <span className="text-gray-100 font-medium">
                        {user.fullName}
                      </span>
                      {user.username && (
                        <span className="text-gray-400 text-sm ml-2">
                          @{user.username}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
