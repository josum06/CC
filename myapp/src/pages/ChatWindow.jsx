import { useEffect, useState } from 'react';
import socket from '../utils/socket';
import axios from 'axios';

const ChatWindow = ({ user, recipient }) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    if (!user || !recipient) return;
    socket.emit('join_room', recipient._id);
    fetchMessages();

    socket.on('receive_message', (data) => setChat((prev) => [...prev, data]));
    return () => socket.off('receive_message');
  }, [recipient]);

  const fetchMessages = async () => {
    try {
      console.log("Fetching messages for recipient:", recipient._id, "and sender:", user._id);
      const res = await axios.get(`http://localhost:3000/api/chat/chats/${recipient._id}?senderId=${user._id}`);
      console.log("Fetched messages:", res.data);
      setChat(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err.response?.data || err.message);
    }
  };
  

  const sendMessage = async () => {
    const msg = {
      sender: user.fullName,
      content: message,
      recipientSocketId: recipient._id,
      timestamp: new Date(),
    };
    socket.emit('send_message', msg);
    setChat((prev) => [...prev, msg]);
    setMessage('');
    await axios.post('http://localhost:3000/api/chat/chats', {
      userId: user._id,
      recipientId: recipient._id,
      content: message,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-2">
        {chat.map((msg, i) => (
          <div key={i} className="mb-1">
            <b>{msg.sender.fullName}:</b> {msg.content}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border p-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4">Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
