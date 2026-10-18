"""
Template-based fallback trial engine.
Used when no AI API key is configured.
Combines weighted randomness + category-specific templates.
"""
import random
from typing import Dict, List, Any

CATEGORIES = {
    "social_embarrassment": {
        "keywords": ["wave", "laugh", "smile", "stare", "embarrass", "awkward", "trip", "fall"],
        "crimes": ["Aggravated Social Awkwardness", "First-Degree Embarrassment", "Public Fumbling"],
        "severity_range": (3, 7),
    },
    "procrastination": {
        "keywords": ["later", "tomorrow", "deadline", "forgot", "last minute", "procrastin"],
        "crimes": ["Criminal Time Neglect", "Premeditated Deadline Destruction", "Habitual Later-ism"],
        "severity_range": (4, 8),
    },
    "questionable_texting": {
        "keywords": ["text", "message", "sent", "read", "reply", "left on read", "typed"],
        "crimes": ["Digital Communication Malpractice", "Aggravated Ghosting", "Texting Under the Influence"],
        "severity_range": (3, 7),
    },
    "unnecessary_overthinking": {
        "keywords": ["think", "thought", "wonder", "worry", "what if", "anxiety", "analyse"],
        "crimes": ["Chronic Brain Overdrive", "Conspiracy to Overthink", "Mental Trespassing"],
        "severity_range": (2, 6),
    },
    "petty_revenge": {
        "keywords": ["revenge", "petty", "spite", "back", "payback", "passive"],
        "crimes": ["Petty Vendetta Orchestration", "Small-Scale Malice", "Micro-Aggression Conspiracy"],
        "severity_range": (5, 9),
    },
    "academic_disaster": {
        "keywords": ["exam", "study", "assignment", "class", "teacher", "school", "grade", "fail"],
        "crimes": ["Academic Negligence", "Premeditated Not-Studying", "Educational Abandonment"],
        "severity_range": (5, 9),
    },
    "general_stupidity": {
        "keywords": [],
        "crimes": ["General Acts of Stupidity", "Voluntary Idiocy", "Reckless Foolishness"],
        "severity_range": (4, 8),
    },
}

VERDICTS = {
    range(1, 4): "NOT GUILTY",
    range(4, 7): "MOSTLY GUILTY",
    range(7, 11): "GUILTY",
}

SENTENCES = [
    "You are sentenced to re-live this exact moment at 3 AM for the next five years.",
    "You must wear a sandwich board reading 'I did this' in a busy shopping center for one weekend.",
    "Lifetime ban from making eye contact with anyone named Kevin.",
    "You must explain this incident to a golden retriever every morning for 30 days.",
    "You are hereby required to narrate your daily decisions in a formal British accent for six months.",
    "You must apologize to the concept of dignity. In writing. Notarized.",
    "Community service: 40 hours of explaining WiFi passwords to elderly relatives.",
    "You are banned from having opinions on Monday mornings for two years.",
    "Sentence: mandatory attendance at every open mic night within a 10-mile radius until you feel worse.",
    "You must carry a miniature gavel and bang it before making any decision for 90 days.",
]

EVENTS = [
    {"type": "objection", "character": "Vicky", "description": "OBJECTION! That excuse is physically painful to listen to. I'm objecting on behalf of everyone's ears."},
    {"type": "event", "character": "Judge Randy", "description": "The judge briefly fell asleep and woke up insisting he'd been 'meditating on justice.' He then ate someone's lunch."},
    {"type": "interruption", "character": "Greg", "description": "Defense attorney Greg accidentally submitted his grocery list as evidence. It contained 'dignity (if available)'."},
    {"type": "objection", "character": "Greg", "description": "Objection! My client was clearly acting in self-defence against their own poor judgement, which I also have, so... withdrawn."},
    {"type": "event", "character": "Judge Randy", "description": "The judge demanded a five-minute recess to chase a shiny pen cap that rolled off the bench. Recess was 20 minutes."},
    {"type": "interruption", "character": "Vicky", "description": "Vicky dramatically slammed a manila folder on the desk containing a single receipt and the words 'GOTCHA' written in red marker."},
]


def classify_confession(confession: str) -> str:
    confession_lower = confession.lower()
    best_category = "general_stupidity"
    best_score = 0

    for category, data in CATEGORIES.items():
        score = sum(1 for kw in data["keywords"] if kw in confession_lower)
        if score > best_score:
            best_score = score
            best_category = category

    return best_category


