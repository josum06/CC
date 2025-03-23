import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <motion.div
      className="flex items-center justify-center fixed inset-0 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500"></div>
    </motion.div>
  );
};

export default Loader;
