import { useEffect, useState, useRef, useMemo } from "react";
import socket from "../utils/socket";
import axios from "axios";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { IoSend } from "react-icons/io5";
import { BsEmojiSmile, BsFileEarmark, BsX } from "react-icons/bs";
import { IoMdAttach } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";

const ChatWindow = ({ user, recipient }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showProfilePhoto, setShowProfilePhoto] = useState(false);

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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendMessage = async () => {
    if ((!message.trim() && !selectedFile) || !user || !recipient) return;

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("recipientId", recipient._id);
    formData.append("content", message);
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    const msg = {
      sender: { _id: user._id, fullName: user.fullName },
      content: message,
      roomId,
      timestamp: new Date(),
      file: selectedFile ? {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size
      } : null
    };

    socket.emit("send_message", msg);
    setChat((prev) => [...prev, msg]);
    setMessage("");
    setSelectedFile(null);
    setShouldScroll(true);

    try {
      await axios.post("http://localhost:3000/api/chat/chats", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      console.error("Error sending message:", err.response?.data || err.message);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-6 py-4 border-b bg-white shadow-sm">
        <div className="relative">
          <img
            src={recipient.profileImage || "default-user.jpg"}
            alt={recipient.fullName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setShowProfilePhoto(true)}
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="ml-4">
          <h2 className="font-semibold text-lg text-gray-800">{recipient.fullName}</h2>
          <p className="text-sm text-gray-500 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            {recipient.designation || "Student"}
          </p>
        </div>
      </div>

      {/* Profile Photo Modal */}
      <AnimatePresence>
        {showProfilePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setShowProfilePhoto(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                onClick={() => setShowProfilePhoto(false)}
              >
                <IoClose className="w-6 h-6" />
              </button>
              <div className="bg-white rounded-lg overflow-hidden shadow-xl">
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-semibold text-gray-800 text-center">{recipient.fullName}</h3>
                  <p className="text-sm text-gray-500 text-center">{recipient.designation || "Student"}</p>
                </div>
                <img
                  src={recipient.profileImage || "default-user.jpg"}
                  alt={recipient.fullName}
                  className="w-full h-auto object-contain max-h-[400px]"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Messages */}
      <div
        className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        <AnimatePresence>
          {chat.map((msg, i) => {
            const isMe = msg.sender?._id === user._id;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`group relative max-w-[70%] md:max-w-[60%] px-4 py-2 rounded-2xl ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow-md"
                  }`}
                >
                  {msg.file && (
                    <div className="mb-2 p-2 bg-opacity-20 bg-black rounded-lg flex items-center gap-2">
                      <BsFileEarmark className="w-5 h-5" />
                      <span className="text-sm truncate">{msg.file.name}</span>
                    </div>
                  )}
                  <p className="text-sm md:text-base">{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMe ? "text-blue-100" : "text-gray-500"}`}>
                    {dayjs(msg.timestamp).format("hh:mm A")}
                  </p>
                  {isMe && (
                    <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-0 h-0 
                      border-t-8 border-t-transparent border-l-8 border-l-blue-600 border-b-8 border-b-transparent">
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t bg-white relative">
        {selectedFile && (
          <div className="mb-2 p-2 bg-gray-100 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BsFileEarmark className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600 truncate">{selectedFile.name}</span>
            </div>
            <button
              onClick={removeSelectedFile}
              className="text-gray-500 hover:text-gray-700"
            >
              <BsX className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
          <div className="relative items-center flex" ref={emojiPickerRef}>
            <button 
              className="text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <BsEmojiSmile className="w-6 h-6" />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 z-50">
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  width={300}
                  height={400}
                  theme="light"
                  searchPlaceholder="Search emoji..."
                />
              </div>
            )}
          </div>
          <input
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-500"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <IoMdAttach className="w-6 h-6" />
          </button>
          <button
            onClick={sendMessage}
            disabled={!message.trim() && !selectedFile}
            className={`p-2 rounded-full transition-all duration-200 ${
              message.trim() || selectedFile
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <IoSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
