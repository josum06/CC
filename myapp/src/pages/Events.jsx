import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import axios from "axios";

const Event = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState("");
  const [eventData, setEventData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // ✅ Fetch posts whenever 'page' changes
  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const fetchPosts = async (pageNum) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/admin-post/get-post?page=${pageNum}&limit=10&category=Event`
      );
      const newPosts = res.data.post;

      if (newPosts.length < 10) {
        setHasMore(false); // No more posts to load
      }

      setEventData((prev) =>
        pageNum === 1 ? newPosts : [...prev, ...newPosts]
      );
    } catch (err) {
      console.error("Error fetching eventData:", err);
    }
  };

  const loadMorePosts = () => {
    setPage((prevPage) => prevPage + 1); // This will trigger useEffect, which fetches posts
  };

  const openModal = (poster) => {
    setSelectedPoster(poster);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPoster("");
  };

  return (
    <div className="min-h-screen p-6 flex flex-wrap gap-6 justify-center items-center">
      {eventData.map((event, index) => (
        <EventCard key={index} event={event} openModal={openModal} />
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

      {hasMore && (
        <button
          onClick={loadMorePosts}
          className="mt-5 bg-blue-500 text-white p-2 rounded-lg"
        >
          See More
        </button>
      )}
    </div>
  );
};

export default Event;
