"""
AI Debate Referee - SQLAlchemy Relational Data Models
"""
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.database import Base

class Debate(Base):
    __tablename__ = "debates"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    status = Column(String, default="active")
    mode = Column(String, default="text")
    language = Column(String, default="en")
    created_at = Column(DateTime, default=datetime.utcnow)
    metadata_json = Column(Text, nullable=True)

    participants = relationship("Participant", back_populates="debate", cascade="all, delete-orphan")
    statements = relationship("Statement", back_populates="debate", cascade="all, delete-orphan")
    claims = relationship("Claim", back_populates="debate", cascade="all, delete-orphan")
    evidence = relationship("Evidence", back_populates="debate", cascade="all, delete-orphan")
    fallacies = relationship("Fallacy", back_populates="debate", cascade="all, delete-orphan")
    contradictions = relationship("Contradiction", back_populates="debate", cascade="all, delete-orphan")
    assumptions = relationship("Assumption", back_populates="debate", cascade="all, delete-orphan")


class Participant(Base):
    __tablename__ = "participants"

    id = Column(String, primary_key=True, index=True)
    debate_id = Column(String, ForeignKey("debates.id"))
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    side = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    speaking_time = Column(Integer, default=0)
    wpm = Column(Float, default=140.0)
    interruptions = Column(Integer, default=0)

    debate = relationship("Debate", back_populates="participants")
    statements = relationship("Statement", back_populates="participant")


class Statement(Base):
    __tablename__ = "statements"

    id = Column(String, primary_key=True, index=True)
    debate_id = Column(String, ForeignKey("debates.id"))
    participant_id = Column(String, ForeignKey("participants.id"))
    speaker_name = Column(String, nullable=False)
    text = Column(Text, nullable=False)
    timestamp_start = Column(Float, default=0.0)
    timestamp_end = Column(Float, default=0.0)
    statement_type = Column(String, default="claim")
    emotion = Column(String, default="Neutral")
    confidence = Column(Float, default=0.85)
    created_at = Column(DateTime, default=datetime.utcnow)

    debate = relationship("Debate", back_populates="statements")
    participant = relationship("Participant", back_populates="statements")


class Claim(Base):
    __tablename__ = "claims"

    id = Column(String, primary_key=True, index=True)
    debate_id = Column(String, ForeignKey("debates.id"))
    statement_id = Column(String, ForeignKey("statements.id"))
    speaker_id = Column(String, nullable=False)
    text = Column(Text, nullable=False)
    claim_type = Column(String, default="Empirical")
    importance = Column(String, default="High")
    confidence = Column(Float, default=0.88)
    support_status = Column(String, default="Moderate")

    debate = relationship("Debate", back_populates="claims")


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String, primary_key=True, index=True)
    debate_id = Column(String, ForeignKey("debates.id"))
    statement_id = Column(String, ForeignKey("statements.id"))
    claim_id = Column(String, nullable=True)
    speaker_id = Column(String, nullable=False)
    text = Column(Text, nullable=False)
    evidence_type = Column(String, default="Statistic")
    reliability = Column(String, default="Medium")
    relevance = Column(Float, default=0.82)
    directness = Column(String, default="Direct")
    source = Column(String, nullable=True)

    debate = relationship("Debate", back_populates="evidence")


class Fallacy(Base):
    __tablename__ = "fallacies"

    id = Column(String, primary_key=True, index=True)
    debate_id = Column(String, ForeignKey("debates.id"))
    statement_id = Column(String, ForeignKey("statements.id"))
    speaker_id = Column(String, nullable=False)
    fallacy_name = Column(String, nullable=False)
    statement_text = Column(Text, nullable=False)
    explanation = Column(Text, nullable=False)
    confidence = Column(Float, default=0.78)
    how_to_improve = Column(Text, nullable=True)

    debate = relationship("Debate", back_populates="fallacies")


class Contradiction(Base):
    __tablename__ = "contradictions"

    id = Column(String, primary_key=True, index=True)
    debate_id = Column(String, ForeignKey("debates.id"))
    statement1_id = Column(String, nullable=False)
    statement2_id = Column(String, nullable=False)
    speaker1_name = Column(String, nullable=False)
    speaker2_name = Column(String, nullable=False)
    statement1_text = Column(Text, nullable=False)
    statement2_text = Column(Text, nullable=False)
    contradiction_type = Column(String, default="Direct")
    confidence = Column(Float, default=0.89)
    explanation = Column(Text, nullable=False)

    debate = relationship("Debate", back_populates="contradictions")


class Assumption(Base):
    __tablename__ = "assumptions"

    id = Column(String, primary_key=True, index=True)
    debate_id = Column(String, ForeignKey("debates.id"))
    claim_id = Column(String, nullable=False)
    speaker_id = Column(String, nullable=False)
    claim_text = Column(Text, nullable=False)
    unstated_premise = Column(Text, nullable=False)
    risk_level = Column(String, default="Medium")
    explanation = Column(Text, nullable=False)

    debate = relationship("Debate", back_populates="assumptions")


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String, primary_key=True, index=True)
    statement_id = Column(String, nullable=False)
    original_prediction = Column(String, nullable=False)
    corrected_label = Column(String, nullable=False)
    task_type = Column(String, default="classification")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
