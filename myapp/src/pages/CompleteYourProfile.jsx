import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { X, UploadCloud, ArrowLeft, Camera, Github, Linkedin, BookOpen, Building, GraduationCap } from 'lucide-react';
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
  const [status ,setStatus] = useState(false);

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
    <div className="min-h-screen bg-[#f8fafc] px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex  items-center justify-between">
          <button
            onClick={() => navigate("/Home")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Home</span>
          </button>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-24 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {/* Profile Header */}
          <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6">
              <div className="relative group">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ring-4 ring-white shadow-md group-hover:shadow-lg transition-all duration-300">
                  <img
                    src={user?.imageUrl}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  <button className="absolute bottom-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Camera size={16} className="text-gray-700" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  Complete Your Profile
                </h1>
                <p className="text-gray-500 max-w-2xl">
                  Take a moment to set up your professional profile. This information helps us personalize your experience and connect you with opportunities.
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-4 sm:px-8 py-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                  style={{ 
                    width: `${calculateProgress()}%` // Implement this function to calculate completion
                  }}
                />
              </div>
              <span className="text-sm font-medium text-gray-500">
                {calculateProgress()}% Complete
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-4 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
                {/* Left Column */}
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
                        Required
                      </span>
                    </div>

                    {/* Name and Email Card */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Full Name</label>
                          <p className="text-lg font-medium text-gray-900 mt-1">{user?.fullName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email Address</label>
                          <p className="text-lg font-medium text-gray-900 mt-1">
                            {user?.primaryEmailAddress?.emailAddress}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Enrollment Section with enhanced styling */}
                    <div className="space-y-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            className={`w-full p-4 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ${
                              status ? "bg-gray-50" : "hover:border-gray-300"
                            }`}
                            placeholder="Enter your 11-digit enrollment number"
                          />
                          {enrollmentNumber && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                            </div>
                          )}
                        </div>
                      </div>

                      {enrollmentNumber && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors duration-300">
                            <div className="flex items-center space-x-2 text-gray-600 mb-2">
                              <BookOpen size={16} />
                              <span className="text-sm font-medium">Roll Number</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                              {enrollmentNumber.substring(0, 3)}
                            </p>
                          </div>

                          <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors duration-300">
                            <div className="flex items-center space-x-2 text-gray-600 mb-2">
                              <Building size={16} />
                              <span className="text-sm font-medium">Batch Year</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                              {"20" + enrollmentNumber.substring(9, 11)}
                            </p>
                          </div>

                          <div className="col-span-2 bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors duration-300">
                            <div className="flex items-center space-x-2 text-gray-600 mb-2">
                              <GraduationCap size={16} />
                              <span className="text-sm font-medium">Branch</span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                              {allowedBranchCodes[enrollmentNumber.substring(6,9)] || ""}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Links with enhanced styling */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Social Presence</h3>
                    <div className="space-y-4">
                      <div className="group">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Github className="text-gray-400 group-hover:text-gray-600 transition-colors" size={20} />
                          </div>
                          <input
                            type="url"
                            disabled={status}
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                            placeholder="Your GitHub profile URL"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Linkedin className="text-gray-400 group-hover:text-gray-600 transition-colors" size={20} />
                          </div>
                          <input
                            type="url"
                            disabled={status}
                            value={linkedinUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                            placeholder="Your LinkedIn profile URL"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Skills Section with enhanced styling */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">Skills & Expertise</h3>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
                        {skills.length} Added
                      </span>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="group flex items-center bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300"
                          >
                            <span className="text-sm font-medium text-gray-700">{skill}</span>
                            <button 
                              type="button"
                              onClick={() => setSkills(skills.filter((s) => s !== skill))}
                              className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex">
                        <input
                          type="text"
                          value={skillsInput}
                          onChange={(e) => setSkillsInput(e.target.value)}
                          className="flex-1 p-3 border rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
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
                          className="px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-r-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* About Me Section with enhanced styling */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">About Me</h3>
                    <div className="relative">
                      <textarea
                        value={aboutMe}
                        disabled={status}
                        onChange={(e) => setAboutMe(e.target.value)}
                        className="w-full p-4 border rounded-xl bg-gradient-to-br from-gray-50 to-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 h-40 resize-none"
                        placeholder="Share your story, interests, and what drives you..."
                      />
                      <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                        {aboutMe.length}/500
                      </div>
                    </div>
                  </div>

                  {/* ID Card Upload with enhanced styling */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">College ID Card</h3>
                    <div className="relative group">
                      <div className="relative w-full aspect-[16/10] rounded-xl bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-200 hover:border-blue-500 transition-all duration-300 overflow-hidden">
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
                              className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 transition-colors duration-300">
                            <UploadCloud size={40} />
                            <p className="mt-2 text-sm font-medium">Click or drag to upload your ID card</p>
                            <p className="text-xs text-gray-400 mt-1">Supported formats: JPG, PNG</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 sm:mt-12 pb-4 sm:pb-6 px-4 sm:px-6 border-t border-gray-100 pt-6">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
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
        theme="colored"
        className="toast-container"
      />
    </div>
  );
};

export default CompleteYourProfile;
