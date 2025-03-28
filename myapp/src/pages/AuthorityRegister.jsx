import { useEffect, useState } from "react";
import React from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEdit } from "react-icons/fi";
function AuthorityRegister() {
  const [collegeId, setCollegeId] = useState("");
  const [idCardPhoto, setidCardPhoto] = useState(null);
  const [designation, setDesignation] = useState("");
  const handleEditClick = () => {
    document.getElementById("idCardInput").click(); // Trigger file input
  };
  const { user } = useUser();
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

    try {
      const formData = new FormData();
      formData.append("clerkId", user.id);
      formData.append("collegeId", collegeId);
      formData.append("designation", designation);
      if (idCardPhoto) {
        formData.append("idCardPhoto", idCardPhoto); // Append file correctly
      }

      await axios.patch(
        "http://localhost:3000/api/user/upload-profile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setidCardPhoto(e.target.files[0]);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        {/* User Profile Section */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <img
              src={user?.imageUrl}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-white"
            />
            <div>
              <h2 className="text-xl font-bold">{user?.fullName}</h2>
              <p className="text-blue-100">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Authority Registration
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                College ID
              </label>
              <input
                type="text"
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                placeholder="Enter your College ID"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                College ID Image
              </label>
              <div className="mt-1  flex justify-center relative px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {idCardPhoto && typeof idCardPhoto === "string" ? (
                    <div className=" w-32 mx-auto">
                      <img
                        src={idCardPhoto} // Display existing image
                        alt="Uploaded College ID"
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                      {/* Edit Icon */}
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                        onClick={handleEditClick}
                      >
                        <FiEdit className="text-blue-600 w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          id="idCardInput"
                          onChange={handleImageChange}
                          accept="image/*"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                </div>
              </div>
              {/* Hidden file input to trigger when edit button is clicked */}
              <input
                type="file"
                id="idCardInput"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation
              </label>
              <select
                onChange={(e) => setDesignation(e.target.value)}
                value={designation}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjNjY2IiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNyAxMGw1IDUgNS01eiIvPjwvc3ZnPg==')] bg-no-repeat bg-right-2 bg-center"
                required
              >
                <option value="">Select Designation</option>
                {designations.map((item, index) => (
                  <option key={index} value={item.toLowerCase()}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-2 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 transition duration-150 ease-in-out"
            >
              Complete Registration
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthorityRegister;
