import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  User,
  Sparkles,
  X,
  ArrowRight,
  Users,
  TrendingUp,
  Loader2,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../context/ThemeContext";

const SearchPage = () => {
  const { user } = useUser();
  const { isDarkMode } = useTheme();
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
        },
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#070707] py-6 px-3 sm:py-8 sm:px-4 md:px-6 relative overflow-hidden transition-colors duration-300">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4790fd]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c76191]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ece239]/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-[#4790fd]/10 border border-[#4790fd]/20">
              <Search className="w-5 h-5 text-[#4790fd]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-[#f5f5f5] transition-colors duration-300">
                Discover People
              </h1>
              <p className="text-sm text-gray-600 dark:text-[#a0a0a0] transition-colors duration-300">
                Find and connect with students and faculty
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar Container */}
        <div ref={searchRef} className="relative mb-8">
          <div className="relative group">
            {/* Gradient blur background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#4790fd]/10 via-[#c76191]/5 to-[#27dc66]/10 rounded-2xl blur-xl opacity-50"></div>

            {/* Search Input */}
            <div className="relative bg-white/80 dark:bg-[#040404]/80 backdrop-blur-2xl rounded-2xl border border-gray-200 dark:border-[#4790fd]/20 shadow-xl dark:shadow-2xl hover:border-[#4790fd]/30 transition-all duration-300">
              <div className="flex items-center px-5 py-4">
                <Search className="w-5 h-5 text-[#4790fd] mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search by name, username, or email..."
                  value={searchQuery}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-gray-900 dark:text-[#f5f5f5] placeholder-gray-500 dark:placeholder-[#a0a0a0] text-base focus:outline-none transition-colors duration-300"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="ml-3 p-1.5 hover:bg-[#4790fd]/10 rounded-lg transition-all duration-300 text-gray-500 dark:text-[#a0a0a0] hover:text-gray-900 dark:hover:text-[#f5f5f5]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {isLoading && (
                  <div className="ml-3">
                    <Loader2 className="w-5 h-5 text-[#4790fd] animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Search Results Dropdown */}
            {isSearchActive &&
              (searchUsers.length > 0 || isLoading || error) && (
                <div className="absolute left-0 right-0 mt-3 bg-white/95 dark:bg-[#040404]/95 backdrop-blur-2xl rounded-2xl border border-gray-200 dark:border-[#4790fd]/20 shadow-2xl z-50 max-h-96 overflow-y-auto transition-colors duration-300">
                  {isLoading && (
                    <div className="flex items-center justify-center py-12">
                      <div className="relative">
                        <div className="w-12 h-12 border-4 border-[#4790fd]/20 rounded-full"></div>
                        <div className="w-12 h-12 border-4 border-t-[#4790fd] border-r-[#27dc66] rounded-full animate-spin absolute top-0 left-0"></div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="px-6 py-4 text-[#c76191] text-center bg-[#c76191]/10 border-b border-[#c76191]/20">
                      {error}
                    </div>
                  )}

                  {!isLoading &&
                    !error &&
                    searchUsers.length === 0 &&
                    searchQuery && (
                      <div className="px-6 py-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-[#4790fd]/10 rounded-full flex items-center justify-center">
                          <Search className="w-8 h-8 text-[#4790fd]" />
                        </div>
                        <p className="text-gray-900 dark:text-[#f5f5f5] font-medium mb-1 transition-colors duration-300">
                          No users found
                        </p>
                        <p className="text-sm text-gray-500 dark:text-[#a0a0a0] transition-colors duration-300">
                          Try searching with a different name
                        </p>
                      </div>
                    )}

                  {!isLoading &&
                    !error &&
                    searchUsers.map((userItem, index) => (
                      <div
                        key={userItem._id}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-[#4790fd]/5 cursor-pointer transition-all duration-300 border-b border-gray-100 dark:border-[#4790fd]/10 last:border-b-0 group"
                        onClick={() => handleUserClick(userItem._id)}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-[#4790fd]/40 group-hover:ring-[#4790fd]/60 transition-all duration-300 shadow-lg shadow-[#4790fd]/20">
                          <img
                            src={
                              userItem.profileImage || "/default-avatar.png"
                            }
                            alt={`${userItem.fullName}'s avatar`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = "none";
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = "flex";
                              }
                            }}
                          />
                          <div className="hidden w-14 h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#070707] dark:to-[#040404] items-center justify-center ring-2 ring-[#4790fd]/40">
                            <User size={24} className="text-[#4790fd]" />
                          </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#27dc66] rounded-full border-2 border-white dark:border-[#040404] shadow-lg"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-[#f5f5f5] text-base group-hover:text-[#4790fd] transition-colors duration-300 truncate">
                          {userItem.fullName}
                        </p>
                        {userItem.username && (
                          <p className="text-sm text-gray-500 dark:text-[#a0a0a0] truncate">
                            @{userItem.username}
                          </p>
                        )}
                        {userItem.role && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-[#27dc66]/10 text-[#27dc66] rounded-full border border-[#27dc66]/20">
                            {userItem.role}
                          </span>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 dark:text-[#a0a0a0] group-hover:text-[#4790fd] group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                      </div>
                    ))}
                </div>
              )}
          </div>
        </div>

        {/* Empty State / Search Tips */}
        {!searchQuery && (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4790fd]/5 to-[#27dc66]/5 rounded-3xl blur-xl opacity-50"></div>
            <div className="relative bg-white/80 dark:bg-[#040404]/80 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-[#4790fd]/20 p-8 shadow-xl dark:shadow-none transition-colors duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-[#ece239]/10 border border-[#ece239]/20">
                  <Sparkles className="w-5 h-5 text-[#ece239]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-[#f5f5f5] transition-colors duration-300">
                  Search Tips
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-[#070707]/50 border border-gray-200 dark:border-[#4790fd]/10 hover:border-[#4790fd]/20 transition-all duration-300 group/item">
                  <div className="w-2 h-2 bg-[#4790fd] rounded-full mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-[#f5f5f5] mb-1 transition-colors duration-300">
                      Type a name
                    </p>
                    <p className="text-xs text-gray-500 dark:text-[#a0a0a0] transition-colors duration-300">
                      Search by full name or username
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-[#070707]/50 border border-gray-200 dark:border-[#27dc66]/10 hover:border-[#27dc66]/20 transition-all duration-300 group/item">
                  <div className="w-2 h-2 bg-[#27dc66] rounded-full mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-[#f5f5f5] mb-1 transition-colors duration-300">
                      Case-insensitive
                    </p>
                    <p className="text-xs text-gray-500 dark:text-[#a0a0a0] transition-colors duration-300">
                      Search works with any case
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-[#070707]/50 border border-gray-200 dark:border-[#ece239]/10 hover:border-[#ece239]/20 transition-all duration-300 group/item">
                  <div className="w-2 h-2 bg-[#ece239] rounded-full mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-[#f5f5f5] mb-1 transition-colors duration-300">
                      View profiles
                    </p>
                    <p className="text-xs text-gray-500 dark:text-[#a0a0a0] transition-colors duration-300">
                      Click any result to see their profile
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-[#070707]/50 border border-gray-200 dark:border-[#c76191]/10 hover:border-[#c76191]/20 transition-all duration-300 group/item">
                  <div className="w-2 h-2 bg-[#c76191] rounded-full mt-2 flex-shrink-0 group-hover/item:scale-125 transition-transform"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-[#f5f5f5] mb-1 transition-colors duration-300">
                      Partial matches
                    </p>
                    <p className="text-xs text-gray-500 dark:text-[#a0a0a0] transition-colors duration-300">
                      Use partial names for better results
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Results Grid */}
        {searchUsers.length > 0 && !isSearchActive && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#27dc66]/10 border border-[#27dc66]/20">
                  <TrendingUp className="w-5 h-5 text-[#27dc66]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-[#f5f5f5] transition-colors duration-300">
                  Search Results
                </h3>
                <span className="px-3 py-1 text-xs font-medium bg-[#4790fd]/10 text-[#4790fd] rounded-full border border-[#4790fd]/20">
                  {searchUsers.length}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchUsers.map((userItem, index) => (
                <div
                  key={userItem._id}
                  className="relative group cursor-pointer"
                  onClick={() => handleUserClick(userItem._id)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Gradient blur background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4790fd]/10 via-[#c76191]/5 to-[#27dc66]/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>

                  {/* Card */}
                  <div className="relative bg-white/80 dark:bg-[#040404]/80 backdrop-blur-2xl rounded-2xl border border-gray-200 dark:border-[#4790fd]/20 overflow-hidden shadow-xl dark:shadow-xl hover:shadow-[#4790fd]/20 hover:border-[#4790fd]/30 transition-all duration-500 hover:scale-[1.02]">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ece239]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    <div className="relative p-5">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-[#4790fd]/40 group-hover:ring-[#4790fd]/60 transition-all duration-300 shadow-lg shadow-[#4790fd]/20">
                            <img
                              src={
                                userItem.profileImage || "/default-avatar.png"
                              }
                              alt={`${userItem.fullName}'s avatar`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.target.style.display = "none";
                                if (e.target.nextSibling) {
                                  e.target.nextSibling.style.display = "flex";
                                }
                              }}
                            />
                            <div className="hidden w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#070707] dark:to-[#040404] items-center justify-center ring-2 ring-[#4790fd]/40">
                              <User size={28} className="text-[#4790fd]" />
                            </div>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#27dc66] rounded-full border-2 border-white dark:border-[#040404] shadow-lg"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-[#f5f5f5] text-lg group-hover:text-[#4790fd] transition-colors duration-300 truncate">
                            {userItem.fullName}
                          </p>
                          {userItem.username && (
                            <p className="text-sm text-gray-500 dark:text-[#a0a0a0] truncate">
                              @{userItem.username}
                            </p>
                          )}
                          {userItem.role && (
                            <span className="inline-block mt-1.5 px-2.5 py-1 text-xs font-medium bg-[#27dc66]/10 text-[#27dc66] rounded-full border border-[#27dc66]/20">
                              {userItem.role}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#4790fd]/10">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#a0a0a0]">
                          <Users className="w-4 h-4 text-[#4790fd]" />
                          <span>View Profile</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-[#4790fd] group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
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
