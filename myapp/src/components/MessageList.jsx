import React from 'react';
import MessageContent from './MessageContent';

const MessageList = ({ 
  messages, 
  selectedChat, 
  selectedMessages, 
  isTyping,
  handleReplyMessage,
  handleEditMessage,
  setShowEmojiReactionPicker,
  handleStarMessage 
}) => {
  return (
    <div className="flex-1 p-2 md:p-4 overflow-y-auto bg-[#efeae2]">
      <div className="space-y-2 md:space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] md:max-w-[70%] p-2 md:p-3 rounded-lg ${
              msg.sender === 'me' 
                ? 'bg-[#dcf8c6] ml-auto' 
                : 'bg-white'
            }`}>
              <MessageContent 
                message={msg} 
                isSelected={selectedMessages.includes(msg.id)}
                selectedChat={selectedChat}
                handleReplyMessage={handleReplyMessage}
                handleEditMessage={handleEditMessage}
                setShowEmojiReactionPicker={setShowEmojiReactionPicker}
                handleStarMessage={handleStarMessage}
              />
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList; 