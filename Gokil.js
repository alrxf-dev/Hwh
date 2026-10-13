/* GFS AI Solver PRO v16 — by Alip/Alrect — + Chat Auto-Solve by Number */
(function () {
  if (window.__GFS_LOADED__) { document.getElementById('gfs-panel')?.remove(); document.getElementById('gfs-stealth-btn')?.remove(); window.__GFS_LOADED__ = false; return; }
  window.__GFS_LOADED__ = true;

  const CF_ACCOUNT_ID = '7f83137df22c15f252e1da2ee2214a6c';
  const CF_API_TOKEN = 'cfut_2WkAuydB6WzZXAzdSIGz3kI5AxyEQVDOqllfGshz3568c7ff';

  const HARDCODED_KEYS = {
    groq: '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',
    openrouter: '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',
    cloudflare: CF_API_TOKEN
  };

  const PERSONALITY = {
    groq: '[Persona: Groq Llama — AI super cepat buatan Groq dengan chip LPU kustom. Latency rendah, akurasi tinggi.]',
    openrouter: '[Persona: OpenRouter Aggregator — gateway ke berbagai model AI. Profesional, teliti, paham konteks akademik.]',
    cloudflare: '[Persona: Cloudflare Workers AI — edge AI global yang berjalan di 300+ data center. Terdistribusi, cepat, efisien.]',
    openai: '[Persona: OpenAI GPT-4o — asisten multimodal cerdas dan teliti. Prioritaskan akurasi di atas kecepatan.]'
  };

  const state = { running: false, stealth: false, chatHistory: [] };
  const BATCH_SIZE = { groq: 6, openrouter: 6, openai: 6, cloudflare: 6 };

  const MODELS = {
    groq: ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'],
    openrouter: ['nvidia/nemotron-3-ultra-550b-a55b:free', 'nvidia/nemotron-3-super-120b-a12b:free'],
    cloudflare: [
      '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      '@cf/meta/llama-3.1-8b-instruct',
      '@cf/mistral/mistral-7b-instruct-v0.1',
      '@cf/meta/llama-3.2-3b-instruct',
      '@cf/meta/llama-3.2-1b-instruct'
    ],
    openai: ['gpt-4o-mini', 'gpt-4o']
  };

  const SVG = {
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V4z"/><path d="M4 20h14"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>',
    ghost: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 5.8L20 9.7l-5.8 1.9L12 17.4l-2.2-5.8L4 9.7l6.1-1.9L12 2z"/><path d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15z" opacity="0.7"/></svg>',
    rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91 0z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>',
    id: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 8h4M15 12h4M9 14c-1.5 0-3 .5-3 2h6c0-1.5-1.5-2-3-2z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>'
  };

  const CSS = `
  @keyframes gfsPanelIn{0%{opacity:0;transform:translate(-50%,-50%) perspective(1000px) rotateX(-15deg) scale(.85)}100%{opacity:1;transform:translate(-50%,-50%) perspective(1000px) rotateX(0) scale(1)}}
  @keyframes gfsTabIn{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}
  @keyframes gfsPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.3);opacity:.5}}
  @keyframes gfsSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes gfsFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
  @keyframes gfsShine{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes gfsGlow{0%,100%{box-shadow:0 0 12px rgba(139,92,246,.5),0 0 24px rgba(99,102,241,.3)}50%{box-shadow:0 0 20px rgba(139,92,246,.8),0 0 36px rgba(99,102,241,.5)}}
  @keyframes gfsSlideIn{0%{opacity:0;transform:translateX(-8px)}100%{opacity:1;transform:translateX(0)}}
  @keyframes gfsDot{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}

  #gfs-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:460px;max-width:94vw;background:linear-gradient(160deg,#0a0f1c 0%,#0f172a 50%,#0b1220 100%);color:#e2e8f0;border:1px solid rgba(139,92,246,.25);border-radius:20px;box-shadow:0 40px 100px rgba(0,0,0,.9),0 0 0 1px rgba(139,92,246,.15),inset 0 1px 0 rgba(255,255,255,.05);z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;display:flex;flex-direction:column;max-height:92vh;overflow:hidden;animation:gfsPanelIn .5s cubic-bezier(.34,1.56,.64,1);backdrop-filter:blur(20px)}
  #gfs-panel *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
  #gfs-panel::-webkit-scrollbar{width:6px}
  #gfs-panel::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#6366f1,#8b5cf6);border-radius:3px}

  .gfs-hdr{padding:16px 18px;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 45%,#a855f7 100%);cursor:move;display:flex;justify-content:space-between;align-items:center;font-weight:800;font-size:15px;color:#fff;flex-shrink:0;position:relative;overflow:hidden}
  .gfs-hdr::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);background-size:200% 100%;animation:gfsShine 3s infinite;pointer-events:none;mix-blend-mode:overlay}
  .gfs-hdr-title{display:flex;align-items:center;gap:10px;pointer-events:none;position:relative;z-index:1}
  .gfs-logo{width:30px;height:30px;background:rgba(255,255,255,.22);border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 1px 0 rgba(255,255,255,.4);animation:gfsFloat 3s ease-in-out infinite}
  .gfs-logo svg{width:16px;height:16px;color:#fff}
  .gfs-status{width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 10px #4ade80;animation:gfsPulse 2s infinite}
  .gfs-status.busy{background:#facc15;box-shadow:0 0 10px #facc15;animation:gfsSpin 1s linear infinite}
  .gfs-hdr-btns{display:flex;gap:6px;position:relative;z-index:1}
  .gfs-hdr button{background:rgba(255,255,255,.18);border:none;color:#fff;width:28px;height:28px;border-radius:9px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .25s}
  .gfs-hdr button svg{width:14px;height:14px}
  .gfs-hdr button:hover{background:rgba(255,255,255,.32);transform:scale(1.12)}

  .gfs-tabs{display:flex;background:rgba(11,18,32,.6);border-bottom:1px solid rgba(139,92,246,.15);padding:6px 8px 0;flex-shrink:0;gap:2px;overflow-x:auto}
  .gfs-tabs::-webkit-scrollbar{display:none}
  .gfs-tab{flex:1;min-width:58px;padding:11px 6px;background:none;border:none;color:#64748b;font-size:9.5px;font-weight:800;cursor:pointer;font-family:inherit;text-transform:uppercase;letter-spacing:.6px;transition:all .3s;border-radius:10px 10px 0 0;position:relative;display:flex;align-items:center;justify-content:center;gap:4px}
  .gfs-tab svg{width:13px;height:13px;opacity:.7}
  .gfs-tab::after{content:'';position:absolute;left:50%;bottom:0;transform:translateX(-50%) scaleX(0);width:70%;height:2px;background:linear-gradient(90deg,transparent,#818cf8,transparent);transition:transform .3s;border-radius:2px}
  .gfs-tab:hover{color:#94a3b8}
  .gfs-tab.active{color:#c7d2fe;background:linear-gradient(180deg,rgba(99,102,241,.15),rgba(99,102,241,.02))}
  .gfs-tab.active svg{opacity:1;color:#a5b4fc}
  .gfs-tab.active::after{transform:translateX(-50%) scaleX(1)}

  .gfs-body{padding:18px;overflow-y:auto;flex:1;min-height:0}
  .gfs-tab-panel{display:none}
  .gfs-tab-panel.active{display:block;animation:gfsTabIn .35s}
  .gfs-row{margin-bottom:13px}
  .gfs-lbl{display:flex;align-items:center;gap:5px;font-size:10px;color:#94a3b8;margin-bottom:7px;text-transform:uppercase;font-weight:800;letter-spacing:.7px}
  .gfs-lbl svg{width:12px;height:12px;color:#818cf8}
  .gfs-hint{font-size:9.5px;color:#475569;text-transform:none;margin-left:auto;font-weight:500}
  .gfs-input,.gfs-select{width:100%;padding:11px 13px;background:rgba(11,18,32,.7);border:1px solid rgba(51,65,85,.8);border-radius:11px;color:#e2e8f0;font-size:12.5px;font-family:inherit;outline:none;transition:all .25s}
  .gfs-input:focus,.gfs-select:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.18)}
  .gfs-input-wrap{position:relative}
  .gfs-input-wrap .gfs-input{padding-right:44px}
  .gfs-eye{position:absolute;right:5px;top:50%;transform:translateY(-50%);background:none;border:none;color:#64748b;cursor:pointer;padding:7px 10px;border-radius:7px}
  .gfs-eye svg{width:14px;height:14px}
  .gfs-eye:hover{color:#a5b4fc;background:rgba(99,102,241,.15)}

  .gfs-btn{width:100%;padding:13px;border:none;border-radius:11px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .3s;position:relative;overflow:hidden}
  .gfs-btn svg{width:16px;height:16px}
  .gfs-btn-main{background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%);color:#fff;box-shadow:0 8px 24px rgba(99,102,241,.45)}
  .gfs-btn-main:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 14px 32px rgba(99,102,241,.55)}
  .gfs-btn-main:disabled{opacity:.5;cursor:not-allowed}
  .gfs-btn-sec{background:rgba(30,41,59,.8);color:#cbd5e1;border:1px solid rgba(51,65,85,.9)}
  .gfs-btn-sec:hover{background:rgba(51,65,85,.9);color:#e2e8f0}
  .gfs-btn-danger{background:rgba(69,10,10,.7);color:#fca5a5;border:1px solid rgba(127,29,29,.7)}
  .gfs-btn-danger:hover{background:rgba(127,29,29,.9)}
  .gfs-btn-stealth{background:linear-gradient(135deg,rgba(15,23,42,.9),rgba(30,41,59,.9));color:#94a3b8;border:1px solid rgba(51,65,85,.8)}
  .gfs-btn-stealth:hover{color:#e2e8f0;border-color:rgba(139,92,246,.5)}
  .gfs-btn-sm{padding:9px 12px;font-size:11.5px;border-radius:9px}
  .gfs-btn-sm svg{width:14px;height:14px}
  .gfs-row-2{display:grid;grid-template-columns:1fr 1fr;gap:9px}
  .gfs-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px}

  .gfs-progress{height:6px;background:rgba(30,41,59,.7);border-radius:4px;overflow:hidden;margin-top:12px;display:none}
  .gfs-progress.active{display:block}
  .gfs-progress-fill{height:100%;background:linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7,#8b5cf6,#6366f1);background-size:200% 100%;transition:width .4s;width:0%;border-radius:4px;animation:gfsShine 2s linear infinite}

  .gfs-score{margin-top:16px;padding:18px;background:linear-gradient(135deg,rgba(30,41,59,.9),rgba(51,65,85,.9));border-radius:14px;border-left:4px solid #6366f1;display:none}
  .gfs-score.active{display:block}
  .gfs-score-h{font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px;font-weight:800;display:flex;align-items:center;gap:6px}
  .gfs-score-h svg{width:13px;height:13px;color:#fbbf24}
  .gfs-score-v{font-size:38px;font-weight:900;line-height:1;background:linear-gradient(135deg,#22c55e,#4ade80,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-1.5px}
  .gfs-score-d{font-size:11px;color:#94a3b8;margin-top:8px}

  .gfs-log{background:rgba(2,6,23,.9);border:1px solid rgba(30,41,59,.9);border-radius:12px;padding:14px;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:10.5px;height:290px;overflow-y:auto;color:#94a3b8;line-height:1.7}
  .gfs-log div{margin-bottom:2px;word-break:break-word}
  .gfs-log .ok{color:#4ade80}
  .gfs-log .err{color:#f87171}
  .gfs-log .info{color:#60a5fa}
  .gfs-log .warn{color:#fbbf24}
  .gfs-log .ai{color:#c4b5fd;font-weight:700}
  .gfs-log::-webkit-scrollbar{width:5px}
  .gfs-log::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#6366f1,#8b5cf6);border-radius:3px}

  .gfs-footer{padding:11px 18px;background:rgba(10,15,28,.85);border-top:1px solid rgba(30,41,59,.8);font-size:10.5px;color:#64748b;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
  .gfs-badge{padding:4px 10px;background:linear-gradient(135deg,rgba(30,41,59,.9),rgba(51,65,85,.9));border-radius:7px;font-family:monospace;font-size:10px;color:#a5b4fc;font-weight:700;text-transform:uppercase}
  .gfs-badge.busy{background:linear-gradient(135deg,#78350f,#92400e);color:#fbbf24;animation:gfsPulse 1.5s infinite}
  .gfs-badge.error{background:linear-gradient(135deg,#450a0a,#7f1d1d);color:#fca5a5}
  .gfs-badge.done{background:linear-gradient(135deg,#14532d,#15803d);color:#86efac}

  .gfs-tip{font-size:10.5px;color:#94a3b8;margin-bottom:12px;padding:11px 13px;background:linear-gradient(135deg,rgba(99,102,241,.1),rgba(139,92,246,.05));border-left:3px solid #6366f1;border-radius:0 10px 10px 0;line-height:1.55;display:flex;align-items:center;gap:8px}
  .gfs-tip svg{width:14px;height:14px;color:#818cf8;flex-shrink:0}

  .gfs-expl-list{max-height:340px;overflow-y:auto;background:rgba(2,6,23,.9);border:1px solid rgba(30,41,59,.9);border-radius:12px;padding:12px}
  .gfs-expl-item{padding:12px;margin-bottom:10px;background:linear-gradient(135deg,rgba(30,41,59,.6),rgba(51,65,85,.4));border-radius:11px;border-left:3px solid #6366f1}
  .gfs-expl-num{font-size:10px;color:#64748b;font-weight:800;margin-bottom:5px;text-transform:uppercase;display:flex;align-items:center;gap:5px}
  .gfs-expl-ans{font-size:12px;color:#86efac;font-weight:700;margin-bottom:5px}
  .gfs-expl-reason{font-size:10.5px;color:#94a3b8;line-height:1.6}
  .gfs-expl-conf{font-size:9.5px;color:#64748b;margin-top:5px;font-family:monospace}

  .gfs-toggle{position:relative;display:inline-block;width:40px;height:22px;flex-shrink:0}
  .gfs-toggle input{opacity:0;width:0;height:0}
  .gfs-slider{position:absolute;cursor:pointer;inset:0;background:#334155;transition:.3s;border-radius:22px}
  .gfs-slider:before{position:absolute;content:"";height:16px;width:16px;left:3px;bottom:3px;background:#fff;transition:.3s;border-radius:50%}
  input:checked + .gfs-slider{background:linear-gradient(135deg,#6366f1,#8b5cf6)}
  input:checked + .gfs-slider:before{transform:translateX(18px)}

  #gfs-stealth-btn{position:fixed;right:20px;bottom:20px;width:56px;height:56px;background:linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7);border-radius:50%;display:none;align-items:center;justify-content:center;color:#fff;cursor:pointer;box-shadow:0 12px 32px rgba(99,102,241,.55);z-index:2147483646;animation:gfsGlow 2s infinite;transition:all .3s}
  #gfs-stealth-btn svg{width:24px;height:24px}
  #gfs-stealth-btn.active{display:flex}
  #gfs-stealth-btn:hover{transform:scale(1.15)}

  .gfs-switch-row{display:flex;justify-content:space-between;align-items:center;padding:11px 13px;background:rgba(11,18,32,.7);border:1px solid rgba(51,65,85,.6);border-radius:11px;margin-bottom:9px}
  .gfs-switch-lbl{font-size:11.5px;color:#cbd5e1;font-weight:700}
  .gfs-switch-desc{font-size:9.5px;color:#64748b;margin-top:2px}
  .gfs-persona{font-size:10px;color:#a5b4fc;margin-bottom:10px;padding:10px 12px;background:linear-gradient(135deg,rgba(139,92,246,.15),rgba(99,102,241,.08));border-left:2px solid #8b5cf6;border-radius:0 10px 10px 0;line-height:1.55;font-style:italic}

  .gfs-chat-wrap{display:flex;flex-direction:column;height:420px;background:rgba(2,6,23,.6);border:1px solid rgba(30,41,59,.9);border-radius:14px;overflow:hidden}
  .gfs-chat-hdr{padding:10px 14px;background:linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.08));border-bottom:1px solid rgba(139,92,246,.2);font-size:11px;color:#a5b4fc;font-weight:700;display:flex;align-items:center;justify-content:space-between}
  .gfs-chat-hdr svg{width:14px;height:14px}
  .gfs-chat-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}
  .gfs-chat-msgs::-webkit-scrollbar{width:5px}
  .gfs-chat-msgs::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#6366f1,#8b5cf6);border-radius:3px}
  .gfs-msg{max-width:85%;padding:10px 13px;border-radius:14px;font-size:12px;line-height:1.55;word-wrap:break-word;white-space:pre-wrap;animation:gfsTabIn .3s}
  .gfs-msg.user{align-self:flex-end;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border-bottom-right-radius:4px}
  .gfs-msg.ai{align-self:flex-start;background:linear-gradient(135deg,rgba(30,41,59,.95),rgba(51,65,85,.85));color:#e2e8f0;border-bottom-left-radius:4px;border:1px solid rgba(139,92,246,.2)}
  .gfs-msg.err{align-self:flex-start;background:rgba(69,10,10,.9);color:#fca5a5;border:1px solid rgba(239,68,68,.3)}
  .gfs-msg.sys{align-self:center;background:rgba(99,102,241,.15);color:#c7d2fe;border:1px dashed rgba(99,102,241,.4);font-size:11px;text-align:center;max-width:95%}
  .gfs-msg-dot{display:inline-flex;gap:3px;padding:4px 0}
  .gfs-msg-dot span{width:6px;height:6px;border-radius:50%;background:#a5b4fc;animation:gfsDot 1.2s infinite}
  .gfs-msg-dot span:nth-child(2){animation-delay:.2s}
  .gfs-msg-dot span:nth-child(3){animation-delay:.4s}
  .gfs-chat-input{display:flex;gap:8px;padding:10px;border-top:1px solid rgba(30,41,59,.9);background:rgba(11,18,32,.8)}
  .gfs-chat-input textarea{flex:1;padding:10px 12px;background:rgba(2,6,23,.7);border:1px solid rgba(51,65,85,.8);border-radius:10px;color:#e2e8f0;font-size:12px;font-family:inherit;resize:none;outline:none;max-height:100px;min-height:42px;line-height:1.4}
  .gfs-chat-input textarea:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.18)}
  .gfs-chat-send{width:44px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:10px;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .gfs-chat-send svg{width:16px;height:16px}
  .gfs-chat-send:hover:not(:disabled){transform:scale(1.08)}
  .gfs-chat-send:disabled{opacity:.5;cursor:not-allowed}
  .gfs-chat-chip{display:flex;flex-wrap:wrap;gap:6px;padding:0 10px 10px}
  .gfs-chip{padding:5px 10px;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);border-radius:12px;color:#c7d2fe;font-size:10px;cursor:pointer}
  .gfs-chip:hover{background:rgba(99,102,241,.3)}
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  const stealthBtn = document.createElement('div');
  stealthBtn.id = 'gfs-stealth-btn';
  stealthBtn.innerHTML = SVG.bolt;
  stealthBtn.onclick = () => { state.stealth = false; panel.style.display = 'flex'; stealthBtn.classList.remove('active'); };
  document.body.appendChild(stealthBtn);

  const panel = document.createElement('div');
  panel.id = 'gfs-panel';
  panel.innerHTML = `
    <div class="gfs-hdr" id="gfs-hdr">
      <div class="gfs-hdr-title">
        <div class="gfs-logo">${SVG.bolt}</div>
        <span>GFS AI Solver</span>
        <span class="gfs-status" id="gfs-status"></span>
      </div>
      <div class="gfs-hdr-btns">
        <button id="gfs-min" title="Minimize">${SVG.minus}</button>
        <button id="gfs-stealth" title="Stealth">${SVG.ghost}</button>
        <button id="gfs-close" title="Close">${SVG.close}</button>
      </div>
    </div>
    <div class="gfs-tabs">
      <button class="gfs-tab active" data-tab="solve">${SVG.play}<span>Solve</span></button>
      <button class="gfs-tab" data-tab="chat">${SVG.chat}<span>Chat</span></button>
      <button class="gfs-tab" data-tab="explain">${SVG.book}<span>Explain</span></button>
      <button class="gfs-tab" data-tab="settings">${SVG.settings}<span>Config</span></button>
      <button class="gfs-tab" data-tab="log">${SVG.code}<span>Log</span></button>
      <button class="gfs-tab" data-tab="credit">${SVG.heart}<span>Credit</span></button>
    </div>
    <div class="gfs-body" id="gfs-body">
      <div class="gfs-tab-panel active" data-panel="solve">
        <div class="gfs-tip" id="gfs-tip">${SVG.sparkle}<span>Groq · openai/gpt-oss-120b</span></div>
        <div class="gfs-persona" id="gfs-persona">Persona: —</div>
        <div class="gfs-row" style="margin-top:6px">
          <button class="gfs-btn gfs-btn-main" id="gfs-solve">${SVG.rocket}<span>NYELESAIN SOAL</span></button>
        </div>
        <div class="gfs-progress" id="gfs-progress"><div class="gfs-progress-fill" id="gfs-progress-fill"></div></div>
        <div class="gfs-row-3" style="margin-top:14px">
          <button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-parse">${SVG.search}<span>CEK</span></button>
          <button class="gfs-btn gfs-btn-stealth gfs-btn-sm" id="gfs-expl-toggle">${SVG.book}<span>EXPLAIN</span></button>
          <button class="gfs-btn gfs-btn-danger gfs-btn-sm" id="gfs-clear">${SVG.trash}<span>CLEAR</span></button>
        </div>
        <div class="gfs-score" id="gfs-score">
          <div class="gfs-score-h">${SVG.star}<span>HASIL</span></div>
          <div class="gfs-score-v" id="gfs-score-v">-</div>
          <div class="gfs-score-d" id="gfs-score-d"></div>
        </div>
      </div>
      <div class="gfs-tab-panel" data-panel="chat">
        <div class="gfs-chat-wrap">
          <div class="gfs-chat-hdr">
            <span style="display:flex;align-items:center;gap:6px">${SVG.chat}<span id="gfs-chat-model">Chat AI · —</span></span>
            <button style="background:none;border:none;color:#94a3b8;cursor:pointer;padding:2px" id="gfs-chat-clear" title="Clear chat">${SVG.trash}</button>
          </div>
          <div class="gfs-chat-msgs" id="gfs-chat-msgs">
            <div class="gfs-msg ai">Halo! Tanya apa aja. Atau ketik perintah auto-solve, contoh: "kerjain nomor 1-5" · "jawab nomor 3" · "isi nomor 1-dst"</div>
          </div>
          <div class="gfs-chat-chip" id="gfs-chat-chip">
            <span class="gfs-chip" data-p="kerjain nomor 1-dst">Semua soal</span>
            <span class="gfs-chip" data-p="kerjain nomor 1-5">Nomor 1-5</span>
            <span class="gfs-chip" data-p="Jelaskan konsep ini lebih dalam">Jelaskan</span>
            <span class="gfs-chip" data-p="Ringkas jawaban ini dalam 1 paragraf">Ringkas</span>
          </div>
          <div class="gfs-chat-input">
            <textarea id="gfs-chat-input" placeholder="Ketik pesan atau perintah... (Enter kirim)" rows="1"></textarea>
            <button class="gfs-chat-send" id="gfs-chat-send">${SVG.send}</button>
          </div>
        </div>
      </div>
      <div class="gfs-tab-panel" data-panel="explain">
        <div class="gfs-expl-list" id="gfs-expl-list"><div style="color:#64748b;font-size:11px;text-align:center;padding:24px">✦ Belum ada penjelasan ✦</div></div>
      </div>
      <div class="gfs-tab-panel" data-panel="settings">
        <div class="gfs-row"><label class="gfs-lbl">${SVG.sparkle}<span>Provider</span></label><select class="gfs-select" id="gfs-provider"><option value="groq">Groq</option><option value="cloudflare">Cloudflare AI</option><option value="openrouter">OpenRouter</option><option value="openai">OpenAI</option></select></div>
        <div class="gfs-row"><label class="gfs-lbl">${SVG.code}<span>Model</span></label><select class="gfs-select" id="gfs-model"></select></div>
        <div class="gfs-row" id="gfs-key-row"><label class="gfs-lbl">${SVG.id}<span>API Key</span><span class="gfs-hint" id="gfs-key-hint">auto</span></label><div class="gfs-input-wrap"><input class="gfs-input" id="gfs-key" type="password" autocomplete="off"><button class="gfs-eye" id="gfs-eye" type="button">${SVG.eye}</button></div></div>
        <div class="gfs-row">
          <div class="gfs-switch-row"><div><div class="gfs-switch-lbl">Auto-Scroll</div><div class="gfs-switch-desc">Scroll ke soal</div></div><label class="gfs-toggle"><input type="checkbox" id="gfs-opt-scroll" checked><span class="gfs-slider"></span></label></div>
          <div class="gfs-switch-row"><div><div class="gfs-switch-lbl">Auto-Explanation</div><div class="gfs-switch-desc">AI jelasin jawaban</div></div><label class="gfs-toggle"><input type="checkbox" id="gfs-opt-explain" checked><span class="gfs-slider"></span></label></div>
          <div class="gfs-switch-row"><div><div class="gfs-switch-lbl">Show Personality</div><div class="gfs-switch-desc">Tampilkan persona AI</div></div><label class="gfs-toggle"><input type="checkbox" id="gfs-opt-persona" checked><span class="gfs-slider"></span></label></div>
        </div>
        <div class="gfs-row-2"><button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-save">${SVG.download}<span>SAVE</span></button><button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-load">${SVG.rocket}<span>LOAD</span></button></div>
      </div>
      <div class="gfs-tab-panel" data-panel="log">
        <div class="gfs-row-2" style="margin-bottom:10px">
          <button class="gfs-btn gfs-btn-sec gfs-btn-sm" id="gfs-export">${SVG.download}<span>EXPORT</span></button>
          <button class="gfs-btn gfs-btn-danger gfs-btn-sm" id="gfs-clearlog">${SVG.trash}<span>CLEAR</span></button>
        </div>
        <div class="gfs-log" id="gfs-log"><div>Ready.</div></div>
      </div>
      <div class="gfs-tab-panel" data-panel="credit">
        <div style="background:linear-gradient(160deg,rgba(99,102,241,.15),rgba(139,92,246,.08));border:1px solid rgba(139,92,246,.35);border-radius:16px;padding:22px;text-align:center">
          <div style="width:80px;height:80px;margin:0 auto 14px;background:linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 12px 32px rgba(139,92,246,.5)">${SVG.user}</div>
          <div style="font-size:22px;font-weight:900;background:linear-gradient(135deg,#a5b4fc,#c4b5fd,#e9d5ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-.5px">ALIP / ALRECT</div>
          <div style="font-size:10.5px;color:#94a3b8;text-transform:uppercase;letter-spacing:2px;font-weight:700;margin-top:4px;margin-bottom:16px">Developer</div>
          <a style="display:flex;align-items:center;justify-content:center;gap:10px;padding:14px;background:linear-gradient(135deg,#14532d,#166534);border:1px solid rgba(74,222,128,.4);border-radius:12px;color:#fff;font-weight:800;text-decoration:none" href="https://wa.me/6282192401340" target="_blank">
            ${SVG.whatsapp}
            <div style="display:flex;flex-direction:column;align-items:flex-start;line-height:1.3">
              <span style="font-size:9px;opacity:.8;letter-spacing:1px">ORDER NOW</span>
              <span style="font-size:14px;font-weight:900">+62 821-9240-1340</span>
            </div>
          </a>
          <div style="margin-top:16px;font-size:9.5px;color:#475569">GFS AI Solver v16 · © 2026</div>
        </div>
      </div>
    </div>
    <div class="gfs-footer"><span>⚡ GFS v16</span><span class="gfs-badge" id="gfs-footer-stat">idle</span></div>`;
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
    while (el.children.length > 500) el.removeChild(el.firstChild);
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
    if (HARDCODED_KEYS[p]) { $('gfs-key').value = HARDCODED_KEYS[p]; $('gfs-key-hint').textContent = 'auto'; }
    else { $('gfs-key').value = ''; $('gfs-key-hint').textContent = 'manual'; }
    const bs = BATCH_SIZE[p] || 6;
    $('gfs-tip').innerHTML = SVG.sparkle + '<span>' + p + ' · ' + sel.value + ' · batch ' + bs + '</span>';
    if ($('gfs-opt-persona').checked) $('gfs-persona').textContent = 'Persona: ' + (PERSONALITY[p] || '—');
    $('gfs-chat-model').textContent = 'Chat AI · ' + p + ' / ' + sel.value;
  };
  $('gfs-provider').onchange = updateModels;
  $('gfs-model').onchange = () => {
    $('gfs-tip').innerHTML = SVG.sparkle + '<span>' + $('gfs-provider').value + ' · ' + $('gfs-model').value + '</span>';
    $('gfs-chat-model').textContent = 'Chat AI · ' + $('gfs-provider').value + ' / ' + $('gfs-model').value;
  };
  $('gfs-opt-persona').onchange = () => { $('gfs-persona').style.display = $('gfs-opt-persona').checked ? 'block' : 'none'; if ($('gfs-opt-persona').checked) $('gfs-persona').textContent = 'Persona: ' + (PERSONALITY[$('gfs-provider').value] || '—'); };

  $('gfs-save').onclick = () => { localStorage.setItem('gfs_config', JSON.stringify({ provider: $('gfs-provider').value, model: $('gfs-model').value, key: $('gfs-key').value, oS: $('gfs-opt-scroll').checked, oE: $('gfs-opt-explain').checked, oP: $('gfs-opt-persona').checked })); log('Saved.', 'ok'); };
  $('gfs-load').onclick = () => { try { const c = JSON.parse(localStorage.getItem('gfs_config') || '{}'); if (c.provider) { $('gfs-provider').value = c.provider; updateModels(); } if (c.model) $('gfs-model').value = c.model; if (c.key && !HARDCODED_KEYS[$('gfs-provider').value]) $('gfs-key').value = c.key; if (c.oS !== undefined) $('gfs-opt-scroll').checked = c.oS; if (c.oE !== undefined) $('gfs-opt-explain').checked = c.oE; if (c.oP !== undefined) $('gfs-opt-persona').checked = c.oP; log('Loaded.', 'ok'); } catch (e) { log('Load gagal', 'err'); } };

  $('gfs-export').onclick = () => { const txt = [...$('gfs-log').children].map((c) => c.textContent).join('\n'); const blob = new Blob([txt], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'gfs-log.txt'; a.click(); };
  $('gfs-clearlog').onclick = () => { $('gfs-log').innerHTML = ''; };
  $('gfs-min').onclick = () => { const b = $('gfs-body'), t = panel.querySelector('.gfs-tabs'), f = panel.querySelector('.gfs-footer'); const h = b.style.display === 'none'; b.style.display = h ? '' : 'none'; t.style.display = h ? '' : 'none'; f.style.display = h ? '' : 'none'; $('gfs-min').innerHTML = h ? SVG.minus : SVG.plus; };

  const hdr = $('gfs-hdr');
  let drag = false, ox = 0, oy = 0;
  const sD = (x, y) => { const r = panel.getBoundingClientRect(); drag = true; ox = x - r.left; oy = y - r.top; panel.style.transform = 'none'; panel.style.animation = 'none'; panel.style.left = r.left + 'px'; panel.style.top = r.top + 'px'; };
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
      const radios = [...g.querySelectorAll('div[role="radio"]')];
      const opts = radios.map((r) => {
        let text = (r.innerText || '').trim();
        if (!text) { const inner = r.querySelector('span, label, [dir]'); if (inner && inner.innerText) text = inner.innerText.trim(); }
        if (!text && r.parentElement) { const wrapperText = (r.parentElement.innerText || '').trim(); const lines = wrapperText.split('\n').map(s => s.trim()).filter(Boolean); if (lines.length > 0) text = lines.find(l => !/^\d+$/.test(l)) || lines[0]; }
        if (!text) text = r.getAttribute('aria-label') || r.getAttribute('data-value') || '';
        if (!text && r.nextElementSibling) text = (r.nextElementSibling.innerText || '').trim();
        return { text, el: r };
      }).filter(o => o.text);
      if (opts.length) questions.push({ idx: i, qText, opts, group: g });
    });
    return questions;
  };

  $('gfs-parse').onclick = () => {
    const q = parseQuestions();
    log('Ditemukan ' + q.length + ' soal.', 'ok');
    q.slice(0, 3).forEach((item, i) => { log('Q' + (i + 1) + ': ' + (item.qText || '(no text)').slice(0, 60), 'info'); item.opts.forEach((o, j) => log('   ' + (j + 1) + '. ' + o.text.slice(0, 70), 'info')); });
  };
  $('gfs-clear').onclick = () => { let c = 0; document.querySelectorAll('div[role="radio"][aria-checked="true"]').forEach((el) => { el.click(); c++; }); log('Cleared ' + c + '.', 'warn'); };
  $('gfs-expl-toggle').onclick = () => { document.querySelectorAll('.gfs-tab').forEach((t) => t.classList.remove('active')); document.querySelectorAll('.gfs-tab-panel').forEach((p) => p.classList.remove('active')); document.querySelector('.gfs-tab[data-tab="explain"]').classList.add('active'); document.querySelector('.gfs-tab-panel[data-panel="explain"]').classList.add('active'); };

  const callGroq = async (key, model, prompt, persona) => {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: persona + ' You answer MCQ. Return JSON: {"answers":[{"i":<index>,"a":"<option text>"}]}. Output JSON only.' }, { role: 'user', content: prompt }], response_format: { type: 'json_object' }, temperature: 0.1, max_tokens: 2000 })
    });
    if (!res.ok) throw new Error('Groq ' + res.status + ': ' + (await res.text()).slice(0, 150));
    const data = await res.json();
    return data.choices[0].message.content;
  };
  const callOpenRouter = async (key, model, prompt, persona) => {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: persona + ' Return JSON: {"answers":[{"i":<index>,"a":"<option text>"}]}.' }, { role: 'user', content: prompt }], response_format: { type: 'json_object' }, temperature: 0.1, max_tokens: 2000 })
    });
    if (!res.ok) throw new Error('OpenRouter ' + res.status);
    const data = await res.json();
    return data.choices[0].message.content;
  };
  const callOpenAI = async (key, model, prompt, persona) => {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: persona + ' Return JSON: {"answers":[{"i":<index>,"a":"<option text>"}]}.' }, { role: 'user', content: prompt }], response_format: { type: 'json_object' }, max_tokens: 2000 })
    });
    if (!res.ok) throw new Error('OpenAI ' + res.status);
    const data = await res.json();
    return data.choices[0].message.content;
  };
  const callCloudflare = async (token, model, prompt, persona) => {
    const url = 'https://api.cloudflare.com/client/v4/accounts/' + CF_ACCOUNT_ID + '/ai/run/' + model;
    const res = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ messages: [{ role: 'system', content: persona + ' You answer MCQ. Return JSON: {"answers":[{"i":<index>,"a":"<option text PERSIS>"}]}. Output JSON only.' }, { role: 'user', content: prompt }] })
    });
    if (!res.ok) throw new Error('Cloudflare ' + res.status + ': ' + (await res.text()).slice(0, 200));
    const data = await res.json();
    if (!data.success) throw new Error('Cloudflare fail');
    let text = data?.result?.response;
    if (!text && data?.result?.choices?.[0]?.message?.content) text = data.result.choices[0].message.content;
    if (!text) throw new Error('Cloudflare empty.');
    return text;
  };

  const chatGroq = async (key, model, messages, persona) => {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: persona + ' Kamu asisten chat cerdas. Jawab natural, ringkas, jelas. Bahasa Indonesia santai.' }, ...messages], temperature: 0.6, max_tokens: 2000 })
    });
    if (!res.ok) throw new Error('Groq ' + res.status + ': ' + (await res.text()).slice(0, 200));
    const data = await res.json();
    return data.choices[0].message.content;
  };
  const chatOpenRouter = async (key, model, messages, persona) => {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: persona + ' Kamu asisten chat cerdas. Jawab natural, ringkas.' }, ...messages], temperature: 0.6, max_tokens: 2000 })
    });
    if (!res.ok) throw new Error('OpenRouter ' + res.status);
    const data = await res.json();
    return data.choices[0].message.content;
  };
  const chatOpenAI = async (key, model, messages, persona) => {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: persona + ' Kamu asisten chat cerdas. Jawab natural, ringkas.' }, ...messages], temperature: 0.6, max_tokens: 2000 })
    });
    if (!res.ok) throw new Error('OpenAI ' + res.status);
    const data = await res.json();
    return data.choices[0].message.content;
  };
  const chatCloudflare = async (token, model, messages, persona) => {
    const url = 'https://api.cloudflare.com/client/v4/accounts/' + CF_ACCOUNT_ID + '/ai/run/' + model;
    const res = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ messages: [{ role: 'system', content: persona + ' Kamu asisten chat cerdas. Jawab natural, ringkas.' }, ...messages] })
    });
    if (!res.ok) throw new Error('Cloudflare ' + res.status);
    const data = await res.json();
    if (!data.success) throw new Error('Cloudflare fail');
    let text = data?.result?.response;
    if (!text && data?.result?.choices?.[0]?.message?.content) text = data.result.choices[0].message.content;
    if (!text) throw new Error('Cloudflare empty.');
    return text;
  };
  const chatDispatch = async (provider, key, model, messages, persona) => {
    if (provider === 'groq') return chatGroq(key, model, messages, persona);
    if (provider === 'cloudflare') return chatCloudflare(key, model, messages, persona);
    if (provider === 'openrouter') return chatOpenRouter(key, model, messages, persona);
    return chatOpenAI(key, model, messages, persona);
  };

  // ─── CHAT UI ───
  const chatMsgs = $('gfs-chat-msgs');
  const chatInput = $('gfs-chat-input');
  const chatSend = $('gfs-chat-send');

  const appendMsg = (text, role) => {
    const div = document.createElement('div');
    div.className = 'gfs-msg ' + role;
    div.textContent = text;
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
    return div;
  };
  const appendTyping = () => {
    const div = document.createElement('div');
    div.className = 'gfs-msg ai';
    div.innerHTML = '<div class="gfs-msg-dot"><span></span><span></span><span></span></div>';
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
    return div;
  };

  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
  });
  chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doChat(); } });
  chatSend.onclick = doChat;

  // ─── NUMBER INTENT PARSER ───
  // Deteksi: kerjain nomor 1-5 / jawab no 3 / isi nomor 1-dst / solve no 2 sampai 8
  const parseNumberIntent = (text) => {
    const re = /(?:kerjain|kerjakan|jawab|jawabin|isi|isin|solve|do|gas|gasin)\s+(?:soal\s+)?(?:nomor|no|number|ke-)\s*(\d+)(?:\s*(?:-|–|—|sampai|sd|s\/d|to|hingga|sampé|ampe|ampek)\s*(\d+|dst|habis|akhir|semua|end|all|beres))?/i;
    const m = text.match(re);
    if (!m) return null;
    const start = parseInt(m[1], 10);
    if (!start || start < 1) return null;
    let end = start;
    if (m[2]) {
      if (/^\d+$/.test(m[2])) end = parseInt(m[2], 10);
      else end = Infinity;
    }
    if (end !== Infinity && end < start) end = start;
    return { start, end };
  };

  // ─── AUTO-SOLVE BY RANGE (dipanggil dari chat) ───
  async function solveRange(start, end) {
    const key = $('gfs-key').value.trim();
    const provider = $('gfs-provider').value;
    const model = $('gfs-model').value;
    if (!key) { appendMsg('API key kosong. Isi di tab Config.', 'err'); return; }

    const allQ = parseQuestions();
    if (!allQ.length) { appendMsg('Nggak ada soal ke-parse di halaman ini.', 'err'); return; }

    const realEnd = end === Infinity ? allQ.length : Math.min(end, allQ.length);
    if (start > allQ.length) { appendMsg('Nomor ' + start + ' di luar range. Total soal: ' + allQ.length, 'err'); return; }

    const targets = allQ.slice(start - 1, realEnd);
    if (!targets.length) { appendMsg('Range kosong.', 'err'); return; }

    appendMsg('⚡ Auto-solve nomor ' + start + '–' + realEnd + ' · ' + targets.length + ' soal', 'sys');
    const typing = appendTyping();

    state.running = true; setStatus('running'); $('gfs-status').classList.add('busy'); chatSend.disabled = true;
    log('⚡ Range solve ' + start + '-' + realEnd + ' via ' + provider + '/' + model, 'ai');

    try {
      const persona = PERSONALITY[provider] || '';
      const wantExplain = $('gfs-opt-explain').checked;
      const bs = BATCH_SIZE[provider] || 6;
      const totalBatches = Math.ceil(targets.length / bs);
      const allAnswers = [];
      const allMatches = {};

      for (let b = 0; b < totalBatches; b++) {
        const s = b * bs;
        const batch = targets.slice(s, s + bs);
        const prompt = 'Jawab soal pilihan ganda berikut. Pilih opsi PALING TEPAT.\nBALAS HANYA JSON: {"answers":[{"i":<index>,"a":"<teks opsi PERSIS>"' + (wantExplain ? ',"reason":"<alasan singkat>"' : '') + '}]}\n\nSOAL:\n' + batch.map((q) => '[' + q.idx + '] ' + q.qText + '\n' + q.opts.map(o => '- ' + o.text).join('\n')).join('\n\n');

        let raw;
        if (provider === 'groq') raw = await callGroq(key, model, prompt, persona);
        else if (provider === 'cloudflare') raw = await callCloudflare(key, model, prompt, persona);
        else if (provider === 'openrouter') raw = await callOpenRouter(key, model, prompt, persona);
        else raw = await callOpenAI(key, model, prompt, persona);

        try {
          const answers = parseResponse(raw);
          answers.forEach(a => allAnswers.push(a));
          log('Batch ' + (b + 1) + ' → ' + answers.length + ' jawaban', 'ok');
        } catch (e) { log('Parse gagal batch ' + (b + 1), 'warn'); }
        await sleep(500);
      }

      let clicked = 0, skipped = 0;
      for (const a of allAnswers) {
        const q = allQ[a.idx]; if (!q) continue;
        const mt = findOption(q, a.answer);
        allMatches[a.idx] = mt;
        if (mt.el) {
          if ($('gfs-opt-scroll').checked) mt.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await sleep(80); mt.el.click(); clicked++;
        } else skipped++;
        await sleep(120);
      }

      renderExplanations(allAnswers, allQ, allMatches);
      typing.remove();
      appendMsg('✓ Selesai. Nomor ' + start + '–' + realEnd + ' · Terisi: ' + clicked + '/' + targets.length + ' · Skip: ' + skipped, 'ai');
      log('Range solve selesai: ' + clicked + '/' + targets.length, 'ok');
      setStatus('done');
    } catch (e) {
      typing.remove();
      appendMsg('ERROR: ' + e.message, 'err');
      log('Range solve error: ' + e.message, 'err');
      setStatus('error');
    } finally {
      state.running = false; chatSend.disabled = false; $('gfs-status').classList.remove('busy');
    }
  }

  async function doChat() {
    const text = chatInput.value.trim();
    if (!text || state.running) return;

    // ─── CEK INTENT AUTO-SOLVE ───
    const intent = parseNumberIntent(text);
    if (intent) {
      appendMsg(text, 'user');
      chatInput.value = '';
      chatInput.style.height = 'auto';
      log('Intent terdeteksi: nomor ' + intent.start + ' → ' + (intent.end === Infinity ? 'akhir' : intent.end), 'ai');
      await solveRange(intent.start, intent.end);
      return;
    }

    // ─── CHAT NORMAL ───
    const key = $('gfs-key').value.trim();
    const provider = $('gfs-provider').value;
    const model = $('gfs-model').value;
    if (!key) { appendMsg('API key kosong. Isi di tab Config.', 'err'); return; }

    appendMsg(text, 'user');
    chatInput.value = '';
    chatInput.style.height = 'auto';
    state.chatHistory.push({ role: 'user', content: text });

    state.running = true;
    setStatus('running'); $('gfs-status').classList.add('busy');
    chatSend.disabled = true;
    const typing = appendTyping();

    try {
      const persona = PERSONALITY[provider] || '';
      const reply = await chatDispatch(provider, key, model, state.chatHistory.slice(-20), persona);
      typing.remove();
      appendMsg(reply, 'ai');
      state.chatHistory.push({ role: 'assistant', content: reply });
      log('Chat reply (' + reply.length + ' chars)', 'ok');
      setStatus('done');
    } catch (e) {
      typing.remove();
      appendMsg('ERROR: ' + e.message, 'err');
      log('Chat error: ' + e.message, 'err');
      setStatus('error');
    } finally {
      state.running = false; chatSend.disabled = false;
      $('gfs-status').classList.remove('busy');
    }
  }

  document.querySelectorAll('.gfs-chip').forEach((chip) => {
    chip.onclick = () => { chatInput.value = chip.dataset.p; chatInput.focus(); };
  });

  $('gfs-chat-clear').onclick = () => {
    state.chatHistory = [];
    chatMsgs.innerHTML = '';
    appendMsg('Chat dibersihkan.', 'ai');
    log('Chat history cleared.', 'warn');
  };

  // ─── CORE SOLVE UTILS ───
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
    let m = q.opts.find(o => o.text === raw);
    if (m) return { el: m.el, reason: 'exact' };
    const stripped = raw.replace(/^\s*[A-Za-z0-9][.)\-:]\s*/, '').trim();
    if (stripped !== raw) { m = q.opts.find(o => o.text === stripped); if (m) return { el: m.el, reason: 'exact-strip' }; }
    const nRaw = normalize(raw), nStrip = normalize(stripped);
    m = q.opts.find(o => normalize(o.text) === nRaw);
    if (m) return { el: m.el, reason: 'normal' };
    if (nStrip !== nRaw) { m = q.opts.find(o => normalize(o.text) === nStrip); if (m) return { el: m.el, reason: 'normal-strip' }; }
    const cands = q.opts.filter(o => { const no = normalize(o.text); return no.length > 0 && nStrip.length >= no.length * 0.5 && (no.includes(nStrip) || nStrip.includes(no)); });
    if (cands.length === 1) return { el: cands[0].el, reason: 'contains-1' };
    if (cands.length > 1) {
      cands.sort((a, b) => { const oa = normalize(a.text), ob = normalize(b.text); const sA = oa.includes(nStrip) ? nStrip.length / oa.length : oa.length / nStrip.length; const sB = ob.includes(nStrip) ? nStrip.length / ob.length : ob.length / nStrip.length; return sB - sA; });
      return { el: cands[0].el, reason: 'contains-best' };
    }
    for (const opt of q.opts) {
      const no = normalize(opt.text);
      const words = no.split(' ').filter(w => w.length > 3);
      if (words.length > 0 && words.every(w => nStrip.includes(w))) return { el: opt.el, reason: 'word-match' };
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
      item.innerHTML = '<div class="gfs-expl-num">' + SVG.sparkle + ' Q' + (a.idx + 1) + ' · ' + (mt.reason || '') + '</div>' + '<div class="gfs-expl-ans">' + (mt.reason === 'no-match' ? '✗ ' : '✓ ') + a.answer + '</div>' + '<div class="gfs-expl-reason">' + (a.reason || q.qText.slice(0, 150)) + '</div>' + '<div class="gfs-expl-conf">Conf: ' + (a.confidence * 100).toFixed(0) + '%</div>';
      list.appendChild(item);
    });
  };

  // ─── SOLVE ALL BUTTON ───
  $('gfs-solve').onclick = async () => {
    if (state.running) return;
    const key = $('gfs-key').value.trim();
    const provider = $('gfs-provider').value;
    const model = $('gfs-model').value;
    if (!key) return log('API key kosong.', 'err');

    const questions = parseQuestions();
    if (!questions.length) { log('Nggak ada soal ke-parse!', 'err'); return; }

    state.running = true; setStatus('running'); $('gfs-status').classList.add('busy');
    const btn = $('gfs-solve'); btn.disabled = true; btn.innerHTML = SVG.rocket + '<span>PROCESSING...</span>';
    $('gfs-progress').classList.add('active');

    const wantExplain = $('gfs-opt-explain').checked;
    const persona = PERSONALITY[provider] || '';
    const bs = BATCH_SIZE[provider] || 6;
    const totalBatches = Math.ceil(questions.length / bs);

    log('═══ ' + provider + ' · ' + model + ' ═══', 'ai');
    log('Total: ' + questions.length + ' soal · ' + totalBatches + ' batch', 'info');

    const allAnswers = [];
    const allMatches = {};

    try {
      for (let b = 0; b < totalBatches; b++) {
        const start = b * bs;
        const batch = questions.slice(start, start + bs);
        log('══ Batch ' + (b + 1) + '/' + totalBatches + ' ══', 'info');
        const batchPrompt = 'Jawab soal pilihan ganda berikut.\nBALAS JSON: {"answers":[{"i":' + start + ',"a":"<teks opsi PERSIS>"' + (wantExplain ? ',"reason":"<alasan>"' : '') + '}]}\n\nSOAL:\n' + batch.map((q, i) => '[' + (start + i) + '] ' + q.qText + '\n' + q.opts.map(o => '- ' + o.text).join('\n')).join('\n\n');

        let raw;
        try {
          if (provider === 'groq') raw = await callGroq(key, model, batchPrompt, persona);
          else if (provider === 'cloudflare') raw = await callCloudflare(key, model, batchPrompt, persona);
          else if (provider === 'openrouter') raw = await callOpenRouter(key, model, batchPrompt, persona);
          else raw = await callOpenAI(key, model, batchPrompt, persona);
          log('Batch ' + (b + 1) + ' OK', 'ok');
        } catch (e) { log('Batch ' + (b + 1) + ' gagal: ' + e.message, 'err'); await sleep(1500); continue; }

        try {
          const answers = parseResponse(raw);
          log('Batch ' + (b + 1) + ' → ' + answers.length + ' jawaban', 'ok');
          answers.forEach(a => allAnswers.push(a));
        } catch (e) { log('Parse gagal: ' + e.message, 'warn'); }
        await sleep(800);
      }

      let clicked = 0, skipped = 0;
      for (let i = 0; i < allAnswers.length; i++) {
        const a = allAnswers[i];
        $('gfs-progress-fill').style.width = Math.round(((i + 1) / allAnswers.length) * 100) + '%';
        const q = questions[a.idx]; if (!q) continue;
        const mt = findOption(q, a.answer);
        allMatches[a.idx] = mt;
        log('Q' + a.idx + ' → "' + a.answer.slice(0, 40) + '" · ' + mt.reason, 'info');
        if (mt.el) {
          if ($('gfs-opt-scroll').checked) mt.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await sleep(100); mt.el.click(); clicked++; log('  ✓', 'ok');
        } else { skipped++; log('  ✗', 'err'); }
        await sleep(150);
      }

      renderExplanations(allAnswers, questions, allMatches);
      $('gfs-score').classList.add('active');
      $('gfs-score-v').textContent = clicked + '/' + questions.length;
      $('gfs-score-d').textContent = 'Provider: ' + provider + ' · Terisi: ' + clicked + ' · Skip: ' + skipped;
      setStatus('done');
      log('═══ SELESAI: ' + clicked + '/' + questions.length + ' ═══', 'ok');
    } catch (e) { log('ERROR: ' + e.message, 'err'); setStatus('error'); }
    finally {
      btn.disabled = false; btn.innerHTML = SVG.rocket + '<span>NYELESAIN SOAL</span>';
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
  log('GFS v16 by Alip/Alrect. + Chat Auto-Solve by Number.', 'ok');
})();
