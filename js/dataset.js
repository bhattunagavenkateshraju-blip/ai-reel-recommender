/**
 * Dataset of 8 Diverse Sample Reels & Curated High-Signal Tech Knowledge Base
 * Covering Entertainment, Gaming, Coding, AI, Gadgets, Career, Programming Memes, and Tech News.
 */

export const SAMPLE_REELS = [
  {
    id: "reel-1",
    title: "Friday 5 PM Prod Push",
    category: "Programming Memes",
    creator: "@dev_humor",
    duration: 18,
    likes: "142K",
    comments: "2.8K",
    shares: "34K",
    tags: ["#codinghumor", "#java", "#nullpointer", "#developerlife", "#gitpush"],
    audio: "Dramatic suspense violin drop",
    videoVisualType: "meme-matrix",
    transcript: "When you fix a production crash by adding 15 nested if-else null checks, commit message 'minor fix', push straight to main at 4:59 PM on Friday, and shut your laptop before the CI pipeline triggers NullPointerException in cluster 3.",
    metadata: {
      tone: "Self-deprecating satire / Meme",
      surfaceKeywords: ["Java", "null checks", "production crash", "NullPointerException", "CI pipeline"],
      underlyingConcept: "Defensive programming pitfalls, exception handling models, Null safety, and CI/CD deployment safeguards",
      emotionalState: "Anxiety about brittle code and production reliability"
    }
  },
  {
    id: "reel-2",
    title: "Day in the Life: Junior Backend SWE",
    category: "Career / SWE Lifestyle",
    creator: "@alex_codes_seattle",
    duration: 32,
    likes: "89K",
    comments: "1.4K",
    shares: "12K",
    tags: ["#dayinthelife", "#backendengineer", "#techcareer", "#kafka", "#microservices"],
    audio: "Chill Lo-Fi Beat - Coffee in Seattle",
    videoVisualType: "lifestyle-vlog",
    transcript: "7:30 AM matcha latte walk. 9:00 AM daily standup pretending I understand the legacy auth service. 11:00 AM investigating why Kafka consumer group lag jumped to 400,000 messages during morning traffic spike. 2:00 PM pairing with senior engineer on database connection pool starvation. 5:00 PM free gym and surviving day 180 as a backend engineer.",
    metadata: {
      tone: "Aspirational lifestyle vlog with real engineering friction points",
      surfaceKeywords: ["matcha", "standup", "Kafka", "consumer lag", "backend engineer", "connection pool"],
      underlyingConcept: "Distributed message queues, event streaming architectures, backpressure, and database connection pooling",
      emotionalState: "Desire for genuine backend competence behind lifestyle veneer"
    }
  },
  {
    id: "reel-3",
    title: "Interviewer Asks Two-Sum Optimization",
    category: "DSA / Coding Interview",
    creator: "@algo_trauma",
    duration: 24,
    likes: "210K",
    comments: "4.1K",
    shares: "52K",
    tags: ["#leetcode", "#codinginterview", "#faangprep", "#dsa", "#twosum"],
    audio: "Tense heartbeat to fast rap drop",
    videoVisualType: "sketch-comedy",
    transcript: "Interviewer: 'Great, your nested loop brute force works in O(n^2). Now can you make it linear time O(n)?' Me sweating profusely pretending I didn't frantically cram hash map complement lookups in the company lobby 6 minutes before the zoom call.",
    metadata: {
      tone: "Relatable interview anxiety comedy",
      surfaceKeywords: ["Two-Sum", "O(n^2)", "linear time", "hash map", "interview", "LeetCode"],
      underlyingConcept: "Algorithmic time-space tradeoffs, hash collisions, amortized complexity, and interview problem patterns",
      emotionalState: "Interview performance pressure and need for deep algorithmic intuition over rote memorization"
    }
  },
  {
    id: "reel-4",
    title: "Snapdragon X Elite vs M3 Pro vs RTX 4080: The Kernel Compile Stress Test",
    category: "Gadgets / Hardware",
    creator: "@silicon_benchmarks",
    duration: 45,
    likes: "95K",
    comments: "3.2K",
    shares: "18K",
    tags: ["#hardware", "#m3pro", "#snapdragonx", "#laptopreview", "#benchmarks", "#linuxkernel"],
    audio: "High-octane synthwave electronic track",
    videoVisualType: "hardware-teardown",
    transcript: "Is ARM on Windows ready for developers? We threw a complete Linux kernel compilation across 32 threads on the Snapdragon X Elite, Apple M3 Pro with 36GB unified memory, and an RTX 4080 beast laptop. Watch thermal throttling kick in at second 28 and see how memory bandwidth changes everything.",
    metadata: {
      tone: "Technical comparison / Hardware analysis",
      surfaceKeywords: ["Snapdragon", "M3 Pro", "RTX 4080", "kernel compile", "ARM", "unified memory", "thermal throttle"],
      underlyingConcept: "CPU microarchitecture, ARM vs x86 instruction sets, unified memory bandwidth, multi-core compilation parallelism, and thermal management",
      emotionalState: "High curiosity about developer toolchain performance and computer hardware architecture"
    }
  },
  {
    id: "reel-5",
    title: "Building an 8-bit Computer Inside Minecraft with Logic Gates",
    category: "Gaming / Systems Under the Hood",
    creator: "@redstone_architect",
    duration: 40,
    likes: "340K",
    comments: "7.8K",
    shares: "91K",
    tags: ["#minecraft", "#redstone", "#computerscience", "#logicgates", "#turingcomplete"],
    audio: "Epic orchestral buildup - Interstellar style",
    videoVisualType: "game-simulation",
    transcript: "People think Minecraft is just placing blocks. But using redstone repeaters as diodes, torches as NOT gates, and building NAND circuits, we constructed an entire 8-bit Arithmetic Logic Unit with 256 bytes of RAM that can compute Fibonacci numbers inside a video game.",
    metadata: {
      tone: "Mind-blowing technical feat in a gaming environment",
      surfaceKeywords: ["Minecraft", "redstone", "logic gates", "ALU", "RAM", "Fibonacci", "Turing complete"],
      underlyingConcept: "Digital logic design, boolean algebra, Von Neumann architecture, CPU instruction cycles, and hardware fundamentals",
      emotionalState: "Deep fascination with foundational systems and computing mechanics through gaming"
    }
  },
  {
    id: "reel-6",
    title: "OpenAI Operator / Deep Research: How Autonomous Agents Actually Navigate DOM",
    category: "AI / Tech News",
    creator: "@deep_tech_breakdown",
    duration: 38,
    likes: "175K",
    comments: "2.1K",
    shares: "38K",
    tags: ["#ai", "#agenticai", "#browseruse", "#llmarchitecture", "#technews", "#deeptech"],
    audio: "Pulsing modern techno beat",
    videoVisualType: "ai-flowchart",
    transcript: "Everyone is hyping browser-controlling AI agents, but how does the model actually interact with web pages without burning millions of tokens? Look under the hood: DOM tree pruning, accessibility tree (AXTree) representation, bounding box coordinate grounding, and multimodal action token generation.",
    metadata: {
      tone: "Pragmatic deep-dive cutting through media hype",
      surfaceKeywords: ["AI agents", "browser use", "DOM tree", "AXTree", "multimodal", "tokens"],
      underlyingConcept: "Agentic AI architectures, DOM/Accessibility tree parsing, coordinate grounding, vision-language model planning, and inference cost optimization",
      emotionalState: "Desire to understand the real engineering mechanics of AI beyond marketing claims"
    }
  },
  {
    id: "reel-7",
    title: "10,000 Particle Physics Simulation of the 3-Body Problem in WebGL",
    category: "Entertainment / Math & Graphics",
    creator: "@math_visualized",
    duration: 28,
    likes: "260K",
    comments: "3.5K",
    shares: "64K",
    tags: ["#math", "#physics", "#webgl", "#threebodyproblem", "#creativecoding", "#chaos"],
    audio: "Cosmic ambient soundscape",
    videoVisualType: "math-particles",
    transcript: "Watch what happens when you shift the initial velocity of Body C by just 0.00001 millimeters. Using a Runge-Kutta 4th order integrator computed directly on GPU shader fragments in WebGL, 10,000 simulated stars demonstrate deterministic chaos in 60 FPS real time.",
    metadata: {
      tone: "Hypnotic scientific visualizer with engineering depth",
      surfaceKeywords: ["3-Body Problem", "WebGL", "GPU shader", "Runge-Kutta", "chaos theory", "particles"],
      underlyingConcept: "GPU fragment shaders, numerical integration algorithms, real-time computer graphics, and mathematical modeling",
      emotionalState: "Aesthetic appreciation for computational physics and visual programming"
    }
  },
  {
    id: "reel-8",
    title: "How a $5 USB Rubber Ducky Injects 1,000 Words Per Minute",
    category: "Cybersecurity / Pop Culture Tech",
    creator: "@whitehat_labs",
    duration: 35,
    likes: "198K",
    comments: "3.1K",
    shares: "45K",
    tags: ["#cybersecurity", "#infosec", "#rubberducky", "#ethicalhacking", "#hardwaresecurity"],
    audio: "Cyberpunk synth arpeggio",
    videoVisualType: "security-terminal",
    transcript: "Why doesn't your antivirus block a malicious USB keystroke injection? Because the operating system trusts Human Interface Devices (HID) by default. The microcontroller mimics a standard keyboard, fires pre-programmed payload keystrokes at 1,000 WPM, opens PowerShell, and executes before the OS even shows a prompt.",
    metadata: {
      tone: "Exciting real-world security breakdown",
      surfaceKeywords: ["Rubber Ducky", "USB", "antivirus", "HID", "keystroke injection", "PowerShell", "microcontroller"],
      underlyingConcept: "Hardware security, USB Human Interface Device spoofing, OS trust boundaries, payload execution, and endpoint defensive posture",
      emotionalState: "Fascination with security exploits, hardware-firmware boundaries, and defensive countermeasures"
    }
  }
];

