import React from 'react';

const WelcomeScreen = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5]">
      <div className="w-48 h-48 mb-4">
        <img 
          src="https://web.whatsapp.com/img/intro-connection-light_c98cc75f2aa905314d74375a975d2cf2.jpg" 
          alt="Welcome" 
          className="w-full h-full object-contain" 
        />
      </div>
      <h2 className="text-2xl font-light text-gray-600 mb-2">
        Welcome to WhatsApp
      </h2>
      <p className="text-gray-500">
        Select a chat to start messaging
      </p>
    </div>
  );
};

export default WelcomeScreen; 