import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Send, X } from "lucide-react";

const FacultyPost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
    postType: "Academics", // Default value
    link: "", // State for the link
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    // Handle form submission logic (API call, etc.)
    alert(`Post submitted successfully!\nType: ${formData.postType}`);
    navigate("/home"); // Navigate to Home Page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-10">
      <button
        onClick={() => {
          navigate("/Home");
        }}
        className="absolute top-4 left-4 text-3xl bg-gray-200 px-3 py-1 hover:cursor-pointer rounded-full text-gray-600 hover:text-gray-800"
      >
        &times; {/* "×" represents the cross sign */}
      </button>
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">Faculty Post Form</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows="4"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Post Type */}
          <div>
            <label className="block text-sm font-medium">Post Type</label>
            <select
              name="postType"
              value={formData.postType}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Notice">Notice</option>
              <option value="Events">Events</option>
              <option value="Placement">Placement</option>
            </select>
          </div>

          {/* Link Input */}
          <div>
            <label className="block text-sm font-medium">Attach Link</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Enter a link (optional)"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File Upload */}
          <div className="flex flex-col items-start gap-1">
            <label className="block text-lg font-medium">Upload File</label>
            <div className="relative w-full aspect-w-16 aspect-h-9 border rounded-lg overflow-hidden h-64">
              {formData.file ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  {formData.file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(formData.file)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(formData.file)}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <UploadCloud size={40} />
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

          {/* Submit Button */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              <Send size={20} /> Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyPost;
