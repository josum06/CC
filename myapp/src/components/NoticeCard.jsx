import { useUser } from "@clerk/clerk-react";
import React, { useState } from "react";

const NoticeCard = ({ title, date, postedBy, profilePhoto, role, fileUrl }) => {
  const {user} = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Notice Card */}
      <div
        className="bg-white shadow-lg rounded-2xl p-5 border border-gray-200 hover:shadow-xl transition duration-300 
                    flex flex-col md:flex-row justify-between items-center md:items-start gap-4"
      >
        {/* Left Section */}
        <div className="flex flex-col justify-center text-center md:text-left">
          <h2
            className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer"
            onClick={handleOpenModal}
          >
            {title}
          </h2>
          <p className="text-sm text-gray-500">{date}</p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
         
          <div className="flex flex-col text-right md:text-right">
            <p className="text-sm font-medium text-gray-700">{postedBy}</p>
            <p className="text-xs text-gray-500">{role}</p>
          </div>
          <img
            src={profilePhoto}
            alt="Profile"
            className="w-12 h-12 md:w-11 md:h-11 lg:w-12 lg:h-12 xl:w-16 xl:h-16 rounded-full object-cover border border-gray-300"
          />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg p-6 w-[90%] md:w-[70%] lg:w-[50%] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                className="text-gray-500 hover:text-red-500"
                onClick={handleCloseModal}
              >
                ✖
              </button>
            </div>

            {/* PDF or Image */}
            {fileUrl?.endsWith(".pdf") ? (
              <iframe
                src={fileUrl}
                className="w-full h-[60vh] border rounded"
                title="Notice PDF"
              />
            ) : (
              <img
                src={fileUrl}
                alt="Notice"
                className="w-full h-auto rounded-lg"
              />
            )}

            {/* Download Button */}
            <div className="mt-4 text-right">
              <a
                href={fileUrl}
                download
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NoticeCard;
