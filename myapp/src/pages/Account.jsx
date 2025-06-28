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
} from "lucide-react";
import { format } from "date-fns";
import { ModalWindow } from "../components/ModalWindow";
import { FacultyRoleModal } from "../components/FacultyRoleModal";

const Account = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [modal, setShowModal] = useState(false);
  const [mainUser, setMainUser] = useState();
  const [requests, setRequests] = useState([]);
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
      setRequests(response.data);
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
      setRequests(response.data);
      toast.success("Connection accepted successfully.");
    } catch (error) {
      console.error("Error accepting connection:", error);
      toast.error("Failed to accept connection.");
    }
  };

  const handleClick = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user/getPendingConnections/${mainUser._id}`
      );
      setRequests(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching connections:", error);
      toast.error("Failed to load connections.");
    }
  };

  const MenuItem = ({ icon: Icon, label, onClick, variant = "default" }) => {
    const variants = {
      default: "bg-[#232526] text-white hover:bg-gray-700",
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      warning: "bg-orange-600 text-white hover:bg-orange-700",
      danger: "bg-red-600 text-white hover:bg-red-700",
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
    <div className="min-h-screen bg-[#000000] flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-xl bg-[#232526] rounded-2xl shadow-2xl p-8 relative border border-gray-500/50">
        <div className="flex items-center gap-6 mb-8">
          <img
            src={user?.imageUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-blue-600 object-cover shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.fullName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-blue-400 text-sm font-medium">
                {mainUser?.role
                  ? mainUser.role.slice(0, 1).toUpperCase() +
                    mainUser.role.slice(1)
                  : "Role"}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <MenuItem
            icon={User}
            label="Account"
            onClick={() => navigate("/YourAccount")}
            variant="primary"
          />
          {!mainUser?.profileComplete ? (
            <MenuItem
              icon={UserCircle}
              label="Complete Your Profile"
              onClick={() => navigate("/CompleteYourProfile")}
              variant="warning"
            />
          ) : (
            <MenuItem
              icon={UserCircle}
              label="Your Profile"
              onClick={() => navigate("/YourProfile")}
              variant="warning"
            />
          )}

          <MenuItem
            icon={Shield}
            label="Faculty Role"
            onClick={() => setIsFacultyModalOpen(true)}
          />
          <FacultyRoleModal
            isOpen={isFacultyModalOpen}
            onClose={() => setIsFacultyModalOpen(false)}
          />
          <button
            onClick={handleClick}
            className="group w-full cursor-pointer px-4 py-3 rounded-xl mb-2 transition-all duration-200 bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <UserPlus className="w-5 h-5" />
              <span className="font-medium">Connections Request</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" />
          </button>
          <div className="pt-8">
            <SignOutButton redirectUrl="/Signup">
              <button className="w-full px-4 cursor-pointer py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </SignOutButton>
          </div>
        </div>
        {/* Modal for connections */}
        <ModalWindow isOpen={modal} onClose={() => setShowModal(false)}>
          <h2 className="text-xl font-semibold mb-4 text-center text-white">
            Connection Requests
          </h2>
          {requests.length > 0 ? (
            <ul className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {requests.map((request) => (
                <li
                  key={request._id}
                  className="flex items-center justify-between p-3 bg-[#232526] border border-gray-500/50 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={request.profileImage}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border border-gray-500/50"
                    />
                    <span className="text-white font-medium">
                      {request.fullName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAccept(request._id)}
                      className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
                      aria-label="Accept"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                      aria-label="Reject"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center">No connection requests.</p>
          )}
          <div className="mt-6 flex justify-center">
            <button
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </ModalWindow>
        {/* Footer */}
        <div className="mt-10 text-center text-sm text-gray-400">
          <p>© {format(new Date(), "yyyy")} Campus Connect</p>
          <p className="text-xs mt-1">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Account;
