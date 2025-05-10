import axios from "axios";
import dayjs from "dayjs";
import EmojiPicker from "emoji-picker-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { BsFileEarmark, BsThreeDotsVertical, BsX } from "react-icons/bs";
import { FaMicrophone, FaRegPaperPlane, FaRegSmile } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
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
      timestamp: new Date(),
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

  const getReactionEmoji = (reaction) => {
    const emojiMap = {
      like: "👍",
      love: "❤️",
      laugh: "😂",
      sad: "😢",
      angry: "😠",
      wow: "😮",
    };
    return emojiMap[reaction] || reaction;
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#008069] text-white shadow-md">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={recipient.profileImage || "default-user.jpg"}
              alt={recipient.fullName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white ring-offset-2 ring-offset-[#008069] cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setShowProfilePhoto(true)}
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="ml-3">
            <h2 className="font-semibold text-lg">{recipient.fullName}</h2>
            <p className="text-xs text-gray-200 flex items-center">
              {isTyping ? (
                <span className="text-gray-200">typing...</span>
              ) : (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  online
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <BsThreeDotsVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5] bg-opacity-50"
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                } group`}
              >
                <div className="relative max-w-[75%] md:max-w-[60%]">
                  <div
                    className={`relative px-4 py-2 rounded-lg ${
                      isMe
                        ? "bg-[#dcf8c6] text-gray-800 rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                    }`}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setShowReactions(messageId);
                    }}
                  >
                    {msg.file && (
                      <div className="mb-2 p-2 bg-black bg-opacity-10 rounded-lg flex items-center gap-2">
                        {msg.file.type && msg.file.type.startsWith("audio/") ? (
                          <div className="flex items-center gap-2 w-full">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <FaMicrophone className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                Voice Message
                              </p>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-blue-500 h-1.5 rounded-full"
                                  style={{ width: "70%" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <BsFileEarmark className="w-5 h-5 text-gray-600" />
                            <span className="text-sm truncate">
                              {msg.file.name}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                    <p className="text-sm md:text-base">{msg.content}</p>
                    <div className="flex items-center justify-end mt-1 gap-1">
                      <p
                        className={`text-xs ${
                          isMe ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        {dayjs(msg.timestamp).format("hh:mm A")}
                      </p>
                    </div>

                    {/* Message reactions */}
                    {messageReactions.length > 0 && (
                      <div className="absolute -top-3 right-0 flex items-center bg-white rounded-full shadow-md px-1 py-0.5">
                        {messageReactions.map((reaction, idx) => (
                          <span key={idx} className="text-xs">
                            {getReactionEmoji(reaction.reaction)}
                          </span>
                        ))}
                        {messageReactions.length > 1 && (
                          <span className="text-xs text-gray-500 ml-1">
                            {messageReactions.length}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Reaction menu */}
                    {showReactions === messageId && (
                      <div className="absolute -top-12 right-0 bg-white rounded-full shadow-lg p-1 flex items-center space-x-1 z-10">
                        {["like", "love", "laugh", "sad", "angry", "wow"].map(
                          (reaction) => (
                            <button
                              key={reaction}
                              className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
                              onClick={() =>
                                handleReaction(messageId, reaction)
                              }
                            >
                              {getReactionEmoji(reaction)}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
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
                <div className="relative">
                  <div className="h-24 bg-gradient-to-r from-[#008069] to-[#00a884]"></div>
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                      <img
                        src={recipient.profileImage || "default-user.jpg"}
                        alt={recipient.fullName}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  </div>
                </div>

                <div className="pt-16 pb-6 px-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {recipient.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {recipient.designation || "Student"}
                  </p>

                  <div className="mt-4 flex justify-center space-x-4">
                    <button className="flex flex-col items-center text-gray-600 hover:text-[#008069] transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs mt-1">Message</span>
                    </button>

                    <button className="flex flex-col items-center text-gray-600 hover:text-[#008069] transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs mt-1">Video</span>
                    </button>

                    <button className="flex flex-col items-center text-gray-600 hover:text-[#008069] transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs mt-1">Call</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200">
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      About
                    </h4>
                    <p className="text-sm text-gray-600">
                      {recipient.bio || "No bio available"}
                    </p>
                  </div>

                  <div className="p-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Contact Info
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm text-gray-800">
                            {recipient.email || "Not available"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm text-gray-800">
                            {recipient.phone || "Not available"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm text-gray-800">
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
      <div className="p-3 bg-[#f0f2f5] border-t border-gray-200">
        <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-sm">
          <div className="relative" ref={emojiPickerRef}>
            <button
              className="text-gray-500 hover:text-gray-700 transition-colors p-1"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <FaRegSmile className="w-5 h-5" />
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
            <button
              onClick={sendMessage}
              className="bg-[#008069] text-white p-2 rounded-full hover:bg-[#006d5a] transition-colors"
            >
              <FaRegPaperPlane className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
