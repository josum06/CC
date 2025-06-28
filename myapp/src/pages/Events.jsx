import React, { useState, useEffect, useRef } from "react";
import EventCard from "../components/EventCard";
import { Loader2, X, Calendar } from "lucide-react";
import axios from "axios";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const observerTarget = useRef(null);
  const observerRef = useRef(null);
  const LIMIT = 10; // same limit as on the server

  // Refs to hold the latest values
  const hasMoreRef = useRef(hasMore);
  const loadingRef = useRef(loading);
  const pageRef = useRef(page);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  const fetchEvents = async () => {
    // Prevent duplicate calls if a fetch is already in progress
    if (loadingRef.current) return;

    // Capture the current page and immediately update it for the next call
    const currentPage = pageRef.current;
    pageRef.current = currentPage + 1;
    setPage(currentPage + 1);

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/admin-post/get-post?page=${currentPage}&category=Event`
      );
      const newEvents = response.data.post;

      // If fewer events than expected are returned, mark that no more data is available.
      if (newEvents.length < LIMIT) {
        setHasMore(false);
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      }

      // Append the new events
      if (newEvents.length > 0) {
        setEvents((prev) => [...prev, ...newEvents]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Set up the observer once
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreRef.current &&
          !loadingRef.current
        ) {
          fetchEvents();
        }
      },
      { threshold: 0.5 }
    );
    observerRef.current = observer;

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, []); // run only once

  const openModal = (imageUrl) => setModalImage(imageUrl);
  const closeModal = () => setModalImage(null);

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100">
      {/* Header Section */}
      <div className=" border-b border-gray-500/50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">
            🎉 Events & Activities
          </h1>
          <p className="mt-2 text-gray-400 text-sm sm:text-base">
            Discover what's happening in our community and stay connected
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {events.map((event, index) => (
            <EventCard
              key={event.id || index}
              event={event}
              openModal={openModal}
            />
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center space-x-3 text-blue-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-medium text-gray-300">
                Loading more events...
              </span>
            </div>
          </div>
        )}

        {/* Observer Target */}
        <div ref={observerTarget} className="h-4 w-full" />

        {/* End of Content Message */}
        {!hasMore && events.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">You've reached the end of the list</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-[#232526] rounded-2xl p-8 border border-gray-500/30 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-100 mb-2">
                No Events Yet
              </h3>
              <p className="text-gray-400">
                Check back later for upcoming events and activities
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors p-2"
            >
              <X size={24} />
            </button>
            <img
              src={modalImage}
              alt="Event"
              className="w-full h-auto rounded-xl border border-gray-500/30"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
