# AI-First CRM Module: Log Interaction Screen (HCP)

This project is a complete production-ready AI-first CRM module built for pharmaceutical sales representatives to log interactions with Healthcare Professionals (HCPs) using a LangGraph AI agent powered by Groq (`gemma2-9b-it`).

## Architecture

*   **Frontend**: React, Redux Toolkit, Tailwind CSS, Vite.
    *   Features a split-screen UI. Left side: Read-only interaction form. Right side: AI Chat Assistant.
    *   Dynamically updates via Redux upon receiving AI structure JSON payloads.
*   **Backend**: FastAPI, SQLAlchemy, LangGraph, LangChain, PostgreSQL.
    *   Implements an AI Agent workflow (`AgentState`) utilizing strict LLM Tool Binding (`bind_tools`).
    *   No hardcoded `if-else` tool dispatching logic. The LLM dictates state changes entirely via function calling.
*   **Database**: PostgreSQL providing persistence using SQLAlchemy ORM.

## Prerequisites

*   Docker & Docker Compose
*   A valid [Groq API Key](https://console.groq.com/keys)

## Setup Instructions

1.  **Environment Setup**:
    Copy the sample environment file to `.env` and fill in your Groq API Key.
    ```bash
    cp .env.example .env
    ```
    *Ensure `GROQ_API_KEY` is set to your actual key in `.env`.*

2.  **Start the Platform via Docker Compose**:
    Build and spin up the PostgreSQL database, FastAPI backend, and React frontend together.
    ```bash
    docker-compose up --build
    ```

3.  **Access the Application**:
    *   **Frontend**: Navigate to `http://localhost:5173`
    *   **Backend API Docs**: Navigate to `http://localhost:8000/docs`

## Features & Supported AI Tools

The LangGraph Agent utilizes the following 5 distinct tools (found in `backend/tools/interaction_tools.py`):
1.  **Log Interaction Tool**: Log a completely new interaction.
2.  **Edit Interaction Tool**: Granularly modify a specific field without disrupting the rest of the form.
3.  **Summarize Interaction Tool**: Condense verbose clinical notes.
4.  **Suggest Follow-up Tool**: Recommend logical next steps based on conversational context.
5.  **Extract Entities Tool**: Directly pull HCP aliases, clinical materials, or drugs.

## Example Prompts for Testing

Try pasting these sequentially into the Chat Assistant:

1.  **Logging a new interaction**:
    > "I just had a meeting with Dr. Adams. We discussed the new cardiology drug, CardioMax. He was very positive about it."

2.  **Entity Extraction & Logging details**:
    > "Add John Smith to the attendees list. Also, note that we shared the Phase IV clinical trial brochure."

3.  **Editing specific fields (Testing `edit_interaction_tool`)**:
    > "Actually, change the sentiment to negative, Dr. Adams had some concerns about side effects."

4.  **Suggesting a follow-up (Testing `suggest_follow_up_tool`)**:
    > "Given he was concerned, what should my follow-up action be?"

5.  **Summarizing (Testing `summarize_interaction_tool`)**:
    > "Summarize the entire interaction so far into a short bullet point."
