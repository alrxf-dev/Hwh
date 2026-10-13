/* GFS AI Solver PRO v3 — Groq default, GUI enhanced */
(function () {
  if (window.__GFS_LOADED__) { document.getElementById('gfs-panel')?.remove(); window.__GFS_LOADED__ = false; return; }
  window.__GFS_LOADED__ = true;

  const HARDCODED_KEYS = {
    groq: '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'
  };

  const state = { running: false };
  const PROXIES = {
    allorigins: (u) => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u),
    codetabs: (u) => 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(u),
    none: (u) => u
  };
  const MODELS = {
    groq: ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b', 'allam-2-7b'],
    openrouter: ['deepseek/deepseek-chat:free', 'google/gemini-2.0-flash-exp:free', 'meta-llama/llama-3.3-70b-instruct:free', 'qwen/qwen-2.5-72b-instruct:free'],
    openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'],
    xrina: ['Gemini AI']
  };

  const CSS = `
  #gfs-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:400px;max-width:94vw;background:linear-gradient(180deg,#0b1220 0%,#0f172a 100%);color:#e2e8f0;border:1px solid #1e293b;border-radius:16px;box-shadow:0 30px 80px rgba(0,0,0,.85),0 0 0 1px rgba(99,102,241,.2);z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;display:flex;flex-direction:column;max-height:90vh;overflow:hidden;animation:gfsIn .3s cubic-bezier(.4,0,.2,1)}
  @keyframes gfsIn{from{opacity:0;transform:translate(-50%,-50%) scale(.92)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
  @keyframes gfsPulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes gfsSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  #gfs-panel *{box-sizing:border-box}
  #gfs-panel::-webkit-scrollbar{width:6px}
  #gfs-panel::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}
  #gfs-panel::-webkit-scrollbar-track{background:transparent}

  .gfs-hdr{padding:14px 16px;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%);border-bottom:1px solid rgba(255,255,255,.1);cursor:move;display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:15px;color:#fff;position:relative;overflow:hidden;flex-shrink:0}
  .gfs-hdr::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 20% 0%,rgba(255,255,255,.25),transparent 55%);pointer-events:none}
  .gfs-hdr-title{display:flex;align-items:center;gap:10px;position:relative;z-index:1;pointer-events:none}
  .gfs-logo{width:26px;height:26px;background:rgba(255,255,255,.25);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px}
  .gfs-status{width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 10px #4ade80;animation:gfsPulse 2s infinite}
  .gfs-status.busy{background:#facc15;box-shadow:0 0 10px #facc15;animation:gfsSpin 1s linear infinite}
  .gfs-hdr-btns{display:flex;gap:6px;position:relative;z-index:1}
  .gfs-hdr button{background:rgba(255,255,255,.2);border:none;color:#fff;width:26px;height:26px;border-radius:8px;cursor:pointer;font-size:15px;line-height:1;display:flex;align-items:center;justify-content:center;transition:all .15s;font-weight:600}
  .gfs-hdr button:hover{background:rgba(255,255,255,.35);transform:scale(1.08)}

  .gfs-tabs{display:flex;background:#0b1220;border-bottom:1px solid #1e293b;padding:4px 6px 0;flex-shrink:0}
  .gfs-tab{flex:1;padding:10px 8px;background:none;border:none;color:#64748b;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;border-bottom:2px solid transparent;text-transform:uppercase;letter-spacing:.6px;transition:all .15s;border-radius:6px 6px 0 0}
  .gfs-tab:hover{color:#94a3b8;background:rgba(148,163,184,.05)}
  .gfs-tab.active{color:#a5b4fc;border-bottom-color:#6366f1;background:rgba(99,102,241,.08)}

  .gfs-body{padding:16px;overflow-y:auto;flex:1;min-height:0}
  .gfs-tab-panel{display:none;animation:gfsIn .25s}
  .gfs-tab-panel.active{display:block}

  .gfs-row{margin-bottom:12px}
  .gfs-lbl{display:block;font-size:10px;color:#94a3b8;margin-bottom:6px;text-transform:uppercase;font-weight:700;letter-spacing:.6px}
  .gfs-hint{font-size:9.5px;color:#475569;text-transform:none;letter-spacing:0;font-weight:400;float:right;margin-top:1px}

  .gfs-input,.gfs-select{width:100%;padding:10px 12px;background:#0b1220;border:1px solid #334155;border-radius:9px;color:#e2e8f0;font-size:12.5px;font-family:inherit;outline:none;transition:all .15s}
  .gfs-input:focus,.gfs-select:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.18);background:#0f172a}
  .gfs-input::placeholder{color:#475569}
  .gfs-select{cursor:pointer}

  .gfs-input-wrap{position:relative}
  .gfs-input-wrap .gfs-input{padding-right:44px}
  .gfs-eye{position:absolute;right:4px;top:50%;transform:translateY(-50%);background:none;border:none;color:#64748b;cursor:pointer;padding:6px 10px;font-size:14px;border-radius:6px}
  .gfs-eye:hover{color:#94a3b8;background:#1e293b}

  .gfs-btn{width:100%;padding:12px;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:.3px}
  .gfs-btn-main{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;box-shadow:0 6px 20px rgba(99,102,241,.4),inset 0 1px 0 rgba(255,255,255,.2)}
  .gfs-btn-main:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 26px rgba(99,102,241,.55)}
  .gfs-btn-main:active:not(:disabled){transform:translateY(0)}
  .gfs-btn-main:disabled{opacity:.5;cursor:not-allowed;box-shadow:none}
  .gfs-btn-sec{background:#1e293b;color:#cbd5e1;border:1px solid #334155}
  .gfs-btn-sec:hover{background:#334155;color:#e2e8f0;border-color:#475569}
  .gfs-btn-danger{background:rgba(69,10,10,.6);color:#fca5a5;border:1px solid #7f1d1d}
  .gfs-btn-danger:hover{background:#7f1d1d}
  .gfs-btn-sm{padding:8px 12px;font-size:11.5px}
  .gfs-row-2{display:grid;grid-template-columns:1fr 1fr;gap:9px}

  .gfs-progress{height:5px;background:#1e293b;border-radius:3px;overflow:hidden;margin-top:10px;display:none}
  .gfs-progress.active{display:block}
  .gfs-progress-fill{height:100%;background:linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7);transition:width .3s ease;width:0%;border-radius:3px}

  .gfs-score{margin-top:14px;padding:16px;background:linear-gradient(135deg,rgba(30,41,59,.9),rgba(51,65,85,.9));border-radius:12px;border-left:4px solid #6366f1;display:none;box-shadow:0 4px 20px rgba(0,0,0,.3)}
  .gfs-score.active{display:block;animation:gfsIn .35s}
  .gfs-score-h{font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.7px;margin-bottom:8px;font-weight:700}
  .gfs-score-v{font-size:34px;font-weight:900;line-height:1;background:linear-gradient(135deg,#22c55e,#4ade80,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:-1px}
  .gfs-score-d{font-size:11px;color:#94a3b8;margin-top:8px;line-height:1.5}

  .gfs-log{background:#020617;border:1px solid #1e293b;border-radius:10px;padding:12px;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:10.5px;height:220px;overflow-y:auto;color:#94a3b8;line-height:1.65}
  .gfs-log div{margin-bottom:2px;word-break:break-word}
  .gfs-log .ok{color:#4ade80}
  .gfs-log .err{color:#f87171}
  .gfs-log .info{color:#60a5fa}
  .gfs-log .warn{color:#fbbf24}
  .gfs-log::-webkit-scrollbar{width:5px}
  .gfs-log::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}

  .gfs-footer{padding:10px 16px;background:#0a0f1c;border-top:1px solid #1e293b;font-size:10.5px;color:#64748b;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
  .gfs-badge{padding:3px 8px;background:#1e293b;border-radius:6px;font-family:monospace;font-size:10px;color:#a5b4fc;font-weight:600}
  .gfs-badge.busy{background:#78350f;color:#fbbf24}
  .gfs-badge.error{background:#450a0a;color:#fca5a5}
  .gfs-badge.done{background:#14532d;color:#86efac}

  .gfs-tip{font-size:10px;color:#64748b;margin-top:6px;line-height:1.5;padding:8px 10px;background:rgba(99,102,241,.08);border-left:2px solid #6366f1;border-radius:0 6px 6px 0}
  .gfs-tip b{color:#a5b4fc}
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  const panel = document.createElement('div');
  panel.id = 'gfs-panel';
  panel.innerHTML = `
    <div class="gfs-hdr" id="gfs-hdr">
      <div class="gfs-hdr-title">
        <div class="gfs-logo">⚡</div>
        <span>GFS AI Solver</span>
        <span class="gfs-status" id="gfs-status"></span>
      </div>
      <div class="gfs-hdr-btns">
        <button id="gfs-min" title="Minimize">−</button>
        <button id="gfs-close" title="Close">×</button>
      </div>
    </div>
    <div class="gfs-tabs">
      <button class="gfs-tab active" data-tab="solve">Solve</button>
      <button class="gfs-tab" data-tab="settings">Settings</button>
      <button class="gfs-tab" data-tab="log">Log</button>
    </div>
    <div class="gfs-body" id="gfs-body">
      <div class="gfs-tab-panel active" data-panel="solve">
        <div class="gfs-tip" id="gfs-tip">Provider: <b>Groq</b> · Model: <b>openai/gpt-oss-120b</b> · Key: <b>auto-loaded</b></div>
        <div class="gfs-row" style="margin-top:12px">
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
        </div>
      </div>
      <div class="gfs-tab-panel" data-panel="settings">
        <div class="gfs-row">
          <label class="gfs-lbl">Provider</label>
          <select class="gfs-select" id="gfs-provider">
            <option value="groq">Groq (recommended)</option>
            <option value="openrouter">OpenRouter (free models)</option>
            <option value="openai">OpenAI</option>
            <option value="xrina">Xrina (no key)</option>
          </select>
        </div>
        <div class="gfs-row" id="gfs-proxy-row" style="display:none">
          <label class="gfs-lbl">CORS Proxy</label>
          <select class="gfs-select" id="gfs-proxy">
            <option value="allorigins">AllOrigins</option>
            <option value="codetabs">CodeTabs</option>
            <option value="none">None</option>
          </select>
        </div>
        <div class="gfs-row">
          <label class="gfs-lbl">Model</label>
          <select class="gfs-select" id="gfs-model"></select>
        </div>
        <div class="gfs-row" id="gfs-key-row">
          <label class="gfs-lbl">API Key <span class="gfs-hint" id="gfs-key-hint">auto</span></label>
          <div class="gfs-input-wrap">
            <input class="gfs-input" id="gfs-key" type="password" placeholder="Paste API key" autocomplete="off">
            <button class="gfs-eye" id="gfs-eye" type="button">👁</button>
          </div>
        </div>
        <div class="gfs-row-2">
          <button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-save">💾 SAVE</button>
          <button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-load">📁 LOAD</button>
        </div>
      </div>
      <div class="gfs-tab-panel" data-panel="log">
        <div class="gfs-row-2">
          <button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-export">📋 EXPORT</button>
          <button class="gfs-btn gfs-btn-danger gfs-btn-sm" id="gfs-clearlog">🗑 CLEAR</button>
        </div>
        <div class="gfs-log" id="gfs-log"><div>Ready. Groq auto-loaded.</div></div>
      </div>
    </div>
    <div class="gfs-footer">
      <span>GFS PRO v3</span>
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

  const log = (msg, cls = 'info') => {
    const el = $('gfs-log');
    const d = document.createElement('div');
    d.className = cls;
    d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
    el.appendChild(d);
    el.scrollTop = el.scrollHeight;
    while (el.children.length > 300) el.removeChild(el.firstChild);
  };

  const setStatus = (txt) => {
    const b = $('gfs-footer-stat');
    b.textContent = txt;
    b.className = 'gfs-badge';
    if (txt === 'running') b.classList.add('busy');
    else if (txt === 'error') b.classList.add('error');
    else if (txt === 'done') b.classList.add('done');
  };

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
    if (HARDCODED_KEYS[p]) {
      $('gfs-key').value = HARDCODED_KEYS[p];
      $('gfs-key-row').style.display = 'block';
      $('gfs-key-hint').textContent = 'auto';
    } else if (p === 'xrina') {
      $('gfs-key').value = '';
      $('gfs-key-row').style.display = 'none';
    } else {
      $('gfs-key').value = '';
      $('gfs-key-row').style.display = 'block';
      $('gfs-key-hint').textContent = 'manual';
    }
    $('gfs-proxy-row').style.display = (p === 'xrina') ? 'block' : 'none';
    $('gfs-tip').innerHTML = 'Provider: <b>' + p + '</b> · Model: <b>' + sel.value + '</b>';
  };
  $('gfs-provider').onchange = updateModels;
  $('gfs-model').onchange = () => {
    $('gfs-tip').innerHTML = 'Provider: <b>' + $('gfs-provider').value + '</b> · Model: <b>' + $('gfs-model').value + '</b>';
  };

  $('gfs-save').onclick = () => {
    localStorage.setItem('gfs_config', JSON.stringify({ provider: $('gfs-provider').value, model: $('gfs-model').value, key: $('gfs-key').value, proxy: $('gfs-proxy').value }));
    log('Config saved.', 'ok');
  };
  $('gfs-load').onclick = () => {
    try {
      const c = JSON.parse(localStorage.getItem('gfs_config') || '{}');
      if (c.provider) { $('gfs-provider').value = c.provider; updateModels(); }
      if (c.model) $('gfs-model').value = c.model;
      if (c.key && !HARDCODED_KEYS[$('gfs-provider').value]) $('gfs-key').value = c.key;
      if (c.proxy) $('gfs-proxy').value = c.proxy;
      log('Config loaded.', 'ok');
    } catch (e) { log('Load gagal', 'err'); }
  };

  $('gfs-export').onclick = () => {
    const txt = [...$('gfs-log').children].map((c) => c.textContent).join('\n');
    const blob = new Blob([txt], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gfs-log.txt';
    a.click();
  };
  $('gfs-clearlog').onclick = () => { $('gfs-log').innerHTML = ''; };

  $('gfs-min').onclick = () => {
    const b = $('gfs-body'), t = panel.querySelector('.gfs-tabs'), f = panel.querySelector('.gfs-footer');
    const h = b.style.display === 'none';
    b.style.display = h ? '' : 'none';
    t.style.display = h ? '' : 'none';
    f.style.display = h ? '' : 'none';
    $('gfs-min').textContent = h ? '−' : '+';
  };
  $('gfs-close').onclick = () => { panel.remove(); window.__GFS_LOADED__ = false; };

  const hdr = $('gfs-hdr');
  let drag = false, ox = 0, oy = 0;
  const startDrag = (x, y) => { const r = panel.getBoundingClientRect(); drag = true; ox = x - r.left; oy = y - r.top; panel.style.transform = 'none'; panel.style.left = r.left + 'px'; panel.style.top = r.top + 'px'; };
  const moveDrag = (x, y) => { if (!drag) return; const r = panel.getBoundingClientRect(); panel.style.left = Math.max(0, Math.min(window.innerWidth - r.width, x - ox)) + 'px'; panel.style.top = Math.max(0, Math.min(window.innerHeight - 60, y - oy)) + 'px'; };
  hdr.onmousedown = (e) => { if (e.target.closest('button')) return; startDrag(e.clientX, e.clientY); };
  hdr.ontouchstart = (e) => { if (e.target.closest('button')) return; startDrag(e.touches[0].clientX, e.touches[0].clientY); };
  document.onmousemove = (e) => moveDrag(e.clientX, e.clientY);
  document.ontouchmove = (e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY);
  document.onmouseup = () => { drag = false; };
  document.ontouchend = () => { drag = false; };

  const parseQuestions = () => {
    const groups = document.querySelectorAll('div[role="radiogroup"]');
    const questions = [];
    groups.forEach((g, i) => {
      let qText = '';
      let el = g;
      for (let j = 0; j < 8; j++) {
        el = el.parentElement;
        if (!el) break;
        const h = el.querySelector('[role="heading"]') || el.querySelector('.M7eMe');
        if (h && h.innerText && h.innerText.trim()) { qText = h.innerText.trim(); break; }
      }
      const opts = [...g.querySelectorAll('div[role="radio"]')].map((o) => ({ text: (o.innerText || '').trim(), el: o }));
      if (opts.length) questions.push({ idx: i, qText, opts, group: g });
    });
    return questions;
  };

  $('gfs-parse').onclick = () => {
    const q = parseQuestions();
    log('Ditemukan ' + q.length + ' soal.', 'ok');
    q.slice(0, 5).forEach((item, i) => log('Q' + (i + 1) + ': ' + (item.qText || '').slice(0, 70), 'info'));
  };
  $('gfs-clear').onclick = () => {
    let c = 0;
    document.querySelectorAll('div[role="radio"][aria-checked="true"]').forEach((el) => { el.click(); c++; });
    log('Cleared ' + c + ' jawaban.', 'warn');
  };

  const callGroq = async (key, model, prompt) => {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: 'Answer MCQ. Output JSON object with "answers" array.' }, { role: 'user', content: prompt }], response_format: { type: 'json_object' }, temperature: 0.2 })
    });
    if (!res.ok) throw new Error('Groq ' + res.status + ': ' + (await res.text()).slice(0, 150));
    const data = await res.json();
    return data.choices[0].message.content;
  };
  const callOpenRouter = async (key, model, prompt) => {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: 'Answer MCQ. Output JSON object with "answers" array.' }, { role: 'user', content: prompt }], temperature: 0.2 })
    });
    if (!res.ok) throw new Error('OpenRouter ' + res.status + ': ' + (await res.text()).slice(0, 150));
    const data = await res.json();
    return data.choices[0].message.content;
  };
  const callOpenAI = async (key, model, prompt) => {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: 'Answer MCQ. Output JSON object with "answers" array.' }, { role: 'user', content: prompt }], response_format: { type: 'json_object' } })
    });
    if (!res.ok) throw new Error('OpenAI ' + res.status + ': ' + (await res.text()).slice(0, 150));
    const data = await res.json();
    return data.choices[0].message.content;
  };
  const callXrina = async (key, model, prompt) => {
    const raw = 'https://apiii-xrina.my.id/ai/gemini?text=' + encodeURIComponent(prompt);
    const proxyKey = $('gfs-proxy').value;
    const url = (PROXIES[proxyKey] || PROXIES.allorigins)(raw);
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error('Xrina ' + res.status);
    const body = await res.text();
    let data;
    try { data = JSON.parse(body); } catch { throw new Error('Xrina non-JSON'); }
    if (!data.status) throw new Error('Xrina false');
    return data.data.response;
  };

  const parseResponse = (raw) => {
    let data;
    try { data = JSON.parse(raw); }
    catch {
      const arr = raw.match(/\[[\s\S]*\]/);
      const obj = raw.match(/\{[\s\S]*\}/);
      if (arr) data = JSON.parse(arr[0]);
      else if (obj) data = JSON.parse(obj[0]);
      else throw new Error('Response bukan JSON');
    }
    const list = Array.isArray(data) ? data : (data.answers || []);
    if (!Array.isArray(list)) throw new Error('Format salah');
    return list.filter(x => x && (Number.isInteger(x.idx) || Number.isInteger(x.i)) && typeof (x.answer || x.a) === 'string')
      .map(x => ({ idx: Number.isInteger(x.idx) ? x.idx : x.i, answer: x.answer || x.a, confidence: Math.min(1, Math.max(0, Number(x.confidence) || 0.8)) }));
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  $('gfs-solve').onclick = async () => {
    if (state.running) return;
    const key = $('gfs-key').value.trim();
    const provider = $('gfs-provider').value;
    const model = $('gfs-model').value;
    if (provider !== 'xrina' && !key) return log('API key kosong.', 'err');

    const questions = parseQuestions();
    if (!questions.length) return log('Nggak ada soal.', 'err');

    state.running = true;
    setStatus('running');
    $('gfs-status').classList.add('busy');
    const btn = $('gfs-solve');
    btn.disabled = true;
    btn.textContent = '⏳ PROCESSING...';
    $('gfs-progress').classList.add('active');
    log('Parse ' + questions.length + ' soal → ' + provider + ' (' + model + ')', 'info');

    const prompt = 'Jawab soal pilihan ganda berikut. Balas HANYA JSON object:\n{"answers":[{"idx":0,"answer":"<teks opsi PERSIS>","confidence":0.9}]}\n\n' +
      questions.map((q, i) => '[' + i + '] ' + q.qText + '\n' + q.opts.map(o => '- ' + o.text).join('\n')).join('\n\n');

    try {
      let raw;
      if (provider === 'groq') raw = await callGroq(key, model, prompt);
      else if (provider === 'openrouter') raw = await callOpenRouter(key, model, prompt);
      else if (provider === 'openai') raw = await callOpenAI(key, model, prompt);
      else raw = await callXrina(key, model, prompt);
      log('AI response OK.', 'ok');

      const answers = parseResponse(raw);
      log('AI kasih ' + answers.length + ' jawaban.', 'ok');

      let clicked = 0, totalConf = 0;
      for (let i = 0; i < answers.length; i++) {
        const a = answers[i];
        $('gfs-progress-fill').style.width = Math.round(((i + 1) / answers.length) * 100) + '%';
        const q = questions[a.idx];
        if (!q) continue;
        const target = q.opts.find(o => o.text === a.answer) ||
                       q.opts.find(o => o.text.toLowerCase() === a.answer.toLowerCase()) ||
                       q.opts.find(o => o.text.includes(a.answer) || a.answer.includes(o.text));
        if (target) {
          target.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await sleep(100);
          target.el.click();
          clicked++;
          totalConf += a.confidence;
          log('Q' + a.idx + ' ✓', 'ok');
        } else {
          log('Q' + a.idx + ' ✗ no match', 'err');
        }
        await sleep(180);
      }

      const avg = clicked > 0 ? totalConf / clicked : 0;
      const pct = Math.round(avg * 100);
      const grade = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'E';
      $('gfs-score').classList.add('active');
      $('gfs-score-v').textContent = pct + '% · ' + grade;
      $('gfs-score-d').textContent = 'Terisi: ' + clicked + '/' + questions.length + ' soal';
      setStatus('done');
      log('SELESAI: ' + clicked + '/' + questions.length, 'ok');
    } catch (e) {
      log('ERROR: ' + e.message, 'err');
      setStatus('error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'NYELESAIN SOAL';
      state.running = false;
      $('gfs-status').classList.remove('busy');
      setTimeout(() => $('gfs-progress').classList.remove('active'), 1200);
    }
  };

  $('gfs-provider').value = 'groq';
  updateModels();
  log('GFS v3 aktif. Groq auto-loaded.', 'ok');
})();
