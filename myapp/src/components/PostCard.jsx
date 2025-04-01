// PostCard.jsx
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Comments from "./Comments";

const PostCard = ({
  avatar,
  username,
  time,
  content,
  imageUrl,
  likes : initialLikes,
  likedByUsers = [], 
  postId,
  userId,
  comments,
}) => {
  const [likes , setLikes] = useState(initialLikes);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(
    likedByUsers.includes(userId)
  );
  const [commentModal, setCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  const inputComment = () => {
    setCommentModal(!commentModal);
  };


  const handleLike = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/post/like/${postId}/like-toggle` , { userId }
      );
      setLikes(response.data.post.likes); // Update likes from backend response
      setLikedByCurrentUser(response.data.hasLiked)
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("text", commentText);
      formData.append("postId", postId);
      formData.append("userId", userId);
      await axios.post(
        "http://localhost:3000/api/post/create-comment",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(`Comment posted successfully!`);

    } catch (e) {
      console.error("Error posting comment:", e);
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mb-4">
      {/* User Info with Three-Dot Menu */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <img
            src={avatar}
            alt="User Avatar"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="text-gray-800 font-semibold">{username}</p>
            <p className="text-gray-500 text-sm">{time}</p>
          </div>
        </div>
        <div className="text-gray-500 cursor-pointer">
          <button className="hover:bg-gray-50 rounded-full p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="7" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="17" r="1" />
            </svg>
          </button>
        </div>
      </div>

      {
        <div className="mb-4">
          <p className="text-gray-800">{content}</p>
        </div>
      }

      {/* Image */}
      <div className="mb-4">
        <img
          src={imageUrl}
          alt="Post Image"
          className="w-full h-48 object-cover rounded-md"
        />
      </div>

      {/* Like and Comment Section */}
      <div className="flex items-center justify-between text-gray-500">
        <div className="flex items-center space-x-2">
          <button 
           onClick={handleLike}
           className="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1">
            <svg
              className="w-5 h-5 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C6.11 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-4.11 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>{likes} {likedByCurrentUser ? "Liked" : "Like"}</span>
          </button>
        </div>
        <button
          onClick={inputComment}
          className="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1"
        >
          <svg
            width="22px"
            height="22px"
            viewBox="0 0 24 24"
            className="w-5 h-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22ZM8 13.25C7.58579 13.25 7.25 13.5858 7.25 14C7.25 14.4142 7.58579 14.75 8 14.75H13.5C13.9142 14.75 14.25 14.4142 14.25 14C14.25 13.5858 13.9142 13.25 13.5 13.25H8ZM7.25 10.5C7.25 10.0858 7.58579 9.75 8 9.75H16C16.4142 9.75 16.75 10.0858 16.75 10.5C16.75 10.9142 16.4142 11.25 16 11.25H8C7.58579 11.25 7.25 10.9142 7.25 10.5Z"
              ></path>
            </g>
          </svg>
          <span>{comments.length || 0} Comment</span>
        </button>
      </div>
      <hr className="mt-2 mb-2" />
      <p className="text-gray-800 font-semibold">Comment</p>
      {/* Comment Input Section */}
      <form onSubmit={handleSubmit}>
        {commentModal && (
          <div className="bg-gray-100 p-4 rounded-lg mt-2 shadow-md">
            <p className="text-gray-800 font-semibold">Add a Comment</p>
            <div className="mt-2 flex items-center space-x-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 shadow-sm"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                Post
              </button>
            </div>
          </div>
        )}
      </form>
      <hr className="mt-2 mb-2" />
      {/* Comments Section */}
      <Comments postId={postId} />
    </div>
  );
};

export default PostCard;
