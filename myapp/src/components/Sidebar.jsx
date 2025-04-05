import { SignOutButton } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  X,
  Settings,
  User,
  BookOpen,
  Shield,
  LogOut,
  UserCircle,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [mainUser, setMainUser] = useState();

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
      setMainUser(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile.");
    }
  };

  const MenuItem = ({ icon: Icon, label, onClick, variant = "default" }) => {
    const variants = {
      default: "bg-gray-50 text-gray-700 hover:bg-gray-100",
      primary: "bg-blue-50 text-blue-700 hover:bg-blue-100",
      warning: "bg-orange-50 text-orange-700 hover:bg-orange-100",
      danger: "bg-red-50 text-red-700 hover:bg-red-100",
    };

    return (
      <button
        onClick={onClick}
        className={`group w-full cursor-pointer px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${variants[variant]} flex items-center justify-between`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="font-medium">{label}</span>
        </div>
        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" />
      </button>
    );
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 w-[320px] h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out  ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="relative h-28 bg-gradient-to-br  from-blue-600 to-indigo-600 rounded-bl-[2rem]">
          {/* Close Button - Fixed positioning and improved styling */}
          <button
            onClick={toggleSidebar}
            className="absolute top-6 right-2  cursor-pointer p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 z-50"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user?.imageUrl}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-2 border-white object-cover shadow-lg"
                />
                {/* Online Status Indicator */}
              </div>
              <div className="flex-1">
                <h2 className="text-white font-semibold text-lg leading-tight">
                  {user?.fullName}
                </h2>
                <div className="flex items-center gap-2">
                <span className="text-blue-100 text-sm">
                  {mainUser?.role
                    ? mainUser.role.slice(0, 1).toUpperCase() + mainUser.role.slice(1)
                    : "Role"}
                </span>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-6 space-y-2 ">
          <MenuItem
            icon={User}
            label="Account"
            onClick={() => {
              navigate("/YourAccount");
              toggleSidebar();
            }}
            variant="primary"
          />

          {!mainUser?.profileComplete ? (
            <MenuItem
              icon={UserCircle}
              label="Complete Your Profile"
              onClick={() => {
                navigate("/CompleteYourProfile");
                toggleSidebar();
              }}
              variant="warning"
            />
          ) : (
            <MenuItem
              icon={UserCircle}
              label="Your Profile"
              onClick={() => {
                navigate("/YourProfile");
                toggleSidebar();
              }}
              variant="warning"
            />
          )}

          <MenuItem
            icon={BookOpen}
            label="Class Room"
            onClick={() => {
              navigate("/ClassRoom");
              toggleSidebar();
            }}
          />

          <MenuItem
            icon={Shield}
            label="Faculty Role"
            onClick={() => {
              navigate("/FacultyRole");
              toggleSidebar();
            }}
          />

          {/* Sign Out Button */}
          <div className="pt-10">
            <SignOutButton onClick={toggleSidebar} redirectUrl="/Signup">
              <button className="w-full px-4 cursor-pointer py-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-colors flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </SignOutButton>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="text-center text-sm text-gray-500">
            <p>© {format(new Date(), "yyyy")} Campus Connect</p>
            <p className="text-xs mt-1">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
