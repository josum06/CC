import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  Send,
  X,
  Link,
  Github,
  Users,
  FileText,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const PostProject = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
    projectUrl: "",
    githubUrl: "",
    contributors: [],
    skills: [],
  });
  const [skillInput, setSkillInput] = useState("");

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

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form Data:", formData);
      const response = await axios.get(
        `http://localhost:3000/api/user/profile/${user.id}`
      );
      const data = response.data;
      const userId = data._id;
      console.log("User ID:", userId);
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("image", formData.file);
      if (formData.githubUrl) form.append("githubUrl", formData.githubUrl);
      form.append("projectUrl", formData.projectUrl);
      const validContributors = formData.contributors.filter(
        (c) => c.trim() !== ""
      );
      form.append("contributors", JSON.stringify(validContributors));

      formData.skills.forEach((skill) => form.append("TechStack", skill));
      form.append("userId", userId);
      await axios.post(
        "http://localhost:3000/api/project/create-project",
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setIsSubmitting(true);
      toast.success("Project submitted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to submit project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Share Your Project
            </h1>
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Project Title
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a compelling project title"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Project Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your project in detail. What problem does it solve? What technologies did you use?"
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* URLs Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project URL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Project URL
                  </label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="projectUrl"
                      value={formData.projectUrl}
                      onChange={handleChange}
                      placeholder="Live project link"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* GitHub URL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    GitHub Repository
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleChange}
                      placeholder="GitHub repository link"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Technologies & Skills Used
                </label>
                <div className="space-y-3">
                  {/* Skills Input */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleAddSkill(e);
                          }
                        }}
                        placeholder="Add technologies (e.g., React, Node.js, MongoDB)"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-200 flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add
                    </button>
                  </div>

                  {/* Skills Tags */}
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium group"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Contributors Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Project Contributors
                  </label>
                  <button
                    type="button"
                    onClick={handleAddContributor}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Users className="w-4 h-4" />
                    <span>Add Contributor</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.contributors.map((contributor, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="url"
                          name="contributors"
                          data-index={index}
                          value={contributor}
                          onChange={handleChange}
                          placeholder="Contributor's profile link"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newContributors =
                              formData.contributors.filter(
                                (_, i) => i !== index
                              );
                            setFormData((prev) => ({
                              ...prev,
                              contributors: newContributors,
                            }));
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* File Upload Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Project Media
                </label>
                <div className="relative group">
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl transition-all duration-200 hover:border-blue-500">
                    {formData.file ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden">
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
                          className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-500">
                          <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Images or videos up to 10MB
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      name="file"
                      accept="image/*"
                      onChange={handleChange}
                      required
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Publish Project</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostProject;
