import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import Aside from "./Aside";
import { AiOutlineMessage } from "react-icons/ai";
import { useTheme } from "../context/ThemeContext";

const AppLayout = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const { user } = useUser();
  
  useEffect(() => {
    if (!user) return;
    
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/profile/${user.id}`
        );
        const userData = await response.json();
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  return (
    <div
      className={`flex h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-[#040404]" : "bg-[#f5f5f5]"
      }`}
    >
      <Aside />
      <main
        className={`flex-1 overflow-y-scroll overflow-x-hidden ${
          isMobile ? "pb-20" : ""
        }`}
      >
        <div
          className={`container mx-auto min-h-screen transition-colors duration-300 ${
            isDarkMode ? "bg-[#040404] text-white" : "bg-[#f5f5f5] text-black"
          }`}
        >
          <Outlet />
        </div>
        <FloatingChatButton onClick={() => navigate("/Chats")} />
      </main>
      

    </div>
  );
};

const FloatingChatButton = ({ onClick }) => {
  const { isDarkMode } = useTheme();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); // placeholder, wire to real data later
  const [hasDragged, setHasDragged] = useState(false);

  // Set default position (right middle) and restore from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem("chatButtonPosition");
    const { innerWidth, innerHeight } = window;
    const defaultX = innerWidth - 80;
    const defaultY = innerHeight * 0.6;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPosition({
          x: parsed.x ?? defaultX,
          y: parsed.y ?? defaultY,
        });
        return;
      } catch {
        // ignore parse errors
      }
    }
    setPosition({ x: defaultX, y: defaultY });
  }, []);

  const clampAndSnapToEdge = useCallback((x, y) => {
    const margin = 16;
    const radius = 32; // approx button radius
    const w = window.innerWidth;
    const h = window.innerHeight;

    // constrain vertically
    const minY = margin;
    const maxY = h - margin - radius * 2;
    const clampedY = Math.min(Math.max(y, minY), Math.max(minY, maxY));

    // snap horizontally to nearest edge
    const snapLeft = margin;
    const snapRight = w - margin - radius * 2;
    const clampedX = x < w / 2 ? snapLeft : snapRight;

    return { x: clampedX, y: clampedY };
  }, []);

  const startDrag = (clientX, clientY) => {
    setIsDragging(true);
    setHasDragged(false);
    setPosition((prev) => ({ ...prev, dragOffsetX: clientX - prev.x, dragOffsetY: clientY - prev.y }));
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      setPosition((prev) => {
        const nextX = clientX - (prev.dragOffsetX || 0);
        const nextY = clientY - (prev.dragOffsetY || 0);
        // mark as dragged if movement is significant
        const dx = nextX - prev.x;
        const dy = nextY - prev.y;
        if (Math.sqrt(dx * dx + dy * dy) > 6) {
          setHasDragged(true);
        }
        return {
          ...prev,
          x: nextX,
          y: nextY,
        };
      });
    };

    const handleUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      // snapping + persistence
      setPosition((prev) => {
        const snapped = clampAndSnapToEdge(prev.x, prev.y);
        localStorage.setItem(
          "chatButtonPosition",
          JSON.stringify({ x: snapped.x, y: snapped.y })
        );
        return snapped;
      });
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isDragging, clampAndSnapToEdge]);

  const handleClick = () => {
    // If user was dragging, don't navigate; just reset drag state
    if (isDragging || hasDragged) {
      setHasDragged(false);
      return;
    }
    onClick();
  };

  const bgBase = isDarkMode
    ? "bg-[#4790fd]"
    : "bg-[#4790fd]";
  const borderBase = "border-transparent";
  const shadowBase = isDarkMode
    ? "shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
    : "shadow-[0_12px_40px_rgba(15,23,42,0.35)]";

  return (
    <button
      type="button"
      aria-label="Open Chats"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      className={`fixed z-[9999] flex items-center justify-center rounded-full border ${bgBase} ${borderBase} ${shadowBase} cursor-pointer select-none transition-transform transition-shadow duration-300 ${
        isDragging ? "scale-95" : "hover:scale-105"
      }`}
      style={{
        width: 56,
        height: 56,
        left: position.x,
        top: position.y,
      }}
    >
      {/* Glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#4790fd]/40 via-[#27dc66]/40 to-[#c76191]/40 opacity-0 blur-md group-hover:opacity-100" />

      {/* Paper plane icon */}
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        className="text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 11.5L20 4l-7.5 17-2.5-7-7-2.5z" />
      </svg>

      {/* Unread badge */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 flex items-center justify-center rounded-full bg-[#e11d48] text-[11px] font-semibold text-white shadow-md shadow-[#e11d48]/60">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default AppLayout;
