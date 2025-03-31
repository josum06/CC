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
        `http://localhost:3000/api/admin-post/get-post?page=${pageNum}&category=Notice`
      );
      const newPost = res.data.post;

      if (newPost.length === 0) {
        setHasMore(false); // No more notices to fetch
        return;
      }

      setNotices((prev) => [...prev, ...newPost]);
      setPage(pageNum);
      console.log("Post are:-", newPost);
    } catch (err) {
      console.error("Error fetching notices:", err);
    }
  };

  return (
    <div className="p-4 md:p-10  min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Notices</h1>
      <div className="grid gap-6">
        {notices.map((notice, index) => (
          <NoticeCard
            key={index}
            title={notice.title}
            date={format(parseISO(notice?.createdAt), "dd MMM yyyy, hh:mm a")}
            postedBy={notice?.author?.fullName}
            profilePhoto={notice?.author?.profileImage}
            role={notice?.author?.designation}
            fileUrl={notice.imageUrl}
          />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => fetchPosts(page + 1)}
          className="mt-5 bg-blue-500 text-white p-2 rounded-lg"
        >
          See More
        </button>
      )}
    </div>
  );
};

export default Notice;
