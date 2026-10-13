/* GFS AI Solver PRO
 * Providers: Xrina (free), Gemini, Groq, OpenAI
 */
(function () {
  if (window.__GFS_LOADED__) {
    document.getElementById('gfs-panel')?.remove();
    window.__GFS_LOADED__ = false;
    return;
  }
  window.__GFS_LOADED__ = true;

  const state = {
    provider: 'xrina',
    mode: 'balanced',
    running: false,
    startTime: 0,
    stats: { ok: 0, fail: 0, total: 0, confidence: 0 }
  };

  const XRINA_ENDPOINT = 'https://apiii-xrina.my.id/ai/gemini?text=';

  const MODELS = {
    xrina: ['Gemini AI'],
    gemini: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.5-flash'],
    groq: ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'llama3-70b-8192', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
    openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo']
  };

  const CSS = `
  #gfs-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:380px;max-width:94vw;background:linear-gradient(180deg,#0b1220 0%,#0f172a 100%);color:#e2e8f0;border:1px solid #1e293b;border-radius:14px;box-shadow:0 25px 60px rgba(0,0,0,.75),0 0 0 1px rgba(99,102,241,.15);z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;user-select:none;animation:gfsIn .28s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;max-height:88vh}
  @keyframes gfsIn{from{opacity:0;transform:translate(-50%,-50%) scale(.92)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
  @keyframes gfsPulse{0%,100%{opacity:1}50%{opacity:.5}}
  #gfs-panel *{box-sizing:border-box}
  #gfs-panel::-webkit-scrollbar{width:6px}
  #gfs-panel::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}
  .gfs-hdr{padding:12px 14px;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%);border-radius:14px 14px 0 0;cursor:move;display:flex;justify-content:space-between;align-items:center;font-weight:600;font-size:14px;position:relative;overflow:hidden}
  .gfs-hdr::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 30% 0%,rgba(255,255,255,.15),transparent 60%);pointer-events:none}
  .gfs-hdr-title{display:flex;align-items:center;gap:8px;pointer-events:none;position:relative;z-index:1}
  .gfs-dot{width:8px;height:8px;background:#22c55e;border-radius:50%;box-shadow:0 0 8px #22c55e;animation:gfsPulse 2s infinite}
  .gfs-hdr-btns{display:flex;gap:6px;position:relative;z-index:1}
  .gfs-hdr button{background:rgba(255,255,255,.18);border:none;color:#fff;width:24px;height:24px;border-radius:6px;cursor:pointer;font-size:14px;line-height:1;display:flex;align-items:center;justify-content:center;transition:.15s}
  .gfs-hdr button:hover{background:rgba(255,255,255,.32);transform:scale(1.05)}
  .gfs-tabs{display:flex;background:#0f172a;border-bottom:1px solid #1e293b;padding:0 6px}
  .gfs-tab{flex:1;padding:9px 6px;background:none;border:none;color:#64748b;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;border-bottom:2px solid transparent;transition:.15s;text-transform:uppercase;letter-spacing:.4px}
  .gfs-tab:hover{color:#94a3b8}
  .gfs-tab.active{color:#818cf8;border-bottom-color:#818cf8}
  .gfs-body{padding:14px;overflow-y:auto;flex:1}
  .gfs-tab-panel{display:none}
  .gfs-tab-panel.active{display:block}
  .gfs-row{margin-bottom:12px}
  .gfs-lbl{display:block;font-size:10px;color:#94a3b8;margin-bottom:5px;text-transform:uppercase;letter-spacing:.6px;font-weight:600}
  .gfs-lbl-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px}
  .gfs-hint{font-size:9px;color:#475569;text-transform:none;letter-spacing:0;font-weight:400}
  .gfs-input,.gfs-select{width:100%;padding:10px 12px;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#e2e8f0;font-size:12.5px;font-family:inherit;outline:none;transition:.15s}
  .gfs-input:focus,.gfs-select:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15);background:#0b1220}
  .gfs-select{cursor:pointer}
  .gfs-input::placeholder{color:#475569}
  .gfs-input-group{position:relative}
  .gfs-input-group .gfs-input{padding-right:44px}
  .gfs-toggle-eye{position:absolute;right:4px;top:50%;transform:translateY(-50%);background:none;border:none;color:#64748b;cursor:pointer;padding:6px 10px;font-size:14px;border-radius:6px}
  .gfs-toggle-eye:hover{color:#94a3b8;background:#1e293b}
  .gfs-btn{width:100%;padding:11px 14px;border:none;border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer;font-family:inherit;transition:.15s;display:flex;align-items:center;justify-content:center;gap:6px}
  .gfs-btn-main{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;box-shadow:0 4px 14px rgba(99,102,241,.35)}
  .gfs-btn-main:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(99,102,241,.5)}
  .gfs-btn-main:disabled{opacity:.5;cursor:not-allowed;box-shadow:none}
  .gfs-btn-sec{background:#1e293b;color:#cbd5e1;border:1px solid #334155}
  .gfs-btn-sec:hover{background:#334155;color:#e2e8f0}
  .gfs-btn-danger{background:#450a0a;color:#fca5a5;border:1px solid #7f1d1d}
  .gfs-btn-danger:hover{background:#7f1d1d}
  .gfs-btn-sm{padding:7px 10px;font-size:11px}
  .gfs-row-2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .gfs-mode-group{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
  .gfs-mode{padding:8px 4px;background:#0f172a;border:1px solid #334155;border-radius:8px;color:#94a3b8;font-size:10.5px;font-weight:600;cursor:pointer;font-family:inherit;transition:.15s;text-align:center}
  .gfs-mode:hover{border-color:#475569;color:#cbd5e1}
  .gfs-mode.active{background:linear-gradient(135deg,rgba(99,102,241,.2),rgba(139,92,246,.2));border-color:#6366f1;color:#c7d2fe}
  .gfs-mode-name{display:block;font-size:11px}
  .gfs-mode-sub{display:block;font-size:9px;opacity:.7;margin-top:2px;font-weight:400}
  .gfs-log{background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:10px;height:200px;overflow-y:auto;color:#64748b;line-height:1.6}
  .gfs-log div{margin-bottom:2px;word-break:break-word}
  .gfs-log .ok{color:#22c55e}
  .gfs-log .err{color:#ef4444}
  .gfs-log .info{color:#38bdf8}
  .gfs-log .warn{color:#fbbf24}
  .gfs-progress{height:4px;background:#1e293b;border-radius:2px;overflow:hidden;margin-top:8px;display:none}
  .gfs-progress.active{display:block}
  .gfs-progress-fill{height:100%;background:linear-gradient(90deg,#6366f1,#8b5cf6);transition:width .3s ease;border-radius:2px}
  .gfs-score{margin-top:12px;padding:14px;background:linear-gradient(135deg,#1e293b,#334155);border-radius:10px;border-left:3px solid #6366f1;display:none}
  .gfs-score.active{display:block;animation:gfsIn .3s}
  .gfs-score-h{font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.6px;margin-bottom:6px;font-weight:600}
  .gfs-score-v{font-size:32px;font-weight:800;line-height:1;background:linear-gradient(135deg,#22c55e,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .gfs-score-d{font-size:10.5px;color:#94a3b8;margin-top:6px;line-height:1.5}
  .gfs-score-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px;padding-top:10px;border-top:1px solid #475569}
  .gfs-stat{text-align:center}
  .gfs-stat-v{font-size:16px;font-weight:700;color:#e2e8f0}
  .gfs-stat-l{font-size:9px;color:#64748b;text-transform:uppercase;letter-spacing:.4px;margin-top:2px}
  .gfs-footer{padding:8px 14px;background:#0a0f1c;border-top:1px solid #1e293b;border-radius:0 0 14px 14px;font-size:10px;color:#475569;display:flex;justify-content:space-between;align-items:center}
  .gfs-badge{padding:2px 6px;background:#1e293b;border-radius:4px;font-family:monospace;font-size:9.5px;color:#818cf8}
  .gfs-free{display:inline-block;padding:2px 6px;background:#14532d;color:#86efac;border-radius:4px;font-size:9px;font-weight:600;margin-left:6px}
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  const panel = document.createElement('div');
  panel.id = 'gfs-panel';
  panel.innerHTML = `
    <div class="gfs-hdr" id="gfs-hdr">
      <div class="gfs-hdr-title">
        <span class="gfs-dot"></span>
        <span>GFS AI Solver <span style="opacity:.7;font-weight:400">PRO</span></span>
      </div>
      <div class="gfs-hdr-btns">
        <button id="gfs-min">−</button>
        <button id="gfs-close">×</button>
      </div>
    </div>
    <div class="gfs-tabs">
      <button class="gfs-tab active" data-tab="solve">Solve</button>
      <button class="gfs-tab" data-tab="settings">Settings</button>
      <button class="gfs-tab" data-tab="log">Log</button>
    </div>
    <div class="gfs-body" id="gfs-body">
      <div class="gfs-tab-panel active" data-panel="solve">
        <div class="gfs-row">
          <div class="gfs-lbl-row">
            <label class="gfs-lbl">Mode</label>
            <span class="gfs-hint">strategi</span>
          </div>
          <div class="gfs-mode-group">
            <button class="gfs-mode" data-mode="fast"><span class="gfs-mode-name">Fast</span><span class="gfs-mode-sub">cepat</span></button>
            <button class="gfs-mode active" data-mode="balanced"><span class="gfs-mode-name">Balanced</span><span class="gfs-mode-sub">default</span></button>
            <button class="gfs-mode" data-mode="safe"><span class="gfs-mode-name">Safe</span><span class="gfs-mode-sub">akurat</span></button>
          </div>
        </div>
        <div class="gfs-row">
          <button class="gfs-btn gfs-btn-main" id="gfs-solve">NYELESAIN SOAL</button>
        </div>
        <div class="gfs-progress" id="gfs-progress"><div class="gfs-progress-fill" id="gfs-progress-fill"></div></div>
        <div class="gfs-row-2" style="margin-top:12px">
          <button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-parse">CEK SOAL</button>
          <button class="gfs-btn gfs-btn-danger gfs-btn-sm" id="gfs-clear">CLEAR</button>
        </div>
        <div class="gfs-score" id="gfs-score">
          <div class="gfs-score-h">Prediksi Nilai</div>
          <div class="gfs-score-v" id="gfs-score-v">-</div>
          <div class="gfs-score-d" id="gfs-score-d"></div>
          <div class="gfs-score-stats">
            <div class="gfs-stat"><div class="gfs-stat-v" id="gfs-stat-ok">0</div><div class="gfs-stat-l">Terisi</div></div>
            <div class="gfs-stat"><div class="gfs-stat-v" id="gfs-stat-fail">0</div><div class="gfs-stat-l">Gagal</div></div>
            <div class="gfs-stat"><div class="gfs-stat-v" id="gfs-stat-time">0s</div><div class="gfs-stat-l">Waktu</div></div>
          </div>
        </div>
      </div>
      <div class="gfs-tab-panel" data-panel="settings">
        <div class="gfs-row">
          <label class="gfs-lbl">Provider</label>
          <select class="gfs-select" id="gfs-provider">
            <option value="xrina">Xrina (FREE - no key)</option>
            <option value="gemini">Google Gemini</option>
            <option value="groq">Groq</option>
            <option value="openai">OpenAI</option>
          </select>
          <div id="gfs-free-tag" class="gfs-free" style="margin-top:6px">GRATIS · NO API KEY</div>
        </div>
        <div class="gfs-row">
          <label class="gfs-lbl">Model</label>
          <select class="gfs-select" id="gfs-model"></select>
        </div>
        <div class="gfs-row" id="gfs-key-row" style="display:none">
          <label class="gfs-lbl">API Key</label>
          <div class="gfs-input-group">
            <input class="gfs-input" id="gfs-key" type="password" placeholder="Paste API key" autocomplete="off" />
            <button class="gfs-toggle-eye" id="gfs-eye" type="button">👁</button>
          </div>
        </div>
        <div class="gfs-row-2">
          <button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-save">💾 SAVE</button>
          <button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-load">📁 LOAD</button>
        </div>
        <div class="gfs-row" style="margin-top:14px">
          <div class="gfs-lbl-row">
            <label class="gfs-lbl">Confidence Threshold</label>
            <span class="gfs-hint" id="gfs-conf-val">70%</span>
          </div>
          <input type="range" id="gfs-conf" min="0" max="100" value="70" style="width:100%;accent-color:#6366f1" />
        </div>
        <div class="gfs-row">
          <label class="gfs-lbl">Auto-retry</label>
          <select class="gfs-select" id="gfs-retry">
            <option value="0">Off</option>
            <option value="1">1x</option>
            <option value="2" selected>2x</option>
            <option value="3">3x</option>
          </select>
        </div>
        <div class="gfs-row">
          <div class="gfs-lbl-row">
            <label class="gfs-lbl">Delay antar soal</label>
            <span class="gfs-hint" id="gfs-delay-val">200</span>
          </div>
          <input type="range" id="gfs-delay" min="50" max="800" step="50" value="200" style="width:100%;accent-color:#6366f1" />
        </div>
      </div>
      <div class="gfs-tab-panel" data-panel="log">
        <div class="gfs-row-2">
          <button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-export">📋 EXPORT</button>
          <button class="gfs-btn gfs-btn-danger gfs-btn-sm" id="gfs-clearlog">🗑 CLEAR</button>
        </div>
        <div class="gfs-log" id="gfs-log"><div>Ready. Provider default: Xrina (no key needed).</div></div>
      </div>
    </div>
    <div class="gfs-footer">
      <span>GFS PRO v2.1</span>
      <span class="gfs-badge" id="gfs-footer-stat">idle</span>
    </div>`;
  document.body.appendChild(panel);

  const $ = (id) => document.getElementById(id);

  document.querySelectorAll('.gfs-tab').forEach((tab) => {
    tab.onclick = () => {
      document.querySelectorAll('.gfs-tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.gfs-tab-panel').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector('.gfs-tab-panel[data-panel="' + tab.dataset.tab + '"]').classList.add('active');
    };
  });

  document.querySelectorAll('.gfs-mode').forEach((btn) => {
    btn.onclick = () => {
      document.querySelectorAll('.gfs-mode').forEach((m) => m.classList.remove('active'));
      btn.classList.add('active');
      state.mode = btn.dataset.mode;
      const delays = { fast: 100, balanced: 200, safe: 400 };
      $('gfs-delay').value = delays[state.mode];
      $('gfs-delay-val').textContent = delays[state.mode];
    };
  });

  const log = (msg, cls = 'info') => {
    const el = $('gfs-log');
    const d = document.createElement('div');
    d.className = cls;
    d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
    el.appendChild(d);
    el.scrollTop = el.scrollHeight;
    while (el.children.length > 300) el.removeChild(el.firstChild);
  };

  const setFooter = (txt) => { $('gfs-footer-stat').textContent = txt; };

  $('gfs-eye').onclick = () => {
    const inp = $('gfs-key');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  };

  const updateModels = () => {
    const p = $('gfs-provider').value;
    const sel = $('gfs-model');
    sel.innerHTML = '';
    (MODELS[p] || []).forEach((m) => {
      const o = document.createElement('option');
      o.value = m; o.textContent = m;
      sel.appendChild(o);
    });
    state.provider = p;
    // Sembunyikan API key row untuk xrina
    $('gfs-key-row').style.display = (p === 'xrina') ? 'none' : 'block';
    $('gfs-free-tag').style.display = (p === 'xrina') ? 'inline-block' : 'none';
  };
  $('gfs-provider').onchange = updateModels;
  updateModels();

  $('gfs-conf').oninput = (e) => { $('gfs-conf-val').textContent = e.target.value + '%'; };
  $('gfs-delay').oninput = (e) => { $('gfs-delay-val').textContent = e.target.value; };

  $('gfs-save').onclick = () => {
    try {
      localStorage.setItem('gfs_config', JSON.stringify({
        provider: $('gfs-provider').value,
        model: $('gfs-model').value,
        key: $('gfs-key').value,
        mode: state.mode,
        conf: $('gfs-conf').value,
        delay: $('gfs-delay').value,
        retry: $('gfs-retry').value
      }));
      log('Config saved.', 'ok');
    } catch (e) { log('Save gagal: ' + e.message, 'err'); }
  };
  $('gfs-load').onclick = () => {
    try {
      const c = JSON.parse(localStorage.getItem('gfs_config') || '{}');
      if (c.provider) { $('gfs-provider').value = c.provider; updateModels(); }
      if (c.model) $('gfs-model').value = c.model;
      if (c.key) $('gfs-key').value = c.key;
      if (c.mode) document.querySelector('.gfs-mode[data-mode="' + c.mode + '"]')?.click();
      if (c.conf) { $('gfs-conf').value = c.conf; $('gfs-conf-val').textContent = c.conf + '%'; }
      if (c.delay) { $('gfs-delay').value = c.delay; $('gfs-delay-val').textContent = c.delay; }
      if (c.retry) $('gfs-retry').value = c.retry;
      log('Config loaded.', 'ok');
    } catch (e) { log('Load gagal: ' + e.message, 'err'); }
  };

  $('gfs-export').onclick = () => {
    const txt = [...$('gfs-log').children].map((c) => c.textContent).join('\n');
    const blob = new Blob([txt], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gfs-log-' + Date.now() + '.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  };
  $('gfs-clearlog').onclick = () => { $('gfs-log').innerHTML = ''; log('Log cleared.', 'info'); };

  $('gfs-min').onclick = () => {
    const body = $('gfs-body');
    const tabs = panel.querySelector('.gfs-tabs');
    const footer = panel.querySelector('.gfs-footer');
    const hidden = body.style.display === 'none';
    body.style.display = hidden ? '' : 'none';
    tabs.style.display = hidden ? '' : 'none';
    footer.style.display = hidden ? '' : 'none';
    $('gfs-min').textContent = hidden ? '−' : '+';
  };

  $('gfs-close').onclick = () => {
    panel.remove();
    window.__GFS_LOADED__ = false;
  };

  // Drag
  const hdr = $('gfs-hdr');
  let isDrag = false, ox = 0, oy = 0;
  const startDrag = (x, y) => {
    const r = panel.getBoundingClientRect();
    isDrag = true;
    ox = x - r.left;
    oy = y - r.top;
    panel.style.transform = 'none';
    panel.style.animation = 'none';
    panel.style.left = r.left + 'px';
    panel.style.top = r.top + 'px';
  };
  const moveDrag = (x, y) => {
    if (!isDrag) return;
    const r = panel.getBoundingClientRect();
    const nLeft = Math.max(0, Math.min(window.innerWidth - r.width, x - ox));
    const nTop = Math.max(0, Math.min(window.innerHeight - r.height, y - oy));
    panel.style.left = nLeft + 'px';
    panel.style.top = nTop + 'px';
  };
  const endDrag = () => { isDrag = false; };
  hdr.addEventListener('mousedown', (e) => { if (e.target.closest('button')) return; startDrag(e.clientX, e.clientY); });
  hdr.addEventListener('touchstart', (e) => { if (e.target.closest('button')) return; startDrag(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  document.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
  document.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchend', endDrag);

  // Parse questions
  const parseQuestions = () => {
    const groups = document.querySelectorAll('div[role="radiogroup"], div[role="listbox"]');
    const questions = [];
    groups.forEach((g, i) => {
      let qText = '';
      let el = g;
      for (let j = 0; j < 8; j++) {
        el = el.parentElement;
        if (!el) break;
        const heading = el.querySelector('[role="heading"]') || el.querySelector('.M7eMe') || el.querySelector('.Qr7Oae');
        if (heading && heading.innerText && heading.innerText.trim()) { qText = heading.innerText.trim(); break; }
      }
      const opts = [...g.querySelectorAll('div[role="radio"], div[role="checkbox"]')].map((o) => ({
        text: (o.innerText || '').trim(), el: o,
      }));
      const type = g.querySelector('div[role="radio"]') ? 'single' : 'multi';
      if (opts.length) questions.push({ idx: i, qText, opts, type, group: g });
    });
    return questions;
  };

  $('gfs-parse').onclick = () => {
    const q = parseQuestions();
    log('Ditemukan ' + q.length + ' pertanyaan.', 'ok');
    q.slice(0, 3).forEach((item, i) => log('Q' + (i + 1) + ': ' + (item.qText || '(no text)').slice(0, 60), 'info'));
  };

  $('gfs-clear').onclick = () => {
    let cleared = 0;
    document.querySelectorAll('div[role="radio"][aria-checked="true"], div[role="checkbox"][aria-checked="true"]').forEach((el) => { el.click(); cleared++; });
    log('Cleared ' + cleared + ' jawaban.', 'warn');
  };

  // ─── Provider callers ───
  const callXrina = async (apiKey, model, prompt) => {
    const url = XRINA_ENDPOINT + encodeURIComponent(prompt);
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error('Xrina HTTP ' + res.status);
    const data = await res.json();
    if (!data.status) throw new Error('Xrina status false');
    const text = data?.data?.response;
    if (typeof text !== 'string' || !text.trim()) throw new Error('Xrina empty response');
    return text;
  };

  const callGemini = async (apiKey, model, prompt) => {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + apiKey;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
      }),
    });
    if (!res.ok) throw new Error('Gemini HTTP ' + res.status);
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  };

  const callOpenAI = async (apiKey, model, prompt) => {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
      body: JSON.stringify({
        model, temperature: 0.2,
        messages: [
          { role: 'system', content: 'Answer MCQ. Output valid JSON object with "answers" array.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      }),
    });
    if (!res.ok) throw new Error('OpenAI HTTP ' + res.status);
    const data = await res.json();
    return data.choices[0].message.content;
  };

  const callGroq = async (apiKey, model, prompt) => {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
      body: JSON.stringify({
        model, temperature: 0.2,
        messages: [
          { role: 'system', content: 'Answer MCQ. Output valid JSON object with "answers" array.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
      }),
    });
    if (!res.ok) throw new Error('Groq HTTP ' + res.status);
    const data = await res.json();
    return data.choices[0].message.content;
  };

  // ─── Parse AI response ───
  const parseAIResponse = (raw) => {
    let data;
    try { data = JSON.parse(raw); }
    catch {
      const aM = raw.match(/\[[\s\S]*\]/), oM = raw.match(/\{[\s\S]*\}/);
      if (aM) data = JSON.parse(aM[0]);
      else if (oM) data = JSON.parse(oM[0]);
      else throw new Error('AI response bukan JSON.');
    }
    const arr = Array.isArray(data) ? data : (data.answers || data.data || data.results || []);
    if (!Array.isArray(arr)) throw new Error('Format "answers" harus array.');
    const clean = [];
    for (const it of arr) {
      if (!it || !Number.isInteger(it.idx) || typeof it.answer !== 'string') continue;
      let c = Number(it.confidence);
      if (!isFinite(c) || c < 0) c = 0.7;
      if (c > 1) c = 1;
      clean.push({ idx: it.idx, answer: it.answer, confidence: c });
    }
    if (!clean.length) throw new Error('No valid answers.');
    return clean;
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ─── Solve ───
  $('gfs-solve').onclick = async () => {
    if (state.running) return;
    const key = $('gfs-key').value.trim();
    const provider = $('gfs-provider').value;
    const model = $('gfs-model').value;
    const threshold = parseInt($('gfs-conf').value) / 100;
    const delay = parseInt($('gfs-delay').value);
    const retryN = parseInt($('gfs-retry').value);

    if (provider !== 'xrina' && !key) return log('API key kosong. Cek tab Settings.', 'err');

    const questions = parseQuestions();
    if (!questions.length) return log('Nggak ada pertanyaan.', 'err');

    state.running = true;
    state.startTime = Date.now();
    state.stats = { ok: 0, fail: 0, total: questions.length, confidence: 0 };
    setFooter('running');

    const btn = $('gfs-solve');
    btn.disabled = true;
    btn.textContent = 'AI mikir...';
    const prog = $('gfs-progress');
    const progFill = $('gfs-progress-fill');
    prog.classList.add('active');
    progFill.style.width = '0%';

    log('[' + provider + '] Parse ' + questions.length + ' soal.', 'info');

    // Prompt yang minta JSON output
    const prompt =
      'Kamu asisten ujian. Jawab pertanyaan pilihan ganda berikut.\n' +
      'BALAS HANYA dengan JSON object tanpa markdown, tanpa teks lain:\n' +
      '{"answers":[{"idx":0,"answer":"<teks opsi PERSIS>","confidence":0.9}]}\n\n' +
      'Aturan:\n' +
      '- Single choice: 1 jawaban\n' +
      '- Multi choice (checkbox): 1-2 jawaban paling tepat\n' +
      '- "answer" harus SAMA PERSIS dengan teks opsi\n' +
      '- "confidence" = 0 sampai 1\n\n' +
      'PERTANYAAN:\n' +
      questions.map((q, i) => '[Q' + i + '] (' + q.type + ') ' + q.qText + '\nOPSI:\n' + q.opts.map((o) => '  - ' + o.text).join('\n')).join('\n\n');

    try {
      let raw, attempt = 0, lastErr;
      const maxAttempts = 1 + retryN;
      while (attempt < maxAttempts) {
        attempt++;
        try {
          log('Request ' + provider + ' (attempt ' + attempt + '/' + maxAttempts + ')...', 'info');
          if (provider === 'xrina') raw = await callXrina(key, model, prompt);
          else if (provider === 'gemini') raw = await callGemini(key, model, prompt);
          else if (provider === 'groq') raw = await callGroq(key, model, prompt);
          else raw = await callOpenAI(key, model, prompt);
          break;
        } catch (e) {
          lastErr = e;
          log('Attempt ' + attempt + ' gagal: ' + e.message, 'warn');
          if (attempt < maxAttempts) await sleep(1500);
        }
      }
      if (!raw) throw lastErr || new Error('Semua attempt gagal.');

      log('AI response OK (' + raw.length + ' chars).', 'ok');
      const answers = parseAIResponse(raw);
      log('AI kasih ' + answers.length + ' jawaban.', 'ok');

      for (let i = 0; i < answers.length; i++) {
        const a = answers[i];
        progFill.style.width = Math.round(((i + 1) / answers.length) * 100) + '%';
        const q = questions[a.idx];
        if (!q) continue;

        if (a.confidence < threshold) {
          log('Q' + a.idx + ' ⚠ skip (conf ' + (a.confidence * 100).toFixed(0) + '% < ' + (threshold * 100) + '%)', 'warn');
          state.stats.fail++;
          continue;
        }

        const target =
          q.opts.find((o) => o.text === a.answer) ||
          q.opts.find((o) => o.text.toLowerCase() === a.answer.toLowerCase()) ||
          q.opts.find((o) => o.text.includes(a.answer) || a.answer.includes(o.text));

        if (target) {
          target.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await sleep(80);
          target.el.click();
          state.stats.ok++;
          state.stats.confidence += a.confidence;
          log('Q' + a.idx + ' ✓ ' + a.answer.slice(0, 50), 'ok');
        } else {
          state.stats.fail++;
          log('Q' + a.idx + ' ✗ no match: ' + a.answer.slice(0, 50), 'err');
        }
        await sleep(delay);
      }

      const avgConf = state.stats.ok > 0 ? state.stats.confidence / state.stats.ok : 0;
      const pct = Math.round(avgConf * 100);
      const grade = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'E';
      const elapsed = Math.round((Date.now() - state.startTime) / 1000);
      $('gfs-score').classList.add('active');
      $('gfs-score-v').textContent = pct + '% · ' + grade;
      $('gfs-score-d').textContent = state.stats.ok + '/' + state.stats.total + ' soal terisi · threshold ' + (threshold * 100) + '%';
      $('gfs-stat-ok').textContent = state.stats.ok;
      $('gfs-stat-fail').textContent = state.stats.fail;
      $('gfs-stat-time').textContent = elapsed + 's';
      setFooter('done · ' + pct + '%');
      log('SELESAI. ' + state.stats.ok + '/' + state.stats.total + ' terisi dalam ' + elapsed + 's.', 'ok');
    } catch (e) {
      log('ERROR: ' + e.message, 'err');
      setFooter('error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'NYELESAIN SOAL';
      state.running = false;
      setTimeout(() => { prog.classList.remove('active'); progFill.style.width = '0%'; }, 1500);
    }
  };

  // Auto-load saved config
  try {
    const c = JSON.parse(localStorage.getItem('gfs_config') || '{}');
    if (c.provider) { $('gfs-provider').value = c.provider; updateModels(); }
    if (c.model) $('gfs-model').value = c.model;
    if (c.key) $('gfs-key').value = c.key;
  } catch (e) {}

  log('GFS PRO aktif. Provider default: Xrina (gratis, no key).', 'ok');
})();
