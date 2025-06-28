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
          className="w-8 h-8 rounded-full border border-white object-cover shadow-lg"
        />
      ),
      path: "/NetworkProfile",
      isUserProfile: true, // Add this flag to identify user's own profile
    },
    { label: "Account Settings", icon: <MdManageAccounts />, path: "/Account" },
  ];

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const handleNavClick = (item) => {
    if (item.hasSubMenu) {
      setExpanded(expanded === item.label ? null : item.label);
    } else {
      setExpanded(null);
      if (item.path) {
        // Special handling for user's own profile
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
        `http://localhost:3000/api/user/profile/${user.id}`
      );
      const data = response.data;
      setMainUser(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile.");
    }
  };

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
