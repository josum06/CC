// Network.jsx
import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import Group from "../components/Group"; // Import the Group component
import axios from "axios";
import { format, parseISO } from "date-fns";
import ProjectCard from "../components/ProjectCard";
import { toast } from "react-toastify";
import { Grid, Briefcase, Users, TrendingUp, Sparkles } from "lucide-react";

const Network = () => {
  const [posts, setPost] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const fetchPosts = async (pageNum) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/post/getAll-post?page=${pageNum}`
      );
      const newPost = res.data.post;
      if (newPost.length === 0) {
        setHasMore(false);
        return;
      }

      setPost((prev) => [...prev, ...newPost]);
      setPage(pageNum);
    } catch (err) {
      console.error("Error fetching notices:", err);
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/project/get-projects"
      );
      const data = res.data;
      console.log("Projects are:-", data);
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      toast.error("Error fetching projects");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-3 px-2 sm:py-6 sm:px-4 md:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-gray-700/50 p-4 sm:p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg sm:rounded-xl border border-blue-500/30">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 leading-tight">
                  Campus Network
                </h1>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 leading-relaxed">
                  Connect, share, and discover with your campus community
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          {/* Enhanced Toggle Buttons */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl p-1 sm:p-2 mb-4 sm:mb-6 md:mb-8 border border-gray-700/50">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 md:gap-3 group relative overflow-hidden ${
                  activeTab === "posts"
                    ? "bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-400 border border-blue-500/50 shadow-lg shadow-blue-500/20"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ${
                  activeTab === "posts" ? "translate-x-full" : ""
                }`}></div>
                <Grid className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-all duration-300 ${
                  activeTab === "posts" ? "text-blue-400" : "text-gray-500"
                }`} />
                <span className="relative z-10">Posts</span>
                {activeTab === "posts" && (
                  <span className="relative z-10 ml-1 sm:ml-2 px-1 sm:px-2 py-0.5 sm:py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                    {posts.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab("projects")}
                className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 md:gap-3 group relative overflow-hidden ${
                  activeTab === "projects"
                    ? "bg-gradient-to-r from-purple-600/20 to-purple-700/20 text-purple-400 border border-purple-500/50 shadow-lg shadow-purple-500/20"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ${
                  activeTab === "projects" ? "translate-x-full" : ""
                }`}></div>
                <Briefcase className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-all duration-300 ${
                  activeTab === "projects" ? "text-purple-400" : "text-gray-500"
                }`} />
                <span className="relative z-10">Projects</span>
                {activeTab === "projects" && (
                  <span className="relative z-10 ml-1 sm:ml-2 px-1 sm:px-2 py-0.5 sm:py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                    {projects?.length || 0}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {isLoading && (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {!isLoading && activeTab === "posts" && posts.length === 0 && (
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-700/50 p-6 sm:p-8 md:p-12 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center">
                  <Grid className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-400" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 leading-tight">No Posts Yet</h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">Be the first to share something with your campus community!</p>
              </div>
            )}
            
            {!isLoading && activeTab === "projects" && (!projects || projects.length === 0) && (
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-700/50 p-6 sm:p-8 md:p-12 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full flex items-center justify-center">
                  <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-400" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 leading-tight">No Projects Yet</h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">Start showcasing your amazing projects to the community!</p>
              </div>
            )}

            {activeTab === "posts"
              ? posts?.map((post, index) => (
                  <PostCard
                    key={index}
                    postId={post._id}
                    userId={post?.author?._id}
                    avatar={post.author.profileImage}
                    username={post?.author?.fullName}
                    time={format(
                      parseISO(post?.createdAt),
                      "dd MMM yyyy, hh:mm a"
                    )}
                    content={post.caption}
                    imageUrl={post.mediaUrl}
                    likes={post.likes}
                    comments={post.comments}
                  />
                ))
              : projects?.map((project, index) => (
                  <ProjectCard
                    key={index}
                    projectId={project._id}
                    userId={project?.userId?._id}
                    avatar={project?.userId?.profileImage}
                    username={project?.userId?.fullName}
                    time={project?.createdAt}
                    content={project?.description}
                    projectUrl={project?.projectUrl}
                    githubUrl={project?.githubUrl}
                    imageUrl={project?.mediaUrl}
                    skills={project?.TechStack}
                    likes={project?.likes}
                    comments={project?.comments}
                    contributors={project?.contributors}
                    projectName={project?.title}
                  />
                ))}
          </div>

          {/* Load More Button */}
          {hasMore && !isLoading && (
            <div className="mt-6 sm:mt-8 text-center">
              <button
                onClick={() => fetchPosts(page + 1)}
                className="px-6 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-blue-600/20 to-blue-700/20 border border-blue-500/50 text-blue-400 rounded-lg sm:rounded-xl hover:from-blue-600/30 hover:to-blue-700/30 hover:border-blue-400/50 transition-all duration-300 font-semibold text-sm sm:text-base"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Network;
