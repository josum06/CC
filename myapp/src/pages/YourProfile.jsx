import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Modern Floating Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Student Profile</h1>
          <button
            onClick={() => navigate("/home")}
            className="p-2 rounded-full cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-48 sm:h-60 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-0 left-0 right-0 px-6 py-6 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-end space-x-4">
                <div className="relative">
                  <img
                    src={editMode ? tempUser.imageUrl : user?.imageUrl}
                    alt="Profile"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white object-cover shadow-lg transform -translate-y-1/3"
                  />
                  {editMode && (
                    <button
                      onClick={() => triggerFileInput(profilePicInputRef)}
                      className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex-1 text-white">
                  <h2 className="text-2xl sm:text-3xl font-bold">{user?.fullName}</h2>
                  <p className="text-blue-100">{branch}</p>
                </div>
                <div>
                  {!editMode ? (
                    <button
                      onClick={handleClick}
                      className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* ID Card Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">University ID Card</h3>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={editMode ? tempUser.collegeIDCard : user2?.collegeIDCard}
                  alt="College ID"
                  className="w-full h-full object-cover"
                />
                {editMode && (
                  <>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group hover:bg-black/60 transition-all duration-200">
                      <button
                        onClick={() => triggerFileInput(idCardInputRef)}
                        className="p-3 bg-white/90 rounded-full transform scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200"
                      >
                        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
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

            {/* Social Links Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Profiles</h3>
              <div className="space-y-4">
                {/* GitHub */}
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">GitHub</label>
                  {editMode ? (
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <input
                        type="url"
                        value={tempUser.githubUrl}
                        onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="GitHub URL"
                      />
                    </div>
                  ) : (
                    <a
                      href={user2?.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                      </svg>
                      <span>{user2?.githubUrl || "Not added yet"}</span>
                    </a>
                  )}
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">LinkedIn</label>
                  {editMode ? (
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </span>
                      <input
                        type="url"
                        value={tempUser.linkedinUrl}
                        onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="LinkedIn URL"
                      />
                    </div>
                  ) : (
                    <a
                      href={user2?.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <span>{user2?.linkedinUrl || "Not added yet"}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Email Address</label>
                  <p className="text-gray-900">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Enrollment Number</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={tempUser.enrollmentNumber}
                      onChange={(e) => handleInputChange("enrollmentNumber", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user2?.enrollmentNumber}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Technical Skills</h3>
                {editMode && (
                  <span className="text-sm text-gray-500">{tempUser?.skills?.length || 0} skills added</span>
                )}
              </div>
              
              {editMode ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {tempUser?.skills?.map((skill, index) => (
                      <div
                        key={index}
                        className="group flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg"
                      >
                        <span className="text-sm font-medium">{skill}</span>
                        <button
                          onClick={() => handleSkillRemove(index)}
                          className="ml-2 text-blue-400 hover:text-blue-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                      onKeyDown={(e) => e.key === "Enter" && handleSkillAdd()}
                      placeholder="Type a skill and press Enter"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={handleSkillAdd}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
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
                      className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {user2?.skills?.length === 0 && (
                    <p className="text-gray-500 italic">No skills added yet</p>
                  )}
                </div>
              )}
            </div>

            {/* About Me Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
              {editMode ? (
                <textarea
                  value={tempUser.aboutMe}
                  onChange={(e) => handleInputChange("aboutMe", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px] resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-line">
                  {user2?.aboutMe || "No description added yet"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
