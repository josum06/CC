import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Share2, Grid, Briefcase, MapPin, Link as LinkIcon, Heart, MessageCircle } from 'lucide-react';
import PostCard from '../components/PostCard';
import Comments from '../components/Comments';

function NetworkProfile() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'projects'
    const [selectedPost, setSelectedPost] = useState(null);

    // Dummy data - replace with actual data from your backend
    const userProfile = {
        name: "John Doe",
        username: "@johndoe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        bio: "Full Stack Developer | Open Source Contributor",
        location: "San Francisco, CA",
        website: "https://johndoe.dev",
        skills: ["React", "Node.js", "Python", "AWS", "TypeScript"],
        stats: {
            posts: 42,
            projects: 12,
            followers: 1234,
            following: 567
        }
    };

    // Dummy posts data - replace with actual data
    const posts = [
        {
            id: 1,
            imageUrl: "https://source.unsplash.com/random/800x800?1",
            likes: 124,
            comments: 8,
            content: "This is a sample post caption",
            username: "John Doe",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
            time: "2 hours ago",
        },
        // Add more posts...
    ];

    const handlePostClick = (post) => {
        setSelectedPost(post);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <div className="sticky top-0 z-50  border-b bg-gray-200 px-4 py-3 flex items-center justify-between">
                <button 
                    onClick={() => navigate('/Network')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={24} className="text-gray-600" />
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
                                src={userProfile.avatar} 
                                alt={userProfile.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                            <div className="flex gap-2">
                                <button className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                                    Message
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <Share2 size={20} className="text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 mb-4">
                            <div className="text-center">
                                <div className="font-bold">{userProfile.stats.posts}</div>
                                <div className="text-sm text-gray-500">Posts</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold">{userProfile.stats.projects}</div>
                                <div className="text-sm text-gray-500">Projects</div>
                            </div>
                            
                        </div>

                        {/* Bio and Details */}
                        <div className="space-y-2">
                            <p className="font-medium text-gray-900">{userProfile.username}</p>
                            <p className="text-gray-600">{userProfile.bio}</p>
                           
                            <div className="flex items-center gap-2 text-blue-600">
                                <LinkIcon size={16} />
                                <a href={userProfile.website} target="_blank" rel="noopener noreferrer" 
                                   className="hover:underline">{userProfile.website}</a>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {userProfile.skills.map((skill, index) => (
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
                            onClick={() => setActiveTab('posts')}
                            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                                activeTab === 'posts' 
                                    ? 'border-blue-500 text-blue-500' 
                                    : 'border-transparent text-gray-500'
                            }`}
                        >
                            <Grid size={20} />
                            <span>Posts</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('projects')}
                            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                                activeTab === 'projects' 
                                    ? 'border-blue-500 text-blue-500' 
                                    : 'border-transparent text-gray-500'
                            }`}
                        >
                            <Briefcase size={20} />
                            <span>Projects</span>
                        </button>
                    </div>

                    {/* Post Modal */}
                    {selectedPost && (
                        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
                            <div className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
                                {/* Close button */}
                                <button
                                    onClick={() => setSelectedPost(null)}
                                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 z-50"
                                >
                                    <X size={20} className="text-gray-600" />
                                </button>

                                {/* Image Section */}
                                <div className="w-full md:w-7/12 bg-black flex items-center">
                                    <img
                                        src={selectedPost.imageUrl}
                                        alt="Post content"
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                {/* Details Section */}
                                <div className="w-full md:w-5/12 flex flex-col h-full">
                                    {/* Post Header */}
                                    <div className="p-4 border-b">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src={selectedPost.avatar}
                                                alt={selectedPost.username}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-semibold">{selectedPost.username}</p>
                                                <p className="text-xs text-gray-500">{selectedPost.time}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Comments Section */}
                                    <div className="flex-1 overflow-y-auto">
                                        <Comments postId={selectedPost.id} />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="p-4 border-t bg-white">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-4">
                                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                                    <Heart size={24} className="text-gray-700" />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                                    <MessageCircle size={24} className="text-gray-700" />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                                    <Share2 size={24} className="text-gray-700" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-sm mb-2">{selectedPost.likes} likes</p>
                                        <p className="text-sm text-gray-500">{selectedPost.time}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Grid */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeTab === 'posts' ? (
                            // Posts Grid with hover effects
                            posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group cursor-pointer"
                                    onClick={() => handlePostClick(post)}
                                >
                                    <img
                                        src={post.imageUrl}
                                        alt="Post"
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                                        <div className="flex items-center space-x-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <div className="flex items-center text-white">
                                                <Heart size={24} className="fill-white" />
                                                <span className="ml-2 font-semibold">{post.likes}</span>
                                            </div>
                                            <div className="flex items-center text-white">
                                                <MessageCircle size={24} className="fill-white" />
                                                <span className="ml-2 font-semibold">{post.comments}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Projects Grid - Replace with actual projects data
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <h3 className="font-semibold mb-2">Project {i + 1}</h3>
                                    <p className="text-gray-600 text-sm">
                                        Project description goes here...
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NetworkProfile;
