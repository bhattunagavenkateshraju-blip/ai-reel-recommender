# AI-Powered Tech Reel Recommendation Agent

An intelligent recommendation agent that analyzes short-form video Reels a student interacts with, infers their underlying academic and career interests (beyond superficial literal keywords), evades clickbait/hype traps, and recommends engaging, high-signal educational technology Reels to turn mindless scrolling into purposeful skill building.

---

## 🌟 Key Capabilities

1. **Multi-Modal Context & Intent Extraction**: Analyzes transcript semantics, humor/satire subtext, developer culture friction points, and hardware workloads rather than relying on naive keyword lookups.
2. **Built-in Trap Evasion**:
   - **The Trap**: A student watches a Java meme, SWE lifestyle vlog, coding interview joke, and laptop comparison. A naive system recommends generic "Java 101: What is a variable?" or predatory "10 AI tools that get you a $200k job tomorrow without coding!"
   - **Our Solution**: Infers the broader Software Engineering / Systems persona and recommends high-signal JVM garbage collection internals, Kafka consumer backpressure design, Dual-Pivot Quicksort CPU cache locality, and unified memory compiler architectures.
3. **Strict Required Output Format**: Produces structured, copyable evaluations across all required fields.
4. **Interactive Web Application & Video Feed Simulator**: Procedural canvas animations, sound wave visualizations, real-time latent interest SVG radar chart, live agent thought process inspector, and custom reel lab.
5. **✨ Live Gemini 2.5 Flash AI Studio**: Connects directly to the Google Gemini API for zero-shot reasoning on live transcripts and auto-generates **60-Second Educational Tech Reel Scripts** with visual storyboards and narrator audio dialogue.
6. **Zero-Dependency Standalone Bundle**: Single portable HTML file (`dist/standalone.html`) runnable offline or in any modern browser.

---

## 📋 Required Output Specification

For each analysis:
```text
CURRENT REEL: [reference]
INTEREST DETECTED: [topic / interest]
WHY: [evidence from content]
RECOMMENDED TECH REEL: [topic/title]
CATEGORY: [AI / DSA / Java / HLD / Cybersecurity / Cloud / Hardware / Career / Other]
WHY THIS RECOMMENDATION: [connection to interest]
DIFFICULTY: [Beginner / Intermediate / Advanced]
CONFIDENCE: [High / Medium / Low]
```

---

## 🚀 Quick Start

### 1. Run Web Application Locally
```bash
python -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### 2. Open Standalone Single-File Bundle
You can double-click or open `dist/standalone.html` directly in any web browser without starting any web server.

To rebuild the standalone bundle:
```bash
python scripts/build_standalone.py
```

### 3. Run Automated Verification Tests
```bash
python test/verify_agent.py
```
Executes 90 automated test assertions verifying schema compliance, category constraints, anti-hype gate enforcement, and trap scenario evasion.

### 4. Run Gemini CLI Service (Optional)
```bash
set GEMINI_API_KEY=your_api_key
python server/gemini_service.py
```

---

## 📂 Project Structure

```
├── index.html                   # Main interactive web application UI
├── css/
│   └── styles.css               # Design system (tokens, typography, responsive layout, dark theme)
├── js/
│   ├── dataset.js               # 8+ sample reels, high-signal tech catalog, anti-hype rules, presets
│   ├── agent.js                 # AI Recommendation Agent engine (context extraction, latent graph, scoring)
│   ├── gemini-service.js        # Live Google Gemini API service & 60s Reel Script generator
│   ├── trap-analyzer.js         # Built-in trap diagnostic & naive vs deep agent comparator
│   ├── ui-feed.js               # Interactive canvas reel simulator & engagement controls
│   ├── ui-radar.js              # SVG radar visualizer & category distribution charts
│   └── app.js                   # Application coordinator & event dispatcher
├── dist/
│   └── standalone.html          # Self-contained zero-dependency portable distribution
├── test/
│   ├── verify_agent.py          # Python automated test suite (90/90 passed)
│   └── test-agent.js            # Node.js automated test suite
├── server/
│   └── gemini_service.py        # Python backend Gemini CLI runner
├── scripts/
│   └── build_standalone.py      # Standalone single-file HTML compiler
├── firebase.json                # Firebase Hosting deployment config
└── .github/workflows/deploy.yml # GitHub Pages CI/CD workflow
```

---

## 🛡️ Built-in Trap Mitigation Comparison

| Sample Watched | Shallow / Keyword Matcher *(Trap)* | Context-Aware AI Agent *(Our Solution)* |
| :--- | :--- | :--- |
| **Java Meme** | *Learn Java in 10 Mins: What is a Variable?* ❌ | **How the JVM Garbage Collector Actually Works: Stop Microservices Freezing** 🛡️ (`Java` &bull; `Intermediate`) |
| **Junior SWE Vlog** | *Top 10 Aesthetic Coffee Shops for Influencers* ❌ | **Surviving Kafka Consumer Lag: Partition Rebalancing & Backpressure** 🛡️ (`HLD` &bull; `Intermediate`) |
| **Interview Two-Sum** | *Top 10 AI Tools to Get a $200k FAANG Job!* ❌ | **Why Dual-Pivot Quicksort & Timsort Beat Naive Algorithms in Silicon** 🛡️ (`DSA` &bull; `Intermediate`) |
| **Kernel Compile** | *Top 5 RGB Gaming Laptops Under $600* ❌ | **How Unified Memory & CPU Cache Lines Supercharge Compilers** 🛡️ (`Hardware` &bull; `Advanced`) |

---

## 📜 License
MIT License. Built for educational micro-learning and student empowerment.
