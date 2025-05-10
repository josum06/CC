import React, { useState, useEffect, useRef, useCallback } from "react";
import { format } from "date-fns";
import ChatHeader from "../../components/ChatHeader";
import ChatList from "../../components/ChatList";
import MessageList from "../../components/MessageList";
import MessageInput from "../../components/MessageInput";
import WelcomeScreen from "../../components/WelcomeScreen";
import MediaGallery from "../../components/MediaGallery";
import GroupInfoModal from "../../components/GroupInfoModal";
import CreateGroupModal from "../../components/CreateGroupModal";
import MessageSearch from "../../components/MessageSearch";
import RemoveMemberModal from "../../components/RemoveMemberModal";
import ChatListHeader from "../../components/ChatListHeader";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

function Chats() {
  const { user } = useUser();
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // States for media handling
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [recipients, setRecipients] = useState(null);

  // Add state for mobile view
  const [showChatList, setShowChatList] = useState(true);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // States for file upload
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getAllUsers"
      );
      console.log("All users:", response.data);

      response.data = response.data.filter(
        (user1) => user1.clerkId !== user.id
      );
      console.log("Filtered users:", response.data);
      setRecipients(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Add contacts list for adding to groups
  const [contacts] = useState([
    {
      id: 3,
      name: "Alice Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      online: true,
    },
    {
      id: 4,
      name: "Bob Wilson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      online: false,
    },
    // Add more contacts as needed
  ]);

  // Modify the chats state to include group chats
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Hey, how are you?",
      time: "10:30 AM",
      unread: 2,
      online: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      messages: [
        { id: 1, text: "Hey there!", sender: "them", time: "10:25 AM" },
        { id: 2, text: "How are you?", sender: "them", time: "10:25 AM" },
        { id: 3, text: "I'm good, thanks!", sender: "me", time: "10:30 AM" },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      lastMessage: "See you tomorrow!",
      time: "9:45 AM",
      unread: 0,
      online: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      messages: [
        {
          id: 1,
          text: "Are we meeting tomorrow?",
          sender: "me",
          time: "9:40 AM",
        },
        {
          id: 2,
          text: "Yes, see you tomorrow!",
          sender: "them",
          time: "9:45 AM",
        },
      ],
    },
    {
      id: 3,
      name: "Project Team",
      isGroup: true,
      lastMessage: "Meeting at 3 PM",
      time: "11:30 AM",
      unread: 5,
      online: true,
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=PT",
      members: [
        { id: 1, name: "John Doe", role: "admin" },
        { id: 2, name: "Jane Smith", role: "member" },
        { id: 3, name: "Alice Johnson", role: "member" },
      ],
      messages: [
        { id: 1, text: "Hi team!", sender: "John Doe", time: "11:25 AM" },
        {
          id: 2,
          text: "Meeting at 3 PM",
          sender: "Jane Smith",
          time: "11:30 AM",
        },
      ],
    },
  ]);

  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  // Add these new states after existing states
  const [showReplyTo, setShowReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [showEmojiReactionPicker, setShowEmojiReactionPicker] = useState(null);
  const [starredMessages, setStarredMessages] = useState([]);
  const [showSearchMessages, setShowSearchMessages] = useState(false);
  const [messageSearchQuery, setMessageSearchQuery] = useState("");

  // Add these new states
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [removingMember, setRemovingMember] = useState(null);

  // Add these new states after existing states
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [mediaFilter, setMediaFilter] = useState("all"); // 'all', 'images', 'videos', 'documents'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  // Typing indicator logic
  const handleTyping = useCallback(() => {
    // Emit typing event to backend
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      // Emit stopped typing event to backend
    }, 1000);
  }, []);

  // File handling functions
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileSend = async () => {
    if (selectedFile) {
      // Here you would implement file upload logic
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        // Simulate file upload
        console.log("Uploading file:", selectedFile.name);
        // await uploadFile(formData);

        const newMessage = {
          id: Date.now(),
          sender: "me",
          time: format(new Date(), "h:mm a"),
          type: selectedFile.type.startsWith("image/") ? "image" : "file",
          content: selectedFile.type.startsWith("image/")
            ? previewUrl
            : selectedFile.name,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
        };

        addNewMessage(newMessage);
        setSelectedFile(null);
        setPreviewUrl(null);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  // Message handling
  const addNewMessage = (newMessage) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage:
                newMessage.type === "text"
                  ? newMessage.text
                  : `Sent ${newMessage.type}`,
              time: format(new Date(), "h:mm a"),
            }
          : chat
      )
    );
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() || selectedFile) {
      if (selectedFile) {
        handleFileSend();
      }

      if (message.trim()) {
        const newMessage = {
          id: Date.now(),
          type: "text",
          text: message,
          sender: "me",
          time: format(new Date(), "h:mm a"),
          status: "sending", // Can be: sending, sent, delivered, read
        };

        addNewMessage(newMessage);
        setMessage("");
        // Emit message to backend
      }
    }
  };

  // Message status update simulation
  useEffect(() => {
    const updateMessageStatus = (messageId, status) => {
      setChats((prevChats) =>
        prevChats.map((chat) => ({
          ...chat,
          messages: chat.messages.map((msg) =>
            msg.id === messageId ? { ...msg, status } : msg
          ),
        }))
      );
    };

    // Simulate message status updates
    const simulateMessageFlow = (messageId) => {
      setTimeout(() => updateMessageStatus(messageId, "sent"), 1000);
      setTimeout(() => updateMessageStatus(messageId, "delivered"), 2000);
      setTimeout(() => updateMessageStatus(messageId, "read"), 3000);
    };

    // Apply to new messages
    selectedChat?.messages
      .filter((msg) => msg.sender === "me" && msg.status === "sending")
      .forEach((msg) => simulateMessageFlow(msg.id));
  }, [selectedChat?.messages]);

  // Render message status indicators
  const MessageStatus = ({ status }) => {
    if (!status || status === "sending") return "⌛";
    if (status === "sent") return "✓";
    if (status === "delivered") return "✓✓";
    if (status === "read") return <span className="text-blue-500">✓✓</span>;
    return null;
  };

  // Add this new component before MessageContent
  const MessageTypeContent = ({ message }) => {
    switch (message.type) {
      case "text":
        return <p className="text-gray-800">{message.text}</p>;
      case "image":
        return (
          <div
            className="cursor-pointer"
            onClick={() => {
              setSelectedImage(message.content);
              setShowImagePreview(true);
            }}
          >
            <img
              src={message.content}
              alt="Shared"
              className="max-w-[200px] rounded-lg"
            />
          </div>
        );
      case "file":
        return (
          <div className="flex items-center space-x-2 bg-white/50 p-2 rounded">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium">{message.fileName}</p>
              <p className="text-xs text-gray-500">
                {(message.fileSize / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        );
      default:
        // For messages without a specific type or legacy messages
        return <p className="text-gray-800">{message.text}</p>;
    }
  };

  // Update the MessageContent component
  const MessageContent = ({ message, isSelected }) => {
    const [showActions, setShowActions] = useState(false);

    return (
      <div
        className={`relative group ${isSelected ? "bg-blue-50" : ""}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Reply header if message is a reply */}
        {message.replyTo && (
          <div className="text-sm text-gray-500 bg-gray-100 p-2 rounded-t-lg">
            Replying to {message.replyTo.sender}
            <p className="text-xs truncate">{message.replyTo.text}</p>
          </div>
        )}

        {/* Message content */}
        <div className="relative">
          {/* Group chat sender name */}
          {selectedChat?.isGroup && message.sender !== "me" && (
            <p className="text-xs font-medium text-blue-600 mb-1">
              {message.sender}
            </p>
          )}

          {/* Edited indicator */}
          {message.edited && (
            <span className="text-xs text-gray-400 ml-1">(edited)</span>
          )}

          {/* Message content based on type */}
          <MessageTypeContent message={message} />

          {/* Message actions */}
          {showActions && (
            <div className="absolute right-0 -top-8 bg-white shadow-lg rounded-lg flex items-center space-x-1 px-1">
              <button
                onClick={() => handleReplyMessage(message)}
                className="p-1 hover:bg-gray-100 rounded"
                title="Reply"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
              </button>

              {message.sender === "me" && (
                <button
                  onClick={() => handleEditMessage(message)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Edit"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              )}

              <button
                onClick={() => setShowEmojiReactionPicker(message.id)}
                className="p-1 hover:bg-gray-100 rounded"
                title="React"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              <button
                onClick={() => handleStarMessage(message.id)}
                className="p-1 hover:bg-gray-100 rounded"
                title="Star"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {message.reactions.map((reaction, index) => (
                <span
                  key={index}
                  className="bg-white/50 rounded-full px-2 py-0.5 text-xs"
                >
                  {reaction}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Add these new functions for message actions
  const handleReplyMessage = (message) => {
    setShowReplyTo(message);
    // Focus input field
  };

  const handleEditMessage = (message) => {
    if (message.sender === "me") {
      setEditingMessage(message);
      setMessage(message.text);
    }
  };

  const handleDeleteMessage = (messageId) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              messages: chat.messages.filter((msg) => msg.id !== messageId),
            }
          : chat
      )
    );
  };

  const handleStarMessage = (messageId) => {
    const message = selectedChat.messages.find((msg) => msg.id === messageId);
    if (message) {
      setStarredMessages((prev) => [
        ...prev,
        { ...message, chatId: selectedChat.id },
      ]);
    }
  };

  const handleReaction = (messageId, reaction) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              messages: chat.messages.map((msg) =>
                msg.id === messageId
                  ? { ...msg, reactions: [...(msg.reactions || []), reaction] }
                  : msg
              ),
            }
          : chat
      )
    );
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to create a new group
  const handleCreateGroup = () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      const newGroup = {
        id: Date.now(),
        name: groupName,
        isGroup: true,
        lastMessage: "Group created",
        time: format(new Date(), "h:mm a"),
        unread: 0,
        online: true,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${groupName}`,
        members: [
          { id: "currentUser", name: "My Profile", role: "admin" },
          ...selectedMembers.map((member) => ({
            id: member.id,
            name: member.name,
            role: "member",
          })),
        ],
        messages: [],
      };

      setChats((prev) => [newGroup, ...prev]);
      setGroupName("");
      setSelectedMembers([]);
      setShowCreateGroup(false);
    }
  };

  // Add these new functions for group management
  const handleAddMembers = (newMembers) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              members: [
                ...chat.members,
                ...newMembers.map((member) => ({
                  id: member.id,
                  name: member.name,
                  role: "member",
                  avatar: member.avatar,
                })),
              ],
            }
          : chat
      )
    );
    setShowAddMembers(false);
  };

  const handleRemoveMember = (memberId) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              members: chat.members.filter((member) => member.id !== memberId),
            }
          : chat
      )
    );
    setRemovingMember(null);
  };

  const handleMakeAdmin = (memberId) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              members: chat.members.map((member) =>
                member.id === memberId ? { ...member, role: "admin" } : member
              ),
            }
          : chat
      )
    );
  };

  // Handle chat selection for mobile view
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowChatList(false);
  };

  // Handle back button for mobile view
  const handleBackClick = () => {
    setShowChatList(true);
  };

  return (
    <div className="w-full h-screen flex bg-[#111b21] overflow-hidden">
      {/* Left sidebar - Chat list */}
      <div
        className={`${
          showChatList ? "block" : "hidden md:block"
        } w-full md:w-[30%] lg:w-[25%] xl:w-[20%] border-r border-[#2a3942] bg-[#111b21] flex flex-col`}
      >
        <ChatListHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setShowCreateGroup={setShowCreateGroup}
        />
        <ChatList
          chats={filteredChats}
          selectedChat={selectedChat}
          setSelectedChat={handleChatSelect}
        />
      </div>

      {/* Right side - Chat area */}
      <div
        className={`${
          !showChatList ? "block" : "hidden md:block"
        } w-full md:w-[70%] lg:w-[75%] xl:w-[80%] flex flex-col bg-[#0b141a]`}
      >
        {selectedChat ? (
          <>
            <ChatHeader
              selectedChat={selectedChat}
              setShowMediaGallery={setShowMediaGallery}
              setShowGroupInfo={setShowGroupInfo}
              onBackClick={handleBackClick}
            />
            <MessageList
              messages={selectedChat.messages}
              selectedChat={selectedChat}
              selectedMessages={selectedMessages}
              isTyping={isTyping}
              handleReplyMessage={handleReplyMessage}
              handleEditMessage={handleEditMessage}
              setShowEmojiReactionPicker={setShowEmojiReactionPicker}
              handleStarMessage={handleStarMessage}
            />
            <MessageInput
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              handleTyping={handleTyping}
              showEmojiPicker={showEmojiPicker}
              setShowEmojiPicker={setShowEmojiPicker}
              attachmentMenuOpen={attachmentMenuOpen}
              setAttachmentMenuOpen={setAttachmentMenuOpen}
              fileInputRef={fileInputRef}
              selectedFile={selectedFile}
              previewUrl={previewUrl}
              setSelectedFile={setSelectedFile}
              setPreviewUrl={setPreviewUrl}
            />
          </>
        ) : (
          <WelcomeScreen />
        )}
      </div>

      {/* Modals */}
      {showCreateGroup && (
        <CreateGroupModal
          groupName={groupName}
          setGroupName={setGroupName}
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
          handleCreateGroup={handleCreateGroup}
          setShowCreateGroup={setShowCreateGroup}
          contacts={contacts}
        />
      )}

      {showGroupInfo && (
        <GroupInfoModal
          selectedChat={selectedChat}
          setShowGroupInfo={setShowGroupInfo}
          setShowAddMembers={setShowAddMembers}
          removingMember={removingMember}
          setRemovingMember={setRemovingMember}
          handleRemoveMember={handleRemoveMember}
          handleMakeAdmin={handleMakeAdmin}
        />
      )}

      {showAddMembers && (
        <AddMembersModal
          selectedChat={selectedChat}
          setShowAddMembers={setShowAddMembers}
          handleAddMembers={handleAddMembers}
          contacts={contacts}
        />
      )}

      {removingMember && (
        <RemoveMemberModal
          removingMember={removingMember}
          setRemovingMember={setRemovingMember}
          handleRemoveMember={handleRemoveMember}
        />
      )}

      {showMediaGallery && (
        <MediaGallery
          selectedChat={selectedChat}
          setShowMediaGallery={setShowMediaGallery}
          mediaFilter={mediaFilter}
          setMediaFilter={setMediaFilter}
          setSelectedImage={setSelectedImage}
          setShowImagePreview={setShowImagePreview}
        />
      )}

      {showSearchMessages && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setShowSearchMessages(false)}
              className="absolute top-4 right-4 text-white text-xl hover:text-gray-300"
            >
              ✕
            </button>
            <MessageSearch
              selectedChat={selectedChat}
              messageSearchQuery={messageSearchQuery}
              setMessageSearchQuery={setMessageSearchQuery}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Chats;
