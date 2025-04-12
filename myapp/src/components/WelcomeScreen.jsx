import React from 'react';

const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#128C7E] p-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-medium text-[#e9edef] mb-4">Welcome to Campus Connect Chat</h1>
        <p className="text-[#8696a0] mb-8">
          Select a chat to start messaging with your friends and colleagues.
        </p>
        <div className="w-64 h-64 mx-auto">
          <img
            src="https://api.dicebear.com/7.x/bottts/svg?seed=Welcome"
            alt="Welcome"
            className="w-full h-full object-contain opacity-80"
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;