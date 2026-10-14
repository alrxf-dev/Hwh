/* GFS Kahoot Solver COMPACT v2 — by Alip/Alrect */
(function () {
  if (window.__GKH_LOADED__) { document.getElementById('gkh-root')?.remove(); document.getElementById('gkh-pill')?.remove(); window.__GKH_LOADED__ = false; return; }
  window.__GKH_LOADED__ = true;

  // ─── CONFIG ───
  const CF_ACC = '7f83137df22c15f252e1da2ee2214a6c';
  const CF_TOK = 'cfut_2WkAuydB6WzZXAzdSIGz3kI5AxyEQVDOqllfGshz3568c7ff';
  const KEYS = {
    groq: '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',
    openrouter: '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',
    cloudflare: CF_TOK
  };
  const PERSONA = {
    groq: '[MCQ+TF solver ahli. Sangat teliti. Untuk TRUE/FALSE, nilai berbasis fakta ilmiah bukan asumsi. Contoh: "Mata burung unta lebih besar dari otaknya" = TRUE. Jangan asal.]',
    openrouter: '[MCQ+TF solver. Fokus akurasi, teliti pronoun + fakta.]',
    cloudflare: '[MCQ+TF solver. Nilai fakta dengan teliti.]',
    openai: '[Academic solver. Prioritaskan akurasi.]'
  };
  const MODELS = {
    groq: ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'],
    openrouter: ['nvidia/nemotron-3-ultra-550b-a55b:free', 'nvidia/nemotron-3-super-120b-a12b:free'],
    cloudflare: ['@cf/meta/llama-3.3-70b-instruct-fp8-fast', '@cf/meta/llama-3.1-8b-instruct', '@cf/mistral/mistral-7b-instruct-v0.1'],
    openai: ['gpt-4o-mini', 'gpt-4o']
  };
  const BATCH = { groq: 2, openrouter: 2, openai: 2, cloudflare: 2 };

  const S = { running: false, stealth: false, chat: [], loop: null, tab: 'solve' };

  // ─── SVG ───
  const I = {
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
    scan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>',
    loop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    min: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',
    max: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
    ghost: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V4z"/><path d="M4 20h14"/></svg>',
    cog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 5.8L20 9.7l-5.8 1.9L12 17.4l-2.2-5.8L4 9.7l6.1-1.9L12 2z"/></svg>'
  };

  // ─── STYLES ───
  const css = `
  @keyframes gi{from{opacity:0;transform:translate(-50%,-48%) scale(.94)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
  @keyframes gp{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes gs{to{transform:rotate(360deg)}}
  @keyframes gf{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
  @keyframes gd{0%,80%,100%{opacity:.3}40%{opacity:1}}
  @keyframes gn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}

  #gkh-root{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:380px;max-width:94vw;background:#0b0f1a;color:#dce3f0;border:1px solid rgba(120,80,220,.35);border-radius:14px;box-shadow:0 24px 70px rgba(0,0,0,.85),0 0 0 1px rgba(120,80,220,.12);z-index:2147483647;font:12px/1.45 -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;flex-direction:column;max-height:88vh;overflow:hidden;animation:gi .28s cubic-bezier(.34,1.56,.64,1)}
  #gkh-root *{box-sizing:border-box;margin:0;padding:0}
  #gkh-root::-webkit-scrollbar{width:5px}
  #gkh-root::-webkit-scrollbar-thumb{background:#6b46c1;border-radius:3px}

  .h{display:flex;align-items:center;justify-content:space-between;padding:9px 11px;background:linear-gradient(90deg,#6b46c1,#8b5cf6 50%,#a855f7);flex-shrink:0}
  .h-l{display:flex;align-items:center;gap:7px;color:#fff;font-weight:800;font-size:12.5px;letter-spacing:.2px}
  .h-logo{width:22px;height:22px;background:rgba(255,255,255,.2);border-radius:6px;display:flex;align-items:center;justify-content:center;animation:gf 3s ease-in-out infinite}
  .h-logo svg{width:12px;height:12px;color:#fff}
  .h-dot{width:7px;height:7px;border-radius:50%;background:#4ade80;box-shadow:0 0 8px #4ade80;animation:gp 2s infinite}
  .h-dot.b{background:#facc15;box-shadow:0 0 8px #facc15;animation:gs 1s linear infinite}
  .h-r{display:flex;gap:4px}
  .h-b{background:rgba(255,255,255,.16);border:none;color:#fff;width:22px;height:22px;border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .18s}
  .h-b svg{width:11px;height:11px}
  .h-b:hover{background:rgba(255,255,255,.3);transform:scale(1.08)}

  .t{display:flex;background:#0e1322;border-bottom:1px solid rgba(120,80,220,.18);flex-shrink:0;padding:2px 4px 0;gap:1px}
  .t-b{flex:1;padding:8px 4px 6px;background:none;border:none;color:#5a6784;cursor:pointer;font-family:inherit;font-size:9px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;transition:all .2s;border-radius:7px 7px 0 0;display:flex;flex-direction:column;align-items:center;gap:2px;position:relative}
  .t-b svg{width:14px;height:14px;opacity:.75}
  .t-b:hover{color:#94a3b8;background:rgba(148,163,184,.05)}
  .t-b.on{color:#c4b5fd;background:linear-gradient(180deg,rgba(139,92,246,.18),transparent)}
  .t-b.on svg{opacity:1;color:#a78bfa;filter:drop-shadow(0 0 4px rgba(167,139,250,.7))}
  .t-b.on::after{content:'';position:absolute;left:15%;right:15%;bottom:0;height:2px;background:linear-gradient(90deg,transparent,#8b5cf6,transparent);border-radius:2px}

  .bd{flex:1;overflow-y:auto;padding:12px;min-height:0}
  .bd::-webkit-scrollbar{width:4px}
  .bd::-webkit-scrollbar-thumb{background:#6b46c1;border-radius:2px}

  .p{display:none}
  .p.on{display:block;animation:gn .22s ease-out}

  .tip{padding:8px 10px;background:linear-gradient(135deg,rgba(139,92,246,.12),rgba(99,102,241,.05));border-left:2px solid #8b5cf6;border-radius:0 7px 7px 0;font-size:9.5px;color:#a5b4fc;margin-bottom:9px;display:flex;align-items:center;gap:6px;line-height:1.4}
  .tip svg{width:12px;height:12px;color:#8b5cf6;flex-shrink:0}

  .pn{font-size:9px;color:#8b5cf6;margin-bottom:9px;padding:7px 9px;background:rgba(139,92,246,.08);border-radius:6px;font-style:italic;line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}

  .btn{width:100%;padding:10px;border:none;border-radius:8px;font:800 12px inherit;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s;letter-spacing:.2px}
  .btn svg{width:14px;height:14px}
  .btn-p{background:linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7);color:#fff;box-shadow:0 6px 18px rgba(99,102,241,.4)}
  .btn-p:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 10px 24px rgba(99,102,241,.55)}
  .btn-p:disabled{opacity:.5;cursor:not-allowed;transform:none}
  .btn-s{background:rgba(30,41,59,.7);color:#cbd5e1;border:1px solid rgba(51,65,85,.8)}
  .btn-s:hover{background:rgba(51,65,85,.85);color:#e2e8f0}
  .btn-d{background:rgba(69,10,10,.65);color:#fca5a5;border:1px solid rgba(127,29,29,.65)}
  .btn-d:hover{background:rgba(127,29,29,.85)}
  .btn-g{background:rgba(30,41,59,.6);color:#94a3b8;border:1px solid rgba(51,65,85,.7)}
  .btn-g:hover{color:#e2e8f0;border-color:rgba(139,92,246,.45)}
  .btn-sm{padding:7px;font-size:10px;border-radius:6px}
  .btn-sm svg{width:12px;height:12px}

  .g2{display:grid;grid-template-columns:1fr 1fr;gap:5px}
  .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px}
  .mb{margin-bottom:8px}
  .mt{margin-top:8px}

  .bar{height:4px;background:rgba(30,41,59,.7);border-radius:3px;overflow:hidden;margin-top:8px;display:none}
  .bar.on{display:block}
  .bar-f{height:100%;background:linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7);transition:width .35s;width:0;border-radius:3px}

  .sc{margin-top:10px;padding:11px;background:linear-gradient(135deg,rgba(30,41,59,.85),rgba(51,65,85,.7));border-radius:9px;border-left:3px solid #6366f1;display:none}
  .sc.on{display:block}
  .sc-t{font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:.7px;font-weight:800;margin-bottom:4px;display:flex;align-items:center;gap:4px}
  .sc-t svg{width:11px;height:11px;color:#fbbf24}
  .sc-v{font-size:26px;font-weight:900;line-height:1;background:linear-gradient(135deg,#22c55e,#4ade80,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-1px}
  .sc-d{font-size:9.5px;color:#94a3b8;margin-top:5px;line-height:1.4}

  .lbl{display:flex;align-items:center;gap:4px;font-size:9px;color:#94a3b8;margin-bottom:5px;font-weight:800;text-transform:uppercase;letter-spacing:.6px}
  .lbl svg{width:11px;height:11px;color:#818cf8}
  .lbl span{margin-left:auto;color:#475569;font-weight:500;text-transform:none;letter-spacing:0;font-size:8.5px}

  .inp,.sel{width:100%;padding:8px 10px;background:rgba(11,18,32,.7);border:1px solid rgba(51,65,85,.75);border-radius:7px;color:#e2e8f0;font:11.5px inherit;font-family:inherit;outline:none;transition:all .2s}
  .inp:focus,.sel:focus{border-color:#8b5cf6;box-shadow:0 0 0 2px rgba(139,92,246,.2)}
  .iw{position:relative}
  .iw .inp{padding-right:34px}
  .iey{position:absolute;right:2px;top:50%;transform:translateY(-50%);background:none;border:none;color:#64748b;cursor:pointer;padding:6px 8px;border-radius:5px}
  .iey svg{width:12px;height:12px}
  .iey:hover{color:#a5b4fc;background:rgba(99,102,241,.15)}

  .sw{display:flex;justify-content:space-between;align-items:center;padding:7px 9px;background:rgba(11,18,32,.6);border:1px solid rgba(51,65,85,.5);border-radius:7px;margin-bottom:5px}
  .sw-t{font-size:10.5px;color:#cbd5e1;font-weight:700}
  .sw-d{font-size:8.5px;color:#64748b;margin-top:1px}
  .tg{position:relative;width:32px;height:18px;flex-shrink:0}
  .tg input{opacity:0;width:0;height:0}
  .ts{position:absolute;cursor:pointer;inset:0;background:#334155;border-radius:18px;transition:.25s}
  .ts::before{content:"";position:absolute;height:12px;width:12px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.25s}
  input:checked + .ts{background:linear-gradient(135deg,#6366f1,#8b5cf6)}
  input:checked + .ts::before{transform:translateX(14px)}

  .log{background:#020617;border:1px solid rgba(30,41,59,.85);border-radius:8px;padding:9px;font:9.5px/1.6 'SF Mono',Menlo,Consolas,monospace;height:240px;overflow-y:auto;color:#94a3b8}
  .log div{margin-bottom:1px;word-break:break-word;animation:gn .18s ease-out}
  .log .ok{color:#4ade80}
  .log .er{color:#f87171}
  .log .in{color:#60a5fa}
  .log .wn{color:#fbbf24}
  .log .ai{color:#c4b5fd;font-weight:700}
  .log::-webkit-scrollbar{width:4px}
  .log::-webkit-scrollbar-thumb{background:#6b46c1;border-radius:2px}

  .cw{display:flex;flex-direction:column;height:340px;background:rgba(2,6,23,.55);border:1px solid rgba(30,41,59,.85);border-radius:10px;overflow:hidden}
  .cw-h{padding:7px 10px;background:linear-gradient(90deg,rgba(139,92,246,.15),transparent);border-bottom:1px solid rgba(139,92,246,.18);font-size:9.5px;color:#a5b4fc;font-weight:700;display:flex;align-items:center;justify-content:space-between}
  .cw-h svg{width:12px;height:12px}
  .cw-m{flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:7px}
  .cw-m::-webkit-scrollbar{width:4px}
  .cw-m::-webkit-scrollbar-thumb{background:#6b46c1;border-radius:2px}
  .m{max-width:88%;padding:7px 10px;border-radius:10px;font-size:11px;line-height:1.5;word-wrap:break-word;white-space:pre-wrap;animation:gn .2s}
  .m.u{align-self:flex-end;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border-bottom-right-radius:3px}
  .m.a{align-self:flex-start;background:rgba(30,41,59,.9);color:#e2e8f0;border-bottom-left-radius:3px;border:1px solid rgba(139,92,246,.18)}
  .m.e{align-self:flex-start;background:rgba(69,10,10,.85);color:#fca5a5;border:1px solid rgba(239,68,68,.3)}
  .m.s{align-self:center;background:rgba(99,102,241,.12);color:#c7d2fe;border:1px dashed rgba(99,102,241,.35);font-size:10px;text-align:center;max-width:95%}
  .dt{display:inline-flex;gap:2px;padding:3px 0}
  .dt span{width:5px;height:5px;border-radius:50%;background:#a5b4fc;animation:gd 1.2s infinite}
  .dt span:nth-child(2){animation-delay:.15s}
  .dt span:nth-child(3){animation-delay:.3s}
  .cw-i{display:flex;gap:6px;padding:7px;border-top:1px solid rgba(30,41,59,.85);background:rgba(11,18,32,.75)}
  .cw-i textarea{flex:1;padding:7px 9px;background:rgba(2,6,23,.7);border:1px solid rgba(51,65,85,.75);border-radius:7px;color:#e2e8f0;font:11px inherit;font-family:inherit;resize:none;outline:none;max-height:80px;min-height:34px;line-height:1.4}
  .cw-i textarea:focus{border-color:#8b5cf6;box-shadow:0 0 0 2px rgba(139,92,246,.18)}
  .cw-s{width:36px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:7px;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .cw-s svg{width:13px;height:13px}
  .cw-s:hover:not(:disabled){transform:scale(1.06)}
  .cw-s:disabled{opacity:.5;cursor:not-allowed}
  .chips{display:flex;flex-wrap:wrap;gap:4px;padding:0 7px 7px}
  .ch{padding:3px 8px;background:rgba(99,102,241,.14);border:1px solid rgba(99,102,241,.28);border-radius:10px;color:#c7d2fe;font-size:9px;cursor:pointer}
  .ch:hover{background:rgba(99,102,241,.28)}

  .exl{max-height:290px;overflow-y:auto;background:rgba(2,6,23,.85);border:1px solid rgba(30,41,59,.85);border-radius:8px;padding:8px}
  .exl::-webkit-scrollbar{width:4px}
  .exl::-webkit-scrollbar-thumb{background:#6b46c1;border-radius:2px}
  .ex{padding:8px 9px;margin-bottom:6px;background:rgba(30,41,59,.5);border-radius:7px;border-left:2px solid #6366f1}
  .ex-t{font-size:8.5px;color:#64748b;font-weight:800;margin-bottom:3px;text-transform:uppercase;display:flex;align-items:center;gap:4px}
  .ex-t svg{width:10px;height:10px}
  .ex-a{font-size:11px;color:#86efac;font-weight:700;margin-bottom:3px}
  .ex-r{font-size:9.5px;color:#94a3b8;line-height:1.45}
  .ex-c{font-size:8.5px;color:#64748b;margin-top:3px;font-family:monospace}

  .ft{padding:6px 11px;background:rgba(10,15,28,.9);border-top:1px solid rgba(30,41,59,.75);font-size:9px;color:#64748b;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
  .bg{padding:2px 7px;background:rgba(30,41,59,.85);border-radius:5px;font:700 8.5px monospace;color:#a5b4fc;text-transform:uppercase;letter-spacing:.3px}
  .bg.b{background:#78350f;color:#fbbf24;animation:gp 1.4s infinite}
  .bg.e{background:#7f1d1d;color:#fca5a5}
  .bg.d{background:#14532d;color:#86efac}

  #gkh-pill{position:fixed;right:16px;bottom:16px;width:46px;height:46px;background:linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7);border-radius:50%;display:none;align-items:center;justify-content:center;color:#fff;cursor:pointer;box-shadow:0 8px 24px rgba(99,102,241,.55);z-index:2147483646;transition:transform .2s}
  #gkh-pill svg{width:20px;height:20px}
  #gkh-pill.on{display:flex}
  #gkh-pill:hover{transform:scale(1.12)}

  .cr{background:linear-gradient(160deg,rgba(99,102,241,.14),rgba(139,92,246,.06));border:1px solid rgba(139,92,246,.3);border-radius:12px;padding:16px;text-align:center}
  .cr-a{width:62px;height:62px;margin:0 auto 10px;background:linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 22px rgba(139,92,246,.45)}
  .cr-a svg{width:28px;height:28px;color:#fff}
  .cr-n{font-size:18px;font-weight:900;background:linear-gradient(135deg,#a5b4fc,#c4b5fd,#e9d5ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-.3px}
  .cr-r{font-size:9px;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;margin:3px 0 12px}
  .cr-w{display:flex;align-items:center;justify-content:center;gap:8px;padding:10px;background:linear-gradient(135deg,#14532d,#166534);border:1px solid rgba(74,222,128,.4);border-radius:9px;color:#fff;font-weight:800;text-decoration:none;transition:all .2s}
  .cr-w:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(74,222,128,.4)}
  .cr-w svg{width:18px;height:18px}
  .cr-w-t{display:flex;flex-direction:column;align-items:flex-start;line-height:1.25}
  .cr-w-l{font-size:7.5px;opacity:.85;letter-spacing:.8px}
  .cr-w-n{font-size:12px;font-weight:900}
  .cr-f{margin-top:10px;font-size:8.5px;color:#475569}
  `;

  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ─── PILL ───
  const pill = document.createElement('div');
  pill.id = 'gkh-pill'; pill.innerHTML = I.bolt;
  pill.onclick = () => { S.stealth = false; root.style.display = 'flex'; pill.classList.remove('on'); };
  document.body.appendChild(pill);

  // ─── ROOT ───
  const root = document.createElement('div');
  root.id = 'gkh-root';
  root.innerHTML = `
  <div class="h" id="H">
    <div class="h-l"><div class="h-logo">${I.bolt}</div><span>Kahoot Solver</span><span class="h-dot" id="DOT"></span></div>
    <div class="h-r">
      <button class="h-b" id="MN" title="Min">${I.min}</button>
      <button class="h-b" id="ST" title="Stealth">${I.ghost}</button>
      <button class="h-b" id="CL" title="Close">${I.x}</button>
    </div>
  </div>
  <div class="t" id="T">
    <button class="t-b on" data-t="solve">${I.play}<span>Solve</span></button>
    <button class="t-b" data-t="chat">${I.chat}<span>Chat</span></button>
    <button class="t-b" data-t="explain">${I.book}<span>Info</span></button>
    <button class="t-b" data-t="settings">${I.cog}<span>Config</span></button>
    <button class="t-b" data-t="log">${I.code}<span>Log</span></button>
    <button class="t-b" data-t="credit">${I.heart}<span>Cred</span></button>
  </div>
  <div class="bd" id="BD">

    <div class="p on" data-p="solve">
      <div class="tip" id="TIP">${I.spark}<span>Groq · gpt-oss-120b</span></div>
      <div class="pn" id="PN">—</div>
      <button class="btn btn-p mb" id="GO">${I.play}<span>JAWAB SEKARANG</span></button>
      <div class="bar" id="BAR"><div class="bar-f" id="BARF"></div></div>
      <div class="g3 mt">
        <button class="btn btn-s btn-sm" id="SC">${I.scan}<span>SCAN</span></button>
        <button class="btn btn-g btn-sm" id="LP">${I.loop}<span>AUTO</span></button>
        <button class="btn btn-d btn-sm" id="RS">${I.trash}<span>RS</span></button>
      </div>
      <div class="sc" id="SCD">
        <div class="sc-t">${I.spark}<span>HASIL</span></div>
        <div class="sc-v" id="SCV">-</div>
        <div class="sc-d" id="SCDD"></div>
      </div>
    </div>

    <div class="p" data-p="chat">
      <div class="cw">
        <div class="cw-h"><span style="display:flex;gap:5px;align-items:center">${I.chat}<span id="CM">Chat · —</span></span><button style="background:none;border:none;color:#94a3b8;cursor:pointer;padding:0" id="CC">${I.trash}</button></div>
        <div class="cw-m" id="MS">
          <div class="m a">Halo! Ketik perintah auto-solve, contoh: "kerjain nomor 1-5" · "jawab nomor 3"</div>
        </div>
        <div class="chips">
          <span class="ch" data-p="kerjain nomor 1-dst">Semua</span>
          <span class="ch" data-p="kerjain nomor 1-5">1-5</span>
          <span class="ch" data-p="Jelaskan soal ini">Jelaskan</span>
          <span class="ch" data-p="Ringkas">Ringkas</span>
        </div>
        <div class="cw-i">
          <textarea id="CI" placeholder="Ketik... (Enter kirim)" rows="1"></textarea>
          <button class="cw-s" id="CS">${I.send}</button>
        </div>
      </div>
    </div>

    <div class="p" data-p="explain">
      <div class="exl" id="EX"><div style="color:#64748b;font-size:10px;text-align:center;padding:20px">✦ Belum ada ✦</div></div>
    </div>

    <div class="p" data-p="settings">
      <div class="mb"><div class="lbl">${I.spark}<span>Provider</span></div><select class="sel" id="PR"><option value="groq">Groq</option><option value="cloudflare">Cloudflare</option><option value="openrouter">OpenRouter</option><option value="openai">OpenAI</option></select></div>
      <div class="mb"><div class="lbl">${I.code}<span>Model</span></div><select class="sel" id="MD"></select></div>
      <div class="mb"><div class="lbl">${I.bolt}<span>API Key</span><span id="KH">auto</span></div><div class="iw"><input class="inp" id="KY" type="password"><button class="iey" id="EY">${I.eye}</button></div></div>
      <div class="mb">
        <div class="sw"><div><div class="sw-t">Auto-Scroll</div><div class="sw-d">Scroll ke tile</div></div><label class="tg"><input type="checkbox" id="OS" checked><span class="ts"></span></label></div>
        <div class="sw"><div><div class="sw-t">Auto-Explain</div><div class="sw-d">WAJIB ON</div></div><label class="tg"><input type="checkbox" id="OE" checked><span class="ts"></span></label></div>
        <div class="sw"><div><div class="sw-t">Show Persona</div><div class="sw-d">Tampil</div></div><label class="tg"><input type="checkbox" id="OP" checked><span class="ts"></span></label></div>
      </div>
      <div class="g2"><button class="btn btn-s btn-sm" id="SV">SAVE</button><button class="btn btn-s btn-sm" id="LD">LOAD</button></div>
    </div>

    <div class="p" data-p="log">
      <div class="g2 mb"><button class="btn btn-s btn-sm" id="EXB">EXPORT</button><button class="btn btn-d btn-sm" id="CLB">CLEAR</button></div>
      <div class="log" id="LG"><div>Ready.</div></div>
    </div>

    <div class="p" data-p="credit">
      <div class="cr">
        <div class="cr-a">${I.user}</div>
        <div class="cr-n">ALIP / ALRECT</div>
        <div class="cr-r">Developer</div>
        <a class="cr-w" href="https://wa.me/6282192401340" target="_blank">${I.wa}<div class="cr-w-t"><span class="cr-w-l">ORDER NOW</span><span class="cr-w-n">+62 821-9240-1340</span></div></a>
        <div class="cr-f">GFS Kahoot Compact v2 · © 2026</div>
      </div>
    </div>

  </div>
  <div class="ft"><span>⚡ GKH v2</span><span class="bg" id="FST">idle</span></div>`;
  document.body.appendChild(root);

  // ─── HELPERS ───
  const $ = id => document.getElementById(id);
  const qs = (s, r) => { try { return (r || document).querySelector(s); } catch { return null; } };
  const qsa = (s, r) => { try { return [...(r || document).querySelectorAll(s)]; } catch { return []; } };
  const firstOf = (arr, r) => { for (const s of arr) { const el = qs(s, r); if (el) return el; } return null; };
  const allOf = (arr, r) => { const o = new Set(); for (const s of arr) qsa(s, r).forEach(e => o.add(e)); return [...o]; };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const norm = s => String(s || '').toLowerCase().replace(/\s+/g, ' ').replace(/[.,;:!?'"()\-–—]/g, '').trim();

  const log = (m, c = 'in') => {
    const el = $('LG'); const d = document.createElement('div');
    d.className = c; d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + m;
    el.appendChild(d); el.scrollTop = el.scrollHeight;
    while (el.children.length > 400) el.removeChild(el.firstChild);
  };
  const setSt = t => { const b = $('FST'); b.textContent = t; b.className = 'bg'; if (t === 'running') b.classList.add('b'); else if (t === 'error') b.classList.add('e'); else if (t === 'done') b.classList.add('d'); };

  // ─── TABS ───
  qsa('.t-b').forEach(b => b.onclick = () => {
    qsa('.t-b').forEach(x => x.classList.remove('on'));
    qsa('.p').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    qs('.p[data-p="' + b.dataset.t + '"]').classList.add('on');
  });

  // ─── HEADER ───
  $('ST').onclick = () => { S.stealth = true; root.style.display = 'none'; pill.classList.add('on'); };
  $('CL').onclick = () => { root.remove(); pill.remove(); if (S.loop) clearInterval(S.loop); window.__GKH_LOADED__ = false; };
  $('MN').onclick = () => { const b = $('BD'), t = $('T'), f = root.querySelector('.ft'); const h = b.style.display === 'none'; b.style.display = h ? '' : 'none'; t.style.display = h ? '' : 'none'; f.style.display = h ? '' : 'none'; $('MN').innerHTML = h ? I.min : I.max; };
  $('EY').onclick = () => { const i = $('KY'); i.type = i.type === 'password' ? 'text' : 'password'; };

  // ─── CONFIG ───
  const updateModels = () => {
    const p = $('PR').value; const s = $('MD'); s.innerHTML = '';
    (MODELS[p] || []).forEach(m => { const o = document.createElement('option'); o.value = m; o.textContent = m; s.appendChild(o); });
    if (KEYS[p]) { $('KY').value = KEYS[p]; $('KH').textContent = 'auto'; } else { $('KY').value = ''; $('KH').textContent = 'manual'; }
    $('TIP').innerHTML = I.spark + '<span>' + p + ' · ' + s.value + ' · batch ' + (BATCH[p] || 2) + '</span>';
    if ($('OP').checked) $('PN').textContent = PERSONA[p] || '—';
    $('CM').textContent = 'Chat · ' + p + '/' + s.value;
  };
  $('PR').onchange = updateModels;
  $('MD').onchange = () => { $('CM').textContent = 'Chat · ' + $('PR').value + '/' + $('MD').value; };
  $('OP').onchange = () => { $('PN').style.display = $('OP').checked ? 'block' : 'none'; if ($('OP').checked) $('PN').textContent = PERSONA[$('PR').value] || '—'; };
  $('SV').onclick = () => { localStorage.setItem('gkh2_cfg', JSON.stringify({ p: $('PR').value, m: $('MD').value, k: $('KY').value, s: $('OS').checked, e: $('OE').checked, o: $('OP').checked })); log('Saved.', 'ok'); };
  $('LD').onclick = () => { try { const c = JSON.parse(localStorage.getItem('gkh2_cfg') || '{}'); if (c.p) { $('PR').value = c.p; updateModels(); } if (c.m) $('MD').value = c.m; if (c.k && !KEYS[$('PR').value]) $('KY').value = c.k; if (c.s !== undefined) $('OS').checked = c.s; if (c.e !== undefined) $('OE').checked = c.e; if (c.o !== undefined) $('OP').checked = c.o; log('Loaded.', 'ok'); } catch { log('Load gagal', 'er'); } };
  $('EXB').onclick = () => { const t = [...$('LG').children].map(c => c.textContent).join('\n'); const b = new Blob([t], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'gkh-log.txt'; a.click(); };
  $('CLB').onclick = () => { $('LG').innerHTML = ''; };

  // ─── DRAG ───
  const H = $('H'); let dr = false, dx = 0, dy = 0;
  const sDr = (x, y) => { const r = root.getBoundingClientRect(); dr = true; dx = x - r.left; dy = y - r.top; root.style.transform = 'none'; root.style.animation = 'none'; root.style.left = r.left + 'px'; root.style.top = r.top + 'px'; };
  const mDr = (x, y) => { if (!dr) return; const r = root.getBoundingClientRect(); root.style.left = Math.max(0, Math.min(innerWidth - r.width, x - dx)) + 'px'; root.style.top = Math.max(0, Math.min(innerHeight - 40, y - dy)) + 'px'; };
  H.onmousedown = e => { if (e.target.closest('button')) return; sDr(e.clientX, e.clientY); };
  H.ontouchstart = e => { if (e.target.closest('button')) return; sDr(e.touches[0].clientX, e.touches[0].clientY); };
  document.onmousemove = e => mDr(e.clientX, e.clientY);
  document.ontouchmove = e => mDr(e.touches[0].clientX, e.touches[0].clientY);
  document.onmouseup = () => dr = false;
  document.ontouchend = () => dr = false;

  // ─── KAHOOT PARSER ───
  const Q_SEL = ['[data-functional-selector="question-title"]','[data-functional-selector*="question"]','[class*="question-title"]','[class*="QuestionTitle"]','[class*="question__title"]','h1[class*="question"]','h2[class*="question"]','[class*="questionText"]','[class*="prompt"]','h1','h2'];
  const O_SEL = ['[data-functional-selector*="answer"]','[data-functional-selector*="choice"]','[class*="answer-tile"]','[class*="AnswerTile"]','[class*="answerButton"]','[class*="answer-button"]','[class*="answer__"]','[class*="choice"]','button[class*="answer"]','[role="button"][class*="answer"]'];
  const N_SEL = ['[data-functional-selector="next-button"]','[data-functional-selector*="next"]','[class*="next-button"]','[class*="nextButton"]','button[class*="next"]'];

  const ex = el => { if (!el) return ''; let t = (el.innerText || el.textContent || '').trim(); t = t.replace(/^[A-Z][.)\-:]\s*/, '').replace(/^\d+[.)\-:]\s*/, '').trim(); return t; };
  const audio = c => { const s = ['audio','[class*="audio"]','[class*="speaker"]','[class*="volume"]','button[aria-label*="play" i]','svg[class*="speaker"]','svg[class*="volume"]']; for (const x of s) { try { if (c.querySelector(x)) return true; } catch {} } return false; };
  const TFR = /^(benar|salah|true|false|b\s*\/\s*s|t\s*\/\s*f|ya|tidak|yes|no)$/i;
  const isTF = q => q.opts.length === 2 && q.opts.every(o => TFR.test(o.text.trim()));
  const findTF = (q, t) => { const p = t ? /^(benar|true|ya|yes)$/i : /^(salah|false|tidak|no)$/i; for (const o of q.opts) if (p.test(o.text.trim())) return o.el; return null; };

  const parseKahoot = () => {
    let qt = ''; const qe = firstOf(Q_SEL); if (qe) qt = ex(qe);
    let opts = allOf(O_SEL).map(el => { const t = ex(el); return t ? { text: t, el } : null; }).filter(Boolean);
    if (opts.length < 2) {
      const btns = qsa('button, [role="button"]').filter(b => {
        if (b.offsetParent === null) return false;
        const t = ex(b); if (!t || t.length > 400) return false;
        const r = b.getBoundingClientRect(); if (r.width < 80 || r.height < 40) return false;
        if (/next|submit|lanjut|kirim|back|kembali|exit|menu|settings/i.test(t)) return false;
        return true;
      });
      const seen = new Set();
      opts = btns.filter(b => { const t = ex(b); if (seen.has(t)) return false; seen.add(t); return true; }).map(b => ({ text: ex(b), el: b }));
    }
    const seen = new Set();
    opts = opts.filter(o => { if (seen.has(o.text)) return false; seen.add(o.text); return true; });
    if (opts.length > 6) opts = opts.map(o => { const r = o.el.getBoundingClientRect(); return { ...o, a: r.width * r.height }; }).sort((x, y) => y.a - x.a).slice(0, 6);
    return { idx: 0, qText: qt, opts, hasAudio: audio(document.body) };
  };
  const parseAll = () => { const c = parseKahoot(); return c.opts.length >= 2 ? [c] : []; };
  const findNext = () => { for (const s of N_SEL) { const b = qs(s); if (b && b.offsetParent !== null && !b.disabled) return b; } return null; };

  // ─── AI CALLERS ───
  const call = async (prov, key, model, prompt, persona, chatMode = false) => {
    const sys = chatMode ? persona + ' Asisten chat cerdas. Jawab natural, ringkas.' : persona;
    let url, headers = { 'Content-Type': 'application/json' }, body;
    if (prov === 'groq') { url = 'https://api.groq.com/openai/v1/chat/completions'; headers.Authorization = 'Bearer ' + key; body = { model, messages: [{ role: 'system', content: sys }, { role: 'user', content: prompt }], temperature: 0.0, max_tokens: 3000 }; if (!chatMode) body.response_format = { type: 'json_object' }; }
    else if (prov === 'openrouter') { url = 'https://openrouter.ai/api/v1/chat/completions'; headers.Authorization = 'Bearer ' + key; body = { model, messages: [{ role: 'system', content: sys }, { role: 'user', content: prompt }], temperature: 0.0, max_tokens: 3000 }; if (!chatMode) body.response_format = { type: 'json_object' }; }
    else if (prov === 'openai') { url = 'https://api.openai.com/v1/chat/completions'; headers.Authorization = 'Bearer ' + key; body = { model, messages: [{ role: 'system', content: sys }, { role: 'user', content: prompt }], temperature: 0.0, max_tokens: 3000 }; if (!chatMode) body.response_format = { type: 'json_object' }; }
    else if (prov === 'cloudflare') { url = 'https://api.cloudflare.com/client/v4/accounts/' + CF_ACC + '/ai/run/' + model; headers.Authorization = 'Bearer ' + key; body = { messages: [{ role: 'system', content: sys }, { role: 'user', content: prompt }] }; }
    const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(prov + ' ' + r.status + ': ' + (await r.text()).slice(0, 120));
    const d = await r.json();
    if (prov === 'cloudflare') { if (!d.success) throw new Error('CF fail'); let t = d?.result?.response; if (!t && d?.result?.choices?.[0]?.message?.content) t = d.result.choices[0].message.content; if (!t) throw new Error('CF empty'); return t; }
    return d.choices[0].message.content;
  };

  const parseRes = raw => {
    let d;
    try { d = JSON.parse(raw); } catch {
      const a = raw.match(/\[[\s\S]*\]/), o = raw.match(/\{[\s\S]*\}/);
      if (a) d = JSON.parse(a[0]); else if (o) d = JSON.parse(o[0]); else throw new Error('Not JSON');
    }
    if (typeof d === 'object' && !Array.isArray(d) && typeof d.t === 'boolean' && Number.isInteger(d.i)) return [{ idx: d.i, tf: d.t, answer: d.t ? 'BENAR' : 'SALAH', confidence: 0.9, reason: d.reason || '' }];
    const list = Array.isArray(d) ? d : (d.answers || d.data || []);
    if (!Array.isArray(list)) throw new Error('Bad fmt');
    return list.map(x => {
      if (!x) return null;
      const idx = Number.isInteger(x.i) ? x.i : (Number.isInteger(x.idx) ? x.idx : null);
      if (idx === null) return null;
      if (typeof x.t === 'boolean') return { idx, tf: x.t, answer: x.t ? 'BENAR' : 'SALAH', confidence: 0.9, reason: x.reason || '' };
      const a = x.a || x.answer || null;
      if (typeof a !== 'string') return null;
      return { idx, answer: a, confidence: Math.min(1, Math.max(0, Number(x.confidence) || 0.85)), reason: x.reason || '' };
    }).filter(Boolean);
  };

  const findOpt = (q, ans) => {
    const raw = String(ans || '').trim(); if (!raw) return { el: null, r: 'empty' };
    let m = q.opts.find(o => o.text === raw); if (m) return { el: m.el, r: 'exact' };
    const st = raw.replace(/^\s*[A-Za-z0-9][.)\-:]\s*/, '').trim();
    if (st !== raw) { m = q.opts.find(o => o.text === st); if (m) return { el: m.el, r: 'exact-strip' }; }
    const nr = norm(raw), ns = norm(st);
    m = q.opts.find(o => norm(o.text) === nr); if (m) return { el: m.el, r: 'normal' };
    if (ns !== nr) { m = q.opts.find(o => norm(o.text) === ns); if (m) return { el: m.el, r: 'normal-strip' }; }
    const cds = q.opts.filter(o => { const n = norm(o.text); return n.length > 0 && ns.length >= n.length * 0.5 && (n.includes(ns) || ns.includes(n)); });
    if (cds.length === 1) return { el: cds[0].el, r: 'contains' };
    if (cds.length > 1) return { el: cds[0].el, r: 'contains-best' };
    return { el: null, r: 'no-match' };
  };

  const renderEx = (answers, questions, matches) => {
    const el = $('EX'); el.innerHTML = '';
    answers.forEach(a => {
      const q = questions[a.idx]; if (!q) return;
      const m = matches[a.idx] || {};
      const d = document.createElement('div'); d.className = 'ex';
      if (m.r === 'no-match') d.style.borderLeftColor = '#ef4444';
      else if (m.r && m.r.startsWith('contains-best')) d.style.borderLeftColor = '#fbbf24';
      else d.style.borderLeftColor = '#22c55e';
      const at = a.tf !== undefined ? (a.tf ? 'BENAR' : 'SALAH') : a.answer;
      d.innerHTML = '<div class="ex-t">' + I.spark + ' Q' + (a.idx + 1) + ' · ' + (m.r || '') + '</div><div class="ex-a">' + (m.r === 'no-match' ? '✗ ' : '✓ ') + at + '</div><div class="ex-r">' + (a.reason || q.qText.slice(0, 140)) + '</div><div class="ex-c">Conf: ' + (a.confidence * 100).toFixed(0) + '%</div>';
      el.appendChild(d);
    });
  };

  // ─── SCAN ───
  $('SC').onclick = () => {
    const all = parseAll();
    log('Detected: ' + all.length + ' soal', 'ok');
    all.forEach(q => {
      const tf = isTF(q);
      const tag = q.hasAudio ? '[AUDIO]' : (tf ? '[TF]' : '[MCQ/' + q.opts.length + ']');
      log(tag + ' ' + (q.qText || '(no text)').slice(0, 70), q.hasAudio ? 'wn' : 'in');
      q.opts.forEach((o, j) => log('  ' + (j + 1) + '. ' + o.text.slice(0, 60), 'in'));
    });
    if (!all.length) log('Nggak ketemu soal. Tunggu soal muncul.', 'er');
  };
  $('RS').onclick = () => log('Kahoot nggak bisa di-reset.', 'wn');
  $('LP').onclick = () => {
    if (S.loop) { clearInterval(S.loop); S.loop = null; $('LP').innerHTML = I.loop + '<span>AUTO</span>'; log('Auto OFF', 'wn'); return; }
    log('Auto ON — 3s interval', 'ok'); $('LP').innerHTML = I.loop + '<span>STOP</span>';
    S.loop = setInterval(() => { if (!S.running) $('GO').click(); }, 3000);
  };

  // ─── SOLVE ───
  $('GO').onclick = async () => {
    if (S.running) return;
    const key = $('KY').value.trim(), prov = $('PR').value, model = $('MD').value;
    if (!key) return log('API key kosong.', 'er');
    const qs_ = parseAll();
    if (!qs_.length) return log('Nggak ada soal.', 'er');
    const audioQ = qs_.filter(q => q.hasAudio);
    const solv = qs_.filter(q => !q.hasAudio);
    if (!solv.length) return log('Semua audio.', 'er');
    if (audioQ.length) log('⚠ ' + audioQ.length + ' audio-skip', 'wn');

    const tfq = solv.filter(isTF), mcq = solv.filter(q => !isTF(q));
    log('TF:' + tfq.length + ' MCQ:' + mcq.length, 'in');

    S.running = true; setSt('running'); $('DOT').classList.add('b');
    const btn = $('GO'); btn.disabled = true; btn.innerHTML = I.play + '<span>...</span>';
    $('BAR').classList.add('on');

    const wantEx = $('OE').checked, persona = PERSONA[prov] || '', bs = BATCH[prov] || 2;
    const ans = [], matches = {};
    let done = 0; const total = tfq.length + mcq.length;

    try {
      for (const q of tfq) {
        const p = 'Evaluasi pernyataan. Nilai kebenaran berbasis FAKTA ILMIAH/HISTORIS/UMUM.\n\nPernyataan [ID ' + q.idx + ']: "' + q.qText + '"\n\nBalas JSON: {"i":' + q.idx + ',"t":<true|false>,"reason":"<1-2 kalimat fakta>"}';
        try {
          const r = await call(prov, key, model, p, persona);
          const a = parseRes(r); a.forEach(x => { if (x.tf !== undefined) ans.push(x); });
          log('TF → ' + (a[0]?.tf ? 'BENAR' : 'SALAH') + ' · ' + (a[0]?.reason || '').slice(0, 50), 'ok');
        } catch (e) { log('TF err: ' + e.message, 'er'); }
        done++; $('BARF').style.width = Math.round(done / total * 100) + '%';
        await sleep(300);
      }
      if (mcq.length) {
        const batches = Math.ceil(mcq.length / bs);
        log('MCQ ' + batches + ' batch × ' + bs, 'ai');
        for (let b = 0; b < batches; b++) {
          const bt = mcq.slice(b * bs, b * bs + bs);
          const p = 'Jawab MCQ. Pilih opsi PALING DIDUKUNG FAKTA.\nBALAS JSON: {"answers":[{"i":<idx>,"a":"<teks opsi PERSIS>"' + (wantEx ? ',"reason":"<1 kalimat>"' : '') + '}]}\n\nSOAL:\n' + bt.map(q => '[' + q.idx + '] ' + q.qText + '\n' + q.opts.map(o => '- ' + o.text).join('\n')).join('\n\n');
          try {
            const r = await call(prov, key, model, p, persona);
            const a = parseRes(r); a.forEach(x => { if (x.tf === undefined) ans.push(x); });
            log('MCQ b' + (b + 1) + ' → ' + a.length, 'ok');
          } catch (e) { log('MCQ b' + (b + 1) + ' err: ' + e.message, 'er'); }
          done += bt.length; $('BARF').style.width = Math.round(done / total * 100) + '%';
          await sleep(500);
        }
      }

      let ok = 0, sk = 0;
      for (const a of ans) {
        const q = qs_[a.idx]; if (!q) continue;
        let m;
        if (a.tf !== undefined) { const el = findTF(q, a.tf); m = el ? { el, r: a.tf ? 'tf-T' : 'tf-F' } : { el: null, r: 'no-tf' }; }
        else m = findOpt(q, a.answer);
        matches[a.idx] = m;
        if (m.el) {
          if ($('OS').checked) m.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await sleep(120); m.el.click(); ok++;
          log('Q' + a.idx + ' ✓ ' + (a.tf !== undefined ? (a.tf ? 'BENAR' : 'SALAH') : a.answer.slice(0, 35)), 'ok');
        } else { sk++; log('Q' + a.idx + ' ✗ ' + m.r, 'er'); }
        await sleep(160);
      }

      renderEx(ans, qs_, matches);
      $('SCD').classList.add('on');
      $('SCV').textContent = ok + '/' + solv.length;
      $('SCDD').textContent = prov + ' · TF:' + tfq.length + ' MCQ:' + mcq.length + ' Skip:' + sk;
      setSt('done');
      log('═══ DONE: ' + ok + '/' + solv.length + ' ═══', 'ok');
    } catch (e) { log('ERR: ' + e.message, 'er'); setSt('error'); }
    finally {
      btn.disabled = false; btn.innerHTML = I.play + '<span>JAWAB SEKARANG</span>';
      S.running = false; $('DOT').classList.remove('b');
      setTimeout(() => $('BAR').classList.remove('on'), 1000);
    }
  };

  // ─── CHAT ───
  const MS = $('MS'), CI = $('CI'), CS = $('CS');
  const addMsg = (t, c) => { const d = document.createElement('div'); d.className = 'm ' + c; d.textContent = t; MS.appendChild(d); MS.scrollTop = MS.scrollHeight; return d; };
  const addTyp = () => { const d = document.createElement('div'); d.className = 'm a'; d.innerHTML = '<div class="dt"><span></span><span></span><span></span></div>'; MS.appendChild(d); MS.scrollTop = MS.scrollHeight; return d; };
  CI.addEventListener('input', () => { CI.style.height = 'auto'; CI.style.height = Math.min(CI.scrollHeight, 80) + 'px'; });
  CI.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doChat(); } });
  CS.onclick = doChat;

  const parseNum = t => {
    const r = /(?:kerjain|kerjakan|jawab|jawabin|isi|isin|solve|do|gas|gasin)\s+(?:soal\s+)?(?:nomor|no|number|ke-)\s*(\d+)(?:\s*(?:-|–|—|sampai|sd|to|hingga|ampe|ampek)\s*(\d+|dst|habis|akhir|semua|end|all|beres))?/i;
    const m = t.match(r); if (!m) return null;
    const s = parseInt(m[1], 10); if (!s || s < 1) return null;
    let e = s; if (m[2]) { if (/^\d+$/.test(m[2])) e = parseInt(m[2], 10); else e = Infinity; }
    if (e !== Infinity && e < s) e = s;
    return { s, e };
  };

  async function doChat() {
    const t = CI.value.trim(); if (!t || S.running) return;
    const intent = parseNum(t);
    if (intent) {
      addMsg(t, 'u'); CI.value = ''; CI.style.height = 'auto';
      addMsg('⚡ Pakai tombol JAWAB SEKARANG di tab Solve biar akurat.', 's');
      return;
    }
    const key = $('KY').value.trim(), prov = $('PR').value, model = $('MD').value;
    if (!key) { addMsg('API key kosong.', 'e'); return; }
    addMsg(t, 'u'); CI.value = ''; CI.style.height = 'auto';
    S.chat.push({ role: 'user', content: t });
    S.running = true; setSt('running'); $('DOT').classList.add('b'); CS.disabled = true;
    const tp = addTyp();
    try {
      const p = S.chat.slice(-20).map(m => (m.role === 'user' ? 'User: ' : 'AI: ') + m.content).join('\n\n');
      const r = await call(prov, key, model, p, PERSONA[prov] || '', true);
      tp.remove(); addMsg(r, 'a');
      S.chat.push({ role: 'assistant', content: r });
      setSt('done');
    } catch (e) { tp.remove(); addMsg('ERR: ' + e.message, 'e'); setSt('error'); }
    finally { S.running = false; CS.disabled = false; $('DOT').classList.remove('b'); }
  }

  qsa('.ch').forEach(c => c.onclick = () => { CI.value = c.dataset.p; CI.focus(); });
  $('CC').onclick = () => { S.chat = []; MS.innerHTML = ''; addMsg('Chat cleared.', 'a'); };

  // ─── HOTKEY ───
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'G') {
      e.preventDefault();
      if (S.stealth) { root.style.display = 'flex'; pill.classList.remove('on'); S.stealth = false; }
      else { S.stealth = true; root.style.display = 'none'; pill.classList.add('on'); }
    }
  });

  $('PR').value = 'groq';
  updateModels();
  log('GKH Compact v2. Loaded.', 'ok');
})();
