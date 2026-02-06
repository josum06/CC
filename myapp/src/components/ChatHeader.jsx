import React from "react";

// Shared theme colors
const CC_BLUE = "#4790fd";
const CC_PINK = "#c76191";
const CC_GREEN = "#27dc66";

const ChatHeader = ({
  selectedChat,
  setShowMediaGallery,
  setShowGroupInfo,
  onBackClick,
}) => {
  if (!selectedChat) return null;

  return (
    <div className="relative px-3 py-2.5 md:px-4 md:py-3 flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-black via-black/90 to-black/80">
      <div className="flex items-center space-x-3">
        <button
          onClick={onBackClick}
          className="md:hidden p-1.5 -ml-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="relative">
          <img
            src={selectedChat.avatar}
            alt={selectedChat.name}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border border-white/10 shadow-md shadow-black/70"
          />
          {selectedChat.online && (
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#27dc66] rounded-full border border-black shadow-[0_0_8px_rgba(39,220,102,0.9)]"></div>
          )}
        </div>
        <div className="min-w-0">
          <span className="block text-sm font-semibold text-white truncate">
            {selectedChat.name}
          </span>
          <p className="text-[11px] text-[#27dc66]">
            {selectedChat.online ? "Online" : "Last seen recently"}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1.5 md:space-x-2">
        <button
          onClick={() => setShowMediaGallery(true)}
          className="p-1.5 md:p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/40 transition-all duration-300"
          title="Shared media"
        >
          <svg
            className="w-4 h-4 md:w-5 md:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>

        {selectedChat.isGroup && (
          <button
            onClick={() => setShowGroupInfo(true)}
            className="p-1.5 md:p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/40 transition-all duration-300"
            title="Group info"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;