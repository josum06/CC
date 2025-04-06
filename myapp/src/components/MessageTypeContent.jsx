import React from 'react';

const MessageTypeContent = ({ message, setSelectedImage, setShowImagePreview }) => {
  switch (message.type) {
    case 'text':
      return <p className="text-gray-800">{message.text}</p>;
      
    case 'image':
      return (
        <div 
          className="cursor-pointer" 
          onClick={() => {
            setSelectedImage(message.content);
            setShowImagePreview(true);
          }}
        >
          <img 
            src={message.content} 
            alt="Shared" 
            className="max-w-[200px] rounded-lg" 
          />
        </div>
      );
      
    case 'file':
      return (
        <div className="flex items-center space-x-2 bg-white/50 p-2 rounded">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <div>
            <p className="text-sm font-medium">{message.fileName}</p>
            <p className="text-xs text-gray-500">
              {(message.fileSize / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      );
      
    default:
      // For messages without a specific type or legacy messages
      return <p className="text-gray-800">{message.text}</p>;
  }
};

export default MessageTypeContent; 