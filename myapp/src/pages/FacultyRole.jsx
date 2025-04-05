import { useEffect, useState } from "react";
import React from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEdit } from "react-icons/fi";
import { Upload, X, Camera, Building2 } from "lucide-react";

function FacultyRole() {
  const [collegeId, setCollegeId] = useState("");
  const [idCardPhoto, setidCardPhoto] = useState(null);
  const [designation, setDesignation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleEditClick = () => {
    document.getElementById("idCardInput").click(); // Trigger file input
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
      setCollegeId(data?.collegeId);
      setDesignation(data?.designation);
      setidCardPhoto(data?.collegeIDCard);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  const designations = ["Principal", "HOD", "Dean", "Teacher", "Faculty"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("clerkId", user.id);
      formData.append("collegeId", collegeId);
      formData.append("designation", designation);
      if (idCardPhoto) {
        formData.append("idCardPhoto", idCardPhoto);
      }

      await axios.patch(
        "http://localhost:3000/api/user/upload-profile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Authority registration completed successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to complete registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setidCardPhoto(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">Faculty Role</h1>
            <button
              onClick={() => navigate("/home")}
              className="p-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-0 left-0 right-0 px-6 py-6 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={user?.imageUrl}
                    alt="Profile"
                    className="w-20 h-20 rounded-2xl border-2 border-white object-cover shadow-lg"
                  />
                  
                </div>
                <div className="flex-1">
                  <h2 className="text-white text-xl font-semibold">{user?.fullName}</h2>
                  <p className="text-blue-100 text-sm mt-0.5">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* College ID Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">College ID</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    placeholder="Enter your College ID"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* ID Card Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">College ID Card</label>
                <div className="relative group">
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 transition-all duration-200 hover:border-blue-500">
                    {idCardPhoto && typeof idCardPhoto === "string" ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <img
                          src={idCardPhoto}
                          alt="ID Card"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById("idCardInput").click()}
                          className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-all duration-200"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6">
                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      id="idCardInput"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Designation Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Designation</label>
                <div className="relative">
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none pr-10"
                    required
                  >
                    <option value="">Select your designation</option>
                    {designations.map((item) => (
                      <option key={item} value={item.toLowerCase()}>
                        {item}
                      </option>
                    ))}
                  </select>
                  {/* Custom arrow icon */}
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M7 7l3 3 3-3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Complete Registration</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyRole;
