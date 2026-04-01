from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from app.database.db import notes_collection
import requests

app = FastAPI()


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


@app.get("/all-notes", response_model=List[Note])
def get_notes():
    notes = list(notes_collection.find({}, {"_id": 0}))
    return notes


@app.get("/search")
def search_notes(query: str):
    results = list(notes_collection.find(
        {"content": {"$regex": query, "$options": "i"}},
        {"_id": 0}
    ))
    return results


# -------------------- AI ROUTE --------------------

@app.post("/ask-ai")
def ask_ai(data: Question):

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

    # 🔹 call Ollama (LOCAL AI)
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3",
            "prompt": prompt,
            "stream": False
        }
    )

    return {"answer": response.json()["response"]}