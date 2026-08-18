"""
Python Gemini Service & CLI Reel Recommender
Demonstrates live Gemini LLM API integration with prompt orchestration,
anti-hype guardrails, and 60-second Tech Reel script generation.
"""

import os
import sys
import json
import urllib.request
import urllib.error

if sys.platform == "win32":
  sys.stdout.reconfigure(encoding='utf-8')

SYSTEM_PROMPT = """You are an elite AI Recommendation Agent specializing in analyzing short-form video reels watched by students.
Your goal is to infer the student's underlying academic and career interests (beyond superficial literal keywords), evade clickbait/hype traps, and recommend engaging, high-signal technology-related Reels to turn mindless scrolling into purposeful skill building.

BUILT-IN TRAP TO EVADE:
If a student watches developer humor, career lifestyle, interview jokes, or gadget teardowns:
- DO NOT recommend shallow syntax tutorials (e.g. "What is a variable in Java")
- DO NOT recommend predatory AI hype (e.g. "10 AI tools that will get you a job tomorrow without coding")
- DO infer the broader Computer Science, Systems Engineering, JVM internals, Algorithmic Complexity, or Computer Architecture interests.

STRICT REQUIRED OUTPUT FORMAT:
CURRENT REEL: [reference]
INTEREST DETECTED: [topic / interest]
WHY: [evidence from content]
RECOMMENDED TECH REEL: [topic/title]
CATEGORY: [Must be one of: AI / DSA / Java / HLD / Cybersecurity / Cloud / Hardware / Career / Other]
WHY THIS RECOMMENDATION: [connection to interest]
DIFFICULTY: [Must be one of: Beginner / Intermediate / Advanced]
CONFIDENCE: [Must be one of: High / Medium / Low]"""

def analyze_reel_with_gemini(api_key, title, category, transcript, tags=""):
  model = "gemini-2.5-flash"
  url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
  
  user_prompt = f"""Analyze this student's interacted Reel:
TITLE: {title}
CATEGORY: {category}
TRANSCRIPT: {transcript}
TAGS: {tags}

Generate the recommendation following the STRICT REQUIRED OUTPUT FORMAT."""

  payload = {
    "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
    "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
    "generationConfig": {"temperature": 0.2, "maxOutputTokens": 800}
  }

  req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json"}
  )

  try:
    with urllib.request.urlopen(req) as resp:
      data = json.loads(resp.read().decode("utf-8"))
      return data["candidates"][0]["content"]["parts"][0]["text"].strip()
  except urllib.error.HTTPError as e:
    err_body = e.read().decode("utf-8")
    return f"HTTP Error {e.code}: {err_body}"
  except Exception as ex:
    return f"Error: {str(ex)}"

if __name__ == "__main__":
  api_key = os.environ.get("GEMINI_API_KEY", "")
  print("=" * 60)
  print("✨ AI TECH REEL RECOMMENDATION AGENT - GEMINI SERVICE")
  print("=" * 60)

  if not api_key:
    print("\nℹ️ No GEMINI_API_KEY environment variable detected.")
    print("Usage: Set GEMINI_API_KEY=your_key and run:")
    print("python server/gemini_service.py\n")
    print("To test offline without an API key, run:")
    print("python test/verify_agent.py")
    sys.exit(0)

  # Run test case
  sample_title = "Friday 5 PM Prod Push"
  sample_cat = "Programming Memes"
  sample_transcript = "When you fix a production crash by adding 15 nested if-else null checks and push straight to main at 4:59 PM on Friday."
  
  print(f"\nAnalyzing: {sample_title} ({sample_cat})...")
  result = analyze_reel_with_gemini(api_key, sample_title, sample_cat, sample_transcript, "#java #memes")
  print("\n" + result + "\n")
