import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Bell, Check, X, User, Loader2 } from "lucide-react";
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
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/user/getPendingConnections/${userId}`
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
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/user/connectionsRejected/${userId}`,
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
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/user/connectionsAccepted/${userId}`,
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
      <div className="fixed inset-0 bg-[#070707]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
        {/* Background gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#4790fd]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c76191]/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#27dc66]/3 rounded-full blur-3xl"></div>
        </div>

        <div className="relative bg-[#040404]/95 backdrop-blur-2xl rounded-3xl border border-[#4790fd]/20 p-6 sm:p-8 max-w-lg w-full mx-4 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#4790fd]/10 rounded-xl border border-[#4790fd]/20">
                <Bell className="w-6 h-6 text-[#4790fd]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#f5f5f5]">
                  Connection Requests
                </h2>
                <p className="text-[#a0a0a0] text-sm">
                  Manage your incoming requests
                </p>
              </div>
            </div>
            {requests.length > 0 && (
              <div className="px-3 py-1 bg-[#c76191]/10 border border-[#c76191]/20 rounded-full">
                <span className="text-[#c76191] text-sm font-medium">
                  {requests.length}
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-[#4790fd]/20 rounded-full"></div>
                <div className="w-12 h-12 border-4 border-t-[#4790fd] border-r-[#27dc66] rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <p className="text-[#a0a0a0] text-sm mt-4">Loading requests...</p>
            </div>
          ) : requests.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {requests.map((request, index) => (
                <div
                  key={request._id}
                  className="group relative bg-[#070707]/50 backdrop-blur-xl border border-[#4790fd]/10 rounded-2xl p-4 hover:border-[#4790fd]/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg overflow-hidden"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <img
                          src={request.profileImage}
                          alt="Profile"
                          className="w-14 h-14 rounded-xl object-cover border-2 border-[#4790fd]/30 group-hover:border-[#4790fd]/50 transition-all duration-300 shadow-lg"
                          onError={(e) => {
                            e.target.style.display = "none";
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = "flex";
                            }
                          }}
                        />
                        <div className="hidden w-14 h-14 rounded-xl bg-[#070707] items-center justify-center border-2 border-[#4790fd]/30">
                          <User className="w-7 h-7 text-[#4790fd]" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#27dc66] rounded-full border-2 border-[#040404] shadow-lg"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[#f5f5f5] font-semibold text-base truncate group-hover:text-[#4790fd] transition-colors">
                          {request.fullName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[#a0a0a0] text-xs">
                            Wants to connect
                          </span>
                          <div className="w-1 h-1 bg-[#808080] rounded-full"></div>
                          <span className="text-[#808080] text-xs">
                            Just now
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleAccept(request._id)}
                        className="group/accept p-3 bg-[#27dc66]/10 border border-[#27dc66]/20 hover:border-[#27dc66]/30 hover:bg-[#27dc66]/15 text-[#27dc66] rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg relative overflow-hidden"
                        aria-label="Accept connection"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/accept:translate-x-full transition-transform duration-500"></div>
                        <Check className="w-5 h-5 relative z-10" />
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="group/reject p-3 bg-[#c76191]/10 border border-[#c76191]/20 hover:border-[#c76191]/30 hover:bg-[#c76191]/15 text-[#c76191] rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg relative overflow-hidden"
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
              <div className="relative mb-6 inline-block">
                <div className="w-20 h-20 bg-[#070707]/50 rounded-3xl border border-[#4790fd]/10 flex items-center justify-center">
                  <Bell className="w-10 h-10 text-[#808080]" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#27dc66]/10 rounded-full border border-[#27dc66]/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#27dc66]" />
                </div>
              </div>
              <h3 className="text-[#f5f5f5] text-xl font-semibold mb-2">
                All caught up!
              </h3>
              <p className="text-[#a0a0a0] text-sm mb-4">
                No pending connection requests
              </p>
              <div className="w-16 h-1 bg-gradient-to-r from-[#4790fd] to-[#c76191] rounded-full mx-auto"></div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-[#4790fd]/10">
            <div className="flex gap-3">
              <button
                className="flex-1 cursor-pointer px-6 py-3 rounded-xl bg-[#070707]/50 backdrop-blur-xl border border-[#4790fd]/10 hover:border-[#4790fd]/20 hover:bg-[#070707]/70 text-[#f5f5f5] hover:text-white font-medium transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                onClick={onClose}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                <span className="relative z-10">Close</span>
              </button>
              {requests.length > 0 && navigate && (
                <button
                  className="px-6 py-3 rounded-xl bg-[#4790fd]/10 border border-[#4790fd]/20 hover:border-[#4790fd]/30 hover:bg-[#4790fd]/15 text-[#4790fd] hover:text-[#4790fd] font-medium transition-all duration-300 hover:scale-105 relative overflow-hidden group"
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

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(7, 7, 7, 0.3);
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(
              to bottom,
              rgba(71, 144, 253, 0.5),
              rgba(199, 97, 145, 0.5)
            );
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(
              to bottom,
              rgba(71, 144, 253, 0.7),
              rgba(199, 97, 145, 0.7)
            );
          }
        `}</style>
      </div>
    </ModalWindow>
  );
};

export default ConnectionRequestsModal;
