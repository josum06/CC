import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div
      className="flex items-center justify-center fixed inset-0 bg-[#040404] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-[#ece239] border-r-[#27dc66] border-b-[#c76191]" />
      </div>
    </motion.div>
  );
};

export default Loader;
