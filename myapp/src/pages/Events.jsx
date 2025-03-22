import React, { useState } from "react";
import EventCard from "../components/EventCard";

const Event = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState("");

  const eventData = [
    {
      id: 1,
      poster: "https://marketplace.canva.com/EAFHr6puSmQ/2/0/1131w/canva-dark-grey-minimalist-music-concert-poster-r1nQ0FK9IKY.jpg",
      title: "Tech Fest 2025",
      postedDate: "March 22, 2025",
      postedBy: "John Doe",
      postedRole: "Event Manager",
      profilePhoto: "https://kumospace.mo.cloudinary.net/https://content.kumospace.com/hubfs/brooke-cagle-n1m25jvupEU-unsplash-2.jpg?tx=w_responsive:fallback-max-width_2400;fallback-max-width-mobile_720",
    },
    {
      id: 2,
      poster: "https://marketplace.canva.com/EAFHr6puSmQ/2/0/1131w/canva-dark-grey-minimalist-music-concert-poster-r1nQ0FK9IKY.jpg",
      title: "AI & ML Workshop",
      postedDate: "April 10, 2025",
      postedBy: "Alice Smith",
      postedRole: "Tech Lead",
      profilePhoto: "https://kumospace.mo.cloudinary.net/https://content.kumospace.com/hubfs/brooke-cagle-n1m25jvupEU-unsplash-2.jpg?tx=w_responsive:fallback-max-width_2400;fallback-max-width-mobile_720",
    },
    {
      id: 3,
      poster: "https://marketplace.canva.com/EAFHr6puSmQ/2/0/1131w/canva-dark-grey-minimalist-music-concert-poster-r1nQ0FK9IKY.jpg",
      title: "Startup Pitch 2025",
      postedDate: "May 5, 2025",
      postedBy: "Raj Patel",
      postedRole: "Startup Mentor",
      profilePhoto: "https://kumospace.mo.cloudinary.net/https://content.kumospace.com/hubfs/brooke-cagle-n1m25jvupEU-unsplash-2.jpg?tx=w_responsive:fallback-max-width_2400;fallback-max-width-mobile_720",
    },
    {
      id: 4,
      poster: "https://marketplace.canva.com/EAFHr6puSmQ/2/0/1131w/canva-dark-grey-minimalist-music-concert-poster-r1nQ0FK9IKY.jpg",
      title: "Tech Fest 2025",
      postedDate: "March 22, 2025",
      postedBy: "John Doe",
      postedRole: "Event Manager",
      profilePhoto: "https://kumospace.mo.cloudinary.net/https://content.kumospace.com/hubfs/brooke-cagle-n1m25jvupEU-unsplash-2.jpg?tx=w_responsive:fallback-max-width_2400;fallback-max-width-mobile_720",
    },
    {
      id: 5,
      poster: "https://marketplace.canva.com/EAFHr6puSmQ/2/0/1131w/canva-dark-grey-minimalist-music-concert-poster-r1nQ0FK9IKY.jpg",
      title: "Tech Fest 2025",
      postedDate: "March 22, 2025",
      postedBy: "John Doe",
      postedRole: "Event Manager",
      profilePhoto: "https://kumospace.mo.cloudinary.net/https://content.kumospace.com/hubfs/brooke-cagle-n1m25jvupEU-unsplash-2.jpg?tx=w_responsive:fallback-max-width_2400;fallback-max-width-mobile_720",
    },
    {
      id: 6,
      poster: "https://marketplace.canva.com/EAFHr6puSmQ/2/0/1131w/canva-dark-grey-minimalist-music-concert-poster-r1nQ0FK9IKY.jpg",
      title: "Tech Fest 2025",
      postedDate: "March 22, 2025",
      postedBy: "John Doe",
      postedRole: "Event Manager",
      profilePhoto: "https://kumospace.mo.cloudinary.net/https://content.kumospace.com/hubfs/brooke-cagle-n1m25jvupEU-unsplash-2.jpg?tx=w_responsive:fallback-max-width_2400;fallback-max-width-mobile_720",
    },
     {
      id: 7,
      poster: "https://marketplace.canva.com/EAFHr6puSmQ/2/0/1131w/canva-dark-grey-minimalist-music-concert-poster-r1nQ0FK9IKY.jpg",
      title: "Tech Fest 2025",
      postedDate: "March 22, 2025",
      postedBy: "John Doe",
      postedRole: "Event Manager",
      profilePhoto: "https://kumospace.mo.cloudinary.net/https://content.kumospace.com/hubfs/brooke-cagle-n1m25jvupEU-unsplash-2.jpg?tx=w_responsive:fallback-max-width_2400;fallback-max-width-mobile_720",
    }, {
      id: 8,
      poster: "https://marketplace.canva.com/EAFHr6puSmQ/2/0/1131w/canva-dark-grey-minimalist-music-concert-poster-r1nQ0FK9IKY.jpg",
      title: "Tech Fest 2025",
      postedDate: "March 22, 2025",
      postedBy: "John Doe",
      postedRole: "Event Manager",
      profilePhoto: "https://kumospace.mo.cloudinary.net/https://content.kumospace.com/hubfs/brooke-cagle-n1m25jvupEU-unsplash-2.jpg?tx=w_responsive:fallback-max-width_2400;fallback-max-width-mobile_720",
    }, {
      id: 9,
      poster: "https://marketplace.canva.com/EAFHr6puSmQ/2/0/1131w/canva-dark-grey-minimalist-music-concert-poster-r1nQ0FK9IKY.jpg",
      title: "Tech Fest 2025",
      postedDate: "March 22, 2025",
      postedBy: "John Doe",
      postedRole: "Event Manager",
      profilePhoto: "https://kumospace.mo.cloudinary.net/https://content.kumospace.com/hubfs/brooke-cagle-n1m25jvupEU-unsplash-2.jpg?tx=w_responsive:fallback-max-width_2400;fallback-max-width-mobile_720",
    }, {
      id: 10,
      poster: "https://marketplace.canva.com/EAFHr6puSmQ/2/0/1131w/canva-dark-grey-minimalist-music-concert-poster-r1nQ0FK9IKY.jpg",
      title: "Tech Fest 2025",
      postedDate: "March 22, 2025",
      postedBy: "John Doe",
      postedRole: "Event Manager",
      profilePhoto: "https://kumospace.mo.cloudinary.net/https://content.kumospace.com/hubfs/brooke-cagle-n1m25jvupEU-unsplash-2.jpg?tx=w_responsive:fallback-max-width_2400;fallback-max-width-mobile_720",
    },
  ];

  const openModal = (poster) => {
    setSelectedPoster(poster);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPoster("");
  };

  return (
    
    <div className="min-h-screen p-6  flex flex-wrap gap-6 justify-center items-center">
      
      {eventData.map((event) => (
        <EventCard key={event.id} event={event} openModal={openModal} />
      ))}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-[90vw] max-h-[90vh] relative">
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-red-500"
              onClick={closeModal}
            >
              ✕
            </button>
            <img
              src={selectedPoster}
              alt="Full Poster"
              className="w-[30%] h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Event;
