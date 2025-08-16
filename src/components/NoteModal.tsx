//src/components/NoteModal.tsx
import React, { useState } from "react";


type Note = { title: string; content: string; isNew?: boolean; };

type Props = {
  note: Note;
  onClose: () => void;
  onDelete: () => void;
  onSave: (updated: Note) => void;
};

const NoteModal: React.FC<Props> = ({ note, onClose, onDelete, onSave }) => {
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note title"
          className="modal-input"
        />
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Write your note..."
          className="modal-textarea"
        />
        <div className="modal-actions">
          <button onClick={() => onSave({ title, content })} disabled={!title.trim()}>
            Save
          </button>
          {!note.isNew && <button onClick={onDelete}>Delete</button>}
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
