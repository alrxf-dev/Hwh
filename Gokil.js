/* GFS AI Solver PRO v9 — by Alip Lab */
(function () {
  if (window.__GFS_LOADED__) { document.getElementById('gfs-panel')?.remove(); document.getElementById('gfs-stealth-btn')?.remove(); window.__GFS_LOADED__ = false; return; }
  window.__GFS_LOADED__ = true;

  const HARDCODED_KEYS = {
    groq: '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',
    openrouter: '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',
    anabot: 'freeApikey'
  };
  const state = { running: false, stealth: false };
  const BATCH_SIZE = { groq: 6, openrouter: 6, openai: 6, andisearch: 1, ayesoul: 1 };

  const MODELS = {
    groq: ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'],
    openrouter: [
      'nvidia/nemotron-3-ultra-550b-a55b:free',
      'nvidia/nemotron-3-super-120b-a12b:free',
      'nvidia/nemotron-3.5-lightning:free'
    ],
    openai: ['gpt-4o-mini', 'gpt-4o'],
    andisearch: ['AndiSearch'],
    ayesoul: ['Ayesoul']
  };

  const CSS = `#gfs-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:420px;max-width:94vw;background:linear-gradient(180deg,#0b1220 0%,#0f172a 100%);color:#e2e8f0;border:1px solid #1e293b;border-radius:16px;box-shadow:0 30px 80px rgba(0,0,0,.85);z-index:2147483647;font-family:-apple-system,sans-serif;font-size:13px;display:flex;flex-direction:column;max-height:90vh;overflow:hidden}@keyframes gfsPulse{0%,100%{opacity:1}50%{opacity:.4}}@keyframes gfsSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes gfsFade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}#gfs-panel *{box-sizing:border-box}#gfs-panel::-webkit-scrollbar{width:6px}#gfs-panel::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}.gfs-hdr{padding:14px 16px;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%);cursor:move;display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:15px;color:#fff;flex-shrink:0}.gfs-hdr-title{display:flex;align-items:center;gap:10px;pointer-events:none}.gfs-logo{width:26px;height:26px;background:rgba(255,255,255,.25);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px}.gfs-status{width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 10px #4ade80;animation:gfsPulse 2s infinite}.gfs-status.busy{background:#facc15;animation:gfsSpin 1s linear infinite}.gfs-hdr-btns{display:flex;gap:6px}.gfs-hdr button{background:rgba(255,255,255,.2);border:none;color:#fff;width:26px;height:26px;border-radius:8px;cursor:pointer;font-size:15px;line-height:1;display:flex;align-items:center;justify-content:center;font-weight:600}.gfs-tabs{display:flex;background:#0b1220;border-bottom:1px solid #1e293b;padding:4px 6px 0;flex-shrink:0}.gfs-tab{flex:1;padding:10px 6px;background:none;border:none;color:#64748b;font-size:10.5px;font-weight:700;cursor:pointer;font-family:inherit;border-bottom:2px solid transparent;text-transform:uppercase;transition:all .15s;border-radius:6px 6px 0 0}.gfs-tab.active{color:#a5b4fc;border-bottom-color:#6366f1;background:rgba(99,102,241,.08)}.gfs-body{padding:16px;overflow-y:auto;flex:1;min-height:0}.gfs-tab-panel{display:none;animation:gfsFade .25s}.gfs-tab-panel.active{display:block}.gfs-row{margin-bottom:12px}.gfs-lbl{display:block;font-size:10px;color:#94a3b8;margin-bottom:6px;text-transform:uppercase;font-weight:700;letter-spacing:.6px}.gfs-hint{font-size:9.5px;color:#475569;text-transform:none;float:right}.gfs-input,.gfs-select{width:100%;padding:10px 12px;background:#0b1220;border:1px solid #334155;border-radius:9px;color:#e2e8f0;font-size:12.5px;font-family:inherit;outline:none}.gfs-input:focus,.gfs-select:focus{border-color:#6366f1}.gfs-input-wrap{position:relative}.gfs-input-wrap .gfs-input{padding-right:44px}.gfs-eye{position:absolute;right:4px;top:50%;transform:translateY(-50%);background:none;border:none;color:#64748b;cursor:pointer;padding:6px 10px;font-size:14px}.gfs-btn{width:100%;padding:12px;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px}.gfs-btn-main{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;box-shadow:0 6px 20px rgba(99,102,241,.4)}.gfs-btn-main:disabled{opacity:.5;cursor:not-allowed}.gfs-btn-sec{background:#1e293b;color:#cbd5e1;border:1px solid #334155}.gfs-btn-danger{background:rgba(69,10,10,.6);color:#fca5a5;border:1px solid #7f1d1d}.gfs-btn-stealth{background:linear-gradient(135deg,#0f172a,#1e293b);color:#94a3b8;border:1px solid #334155}.gfs-btn-sm{padding:8px 12px;font-size:11.5px}.gfs-row-2{display:grid;grid-template-columns:1fr 1fr;gap:9px}.gfs-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}.gfs-progress{height:5px;background:#1e293b;border-radius:3px;overflow:hidden;margin-top:10px;display:none}.gfs-progress.active{display:block}.gfs-progress-fill{height:100%;background:linear-gradient(90deg,#6366f1,#8b5cf6);transition:width .3s;width:0%}.gfs-score{margin-top:14px;padding:16px;background:rgba(30,41,59,.9);border-radius:12px;border-left:4px solid #6366f1;display:none}.gfs-score.active{display:block}.gfs-score-h{font-size:10px;color:#94a3b8;text-transform:uppercase;margin-bottom:8px;font-weight:700}.gfs-score-v{font-size:34px;font-weight:900;line-height:1;background:linear-gradient(135deg,#22c55e,#4ade80,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.gfs-score-d{font-size:11px;color:#94a3b8;margin-top:8px}.gfs-log{background:#020617;border:1px solid #1e293b;border-radius:10px;padding:12px;font-family:monospace;font-size:10.5px;height:220px;overflow-y:auto;color:#94a3b8;line-height:1.65}.gfs-log div{margin-bottom:2px;word-break:break-word}.gfs-log .ok{color:#4ade80}.gfs-log .err{color:#f87171}.gfs-log .info{color:#60a5fa}.gfs-log .warn{color:#fbbf24}.gfs-footer{padding:10px 16px;background:#0a0f1c;border-top:1px solid #1e293b;font-size:10.5px;color:#64748b;display:flex;justify-content:space-between;flex-shrink:0}.gfs-badge{padding:3px 8px;background:#1e293b;border-radius:6px;font-family:monospace;font-size:10px;color:#a5b4fc;font-weight:600}.gfs-badge.busy{background:#78350f;color:#fbbf24}.gfs-badge.error{background:#450a0a;color:#fca5a5}.gfs-badge.done{background:#14532d;color:#86efac}.gfs-tip{font-size:10.5px;color:#94a3b8;margin-bottom:12px;padding:10px 12px;background:rgba(99,102,241,.08);border-left:2px solid #6366f1;border-radius:0 6px 6px 0}.gfs-tip b{color:#a5b4fc}.gfs-expl-list{max-height:340px;overflow-y:auto;background:#020617;border:1px solid #1e293b;border-radius:10px;padding:10px}.gfs-expl-item{padding:10px;margin-bottom:8px;background:rgba(30,41,59,.5);border-radius:8px;border-left:3px solid #6366f1}.gfs-expl-num{font-size:10px;color:#64748b;font-weight:700;margin-bottom:4px;text-transform:uppercase}.gfs-expl-ans{font-size:11.5px;color:#86efac;font-weight:600;margin-bottom:4px}.gfs-expl-reason{font-size:10.5px;color:#94a3b8;line-height:1.55}.gfs-expl-conf{font-size:9.5px;color:#64748b;margin-top:4px}.gfs-toggle{position:relative;display:inline-block;width:36px;height:20px}.gfs-toggle input{opacity:0;width:0;height:0}.gfs-slider{position:absolute;cursor:pointer;inset:0;background:#334155;transition:.3s;border-radius:20px}.gfs-slider:before{position:absolute;content:"";height:14px;width:14px;left:3px;bottom:3px;background:#fff;transition:.3s;border-radius:50%}input:checked + .gfs-slider{background:#6366f1}input:checked + .gfs-slider:before{transform:translateX(16px)}#gfs-stealth-btn{position:fixed;right:20px;bottom:20px;width:52px;height:52px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;display:none;align-items:center;justify-content:center;color:#fff;font-size:22px;cursor:pointer;box-shadow:0 8px 24px rgba(99,102,241,.5);z-index:2147483646;font-weight:700}#gfs-stealth-btn.active{display:flex}.gfs-switch-row{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#0b1220;border:1px solid #334155;border-radius:9px;margin-bottom:8px}.gfs-switch-lbl{font-size:11.5px;color:#cbd5e1;font-weight:600}.gfs-switch-desc{font-size:9.5px;color:#64748b;margin-top:2px}.gfs-credit{font-size:9px;color:#475569;font-family:monospace}`;

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
      <div class="gfs-hdr-title"><div class="gfs-logo">⚡</div><span>GFS v9</span><span class="gfs-status" id="gfs-status"></span></div>
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
        <div class="gfs-tip" id="gfs-tip">Groq · openai/gpt-oss-120b</div>
        <div class="gfs-row" style="margin-top:12px"><button class="gfs-btn gfs-btn-main" id="gfs-solve">NYELESAIN SOAL</button></div>
        <div class="gfs-progress" id="gfs-progress"><div class="gfs-progress-fill" id="gfs-progress-fill"></div></div>
        <div class="gfs-row-3" style="margin-top:12px">
          <button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-parse">CEK</button>
          <button class="gfs-btn gfs-btn-stealth gfs-btn-sm" id="gfs-expl-toggle">EXPLAIN</button>
          <button class="gfs-btn gfs-btn-danger gfs-btn-sm" id="gfs-clear">CLEAR</button>
        </div>
        <div class="gfs-score" id="gfs-score"><div class="gfs-score-h">Hasil</div><div class="gfs-score-v" id="gfs-score-v">-</div><div class="gfs-score-d" id="gfs-score-d"></div></div>
      </div>
      <div class="gfs-tab-panel" data-panel="explain">
        <div class="gfs-expl-list" id="gfs-expl-list"><div style="color:#64748b;font-size:11px;text-align:center;padding:20px">Belum ada penjelasan.</div></div>
      </div>
      <div class="gfs-tab-panel" data-panel="settings">
        <div class="gfs-row"><label class="gfs-lbl">Provider</label><select class="gfs-select" id="gfs-provider"><option value="groq">Groq (recommended)</option><option value="openrouter">OpenRouter</option><option value="andisearch">Andi X Cici</option><option value="ayesoul">Ayesoul</option><option value="openai">OpenAI</option></select></div>
        <div class="gfs-row"><label class="gfs-lbl">Model</label><select class="gfs-select" id="gfs-model"></select></div>
        <div class="gfs-row" id="gfs-key-row"><label class="gfs-lbl">API Key <span class="gfs-hint" id="gfs-key-hint">auto</span></label><div class="gfs-input-wrap"><input class="gfs-input" id="gfs-key" type="password" autocomplete="off"><button class="gfs-eye" id="gfs-eye">👁</button></div></div>
        <div class="gfs-row">
          <div class="gfs-switch-row"><div><div class="gfs-switch-lbl">Auto-Scroll</div><div class="gfs-switch-desc">Scroll ke soal</div></div><label class="gfs-toggle"><input type="checkbox" id="gfs-opt-scroll" checked><span class="gfs-slider"></span></label></div>
          <div class="gfs-switch-row"><div><div class="gfs-switch-lbl">Auto-Explanation</div><div class="gfs-switch-desc">AI jelasin jawaban</div></div><label class="gfs-toggle"><input type="checkbox" id="gfs-opt-explain" checked><span class="gfs-slider"></span></label></div>
        </div>
        <div class="gfs-row-2"><button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-save">💾 SAVE</button><button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-load">📁 LOAD</button></div>
      </div>
      <div class="gfs-tab-panel" data-panel="log">
        <div class="gfs-row-2"><button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-export">📋 EXPORT</button><button class="gfs-btn gfs-btn-danger gfs-btn-sm" id="gfs-clearlog">🗑 CLEAR</button></div>
        <div class="gfs-log" id="gfs-log"><div>Ready.</div></div>
      </div>
    </div>
    <div class="gfs-footer"><span>by Alip Lab</span><span class="gfs-badge" id="gfs-footer-stat">idle</span></div>`;
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
    (MODELS[p] || []).forEach((m) => { const o = document.createElement('option'); o.value = m; o.textContent = m; sel.appendChild(o); });
    if (HARDCODED_KEYS[p]) { $('gfs-key').value = HARDCODED_KEYS[p]; $('gfs-key-row').style.display = 'block'; $('gfs-key-hint').textContent = 'auto'; }
    else { $('gfs-key').value = ''; $('gfs-key-row').style.display = 'block'; $('gfs-key-hint').textContent = 'manual'; }
    const bs = BATCH_SIZE[p] || 6;
    $('gfs-tip').textContent = p + ' · ' + sel.value + ' · batch ' + bs;
  };
  $('gfs-provider').onchange = updateModels;
  $('gfs-model').onchange = () => { $('gfs-tip').textContent = $('gfs-provider').value + ' · ' + $('gfs-model').value; };

  $('gfs-save').onclick = () => { localStorage.setItem('gfs_config', JSON.stringify({ provider: $('gfs-provider').value, model: $('gfs-model').value, key: $('gfs-key').value, oS: $('gfs-opt-scroll').checked, oE: $('gfs-opt-explain').checked })); log('Saved.', 'ok'); };
  $('gfs-load').onclick = () => { try { const c = JSON.parse(localStorage.getItem('gfs_config') || '{}'); if (c.provider) { $('gfs-provider').value = c.provider; updateModels(); } if (c.model) $('gfs-model').value = c.model; if (c.key && !HARDCODED_KEYS[$('gfs-provider').value]) $('gfs-key').value = c.key; if (c.oS !== undefined) $('gfs-opt-scroll').checked = c.oS; if (c.oE !== undefined) $('gfs-opt-explain').checked = c.oE; log('Loaded.', 'ok'); } catch (e) { log('Load gagal', 'err'); } };

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
        el = el.parentElement; if (!el) break;
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

  // ─── GROQ ───
  const callGroq = async (key, model, prompt) => {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: 'You answer MCQ. Return JSON: {"answers":[{"i":<index>,"a":"<option text>"}]}. Output JSON only.' }, { role: 'user', content: prompt }], response_format: { type: 'json_object' }, temperature: 0.1, max_tokens: 2000 })
    });
    if (!res.ok) throw new Error('Groq ' + res.status + ': ' + (await res.text()).slice(0, 150));
    const data = await res.json();
    return data.choices[0].message.content;
  };

  // ─── OPENROUTER ───
  const callOpenRouter = async (key, model, prompt) => {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: 'You answer MCQ. Return JSON: {"answers":[{"i":<index>,"a":"<option text>"}]}.' }, { role: 'user', content: prompt }], response_format: { type: 'json_object' }, temperature: 0.1, max_tokens: 2000 })
    });
    if (!res.ok) throw new Error('OpenRouter ' + res.status + ': ' + (await res.text()).slice(0, 150));
    const data = await res.json();
    if (!data.choices?.[0]?.message?.content) throw new Error('OpenRouter empty');
    return data.choices[0].message.content;
  };

  // ─── OPENAI ───
  const callOpenAI = async (key, model, prompt) => {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: 'Answer MCQ. Return JSON: {"answers":[{"i":<index>,"a":"<option text>"}]}.' }, { role: 'user', content: prompt }], response_format: { type: 'json_object' }, max_tokens: 2000 })
    });
    if (!res.ok) throw new Error('OpenAI ' + res.status);
    const data = await res.json();
    return data.choices[0].message.content;
  };

  // ─── ANDI X CICI (AndiSearch) — single question ───
  const callAndiSearch = async (key, model, prompt) => {
    const url = 'https://anabot.my.id/api/ai/andisearch?prompt=' + encodeURIComponent(prompt) + '&apikey=' + encodeURIComponent(key);
    const res = await fetch(url, { method: 'GET', headers: { 'accept': 'application/json' } });
    if (!res.ok) throw new Error('AndiSearch ' + res.status);
    const data = await res.json();
    if (!data.success) throw new Error('AndiSearch fail');
    const text = data?.data?.result?.chat || '';
    if (!text) throw new Error('AndiSearch empty');
    // Extract jawaban
    const m = text.match(/JAWABAN\s*:\s*(.+?)(?:\n|$)/i);
    if (m) return JSON.stringify({ answers: [{ i: 0, a: m[1].trim() }] });
    // Fallback: match dengan opsi
    return JSON.stringify({ answers: [{ i: 0, a: text.slice(0, 200) }] });
  };

  // ─── AYESOUL — single question ───
  const callAyesoul = async (key, model, prompt) => {
    const res = await fetch('https://anabot.my.id/api/ai/ayesoul', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, imageUrl: '', apikey: key })
    });
    if (!res.ok) throw new Error('Ayesoul ' + res.status);
    const data = await res.json();
    if (!data.success) throw new Error('Ayesoul fail');
    const text = data?.data?.result?.stream || '';
    if (!text) throw new Error('Ayesoul empty');
    const m = text.match(/JAWABAN\s*:\s*(.+?)(?:\n|$)/i);
    if (m) return JSON.stringify({ answers: [{ i: 0, a: m[1].trim() }] });
    return JSON.stringify({ answers: [{ i: 0, a: text.slice(0, 200) }] });
  };

  // ─── PARSER ───
  const parseResponse = (raw) => {
    let data;
    try { data = JSON.parse(raw); }
    catch {
      const a = raw.match(/\[[\s\S]*\]/), o = raw.match(/\{[\s\S]*\}/);
      if (a) data = JSON.parse(a[0]);
      else if (o) data = JSON.parse(o[0]);
      else throw new Error('Not JSON');
    }
    const list = Array.isArray(data) ? data : (data.answers || data.data || []);
    if (!Array.isArray(list)) throw new Error('Format salah');
    return list.map(x => {
      if (!x) return null;
      const idx = Number.isInteger(x.i) ? x.i : (Number.isInteger(x.idx) ? x.idx : null);
      const answer = x.a || x.answer || null;
      if (idx === null || typeof answer !== 'string') return null;
      return { idx, answer, confidence: Math.min(1, Math.max(0, Number(x.confidence) || 0.85)), reason: x.reason || x.explanation || '' };
    }).filter(Boolean);
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const normalize = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').replace(/[.,;:!?'"()\-–—]/g, '').trim();

  const findOption = (q, aiAnswer) => {
    const raw = String(aiAnswer || '').trim();
    if (!raw) return { el: null, reason: 'empty' };
    // Cari exact
    let m = q.opts.find(o => o.text === raw);
    if (m) return { el: m.el, reason: 'exact' };
    const stripped = raw.replace(/^\s*[A-Za-z0-9][.)\-:]\s*/, '').trim();
    if (stripped !== raw) { m = q.opts.find(o => o.text === stripped); if (m) return { el: m.el, reason: 'exact-strip' }; }
    const nRaw = normalize(raw), nStrip = normalize(stripped);
    m = q.opts.find(o => normalize(o.text) === nRaw);
    if (m) return { el: m.el, reason: 'normal' };
    if (nStrip !== nRaw) { m = q.opts.find(o => normalize(o.text) === nStrip); if (m) return { el: m.el, reason: 'normal-strip' }; }
    // Contains — strict
    const cands = q.opts.filter(o => { const no = normalize(o.text); return no.length > 0 && nStrip.length >= no.length * 0.5 && (no.includes(nStrip) || nStrip.includes(no)); });
    if (cands.length === 1) return { el: cands[0].el, reason: 'contains-1' };
    if (cands.length > 1) {
      cands.sort((a, b) => { const oa = normalize(a.text), ob = normalize(b.text); const sA = oa.includes(nStrip) ? nStrip.length / oa.length : oa.length / nStrip.length; const sB = ob.includes(nStrip) ? nStrip.length / ob.length : ob.length / nStrip.length; return sB - sA; });
      return { el: cands[0].el, reason: 'contains-best(' + cands.length + ')' };
    }
    // Substring key — match kalau opsi cuma 2-3 kata unik dari AI
    for (const opt of q.opts) {
      const no = normalize(opt.text);
      const words = no.split(' ').filter(w => w.length > 3);
      if (words.length > 0 && words.every(w => nStrip.includes(w))) {
        return { el: opt.el, reason: 'word-match' };
      }
    }
    return { el: null, reason: 'no-match' };
  };

  const renderExplanations = (allAnswers, questions, allMatches) => {
    const list = $('gfs-expl-list'); list.innerHTML = '';
    allAnswers.forEach((a) => {
      const q = questions[a.idx]; if (!q) return;
      const mt = allMatches[a.idx] || {};
      const item = document.createElement('div');
      item.className = 'gfs-expl-item';
      if (mt.reason === 'no-match') item.style.borderLeftColor = '#ef4444';
      else if (mt.reason && mt.reason.startsWith('contains-best')) item.style.borderLeftColor = '#fbbf24';
      else item.style.borderLeftColor = '#22c55e';
      item.innerHTML = '<div class="gfs-expl-num">Q' + (a.idx + 1) + ' · ' + (mt.reason || '') + '</div>' +
        '<div class="gfs-expl-ans">' + (mt.reason === 'no-match' ? '✗ ' : '✓ ') + a.answer + '</div>' +
        '<div class="gfs-expl-reason">' + (a.reason || q.qText.slice(0, 150)) + '</div>' +
        '<div class="gfs-expl-conf">Conf: ' + (a.confidence * 100).toFixed(0) + '%</div>';
      list.appendChild(item);
    });
  };

  // ─── SOLVE ───
  $('gfs-solve').onclick = async () => {
    if (state.running) return;
    const key = $('gfs-key').value.trim();
    const provider = $('gfs-provider').value;
    const model = $('gfs-model').value;
    if (!key) return log('API key kosong.', 'err');

    const questions = parseQuestions();
    if (!questions.length) return log('Nggak ada soal.', 'err');

    state.running = true; setStatus('running'); $('gfs-status').classList.add('busy');
    const btn = $('gfs-solve'); btn.disabled = true; btn.textContent = '⏳ PROCESSING...';
    $('gfs-progress').classList.add('active');

    const wantExplain = $('gfs-opt-explain').checked;
    const bs = BATCH_SIZE[provider] || 6;
    const totalBatches = Math.ceil(questions.length / bs);
    log('Total: ' + questions.length + ' soal · ' + totalBatches + ' batch × ' + bs, 'info');

    const allAnswers = [];
    const allMatches = {};

    try {
      for (let b = 0; b < totalBatches; b++) {
        const start = b * bs;
        const batch = questions.slice(start, start + bs);
        log('══ Batch ' + (b + 1) + '/' + totalBatches + ' ══', 'info');

        let batchPrompt;
        if (bs === 1) {
          // Single question for AndiSearch / Ayesoul
          const q = batch[0];
          batchPrompt = 'Jawab soal pilihan ganda berikut dengan TEPAT.\n\n' +
            'SOAL: ' + q.qText + '\n\n' +
            'PILIHAN:\n' + q.opts.map((o, i) => (i + 1) + '. ' + o.text).join('\n') + '\n\n' +
            'Format jawaban WAJIB:\nJAWABAN: <teks opsi PERSIS sama kayak di soal>';
        } else {
          batchPrompt = 'Jawab soal pilihan ganda berikut. Untuk setiap soal, pilih opsi PALING TEPAT.\n' +
            'Balas HANYA JSON object:\n{"answers":[{"i":0,"a":"<teks opsi PERSIS>"' + (wantExplain ? ',"reason":"<alasan>"' : '') + '}]}\n\n' +
            'PENTING: "a" harus SAMA PERSIS dengan salah satu opsi.\n\n' +
            batch.map((q, i) => '[' + (start + i) + '] ' + q.qText + '\n' + q.opts.map(o => '- ' + o.text).join('\n')).join('\n\n');
        }

        let raw;
        try {
          if (provider === 'groq') raw = await callGroq(key, model, batchPrompt);
          else if (provider === 'openrouter') raw = await callOpenRouter(key, model, batchPrompt);
          else if (provider === 'andisearch') raw = await callAndiSearch(key, model, batchPrompt);
          else if (provider === 'ayesoul') raw = await callAyesoul(key, model, batchPrompt);
          else raw = await callOpenAI(key, model, batchPrompt);
          log('Batch ' + (b + 1) + ' response: ' + raw.length + ' chars', 'ok');
        } catch (e) {
          log('Batch ' + (b + 1) + ' gagal: ' + e.message, 'err');
          await sleep(1000);
          continue;
        }

        try {
          let answers = parseResponse(raw);
          // Kalau provider single-question, offset idx-nya
          if (bs === 1 && answers.length === 1) {
            answers[0].idx = start;
          }
          log('Batch ' + (b + 1) + ' → ' + answers.length + ' jawaban', 'ok');
          answers.forEach(a => allAnswers.push(a));
        } catch (e) {
          log('Batch ' + (b + 1) + ' parse gagal: ' + e.message, 'warn');
          log('Raw: ' + raw.slice(0, 120), 'warn');
        }

        await sleep(bs === 1 ? 1500 : 800);
      }

      log('Total jawaban AI: ' + allAnswers.length, 'info');

      let clicked = 0, totalConf = 0, skipped = 0;
      for (let i = 0; i < allAnswers.length; i++) {
        const a = allAnswers[i];
        $('gfs-progress-fill').style.width = Math.round(((i + 1) / allAnswers.length) * 100) + '%';
        const q = questions[a.idx]; if (!q) continue;
        const mt = findOption(q, a.answer);
        allMatches[a.idx] = mt;
        if (mt.el) {
          if ($('gfs-opt-scroll').checked) mt.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await sleep(100); mt.el.click();
          clicked++; totalConf += a.confidence;
          log('Q' + a.idx + ' ✓ ' + a.answer.slice(0, 40) + ' [' + mt.reason + ']', 'ok');
        } else {
          skipped++;
          log('Q' + a.idx + ' ✗ NO MATCH: "' + a.answer.slice(0, 60) + '"', 'err');
        }
        await sleep(150);
      }

      renderExplanations(allAnswers, questions, allMatches);
      $('gfs-score').classList.add('active');
      $('gfs-score-v').textContent = clicked + '/' + questions.length;
      $('gfs-score-d').textContent = 'Terisi: ' + clicked + ' · Skip: ' + skipped + ' · by Alip Lab';
      setStatus('done');
      log('═══ SELESAI: ' + clicked + '/' + questions.length + ' · skip ' + skipped + ' ═══', 'ok');
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

  $('gfs-provider').value = 'groq';
  updateModels();
  log('GFS v9 by Alip Lab. Andi X Cici + Ayesoul added.', 'ok');
})();
