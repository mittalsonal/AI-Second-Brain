from fastapi import FastAPI
from pydantic import BaseModel
from app.database.db import notes_collection
import requests
from fastapi.middleware.cors import CORSMiddleware
from app.routes import note_routes

from sentence_transformers import SentenceTransformer
import numpy as np


# -------------------- LOAD MODEL --------------------

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

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


# -------------------- ROUTES --------------------

@app.get("/")
def read_root():
    return {"message": "AI Second Brain is running 🚀"}


# -------------------- ADD NOTE --------------------

@app.post("/add-note")
def add_note(note: Note):

    embedding = embedding_model.encode(note.content).tolist()

    notes_collection.insert_one({
        "title": note.title,
        "content": note.content,
        "embedding": embedding
    })

    return {"message": "Note saved successfully"}


# -------------------- GET NOTES --------------------

@app.get("/all-notes")
def get_notes():

    notes = list(notes_collection.find({}))

    for note in notes:
        note["_id"] = str(note["_id"])

    return notes


# -------------------- SEARCH NOTES --------------------

@app.get("/search")
def search_notes(query: str):

    results = list(
        notes_collection.find(
            {
                "$or": [
                    {"title": {"$regex": query, "$options": "i"}},
                    {"content": {"$regex": query, "$options": "i"}}
                ]
            },
            {"_id": 0}
        )
    )

    return {"notes": results}


# -------------------- ASK AI --------------------

@app.post("/ask-ai")
def ask_ai(data: Question):

    global ai_queries_count
    ai_queries_count += 1

    notes = list(notes_collection.find({}, {"_id": 0}))

    if not notes:
        return {
            "answer": "No notes found.",
            "sources": []
        }

    # -------------------- CREATE QUERY EMBEDDING --------------------

    query_embedding = embedding_model.encode(data.question)

    # -------------------- SCORE NOTES --------------------

    scored_notes = []

    for note in notes:

        if "embedding" not in note:
            continue

        score = cosine_similarity(
            query_embedding,
            np.array(note["embedding"])
        )

        scored_notes.append({
            "title": note["title"],
            "content": note["content"],
            "score": float(score)
        })

    # -------------------- SORT NOTES --------------------

    sorted_notes = sorted(
        scored_notes,
        key=lambda x: x["score"],
        reverse=True
    )

    # -------------------- SMART FILTER --------------------

    question_lower = data.question.lower()

    relevant_notes = []

    for note in sorted_notes:

        title_lower = note["title"].lower()
        content_lower = note["content"].lower()

        # semantic similarity
        semantic_match = note["score"] >= 0.35

        # keyword match
        keyword_match = any(
            word in content_lower or word in title_lower
            for word in question_lower.split()
        )

        if semantic_match or keyword_match:
            relevant_notes.append(note)

    # Take only top 3 relevant notes
    top_notes = relevant_notes[:3]

    # -------------------- BUILD CONTEXT --------------------

    if len(top_notes) == 0:

        context = "No relevant personal notes found."
        sources = []

    else:

        context = "\n\n".join([
            f"Title: {note['title']}\nContent: {note['content']}"
            for note in top_notes
        ])

        sources = [note["title"] for note in top_notes]

    # -------------------- PROMPT --------------------

    prompt = f"""
You are an AI Second Brain assistant.

RULES:
- If relevant notes are provided, answer ONLY using those notes.
- If notes are not relevant, use general knowledge.
- If using general knowledge, say:
  "Note: This information is not from your personal notes."
- Do NOT use unrelated notes.
- Keep answers clear and concise.
- If the question has multiple parts, answer all of them.
- If the answer exists in notes, prioritize notes over general knowledge.

NOTES:
{context}

QUESTION:
{data.question}
"""

    # -------------------- GENERATE RESPONSE --------------------

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

        result = response.json()

        answer = result.get(
            "response",
            "No response generated."
        )

    except requests.exceptions.Timeout:

        answer = "⚠️ Ollama timed out."

    except requests.exceptions.ConnectionError:

        answer = "⚠️ Cannot connect to Ollama."

    except Exception as e:

        answer = f"⚠️ Error: {str(e)}"

    # -------------------- RETURN --------------------

    return {
        "answer": answer,
        "sources": sources
    }


# -------------------- STATS --------------------

@app.get("/stats")
def get_stats():

    total_notes = notes_collection.count_documents({})

    return {
        "total_notes": total_notes,
        "ai_queries": ai_queries_count
    }


# -------------------- SUMMARIZE NOTE --------------------

@app.post("/summarize-note")
def summarize_note(note: Note):

    prompt = f"""
Summarize the following note in 2-3 concise bullet points.

NOTE:
{note.content}
"""

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

        return {
            "summary": data.get(
                "response",
                "No summary returned."
            )
        }

    except requests.exceptions.Timeout:

        return {
            "summary": "⚠️ Ollama timed out. Try again."
        }

    except requests.exceptions.ConnectionError:

        return {
            "summary": "⚠️ Cannot connect to Ollama."
        }

    except Exception as e:

        return {
            "summary": f"⚠️ Error: {str(e)}"
        }