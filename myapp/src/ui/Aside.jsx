import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiHome5Fill } from "react-icons/ri";
import { RiSearch2Line } from "react-icons/ri";
import {
  MdOutlineExplore,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { FaSquarePlus } from "react-icons/fa6";
import { useUser } from "@clerk/clerk-react";
import { MdManageAccounts } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

const Aside = () => {
  const [expanded, setExpanded] = useState(null);
  const [screenSize, setScreenSize] = useState("desktop");
  const navigate = useNavigate();
  const { user } = useUser();
  const [mainUser, setMainUser] = useState();

  const navItems = [
    { label: "Home", icon: <RiHome5Fill />, path: "/Network" },
    { label: "Search", icon: <RiSearch2Line />, path: "/Search" },
    { label: "Explore", icon: <MdOutlineExplore />, hasSubMenu: true },
    { label: "Post", icon: <FaSquarePlus />, hasSubMenu: true },
    {
      label: user?.fullName || "Profile",
      icon: (
        <img
          src={user?.imageUrl}
          alt="Profile"
          className="w-6 h-6 rounded-full border border-white object-cover shadow-lg"
        />
      ),
      path: "/NetworkProfile",
      isUserProfile: true,
    },
    { label: "Account Settings", icon: <MdManageAccounts />, path: "/Account" },
  ];

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile");
      } else if (width >= 768 && width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleNavClick = (item) => {
    if (item.hasSubMenu) {
      setExpanded(expanded === item.label ? null : item.label);
    } else {
      setExpanded(null);
      if (item.path) {
        if (item.isUserProfile && mainUser?._id) {
          navigate("/NetworkProfile", {
            state: { userData: { userId: mainUser._id } },
          });
        } else {
          navigate(item.path);
        }
      }
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/profile/${user.id}`
      );
      const data = response.data;
      setMainUser(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile.");
    }
  };

  // Mobile footer navigation
  if (screenSize === "mobile") {
    return (
      <nav className="fixed bottom-0 left-0 right-0 w-full bg-[#000000] border-t border-gray-500/50 z-50">
        <div className="grid grid-cols-6 gap-1 items-center py-2 px-1 w-full bg-[#000000]">
          {navItems.map((item) => (
            <button
              key={item.label}
              className="flex flex-col items-center justify-center p-1 rounded-lg hover:bg-[#232526] transition-colors w-full text-gray-100"
              onClick={() => handleNavClick(item)}
              title={item.label}
            >
              <span className="text-lg text-gray-100">{item.icon}</span>
            </button>
          ))}
        </div>
        {/* Mobile submenu overlay */}
        {expanded && (
          <div className="absolute bottom-full left-0 right-0 bg-[#000000] border-t border-gray-500/50 p-4 max-h-64 overflow-y-auto">
            {expanded === "Explore" && (
              <div className="flex flex-col gap-2">
                <button
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[#232526] text-left text-gray-100"
                  onClick={() => {
                    navigate("/Notice");
                    setExpanded(null);
                  }}
                >
                  <span className="text-xl text-gray-100">📢</span>
                  <span className="text-sm text-gray-100">Notices</span>
                </button>
                <button
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[#232526] text-left text-gray-100"
                  onClick={() => {
                    navigate("/Events");
                    setExpanded(null);
                  }}
                >
                  <span className="text-xl text-gray-100">🎉</span>
                  <span className="text-sm text-gray-100">Events</span>
                </button>
              </div>
            )}
            {expanded === "Post" && (
              <div className="flex flex-col gap-2">
                <button
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[#232526] text-left text-gray-100"
                  onClick={() => {
                    navigate("/Post");
                    setExpanded(null);
                  }}
                >
                  <span className="text-xl text-gray-100">📝</span>
                  <span className="text-sm text-gray-100">Anything</span>
                </button>
                <button
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[#232526] text-left text-gray-100"
                  onClick={() => {
                    navigate("/FacultyPost");
                    setExpanded(null);
                  }}
                >
                  <span className="text-xl text-gray-100">👨‍🏫</span>
                  <span className="text-sm text-gray-100">Faculty</span>
                </button>
                <button
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[#232526] text-left text-gray-100"
                  onClick={() => {
                    navigate("/PostProject");
                    setExpanded(null);
                  }}
                >
                  <span className="text-xl text-gray-100">💼</span>
                  <span className="text-sm text-gray-100">Project</span>
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    );
  }

  // Tablet sidebar navigation (icons only)
  if (screenSize === "tablet") {
    return (
      <aside className="bg-[#000000] text-white w-16 min-h-screen flex flex-col py-6 px-2 border-r border-gray-500/50 relative">
        <div className="mb-8 text-lg font-bold tracking-wide text-center">
          CC
        </div>
        <nav className="flex flex-col gap-4 flex-1">
          {navItems.map((item) => (
            <React.Fragment key={item.label}>
              <button
                className="flex items-center justify-center py-3 px-2 rounded-lg hover:bg-[#232526] cursor-pointer transition-colors text-left relative group"
                onClick={() => handleNavClick(item)}
                title={item.label}
              >
                <span className="text-2xl">{item.icon}</span>
                {item.hasSubMenu && (
                  <span className="absolute -top-1 -right-1 text-xs">
                    {expanded === item.label ? (
                      <MdKeyboardArrowUp />
                    ) : (
                      <MdKeyboardArrowDown />
                    )}
                  </span>
                )}
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  {item.label}
                </div>
              </button>
            </React.Fragment>
          ))}
        </nav>

        {/* Tablet submenu overlay - positioned outside the aside */}
        {expanded && (
          <div className="fixed left-16 top-0 h-full bg-[#000000] border-r border-gray-500/50 p-4 min-w-48 z-40">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-100">
                {expanded === "Explore" ? "Explore" : "Post"}
              </h3>
              <button
                onClick={() => setExpanded(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            {expanded === "Explore" && (
              <div className="flex flex-col gap-2">
                <button
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-[#232526] text-left text-gray-100 transition-colors"
                  onClick={() => {
                    navigate("/Notice");
                    setExpanded(null);
                  }}
                >
                  <span className="text-xl">📢</span>
                  <span className="text-base">Notices</span>
                </button>
                <button
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-[#232526] text-left text-gray-100 transition-colors"
                  onClick={() => {
                    navigate("/Events");
                    setExpanded(null);
                  }}
                >
                  <span className="text-xl">🎉</span>
                  <span className="text-base">Events</span>
                </button>
              </div>
            )}

            {expanded === "Post" && (
              <div className="flex flex-col gap-2">
                <button
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-[#232526] text-left text-gray-100 transition-colors"
                  onClick={() => {
                    navigate("/Post");
                    setExpanded(null);
                  }}
                >
                  <span className="text-xl">📝</span>
                  <span className="text-base">Anything</span>
                </button>
                <button
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-[#232526] text-left text-gray-100 transition-colors"
                  onClick={() => {
                    navigate("/FacultyPost");
                    setExpanded(null);
                  }}
                >
                  <span className="text-xl">👨‍🏫</span>
                  <span className="text-base">Faculty</span>
                </button>
                <button
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-[#232526] text-left text-gray-100 transition-colors"
                  onClick={() => {
                    navigate("/PostProject");
                    setExpanded(null);
                  }}
                >
                  <span className="text-xl">💼</span>
                  <span className="text-base">Project</span>
                </button>
              </div>
            )}
          </div>
        )}
      </aside>
    );
  }

  // Desktop sidebar navigation
  return (
    <aside className="bg-[#000000] text-white w-64 min-h-screen flex flex-col py-6 px-4 border-r border-gray-500/50">
      <div className="mb-8 text-2xl font-bold tracking-wide">
        Campus Connect
      </div>
      <nav className="flex flex-col gap-4 flex-1">
        {navItems.map((item) => (
          <React.Fragment key={item.label}>
            <button
              className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[#232526] cursor-pointer transition-colors text-left"
              onClick={() => handleNavClick(item)}
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="text-base font-medium">{item.label}</span>
              {item.hasSubMenu && (
                <span className="ml-auto text-2xl">
                  {expanded === item.label ? (
                    <MdKeyboardArrowUp />
                  ) : (
                    <MdKeyboardArrowDown />
                  )}
                </span>
              )}
            </button>
            {item.label === "Explore" && expanded === "Explore" && (
              <div className="flex flex-col pl-10 gap-1 mt-0">
                <button
                  className="py-1 px-2 rounded hover:bg-[#232526] text-left text-sm cursor-pointer"
                  onClick={() => navigate("/Notice")}
                >
                  Notices
                </button>
                <button
                  className="py-1 px-2 rounded hover:bg-[#232526] text-left text-sm cursor-pointer"
                  onClick={() => navigate("/Events")}
                >
                  Events
                </button>
              </div>
            )}
            {item.label === "Post" && expanded === "Post" && (
              <div className="flex flex-col pl-10 gap-1 mt-0">
                <button
                  className="py-1 px-2 rounded hover:bg-[#232526] text-left text-sm cursor-pointer"
                  onClick={() => navigate("/Post")}
                >
                  Anything
                </button>
                <button
                  className="py-1 px-2 rounded hover:bg-[#232526] text-left text-sm cursor-pointer"
                  onClick={() => navigate("/FacultyPost")}
                >
                  Faculty
                </button>
                <button
                  className="py-1 px-2 rounded hover:bg-[#232526] text-left text-sm cursor-pointer"
                  onClick={() => navigate("/PostProject")}
                >
                  Project
                </button>
              </div>
            )}
          </React.Fragment>
        ))}
      </nav>
    </aside>
  );
};

export default Aside;
