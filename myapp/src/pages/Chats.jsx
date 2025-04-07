import { useEffect, useState } from 'react';
import axios from 'axios';
import ChatWindow from './ChatWindow';
import { useUser } from '@clerk/clerk-react';

const ChatApp = () => {
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    if (clerkUser) fetchCurrentUser();
  }, [clerkUser]);

  const fetchCurrentUser = async () => {
    const res = await axios.get(`http://localhost:3000/api/user/profile/${clerkUser.id}`);
    setUser(res.data);
    fetchAllUsers(res.data._id);
  };

  const fetchAllUsers = async (currentUserId) => {
    const res = await axios.get('http://localhost:3000/api/user/getAllUsers');
    setUsers(res.data.filter((u) => u._id !== currentUserId));
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r p-4">
        <h2 className="text-xl mb-2">Chats</h2>
        {users.map((u) => (
          <div key={u._id} onClick={() => setRecipient(u)} className="cursor-pointer p-2 hover:bg-gray-100">
            {u.fullName}
          </div>
        ))}
      </div>

      <div className="w-2/3 p-4">
        {recipient ? (
          <ChatWindow user={user} recipient={recipient} />
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
