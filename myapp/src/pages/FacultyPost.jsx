import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  Send,
  X,
  ArrowLeft,
  Link as LinkIcon,
  FileText,
  Calendar,
  Briefcase,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "@clerk/clerk-react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const FacultyPost = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
    postType: "Notice",
    link: "",
  });

  const postTypeIcons = {
    Notice: <FileText className="w-5 h-5" />,
    Event: <Calendar className="w-5 h-5" />,
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile/${user.id}`
      );
      const data = response.data;
      const form = new FormData();

      form.append("title", formData.title);
      form.append("content", formData.description);
      form.append("category", formData.postType);
      form.append("author", data._id);

      if (formData.link) {
        form.append("link", formData.link);
      }
      if (formData.file) {
        form.append("image", formData.file);
      }

      await axios.post(
        "${import.meta.env.VITE_BACKEND_URL}/api/admin-post/create-post",
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Post submitted successfully");
      navigate("/");
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100">
      {/* Header Section */}
      <div className="border-b border-gray-500/50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">
              Create Faculty Post
            </h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            Share important announcements, events, or placement opportunities
            with the community
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#232526] via-[#1a1b1c] to-[#000000] rounded-2xl border border-gray-500/30 overflow-hidden shadow-2xl">
          {/* User Info Section */}
          <div className="p-6 border-b border-gray-500/30 bg-gradient-to-r from-gray-500/10 via-gray-600/5 to-gray-500/10">
            <div className="flex items-center space-x-4">
              <img
                src={user?.imageUrl}
                alt="Profile"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-blue-500/30 shadow-lg"
              />
              <div>
                <h2 className="font-semibold text-gray-100 text-lg">
                  {user?.fullName}
                </h2>
                <p className="text-sm text-gray-400">Faculty Member</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Post Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Post Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(postTypeIcons).map(([type, icon]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, postType: type }))
                    }
                    className={`flex items-center justify-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 ${
                      formData.postType === type
                        ? "border-blue-500 bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-blue-700/5 text-blue-400 shadow-lg shadow-blue-500/20"
                        : "border-gray-500/50 hover:border-gray-400/50 text-gray-400 hover:text-gray-300 bg-gradient-to-br from-gray-500/10 via-gray-600/5 to-gray-700/5 hover:from-gray-400/10 hover:via-gray-500/5 hover:to-gray-600/5"
                    }`}
                  >
                    {icon}
                    <span className="font-medium">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a compelling title for your post"
                className="w-full px-4 py-3 rounded-xl border border-gray-500/50 bg-gradient-to-r from-gray-500/10 via-gray-600/5 to-gray-500/10 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                required
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed information about your post..."
                rows="5"
                className="w-full px-4 py-3 rounded-xl border border-gray-500/50 bg-gradient-to-r from-gray-500/10 via-gray-600/5 to-gray-500/10 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                required
              />
            </div>

            {/* Link Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                External Link (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon size={20} className="text-gray-500" />
                </div>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-500/50 bg-gradient-to-r from-gray-500/10 via-gray-600/5 to-gray-500/10 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Media Upload (Optional)
              </label>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-500/10 via-gray-600/5 to-gray-700/5 border-2 border-dashed border-gray-500/50 hover:border-blue-500/50 transition-all duration-300 group">
                {formData.file ? (
                  <div className="relative w-full h-full group">
                    {formData.file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(formData.file)}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(formData.file)}
                        controls
                        className="w-full h-full object-contain"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, file: null }))
                      }
                      className="absolute top-4 right-4 p-2 bg-black/70 hover:bg-black/90 text-white rounded-full transition-colors backdrop-blur-sm border border-gray-500/50"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 group-hover:text-blue-400 transition-colors">
                    <UploadCloud size={48} className="mb-3" />
                    <p className="text-sm font-medium">
                      Click or drag files to upload
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Supports images and videos
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  name="file"
                  accept="image/*,video/*"
                  onChange={handleChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-500/30">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Publish Post</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-gradient-to-br from-[#232526] via-[#1a1b1c] to-[#000000] rounded-2xl border border-gray-500/30 p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-3">
            Posting Guidelines
          </h3>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                Ensure your content is relevant and appropriate for the academic
                community
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                Use clear and concise language in your title and description
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Add relevant media files to make your post more engaging</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                Include external links when they provide additional valuable
                information
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyPost;
