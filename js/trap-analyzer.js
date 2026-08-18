/**
 * Trap Analyzer & Naive vs Deep Agent Comparator
 * 
 * Demonstrates the built-in trap scenario:
 * When a student watches:
 * 1. Java meme
 * 2. SWE lifestyle vlog
 * 3. Coding interview joke
 * 4. Laptop comparison
 * 
 * Side-by-side comparison between Naive Keyword Matching vs Deep Context Recommendation Agent.
 */

export const TRAP_SCENARIO_DATA = {
  scenarioTitle: "The Built-In Trap Scenario",
  description: "A student watches a Java meme, a software-engineer lifestyle Reel, a coding interview joke, and a laptop comparison.",
  studentContext: "CS Undergrad / Self-taught developer in their 2nd/3rd year, experiencing real coding friction, studying for technical interviews, and interested in developer hardware.",
  
  items: [
    {
      reelId: "reel-1",
      reelTitle: "Friday 5 PM Prod Push (Java NullPointerException Meme)",
      naiveOutput: {
        keywordMatched: "Java",
        recommendedTitle: "Learn Java in 10 Minutes: What is a Variable? (Java 101 for Absolute Beginners)",
        category: "Java",
        flaw: "Shallow literal match. Assumes a student laughing at production NullPointerExceptions in CI/CD pipelines needs to learn what a variable is.",
        verdict: "FAILED (Boring / Irrelevant)"
      },
      agentOutput: {
        interestDetected: "Software Engineering / JVM Memory & Runtime Reliability",
        recommendedTitle: "How the JVM Garbage Collector Actually Works: Stop Your Microservices From Freezing",
        category: "Java",
        difficulty: "Intermediate",
        confidence: "High",
        rationale: "Bridges the developer's familiarity with runtime crashes into high-signal JVM memory internals (Eden/Tenured generations) and garbage collection tuning.",
        verdict: "SUCCESS (Engaging & Conceptually Deep)"
      }
    },
    {
      reelId: "reel-2",
      reelTitle: "Day in the Life: Junior Backend SWE (Kafka & Standup)",
      naiveOutput: {
        keywordMatched: "Matcha / Lifestyle",
        recommendedTitle: "Top 10 Aesthetic Coffee Shops for Remote Influencers in Seattle",
        category: "Lifestyle / Entertainment",
        flaw: "Focuses on the visual aesthetics (coffee, gym) rather than the technical subtext (Kafka consumer lag, database pool starvation).",
        verdict: "FAILED (Distraction / Low Value)"
      },
      agentOutput: {
        interestDetected: "Backend Engineering / Distributed Message Queues & System Design",
        recommendedTitle: "Surviving Kafka Consumer Lag: Partition Rebalancing and Backpressure Patterns Explained",
        category: "HLD",
        difficulty: "Intermediate",
        confidence: "High",
        rationale: "Extracts the real backend engineering friction mentioned in the vlog (Kafka lag, database starvation) and provides actionable architectural design patterns.",
        verdict: "SUCCESS (Actionable Career Skill)"
      }
    },
    {
      reelId: "reel-3",
      reelTitle: "Interviewer Asks Two-Sum Optimization (DSA Comedy)",
      naiveOutput: {
        keywordMatched: "Interview / Job",
        recommendedTitle: "Top 10 AI Tools That Will Get You a $200k FAANG Job Tomorrow Without Coding!",
        category: "Career / Hype",
        flaw: "Falls directly into the hype trap: clickbait listicle with predatory claims, offering zero durable algorithmic understanding.",
        verdict: "FAILED (Hype / Clickbait Trap)"
      },
      agentOutput: {
        interestDetected: "Algorithms & Data Structures / Coding Interview Mastery",
        recommendedTitle: "Why Dual-Pivot Quicksort & Timsort Beat Naive Algorithms in Real Production",
        category: "DSA",
        difficulty: "Intermediate",
        confidence: "High",
        rationale: "Transforms interview stress humor into deep algorithmic intuition, exploring how CPU cache locality makes hybrid sorting outperform naive big-O theory in real silicon.",
        verdict: "SUCCESS (Durable Algorithmic Mastery)"
      }
    },
    {
      reelId: "reel-4",
      reelTitle: "Snapdragon X Elite vs M3 Pro vs RTX 4080: Kernel Compile Benchmark",
      naiveOutput: {
        keywordMatched: "Laptop / RTX 4080",
        recommendedTitle: "Top 5 RGB Gaming Laptops Under $600 with Free Mousepad",
        category: "Gadgets / Consumer",
        flaw: "Treats a multi-threaded Linux kernel compilation benchmark as a generic consumer shopping query for gaming laptops.",
        verdict: "FAILED (Superficial Product Pitch)"
      },
      agentOutput: {
        interestDetected: "Computer Architecture / CPU Microarchitecture & Compiler Performance",
        recommendedTitle: "How Unified Memory & CPU Cache Lines Supercharge Modern Compilers",
        category: "Hardware",
        difficulty: "Advanced",
        confidence: "High",
        rationale: "Addresses the underlying interest in compiler parallelism, L1/L2/L3 cache misses, and unified memory bandwidth.",
        verdict: "SUCCESS (Deep Systems Insight)"
      }
    }
  ],

  summaryComparison: {
    naiveSystem: {
      strategy: "Literal Token Matching + Engagement Maximization via Clickbait",
      weaknesses: [
        "Treats all mentions of 'Java' as Day-1 beginner syntax searches",
        "Blindly pushes sensational hype ('10 AI tools that get you hired in 24 hours')",
        "Ignores narrative context, humor, and underlying engineering concepts",
        "Increases doom-scrolling without building durable student competence"
      ],
      overallScore: "22/100 (Shallow & Hype-Prone)"
    },
    deepAgent: {
      strategy: "Multi-Modal Intent Extraction + Latent Interest Graph + Anti-Hype Gate",
      strengths: [
        "Infers the broader Software Engineering / Systems persona",
        "Filters out sensational listicles and predatory clickbait",
        "Calibrates difficulty to student's apparent skill curve (Intermediate/Advanced)",
        "Transforms mindless scrolling into high-signal, engaging educational micro-learning"
      ],
      overallScore: "96/100 (High Substance & Alignment)"
    }
  }
};
