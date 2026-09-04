"""
AI Debate Referee - FastAPI Application Entry Point
Exposes REST endpoints for academic research and multimodal debate analysis.
"""
from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import json

from backend.database import get_db, engine, Base
import backend.models as models
from backend.nlp_pipeline import DeepLearningNLPPipeline

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Debate Referee API",
    description="Intelligent Multimodal Debate, Argument & Reasoning Analysis System",
    version="1.0.0"
)

pipeline = DeepLearningNLPPipeline()

@app.get("/")
def read_root():
    return {
        "title": "AI Debate Referee API",
        "tagline": "Analyze the Argument. Understand the Reasoning. Improve the Thinking.",
        "status": "online",
        "engine": "FastAPI + DeepLearningNLPPipeline"
    }

@app.get("/api/debates")
def list_debates(db: Session = Depends(get_db)):
    debates = db.query(models.Debate).order_by(models.Debate.created_at.desc()).all()
    return debates

@app.get("/api/debates/{debate_id}")
def get_debate(debate_id: str, db: Session = Depends(get_db)):
    debate = db.query(models.Debate).filter(models.Debate.id == debate_id).first()
    if not debate:
        raise HTTPException(status_code=404, detail="Debate not found")
    return debate

@app.post("/api/nlp/tokenize")
def nlp_tokenize(text: str):
    return pipeline.tokenize_and_pos(text)

@app.post("/api/nlp/embeddings")
def nlp_embeddings(text: str):
    vec = pipeline.generate_embeddings(text)
    return {"dimension": len(vec), "vector": vec}

@app.post("/api/nlp/nli")
def nlp_inference(premise: str, hypothesis: str):
    return pipeline.run_nli(premise, hypothesis)
