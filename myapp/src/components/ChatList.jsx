import React from "react";
import { useNavigate } from "react-router-dom";

const ChatList = ({ chats, onChatSelect }) => {
  const navigate = useNavigate();

  const handleChatClick = (chat) => {
    onChatSelect(chat);
    navigate(`/chat/${chat.id}`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-black/70 custom-scrollbar">
      {chats.map((chat) => (
        <button
          key={chat.id}
          type="button"
          onClick={() => handleChatClick(chat)}
          className="w-full flex items-center px-3 py-2.5 hover:bg-white/5 cursor-pointer border-b border-white/5 transition-all duration-200"
        >
          <div className="relative flex-shrink-0">
            <img
              src={
                chat.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name}`
              }
              alt={chat.name}
              className="w-10 h-10 rounded-full object-cover border border-white/10 shadow-md shadow-black/70"
            />
            {chat.online && (
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#27dc66] rounded-full border border-black shadow-[0_0_8px_rgba(39,220,102,0.9)]"></div>
            )}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-white truncate">
                {chat.name}
              </h3>
              <span className="text-[11px] text-white/40">
                {chat.lastMessage?.time}
              </span>
            </div>
            <div className="mt-0.5 flex justify-between items-center gap-2">
              <p className="text-[11px] text-white/60 truncate max-w-[200px]">
                {chat.lastMessage?.text || "No messages yet"}
              </p>
              {chat.unreadCount > 0 && (
                <span className="ml-2 inline-flex min-w-[1.3rem] h-4 items-center justify-center rounded-full bg-[#4790fd] text-[10px] font-semibold text-white shadow-sm shadow-[#4790fd]/70">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ChatList;
