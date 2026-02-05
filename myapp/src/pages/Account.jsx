import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import {
  User,
  Shield,
  LogOut,
  UserCircle,
  ChevronRight,
  Settings,
  Bell,
  Crown,
  Sun,
  Moon,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { ModalWindow } from "../components/ModalWindow";
import { FacultyRoleModal } from "../components/FacultyRoleModal";
import ConnectionRequestsModal from "../components/ConnectionRequestsModal";

const Account = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { isDarkMode, toggleTheme } = useTheme();
  const [modal, setShowModal] = useState(false);
  const [mainUser, setMainUser] = useState();
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile/${user.id}`
      );
      setMainUser(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile.");
    }
  };

  const handleReject = async (reqId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/connectionsRejected/${
          mainUser._id
        }`,
        { senderId: reqId }
      );
      toast.success("Connection rejected successfully.");
    } catch (error) {
      console.error("Error rejecting connection:", error);
      toast.error("Failed to reject connection.");
    }
  };

  const handleAccept = async (reqId) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/connectionsAccepted/${
          mainUser._id
        }`,
        { senderId: reqId }
      );
      toast.success("Connection accepted successfully.");
    } catch (error) {
      console.error("Error accepting connection:", error);
      toast.error("Failed to accept connection.");
    }
  };

  const handleClick = async () => {
    setShowModal(true);
  };

  const MenuCard = ({
    icon: Icon,
    label,
    description,
    onClick,
    variant = "default",
    badge,
  }) => {
    const variants = {
      default: {
        bg: "from-[#4790fd]/10 via-[#c76191]/5 to-[#27dc66]/10",
        border: "border-[#4790fd]/20",
        hoverBorder: "hover:border-[#4790fd]/30",
        iconBg: "bg-[#4790fd]/10",
        iconColor: "text-[#4790fd]",
      },
      primary: {
        bg: "from-[#4790fd]/15 to-[#4790fd]/5",
        border: "border-[#4790fd]/25",
        hoverBorder: "hover:border-[#4790fd]/35",
        iconBg: "bg-[#4790fd]/15",
        iconColor: "text-[#4790fd]",
      },
      warning: {
        bg: "from-[#ece239]/15 to-[#ece239]/5",
        border: "border-[#ece239]/25",
        hoverBorder: "hover:border-[#ece239]/35",
        iconBg: "bg-[#ece239]/15",
        iconColor: "text-[#ece239]",
      },
      success: {
        bg: "from-[#27dc66]/15 to-[#27dc66]/5",
        border: "border-[#27dc66]/25",
        hoverBorder: "hover:border-[#27dc66]/35",
        iconBg: "bg-[#27dc66]/15",
        iconColor: "text-[#27dc66]",
      },
      premium: {
        bg: "from-[#c76191]/15 to-[#c76191]/5",
        border: "border-[#c76191]/25",
        hoverBorder: "hover:border-[#c76191]/35",
        iconBg: "bg-[#c76191]/15",
        iconColor: "text-[#c76191]",
      },
    };

    const style = variants[variant] || variants.default;

    return (
      <button
        onClick={onClick}
        className={`group w-full cursor-pointer p-5 rounded-2xl mb-3 transition-all duration-300 bg-gradient-to-br ${style.bg} border ${style.border} ${style.hoverBorder} backdrop-blur-xl hover:scale-[1.01] hover:shadow-lg relative overflow-hidden bg-white/50 dark:bg-transparent`}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl ${style.iconBg} ${style.iconColor} group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 dark:text-[#f5f5f5] text-base group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                {label}
              </h3>
              {description && (
                <p className="text-gray-500 dark:text-[#a0a0a0] text-sm mt-0.5 group-hover:text-gray-700 dark:group-hover:text-[#c0c0c0] transition-colors">
                  {description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {badge && (
              <span className="px-2.5 py-1 bg-[#ece239]/20 text-[#ece239] text-xs rounded-full font-medium border border-[#ece239]/30 animate-pulse">
                {badge}
              </span>
            )}
            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-[#a0a0a0] group-hover:text-[#4790fd] group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070707] py-6 px-3 sm:py-8 sm:px-4 md:px-6 relative overflow-hidden transition-colors duration-300">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4790fd]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c76191]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#27dc66]/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Profile Header Card */}
        <div className="relative group mb-6">
          {/* Gradient blur background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4790fd]/10 via-[#c76191]/5 to-[#27dc66]/10 rounded-3xl blur-xl opacity-50"></div>
          
          {/* Card */}
          <div className="relative bg-white/80 dark:bg-[#040404]/80 backdrop-blur-2xl rounded-3xl border border-gray-200 dark:border-[#4790fd]/20 p-6 sm:p-8 shadow-xl dark:shadow-none transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-4 ring-gray-100 dark:ring-[#4790fd]/30 shadow-lg shadow-[#4790fd]/20">
                  <img
                    src={user?.imageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-[#27dc66] rounded-full border-4 border-white dark:border-[#040404] shadow-lg flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                </div>
                {mainUser?.role === "faculty" && (
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#ece239]/20 rounded-full border-2 border-[#ece239]/40 flex items-center justify-center backdrop-blur-sm">
                    <Crown className="w-4 h-4 text-[#ece239]" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-[#f5f5f5]">
                    {user?.fullName}
                  </h1>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <span className="px-3 py-1.5 bg-[#4790fd]/10 text-[#4790fd] border border-[#4790fd]/20 rounded-full text-sm font-medium">
                    {mainUser?.role
                      ? mainUser.role.slice(0, 1).toUpperCase() +
                        mainUser.role.slice(1)
                      : "Student"}
                  </span>
                  <span className="text-gray-500 dark:text-[#a0a0a0] text-sm flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Member since{" "}
                    {format(new Date(user?.createdAt || Date.now()), "MMM yyyy")}
                  </span>
                </div>
                {mainUser?.profileComplete && (
                  <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 text-[#27dc66] text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Profile Complete</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="relative group mb-6">
          {/* Gradient blur background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4790fd]/5 to-[#27dc66]/5 rounded-3xl blur-xl opacity-50"></div>
          
          {/* Card */}
          <div className="relative bg-white/80 dark:bg-[#040404]/80 backdrop-blur-2xl rounded-3xl border border-gray-200 dark:border-[#4790fd]/20 p-6 sm:p-8 shadow-xl dark:shadow-none transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-[#4790fd]/10 border border-[#4790fd]/20">
                <Settings className="w-5 h-5 text-[#4790fd]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#f5f5f5]">
                Account Settings
              </h2>
            </div>

            <div className="space-y-2">
              <MenuCard
                icon={User}
                label="Account Dashboard"
                description="Manage your account settings and preferences"
                onClick={() => navigate("/YourAccount")}
                variant="primary"
              />

              {!mainUser?.profileComplete ? (
                <MenuCard
                  icon={UserCircle}
                  label="Complete Your Profile"
                  description="Add missing information to complete your profile"
                  onClick={() => navigate("/CompleteYourProfile")}
                  variant="warning"
                  badge="Required"
                />
              ) : (
                <MenuCard
                  icon={UserCircle}
                  label="View Your Profile"
                  description="See how others view your profile"
                  onClick={() => navigate("/YourProfile")}
                  variant="success"
                />
              )}

              <MenuCard
                icon={Shield}
                label="Faculty Role Management"
                description="Manage your faculty permissions and settings"
                onClick={() => setIsFacultyModalOpen(true)}
                variant="premium"
              />

              <MenuCard
                icon={Bell}
                label="Connection Requests"
                description="Review and manage incoming connection requests"
                onClick={handleClick}
                variant="default"
              />

              <MenuCard
                icon={Bell}
                label="Help & Support"
                description="Get help and information about the platform"
                onClick={() => navigate('/help-support')}
                variant="default"
              />

              {/* Theme toggle removed: app is always in dark mode */}
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div className="relative group mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4790fd]/8 to-[#c76191]/8 rounded-3xl blur-xl opacity-60" />
          <div className="relative bg-white/80 dark:bg-[#040404]/80 backdrop-blur-2xl rounded-3xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-xl dark:shadow-none transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#4790fd]/15 to-[#27dc66]/15 border border-[#4790fd]/20">
                <Bell className="w-6 h-6 text-[#4790fd]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#f5f5f5]">
                  Help & Support
                </h2>
                <p className="text-sm text-gray-600 dark:text-[#a0a0a0] mt-1">
                  Need assistance? We're here to help you succeed
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Contact Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact Us</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#070707]/50 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-[#070707]/70 transition-colors cursor-pointer">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">General Support</p>
                      <p className="text-sm text-gray-500 dark:text-[#a0a0a0]">support@campusconnect.edu</p>
                      <p className="text-xs text-gray-400 dark:text-[#808080]">Response time: Within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#070707]/50 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-[#070707]/70 transition-colors cursor-pointer">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Technical Support</p>
                      <p className="text-sm text-gray-500 dark:text-[#a0a0a0]">+1 (555) 123-4567</p>
                      <p className="text-xs text-gray-400 dark:text-[#808080]">Hours: Mon-Fri, 9AM-6PM IST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#070707]/50 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-[#070707]/70 transition-colors cursor-pointer">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Live Chat</p>
                      <p className="text-sm text-gray-500 dark:text-[#a0a0a0]">Available 9 AM - 6 PM (IST)</p>
                      <p className="text-xs text-gray-400 dark:text-[#808080]">Avg. response time: 2-5 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Support Team */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Our Team</h3>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-[#070707]/50 dark:to-[#070707]/70 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        AS
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Anugrah Singh</p>
                        <p className="text-sm text-gray-500 dark:text-[#a0a0a0]">Frontend Developer</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-[#a0a0a0] space-y-1">
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        anugrah.singh@campusconnect.edu
                      </p>
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        /in/anugrah-singh
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-[#070707]/50 dark:to-[#070707]/70 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                        VS
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Vaibhav Sinha</p>
                        <p className="text-sm text-gray-500 dark:text-[#a0a0a0]">Backend Developer</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-[#a0a0a0] space-y-1">
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        vaibhav.sinha@campusconnect.edu
                      </p>
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        /in/vaibhav-sinha
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-[#070707]/50 dark:to-[#070707]/70 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        SJ
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Sumit Joshi</p>
                        <p className="text-sm text-gray-500 dark:text-[#a0a0a0]">Backend Developer</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-[#a0a0a0] space-y-1">
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        sumit.joshi@campusconnect.edu
                      </p>
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        /in/sumit-joshi
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200/50 dark:border-blue-500/20">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Quick Help</h4>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Forgot Password? Click "Forgot Password" on login screen</li>
                  <li>• Need to update profile? Visit Account Dashboard</li>
                  <li>• Issues with notifications? Check your email settings</li>
                  <li>• Want to join groups? Browse Network section</li>
                  <li>• Looking for events? Check Events section</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-900/20 dark:to-green-800/10 border border-green-200/50 dark:border-green-500/20">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">FAQs</h4>
                <ul className="text-green-700 dark:text-green-300 space-y-1 text-sm">
                  <li>• How do I connect with classmates?</li>
                  <li>• How to create a study group?</li>
                  <li>• How to post events or notices?</li>
                  <li>• How to update my profile picture?</li>
                  <li>• How to report inappropriate content?</li>
                  <li>• How to reset my notification preferences?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* College Details */}
        <div className="relative group mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[#27dc66]/8 to-[#4790fd]/8 rounded-3xl blur-xl opacity-60" />
          <div className="relative bg-white/80 dark:bg-[#040404]/80 backdrop-blur-2xl rounded-3xl border border-gray-200 dark:border-white/10 p-6 sm:p-8 shadow-xl dark:shadow-none transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#27dc66]/15 to-[#4790fd]/15 border border-[#27dc66]/20">
                <svg className="w-6 h-6 text-[#27dc66]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#f5f5f5]">
                  College Information
                </h2>
                <p className="text-sm text-gray-600 dark:text-[#a0a0a0] mt-1">
                  Contact details and information about our institution
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-[#070707]/50 dark:to-[#070707]/70 border border-gray-200 dark:border-white/10">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#27dc66]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Institution Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-[#a0a0a0]">Name:</span>
                      <span className="text-gray-900 dark:text-white font-medium">Campus Connect University</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-[#a0a0a0]">Established:</span>
                      <span className="text-gray-900 dark:text-white font-medium">2010</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-[#a0a0a0]">Type:</span>
                      <span className="text-gray-900 dark:text-white font-medium">Private University</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-[#a0a0a0]">Accreditation:</span>
                      <span className="text-gray-900 dark:text-white font-medium">NAAC A+ Grade</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-[#070707]/50 dark:to-[#070707]/70 border border-gray-200 dark:border-white/10">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#4790fd]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Address
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-900 dark:text-white font-medium">
                      Main Campus:
                    </div>
                    <div className="text-gray-600 dark:text-[#a0a0a0]">
                      123 Education Street, Knowledge Park<br />
                      New Delhi, Delhi 110001<br />
                      India
                    </div>
                    <div className="pt-2">
                      <div className="text-gray-900 dark:text-white font-medium">
                        City Campus:
                      </div>
                      <div className="text-gray-600 dark:text-[#a0a0a0]">
                        456 Academic Avenue, University District<br />
                        New Delhi, Delhi 110002<br />
                        India
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-[#070707]/50 dark:to-[#070707]/70 border border-gray-200 dark:border-white/10">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#c76191]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-[#a0a0a0] uppercase tracking-wide">Phone Numbers</p>
                        <p className="text-gray-900 dark:text-white font-medium">+91 11 1234 5678</p>
                        <p className="text-sm text-gray-500 dark:text-[#a0a0a0]">Admissions: +91 11 1234 5679</p>
                        <p className="text-sm text-gray-500 dark:text-[#a0a0a0]">Emergency: +91 11 1234 5680</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-[#a0a0a0] uppercase tracking-wide">Email Addresses</p>
                        <p className="text-gray-900 dark:text-white font-medium">info@campusconnect.edu</p>
                        <p className="text-sm text-gray-500 dark:text-[#a0a0a0]">admissions@campusconnect.edu</p>
                        <p className="text-sm text-gray-500 dark:text-[#a0a0a0]">placement@campusconnect.edu</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-[#070707]/50 dark:to-[#070707]/70 border border-gray-200 dark:border-white/10">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#ece239]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Online Presence
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-[#a0a0a0]">Website:</span>
                      <a href="https://www.campusconnect.edu" className="text-[#4790fd] hover:underline font-medium">www.campusconnect.edu</a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-[#a0a0a0]">Student Portal:</span>
                      <a href="https://portal.campusconnect.edu" className="text-[#4790fd] hover:underline font-medium">portal.campusconnect.edu</a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-[#a0a0a0]">Library:</span>
                      <a href="https://library.campusconnect.edu" className="text-[#4790fd] hover:underline font-medium">library.campusconnect.edu</a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-[#a0a0a0]">Alumni Network:</span>
                      <a href="https://alumni.campusconnect.edu" className="text-[#4790fd] hover:underline font-medium">alumni.campusconnect.edu</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Campus Gallery */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">Campus Gallery</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-[#070707]/30">
                  <div className="text-center p-2">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-500 dark:text-[#a0a0a0] text-center">Campus View</p>
                  </div>
                </div>
                <div className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-[#070707]/30">
                  <div className="text-center p-2">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-500 dark:text-[#a0a0a0] text-center">Library</p>
                  </div>
                </div>
                <div className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-[#070707]/30">
                  <div className="text-center p-2">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-500 dark:text-[#a0a0a0] text-center">Auditorium</p>
                  </div>
                </div>
                <div className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-[#070707]/30">
                  <div className="text-center p-2">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-500 dark:text-[#a0a0a0] text-center">Sports</p>
                  </div>
                </div>
              </div>
              
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-center">Office Hours</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-[#070707]/50 border border-gray-200 dark:border-white/10">
                  <p className="text-gray-500 dark:text-[#a0a0a0] text-xs uppercase tracking-wide">Monday-Friday</p>
                  <p className="text-gray-900 dark:text-white font-medium">9:00 AM - 5:00 PM</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-[#070707]/50 border border-gray-200 dark:border-white/10">
                  <p className="text-gray-500 dark:text-[#a0a0a0] text-xs uppercase tracking-wide">Saturday</p>
                  <p className="text-gray-900 dark:text-white font-medium">10:00 AM - 2:00 PM</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-[#070707]/50 border border-gray-200 dark:border-white/10">
                  <p className="text-gray-500 dark:text-[#a0a0a0] text-xs uppercase tracking-wide">Sunday</p>
                  <p className="text-gray-900 dark:text-white font-medium">Closed</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-[#070707]/50 border border-gray-200 dark:border-white/10">
                  <p className="text-gray-500 dark:text-[#a0a0a0] text-xs uppercase tracking-wide">Holidays</p>
                  <p className="text-gray-900 dark:text-white font-medium">Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Out Section */}
        <div className="relative group mb-6">
          {/* Gradient blur background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#c76191]/10 to-[#c76191]/5 rounded-2xl blur-xl opacity-50"></div>
          
          {/* Card */}
          <div className="relative bg-white/80 dark:bg-[#040404]/80 backdrop-blur-2xl rounded-2xl border border-gray-200 dark:border-[#c76191]/20 p-6 shadow-xl dark:shadow-none transition-all duration-300">
            <SignOutButton redirectUrl="/Signup">
              <button className="w-full group cursor-pointer p-4 rounded-xl bg-gradient-to-r from-[#c76191]/10 to-[#c76191]/5 border border-[#c76191]/20 hover:border-[#c76191]/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <LogOut className="w-5 h-5 text-[#c76191] group-hover:text-[#c76191] transition-colors" />
                  <span className="font-semibold text-[#c76191] group-hover:text-[#c76191] transition-colors">
                    Sign Out
                  </span>
                </div>
              </button>
            </SignOutButton>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4790fd]/5 to-[#27dc66]/5 rounded-2xl blur-xl opacity-50"></div>
            <div className="relative bg-white/60 dark:bg-[#040404]/60 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-[#4790fd]/10 p-5 transition-all duration-300">
              <p className="text-gray-500 dark:text-[#a0a0a0] text-sm">
                © {format(new Date(), "yyyy")} Campus Connect
              </p>
              <p className="text-gray-400 dark:text-[#808080] text-xs mt-1">
                Version 1.0.0 • Built with ❤️
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Role Modal */}
      <FacultyRoleModal
        isOpen={isFacultyModalOpen}
        onClose={() => setIsFacultyModalOpen(false)}
      />

      {/* Connection Requests Modal */}
      <ConnectionRequestsModal
        isOpen={modal}
        onClose={() => setShowModal(false)}
        userId={mainUser?._id}
        navigate={navigate}
      />
    </div>
  );
};

export default Account;
