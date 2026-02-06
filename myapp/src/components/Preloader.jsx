import React from 'react';
import { motion } from 'framer-motion';

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#040404] text-white">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          {/* Logo Container */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32">
            <motion.div
              className="absolute inset-0 rounded-full border-t-2 border-[#4790fd]"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-r-2 border-[#27dc66]"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-4 rounded-full border-b-2 border-[#ece239]"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <img src="/LOGO/CCLOGOTW.avif" alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-[0_0_15px_rgba(71,144,253,0.5)]" />
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#4790fd] via-[#27dc66] to-[#ece239] bg-clip-text text-transparent mb-2 tracking-wider">
            CAMPUS CONNECT
          </h1>
          <p className="text-sm text-gray-400 tracking-widest uppercase">Unified Under One Connection</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Preloader;
