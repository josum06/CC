import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  X,
  Mail,
  Share2,
  Grid,
  Briefcase,
  MapPin,
  Link as LinkIcon,
  Heart,
  MessageCircle,
  Handshake,
  Clock,
  Github,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import Comments from "../components/Comments";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "@clerk/clerk-react";

function NetworkProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.userData;
  const [activeTab, setActiveTab] = useState("posts"); // 'posts' or 'projects'
  const [currUserId, setCurrUserId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const { user: clerkUser } = useUser();
  const [category, setCategory] = useState("rejected");
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    if (userData.userId && clerkUser?.id) {
      fetchuser();
    }
  }, [userData, clerkUser?.id]);

  const fetchuser = async () => {
    try {
      const [userResponse, postResponse, userAuthResponse, projectResponse] =
        await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/profileById/${
              userData.userId
            }`
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/posts/${
              userData.userId
            }`
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/profile/${
              clerkUser.id
            }`
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/project/get-project/${
              userData.userId
            }`
          ),
        ]);
      const data = userResponse.data;
      const currUserData = userAuthResponse.data;
      setUser(data);
      setCurrUserId(currUserData._id);
      const post = postResponse.data;
      setPosts(post);
      const projects = projectResponse.data;
      setProjects(projects);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile.");
    }
  };

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/post/like/${
            selectedPost._id
          }`
        );
        const likedUsers = response.data.likedByUsers;
        setLikedByCurrentUser(likedUsers.some((user) => user === currUserId));
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    if (currUserId && selectedPost?._id) {
      fetchLikes();
    }
  }, [currUserId, selectedPost?._id]);

  useEffect(() => {
    const checkCategoryStatus = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/user/isPending/${currUserId}?receiverId=${user._id}`
        );
        setCategory(response.data?.category);
      } catch (error) {
        console.error("Error checking pending status:", error);
      }
    };

    if (currUserId && user) {
      checkCategoryStatus();
    }
  }, [currUserId, user]);

  const handleClick = async () => {
    try {
      const res = await axios.patch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/user/updateConnectionsPending/${currUserId}`,
        {
          receiverId: user._id,
        }
      );
      setCategory("pending");
      toast.success("Connection sent successfully!");
    } catch (err) {
      // console.error("Error updating connections:", err);
      toast.error(err.response.data.message || "Something went wrong");
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/post/like/${
          selectedPost._id
        }/like-toggle`,
        { userId: currUserId }
      );
      const updatedPost = {
        ...selectedPost,
        likes: response.data.post.likes,
      };
      setSelectedPost(updatedPost);
      setLikedByCurrentUser(response.data.hasLiked);
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const formData = new FormData();
      formData.append("text", commentText);
      formData.append("postId", selectedPost._id);
      formData.append("userId", currUserId);
      await axios.post(
        "${import.meta.env.VITE_BACKEND_URL}/api/post/create-comment",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setCommentText("");
      toast.success(`Comment posted successfully!`);
    } catch (e) {
      console.error("Error posting comment:", e);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 relative">
      {/* Back to Previous Page Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-4 py-2 mt-4 ml-4 bg-gradient-to-r from-gray-700/40 to-gray-800/40 hover:from-gray-700/60 hover:to-gray-800/60 text-gray-300 rounded-xl border border-gray-600/30 hover:border-gray-500/50 shadow transition-all duration-300 z-20"
      >
        <ArrowLeft size={18} />
        <span className="font-medium">Back</span>
      </button>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Profile Header */}
      <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        <div className="bg-gradient-to-br from-[#232526] via-[#1a1b1c] to-[#000000] rounded-2xl border border-gray-500/30 shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden ring-4 ring-gray-700/50 shadow-2xl bg-gradient-to-br from-gray-700/50 to-gray-800/50">
                  <img
                    src={user?.profileImage}
                    alt={user?.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Status indicator */}
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-[#232526] shadow-lg"></div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                  <h2 className="text-3xl font-bold text-gray-100">
                    {user?.fullName}
                  </h2>
                  <div className="flex gap-3">
                    {user?._id != currUserId && (
                      <button
                        onClick={handleClick}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 border ${
                          category === "accepted"
                            ? "bg-gradient-to-r from-green-600/20 to-green-700/20 border-green-500/50 text-green-400 hover:from-green-600/30 hover:to-green-700/30"
                            : category === "pending"
                            ? "bg-gradient-to-r from-yellow-600/20 to-yellow-700/20 border-yellow-500/50 text-yellow-400 hover:from-yellow-600/30 hover:to-yellow-700/30"
                            : "bg-gradient-to-r from-blue-600/20 to-blue-700/20 border-blue-500/50 text-blue-400 hover:from-blue-600/30 hover:to-blue-700/30"
                        }`}
                      >
                        {category === "accepted" && "Connected"}
                        {category === "pending" && "Pending"}
                        {category === "rejected" && "Connect"}
                      </button>
                    )}
                    <button className="p-3 hover:bg-gray-700/50 rounded-xl transition-all duration-300 border border-gray-600/30 hover:border-gray-500/50">
                      <Share2 size={20} className="text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-8 mb-6">
                  <div className="text-center">
                    <div className="font-bold text-2xl text-gray-100">
                      {posts?.length || 0}
                    </div>
                    <div className="text-sm text-gray-400">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-2xl text-gray-100">
                      {projects.length || 0}
                    </div>
                    <div className="text-sm text-gray-400">Projects</div>
                  </div>
                </div>

                {/* Bio and Details */}
                <div className="space-y-3 mb-6">
                  <p className="text-gray-300 leading-relaxed">
                    {user?.aboutMe}
                  </p>

                  <div className="flex items-center gap-2 text-blue-400">
                    <LinkIcon size={16} />
                    <a
                      href={user?.website ? user.website : "/NetworkProfile"}
                      target="_self"
                      rel="noopener noreferrer"
                      className="hover:underline transition-colors"
                    >
                      {user?.website || "No website to show"}
                    </a>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {user?.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-gray-700/50 to-gray-800/50 text-gray-300 rounded-xl text-sm border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mt-8">
          <div className="bg-gradient-to-br from-[#232526] via-[#1a1b1c] to-[#000000] rounded-2xl border border-gray-500/30 shadow-2xl overflow-hidden">
            <div className="flex gap-1 p-2 bg-gradient-to-r from-gray-700/20 via-gray-600/10 to-gray-700/20">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                  activeTab === "posts"
                    ? "bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-400 border border-blue-500/50"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                }`}
              >
                <Grid size={20} />
                <span>Posts</span>
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                  activeTab === "projects"
                    ? "bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-400 border border-blue-500/50"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                }`}
              >
                <Briefcase size={20} />
                <span>Projects</span>
              </button>
            </div>

            {/* Content Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === "posts" ? (
                  // Posts Grid with hover effects
                  posts?.map((post) => (
                    <div
                      key={post._id}
                      className="aspect-square bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-2xl overflow-hidden relative group cursor-pointer border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                      onClick={() => handlePostClick(post)}
                    >
                      {/* Check if it's a video file */}
                      {post?.mediaUrl &&
                      post.mediaUrl.toLowerCase().endsWith(".mp4") ? (
                        <video
                          src={post.mediaUrl}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata" // This helps generate a thumbnail
                        />
                      ) : (
                        <img
                          src={post?.mediaUrl}
                          alt="Post"
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center text-white">
                            <Heart size={24} className="fill-white" />
                            <span className="ml-2 font-semibold">
                              {post.likes}
                            </span>
                          </div>
                          <div className="flex items-center text-white">
                            <MessageCircle size={24} className="fill-white" />
                            <span className="ml-2 font-semibold">
                              {post?.comments?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Video play indicator */}
                      {post?.mediaUrl &&
                        post.mediaUrl.toLowerCase().endsWith(".mp4") && (
                          <div className="absolute top-3 right-3 bg-black/70 rounded-full p-2 backdrop-blur-sm">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="white"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}
                    </div>
                  ))
                ) : // Projects Grid
                projects.length > 0 ? (
                  projects.map((project, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-[#232526] via-[#1a1b1c] to-[#000000] p-6 rounded-2xl shadow-xl border border-gray-500/30 hover:border-gray-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
                      onClick={() => setSelectedProject(project)}
                    >
                      <h3 className="font-semibold text-gray-100 text-lg mb-3">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="mb-4">
                        <img
                          src={project.mediaUrl}
                          alt="Project"
                          className="w-full h-32 object-cover rounded-xl"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project?.TechStack?.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-400 rounded-lg text-xs border border-blue-500/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <a
                          href={project?.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                        >
                          <Github size={16} />
                          <span>View on GitHub</span>
                        </a>
                        <a
                          href={project?.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                        >
                          <ExternalLink size={16} />
                          <span>Live Demo</span>
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 text-lg">
                      No projects to show
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2 md:p-4">
          <div className="relative bg-gradient-to-br from-[#232526] via-[#1a1b1c] to-[#000000] border border-gray-500/30 rounded-lg sm:rounded-xl lg:rounded-2xl w-full h-full sm:h-auto sm:max-w-4xl lg:max-w-6xl sm:max-h-[95vh] lg:max-h-[90vh] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
            {/* Close button (left) */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-1 left-1 sm:top-2 sm:left-2 md:top-4 md:left-4 p-1.5 sm:p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full cursor-pointer transition-all duration-300 border border-gray-600/30 hover:border-gray-500/50 z-50"
              aria-label="Close post modal"
            >
              <X
                size={16}
                className="text-gray-300 sm:w-4 sm:h-4 md:w-5 md:h-5"
              />
            </button>

            {/* Media Section (photo, video, etc.) */}
            <div className="w-full lg:w-7/12 flex-shrink-0 bg-gradient-to-br from-gray-800/30 to-gray-900/30 flex items-center justify-center overflow-hidden">
              <div className="w-full flex items-center justify-center">
                {selectedPost.mediaUrl ? (
                  selectedPost.mediaUrl.toLowerCase().endsWith(".mp4") ? (
                    <video
                      src={selectedPost.mediaUrl}
                      controls
                      className="object-contain aspect-[4/3] mx-auto my-4
                        w-full
                        max-w-[95vw] max-h-[45vh] min-h-[180px]
                        sm:max-h-[50vh]
                        md:max-h-[55vh] md:min-h-[220px]
                        lg:max-w-[40vw] lg:max-h-[60vh] lg:min-h-[250px] lg:my-0"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={selectedPost.mediaUrl}
                      alt="Post content"
                      className="object-contain aspect-[4/3] mx-auto my-4
                        w-full
                        max-w-[95vw] max-h-[45vh] min-h-[180px]
                        sm:max-h-[50vh]
                        md:max-h-[55vh] md:min-h-[220px]
                        lg:max-w-[40vw] lg:max-h-[60vh] lg:min-h-[250px] lg:my-0"
                    />
                  )
                ) : (
                  <div className="flex items-center justify-center w-full h-40 text-gray-400">
                    No media available
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="w-full lg:w-5/12 flex lg:border-l border-gray-500/30 flex-col min-h-0 lg:min-h-full bg-gradient-to-br from-[#232526] via-[#1a1b1c] to-[#000000] overflow-y-auto">
              {/* Post Header */}
              <div className="p-2 sm:p-3 md:p-4 lg:p-6 border-b border-gray-500/30 bg-gradient-to-r from-gray-700/20 via-gray-600/10 to-gray-700/20 flex-shrink-0">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <img
                    src={user.profileImage}
                    alt={selectedPost.username}
                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full object-cover ring-2 ring-gray-600/50"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-100 text-xs sm:text-sm md:text-base truncate">
                      {selectedPost.caption}
                    </p>
                    <p className="text-xs text-gray-400">{selectedPost.time}</p>
                  </div>
                </div>
              </div>

              {/* Comments Section - Hidden on mobile and tablet unless comment button is clicked */}
              <div
                className={`flex-1 overflow-y-auto min-h-0 ${
                  commentModalOpen ? "block" : "hidden lg:block"
                }`}
              >
                <Comments postId={selectedPost._id} />
              </div>

              {/* Action Buttons */}
              <div className="p-2 sm:p-3 md:p-4 lg:p-6 border-t border-gray-500/30 bg-gradient-to-r from-gray-700/20 via-gray-600/10 to-gray-700/20 flex-shrink-0">
                <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                  <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                    <button
                      onClick={handleLike}
                      className="p-1 sm:p-1.5 md:p-2 hover:bg-gray-700/50 rounded-full transition-all duration-300"
                    >
                      <Heart
                        size={18}
                        className={`sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                          likedByCurrentUser
                            ? "fill-red-500 stroke-red-500"
                            : "stroke-gray-400 hover:stroke-red-500"
                        } transition-colors`}
                      />
                    </button>

                    <button
                      onClick={() => setCommentModalOpen(!commentModalOpen)}
                      className="p-1 sm:p-1.5 md:p-2 hover:bg-gray-700/50 rounded-full transition-all duration-300"
                    >
                      <MessageCircle
                        size={18}
                        className="text-gray-400 hover:text-gray-300 sm:w-5 sm:h-5 md:w-6 md:h-6"
                      />
                    </button>

                    <button className="p-1 sm:p-1.5 md:p-2 hover:bg-gray-700/50 rounded-full transition-all duration-300">
                      <Share2
                        size={18}
                        className="text-gray-400 hover:text-gray-300 sm:w-5 sm:h-5 md:w-6 md:h-6"
                      />
                    </button>
                  </div>
                </div>
                <p className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3 text-gray-100">
                  {selectedPost.likes} likes
                </p>
                {commentModalOpen && (
                  <form
                    onSubmit={handleSubmit}
                    className="flex items-center py-2 sm:py-3 border-t border-gray-600/30"
                  >
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 text-xs sm:text-sm p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-gray-700/30 to-gray-800/30 border border-gray-600/30 focus:border-blue-500/50 focus:outline-none text-gray-100 placeholder-gray-500"
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className={`ml-1 sm:ml-2 md:ml-3 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition-all duration-300 ${
                        commentText.trim()
                          ? "bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-400 border border-blue-500/50 hover:from-blue-600/30 hover:to-blue-700/30"
                          : "text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Post
                    </button>
                  </form>
                )}
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 md:mt-3">
                  {selectedPost.time}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2 md:p-4">
          <div className="relative bg-gradient-to-br from-[#232526] via-[#1a1b1c] to-[#000000] border border-gray-500/30 rounded-lg sm:rounded-xl lg:rounded-2xl w-full h-full sm:h-auto sm:max-w-4xl lg:max-w-6xl sm:max-h-[95vh] lg:max-h-[90vh] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
            {/* Close button (left) */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-1 left-1 sm:top-2 sm:left-2 md:top-4 md:left-4 p-1.5 sm:p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full cursor-pointer transition-all duration-300 border border-gray-600/30 hover:border-gray-500/50 z-50"
              aria-label="Close project modal"
            >
              <X
                size={16}
                className="text-gray-300 sm:w-4 sm:h-4 md:w-5 md:h-5"
              />
            </button>

            {/* Project Image Section */}
            <div className="w-full lg:w-7/12 flex-shrink-0 bg-gradient-to-br from-gray-800/30 to-gray-900/30 flex items-center justify-center overflow-hidden">
              <div className="w-full flex items-center justify-center">
                <img
                  src={selectedProject.mediaUrl}
                  alt="Project content"
                  className="object-contain aspect-[4/3] mx-auto my-4
                    w-full
                    max-w-[95vw] max-h-[45vh] min-h-[180px]
                    sm:max-h-[50vh]
                    md:max-h-[55vh] md:min-h-[220px]
                    lg:max-w-[40vw] lg:max-h-[60vh] lg:min-h-[250px] lg:my-0"
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="w-full lg:w-5/12 flex-1 flex lg:border-l border-gray-500/30 flex-col min-h-0 lg:min-h-full bg-gradient-to-br from-[#232526] via-[#1a1b1c] to-[#000000] overflow-y-auto px-2 sm:px-4 md:px-6">
              {/* Project Header */}
              <div className="p-2 sm:p-3 md:p-4 lg:p-6 border-b border-gray-500/30 bg-gradient-to-r from-gray-700/20 via-gray-600/10 to-gray-700/20 flex-shrink-0">
                <h2 className="font-semibold text-gray-100 text-lg sm:text-xl md:text-2xl truncate">
                  {selectedProject.title}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {selectedProject.description}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 p-2 sm:p-3 md:p-4 lg:p-6">
                {selectedProject?.TechStack?.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-400 rounded-lg text-xs border border-blue-500/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="space-y-2 p-2 sm:p-3 md:p-4 lg:p-6">
                {selectedProject?.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                  >
                    <Github size={16} />
                    <span>View on GitHub</span>
                  </a>
                )}
                {selectedProject?.projectUrl && (
                  <a
                    href={selectedProject.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
                  >
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NetworkProfile;
