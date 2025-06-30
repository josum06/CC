import axios from "axios";
import dayjs from "dayjs";
import EmojiPicker from "emoji-picker-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { BsFileEarmark, BsThreeDotsVertical, BsX } from "react-icons/bs";
import { FaMicrophone, FaRegPaperPlane, FaRegSmile } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { Send, Smile, Paperclip, Mic, MoreVertical, Phone, Video, Info } from "lucide-react";
import socket from "../utils/socket";

const ChatWindow = ({ user, recipient }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [showProfilePhoto, setShowProfilePhoto] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showReactions, setShowReactions] = useState(null);
  const [reactions, setReactions] = useState({});

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
      if (data.roomId !== roomId) return; // Ignore messages not in this room
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

    const handleReaction = (data) => {
      setReactions((prev) => {
        const messageReactions = prev[data.messageId] || [];
        const existingIndex = messageReactions.findIndex(
          (r) => r.userId === data.userId
        );

        if (existingIndex >= 0) {
          if (data.reaction === null) {
            // Remove reaction
            return {
              ...prev,
              [data.messageId]: messageReactions.filter(
                (_, i) => i !== existingIndex
              ),
            };
          } else {
            // Update reaction
            const updated = [...messageReactions];
            updated[existingIndex] = {
              userId: data.userId,
              reaction: data.reaction,
            };
            return { ...prev, [data.messageId]: updated };
          }
        } else {
          // Add new reaction
          return {
            ...prev,
            [data.messageId]: [
              ...messageReactions,
              { userId: data.userId, reaction: data.reaction },
            ],
          };
        }
      });
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("reaction", handleReaction);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("reaction", handleReaction);
    };
  }, [user, recipient, roomId]);

  useEffect(() => {
    if (shouldScroll) scrollToBottom("auto");
  }, [chat, shouldScroll]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleReaction = (messageId, reaction) => {
    socket.emit("reaction", {
      messageId,
      userId: user._id,
      reaction,
      roomId,
    });
    setShowReactions(null);
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const sendMessage = async () => {
    if (!message.trim() || !user || !recipient) return;

    const messageId = Date.now().toString();

    const msg = {
      _id: messageId,
      sender: { _id: user._id, fullName: user.fullName },
      content: message,
      roomId,
      timestamp: new Date()
    };

    socket.emit("send_message", msg);
    setChat((prev) => [...prev, msg]);
    setMessage("");
    setShouldScroll(true);

    try {
      await axios.post(`http://localhost:3000/api/chat/chats`, {
        recipientId: recipient._id,
        content: message,
        userId: user._id,
        roomId,
      });
    } catch (err) {
      console.error(
        "Error sending message:",
        err.response?.data || err.message
      );
    }
  };

  

  return (
    <div className="flex flex-col h-full bg-transparent relative">
      {/* Header */}
      <div className="bg-[#000000] backdrop-blur-xl border-b border-gray-700/50 px-4 py-3 md:px-6 md:py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative group cursor-pointer" onClick={() => setShowProfilePhoto(true)}>
              <img
                src={recipient.profileImage || "default-user.jpg"}
                alt={recipient.fullName}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-blue-500/30 shadow-lg group-hover:ring-blue-500/60 transition-all duration-300 hover:scale-105"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 shadow-lg animate-pulse"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-white text-base md:text-lg truncate">
                {recipient.fullName}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <button className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 group hover:scale-105">
              <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 custom-scrollbar"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        <AnimatePresence>
          {chat.map((msg, i) => {
            const isMe = msg.sender?._id === user._id;
            const messageId = msg._id || i;
            const messageReactions = reactions[messageId] || [];

            return (
              <motion.div
                key={messageId}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                } group`}
              >
                <div className="relative max-w-[75%] md:max-w-[60%] lg:max-w-[50%]">
                  <motion.div
                    className={`relative px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm ${
                      isMe
                        ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 rounded-br-md"
                        : "bg-gradient-to-br from-gray-800/80 to-gray-700/80 text-white border border-gray-600/50 rounded-bl-md"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setShowReactions(messageId);
                    }}
                  >
                   
                    <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                    <div className="flex items-center justify-end mt-2 gap-2">
                      <p className="text-xs text-gray-400">
                      {msg.createdAt ? dayjs( msg.createdAt).format("hh:mm A") : dayjs( msg.timestamp).format("hh:mm A")}
                      </p>
                    </div>

                </motion.div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Profile Photo Modal */}
      <AnimatePresence>
        {showProfilePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowProfilePhoto(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors p-2"
                onClick={() => setShowProfilePhoto(false)}
              >
                <IoClose className="w-6 h-6" />
              </button>
              <div className="bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50">
                <div className="relative">
                  <div className="h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                      <img
                        src={recipient.profileImage || "default-user.jpg"}
                        alt={recipient.fullName}
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-900 shadow-2xl"
                      />
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 shadow-lg"></div>
                    </div>
                  </div>
                </div>

                <div className="pt-16 pb-6 px-6 text-center">
                  <h3 className="text-xl font-semibold text-white">
                    {recipient.fullName}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {recipient.designation || "Student"}
                  </p>

                  <div className="mt-6 flex justify-center space-x-6">
                    <button className="flex flex-col items-center text-gray-400 hover:text-blue-400 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center mb-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-xs">Message</span>
                    </button>

                    <button className="flex flex-col items-center text-gray-400 hover:text-blue-400 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center mb-1">
                        <Video className="w-5 h-5" />
                      </div>
                      <span className="text-xs">Video</span>
                    </button>

                    <button className="flex flex-col items-center text-gray-400 hover:text-blue-400 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center mb-1">
                        <Phone className="w-5 h-5" />
                      </div>
                      <span className="text-xs">Call</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-700/50">
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">About</h4>
                    <p className="text-sm text-gray-400">
                      {recipient.bio || "No bio available"}
                    </p>
                  </div>

                  <div className="p-4 border-t border-gray-700/50">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Contact Info</h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm text-gray-300">
                            {recipient.email || "Not available"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center mr-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm text-gray-300">
                            {recipient.phone || "Not available"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm text-gray-300">
                            {recipient.location || "Not available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Input */}
      <div className="p-3 md:p-4 bg-gradient-to-r from-gray-800/50 via-gray-700/30 to-gray-800/50 border-t border-gray-700/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 md:gap-3 bg-gray-800/50 rounded-2xl px-3 md:px-4 py-2 md:py-3 border border-gray-700/50 shadow-lg hover:border-gray-600/50 transition-all duration-300">
          <div className="relative" ref={emojiPickerRef}>
            <button
              className="text-gray-400 hover:text-blue-400 transition-all duration-300 p-1 md:p-2 hover:bg-white/10 rounded-xl hover:scale-105"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="w-5 h-5" />
            </button>
            {showEmojiPicker && (
              <motion.div 
                className="absolute bottom-full left-0 mb-2 z-50"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
                  width={300}
                  height={400}
                  theme="dark"
                  searchPlaceholder="Search emoji..."
                />
              </motion.div>
            )}
          </div>

          <input
            className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-gray-400 text-sm md:text-base"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          {message.trim() && (
            <motion.button
              onClick={sendMessage}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 md:p-3 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
          )
          }
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.5));
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgba(59, 130, 246, 0.7), rgba(147, 51, 234, 0.7));
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;
