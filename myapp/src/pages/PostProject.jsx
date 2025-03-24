import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, Send, ArrowLeft, X } from "lucide-react";

const PostProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
    projectUrl: "",
    githubUrl: "",
    contributors: [""], // State for contributors
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "contributors") {
      const index = parseInt(e.target.dataset.index);
      const newContributors = [...formData.contributors];
      newContributors[index] = value;
      setFormData((prev) => ({
        ...prev,
        contributors: newContributors,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      file: null,
    }));
  };

  const handleAddContributor = () => {
    setFormData((prev) => ({
      ...prev,
      contributors: [...prev.contributors, ""], // Add a new empty contributor field
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    // Handle form submission logic (API call, etc.)
    alert("Post submitted successfully!");
    navigate("/home"); // Navigate to the home page after submitting
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <button
        onClick={() => {
          navigate("/Home");
        }}
        className="absolute top-4 left-4 text-3xl bg-gray-200 px-3 py-1 hover:cursor-pointer rounded-full text-gray-600 hover:text-gray-800"
      >
        &times; {/* "×" represents the cross sign */}
      </button>
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4">Post Your Project!</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter project title"
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
              placeholder="What do you want to talk about?!"
              rows="4"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Project URL */}
          <div>
            <label className="block text-sm font-medium">Project URL</label>
            <input
              type="url"
              name="projectUrl"
              value={formData.projectUrl}
              onChange={handleChange}
              placeholder="Enter project URL"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* GitHub URL */}
          <div>
            <label className="block text-sm font-medium">GitHub URL</label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="Enter GitHub URL"
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contributors */}
          <div>
            <label className="block text-sm font-medium">Contributors</label>
            {formData.contributors.map((contributor, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="url"
                  name="contributors"
                  data-index={index}
                  value={contributor}
                  onChange={handleChange}
                  placeholder="Enter contributor profile link"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newContributors = formData.contributors.filter((_, i) => i !== index);
                    setFormData((prev) => ({
                      ...prev,
                      contributors: newContributors,
                    }));
                  }}
                  className="ml-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddContributor}
              className="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 transition"
            >
              Add Contributor
            </button>
          </div>

          {/* File Upload */}
          <div className="flex flex-col items-start gap-4">
            <label className="block text-lg font-medium">Upload File</label>
            <div className="relative w-[50%] aspect-w-16 aspect-h-9 border rounded-lg overflow-hidden h-45">
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

export default PostProject;
