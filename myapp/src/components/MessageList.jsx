import React from "react";
import MessageContent from "./MessageContent";

const MessageList = ({
  messages,
  selectedChat,
  selectedMessages,
  isTyping,
  handleReplyMessage,
  handleEditMessage,
  setShowEmojiReactionPicker,
  handleStarMessage,
}) => {
  return (
    <div className="flex-1 p-2 md:p-4 overflow-y-auto bg-[#020308]/90 custom-scrollbar">
      <div className="space-y-2 md:space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] px-3 py-2 md:px-4 md:py-2.5 rounded-2xl shadow-md shadow-black/50 ${
                msg.sender === "me"
                  ? "bg-gradient-to-tr from-[#4790fd] to-[#27dc66] text-white rounded-br-md"
                  : "bg-gradient-to-tr from-slate-900/95 via-slate-900/90 to-[#4790fd]/40 text-slate-100 border border-slate-700/70 rounded-bl-md"
              }`}
            >
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
            <div className="bg-slate-900/90 px-3 py-2 rounded-2xl border border-slate-700/70">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;