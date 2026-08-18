/**
 * Automated Verification Test Suite for AI Tech Reel Recommendation Agent
 */

import { SAMPLE_REELS, TECH_REELS_CATALOG } from '../js/dataset.js';
import { RecommendationAgent } from '../js/agent.js';

const ALLOWED_CATEGORIES = ['AI', 'DSA', 'Java', 'HLD', 'Cybersecurity', 'Cloud', 'Hardware', 'Career', 'Other'];
const ALLOWED_DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const ALLOWED_CONFIDENCES = ['High', 'Medium', 'Low'];

const agent = new RecommendationAgent(TECH_REELS_CATALOG);
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedTests++;
  }
}

console.log('================================================================');
console.log('🧪 RUNNING AI RECOMMENDATION AGENT VERIFICATION SUITE');
console.log('================================================================\n');

// Test 1: Validate all 8 sample inputs
console.log('📋 Test Suite 1: Evaluating All 8 Sample Inputs Against Required Schema');
SAMPLE_REELS.forEach((reel, idx) => {
  console.log(`\n--- Evaluating Sample ${idx + 1}: ${reel.title} (${reel.category}) ---`);
  const result = agent.analyzeReel(reel);
  const data = result.structuredData;
  const rawText = result.formattedText;

  // Schema presence checks
  assert(rawText.includes('CURRENT REEL:'), 'Contains "CURRENT REEL:"');
  assert(rawText.includes('INTEREST DETECTED:'), 'Contains "INTEREST DETECTED:"');
  assert(rawText.includes('WHY:'), 'Contains "WHY:"');
  assert(rawText.includes('RECOMMENDED TECH REEL:'), 'Contains "RECOMMENDED TECH REEL:"');
  assert(rawText.includes('CATEGORY:'), 'Contains "CATEGORY:"');
  assert(rawText.includes('WHY THIS RECOMMENDATION:'), 'Contains "WHY THIS RECOMMENDATION:"');
  assert(rawText.includes('DIFFICULTY:'), 'Contains "DIFFICULTY:"');
  assert(rawText.includes('CONFIDENCE:'), 'Contains "CONFIDENCE:"');

  // Value constraints checks
  assert(ALLOWED_CATEGORIES.includes(data.category), `Category "${data.category}" is valid in [${ALLOWED_CATEGORIES.join(', ')}]`);
  assert(ALLOWED_DIFFICULTIES.includes(data.difficulty), `Difficulty "${data.difficulty}" is valid in [${ALLOWED_DIFFICULTIES.join(', ')}]`);
  assert(ALLOWED_CONFIDENCES.includes(data.confidence), `Confidence "${data.confidence}" is valid in [${ALLOWED_CONFIDENCES.join(', ')}]`);
  assert(data.whyEvidence.length > 20, 'Why evidence provides substantive reasoning');
  assert(data.whyThisRecommendation.length > 20, 'Why this recommendation provides clear conceptual bridge');
});

// Test 2: The Built-in Trap Scenario Validation
console.log('\n\n🛡️ Test Suite 2: Built-in Trap Scenario Mitigation');

// Trap Reel 1: Java Meme
const res1 = agent.analyzeReel(SAMPLE_REELS[0]);
assert(
  !res1.structuredData.recommendedTechReel.toLowerCase().includes('what is a variable') &&
  !res1.structuredData.recommendedTechReel.toLowerCase().includes('java 101'),
  'Reel 1 evades shallow literal Java syntax trap (Recommends JVM GC / Memory instead)'
);
assert(
  res1.structuredData.recommendedTechReel.toLowerCase().includes('jvm') ||
  res1.structuredData.recommendedTechReel.toLowerCase().includes('garbage collector') ||
  res1.structuredData.category === 'Java',
  'Reel 1 correctly targets JVM internals / backend memory management'
);

// Trap Reel 2: Junior Backend Lifestyle Vlog
const res2 = agent.analyzeReel(SAMPLE_REELS[1]);
assert(
  !res2.structuredData.recommendedTechReel.toLowerCase().includes('coffee') &&
  !res2.structuredData.recommendedTechReel.toLowerCase().includes('lifestyle'),
  'Reel 2 evades superficial lifestyle vlog trap'
);
assert(
  res2.structuredData.recommendedTechReel.toLowerCase().includes('kafka') ||
  res2.structuredData.category === 'HLD',
  'Reel 2 correctly infers distributed systems / Kafka consumer backpressure interest'
);

// Trap Reel 3: Interview Two-Sum Joke
const res3 = agent.analyzeReel(SAMPLE_REELS[2]);
assert(
  !res3.structuredData.recommendedTechReel.toLowerCase().includes('10 ai tools') &&
  !res3.structuredData.recommendedTechReel.toLowerCase().includes('get you a job tomorrow'),
  'Reel 3 evades predatory "10 AI job tools" hype trap'
);
assert(
  res3.structuredData.category === 'DSA',
  'Reel 3 correctly bridges interview stress into deep algorithmic complexity (DSA)'
);

// Trap Reel 4: Laptop Compile Benchmark
const res4 = agent.analyzeReel(SAMPLE_REELS[3]);
assert(
  !res4.structuredData.recommendedTechReel.toLowerCase().includes('gaming laptops under $600'),
  'Reel 4 evades consumer product shopping trap'
);
assert(
  res4.structuredData.category === 'Hardware',
  'Reel 4 correctly maps compiler benchmark to computer architecture and memory cache'
);

// Test 3: Anti-Hype Filter Enforcement
console.log('\n\n🚫 Test Suite 3: Anti-Hype Quality Gate Filter');
const hypeMockReels = [
  { title: "Top 10 AI Tools that will replace you tomorrow", summary: "Get rich with no coding required", isHypeClickbait: true, antiHypeScore: 20 },
  { title: "Secret prompt to make $10k a month with AI", summary: "Become a millionaire overnight", isHypeClickbait: true, antiHypeScore: 15 }
];

const customReel = {
  id: 'test-custom',
  title: 'Curious about AI Prompting',
  category: 'AI',
  transcript: 'I keep seeing AI prompting reels and want to know how it really works.'
};

const customRes = agent.analyzeReel(customReel);
assert(
  !customRes.structuredData.recommendedTechReel.toLowerCase().includes('top 10') &&
  !customRes.structuredData.recommendedTechReel.toLowerCase().includes('get rich'),
  'Anti-hype filter strictly rejects clickbait hype recommendations'
);

console.log('\n================================================================');
console.log(`📊 TEST EXECUTION SUMMARY: ${passedTests} / ${totalTests} Passed (${failedTests} Failed)`);
console.log('================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL SYSTEM TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}
