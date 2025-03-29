import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { user } = useUser();
  const [user2, setUser2] = useState();

  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState({ ...user2 });
  const [newSkill, setNewSkill] = useState("");
  const [branch, setBranch] = useState("");
  const profilePicInputRef = useRef(null);
  const idCardInputRef = useRef(null);
  const allowedBranchCodes = {
    "027": "Computer Science Engineering",
    "031": "Information Technology",
    119: "Artificial Intelligence and Data Science",
    "049": "Electrical Engineering",
    "028": "Electronics and Communication Engineering",
    157: "Computer Science Engineering in Data Science",
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
      setUser2(data);
      setBranch(allowedBranchCodes[data.enrollmentNumber.slice(6, 9)]);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile.");
    }
  };

  const handleInputChange = (field, value) => {
    setTempUser({ ...tempUser, [field]: value });
  };

  const handleSave = async () => {
    try {
      setEditMode(false);

      // Create FormData
      const formData = new FormData();
      formData.append("clerkId", tempUser.clerkId);
      formData.append("enrollmentNumber", tempUser.enrollmentNumber);
      if (tempUser.githubUrl) formData.append("githubUrl", tempUser.githubUrl);
      if (tempUser.linkedinUrl)
        formData.append("linkedinUrl", tempUser.linkedinUrl);
      if (tempUser.collegeIDCard) {
        formData.append("collegeIDCard", tempUser.collegeIDCard);
      }
      if (tempUser.aboutMe) formData.append("aboutMe", tempUser.aboutMe);
      if (tempUser.skills)
        formData.append("skills", JSON.stringify(tempUser.skills));
      console.log("Sending FormData:", Object.fromEntries(formData));

      // Make API call
      await axios.patch(
        "http://localhost:3000/api/user/upload-profile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Profile updated successfully!");
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
    }
  };

  const handleCancel = () => {
    setTempUser({ ...user });
    setEditMode(false);
  };

  const handleSkillAdd = () => {
    if (newSkill.trim() !== "" && !tempUser.skills.includes(newSkill)) {
      setTempUser({
        ...tempUser,
        skills: [...tempUser.skills, newSkill],
      });
      setNewSkill("");
      console.log(tempUser);
    }
  };

  const handleSkillRemove = (index) => {
    const updatedSkills = tempUser.skills.filter((_, i) => i !== index);
    setTempUser({ ...tempUser, skills: updatedSkills });
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempUser({
          ...tempUser,
          [field]: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (ref) => {
    ref.current.click();
  };

  const handleClick = () => {
    setEditMode(true);
    setTempUser({ ...user2, imageUrl: user.imageUrl });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-left mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Student Profile
            </h1>
            {!editMode ? (
              <button
                onClick={handleClick}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
          <p className="mt-2 text-lg text-gray-600">
            Manage your academic and professional information
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Left Column - Profile Picture */}
            <div className="md:w-1/3 bg-gradient-to-b from-blue-600 to-blue-800 p-6 flex flex-col items-center">
              <div className="relative mb-6">
                <img
                  src={editMode ? tempUser.imageUrl : user?.imageUrl}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>

              {/* College ID Card */}
              <div className="w-full mt-8">
                <h3 className="text-lg font-semibold text-white mb-3">
                  University ID Card
                </h3>
                <div className="relative bg-white rounded-lg overflow-hidden shadow-md">
                  <img
                    src={
                      editMode ? tempUser.collegeIDCard : user2?.collegeIDCard
                    }
                    alt="College ID"
                    className="w-56 h-52 object-cover"
                  />
                  {editMode && (
                    <>
                      <button
                        onClick={() => triggerFileInput(idCardInputRef)}
                        className="absolute top-3 right-3 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <input
                        type="file"
                        ref={idCardInputRef}
                        onChange={(e) => handleImageUpload(e, "collegeIdPhoto")}
                        accept="image/*"
                        className="hidden"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - User Information */}
            <div className="md:w-2/3 p-8">
              {/* Personal Information Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                      Full Name
                    </label>

                    <p className="text-gray-800 font-medium">
                      {user?.fullName}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                      Email Address
                    </label>

                    <p className="text-gray-800 font-medium">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>

                  {/* Enrollment No */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                      Enrollment Number
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={tempUser.enrollmentNumber}
                        onChange={(e) =>
                          handleInputChange("enrollmentNumber", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {user2?.enrollmentNumber}
                      </p>
                    )}
                  </div>

                  {/* Branch - Not Editable */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                      Academic Branch
                    </label>
                    <p className="text-gray-800 font-medium">{branch}</p>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Technical Skills
                </h2>

                {editMode ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {tempUser?.skills?.map((skill, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                        >
                          <span className="text-sm font-medium">{skill}</span>
                          <button
                            onClick={() => handleSkillRemove(index)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Type a skill and press Add"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={(e) => e.key === "Enter" && handleSkillAdd()}
                      />
                      <button
                        onClick={handleSkillAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user2?.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {user2?.skills.length == 0 ? (
                  <div>Start adding skills....</div>
                ) : (
                  ""
                )}
              </div>

              {/* About Me Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  About Me
                </h2>

                {editMode ? (
                  <textarea
                    value={tempUser.aboutMe}
                    onChange={(e) =>
                      handleInputChange("aboutMe", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="6"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-line">
                    {user2?.aboutMe}
                  </p>
                )}
              </div>

              {/* Social Links Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">
                  Social Profiles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* GitHub */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                      GitHub Profile
                    </label>
                    {editMode ? (
                      <input
                        type="url"
                        value={tempUser.githubUrl}
                        onChange={(e) =>
                          handleInputChange("githubUrl", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <a
                        href={user2?.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {user2?.githubUrl}
                      </a>
                    )}
                  </div>

                  {/* linkedin */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                      LinkedIn Profile
                    </label>
                    {editMode ? (
                      <input
                        type="url"
                        value={tempUser.linkedinUrl}
                        onChange={(e) =>
                          handleInputChange("linkedinUrl", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <a
                        href={user2?.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {user2?.linkedinUrl}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t">
            <p className="text-sm text-gray-500 text-center">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
