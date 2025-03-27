import { useState } from "react";
import React from 'react';
import { useUser } from "@clerk/clerk-react";


function AuthorityRegister() {
    const [collegeId, setCollegeId] = useState("");
    const [collegeIdImage, setCollegeIdImage] = useState(null);
    const [designation, setDesignation] = useState("");

    const {user} = useUser();
  
    const designations = ["Principal", "HODs", "Deans","Teacher", "Faculty Coordinators"];
  
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            collegeId,
            collegeIdImage: collegeIdImage ? collegeIdImage.name : null,
            designation
        };
        console.log(formData);
        // Here you would typically send the data to your backend
    };
  
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setCollegeIdImage(e.target.files[0]);
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
                            <p className="text-blue-100">{user?.primaryEmailAddress?.emailAddress}</p>
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
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <div className="flex text-sm text-gray-600">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input 
                                                type="file" 
                                                onChange={handleImageChange}
                                                accept="image/*"
                                                className="sr-only"
                                                required
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG up to 2MB
                                    </p>
                                </div>
                            </div>
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
                                    <option key={index} value={item.toLowerCase()}>{item}</option>
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