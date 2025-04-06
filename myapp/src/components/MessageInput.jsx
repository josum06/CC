import React from 'react';
import EmojiPicker from 'emoji-picker-react';

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
  setPreviewUrl
}) => {
  return (
    <>
      {/* File preview */}
      {selectedFile && (
        <div className="p-2 bg-white border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded" />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
              <span className="text-sm font-medium">{selectedFile.name}</span>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className="text-red-500 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Message input form */}
      <form onSubmit={handleSendMessage} className="p-2 md:p-4 bg-white">
        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Emoji Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              title="Emoji"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-16 left-0 md:bottom-12 md:left-0 z-50">
                <div className="max-h-[50vh] overflow-y-auto">
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      setMessage(prev => prev + emojiData.emoji);
                      setShowEmojiPicker(false);
                    }}
                    width={window.innerWidth < 768 ? '300px' : '350px'}
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
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              title="Attach"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            {attachmentMenuOpen && (
              <div className="absolute bottom-16 left-0 md:bottom-12 md:left-0 bg-white rounded-lg shadow-lg p-2 z-50">
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current.click();
                      setAttachmentMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded w-full"
                  >
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Photo/Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      fileInputRef.current.click();
                      setAttachmentMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded w-full"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
            className="flex-1 p-2 md:p-3 text-sm md:text-base bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Send Button */}
          <button
            type="submit"
            className="p-2 text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors duration-150"
            title="Send"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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
            if (file.type.startsWith('image/')) {
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