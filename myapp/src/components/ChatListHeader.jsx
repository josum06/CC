import React from 'react';
import { useNavigate } from "react-router-dom";

const ChatListHeader = ({ searchQuery, setSearchQuery, setShowCreateGroup }) => {
  const navigate = useNavigate();

  return (
    <div className="p-3 bg-[#111b21] border-b border-[#2a3942]">
      {/* Profile and Close Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=MyProfile" 
              alt="profile" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="font-medium text-[#e9edef]">My Profile</span>
        </div>
        <div className="flex items-center space-x-2">
          {/* Add New Group Button */}
          <button
            onClick={() => setShowCreateGroup(true)}
            className="p-2 text-[#8696a0] hover:text-[#e9edef] hover:bg-[#2a3942] rounded-full"
            title="Create New Group"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 4v16m8-8H4" />
            </svg>
          </button>
          {/* Close Button */}
          <button 
            onClick={() => navigate("/Home")} 
            className="p-2 text-[#8696a0] hover:text-[#e9edef] hover:bg-[#2a3942] rounded-full"
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
          className="w-full p-2 pl-10 bg-[#202c33] text-[#e9edef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a884] placeholder-[#8696a0]"
        />
        <svg 
          className="w-5 h-5 absolute left-3 top-3 text-[#8696a0]" 
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