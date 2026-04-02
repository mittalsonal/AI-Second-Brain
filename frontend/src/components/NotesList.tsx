"use client";

const tagColors: Record<string, string> = {
  blue:   "#3B82F6",
  green:  "#22C55E",
  purple: "#A855F7",
  orange: "#FB923C",
};

const notes = [
  { title: "React useEffect Deep Dive",    content: "Cleanup functions are critical to avoid memory leaks. Always return a cleanup function when setting up subscriptions or event listeners.", time: "2h ago",  tag: "Tech",     color: "blue"   },
  { title: "AI Product Ideas 2025",        content: "Build personal knowledge graphs using LLMs. Users could visualize connections between their notes automatically using embeddings.",         time: "5h ago",  tag: "Ideas",    color: "green"  },
  { title: "MongoDB Aggregation Pipeline", content: "$lookup is essentially a left outer join. Use $unwind carefully with arrays. The $facet stage allows multiple aggregations in parallel.",    time: "1d ago",  tag: "Tech",     color: "purple" },
  { title: "Vector Embeddings Explained",  content: "Semantic search using cosine similarity on high-dimensional vectors enables meaning-aware retrieval far superior to keyword matching.",     time: "2d ago",  tag: "Research", color: "orange" },
];

export default function NotesList() {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <span className="panel-dot" style={{ background: "var(--primary)", boxShadow: "0 0 8px var(--primary)" }} />
          Recent Notes
        </div>
        <span style={{ fontSize: "11px", color: "var(--primary)", cursor: "pointer", fontWeight: 600 }}>
          View all →
        </span>
      </div>

      <div className="notes-body">
        {notes.map((note, i) => (
          <div key={i} className="note-item">
            <div className="note-color-bar" style={{ background: tagColors[note.color] }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="note-title">{note.title}</div>
              <div className="note-preview">{note.content}</div>
              <div className="note-meta">
                <span className="note-time">{note.time}</span>
                <span className="note-chip">{note.tag}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}