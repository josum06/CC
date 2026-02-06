import React from "react";
import { format } from "date-fns";

const MediaGallery = ({
  selectedChat,
  setShowMediaGallery,
  mediaFilter,
  setMediaFilter,
  setSelectedImage,
  setShowImagePreview,
}) => {
  const getFilteredMedia = () => {
    if (!selectedChat?.messages) return [];

    return selectedChat.messages.filter((msg) => {
      if (mediaFilter === "all") {
        return (
          msg.type === "image" || msg.type === "video" || msg.type === "file"
        );
      }
      return msg.type === mediaFilter;
    });
  };

  const renderMediaItem = (item) => {
    switch (item.type) {
      case "image":
        return (
          <button
            type="button"
            className="relative group cursor-pointer w-full"
            onClick={() => {
              setSelectedImage(item.content);
              setShowImagePreview(true);
            }}
          >
            <img
              src={item.content}
              alt="Shared media"
              className="w-full h-32 object-cover rounded-2xl border border-white/10"
            />
            <div className="absolute inset-0 rounded-2xl bg-black/30 opacity-0 group-hover:opacity-100 flex items-end justify-between px-2 pb-1.5 text-[10px] text-white transition-opacity">
              <span className="bg-black/60 px-2 py-0.5 rounded-full">
                Image
              </span>
              <span className="bg-black/60 px-2 py-0.5 rounded-full">
                {format(new Date(item.time), "MMM d, yyyy")}
              </span>
            </div>
          </button>
        );

      case "video":
        return (
          <div className="relative group cursor-pointer w-full">
            <video
              src={item.content}
              className="w-full h-32 object-cover rounded-2xl border border-white/10"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        );

      case "file":
        return (
          <div className="flex items-center space-x-3 p-3 bg-black/70 rounded-2xl border border-white/10">
            <svg
              className="w-7 h-7 text-[#ece239]"
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
            <div className="min-w-0">
              <p className="font-medium text-sm text-white truncate">
                {item.fileName}
              </p>
              <p className="text-[11px] text-slate-300">
                {(item.fileSize / 1024).toFixed(1)} KB •{" "}
                {format(new Date(item.time), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const filteredMedia = getFilteredMedia();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-2xl">
      <div className="px-4 py-3 md:px-6 md:py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowMediaGallery(false)}
            className="p-1.5 md:p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
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
          <div>
            <h2 className="text-sm md:text-base font-semibold text-white">
              Shared Media
            </h2>
            <p className="text-[11px] text-slate-300">
              {selectedChat?.name || "Conversation"}
            </p>
          </div>
        </div>

        <div className="flex space-x-1.5 md:space-x-2 text-[11px] md:text-xs">
          {[
            { id: "all", label: "All" },
            { id: "image", label: "Images" },
            { id: "video", label: "Videos" },
            { id: "file", label: "Documents" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setMediaFilter(btn.id)}
              className={`px-2.5 py-1 rounded-full border text-xs transition-all duration-200 ${
                mediaFilter === btn.id
                  ? "bg-gradient-to-r from-[#4790fd] to-[#27dc66] border-transparent text-white shadow-sm shadow-[#4790fd]/40"
                  : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-white/40"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {filteredMedia.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {filteredMedia.map((item) => (
              <div key={item.id}>{renderMediaItem(item)}</div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <svg
              className="w-14 h-14 mb-3 text-slate-500"
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
            <p className="text-sm">No media found in this chat yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaGallery;
