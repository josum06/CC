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
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50  px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate("/Network")}
          className="p-2 hover:bg-gray-300 bg-gray-200 cursor-pointer rounded-full transition-colors"
        >
          <X size={24} className="text-gray-700" />
        </button>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      {/* Profile Header */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
              <img
                src={user?.profileImage}
                alt={user?.fullName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold">{user?.fullName}</h2>
              <div className="flex gap-2">
                {user?._id != currUserId && (
                  <button
                    onClick={handleClick}
                    className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    {category === "accepted" && (
                      <p className="text-white-600">Accepted</p>
                    )}
                    {category === "pending" && (
                      <p className="text-white-600">Pending</p>
                    )}
                    {category === "rejected" && (
                      <p className="text-white-600">Connect</p>
                    )}
                  </button>
                )}
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Share2 size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-4">
              <div className="text-center">
                <div className="font-bold">{posts?.length}</div>
                <div className="text-sm text-gray-500">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{projects.length || 0}</div>
                <div className="text-sm text-gray-500">Projects</div>
              </div>
            </div>

            {/* Bio and Details */}
            <div className="space-y-2">
              <p className="text-gray-600">{user?.aboutMe}</p>

              <div className="flex items-center gap-2 text-blue-600">
                <LinkIcon size={16} />
                <a
                  href={user?.website ? user.website : "/NetworkProfile"}
                  target="_self"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {user?.website || "No website to show"}
                </a>
              </div>
            </div>

            {/* Skills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {user?.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mt-8 border-t border-gray-200">
          <div className="flex gap-8 mt-4">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === "posts"
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-500"
              }`}
            >
              <Grid size={20} />
              <span>Posts</span>
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === "projects"
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-500"
              }`}
            >
              <Briefcase size={20} />
              <span>Projects</span>
            </button>
          </div>

          {/* Post Modal */}
          {selectedPost && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70  backdrop-blur-sm flex items-center justify-center p-4">
              <div className="relative bg-gray-100 border border-gray-400 rounded-xl max-w-4xl w-full max-h-[90vh]  min-h-[90vh] overflow-hidden flex flex-col md:flex-row">
                {/* Close button */}
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 z-50"
                >
                  <X size={20} className="text-gray-800" />
                </button>

                {/* Image Section */}
                <div className="w-full md:w-7/12 bg-gray-100 flex items-center justify-center ">
                  <img
                    src={selectedPost.mediaUrl}
                    alt="Post content"
                    className="w-auto h-full object-contain"
                  />
                </div>

                {/* Details Section */}
                <div className="w-full md:w-5/12 flex border-s border-gray-400 flex-col min-h-full">
                  {/* Post Header */}
                  <div className="p-4 border-b border-gray-400">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.profileImage}
                        alt={selectedPost.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">{selectedPost.caption}</p>
                        <p className="text-xs text-gray-500">
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
                  <div className="p-4 border-t border-gray-400 bg-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={handleLike}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <Heart
                            size={22}
                            className={`${
                              likedByCurrentUser
                                ? "fill-red-500 stroke-red-500"
                                : "stroke-gray-700 hover:stroke-red-500"
                            } transition-colors`}
                          />
                        </button>

                        <button
                          onClick={() => setCommentModalOpen(!commentModalOpen)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <MessageCircle size={24} className="text-gray-700" />
                        </button>

                        <button className="p-2 hover:bg-gray-100 rounded-full">
                          <Share2 size={24} className="text-gray-700" />
                        </button>
                      </div>
                    </div>
                    <p className="font-semibold text-sm mb-2">
                      {selectedPost.likes} likes
                    </p>
                    {commentModalOpen && (
                      <form
                        onSubmit={handleSubmit}
                        className="flex items-center py-3 border-t border-gray-50 "
                      >
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 text-sm p-2 focus:outline-none placeholder-gray-400"
                        />
                        <button
                          type="submit"
                          disabled={!commentText.trim()}
                          className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
                            commentText.trim()
                              ? "text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                              : "text-gray-200 cursor-not-allowed"
                          }`}
                        >
                          Post
                        </button>
                      </form>
                    )}
                    <p className="text-sm text-gray-500">{selectedPost.time}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === "posts"
              ? // Posts Grid with hover effects
                posts?.map((post) => (
                  <div
                    key={post._id}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group cursor-pointer"
                    onClick={() => handlePostClick(post)}
                  >
                    <img
                      src={post?.mediaUrl}
                      alt="Post"
                      className="w-full h-full object-cover"
                    />
                    {/* Hover Overlay */}

                    <div className="absolute inset-0 not-open: bg-opacity-0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                      <div className="flex items-center space-x-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex items-center text-white">
                          <button
                            onClick={() => handleLike(post._id, clerkUser.id)}
                          >
                            <Heart size={24} className="fill-white" />
                          </button>

                          <span className="ml-2 font-semibold">
                            {post.likes}
                          </span>
                        </div>
                        <div className="flex items-center text-white">
                          <MessageCircle size={24} className="fill-white" />
                          <span className="ml-2 font-semibold">
                            {post?.comments.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : // Projects Grid - Replace with actual projects data

              projects.length > 0
              ? projects.map((project, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                  >
                    <h3 className="font-semibold mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {project.description}
                    </p>
                    <div>
                      <img
                        src={project.mediaUrl}
                        alt="Project"
                        className="w-full h-32 object-cover rounded-lg mt-2"
                      />
                    </div>
                    <div className="flex flex-wrap mt-4">
                      {project?.TechStack?.map((tech, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-300 text-gray-800 rounded-full text-xs mr-2 mt-2"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div>
                      <a
                        href={project?.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-400 mt-2 block"
                      >
                        <Github size={16} className="inline mr-1" />
                        Github
                      </a>
                    </div>
                    <div>
                      <a
                        href={project?.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-400 mt-2 block"
                      >
                        <ExternalLink size={16} className="inline mr-1" />
                        Live Demo
                      </a>
                    </div>
                  </div>
                ))
              : "No projects to show"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NetworkProfile;
