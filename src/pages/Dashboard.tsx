import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../components/AuthContext';

import { Link } from "react-router-dom";


{/*interface Metric {
  label: string;
  value: number;
  graphUrl: string;
}*/}

type Metric = {
  label: string;
  value: number;
};

type Post = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const firstName = (location.state as { firstName: string })?.firstName || "User";
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const { token, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]); // 🔑 New state for posts
  const [loading, setLoading] = useState(true);
  //const metricItems = ["Published Posts", "Scheduled Posts", "Engagements", "Likes"];

   {/*useEffect(() => {
    // Mocked data instead of API call
    const mockData: Metric[] = [
      { label: "Published Posts", value: 12 },
      { label: "Scheduled Posts", value: 5 },
      { label: "Engagements", value: 98 },
      { label: "Likes", value: 34 },
    ];
    setMetrics(mockData);
  }, []);*/}

  useEffect(() => {
    async function loadDashboardData() {
      if (!token) {
        logout();
        navigate("/login");
        return;
      }
      setLoading(true);

      try {
        const res = await fetch(
          "https://posted-ai-aqb4fvhqbhh2a2dg.centralus-01.azurewebsites.net/api/dashboard/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401) {
          logout();
          navigate("/login");
          return;
        }

        const data = await res.json();
        
        // 🔑 Calculate metrics from the real API data and combine with mock data
        const calculatedMetrics: Metric[] = [
          { label: "Published Posts", value: data.posts.length }, // Calculated from API
          { label: "Scheduled Posts", value: 5 }, // Mocked
          { label: "Engagements", value: 98 }, // Mocked
          { label: "Likes", value: 34 }, // Mocked
        ];
        
        setMetrics(calculatedMetrics);
        setPosts(data.posts);
      } catch (err) {
        console.error("Failed loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [token, logout, navigate]);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  {/*async function loadMetrics() {
      try {
        const res = await fetch("/api/metrics");
        const json: Metric[] = await res.json();
        setMetrics(json);
      } catch (err) {
        console.error("Failed loading metrics:", err);
      }
    }
    loadMetrics();
  }, []); */}

  return (

    <div>


      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          position: "relative",
        }}
      >
        {/* Left section with User & Dashboard */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", color: "#1c002d" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            <img src="src/assets/Vector.png" alt="Icon" style={{ height: "12px" }} />
            Hello {firstName}
          </div>

          <div
            style={{
              marginTop: "18px",
              fontWeight: "bold",
              fontSize: "24px",
              color: "#D63649",
            }}
          >
            Activity Analytics
          </div>
        </div>

        {/* Buttons aligned to the right */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="button" onClick={() => navigate("/saved-posts")}>Saved Posts</button>
          <button className="button" onClick={() => navigate("/create-post")}>Generate Post</button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="metric-cards" style={{ padding: "0 40px", display: "flex", gap: "20px" }}>
        {metrics.map((item, idx) => (
          <div key={idx} className="metric-card" style={{ flex: 1, background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
            <h4 style={{ fontSize: "16px", color: "#1c002d" }}>{item.label}</h4>
            <h1 style={{ fontSize: "28px", color: "#1c002d" }}>{item.value}</h1>
            {/*<img src={item.graphUrl} alt={`${item.label} graph`} style={{ width: "100%", marginTop: "10px" }} />*/}
          </div>
        ))}
      </div>

      {/* Post Sections */}
      <div className="posts-section" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "40px" }}>

        {/* Scheduled Posts Section */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1100px", marginBottom: "16px", padding: "0 15px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1c002d", margin: 0 }}>Scheduled Posts</h3>
            {/*<span style={{ fontSize: "14px", cursor: "pointer", color: "#666", padding: "20px 0" }} onClick={() => navigate("/scheduled-posts")}>
        View More →
      </span>*/}
            <Link
              to="/scheduled-posts"
              style={{
                float: "right",
                fontWeight: 600,
                textDecoration: "none",
                color: "#1c002d",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              View More &gt;
            </Link>

          </div>

          {/* cards */}
          <div style={{
            display: "flex",
            overflowX: "auto",
            gap: "20px",
            paddingBottom: "10px"
          }}>
            {[1, 2].map((_, i) => (
              <div key={i} style={{
                minWidth: "300px",
                background: "#fff",
                borderRadius: "12px",
                border: "1px solid #ddd",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                flexShrink: 0
              }}>
                <small style={{ fontSize: "13px", color: "#888" }}>3:30 PM, Fri Oct 23</small>
                <h4 style={{ margin: "10px 0", fontSize: "15px", fontWeight: "600", color: "#1c002d" }}>Did Figma just release one of the…</h4>
                <p style={{ fontSize: "13px", color: "#666", marginBottom: "10px" }}>
                  Being designer and dev 15 years, I’ve never seen a tool so promising deliver code this ba...
                </p>
                <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
                  <span className="tag">Design</span>
                  <span className="tag">Other</span>
                  <span className="tag">Back-end</span>
                </div>
                <a href="#" style={{ fontSize: "13px", fontWeight: "bold", color: "#e74c3c" }}>Read More →</a>
              </div>
            ))}
          </div>
        </div>

        {/* Published Posts Section */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1100px", marginBottom: "16px", padding: "0 15px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#1c002d", margin: 0 }}>Published Posts</h3>


            <Link
              to="/published-posts"
              style={{
                float: "right",
                fontWeight: 600,
                textDecoration: "none",
                color: "#1c002d",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              View More &gt;
            </Link>
          </div>

          <div style={{
            display: "flex",
            overflowX: "auto",
            gap: "20px",
            paddingBottom: "10px"
          }}>
            {[1, 2].map((_, i) => (
              <div key={i} style={{
                minWidth: "300px",
                background: "#fff",
                borderRadius: "12px",
                border: "1px solid #ddd",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                flexShrink: 0
              }}>
                <small style={{ fontSize: "13px", color: "#888" }}>3:30 PM, Fri Oct 23</small>
                <div style={{ height: "120px", backgroundColor: "#dbeaf2", borderRadius: "8px", margin: "12px 0" }} />
                <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
                  <span className="tag">Design</span>
                  <span className="tag">Other</span>
                </div>
                <h4 style={{ fontSize: "15px", fontWeight: "600", color: "#1c002d", marginBottom: "8px" }}>
                  Did Figma just release one of the worst website builders ever?
                </h4>
                <p style={{ fontSize: "13px", color: "#666" }}>
                  Being designer and dev 15 years, I’ve never seen a tool so promising deliver code this bad...
                </p>
                <button
                  style={{
                    marginTop: "10px",
                    padding: "10px 16px",
                    backgroundColor: "#6e44ff",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "14px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    width: "100%"
                  }}
                >
                  Go To Detail
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>

  );
};

export default Dashboard;
