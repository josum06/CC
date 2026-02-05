import { useEffect, useState } from "react";
import axios from "axios";
import ChatWindow from "./ChatWindow";
import { useUser } from "@clerk/clerk-react";
import {
  Search,
  MessageCircle,
  Users,
  ArrowLeft,
  Bell,
  Phone,
  Video,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ConnectionRequestsModal from "../components/ConnectionRequestsModal";

// Theme colors (from theme.txt)
const CC_YELLOW = "#ece239";
const CC_BLUE = "#4790fd";
const CC_PINK = "#c76191";
const CC_GREEN = "#27dc66";

const COMMUNITIES = [
  {
    id: "cp-hub",
    name: "Competitive Programming Hub",
    members: 320,
    category: "Coding • DSA • Contests",
    lastMessage: "Tomorrow’s LeetCode contest discussion at 8 PM.",
    messages: [
      { id: 1, sender: "Moderator", text: "Welcome to CP Hub! Share your ratings and goals for this month.", time: "10:12 AM" },
      { id: 2, sender: "Aarav", text: "Targeting 1700 on Codeforces before midsems 🔥", time: "10:15 AM" },
      { id: 3, sender: "Simran", text: "Dropping a sheet with 50 must-solve graph problems.", time: "10:25 AM" },
    ],
    members: ["Aarav Singh", "Simran Kaur", "Rahul Mehta", "Priya Verma"],
    photos: ["/LOGO/CCLOGOTW.avif"],
    image: "/LOGO/CCLOGOBT.avif",
  },
  {
    id: "startup-circle",
    name: "Startup Circle",
    members: 185,
    category: "Entrepreneurship • Pitching",
    lastMessage: "Share your MVP for instant peer feedback.",
    messages: [
      { id: 1, sender: "Host", text: "Pitch practice call at 9 PM today. Drop your deck links here.", time: "5:30 PM" },
      { id: 2, sender: "Ishaan", text: "We just closed 50 beta users for our notes app 🚀", time: "5:42 PM" },
    ],
    members: ["Ishaan Gupta", "Meera Rao", "Kunal Jain"],
    photos: ["/LOGO/CCLOGOBW.avif"],
    image: "/LOGO/CCLOGOTW.avif",
  },
  {
    id: "ml-club",
    name: "AI & ML Club",
    members: 412,
    category: "ML • DL • Kaggle",
    lastMessage: "New dataset dropped for weekend hackathon.",
    messages: [
      { id: 1, sender: "Ananya", text: "Anyone trying the Kaggle Titanic comp for the first time?", time: "3:10 PM" },
      { id: 2, sender: "Moderator", text: "Weekend hackathon theme: Vision + GenAI. Teams of 3–4.", time: "3:18 PM" },
    ],
    members: ["Ananya Sharma", "Rohan Das", "Sanya Malhotra"],
    photos: ["/logo.png"],
    image: "/LOGO/CCLOGOBW.avif",
  },
  {
    id: "design-studio",
    name: "Design Studio",
    members: 267,
    category: "UI/UX • Branding",
    lastMessage: "Drop your latest Dribbble shots for review.",
    messages: [
      { id: 1, sender: "Neha", text: "Redesigned the Campus Connect UI, feedback welcome ✨", time: "7:05 PM" },
      { id: 2, sender: "Arjun", text: "Figma file with the new design tokens is pinned.", time: "7:12 PM" },
    ],
    members: ["Neha Kapoor", "Arjun Yadav", "Kriti Sen"],
    photos: ["/LOGO/CCLOGOTW.avif"],
    image: "/logo.png",
  },
  {
    id: "placements-2026",
    name: "Placements 2026",
    members: 538,
    category: "Prep • Referrals • Mock HR",
    lastMessage: "Aptitude mock test link shared, closes tonight.",
    messages: [
      { id: 1, sender: "TPO", text: "Drive from XYZ Corp next week. Check eligibility in the notice board.", time: "9:00 AM" },
      { id: 2, sender: "Sarthak", text: "Sharing notes for OS + DBMS from previous interview rounds.", time: "9:25 AM" },
    ],
    members: ["Sarthak Jain", "Placement Cell", "Year 3 & 4 students"],
    photos: ["/LOGO/CCLOGOBT.avif"],
    image: "/LOGO/CCLOGOTW.avif",
  },
];

const ChatApp = () => {
  const { user: clerkUser } = useUser();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [recipient, setRecipient] = useState(null);
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showChat, setShowChat] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // all | students | faculty

  const [isLoading, setIsLoading] = useState(true);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (clerkUser) fetchCurrentUser();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clerkUser]);

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile/${clerkUser.id}`
      );
      setUser(res.data);
      await fetchAllUsers(res.data._id);
      await fetchPendingRequestsCount(res.data._id);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllUsers = async (currentUserId) => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/user/getAllConnections/${currentUserId}`
      );
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchPendingRequestsCount = async (userId) => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/user/getPendingConnections/${userId}`
      );
      setPendingCount(res.data.length || 0);
    } catch (error) {
      console.error("Error fetching pending requests count:", error);
    }
  };

  const handleUserSelect = (selectedUser) => {
    setRecipient(selectedUser);
    if (isMobile) setShowChat(true);
  };

  const handleBackToContacts = () => {
    setShowChat(false);
  };

  const normalizeDesignation = (designation) => {
    if (!designation) return "";
    return designation.toLowerCase();
  };

  const filteredUsers = users
    .filter((u) => {
      const q = searchQuery.toLowerCase();
      const nameMatch = u.fullName?.toLowerCase().includes(q);
      const desigMatch = u.designation?.toLowerCase().includes(q);
      if (!q) return true;
      return nameMatch || desigMatch;
    })
    .filter((u) => {
      if (activeFilter === "all") return true;
      const d = normalizeDesignation(u.designation);
      if (activeFilter === "faculty") return d.includes("faculty");
      if (activeFilter === "students") return !d.includes("faculty");
      return true;
    });

  const totalConnections = users.length;

  return (
    <div className="flex h-screen bg-[#040404] relative overflow-hidden transition-colors duration-300">
      {/* Ambient background using theme colors */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-16 w-80 h-80 rounded-full blur-3xl opacity-40"
             style={{ background: CC_BLUE }} />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full blur-[90px] opacity-35"
             style={{ background: CC_PINK }} />
        <div className="absolute bottom-0 left-1/4 w-[380px] h-[380px] rounded-full blur-[90px] opacity-25"
             style={{ background: CC_GREEN }} />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-25"
             style={{ background: CC_YELLOW }} />
      </div>

      {/* LEFT: Chats list (WhatsApp-style) */}
      <div
        className={`${
          isMobile && showChat ? "hidden" : "flex"
        } w-full md:w-[40%] lg:w-[32%] flex-col relative z-10 border-r border-white/5 bg-black/60 backdrop-blur-2xl`}
      >
        {/* Top bar like WhatsApp with app + profile + actions */}
        <div className="px-4 py-3 border-b border-white/5 bg-gradient-to-r from-black/80 via-black/70 to-black/80">
          <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
                className="hidden md:inline-flex p-2 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
            >
                <ArrowLeft className="w-4 h-4 text-white/70" />
            </button>
              <div className="relative">
              <img
                src={clerkUser?.imageUrl || "default-user.jpg"}
                  alt="You"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#4790fd]/60 shadow-lg shadow-[#4790fd]/25"
              />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black bg-[#27dc66] shadow-[0_0_10px_rgba(39,220,102,0.7)]" />
            </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-white/60">
                  Campus Connect
                </p>
                <p className="text-sm font-semibold text-white truncate">
                  Chats
                </p>
                <p className="text-[11px] text-[#27dc66]/90">
                  {isLoading ? "Syncing conversations..." : `${totalConnections} connections`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRequestsModal(true)}
                className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#ece239]/60 transition-all duration-300"
            >
                <Bell className="w-4 h-4 text-[#ece239] " />
              {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-0.5 px-1.5 py-0.5 rounded-full bg-[#c76191] text-[10px] font-semibold text-white shadow-lg shadow-[#c76191]/60">
                  {pendingCount}
                </span>
              )}
            </button>
            </div>
          </div>
        </div>

        {/* Search + filter row */}
        <div className="px-3 pt-3 pb-2 border-b border-white/5 bg-black/70">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
                placeholder="Search by name or role"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-[#4790fd]/60 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>

          {/* Filter chips */}
          <div className="mt-2 flex items-center gap-2 overflow-x-auto hide-scrollbar">
            {[
              { id: "all", label: "All Chats" },
              { id: "students", label: "Students" },
              { id: "faculty", label: "Faculty" },
              { id: "community", label: "Community" },
            ].map((f) => {
              const active = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all duration-300 whitespace-nowrap ${
                    active
                      ? "bg-gradient-to-r from-[#4790fd] to-[#27dc66] border-transparent text-white shadow-md shadow-[#4790fd]/40"
                      : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/40"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chats / Communities list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/60">
          {activeFilter === "community" ? (
            <div className="p-3 space-y-2">
              {COMMUNITIES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => {
                    setSelectedCommunity(c);
                    if (isMobile) setShowChat(true);
                  }}
                  className="w-full text-left rounded-2xl bg-white/5 border border-white/10 px-3 py-2.5 flex items-center gap-3 hover:border-[#4790fd]/70 hover:bg-white/10 transition-all duration-300 shadow-sm shadow-black/40"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-9 h-9 rounded-full object-cover border border-white/10"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#27dc66] border border-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-white truncate">
                        {c.name}
                      </p>
                      <span className="text-[10px] text-white/50">
                        {c.members.toLocaleString()}+
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-white/60 line-clamp-2">
                      {c.lastMessage}
                    </p>
                    <span className="mt-1 inline-flex px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-[9px] text-white/60">
                      {c.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-2 border-[#4790fd]/40 border-t-[#4790fd] animate-spin" />
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-[#4790fd]/10 via-[#c76191]/10 to-[#27dc66]/10 blur-sm" />
              </div>
              <p className="text-xs text-white/60">
                Loading your campus conversations...
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-dashed border-white/20">
                <Users className="w-9 h-9 text-white/40" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                {searchQuery ? "No matches found" : "No connections yet"}
              </h3>
              <p className="text-xs text-white/50 max-w-xs">
                {searchQuery
                  ? "Try another name, role or clear your filters."
                  : "Build your campus network to start chats instantly."}
              </p>
            </div>
          ) : (
            <div className="py-1">
              {filteredUsers.map((u, index) => {
                const isActive = recipient?._id === u._id;
                const designation = u.designation
                  ? u.designation.charAt(0).toUpperCase() +
                    u.designation.slice(1)
                  : "Student";

                return (
                  <motion.button
                  key={u._id}
                    type="button"
                    initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                  onClick={() => handleUserSelect(u)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left relative group transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-white/10 via-white/5 to-transparent"
                        : "hover:bg-white/5"
                    }`}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full"
                        style={{
                          background: `linear-gradient(to bottom, ${CC_BLUE}, ${CC_GREEN})`,
                        }}
                      />
                    )}

                  <div className="relative flex-shrink-0">
                    <img
                      src={u.profileImage || "default-user.jpg"}
                        alt={u.fullName}
                        className="w-11 h-11 rounded-full object-cover border border-white/10 shadow-md shadow-black/60 group-hover:border-[#4790fd]/60 transition-all duration-300"
                    />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-black bg-[#27dc66]" />
                  </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-xs font-semibold truncate ${
                            isActive ? "text-white" : "text-white/90"
                          }`}
                        >
                        {u.fullName}
                        </p>
                        <span className="shrink-0 text-[10px] text-white/40">
                          {/* Placeholder time, could be wired to last message timestamp */}
                        12:30 PM
                      </span>
                    </div>
                      <div className="mt-0.5 flex items-center justify-between gap-2">
                        <p className="text-[11px] text-white/50 truncate">
                          {designation}
                        </p>
                        {/* Example unread pill (UI only – could be wired to real data later) */}
                        <span className="ml-auto inline-flex h-4 min-w-[1.3rem] items-center justify-center rounded-full bg-[#4790fd] text-[10px] font-semibold text-white shadow-sm shadow-[#4790fd]/70 opacity-70 group-hover:opacity-100">
                          1
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Active chat */}
      <div
        className={`${
          isMobile && !showChat ? "hidden" : "flex"
        } w-full md:w-[60%] lg:w-[68%] flex-col relative z-10 bg-black/70 backdrop-blur-2xl`}
      >
        {activeFilter === "community" && selectedCommunity ? (
          <CommunityChat
            community={selectedCommunity}
            isMobile={isMobile}
            onMobileBack={isMobile ? handleBackToContacts : undefined}
          />
        ) : recipient ? (
          <ChatWindow
            user={user}
            recipient={recipient}
            clerkUser={clerkUser}
            isMobile={isMobile}
            onMobileBack={isMobile ? handleBackToContacts : undefined}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/60 relative">
            <motion.div
              className="relative max-w-lg w-[90%] sm:w-[70%] bg-black/70 border border-white/10 rounded-3xl px-8 py-10 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div
                className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-40"
                style={{
                  background: `conic-gradient(from 180deg, ${CC_BLUE}, ${CC_PINK}, ${CC_GREEN}, ${CC_BLUE})`,
                }}
              />
              <div className="relative flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4790fd]/30 via-[#c76191]/20 to-[#27dc66]/30 flex items-center justify-center mb-5 border border-white/10">
                  <MessageCircle className="w-10 h-10 text-[#4790fd]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                  Campus Chats
                </h2>
                <p className="text-xs sm:text-sm text-white/70 mb-4">
                  Select a connection on the left to start a conversation.
                </p>
                <p className="text-[11px] text-white/50 max-w-sm">
                  Messages are synced in real-time across your campus network.
                  Collaborate on projects, clear doubts and stay connected with
                  your peers and faculty.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Connection Requests Modal */}
      {showRequestsModal && (
        <ConnectionRequestsModal
          onClose={() => setShowRequestsModal(false)}
          currentUserId={user?._id}
          onRequestsUpdated={() => {
            if (user) {
              fetchPendingRequestsCount(user._id);
              fetchAllUsers(user._id);
            }
          }}
        />
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.6);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(
            to bottom,
            rgba(71, 144, 253, 0.7),
            rgba(199, 97, 145, 0.7)
          );
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            to bottom,
            rgba(71, 144, 253, 0.9),
            rgba(199, 97, 145, 0.9)
          );
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

const CommunityChat = ({ community, isMobile, onMobileBack }) => {
  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-black/80 backdrop-blur-2xl">
      {/* Header */}
      <div className="relative z-20 px-4 py-3 md:px-6 md:py-3 border-b border-white/10 bg-gradient-to-r from-black via-black/90 to-black/80">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 md:gap-4">
            {isMobile && (
              <button
                type="button"
                className="mr-1 p-1.5 rounded-full hover:bg-white/10 text-white/70 transition-all duration-300"
                onClick={onMobileBack}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="relative">
              <img
                src={community.image}
                alt={community.name}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover border border-white/10 shadow-lg shadow-black/70"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#27dc66] rounded-full border border-black shadow-[0_0_10px_rgba(39,220,102,0.9)]" />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-white text-sm md:text-base truncate">
                {community.name}
              </h2>
              <p className="text-[11px] text-white/60 truncate">
                {community.members.toLocaleString()}+ members • {community.category}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/80 hover:bg-white/10 transition-all duration-300">
              All Members
            </button>
            <button className="px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/80 hover:bg-white/10 transition-all duration-300">
              Photos
            </button>
          </div>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#020308]/90 p-3 md:p-4 space-y-2">
        {community.messages?.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex w-full justify-start"
          >
            <div className="max-w-[85%] md:max-w-[70%] px-3 py-2 md:px-4 md:py-2.5 rounded-2xl bg-gradient-to-tr from-slate-900/95 via-slate-900/90 to-[#4790fd]/40 text-slate-100 border border-slate-700/70 rounded-bl-md shadow-md shadow-black/60">
              <p className="text-[11px] font-semibold text-[#ece239] mb-0.5">
                {m.sender}
              </p>
              <p className="text-[13px] md:text-sm whitespace-pre-wrap">
                {m.text}
              </p>
              <span className="mt-1 block text-[10px] text-slate-300/80 text-right">
                {m.time}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2.5 border-t border-white/10 bg-black/90 text-[11px] text-white/60">
        Community chats are sample previews. Connect with your campus to join
        real communities.
      </div>
    </div>
  );
};

export default ChatApp;
