import { useEffect, useState } from "react";
import socket from "../../utils/socket";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

const Chat = ({ currentUser, recipient }) => {
  const { user: clerkUser } = useUser();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (clerkUser) {
      fetchUser();
    }
  }, [clerkUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !recipient) return;
      try {
        const res = await axios.post(
          `http://localhost:3000/api/chat/${recipient._id}`,
          user._id
        );
        console.log("chat is", res.data);
        setChat(res.data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages();
  }, [user, recipient]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user/profile/${clerkUser.id}`
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const funct = async () => {
    await axios.post("http://localhost:3000/api/chat/send", {
      recipientId: recipient._id,
      content: message,
    });
  };

  useEffect(() => {
    if (recipient?._id) {
      socket.emit("join_room", recipient._id);
      funct();
    }
  }, [recipient]);

  const messageData = {
    sender: user?.fullName,
    content: message,
    recipientSocketId: recipient?._id,
    timestamp: new Date(),
  };

  return (
    <div>
      <div className="chat-window">
        {chat.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={messageData}>Send</button>
    </div>
  );
};

export default Chat;
