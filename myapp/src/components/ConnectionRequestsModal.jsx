import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Bell, Check, X } from "lucide-react";
import { ModalWindow } from "./ModalWindow";

const ConnectionRequestsModal = ({ isOpen, onClose, userId, navigate }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchRequests();
    }
    // eslint-disable-next-line
  }, [isOpen, userId]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user/getPendingConnections/${userId}`
      );
      setRequests(response.data);
    } catch (error) {
      toast.error("Failed to load connections.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (reqId) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/user/connectionsRejected/${userId}`,
        { senderId: reqId }
      );
      setRequests(response.data);
      toast.success("Connection rejected successfully.");
    } catch (error) {
      toast.error("Failed to reject connection.");
    }
  };

  const handleAccept = async (reqId) => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/user/connectionsAccepted/${userId}`,
        { senderId: reqId }
      );
      setRequests(response.data);
      toast.success("Connection accepted successfully.");
    } catch (error) {
      toast.error("Failed to accept connection.");
    }
  };

  return (
    <ModalWindow isOpen={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-6 sm:p-8 max-w-lg w-full mx-4 shadow-2xl relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-500/30">
                  <Bell className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Connection Requests</h2>
                  <p className="text-gray-400 text-sm">Manage your incoming requests</p>
                </div>
              </div>
              {requests.length > 0 && (
                <div className="px-3 py-1 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-full">
                  <span className="text-red-300 text-sm font-medium">{requests.length}</span>
                </div>
              )}
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 text-sm">Loading requests...</p>
              </div>
            ) : requests.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {requests.map((request, index) => (
                  <div
                    key={request._id}
                    className="group bg-gradient-to-br from-gray-800/60 to-gray-700/60 border border-gray-600/40 rounded-2xl p-4 backdrop-blur-sm hover:border-gray-500/60 hover:from-gray-800/80 hover:to-gray-700/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg relative overflow-hidden"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideInUp 0.5s ease-out forwards'
                    }}
                  >
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="relative">
                          <img
                            src={request.profileImage}
                            alt="Profile"
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-gray-600/50 group-hover:border-gray-500/70 transition-all duration-300 shadow-lg"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-lg truncate group-hover:text-gray-100 transition-colors">
                            {request.fullName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-400 text-sm">Wants to connect</span>
                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                            <span className="text-gray-500 text-xs">Just now</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleAccept(request._id)}
                          className="group/accept p-3 bg-gradient-to-br from-green-600/20 to-green-700/20 border border-green-500/50 hover:border-green-400/60 hover:from-green-600/30 hover:to-green-700/30 text-green-400 hover:text-green-300 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg relative overflow-hidden"
                          aria-label="Accept connection"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/accept:translate-x-full transition-transform duration-500"></div>
                          <Check className="w-5 h-5 relative z-10" />
                        </button>
                        <button
                          onClick={() => handleReject(request._id)}
                          className="group/reject p-3 bg-gradient-to-br from-red-600/20 to-red-700/20 border border-red-500/50 hover:border-red-400/60 hover:from-red-600/30 hover:to-red-700/30 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg relative overflow-hidden"
                          aria-label="Reject connection"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/reject:translate-x-full transition-transform duration-500"></div>
                          <X className="w-5 h-5 relative z-10" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-700/50 to-gray-600/50 rounded-3xl border border-gray-600/30 flex items-center justify-center mx-auto">
                    <Bell className="w-10 h-10 text-gray-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 flex items-center justify-center">
                    <Check className="w-3 h-3 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">All caught up!</h3>
                <p className="text-gray-400 text-sm mb-4">No pending connection requests</p>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
              </div>
            )}
            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-700/50">
              <div className="flex gap-3">
                <button
                  className="flex-1 cursor-pointer px-6 py-3 rounded-xl bg-gradient-to-r from-gray-700/50 to-gray-600/50 border border-gray-600/50 hover:border-gray-500/60 hover:from-gray-700/70 hover:to-gray-600/70 text-gray-300 hover:text-white font-medium transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                  onClick={onClose}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                  <span className="relative z-10">Close</span>
                </button>
                {requests.length > 0 && navigate && (
                  <button
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-blue-700/20 border border-blue-500/50 hover:border-blue-400/60 hover:from-blue-600/30 hover:to-blue-700/30 text-blue-400 hover:text-blue-300 font-medium transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                    onClick={() => {
                      onClose();
                      navigate("/connections");
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                    <span className="relative z-10">View All</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5));
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(59, 130, 246, 0.7), rgba(147, 51, 234, 0.7));
        }
      `}</style>
    </ModalWindow>
  );
};

export default ConnectionRequestsModal; 