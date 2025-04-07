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
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "@clerk/clerk-react";
import CommentProject from "./CommentProject";

const ProjectCard = ({
  avatar,
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
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);
  const [commentModal, setCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");

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
  const handleCopyLink = () => {
    navigator.clipboard.writeText(projectUrl);
    setShowDropdown(false);
  };

  const handleLike = async () => {
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

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={avatar}
              alt={username}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
              {username}
            </h3>
            <p className="text-sm text-gray-500">{time}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      // Handle view profile
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      // Handle send message
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Send Message
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="px-6 py-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
          {projectName}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {description}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.length > 0 &&
            skills.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
        </div>

        {/* Project Links */}
        <div className="flex flex-wrap gap-3 mb-4">
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            <LinkIcon className="w-4 h-4" />
            Live Demo
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            <Github className="w-4 h-4" />
            Source Code
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Contributors */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              Contributors
            </span>
          </div>
          <div className="flex -space-x-2">
            {contributors.map((contributor, index) => (
              <img
                key={index}
                src={contributor}
                alt={`Contributor ${index + 1}`}
                className="w-8 h-8 rounded-full border-2 border-white hover:z-10 transition-transform hover:scale-110"
                title={contributor.name}
              />
            ))}
            <button className="w-8 h-8 rounded-full bg-gray-50 border-2 border-white text-gray-400 text-xs font-medium flex items-center justify-center hover:bg-gray-100">
              +2
            </button>
          </div>
        </div>

        {/* Project Media */}
        <div className="relative rounded-xl overflow-hidden bg-gray-50 mb-4">
          <img
            src={imageUrl}
            alt="Project preview"
            className="w-full object-cover hover:scale-105 transition-transform duration-300"
            style={{ maxHeight: "400px" }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors group"
            >
              <Heart
                className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                  likedByCurrentUser
                    ? "fill-red-500 stroke-red-500"
                    : "stroke-current"
                }`}
              />
              <span>{likesCount}</span>
            </button>
            <button
              onClick={inputComment}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors group"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors group">
              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center py-3 border-t border-gray-50"
      >
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

      {commentModal && (
        <div className="border-t border-gray-50">
          <CommentProject projectId={projectId} />
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
