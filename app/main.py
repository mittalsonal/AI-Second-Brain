from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from app.database.db import notes_collection
import google.generativeai as genai

app = FastAPI()

genai.configure(api_key="YOUR_GEMINI_API_KEY")

model = genai.GenerativeModel("gemini-1.5-flash")


# ✅ STEP 1: Model pehle define karo
class Note(BaseModel):
    title: str
    content: str

# ✅ Home route
@app.get("/")
def read_root():
    return {"message": "AI Second Brain is running 🚀"}

# ✅ Add Note (MongoDB)
@app.post("/add-note")
def add_note(note: Note):
    notes_collection.insert_one(note.dict())
    return {"message": "Note saved successfully"}

# ✅ Get all notes
@app.get("/all-notes", response_model=List[Note])
def get_notes():
    notes = list(notes_collection.find({}, {"_id": 0}))
    return notes

# ✅ Search notes
@app.get("/search")
def search_notes(query: str):
    results = list(notes_collection.find(
        {"content": {"$regex": query, "$options": "i"}},
        {"_id": 0}
    ))
    return results


@app.post("/ask-ai")
def ask_ai(question: str):
    
    # 1. DB se notes lo
    notes = list(notes_collection.find({}, {"_id": 0}))

    # 2. Context banao
    context = " ".join([note["content"] for note in notes])

    # 3. Prompt banao
    prompt = f"""
    You are a helpful developer assistant.

    Here are some notes:
    {context}

    Answer this question:
    {question}
    """

    # 4. Gemini call
    response = model.generate_content(prompt)

    return {"answer": response.text}