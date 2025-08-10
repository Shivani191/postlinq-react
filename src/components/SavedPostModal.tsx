import React, { useState } from "react";


type Props = {
  post: { title: string; content: string; date: string };
  onClose: () => void;
  onDelete: () => void;
  onEdit: (updated: { title: string; content: string; date: string }) => void;
};

const SavedPostModal: React.FC<Props> = ({ post, onClose, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        {isEditing ? (
          <>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              className="modal-input"
            />
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              className="modal-textarea"
            />
            <div className="modal-actions">
              <button onClick={() => { onEdit({ ...post, title, content }); setIsEditing(false); }}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <h2>{title}</h2>
            <p>{content}</p>
            <div className="modal-actions">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={() => { onDelete(); }}>Delete</button>
              <button onClick={() => alert("Schedule flow here!")}>Schedule</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SavedPostModal;
