import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Aside from './Aside';
import { AiOutlineMessage  } from "react-icons/ai";


const AppLayout = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="flex h-screen bg-[#000000]">
      <Aside />
      <main className={`flex-1 overflow-y-scroll overflow-x-hidden ${isMobile ? 'pb-20' : ''}`}>
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
        {/* Floating Message Button */}
        <button
          onClick={() => navigate('/Chats')}
          className=" cursor-pointer fixed top-2 right-2 z-[9999] bg-[#212328]  hover:bg-gray-500 text-white p-2  flex items-center justify-center rounded-full shadow-2xl border border-gray-500/50 text-3xl transition-all duration-200 text-lg "
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
          aria-label="Open Messages"
        >
          <AiOutlineMessage  className=' text-2xl text-green-500'/> <span className='text-sm hidden md:inline ms-1' >Chats</span>
        </button>
      </main>
    </div>
  );
};

export default AppLayout;
