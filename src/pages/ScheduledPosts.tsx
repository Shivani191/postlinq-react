//src/pages/ScheduledPosts.tsx
import { useEffect, useState } from "react";



type ScheduledPost = {
  time: string;
  title: string;
  excerpt: string;
  tags: string[];
};

const ScheduledPosts = () => {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("scheduledPosts") || "[]");
    setPosts(stored);
  }, []);

  return (
    <>
      
      <div className="scheduled-posts-container">
        <div className="header-row">
          <h2>Scheduled Posts</h2>
        </div>
        <div className="card-grid">
          {posts.map((post, idx) => (
            <div key={idx} className="post-card">
              <span className="post-time">{post.time}</span>
              <h3 className="post-title">{post.title}</h3>
              <p className="post-excerpt">{post.excerpt}</p>
              <div className="tags">
                {post.tags.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
              <span className="read-more">Read More &gt;</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ScheduledPosts;
