import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../context/ThemeContext";
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  FlaskConical,
  Dna,
  Laptop,
  Languages,
  UserCheck,
  GraduationCap,
} from "lucide-react";

function ClassRoom() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { isDarkMode } = useTheme();

  // Sample subjects with icons and colors
  const subjects = [
    {
      name: "Mathematics",
      color: "from-red-500 to-orange-500",
      icon: Calculator,
      path: "/Subject1",
      code: "MTH101",
    },
    {
      name: "Physics",
      color: "from-blue-500 to-cyan-500",
      icon: FlaskConical, // Using Flask as close enough for Physics
      path: "/Subject2",
      code: "PHY101",
    },
    {
      name: "Chemistry",
      color: "from-green-500 to-emerald-500",
      icon: FlaskConical,
      path: "/Subject3",
      code: "CHM101",
    },
    {
      name: "Biology",
      color: "from-yellow-500 to-amber-500",
      icon: Dna,
      path: "/Subject4",
      code: "BIO101",
    },
    {
      name: "Computer Science",
      color: "from-purple-500 to-pink-500",
      icon: Laptop,
      path: "/Subject5",
      code: "CS101",
    },
    {
      name: "English",
      color: "from-pink-500 to-rose-500",
      icon: Languages,
      path: "/Subject6",
      code: "ENG101",
    },
    {
      name: "Mentor",
      color: "from-teal-500 to-cyan-500",
      icon: UserCheck,
      path: "/Mentor",
      code: "MEN101",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070707] transition-colors duration-300">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/Home")}
            className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252525] transition-all duration-300 shadow-sm border border-gray-200 dark:border-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-none border border-gray-200 dark:border-gray-800 backdrop-blur-xl relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                <img
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-[#1a1a1a] shadow-lg relative"
                  src={user?.imageUrl || "/default-avatar.png"}
                  alt="Profile"
                />
              </div>
              
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {user?.fullName}
                </h1>
                <div className="flex flex-col sm:flex-row items-center gap-3 text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-2 bg-gray-100 dark:bg-[#252525] px-3 py-1 rounded-full text-sm">
                    <GraduationCap className="w-4 h-4" />
                    Student
                  </span>
                  <span className="text-sm">{user?.primaryEmailAddress?.emailAddress}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            My Subjects
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subjects.map((subject, index) => (
              <div
                key={index}
                onClick={() => navigate(subject.path)}
                className="group relative cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${subject.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500`}></div>
                
                <div className="relative h-full bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-transparent dark:hover:border-transparent shadow-lg dark:shadow-none hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                    <subject.icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                    {subject.name}
                  </h3>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-between">
                    <span>{subject.code}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 dark:text-blue-400 text-xs font-medium">
                      View Class →
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassRoom;
