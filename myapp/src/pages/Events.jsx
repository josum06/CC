import React, { useState, useEffect, useRef } from 'react';
import EventCard from '../components/EventCard';
import { Loader2, X } from 'lucide-react';
import axios from "axios";
import { Calendar } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [modalImage, setModalImage] = useState(null);
  const observerTarget = useRef(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/events?page=${page}&limit=12`);
      const newEvents = response.data.events;
      
      if (newEvents.length === 0) {
        setHasMore(false);
        return;
      }

      setEvents(prev => [...prev, ...newEvents]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchEvents();
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading]);

  const openModal = (imageUrl) => setModalImage(imageUrl);
  const closeModal = () => setModalImage(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Events & Activities</h1>
          <p className="mt-2 text-lg text-gray-600">Discover what's happening in our community</p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
            <div className="flex items-center space-x-2 text-blue-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-medium">Loading more events...</span>
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
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Yet</h3>
              <p className="text-gray-500">Check back later for upcoming events and activities</p>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={modalImage}
              alt="Event"
              className="w-full h-auto rounded-lg"
              onClick={e => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