/**
 * Curated Pool of High-Signal, Engaging Educational Tech Reels
 * Designed to provide genuine substance without falling into shallow clickbait traps.
 */
export const TECH_REELS_CATALOG = [
  {
    id: "tech-1",
    title: "How the JVM Garbage Collector Actually Works: Stop Your Microservices From Freezing",
    category: "Java",
    difficulty: "Intermediate",
    confidence: "High",
    creator: "@jvm_internals_pro",
    duration: 52,
    targetInterests: ["Java", "Backend Systems", "JVM Internals", "Memory Management", "Microservices Performance"],
    antiHypeScore: 98,
    isHypeClickbait: false,
    hook: "Ever wondered why your Java service gets random 2-second latency spikes under load?",
    whyHighSignal: "Explains Eden Space, Survivor spaces, Tenured generation, ZGC vs G1GC generational garbage collection, and avoiding Stop-The-World pauses with visual memory allocations.",
    summary: "Visual walkthrough of JVM memory heaps, generational GC algorithms (G1 vs ZGC), object promotion mechanics, and tuning flags for low-latency backend systems."
  },
  {
    id: "tech-2",
    title: "Why Dual-Pivot Quicksort & Timsort Beat Naive Algorithms in Real Production",
    category: "DSA",
    difficulty: "Intermediate",
    confidence: "High",
    creator: "@algorithms_unlocked",
    duration: 48,
    targetInterests: ["DSA", "Coding Interview", "Algorithmic Complexity", "Algorithm Optimization", "Problem Solving"],
    antiHypeScore: 95,
    isHypeClickbait: false,
    hook: "Why doesn't Java or Python standard library use regular Quicksort or MergeSort?",
    whyHighSignal: "Deconstructs CPU cache locality, branch prediction, and how hybrid sorting algorithms achieve O(N) performance on partially sorted real-world data.",
    summary: "Exploration of production sorting algorithms (Timsort in Python, Dual-Pivot Quicksort in Java), showing how memory cache lines make theoretical big-O behave differently in silicon."
  },
  {
    id: "tech-3",
    title: "Surviving Kafka Consumer Lag: Partition Rebalancing and Backpressure Patterns Explained",
    category: "HLD",
    difficulty: "Intermediate",
    confidence: "High",
    creator: "@distributed_systems_daily",
    duration: 55,
    targetInterests: ["Backend Systems", "Distributed Systems", "High Level Design", "Kafka", "Cloud Architecture"],
    antiHypeScore: 97,
    isHypeClickbait: false,
    hook: "Your message queue has 500k unread events and your pods are crashing. Here is the step-by-step fix.",
    whyHighSignal: "Breaks down partition distribution, heartbeat intervals, batch commit semantics, and circuit-breaker backpressure without buzzwords.",
    summary: "Practical high-level design breakdown of event-driven distributed systems handling massive traffic spikes, partition rebalancing storms, and database write throughput bottlenecks."
  },
  {
    id: "tech-4",
    title: "How Unified Memory & CPU Cache Lines Supercharge Modern Compilers",
    category: "Hardware",
    difficulty: "Advanced",
    confidence: "High",
    creator: "@silicon_architecture",
    duration: 58,
    targetInterests: ["Hardware", "Computer Architecture", "Developer Toolchains", "Memory Bandwidth", "Low Level Systems"],
    antiHypeScore: 96,
    isHypeClickbait: false,
    hook: "Why does a 16-core ARM chip compile C++ code faster than a 64-core server with slow RAM?",
    whyHighSignal: "Explains L1/L2/L3 cache misses, memory bus contention during LLVM parsing, and zero-copy unified memory architecture.",
    summary: "In-depth computer architecture breakdown demonstrating how memory bandwidth, cache pre-fetching, and unified memory buses dominate multi-threaded compilation workloads."
  },
  {
    id: "tech-5",
    title: "From Logic Gates to the CPU Instruction Cycle: How Silicon Executes 'a + b'",
    category: "Other",
    difficulty: "Beginner",
    confidence: "High",
    creator: "@beneater_inspired",
    duration: 50,
    targetInterests: ["Computer Architecture", "Digital Logic", "CS Fundamentals", "Systems Programming"],
    antiHypeScore: 99,
    isHypeClickbait: false,
    hook: "What actually happens on a microscopic level when your computer evaluates a single addition?",
    whyHighSignal: "Visualizes Full Adders, the Program Counter, Instruction Register, and clock ticks executing machine opcode in animated silicon paths.",
    summary: "Clear, visual breakdown bridging boolean logic gates, transistor switches, and the CPU fetch-decode-execute cycle that powers every computer program."
  },
  {
    id: "tech-6",
    title: "Building an Autonomous Web Agent from Scratch in 100 Lines of Python & Playwright",
    category: "AI",
    difficulty: "Intermediate",
    confidence: "High",
    creator: "@applied_ai_eng",
    duration: 59,
    targetInterests: ["AI", "Agentic Systems", "Web Automation", "LLM Engineering", "Python Systems"],
    antiHypeScore: 94,
    isHypeClickbait: false,
    hook: "Stop paying for wrapper apps. Here is the raw loop behind browser-controlling AI agents.",
    whyHighSignal: "Shows exact prompt schema, structured JSON function calling, accessibility tree filtering, and resilient DOM selector fallbacks with real code.",
    summary: "Hands-on implementation of an autonomous browser agent: scraping accessibility snapshots, sending structured state to an LLM, and executing click/type actions via Playwright."
  },
  {
    id: "tech-7",
    title: "Writing Custom GPU Fragment Shaders in GLSL: Raymarching 3D Fractals in 60 FPS",
    category: "Other",
    difficulty: "Advanced",
    confidence: "High",
    creator: "@shader_toy_mastery",
    duration: 54,
    targetInterests: ["Computer Graphics", "GPU Programming", "Mathematics & Physics", "Creative Coding", "WebGL/GLSL"],
    antiHypeScore: 96,
    isHypeClickbait: false,
    hook: "How to render photorealistic 3D mathematical worlds without a single polygon using signed distance functions.",
    whyHighSignal: "Deep dive into raymarching algorithms, signed distance functions (SDF), light vector dot products, and parallel GPU fragment execution.",
    summary: "Visual and mathematical tutorial explaining how GLSL pixel shaders compute light rays, normal vectors, and recursive fractal geometry directly on the GPU."
  },
  {
    id: "tech-8",
    title: "USB HID Attack Defense: How to Detect and Block BadUSB at the Linux & Windows Kernel Level",
    category: "Cybersecurity",
    difficulty: "Intermediate",
    confidence: "High",
    creator: "@kernel_security_lab",
    duration: 50,
    targetInterests: ["Cybersecurity", "Endpoint Defense", "Operating Systems", "Hardware Security", "Kernel Architecture"],
    antiHypeScore: 97,
    isHypeClickbait: false,
    hook: "How system administrators stop keystroke injection attacks cold using USB device whitelisting and typing velocity heuristic daemons.",
    whyHighSignal: "Explains Linux `udev` rules, Windows Device Guard policies, and open-source typing cadency analysis daemons that detect synthetic 1,000 WPM input.",
    summary: "Practical defensive cybersecurity guide covering USB device enumeration, authorization policies, and behavioral heuristics that prevent unauthorized HID payloads."
  },
  {
    id: "tech-9",
    title: "System Design 101: Designing a Real-Time Collaborative Doc (CRDT vs OT)",
    category: "HLD",
    difficulty: "Advanced",
    confidence: "High",
    creator: "@system_design_forge",
    duration: 56,
    targetInterests: ["High Level Design", "Distributed Systems", "Backend Architecture", "Data Structures", "Career Growth"],
    antiHypeScore: 98,
    isHypeClickbait: false,
    hook: "How Google Docs and Figma resolve simultaneous typing conflicts across 50 users without a lock.",
    whyHighSignal: "Compares Operational Transformation (OT) with Conflict-free Replicated Data Types (CRDTs) with visual state graphs.",
    summary: "Comprehensive architectural breakdown of concurrent editing protocols, vector clocks, and tombstone garbage collection in distributed collaborative apps."
  },
  {
    id: "tech-10",
    title: "Memory Safety Deep Dive: How Rust Ownership & Borrow Checker Eliminates Use-After-Free at Compile Time",
    category: "Other",
    difficulty: "Intermediate",
    confidence: "High",
    creator: "@lowlevel_chronicles",
    duration: 51,
    targetInterests: ["Systems Programming", "Memory Safety", "Rust / C++", "Compiler Design"],
    antiHypeScore: 99,
    isHypeClickbait: false,
    hook: "Why 70% of all Microsoft and Google security vulnerabilities are memory bugs, and how affine type systems fix them without a garbage collector.",
    whyHighSignal: "Breaks down stack vs heap pointers, lifetime annotations, RAII, and zero-cost compile-time static analysis.",
    summary: "Deep technical dive into memory layout, pointer lifetimes, and how the compiler mathematically proves pointer safety before generating assembly."
  },
  {
    id: "tech-11",
    title: "SQL Query Planner Internals: Why Your 'SELECT *' Ignores Your Index and How to Fix It",
    category: "Cloud",
    difficulty: "Intermediate",
    confidence: "High",
    creator: "@db_internals_guy",
    duration: 47,
    targetInterests: ["Database Internals", "SQL Optimization", "Backend Systems", "Data Engineering"],
    antiHypeScore: 97,
    isHypeClickbait: false,
    hook: "You created an index on user_id, but Postgres is still doing a Sequential Scan. Why?",
    whyHighSignal: "Deconstructs B-Tree node page reads, cost estimation formulas, selectivity heuristics, and EXPLAIN ANALYZE interpretation.",
    summary: "Visual guide to database execution engines, B-tree index traversal, index-only scans vs heap fetches, and tuning slow relational queries."
  },
  {
    id: "tech-12",
    title: "Demystifying Transformer Attention: What Q, K, V Matrices Actually Do in 60 Seconds",
    category: "AI",
    difficulty: "Intermediate",
    confidence: "High",
    creator: "@ml_foundations",
    duration: 59,
    targetInterests: ["AI", "Machine Learning", "Transformer Architecture", "Deep Learning Fundamentals"],
    antiHypeScore: 98,
    isHypeClickbait: false,
    hook: "Skip the pop-science buzzwords. Here is the pure linear algebra behind multi-head self-attention.",
    whyHighSignal: "Visual matrix multiplication walkthrough showing how dot product similarity scores create dynamic context weights between tokens.",
    summary: "Rigorous yet intuitive visualization of query, key, value projections, softmax temperature scaling, and context vector creation in LLM attention layers."
  }
];

