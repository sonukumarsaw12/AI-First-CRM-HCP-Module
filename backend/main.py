from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import interaction_router
from database import engine, Base

import threading
import time
import requests

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI CRM Backend", version="1.0.0")

# Self-pinger logic to keep Render awake
def self_pinger():
    # Render Free Tier sleeps after 15 mins of inactivity.
    # We ping every 14 minutes.
    url = "https://ai-first-crm-hcp-module-yk6j.onrender.com/"
    while True:
        try:
            requests.get(url)
            print(f"Self-ping successful at {time.ctime()}")
        except Exception as e:
            print(f"Self-ping failed: {e}")
        time.sleep(840) # 14 minutes

# Start the pinger in a daemon thread so it doesn't block shutdown
threading.Thread(target=self_pinger, daemon=True).start()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interaction_router.router)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "AI CRM API is running."}
