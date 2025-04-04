import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import AppLayout from "./ui/AppLayout";
import NoNavFooterLayout from "./ui/NoNavFooterLayout";
import Loader from "./components/Loader";

// Pages
import Notice from "./pages/Notice";
import Post from "./pages/Post";
import FacultyPost from "./pages/FacultyPost";
import Events from "./pages/Events";
import Network from "./pages/Network";
import Companies from "./pages/Companies";
import Chats from "./pages/Chats";
import SignUpPage from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import YourAccount from "./pages/YourAccount";

import PostProject from "./pages/PostProject";
import ClassRoom from "./pages/ClassRoom";
import AuthorityRegister from "./pages/AuthorityRegister"; // Added missing import
import CompleteYourProfile from "./pages/CompleteYourProfile";
import YourProfile from "./pages/YourProfile";
import NetworkProfile from "./pages/NetworkProfile";
import { ToastContainer } from "react-toastify";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// 🔒 Protected Route Component
function ProtectedRoute({ children }) {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center fixed inset-0">
        <Loader />
      </div>
    );
  }

  if (!userId) {
    return <Navigate to="/Login" />;
  }

  return children;
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>

      <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public Routes */}
          <Route element={<NoNavFooterLayout />}>
            <Route path="/Signup" element={<SignUpPage />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Post" element={<Post />} />
            <Route path="/PostProject" element={<PostProject />} />
            <Route path="/AuthorityRegister" element={<AuthorityRegister />} />
            <Route path="/CompleteYourProfile" element={<CompleteYourProfile />} />
            <Route path="/YourProfile" element={<YourProfile />} />
            <Route path="/NetworkProfile" element={<NetworkProfile />} />
          </Route>

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
            >
            <Route path="/" index element={<Home />} />
            <Route path="/Notice" element={<Notice />} />
            <Route path="/Events" element={<Events />} />
            <Route path="/Network" element={<Network />} />
            <Route path="/Companies" element={<Companies />} />
            <Route path="/Chats" element={<Chats />} />
            <Route path="/YourAccount" element={<YourAccount />} />
            <Route path="/FacultyPost" element={<FacultyPost />} />
            <Route path="/ClassRoom" element={<ClassRoom />} />
          
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/Login" />} />
        </Routes>

      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