def generate_evidence(confession: str, category: str) -> List[Dict]:
    templates = [
        {
            "title": "The Original Incident Report",
            "description": f"A three-page dramatization of the events in question, compiled by a very invested witness who heard the story secondhand and added considerable flair.",
            "exhibit_label": "Exhibit A",
        },
        {
            "title": "The Defendant's Search History",
            "description": f"Browser history showing '{confession[:30]}...' was searched 14 times in one sitting, including the incognito tab that they thought 'didn't count.'",
            "exhibit_label": "Exhibit B",
        },
        {
            "title": "Expert Testimony (Potato Reenactment)",
            "description": "A dramatic reenactment performed by two potatoes and a sock puppet, which the prosecution insists is 'scientifically accurate.'",
            "exhibit_label": "Exhibit C",
        },
        {
            "title": "The Defendant's Internal Monologue (Reconstructed)",
            "description": "A 47-slide PowerPoint reconstructed by a freelance psychic depicting what the defendant was presumably thinking. Slide 23 says only 'oh no.'",
            "exhibit_label": "Exhibit D",
        },
    ]
    return random.sample(templates, 3)


def generate_prosecution_arguments(confession: str, category: str, personality: str) -> List[str]:
    crime = random.choice(CATEGORIES.get(category, CATEGORIES["general_stupidity"])["crimes"])
    args = [
        f"Ladies and gentlemen of this court, what we have witnessed here is nothing short of a {crime}. The defendant — and I use that term generously — had every opportunity to act like a functioning member of society and chose THIS instead.",
        f"Exhibit B clearly demonstrates a pattern of behavior. This is not a one-time lapse in judgement. This is a LIFESTYLE. My client has prior fictional offenses including Aggravated Cluelessness and Conspiracy to Be Extremely Online.",
        f"In closing, the prosecution asks for the maximum sentence. Not because justice demands it, but because SOMEONE has to. The defense certainly won't. Thank you, and I'm sorry you all had to hear this confession today.",
    ]
    return args


def generate_defense_arguments(confession: str, personality: str) -> List[str]:
    args = [
        "My client, who is a good person probably, did not intend to commit whatever we're calling this. Also, I just got here and haven't read the case file.",
        "I'd like to call my key witness: the defendant's good intentions. Unfortunately, good intentions did not show up today. Neither did my preparation. Moving on.",
        "In conclusion, my client should be found NOT GUILTY on the grounds that... look, everyone does dumb things. Also I think I accidentally confessed to something in my opening statement. Regardless. Acquittal, please.",
    ]
    return args


def calculate_verdict(severity: int) -> str:
    for score_range, verdict in VERDICTS.items():
        if severity in score_range:
            return verdict
    return "GUILTY"


def generate_trial_from_templates(confession: str, personality: str) -> Dict[str, Any]:
    category = classify_confession(confession)
    cat_data = CATEGORIES.get(category, CATEGORIES["general_stupidity"])
    severity = random.randint(*cat_data["severity_range"])

    if personality == "friendly":
        severity = max(1, severity - 2)
    elif personality == "unhinged":
        severity = min(10, severity + 1)

    verdict = calculate_verdict(severity)
    events = random.sample(EVENTS, min(3, len(EVENTS)))

    return {
        "category": category,
        "severity_score": severity,
        "judge_name": "Judge Reginald 'Randy' Trash-Panda III",
        "prosecutor_name": "Victoria 'Vicky' Overkill",
        "defense_name": "Greg Bumble",
        "evidence": generate_evidence(confession, category),
        "prosecution_arguments": generate_prosecution_arguments(confession, category, personality),
        "defense_arguments": generate_defense_arguments(confession, personality),
        "courtroom_events": events,
        "verdict": verdict,
        "sentence": random.choice(SENTENCES),
    }


FALLBACK_CONFESSIONS = [
    "I rehearsed an entire argument in the shower against someone who wronged me three years ago and still lost.",
    "I waved back at someone who was waving at the person behind me and then pretended I was just stretching.",
    "I said 'you too' when a waiter said 'enjoy your meal' and then spent the rest of dinner in shame.",
    "I checked my phone during a movie to see what time the movie ended so I could calculate how much longer I had to be sad.",
    "I pretended to understand a joke for 45 minutes and only laughed when other people did.",
    "I googled whether a plant I killed would notice that I replaced it with a new identical one.",
    "I wrote a strongly worded text, read it eight times, added more words, then deleted everything and sent 'lol ok'.",
    "I told someone I was 'on my way' while still deciding whether to wear shoes.",
]


def get_random_confession_template() -> str:
    return random.choice(FALLBACK_CONFESSIONS)
