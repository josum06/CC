import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Send, ArrowLeft, X, Image, Video, Link, Smile } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "@clerk/clerk-react";

const PostPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
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
        `http://localhost:3000/api/user/profile/${user.id}`
      );

      const data = response.data;
      const form = new FormData();
      form.append("caption", formData.description);
      form.append("file", formData.file);
      form.append("author", data._id);

      await axios.post("http://localhost:3000/api/post/create-post", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post created successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error uploading file:", err);
      toast.error("Error uploading file. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/Home")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Create Post</h1>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* User Info */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <img
                src={user?.imageUrl}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
              />
              <div>
                <h2 className="font-medium text-gray-900">{user?.fullName}</h2>
                <p className="text-sm text-gray-500">Posting to your feed</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Caption Input */}
            <div className="mb-6 border border-gray-300 rounded-xl">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What's on your mind?"
                rows="4"
                className="w-full p-4 text-lg rounded-xl border-0 focus:ring-0 resize-none placeholder:text-gray-400"
                required
              />
            </div>

            {/* Media Upload */}
            <div className="relative">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 hover:border-blue-500 transition-colors">
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
                      onClick={handleRemoveFile}
                      className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 transition-colors">
                    <UploadCloud size={48} />
                    <p className="mt-2 text-sm font-medium">Click or drag files to upload</p>
                    <p className="text-xs text-gray-400 mt-1">Support for images and videos</p>
                  </div>
                )}
                <input
                  type="file"
                  name="file"
                  accept="image/*,video/*"
                  onChange={handleChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6">
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Image size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Video size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Link size={20} />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Smile size={20} />
                </button>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Post</span>
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

export default PostPage;
