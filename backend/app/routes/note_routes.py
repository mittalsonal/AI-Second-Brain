from fastapi import APIRouter, UploadFile, File
from PyPDF2 import PdfReader
from docx import Document
from app.database.db import notes_collection
import re

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    text = ""

    if file.filename.endswith(".pdf"):
        reader = PdfReader(file.file)
        for page in reader.pages:
            page_text = page.extract_text() or ""
            text += page_text + "\n"

    elif file.filename.endswith(".docx"):
        doc = Document(file.file)
        text = "\n".join([p.text for p in doc.paragraphs])

    elif file.filename.endswith(".txt"):
        text = (await file.read()).decode("utf-8")

    else:
        return {"error": "Unsupported file type"}

    # ---- FIX: Clean up broken line breaks from PDF ----
    # Join lines that are NOT paragraph breaks
    # A real paragraph break = blank line (two newlines)
    # Single newlines mid-sentence = just a word-wrap artifact → join them

    # Step 1: normalize Windows line endings
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # Step 2: collapse single newlines (word-wrap artifacts) into spaces
    # but preserve double newlines (real paragraph breaks)
    text = re.sub(r'(?<!\n)\n(?!\n)', ' ', text)

    # Step 3: collapse 3+ newlines into exactly 2
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Step 4: clean up extra spaces
    text = re.sub(r' {2,}', ' ', text)

    # ---- Split into meaningful chunks ----
    chunks = [c.strip() for c in text.split("\n\n") if len(c.strip()) > 60]

    notes_created = 0
    for chunk in chunks:
        # Use first 60 chars as title (up to a word boundary)
        title = chunk[:60].rsplit(' ', 1)[0] if len(chunk) > 60 else chunk
        notes_collection.insert_one({
            "title": title,
            "content": chunk
        })
        notes_created += 1

    return {"notes_created": notes_created}