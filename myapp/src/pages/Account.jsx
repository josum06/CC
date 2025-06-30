import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, SignOutButton } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  User,
  BookOpen,
  Shield,
  LogOut,
  UserCircle,
  ChevronRight,
  Check,
  UserPlus,
  X,
  Settings,
  Bell,
  Heart,
  Users,
  Crown,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { ModalWindow } from "../components/ModalWindow";
import { FacultyRoleModal } from "../components/FacultyRoleModal";
import ConnectionRequestsModal from "../components/ConnectionRequestsModal";

const Account = () => {
  const navigate = useNavigate();
  const { user } = useUser();
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
        `http://localhost:3000/api/user/profile/${user.id}`
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
        `http://localhost:3000/api/user/connectionsRejected/${mainUser._id}`,
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
        `http://localhost:3000/api/user/connectionsAccepted/${mainUser._id}`,
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

  const MenuCard = ({ icon: Icon, label, description, onClick, variant = "default", badge }) => {
    const variants = {
      default: "bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-gray-600/50",
      primary: "bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/50 hover:border-blue-400/50",
      warning: "bg-gradient-to-br from-orange-600/20 to-orange-700/20 border-orange-500/50 hover:border-orange-400/50",
      danger: "bg-gradient-to-br from-red-600/20 to-red-700/20 border-red-500/50 hover:border-red-400/50",
      success: "bg-gradient-to-br from-green-600/20 to-green-700/20 border-green-500/50 hover:border-green-400/50",
      premium: "bg-gradient-to-br from-purple-600/20 to-purple-700/20 border-purple-500/50 hover:border-purple-400/50",
    };

    const iconVariants = {
      default: "text-gray-400",
      primary: "text-blue-400",
      warning: "text-orange-400",
      danger: "text-red-400",
      success: "text-green-400",
      premium: "text-purple-400",
    };

    return (
      <button
        onClick={onClick}
        className={`group w-full cursor-pointer p-6 rounded-2xl mb-4 transition-all duration-300 ${variants[variant]} border backdrop-blur-sm hover:scale-[1.02] hover:shadow-xl relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-gray-800/50 ${iconVariants[variant]} group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-white text-lg group-hover:text-gray-100 transition-colors">
                {label}
              </h3>
              {description && (
                <p className="text-gray-400 text-sm mt-1 group-hover:text-gray-300 transition-colors">
                  {description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {badge && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium animate-pulse">
                {badge}
              </span>
            )}
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center py-10 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 mb-8 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={user?.imageUrl}
                alt="Profile"
                className="w-24 h-24 rounded-2xl border-4 border-blue-500/50 object-cover shadow-2xl"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{user?.fullName}</h1>
                {mainUser?.role === 'faculty' && (
                  <Crown className="w-6 h-6 text-yellow-400" />
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium">
                  {mainUser?.role
                    ? mainUser.role.slice(0, 1).toUpperCase() +
                      mainUser.role.slice(1)
                    : "Student"}
                </span>
                <span className="text-gray-400 text-sm">
                  Member since {format(new Date(user?.createdAt || Date.now()), "MMM yyyy")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Account Settings</h2>
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
          </div>

          {/* Sign Out Section */}
          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <SignOutButton redirectUrl="/Signup">
              <button className="w-full group cursor-pointer p-4 rounded-2xl bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-500/50 hover:border-red-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
                  <span className="font-semibold text-red-300 group-hover:text-red-200 transition-colors">
                    Sign Out
                  </span>
                </div>
              </button>
            </SignOutButton>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6">
            <p className="text-gray-400 text-sm">
              © {format(new Date(), "yyyy")} Campus Connect
            </p>
            <p className="text-gray-500 text-xs mt-1">Version 1.0.0 • Built with ❤️</p>
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
