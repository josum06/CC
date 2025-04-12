import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatList = ({ chats, onChatSelect }) => {
  const navigate = useNavigate();

  const handleChatClick = (chat) => {
    onChatSelect(chat);
    navigate(`/chat/${chat.id}`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#111b21]">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => handleChatClick(chat)}
          className="flex items-center p-3 hover:bg-[#202c33] cursor-pointer border-b border-[#2a3942]"
        >
          <div className="relative">
            <img
              src={chat.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name}`}
              alt={chat.name}
              className="w-12 h-12 rounded-full"
            />
            {chat.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00a884] rounded-full border-2 border-[#111b21]"></div>
            )}
          </div>
          <div className="ml-3 flex-1">
            <div className="flex justify-between items-center">
              <h3 className="text-[#e9edef] font-medium">{chat.name}</h3>
              <span className="text-xs text-[#8696a0]">{chat.lastMessage?.time}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#8696a0] truncate max-w-[200px]">
                {chat.lastMessage?.text || 'No messages yet'}
              </p>
              {chat.unreadCount > 0 && (
                <span className="bg-[#00a884] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;