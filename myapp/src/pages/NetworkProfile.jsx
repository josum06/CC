import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  X,
  Share2,
  Grid,
  Briefcase,
  Link as LinkIcon,
  Heart,
  MessageCircle,
  Github,
  ExternalLink,
  ArrowLeft,
  User,
  Loader2,
} from "lucide-react";
import Comments from "../components/Comments";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "@clerk/clerk-react";
import { useTheme } from "../context/ThemeContext";

function NetworkProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.userData;
  const [activeTab, setActiveTab] = useState("posts");
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
  const { isDarkMode } = useTheme();

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
        `${import.meta.env.VITE_BACKEND_URL}/api/post/create-comment`,
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
    <div
      className={`min-h-screen relative transition-colors duration-300 ${
        isDarkMode ? "bg-[#070707] text-[#f5f5f5]" : "bg-[#f5f5f5] text-[#070707]"
      }`}
    >
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4790fd]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c76191]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#27dc66]/3 rounded-full blur-3xl"></div>
      </div>

      {/* Back Button */}
      <div className="relative z-10 px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#040404]/80 backdrop-blur-xl border border-[#4790fd]/20 hover:border-[#4790fd]/30 text-[#4790fd] rounded-xl transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Profile Header */}
      <div className="max-w-4xl mx-auto px-4 py-6 relative z-10">
        <div className="relative group mb-8">
          {/* Gradient blur background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4790fd]/10 via-[#c76191]/5 to-[#27dc66]/10 rounded-3xl blur-xl opacity-50"></div>
          
          {/* Card */}
          <div className="relative bg-[#040404]/80 backdrop-blur-2xl rounded-3xl border border-[#4790fd]/20 p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Profile Image */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden ring-4 ring-[#4790fd]/30 shadow-lg shadow-[#4790fd]/20">
                  <img
                    src={user?.profileImage}
                    alt={user?.fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = "flex";
                      }
                    }}
                  />
                  <div className="hidden w-full h-full bg-[#070707] items-center justify-center">
                    <User className="w-16 h-16 text-[#4790fd]" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#27dc66] rounded-full border-4 border-[#040404] shadow-lg"></div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                  <h2 className="text-3xl font-bold text-[#f5f5f5]">
                    {user?.fullName}
                  </h2>
                  <div className="flex gap-3">
                    {user?._id != currUserId && (
                      <button
                        onClick={handleClick}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 border ${
                          category === "accepted"
                            ? "bg-[#27dc66]/10 border-[#27dc66]/20 text-[#27dc66] hover:bg-[#27dc66]/15"
                            : category === "pending"
                            ? "bg-[#ece239]/10 border-[#ece239]/20 text-[#ece239] hover:bg-[#ece239]/15"
                            : "bg-[#4790fd]/10 border-[#4790fd]/20 text-[#4790fd] hover:bg-[#4790fd]/15"
                        }`}
                      >
                        {category === "accepted" && "Connected"}
                        {category === "pending" && "Pending"}
                        {category === "rejected" && "Connect"}
                      </button>
                    )}
                    <button className="p-3 hover:bg-[#4790fd]/10 rounded-xl transition-all duration-300 border border-[#4790fd]/20 hover:border-[#4790fd]/30 text-[#4790fd]">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-8 mb-6">
                  <div className="text-center">
                    <div className="font-bold text-2xl text-[#f5f5f5]">
                      {posts?.length || 0}
                    </div>
                    <div className="text-sm text-[#a0a0a0]">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-2xl text-[#f5f5f5]">
                      {projects.length || 0}
                    </div>
                    <div className="text-sm text-[#a0a0a0]">Projects</div>
                  </div>
                </div>

                {/* Bio and Details */}
                <div className="space-y-3 mb-6">
                  <p className="text-[#c0c0c0] leading-relaxed">
                    {user?.aboutMe}
                  </p>

                  <div className="flex items-center gap-2 text-[#4790fd]">
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
                      className="px-4 py-2 bg-[#4790fd]/10 text-[#4790fd] rounded-xl text-sm border border-[#4790fd]/20 hover:border-[#4790fd]/30 transition-all duration-300"
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
        <div className="relative group">
          {/* Gradient blur background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4790fd]/5 to-[#27dc66]/5 rounded-3xl blur-xl opacity-50"></div>
          
          {/* Card */}
          <div className="relative bg-[#040404]/80 backdrop-blur-2xl rounded-3xl border border-[#4790fd]/20 shadow-xl overflow-hidden">
            <div className="flex gap-1 p-2 bg-[#070707]/50">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                  activeTab === "posts"
                    ? "bg-[#4790fd]/10 text-[#4790fd] border border-[#4790fd]/20"
                    : "text-[#a0a0a0] hover:text-[#f5f5f5] hover:bg-[#070707]/50"
                }`}
              >
                <Grid size={20} />
                <span>Posts</span>
              </button>
              <button
                onClick={() => setActiveTab("projects")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                  activeTab === "projects"
                    ? "bg-[#27dc66]/10 text-[#27dc66] border border-[#27dc66]/20"
                    : "text-[#a0a0a0] hover:text-[#f5f5f5] hover:bg-[#070707]/50"
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
                  posts?.map((post) => (
                    <div
                      key={post._id}
                      className="aspect-square bg-[#070707]/50 backdrop-blur-xl rounded-2xl overflow-hidden relative group cursor-pointer border border-[#4790fd]/10 hover:border-[#4790fd]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                      onClick={() => handlePostClick(post)}
                    >
                      {post?.mediaUrl &&
                      post.mediaUrl.toLowerCase().endsWith(".mp4") ? (
                        <video
                          src={post.mediaUrl}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={post?.mediaUrl}
                          alt="Post"
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/90 via-[#070707]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
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
                          <div className="absolute top-3 right-3 bg-[#070707]/70 rounded-full p-2 backdrop-blur-sm">
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
                ) : projects.length > 0 ? (
                  projects.map((project, i) => (
                    <div
                      key={i}
                      className="bg-[#070707]/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-[#27dc66]/10 hover:border-[#27dc66]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                      onClick={() => setSelectedProject(project)}
                    >
                      <h3 className="font-semibold text-[#f5f5f5] text-lg mb-3">
                        {project.title}
                      </h3>
                      <p className="text-[#a0a0a0] text-sm mb-4 leading-relaxed">
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
                            className="px-3 py-1 bg-[#27dc66]/10 text-[#27dc66] rounded-lg text-xs border border-[#27dc66]/20"
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
                          className="flex items-center gap-2 text-[#4790fd] hover:text-[#4790fd]/80 transition-colors text-sm"
                        >
                          <Github size={16} />
                          <span>View on GitHub</span>
                        </a>
                        <a
                          href={project?.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[#4790fd] hover:text-[#4790fd]/80 transition-colors text-sm"
                        >
                          <ExternalLink size={16} />
                          <span>Live Demo</span>
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-[#a0a0a0] text-lg">
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#070707]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-[#040404]/95 backdrop-blur-2xl border border-[#4790fd]/20 rounded-2xl w-full h-full sm:h-auto sm:max-w-6xl sm:max-h-[90vh] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 left-4 p-2 bg-[#070707]/50 hover:bg-[#070707]/70 rounded-full cursor-pointer transition-all duration-300 border border-[#4790fd]/20 hover:border-[#4790fd]/30 z-50 text-[#f5f5f5]"
              aria-label="Close post modal"
            >
              <X size={20} />
            </button>

            {/* Media Section */}
            <div className="w-full lg:w-7/12 flex-shrink-0 bg-[#070707]/50 flex items-center justify-center overflow-hidden">
              <div className="w-full flex items-center justify-center">
                {selectedPost.mediaUrl ? (
                  selectedPost.mediaUrl.toLowerCase().endsWith(".mp4") ? (
                    <video
                      src={selectedPost.mediaUrl}
                      controls
                      className="object-contain aspect-[4/3] mx-auto my-4 w-full max-w-[95vw] max-h-[45vh] sm:max-h-[50vh] md:max-h-[55vh] lg:max-w-[40vw] lg:max-h-[60vh] lg:my-0"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={selectedPost.mediaUrl}
                      alt="Post content"
                      className="object-contain aspect-[4/3] mx-auto my-4 w-full max-w-[95vw] max-h-[45vh] sm:max-h-[50vh] md:max-h-[55vh] lg:max-w-[40vw] lg:max-h-[60vh] lg:my-0"
                    />
                  )
                ) : (
                  <div className="flex items-center justify-center w-full h-40 text-[#a0a0a0]">
                    No media available
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="w-full lg:w-5/12 flex lg:border-l border-[#4790fd]/10 flex-col min-h-0 lg:min-h-full bg-[#040404]/95 backdrop-blur-2xl overflow-y-auto">
              {/* Post Header */}
              <div className="p-4 lg:p-6 border-b border-[#4790fd]/10 bg-[#070707]/50 flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.profileImage}
                    alt={selectedPost.username}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover ring-2 ring-[#4790fd]/20"
                    onError={(e) => {
                      e.target.style.display = "none";
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = "flex";
                      }
                    }}
                  />
                  <div className="hidden w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#070707] items-center justify-center ring-2 ring-[#4790fd]/20">
                    <User className="w-6 h-6 text-[#4790fd]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#f5f5f5] text-sm md:text-base truncate">
                      {selectedPost.caption}
                    </p>
                    <p className="text-xs text-[#a0a0a0]">{selectedPost.time}</p>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div
                className={`flex-1 overflow-y-auto min-h-0 ${
                  commentModalOpen ? "block" : "hidden lg:block"
                }`}
              >
                <Comments postId={selectedPost._id} />
              </div>

              {/* Action Buttons */}
              <div className="p-4 lg:p-6 border-t border-[#4790fd]/10 bg-[#070707]/50 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleLike}
                      className="p-2 hover:bg-[#4790fd]/10 rounded-full transition-all duration-300"
                    >
                      <Heart
                        size={20}
                        className={`${
                          likedByCurrentUser
                            ? "fill-[#c76191] stroke-[#c76191]"
                            : "stroke-[#a0a0a0] hover:stroke-[#c76191]"
                        } transition-colors`}
                      />
                    </button>

                    <button
                      onClick={() => setCommentModalOpen(!commentModalOpen)}
                      className="p-2 hover:bg-[#4790fd]/10 rounded-full transition-all duration-300"
                    >
                      <MessageCircle
                        size={20}
                        className="text-[#a0a0a0] hover:text-[#4790fd]"
                      />
                    </button>

                    <button className="p-2 hover:bg-[#4790fd]/10 rounded-full transition-all duration-300">
                      <Share2
                        size={20}
                        className="text-[#a0a0a0] hover:text-[#4790fd]"
                      />
                    </button>
                  </div>
                </div>
                <p className="font-semibold text-sm mb-3 text-[#f5f5f5]">
                  {selectedPost.likes} likes
                </p>
                {commentModalOpen && (
                  <form
                    onSubmit={handleSubmit}
                    className="flex items-center py-2 border-t border-[#4790fd]/10"
                  >
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 text-sm p-2.5 rounded-xl bg-[#070707]/50 backdrop-blur-xl border border-[#4790fd]/20 focus:border-[#4790fd] focus:outline-none text-[#f5f5f5] placeholder-[#808080]"
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className={`ml-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                        commentText.trim()
                          ? "bg-[#4790fd]/10 text-[#4790fd] border border-[#4790fd]/20 hover:bg-[#4790fd]/15"
                          : "text-[#808080] cursor-not-allowed"
                      }`}
                    >
                      Post
                    </button>
                  </form>
                )}
                <p className="text-xs text-[#808080] mt-2">
                  {selectedPost.time}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#070707]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-[#040404]/95 backdrop-blur-2xl border border-[#27dc66]/20 rounded-2xl w-full h-full sm:h-auto sm:max-w-6xl sm:max-h-[90vh] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 left-4 p-2 bg-[#070707]/50 hover:bg-[#070707]/70 rounded-full cursor-pointer transition-all duration-300 border border-[#27dc66]/20 hover:border-[#27dc66]/30 z-50 text-[#f5f5f5]"
              aria-label="Close project modal"
            >
              <X size={20} />
            </button>

            {/* Project Image Section */}
            <div className="w-full lg:w-7/12 flex-shrink-0 bg-[#070707]/50 flex items-center justify-center overflow-hidden">
              <div className="w-full flex items-center justify-center">
                <img
                  src={selectedProject.mediaUrl}
                  alt="Project content"
                  className="object-contain aspect-[4/3] mx-auto my-4 w-full max-w-[95vw] max-h-[45vh] sm:max-h-[50vh] md:max-h-[55vh] lg:max-w-[40vw] lg:max-h-[60vh] lg:my-0"
                />
              </div>
            </div>

            {/* Details Section */}
            <div className="w-full lg:w-5/12 flex-1 flex lg:border-l border-[#27dc66]/10 flex-col min-h-0 lg:min-h-full bg-[#040404]/95 backdrop-blur-2xl overflow-y-auto px-4 md:px-6">
              {/* Project Header */}
              <div className="p-4 lg:p-6 border-b border-[#27dc66]/10 bg-[#070707]/50 flex-shrink-0">
                <h2 className="font-semibold text-[#f5f5f5] text-lg sm:text-xl md:text-2xl truncate">
                  {selectedProject.title}
                </h2>
                <p className="text-xs text-[#a0a0a0] mt-1">
                  {selectedProject.description}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 p-4 lg:p-6">
                {selectedProject?.TechStack?.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#27dc66]/10 text-[#27dc66] rounded-lg text-xs border border-[#27dc66]/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="space-y-2 p-4 lg:p-6">
                {selectedProject?.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#4790fd] hover:text-[#4790fd]/80 transition-colors text-sm"
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
                    className="flex items-center gap-2 text-[#4790fd] hover:text-[#4790fd]/80 transition-colors text-sm"
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
