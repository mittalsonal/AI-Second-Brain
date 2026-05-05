from fastapi import FastAPI
from pydantic import BaseModel
from app.database.db import notes_collection
import requests
from fastapi.middleware.cors import CORSMiddleware
from app.routes import note_routes

from sentence_transformers import SentenceTransformer
import numpy as np

# load model once
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(note_routes.router)

ai_queries_count = 0


# -------------------- MODELS --------------------

class Question(BaseModel):
    question: str


class Note(BaseModel):
    title: str
    content: str


# -------------------- HELPERS --------------------

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def keyword_match(question, notes):
    q_words = set(question.lower().split())

    for note in notes:
        note_words = set(note["content"].lower().split())
        if len(q_words.intersection(note_words)) > 0:
            return True

    return False


# -------------------- ROUTES --------------------

@app.get("/")
def read_root():
    return {"message": "AI Second Brain is running 🚀"}


@app.post("/add-note")
def add_note(note: Note):
    embedding = embedding_model.encode(note.content).tolist()

    notes_collection.insert_one({
        "title": note.title,
        "content": note.content,
        "embedding": embedding
    })

    return {"message": "Note saved successfully"}


@app.get("/all-notes")
def get_notes():
    notes = list(notes_collection.find({}))

    for note in notes:
        note["_id"] = str(note["_id"])

    return notes


@app.get("/search")
def search_notes(query: str):
    results = list(notes_collection.find(
        {"$or": [
            {"title": {"$regex": query, "$options": "i"}},
            {"content": {"$regex": query, "$options": "i"}}
        ]},
        {"_id": 0}
    ))
    return {"notes": results}


# -------------------- AI ROUTE --------------------

@app.post("/ask-ai")
def ask_ai(data: Question):
    global ai_queries_count
    ai_queries_count += 1

    notes = list(notes_collection.find({}, {"_id": 0}))

    if not notes:
        return {"answer": "No notes found.", "sources": []}

    query_embedding = embedding_model.encode(data.question)

    # score notes
    scored_notes = []
    for note in notes:
        if "embedding" in note:
            score = cosine_similarity(query_embedding, note["embedding"])
            scored_notes.append((note["title"], note["content"], score))

    # sort
    sorted_notes = sorted(scored_notes, key=lambda x: x[2], reverse=True)

    top_score = sorted_notes[0][2]
    has_match = keyword_match(data.question, notes)

    # -------------------- SELECT CONTEXT --------------------

    top_notes = sorted_notes[:3]  # always take top 3 (hybrid approach)

    context = " ".join([note[1] for note in top_notes])
    sources = [note[0] for note in top_notes]

    # -------------------- HYBRID PROMPT --------------------

    prompt = f"""
    You are an AI Second Brain.

    RULES:
    - If answer is found in notes → use notes.
    - If NOT found → use general knowledge.
    - If using general knowledge → say:
      "Note: This information is not from your personal notes."
    - If question has multiple parts → answer ALL.

    Notes:
    {context}

    Question:
    {data.question}
    """

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3",
            "prompt": prompt,
            "stream": False
        }
    )

    answer = response.json()["response"]

    # -------------------- SOURCE CONTROL --------------------

    # if weak similarity → hide sources
    if top_score < 0.4 and not has_match:
        sources = []

    return {
        "answer": answer,
        "sources": sources
    }


@app.get("/stats")
def get_stats():
    total_notes = notes_collection.count_documents({})

    return {
        "total_notes": total_notes,
        "ai_queries": ai_queries_count
    }


@app.post("/summarize-note")
def summarize_note(note: Note):
    prompt = f"""Summarize the following note in 2-3 concise bullet points:

Note:
{note.content}"""

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False
            },
            timeout=300
        )
        response.raise_for_status()
        data = response.json()

        return {"summary": data.get("response", "No summary returned.")}

    except requests.exceptions.Timeout:
        return {"summary": "⚠️ Ollama timed out. Try again."}
    except requests.exceptions.ConnectionError:
        return {"summary": "⚠️ Cannot connect to Ollama."}
    except Exception as e:
        return {"summary": f"⚠️ Error: {str(e)}"}