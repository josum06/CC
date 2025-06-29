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
} from "lucide-react";
import Comments from "../components/Comments";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "@clerk/clerk-react";

function NetworkProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state?.userData;
  // console.log(userData.userId);
  const [activeTab, setActiveTab] = useState("posts"); // 'posts' or 'projects'
  const [currUserId, setCurrUserId] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
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
            `http://localhost:3000/api/user/profileById/${userData.userId}`
          ),
          axios.get(`http://localhost:3000/api/user/posts/${userData.userId}`),
          axios.get(`http://localhost:3000/api/user/profile/${clerkUser.id}`),
          axios.get(
            `http://localhost:3000/api/project/get-project/${userData.userId}`
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
          `http://localhost:3000/api/post/like/${selectedPost._id}`
        );
        const likedUsers = response.data.likedByUsers;
        console.log("Liked users:", likedUsers);
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
          `http://localhost:3000/api/user/isPending/${currUserId}?receiverId=${user._id}`
        );
        console.log("Pending status response:", response);
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
        `http://localhost:3000/api/user/updateConnectionsPending/${currUserId}`,
        {
          receiverId: user._id,
        }
      );
      console.log(res.data);
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
        `http://localhost:3000/api/post/like/${selectedPost._id}/like-toggle`,
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
        "http://localhost:3000/api/post/create-comment",
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
                  <h2 className="text-3xl font-bold text-gray-100">{user?.fullName}</h2>
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
                    <div className="font-bold text-2xl text-gray-100">{posts?.length || 0}</div>
                    <div className="text-sm text-gray-400">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-2xl text-gray-100">{projects.length || 0}</div>
                    <div className="text-sm text-gray-400">Projects</div>
                  </div>
                </div>

                {/* Bio and Details */}
                <div className="space-y-3 mb-6">
                  <p className="text-gray-300 leading-relaxed">{user?.aboutMe}</p>

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
                {activeTab === "posts"
                  ? // Posts Grid with hover effects
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
                  : // Projects Grid
                    projects.length > 0
                    ? projects.map((project, i) => (
                        <div
                          key={i}
                          className="bg-gradient-to-br from-[#232526] via-[#1a1b1c] to-[#000000] p-6 rounded-2xl shadow-xl border border-gray-500/30 hover:border-gray-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                        >
                          <h3 className="font-semibold text-gray-100 text-lg mb-3">{project.title}</h3>
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
                    : (
                      <div className="col-span-full text-center py-12">
                        <div className="text-gray-400 text-lg">No projects to show</div>
                      </div>
                    )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-gradient-to-br from-[#232526] via-[#1a1b1c] to-[#000000] border border-gray-500/30 rounded-2xl max-w-6xl w-full max-h-[90vh] min-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full cursor-pointer transition-all duration-300 border border-gray-600/30 hover:border-gray-500/50 z-50"
            >
              <X size={20} className="text-gray-300" />
            </button>

            {/* Image and Video Section */}
            <div className="w-full md:w-7/12 bg-gradient-to-br from-gray-800/30 to-gray-900/30 flex items-center justify-center">
              {selectedPost.mediaUrl &&
              selectedPost.mediaUrl.toLowerCase().endsWith(".mp4") ? (
                <video
                  src={selectedPost.mediaUrl}
                  controls
                  className="w-auto h-full object-contain max-w-full max-h-full"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={selectedPost.mediaUrl}
                  alt="Post content"
                  className="w-auto h-full object-contain"
                />
              )}
            </div>

            {/* Details Section */}
            <div className="w-full md:w-5/12 flex border-l border-gray-500/30 flex-col min-h-full bg-gradient-to-br from-[#232526] via-[#1a1b1c] to-[#000000]">
              {/* Post Header */}
              <div className="p-6 border-b border-gray-500/30 bg-gradient-to-r from-gray-700/20 via-gray-600/10 to-gray-700/20">
                <div className="flex items-center space-x-3">
                  <img
                    src={user.profileImage}
                    alt={selectedPost.username}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-600/50"
                  />
                  <div>
                    <p className="font-semibold text-gray-100">{selectedPost.caption}</p>
                    <p className="text-xs text-gray-400">
                      {selectedPost.time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="flex-1 overflow-y-auto">
                <Comments postId={selectedPost._id} />
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-500/30 bg-gradient-to-r from-gray-700/20 via-gray-600/10 to-gray-700/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleLike}
                      className="p-2 hover:bg-gray-700/50 rounded-full transition-all duration-300"
                    >
                      <Heart
                        size={24}
                        className={`${
                          likedByCurrentUser
                            ? "fill-red-500 stroke-red-500"
                            : "stroke-gray-400 hover:stroke-red-500"
                        } transition-colors`}
                      />
                    </button>

                    <button
                      onClick={() => setCommentModalOpen(!commentModalOpen)}
                      className="p-2 hover:bg-gray-700/50 rounded-full transition-all duration-300"
                    >
                      <MessageCircle size={24} className="text-gray-400 hover:text-gray-300" />
                    </button>

                    <button className="p-2 hover:bg-gray-700/50 rounded-full transition-all duration-300">
                      <Share2 size={24} className="text-gray-400 hover:text-gray-300" />
                    </button>
                  </div>
                </div>
                <p className="font-semibold text-sm mb-3 text-gray-100">
                  {selectedPost.likes} likes
                </p>
                {commentModalOpen && (
                  <form
                    onSubmit={handleSubmit}
                    className="flex items-center py-3 border-t border-gray-600/30"
                  >
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 text-sm p-3 rounded-xl bg-gradient-to-r from-gray-700/30 to-gray-800/30 border border-gray-600/30 focus:border-blue-500/50 focus:outline-none text-gray-100 placeholder-gray-500"
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className={`ml-3 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                        commentText.trim()
                          ? "bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-400 border border-blue-500/50 hover:from-blue-600/30 hover:to-blue-700/30"
                          : "text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Post
                    </button>
                  </form>
                )}
                <p className="text-sm text-gray-500 mt-3">{selectedPost.time}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NetworkProfile;
