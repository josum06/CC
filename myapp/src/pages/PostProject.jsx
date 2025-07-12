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
  Loader2,
  ArrowLeft,
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
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile/${user.id}`
      );
      const data = response.data;
      const userId = data._id;
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
        `${import.meta.env.VITE_BACKEND_URL}/api/project/create-project`,
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
    <div className="min-h-screen bg-[#000000] text-gray-100">
      {/* Header Section */}
      <div className="border-b border-gray-500/50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">
            Share Your Project
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Showcase your amazing projects and connect with fellow developers
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
                <p className="text-sm text-gray-400">Project Creator</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Project Title
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a compelling project title"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-500/50 bg-gradient-to-r from-gray-500/10 via-gray-600/5 to-gray-500/10 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Project Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your project in detail. What problem does it solve? What technologies did you use?"
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-gray-500/50 bg-gradient-to-r from-gray-500/10 via-gray-600/5 to-gray-500/10 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                  required
                />
              </div>

              {/* URLs Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project URL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Project URL
                  </label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="url"
                      name="projectUrl"
                      value={formData.projectUrl}
                      onChange={handleChange}
                      placeholder="Live project link"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-500/50 bg-gradient-to-r from-gray-500/10 via-gray-600/5 to-gray-500/10 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* GitHub URL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    GitHub Repository
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="url"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleChange}
                      placeholder="GitHub repository link"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-500/50 bg-gradient-to-r from-gray-500/10 via-gray-600/5 to-gray-500/10 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-500/50 bg-gradient-to-r from-gray-500/10 via-gray-600/5 to-gray-500/10 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 rounded-xl hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-200 flex items-center gap-2 border border-blue-500/30"
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
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 rounded-full text-sm font-medium group border border-blue-500/30"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-colors"
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
                  <label className="text-sm font-medium text-gray-300">
                    Project Contributors
                  </label>
                  <button
                    type="button"
                    onClick={handleAddContributor}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-200 border border-blue-500/30"
                  >
                    <Users className="w-4 h-4" />
                    <span>Add Contributor</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.contributors.map((contributor, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="url"
                          name="contributors"
                          data-index={index}
                          value={contributor}
                          onChange={handleChange}
                          placeholder="Contributor's profile link"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-500/50 bg-gradient-to-r from-gray-500/10 via-gray-600/5 to-gray-500/10 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
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
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200 border border-red-500/30"
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
                <label className="text-sm font-medium text-gray-300">
                  Project Media
                </label>
                <div className="relative group">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-500/10 via-gray-600/5 to-gray-700/5 border-2 border-dashed border-gray-500/50 hover:border-blue-500/50 transition-all duration-300">
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
                          className="absolute top-4 right-4 p-2 bg-black/70 hover:bg-black/90 text-white rounded-full transition-colors backdrop-blur-sm border border-gray-500/50"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 group-hover:text-blue-400 transition-colors">
                        <ImageIcon size={48} className="mb-3" />
                        <p className="text-sm font-medium">
                          Click or drag files to upload
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Images or videos up to 10MB
                        </p>
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
                      <span>Publish Project</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-gradient-to-br from-[#232526] via-[#1a1b1c] to-[#000000] rounded-2xl border border-gray-500/30 p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-3">
            Project Guidelines
          </h3>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                Include a clear description of what your project does and the
                problem it solves
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>List all technologies and frameworks used in your project</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                Provide live demo links and GitHub repository URLs when
                available
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>
                Add high-quality screenshots or videos to showcase your project
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Credit all contributors who helped with the project</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostProject;