/**
 * Examples of Low-Signal / Clickbait Hype Content (Rejected by our Anti-Hype Gate)
 * Used to illustrate the Trap and Quality Filter functionality.
 */
export const REJECTED_HYPE_EXAMPLES = [
  {
    title: "Top 10 AI Tools That Will Get You a $200,000 FAANG Job Tomorrow Without Coding!",
    reason: "Zero educational substance; predatory career hype; generic affiliate listicle."
  },
  {
    title: "Learn Java in 10 Minutes: What is a Variable? (Java 101)",
    reason: "Shallow literal keyword match; assumes student watching advanced concurrency/CI meme is a day-1 beginner needing syntax basics."
  },
  {
    title: "Copy-Paste This 1 Prompt To Build a Million Dollar SaaS App in 5 Minutes",
    reason: "False productivity promise; ignores systems engineering, security, databases, and deployment."
  },
  {
    title: "Coding is Dead in 2026! Stop Learning Data Structures and Use This Tool Instead",
    reason: "Alarmist clickbait designed for outrage engagement rather than durable technical capability."
  }
];

/**
 * Curated Student Interaction Presets for Testing & Simulation
 */
export const PRESETS = [
  {
    id: "preset-trap",
    name: "The Built-In Trap Scenario",
    description: "Student watches Java meme + SWE lifestyle + interview joke + laptop comparison. Tests if system infers broader Software Engineering & Systems fundamentals or falls into shallow keyword / AI hype traps.",
    reels: ["reel-1", "reel-2", "reel-3", "reel-4"],
    expectedInference: "Aspiring Backend & Systems Software Engineer preparing for tech career hurdles and performance-sensitive development.",
    avoidanceGoal: "Reject generic Java syntax basics and generic '10 AI job tools' hype. Recommend JVM GC memory management, production sorting algorithms, and memory architecture."
  },
  {
    id: "preset-gaming-systems",
    name: "Gaming to Systems & Graphics",
    description: "Student interacts with Minecraft redstone computers and WebGL 3-Body particle physics.",
    reels: ["reel-5", "reel-7"],
    expectedInference: "Deep curiosity in digital logic, CPU architecture, GPU shaders, and mathematical modeling.",
    avoidanceGoal: "Don't just recommend game streaming clips; recommend CPU instruction cycle breakdowns and GLSL raymarching shaders."
  },
  {
    id: "preset-ai-deep-tech",
    name: "Pragmatic AI & Systems Builder",
    description: "Student watches autonomous browser agent DOM mechanics and cybersecurity USB exploits.",
    reels: ["reel-6", "reel-8"],
    expectedInference: "Under-the-hood AI engineering, systems automation, OS security boundaries, and hardware interop.",
    avoidanceGoal: "Avoid superficial prompt listicles; recommend Playwright agent construction and transformer self-attention linear algebra."
  },
  {
    id: "preset-all-samples",
    name: "All 8 Sample Reels (Comprehensive Batch)",
    description: "Full evaluation of all 8 fictional/anonymized reels across Entertainment, Gaming, Coding, AI, Gadgets, Career, Memes, and Tech News.",
    reels: ["reel-1", "reel-2", "reel-3", "reel-4", "reel-5", "reel-6", "reel-7", "reel-8"],
    expectedInference: "Multi-faceted tech curiosity across full-stack engineering, algorithms, hardware, and security.",
    avoidanceGoal: "Strictly format all 8 outputs adhering to REQUIRED OUTPUT specification."
  }
];
