import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Aside from './Aside';
import { AiOutlineMessage  } from "react-icons/ai";


const AppLayout = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-screen bg-[#000000]">
      <Aside />
      <main className="flex-1 overflow-y-scroll overflow-x-hidden">
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
        {/* Floating Message Button */}
        <button
          onClick={() => navigate('/Chats')}
          className=" cursor-pointer fixed bottom-6 right-6 z-[9999] bg-[#212328]  hover:bg-gray-500 text-white px-4 py-2 flex items-center justify-center rounded-3xl shadow-2xl border border-gray-500/50 text-3xl transition-all duration-200 text-lg "
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
          aria-label="Open Messages"
        >
          <AiOutlineMessage  className='mr-1 text-xl'/> <span className='text-sm'>Message</span>
        </button>
      </main>
    </div>
  );
};

export default AppLayout;
