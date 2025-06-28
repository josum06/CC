import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UploadCloud, Send, X, ArrowLeft, 
  Link as LinkIcon, FileText, Calendar, Briefcase 
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
    Placement: <Briefcase className="w-5 h-5" />,
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
        `http://localhost:3000/api/user/profile/${user.id}`
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

      await axios.post("http://localhost:3000/api/admin-post/create-post", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <div className="fixed top-15 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-200">
       
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* User Info Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <img
                src={user?.imageUrl}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
              />
              <div>
                <h2 className="font-medium text-gray-900">{user?.fullName}</h2>
                <p className="text-sm text-gray-500">Faculty Member</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Post Type Selection */}
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(postTypeIcons).map(([type, icon]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, postType: type }))}
                  className={`flex items-center justify-center space-x-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.postType === type
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {icon}
                  <span className="font-medium">{type}</span>
                </button>
              ))}
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a compelling title"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed information about your post"
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Link Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">External Link</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon size={20} className="text-gray-400" />
                </div>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="Add a relevant link (optional)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Media Upload</label>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 hover:border-blue-500 transition-all duration-200">
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
                      onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                      className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 transition-colors">
                    <UploadCloud size={48} />
                    <p className="mt-2 text-sm font-medium">Click or drag files to upload</p>
                    <p className="text-xs text-gray-400 mt-1">Supports images and videos</p>
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
            <div className="flex justify-end pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
      </div>
    </div>
  );
};

export default FacultyPost;
