import { format, parseISO } from "date-fns";
import React, { useState } from "react";
import { Calendar, Clock, MapPin, User } from 'lucide-react';

const EventCard = ({ event, openModal }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative w-full sm:w-[280px] rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster with Hover Effect */}
      <div
        className="relative aspect-[3/4] overflow-hidden cursor-pointer"
        onClick={() => openModal(event.imageUrl)}
      >
        {!event.imageUrl ? (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 p-6 flex items-center justify-center text-white text-center">
            <p className="text-lg font-medium">{event.content}</p>
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
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <div className="text-center">
            <span className="block text-sm font-bold text-blue-600">
              {format(parseISO(event?.createdAt), "dd")}
            </span>
            <span className="block text-xs text-gray-600">
              {format(parseISO(event?.createdAt), "MMM")}
            </span>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h2>

          {/* Meta Information */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar size={16} className="mr-2" />
              <span>{format(parseISO(event?.createdAt), "EEEE, dd MMM yyyy")}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={16} className="mr-2" />
              <span>{format(parseISO(event?.createdAt), "hh:mm a")}</span>
            </div>
            {event.location && (
              <div className="flex items-center text-sm text-gray-500">
                <MapPin size={16} className="mr-2" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {/* Author Information */}
          <div className="flex items-center pt-3 border-t border-gray-100">
            <div className="relative group">
              <img
                src={event.author.profileImage}
                alt={event.author.fullName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
              />
              <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{event?.author.fullName}</p>
              <p className="text-xs text-gray-500">{event?.author.designation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
