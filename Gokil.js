/* GFS AI Solver PRO v7 — OpenRouter verified models */
(function () {
  if (window.__GFS_LOADED__) { document.getElementById('gfs-panel')?.remove(); document.getElementById('gfs-stealth-btn')?.remove(); window.__GFS_LOADED__ = false; return; }
  window.__GFS_LOADED__ = true;

  const HARDCODED_KEYS = {
    openrouter: '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',
    groq: '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'
  };
  const state = { running: false, stealth: false };

  const PROXIES = {
    allorigins: (u) => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u),
    codetabs: (u) => 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(u),
    none: (u) => u
  };
  const MODELS = {
    openrouter: [
      'nvidia/nemotron-3-ultra-550b-a55b:free',
      'nvidia/nemotron-3-super-120b-a12b:free',
      'nvidia/nemotron-3.5-lightning:free',
      'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
      'apodex/apodex-1.1-mini:free',
      'openai/gpt-4o-mini',
      'openai/gpt-4o'
    ],
    groq: ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b', 'allam-2-7b'],
    openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'],
    xrina: ['Gemini AI']
  };

  const CSS = `#gfs-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:420px;max-width:94vw;background:linear-gradient(180deg,#0b1220 0%,#0f172a 100%);color:#e2e8f0;border:1px solid #1e293b;border-radius:16px;box-shadow:0 30px 80px rgba(0,0,0,.85);z-index:2147483647;font-family:-apple-system,sans-serif;font-size:13px;display:flex;flex-direction:column;max-height:90vh;overflow:hidden;animation:gfsIn .3s cubic-bezier(.4,0,.2,1)}@keyframes gfsIn{from{opacity:0;transform:translate(-50%,-50%) scale(.92)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}@keyframes gfsPulse{0%,100%{opacity:1}50%{opacity:.4}}@keyframes gfsSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes gfsFade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}#gfs-panel *{box-sizing:border-box}#gfs-panel::-webkit-scrollbar{width:6px}#gfs-panel::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}.gfs-hdr{padding:14px 16px;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%);cursor:move;display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:15px;color:#fff;flex-shrink:0}.gfs-hdr-title{display:flex;align-items:center;gap:10px;pointer-events:none}.gfs-logo{width:26px;height:26px;background:rgba(255,255,255,.25);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px}.gfs-status{width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 10px #4ade80;animation:gfsPulse 2s infinite}.gfs-status.busy{background:#facc15;animation:gfsSpin 1s linear infinite}.gfs-hdr-btns{display:flex;gap:6px}.gfs-hdr button{background:rgba(255,255,255,.2);border:none;color:#fff;width:26px;height:26px;border-radius:8px;cursor:pointer;font-size:15px;line-height:1;display:flex;align-items:center;justify-content:center;font-weight:600}.gfs-tabs{display:flex;background:#0b1220;border-bottom:1px solid #1e293b;padding:4px 6px 0;flex-shrink:0}.gfs-tab{flex:1;padding:10px 6px;background:none;border:none;color:#64748b;font-size:10.5px;font-weight:700;cursor:pointer;font-family:inherit;border-bottom:2px solid transparent;text-transform:uppercase;transition:all .15s;border-radius:6px 6px 0 0}.gfs-tab.active{color:#a5b4fc;border-bottom-color:#6366f1;background:rgba(99,102,241,.08)}.gfs-body{padding:16px;overflow-y:auto;flex:1;min-height:0}.gfs-tab-panel{display:none;animation:gfsFade .25s}.gfs-tab-panel.active{display:block}.gfs-row{margin-bottom:12px}.gfs-lbl{display:block;font-size:10px;color:#94a3b8;margin-bottom:6px;text-transform:uppercase;font-weight:700;letter-spacing:.6px}.gfs-hint{font-size:9.5px;color:#475569;text-transform:none;float:right}.gfs-input,.gfs-select{width:100%;padding:10px 12px;background:#0b1220;border:1px solid #334155;border-radius:9px;color:#e2e8f0;font-size:12.5px;font-family:inherit;outline:none}.gfs-input:focus,.gfs-select:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.18)}.gfs-input-wrap{position:relative}.gfs-input-wrap .gfs-input{padding-right:44px}.gfs-eye{position:absolute;right:4px;top:50%;transform:translateY(-50%);background:none;border:none;color:#64748b;cursor:pointer;padding:6px 10px;font-size:14px;border-radius:6px}.gfs-btn{width:100%;padding:12px;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px}.gfs-btn-main{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;box-shadow:0 6px 20px rgba(99,102,241,.4)}.gfs-btn-main:disabled{opacity:.5;cursor:not-allowed}.gfs-btn-sec{background:#1e293b;color:#cbd5e1;border:1px solid #334155}.gfs-btn-danger{background:rgba(69,10,10,.6);color:#fca5a5;border:1px solid #7f1d1d}.gfs-btn-stealth{background:linear-gradient(135deg,#0f172a,#1e293b);color:#94a3b8;border:1px solid #334155}.gfs-btn-sm{padding:8px 12px;font-size:11.5px}.gfs-row-2{display:grid;grid-template-columns:1fr 1fr;gap:9px}.gfs-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}.gfs-progress{height:5px;background:#1e293b;border-radius:3px;overflow:hidden;margin-top:10px;display:none}.gfs-progress.active{display:block}.gfs-progress-fill{height:100%;background:linear-gradient(90deg,#6366f1,#8b5cf6);transition:width .3s;width:0%}.gfs-score{margin-top:14px;padding:16px;background:linear-gradient(135deg,rgba(30,41,59,.9),rgba(51,65,85,.9));border-radius:12px;border-left:4px solid #6366f1;display:none}.gfs-score.active{display:block}.gfs-score-h{font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.7px;margin-bottom:8px;font-weight:700}.gfs-score-v{font-size:34px;font-weight:900;line-height:1;background:linear-gradient(135deg,#22c55e,#4ade80,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.gfs-score-d{font-size:11px;color:#94a3b8;margin-top:8px}.gfs-log{background:#020617;border:1px solid #1e293b;border-radius:10px;padding:12px;font-family:monospace;font-size:10.5px;height:220px;overflow-y:auto;color:#94a3b8;line-height:1.65}.gfs-log div{margin-bottom:2px;word-break:break-word}.gfs-log .ok{color:#4ade80}.gfs-log .err{color:#f87171}.gfs-log .info{color:#60a5fa}.gfs-log .warn{color:#fbbf24}.gfs-footer{padding:10px 16px;background:#0a0f1c;border-top:1px solid #1e293b;font-size:10.5px;color:#64748b;display:flex;justify-content:space-between;flex-shrink:0}.gfs-badge{padding:3px 8px;background:#1e293b;border-radius:6px;font-family:monospace;font-size:10px;color:#a5b4fc;font-weight:600}.gfs-badge.busy{background:#78350f;color:#fbbf24}.gfs-badge.error{background:#450a0a;color:#fca5a5}.gfs-badge.done{background:#14532d;color:#86efac}.gfs-tip{font-size:10.5px;color:#94a3b8;margin-bottom:12px;padding:10px 12px;background:rgba(99,102,241,.08);border-left:2px solid #6366f1;border-radius:0 6px 6px 0}.gfs-tip b{color:#a5b4fc}.gfs-expl-list{max-height:340px;overflow-y:auto;background:#020617;border:1px solid #1e293b;border-radius:10px;padding:10px}.gfs-expl-item{padding:10px;margin-bottom:8px;background:rgba(30,41,59,.5);border-radius:8px;border-left:3px solid #6366f1}.gfs-expl-num{font-size:10px;color:#64748b;font-weight:700;margin-bottom:4px;text-transform:uppercase}.gfs-expl-ans{font-size:11.5px;color:#86efac;font-weight:600;margin-bottom:4px}.gfs-expl-reason{font-size:10.5px;color:#94a3b8;line-height:1.55}.gfs-expl-conf{font-size:9.5px;color:#64748b;margin-top:4px}.gfs-toggle{position:relative;display:inline-block;width:36px;height:20px}.gfs-toggle input{opacity:0;width:0;height:0}.gfs-slider{position:absolute;cursor:pointer;inset:0;background:#334155;transition:.3s;border-radius:20px}.gfs-slider:before{position:absolute;content:"";height:14px;width:14px;left:3px;bottom:3px;background:#fff;transition:.3s;border-radius:50%}input:checked + .gfs-slider{background:#6366f1}input:checked + .gfs-slider:before{transform:translateX(16px)}#gfs-stealth-btn{position:fixed;right:20px;bottom:20px;width:52px;height:52px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:none;align-items:center;justify-content:center;color:#fff;font-size:22px;cursor:pointer;box-shadow:0 8px 24px rgba(99,102,241,.5);z-index:2147483646;font-weight:700}#gfs-stealth-btn.active{display:flex}.gfs-switch-row{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#0b1220;border:1px solid #334155;border-radius:9px;margin-bottom:8px}.gfs-switch-lbl{font-size:11.5px;color:#cbd5e1;font-weight:600}.gfs-switch-desc{font-size:9.5px;color:#64748b;margin-top:2px}`;

  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  const stealthBtn = document.createElement('div');
  stealthBtn.id = 'gfs-stealth-btn';
  stealthBtn.innerHTML = '⚡';
  stealthBtn.onclick = () => { state.stealth = false; panel.style.display = 'flex'; stealthBtn.classList.remove('active'); };
  document.body.appendChild(stealthBtn);

  const panel = document.createElement('div');
  panel.id = 'gfs-panel';
  panel.innerHTML = `
    <div class="gfs-hdr" id="gfs-hdr">
      <div class="gfs-hdr-title"><div class="gfs-logo">⚡</div><span>GFS AI Solver v7</span><span class="gfs-status" id="gfs-status"></span></div>
      <div class="gfs-hdr-btns"><button id="gfs-min">−</button><button id="gfs-stealth">👻</button><button id="gfs-close">×</button></div>
    </div>
    <div class="gfs-tabs">
      <button class="gfs-tab active" data-tab="solve">Solve</button>
      <button class="gfs-tab" data-tab="explain">Explain</button>
      <button class="gfs-tab" data-tab="settings">Settings</button>
      <button class="gfs-tab" data-tab="log">Log</button>
    </div>
    <div class="gfs-body" id="gfs-body">
      <div class="gfs-tab-panel active" data-panel="solve">
        <div class="gfs-tip" id="gfs-tip">OpenRouter · nemotron-3-ultra-550b</div>
        <div class="gfs-row" style="margin-top:12px"><button class="gfs-btn gfs-btn-main" id="gfs-solve">NYELESAIN SOAL</button></div>
        <div class="gfs-progress" id="gfs-progress"><div class="gfs-progress-fill" id="gfs-progress-fill"></div></div>
        <div class="gfs-row-3" style="margin-top:12px">
          <button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-parse">CEK</button>
          <button class="gfs-btn gfs-btn-stealth gfs-btn-sm" id="gfs-expl-toggle">EXPLAIN</button>
          <button class="gfs-btn gfs-btn-danger gfs-btn-sm" id="gfs-clear">CLEAR</button>
        </div>
        <div class="gfs-score" id="gfs-score"><div class="gfs-score-h">Prediksi Nilai</div><div class="gfs-score-v" id="gfs-score-v">-</div><div class="gfs-score-d" id="gfs-score-d"></div></div>
      </div>
      <div class="gfs-tab-panel" data-panel="explain">
        <div class="gfs-expl-list" id="gfs-expl-list"><div style="color:#64748b;font-size:11px;text-align:center;padding:20px">Belum ada penjelasan.</div></div>
      </div>
      <div class="gfs-tab-panel" data-panel="settings">
        <div class="gfs-row"><label class="gfs-lbl">Provider</label><select class="gfs-select" id="gfs-provider"><option value="openrouter">OpenRouter</option><option value="groq">Groq</option><option value="openai">OpenAI</option><option value="xrina">Xrina (no key)</option></select></div>
        <div class="gfs-row" id="gfs-proxy-row" style="display:none"><label class="gfs-lbl">CORS Proxy</label><select class="gfs-select" id="gfs-proxy"><option value="allorigins">AllOrigins</option><option value="codetabs">CodeTabs</option><option value="none">None</option></select></div>
        <div class="gfs-row"><label class="gfs-lbl">Model</label><select class="gfs-select" id="gfs-model"></select></div>
        <div class="gfs-row" id="gfs-key-row"><label class="gfs-lbl">API Key <span class="gfs-hint" id="gfs-key-hint">auto</span></label><div class="gfs-input-wrap"><input class="gfs-input" id="gfs-key" type="password" autocomplete="off"><button class="gfs-eye" id="gfs-eye">👁</button></div></div>
        <div class="gfs-row">
          <div class="gfs-switch-row"><div><div class="gfs-switch-lbl">Auto-Scroll</div><div class="gfs-switch-desc">Scroll ke soal</div></div><label class="gfs-toggle"><input type="checkbox" id="gfs-opt-scroll" checked><span class="gfs-slider"></span></label></div>
          <div class="gfs-switch-row"><div><div class="gfs-switch-lbl">Auto-Explanation</div><div class="gfs-switch-desc">AI jelasin jawaban</div></div><label class="gfs-toggle"><input type="checkbox" id="gfs-opt-explain" checked><span class="gfs-slider"></span></label></div>
          <div class="gfs-switch-row"><div><div class="gfs-switch-lbl">Auto-Submit</div><div class="gfs-switch-desc">Kirim otomatis</div></div><label class="gfs-toggle"><input type="checkbox" id="gfs-opt-submit"><span class="gfs-slider"></span></label></div>
          <div class="gfs-switch-row"><div><div class="gfs-switch-lbl">Hide Panel</div><div class="gfs-switch-desc">Auto stealth</div></div><label class="gfs-toggle"><input type="checkbox" id="gfs-opt-autostealth"><span class="gfs-slider"></span></label></div>
        </div>
        <div class="gfs-row-2"><button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-save">💾 SAVE</button><button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-load">📁 LOAD</button></div>
      </div>
      <div class="gfs-tab-panel" data-panel="log">
        <div class="gfs-row-2"><button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-export">📋 EXPORT</button><button class="gfs-btn gfs-btn-danger gfs-btn-sm" id="gfs-clearlog">🗑 CLEAR</button></div>
        <div class="gfs-log" id="gfs-log"><div>Ready. v7 OpenRouter loaded.</div></div>
      </div>
    </div>
    <div class="gfs-footer"><span>GFS PRO v7</span><span class="gfs-badge" id="gfs-footer-stat">idle</span></div>`;
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
  const setStatus = (txt) => { const b = $('gfs-footer-stat'); b.textContent = txt; b.className = 'gfs-badge'; if (txt === 'running') b.classList.add('busy'); else if (txt === 'error') b.classList.add('error'); else if (txt === 'done') b.classList.add('done'); };

  const enterStealth = () => { state.stealth = true; panel.style.display = 'none'; stealthBtn.classList.add('active'); };
  $('gfs-stealth').onclick = enterStealth;
  $('gfs-close').onclick = () => { panel.remove(); stealthBtn.remove(); window.__GFS_LOADED__ = false; };
  $('gfs-eye').onclick = () => { const i = $('gfs-key'); i.type = i.type === 'password' ? 'text' : 'password'; };

  const updateModels = () => {
    const p = $('gfs-provider').value;
    const sel = $('gfs-model'); sel.innerHTML = '';
    (MODELS[p] || []).forEach((m) => {
      const o = document.createElement('option');
      o.value = m; o.textContent = m;
      sel.appendChild(o);
    });
    if (HARDCODED_KEYS[p]) { $('gfs-key').value = HARDCODED_KEYS[p]; $('gfs-key-row').style.display = 'block'; $('gfs-key-hint').textContent = 'auto'; }
    else if (p === 'xrina') { $('gfs-key').value = ''; $('gfs-key-row').style.display = 'none'; }
    else { $('gfs-key').value = ''; $('gfs-key-row').style.display = 'block'; $('gfs-key-hint').textContent = 'manual'; }
    $('gfs-proxy-row').style.display = (p === 'xrina') ? 'block' : 'none';
    $('gfs-tip').textContent = p + ' · ' + sel.value;
  };
  $('gfs-provider').onchange = updateModels;
  $('gfs-model').onchange = () => { $('gfs-tip').textContent = $('gfs-provider').value + ' · ' + $('gfs-model').value; };

  $('gfs-save').onclick = () => { localStorage.setItem('gfs_config', JSON.stringify({ provider: $('gfs-provider').value, model: $('gfs-model').value, key: $('gfs-key').value, proxy: $('gfs-proxy').value, oS: $('gfs-opt-scroll').checked, oE: $('gfs-opt-explain').checked, oSub: $('gfs-opt-submit').checked, oAS: $('gfs-opt-autostealth').checked })); log('Saved.', 'ok'); };
  $('gfs-load').onclick = () => { try { const c = JSON.parse(localStorage.getItem('gfs_config') || '{}'); if (c.provider) { $('gfs-provider').value = c.provider; updateModels(); } if (c.model) $('gfs-model').value = c.model; if (c.key && !HARDCODED_KEYS[$('gfs-provider').value]) $('gfs-key').value = c.key; if (c.proxy) $('gfs-proxy').value = c.proxy; if (c.oS !== undefined) $('gfs-opt-scroll').checked = c.oS; if (c.oE !== undefined) $('gfs-opt-explain').checked = c.oE; if (c.oSub !== undefined) $('gfs-opt-submit').checked = c.oSub; if (c.oAS !== undefined) $('gfs-opt-autostealth').checked = c.oAS; log('Loaded.', 'ok'); } catch (e) { log('Load gagal', 'err'); } };

  $('gfs-export').onclick = () => { const txt = [...$('gfs-log').children].map((c) => c.textContent).join('\n'); const blob = new Blob([txt], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'gfs-log.txt'; a.click(); };
  $('gfs-clearlog').onclick = () => { $('gfs-log').innerHTML = ''; };
  $('gfs-min').onclick = () => { const b = $('gfs-body'), t = panel.querySelector('.gfs-tabs'), f = panel.querySelector('.gfs-footer'); const h = b.style.display === 'none'; b.style.display = h ? '' : 'none'; t.style.display = h ? '' : 'none'; f.style.display = h ? '' : 'none'; $('gfs-min').textContent = h ? '−' : '+'; };

  const hdr = $('gfs-hdr');
  let drag = false, ox = 0, oy = 0;
  const sD = (x, y) => { const r = panel.getBoundingClientRect(); drag = true; ox = x - r.left; oy = y - r.top; panel.style.transform = 'none'; panel.style.left = r.left + 'px'; panel.style.top = r.top + 'px'; };
  const mD = (x, y) => { if (!drag) return; const r = panel.getBoundingClientRect(); panel.style.left = Math.max(0, Math.min(window.innerWidth - r.width, x - ox)) + 'px'; panel.style.top = Math.max(0, Math.min(window.innerHeight - 60, y - oy)) + 'px'; };
  hdr.onmousedown = (e) => { if (e.target.closest('button')) return; sD(e.clientX, e.clientY); };
  hdr.ontouchstart = (e) => { if (e.target.closest('button')) return; sD(e.touches[0].clientX, e.touches[0].clientY); };
  document.onmousemove = (e) => mD(e.clientX, e.clientY);
  document.ontouchmove = (e) => mD(e.touches[0].clientX, e.touches[0].clientY);
  document.onmouseup = () => { drag = false; };
  document.ontouchend = () => { drag = false; };

  const parseQuestions = () => {
    const groups = document.querySelectorAll('div[role="radiogroup"]');
    const questions = [];
    groups.forEach((g, i) => {
      let qText = '';
      let el = g;
      for (let j = 0; j < 10; j++) {
        el = el.parentElement;
        if (!el) break;
        const h = el.querySelector('[role="heading"]') || el.querySelector('.M7eMe') || el.querySelector('.Qr7Oae');
        if (h && h.innerText && h.innerText.trim()) { qText = h.innerText.trim(); break; }
      }
      const opts = [...g.querySelectorAll('div[role="radio"]')].map((o) => ({ text: (o.innerText || '').trim(), el: o }));
      if (opts.length) questions.push({ idx: i, qText, opts, group: g });
    });
    return questions;
  };

  $('gfs-parse').onclick = () => { const q = parseQuestions(); log('Ditemukan ' + q.length + ' soal.', 'ok'); q.slice(0, 5).forEach((item, i) => log('Q' + (i + 1) + ': ' + (item.qText || '').slice(0, 70), 'info')); };
  $('gfs-clear').onclick = () => { let c = 0; document.querySelectorAll('div[role="radio"][aria-checked="true"]').forEach((el) => { el.click(); c++; }); log('Cleared ' + c + '.', 'warn'); };
  $('gfs-expl-toggle').onclick = () => { document.querySelectorAll('.gfs-tab').forEach((t) => t.classList.remove('active')); document.querySelectorAll('.gfs-tab-panel').forEach((p) => p.classList.remove('active')); document.querySelector('.gfs-tab[data-tab="explain"]').classList.add('active'); document.querySelector('.gfs-tab-panel[data-panel="explain"]').classList.add('active'); };

  const callOpenRouter = async (key, model, prompt) => {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key, 'HTTP-Referer': location.origin, 'X-Title': 'GFS Solver' },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: 'You are an expert exam assistant. Answer MCQ with high accuracy. Output JSON object with "answers" array.' }, { role: 'user', content: prompt }], temperature: 0.1, response_format: { type: 'json_object' } })
    });
    if (!res.ok) throw new Error('OpenRouter ' + res.status + ': ' + (await res.text()).slice(0, 200));
    const data = await res.json();
    if (!data.choices?.[0]?.message?.content) throw new Error('OpenRouter response kosong');
    return data.choices[0].message.content;
  };

  const callGroq = async (key, model, prompt) => {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: 'Answer MCQ. Output JSON object with "answers" array.' }, { role: 'user', content: prompt }], response_format: { type: 'json_object' }, temperature: 0.1 })
    });
    if (!res.ok) throw new Error('Groq ' + res.status);
    const data = await res.json();
    return data.choices[0].message.content;
  };

  const callOpenAI = async (key, model, prompt) => {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: 'Answer MCQ. Output JSON object with "answers" array.' }, { role: 'user', content: prompt }], response_format: { type: 'json_object' } })
    });
    if (!res.ok) throw new Error('OpenAI ' + res.status);
    const data = await res.json();
    return data.choices[0].message.content;
  };

  const callXrina = async (key, model, prompt) => {
    const raw = 'https://apiii-xrina.my.id/ai/gemini?text=' + encodeURIComponent(prompt);
    const p = PROXIES[$('gfs-proxy').value] || PROXIES.allorigins;
    const res = await fetch(p(raw));
    if (!res.ok) throw new Error('Xrina ' + res.status);
    const body = await res.text(); let data;
    try { data = JSON.parse(body); } catch { throw new Error('Xrina non-JSON'); }
    if (!data.status) throw new Error('Xrina false');
    return data.data.response;
  };

  const parseResponse = (raw) => {
    let data;
    try { data = JSON.parse(raw); }
    catch {
      const a = raw.match(/\[[\s\S]*\]/), o = raw.match(/\{[\s\S]*\}/);
      if (a) data = JSON.parse(a[0]);
      else if (o) data = JSON.parse(o[0]);
      else throw new Error('Not JSON');
    }
    const list = Array.isArray(data) ? data : (data.answers || []);
    if (!Array.isArray(list)) throw new Error('Format salah');
    return list.filter(x => x && (Number.isInteger(x.idx) || Number.isInteger(x.i)) && typeof (x.answer || x.a) === 'string')
      .map(x => ({ idx: Number.isInteger(x.idx) ? x.idx : x.i, answer: x.answer || x.a, confidence: Math.min(1, Math.max(0, Number(x.confidence) || 0.8)), reason: x.reason || x.explanation || '' }));
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const normalize = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').replace(/[.,;:!?'"()\-–—]/g, '').trim();

  const findOption = (q, aiAnswer) => {
    const raw = String(aiAnswer || '').trim();
    if (!raw) return { el: null, reason: 'empty' };
    const stripped = raw.replace(/^\s*[A-Za-z0-9][.)\-:]\s*/, '').trim();
    let m = q.opts.find(o => o.text === raw);
    if (m) return { el: m.el, reason: 'exact' };
    if (stripped !== raw) { m = q.opts.find(o => o.text === stripped); if (m) return { el: m.el, reason: 'exact-stripped' }; }
    const nRaw = normalize(raw), nStrip = normalize(stripped);
    m = q.opts.find(o => normalize(o.text) === nRaw);
    if (m) return { el: m.el, reason: 'normalized' };
    if (nStrip !== nRaw) { m = q.opts.find(o => normalize(o.text) === nStrip); if (m) return { el: m.el, reason: 'normalized-stripped' }; }
    const candidates = q.opts.filter(o => { const no = normalize(o.text); return no.length > 0 && nStrip.length >= no.length * 0.6 && (no.includes(nStrip) || nStrip.includes(no)); });
    if (candidates.length === 1) return { el: candidates[0].el, reason: 'contains-unique' };
    if (candidates.length > 1) {
      candidates.sort((a, b) => { const oa = normalize(a.text), ob = normalize(b.text); const sA = oa.includes(nStrip) ? nStrip.length / oa.length : oa.length / nStrip.length; const sB = ob.includes(nStrip) ? nStrip.length / ob.length : ob.length / nStrip.length; return sB - sA; });
      return { el: candidates[0].el, reason: 'contains-best(' + candidates.length + ')' };
    }
    return { el: null, reason: 'no-match' };
  };

  const renderExplanations = (answers, questions, matches) => {
    const list = $('gfs-expl-list'); list.innerHTML = '';
    answers.forEach((a) => {
      const q = questions[a.idx]; if (!q) return;
      const mt = matches[a.idx] || {};
      const item = document.createElement('div');
      item.className = 'gfs-expl-item';
      if (mt.reason === 'no-match') item.style.borderLeftColor = '#ef4444';
      else if (mt.reason && mt.reason.startsWith('contains-best')) item.style.borderLeftColor = '#fbbf24';
      else item.style.borderLeftColor = '#22c55e';
      item.innerHTML = '<div class="gfs-expl-num">Q' + (a.idx + 1) + ' · ' + (mt.reason || '') + '</div>' +
        '<div class="gfs-expl-ans">' + (mt.reason === 'no-match' ? '✗ ' : '✓ ') + a.answer + '</div>' +
        '<div class="gfs-expl-reason">' + (a.reason || q.qText.slice(0, 120) || '-') + '</div>' +
        '<div class="gfs-expl-conf">Confidence: ' + (a.confidence * 100).toFixed(0) + '% · Match: ' + (mt.reason || '?') + '</div>';
      list.appendChild(item);
    });
  };

  const autoSubmit = async () => {
    await sleep(600);
    const btns = document.querySelectorAll('div[role="button"], button');
    for (const b of btns) {
      const t = (b.innerText || '').toLowerCase();
      if (t.includes('kirim') || t.includes('submit') || t.includes('send')) {
        b.scrollIntoView({ behavior: 'smooth', block: 'center' }); await sleep(400); b.click();
        log('Auto-submit dikirim.', 'warn'); return true;
      }
    }
    log('Tombol submit nggak ketemu.', 'warn'); return false;
  };

  $('gfs-solve').onclick = async () => {
    if (state.running) return;
    const key = $('gfs-key').value.trim();
    const provider = $('gfs-provider').value;
    const model = $('gfs-model').value;
    if (provider !== 'xrina' && !key) return log('API key kosong.', 'err');
    const questions = parseQuestions();
    if (!questions.length) return log('Nggak ada soal.', 'err');

    state.running = true; setStatus('running'); $('gfs-status').classList.add('busy');
    const btn = $('gfs-solve'); btn.disabled = true; btn.textContent = '⏳ PROCESSING...';
    $('gfs-progress').classList.add('active');
    log('Parse ' + questions.length + ' soal → ' + provider + '/' + model, 'info');

    const wantExplain = $('gfs-opt-explain').checked;
    const prompt = 'Kamu asisten ujian ahli. Jawab soal pilihan ganda berikut dengan AKURAT.\n' +
      'Balas HANYA JSON object:\n{"answers":[{"idx":0,"answer":"<teks opsi PERSIS>","confidence":0.9' + (wantExplain ? ',"reason":"<alasan 1-2 kalimat>"' : '') + '}]}\n\n' +
      'ATURAN PENTING:\n- "answer" harus SAMA PERSIS dengan salah satu opsi (jangan diubah/disingkat)\n- Jangan tambah prefix A. B. C. D.\n- Kalau ragu, turunin confidence\n\n' +
      'SOAL:\n' + questions.map((q, i) => '[' + i + '] ' + q.qText + '\n' + q.opts.map(o => '- ' + o.text).join('\n')).join('\n\n');

    try {
      let raw;
      if (provider === 'openrouter') raw = await callOpenRouter(key, model, prompt);
      else if (provider === 'groq') raw = await callGroq(key, model, prompt);
      else if (provider === 'openai') raw = await callOpenAI(key, model, prompt);
      else raw = await callXrina(key, model, prompt);
      log('AI response OK (' + raw.length + ' chars).', 'ok');

      const answers = parseResponse(raw);
      log('AI kasih ' + answers.length + ' jawaban.', 'ok');

      let clicked = 0, totalConf = 0, skipped = 0;
      const matches = {};
      for (let i = 0; i < answers.length; i++) {
        const a = answers[i];
        $('gfs-progress-fill').style.width = Math.round(((i + 1) / answers.length) * 100) + '%';
        const q = questions[a.idx]; if (!q) continue;
        const mt = findOption(q, a.answer);
        matches[a.idx] = mt;
        if (mt.el) {
          if ($('gfs-opt-scroll').checked) mt.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await sleep(100); mt.el.click();
          clicked++; totalConf += a.confidence;
          log('Q' + a.idx + ' ✓ ' + a.answer.slice(0, 40) + ' [' + mt.reason + ']', 'ok');
        } else {
          skipped++;
          log('Q' + a.idx + ' ✗ NO MATCH: "' + a.answer.slice(0, 60) + '"', 'err');
        }
        await sleep(180);
      }

      renderExplanations(answers, questions, matches);
      const avg = clicked > 0 ? totalConf / clicked : 0;
      const pct = Math.round(avg * 100);
      const grade = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'E';
      $('gfs-score').classList.add('active');
      $('gfs-score-v').textContent = pct + '% · ' + grade;
      $('gfs-score-d').textContent = 'Terisi: ' + clicked + '/' + questions.length + (skipped ? ' · Skip: ' + skipped : '');
      setStatus('done');
      log('SELESAI: ' + clicked + '/' + questions.length + ' · skip ' + skipped, 'ok');

      if ($('gfs-opt-submit').checked) { log('Auto-submit 2s...', 'warn'); await sleep(2000); await autoSubmit(); }
      if ($('gfs-opt-autostealth').checked) { await sleep(800); enterStealth(); }
    } catch (e) {
      log('ERROR: ' + e.message, 'err'); setStatus('error');
    } finally {
      btn.disabled = false; btn.textContent = 'NYELESAIN SOAL';
      state.running = false; $('gfs-status').classList.remove('busy');
      setTimeout(() => $('gfs-progress').classList.remove('active'), 1200);
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'G') {
      e.preventDefault();
      if (state.stealth) { panel.style.display = 'flex'; stealthBtn.classList.remove('active'); state.stealth = false; }
      else enterStealth();
    }
  });

  $('gfs-provider').value = 'openrouter';
  updateModels();

  try {
    const c = JSON.parse(localStorage.getItem('gfs_config') || '{}');
    if (c.oE !== undefined) $('gfs-opt-explain').checked = c.oE;
    if (c.oSub !== undefined) $('gfs-opt-submit').checked = c.oSub;
    if (c.oAS !== undefined) $('gfs-opt-autostealth').checked = c.oAS;
  } catch (e) {}

  log('GFS v7 aktif. OpenRouter nemotron-3-ultra-550b default.', 'ok');
})();
