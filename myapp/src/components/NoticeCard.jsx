import { useUser } from "@clerk/clerk-react";
import React, { useState } from "react";
import { Calendar, Clock, Download, ExternalLink, X, Eye, Share2 } from 'lucide-react';

const NoticeCard = ({ title, date, postedBy, profilePhoto, role, fileUrl, description, department, priority = "normal" }) => {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const priorityStyles = {
    high: "bg-red-50 border-red-200 hover:border-red-300",
    normal: "bg-white border-gray-200 hover:border-gray-300",
    low: "bg-blue-50 border-blue-200 hover:border-blue-300",
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const { date: formattedDate, time: formattedTime } = formatDate(date);

  return (
    <>
      {/* Notice Card */}
      <div
        className={`relative rounded-2xl p-6 border transition-all duration-300 ${priorityStyles[priority]} 
          transform hover:-translate-y-1 hover:shadow-xl`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Priority Indicator */}
        {priority === "high" && (
          <div className="absolute top-4 right-4 flex items-center">
            <span className="animate-ping absolute h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
            <span className="relative rounded-full h-3 w-3 bg-red-500"></span>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Section */}
          <div className="flex-grow space-y-4">
            {/* Title and Quick Actions */}
            <div className="flex justify-between items-start">
              <h2
                className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2"
                onClick={handleOpenModal}
              >
                {title}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleOpenModal}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
                <a
                  href={fileUrl}
                  download
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Download"
                >
                  <Download size={18} />
                </a>
                
              </div>
            </div>

            {/* Description - Now shows full content in card */}
            <p className="text-gray-600">
              {description || "No description provided"}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{formattedTime}</span>
              </div>
              {department && (
                <div className="flex items-center">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                    {department}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Posted By */}
          <div className="flex items-center md:items-start space-x-3">
            <div className="text-right">
              <p className="font-medium text-gray-900">{postedBy}</p>
              <p className="text-sm text-gray-500">{role}</p>
            </div>
            <div className="relative group">
              <img
                src={profilePhoto}
                alt={postedBy}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
              />
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
            </div>
          </div>
        </div>

        {/* Preview Indicator */}
        
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      {formattedTime}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              {description && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{description}</p>
                </div>
              )}

              {/* Document Preview */}
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                {fileUrl?.endsWith('.pdf') ? (
                  <iframe
                    src={fileUrl}
                    className="w-full h-[60vh] border-0"
                    title="Notice PDF"
                  />
                ) : (
                  <img
                    src={fileUrl}
                    alt="Notice"
                    className="w-full h-auto"
                  />
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <img
                    src={profilePhoto}
                    alt={postedBy}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{postedBy}</p>
                    <p className="text-sm text-gray-500">{role}</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  
                  <a
                    href={fileUrl}
                    download
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Download size={18} className="mr-2" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NoticeCard;
