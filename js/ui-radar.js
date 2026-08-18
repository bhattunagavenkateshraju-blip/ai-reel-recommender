/**
 * Interactive SVG Radar Chart & Category Skill/Interest Breakdown
 */

export class InterestRadarVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.categories = [
      { key: 'Java', label: 'Java / Backend', color: '#f59e0b' },
      { key: 'DSA', label: 'DSA / Algorithms', color: '#10b981' },
      { key: 'HLD', label: 'High Level Design', color: '#3b82f6' },
      { key: 'Hardware', label: 'Computer Arch / Hardware', color: '#ec4899' },
      { key: 'AI', label: 'AI & Agents', color: '#8b5cf6' },
      { key: 'Cybersecurity', label: 'Cybersecurity', color: '#ef4444' },
      { key: 'Other', label: 'Graphics / Systems', color: '#06b6d4' },
      { key: 'Career', label: 'SWE Career', color: '#14b8a6' }
    ];
  }

  /**
   * Render or update the radar chart and category bars
   * @param {Object} categoryCounts - Map of category keys to counts or scores (0-100)
   */
  render(categoryCounts = {}) {
    if (!this.container) return;

    // Calculate maximum and normalize
    const totalInteractions = Object.values(categoryCounts).reduce((a, b) => a + b, 0) || 1;
    
    const values = this.categories.map(cat => {
      const count = categoryCounts[cat.key] || 0;
      // Convert to score between 15 and 95 for visual radar balance
      const rawRatio = count / totalInteractions;
      const score = count === 0 ? 15 : Math.min(95, Math.round(25 + rawRatio * 70));
      return { ...cat, count, score };
    });

    const size = 320;
    const center = size / 2;
    const radius = 110;
    const angleStep = (Math.PI * 2) / this.categories.length;

    // Build SVG polygons for concentric grid
    let gridPolygons = '';
    [0.25, 0.5, 0.75, 1.0].forEach((scale, idx) => {
      const points = this.categories.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + Math.cos(angle) * (radius * scale);
        const y = center + Math.sin(angle) * (radius * scale);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');

      gridPolygons += `
        <polygon points="${points}" fill="none" stroke="rgba(255,255,255,${0.06 + idx * 0.03})" stroke-width="1" />
      `;
    });

    // Build spokes
    let spokes = '';
    this.categories.forEach((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;
      spokes += `
        <line x1="${center}" y1="${center}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
      `;
    });

    // Build data polygon
    const dataPoints = values.map((v, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (v.score / 100) * radius;
      const x = center + Math.cos(angle) * r;
      const y = center + Math.sin(angle) * r;
      return { x, y, ...v };
    });

    const polygonPointsStr = dataPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

    // Build vertex circles & labels
    let vertices = '';
    let labels = '';
    dataPoints.forEach((p, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const labelRadius = radius + 24;
      const lx = center + Math.cos(angle) * labelRadius;
      const ly = center + Math.sin(angle) * labelRadius;

      let textAnchor = 'middle';
      if (Math.cos(angle) > 0.3) textAnchor = 'start';
      else if (Math.cos(angle) < -0.3) textAnchor = 'end';

      vertices += `
        <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="${p.color}" stroke="#0f172a" stroke-width="2" />
      `;

      labels += `
        <text x="${lx.toFixed(1)}" y="${ly.toFixed(1) + 4}" fill="rgba(255,255,255,0.75)" font-size="10" font-family="'JetBrains Mono', monospace" text-anchor="${textAnchor}">${p.label}</text>
      `;
    });

    // Build Breakdown Bars HTML
    const barsHtml = values.map(v => {
      const pct = Math.min(100, Math.round((v.count / Math.max(1, totalInteractions)) * 100));
      return `
        <div class="radar-bar-item">
          <div class="radar-bar-header">
            <span class="bar-name"><span class="color-dot" style="background:${v.color}"></span>${v.label}</span>
            <span class="bar-val">${v.count} reel${v.count === 1 ? '' : 's'}</span>
          </div>
          <div class="radar-bar-track">
            <div class="radar-bar-fill" style="width: ${Math.max(4, pct)}%; background: ${v.color};"></div>
          </div>
        </div>
      `;
    }).join('');

    this.container.innerHTML = `
      <div class="radar-wrapper">
        <div class="radar-chart-box">
          <svg viewBox="0 0 ${size} ${size}" class="radar-svg" role="img" aria-label="Student Latent Interest Radar">
            <defs>
              <linearGradient id="radarFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.45" />
                <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.35" />
                <stop offset="100%" stop-color="#10b981" stop-opacity="0.45" />
              </linearGradient>
            </defs>
            ${gridPolygons}
            ${spokes}
            <polygon points="${polygonPointsStr}" fill="url(#radarFillGrad)" stroke="#60a5fa" stroke-width="2" />
            ${vertices}
            ${labels}
          </svg>
        </div>
        <div class="radar-bars-box">
          <div class="radar-bars-title">
            <span>Interest Intensity Breakdown</span>
            <span class="badge-pill">${totalInteractions} Signal${totalInteractions === 1 ? '' : 's'}</span>
          </div>
          <div class="radar-bars-list">
            ${barsHtml}
          </div>
        </div>
      </div>
    `;
  }
}
