/* GFS Quizizz Solver PRO v1 — by Alip/Alrect — Auto-solve Quizizz */
(function () {
  if (window.__GQZ_LOADED__) { document.getElementById('gqz-panel')?.remove(); document.getElementById('gqz-stealth-btn')?.remove(); window.__GQZ_LOADED__ = false; return; }
  window.__GQZ_LOADED__ = true;

  const CF_ACCOUNT_ID = '7f83137df22c15f252e1da2ee2214a6c';
  const CF_API_TOKEN = 'cfut_2WkAuydB6WzZXAzdSIGz3kI5AxyEQVDOqllfGshz3568c7ff';

  const HARDCODED_KEYS = {
    groq: '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',
    openrouter: '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',
    cloudflare: CF_API_TOKEN
  };

  const PERSONALITY = {
    groq: '[Persona: Groq Llama — AI super cepat. Latency rendah, akurasi tinggi.]',
    openrouter: '[Persona: OpenRouter Aggregator — gateway ke berbagai model. Profesional, teliti.]',
    cloudflare: '[Persona: Cloudflare Workers AI — edge AI global.]',
    openai: '[Persona: OpenAI GPT-4o — asisten multimodal cerdas.]'
  };

  const state = { running: false, stealth: false, chatHistory: [], pending: null };
  const BATCH_SIZE = { groq: 6, openrouter: 6, openai: 6, cloudflare: 6 };

  const MODELS = {
    groq: ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'],
    openrouter: ['nvidia/nemotron-3-ultra-550b-a55b:free', 'nvidia/nemotron-3-super-120b-a12b:free'],
    cloudflare: [
      '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      '@cf/meta/llama-3.1-8b-instruct',
      '@cf/mistral/mistral-7b-instruct-v0.1',
      '@cf/meta/llama-3.2-3b-instruct'
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
    sparkle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 5.8L20 9.7l-5.8 1.9L12 17.4l-2.2-5.8L4 9.7l6.1-1.9L12 2z"/></svg>',
    rocket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91 0z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>',
    id: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 8h4M15 12h4M9 14c-1.5 0-3 .5-3 2h6c0-1.5-1.5-2-3-2z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>'
  };

  const CSS = `
  @keyframes gqzIn{0%{opacity:0;transform:translate(-50%,-50%) perspective(1000px) rotateX(-15deg) scale(.85)}100%{opacity:1;transform:translate(-50%,-50%) perspective(1000px) rotateX(0) scale(1)}}
  @keyframes gqzTabIn{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}
  @keyframes gqzPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.3);opacity:.5}}
  @keyframes gqzSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes gqzFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
  @keyframes gqzShine{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes gqzGlow{0%,100%{box-shadow:0 0 12px rgba(139,92,246,.5)}50%{box-shadow:0 0 20px rgba(139,92,246,.8)}}
  @keyframes gqzDot{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}

  #gqz-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:460px;max-width:94vw;background:linear-gradient(160deg,#0a0f1c 0%,#0f172a 50%,#0b1220 100%);color:#e2e8f0;border:1px solid rgba(139,92,246,.25);border-radius:20px;box-shadow:0 40px 100px rgba(0,0,0,.9);z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;display:flex;flex-direction:column;max-height:92vh;overflow:hidden;animation:gqzIn .5s cubic-bezier(.34,1.56,.64,1);backdrop-filter:blur(20px)}
  #gqz-panel *{box-sizing:border-box}
  #gqz-panel::-webkit-scrollbar{width:6px}
  #gqz-panel::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#6366f1,#8b5cf6);border-radius:3px}

  .gqz-hdr{padding:16px 18px;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 45%,#a855f7 100%);cursor:move;display:flex;justify-content:space-between;align-items:center;font-weight:800;font-size:15px;color:#fff;flex-shrink:0;position:relative;overflow:hidden}
  .gqz-hdr::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);background-size:200% 100%;animation:gqzShine 3s infinite;pointer-events:none}
  .gqz-hdr-title{display:flex;align-items:center;gap:10px;pointer-events:none;position:relative;z-index:1}
  .gqz-logo{width:30px;height:30px;background:rgba(255,255,255,.22);border-radius:10px;display:flex;align-items:center;justify-content:center;animation:gqzFloat 3s ease-in-out infinite}
  .gqz-logo svg{width:16px;height:16px;color:#fff}
  .gqz-status{width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 10px #4ade80;animation:gqzPulse 2s infinite}
  .gqz-status.busy{background:#facc15;animation:gqzSpin 1s linear infinite}
  .gqz-hdr-btns{display:flex;gap:6px;position:relative;z-index:1}
  .gqz-hdr button{background:rgba(255,255,255,.18);border:none;color:#fff;width:28px;height:28px;border-radius:9px;cursor:pointer;display:flex;align-items:center;justify-content:center}
  .gqz-hdr button svg{width:14px;height:14px}
  .gqz-hdr button:hover{background:rgba(255,255,255,.32);transform:scale(1.1)}

  .gqz-tabs{display:flex;background:rgba(11,18,32,.6);border-bottom:1px solid rgba(139,92,246,.15);padding:6px 8px 0;flex-shrink:0;gap:2px;overflow-x:auto}
  .gqz-tabs::-webkit-scrollbar{display:none}
  .gqz-tab{flex:1;min-width:58px;padding:11px 6px;background:none;border:none;color:#64748b;font-size:9.5px;font-weight:800;cursor:pointer;font-family:inherit;text-transform:uppercase;letter-spacing:.6px;transition:all .3s;border-radius:10px 10px 0 0;display:flex;align-items:center;justify-content:center;gap:4px;position:relative}
  .gqz-tab svg{width:13px;height:13px;opacity:.7}
  .gqz-tab::after{content:'';position:absolute;left:50%;bottom:0;transform:translateX(-50%) scaleX(0);width:70%;height:2px;background:linear-gradient(90deg,transparent,#818cf8,transparent);transition:transform .3s;border-radius:2px}
  .gqz-tab.active{color:#c7d2fe;background:linear-gradient(180deg,rgba(99,102,241,.15),rgba(99,102,241,.02))}
  .gqz-tab.active svg{opacity:1;color:#a5b4fc}
  .gqz-tab.active::after{transform:translateX(-50%) scaleX(1)}

  .gqz-body{padding:18px;overflow-y:auto;flex:1;min-height:0}
  .gqz-tab-panel{display:none}
  .gqz-tab-panel.active{display:block;animation:gqzTabIn .35s}
  .gqz-row{margin-bottom:13px}
  .gqz-lbl{display:flex;align-items:center;gap:5px;font-size:10px;color:#94a3b8;margin-bottom:7px;text-transform:uppercase;font-weight:800;letter-spacing:.7px}
  .gqz-lbl svg{width:12px;height:12px;color:#818cf8}
  .gqz-hint{font-size:9.5px;color:#475569;text-transform:none;margin-left:auto;font-weight:500}
  .gqz-input,.gqz-select{width:100%;padding:11px 13px;background:rgba(11,18,32,.7);border:1px solid rgba(51,65,85,.8);border-radius:11px;color:#e2e8f0;font-size:12.5px;font-family:inherit;outline:none;transition:all .25s}
  .gqz-input:focus,.gqz-select:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.18)}
  .gqz-input-wrap{position:relative}
  .gqz-input-wrap .gqz-input{padding-right:44px}
  .gqz-eye{position:absolute;right:5px;top:50%;transform:translateY(-50%);background:none;border:none;color:#64748b;cursor:pointer;padding:7px 10px;border-radius:7px}
  .gqz-eye svg{width:14px;height:14px}
  .gqz-eye:hover{color:#a5b4fc;background:rgba(99,102,241,.15)}

  .gqz-btn{width:100%;padding:13px;border:none;border-radius:11px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .3s}
  .gqz-btn svg{width:16px;height:16px}
  .gqz-btn-main{background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#a855f7 100%);color:#fff;box-shadow:0 8px 24px rgba(99,102,241,.45)}
  .gqz-btn-main:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 14px 32px rgba(99,102,241,.55)}
  .gqz-btn-main:disabled{opacity:.5;cursor:not-allowed}
  .gqz-btn-sec{background:rgba(30,41,59,.8);color:#cbd5e1;border:1px solid rgba(51,65,85,.9)}
  .gqz-btn-sec:hover{background:rgba(51,65,85,.9);color:#e2e8f0}
  .gqz-btn-danger{background:rgba(69,10,10,.7);color:#fca5a5;border:1px solid rgba(127,29,29,.7)}
  .gqz-btn-danger:hover{background:rgba(127,29,29,.9)}
  .gqz-btn-stealth{background:linear-gradient(135deg,rgba(15,23,42,.9),rgba(30,41,59,.9));color:#94a3b8;border:1px solid rgba(51,65,85,.8)}
  .gqz-btn-stealth:hover{color:#e2e8f0;border-color:rgba(139,92,246,.5)}
  .gqz-btn-sm{padding:9px 12px;font-size:11.5px;border-radius:9px}
  .gqz-btn-sm svg{width:14px;height:14px}
  .gqz-row-2{display:grid;grid-template-columns:1fr 1fr;gap:9px}
  .gqz-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px}

  .gqz-progress{height:6px;background:rgba(30,41,59,.7);border-radius:4px;overflow:hidden;margin-top:12px;display:none}
  .gqz-progress.active{display:block}
  .gqz-progress-fill{height:100%;background:linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7,#8b5cf6,#6366f1);background-size:200% 100%;transition:width .4s;width:0%;border-radius:4px;animation:gqzShine 2s linear infinite}

  .gqz-score{margin-top:16px;padding:18px;background:linear-gradient(135deg,rgba(30,41,59,.9),rgba(51,65,85,.9));border-radius:14px;border-left:4px solid #6366f1;display:none}
  .gqz-score.active{display:block}
  .gqz-score-h{font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px;font-weight:800;display:flex;align-items:center;gap:6px}
  .gqz-score-h svg{width:13px;height:13px;color:#fbbf24}
  .gqz-score-v{font-size:38px;font-weight:900;line-height:1;background:linear-gradient(135deg,#22c55e,#4ade80,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-1.5px}
  .gqz-score-d{font-size:11px;color:#94a3b8;margin-top:8px}

  .gqz-log{background:rgba(2,6,23,.9);border:1px solid rgba(30,41,59,.9);border-radius:12px;padding:14px;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:10.5px;height:290px;overflow-y:auto;color:#94a3b8;line-height:1.7}
  .gqz-log div{margin-bottom:2px;word-break:break-word}
  .gqz-log .ok{color:#4ade80}
  .gqz-log .err{color:#f87171}
  .gqz-log .info{color:#60a5fa}
  .gqz-log .warn{color:#fbbf24}
  .gqz-log .ai{color:#c4b5fd;font-weight:700}
  .gqz-log::-webkit-scrollbar{width:5px}
  .gqz-log::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#6366f1,#8b5cf6);border-radius:3px}

  .gqz-footer{padding:11px 18px;background:rgba(10,15,28,.85);border-top:1px solid rgba(30,41,59,.8);font-size:10.5px;color:#64748b;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
  .gqz-badge{padding:4px 10px;background:linear-gradient(135deg,rgba(30,41,59,.9),rgba(51,65,85,.9));border-radius:7px;font-family:monospace;font-size:10px;color:#a5b4fc;font-weight:700;text-transform:uppercase}
  .gqz-badge.busy{background:linear-gradient(135deg,#78350f,#92400e);color:#fbbf24;animation:gqzPulse 1.5s infinite}
  .gqz-badge.error{background:linear-gradient(135deg,#450a0a,#7f1d1d);color:#fca5a5}
  .gqz-badge.done{background:linear-gradient(135deg,#14532d,#15803d);color:#86efac}

  .gqz-tip{font-size:10.5px;color:#94a3b8;margin-bottom:12px;padding:11px 13px;background:linear-gradient(135deg,rgba(99,102,241,.1),rgba(139,92,246,.05));border-left:3px solid #6366f1;border-radius:0 10px 10px 0;line-height:1.55;display:flex;align-items:center;gap:8px}
  .gqz-tip svg{width:14px;height:14px;color:#818cf8;flex-shrink:0}

  .gqz-expl-list{max-height:340px;overflow-y:auto;background:rgba(2,6,23,.9);border:1px solid rgba(30,41,59,.9);border-radius:12px;padding:12px}
  .gqz-expl-item{padding:12px;margin-bottom:10px;background:linear-gradient(135deg,rgba(30,41,59,.6),rgba(51,65,85,.4));border-radius:11px;border-left:3px solid #6366f1}
  .gqz-expl-num{font-size:10px;color:#64748b;font-weight:800;margin-bottom:5px;text-transform:uppercase;display:flex;align-items:center;gap:5px}
  .gqz-expl-ans{font-size:12px;color:#86efac;font-weight:700;margin-bottom:5px}
  .gqz-expl-reason{font-size:10.5px;color:#94a3b8;line-height:1.6}
  .gqz-expl-conf{font-size:9.5px;color:#64748b;margin-top:5px;font-family:monospace}

  .gqz-toggle{position:relative;display:inline-block;width:40px;height:22px;flex-shrink:0}
  .gqz-toggle input{opacity:0;width:0;height:0}
  .gqz-slider{position:absolute;cursor:pointer;inset:0;background:#334155;transition:.3s;border-radius:22px}
  .gqz-slider:before{position:absolute;content:"";height:16px;width:16px;left:3px;bottom:3px;background:#fff;transition:.3s;border-radius:50%}
  input:checked + .gqz-slider{background:linear-gradient(135deg,#6366f1,#8b5cf6)}
  input:checked + .gqz-slider:before{transform:translateX(18px)}

  #gqz-stealth-btn{position:fixed;right:20px;bottom:20px;width:56px;height:56px;background:linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7);border-radius:50%;display:none;align-items:center;justify-content:center;color:#fff;cursor:pointer;box-shadow:0 12px 32px rgba(99,102,241,.55);z-index:2147483646;animation:gqzGlow 2s infinite}
  #gqz-stealth-btn svg{width:24px;height:24px}
  #gqz-stealth-btn.active{display:flex}
  #gqz-stealth-btn:hover{transform:scale(1.15)}

  .gqz-switch-row{display:flex;justify-content:space-between;align-items:center;padding:11px 13px;background:rgba(11,18,32,.7);border:1px solid rgba(51,65,85,.6);border-radius:11px;margin-bottom:9px}
  .gqz-switch-lbl{font-size:11.5px;color:#cbd5e1;font-weight:700}
  .gqz-switch-desc{font-size:9.5px;color:#64748b;margin-top:2px}
  .gqz-persona{font-size:10px;color:#a5b4fc;margin-bottom:10px;padding:10px 12px;background:linear-gradient(135deg,rgba(139,92,246,.15),rgba(99,102,241,.08));border-left:2px solid #8b5cf6;border-radius:0 10px 10px 0;line-height:1.55;font-style:italic}

  .gqz-chat-wrap{display:flex;flex-direction:column;height:420px;background:rgba(2,6,23,.6);border:1px solid rgba(30,41,59,.9);border-radius:14px;overflow:hidden}
  .gqz-chat-hdr{padding:10px 14px;background:linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.08));border-bottom:1px solid rgba(139,92,246,.2);font-size:11px;color:#a5b4fc;font-weight:700;display:flex;align-items:center;justify-content:space-between}
  .gqz-chat-hdr svg{width:14px;height:14px}
  .gqz-chat-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}
  .gqz-chat-msgs::-webkit-scrollbar{width:5px}
  .gqz-chat-msgs::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#6366f1,#8b5cf6);border-radius:3px}
  .gqz-msg{max-width:85%;padding:10px 13px;border-radius:14px;font-size:12px;line-height:1.55;word-wrap:break-word;white-space:pre-wrap;animation:gqzTabIn .3s}
  .gqz-msg.user{align-self:flex-end;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border-bottom-right-radius:4px}
  .gqz-msg.ai{align-self:flex-start;background:linear-gradient(135deg,rgba(30,41,59,.95),rgba(51,65,85,.85));color:#e2e8f0;border-bottom-left-radius:4px;border:1px solid rgba(139,92,246,.2)}
  .gqz-msg.err{align-self:flex-start;background:rgba(69,10,10,.9);color:#fca5a5;border:1px solid rgba(239,68,68,.3)}
  .gqz-msg.sys{align-self:center;background:rgba(99,102,241,.15);color:#c7d2fe;border:1px dashed rgba(99,102,241,.4);font-size:11px;text-align:center;max-width:95%}
  .gqz-msg-dot{display:inline-flex;gap:3px;padding:4px 0}
  .gqz-msg-dot span{width:6px;height:6px;border-radius:50%;background:#a5b4fc;animation:gqzDot 1.2s infinite}
  .gqz-msg-dot span:nth-child(2){animation-delay:.2s}
  .gqz-msg-dot span:nth-child(3){animation-delay:.4s}
  .gqz-chat-input{display:flex;gap:8px;padding:10px;border-top:1px solid rgba(30,41,59,.9);background:rgba(11,18,32,.8)}
  .gqz-chat-input textarea{flex:1;padding:10px 12px;background:rgba(2,6,23,.7);border:1px solid rgba(51,65,85,.8);border-radius:10px;color:#e2e8f0;font-size:12px;font-family:inherit;resize:none;outline:none;max-height:100px;min-height:42px;line-height:1.4}
  .gqz-chat-input textarea:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.18)}
  .gqz-chat-send{width:44px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:10px;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .gqz-chat-send svg{width:16px;height:16px}
  .gqz-chat-send:hover:not(:disabled){transform:scale(1.08)}
  .gqz-chat-send:disabled{opacity:.5;cursor:not-allowed}
  .gqz-chat-chip{display:flex;flex-wrap:wrap;gap:6px;padding:0 10px 10px}
  .gqz-chip{padding:5px 10px;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);border-radius:12px;color:#c7d2fe;font-size:10px;cursor:pointer}
  .gqz-chip:hover{background:rgba(99,102,241,.3)}
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  const stealthBtn = document.createElement('div');
  stealthBtn.id = 'gqz-stealth-btn';
  stealthBtn.innerHTML = SVG.bolt;
  stealthBtn.onclick = () => { state.stealth = false; panel.style.display = 'flex'; stealthBtn.classList.remove('active'); };
  document.body.appendChild(stealthBtn);

  const panel = document.createElement('div');
  panel.id = 'gqz-panel';
  panel.innerHTML = `
    <div class="gqz-hdr" id="gqz-hdr">
      <div class="gqz-hdr-title">
        <div class="gqz-logo">${SVG.bolt}</div>
        <span>GFS Quizizz Solver</span>
        <span class="gqz-status" id="gqz-status"></span>
      </div>
      <div class="gqz-hdr-btns">
        <button id="gqz-min" title="Minimize">${SVG.minus}</button>
        <button id="gqz-stealth" title="Stealth">${SVG.ghost}</button>
        <button id="gqz-close" title="Close">${SVG.close}</button>
      </div>
    </div>
    <div class="gqz-tabs">
      <button class="gqz-tab active" data-tab="solve">${SVG.play}<span>Solve</span></button>
      <button class="gqz-tab" data-tab="chat">${SVG.chat}<span>Chat</span></button>
      <button class="gqz-tab" data-tab="explain">${SVG.book}<span>Explain</span></button>
      <button class="gqz-tab" data-tab="settings">${SVG.settings}<span>Config</span></button>
      <button class="gqz-tab" data-tab="log">${SVG.code}<span>Log</span></button>
      <button class="gqz-tab" data-tab="credit">${SVG.heart}<span>Credit</span></button>
    </div>
    <div class="gqz-body" id="gqz-body">
      <div class="gqz-tab-panel active" data-panel="solve">
        <div class="gqz-tip" id="gqz-tip">${SVG.sparkle}<span>Groq · openai/gpt-oss-120b</span></div>
        <div class="gqz-persona" id="gqz-persona">Persona: —</div>
        <div class="gqz-row" style="margin-top:6px">
          <button class="gqz-btn gqz-btn-main" id="gqz-solve">${SVG.rocket}<span>JAWAB SOAL SEKARANG</span></button>
        </div>
        <div class="gqz-progress" id="gqz-progress"><div class="gqz-progress-fill" id="gqz-progress-fill"></div></div>
        <div class="gqz-row-3" style="margin-top:14px">
          <button class="gqz-btn gqz-btn-sec gqz-btn-sm" id="gqz-parse">${SVG.search}<span>SCAN</span></button>
          <button class="gqz-btn gqz-btn-stealth gqz-btn-sm" id="gqz-auto">${SVG.play}<span>AUTO</span></button>
          <button class="gqz-btn gqz-btn-danger gqz-btn-sm" id="gqz-clear">${SVG.trash}<span>CLEAR</span></button>
        </div>
        <div class="gqz-score" id="gqz-score">
          <div class="gqz-score-h">${SVG.star}<span>HASIL</span></div>
          <div class="gqz-score-v" id="gqz-score-v">-</div>
          <div class="gqz-score-d" id="gqz-score-d"></div>
        </div>
      </div>
      <div class="gqz-tab-panel" data-panel="chat">
        <div class="gqz-chat-wrap">
          <div class="gqz-chat-hdr">
            <span style="display:flex;align-items:center;gap:6px">${SVG.chat}<span id="gqz-chat-model">Chat AI · —</span></span>
            <button style="background:none;border:none;color:#94a3b8;cursor:pointer;padding:2px" id="gqz-chat-clear">${SVG.trash}</button>
          </div>
          <div class="gqz-chat-msgs" id="gqz-chat-msgs">
            <div class="gqz-msg ai">Halo! Ketik perintah auto-solve, contoh: "kerjain nomor 1-5" · "jawab nomor 3" · "isi nomor 1-dst"</div>
          </div>
          <div class="gqz-chat-chip">
            <span class="gqz-chip" data-p="kerjain nomor 1-dst">Semua soal</span>
            <span class="gqz-chip" data-p="kerjain nomor 1-5">Nomor 1-5</span>
            <span class="gqz-chip" data-p="Jelaskan konsep ini">Jelaskan</span>
            <span class="gqz-chip" data-p="Ringkas jawaban ini">Ringkas</span>
          </div>
          <div class="gqz-chat-input">
            <textarea id="gqz-chat-input" placeholder="Ketik pesan atau perintah... (Enter kirim)" rows="1"></textarea>
            <button class="gqz-chat-send" id="gqz-chat-send">${SVG.send}</button>
          </div>
        </div>
      </div>
      <div class="gqz-tab-panel" data-panel="explain">
        <div class="gqz-expl-list" id="gqz-expl-list"><div style="color:#64748b;font-size:11px;text-align:center;padding:24px">✦ Belum ada penjelasan ✦</div></div>
      </div>
      <div class="gqz-tab-panel" data-panel="settings">
        <div class="gqz-row"><label class="gqz-lbl">${SVG.sparkle}<span>Provider</span></label><select class="gqz-select" id="gqz-provider"><option value="groq">Groq</option><option value="cloudflare">Cloudflare AI</option><option value="openrouter">OpenRouter</option><option value="openai">OpenAI</option></select></div>
        <div class="gqz-row"><label class="gqz-lbl">${SVG.code}<span>Model</span></label><select class="gqz-select" id="gqz-model"></select></div>
        <div class="gqz-row" id="gqz-key-row"><label class="gqz-lbl">${SVG.id}<span>API Key</span><span class="gqz-hint" id="gqz-key-hint">auto</span></label><div class="gqz-input-wrap"><input class="gqz-input" id="gqz-key" type="password" autocomplete="off"><button class="gqz-eye" id="gqz-eye" type="button">${SVG.eye}</button></div></div>
        <div class="gqz-row">
          <div class="gqz-switch-row"><div><div class="gqz-switch-lbl">Auto-Advance</div><div class="gqz-switch-desc">Klik Next setelah jawab</div></div><label class="gqz-toggle"><input type="checkbox" id="gqz-opt-advance" checked><span class="gqz-slider"></span></label></div>
          <div class="gqz-switch-row"><div><div class="gqz-switch-lbl">Auto-Scroll</div><div class="gqz-switch-desc">Scroll ke jawaban</div></div><label class="gqz-toggle"><input type="checkbox" id="gqz-opt-scroll" checked><span class="gqz-slider"></span></label></div>
          <div class="gqz-switch-row"><div><div class="gqz-switch-lbl">Auto-Explanation</div><div class="gqz-switch-desc">AI jelasin jawaban</div></div><label class="gqz-toggle"><input type="checkbox" id="gqz-opt-explain" checked><span class="gqz-slider"></span></label></div>
          <div class="gqz-switch-row"><div><div class="gqz-switch-lbl">Show Personality</div><div class="gqz-switch-desc">Tampilkan persona AI</div></div><label class="gqz-toggle"><input type="checkbox" id="gqz-opt-persona" checked><span class="gqz-slider"></span></label></div>
        </div>
        <div class="gqz-row-2"><button class="gqz-btn gqz-btn-sec gqz-btn-sm" id="gqz-save">${SVG.download}<span>SAVE</span></button><button class="gqz-btn gqz-btn-sec gqz-btn-sm" id="gqz-load">${SVG.rocket}<span>LOAD</span></button></div>
      </div>
      <div class="gqz-tab-panel" data-panel="log">
        <div class="gqz-row-2" style="margin-bottom:10px">
          <button class="gqz-btn gqz-btn-sec gqz-btn-sm" id="gqz-export">${SVG.download}<span>EXPORT</span></button>
          <button class="gqz-btn gqz-btn-danger gqz-btn-sm" id="gqz-clearlog">${SVG.trash}<span>CLEAR</span></button>
        </div>
        <div class="gqz-log" id="gqz-log"><div>Ready.</div></div>
      </div>
      <div class="gqz-tab-panel" data-panel="credit">
        <div style="background:linear-gradient(160deg,rgba(99,102,241,.15),rgba(139,92,246,.08));border:1px solid rgba(139,92,246,.35);border-radius:16px;padding:22px;text-align:center">
          <div style="width:80px;height:80px;margin:0 auto 14px;background:linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7);border-radius:50%;display:flex;align-items:center;justify-content:center">${SVG.user}</div>
          <div style="font-size:22px;font-weight:900;background:linear-gradient(135deg,#a5b4fc,#c4b5fd,#e9d5ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent">ALIP / ALRECT</div>
          <div style="font-size:10.5px;color:#94a3b8;text-transform:uppercase;letter-spacing:2px;font-weight:700;margin-top:4px;margin-bottom:16px">Developer</div>
          <a style="display:flex;align-items:center;justify-content:center;gap:10px;padding:14px;background:linear-gradient(135deg,#14532d,#166534);border:1px solid rgba(74,222,128,.4);border-radius:12px;color:#fff;font-weight:800;text-decoration:none" href="https://wa.me/6282192401340" target="_blank">
            ${SVG.whatsapp}
            <div style="display:flex;flex-direction:column;align-items:flex-start;line-height:1.3">
              <span style="font-size:9px;opacity:.8;letter-spacing:1px">ORDER NOW</span>
              <span style="font-size:14px;font-weight:900">+62 821-9240-1340</span>
            </div>
          </a>
          <div style="margin-top:16px;font-size:9.5px;color:#475569">GFS Quizizz Solver v1 · © 2026</div>
        </div>
      </div>
    </div>
    <div class="gqz-footer"><span>⚡ GQZ v1</span><span class="gqz-badge" id="gqz-footer-stat">idle</span></div>`;
  document.body.appendChild(panel);

  const $ = (id) => document.getElementById(id);
  document.querySelectorAll('.gqz-tab').forEach((tab) => {
    tab.onclick = () => {
      document.querySelectorAll('.gqz-tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.gqz-tab-panel').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector('.gqz-tab-panel[data-panel="' + tab.dataset.tab + '"]').classList.add('active');
    };
  });

  const log = (msg, cls = 'info') => {
    const el = $('gqz-log');
    const d = document.createElement('div');
    d.className = cls;
    d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
    el.appendChild(d);
    el.scrollTop = el.scrollHeight;
    while (el.children.length > 500) el.removeChild(el.firstChild);
  };
  const setStatus = (txt) => { const b = $('gqz-footer-stat'); b.textContent = txt; b.className = 'gqz-badge'; if (txt === 'running') b.classList.add('busy'); else if (txt === 'error') b.classList.add('error'); else if (txt === 'done') b.classList.add('done'); };

  const enterStealth = () => { state.stealth = true; panel.style.display = 'none'; stealthBtn.classList.add('active'); };
  $('gqz-stealth').onclick = enterStealth;
  $('gqz-close').onclick = () => { panel.remove(); stealthBtn.remove(); window.__GQZ_LOADED__ = false; };
  $('gqz-eye').onclick = () => { const i = $('gqz-key'); i.type = i.type === 'password' ? 'text' : 'password'; };

  const updateModels = () => {
    const p = $('gqz-provider').value;
    const sel = $('gqz-model'); sel.innerHTML = '';
    (MODELS[p] || []).forEach((m) => { const o = document.createElement('option'); o.value = m; o.textContent = m; sel.appendChild(o); });
    if (HARDCODED_KEYS[p]) { $('gqz-key').value = HARDCODED_KEYS[p]; $('gqz-key-hint').textContent = 'auto'; }
    else { $('gqz-key').value = ''; $('gqz-key-hint').textContent = 'manual'; }
    const bs = BATCH_SIZE[p] || 6;
    $('gqz-tip').innerHTML = SVG.sparkle + '<span>' + p + ' · ' + sel.value + ' · batch ' + bs + '</span>';
    if ($('gqz-opt-persona').checked) $('gqz-persona').textContent = 'Persona: ' + (PERSONALITY[p] || '—');
    $('gqz-chat-model').textContent = 'Chat AI · ' + p + ' / ' + sel.value;
  };
  $('gqz-provider').onchange = updateModels;
  $('gqz-model').onchange = () => {
    $('gqz-tip').innerHTML = SVG.sparkle + '<span>' + $('gqz-provider').value + ' · ' + $('gqz-model').value + '</span>';
    $('gqz-chat-model').textContent = 'Chat AI · ' + $('gqz-provider').value + ' / ' + $('gqz-model').value;
  };
  $('gqz-opt-persona').onchange = () => { $('gqz-persona').style.display = $('gqz-opt-persona').checked ? 'block' : 'none'; if ($('gqz-opt-persona').checked) $('gqz-persona').textContent = 'Persona: ' + (PERSONALITY[$('gqz-provider').value] || '—'); };

  $('gqz-save').onclick = () => { localStorage.setItem('gqz_config', JSON.stringify({ provider: $('gqz-provider').value, model: $('gqz-model').value, key: $('gqz-key').value, oA: $('gqz-opt-advance').checked, oS: $('gqz-opt-scroll').checked, oE: $('gqz-opt-explain').checked, oP: $('gqz-opt-persona').checked })); log('Saved.', 'ok'); };
  $('gqz-load').onclick = () => { try { const c = JSON.parse(localStorage.getItem('gqz_config') || '{}'); if (c.provider) { $('gqz-provider').value = c.provider; updateModels(); } if (c.model) $('gqz-model').value = c.model; if (c.key && !HARDCODED_KEYS[$('gqz-provider').value]) $('gqz-key').value = c.key; if (c.oA !== undefined) $('gqz-opt-advance').checked = c.oA; if (c.oS !== undefined) $('gqz-opt-scroll').checked = c.oS; if (c.oE !== undefined) $('gqz-opt-explain').checked = c.oE; if (c.oP !== undefined) $('gqz-opt-persona').checked = c.oP; log('Loaded.', 'ok'); } catch (e) { log('Load gagal', 'err'); } };

  $('gqz-export').onclick = () => { const txt = [...$('gqz-log').children].map((c) => c.textContent).join('\n'); const blob = new Blob([txt], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'gqz-log.txt'; a.click(); };
  $('gqz-clearlog').onclick = () => { $('gqz-log').innerHTML = ''; };
  $('gqz-min').onclick = () => { const b = $('gqz-body'), t = panel.querySelector('.gqz-tabs'), f = panel.querySelector('.gqz-footer'); const h = b.style.display === 'none'; b.style.display = h ? '' : 'none'; t.style.display = h ? '' : 'none'; f.style.display = h ? '' : 'none'; $('gqz-min').innerHTML = h ? SVG.minus : SVG.plus; };

  const hdr = $('gqz-hdr');
  let drag = false, ox = 0, oy = 0;
  const sD = (x, y) => { const r = panel.getBoundingClientRect(); drag = true; ox = x - r.left; oy = y - r.top; panel.style.transform = 'none'; panel.style.animation = 'none'; panel.style.left = r.left + 'px'; panel.style.top = r.top + 'px'; };
  const mD = (x, y) => { if (!drag) return; const r = panel.getBoundingClientRect(); panel.style.left = Math.max(0, Math.min(window.innerWidth - r.width, x - ox)) + 'px'; panel.style.top = Math.max(0, Math.min(window.innerHeight - 60, y - oy)) + 'px'; };
  hdr.onmousedown = (e) => { if (e.target.closest('button')) return; sD(e.clientX, e.clientY); };
  hdr.ontouchstart = (e) => { if (e.target.closest('button')) return; sD(e.touches[0].clientX, e.touches[0].clientY); };
  document.onmousemove = (e) => mD(e.clientX, e.clientY);
  document.ontouchmove = (e) => mD(e.touches[0].clientX, e.touches[0].clientY);
  document.onmouseup = () => { drag = false; };
  document.ontouchend = () => { drag = false; };

  // ═══════════════════════════════════════════
  // QUIZIZZ PARSER — multi-strategy
  // ═══════════════════════════════════════════
  const QUIZIZZ_QUESTION_SELECTORS = [
    '[data-cy="question-text"]',
    '[class*="question-text"]',
    '[class*="questionText"]',
    '.question-text',
    '.QuestionText',
    'h1[class*="question"]',
    'h2[class*="question"]',
    '[class*="question-title"]',
    '[class*="prompt"]'
  ];

  const QUIZIZZ_OPTION_SELECTORS = [
    '[data-cy="answer-option"]',
    '[class*="answer-option"]',
    '[class*="answerOption"]',
    '[class*="option-container"]',
    '[class*="OptionContainer"]',
    'button[class*="option"]',
    '[role="button"][class*="option"]',
    '[class*="answer-choice"]',
    '[class*="answerChoice"]'
  ];

  const QUIZIZZ_NEXT_SELECTORS = [
    'button[data-cy="next-button"]',
    'button[data-cy="submit-button"]',
    '[class*="next-button"]',
    '[class*="nextButton"]',
    '[class*="submit-button"]',
    '[class*="submitButton"]',
    'button[class*="next"]',
    'button[class*="submit"]'
  ];

  const qs = (sel, root) => { try { return (root || document).querySelector(sel); } catch { return null; } };
  const qsa = (sel, root) => { try { return [...(root || document).querySelectorAll(sel)]; } catch { return []; } };
  const firstOf = (sels, root) => { for (const s of sels) { const el = qs(s, root); if (el) return el; } return null; };
  const allOf = (sels, root) => {
    const out = new Set();
    for (const s of sels) qsa(s, root).forEach(e => out.add(e));
    return [...out];
  };

  const extractText = (el) => {
    if (!el) return '';
    let txt = (el.innerText || el.textContent || '').trim();
    // buang prefix A. B. C. D. / 1. 2. 3.
    txt = txt.replace(/^[A-Z][.)\-:]\s*/, '').replace(/^\d+[.)\-:]\s*/, '').trim();
    return txt;
  };

  // Parse soal Quizizz
  const parseQuizizzQuestion = () => {
    // 1) Cari container soal aktif
    let questionEl = firstOf(QUIZIZZ_QUESTION_SELECTORS);
    let qText = questionEl ? extractText(questionEl) : '';

    // 2) Kalau gagal, cari heading apapun
    if (!qText) {
      const h = document.querySelector('h1, h2, h3, [role="heading"]');
      if (h) qText = extractText(h);
    }

    // 3) Cari opsi jawaban
    let opts = allOf(QUIZIZZ_OPTION_SELECTORS).map(el => {
      const txt = extractText(el);
      return txt ? { text: txt, el } : null;
    }).filter(Boolean);

    // 4) Fallback: kalau opsi kosong, cari button besar di main area
    if (!opts.length) {
      const btns = qsa('button, [role="button"]').filter(b => {
        const t = extractText(b);
        return t.length > 0 && t.length < 300 && !/next|submit|lanjut|kirim|skip|menu/i.test(t) && b.offsetParent !== null;
      });
      opts = btns.map(b => ({ text: extractText(b), el: b })).filter(o => o.text);
    }

    return { qText, opts };
  };

  // Scan semua soal di halaman (kalau review mode / ada banyak soal terlihat)
  const parseQuizizzAll = () => {
    // Coba: cari semua container soal
    const containers = allOf([
      '[class*="question-container"]',
      '[class*="questionContainer"]',
      '[class*="QuestionBlock"]',
      '[data-cy="question-block"]',
      'section[class*="question"]'
    ]);

    if (containers.length > 1) {
      return containers.map((c, i) => {
        let qEl = firstOf(QUIZIZZ_QUESTION_SELECTORS, c);
        let qText = qEl ? extractText(qEl) : '';
        if (!qText) {
          const h = c.querySelector('h1,h2,h3,[role="heading"],[class*="question"]');
          if (h) qText = extractText(h);
        }
        let opts = allOf(QUIZIZZ_OPTION_SELECTORS, c).map(el => {
          const txt = extractText(el);
          return txt ? { text: txt, el } : null;
        }).filter(Boolean);
        if (!opts.length) {
          opts = qsa('button, [role="button"]', c).map(b => ({ text: extractText(b), el: b })).filter(o => o.text && !/next|submit|lanjut/i.test(o.text));
        }
        return { idx: i, qText, opts };
      }).filter(q => q.opts.length);
    }

    // Fallback: single question mode
    const single = parseQuizizzQuestion();
    if (single.opts.length) return [{ idx: 0, ...single }];
    return [];
  };

  // Cari tombol Next / Submit
  const findNextButton = () => {
    for (const s of QUIZIZZ_NEXT_SELECTORS) {
      const b = qs(s);
      if (b && b.offsetParent !== null && !b.disabled) return b;
    }
    return null;
  };

  // Detect fill-in-the-blank input
  const findBlankInput = () => {
    const sels = [
      'input[type="text"][class*="answer"]',
      'textarea[class*="answer"]',
      'input[type="text"][data-cy*="answer"]',
      '[class*="fill-blank"] input',
      '[class*="fillBlank"] input',
      'input[type="text"]:not([readonly])'
    ];
    for (const s of sels) {
      const els = qsa(s).filter(e => e.offsetParent !== null);
      if (els.length) return els[0];
    }
    return null;
  };

  $('gqz-parse').onclick = () => {
    const all = parseQuizizzAll();
    log('Terdeteksi ' + all.length + ' soal.', 'ok');
    all.slice(0, 5).forEach((q) => {
      log('Q' + (q.idx + 1) + ': ' + (q.qText || '(no text)').slice(0, 70), 'info');
      q.opts.slice(0, 6).forEach((o, j) => log('   ' + (j + 1) + '. ' + o.text.slice(0, 70), 'info'));
    });
    const nextBtn = findNextButton();
    log('Next button: ' + (nextBtn ? '✓ ada' : '✗ tidak ada'), nextBtn ? 'ok' : 'warn');
    const blank = findBlankInput();
    if (blank) log('Input blank terdeteksi: ' + blank.tagName, 'info');
  };

  $('gqz-clear').onclick = () => {
    let c = 0;
    allOf(QUIZIZZ_OPTION_SELECTORS).forEach((el) => {
      if (el.getAttribute('aria-checked') === 'true' || el.classList.contains('selected')) {
        el.click(); c++;
      }
    });
    log('Cleared ' + c + '.', 'warn');
  };

  $('gqz-auto').onclick = () => {
    if (state.autoInterval) { clearInterval(state.autoInterval); state.autoInterval = null; $('gqz-auto').innerHTML = SVG.play + '<span>AUTO</span>'; log('Auto mode OFF', 'warn'); return; }
    log('Auto mode ON — scan tiap 3 detik', 'ok');
    $('gqz-auto').innerHTML = SVG.play + '<span>STOP</span>';
    state.autoInterval = setInterval(() => {
      if (!state.running) $('gqz-solve').click();
    }, 3000);
  };

  // ═══════════════════════════════════════════
  // AI CALLERS
  // ═══════════════════════════════════════════
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
    if (!res.ok) throw new Error('Cloudflare ' + res.status);
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
    if (!res.ok) throw new Error('Groq ' + res.status);
    const data = await res.json();
    return data.choices[0].message.content;
  };
  const chatOpenRouter = async (key, model, messages, persona) => {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: persona + ' Asisten chat cerdas. Jawab natural, ringkas.' }, ...messages], temperature: 0.6, max_tokens: 2000 })
    });
    if (!res.ok) throw new Error('OpenRouter ' + res.status);
    const data = await res.json();
    return data.choices[0].message.content;
  };
  const chatOpenAI = async (key, model, messages, persona) => {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: persona + ' Asisten chat cerdas. Jawab natural, ringkas.' }, ...messages], temperature: 0.6, max_tokens: 2000 })
    });
    if (!res.ok) throw new Error('OpenAI ' + res.status);
    const data = await res.json();
    return data.choices[0].message.content;
  };
  const chatCloudflare = async (token, model, messages, persona) => {
    const url = 'https://api.cloudflare.com/client/v4/accounts/' + CF_ACCOUNT_ID + '/ai/run/' + model;
    const res = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ messages: [{ role: 'system', content: persona + ' Asisten chat cerdas. Jawab natural, ringkas.' }, ...messages] })
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

  // ═══════════════════════════════════════════
  // CORE SOLVE
  // ═══════════════════════════════════════════
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
    const list = $('gqz-expl-list'); list.innerHTML = '';
    allAnswers.forEach((a) => {
      const q = questions[a.idx]; if (!q) return;
      const mt = allMatches[a.idx] || {};
      const item = document.createElement('div');
      item.className = 'gqz-expl-item';
      if (mt.reason === 'no-match') item.style.borderLeftColor = '#ef4444';
      else if (mt.reason && mt.reason.startsWith('contains-best')) item.style.borderLeftColor = '#fbbf24';
      else item.style.borderLeftColor = '#22c55e';
      item.innerHTML = '<div class="gqz-expl-num">' + SVG.sparkle + ' Q' + (a.idx + 1) + ' · ' + (mt.reason || '') + '</div>' + '<div class="gqz-expl-ans">' + (mt.reason === 'no-match' ? '✗ ' : '✓ ') + a.answer + '</div>' + '<div class="gqz-expl-reason">' + (a.reason || q.qText.slice(0, 150)) + '</div>' + '<div class="gqz-expl-conf">Conf: ' + (a.confidence * 100).toFixed(0) + '%</div>';
      list.appendChild(item);
    });
  };

  // ═══════════════════════════════════════════
  // SOLVE MAIN
  // ═══════════════════════════════════════════
  async function doSolveAll() {
    if (state.running) return;
    const key = $('gqz-key').value.trim();
    const provider = $('gqz-provider').value;
    const model = $('gqz-model').value;
    if (!key) { log('API key kosong.', 'err'); return; }

    const questions = parseQuizizzAll();
    if (!questions.length) { log('Nggak ada soal ke-parse! Coba SCAN dulu buat debug.', 'err'); return; }

    state.running = true; setStatus('running'); $('gqz-status').classList.add('busy');
    const btn = $('gqz-solve'); btn.disabled = true; btn.innerHTML = SVG.rocket + '<span>PROCESSING...</span>';
    $('gqz-progress').classList.add('active');

    const wantExplain = $('gqz-opt-explain').checked;
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
        const prompt = 'Jawab soal pilihan ganda berikut.\nBALAS JSON: {"answers":[{"i":' + start + ',"a":"<teks opsi PERSIS>"' + (wantExplain ? ',"reason":"<alasan>"' : '') + '}]}\n\nSOAL:\n' + batch.map((q, i) => '[' + (start + i) + '] ' + q.qText + '\n' + q.opts.map(o => '- ' + o.text).join('\n')).join('\n\n');

        let raw;
        try {
          if (provider === 'groq') raw = await callGroq(key, model, prompt, persona);
          else if (provider === 'cloudflare') raw = await callCloudflare(key, model, prompt, persona);
          else if (provider === 'openrouter') raw = await callOpenRouter(key, model, prompt, persona);
          else raw = await callOpenAI(key, model, prompt, persona);
          log('Batch ' + (b + 1) + ' OK', 'ok');
        } catch (e) { log('Batch ' + (b + 1) + ' gagal: ' + e.message, 'err'); await sleep(1500); continue; }

        try {
          const answers = parseResponse(raw);
          answers.forEach(a => allAnswers.push(a));
          log('Batch ' + (b + 1) + ' → ' + answers.length + ' jawaban', 'ok');
        } catch (e) { log('Parse gagal: ' + e.message, 'warn'); }
        await sleep(700);
      }

      let clicked = 0, skipped = 0;
      for (let i = 0; i < allAnswers.length; i++) {
        const a = allAnswers[i];
        $('gqz-progress-fill').style.width = Math.round(((i + 1) / allAnswers.length) * 100) + '%';
        const q = questions[a.idx]; if (!q) continue;
        const mt = findOption(q, a.answer);
        allMatches[a.idx] = mt;
        log('Q' + a.idx + ' → "' + a.answer.slice(0, 40) + '" · ' + mt.reason, 'info');
        if (mt.el) {
          if ($('gqz-opt-scroll').checked) mt.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await sleep(150); mt.el.click(); clicked++; log('  ✓', 'ok');
        } else { skipped++; log('  ✗', 'err'); }
        await sleep(200);
      }

      // Auto-advance
      if ($('gqz-opt-advance').checked) {
        const nb = findNextButton();
        if (nb) {
          log('Auto-advance: klik Next', 'info');
          await sleep(500);
          nb.click();
        } else {
          log('Next button tidak ditemukan', 'warn');
        }
      }

      renderExplanations(allAnswers, questions, allMatches);
      $('gqz-score').classList.add('active');
      $('gqz-score-v').textContent = clicked + '/' + questions.length;
      $('gqz-score-d').textContent = 'Provider: ' + provider + ' · Terisi: ' + clicked + ' · Skip: ' + skipped;
      setStatus('done');
      log('═══ SELESAI: ' + clicked + '/' + questions.length + ' ═══', 'ok');
    } catch (e) { log('ERROR: ' + e.message, 'err'); setStatus('error'); }
    finally {
      btn.disabled = false; btn.innerHTML = SVG.rocket + '<span>JAWAB SOAL SEKARANG</span>';
      state.running = false; $('gqz-status').classList.remove('busy');
      setTimeout(() => $('gqz-progress').classList.remove('active'), 1200);
    }
  }

  $('gqz-solve').onclick = doSolveAll;

  // ═══════════════════════════════════════════
  // CHAT + NUMBER INTENT
  // ═══════════════════════════════════════════
  const chatMsgs = $('gqz-chat-msgs');
  const chatInput = $('gqz-chat-input');
  const chatSend = $('gqz-chat-send');

  const appendMsg = (text, role) => {
    const div = document.createElement('div');
    div.className = 'gqz-msg ' + role;
    div.textContent = text;
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
    return div;
  };
  const appendTyping = () => {
    const div = document.createElement('div');
    div.className = 'gqz-msg ai';
    div.innerHTML = '<div class="gqz-msg-dot"><span></span><span></span><span></span></div>';
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

  async function solveRange(start, end) {
    const key = $('gqz-key').value.trim();
    const provider = $('gqz-provider').value;
    const model = $('gqz-model').value;
    if (!key) { appendMsg('API key kosong. Isi di tab Config.', 'err'); return; }

    const allQ = parseQuizizzAll();
    if (!allQ.length) { appendMsg('Nggak ada soal ke-parse di halaman ini.', 'err'); return; }

    const realEnd = end === Infinity ? allQ.length : Math.min(end, allQ.length);
    if (start > allQ.length) { appendMsg('Nomor ' + start + ' di luar range. Total: ' + allQ.length, 'err'); return; }

    const targets = allQ.slice(start - 1, realEnd);
    if (!targets.length) { appendMsg('Range kosong.', 'err'); return; }

    appendMsg('⚡ Auto-solve nomor ' + start + '–' + realEnd + ' · ' + targets.length + ' soal', 'sys');
    const typing = appendTyping();
    state.running = true; setStatus('running'); $('gqz-status').classList.add('busy'); chatSend.disabled = true;
    log('⚡ Range solve ' + start + '-' + realEnd, 'ai');

    try {
      const persona = PERSONALITY[provider] || '';
      const wantExplain = $('gqz-opt-explain').checked;
      const bs = BATCH_SIZE[provider] || 6;
      const totalBatches = Math.ceil(targets.length / bs);
      const allAnswers = [];
      const allMatches = {};

      for (let b = 0; b < totalBatches; b++) {
        const s = b * bs;
        const batch = targets.slice(s, s + bs);
        const prompt = 'Jawab soal berikut.\nBALAS JSON: {"answers":[{"i":<index>,"a":"<teks opsi PERSIS>"' + (wantExplain ? ',"reason":"<alasan>"' : '') + '}]}\n\nSOAL:\n' + batch.map((q) => '[' + q.idx + '] ' + q.qText + '\n' + q.opts.map(o => '- ' + o.text).join('\n')).join('\n\n');

        let raw;
        if (provider === 'groq') raw = await callGroq(key, model, prompt, persona);
        else if (provider === 'cloudflare') raw = await callCloudflare(key, model, prompt, persona);
        else if (provider === 'openrouter') raw = await callOpenRouter(key, model, prompt, persona);
        else raw = await callOpenAI(key, model, prompt, persona);

        try {
          const answers = parseResponse(raw);
          answers.forEach(a => allAnswers.push(a));
          log('Batch ' + (b + 1) + ' → ' + answers.length, 'ok');
        } catch (e) { log('Parse gagal batch ' + (b + 1), 'warn'); }
        await sleep(500);
      }

      let clicked = 0, skipped = 0;
      for (const a of allAnswers) {
        const q = allQ[a.idx]; if (!q) continue;
        const mt = findOption(q, a.answer);
        allMatches[a.idx] = mt;
        if (mt.el) {
          if ($('gqz-opt-scroll').checked) mt.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await sleep(120); mt.el.click(); clicked++;
        } else skipped++;
        await sleep(180);
      }

      renderExplanations(allAnswers, allQ, allMatches);
      typing.remove();
      appendMsg('✓ Selesai. Nomor ' + start + '–' + realEnd + ' · Terisi: ' + clicked + '/' + targets.length + ' · Skip: ' + skipped, 'ai');
      log('Range solve selesai: ' + clicked + '/' + targets.length, 'ok');
      setStatus('done');
    } catch (e) {
      typing.remove();
      appendMsg('ERROR: ' + e.message, 'err');
      log('Range error: ' + e.message, 'err');
      setStatus('error');
    } finally {
      state.running = false; chatSend.disabled = false; $('gqz-status').classList.remove('busy');
    }
  }

  async function doChat() {
    const text = chatInput.value.trim();
    if (!text || state.running) return;

    const intent = parseNumberIntent(text);
    if (intent) {
      appendMsg(text, 'user');
      chatInput.value = ''; chatInput.style.height = 'auto';
      log('Intent: nomor ' + intent.start + ' → ' + (intent.end === Infinity ? 'akhir' : intent.end), 'ai');
      await solveRange(intent.start, intent.end);
      return;
    }

    const key = $('gqz-key').value.trim();
    const provider = $('gqz-provider').value;
    const model = $('gqz-model').value;
    if (!key) { appendMsg('API key kosong.', 'err'); return; }

    appendMsg(text, 'user');
    chatInput.value = ''; chatInput.style.height = 'auto';
    state.chatHistory.push({ role: 'user', content: text });

    state.running = true; setStatus('running'); $('gqz-status').classList.add('busy'); chatSend.disabled = true;
    const typing = appendTyping();

    try {
      const persona = PERSONALITY[provider] || '';
      const reply = await chatDispatch(provider, key, model, state.chatHistory.slice(-20), persona);
      typing.remove();
      appendMsg(reply, 'ai');
      state.chatHistory.push({ role: 'assistant', content: reply });
      setStatus('done');
    } catch (e) {
      typing.remove();
      appendMsg('ERROR: ' + e.message, 'err');
      log('Chat error: ' + e.message, 'err');
      setStatus('error');
    } finally {
      state.running = false; chatSend.disabled = false; $('gqz-status').classList.remove('busy');
    }
  }

  document.querySelectorAll('.gqz-chip').forEach((chip) => {
    chip.onclick = () => { chatInput.value = chip.dataset.p; chatInput.focus(); };
  });

  $('gqz-chat-clear').onclick = () => {
    state.chatHistory = [];
    chatMsgs.innerHTML = '';
    appendMsg('Chat dibersihkan.', 'ai');
    log('Chat history cleared.', 'warn');
  };

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'G') {
      e.preventDefault();
      if (state.stealth) { panel.style.display = 'flex'; stealthBtn.classList.remove('active'); state.stealth = false; }
      else enterStealth();
    }
  });

  $('gqz-provider').value = 'groq';
  updateModels();
  log('GFS Quizizz Solver v1 by Alip/Alrect. Loaded.', 'ok');
})();
