import React from 'react';

const ChatList = ({ chats, selectedChat, setSelectedChat }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map(chat => (
        <div 
          key={chat.id} 
          onClick={() => setSelectedChat(chat)}
          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
            selectedChat?.id === chat.id ? 'bg-gray-100' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={chat.avatar} 
                alt={chat.name} 
                className="w-12 h-12 rounded-full" 
              />
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <h3 className="font-semibold truncate">{chat.name}</h3>
                <span className="text-sm text-gray-500">{chat.time}</span>
              </div>
              <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
            </div>
            {chat.unread > 0 && (
              <span className="bg-green-500 text-white rounded-full px-2 py-1 text-xs">
                {chat.unread}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList; 