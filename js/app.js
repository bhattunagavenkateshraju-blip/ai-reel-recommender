/**
 * Main Application Orchestrator
 * Links ReelFeed, RecommendationAgent, RadarVisualizer, TrapAnalyzer, BatchStudio, and CustomLab.
 */

import { SAMPLE_REELS, TECH_REELS_CATALOG, PRESETS, REJECTED_HYPE_EXAMPLES } from './dataset.js';
import { RecommendationAgent } from './agent.js';
import { InterestRadarVisualizer } from './ui-radar.js';
import { ReelFeedSimulator } from './ui-feed.js';
import { TRAP_SCENARIO_DATA } from './trap-analyzer.js';
import { GeminiService } from './gemini-service.js';

class App {
  constructor() {
    this.agent = new RecommendationAgent(TECH_REELS_CATALOG);
    this.geminiService = new GeminiService();
    this.currentPreset = PRESETS[0]; // Start with The Built-In Trap Scenario
    this.activeReels = this._resolvePresetReels(this.currentPreset);
    this.watchHistory = [...this.activeReels];

    // Sub-components
    this.feedSimulator = null;
    this.radarVisualizer = null;

    this.activeTab = 'simulator'; // 'simulator', 'trap-analysis', 'batch-studio', 'custom-lab', 'gemini-studio'
  }

  init() {
    this._initTabs();
    this._initPresetSelector();
    this._initFeedSimulator();
    this._initRadar();
    this._initTrapAnalyzer();
    this._initBatchStudio();
    this._initCustomLab();
    this._initGeminiStudio();
    this._initAddRealReelModal();
    this._initKeyboardNav();

    // Defer initial evaluation until after first paint so all DOM ids exist
    requestAnimationFrame(() => {
      const currentReel = this.feedSimulator.getCurrentReel();
      this.updateAgentInspection(currentReel);
      this.updateAggregatePersona();
    });
  }

  _resolvePresetReels(preset) {
    if (!preset || !preset.reels) return SAMPLE_REELS;
    return preset.reels.map(id => SAMPLE_REELS.find(r => r.id === id)).filter(Boolean);
  }

