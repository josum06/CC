import React from 'react';
import { format } from 'date-fns';

const MediaGallery = ({ 
  selectedChat, 
  setShowMediaGallery, 
  mediaFilter, 
  setMediaFilter,
  setSelectedImage,
  setShowImagePreview 
}) => {
  const getFilteredMedia = () => {
    if (!selectedChat?.messages) return [];
    
    return selectedChat.messages.filter(msg => {
      if (mediaFilter === 'all') {
        return msg.type === 'image' || msg.type === 'video' || msg.type === 'file';
      }
      return msg.type === mediaFilter;
    });
  };

  const renderMediaItem = (item) => {
    switch (item.type) {
      case 'image':
        return (
          <div 
            className="relative group cursor-pointer"
            onClick={() => {
              setSelectedImage(item.content);
              setShowImagePreview(true);
            }}
          >
            <img 
              src={item.content} 
              alt="Shared media" 
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              {format(new Date(item.time), 'MMM d, yyyy')}
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div className="relative group cursor-pointer">
            <video 
              src={item.content} 
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        );
      
      case 'file':
        return (
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <p className="font-medium truncate">{item.fileName}</p>
              <p className="text-sm text-gray-500">
                {(item.fileSize / 1024).toFixed(1)} KB • {format(new Date(item.time), 'MMM d, yyyy')}
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
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowMediaGallery(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold">Shared Media</h2>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setMediaFilter('all')}
            className={`px-4 py-2 rounded ${
              mediaFilter === 'all' ? 'bg-green-500 text-white' : 'bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setMediaFilter('image')}
            className={`px-4 py-2 rounded ${
              mediaFilter === 'image' ? 'bg-green-500 text-white' : 'bg-gray-100'
            }`}
          >
            Images
          </button>
          <button
            onClick={() => setMediaFilter('video')}
            className={`px-4 py-2 rounded ${
              mediaFilter === 'video' ? 'bg-green-500 text-white' : 'bg-gray-100'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setMediaFilter('file')}
            className={`px-4 py-2 rounded ${
              mediaFilter === 'file' ? 'bg-green-500 text-white' : 'bg-gray-100'
            }`}
          >
            Documents
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filteredMedia.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            {filteredMedia.map((item) => (
              <div key={item.id}>
                {renderMediaItem(item)}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>No media found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaGallery; 