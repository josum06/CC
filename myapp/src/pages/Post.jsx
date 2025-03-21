import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Send, ArrowLeft } from "lucide-react";

const PostPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    // Handle form submission logic here (API call, etc.)
    alert("Post submitted successfully!");
    navigate("/home"); // Navigate to the home page after submitting
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
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

          {/* File Upload */}
          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium">Upload</label>
            <input
              type="file"
              name="file"
              accept="image/*,video/*"
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
              required
            />
            <UploadCloud className="text-blue-500" size={24} />
          </div>

          {/* Submit Button */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-lg transition"
            >
              <ArrowLeft size={20} /> Go Back
            </button>
            <button
              type="button"
              onClick={() => navigate("/FacultyPost")}
              className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-lg transition"
            >
               Faculty post
            </button>

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

export default PostPage;
