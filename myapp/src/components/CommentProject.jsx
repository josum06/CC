import axios from "axios";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { Heart, MoreHorizontal, MessageCircle, Send, User, Clock, Code } from 'lucide-react';

function CommentProject({ projectId }) {
  const [comments, setComments] = useState([]);
  const [likedComments, setLikedComments] = useState(new Set());

  useEffect(() => {
    // Fetch comments when component mounts
    const fetchProjectComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/project/get-project-comments/${projectId}`
        );
        const fetchedProjectComments = response.data.comments;
        setComments(fetchedProjectComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchProjectComments();
  }, [projectId]);

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
    <div className="px-6 py-4 max-h-[400px] overflow-y-auto custom-scrollbar">
      {comments.map((comment) => (
        <div 
          key={comment._id} 
          className="mb-4 group hover:bg-gradient-to-r hover:from-gray-800/30 hover:to-gray-700/20 rounded-2xl p-4 transition-all duration-300 border border-transparent hover:border-gray-600/30"
        >
          <div className="flex items-start space-x-4">
            {/* User Avatar */}
            <div className="relative group/avatar">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-purple-500/30 hover:ring-purple-500/50 transition-all duration-300 shadow-lg group-hover/avatar:shadow-purple-500/25">
                <img
                  src={comment?.userId?.profileImage}
                  alt={comment?.userId?.fullName}
                  className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/40';
                  }}
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            
            {/* Comment Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-baseline space-x-3 mb-2">
                    <span className="font-semibold text-sm text-gray-200 hover:text-purple-400 cursor-pointer transition-colors duration-300">
                      {comment?.userId?.fullName}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock size={12} />
                      <span>{getTimeAgo(comment.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mt-1 break-words leading-relaxed">
                    {comment.text}
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-4">
                  <button 
                    onClick={() => handleLikeComment(comment._id)}
                    className="p-2 hover:bg-red-500/20 rounded-full transition-all duration-300 transform hover:scale-110 group/like"
                  >
                    <Heart 
                      size={16} 
                      className={`${
                        likedComments.has(comment._id)
                          ? "fill-red-500 stroke-red-500 animate-pulse"
                          : "stroke-gray-500 group-hover/like:stroke-red-500"
                      } transition-all duration-300`}
                    />
                  </button>
                  <button className="p-2 hover:bg-gray-600/30 rounded-full transition-all duration-300 transform hover:scale-110 group/more">
                    <MoreHorizontal size={16} className="text-gray-500 group-hover/more:text-gray-300" />
                  </button>
                </div>
              </div>
              
              {/* Comment Actions */}
              <div className="flex items-center space-x-6 mt-3">
                <button className="flex items-center space-x-2 text-xs font-medium text-gray-500 hover:text-purple-400 transition-colors duration-300 group/reply">
                  <MessageCircle size={14} className="group-hover/reply:scale-110 transition-transform duration-300" />
                  <span>Reply</span>
                </button>
                {likedComments.has(comment._id) && (
                  <span className="text-xs text-red-400 flex items-center space-x-1">
                    <Heart size={12} className="fill-red-500 stroke-red-500" />
                    <span>Liked</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {comments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-full flex items-center justify-center border border-gray-600/30">
            <Code className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No comments yet</h3>
          <p className="text-sm text-gray-500 text-center">Be the first to share your thoughts on this project</p>
        </div>
      )}
    </div>
  );
}

export default CommentProject;
