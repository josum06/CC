import React from "react";

import NoticeCard from '../components/NoticeCard';

const Notice = () => {
  const notices = [
    {
      title: "Semester 6 Exam Notice",
      date: "March 22, 2025",
      postedBy: "Dr. Anil Kumar",
      profilePhoto: "https://images.unsplash.com/photo-1623880840102-7df0a9f3545b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1hbiUyMGluJTIwc3VpdHxlbnwwfHwwfHx8MA%3D%3D",
      role: "HOD, CSE",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" // PDF URL
    },
    {
      title: "Campus Placement Drive",
      date: "March 25, 2025",
      postedBy: "T&P Cell",
      profilePhoto: "https://img.freepik.com/premium-photo/businessman-point-finger-invisible-screen-pressing-digital-virtual-button-grey-wall_220507-670.jpg",
      role: "Training & Placement Officer",
      fileUrl: "https://via.placeholder.com/600" // Image URL
    },
    {
      title: "Campus Placement Drive",
      date: "March 25, 2025",
      postedBy: "T&P Cell",
      profilePhoto: "https://img.freepik.com/premium-photo/businessman-point-finger-invisible-screen-pressing-digital-virtual-button-grey-wall_220507-670.jpg",
      role: "Training & Placement Officer",
      fileUrl: "https://via.placeholder.com/600" // Image URL
    },
    {
      title: "Campus Placement Drive",
      date: "March 25, 2025",
      postedBy: "T&P Cell",
      profilePhoto: "https://img.freepik.com/premium-photo/businessman-point-finger-invisible-screen-pressing-digital-virtual-button-grey-wall_220507-670.jpg",
      role: "Training & Placement Officer",
      fileUrl: "https://via.placeholder.com/600" // Image URL
    },
    {
      title: "Campus Placement Drive",
      date: "March 25, 2025",
      postedBy: "T&P Cell",
      profilePhoto: "https://img.freepik.com/premium-photo/businessman-point-finger-invisible-screen-pressing-digital-virtual-button-grey-wall_220507-670.jpg",
      role: "Training & Placement Officer",
      fileUrl: "https://via.placeholder.com/600" // Image URL
    },
    {
      title: "Campus Placement Drive",
      date: "March 25, 2025",
      postedBy: "T&P Cell",
      profilePhoto: "https://img.freepik.com/premium-photo/businessman-point-finger-invisible-screen-pressing-digital-virtual-button-grey-wall_220507-670.jpg",
      role: "Training & Placement Officer",
      fileUrl: "https://via.placeholder.com/600" // Image URL
    },
    

    
  ];

  return (
    <div className="p-4 md:p-10  min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Notices</h1>
      <div className="grid gap-6">
        {notices.map((notice, index) => (
          <NoticeCard
            key={index}
            title={notice.title}
            date={notice.date}
            postedBy={notice.postedBy}
            profilePhoto={notice.profilePhoto}
            role={notice.role}
            fileUrl={notice.fileUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default Notice;
