import React, { useState } from "react";

const NoticeCard = ({ date, category, title, description, author, pdfLink }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = () => {
    // Trigger PDF download
    const link = document.createElement('a');
    link.href = pdfLink;
    link.download = title + ".pdf";
    link.click();
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="max-w-xs w-full bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-center justify-between">
        <span className="text-sm font-light text-gray-600 dark:text-gray-400">{date}</span>
        <span className="px-3 py-1 text-sm font-semibold text-blue-600 border border-blue-600 rounded-lg cursor-pointer hover:bg-blue-600 hover:text-white transition-colors">
          {category}
        </span>
      </div>

      <div className="mt-4">
        <a href="#" className="text-2xl font-semibold text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 transition-all duration-200 hover:underline">
          {title}
        </a>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={toggleModal}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          View Notice
        </button>

        <button
          onClick={handleDownload}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Download PDF
        </button>

        <div className="flex items-center">
          <img
            className="object-cover w-10 h-10 rounded-full"
            src="https://images.unsplash.com/photo-1502980426475-b83966705988?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=40&q=80"
            alt="author-avatar"
          />
          <span className="font-semibold text-gray-700 dark:text-gray-200">{author}</span>
        </div>
      </div>

      {/* Modal Window */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-11/12 sm:w-1/2 md:w-1/3">
            <iframe
              src={pdfLink}
              width="100%"
              height="500px"
              title="Notice PDF"
            ></iframe>
            <button
              onClick={toggleModal}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeCard;
