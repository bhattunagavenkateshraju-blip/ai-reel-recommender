/**
 * Gemini AI Service Integration
 * 
 * Provides live AI inference via Google Gemini API (gemini-3.6-flash / gemini-2.5-flash / gemini-1.5-flash)
 * for real-time transcript reasoning, trap evasion, and 60-second Educational Tech Reel Script generation.
 */

export class GeminiService {
  constructor() {
    this.storageKey = 'ANTIGRAVITY_GEMINI_API_KEY';
    this.model = 'gemini-2.5-flash';
  }

  getApiKey() {
    try {
      return localStorage.getItem(this.storageKey) || '';
    } catch (e) {
      return '';
    }
  }

  setApiKey(key) {
    try {
      localStorage.setItem(this.storageKey, key.trim());
    } catch (e) {
      console.warn('Could not persist API key to localStorage', e);
    }
  }

  hasApiKey() {
    return !!this.getApiKey();
  }

  /**
   * System Prompt enforcing deep context reasoning, anti-hype filtration, and the exact required schema.
   */
  _getSystemInstruction() {
    return `You are an elite AI Recommendation Agent specializing in analyzing short-form video reels watched by students.
Your goal is to infer the student's underlying academic and career interests (beyond superficial literal keywords), evade clickbait/hype traps, and recommend engaging, high-signal technology-related Reels to turn mindless scrolling into purposeful skill building.

BUILT-IN TRAP TO EVADE:
If a student watches developer humor, career lifestyle, interview jokes, or gadget teardowns:
- DO NOT recommend shallow syntax tutorials (e.g. "What is a variable in Java")
- DO NOT recommend predatory AI hype (e.g. "10 AI tools that will get you a job tomorrow without coding")
- DO infer the broader Computer Science, Systems Engineering, JVM internals, Algorithmic Complexity, or Computer Architecture interests.

STRICT REQUIRED OUTPUT FORMAT (You must output ONLY this exact plain text block, no markdown code fences or conversational greetings):
CURRENT REEL: [reference]
INTEREST DETECTED: [topic / interest]
WHY: [evidence from content]
RECOMMENDED TECH REEL: [topic/title]
CATEGORY: [Must be exactly one of: AI / DSA / Java / HLD / Cybersecurity / Cloud / Hardware / Career / Other]
WHY THIS RECOMMENDATION: [connection to interest]
DIFFICULTY: [Must be exactly one of: Beginner / Intermediate / Advanced]
CONFIDENCE: [Must be exactly one of: High / Medium / Low]`;
  }

  /**
   * Live Gemini Analysis of any arbitrary Reel transcript.
   */
  async analyzeWithGemini(reelData, customKey = null) {
    const apiKey = customKey || this.getApiKey();
    if (!apiKey) {
      throw new Error('No Gemini API key provided. Please enter an API key or use the built-in heuristic agent.');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${apiKey}`;

    const prompt = `Analyze this student's interacted Reel:
TITLE: ${reelData.title || 'Untitled Reel'}
CATEGORY: ${reelData.category || 'General'}
TRANSCRIPT: ${reelData.transcript || ''}
TAGS: ${Array.isArray(reelData.tags) ? reelData.tags.join(', ') : reelData.tags || ''}

Generate the recommendation following the STRICT REQUIRED OUTPUT FORMAT.`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      systemInstruction: {
        parts: [{ text: this._getSystemInstruction() }]
      },
      generationConfig: {
        temperature: 0.2,
        topP: 0.95,
        maxOutputTokens: 800
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Gemini API error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    const outputText = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    return {
      rawText: outputText.trim(),
      parsed: this._parseRequiredOutputText(outputText.trim())
    };
  }

  /**
   * Generate a 60-second Educational Tech Reel Script for a recommended topic.
   */
  async generateReelScript(recommendedTopic, category, targetDifficulty, customKey = null) {
    const apiKey = customKey || this.getApiKey();
    if (!apiKey) {
      throw new Error('Gemini API key required for live script generation.');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${apiKey}`;

    const prompt = `Write a viral, high-signal, 60-second educational Tech Reel script for students on the topic:
TOPIC: "${recommendedTopic}"
CATEGORY: ${category}
DIFFICULTY: ${targetDifficulty}

Structure the response in JSON with the following keys:
{
  "hook": "Spoken hook in the first 3 seconds (provocative question or surprising technical paradox)",
  "visualScenes": [
    { "timestamp": "0:00 - 0:10", "visualPrompt": "Detailed storyboard prompt for video animator", "voiceover": "Narrator dialogue" },
    { "timestamp": "0:10 - 0:30", "visualPrompt": "Visualizing the underlying mechanism / code diagram", "voiceover": "Narrator dialogue" },
    { "timestamp": "0:30 - 0:50", "visualPrompt": "Fixing the problem / applying the architectural principle", "voiceover": "Narrator dialogue" },
    { "timestamp": "0:50 - 1:00", "visualPrompt": "Key takeaway summary card + challenge question", "voiceover": "Call to action dialogue" }
  ],
  "keyTakeaway": "One-sentence core concept summary",
  "challengeQuestion": "Quick test question for the student viewer"
}`;

    const requestBody = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Gemini API error: ${response.status}`);
    }

    const json = await response.json();
    const rawJsonText = json.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    return JSON.parse(rawJsonText);
  }

  _parseRequiredOutputText(text) {
    const fields = {
      currentReel: '',
      interestDetected: '',
      whyEvidence: '',
      recommendedTechReel: '',
      category: 'Other',
      whyThisRecommendation: '',
      difficulty: 'Intermediate',
      confidence: 'High'
    };

    const getField = (prefix) => {
      const match = text.match(new RegExp(`${prefix}:?\\s*([^\n]+(?:\n(?!CURRENT|INTEREST|WHY|RECOMMENDED|CATEGORY|DIFFICULTY|CONFIDENCE)[^\n]+)*)`, 'i'));
      return match ? match[1].trim() : '';
    };

    fields.currentReel = getField('CURRENT REEL');
    fields.interestDetected = getField('INTEREST DETECTED');
    fields.whyEvidence = getField('WHY');
    fields.recommendedTechReel = getField('RECOMMENDED TECH REEL');
    fields.category = getField('CATEGORY') || 'Other';
    fields.whyThisRecommendation = getField('WHY THIS RECOMMENDATION');
    fields.difficulty = getField('DIFFICULTY') || 'Intermediate';
    fields.confidence = getField('CONFIDENCE') || 'High';

    return fields;
  }
}
