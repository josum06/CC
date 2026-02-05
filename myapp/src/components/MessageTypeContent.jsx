import React from "react";

const MessageTypeContent = ({
  message,
  setSelectedImage,
  setShowImagePreview,
}) => {
  switch (message.type) {
    case "text":
      return (
        <p className="text-[13px] md:text-sm text-slate-50 whitespace-pre-wrap">
          {message.text}
        </p>
      );

    case "image":
      return (
        <div
          className="cursor-pointer group"
          onClick={() => {
            setSelectedImage(message.content);
            setShowImagePreview(true);
          }}
        >
          <div className="relative inline-block">
            <img
              src={message.content}
              alt="Shared"
              className="max-w-[220px] md:max-w-[260px] rounded-2xl border border-white/10 object-cover"
            />
            <div className="absolute inset-0 rounded-2xl bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white transition-opacity">
              Click to expand
            </div>
          </div>
        </div>
      );

    case "file":
      return (
        <div className="flex items-center space-x-2 bg-black/40 border border-white/15 px-3 py-2 rounded-2xl">
          <svg
            className="w-5 h-5 text-[#ece239]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <div>
            <p className="text-xs md:text-sm font-medium text-slate-50">
              {message.fileName}
            </p>
            <p className="text-[10px] text-slate-400">
              {(message.fileSize / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      );

    default:
      // For messages without a specific type or legacy messages
      return (
        <p className="text-[13px] md:text-sm text-slate-50 whitespace-pre-wrap">
          {message.text}
        </p>
      );
  }
};

export default MessageTypeContent;