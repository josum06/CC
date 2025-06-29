import axios from "axios";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { Heart, MoreHorizontal, MessageCircle, Send, User, Clock } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";

function Comments({ postId }) {
  const { user } = useUser();
  const [comments, setComments] = useState([]);
  const [likedComments, setLikedComments] = useState(new Set());
  const [replyModal, setReplyModal] = useState(false);
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/post/get-comments/${postId}`
        );
        setComments(response.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e, commentId) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/post/reply-comment", {
        text: replyText,
        clerkId: user.id,
        commentId: commentId
      });
      console.log(res.data);

      // Clear reply state
      setReplyText('');
      setReplyModal(false);
      setReplyCommentId(null);

      // Optional: re-fetch comments
      const refreshed = await axios.get(`http://localhost:3000/api/post/get-comments/${postId}`);
      setComments(refreshed.data.comments);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLikeComment = (commentId) => {
    setLikedComments(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(commentId)) {
        newLiked.delete(commentId);
      } else {
        newLiked.add(commentId);
      }
      return newLiked;
    });
  };

  const getTimeAgo = (dateString) => {
    const date = parseISO(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 48) return 'Yesterday';
    return format(date, 'd MMM');
  };

  return (
    <div className="px-4 sm:px-6 py-3 sm:py-4 max-h-[300px] sm:max-h-[400px] overflow-y-auto custom-scrollbar">
      {comments.map((comment) => (
        <div
          key={comment._id}
          className="mb-3 sm:mb-4 group hover:bg-gradient-to-r hover:from-gray-800/30 hover:to-gray-700/20 rounded-2xl p-3 sm:p-4 transition-all duration-300 border border-transparent hover:border-gray-600/30"
        >
          <div className="flex items-start space-x-3 sm:space-x-4">
            {/* User Avatar */}
            <div className="relative group/avatar flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-blue-500/30 hover:ring-blue-500/50 transition-all duration-300 shadow-lg group-hover/avatar:shadow-blue-500/25">
                <img
                  src={comment?.userId?.profileImage}
                  alt={comment?.userId?.fullName}
                  className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/40';
                  }}
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>

            {/* Comment Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-baseline space-x-2 sm:space-x-3 mb-1 sm:mb-2">
                    <span className="font-semibold text-xs sm:text-sm text-gray-200 hover:text-blue-400 cursor-pointer transition-colors duration-300">
                      {comment?.userId?.fullName}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock size={10} className="sm:w-3 sm:h-3 text-gray-600" />
                      <span className="text-xs">{getTimeAgo(comment.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 break-words leading-relaxed">
                    {comment.text}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 sm:space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-2 sm:ml-4">
                  <button
                    onClick={() => handleLikeComment(comment._id)}
                    className="p-1.5 sm:p-2 hover:bg-red-500/20 rounded-full transition-all duration-300 transform hover:scale-110 group/like"
                  >
                    <Heart
                      size={14}
                      className={`sm:w-4 sm:h-4 ${
                        likedComments.has(comment._id)
                          ? "fill-red-500 stroke-red-500 animate-pulse"
                          : "stroke-gray-500 group-hover/like:stroke-red-500"
                      } transition-all duration-300`}
                    />
                  </button>
                  <button className="p-1.5 sm:p-2 hover:bg-gray-600/30 rounded-full transition-all duration-300 transform hover:scale-110 group/more">
                    <MoreHorizontal size={14} className="sm:w-4 sm:h-4 text-gray-500 group-hover/more:text-gray-300" />
                  </button>
                </div>
              </div>

              {/* Comment Actions */}
              <div className="flex items-center space-x-4 sm:space-x-6 mt-2 sm:mt-3">
                <button
                  onClick={() => {
                    setReplyModal(true);
                    setReplyCommentId(comment._id);
                  }}
                  className="flex items-center space-x-1.5 sm:space-x-2 text-xs font-medium text-gray-500 hover:text-blue-400 transition-colors duration-300 group/reply"
                >
                  <MessageCircle size={12} className="sm:w-[14px] sm:h-[14px] group-hover/reply:scale-110 transition-transform duration-300" />
                  <span>Reply</span>
                </button>
                {likedComments.has(comment._id) && (
                  <span className="text-xs text-red-400 flex items-center space-x-1">
                    <Heart size={10} className="sm:w-3 sm:h-3 fill-red-500 stroke-red-500" />
                    <span>Liked</span>
                  </span>
                )}
              </div>

              {/* Reply Input */}
              {replyModal && replyCommentId === comment._id && (
                <form
                  onSubmit={(e) => handleSubmit(e, comment._id)}
                  className="flex items-center py-3 sm:py-4 mt-3 sm:mt-4 border-t border-gray-700/50"
                >
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Add a reply..."
                    className="flex-1 text-xs sm:text-sm p-2 sm:p-3 rounded-2xl border border-gray-600/50 bg-gradient-to-r from-gray-800/50 via-gray-700/30 to-gray-800/50 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className={`ml-2 sm:ml-3 p-2 sm:p-3 rounded-2xl transition-all duration-300 ${
                      replyText.trim()
                        ? "bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-400 border border-blue-500/50 hover:from-blue-600/30 hover:to-blue-700/30 hover:border-blue-400/50 hover:scale-105"
                        : "bg-gray-700/30 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ))}

      {comments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-gray-500">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-full flex items-center justify-center border border-gray-600/30">
            <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-300 mb-1 sm:mb-2">No comments yet</h3>
          <p className="text-xs sm:text-sm text-gray-500 text-center">Be the first to share your thoughts</p>
        </div>
      )}
    </div>
  );
}

export default Comments;
