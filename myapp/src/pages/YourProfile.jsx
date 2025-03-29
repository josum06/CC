import { useState, useRef } from 'react';

const UserProfile = () => {
  const [user, setUser] = useState({
    profilePicture: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80',
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    enrollmentNo: 'CS20230045',
    branch: 'Computer Science',
    collegeIdPhoto: 'https://images.unsplash.com/photo-1586287011575-a2310347ca9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
    skills: ['React.js', 'Node.js', 'Python', 'Machine Learning', 'Database Design'],
    aboutMe: 'Senior Computer Science student with a passion for full-stack development and AI. Currently working on a research project about neural networks and their applications in healthcare. Looking for internship opportunities in software engineering.',
    githubUrl: 'https://github.com/alexjohnson',
    linkedInUrl: 'https://linkedin.com/in/alexjohnson'
  });

  const [editMode, setEditMode] = useState(false);
  const [tempUser, setTempUser] = useState({...user});
  const [newSkill, setNewSkill] = useState('');
  
  const profilePicInputRef = useRef(null);
  const idCardInputRef = useRef(null);

  const handleInputChange = (field, value) => {
    setTempUser({...tempUser, [field]: value});
  };

  const handleSave = () => {
    setUser({...tempUser});
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempUser({...user});
    setEditMode(false);
  };

  const handleSkillAdd = () => {
    if (newSkill.trim() !== '' && !tempUser.skills.includes(newSkill)) {
      setTempUser({
        ...tempUser,
        skills: [...tempUser.skills, newSkill]
      });
      setNewSkill('');
    }
  };

  const handleSkillRemove = (index) => {
    const updatedSkills = tempUser.skills.filter((_, i) => i !== index);
    setTempUser({...tempUser, skills: updatedSkills});
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempUser({
          ...tempUser,
          [field]: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = (ref) => {
    ref.current.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-left mb-8">
          <div className="flex justify-between items-center">
            
            <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
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
          <p className="mt-2 text-lg text-gray-600">Manage your academic and professional information</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Left Column - Profile Picture */}
            <div className="md:w-1/3 bg-gradient-to-b from-blue-600 to-blue-800 p-6 flex flex-col items-center">
              <div className="relative mb-6">
                <img
                  src={editMode ? tempUser.profilePicture : user.profilePicture}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                />
               
              </div>

              {/* College ID Card */}
              <div className="w-full mt-8">
                <h3 className="text-lg font-semibold text-white mb-3">University ID Card</h3>
                <div className="relative bg-white rounded-lg overflow-hidden shadow-md">
                  <img
                    src={editMode ? tempUser.collegeIdPhoto : user.collegeIdPhoto}
                    alt="College ID"
                    className="w-56 h-52 object-cover"
                  />
                  {editMode && (
                    <>
                      <button
                        onClick={() => triggerFileInput(idCardInputRef)}
                        className="absolute top-3 right-3 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <input
                        type="file"
                        ref={idCardInputRef}
                        onChange={(e) => handleImageUpload(e, 'collegeIdPhoto')}
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
                <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    
                      <p className="text-gray-800 font-medium">{user.name}</p>
                    
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">Email Address</label>
                    
                      <p className="text-gray-800 font-medium">{user.email}</p>
                    
                  </div>

                  {/* Enrollment No */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">Enrollment Number</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={tempUser.enrollmentNo}
                        onChange={(e) => handleInputChange('enrollmentNo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{user.enrollmentNo}</p>
                    )}
                  </div>

                  {/* Branch - Not Editable */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">Academic Branch</label>
                    <p className="text-gray-800 font-medium">{user.branch}</p>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Technical Skills</h2>
                
                {editMode ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {tempUser.skills.map((skill, index) => (
                        <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          <span className="text-sm font-medium">{skill}</span>
                          <button
                            onClick={() => handleSkillRemove(index)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
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
                        onKeyDown={(e) => e.key === 'Enter' && handleSkillAdd()}
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
                    {user.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* About Me Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">About Me</h2>
                
                {editMode ? (
                  <textarea
                    value={tempUser.aboutMe}
                    onChange={(e) => handleInputChange('aboutMe', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="6"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-line">{user.aboutMe}</p>
                )}
              </div>

              {/* Social Links Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Social Profiles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* GitHub */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">GitHub Profile</label>
                    {editMode ? (
                      <input
                        type="url"
                        value={tempUser.githubUrl}
                        onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <a 
                        href={user.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {user.githubUrl.replace('https://', '')}
                      </a>
                    )}
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">LinkedIn Profile</label>
                    {editMode ? (
                      <input
                        type="url"
                        value={tempUser.linkedInUrl}
                        onChange={(e) => handleInputChange('linkedInUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <a 
                        href={user.linkedInUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {user.linkedInUrl.replace('https://', '')}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t">
            <p className="text-sm text-gray-500 text-center">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;