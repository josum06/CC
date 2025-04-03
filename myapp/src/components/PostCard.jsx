// PostCard.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Comments from "./Comments";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";

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
  const [currUserId , setCurrUserId] = useState(null);
  const [likes, setLikes] = useState(initialLikes);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(
    likedByUsers.includes(currUserId)
  );
  const [commentModal, setCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);


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
      console.log(currUserId)
      const response = await axios.patch(
        `http://localhost:3000/api/post/like/${postId}/like-toggle`,{userId : currUserId}
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
    switch(action) {
      case 'profile':
        console.log('View profile clicked');
        break;
      case 'message':
        console.log('Message clicked');
        break;
      case 'share':
        console.log('Share clicked');
        break;
      
      default:
        break;
    }
    setShowOptions(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm max-w-md w-full mx-auto mb-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gray-100 hover:ring-blue-100 transition-all">
              <img
                src={avatar}
                alt={username}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm hover:underline cursor-pointer">{username}</p>
            <p className="text-xs text-gray-500">{time}</p>
          </div>
        </div>
        
        {/* Three Dots Menu */}
        <div className="relative">
          <button 
            className="p-1.5 hover:bg-gray-50 rounded-full transition-colors group"
            onClick={() => setShowOptions(!showOptions)}
          >
            <MoreHorizontal size={18} className="text-gray-400 group-hover:text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          {showOptions && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setShowOptions(false)}
              />
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                <button
                  onClick={() => handleOptionClick('profile')}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  <User size={16} />
                  <span>View Profile</span>
                </button>
                
                <button
                  onClick={() => handleOptionClick('message')}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  <Mail size={16} />
                  <span>Send Message</span>
                </button>
                
                <button
                  onClick={() => handleOptionClick('share')}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  <Link size={16} />
                  <span>Copy Link</span>
                </button>

             
                
                
              </div>
            </>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="relative group">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt="Post content"
              className="w-full max-h-[32rem] object-contain bg-black/5"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found';
              }}
              loading="lazy"
            />
            <div 
              className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-all duration-300"
              style={{ height: '100%' }}
            />
          </>
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-4 pt-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLike}
              className="p-1.5 hover:bg-gray-50 rounded-full transition-all duration-200 transform hover:scale-110"
            >
              <Heart
                size={22}
                className={`${
                  likedByCurrentUser
                    ? "fill-red-500 stroke-red-500"
                    : "stroke-gray-700 hover:stroke-red-500"
                } transition-colors`}
              />
            </button>
            <button
              onClick={inputComment}
              className="p-1.5 hover:bg-gray-50 rounded-full transition-all duration-200 transform hover:scale-110"
            >
              <MessageCircle size={22} className="stroke-gray-700 hover:stroke-blue-500" />
            </button>
            <button className="p-1.5 hover:bg-gray-50 rounded-full transition-all duration-200 transform hover:scale-110">
              <Share2 size={22} className="stroke-gray-700 hover:stroke-green-500" />
            </button>
          </div>
         
        </div>

        {/* Likes Count */}
        <p className="font-semibold text-sm mb-1.5">{likes} likes</p>

        {/* Caption */}
        {content && (
          <div className="mb-2">
            <span className="font-semibold text-sm mr-2 hover:underline cursor-pointer">{username}</span>
            <span className="text-sm text-gray-800">{content}</span>
          </div>
        )}

        {/* Comments Count */}
        <button
          onClick={inputComment}
          className="text-gray-500 text-xs mb-2 hover:text-gray-700"
        >
          View all {comments.length} comments
        </button>

        {/* Comment Input */}
        <form onSubmit={handleSubmit} className="flex items-center py-3 border-t border-gray-50">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-sm p-2 focus:outline-none placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
              commentText.trim()
                ? "text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                : "text-gray-200 cursor-not-allowed"
            }`}
          >
            Post
          </button>
        </form>
      </div>

      {/* Comments Section */}
      {commentModal && (
        <div className="border-t border-gray-50">
          <Comments postId={postId} />
        </div>
      )}
    </div>
  );
};

export default PostCard;
