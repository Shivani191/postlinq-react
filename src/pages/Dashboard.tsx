import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../components/AuthContext';
// 🔑 Type definitions for data consistency
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
    // 🔑 Hooks for navigation and global state management
    const navigate = useNavigate();
    
    const { token, logout, userName } = useAuth(); // Access global auth state

    // 🔑 State variables to store component data
    //const firstName = (location.state as { firstName: string })?.firstName || (userName || "User"); // Get name from state or context
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [scheduledPosts, setScheduledPosts] = useState<Post[]>([]);
    const [publishedPosts, setPublishedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true); // Tracks initial data loading state

    // 🔑 useEffect hook to fetch dashboard data on component mount
    // This runs once when the component loads and whenever the 'token' changes.
    useEffect(() => {
        async function loadDashboardData() {
            if (!token) {
                logout();
                navigate("/login");
                return;
            }
            setLoading(true);

            try {
                // 🔑 API call to get user profile and posts
                const res = await fetch(
                    "https://posted-ai-aqb4fvhqbhh2a2dg.centralus-01.azurewebsites.net/api/dashboard/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Authenticates the request with the JWT
                        },
                    }
                );

                if (res.status === 401) {
                    logout();
                    navigate("/login");
                    return;
                }

                const data = await res.json();
                
                const allPosts = data.posts || [];
                // 🔑 MOCK LOGIC: Separating posts for scheduled and published sections
                // This should be replaced with real data from your API when available
                setScheduledPosts(allPosts.filter((_: any, i: number) => i % 2 === 0)); 
                setPublishedPosts(allPosts.filter((_: any, i: number) => i % 2 !== 0));
                
                // 🔑 Calculate metrics from the fetched data
                const calculatedMetrics: Metric[] = [
                    { label: "Published Posts", value: allPosts.length },
                    { label: "Scheduled Posts", value: scheduledPosts.length },
                    { label: "Engagements", value: 0 },
                    { label: "Likes", value: 0 },
                ];
                
                setMetrics(calculatedMetrics);
            } catch (err) {
                console.error("Failed loading dashboard data:", err);
            } finally {
                setLoading(false);
            }
        }
        loadDashboardData();
    }, [token, logout, navigate]); // Dependencies for the effect

    // 🔑 Conditional rendering for loading state
    if (loading) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div className="dashboard-container">
            {/* 🔑 Top section of the dashboard */}
            <div className="dashboard-header">
                {/* User welcome message */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", color: "#1c002d" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: "bold", fontSize: "20px" }}>
                        <img src="assets/Vector.png" alt="Icon" style={{ height: "12px" }} />
                        Hello {userName || "User"}
                    </div>
                    <div style={{ marginTop: "18px", fontWeight: "bold", fontSize: "24px", color: "#D63649" }}>
                        Activity Analytics
                    </div>
                </div>

                {/* Navigation buttons */}
                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="button" onClick={() => navigate("/saved-posts")}>Saved Posts</button>
                    <button className="button" onClick={() => navigate("/create-post")}>Generate Post</button>
                </div>
            </div>

            <div className="main-content-wrapper">
                {/* 🔑 Metric Cards Section */}
                <div className="metric-cards-container">
                    {metrics.map((item, idx) => (
                        <div key={idx} className="metric-card">
                            <h4 style={{ fontSize: "16px", color: "#1c002d" }}>{item.label}</h4>
                            <h1 style={{ fontSize: "28px", color: "#1c002d" }}>{item.value}</h1>
                        </div>
                    ))}
                </div>

                {/* 🔑 Post Sections Container */}
                <div className="posts-section">
                    {/* Scheduled Posts */}
                    <div style={{ flex: 1 }}>
                        <div className="section-header">
                            <h3 className="section-title">Scheduled Posts</h3>
                            {/* 🔑 Conditional rendering for "View More" link */}
                            {scheduledPosts.length > 3 && (
                                <Link to="/scheduled-posts" className="view-more-link">
                                    View More &gt;
                                </Link>
                            )}
                        </div>
                        {/* 🔑 Conditional rendering for posts vs. no-posts message */}
                        {scheduledPosts.length > 0 ? (
                            <div className="posts-list">
                                {scheduledPosts.slice(0, 2).map((post) => (
                                    <div key={post.id} className="post-card">
                                        <div className="post-card-content">
                                            <small style={{ fontSize: "13px", color: "#888" }}>{new Date(post.created_at).toLocaleString()}</small>
                                            <h4 style={{ margin: "10px 0", fontSize: "15px", fontWeight: "600", color: "#1c002d" }}>{post.title}</h4>
                                            <p style={{ fontSize: "13px", color: "#666", marginBottom: "10px" }}>
                                                {post.content.length > 100 ? `${post.content.slice(0, 100)}...` : post.content}
                                            </p>
                                        </div>
                                        <div className="post-tags">
                                            <span className="tag">...</span>
                                        </div>
                                        <a href="#" style={{ fontSize: "13px", fontWeight: "bold", color: "#e74c3c" }}>Read More →</a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
                                <p>No scheduled posts yet. <Link to="/create-post">Create one!</Link></p>
                            </div>
                        )}
                    </div>

                    {/* Published Posts */}
                    <div style={{ flex: 1 }}>
                        <div className="section-header">
                            <h3 className="section-title">Published Posts</h3>
                            {/* 🔑 Conditional rendering for "View More" link */}
                            {publishedPosts.length > 3 && (
                                <Link to="/published-posts" className="view-more-link">
                                    View More &gt;
                                </Link>
                            )}
                        </div>
                        {/* 🔑 Conditional rendering for posts vs. no-posts message */}
                        {publishedPosts.length > 0 ? (
                            <div className="posts-list">
                                {publishedPosts.slice(0, 2).map((post) => (
                                    <div key={post.id} className="post-card">
                                        {post.image_url && <div className="post-card-image" style={{ backgroundImage: `url(${post.image_url})` }} />}
                                        <div className="post-card-content">
                                            <small style={{ fontSize: "13px", color: "#888" }}>{new Date(post.created_at).toLocaleString()}</small>
                                            <h4 style={{ fontSize: "15px", fontWeight: "600", color: "#1c002d", marginBottom: "8px" }}>{post.title}</h4>
                                            <p style={{ fontSize: "13px", color: "#666" }}>
                                                {post.content.length > 100 ? `${post.content.slice(0, 100)}...` : post.content}
                                            </p>
                                        </div>
                                        <button className="button" style={{ marginTop: "10px", width: "100%" }}>
                                            Go To Detail
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
                                <p>No published posts yet. <Link to="/create-post">Create one!</Link></p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;