import { UserProfile } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const YourAccount = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen relative overflow-hidden flex flex-col transition-colors duration-300 ${
        isDarkMode ? "bg-[#070707]" : "bg-[#f5f5f5]"
      }`}
    >
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4790fd]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c76191]/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#27dc66]/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#ece239]/5 rounded-full blur-[80px]"></div>
      </div>

      {/* Header with Back Button */}
      <div className="relative z-10 p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a]/50 border border-[#4790fd]/20 text-[#f5f5f5] hover:bg-[#4790fd]/10 hover:border-[#4790fd]/40 transition-all duration-300 backdrop-blur-md group cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
      </div>

      {/* UserProfile Container */}
      <div className="flex-1 relative z-10 flex justify-center items-start pt-4 pb-12 px-4">
        <div className="w-full max-w-[1000px] rounded-3xl overflow-hidden shadow-2xl border border-[#4790fd]/20 bg-[#040404]/80 backdrop-blur-xl">
          <UserProfile
            appearance={{
              variables: {
                colorBackground: "#040404",
                colorText: "#f5f5f5",
                colorTextSecondary: "#a0a0a0",
                colorPrimary: "#4790fd",
                colorInputBackground: "#1a1a1a",
                colorInputText: "#ffffff",
                colorDanger: "#c76191",
                colorSuccess: "#27dc66",
                colorWarning: "#ece239",
                borderRadius: "0.75rem",
              },
              elements: {
                card: "bg-transparent shadow-none w-full",
                rootBox: "w-full h-full",
                scrollBox: "bg-transparent",
                navbar:
                  "bg-[#0a0a0a]/50 border-r border-[#4790fd]/10 hidden md:flex",
                navbarMobileMenuButton: "md:hidden text-[#f5f5f5]",
                navbarButton:
                  "text-[#a0a0a0] hover:bg-[#4790fd]/10 hover:text-[#4790fd]",
                headerTitle: "text-[#ece239] font-bold",
                headerSubtitle: "text-[#a0a0a0]",
                profileSectionTitleText: "text-[#4790fd] font-semibold",
                userPreviewMainIdentifier: "text-[#f5f5f5] font-bold",
                userPreviewSecondaryIdentifier: "text-[#a0a0a0]",
                accordionTriggerButton: "text-[#f5f5f5] hover:bg-[#4790fd]/5",
                formFieldLabel: "text-[#a0a0a0]",
                formFieldInput:
                  "bg-[#1a1a1a] border-[#4790fd]/20 text-[#f5f5f5] focus:border-[#4790fd]",
                footer: "bg-[#0a0a0a] border-t border-[#4790fd]/10",
                footerActionText: "text-[#a0a0a0]",
                footerActionLink: "text-[#4790fd] hover:text-[#4790fd]/80",
                avatarImageActionsUpload: "text-[#4790fd]",
              },
            }}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default YourAccount;
