import React, { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Github,
  Link as LinkIcon,
  MoreHorizontal,
  Users,
  ExternalLink,
  Bookmark,
  Clock,
  User,
  Eye,
  Send,
  Star,
  Code,
  Globe,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "@clerk/clerk-react";
import CommentProject from "./CommentProject";
import { useNavigate } from "react-router";

const ProjectCard = ({
  avatar,
  userId,
  username,
  time,
  projectName,
  description,
  projectUrl,
  githubUrl,
  contributors,
  imageUrl,
  skills,
  likes,
  comments,
  projectId,
}) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);
  const [commentModal, setCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLiking, setIsLiking] = useState(false);

  const { user: clerkUser } = useUser();
  useEffect(() => {
    if (clerkUser) {
      fetchUser();
    }
  }, [clerkUser]);

  useEffect(() => {
    if (user) {
      fetchLikes();
    }
  }, [user]);

  const fetchLikes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/project/like/${projectId}`
      );
      const likedUsers = response.data.likes;
      setLikedByCurrentUser(
        likedUsers.some((databaseUser) => databaseUser === user._id)
      );
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user/profile/${clerkUser.id}`
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    setLikedByCurrentUser(!likedByCurrentUser);
    const newLikedState = !likedByCurrentUser;
    setLikesCount((prev) => prev + (newLikedState ? 1 : -1));
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/project/like/${projectId}`,
        {
          userId: user?._id,
        }
      );
      console.log(response.data);
    } catch (error) {
      setLikedByCurrentUser(!newLikedState);
      setLikesCount((prev) => prev + (newLikedState ? -1 : 1));
      console.log(error);
      toast.error("Failed to like project");
    } finally {
      setIsLiking(false);
    }
  };

  const inputComment = () => {
    setCommentModal(!commentModal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const formData = new FormData();
      formData.append("text", commentText);
      formData.append("projectId", projectId);
      formData.append("userId", user?._id);
      await axios.post(
        "http://localhost:3000/api/project/create-project-comment",
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

  const handleClick = () => {
    navigate("/NetworkProfile", {
      state: { userData: { userId } },
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 group relative">
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/30 via-gray-700/20 to-gray-800/30">
        <div className="flex items-center space-x-4">
          <div className="relative group/avatar">
            <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-purple-500/40 hover:ring-purple-500/60 transition-all duration-300 shadow-lg group-hover/avatar:shadow-purple-500/25">
              <img
                src={avatar}
                alt={username}
                className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 shadow-lg"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-100 text-base hover:text-purple-400 cursor-pointer transition-colors duration-300">
              {username}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock size={14} className="text-gray-600" />
              <span>{time}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              className="p-2 hover:bg-gray-700/50 rounded-full transition-all duration-300 group/options"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <MoreHorizontal className="w-5 h-5 text-gray-400 group-hover/options:text-gray-200 transition-colors duration-300" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 py-3 z-99">
                <button
                  onClick={() => {
                    handleClick();
                    setShowDropdown(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:text-gray-100 hover:bg-gray-700/50 w-full text-left transition-all duration-300 group"
                >
                  <User size={16} className="text-blue-400 group-hover:text-blue-300" />
                  <span>View Profile</span>
                </button>
                
                
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="relative z-10 px-6 py-5">
        <h2 className="text-2xl font-bold text-gray-100 mb-3 hover:text-purple-400 cursor-pointer transition-colors duration-300 flex items-center gap-2">
          <Code className="w-6 h-6 text-purple-400" />
          {projectName}
        </h2>
        <p className="text-gray-300 text-base leading-relaxed mb-6">
          {description}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-3 mb-6">
          {skills && skills.length > 0 &&
            skills.map((tech, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-purple-700/20 text-purple-300 rounded-xl text-sm font-medium border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 backdrop-blur-sm"
              >
                {tech}
              </span>
            ))}
        </div>

        {/* Project Links */}
        <div className="flex flex-wrap gap-4 mb-6">
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-400 rounded-xl hover:from-blue-600/30 hover:to-blue-700/30 border border-blue-500/50 hover:border-blue-400/50 transition-all duration-300 text-sm font-medium group/link"
          >
            <Globe className="w-4 h-4 group-hover/link:scale-110 transition-transform duration-300" />
            Live Demo
            <ExternalLink className="w-3 h-3 group-hover/link:scale-110 transition-transform duration-300" />
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-gray-700/50 to-gray-600/50 text-gray-300 rounded-xl hover:from-gray-600/50 hover:to-gray-500/50 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 text-sm font-medium group/github"
          >
            <Github className="w-4 h-4 group-hover/github:scale-110 transition-transform duration-300" />
            Source Code
            <ExternalLink className="w-3 h-3 group-hover/github:scale-110 transition-transform duration-300" />
          </a>
        </div>

        {/* Contributors */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-gray-300">
              Contributors
            </span>
          </div>
          <div className="flex -space-x-3">
            {contributors && contributors.map((contributor, index) => (
              <div key={index} className="relative group/contributor">
                <img
                  src={contributor}
                  alt={`Contributor ${index + 1}`}
                  className="w-10 h-10 rounded-full border-2 border-gray-900 hover:z-10 transition-all duration-300 hover:scale-110 shadow-lg"
                  title={contributor.name}
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-gray-900"></div>
              </div>
            ))}
            <button className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700/50 to-gray-600/50 border-2 border-gray-900 text-gray-400 text-xs font-medium flex items-center justify-center hover:bg-gray-600/50 transition-all duration-300 shadow-lg">
              +2
            </button>
          </div>
        </div>

        {/* Project Media */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800/20 via-gray-700/10 to-gray-800/20 mb-6 group/media">
          <img
            src={imageUrl}
            alt="Project preview"
            className="w-full object-cover group-hover/media:scale-105 transition-transform duration-700"
            style={{ maxHeight: "400px" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-5 border-t border-gray-700/50">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors duration-300 group/like disabled:opacity-50"
            >
              <Heart
                className={`w-5 h-5 group-hover/like:scale-110 transition-all duration-300 ${
                  likedByCurrentUser
                    ? "fill-red-500 stroke-red-500 animate-pulse"
                    : "stroke-current"
                }`}
              />
              <span>{likesCount}</span>
            </button>
            <button
              onClick={inputComment}
              className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-blue-400 transition-colors duration-300 group/comment"
            >
              <MessageCircle className="w-5 h-5 group-hover/comment:scale-110 transition-all duration-300" />
              <span>{comments?.length || 0}</span>
            </button>
            {/* <button className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-green-400 transition-colors duration-300 group/share">
              <Share2 className="w-5 h-5 group-hover/share:scale-110 transition-all duration-300" />
              <span>Share</span>
            </button> */}
          </div>
          {/* <button className="p-2 hover:bg-purple-500/20 rounded-full transition-all duration-300 transform hover:scale-110 group/bookmark">
            <Bookmark
              size={20}
              className="stroke-gray-400 group-hover/bookmark:stroke-purple-500 transition-all duration-300"
            />
          </button> */}
        </div>
      </div>

      {/* Comment Input */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex items-center py-4 px-6 border-t border-gray-700/50 bg-gradient-to-r from-gray-800/20 via-gray-700/10 to-gray-800/20"
      >
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 text-sm p-3 rounded-2xl border border-gray-600/50 bg-gradient-to-r from-gray-800/50 via-gray-700/30 to-gray-800/50 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
        />
        <button
          type="submit"
          disabled={!commentText.trim()}
          className={`ml-3 p-3 rounded-2xl transition-all duration-300 ${
            commentText.trim()
              ? "bg-gradient-to-r from-purple-600/20 to-purple-700/20 text-purple-400 border border-purple-500/50 hover:from-purple-600/30 hover:to-purple-700/30 hover:border-purple-400/50 hover:scale-105"
              : "bg-gray-700/30 text-gray-600 cursor-not-allowed"
          }`}
        >
          <Send size={18} />
        </button>
      </form>

      {commentModal && (
        <div className="border-t border-gray-700/50 bg-gradient-to-r from-gray-800/20 via-gray-700/10 to-gray-800/20">
          <CommentProject projectId={projectId} />
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
