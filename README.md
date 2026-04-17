# 🚀 AI-First CRM: Intelligent HCP Interaction Portal

A production-ready, AI-native CRM module designed for pharmaceutical sales representatives. This system leverages **LangGraph** orchestration and **Llama 3.3 70B** (via Groq) to automate the entire interaction logging process through natural conversation.

- **LIVE LINK: https://ai-first-crm-hcp-module-delta.vercel.app**

---

## ✨ Key Features

- **🗣️ Natural Language Logging**: No manual form entry. Simply chat with the assistant to fill 11+ structured data fields.
- **🧠 LangGraph Orchestration**: A stateful AI agent that decides when to log, edit, or suggest follow-ups using strictly bound tools (no hardcoded if-else logic).
- **🎨 Premium UI**: A sleek, split-screen React interface with dynamic field updates, Redux state management, and an interactive sentiment system.
- **☁️ Cloud Ready**: Pre-configured for seamless deployment to **Render** (Backend & Postgres) and **Vercel** (Frontend).
- **📋 Full Extraction Support**: Extracts HCP Name, Type, Date, Time, Attendees, Topics, Materials, Samples, Sentiment, Outcomes, and Follow-ups.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Redux Toolkit, Tailwind CSS v4, Lucide Icons, Vite.
- **Backend**: FastAPI, LangGraph, LangChain-Groq, SQLAlchemy ORM.
- **LLM**: Llama 3.3 70B Versatile (via Groq API).
- **Database**: PostgreSQL.
- **Infrastructure**: Docker & Docker Compose.

---

## 🚀 Quick Start

### 1. Prerequisites
- Docker & Docker Compose installed.
- A [Groq API Key](https://console.groq.com/keys).

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=postgresql://crm_user:crm_password@db:5432/crm_db
```

### 3. Run Locally (Docker)
```bash
docker-compose up --build
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🌐 Live Deployment Instructions

### Backend (Render)
1. Deploy the `backend/` folder as a **Web Service**.
2. Connect a **Render PostgreSQL** instance.
3. Add `GROQ_API_KEY` and `DATABASE_URL` to environment variables.

### Frontend (Vercel)
1. Deploy the `frontend/` folder to Vercel.
2. Add `VITE_API_BASE_URL` pointing to your Render backend URL.

---

## 🧪 Example prompt to test full extraction
> *"I had a meeting with Dr. Ankit Sharma on 19 April 2025 at 4:30 pm. We discussed a new diabetes drug and its benefits over existing treatments. Dr. Sharma showed a positive attitude. Attendees included Dr. Ankit Sharma and his assistant Ravi. I shared a product brochure and provided 3 sample units. The outcome was that he agreed to try it with patients. For follow-up, he requested clinical trial data next week."*

---

## 🔒 License
This project is built for evaluation purposes as part of the AI-First CRM (HCP Module) assessment.
