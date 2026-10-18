"""
Trial orchestrator — combines AI generator with template fallback.
"""
import uuid
from datetime import datetime
from typing import Dict, Any

from engine.ai_generator import generate_trial_with_ai, generate_random_confession_with_ai
from engine.templates import generate_trial_from_templates, get_random_confession_template


async def run_trial(confession: str, personality: str) -> Dict[str, Any]:
    """Generate a complete trial. Tries AI first, falls back to templates."""
    trial_data = await generate_trial_with_ai(confession, personality)

    if trial_data is None:
        print("[Trial Engine] AI unavailable — using template engine.")
        trial_data = generate_trial_from_templates(confession, personality)

    # Normalize and validate the data structure
    trial_data = _normalize_trial_data(trial_data)

    return {
        "id": str(uuid.uuid4()),
        "confession": confession,
        "personality": personality,
        "created_at": datetime.utcnow(),
        **trial_data,
    }


async def get_random_confession() -> str:
    """Get a random confession. Tries AI first."""
    confession = await generate_random_confession_with_ai()
    if confession is None:
        confession = get_random_confession_template()
    return confession


def _normalize_trial_data(data: Dict) -> Dict:
    """Ensure all required fields exist and are properly typed."""
    # Ensure evidence items have correct shape
    evidence = data.get("evidence", [])
    normalized_evidence = []
    for i, e in enumerate(evidence[:4]):
        if isinstance(e, dict):
            normalized_evidence.append({
                "title": str(e.get("title", f"Evidence {i+1}")),
                "description": str(e.get("description", "Evidence details classified.")),
                "exhibit_label": str(e.get("exhibit_label", f"Exhibit {chr(65+i)}")),
            })
    data["evidence"] = normalized_evidence

    # Ensure courtroom events
    events = data.get("courtroom_events", [])
    normalized_events = []
    for e in events[:5]:
        if isinstance(e, dict):
            normalized_events.append({
                "type": str(e.get("type", "event")),
                "character": str(e.get("character", "Unknown")),
                "description": str(e.get("description", "Something happened.")),
            })
    data["courtroom_events"] = normalized_events

    # Ensure lists
    data["prosecution_arguments"] = [str(a) for a in data.get("prosecution_arguments", [])][:3]
    data["defense_arguments"] = [str(a) for a in data.get("defense_arguments", [])][:3]

    # Ensure verdict is valid
    valid_verdicts = {"GUILTY", "MOSTLY GUILTY", "NOT GUILTY"}
    if data.get("verdict") not in valid_verdicts:
        data["verdict"] = "GUILTY"

    # Clamp severity
    data["severity_score"] = max(1, min(10, int(data.get("severity_score", 5))))

    return data
