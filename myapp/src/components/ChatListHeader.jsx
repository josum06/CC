import React from "react";
import { useNavigate } from "react-router-dom";

const ChatListHeader = ({ searchQuery, setSearchQuery, setShowCreateGroup }) => {
  const navigate = useNavigate();

  return (
    <div className="px-3 py-3 bg-black/80 border-b border-white/10">
      {/* Profile and actions */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 shadow-md shadow-black/70">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=MyProfile"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <span className="block text-sm font-semibold text-white truncate">
              My Profile
            </span>
            <span className="text-[11px] text-[#27dc66]">Available</span>
          </div>
        </div>
        <div className="flex items-center space-x-1.5">
          {/* Add New Group Button */}
          <button
            onClick={() => setShowCreateGroup(true)}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/40 transition-all duration-300"
            title="Create new group"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
          {/* Close Button */}
          <button
            onClick={() => navigate("/Network")}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/40 transition-all duration-300"
            title="Close chats"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2 pl-9 pr-3 bg-white/5 text-xs text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#4790fd]/60 border border-white/10 placeholder:text-white/40 transition-all duration-300"
        />
        <svg
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
};

export default ChatListHeader;