import React from 'react'
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

function ClassRoom() {
  const navigate = useNavigate();
  const { user } = useUser(); // Fetch user data from Clerk

  // Sample subjects with corresponding colors and navigation paths
  const subjects = [
    { name: "Mathematics", color: "bg-red-200", path: "/Subject1" },
    { name: "Physics", color: "bg-blue-200", path: "/Subject2" },
    { name: "Chemistry", color: "bg-green-200", path: "/Subject3" },
    { name: "Biology", color: "bg-yellow-200", path: "/Subject4" },
    { name: "Computer Science", color: "bg-purple-200", path: "/Subject5" },
    { name: "English", color: "bg-pink-200", path: "/Subject6" },
    { name: "Mentor", color: "bg-teal-200", path: "/Mentor" }, // Added Mentor subject
  ];

  return (
    <div className="p-4">
      <button
        onClick={() => {
          navigate("/Home")
        }}
        className="absolute top-4 left-4 text-3xl bg-gray-200 px-3 py-1 hover:cursor-pointer rounded-full  text-gray-600 hover:text-gray-800"
      >
        &times; {/* "×" represents the cross sign */}
      </button>

      {/* User Information */}
      <div className="mb-0 p-10">
        <h1 className="text-2xl font-bold">{user?.fullName}</h1>
        <p className="text-lg">{user?.primaryEmailAddress?.emailAddress}</p>
        <p className="text-lg">Enrollment Number: 123456789</p> {/* Replace with actual enrollment number */}
        {user?.imageUrl && (
          <img
            className="w-28 h-28 rounded-full mt-2"
            src={user.imageUrl}
            alt="Profile"
          />
        )}
      </div>

      {/* Subjects Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-10">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 shadow-md ${subject.color} hover:shadow-lg transition cursor-pointer`}
            onClick={() => navigate(subject.path)} // Navigate to the subject page on click
          >
            <h2 className="text-xl font-semibold">{subject.name}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ClassRoom
