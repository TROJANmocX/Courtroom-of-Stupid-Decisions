"""API routes for trial management."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from database import get_db, Case
from schemas import TrialRequest, TrialResult, CaseSummary, GenerateConfessionResponse
from engine.orchestrator import run_trial, get_random_confession

router = APIRouter(prefix="/api", tags=["trials"])


@router.post("/trial", response_model=TrialResult)
async def create_trial(request: TrialRequest, db: Session = Depends(get_db)):
    """Submit a confession and get a full trial result."""
    trial = await run_trial(request.confession, request.personality.value)

    # Persist to database
    case = Case(
        id=trial["id"],
        confession=trial["confession"],
        category=trial["category"],
        personality=trial["personality"],
        judge_name=trial["judge_name"],
        prosecutor_name=trial["prosecutor_name"],
        defense_name=trial["defense_name"],
        evidence=trial["evidence"],
        prosecution_arguments=trial["prosecution_arguments"],
        defense_arguments=trial["defense_arguments"],
        courtroom_events=trial["courtroom_events"],
        verdict=trial["verdict"],
        sentence=trial["sentence"],
        severity_score=trial["severity_score"],
        created_at=trial["created_at"],
    )
    db.add(case)
    db.commit()
    db.refresh(case)

    return _case_to_result(case)


@router.get("/cases", response_model=List[CaseSummary])
def list_cases(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    """List all saved cases, newest first."""
    cases = db.query(Case).order_by(Case.created_at.desc()).offset(skip).limit(limit).all()
    return cases


@router.get("/cases/{case_id}", response_model=TrialResult)
def get_case(case_id: str, db: Session = Depends(get_db)):
    """Get a specific case by ID."""
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return _case_to_result(case)


@router.delete("/cases/{case_id}")
def delete_case(case_id: str, db: Session = Depends(get_db)):
    """Delete a case."""
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    db.delete(case)
    db.commit()
    return {"message": "Case dismissed (deleted)."}


@router.get("/confession/random", response_model=GenerateConfessionResponse)
async def random_confession():
    """Generate a random confession for users who need inspiration."""
    confession = await get_random_confession()
    return {"confession": confession}


@router.get("/health")
def health():
    return {"status": "The court is in session.", "verdict": "API is GUILTY of working."}


def _case_to_result(case: Case) -> dict:
    return {
        "id": case.id,
        "confession": case.confession,
        "category": case.category,
        "personality": case.personality,
        "judge_name": case.judge_name,
        "prosecutor_name": case.prosecutor_name,
        "defense_name": case.defense_name,
        "evidence": case.evidence,
        "prosecution_arguments": case.prosecution_arguments,
        "defense_arguments": case.defense_arguments,
        "courtroom_events": case.courtroom_events,
        "verdict": case.verdict,
        "sentence": case.sentence,
        "severity_score": case.severity_score,
        "created_at": case.created_at,
    }
