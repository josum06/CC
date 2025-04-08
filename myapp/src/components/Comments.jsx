import axios from "axios";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { Heart, MoreHorizontal } from 'lucide-react';
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
    <div className="px-4 py-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {comments.map((comment) => (
        <div
          key={comment._id}
          className="mb-4 group hover:bg-gray-200 rounded-lg p-3 transition-colors duration-200"
        >
          <div className="flex items-start space-x-3">
            {/* User Avatar */}
            <div className="relative">
              <img
                src={comment?.userId?.profileImage}
                alt={comment?.userId?.fullName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/40';
                }}
              />
            </div>

            {/* Comment Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="font-medium text-sm text-gray-900 hover:underline cursor-pointer">
                      {comment?.userId?.fullName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5 break-words">
                    {comment.text}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleLikeComment(comment._id)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Heart
                      size={14}
                      className={`${
                        likedComments.has(comment._id)
                          ? "fill-red-500 stroke-red-500"
                          : "stroke-gray-500"
                      }`}
                    />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreHorizontal size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Comment Actions */}
              <div className="flex items-center space-x-4 mt-1">
                <button
                  onClick={() => {
                    setReplyModal(true);
                    setReplyCommentId(comment._id);
                  }}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  Reply
                </button>
                {likedComments.has(comment._id) && (
                  <span className="text-xs text-gray-500">Liked</span>
                )}
              </div>

              {/* Reply Input */}
              {replyModal && replyCommentId === comment._id && (
                <form
                  onSubmit={(e) => handleSubmit(e, comment._id)}
                  className="flex items-center py-3 border-t border-gray-50"
                >
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Add a reply..."
                    className="flex-1 text-sm p-2 focus:outline-none placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
                      replyText.trim()
                        ? "text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        : "text-gray-200 cursor-not-allowed"
                    }`}
                  >
                    Post
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      ))}

      {comments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <svg
            className="w-12 h-12 mb-3 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-sm font-medium">No comments yet</p>
          <p className="text-xs text-gray-400 mt-1">Be the first to comment</p>
        </div>
      )}
    </div>
  );
}

export default Comments;
