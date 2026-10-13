/* GFS AI Solver — Google Form AI Auto-Fill + Score Prediction
 * For education & testing only. Do not use on real exams.
 */
(function () {
  if (window.__GFS_LOADED__) {
    document.getElementById('gfs-panel')?.remove();
    window.__GFS_LOADED__ = false;
    return;
  }
  window.__GFS_LOADED__ = true;

  const state = { provider: 'gemini', model: 'gemini-2.5-flash' };

  const css = `
  #gfs-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:340px;max-width:90vw;background:#0f172a;color:#e2e8f0;border:1px solid #1e293b;border-radius:12px;box-shadow:0 25px 60px rgba(0,0,0,.7);z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:13px;user-select:none;animation:gfsIn .3s ease-out}
  @keyframes gfsIn{from{opacity:0;transform:translate(-50%,-50%) scale(.9)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
  #gfs-panel *{box-sizing:border-box}
  .gfs-hdr{padding:12px 14px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:12px 12px 0 0;cursor:move;display:flex;justify-content:space-between;align-items:center;font-weight:600;font-size:14px}
  .gfs-hdr button{background:rgba(255,255,255,.2);border:none;color:#fff;width:24px;height:24px;border-radius:6px;cursor:pointer;font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;pointer-events:auto}
  .gfs-hdr button:hover{background:rgba(255,255,255,.3)}
  .gfs-body{padding:14px;max-height:75vh;overflow-y:auto}
  .gfs-row{margin-bottom:12px}
  .gfs-lbl{display:block;font-size:11px;color:#94a3b8;margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px;font-weight:600}
  .gfs-input,.gfs-select{width:100%;padding:10px 12px;background:#1e293b;border:1px solid #334155;border-radius:8px;color:#e2e8f0;font-size:13px;font-family:inherit;outline:none;transition:.2s}
  .gfs-input:focus,.gfs-select:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}
  .gfs-btn{width:100%;padding:11px;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:.2s}
  .gfs-btn-main{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff}
  .gfs-btn-main:hover:not(:disabled){opacity:.9;transform:translateY(-1px)}
  .gfs-btn-main:disabled{opacity:.4;cursor:not-allowed}
  .gfs-btn-sec{background:#334155;color:#e2e8f0}
  .gfs-btn-sec:hover{background:#475569}
  .gfs-log{background:#020617;border:1px solid #1e293b;border-radius:8px;padding:10px;font-family:monospace;font-size:10px;max-height:130px;overflow-y:auto;margin-top:10px;color:#94a3b8;line-height:1.6}
  .gfs-log .ok{color:#22c55e}
  .gfs-log .err{color:#ef4444}
  .gfs-log .info{color:#38bdf8}
  .gfs-score{margin-top:12px;padding:12px;background:linear-gradient(135deg,#1e293b,#334155);border-radius:8px;border-left:3px solid #6366f1}
  .gfs-score-h{font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px;font-weight:600}
  .gfs-score-v{font-size:28px;font-weight:700;color:#22c55e;line-height:1}
  .gfs-score-d{font-size:11px;color:#94a3b8;margin-top:4px}
  .gfs-legend{font-size:10px;color:#64748b;margin-top:10px;line-height:1.5;text-align:center}
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const panel = document.createElement('div');
  panel.id = 'gfs-panel';
  panel.innerHTML = `
    <div class="gfs-hdr" id="gfs-hdr">
      <span>GFS AI Solver</span>
      <button id="gfs-close">×</button>
    </div>
    <div class="gfs-body">
      <div class="gfs-row">
        <label class="gfs-lbl">Provider</label>
        <select class="gfs-select" id="gfs-provider">
          <option value="gemini">Google Gemini</option>
          <option value="openai">OpenAI ChatGPT</option>
        </select>
      </div>
      <div class="gfs-row">
        <label class="gfs-lbl">Model</label>
        <input class="gfs-input" id="gfs-model" value="gemini-2.5-flash" />
      </div>
      <div class="gfs-row">
        <label class="gfs-lbl">API Key</label>
        <input class="gfs-input" id="gfs-key" type="password" placeholder="Paste API key di sini" />
      </div>
      <div class="gfs-row">
        <button class="gfs-btn gfs-btn-main" id="gfs-solve">NYELESAIN SOAL</button>
      </div>
      <div class="gfs-row">
        <button class="gfs-btn gfs-btn-sec" id="gfs-parse">CEK SOAL (tanpa AI)</button>
      </div>
      <div class="gfs-log" id="gfs-log"><div>Ready. Isi API key & klik Solve.</div></div>
      <div class="gfs-score" id="gfs-score" style="display:none">
        <div class="gfs-score-h">Prediksi Nilai</div>
        <div class="gfs-score-v" id="gfs-score-v">-</div>
        <div class="gfs-score-d" id="gfs-score-d"></div>
      </div>
      <div class="gfs-legend">Edukasi & testing. Jangan dipakai untuk ujian resmi.</div>
    </div>`;
  document.body.appendChild(panel);

  const $ = (id) => document.getElementById(id);

  const log = (msg, cls = 'info') => {
    const el = $('gfs-log');
    const d = document.createElement('div');
    d.className = cls;
    d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
    el.appendChild(d);
    el.scrollTop = el.scrollHeight;
  };

  $('gfs-close').onclick = () => {
    panel.remove();
    window.__GFS_LOADED__ = false;
  };

  // ─── Drag logic (fix: reset transform on drag start) ───
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
    panel.style.left = (x - ox) + 'px';
    panel.style.top = (y - oy) + 'px';
  };
  const endDrag = () => { isDrag = false; };

  hdr.addEventListener('mousedown', (e) => { if (e.target.id === 'gfs-close') return; startDrag(e.clientX, e.clientY); });
  hdr.addEventListener('touchstart', (e) => { if (e.target.id === 'gfs-close') return; startDrag(e.touches[0].clientX, e.touches[0].clientY); });
  document.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
  document.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchend', endDrag);

  // ─── Parse Google Form questions ───
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
        if (heading && heading.innerText && heading.innerText.trim()) {
          qText = heading.innerText.trim();
          break;
        }
      }
      const opts = [...g.querySelectorAll('div[role="radio"], div[role="checkbox"]')].map((o) => ({
        text: (o.innerText || '').trim(),
        el: o,
      }));
      const type = g.querySelector('div[role="radio"]') ? 'single' : 'multi';
      if (opts.length) questions.push({ idx: i, qText, opts, type, group: g });
    });
    return questions;
  };

  $('gfs-parse').onclick = () => {
    const q = parseQuestions();
    log('Ditemukan ' + q.length + ' pertanyaan.', 'ok');
    q.slice(0, 3).forEach((item, i) => {
      log('Q' + (i + 1) + ': ' + (item.qText || '(no text)').slice(0, 60), 'info');
    });
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
    if (!res.ok) throw new Error('Gemini HTTP ' + res.status + ': ' + (await res.text()).slice(0, 200));
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  };

  const callOpenAI = async (apiKey, model, prompt) => {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: 'You answer multiple choice questions. Output ONLY valid JSON array, no markdown, no extra text.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
      }),
    });
    if (!res.ok) throw new Error('OpenAI HTTP ' + res.status + ': ' + (await res.text()).slice(0, 200));
    const data = await res.json();
    return data.choices[0].message.content;
  };

  $('gfs-solve').onclick = async () => {
    const key = $('gfs-key').value.trim();
    const provider = $('gfs-provider').value;
    const model = $('gfs-model').value.trim();
    if (!key) return log('API key kosong.', 'err');

    const questions = parseQuestions();
    if (!questions.length) return log('Nggak ada pertanyaan. Pastikan halaman Google Form sudah load.', 'err');
    log('Parse ' + questions.length + ' soal. Kirim ke AI...', 'info');

    const prompt =
      'You are an exam assistant. Answer the multiple choice questions below.\n' +
      'Return ONLY a JSON array with no markdown, no explanation:\n' +
      '[{"idx":0,"answer":"<exact option text>","confidence":0.9}]\n\n' +
      'Rules:\n' +
      '- For single choice: 1 answer per question\n' +
      '- For multi choice (checkbox): 1-2 most correct options\n' +
      '- "answer" must match option text EXACTLY\n' +
      '- "confidence" = 0 to 1\n\n' +
      'QUESTIONS:\n' +
      questions.map((q, i) => '[Q' + i + '] (' + q.type + ') ' + q.qText + '\nOPTIONS:\n' + q.opts.map((o) => '  - ' + o.text).join('\n')).join('\n\n');

    const btn = $('gfs-solve');
    btn.disabled = true;
    btn.textContent = 'AI mikir...';

    try {
      let raw;
      if (provider === 'gemini') raw = await callGemini(key, model, prompt);
      else raw = await callOpenAI(key, model, prompt);
      log('AI response diterima.', 'ok');

      const m = raw.match(/\[[\s\S]*\]/);
      if (!m) throw new Error('AI response bukan JSON valid');
      const answers = JSON.parse(m[0]);
      log('AI kasih ' + answers.length + ' jawaban.', 'ok');

      let clicked = 0, totalConf = 0;
      for (const a of answers) {
        const q = questions[a.idx];
        if (!q) continue;
        const target =
          q.opts.find((o) => o.text === a.answer) ||
          q.opts.find((o) => o.text.toLowerCase() === String(a.answer).toLowerCase()) ||
          q.opts.find((o) => o.text.includes(a.answer) || a.answer.includes(o.text));
        if (target) {
          target.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await new Promise((r) => setTimeout(r, 150));
          target.el.click();
          clicked++;
          totalConf += a.confidence || 0.7;
          log('Q' + a.idx + ' ✓ ' + String(a.answer).slice(0, 50), 'ok');
        } else {
          log('Q' + a.idx + ' ✗ opsi nggak match: ' + String(a.answer).slice(0, 50), 'err');
        }
        await new Promise((r) => setTimeout(r, 200));
      }

      const avgConf = clicked > 0 ? totalConf / clicked : 0;
      const pct = Math.round(avgConf * 100);
      const grade = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'E';
      $('gfs-score').style.display = 'block';
      $('gfs-score-v').textContent = pct + '% (' + grade + ')';
      $('gfs-score-d').textContent = clicked + '/' + questions.length + ' soal terisi · avg confidence ' + (avgConf * 100).toFixed(0) + '%';

      log('Selesai. ' + clicked + '/' + questions.length + ' soal keisi.', 'ok');
    } catch (e) {
      log('ERROR: ' + e.message, 'err');
      console.error(e);
    } finally {
      btn.disabled = false;
      btn.textContent = 'NYELESAIN SOAL';
    }
  };

  $('gfs-provider').onchange = function () {
    $('gfs-model').value = this.value === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o-mini';
  };

  log('Panel aktif. Drag header buat geser.', 'ok');
})();
