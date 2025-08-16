//src/pages/PublishedPosts.tsx
import React, { useState, useEffect } from "react";


type Post = {
  time: string;
  title: string;
  excerpt: string;
  tags: string[];
};

const PublishedPosts: React.FC = () => {
  const [publishedPosts, setPublishedPosts] = useState<Post[]>([]);

  useEffect(() => {
    // ➡️ Replace this later with a real API call
    const fetchPublishedPosts = async () => {
      try {
        // Example: const response = await fetch("/api/published-posts");
        // const data = await response.json();
        // setPublishedPosts(data);

        // For now, mocked data:
        setPublishedPosts([
          {
            time: "3:30 PM, Fri Oct 23",
            title: "Did Figma just release one of the worst website builders ever?",
            excerpt:
              "Being designer and dev 15 years, I’ve never seen a tool so promising deliver code this bad...",
            tags: ["Design", "Other", "Frontend"],
          },
        ]);
      } catch (error) {
        console.error("Failed to load published posts:", error);
      }
    };

    fetchPublishedPosts();
  }, []);

  return (
    <>
   
      <div className="published-container">
        <h2>Published Posts</h2>

        {publishedPosts.length === 0 ? (
          <p className="no-posts">No posts published</p>
        ) : (
          <div className="published-cards">
            {publishedPosts.map((post, i) => (
              <div key={i} className="published-card">
                <small>{post.time}</small>
                <div className="image-placeholder" />
                <div className="post-tags">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <h4>{post.title}</h4>
                <p className="excerpt">{post.excerpt}</p>
                <button className="detail-button">Go To Detail</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PublishedPosts;
