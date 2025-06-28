import { useUser } from "@clerk/clerk-react";
import React, { useState } from "react";
import { Calendar, Clock, Download, X, Eye, User, FileText, Bell, Star, TrendingUp } from 'lucide-react';

const NoticeCard = ({ title, date, postedBy, profilePhoto, role, fileUrl, description, department, priority = "normal" }) => {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "high":
        return {
          gradient: "from-red-500/20 via-red-600/10 to-red-700/5",
          border: "border-red-500/30",
          icon: <Bell className="text-red-400" size={16} />,
          badge: "bg-red-500/20 text-red-300 border-red-400/30",
          pulse: "animate-pulse"
        };
      case "low":
        return {
          gradient: "from-blue-500/20 via-blue-600/10 to-blue-700/5",
          border: "border-blue-500/30",
          icon: <Star className="text-blue-400" size={16} />,
          badge: "bg-blue-500/20 text-blue-300 border-blue-400/30",
          pulse: ""
        };
      default:
        return {
          gradient: "from-gray-500/20 via-gray-600/10 to-gray-700/5",
          border: "border-gray-500/30",
          icon: <FileText className="text-gray-400" size={16} />,
          badge: "bg-gray-500/20 text-gray-300 border-gray-400/30",
          pulse: ""
        };
    }
  };

  const priorityConfig = getPriorityConfig(priority);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      relative: diffDays === 1 ? 'Today' : diffDays === 2 ? 'Yesterday' : `${diffDays} days ago`
    };
  };

  const { date: formattedDate, time: formattedTime, relative } = formatDate(date);

  return (
    <>
      {/* Modern Notice Card */}
      <div
        className={`group relative overflow-hidden rounded-2xl transition-all duration-500 ease-out
          bg-gradient-to-br ${priorityConfig.gradient} 
          border ${priorityConfig.border} 
          hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/30
          transform hover:-translate-y-1`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-white/20 to-transparent rounded-full blur-2xl"></div>
        </div>

        {/* Priority Badge */}
        {/* <div className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full 
          ${priorityConfig.badge} border backdrop-blur-sm ${priorityConfig.pulse} z-10`}>
          {priorityConfig.icon}
          <span className="text-xs font-medium capitalize">{priority}</span>
        </div> */}

        {/* Main Content */}
        <div className="relative p-6">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-4">
              <h3 
                className="text-lg sm:text-xl font-bold text-gray-100 mb-2 line-clamp-2 cursor-pointer
                  hover:text-blue-400 transition-colors duration-300"
                onClick={handleOpenModal}
              >
                {title}
              </h3>
              <p className="text-gray-300 text-sm line-clamp-2">
                {description || "No description available"}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-2 relative z-20">
              <button
                onClick={handleOpenModal}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300
                  text-gray-300 hover:text-blue-400 backdrop-blur-sm"
                title="View Details"
              >
                <Eye size={18} />
              </button>
              <a
                href={fileUrl}
                download
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300
                  text-gray-300 hover:text-green-400 backdrop-blur-sm"
                title="Download"
              >
                <Download size={18} />
              </a>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-500" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-gray-500" />
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-gray-500" />
              <span>{relative}</span>
            </div>
            {department && (
              <span className="px-2.5 py-1 bg-white/10 rounded-full text-gray-300 text-xs backdrop-blur-sm">
                {department}
              </span>
            )}
          </div>

          {/* Author Section */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={profilePhoto}
                  alt={postedBy}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 
                  items-center justify-center ring-2 ring-white/20">
                  <User size={18} className="text-gray-300" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <div>
                <p className="font-semibold text-gray-100 text-sm">{postedBy}</p>
                <p className="text-gray-400 text-xs">{role}</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="text-center">
                <div className="font-semibold text-gray-200">📄</div>
                <div>PDF</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 
          opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#232526] to-[#000000] rounded-2xl w-full max-w-5xl 
            max-h-[95vh] overflow-hidden shadow-2xl border border-gray-500/30">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-500/30 ">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-6">
                  
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2">{title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {formattedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp size={16} />
                      {relative}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 200px)' }}>
              {description && (
                <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
                    <FileText size={20} className="text-blue-400" />
                    Description
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{description}</p>
                </div>
              )}

              {/* Document Preview */}
              <div className=" rounded-xl overflow-hidden ">
                <div className="p-4  ">
                  <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
                    <FileText size={20} className="text-blue-400" />
                    Document Preview
                  </h3>
                </div>
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
                    className="w-full h-auto border border-white/20 rounded-lg overflow-hidden"
                  />
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-500/30 ">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={profilePhoto}
                      alt={postedBy}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-12 h-12 rounded-full
                      items-center justify-center ring-2 ring-white/20">
                      <User size={24} className="text-gray-300" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-100">{postedBy}</p>
                    <p className="text-gray-400 text-sm">{role}</p>
                  </div>
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
