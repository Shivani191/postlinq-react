import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from './components/AuthContext';
//import LinkedInStatus from './components/LinkedInStatus';
import ProtectedRoute from './components/ProtectedRoute';
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import SavedPosts from "./pages/SavedPosts";
import ScheduledPosts from "./pages/ScheduledPosts";
import PublishedPosts from "./pages/PublishedPosts";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";  // 
import CreatePostFAB from "./components/CreatePostFAB";
//import LinkedInCallback from './pages/LinkedInCallback';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 // generate a state to store token, will be generated from login page, setToken, use props to communicate with other pages
  return (
    <AuthProvider>
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div style={{ display: "flex" }}>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div style={{ flex: 1 }}>
        
        
          <Routes>
          
            <Route path="/" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
            <Route path="/create-post" element={<ProtectedRoute> <CreatePost />  </ProtectedRoute>} />
            <Route path="/saved-posts" element={<SavedPosts />} />
            <Route path="/scheduled-posts" element={<ScheduledPosts />} />
            <Route path="/published-posts" element={<PublishedPosts />} />
       
            
          </Routes>
          
          <CreatePostFAB />
        </div>
      </div>
    </div>
    </AuthProvider>
  );
}
