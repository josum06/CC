import { useEffect, useState } from "react";
import axios from "axios";
import ChatWindow from "./ChatWindow";
import { useUser } from "@clerk/clerk-react";

const ChatApp = () => {
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    if (clerkUser) fetchCurrentUser();
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/3 border-r bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Chats</h2>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {users.map((u) => (
            <div
              key={u._id}
              onClick={() => setRecipient(u)}
              className={`flex items-center p-3 cursor-pointer transition-all hover:bg-gray-100 ${
                recipient?._id === u._id ? "bg-gray-200" : ""
              }`}
            >
              <img
                src={u.profileImage || "default-user.jpg"}
                alt="user"
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <p className="font-medium">{u.fullName}</p>
                <p className="text-sm text-gray-500">
                  {u.designation?.slice(0, 1).toUpperCase() +
                    u.designation?.slice(1) || "Student"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-2/3 flex flex-col">
        {recipient ? (
          <ChatWindow user={user} recipient={recipient} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
