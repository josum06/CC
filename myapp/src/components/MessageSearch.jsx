import React from 'react';

const MessageSearch = ({ 
  selectedChat, 
  messageSearchQuery, 
  setMessageSearchQuery 
}) => {
  return (
    <div className="absolute inset-0 bg-white z-10 flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            value={messageSearchQuery}
            onChange={(e) => setMessageSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full p-2 pl-10 bg-gray-100 rounded-lg"
          />
          <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {selectedChat.messages
          .filter(msg => msg.text?.toLowerCase().includes(messageSearchQuery.toLowerCase()))
          .map(msg => (
            <div key={msg.id} className="p-2 hover:bg-gray-50 rounded cursor-pointer">
              <p className="text-sm text-gray-500">{msg.sender}</p>
              <p>{msg.text}</p>
              <p className="text-xs text-gray-400">{msg.time}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MessageSearch; 