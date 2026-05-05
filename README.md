# 🧠 AI Second Brain

🚀 Your Personal AI Knowledge Assistant powered by RAG + Hybrid Intelligence

An advanced AI system that doesn’t just store information — it understands, retrieves, and intelligently responds using both your personal knowledge and general intelligence.

---

## 🚀 Features

- 📝 Smart Note Storage  
  Store and manage your personal knowledge  

- 🤖 AI Q&A (Hybrid RAG System)  
  - Answers from your notes (RAG-based)  
  - Falls back to general knowledge if needed  
  - Clearly mentions when answer is not from notes  

- 🧠 Semantic Search with Embeddings  
  Uses Sentence Transformers for meaning-based retrieval  

- 📄 Document Understanding (PDF / DOCX / TXT)  
  Upload files → auto chunking → ask questions  

- ✨ AI Summarization  
  Get concise summaries of notes and documents  

- 🎯 Multi-Question Handling  
  Handles multiple questions in one query  

- 📊 System Stats  
  Tracks notes count and AI usage  

---

## 🛠️ Tech Stack

**Frontend**
- Next.js
- TypeScript
- Tailwind CSS  

**Backend**
- FastAPI  

**Database**
- MongoDB  

**AI / ML**
- Ollama (LLaMA3)
- Sentence Transformers (Embeddings)
- Cosine Similarity (Vector Search)

---

## 🧠 How It Works

### 1. Data Processing
- Notes & documents stored in MongoDB  
- Each note converted into vector embeddings  

### 2. Query Understanding
- User query → embedding  
- Compared with stored notes using cosine similarity  

### 3. Retrieval (RAG)
- Top relevant notes selected dynamically  
- Context created from best matches  

### 4. Hybrid AI Response
- If answer exists in notes → uses notes  
- If not → uses general knowledge  
- Adds transparency:
  "This information is not from your personal notes."

### 5. Output
- Returns answer  
- Shows sources only when relevant  

---

## ⚡ Why This Project Stands Out

- Not a basic RAG clone  
- Hybrid system (RAG + General Knowledge)  
- Semantic search (not just keyword matching)  
- Handles edge cases intelligently  
- Designed like a real-world AI product  

---

## 📸 Screenshots

### 🏠 Dashboard | 🤖 Ask AI

![Ask AI Light](./readme-assets/AI_QuesAns.jpeg)
![Ask AI Dark](./readme-assets/AI_QuesAnsDark.jpeg)

### ✨ AI Summary

![Summary Light](./readme-assets/AI_Summary.jpeg)  
![Summary Dark](./readme-assets/AI_SummaryDark.jpeg)  

### 📄 Upload Document

![Upload Document](./readme-assets/UploadDocument.jpeg)  

---

## ⚙️ Setup

```bash
git clone https://github.com/mittalsonal/AI-Second-Brain.git
cd ai-second-brain
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## ⭐ Features Highlight

* RAG-based intelligent answering
* Context-aware responses
* Notes + PDF understanding system

---

⭐ If you like this project, give it a star!
