import React from 'react';

const ChatHeader = ({ 
  selectedChat, 
  setShowMediaGallery, 
  setShowGroupInfo,
  onBackClick 
}) => {
  return (
    <div className="p-4 bg-white shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onBackClick}
          className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="relative">
          <img 
            src={selectedChat.avatar} 
            alt={selectedChat.name} 
            className="w-10 h-10 rounded-full" 
          />
          {selectedChat.online && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div>
          <span className="font-semibold">{selectedChat.name}</span>
          <p className="text-xs text-gray-500">
            {selectedChat.online ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowMediaGallery(true)}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Shared media"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        {selectedChat.isGroup && (
          <button
            onClick={() => setShowGroupInfo(true)}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Group info"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatHeader; 