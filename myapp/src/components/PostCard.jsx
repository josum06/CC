// PostCard.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Comments from "./Comments";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Clock,
  User,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

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
  const { user } = useUser();
  const navigate = useNavigate();
  const [currUserId, setCurrUserId] = useState(null);
  const [likes, setLikes] = useState(initialLikes);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  useEffect(() => {
    const fetchLikes = async () => {
      if (!currUserId) return;
      try {
        const response = await axios.get(
          `http://localhost:3000/api/post/like/${postId}`
        );
        const likedUsers = response.data.likedByUsers;
        setLikedByCurrentUser(likedUsers.some((user) => user === currUserId));
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    if (currUserId) {
      fetchLikes();
    }
  }, [currUserId, postId]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user/profile/${user.id}`
      );
      const data = response.data;
      setCurrUserId(data._id);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile.");
    }
  };

  const inputComment = () => {
    setCommentModal(!commentModal);
  };

  const handleLike = async () => {
    try {
      console.log(currUserId);
      const response = await axios.patch(
        `http://localhost:3000/api/post/like/${postId}/like-toggle`,
        { userId: currUserId }
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
      formData.append("userId", currUserId);
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

  const handleOptionClick = (action) => {
    switch (action) {
      case "profile":
        navigate("/NetworkProfile", {
          state: { userData: { userId } },
        });
        console.log("View profile clicked");
        break;
      case "message":
        console.log("Message clicked");
        break;
      case "share":
        console.log("Share clicked");
        break;

      default:
        break;
    }
    setShowOptions(false);
  };

  return (
    <div className="bg-gradient-to-br from-[#232526] via-[#1a1b1c] to-[#000000] rounded-2xl border border-gray-500/30 shadow-2xl max-w-md w-full mx-auto mb-6 overflow-hidden hover:shadow-3xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-500/30 bg-gradient-to-r from-gray-500/10 via-gray-600/5 to-gray-500/10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-500/30 hover:ring-blue-500/50 transition-all duration-300 shadow-lg">
              <img
                src={avatar}
                alt={username}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-100 text-sm hover:text-blue-400 cursor-pointer transition-colors">
              {username}
            </p>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock size={12} />
              <span>{time}</span>
            </div>
          </div>
        </div>

        {/* Three Dots Menu */}
        <div className="relative">
          <button
            className="p-2 hover:bg-gray-500/20 rounded-full transition-all duration-200 group"
            onClick={() => setShowOptions(!showOptions)}
          >
            <MoreHorizontal
              size={18}
              className="text-gray-400 group-hover:text-gray-200"
            />
          </button>

          {/* Dropdown Menu */}
          {showOptions && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowOptions(false)}
              />

              <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-[#232526] via-[#1a1b1c] to-[#000000] rounded-xl shadow-2xl border border-gray-500/30 py-2 z-20">
                <button
                  onClick={() => handleOptionClick("profile")}
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:text-gray-100 hover:bg-gray-500/20 w-full text-left transition-all duration-200"
                >
                  <User size={16} />
                  <span>View Profile</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Image/Video Section */}
      <div className="relative group">
        {imageUrl ? (
          imageUrl.endsWith(".mp4") ? (
            <video
              controls
              className="w-full max-h-[32rem] object-contain bg-gradient-to-br from-gray-500/10 via-gray-600/5 to-gray-700/5"
            >
              <source src={imageUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <>
              <img
                src={imageUrl}
                alt="Post content"
                className="w-full max-h-[32rem] object-contain bg-gradient-to-br from-gray-500/10 via-gray-600/5 to-gray-700/5"
                loading="lazy"
              />
              <div
                className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-all duration-300"
                style={{ height: "100%" }}
              />
            </>
          )
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-500/10 via-gray-600/5 to-gray-700/5">
            <span className="text-gray-500">No media available</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-6 pt-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLike}
              className="p-2 hover:bg-red-500/20 rounded-full transition-all duration-200 transform hover:scale-110 group"
            >
              <Heart
                size={24}
                className={`${
                  likedByCurrentUser
                    ? "fill-red-500 stroke-red-500"
                    : "stroke-gray-400 group-hover:stroke-red-500"
                } transition-all duration-200`}
              />
            </button>
            <button
              onClick={inputComment}
              className="p-2 hover:bg-blue-500/20 rounded-full transition-all duration-200 transform hover:scale-110 group"
            >
              <MessageCircle
                size={24}
                className="stroke-gray-400 group-hover:stroke-blue-500 transition-all duration-200"
              />
            </button>
            <button className="p-2 hover:bg-green-500/20 rounded-full transition-all duration-200 transform hover:scale-110 group">
              <Share2
                size={24}
                className="stroke-gray-400 group-hover:stroke-green-500 transition-all duration-200"
              />
            </button>
          </div>
        </div>

        {/* Likes Count */}
        <p className="font-semibold text-gray-200 text-sm mb-3">{likes} likes</p>

        {/* Caption */}
        {content && (
          <div className="mb-3">
            <span className="font-semibold text-gray-200 text-sm mr-2 hover:text-blue-400 cursor-pointer transition-colors">
              {username}
            </span>
            <span className="text-sm text-gray-300">{content}</span>
          </div>
        )}

        {/* Comments Count */}
        <button
          onClick={inputComment}
          className="text-gray-500 text-xs mb-3 hover:text-gray-300 transition-colors"
        >
          View all {comments.length} comments
        </button>

        {/* Comment Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center py-4 border-t border-gray-500/30"
        >
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-sm p-3 rounded-xl border border-gray-500/50 bg-gradient-to-r from-gray-500/10 via-gray-600/5 to-gray-500/10 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className={`ml-3 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
              commentText.trim()
                ? "text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                : "text-gray-600 cursor-not-allowed"
            }`}
          >
            Post
          </button>
        </form>
      </div>

      {/* Comments Section */}
      {commentModal && (
        <div className="border-t border-gray-500/30 bg-gradient-to-r from-gray-500/5 via-gray-600/3 to-gray-500/5">
          <Comments postId={postId} />
        </div>
      )}
    </div>
  );
};

export default PostCard;
