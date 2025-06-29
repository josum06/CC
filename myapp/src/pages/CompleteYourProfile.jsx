import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { X, UploadCloud, ArrowLeft, Camera, Github, Linkedin, BookOpen, Building, GraduationCap, User, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const CompleteYourProfile = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [skillsInput, setSkillsInput] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [skills, setSkills] = useState([]);
  const [aboutMe, setAboutMe] = useState("");
  const [idCardPhoto, setIdCardPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(false);

  const allowedBranchCodes = {
    "027": "Computer Science Engineering",
    "031": "Information Technology",
    "119": "Artificial Intelligence and Data Science",
    "049": "Electrical Engineering",
    "028": "Electronics and Communication Engineering",
    "157": "Computer Science Engineering in Data Science",
  };

  const VALID_COLLEGE_CODE = "208";
  const COLLEGE_NAME = "Bhagwan Parshuram Institute of Technology";

  const handleEnrollmentChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setEnrollmentNumber(value);
      if (value.length === 11) {
        const roll = value.substring(0, 3);
        const college = value.substring(3, 6);
        const branch = value.substring(6, 9);
        const batch = value.substring(9, 11);

        if (college !== VALID_COLLEGE_CODE) {
          toast.error("Your college is not registered.");
          resetFields();
          return;
        }

        if (!allowedBranchCodes[branch]) {
          toast.error("Invalid branch code.");
          resetFields();
          return;
        }

        setRollNumber(roll);
        setBranchCode(branch);
        setBatchYear(`20${batch}`);
      } else {
        resetFields();
      }
    }
  };

  const resetFields = () => {
    setRollNumber("");
    setBranchCode("");
    setBatchYear("");
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user/profile/${user.id}`
      );
      const data = response.data;
      console.log(data);
      setEnrollmentNumber(data.enrollmentNumber || "");
      setGithubUrl(data.githubUrl || "");
      setLinkedinUrl(data.linkedinUrl || "");
      setSkills(data.skills || []);
      setAboutMe(data.aboutMe || "");
      if (data.collegeIDCard) {
        setIdCardPhoto(data.collegeIDCard);
      }
      setStatus(data.status);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPG, JPEG, and PNG files are allowed.");
        return;
      }
      setIdCardPhoto(file);
    }
  };

  const removeImage = () => {
    setIdCardPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("clerkId", user?.id);
      if (enrollmentNumber)
        formData.append("enrollmentNumber", enrollmentNumber);
      if (githubUrl) formData.append("githubUrl", githubUrl);
      if (linkedinUrl) formData.append("linkedinUrl", linkedinUrl);
      if (aboutMe) formData.append("aboutMe", aboutMe);
      if (skills.length) formData.append("skills", JSON.stringify(skills));
      if (idCardPhoto && typeof idCardPhoto !== "string")
        formData.append("idCardPhoto", idCardPhoto);

      const response = await axios.patch(
        "http://localhost:3000/api/user/upload-profile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Profile updated successfully!");
      navigate("/");
      console.log("Updated User:", response.data.user);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProgress = () => {
    let completed = 0;
    let total = 5; // Total number of required fields

    if (enrollmentNumber) completed++;
    if (githubUrl) completed++;
    if (linkedinUrl) completed++;
    if (skills.length > 0) completed++;
    if (idCardPhoto) completed++;

    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-gray-500/50 px-3 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="relative group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 ring-2 sm:ring-4 ring-blue-500/30 shadow-xl sm:shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-300">
                <img
                  src={user?.imageUrl}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                <button className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-1.5 sm:p-2 bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Camera size={12} className="sm:w-4 sm:h-4 text-gray-300" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
                Complete Your Profile
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl leading-relaxed">
                Take a moment to set up your professional profile. This information helps us personalize your experience and connect you with opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 py-6 sm:px-6 sm:py-8 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-[#232526] via-[#1a1b1c] to-[#000000] rounded-2xl sm:rounded-3xl border border-gray-500/30 shadow-2xl overflow-hidden">
          {/* Progress Bar */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-500/30 bg-gradient-to-r from-gray-700/20 via-gray-600/10 to-gray-700/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 h-2 sm:h-3 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 ease-out shadow-lg"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-gray-300">
                  {calculateProgress()}% Complete
                </span>
                {calculateProgress() === 100 && (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 xl:gap-12">
                {/* Left Column */}
                <div className="space-y-6 sm:space-y-8">
                  {/* Personal Information */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white flex items-center gap-2 sm:gap-3">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                        <span className="text-base sm:text-lg lg:text-xl">Personal Information</span>
                      </h2>
                      <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-300 text-xs sm:text-sm font-medium rounded-full border border-blue-500/30 self-start sm:self-auto">
                        Required
                      </span>
                    </div>

                    {/* Name and Email Card */}
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl sm:rounded-2xl border border-gray-700/50 p-4 sm:p-6 backdrop-blur-sm">
                      <div className="space-y-4">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <label className="text-xs sm:text-sm font-medium text-gray-400">Full Name</label>
                            <p className="text-sm sm:text-base lg:text-lg font-medium text-white mt-1 break-words">{user?.fullName}</p>
                          </div>
                        </div>
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg flex-shrink-0">
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <label className="text-xs sm:text-sm font-medium text-gray-400">Email Address</label>
                            <p className="text-sm sm:text-base lg:text-lg font-medium text-white mt-1 break-all">
                              {user?.primaryEmailAddress?.emailAddress}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enrollment Section */}
                    <div className="space-y-3 sm:space-y-4">
                      <div className="relative">
                        <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                          Enrollment Number
                        </label>
                        <div className="relative group">
                          <input
                            type="text"
                            disabled={status}
                            value={enrollmentNumber}
                            required
                            onChange={(e) => {
                              if (e.target.value.length <= 11) {
                                handleEnrollmentChange(e);
                              }
                            }}
                            className={`w-full p-3 sm:p-4 text-sm sm:text-base border rounded-lg sm:rounded-xl bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-white placeholder-gray-400 ${
                              status ? "bg-gray-700/50 cursor-not-allowed" : "hover:border-gray-600"
                            }`}
                            placeholder="Enter your 11-digit enrollment number"
                          />
                          {enrollmentNumber && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                            </div>
                          )}
                        </div>
                      </div>

                      {enrollmentNumber && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-colors duration-300">
                            <div className="flex items-center space-x-2 text-gray-400 mb-2">
                              <BookOpen size={14} className="sm:w-4 sm:h-4" />
                              <span className="text-xs sm:text-sm font-medium">Roll Number</span>
                            </div>
                            <p className="text-sm sm:text-base lg:text-lg font-semibold text-white">
                              {enrollmentNumber.substring(0, 3)}
                            </p>
                          </div>

                          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-colors duration-300">
                            <div className="flex items-center space-x-2 text-gray-400 mb-2">
                              <Building size={14} className="sm:w-4 sm:h-4" />
                              <span className="text-xs sm:text-sm font-medium">Batch Year</span>
                            </div>
                            <p className="text-sm sm:text-base lg:text-lg font-semibold text-white">
                              {"20" + enrollmentNumber.substring(9, 11)}
                            </p>
                          </div>

                          <div className="col-span-1 sm:col-span-2 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-colors duration-300">
                            <div className="flex items-center space-x-2 text-gray-400 mb-2">
                              <GraduationCap size={14} className="sm:w-4 sm:h-4" />
                              <span className="text-xs sm:text-sm font-medium">Branch</span>
                            </div>
                            <p className="text-sm sm:text-base lg:text-lg font-semibold text-white">
                              {allowedBranchCodes[enrollmentNumber.substring(6,9)] || ""}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-purple-500/20 rounded-lg">
                        <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                      </div>
                      <span className="text-base sm:text-lg lg:text-xl">Social Presence</span>
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="group">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                            <Github className="text-gray-400 group-hover:text-gray-300 transition-colors w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <input
                            type="url"
                            disabled={status}
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base border rounded-lg sm:rounded-xl bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-600 text-white placeholder-gray-400"
                            placeholder="Your GitHub profile URL"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                            <Linkedin className="text-gray-400 group-hover:text-gray-300 transition-colors w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <input
                            type="url"
                            disabled={status}
                            value={linkedinUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base border rounded-lg sm:rounded-xl bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-600 text-white placeholder-gray-400"
                            placeholder="Your LinkedIn profile URL"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6 sm:space-y-8">
                  {/* Skills Section */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-orange-500/20 rounded-lg">
                          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                        </div>
                        <span className="text-base sm:text-lg lg:text-xl">Skills & Expertise</span>
                      </h3>
                      <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-orange-600/20 to-orange-700/20 text-orange-300 text-xs sm:text-sm font-medium rounded-full border border-orange-500/30 self-start sm:self-auto">
                        {skills.length} Added
                      </span>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg sm:rounded-xl border border-gray-700/50 p-4 sm:p-6 backdrop-blur-sm">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="group flex items-center bg-gray-700/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300"
                          >
                            <span className="text-xs sm:text-sm font-medium text-gray-200">{skill}</span>
                            <button 
                              type="button"
                              onClick={() => setSkills(skills.filter((s) => s !== skill))}
                              className="ml-1.5 sm:ml-2 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <X size={12} className="sm:w-3.5 sm:h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex">
                        <input
                          type="text"
                          value={skillsInput}
                          onChange={(e) => setSkillsInput(e.target.value)}
                          className="flex-1 p-2.5 sm:p-3 text-sm sm:text-base border rounded-l-lg sm:rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-800/50 text-white placeholder-gray-400"
                          placeholder="Type a skill and press Add"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (skillsInput.trim() && !skills.includes(skillsInput.trim().toLowerCase())) {
                              setSkills([...skills, skillsInput.trim().toLowerCase()]);
                              setSkillsInput("");
                            }
                          }}
                          className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-r-lg sm:rounded-r-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* About Me Section */}
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-green-500/20 rounded-lg">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      </div>
                      <span className="text-base sm:text-lg lg:text-xl">About Me</span>
                    </h3>
                    <div className="relative">
                      <textarea
                        value={aboutMe}
                        disabled={status}
                        onChange={(e) => setAboutMe(e.target.value)}
                        className="w-full p-3 sm:p-4 text-sm sm:text-base border rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 h-32 sm:h-40 resize-none text-white placeholder-gray-400"
                        placeholder="Share your story, interests, and what drives you..."
                      />
                      <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-xs sm:text-sm text-gray-400">
                        {aboutMe.length}/500
                      </div>
                    </div>
                  </div>

                  {/* ID Card Upload */}
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-red-500/20 rounded-lg">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                      </div>
                      <span className="text-base sm:text-lg lg:text-xl">College ID Card</span>
                    </h3>
                    <div className="relative group">
                      <div className="relative w-full aspect-[16/10] rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-2 border-dashed border-gray-600/50 hover:border-blue-500/50 transition-all duration-300 overflow-hidden backdrop-blur-sm">
                        <input
                          type="file"
                          accept="image/*"
                          required={!idCardPhoto}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          onChange={handleFileChange}
                        />
                        {idCardPhoto ? (
                          <div className="relative w-full h-full">
                            <img
                              src={typeof idCardPhoto === "string" ? idCardPhoto : URL.createObjectURL(idCardPhoto)}
                              alt="ID Card"
                              className="w-full h-full object-contain"
                            />
                            <button
                              onClick={removeImage}
                              className="absolute top-2 right-2 p-1.5 sm:p-2 bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                            >
                              <X size={14} className="sm:w-4.5 sm:h-4.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 hover:text-blue-400 transition-colors duration-300 p-4">
                            <UploadCloud size={32} className="sm:w-10 sm:h-10" />
                            <p className="mt-2 text-xs sm:text-sm font-medium text-center">Click or drag to upload your ID card</p>
                            <p className="text-xs text-gray-500 mt-1 text-center">Supported formats: JPG, PNG</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 sm:mt-8 lg:mt-12 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8 border-t border-gray-500/30 pt-4 sm:pt-6 bg-gradient-to-r from-gray-700/20 via-gray-600/10 to-gray-700/20">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto group relative px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-xl sm:shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <span className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Profile</span>
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer 
        position="bottom-right"
        theme="dark"
        className="toast-container"
      />
    </div>
  );
};

export default CompleteYourProfile;
