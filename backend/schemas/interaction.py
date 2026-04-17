from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, time

class InteractionBase(BaseModel):
    hcp_name: Optional[str] = None
    interaction_type: Optional[str] = None
    date: Optional[date] = None
    time: Optional[time] = None
    attendees: Optional[List[str]] = Field(default_factory=list)
    topics: Optional[str] = None
    materials_shared: Optional[str] = None
    samples_distributed: Optional[str] = None
    sentiment: Optional[str] = None
    outcomes: Optional[str] = None
    follow_up: Optional[str] = None

class InteractionCreate(InteractionBase):
    pass

class InteractionUpdate(InteractionBase):
    pass

class InteractionResponse(InteractionBase):
    id: int

    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str
    interaction_id: Optional[int] = None
