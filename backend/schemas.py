from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class Personality(str, Enum):
    friendly = "friendly"
    brutally_honest = "brutally_honest"
    unhinged = "unhinged"


class TrialRequest(BaseModel):
    confession: str = Field(..., min_length=10, max_length=1000)
    personality: Personality = Personality.brutally_honest


class EvidenceItem(BaseModel):
    title: str
    description: str
    exhibit_label: str  # e.g. "Exhibit A"


class CourtroomEvent(BaseModel):
    type: str  # "objection" | "interruption" | "event"
    character: str
    description: str


class TrialResult(BaseModel):
    id: str
    confession: str
    category: str
    personality: str
    judge_name: str
    prosecutor_name: str
    defense_name: str
    evidence: List[EvidenceItem]
    prosecution_arguments: List[str]
    defense_arguments: List[str]
    courtroom_events: List[CourtroomEvent]
    verdict: str  # GUILTY | MOSTLY GUILTY | NOT GUILTY
    sentence: str
    severity_score: int
    created_at: datetime


class CaseSummary(BaseModel):
    id: str
    confession: str
    category: str
    verdict: str
    sentence: str
    severity_score: int
    created_at: datetime

    class Config:
        from_attributes = True


class GenerateConfessionResponse(BaseModel):
    confession: str
