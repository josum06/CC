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
  Send,
  Eye,
  ThumbsUp,
  Smile,
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
  const [isLiking, setIsLiking] = useState(false);

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
    if (isLiking) return;
    setIsLiking(true);
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
    } finally {
      setIsLiking(false);
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
    <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl max-w-md w-full mx-auto mb-6 overflow-hidden hover:shadow-3xl transition-all duration-500 group relative">
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/30 via-gray-700/20 to-gray-800/30">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative group/avatar">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-blue-500/40 hover:ring-blue-500/60 transition-all duration-300 shadow-lg group-hover/avatar:shadow-blue-500/25">
              <img
                src={avatar}
                alt={username}
                className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-gray-900 shadow-lg"></div>
          </div>
          <div>
            <p className="font-semibold text-gray-100 text-sm sm:text-base hover:text-blue-400 cursor-pointer transition-colors duration-300">
              {username}
            </p>
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
              <Clock size={12} className="sm:w-[14px] sm:h-[14px] text-gray-600" />
              <span>{time}</span>
            </div>
          </div>
        </div>

        {/* Three Dots Menu */}
        <div className="relative">
          <button
            className="p-2 hover:bg-gray-700/50 rounded-full transition-all duration-300 group/options"
            onClick={() => setShowOptions(!showOptions)}
          >
            <MoreHorizontal
              size={16}
              className="sm:w-[18px] sm:h-[18px] text-gray-400 group-hover/options:text-gray-200 transition-colors duration-300"
            />
          </button>

          {/* Dropdown Menu */}
          {showOptions && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowOptions(false)}
              />

              <div className="absolute right-0 mt-3 w-48 sm:w-56 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 py-3 z-20">
                <button
                  onClick={() => handleOptionClick("profile")}
                  className="flex items-center space-x-3 px-4 py-3 text-xs sm:text-sm text-gray-300 hover:text-gray-100 hover:bg-gray-700/50 w-full text-left transition-all duration-300 group"
                >
                  <User size={14} className="sm:w-4 sm:h-4 text-blue-400 group-hover:text-blue-300" />
                  <span>View Profile</span>
                </button>
               
                
              </div>
            </>
          )}
        </div>
      </div>

      {/* Image/Video Section */}
      <div className="relative group/media">
        {imageUrl ? (
          imageUrl.endsWith(".mp4") ? (
            <video
              controls
              className="w-full max-h-[24rem] sm:max-h-[32rem] object-contain bg-gradient-to-br from-gray-800/20 via-gray-700/10 to-gray-800/20"
            >
              <source src={imageUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <>
              <img
                src={imageUrl}
                alt="Post content"
                className="w-full max-h-[24rem] sm:max-h-[32rem] object-contain bg-gradient-to-br from-gray-800/20 via-gray-700/10 to-gray-800/20 group-hover/media:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity duration-300"
                style={{ height: "100%" }}
              />
            </>
          )
        ) : (
          <div className="w-full h-48 sm:h-64 flex items-center justify-center bg-gradient-to-br from-gray-800/20 via-gray-700/10 to-gray-800/20">
            <div className="text-center">
              <Smile className="w-8 h-8 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-2" />
              <span className="text-xs sm:text-sm text-gray-500">No media available</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 px-4 sm:px-6 pt-4 sm:pt-5">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className="p-2 sm:p-3 hover:bg-red-500/20 rounded-full transition-all duration-300 transform hover:scale-110 group/like disabled:opacity-50"
            >
              <Heart
                size={20}
                className={`sm:w-6 sm:h-6 ${
                  likedByCurrentUser
                    ? "fill-red-500 stroke-red-500 animate-pulse"
                    : "stroke-gray-400 group-hover/like:stroke-red-500"
                } transition-all duration-300`}
              />
            </button>
            <button
              onClick={inputComment}
              className="p-2 sm:p-3 hover:bg-blue-500/20 rounded-full transition-all duration-300 transform hover:scale-110 group/comment"
            >
              <MessageCircle
                size={20}
                className="sm:w-6 sm:h-6 stroke-gray-400 group-hover/comment:stroke-blue-500 transition-all duration-300"
              />
            </button>
            {/* <button className="p-2 sm:p-3 hover:bg-green-500/20 rounded-full transition-all duration-300 transform hover:scale-110 group/share">
              <Share2
                size={20}
                className="sm:w-6 sm:h-6 stroke-gray-400 group-hover/share:stroke-green-500 transition-all duration-300"
              />
            </button> */}
          </div>
          {/* <button className="p-2 sm:p-3 hover:bg-purple-500/20 rounded-full transition-all duration-300 transform hover:scale-110 group/bookmark">
            <Bookmark
              size={20}
              className="sm:w-6 sm:h-6 stroke-gray-400 group-hover/bookmark:stroke-purple-500 transition-all duration-300"
            />
          </button> */}
        </div>

        {/* Likes Count */}
        <p className="font-semibold text-gray-200 text-xs sm:text-sm mb-3 flex items-center gap-2">
          <ThumbsUp size={14} className="sm:w-4 sm:h-4 text-blue-400" />
          {likes} likes
        </p>

        {/* Caption */}
        {content && (
          <div className="mb-3">
            <span className="font-semibold text-gray-200 text-xs sm:text-sm mr-2 hover:text-blue-400 cursor-pointer transition-colors duration-300">
              {username}
            </span>
            <span className="text-xs sm:text-sm text-gray-300">{content}</span>
          </div>
        )}

        {/* Comments Count */}
        <button
          onClick={inputComment}
          className="text-gray-500 text-xs mb-3 hover:text-gray-300 transition-colors duration-300 flex items-center gap-1"
        >
          <Eye size={12} className="sm:w-[14px] sm:h-[14px]" />
          View all {comments?.length || 0} comments
        </button>

        {/* Comment Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center py-3 sm:py-4 border-t border-gray-700/50"
        >
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-xs sm:text-sm p-2 sm:p-3 rounded-2xl border border-gray-600/50 bg-gradient-to-r from-gray-800/50 via-gray-700/30 to-gray-800/50 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className={`ml-2 sm:ml-3 p-2 sm:p-3 rounded-2xl transition-all duration-300 ${
              commentText.trim()
                ? "bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-400 border border-blue-500/50 hover:from-blue-600/30 hover:to-blue-700/30 hover:border-blue-400/50 hover:scale-105"
                : "bg-gray-700/30 text-gray-600 cursor-not-allowed"
            }`}
          >
            <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </form>
      </div>

      {/* Comments Section */}
      {commentModal && (
        <div className="border-t border-gray-700/50 bg-gradient-to-r from-gray-800/20 via-gray-700/10 to-gray-800/20">
          <Comments postId={postId} />
        </div>
      )}
    </div>
  );
};

export default PostCard;
