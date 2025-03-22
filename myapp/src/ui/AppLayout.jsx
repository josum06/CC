import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AppLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      
      <Navbar />
      
      <main className="flex-1 overflow-y-scroll bg-gray-50 overflow-x-hidden ">
        <div className="container mx-auto "><Outlet /></div>
      </main>

      <Footer/>
      


    </div>
  
   
  );
};

export default AppLayout;
