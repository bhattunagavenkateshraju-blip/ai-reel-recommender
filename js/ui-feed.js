/**
 * Interactive Reel Simulator with Procedural Canvas Graphics & Engagement Hooks
 */

export class ReelFeedSimulator {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.reels = options.reels || [];
    this.currentIndex = 0;
    this.isPlaying = true;
    this.isMuted = false;
    this.watchProgress = 0;
    this.likedMap = {};
    this.savedMap = {};
    this.onReelChange = options.onReelChange || (() => {});
    this.onInteraction = options.onInteraction || (() => {});
    this.animationFrameId = null;
    this.particleSystem = [];
  }

  setReels(reels, startIndex = 0) {
    this.reels = reels;
    this.currentIndex = Math.max(0, Math.min(startIndex, reels.length - 1));
    this.watchProgress = 0;
    this.render();
    this._initCanvasAnimation();
    this.onReelChange(this.getCurrentReel());
  }

  getCurrentReel() {
    return this.reels[this.currentIndex] || null;
  }

  nextReel() {
    if (this.reels.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.reels.length;
    this.watchProgress = 0;
    this.render();
    this._initCanvasAnimation();
    this.onReelChange(this.getCurrentReel());
    this.onInteraction({ type: 'scroll_next', reel: this.getCurrentReel() });
  }

  prevReel() {
    if (this.reels.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.reels.length) % this.reels.length;
    this.watchProgress = 0;
    this.render();
    this._initCanvasAnimation();
    this.onReelChange(this.getCurrentReel());
    this.onInteraction({ type: 'scroll_prev', reel: this.getCurrentReel() });
  }

  toggleLike() {
    const reel = this.getCurrentReel();
    if (!reel) return;
    this.likedMap[reel.id] = !this.likedMap[reel.id];
    this.render();
    this._initCanvasAnimation();
    this.onInteraction({ type: 'like', liked: this.likedMap[reel.id], reel });
  }

  toggleSave() {
    const reel = this.getCurrentReel();
    if (!reel) return;
    this.savedMap[reel.id] = !this.savedMap[reel.id];
    this.render();
    this._initCanvasAnimation();
    this.onInteraction({ type: 'save', saved: this.savedMap[reel.id], reel });
  }

  render() {
    if (!this.container) return;
    const reel = this.getCurrentReel();
    if (!reel) {
      this.container.innerHTML = `<div class="empty-feed">No reels available in this view.</div>`;
      return;
    }

    const isLiked = !!this.likedMap[reel.id];
    const isSaved = !!this.savedMap[reel.id];

    this.container.innerHTML = `
      <div class="reel-player-card" id="reelPlayerCard">
        <!-- Canvas Video Stage -->
        <div class="reel-stage">
          <canvas id="reelCanvas" class="reel-canvas" width="360" height="640"></canvas>
          
          <!-- Category & Audio Pill -->
          <div class="reel-top-bar">
            <span class="reel-category-badge">${reel.category}</span>
            <div class="audio-track-pill">
              <span class="sound-wave-icon">
                <span class="bar bar-1"></span>
                <span class="bar bar-2"></span>
                <span class="bar bar-3"></span>
              </span>
              <span class="audio-name">${reel.audio || 'Original Audio'}</span>
            </div>
          </div>

          <!-- Quick Navigation Buttons on Feed -->
          <button class="feed-nav-btn prev-btn" id="btnFeedPrev" title="Previous Reel (Up Arrow)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>
          </button>
          <button class="feed-nav-btn next-btn" id="btnFeedNext" title="Next Reel (Down Arrow)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>

          <!-- Interaction Floating Side Actions -->
          <div class="reel-side-actions">
            <button class="action-btn ${isLiked ? 'liked' : ''}" id="btnLike" title="Like">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="${isLiked ? '#ef4444' : 'none'}" stroke="${isLiked ? '#ef4444' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <span>${isLiked ? 'Liked' : reel.likes}</span>
            </button>

            <button class="action-btn" id="btnComment" title="Comments">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              <span>${reel.comments}</span>
            </button>

            <button class="action-btn ${isSaved ? 'saved' : ''}" id="btnSave" title="Save / Bookmark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="${isSaved ? '#f59e0b' : 'none'}" stroke="${isSaved ? '#f59e0b' : 'currentColor'}" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              <span>${isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button class="action-btn" id="btnShare" title="Share">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              <span>${reel.shares}</span>
            </button>
          </div>

          <!-- Bottom Meta & Transcript Info -->
          <div class="reel-overlay-info">
            <div class="creator-row">
              <span class="creator-avatar">${reel.creator.substring(1, 3).toUpperCase()}</span>
              <span class="creator-handle">${reel.creator}</span>
              <button class="follow-btn">Follow</button>
            </div>
            
            <h3 class="reel-title-text">${reel.title}</h3>
            
            <p class="reel-transcript-preview" id="reelTranscriptBox">
              <span class="caption-label">Transcript:</span> "${reel.transcript}"
            </p>

            <div class="reel-tags-row">
              ${(reel.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join(' ')}
            </div>

            <!-- Progress Scrubber -->
            <div class="reel-progress-container">
              <div class="reel-progress-bar" id="reelProgressBar" style="width: 35%"></div>
            </div>
          </div>
        </div>

        <!-- Feed Control Strip -->
        <div class="feed-footer-controls">
          <div class="feed-counter">
            Reel <strong>${this.currentIndex + 1}</strong> of <strong>${this.reels.length}</strong>
          </div>
          <div class="feed-shortcuts-hint">
            <span>Use <strong>&uarr; / &darr;</strong> keys to scroll</span>
          </div>
        </div>
      </div>
    `;

    this._bindEvents();
  }

  _bindEvents() {
    const btnNext = document.getElementById('btnFeedNext');
    const btnPrev = document.getElementById('btnFeedPrev');
    const btnLike = document.getElementById('btnLike');
    const btnSave = document.getElementById('btnSave');

    if (btnNext) btnNext.onclick = () => this.nextReel();
    if (btnPrev) btnPrev.onclick = () => this.prevReel();
    if (btnLike) btnLike.onclick = () => this.toggleLike();
    if (btnSave) btnSave.onclick = () => this.toggleSave();
  }

  _initCanvasAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    const canvas = document.getElementById('reelCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reel = this.getCurrentReel();
    if (!reel) return;

    const visualType = reel.videoVisualType || 'meme-matrix';
    let tick = 0;

    // Initialize particles based on visual type
    this.particleSystem = [];
    for (let i = 0; i < 40; i++) {
      this.particleSystem.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        char: String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
      });
    }

    const renderFrame = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background ambient gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#0a0f1d');
      bgGrad.addColorStop(1, '#030712');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (visualType === 'meme-matrix') {
        this._drawMatrixTheme(ctx, canvas, tick);
      } else if (visualType === 'lifestyle-vlog') {
        this._drawVlogTheme(ctx, canvas, tick);
      } else if (visualType === 'sketch-comedy') {
        this._drawComedyTheme(ctx, canvas, tick);
      } else if (visualType === 'hardware-teardown') {
        this._drawHardwareTheme(ctx, canvas, tick);
      } else if (visualType === 'game-simulation') {
        this._drawRedstoneTheme(ctx, canvas, tick);
      } else if (visualType === 'ai-flowchart') {
        this._drawAITheme(ctx, canvas, tick);
      } else if (visualType === 'math-particles') {
        this._drawParticlesTheme(ctx, canvas, tick);
      } else if (visualType === 'security-terminal') {
        this._drawSecurityTheme(ctx, canvas, tick);
      } else {
        this._drawGenericTheme(ctx, canvas, tick);
      }

      // Update progress bar
      const pBar = document.getElementById('reelProgressBar');
      if (pBar) {
        const pct = (tick % 300) / 300 * 100;
        pBar.style.width = `${pct}%`;
      }

      this.animationFrameId = requestAnimationFrame(renderFrame);
    };

    renderFrame();
  }

  _drawMatrixTheme(ctx, canvas, tick) {
    ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.font = '12px "JetBrains Mono", monospace';
    this.particleSystem.forEach(p => {
      p.y += 2.5;
      if (p.y > canvas.height) p.y = 0;
      ctx.fillText(p.char, p.x, p.y);
    });

    // Alert Card simulation
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.roundRect(40, 160, 280, 120, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fca5a5';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText('CRITICAL: PROD CI/CD ALERT', 55, 190);
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('NullPointerException: Thread #3', 55, 215);
    ctx.fillText('at FridayDeploy.pushToProd()', 55, 235);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Status: 15 nested if-else skipped', 55, 258);
  }

  _drawVlogTheme(ctx, canvas, tick) {
    // Cafe & Terminal Split Screen
    ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
    ctx.roundRect(30, 130, 300, 180, 12);
    ctx.fill();

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('KAFKA TELEMETRY MONITOR', 45, 155);

    // Live consumer lag pulse
    const lagVal = 400000 + Math.floor(Math.sin(tick * 0.05) * 15000);
    ctx.font = '22px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f87171';
    ctx.fillText(`${lagVal.toLocaleString()} msgs`, 45, 195);

    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('Consumer Group: order-processing-v2', 45, 225);
    ctx.fillText('DB Pool: 98/100 connections active', 45, 245);
    ctx.fillText('Latency Spike: +420ms at morning peak', 45, 265);
  }

  _drawComedyTheme(ctx, canvas, tick) {
    ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
    ctx.roundRect(30, 130, 300, 180, 12);
    ctx.fill();

    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#c084fc';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText('CODING INTERVIEW ZOOM CALL', 45, 155);

    // Pulse Waveform
    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    for (let x = 45; x < 315; x += 5) {
      const y = 205 + Math.sin((x + tick * 4) * 0.08) * 18;
      if (x === 45) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Interviewer: "Can we do better than O(n^2)?"', 45, 245);
    ctx.fillStyle = '#4ade80';
    ctx.fillText('You: "HashMap complement O(n) amortized!"', 45, 270);
  }

  _drawHardwareTheme(ctx, canvas, tick) {
    ctx.fillStyle = 'rgba(236, 72, 153, 0.15)';
    ctx.roundRect(30, 120, 300, 200, 12);
    ctx.fill();
    ctx.strokeStyle = '#ec4899';
    ctx.stroke();

    ctx.fillStyle = '#f472b6';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('LINUX KERNEL 6.8 COMPILE BENCHMARK', 45, 145);

    // Core Bars
    const chips = [
      { name: 'Apple M3 Pro (36GB Uni)', time: '1m 42s', pct: 85, color: '#38bdf8' },
      { name: 'Snapdragon X Elite', time: '2m 14s', pct: 68, color: '#f59e0b' },
      { name: 'RTX 4080 Laptop (i9)', time: '1m 55s', pct: 76, color: '#10b981' }
    ];

    chips.forEach((c, idx) => {
      const y = 175 + idx * 42;
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(`${c.name}: ${c.time}`, 45, y);

      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(45, y + 6, 270, 8);

      ctx.fillStyle = c.color;
      ctx.fillRect(45, y + 6, (c.pct / 100) * 270, 8);
    });
  }

  _drawRedstoneTheme(ctx, canvas, tick) {
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.roundRect(30, 130, 300, 180, 12);
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.stroke();

    ctx.fillStyle = '#fca5a5';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText('8-BIT MINECRAFT CPU IN SILICON', 45, 155);

    // Logic Gate Diagram Simulation
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    const pulse = Math.sin(tick * 0.1) > 0;
    ctx.fillStyle = pulse ? '#ef4444' : '#7f1d1d';
    ctx.fillRect(55, 180, 60, 35);
    ctx.fillRect(160, 180, 60, 35);
    ctx.fillRect(250, 180, 60, 35);

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('NAND A', 65, 202);
    ctx.fillText('ALU ADD', 168, 202);
    ctx.fillText('RAM 256B', 255, 202);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText('Executing: FIBONACCI(8) = 21', 45, 260);
    ctx.fillText('Clock Speed: 0.2 Hz (Redstone Ticks)', 45, 280);
  }

  _drawAITheme(ctx, canvas, tick) {
    ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
    ctx.roundRect(30, 130, 300, 180, 12);
    ctx.fill();
    ctx.strokeStyle = '#8b5cf6';
    ctx.stroke();

    ctx.fillStyle = '#c4b5fd';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('AGENTIC DOM GROUNDING PIPELINE', 45, 155);

    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('> Raw DOM: 4,800 nodes (120k tokens)', 45, 185);
    ctx.fillStyle = '#4ade80';
    ctx.fillText('> AXTree Pruned: 48 interactive nodes', 45, 210);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('> Action: click(bbox: [240, 180])', 45, 235);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('> Token Savings: 94.2% per step', 45, 260);
  }

  _drawParticlesTheme(ctx, canvas, tick) {
    // 3-Body orbital chaos simulation on canvas
    ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.roundRect(30, 120, 300, 200, 12);
    ctx.fill();
    ctx.strokeStyle = '#06b6d4';
    ctx.stroke();

    ctx.fillStyle = '#67e8f9';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('3-BODY ORBITAL CHAOS (RUNGE-KUTTA 4)', 45, 145);

    const cx = canvas.width / 2;
    const cy = 220;
    const bodies = [
      { r: 40, speed: 0.03, color: '#f59e0b', size: 6 },
      { r: 65, speed: -0.02, color: '#06b6d4', size: 5 },
      { r: 85, speed: 0.015, color: '#ec4899', size: 7 }
    ];

    bodies.forEach(b => {
      const bx = cx + Math.cos(tick * b.speed) * b.r;
      const by = cy + Math.sin(tick * b.speed) * (b.r * 0.6);
      ctx.beginPath();
      ctx.arc(bx, by, b.size, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
    });

    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('10,000 Particle Physics in WebGL @ 60FPS', 45, 295);
  }

  _drawSecurityTheme(ctx, canvas, tick) {
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.roundRect(30, 130, 300, 180, 12);
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.stroke();

    ctx.fillStyle = '#fca5a5';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('USB HID KEYSTROKE INJECTION', 45, 155);

    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('> USB Device ID: 0x046D (Spoofed Keyboard)', 45, 185);
    ctx.fillStyle = '#f87171';
    ctx.fillText('> Payload: powershell.exe -enc ...', 45, 210);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('> Speed: 1,000 WPM (Bypasses AV check)', 45, 235);
    ctx.fillStyle = '#4ade80';
    ctx.fillText('> Defense: udev rule device whitelist', 45, 260);
  }

  _drawGenericTheme(ctx, canvas, tick) {
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.fillRect(30, 130, 300, 180);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px sans-serif';
    ctx.fillText('Simulated Reel Feed Content', 60, 220);
  }
}
