import React, { useEffect, useState } from "react";

import NoticeCard from "../components/NoticeCard";
import axios from "axios";
import { format, parseISO } from "date-fns";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const fetchPosts = async (pageNum) => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/admin-post/get-post?page=${pageNum}&category=Notice`
      );
      const newPost = res.data.post;

      if (newPost.length === 0) {
        setHasMore(false); // No more notices to fetch
        return;
      }

      setNotices((prev) => [...prev, ...newPost]);
      setPage(pageNum);
    } catch (err) {
      console.error("Error fetching notices:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100">
      {/* Header Section */}
      <div className=" border-b border-gray-500/50 px-4 py-6 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto ">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">
            Notices
          </h1>
          <p className="mt-2 text-gray-400 text-sm sm:text-base">
            Stay updated with the latest announcements and important information
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Notices Grid */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8">
          {notices.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No Notices Yet
              </h3>
              <p className="text-gray-500">Check back later for updates</p>
            </div>
          ) : (
            notices.map((notice, index) => (
              <NoticeCard
                key={index}
                title={notice.title}
                date={format(
                  parseISO(notice?.createdAt),
                  "dd MMM yyyy, hh:mm a"
                )}
                postedBy={notice?.author?.fullName}
                profilePhoto={notice?.author?.profileImage}
                role={notice?.author?.designation}
                fileUrl={notice.imageUrl}
              />
            ))
          )}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => fetchPosts(page + 1)}
              className="bg-[#232526] hover:bg-[#2d2f30] text-gray-100 px-6 py-3 rounded-lg border border-gray-500/50 transition-all duration-300 hover:border-gray-400/50 hover:shadow-lg"
            >
              Load More Notices
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notice;
