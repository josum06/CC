import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Notice from "./pages/Notice";
import Post from "./pages/Post";
import FacultyPost from "./pages/FacultyPost";
import Events from "./pages/Events";
import Network from "./pages/Network";
import Companies from "./pages/Companies";
import Chats from "./pages/Chats";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import SignUpPage from "./pages/SignUp";
import Login from "./pages/Login";
import Loader from "./components/Loader";
import Home from "./pages/Home";
import YourAccount from "./pages/YourAccount";
import CompleteYourProfile from "./pages/CompleteYourProfile";
import NoNavFooterLayout from "./ui/NoNavFooterLayout"; // Import the new layout

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded)
    return (
      <div className="flex justify-center items-center fixed inset-0">
        <Loader />
      </div>
    ); // Show loading state while Clerk is loading

  if (!userId) {
    // If user is not authenticated, redirect to login
    return <Navigate to="/Login" />;
  }

  return children; // If authenticated, render children components
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <Routes>
          <Route path="/Signup" element={<SignUpPage />} />
          <Route path="/Login" element={<Login />} />

          {/* Protected routes with Navbar and Footer */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" index element={<Home />} />
            <Route path="/Notice" element={<Notice />} />
            <Route path="/Post" element={<Post />} />
            <Route path="/FacultyPost" element={<FacultyPost />} />
            <Route path="/Events" element={<Events />} />
            <Route path="/Network" element={<Network />} />
            <Route path="/Companies" element={<Companies />} />
            <Route path="/Chats" element={<Chats />} />
         
           
          </Route>

          {/* Routes without Navbar and Footer */}
          <Route element={<NoNavFooterLayout />}>
            {/* These pages don't require Navbar and Footer */}
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<SignUpPage />} />
            <Route path="/YourAccount" element={<YourAccount />} />
            <Route path="/CompleteYourProfile" element={<CompleteYourProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/Login" />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
