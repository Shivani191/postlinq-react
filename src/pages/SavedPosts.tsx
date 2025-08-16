//src/pages/SavedPosts.tsx
import { useState, useEffect } from "react";
import SavedPostModal from "../components/SavedPostModal";
import NoteModal from "../components/NoteModal";

import { useLocation } from "react-router-dom";


type Post = {
  title: string;
  content: string;
  date: string;
};
type Note = {
  title: string;
  content: string;
  date?: string;
  isNew?: boolean;
};

const SavedPosts: React.FC = () => {

  const location = useLocation();
  const newPost = location.state?.newPost;

  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    if (newPost) {
      setSavedPosts((prev) => [...prev, newPost]);
    }
  }, [newPost]);

  const formatDate = (dateStr: string) => {
    const savedDate = new Date(dateStr);
    const today = new Date();
    const diff = Math.floor((today.getTime() - savedDate.getTime()) / (1000 * 60 * 60 * 24));
    return `${savedDate.toDateString()} • ${diff === 0 ? "Today" : `${diff} day${diff > 1 ? "s" : ""} ago`}`;
  };

  const filteredPosts = savedPosts.filter(
    post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    
      <div className="saved-container" style={{ padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2>Saved Posts</h2>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "250px",
            }}
          />
        </div>

        <div className="cards-row" style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "15px" }}>
          {filteredPosts.length === 0 ? (
            <p>No posts saved</p>
          ) : (
            filteredPosts.map((post, i) => (
              <div
                key={i}
                className="card"
                onClick={() => setSelectedPost(post)}
                style={{
                  width: "calc(20% - 16px)",
                  background: "#fff",
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                }}
              >
                <h4 style={{ marginBottom: "8px" }}>{post.title}</h4>
                <p style={{ fontSize: "14px", color: "#555", marginBottom: "12px" }}>
                  {post.content.length > 60 ? post.content.slice(0, 60) + "…" : post.content}
                </p>
                <span style={{ fontSize: "12px", color: "#999" }}>
                  {formatDate(post.date)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Notes Section */}
        <div style={{ marginTop: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Notes</h2>
            <button
              onClick={() => setSelectedNote({ title: "", content: "", isNew: true })}
              style={{
                padding: "8px 12px",
                fontSize: "14px",
                borderRadius: "6px",
                background: "#e32857",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Create a note +
            </button>
          </div>

          <div className="cards-row" style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "15px" }}>
            {notes.length === 0 ? (
              <p>No notes yet</p>
            ) : (
              notes.map((note, i) => (
                <div
                  key={i}
                  className="card"
                  onClick={() => setSelectedNote(note)}
                  style={{
                    width: "calc(20% - 16px)",
                    background: "#fff",
                    borderRadius: "8px",
                    padding: "16px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                  }}
                >
                  <h4 style={{ marginBottom: "8px" }}>{note.title || "Untitled"}</h4>
                  <p style={{ fontSize: "14px", color: "#555" }}>
                    {note.content.length > 60 ? note.content.slice(0, 60) + "…" : note.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal handlers */}
        {selectedPost && (
          <SavedPostModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            onDelete={() => {
              setSavedPosts(prev => prev.filter(p => p !== selectedPost));
              setSelectedPost(null);
            }}
            onEdit={updated => {
              setSavedPosts(prev =>
                prev.map(p => (p === selectedPost ? updated : p))
              );
              setSelectedPost(null);
            }}
          />
        )}
        {selectedNote && (
          <NoteModal
            note={selectedNote}
            onClose={() => setSelectedNote(null)}
            onDelete={() => {
              setNotes(prev => prev.filter(n => n !== selectedNote));
              setSelectedNote(null);
            }}
            onSave={updated => {
              if (selectedNote.isNew) {
                setNotes(prev => [...prev, updated]);
              } else {
                setNotes(prev =>
                  prev.map(n => (n === selectedNote ? updated : n))
                );
              }
              setSelectedNote(null);
            }}
          />
        )}
      </div>
    </>
  );
};


export default SavedPosts;
