from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.interaction import Interaction
from schemas.interaction import InteractionResponse, InteractionCreate, InteractionUpdate, ChatRequest
from agents.agent import compiled_agent
from langchain_core.messages import HumanMessage
import json

router = APIRouter(prefix="/api/interactions", tags=["interactions"])

@router.post("/chat")
def chat_with_agent(req: ChatRequest, db: Session = Depends(get_db)):
    """
    Handles user chat input, invokes LangGraph agent, and returns the updated fields and AI response.
    Real-time Sync: The immediate API response is used to update the Redux UI dynamically.
    """
    initial_state = {
        "messages": [HumanMessage(content=req.message)],
        "interaction_data": {}
    }
    
    # Optional: fetch existing DB state if interaction_id provided to give context to Agent
    # For now, we process as new or editing in current session
    
    try:
        final_state = compiled_agent.invoke(initial_state)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
    messages = final_state.get("messages", [])
    updated_data = final_state.get("interaction_data", {})
    
    # Extract AIMessage text
    ai_response_text = ""
    if messages:
        last_msg = messages[-1]
        ai_response_text = last_msg.content

    return {
        "ai_message": ai_response_text,
        "updated_form_data": updated_data
    }

@router.post("/log-interaction", response_model=InteractionResponse)
def create_interaction(interaction: InteractionCreate, db: Session = Depends(get_db)):
    db_interaction = Interaction(**interaction.model_dump())
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@router.post("/edit-interaction/{id}", response_model=InteractionResponse)
def edit_interaction(id: int, interaction: InteractionUpdate, db: Session = Depends(get_db)):
    db_interaction = db.query(Interaction).filter(Interaction.id == id).first()
    if not db_interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
        
    update_data = interaction.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_interaction, key, value)
        
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@router.get("/{id}", response_model=InteractionResponse)
def get_interaction(id: int, db: Session = Depends(get_db)):
    db_interaction = db.query(Interaction).filter(Interaction.id == id).first()
    if not db_interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    return db_interaction
