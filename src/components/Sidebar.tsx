import React from "react";
import { NavLink, useNavigate} from "react-router-dom";
import { useAuth } from "./AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth(); // Get the logout function
  const navigate = useNavigate(); // Get the navigate function

  const handleLogout = () => {
    logout(); // Clear the token from AuthContext and sessionStorage
    navigate("/login"); // Redirect to the login page
    onClose(); // Close the sidebar after logging out
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: "/src/assets/dashboard.svg" },
    { label: "Saved Posts", path: "/saved-posts", icon: "/src/assets/save.svg" },
    { label: "Scheduled Posts", path: "/scheduled-posts", icon: "/src/assets/schedule.svg" },
    { label: "Published Posts", path: "/published-posts", icon: "/src/assets/publish.svg" },
    //{ label: "Notes", path: "/saved-posts", icon: "/src/assets/notes.svg" },
    { label: "Settings", path: "/settings", icon: "/src/assets/settings.svg" },
    { label: "Help", path: "/help", icon: "/src/assets/help.svg" },
  ];

  return (
    <div
    className="sidebar"
    style={{
      width: isOpen ? 220 : 0,
      overflow: "hidden",
      transition: "width 0.3s ease",
      backgroundColor: isOpen ? "#fff" : "transparent",
      borderRight: isOpen ? "1px solid #ddd" : "none",
      paddingTop: isOpen ? "20px" : "0",
      height: "100vh",
    }}
  >
  
      <div className="nav-items" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "16px", paddingLeft: "20px" }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "14px",
              color: "#1c002d",
              textDecoration: "none",
              width: "100%",
            }}
          >
            <img src={item.icon} alt={item.label} style={{ width: 18, height: 18 }} />
            <span>{item.label}</span>
          </NavLink>
        ))}
         {/* Logout button */}
      <button 
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "14px",
          color: "#1c002d",
          textDecoration: "none",
          width: "100%",
          paddingLeft: "20px", // Match padding of other links
          background: "none",
          border: "none",
          cursor: "pointer",
          marginTop: "auto", // Push the logout button to the bottom
          paddingBottom: "20px",
        }}
      >
        <img src="/src/assets/logout.png" alt="Logout" style={{ width: 18, height: 18 }} />
        <span>Logout</span>
      </button>
      </div>
    </div>
  );
};

export default Sidebar;