  _initTabs() {
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        this.switchTab(targetTab);
      });
    });
  }

  switchTab(tabId) {
    this.activeTab = tabId;
    
    // Update button states
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update section visibility
    document.querySelectorAll('.app-tab-section').forEach(sec => {
      sec.classList.toggle('active', sec.id === `tab-${tabId}`);
    });

    // Refresh tab content if necessary
    if (tabId === 'batch-studio') {
      this.renderBatchOutputs();
    } else if (tabId === 'trap-analysis') {
      this.renderTrapAnalyzer();
    }
  }

  _initPresetSelector() {
    const selectEl = document.getElementById('presetSelect');
    if (!selectEl) return;

    selectEl.innerHTML = PRESETS.map(p => `
      <option value="${p.id}">${p.name}</option>
    `).join('');

    selectEl.value = this.currentPreset.id;

    selectEl.addEventListener('change', (e) => {
      const selected = PRESETS.find(p => p.id === e.target.value);
      if (selected) {
        this.currentPreset = selected;
        this.activeReels = this._resolvePresetReels(selected);
        this.watchHistory = [...this.activeReels];
        
        // Update preset description banner
        const descEl = document.getElementById('presetDescriptionBox');
        if (descEl) {
          descEl.innerHTML = `
            <div class="preset-banner-content">
              <strong>${selected.name}:</strong> ${selected.description}
              <div class="preset-goal-tag">🎯 Goal: ${selected.avoidanceGoal}</div>
            </div>
          `;
        }

        this.feedSimulator.setReels(this.activeReels, 0);
        this.updateAggregatePersona();
      }
    });

    // Initial banner render
    const descEl = document.getElementById('presetDescriptionBox');
    if (descEl) {
      descEl.innerHTML = `
        <div class="preset-banner-content">
          <strong>${this.currentPreset.name}:</strong> ${this.currentPreset.description}
          <div class="preset-goal-tag">🎯 Goal: ${this.currentPreset.avoidanceGoal}</div>
        </div>
      `;
    }
  }

  _initFeedSimulator() {
    this.feedSimulator = new ReelFeedSimulator('reelFeedContainer', {
      reels: this.activeReels,
      onReelChange: (reel) => {
        this.updateAgentInspection(reel);
      },
      onInteraction: (interaction) => {
        if (!this.watchHistory.some(r => r.id === interaction.reel.id)) {
          this.watchHistory.push(interaction.reel);
        }
        this.updateAgentInspection(interaction.reel);
        this.updateAggregatePersona();
      }
    });

    this.feedSimulator.render();
    const firstReel = this.feedSimulator.getCurrentReel();
    if (firstReel && !firstReel.videoUrl && !firstReel.youtubeEmbedUrl) {
      this.feedSimulator._initCanvasAnimation();
    }
  }

  _initRadar() {
    this.radarVisualizer = new InterestRadarVisualizer('interestRadarContainer');
  }

  /**
   * Update the live AI Agent thought process & recommendation card
   */
  updateAgentInspection(reel) {
    if (!reel) return;
    let analysis;
    try {
      analysis = this.agent.analyzeReel(reel);
    } catch (err) {
      console.error('[Agent] analyzeReel failed:', err);
      const fb = document.getElementById('requiredOutputFormattedText');
      if (fb) fb.textContent = `Error: ${err.message}`;
      return;
    }

    // 1. Context & Signals Box
    const signalsBox = document.getElementById('extractedSignalsBox');
    if (signalsBox) {
      const ext = analysis.extraction;
      const badges = [];
      if (ext.isMemeOrHumor) badges.push('<span class="signal-tag humor">Satire / Meme</span>');
      if (ext.hasCareerContext) badges.push('<span class="signal-tag career">SWE Career Friction</span>');
      if (ext.hasSystemsContext) badges.push('<span class="signal-tag systems">Distributed Systems / Kafka</span>');
      if (ext.hasAlgoContext) badges.push('<span class="signal-tag dsa">Algorithmic Complexity</span>');
      if (ext.hasHardwareContext) badges.push('<span class="signal-tag hardware">CPU & Memory Bandwidth</span>');
      if (ext.hasAgenticAIContext) badges.push('<span class="signal-tag ai">Agentic AI & DOM</span>');
      if (ext.hasSecurityContext) badges.push('<span class="signal-tag sec">Hardware / USB Security</span>');
      if (ext.hasGraphicsContext) badges.push('<span class="signal-tag graphics">WebGL / GPU Shaders</span>');
      if (ext.hasLogicArchContext) badges.push('<span class="signal-tag logic">Digital Logic / ALU</span>');

      signalsBox.innerHTML = `
        <div class="signal-header-row">
          <span class="signal-eyebrow">Input Nuance & Subtext</span>
          <div class="signal-badges-list">${badges.join('')}</div>
        </div>
        <p class="signal-evidence-text"><strong>Evidence:</strong> ${analysis.extraction.summaryEvidence}</p>
      `;
    }

    // 2. Latent Interest Box
    const latentBox = document.getElementById('latentInterestBox');
    if (latentBox) {
      latentBox.innerHTML = `
        <div class="latent-header">
          <span class="latent-badge-category">${analysis.latentInterest.primaryCategory}</span>
          <span class="latent-topic-name">${analysis.latentInterest.topic}</span>
        </div>
        <p class="latent-intent-text"><strong>Inferred Intent:</strong> ${analysis.latentInterest.intent}</p>
        <div class="latent-meta-chips">
          <span class="meta-chip">Apparent Level: <strong>${analysis.latentInterest.apparentSkillLevel}</strong></span>
          <span class="meta-chip">Confidence: <strong>${analysis.latentInterest.confidence}</strong></span>
        </div>
      `;
    }

    // 3. Recommended Tech Reel Card
    const recBox = document.getElementById('recommendationBox');
    if (recBox) {
      const rec = analysis.recommendation;
      recBox.innerHTML = `
        <div class="rec-card-header">
          <div class="rec-category-badge cat-${rec.category.toLowerCase()}">${rec.category}</div>
          <div class="rec-meta-badges">
            <span class="badge-difficulty ${rec.difficulty.toLowerCase()}">${rec.difficulty}</span>
            <span class="badge-confidence ${rec.confidence.toLowerCase()}">${rec.confidence} Confidence</span>
          </div>
        </div>
        
        <h3 class="rec-title">${rec.title}</h3>
        <p class="rec-hook">"${rec.hook || rec.summary}"</p>
        
        <div class="rec-why-block">
          <span class="why-label">Why This Recommendation:</span>
          <p class="why-text">${rec.whyRecommendation}</p>
        </div>

        <div class="rec-signal-proof">
          <span class="proof-label">High-Signal Substance:</span>
          <p class="proof-text">${rec.whyHighSignal || rec.summary}</p>
        </div>

        <div class="rec-footer-row">
          <span class="rec-creator">${rec.creator || '@tech_educator'} &bull; ${rec.duration}s</span>
          <span class="anti-hype-pill">🛡️ Anti-Hype Score: ${rec.antiHypeScore || 95}/100</span>
        </div>
      `;
    }

    // 4. Exact Formatted Text Box
    const formattedBox = document.getElementById('requiredOutputFormattedText');
    if (formattedBox) {
      formattedBox.textContent = analysis.formattedText;
    }

    // Bind Copy Button
    const btnCopy = document.getElementById('btnCopyFormatted');
    if (btnCopy) {
      btnCopy.onclick = () => {
        navigator.clipboard.writeText(analysis.formattedText).then(() => {
          btnCopy.textContent = '✓ Copied Output!';
          setTimeout(() => { btnCopy.textContent = '📋 Copy Required Output'; }, 2000);
        });
      };
    }
  }

  /**
   * Update aggregate student persona and radar chart based on watch history
   */
  updateAggregatePersona() {
    const sessionData = this.agent.synthesizeAggregateSession(this.watchHistory);
    if (!sessionData) return;

    if (this.radarVisualizer) {
      this.radarVisualizer.render(sessionData.categoryCounts);
    }

    const personaBox = document.getElementById('personaSummaryBox');
    if (personaBox) {
      personaBox.innerHTML = `
        <div class="persona-card-inner">
          <div class="persona-title-row">
            <span class="persona-icon">🧑‍💻</span>
            <div>
              <h4 class="persona-name">Synthesized Student Persona</h4>
              <span class="persona-status">${sessionData.sessionSize} Reels Interacted (${sessionData.isTrapScenario ? '⚠️ Trap Scenario Active' : 'Normal Feed'})</span>
            </div>
          </div>
          <p class="persona-desc">${sessionData.aggregateSummary}</p>
        </div>
      `;
    }
  }

  /**
   * Initialize Side-by-Side Trap Analyzer
   */
  _initTrapAnalyzer() {
    this.renderTrapAnalyzer();
  }

  renderTrapAnalyzer() {
    const container = document.getElementById('trapAnalyzerContainer');
    if (!container) return;

    const data = TRAP_SCENARIO_DATA;

    const itemsHtml = data.items.map((item, idx) => `
      <div class="trap-card-row">
        <div class="trap-row-header">
          <span class="trap-step-num">Item ${idx + 1}</span>
          <h4 class="trap-reel-title">${item.reelTitle}</h4>
        </div>
        
        <div class="trap-comparison-grid">
          <!-- Naive Keyword Matcher Column -->
          <div class="trap-col naive-col">
            <div class="col-header">
              <span class="col-icon">❌</span>
              <span class="col-title">Shallow / Keyword Matcher</span>
              <span class="verdict-tag fail">${item.naiveOutput.verdict}</span>
            </div>
            <div class="col-body">
              <div class="field-group">
                <span class="field-label">Trigger Keyword:</span>
                <span class="field-val">"${item.naiveOutput.keywordMatched}"</span>
              </div>
              <div class="field-group">
                <span class="field-label">Recommended Output:</span>
                <span class="field-val highlight-naive">${item.naiveOutput.recommendedTitle}</span>
              </div>
              <div class="field-group">
                <span class="field-label">Fatal Flaw:</span>
                <p class="flaw-text">${item.naiveOutput.flaw}</p>
              </div>
            </div>
          </div>

          <!-- Deep Context AI Agent Column -->
          <div class="trap-col agent-col">
            <div class="col-header">
              <span class="col-icon">✨</span>
              <span class="col-title">Context-Aware AI Recommendation Agent</span>
              <span class="verdict-tag pass">${item.agentOutput.verdict}</span>
            </div>
            <div class="col-body">
              <div class="field-group">
                <span class="field-label">Inferred Interest:</span>
                <span class="field-val highlight-agent">${item.agentOutput.interestDetected}</span>
              </div>
              <div class="field-group">
                <span class="field-label">Recommended Tech Reel:</span>
                <span class="field-val highlight-agent-rec">${item.agentOutput.recommendedTitle}</span>
              </div>
              <div class="field-group">
                <span class="field-label">Why This Succeeds:</span>
                <p class="success-text">${item.agentOutput.rationale}</p>
              </div>
              <div class="rec-tags-line">
                <span class="badge-cat">${item.agentOutput.category}</span>
                <span class="badge-diff">${item.agentOutput.difficulty}</span>
                <span class="badge-conf">${item.agentOutput.confidence} Confidence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="trap-analyzer-hero">
        <div class="trap-hero-badge">BUILT-IN TRAP MITIGATION ENGINE</div>
        <h2 class="trap-hero-title">Why Keyword Matching Fails & How Our Agent Evades the Trap</h2>
        <p class="trap-hero-desc">${data.description}</p>
      </div>

      <div class="trap-summary-banner">
        <div class="summary-box naive-box">
          <h4>🚨 The Shallow System Trap</h4>
          <ul>
            ${data.summaryComparison.naiveSystem.weaknesses.map(w => `<li>${w}</li>`).join('')}
          </ul>
        </div>
        <div class="summary-box deep-box">
          <h4>🛡️ The Context-Aware Agent Solution</h4>
          <ul>
            ${data.summaryComparison.deepAgent.strengths.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="trap-items-list">
        ${itemsHtml}
      </div>
    `;
  }

  /**
   * Initialize Batch Evaluation Studio for all 8 Sample Inputs
   */
  _initBatchStudio() {
    const btnCopyAll = document.getElementById('btnCopyAllBatch');
    const btnDownloadMd = document.getElementById('btnDownloadBatchMd');
    const btnExportJson = document.getElementById('btnExportBatchJson');

    if (btnCopyAll) {
      btnCopyAll.addEventListener('click', () => {
        const text = this._generateAllBatchRawText();
        navigator.clipboard.writeText(text).then(() => {
          btnCopyAll.textContent = '✓ All 8 Outputs Copied!';
          setTimeout(() => { btnCopyAll.textContent = '📋 Copy All 8 Outputs'; }, 2000);
        });
      });
    }

    if (btnDownloadMd) {
      btnDownloadMd.addEventListener('click', () => {
        const text = this._generateAllBatchMarkdown();
        this._downloadFile(text, 'ai_reel_recommendation_batch_evaluation.md', 'text/markdown');
      });
    }

    if (btnExportJson) {
      btnExportJson.addEventListener('click', () => {
        const data = SAMPLE_REELS.map(r => this.agent.analyzeReel(r));
        this._downloadFile(JSON.stringify(data, null, 2), 'ai_reel_recommendations.json', 'application/json');
      });
    }
  }

  _generateAllBatchRawText() {
    return SAMPLE_REELS.map(r => {
      const res = this.agent.analyzeReel(r);
      return res.formattedText;
    }).join('\n\n========================================\n\n');
  }

  _generateAllBatchMarkdown() {
    let md = `# AI-Powered Tech Reel Recommendation Agent - Batch Evaluation Report\n\n`;
    md += `Evaluated on **${SAMPLE_REELS.length} Sample Reels** covering Entertainment, Gaming, Coding, AI, Gadgets, Career, Programming Memes, and Tech News.\n\n`;

    SAMPLE_REELS.forEach((r, idx) => {
      const res = this.agent.analyzeReel(r);
      md += `## Case ${idx + 1}: ${r.title} (${r.category})\n\n`;
      md += `\`\`\`text\n${res.formattedText}\n\`\`\`\n\n`;
      md += `> **Anti-Hype Score**: ${res.recommendation.antiHypeScore || 95}/100 | **Creator**: ${res.recommendation.creator}\n\n---\n\n`;
    });

    return md;
  }

  _downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  renderBatchOutputs() {
    const container = document.getElementById('batchOutputsList');
    if (!container) return;

    container.innerHTML = SAMPLE_REELS.map((r, idx) => {
      const analysis = this.agent.analyzeReel(r);
      return `
        <div class="batch-reel-card">
          <div class="batch-card-header">
            <div class="batch-title-col">
              <span class="batch-num-pill">Sample ${idx + 1} of ${SAMPLE_REELS.length}</span>
              <h3 class="batch-title">${r.title}</h3>
              <span class="batch-cat-pill">${r.category}</span>
            </div>
            <button class="batch-copy-btn" onclick="navigator.clipboard.writeText(\`${analysis.formattedText.replace(/`/g, '\\`')}\`); this.textContent='✓ Copied'; setTimeout(() => this.textContent='📋 Copy', 2000);">
              📋 Copy
            </button>
          </div>

          <div class="batch-transcript-quote">
            <span class="quote-icon">❝</span>
            <p>${r.transcript}</p>
          </div>

          <pre class="batch-formatted-pre"><code>${analysis.formattedText}</code></pre>
        </div>
      `;
    }).join('');
  }

  /**
   * Custom Reel Input Lab
   */
  _initCustomLab() {
    const form = document.getElementById('customReelForm');
    const runBtn = document.getElementById('btnRunCustomAgent');
    const resultBox = document.getElementById('customAgentResult');

    if (!form || !runBtn) return;

    runBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = document.getElementById('customTitle').value.trim() || 'Custom Student Reel';
      const category = document.getElementById('customCategory').value || 'Other';
      const transcript = document.getElementById('customTranscript').value.trim();
      const tagsStr = document.getElementById('customTags').value.trim();
      const tags = tagsStr.split(/[\s,]+/).filter(t => t.length > 0);

      if (!transcript) {
        alert('Please enter a Reel transcript or description to analyze.');
        return;
      }

      const customReel = {
        id: 'custom-' + Date.now().toString().slice(-4),
        title,
        category,
        creator: '@custom_user',
        duration: 30,
        likes: '10K',
        comments: '200',
        shares: '500',
        tags,
        audio: 'Trending Audio Track',
        videoVisualType: 'custom',
        transcript
      };

      const analysis = this.agent.analyzeReel(customReel);

      if (resultBox) {
        resultBox.innerHTML = `
          <div class="custom-result-card">
            <div class="custom-result-header">
              <span class="custom-success-pill">✓ Agent Inference Completed</span>
              <button class="batch-copy-btn" id="btnCopyCustomOutput">📋 Copy Formatted Output</button>
            </div>
            
            <pre class="custom-output-pre"><code>${analysis.formattedText}</code></pre>
            
            <div class="custom-breakdown-details">
              <div class="detail-item">
                <span class="d-label">Inferred Concept:</span>
                <span class="d-val">${analysis.latentInterest.topic}</span>
              </div>
              <div class="detail-item">
                <span class="d-label">Recommended Tech Reel:</span>
                <span class="d-val">${analysis.recommendation.title}</span>
              </div>
              <div class="detail-item">
                <span class="d-label">Difficulty & Confidence:</span>
                <span class="d-val">${analysis.recommendation.difficulty} / ${analysis.recommendation.confidence}</span>
              </div>
            </div>
          </div>
        `;

        const btnCopy = document.getElementById('btnCopyCustomOutput');
        if (btnCopy) {
          btnCopy.onclick = () => {
            navigator.clipboard.writeText(analysis.formattedText).then(() => {
              btnCopy.textContent = '✓ Copied!';
              setTimeout(() => { btnCopy.textContent = '📋 Copy Formatted Output'; }, 2000);
            });
          };
        }
      }
    });

    // Populate Sample Presets into Custom Input
    const presetLinks = document.querySelectorAll('.fill-custom-preset');
    presetLinks.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const reelId = btn.dataset.reelId;
        const reel = SAMPLE_REELS.find(r => r.id === reelId);
        if (reel) {
          document.getElementById('customTitle').value = reel.title;
          document.getElementById('customCategory').value = reel.category;
          document.getElementById('customTranscript').value = reel.transcript;
          document.getElementById('customTags').value = (reel.tags || []).join(' ');
        }
      });
    });
  }

  _initGeminiStudio() {
    const keyInput = document.getElementById('geminiApiKeyInput');
    const btnSaveKey = document.getElementById('btnSaveGeminiKey');
    const btnClearKey = document.getElementById('btnClearGeminiKey');
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('geminiStatusText');

    const updateStatusUI = () => {
      if (this.geminiService.hasApiKey()) {
        if (statusDot) statusDot.className = 'status-dot active-gemini';
        if (statusText) statusText.textContent = 'Active (Live Gemini 2.5 Flash Connected)';
        if (keyInput) keyInput.value = this.geminiService.getApiKey();
      } else {
        if (statusDot) statusDot.className = 'status-dot';
        if (statusText) statusText.textContent = 'Local Heuristic Agent (No API Key Required)';
        if (keyInput) keyInput.value = '';
      }
    };

    updateStatusUI();

    if (btnSaveKey) {
      btnSaveKey.onclick = () => {
        const k = keyInput ? keyInput.value.trim() : '';
        if (k) {
          this.geminiService.setApiKey(k);
          btnSaveKey.textContent = '✓ Saved!';
          setTimeout(() => { btnSaveKey.textContent = 'Save Key'; }, 2000);
        }
        updateStatusUI();
      };
    }

    if (btnClearKey) {
      btnClearKey.onclick = () => {
        this.geminiService.setApiKey('');
        updateStatusUI();
      };
    }

    // Sample Fill in Gemini Studio
    const sampleButtons = document.querySelectorAll('.gemini-sample-fill');
    sampleButtons.forEach(btn => {
      btn.onclick = () => {
        const reelId = btn.dataset.reelId;
        const reel = SAMPLE_REELS.find(r => r.id === reelId);
        if (reel) {
          const promptInput = document.getElementById('geminiPromptInput');
          if (promptInput) promptInput.value = reel.transcript;
        }
      };
    });

    // Run Live Gemini Analysis Button
    const btnRunAnalysis = document.getElementById('btnRunGeminiAnalysis');
    const analysisCode = document.getElementById('geminiOutputCode');

    if (btnRunAnalysis) {
      btnRunAnalysis.onclick = async () => {
        const transcript = (document.getElementById('geminiPromptInput')?.value || '').trim();
        if (!transcript) {
          alert('Please enter a transcript to analyze.');
          return;
        }

        btnRunAnalysis.disabled = true;
        btnRunAnalysis.textContent = '⚡ Running Gemini Reasoning...';
        if (analysisCode) analysisCode.textContent = 'Connecting to Google Gemini API and evaluating context signals...';

        try {
          if (this.geminiService.hasApiKey()) {
            const res = await this.geminiService.analyzeWithGemini({
              title: "Student Interacted Clip",
              category: "General Tech",
              transcript
            });
            if (analysisCode) analysisCode.textContent = res.rawText;
          } else {
            // Use our high-precision local recommendation agent
            const customReel = {
              id: 'gemini-sim-' + Date.now().toString().slice(-4),
              title: 'Student Interacted Clip',
              category: 'General Tech',
              transcript
            };
            const analysis = this.agent.analyzeReel(customReel);
            if (analysisCode) {
              analysisCode.textContent = `[LOCAL AGENT REASONING ENGINE - Add API Key above for Live Gemini 2.5 Flash]\n\n` + analysis.formattedText;
            }
          }
        } catch (err) {
          if (analysisCode) {
            analysisCode.textContent = `Error during inference: ${err.message}\n\nFalling back to local heuristic reasoning:\n` +
              this.agent.analyzeReel({ title: "Student Clip", category: "General", transcript }).formattedText;
          }
        } finally {
          btnRunAnalysis.disabled = false;
          btnRunAnalysis.textContent = '✨ Run Live Gemini Analysis';
        }
      };
    }

    // Generate 60s Reel Script Button
    const btnGenScript = document.getElementById('btnGenerateReelScript');
    const scriptDisplay = document.getElementById('geminiScriptDisplay');

    if (btnGenScript) {
      btnGenScript.onclick = async () => {
        const topic = (document.getElementById('scriptTopicInput')?.value || '').trim();
        const category = document.getElementById('scriptCategorySelect')?.value || 'Other';
        const difficulty = document.getElementById('scriptDifficultySelect')?.value || 'Intermediate';

        if (!topic) {
          alert('Please enter a topic for the script.');
          return;
        }

        btnGenScript.disabled = true;
        btnGenScript.textContent = '🎬 Generating Storyboard & Script...';
        if (scriptDisplay) scriptDisplay.innerHTML = '<div class="script-empty-placeholder">Generating 60-second viral educational storyboard...</div>';

        try {
          let scriptData = null;
          if (this.geminiService.hasApiKey()) {
            scriptData = await this.geminiService.generateReelScript(topic, category, difficulty);
          } else {
            // Rich fallback script generator
            scriptData = {
              hook: `Stop making this mistake when debugging ${category}! Here is what is actually happening in under 60 seconds.`,
              visualScenes: [
                {
                  timestamp: "0:00 - 0:12",
                  visualPrompt: "Split screen: frantic developer staring at stack trace vs animated silicon/memory architecture glow",
                  voiceover: `Why does your code fail under load? Most developers think it's a syntax problem, but it's actually memory hierarchy.`
                },
                {
                  timestamp: "0:12 - 0:35",
                  visualPrompt: "Animated step-by-step schematic of the data flow and cache line/partition rebalance",
                  voiceover: `Look at the heap: objects in Eden space get promoted, triggering stop-the-world pauses. When you configure your allocation limits properly, GC throughput doubles.`
                },
                {
                  timestamp: "0:35 - 0:50",
                  visualPrompt: "Clean before/after code comparison in IDE with high-contrast syntax highlighting",
                  voiceover: `Here is the clean architectural fix you can push in 2 lines of code today.`
                },
                {
                  timestamp: "0:50 - 1:00",
                  visualPrompt: "Summary takeaway banner and quick interactive challenge question",
                  voiceover: `Save this for your next production incident, and tell me in the comments: which garbage collector is your backend running?`
                }
              ],
              keyTakeaway: `Understanding low-level internals transforms defensive coding into high-throughput systems performance.`,
              challengeQuestion: `Can you name the difference between Minor and Full GC pauses in 3 words?`
            };
          }

          // Render Script
          if (scriptDisplay && scriptData) {
            const scenesHtml = (scriptData.visualScenes || []).map(s => `
              <div class="script-scene-item">
                <span class="scene-time-pill">⏱️ ${s.timestamp}</span>
                <p class="scene-visual-prompt">🎥 <strong>Visual Storyboard:</strong> ${s.visualPrompt}</p>
                <p class="scene-voiceover">🎙️ <strong>Narrator Voiceover:</strong> "${s.voiceover}"</p>
              </div>
            `).join('');

            scriptDisplay.innerHTML = `
              <div class="script-card-content">
                <div class="script-hook-banner">
                  🪝 <strong>3-Second Hook:</strong> "${scriptData.hook}"
                </div>
                <div class="script-scenes-list">
                  ${scenesHtml}
                </div>
                <div class="rec-why-block" style="margin-top: 10px;">
                  <span class="why-label">Key Educational Takeaway:</span>
                  <p class="why-text">${scriptData.keyTakeaway}</p>
                </div>
                <div class="rec-signal-proof">
                  <span class="proof-label">Viewer Interactive Challenge:</span>
                  <p class="proof-text">${scriptData.challengeQuestion}</p>
                </div>
              </div>
            `;
          }
        } catch (err) {
          if (scriptDisplay) {
            scriptDisplay.innerHTML = `<div class="script-empty-placeholder" style="color: #ef4444;">Script generation error: ${err.message}</div>`;
          }
      };
    }
  }

  _initAddRealReelModal() {
    const modal = document.getElementById('addRealReelModal');
    const btnClose = document.getElementById('btnCloseAddModal');
    const btnCancel = document.getElementById('btnCancelAddModal');
    const form = document.getElementById('addRealReelForm');
    const groupVideoUrl = document.getElementById('groupVideoUrl');
    const groupVideoUpload = document.getElementById('groupVideoUpload');

    const closeModal = () => {
      if (modal) modal.classList.remove('active');
    };

    if (btnClose) btnClose.onclick = closeModal;
    if (btnCancel) btnCancel.onclick = closeModal;

    // Toggle input types (YouTube / Direct MP4 / Upload / Canvas)
    const sourceRadios = document.querySelectorAll('input[name="videoSourceType"]');
    sourceRadios.forEach(radio => {
      radio.onchange = (e) => {
        const val = e.target.value;
        if (groupVideoUrl) groupVideoUrl.style.display = (val === 'youtube' || val === 'mp4') ? 'block' : 'none';
        if (groupVideoUpload) groupVideoUpload.style.display = (val === 'upload') ? 'block' : 'none';
      };
    });

    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById('realReelTitle')?.value.trim() || 'Custom Real Reel';
        const creator = document.getElementById('realReelCreator')?.value.trim() || '@creator';
        const category = document.getElementById('realReelCategory')?.value || 'Other';
        const tagsStr = document.getElementById('realReelTags')?.value.trim() || '';
        const transcript = document.getElementById('realReelTranscript')?.value.trim() || '';
        const sourceType = document.querySelector('input[name="videoSourceType"]:checked')?.value || 'youtube';
        const rawUrl = document.getElementById('realVideoUrl')?.value.trim() || '';
        const fileInput = document.getElementById('realVideoFile');

        if (!transcript) {
          alert('Please enter a transcript or description for the AI Agent to reason on.');
          return;
        }

        let videoUrl = null;
        let youtubeEmbedUrl = null;

        if (sourceType === 'youtube' && rawUrl) {
          // Parse YouTube ID
          let ytId = null;
          const shortsMatch = rawUrl.match(/shorts\/([a-zA-Z0-9_-]+)/);
          const watchMatch = rawUrl.match(/[?&]v=([a-zA-Z0-9_-]+)/);
          const youtuBeMatch = rawUrl.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
          
          if (shortsMatch) ytId = shortsMatch[1];
          else if (watchMatch) ytId = watchMatch[1];
          else if (youtuBeMatch) ytId = youtuBeMatch[1];
          else if (/^[a-zA-Z0-9_-]{11}$/.test(rawUrl)) ytId = rawUrl;

          if (ytId) {
            youtubeEmbedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&modestbranding=1`;
          }
        } else if (sourceType === 'mp4' && rawUrl) {
          videoUrl = rawUrl;
        } else if (sourceType === 'upload' && fileInput && fileInput.files && fileInput.files[0]) {
          videoUrl = URL.createObjectURL(fileInput.files[0]);
        }

        const newRealReel = {
          id: 'real-' + Date.now().toString().slice(-4),
          title,
          category,
          creator,
          duration: 30,
          likes: '1.4K',
          comments: '120',
          shares: '340',
          tags: tagsStr.split(/[\s,]+/).filter(t => t.length > 0),
          audio: 'Original Audio',
          videoVisualType: 'custom',
          videoUrl,
          youtubeEmbedUrl,
          transcript
        };

        // Add to active reels deck and switch to simulator view
        this.activeReels.unshift(newRealReel);
        this.watchHistory.unshift(newRealReel);
        this.feedSimulator.setReels(this.activeReels, 0);
        this.updateAgentInspection(newRealReel);
        this.updateAggregatePersona();

        closeModal();
        this.switchTab('simulator');
        form.reset();
      };
    }
  }

  _initKeyboardNav() {
    window.addEventListener('keydown', (e) => {
      // Don't intercept when typing in text inputs or textareas
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        this.feedSimulator.nextReel();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        this.feedSimulator.prevReel();
      } else if (e.key === 'l') {
        e.preventDefault();
        this.feedSimulator.toggleLike();
      } else if (e.key === 's') {
        e.preventDefault();
        this.feedSimulator.toggleSave();
      } else if (e.key === '1') {
        this.switchTab('simulator');
      } else if (e.key === '2') {
        this.switchTab('trap-analysis');
      } else if (e.key === '3') {
        this.switchTab('batch-studio');
      } else if (e.key === '4') {
        this.switchTab('custom-lab');
      }
    });
  }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
  window.__APP_INSTANCE__ = app;
});
