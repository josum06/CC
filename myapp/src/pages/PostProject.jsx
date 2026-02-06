import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
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
  Sparkles,
  Code,
} from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
// import { showToast } from "../components/CustomToast"; // Component not found
import { useTheme } from "../context/ThemeContext";

const PostProject = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { isDarkMode } = useTheme();
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
          [name]: file,
        }));
      }
    } else {
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
          [name]: value,
        }));
      }
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
      contributors: [...prev.contributors, ""],
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
    setIsSubmitting(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile/${user.id}`,
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
        (c) => c.trim() !== "",
      );
      form.append("contributors", JSON.stringify(validContributors));

      formData.skills.forEach((skill) => form.append("TechStack", skill));
      form.append("userId", userId);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/create-project`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      toast.success("Project submitted successfully!");
      navigate("/Network");
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to submit project. Please try again.");
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#27dc66]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4790fd]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c76191]/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#f5f5f5] flex items-center gap-3">
                <Code className="w-8 h-8 text-[#27dc66]" />
                Share Your Project
              </h1>
              <p className="text-sm text-[#a0a0a0] mt-1">
                Showcase your amazing work to the community
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#27dc66]/10 via-[#4790fd]/5 to-[#c76191]/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>

              <div className="relative bg-[#1a1a1a]/40 backdrop-blur-xl rounded-3xl border border-[#ffffff]/10 overflow-hidden">
                <div className="p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Project Basics */}
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-[#f5f5f5] uppercase tracking-wider opacity-80 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#27dc66]" />
                          Project Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Enter a compelling project title"
                          className="w-full px-5 py-4 rounded-2xl border border-[#ffffff]/10 bg-[#000000]/20 backdrop-blur-sm text-[#f5f5f5] placeholder-[#666666] focus:border-[#27dc66] focus:ring-1 focus:ring-[#27dc66] transition-all duration-300"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-[#f5f5f5] uppercase tracking-wider opacity-80">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Describe your project in detail. What problem does it solve? What technologies did you use?"
                          rows="6"
                          className="w-full px-5 py-4 rounded-2xl border border-[#ffffff]/10 bg-[#000000]/20 backdrop-blur-sm text-[#f5f5f5] placeholder-[#666666] focus:border-[#27dc66] focus:ring-1 focus:ring-[#27dc66] transition-all duration-300 resize-none"
                          required
                        />
                      </div>
                    </div>

                    {/* URLs Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-[#f5f5f5] uppercase tracking-wider opacity-80 flex items-center gap-2">
                          <Link className="w-4 h-4 text-[#4790fd]" />
                          Project URL
                        </label>
                        <input
                          type="url"
                          name="projectUrl"
                          value={formData.projectUrl}
                          onChange={handleChange}
                          placeholder="https://your-project.com"
                          className="w-full px-5 py-4 rounded-2xl border border-[#ffffff]/10 bg-[#000000]/20 backdrop-blur-sm text-[#f5f5f5] placeholder-[#666666] focus:border-[#4790fd] focus:ring-1 focus:ring-[#4790fd] transition-all duration-300"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-[#f5f5f5] uppercase tracking-wider opacity-80 flex items-center gap-2">
                          <Github className="w-4 h-4 text-[#4790fd]" />
                          GitHub Repository
                        </label>
                        <input
                          type="url"
                          name="githubUrl"
                          value={formData.githubUrl}
                          onChange={handleChange}
                          placeholder="https://github.com/username/repo"
                          className="w-full px-5 py-4 rounded-2xl border border-[#ffffff]/10 bg-[#000000]/20 backdrop-blur-sm text-[#f5f5f5] placeholder-[#666666] focus:border-[#4790fd] focus:ring-1 focus:ring-[#4790fd] transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Skills & Media */}
                    <div className="grid grid-cols-1 gap-6">
                      {/* Skills Section */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-[#f5f5f5] uppercase tracking-wider opacity-80">
                          Technologies Used
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleAddSkill(e);
                              }
                            }}
                            placeholder="Add tech stack (e.g., React, Node.js)"
                            className="flex-1 px-5 py-3 rounded-xl border border-[#ffffff]/10 bg-[#000000]/20 backdrop-blur-sm text-[#f5f5f5] placeholder-[#666666] focus:border-[#27dc66] focus:ring-1 focus:ring-[#27dc66] transition-all duration-300"
                          />
                          <button
                            type="button"
                            onClick={handleAddSkill}
                            className="px-6 py-3 bg-[#27dc66]/10 hover:bg-[#27dc66]/20 text-[#27dc66] rounded-xl transition-all duration-300 border border-[#27dc66]/20 flex items-center gap-2"
                          >
                            <Plus className="w-5 h-5" />
                            <span className="hidden sm:inline">Add</span>
                          </button>
                        </div>
                        {formData.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-2">
                            {formData.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#27dc66]/10 text-[#27dc66] rounded-full text-sm font-medium border border-[#27dc66]/20 group"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSkill(skill)}
                                  className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-[#27dc66]/20 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* File Upload Section */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-[#f5f5f5] uppercase tracking-wider opacity-80">
                          Project Media
                        </label>
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#000000]/20 border-2 border-dashed border-[#ffffff]/10 hover:border-[#27dc66]/50 transition-all duration-300 group/upload">
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
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#a0a0a0] group-hover/upload:text-[#27dc66] transition-colors cursor-pointer">
                              <div className="p-4 rounded-full bg-[#ffffff]/5 group-hover/upload:bg-[#27dc66]/10 transition-colors mb-3">
                                <ImageIcon size={32} />
                              </div>
                              <p className="text-sm font-medium">
                                Click or drag to upload media
                              </p>
                              <p className="text-xs text-[#666666] mt-1">
                                Supports high-res images & videos
                              </p>
                            </div>
                          )}
                          <input
                            type="file"
                            name="file"
                            accept="image/*,video/*,.mp4,.webm,.ogg,.mov,.avi,.wmv,.flv,.mkv"
                            onChange={handleChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contributors Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-[#f5f5f5] uppercase tracking-wider opacity-80 flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#c76191]" />
                          Contributors
                        </label>
                        <button
                          type="button"
                          onClick={handleAddContributor}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#c76191] bg-[#c76191]/10 hover:bg-[#c76191]/20 rounded-lg transition-all duration-300 border border-[#c76191]/20"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Contributor</span>
                        </button>
                      </div>
                      <div className="space-y-3">
                        {formData.contributors.map((contributor, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="relative flex-1">
                              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                              <input
                                type="url"
                                name="contributors"
                                data-index={index}
                                value={contributor}
                                onChange={handleChange}
                                placeholder="Contributor's profile link"
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#ffffff]/10 bg-[#000000]/20 backdrop-blur-sm text-[#f5f5f5] placeholder-[#666666] focus:border-[#c76191] focus:ring-1 focus:ring-[#c76191] transition-all duration-300"
                              />
                            </div>
                            {index >= 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newContributors =
                                    formData.contributors.filter(
                                      (_, i) => i !== index,
                                    );
                                  setFormData((prev) => ({
                                    ...prev,
                                    contributors: newContributors,
                                  }));
                                }}
                                className="p-3 text-[#c76191] hover:bg-[#c76191]/10 rounded-xl transition-all duration-300 border border-[#c76191]/20"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        {formData.contributors.length === 0 && (
                          <div className="text-center py-6 border border-dashed border-[#ffffff]/10 rounded-xl bg-[#ffffff]/5">
                            <p className="text-sm text-[#666666]">
                              No contributors added yet
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-[#ffffff]/10">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#27dc66] to-[#20b454] hover:from-[#20b454] hover:to-[#1a9d49] text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#27dc66]/20 hover:shadow-[#27dc66]/40 hover:scale-[1.01]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Publishing Project...</span>
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
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-6">
            {/* User Profile Summary */}
            <div className="bg-[#1a1a1a]/40 backdrop-blur-xl rounded-3xl border border-[#ffffff]/10 p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={user?.imageUrl}
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-[#27dc66]/40"
                />
                <div>
                  <h3 className="font-semibold text-[#f5f5f5] text-lg">
                    {user?.fullName}
                  </h3>
                  <p className="text-sm text-[#a0a0a0]">Project Creator</p>
                </div>
              </div>
              <div className="flex gap-2 text-sm">
                <span className="px-3 py-1 rounded-full bg-[#27dc66]/10 text-[#27dc66] border border-[#27dc66]/20">
                  Active
                </span>
                <span className="px-3 py-1 rounded-full bg-[#4790fd]/10 text-[#4790fd] border border-[#4790fd]/20">
                  Builder
                </span>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-[#1a1a1a]/40 backdrop-blur-xl rounded-3xl border border-[#ffffff]/10 p-6">
              <h3 className="text-lg font-semibold text-[#f5f5f5] mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ece239]" />
                Project Guidelines
              </h3>
              <ul className="space-y-4 text-sm text-[#a0a0a0]">
                {[
                  "Clear & descriptive title helps in discovery.",
                  "Explain the problem your project solves.",
                  "List all major technologies used.",
                  "Add a live demo link if available.",
                  "Credit your contributors fairly.",
                ].map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#27dc66] mt-2 shrink-0" />
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-[#27dc66]/20 to-[#4790fd]/20 backdrop-blur-xl rounded-3xl border border-[#ffffff]/10 p-6">
              <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">
                Did you know?
              </h3>
              <p className="text-sm text-[#a0a0a0] leading-relaxed">
                Projects with a video demo and detailed description get 3x more
                engagement from the community!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostProject;
