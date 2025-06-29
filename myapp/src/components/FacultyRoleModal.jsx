import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, X, Lock, Eye, EyeOff, Crown, Sparkles } from "lucide-react";

const FacultyRoleModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [facultyId, setFacultyId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const validFacultyIds = import.meta.env.VITE_VALID_FACULTY_IDs.split(",");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Check if the entered ID is valid
      // You can replace this with an actual API call to verify the faculty ID
      if (validFacultyIds.includes(facultyId.toUpperCase())) {
        // Success - navigate to faculty role page
        navigate("/FacultyRole");
        onClose();
        setFacultyId("");
      } else {
        setError("Invalid Faculty ID. Please check your credentials.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFacultyId("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 md:p-6">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-700/50 shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-white/20 to-transparent rounded-full blur-2xl"></div>
        </div>

        {/* Header */}
        <div className="relative p-4 sm:p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/30 via-gray-700/20 to-gray-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-500/30">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Faculty Access
                </h2>
                <p className="text-xs sm:text-sm text-gray-400">
                  Enter your Faculty ID to continue
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="relative p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <label
              htmlFor="facultyId"
              className="block text-sm font-medium text-gray-300 mb-2 sm:mb-3"
            >
              Faculty ID
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="facultyId"
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                className="block w-full pl-10 pr-12 py-3 sm:py-4 border border-gray-600/50 rounded-xl sm:rounded-2xl 
                  bg-gradient-to-r from-gray-800/50 via-gray-700/30 to-gray-800/50 
                  text-white placeholder-gray-500 
                  focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                  transition-all duration-300 backdrop-blur-sm
                  group-hover:border-gray-500/70"
                placeholder="Enter your Faculty ID"
                required
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 hover:text-gray-300 transition-colors" />
                ) : (
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 hover:text-gray-300 transition-colors" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
              <div className="flex items-start gap-2 sm:gap-3">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-blue-300 font-medium mb-1">
                    Faculty Authorization Required
                  </p>
                  <p className="text-xs text-blue-400/80 leading-relaxed">
                    Only authorized faculty members can access this section. If you don't have a Faculty ID, please contact the administration.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 text-gray-300 bg-gradient-to-r from-gray-700/50 to-gray-600/50 
                hover:from-gray-600/60 hover:to-gray-500/60 rounded-xl font-medium 
                transition-all duration-300 hover:scale-[1.02] border border-gray-600/50 hover:border-gray-500/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !facultyId.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 
                hover:from-blue-600/30 hover:to-purple-600/30 disabled:from-gray-600/30 disabled:to-gray-700/30 
                text-white rounded-xl font-medium transition-all duration-300 
                flex items-center justify-center gap-2 hover:scale-[1.02] 
                border border-blue-500/50 hover:border-blue-400/50 disabled:border-gray-600/50
                disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Verifying...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Access Faculty Role</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Decorative Sparkles */}
        <div className="absolute top-4 right-4 opacity-30">
          <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export { FacultyRoleModal };
