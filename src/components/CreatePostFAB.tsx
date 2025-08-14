import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CreatePostFAB: React.FC = () => {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on dashboard or create-post pages
  if (["/dashboard", "/create-post", "/login", "/" ].includes(location.pathname)) return null;

  return (
    <div
      onClick={() => navigate("/create-post")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: hover ? "flex-start" : "center",
        backgroundColor: "#e32857",
        borderRadius: "50px",
        padding: hover ? "10px 20px" : "0",
        cursor: "pointer",
        transition: "all 0.3s ease",
        width: hover ? "180px" : "60px",
        height: "60px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        //overflow: "hidden",
      }}
    >
      <img
        src="/assets/plus.png"  
        style={{
          width: "24px",
          height: "24px",
          objectFit: "contain",
          marginLeft: hover ? "0px" : "0",  
          transition: "margin 0.3s",
          filter: "invert(1)", 
        }}
      />
      <span
        style={{
          marginLeft: "12px",
          color: "#fff",
          fontWeight: "bold",
          opacity: hover ? 1 : 0,
          transition: "opacity 0.3s",
          whiteSpace: "nowrap",
        }}
      >
        Create Post
      </span>
    </div>
  );
};

export default CreatePostFAB;
