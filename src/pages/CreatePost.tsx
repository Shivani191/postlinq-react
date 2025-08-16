//src/pages/CreatePost.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ScheduleDialog from "../components/ScheduleDialog";
import IconBar from "../components/IconBar";
import { useAuth } from "../components/AuthContext";

type Mode = "idle" | "select" | "final";

const CreatePost: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [apiLoading, setApiLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [useImage, setUseImage] = useState(true);
  const [mode, setMode] = useState<Mode>("idle");
  const [posts, setPosts] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [customText, setCustomText] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [editedText, setEditedText] = useState(customText);
  const [showTitlePrompt, setShowTitlePrompt] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [isLinkedInConnected, setIsLinkedInConnected] = useState<boolean | null>(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  const navigate = useNavigate();
  const { token, logout } = useAuth();
  // New useEffect to verify LinkedIn connection
  useEffect(() => {
    const verifyLinkedInToken = async () => {
      if (!token) {
        setIsLinkedInConnected(false);
        return;
      }
      try {
        const res = await fetch("https://posted-ai-aqb4fvhqbhh2a2dg.centralus-01.azurewebsites.net/linkedin/verify-token", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.status === 401 || res.status === 404) {
          setIsLinkedInConnected(false);
        } else {
          const isValid = await res.json();
          setIsLinkedInConnected(isValid);
        }
      } catch (error) {
        console.error("Error verifying LinkedIn token:", error);
        setIsLinkedInConnected(false);
      }
    };
    verifyLinkedInToken();
  }, [token]);

  const handleGenerate = async () => {
    if (!token) {
      logout();
      navigate("/login");
      return;
    }
    if (!prompt.trim()) return;
    setApiLoading(true); // Start loading
    setLoadingMessage("Agent is searching the web..."); // Initial message

    setPosts([]); 

    try {
      const res = await fetch("https://posted-ai-aqb4fvhqbhh2a2dg.centralus-01.azurewebsites.net/api/content/generate-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ summary: prompt }),
      });
      if (res.status === 401) { // Handle token expiration/invalidation
        logout();
        navigate("/login");
      }
      const data = await res.json();
      // 🔑 Clear the prompt here
      setPrompt(""); 
      // After the first API call is complete, update the message
      setLoadingMessage("Generating posts...");

      // Assume another API call or a heavy task here
      // For this example, we'll simulate it with a small delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setPosts(data.posts);
      setMode("select");
    } catch (err) {
      alert("Error generating post suggestions");
    }
    finally {
      setApiLoading(false); // Stop loading
      setLoadingMessage(""); // Clear message
    }
  };

  const handleSelectStyle = async (index: number) => {
    const content = posts[index];
    setSelectedIndex(index);
    setCustomText(content);
    setMode("final");

    if (useImage) {
      setApiLoading(true);
      setLoadingMessage("Generating image...");

      try {
        const res = await fetch("https://posted-ai-aqb4fvhqbhh2a2dg.centralus-01.azurewebsites.net/api/content/generate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ selected_post_content: content }),
        });
        const data = await res.json();
        setImageUrl(data.image_paths?.[0] || null);
      } catch (err: any) {
        console.error("Error generating image:", err);
        alert(err.message || "Error generating image.");
      } finally {
        // 🔑 Stop the loader regardless of the outcome
        setApiLoading(false);
        setLoadingMessage("");
      }
    }
  };

  const handleAction = (type: string) => {
    switch (type) {
      case "back":
        setMode("select");
        setSelectedIndex(null);
        setIsEditing(false);
        setCustomText("");
        break;
      case "edit":
        if (selectedIndex !== null) {
          setEditedText(customText);
          setIsEditing(true);
        }
        break;
      case "regenerate":
        setMode("select");
        setSelectedIndex(null);
        setIsEditing(false);
        setCustomText("");
        break;
      case "save":
        setShowTitlePrompt(true);
        break;
      case "schedule":
        setShowSchedule(true);
        break;
    }
  };

  const confirmSave = () => {
    if (selectedIndex === null || !saveTitle.trim()) return;
    const newPost = {
      title: saveTitle.trim(),
      content: customText,
      date: new Date().toISOString(),
    };
    navigate("/saved-posts", { state: { newPost } });
    setShowTitlePrompt(false);
  };

  const renderCard = (text: string, index: number) => (
    <div
      key={index}
      onClick={() => handleSelectStyle(index)}
      onMouseEnter={() => setHoveredCardIndex(index)}
      onMouseLeave={() => setHoveredCardIndex(null)}
      style={{
        flex: 1,
        border: hoveredCardIndex === index ? "1px solid #D63649" : "1px solid #C5C5C5",
      borderRadius: "10px",
      padding: "20px",
      background: "#fff",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      boxShadow: hoveredCardIndex === index ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none",
      transform: hoveredCardIndex === index ? "translateY(-2px)" : "none",
    }}
    >
      <p style={{ fontSize: "14px", whiteSpace: "pre-line", color: "#333" }}>{text}</p>
    </div>
  );

  const publishToLinkedIn = async () => {
    if (!token) {
      logout();
      navigate('/login');
      return;
    }
    if (!isLinkedInConnected) {
      alert("Please connect your LinkedIn account before publishing.");
      return;
    }

    setApiLoading(true);
    setLoadingMessage("Publishing to LinkedIn...");

    try {
      const res = await fetch('https://posted-ai-aqb4fvhqbhh2a2dg.centralus-01.azurewebsites.net/linkedin/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          selected_post: customText,
          selected_image: imageUrl,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to publish to LinkedIn.');
      }

      const data = await res.json();
      alert('Post published successfully!');
      console.log(data.result);
      navigate("/dashboard");

    } catch (error: any) {
      console.error('Publishing error:', error.message);
      alert('Error: ' + error.message);
    } finally {
      setApiLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div style={{ position: "relative", display: "flex", height: "100vh", backgroundColor: "#f1ecf5" }}>
      {apiLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          {/* Replace the image with the span for your spinner */}
          <span className="loader"></span>
          <p style={{ marginTop: "10px", fontSize: "16px", color: "#333" }}>
            {loadingMessage}
          </p>
        </div>
      )}

      <div style={{ width: "280px", background: "#ffffff", borderRight: "1px solid #ddd", padding: "30px 20px" }}>
        <h3 style={{ color: "#1c002d", fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>Content Queue</h3>
        <div style={{ fontSize: "12px", fontWeight: "600", color: "#888", backgroundColor: "#e5e3e8", padding: "4px 10px", borderRadius: "6px", marginBottom: "10px" }}>
          Today
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px", backgroundColor: "#ffffff" }}>
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: "160px" }}>
          {mode === "select" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <button
                  onClick={handleGenerate}
                  style={{
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Regenerate
                </button>
                <h2 style={{ color: "#1c002d", fontWeight: "bold", margin: 0 }}>Choose your post style</h2>
                <div style={{ width: "120px" }} />
              </div>
              <div style={{ display: "flex", gap: "20px" }}>{posts.map(renderCard)}</div>
            </>
          )}

          {mode === "final" && selectedIndex !== null && (
            <>
              <IconBar onAction={handleAction} />
              <ScheduleDialog
                open={showSchedule}
                onClose={() => setShowSchedule(false)}
                onSubmit={async (datetime) => {
                  const newScheduledPost = {
                    time: new Date(datetime).toLocaleString(),
                    title: saveTitle || `Post ${selectedIndex + 1}`,
                    excerpt: customText.slice(0, 90) + "...",
                    tags: ["Design", "Other", "Back-end"],
                  };
                  const existing = JSON.parse(localStorage.getItem("scheduledPosts") || "[]");
                  localStorage.setItem("scheduledPosts", JSON.stringify([...existing, newScheduledPost]));
                  setShowSchedule(false);
                  alert("Post scheduled successfully!");
                }}
              />
              <div style={{ background: "#fff", borderRadius: "10px", padding: "20px", border: "1px solid #C5C5C5" }}>
                {isEditing ? (
                  <>
                    <textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      style={{
                        width: "100%",
                        height: "200px",
                        fontSize: "14px",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        resize: "vertical",
                      }}
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                      <button onClick={() => setIsEditing(false)}>Cancel</button>
                      <button onClick={() => { setCustomText(editedText); setIsEditing(false); }}>Save</button>
                    </div>
                  </>
                ) : (
                  <p style={{ fontSize: "14px", whiteSpace: "pre-line", color: "#333" }}>{customText}</p>
                )}
                {useImage && imageUrl && (
                  <img src={imageUrl} alt="Generated" style={{ marginTop: "20px", width: "300px", borderRadius: "8px" }} />
                )}
              </div>
              {/* New Publish Button */}
              <div style={{ marginTop: "20px", textAlign: "right" }}>
                {isLinkedInConnected === false && (
                  <p style={{ color: "red", fontSize: "12px", marginBottom: "8px" }}>
                    LinkedIn not connected!
                  </p>
                )}
                <button
                  onClick={publishToLinkedIn}
                  disabled={isLinkedInConnected === false || apiLoading}
                  style={{
                    background: isLinkedInConnected ? "#0A66C2" : "#999",
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: isLinkedInConnected ? "pointer" : "not-allowed",
                  }}
                >
                  {apiLoading ? "Publishing..." : "Publish to LinkedIn"}
                </button>
              </div>
            </>
          )}
        </div>
        {mode !== "final" && (
        <div
          style={{
            marginTop: "20px",
            background: "#ffffff",
            border: "1px solid #ccc",
            borderRadius: "16px",
            padding: "20px 30px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            position: "sticky",
            bottom: "0",
            zIndex: 1,
          }}
        >
          <textarea
            placeholder="Type here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={2}
            style={{
              resize: "none",
              border: "none",
              background: "transparent",
              fontSize: "16px",
              outline: "none",
              color: "#1c002d",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#444" }}>
              Image
              <label className="switch">
                <input type="checkbox" checked={useImage} onChange={() => setUseImage(!useImage)} />
                <span className="slider round"></span>
              </label>
            </div>
            <button
              onClick={handleGenerate}
              style={{
                background: "#e32857",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "20px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
              }}
              title="Generate"
            >
              ↑
            </button>
          </div>
        </div>
        )}
      </div>
            
      {showTitlePrompt && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)", display: "flex",
          justifyContent: "center", alignItems: "center",
        }}>
          <div style={{
            background: "#fff", padding: "20px", borderRadius: "8px",
            width: "300px", boxSizing: "border-box",
          }}>
            <h3>Save Post</h3>
            <input
              type="text"
              placeholder="Enter title"
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
              style={{ width: "100%", padding: "8px", margin: "12px 0" }}
            />
            <div style={{ textAlign: "right" }}>
              <button onClick={() => setShowTitlePrompt(false)} style={{ marginRight: 8 }}>Cancel</button>
              <button disabled={!saveTitle.trim()} onClick={confirmSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
