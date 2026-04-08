from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from app.database.db import notes_collection
import requests
from fastapi.middleware.cors import CORSMiddleware
from app.routes import note_routes


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routes
app.include_router(note_routes.router)

ai_queries_count = 0


# -------------------- MODELS --------------------

class Question(BaseModel):
    question: str


class Note(BaseModel):
    title: str
    content: str


# -------------------- ROUTES --------------------

@app.get("/")
def read_root():
    return {"message": "AI Second Brain is running 🚀"}


@app.post("/add-note")
def add_note(note: Note):
    notes_collection.insert_one(note.dict())
    return {"message": "Note saved successfully"}


@app.get("/all-notes")
def get_notes():
    notes = list(notes_collection.find({}))

    # convert ObjectId → string
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

    # 🔹 get all notes
    notes = list(notes_collection.find({}, {"_id": 0}))

    # 🔹 simple keyword filtering
    query_words = data.question.lower().split()

    filtered_notes = [
        note["content"]
        for note in notes
        if any(word in note["content"].lower() for word in query_words)
    ]

    # 🔹 fallback (agar kuch match na ho)
    if not filtered_notes:
        filtered_notes = [note["content"] for note in notes]

    # 🔹 context create
    context = " ".join(filtered_notes)

    prompt = f"""
    You are an AI Second Brain.

    Use ONLY the notes below to answer.

    Notes:
    {context}

    Question:
    {data.question}
    """

    # call Ollama (LOCAL AI)
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3",
            "prompt": prompt,
            "stream": False
        }
    )

    return {"answer": response.json()["response"]}


@app.get("/stats")
def get_stats():
    total_notes = notes_collection.count_documents({})
    
    return {
        "total_notes": total_notes,
        "ai_queries": ai_queries_count
    }


# @app.post("/summarize-note")
# def summarize_note(note: Note):

#     prompt = f"""
#     Summarize the following note in 2-3 concise bullet points:

#     Note:
#     {note.content}
#     """

#     response = requests.post(
#         "http://localhost:11434/api/generate",
#         json={
#             "model": "llama3",
#             "prompt": prompt,
#             "stream": False
#         }
#     )

#     return {"summary": response.json()["response"]}



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
            timeout=300  # ← ADD THIS — Ollama can be slow
        )
        response.raise_for_status()
        data = response.json()
        return {"summary": data.get("response", "No summary returned.")}
    
    except requests.exceptions.Timeout:
        return {"summary": "⚠️ Ollama timed out. Try again or use a shorter note."}
    except requests.exceptions.ConnectionError:
        return {"summary": "⚠️ Cannot connect to Ollama. Make sure it's running on port 11434."}
    except Exception as e:
        return {"summary": f"⚠️ Error: {str(e)}"}