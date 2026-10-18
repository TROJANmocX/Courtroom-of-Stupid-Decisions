"""
AI-powered trial generator.
Supports Google Gemini and OpenAI as backends.
Falls back to template engine if no API key is set.
"""
import json
import re
import asyncio
from typing import Optional

from config import settings


TRIAL_PROMPT_TEMPLATE = """
You are the scriptwriter for "Courtroom of Stupid Decisions" — a comedy courtroom show where 
everyday embarrassing confessions are judged by absurd fictional characters.

The characters are:
- Judge Reginald "Randy" Trash-Panda III: a sarcastic raccoon judge who collects shiny objects, 
  falls asleep during boring testimony, and delivers wildly disproportionate sentences.
- Prosecutor Victoria "Vicky" Overkill: an aggressively passionate lawyer who treats every 
  confession as if it's the crime of the century. She objects to sandwiches.
- Defense Attorney Greg Bumble: hopelessly incompetent, often accidentally incriminates his client,
  calls irrelevant witnesses, and loses every case.

Personality setting: {personality}
- "friendly": The judge is lenient, characters make gentle jokes
- "brutally_honest": Characters are ruthlessly sarcastic, no mercy
- "unhinged": Absolute chaos — witnesses are inanimate objects, evidence is absurd, judge does crimes too

User's Confession: "{confession}"

Generate a complete fictional courtroom trial as a JSON object with EXACTLY this structure:
{{
  "category": "one of: social_embarrassment | procrastination | questionable_texting | unnecessary_overthinking | petty_revenge | academic_disaster | general_stupidity | digital_crimes | food_crimes | friendship_betrayal",
  "severity_score": <integer 1-10>,
  "judge_name": "Judge Reginald 'Randy' Trash-Panda III",
  "prosecutor_name": "Victoria 'Vicky' Overkill",
  "defense_name": "Greg Bumble",
  "evidence": [
    {{{ "title": "...", "description": "...", "exhibit_label": "Exhibit A" }}},
    {{{ "title": "...", "description": "...", "exhibit_label": "Exhibit B" }}},
    {{{ "title": "...", "description": "...", "exhibit_label": "Exhibit C" }}}
  ],
  "prosecution_arguments": [
    "First argument from Vicky (dramatic, aggressive, one paragraph)",
    "Second argument (introduces ridiculous evidence)",
    "Closing statement (over the top, references the defendant's prior fictional crimes)"
  ],
  "defense_arguments": [
    "Greg's opening (immediately makes things worse)",
    "Greg's witness examination (goes horribly wrong)",
    "Greg's closing (accidentally votes for conviction)"
  ],
  "courtroom_events": [
    {{{ "type": "objection", "character": "Vicky", "description": "..." }}},
    {{{ "type": "event", "character": "Judge Randy", "description": "..." }}},
    {{{ "type": "interruption", "character": "Greg", "description": "..." }}}
  ],
  "verdict": "GUILTY" or "MOSTLY GUILTY" or "NOT GUILTY",
  "sentence": "An absurd, funny, creative punishment that fits the crime comedically. 2-3 sentences."
}}

Rules:
- Make it FUNNY. Lean into the absurdity.
- Evidence should be creatively interpreted from the confession (e.g. screenshot of their face, a reenactment by a potato)
- Severity score: 1-3 = minor embarrassment, 4-6 = moderate stupidity, 7-9 = impressive idiocy, 10 = legendary
- The sentence should be wildly disproportionate and absurd (e.g. "banned from eye contact for 40 years")
- Return ONLY valid JSON, no markdown fences, no explanation.
"""

CONFESSION_GENERATOR_PROMPT = """
Generate one single funny, relatable, embarrassing confession that a real person might submit to a comedy courtroom show. 
It should be a specific, slightly embarrassing everyday moment — not violent or harmful.
Just return the confession text, nothing else. No quotes, no explanation.
Examples of tone:
- "I rehearsed an entire argument in the shower against someone who annoyed me three years ago and still lost."
- "I waved back at someone who was waving at the person behind me and then pretended I was just stretching."
- "I said 'you too' when a waiter told me to enjoy my meal at a restaurant that wasn't even having a promotion."
"""


async def generate_trial_with_ai(confession: str, personality: str) -> Optional[dict]:
    """Try to generate trial data using configured AI provider."""
    prompt = TRIAL_PROMPT_TEMPLATE.format(
        confession=confession,
        personality=personality,
    )

    provider = settings.AI_PROVIDER.lower()

    if provider == "gemini" and settings.GEMINI_API_KEY:
        return await _generate_with_gemini(prompt)
    elif provider == "openai" and settings.OPENAI_API_KEY:
        return await _generate_with_openai(prompt)
    else:
        return None  # Will fall back to template engine


async def generate_random_confession_with_ai() -> Optional[str]:
    """Generate a random confession using AI."""
    provider = settings.AI_PROVIDER.lower()

    if provider == "gemini" and settings.GEMINI_API_KEY:
        return await _generate_confession_gemini()
    elif provider == "openai" and settings.OPENAI_API_KEY:
        return await _generate_confession_openai()
    return None


async def _generate_with_gemini(prompt: str) -> Optional[dict]:
    try:
        import google.generativeai as genai

        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel(settings.AI_MODEL)

        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=1.0,
                    max_output_tokens=4096,
                ),
            ),
        )
        raw = response.text.strip()
        raw = _clean_json_response(raw)
        return json.loads(raw)
    except Exception as e:
        print(f"[Gemini error] {e}")
        return None


async def _generate_with_openai(prompt: str) -> Optional[dict]:
    try:
        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=1.0,
            max_tokens=4096,
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content
        return json.loads(raw)
    except Exception as e:
        print(f"[OpenAI error] {e}")
        return None


async def _generate_confession_gemini() -> Optional[str]:
    try:
        import google.generativeai as genai

        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel(settings.AI_MODEL)

        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, lambda: model.generate_content(CONFESSION_GENERATOR_PROMPT)
        )
        return response.text.strip()
    except Exception as e:
        print(f"[Gemini confession error] {e}")
        return None


async def _generate_confession_openai() -> Optional[str]:
    try:
        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": CONFESSION_GENERATOR_PROMPT}],
            temperature=1.2,
            max_tokens=200,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"[OpenAI confession error] {e}")
        return None


def _clean_json_response(raw: str) -> str:
    """Strip markdown fences if the model added them."""
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    return raw.strip()
