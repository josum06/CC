import React, { useState, useEffect, useRef } from "react";
import EventCard from "../components/EventCard";
import { Loader2, X, Calendar, Sparkles } from "lucide-react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const observerTarget = useRef(null);
  const observerRef = useRef(null);
  const LIMIT = 10; // same limit as on the server
  const { isDarkMode } = useTheme();

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
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/admin-post/get-post?page=${currentPage}&category=Event`,
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
      { threshold: 0.5 },
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
    <div className="min-h-screen bg-gray-50 dark:bg-[#070707] text-gray-900 dark:text-[#f5f5f5] relative overflow-hidden transition-colors duration-300">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 dark:bg-[#4790fd]/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/5 dark:bg-[#c76191]/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-yellow-500/5 dark:bg-[#ece239]/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-10 pb-8 px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-[#1a1a1a]/50 border border-gray-200 dark:border-[#ece239]/20 mb-6 backdrop-blur-md shadow-sm dark:shadow-none">
          <Sparkles className="w-4 h-4 text-yellow-500 dark:text-[#ece239]" />
          <span className="text-xs font-medium text-gray-600 dark:text-[#a0a0a0] uppercase tracking-wider">Upcoming Activities</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-yellow-500 to-gray-900 dark:from-[#f5f5f5] dark:via-[#ece239] dark:to-[#f5f5f5] mb-4">
          Events & Activities
        </h1>
        <p className="text-gray-600 dark:text-[#a0a0a0] text-lg max-w-2xl mx-auto font-light leading-relaxed">
          Discover what's happening in our community. Join workshops, seminars, and cultural fests.
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
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
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/50 dark:bg-[#1a1a1a]/50 border border-gray-200 dark:border-[#ece239]/20 backdrop-blur-md shadow-sm dark:shadow-none">
              <Loader2 className="w-5 h-5 animate-spin text-yellow-500 dark:text-[#ece239]" />
              <span className="text-sm font-medium text-gray-600 dark:text-[#a0a0a0]">
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
            <div className="inline-block px-4 py-2 rounded-full bg-white/50 dark:bg-[#1a1a1a]/30 border border-gray-200 dark:border-[#ffffff]/5 text-gray-500 dark:text-[#a0a0a0] text-sm shadow-sm dark:shadow-none">
              You've reached the end
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && (
          <div className="text-center py-20 bg-white/50 dark:bg-[#1a1a1a]/30 rounded-3xl border border-gray-200 dark:border-[#ffffff]/5 backdrop-blur-sm max-w-lg mx-auto">
            <div className="w-20 h-20 bg-gray-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200 dark:border-[#ffffff]/10">
              <Calendar className="w-10 h-10 text-yellow-500 dark:text-[#ece239] opacity-50" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-[#f5f5f5] mb-2">
              No Events Yet
            </h3>
            <p className="text-gray-500 dark:text-[#a0a0a0]">
              Check back later for upcoming events and activities
            </p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/90 dark:bg-[#000000]/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-gray-400 hover:text-white dark:text-[#a0a0a0] dark:hover:text-[#f5f5f5] transition-colors p-2 bg-white/10 dark:bg-[#ffffff]/10 rounded-full hover:bg-white/20 dark:hover:bg-[#ffffff]/20"
            >
              <X size={24} />
            </button>
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 dark:border-[#ffffff]/10 bg-black dark:bg-[#000000]">
              <img
                src={modalImage}
                alt="Event"
                className="w-full h-auto max-h-[85vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
