import { useUser } from "@clerk/clerk-react";
import React, { useState } from "react";
import { Calendar, Clock, Download, Eye, User, FileText, Bell, Star, TrendingUp, X } from 'lucide-react';

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
          gradient: "from-[#c76191]/20 via-[#c76191]/10 to-[#c76191]/5",
          border: "border-[#c76191]/30",
          icon: <Bell className="text-[#c76191]" size={16} />,
          badge: "bg-[#c76191]/20 text-[#c76191] border-[#c76191]/30",
          pulse: "animate-pulse"
        };
      case "low":
        return {
          gradient: "from-[#27dc66]/20 via-[#27dc66]/10 to-[#27dc66]/5",
          border: "border-[#27dc66]/30",
          icon: <Star className="text-[#27dc66]" size={16} />,
          badge: "bg-[#27dc66]/20 text-[#27dc66] border-[#27dc66]/30",
          pulse: ""
        };
      default:
        return {
          gradient: "from-[#4790fd]/20 via-[#4790fd]/10 to-[#4790fd]/5",
          border: "border-[#4790fd]/30",
          icon: <FileText className="text-[#4790fd]" size={16} />,
          badge: "bg-[#4790fd]/20 text-[#4790fd] border-[#4790fd]/30",
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
          hover:scale-[1.01] hover:shadow-xl hover:shadow-[#4790fd]/10
          backdrop-blur-sm bg-[#1a1a1a]/40`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#4790fd]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#c76191]/10 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
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
                className="text-lg sm:text-xl font-bold text-[#f5f5f5] mb-2 line-clamp-2 cursor-pointer
                  hover:text-[#4790fd] transition-colors duration-300"
                onClick={handleOpenModal}
              >
                {title}
              </h3>
              <p className="text-[#a0a0a0] text-sm line-clamp-2 font-light">
                {description || "No description available"}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col gap-2 relative z-20">
              <button
                onClick={handleOpenModal}
                className="p-2.5 bg-[#ffffff]/5 hover:bg-[#4790fd]/20 rounded-xl transition-all duration-300
                  text-[#a0a0a0] hover:text-[#4790fd] border border-transparent hover:border-[#4790fd]/30"
                title="View Details"
              >
                <Eye size={18} />
              </button>
              <a
                href={fileUrl}
                download
                className="p-2.5 bg-[#ffffff]/5 hover:bg-[#27dc66]/20 rounded-xl transition-all duration-300
                  text-[#a0a0a0] hover:text-[#27dc66] border border-transparent hover:border-[#27dc66]/30"
                title="Download"
              >
                <Download size={18} />
              </a>
            </div>
          </div>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#808080] mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#4790fd]" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#ece239]" />
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-[#27dc66]" />
              <span>{relative}</span>
            </div>
            {department && (
              <span className="px-2.5 py-1 bg-[#ffffff]/5 rounded-full text-[#a0a0a0] text-xs border border-[#ffffff]/10">
                {department}
              </span>
            )}
          </div>

          {/* Author Section */}
          <div className="flex items-center justify-between pt-4 border-t border-[#ffffff]/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={profilePhoto}
                  alt={postedBy}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#4790fd]/20"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-10 h-10 rounded-full bg-[#1a1a1a] 
                  items-center justify-center ring-2 ring-[#4790fd]/20">
                  <User size={18} className="text-[#a0a0a0]" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#27dc66] rounded-full border-2 border-[#070707]"></div>
              </div>
              <div>
                <p className="font-semibold text-[#f5f5f5] text-sm">{postedBy}</p>
                <p className="text-[#a0a0a0] text-xs">{role}</p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-3 text-xs text-[#a0a0a0]">
              <div className="text-center group-hover:scale-110 transition-transform duration-300">
                <div className="font-semibold text-[#4790fd]">📄</div>
                <div>PDF</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4790fd]/0 via-[#4790fd]/5 to-[#c76191]/0 
          opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/80 backdrop-blur-xl flex justify-center items-center z-50 p-4" onClick={handleCloseModal}>
          <div 
            className="bg-[#0a0a0a] rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl border border-[#4790fd]/20 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="p-6 border-b border-[#ffffff]/10 flex-shrink-0 bg-gradient-to-r from-[#4790fd]/5 to-transparent">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#f5f5f5] mb-3">{title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#a0a0a0]">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffffff]/5 border border-[#ffffff]/10">
                      <Calendar size={14} className="text-[#4790fd]" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffffff]/5 border border-[#ffffff]/10">
                      <Clock size={14} className="text-[#ece239]" />
                      {formattedTime}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffffff]/5 border border-[#ffffff]/10">
                      <User size={14} className="text-[#c76191]" />
                      {postedBy}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 bg-[#ffffff]/5 hover:bg-[#c76191]/20 rounded-full transition-all duration-300
                    text-[#a0a0a0] hover:text-[#c76191] border border-transparent hover:border-[#c76191]/30"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-6">
                {/* Description Box */}
                <div className="bg-[#1a1a1a]/50 rounded-2xl p-6 mb-6 border border-[#ffffff]/5">
                  <h3 className="text-[#4790fd] font-semibold mb-3 flex items-center gap-2">
                    <FileText size={18} />
                    Description
                  </h3>
                  <p className="text-[#d0d0d0] leading-relaxed whitespace-pre-wrap">
                    {description || "No detailed description available for this notice."}
                  </p>
                </div>

                {/* PDF Viewer */}
                <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#ffffff]/10 shadow-lg min-h-[500px]">
                  <iframe
                    src={fileUrl}
                    title="Notice PDF"
                    className="w-full h-[600px] sm:h-[700px]"
                    style={{ border: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#ffffff]/10 bg-[#0a0a0a] flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 rounded-xl text-[#a0a0a0] hover:bg-[#ffffff]/5 transition-colors font-medium"
              >
                Close
              </button>
              <a
                href={fileUrl}
                download
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4790fd] to-[#27dc66] text-black font-bold
                  hover:opacity-90 transition-opacity shadow-lg shadow-[#4790fd]/20 flex items-center gap-2"
              >
                <Download size={18} />
                Download PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NoticeCard;
