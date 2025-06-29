import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import AppLayout from "./ui/AppLayout";
import NoNavFooterLayout from "./ui/NoNavFooterLayout";
import Loader from "./components/Loader";
import Notice from "./pages/Notice";
import Post from "./pages/Post";
import FacultyPost from "./pages/FacultyPost";
import Events from "./pages/Events";
import Network from "./pages/Network";
import Chats from "./pages/Chats";
import SignUpPage from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import YourAccount from "./pages/YourAccount";
import PostProject from "./pages/PostProject";
import ClassRoom from "./pages/ClassRoom";
import CompleteYourProfile from "./pages/CompleteYourProfile";
import YourProfile from "./pages/YourProfile";
import NetworkProfile from "./pages/NetworkProfile";
import { ToastContainer } from "react-toastify";
import FacultyRole from "./pages/FacultyRole";
import Account from "./pages/Account";
import Search from "./pages/Search";

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
           
            
           
            
           
            
           
            <Route
              path="/Chats"
              element={
                <ProtectedRoute>
                  <Chats />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/Network" replace />} />
            <Route path="/Notice" element={<Notice />} />
            <Route path="/Events" element={<Events />} />
            <Route path="/Network" element={<Network />} />
            <Route path="/Account" element={<Account />} />
            <Route path="/FacultyPost" element={<FacultyPost />} />
            <Route path="/Search" element={<Search />} />
            <Route
              path="/Post"
              element={
                <ProtectedRoute>
                  <Post />
                </ProtectedRoute>
              }
            />
             <Route
              path="/FacultyRole"
              element={
                <ProtectedRoute>
                  <FacultyRole />
                </ProtectedRoute>
              }
            />
            <Route
              path="/CompleteYourProfile"
              element={
                <ProtectedRoute>
                  <CompleteYourProfile />
                </ProtectedRoute>
              }
            />
             <Route
              path="/NetworkProfile"
              element={
                <ProtectedRoute>
                  <NetworkProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/YourProfile"
              element={
                <ProtectedRoute>
                  <YourProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/PostProject"
              element={
                <ProtectedRoute>
                  <PostProject />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
              path="/YourAccount"
              element={
                <ProtectedRoute>
                  <YourAccount />
                </ProtectedRoute>
              }
            />
             <Route path="/ClassRoom" element={<ClassRoom />} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/Login" />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
