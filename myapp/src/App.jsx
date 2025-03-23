import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Notice from "./pages/Notice";
import Post from "./pages/Post";
import FacultyPost from "./pages/FacultyPost";
import Events from "./pages/Events";
import Network from "./pages/Network";
import Companies from "./pages/Companies";
import Chats from "./pages/Chats";
import { ClerkProvider } from "@clerk/clerk-react";
import SignUpPage from "./pages/SignUp";
import Login from "./pages/Login";
import Home  from "./pages/Home";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;


function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <Routes>
          <Route path="/Signup" element={<SignUpPage />} />
          <Route path="/Login" element={<Login />} />
          <Route element={<AppLayout />} >
            <Route path="/" element={<Home/>} />
            <Route path="/Notice" element={<Notice />} />
            <Route path="/Post" element={<Post />} />
            <Route path="/FacultyPost" element={<FacultyPost />} />
            <Route path="/Events" element={<Events />} />
            <Route path="/Network" element={<Network />} />
            <Route path="/Companies" element={<Companies />} />
            <Route path="/Chats" element={<Chats />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
