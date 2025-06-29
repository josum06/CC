import { useEffect, useState } from "react";
import axios from "axios";
import ChatWindow from "./ChatWindow";
import { useUser } from "@clerk/clerk-react";
import { Search, MessageCircle, Users, ArrowLeft, MoreVertical, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ChatApp = () => {
  const { user: clerkUser } = useUser();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [recipient, setRecipient] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showChat, setShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (clerkUser) fetchCurrentUser();

    // Handle responsive behavior
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clerkUser]);

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/user/profile/${clerkUser.id}`
      );
      setUser(res.data);
      await fetchAllUsers(res.data._id);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllUsers = async (currentUserId) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/user/getAllConnections/${currentUserId}`
      );
      console.log(res.data);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUserSelect = (selectedUser) => {
    setRecipient(selectedUser);
    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleBackToContacts = () => {
    setShowChat(false);
  };

  const filteredUsers = users.filter(u =>
    u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.designation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Sidebar - Hidden on mobile when chat is open */}
      <div
        className={`${
          isMobile && showChat ? "hidden" : "block"
        } w-full md:w-2/5 lg:w-1/3 xl:w-1/3 flex flex-col relative z-10 transition-all duration-300 ease-in-out`}
      >
        {/* Header */}
        <div className=" bg-[#000000] backdrop-blur-xl border-b border-gray-700/50 p-4 md:p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-xl cursor-pointer transition-all duration-300 group hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </button>
            <div className="relative group">
              <img
                src={user?.profileImage || "default-user.jpg"}
                alt="user"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-blue-500/30 shadow-lg group-hover:ring-blue-500/60 transition-all duration-300"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 shadow-lg animate-pulse"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg md:text-xl font-bold text-white truncate">Messages</h2>
              <p className="text-xs md:text-sm text-gray-400 truncate">
                {isLoading ? "Loading..." : `${users.length} connections`}
              </p>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 group hover:scale-105 cursor-pointer">
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </button>
            {/* <button className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 group hover:scale-105">
              <MoreVertical className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </button> */}
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 md:p-4 bg-gradient-to-r from-gray-800/50 via-gray-700/30 to-gray-800/50 border-b border-gray-700/30">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 rounded-2xl bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300 group-hover:border-gray-600/50"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 text-sm">Loading connections...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {searchQuery ? "No matches found" : "No connections yet"}
              </h3>
              <p className="text-gray-400 text-sm max-w-xs">
                {searchQuery 
                  ? "Try adjusting your search terms" 
                  : "Start connecting with your campus community"
                }
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredUsers.map((u, index) => (
                <motion.div
                  key={u._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => handleUserSelect(u)}
                  className={`group flex items-center p-3 md:p-4 cursor-pointer rounded-2xl transition-all duration-300 hover:bg-gray-800/50 hover:scale-[1.02] hover:shadow-lg ${
                    recipient?._id === u._id ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 shadow-lg" : ""
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={u.profileImage || "default-user.jpg"}
                      alt="user"
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-gray-700/50 group-hover:ring-blue-500/50 transition-all duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 shadow-lg animate-pulse"></div>
                  </div>
                  <div className="ml-3 md:ml-4 flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-white text-sm md:text-base truncate group-hover:text-blue-400 transition-colors duration-300">
                        {u.fullName}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        12:30 PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs md:text-sm text-gray-400 truncate max-w-[120px] md:max-w-[150px]">
                        {u.designation?.slice(0, 1).toUpperCase() +
                          u.designation?.slice(1) || "Student"}
                      </p>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`${
          isMobile && !showChat ? "hidden" : "block"
        } w-full md:w-3/5 lg:w-2/3 xl:w-2/3 flex flex-col relative z-10 transition-all duration-300 ease-in-out`}
      >
        {recipient ? (
          <>
            {/* Mobile back button */}
            {isMobile && (
              <div className="md:hidden bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 p-3 shadow-lg">
                <div className="flex items-center">
                  <button 
                    onClick={handleBackToContacts} 
                    className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 mr-3 hover:scale-105"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-400" />
                  </button>
                  <div className="flex items-center flex-1 min-w-0">
                    <img
                      src={recipient.profileImage || "default-user.jpg"}
                      alt="recipient"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30 mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-base truncate">
                        {recipient.fullName}
                      </h3>
                      <p className="text-xs text-green-400 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        online
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <ChatWindow user={user} recipient={recipient} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-transparent relative">
            <motion.div 
              className="bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 md:p-12 text-center max-w-md mx-4 shadow-2xl"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center animate-pulse">
                <MessageCircle className="w-10 h-10 md:w-12 md:h-12 text-blue-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                Welcome to Campus Connect
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Select a connection from the list to start chatting and building meaningful relationships
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>End-to-end encrypted messaging</span>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <style jsx>{`
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

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default ChatApp;
