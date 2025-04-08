import { useEffect, useState, useRef, useMemo } from "react";
import socket from "../utils/socket";
import axios from "axios";
import dayjs from "dayjs";

const ChatWindow = ({ user, recipient }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(true);

  const roomId = useMemo(() => {
    return user && recipient ? [user._id, recipient._id].sort().join("_") : "";
  }, [user, recipient]);

  const scrollToBottom = (behavior = "auto") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (!user || !recipient) return;

    socket.emit("join_room", roomId);
    fetchMessages();

    const handleReceiveMessage = (data) => {
      console.log("Received message:", data);

      setChat((prev) => [...prev, data]);

      const container = chatContainerRef.current;
      if (container) {
        const isNearBottom =
          container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
          100;
        setShouldScroll(isNearBottom);
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [user, recipient, roomId]);

  useEffect(() => {
    if (shouldScroll) scrollToBottom("auto");
  }, [chat, shouldScroll]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/chat/chats/${recipient._id}?senderId=${user._id}`
      );
      setChat(res.data);
      setTimeout(() => scrollToBottom("auto"), 0);
    } catch (err) {
      console.error(
        "Error fetching messages:",
        err.response?.data || err.message
      );
    }
  };

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    setShouldScroll(isNearBottom);
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const msg = {
      sender: { _id: user._id, fullName: user.fullName },
      content: message,
      roomId,
      timestamp: new Date(),
    };

    socket.emit("send_message", msg);
    setChat((prev) => [...prev, msg]);
    setMessage("");
    setShouldScroll(true);

    try {
      await axios.post("http://localhost:3000/api/chat/chats", {
        userId: user._id,
        recipientId: recipient._id,
        content: message,
      });
    } catch (err) {
      console.error(
        "Error sending message:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center px-4 py-2 border-b bg-white">
        <img
          src={recipient.profileImage || "default-user.jpg"}
          alt={recipient.fullName}
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div>
          <h2 className="font-bold">{recipient.fullName}</h2>
          <p className="text-sm text-gray-500">
            {recipient.designation || "Student"}
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        {chat.map((msg, i) => {
          const isMe = msg.sender?._id === user._id;
          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-white ${
                  isMe ? "bg-blue-500" : "bg-gray-600"
                }`}
              >
                <p>{msg.content}</p>
                <p className="text-xs text-right text-gray-200">
                  {dayjs(msg.timestamp).format("hh:mm A")}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t flex items-center gap-2 bg-white">
        <input
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
