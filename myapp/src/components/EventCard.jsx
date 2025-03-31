import { format, parseISO } from "date-fns";
import React from "react";

const EventCard = ({ event, openModal }) => {
  return (
    <div className="w-full max-w-[200px] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white">
      {/* Poster */}
      <div
        className="relative w-full pt-[140%] overflow-hidden rounded-t-xl cursor-pointer"
        onClick={() => openModal(event.imageUrl)}
      >
        {!event.imageUrl ? (
          <div className="flex absolute inset-2 justify-center items-center">
            {event.content}
          </div>
        ) : (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        )}
      </div>

      {/* Event Details */}
      <div className="p-3">
        <h2 className="text-sm font-semibold">{event.title}</h2>
        <p className="text-xs text-gray-500">
          Posted on:{" "}
          {format(parseISO(event?.createdAt), "dd MMM yyyy, hh:mm a")}
        </p>

        <div className="flex items-center mt-2">
          <img
            src={event.author.profileImage}
            alt={event.author.fullName}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <p className="text-xs font-medium">{event?.author.fullName}</p>
            <p className="text-xs text-gray-500">{event?.author.designation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
