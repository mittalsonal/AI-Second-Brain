from fastapi import FastAPI
from pydantic import BaseModel
from typing import List


app = FastAPI()

# Temporary memory
notes = []

class Note(BaseModel):
    title: str
    content: str

@app.get("/")
def read_root():
    return {"message": "AI Second Brain is running 🚀"}

@app.post("/add-note")
def add_note(note: Note):
    notes.append(note)
    return {"message": "Note saved successfully"}

@app.get("/all-notes", response_model=List[Note])
def get_notes():
    return notes