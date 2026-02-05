import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { ArrowLeft, Bell, Mail, Phone, MessageCircle, Building2, MapPin, Clock, User, Users, BookOpen, GraduationCap } from "lucide-react";

const HelpSupport = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("contact");

  const contactOptions = [
    {
      icon: Mail,
      title: "General Support",
      description: "For general inquiries and account issues",
      contact: "support@campusconnect.edu",
      contactDetails: "Response time: Within 24 hours",
      color: "blue",
    },
    {
      icon: Phone,
      title: "Technical Support",
      description: "For technical issues and bugs",
      contact: "+1 (555) 123-4567",
      contactDetails: "Hours: Mon-Fri, 9AM-6PM IST",
      color: "green",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      contact: "Available 9 AM - 6 PM (IST)",
      contactDetails: "Avg. response time: 2-5 minutes",
      color: "purple",
    },
  ];

  const faqs = [
    {
      question: "How do I connect with classmates?",
      answer: "Go to the Network section and use the search functionality to find and send connection requests to your classmates.",
    },
    {
      question: "How to create a study group?",
      answer: "Navigate to the Groups section and click on 'Create Group' to start your own study group.",
    },
    {
      question: "How to post events or notices?",
      answer: "Faculty members can post events and notices in the Faculty Post section after verifying their role.",
    },
    {
      question: "How do I update my profile?",
      answer: "Visit your Account Dashboard to update your profile information and preferences.",
    },
    {
      question: "What are the system requirements?",
      answer: "Campus Connect works best on modern browsers with JavaScript enabled. Minimum requirement is Chrome 60+, Firefox 55+, Safari 12+, or Edge 79+.",
    },
    {
      question: "How to update my profile picture?",
      answer: "Go to your Account Dashboard and click on 'Change Profile Picture' to upload a new image.",
    },
    {
      question: "How to report inappropriate content?",
      answer: "Click the 'Report' button on any post or comment to flag it for review by our moderation team.",
    },
    {
      question: "How to reset my notification preferences?",
      answer: "Visit the Settings section in your Account Dashboard to customize your notification settings.",
    },
    {
      question: "Can I use the mobile app?",
      answer: "Yes, Campus Connect is fully responsive and works great on mobile devices through your browser.",
    },
    {
      question: "How do I join a study group?",
      answer: "Browse the Groups section to find study groups related to your courses and click 'Join Group'.",
    },
  ];

  const quickHelpSteps = [
    {
      step: 1,
      title: "Forgot Password?",
      description: "Click 'Forgot Password' on the login screen to reset your password via email.",
    },
    {
      step: 2,
      title: "Update Profile",
      description: "Visit Account Dashboard to update your personal information and preferences.",
    },
    {
      step: 3,
      title: "Notification Issues",
      description: "Check your email settings in Account Dashboard to manage notification preferences.",
    },
    {
      step: 4,
      title: "Join Groups",
      description: "Browse the Network section to find and join study groups related to your courses.",
    },
    {
      step: 5,
      title: "Find Events",
      description: "Check the Events section to discover upcoming campus events and activities.",
    },
  ];

  const collegeDetails = [
    {
      icon: Building2,
      title: "Institution Details",
      info: [
        { label: "Name", value: "Campus Connect University" },
        { label: "Established", value: "2010" },
        { label: "Type", value: "Private University" },
        { label: "Accreditation", value: "NAAC A+ Grade" },
      ],
      color: "emerald",
    },
    {
      icon: MapPin,
      title: "Address",
      info: [
        { 
          label: "Main Campus", 
          value: "123 Education Street, Knowledge Park\nNew Delhi, Delhi 110001\nIndia" 
        },
        { 
          label: "City Campus", 
          value: "456 Academic Avenue, University District\nNew Delhi, Delhi 110002\nIndia" 
        },
      ],
      color: "blue",
    },
    {
      icon: Phone,
      title: "Contact Information",
      info: [
        { label: "Phone", value: "+91 11 1234 5678" },
        { label: "Admissions", value: "+91 11 1234 5679" },
        { label: "Emergency", value: "+91 11 1234 5680" },
      ],
      color: "rose",
    },
    {
      icon: BookOpen,
      title: "Online Resources",
      info: [
        { label: "Website", value: "www.campusconnect.edu" },
        { label: "Student Portal", value: "portal.campusconnect.edu" },
        { label: "Library", value: "library.campusconnect.edu" },
      ],
      color: "amber",
    },
  ];

  const officeHours = [
    { day: "Monday-Friday", hours: "9:00 AM - 5:00 PM", status: "open" },
    { day: "Saturday", hours: "10:00 AM - 2:00 PM", status: "limited" },
    { day: "Sunday", hours: "Closed", status: "closed" },
    { day: "Holidays", hours: "Closed", status: "closed" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#070707] py-6 px-3 sm:py-8 sm:px-4 md:px-6 relative overflow-hidden transition-colors duration-300">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4790fd]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c76191]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#27dc66]/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-[#a0a0a0] hover:text-[#4790fd] dark:hover:text-[#4790fd] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#4790fd]/15 to-[#27dc66]/15 border border-[#4790fd]/20">
              <Bell className="w-8 h-8 text-[#4790fd]" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-[#f5f5f5]">
                Help & Support
              </h1>
              <p className="text-gray-600 dark:text-[#a0a0a0] mt-1">
                Get assistance and information about our platform
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white/50 dark:bg-[#040404]/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 p-2">
          <button
            onClick={() => setActiveTab("contact")}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              activeTab === "contact"
                ? "bg-[#4790fd]/20 text-[#4790fd] border border-[#4790fd]/30"
                : "text-gray-600 dark:text-[#a0a0a0] hover:bg-white/50 dark:hover:bg-[#040404]/70"
            }`}
          >
            Contact Us
          </button>
          <button
            onClick={() => setActiveTab("faqs")}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              activeTab === "faqs"
                ? "bg-[#27dc66]/20 text-[#27dc66] border border-[#27dc66]/30"
                : "text-gray-600 dark:text-[#a0a0a0] hover:bg-white/50 dark:hover:bg-[#040404]/70"
            }`}
          >
            FAQs
          </button>
          <button
            onClick={() => setActiveTab("quick-help")}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              activeTab === "quick-help"
                ? "bg-[#c76191]/20 text-[#c76191] border border-[#c76191]/30"
                : "text-gray-600 dark:text-[#a0a0a0] hover:bg-white/50 dark:hover:bg-[#040404]/70"
            }`}
          >
            Quick Help
          </button>
          <button
            onClick={() => setActiveTab("college")}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              activeTab === "college"
                ? "bg-[#ece239]/20 text-[#ece239] border border-[#ece239]/30"
                : "text-gray-600 dark:text-[#a0a0a0] hover:bg-white/50 dark:hover:bg-[#040404]/70"
            }`}
          >
            College Info
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "contact" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Contact Options */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
              {contactOptions.map((option, index) => {
                const IconComponent = option.icon;
                const colorClasses = {
                  blue: "text-blue-500 bg-blue-500/10",
                  green: "text-green-500 bg-green-500/10",
                  purple: "text-purple-500 bg-purple-500/10",
                };
                
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 dark:bg-[#040404]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 hover:bg-white/100 dark:hover:bg-[#040404]/100 transition-all duration-300 cursor-pointer"
                  >
                    <div className={`p-3 rounded-xl ${colorClasses[option.color]}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{option.title}</h3>
                      <p className="text-gray-600 dark:text-[#a0a0a0] text-sm mb-1">{option.description}</p>
                      <p className="text-gray-900 dark:text-white font-medium">{option.contact}</p>
                      <p className="text-xs text-gray-500 dark:text-[#808080]">{option.contactDetails}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Support Team */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Team</h2>
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-[#070707]/50 dark:to-[#070707]/70 border border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      AS
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">Anugrah Singh</p>
                      <p className="text-gray-600 dark:text-[#a0a0a0]">Frontend Developer</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-gray-600 dark:text-[#a0a0a0]">
                      <Mail className="w-4 h-4" />
                      anugrah.singh@campusconnect.edu
                    </p>
                    <p className="flex items-center gap-2 text-gray-600 dark:text-[#a0a0a0]">
                      <GraduationCap className="w-4 h-4" />
                      LinkedIn: /in/anugrah-singh
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-[#070707]/50 dark:to-[#070707]/70 border border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      VS
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">Vaibhav Sinha</p>
                      <p className="text-gray-600 dark:text-[#a0a0a0]">Backend Developer</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-gray-600 dark:text-[#a0a0a0]">
                      <Mail className="w-4 h-4" />
                      vaibhav.sinha@campusconnect.edu
                    </p>
                    <p className="flex items-center gap-2 text-gray-600 dark:text-[#a0a0a0]">
                      <GraduationCap className="w-4 h-4" />
                      LinkedIn: /in/vaibhav-sinha
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-[#070707]/50 dark:to-[#070707]/70 border border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      SJ
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">Sumit Joshi</p>
                      <p className="text-gray-600 dark:text-[#a0a0a0]">Backend Developer</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-gray-600 dark:text-[#a0a0a0]">
                      <Mail className="w-4 h-4" />
                      sumit.joshi@campusconnect.edu
                    </p>
                    <p className="flex items-center gap-2 text-gray-600 dark:text-[#a0a0a0]">
                      <GraduationCap className="w-4 h-4" />
                      LinkedIn: /in/sumit-joshi
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-[#070707]/50 dark:to-[#070707]/70 border border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      SJ
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">Sumit Joshi</p>
                      <p className="text-gray-600 dark:text-[#a0a0a0]">Backend Developer</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-gray-600 dark:text-[#a0a0a0]">
                      <Mail className="w-4 h-4" />
                      sumit.joshi@campusconnect.edu
                    </p>
                    <p className="flex items-center gap-2 text-gray-600 dark:text-[#a0a0a0]">
                      <GraduationCap className="w-4 h-4" />
                      LinkedIn: /in/sumit-joshi
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "faqs" && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-white/80 dark:bg-[#040404]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-[#a0a0a0]">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "quick-help" && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Help Steps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {quickHelpSteps.map((step) => (
                <div
                  key={step.step}
                  className="p-6 rounded-2xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-[#070707]/50 dark:to-[#070707]/70 border border-gray-200 dark:border-white/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-[#4790fd] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-[#a0a0a0] text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "college" && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">College Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {collegeDetails.map((detail, index) => {
                const IconComponent = detail.icon;
                const colorClasses = {
                  emerald: "text-emerald-500 bg-emerald-500/10",
                  blue: "text-blue-500 bg-blue-500/10",
                  rose: "text-rose-500 bg-rose-500/10",
                  amber: "text-amber-500 bg-amber-500/10",
                };

                return (
                  <div
                    key={index}
                    className="p-6 rounded-2xl bg-white/80 dark:bg-[#040404]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-xl ${colorClasses[detail.color]}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{detail.title}</h3>
                    </div>
                    <div className="space-y-3">
                      {detail.info.map((item, idx) => (
                        <div key={idx}>
                          <p className="text-xs text-gray-500 dark:text-[#a0a0a0] uppercase tracking-wide mb-1">{item.label}</p>
                          <p className="text-gray-900 dark:text-white font-medium whitespace-pre-line">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Campus Gallery */}
            <div className="mt-6 p-6 rounded-2xl bg-white/80 dark:bg-[#040404]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl text-emerald-500 bg-emerald-500/10">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Campus Gallery</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-[#070707]/30">
                  <div className="text-center p-2">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-500 dark:text-[#a0a0a0] text-center">Campus View</p>
                  </div>
                </div>
                <div className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-[#070707]/30">
                  <div className="text-center p-2">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-500 dark:text-[#a0a0a0] text-center">Library</p>
                  </div>
                </div>
                <div className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-[#070707]/30">
                  <div className="text-center p-2">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-500 dark:text-[#a0a0a0] text-center">Auditorium</p>
                  </div>
                </div>
                <div className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-[#070707]/30">
                  <div className="text-center p-2">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-gray-500 dark:text-[#a0a0a0] text-center">Sports</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="mt-6 p-6 rounded-2xl bg-white/80 dark:bg-[#040404]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl text-blue-500 bg-blue-500/10">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Office Hours</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {officeHours.map((hour, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl text-center ${
                      hour.status === "open"
                        ? "bg-green-50/80 dark:bg-green-900/20 border border-green-200/50 dark:border-green-500/20"
                        : hour.status === "limited"
                        ? "bg-yellow-50/80 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-500/20"
                        : "bg-gray-50/80 dark:bg-gray-900/20 border border-gray-200/50 dark:border-gray-500/20"
                    }`}
                  >
                    <p className="text-xs text-gray-500 dark:text-[#a0a0a0] uppercase tracking-wide mb-1">{hour.day}</p>
                    <p className="text-gray-900 dark:text-white font-medium">{hour.hours}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200 dark:border-white/10">
          <p className="text-gray-500 dark:text-[#a0a0a0]">
            Need more help? Contact us anytime and we'll assist you promptly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;