//src/components/Header.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import useAuth
//import linkedinIcon from "public/assets/linkedin.png"; // Make sure you have this icon
//import LinkedInStatus from "./LinkedInStatus";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
 // Get the session token
const { token, linkedInStatus } = useAuth(); 
  const [isHovered, setIsHovered] = useState(false);

  if ([ "/login", "/" ].includes(location.pathname)) return null;

  const handleConnect = () => {
    if (!token) {
      console.error('User not authenticated.');
      return;
    }

    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86ea7a33nduyat&redirect_uri=http://posted-ai-aqb4fvhqbhh2a2dg.centralus-01.azurewebsites.net/linkedin/auth/callback&state=${token}&scope=openid%20profile%20email%20w_member_social`;
    console.log(linkedInAuthUrl);
    window.open(linkedInAuthUrl, '_blank');
  };
const buttonColor = linkedInStatus === 'connected' ? '#2ecc71' : '#0A66C2';
  const buttonText = linkedInStatus === 'connected' ? 'Connected' : 'Connect to LinkedIn';

  return (
    <header style={headerStyles}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

        <img
          src="/assets/menu.svg"
          alt="Menu"
          style={{ height: 34, cursor: "pointer" }}
          onClick={toggleSidebar}
        />
        <img
          src="/assets/logo.png"
          alt="Logo"
          style={{ height: 30, cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        />
      </div>

      <div style={{ display: "flex",  gap: "30px" }}>
          <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={linkedInStatus === 'connected' ? undefined : handleConnect}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "2px 6px",
            borderRadius: "6px",
            backgroundColor: isHovered ? buttonColor : "transparent",
            //border: `1px solid #0A66C2`,
            cursor: linkedInStatus === 'connected' ? "default" : "pointer",
            transition: "all 0.3s ease",
          }}
        >
          <img
            src="/assets/linkedin.png"
            alt="LinkedIn"
            style={{ width: 24, height: 24,  }} //filter: isHovered ? "invert(1)" : "none"
          />
          {isHovered && (
            <span style={{ marginLeft: "8px", color:  "#fff", fontWeight: "bold" }}>
              {buttonText}
            </span>
          )}
        </div>


        <img src="/assets/notification.png" alt="Notifications" style={{ width: 24, height: 24 }} />
        <img src="/assets/user.png" alt="User" style={{ width: 24, height: 24 }} />
      </div>
    </header>
  );
};

const headerStyles: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 100,
  backgroundColor: "#fff",
  padding: "20px 30px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #ddd",
};

export default Header;