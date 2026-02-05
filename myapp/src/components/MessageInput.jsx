import React from "react";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({
  message,
  setMessage,
  handleSendMessage,
  handleTyping,
  showEmojiPicker,
  setShowEmojiPicker,
  attachmentMenuOpen,
  setAttachmentMenuOpen,
  fileInputRef,
  selectedFile,
  previewUrl,
  setSelectedFile,
  setPreviewUrl,
}) => {
  return (
    <>
      {/* File preview */}
      {selectedFile && (
        <div className="px-3 py-2 bg-black/80 border-t border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded-lg border border-white/10"
                />
              ) : (
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                  <svg
                    className="w-6 h-6 text-white/50"
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
                </div>
              )}
              <span className="text-xs md:text-sm font-medium text-white truncate">
                {selectedFile.name}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className="text-white/60 hover:text-white text-sm px-2 py-1 rounded-full hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Message input form */}
      <form
        onSubmit={handleSendMessage}
        className="px-3 py-2.5 md:px-4 md:py-3 bg-black/90 border-t border-white/10"
      >
        <div className="flex items-center gap-2 md:gap-3">
          {/* Emoji Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1.5 md:p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 border border-white/10 hover:border-white/40 transition-all duration-300"
              title="Emoji"
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
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-14 left-0 z-50 shadow-[0_0_30px_rgba(0,0,0,0.9)]">
                <div className="max-h-[55vh] overflow-y-auto rounded-2xl border border-white/10 bg-black/95">
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      setMessage((prev) => prev + emojiData.emoji);
                      setShowEmojiPicker(false);
                    }}
                    width={window.innerWidth < 768 ? "280px" : "340px"}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Attachment Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}
              className="p-1.5 md:p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 border border-white/10 hover:border-white/40 transition-all duration-300"
              title="Attach"
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
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>
            {attachmentMenuOpen && (
              <div className="absolute bottom-14 left-0 bg-black/95 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.9)] p-2 border border-white/10 z-50">
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current.click();
                      setAttachmentMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/10 rounded-lg w-full text-xs text-white"
                  >
                    <svg
                      className="w-4 h-4 text-[#4790fd]"
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
                    <span>Photo / Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current.click();
                      setAttachmentMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/10 rounded-lg w-full text-xs text-white"
                  >
                    <svg
                      className="w-4 h-4 text-[#ece239]"
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
                    <span>Document</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message"
            className="flex-1 px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm bg-white/5 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#4790fd]/60 border border-white/10 placeholder:text-white/40"
          />

          {/* Send Button */}
          <button
            type="submit"
            className="px-3 py-2 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium text-white shadow-md shadow-[#4790fd]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
            style={{
              background: message.trim()
                ? "linear-gradient(135deg, #4790fd, #27dc66)"
                : "rgba(15,23,42,0.9)",
            }}
            disabled={!message.trim()}
            title="Send"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setSelectedFile(file);
            if (file.type.startsWith("image/")) {
              const reader = new FileReader();
              reader.onload = () => setPreviewUrl(reader.result);
              reader.readAsDataURL(file);
            }
          }
        }}
        className="hidden"
        accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      />
    </>
  );
};

export default MessageInput;