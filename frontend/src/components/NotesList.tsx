"use client";

import { useEffect, useState } from "react";

type Note = {
  title: string;
  content: string;
};

export default function NotesList({ refresh }: any) {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const res = await fetch("http://localhost:8000/all-notes");
      const data = await res.json();
      setNotes(data);
    };

    fetchNotes();
  }, [refresh]);

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <span className="panel-dot" />
          Recent Notes
        </div>
      </div>

      <div className="notes-body">
        {notes.length === 0 ? (
          <p>No notes yet</p>
        ) : (
          notes.map((note, i) => (
            <div key={i} className="note-item">
              <div>
                <div className="note-title">{note.title}</div>
                <div className="note-preview">{note.content}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}