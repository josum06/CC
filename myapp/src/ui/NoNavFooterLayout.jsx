import React from 'react';
import { Outlet } from 'react-router-dom';

const NoNavFooterLayout = () => {
  return (
    <div className="w-full h-screen">
      <main className="flex-1 overflow-y-scroll bg-gray-50 overflow-x-hidden">
        <div className="container mx-auto bg-[#000000]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default NoNavFooterLayout;
