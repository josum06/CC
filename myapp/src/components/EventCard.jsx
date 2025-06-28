import { format, parseISO } from "date-fns";
import React, { useState } from "react";
import { Calendar, Clock, MapPin, User, Eye, ExternalLink } from 'lucide-react';

const EventCard = ({ event, openModal }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      fullDate: format(parseISO(dateString), "EEEE, dd MMM yyyy"),
      relative: diffDays === 1 ? 'Today' : diffDays === 2 ? 'Tomorrow' : diffDays === 0 ? 'Today' : `${diffDays} days away`
    };
  };

  const { date: formattedDate, time: formattedTime, fullDate, relative } = formatDate(event?.createdAt);

  return (
    <div 
      className="group relative overflow-hidden rounded-2xl transition-all duration-500 ease-out
        bg-gradient-to-br from-purple-500/20 via-purple-600/10 to-purple-700/5 
        border border-purple-500/30 hover:border-purple-400/50
        hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20
        transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-2xl"></div>
      </div>

      {/* Event Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full 
        bg-purple-500/20 text-purple-300 border border-purple-400/30 backdrop-blur-sm">
        <span className="text-xs font-medium">🎉 Event</span>
      </div>

      {/* Poster with Hover Effect */}
      <div
        className="relative aspect-[3/4] overflow-hidden cursor-pointer"
        onClick={() => openModal(event.imageUrl)}
      >
        {!event.imageUrl ? (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 p-6 flex items-center justify-center text-white text-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-lg font-medium">{event.title}</p>
            </div>
          </div>
        ) : (
          <>
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        )}

        {/* Event Date Badge */}
        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20">
          <div className="text-center">
            <span className="block text-lg font-bold text-purple-300">
              {format(parseISO(event?.createdAt), "dd")}
            </span>
            <span className="block text-xs text-gray-300">
              {format(parseISO(event?.createdAt), "MMM")}
            </span>
          </div>
        </div>

        {/* View Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
            <Eye size={24} />
          </button>
        </div>
      </div>

      {/* Event Details */}
      <div className="relative p-4 sm:p-6">
        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-gray-100 mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors cursor-pointer"
            onClick={() => openModal(event.imageUrl)}>
          {event.title}
        </h2>

        {/* Meta Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-400">
            <Calendar size={14} className="mr-2 text-gray-500" />
            <span>{fullDate}</span>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <Clock size={14} className="mr-2 text-gray-500" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <span className="px-2 py-1 bg-purple-500/20 rounded-full text-purple-300 text-xs">
              {relative}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center text-sm text-gray-400">
              <MapPin size={14} className="mr-2 text-gray-500" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {/* Author Information */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={event.author.profileImage}
                alt={event.author.fullName}
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
              <p className="font-semibold text-gray-100 text-sm">{event?.author.fullName}</p>
              <p className="text-gray-400 text-xs">{event?.author.designation}</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="text-center">
              <div className="font-semibold text-purple-300">📅</div>
              <div>Event</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 
        opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};

export default EventCard;
