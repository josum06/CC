import { BrowserRouter, Routes, Route } from 'react-router-dom';


import AppLayout from './ui/AppLayout';
import Notice from './pages/Notice';
import Post from './pages/Post';
import FacultyPost from './pages/FacultyPost';
import Events from './pages/Events';

import Network from './pages/Network';
import Companies from './pages/Companies';

import Chats from './pages/Chats';

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route element={<AppLayout />}>
        <Route path="/" />
                
                <Route path="/Notice" element={<Notice />} />
                <Route path="/Post" element={<Post />} />
                <Route path="/FacultyPost" element={<FacultyPost />} />
                <Route path="/Events" element={<Events />} />
               
                <Route path="/Network" element={<Network />} />
                <Route path="/Companies" element={<Companies/>} />
             
                <Route path="/Chats" element={<Chats/>} />
               </Route>
              </Routes>
      
    </BrowserRouter>
  );
}

export default App;
