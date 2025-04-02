// Network.jsx
import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import Group from "../components/Group"; // Import the Group component
import axios from "axios";
import { format, parseISO } from "date-fns";

const Network = () => {
  const [posts, setPost] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const fetchPosts = async (pageNum) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/post/getAll-post?page=${pageNum}`
      );
      const newPost = res.data.post;

      if (newPost.length === 0) {
        setHasMore(false); // No more notices to fetch
        return;
      }

      setPost((prev) => [...prev, ...newPost]);
      setPage(pageNum);
      console.log("Post are:-", newPost);
    } catch (err) {
      console.error("Error fetching notices:", err);
    }
  };

  const groups = [
    { name: "Cat Lovers", members: 150, topic: "Cats and Kittens" },
    { name: "Kittens Club", members: 200, topic: "All About Kittens" },
    // Add more groups as needed
  ];

  return (
    <div className=" min-h-screen py-4 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
        {/* Left Column for Posts */}
        <div className="lg:w-3/4 w-full flex flex-col space-y-6 items-center justify-center">
          <div className=""></div>
          {posts?.map((post, index) => (
            <PostCard
              key={index}
              postId={post._id}
              userId={post?.author?._id}
              avatar={post?.author?.profileImage}
              username={post?.author?.fullName}
              time={format(parseISO(post?.createdAt), "dd MMM yyyy, hh:mm a")}
              content={post.caption}
              imageUrl={post.mediaUrl}
              likes={post.likes}
              comments={post.comments}
            />
          ))}
        </div>

        {/* Separator Line */}
        <div className="w-full lg:w-px  lg:block hidden"></div>

        {/* Right Column for Groups */}
        <div className="lg:w-1/4  w-full flex flex-col space-y-6 ">
          <div className="font-bold text-xl ">Join Community Groups</div>
          {groups.map((group, index) => (
            <Group key={index} group={group} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Network;
