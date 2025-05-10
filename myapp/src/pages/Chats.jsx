import { useEffect, useState } from "react";
import axios from "axios";
import ChatWindow from "./ChatWindow";
import { useUser } from "@clerk/clerk-react";

const ChatApp = () => {
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [recipient, setRecipient] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (clerkUser) fetchCurrentUser();

    // Handle responsive behavior
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clerkUser]);

  const fetchCurrentUser = async () => {
    const res = await axios.get(
      `http://localhost:3000/api/user/profile/${clerkUser.id}`
    );
    setUser(res.data);
    fetchAllUsers(res.data._id);
  };

  const fetchAllUsers = async (currentUserId) => {
    const res = await axios.get("http://localhost:3000/api/user/getAllUsers");
    setUsers(res.data.filter((u) => u._id !== currentUserId));
  };

  const handleUserSelect = (selectedUser) => {
    setRecipient(selectedUser);
    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleBackToContacts = () => {
    setShowChat(false);
  };

  return (
    <div className="flex h-screen bg-[#f0f2f5]">
      {/* Sidebar - Hidden on mobile when chat is open */}
      <div
        className={`${
          isMobile && showChat ? "hidden" : "block"
        } w-full md:w-1/3 lg:w-1/4 border-r bg-white flex flex-col`}
      >
        {/* Header */}

        <div className="p-4 bg-[#008069] text-white">
          <div className="flex items-center">
            <img
              src={user?.profileImage || "default-user.jpg"}
              alt="user"
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <h2 className="text-xl font-semibold">Chats</h2>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 bg-white">
          <div className="relative">
            <input
              type="text"
              placeholder="Search or start new chat"
              className="w-full p-2 pl-10 rounded-lg bg-[#f0f2f5] focus:outline-none"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-3 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {users.map((u) => (
            <div
              key={u._id}
              onClick={() => handleUserSelect(u)}
              className={`flex items-center p-3 cursor-pointer transition-all hover:bg-[#f0f2f5] ${
                recipient?._id === u._id ? "bg-[#f0f2f5]" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={u.profileImage || "default-user.jpg"}
                  alt="user"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-800">{u.fullName}</p>
                  <p className="text-xs text-gray-500">12:30 PM</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 truncate max-w-[150px]">
                    {u.designation?.slice(0, 1).toUpperCase() +
                      u.designation?.slice(1) || "Student"}
                  </p>
                  {/* <div className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    2
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`${
          isMobile && !showChat ? "hidden" : "block"
        } w-full md:w-2/3 lg:w-3/4 flex flex-col bg-[#f0f2f5]`}
      >
        {recipient ? (
          <>
            {/* Mobile back button */}
            {isMobile && (
              <div className="md:hidden p-3 bg-[#008069] text-white flex items-center">
                <button onClick={handleBackToContacts} className="mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div className="flex items-center">
                  <img
                    src={recipient.profileImage || "default-user.jpg"}
                    alt="recipient"
                    className="w-8 h-8 rounded-full object-cover mr-2"
                  />
                  <div>
                    <p className="font-medium">{recipient.fullName}</p>
                    <p className="text-xs text-gray-200">online</p>
                  </div>
                </div>
              </div>
            )}
            <ChatWindow user={user} recipient={recipient} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-[#f0f2f5]">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-[#008069] mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="text-xl font-semibold mb-2">
                Welcome to Campus Connect
              </h3>
              <p className="mb-4">
                Select a contact from the list to start chatting
              </p>
              <p className="text-sm text-gray-400">
                Your messages are end-to-end encrypted
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
