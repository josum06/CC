import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import {
  UploadCloud,
  Send,
  ArrowLeft,
  X,
  Image,
  Video,
  Link,
  Smile,
  Loader2,
  FileText,
  Calendar,
  Briefcase,
  Sparkles,
} from "lucide-react";
import axios from "axios";
// import { showToast } from "../components/CustomToast"; // Component not found
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../context/ThemeContext";

const PostPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
    postType: "General",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postTypeIcons = {
    General: <FileText className="w-5 h-5" />,
    Event: <Calendar className="w-5 h-5" />,
    Achievement: <Briefcase className="w-5 h-5" />,
  };

  const postTypeColors = {
    General: "from-[#4790fd]/20 to-[#4790fd]/10",
    Event: "from-[#27dc66]/20 to-[#27dc66]/10",
    Achievement: "from-[#ece239]/20 to-[#ece239]/10",
  };

  const isValidVideoFormat = (file) => {
    const validVideoTypes = [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-ms-wmv',
      'video/x-flv',
      'video/x-matroska'
    ];
    
    const validExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv', '.flv', '.mkv'];
    
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    return validVideoTypes.includes(file.type) || validExtensions.includes(fileExtension);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files && files[0]) {
      const file = files[0];
      
      // Check if it's a video file
      if (file.type.startsWith('video/')) {
        // Validate video format
        if (!isValidVideoFormat(file)) {
          toast.error('Unsupported video format. Please upload MP4, WebM, OGG, MOV, AVI, WMV, FLV, or MKV files.');
          return;
        }
        
        // Check file size (limit to 100MB)
        const maxSizeInBytes = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSizeInBytes) {
          toast.error('Video file size exceeds 100MB limit. Please upload a smaller video.');
          return;
        }
      }
      
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      file: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile/${user.id}`,
      );

      const data = response.data;
      const form = new FormData();
      form.append("caption", formData.description);
      form.append("file", formData.file);
      form.append("author", data._id);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/post/create-post`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      toast.success("Post created successfully!");
      navigate("/Network");
    } catch (err) {
      console.error("Error uploading file:", err);
      console.error("Error uploading file. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen py-6 px-3 sm:py-8 sm:px-4 md:px-6 relative overflow-hidden transition-colors duration-300 ${
        isDarkMode ? "bg-[#070707] text-[#f5f5f5]" : "bg-[#f5f5f5] text-[#070707]"
      }`}
    >
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4790fd]/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c76191]/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-[#ece239]/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-[#ece239]" />
                Create Post
              </h1>
              <p className="text-sm mt-1 text-[#a0a0a0]">
                Share your thoughts with the campus community
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4790fd]/10 via-[#c76191]/5 to-[#27dc66]/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>

              <div className="relative bg-[#1a1a1a]/40 backdrop-blur-xl rounded-3xl border border-[#ffffff]/10 overflow-hidden">
                <div className="p-6 sm:p-8 space-y-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Post Type Selection */}
                    <div className="space-y-4">
                      <label className="text-sm font-semibold text-[#f5f5f5] uppercase tracking-wider opacity-80">
                        Select Post Type
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {Object.entries(postTypeIcons).map(([type, icon]) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                postType: type,
                              }))
                            }
                            className={`relative flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 overflow-hidden group/btn ${
                              formData.postType === type
                                ? `border-[#4790fd] bg-gradient-to-br ${postTypeColors[type]}`
                                : "border-[#ffffff]/10 bg-[#000000]/20 hover:border-[#ffffff]/20 hover:bg-[#ffffff]/5"
                            }`}
                          >
                            <span
                              className={`relative z-10 transition-colors duration-300 ${
                                formData.postType === type
                                  ? "text-[#f5f5f5]"
                                  : "text-[#a0a0a0] group-hover/btn:text-[#f5f5f5]"
                              }`}
                            >
                              {icon}
                            </span>
                            <span
                              className={`relative z-10 font-medium transition-colors duration-300 ${
                                formData.postType === type
                                  ? "text-[#f5f5f5]"
                                  : "text-[#a0a0a0] group-hover/btn:text-[#f5f5f5]"
                              }`}
                            >
                              {type}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Caption Input */}
                    <div className="space-y-4">
                      <label className="text-sm font-semibold text-[#f5f5f5] uppercase tracking-wider opacity-80">
                        Content
                      </label>
                      <div className="relative">
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="What's on your mind? Share your thoughts..."
                          rows="6"
                          className="w-full px-5 py-4 rounded-2xl border border-[#ffffff]/10 bg-[#000000]/20 backdrop-blur-sm text-[#f5f5f5] placeholder-[#666666] focus:border-[#4790fd] focus:ring-1 focus:ring-[#4790fd] transition-all duration-300 resize-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Media Upload */}
                    <div className="space-y-4">
                      <label className="text-sm font-semibold text-[#f5f5f5] uppercase tracking-wider opacity-80">
                        Media
                      </label>
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#000000]/20 border-2 border-dashed border-[#ffffff]/10 hover:border-[#4790fd]/50 transition-all duration-300 group/upload">
                        {formData.file ? (
                          <div className="relative w-full h-full">
                            {formData.file.type.startsWith("image/") ? (
                              <img
                                src={URL.createObjectURL(formData.file)}
                                alt="Preview"
                                className="w-full h-full object-contain bg-black/50"
                              />
                            ) : (
                              <VideoPlayer
                                src={URL.createObjectURL(formData.file)}
                                className="w-full h-full object-contain bg-black/50"
                                preload="metadata"
                              />
                            )}
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className="absolute top-4 right-4 p-2.5 bg-[#000000]/80 hover:bg-[#ef4444] text-[#f5f5f5] rounded-full transition-all duration-300 backdrop-blur-md border border-[#ffffff]/10"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#a0a0a0] group-hover/upload:text-[#4790fd] transition-colors cursor-pointer">
                            <div className="p-4 rounded-full bg-[#ffffff]/5 group-hover/upload:bg-[#4790fd]/10 transition-colors mb-3">
                              <UploadCloud size={32} />
                            </div>
                            <p className="text-sm font-medium">
                              Click or drag files to upload
                            </p>
                            <p className="text-xs text-[#666666] mt-1">
                              Supports high-res images and videos
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          name="file"
                          accept="image/*,video/*,.mp4,.webm,.ogg,.mov,.avi,.wmv,.flv,.mkv"
                          onChange={handleChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4">
                      <div className="flex gap-2">
                        {/* Quick Actions (Visual only for now) */}
                        {[Image, Video, Link, Smile].map((Icon, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="p-3 text-[#a0a0a0] hover:text-[#4790fd] hover:bg-[#4790fd]/10 rounded-xl transition-all duration-300"
                          >
                            <Icon size={20} />
                          </button>
                        ))}
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#4790fd] to-[#3b82f6] hover:from-[#3b82f6] hover:to-[#2563eb] text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4790fd]/20 hover:shadow-[#4790fd]/40 hover:scale-[1.02]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Posting...</span>
                          </>
                        ) : (
                          <>
                            <Send size={20} />
                            <span>Post Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Guidelines */}
          <div className="space-y-6">
            {/* User Profile Summary */}
            <div className="bg-[#1a1a1a]/40 backdrop-blur-xl rounded-3xl border border-[#ffffff]/10 p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={user?.imageUrl}
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-[#4790fd]/40"
                />
                <div>
                  <h3 className="font-semibold text-[#f5f5f5] text-lg">
                    {user?.fullName}
                  </h3>
                  <p className="text-sm text-[#a0a0a0]">Student</p>
                </div>
              </div>
              <div className="flex gap-2 text-sm">
                <span className="px-3 py-1 rounded-full bg-[#27dc66]/10 text-[#27dc66] border border-[#27dc66]/20">
                  Online
                </span>
                <span className="px-3 py-1 rounded-full bg-[#4790fd]/10 text-[#4790fd] border border-[#4790fd]/20">
                  Posting
                </span>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-[#1a1a1a]/40 backdrop-blur-xl rounded-3xl border border-[#ffffff]/10 p-6">
              <h3 className="text-lg font-semibold text-[#f5f5f5] mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ece239]" />
                Posting Guidelines
              </h3>
              <ul className="space-y-3 text-sm text-[#a0a0a0]">
                {[
                  "Be respectful to the community.",
                  "Share authentic and original content.",
                  "Use high-quality images for better reach.",
                  "Check your spelling and grammar.",
                ].map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4790fd] mt-2 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
