import axios from "axios";
import dayjs from "dayjs";
import EmojiPicker from "emoji-picker-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { BsFileEarmark, BsThreeDotsVertical, BsX } from "react-icons/bs";
import { FaMicrophone, FaRegPaperPlane, FaRegSmile } from "react-icons/fa";
import { Send, Smile, Paperclip, Mic, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";

const ChatWindow = ({ user, recipient }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showReactions, setShowReactions] = useState(null);
  const [reactions, setReactions] = useState({});
  const [showProfilePhotoModal, setShowProfilePhotoModal] = useState(false);

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

  const handleProfileClick = () => {
    if (recipient && recipient._id) {
      navigate('/NetworkProfile', { state: { userData: { userId: recipient._id } } });
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
      <div className="bg-[#000000] backdrop-blur-xl border-b border-gray-700/50 px-4 py-3 md:px-6 md:py-4 shadow-lg relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative group cursor-pointer" onClick={() => setShowProfilePhotoModal(true)}>
              <img
                src={recipient.profileImage || "default-user.jpg"}
                alt={recipient.fullName}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover ring-2 ring-blue-500/30 shadow-lg group-hover:ring-blue-500/60 transition-all duration-300 hover:scale-105"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 shadow-lg animate-pulse"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h2
                className="font-semibold text-white text-base md:text-lg truncate cursor-pointer hover:text-blue-400 transition-colors"
                onClick={handleProfileClick}
              >
                {recipient.fullName}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <button
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 group hover:scale-105 cursor-pointer"
              onClick={handleProfileClick}
              aria-label="View Profile"
            >
              <User className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Photo Modal */}
      {showProfilePhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowProfilePhotoModal(false)}>
          <div
            className="relative max-w-lg w-full mx-auto bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 rounded-3xl shadow-2xl border border-gray-700/50 flex flex-col items-center p-6 animate-fadeIn"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 bg-black/40 rounded-full cursor-pointer"
              onClick={() => setShowProfilePhotoModal(false)}
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <img
              src={recipient.profileImage || "default-user.jpg"}
              alt={recipient.fullName}
              className="w-48 h-48 md:w-64 md:h-64 rounded-2xl object-cover border-4 border-gray-900 shadow-2xl mx-auto"
              style={{ maxWidth: '90vw', maxHeight: '60vh' }}
            />
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-1">{recipient.fullName}</h3>
              <p className="text-sm text-gray-400">{recipient.designation || "Student"}</p>
            </div>
          </div>
        </div>
      )}

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

      {/* Chat Input */}
      <div className="p-3 md:p-4 bg-gradient-to-r from-gray-800/50 via-gray-700/30 to-gray-800/50 border-t border-gray-700/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 md:gap-3 bg-gray-800/50 rounded-2xl px-3 md:px-4 py-2 md:py-3 border border-gray-700/50 shadow-lg hover:border-gray-600/50 transition-all duration-300">
          <div className="relative" ref={emojiPickerRef}>
            <button
              className="text-gray-400 hover:text-blue-400 transition-all duration-300 p-1 md:p-2 hover:bg-white/10 rounded-xl hover:scale-105 cursor-pointer"
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

          <button className="text-gray-400 hover:text-blue-400 transition-all duration-300 p-1 md:p-2 hover:bg-white/10 rounded-xl hover:scale-105 cursor-pointer">
            <Paperclip className="w-5 h-5" />
          </button>

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
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 md:p-3 rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </motion.button>
          ) : null}
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
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;
