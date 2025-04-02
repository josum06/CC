// PostCard.jsx
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Comments from "./Comments";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';

const PostCard = ({
  avatar,
  username,
  time,
  content,
  imageUrl,
  likes: initialLikes,
  likedByUsers = [],
  postId,
  userId,
  comments,
}) => {
  const [likes, setLikes] = useState(initialLikes);
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
        `http://localhost:3000/api/post/like/${postId}/like-toggle`, { userId }
      );
      setLikes(response.data.post.likes);
      setLikedByCurrentUser(response.data.hasLiked);
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
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
      setCommentText("");
      toast.success(`Comment posted successfully!`);
    } catch (e) {
      console.error("Error posting comment:", e);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm max-w-xl w-full mx-auto mb-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-200">
            <img
              src={avatar}
              alt={username}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-sm">{username}</p>
            <p className="text-xs text-gray-500">{time}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <MoreHorizontal size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Image */}
      <div className="aspect-square w-full relative">
        <img
          src={imageUrl}
          alt="Post content"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Action Buttons */}
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart
                size={24}
                className={`${
                  likedByCurrentUser
                    ? "fill-red-500 stroke-red-500"
                    : "stroke-gray-700"
                }`}
              />
            </button>
            <button
              onClick={inputComment}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MessageCircle size={24} className="stroke-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 size={24} className="stroke-gray-700" />
            </button>
          </div>
         
        </div>

        {/* Likes Count */}
        <p className="font-semibold text-sm mb-1">{likes} likes</p>

        {/* Caption */}
        {content && (
          <div className="mb-2">
            <span className="font-semibold text-sm mr-2">{username}</span>
            <span className="text-sm">{content}</span>
          </div>
        )}

        {/* Comments Count */}
        <button
          onClick={inputComment}
          className="text-gray-500 text-sm mb-2 hover:text-gray-700"
        >
          View all {comments.length} comments
        </button>

        {/* Comment Input */}
        <form onSubmit={handleSubmit} className="flex items-center mt-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-sm p-2 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className={`px-4 py-1 text-sm font-semibold ${
              commentText.trim()
                ? "text-blue-500 hover:text-blue-600"
                : "text-blue-200"
            }`}
          >
            Post
          </button>
        </form>
      </div>

      {/* Comments Section */}
      {commentModal && (
        <div className="border-t">
          <Comments postId={postId} />
        </div>
      )}
    </div>
  );
};

export default PostCard;
