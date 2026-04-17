from sqlalchemy import Column, Integer, String, Date, Time, Text
from sqlalchemy.dialects.postgresql import ARRAY
from database import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String, nullable=True)
    interaction_type = Column(String, nullable=True)
    date = Column(Date, nullable=True)
    time = Column(Time, nullable=True)
    attendees = Column(ARRAY(String), default=[])
    topics = Column(Text, nullable=True)
    materials_shared = Column(Text, nullable=True)
    samples_distributed = Column(Text, nullable=True)
    sentiment = Column(String, nullable=True)
    outcomes = Column(Text, nullable=True)
    follow_up = Column(Text, nullable=True)
