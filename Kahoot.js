/* GFS Kahoot Solver BRUTAL v3 — by Alip/Alrect */
(function () {
  if (window.__GKH_LOADED__) { document.getElementById('gkh-root')?.remove(); document.getElementById('gkh-pill')?.remove(); window.__GKH_LOADED__ = false; return; }
  window.__GKH_LOADED__ = true;

  const CF_ACC = '7f83137df22c15f252e1da2ee2214a6c';
  const CF_TOK = 'cfut_2WkAuydB6WzZXAzdSIGz3kI5AxyEQVDOqllfGshz3568c7ff';
  const KEYS = {
    groq: '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',
    openrouter: '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',
    cloudflare: CF_TOK
  };
  const PERSONA = {
    groq: '[MCQ+TF solver ahli. Sangat teliti. Untuk TF, nilai berbasis fakta ilmiah bukan asumsi. Jangan asal.]',
    openrouter: '[MCQ+TF solver. Fokus akurasi, teliti pronoun + fakta.]',
    cloudflare: '[MCQ+TF solver. Nilai fakta teliti.]',
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

  const I = {
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="square" stroke-linejoin="miter"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2.5" stroke-linejoin="miter"><polygon points="6 3 20 12 6 21 6 3"/></svg>',
    scan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="square" stroke-linejoin="miter"><path d="M3 7V4h3M17 3h3v3M21 17v3h-3M7 21H4v-3"/><line x1="7" y1="12" x2="17" y2="12"/></svg>',
    loop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="square" stroke-linejoin="miter"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    min: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="M5 12h14"/></svg>',
    max: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="M12 5v14M5 12h14"/></svg>',
    ghost: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square" stroke-linejoin="miter"><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/><path d="M9 10h.01M15 10h.01"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square" stroke-linejoin="miter"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square" stroke-linejoin="miter"><path d="M4 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V4z"/><path d="M4 20h14"/></svg>',
    cog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square" stroke-linejoin="miter"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="square" stroke-linejoin="miter"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="square" stroke-linejoin="miter"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="square" stroke-linejoin="miter"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square" stroke-linejoin="miter"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square" stroke-linejoin="miter"><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><path d="M12 2l1.9 5.8L20 9.7l-5.8 1.9L12 17.4l-2.2-5.8L4 9.7l6.1-1.9L12 2z"/></svg>'
  };

  const css = `
  /* ===== BRUTAL RED / MATERIAL 3D ===== */
  #gkh-root, #gkh-root *, #gkh-pill { box-sizing: border-box !important; }
  #gkh-root, #gkh-root * { animation: none !important; transition: none !important; }

  #gkh-root{
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 460px;
    max-width: 96vw;
    max-height: 92vh;
    background: #1c0808;
    color: #fdf0f0;
    border: 3px solid #000;
    box-shadow:
      8px 8px 0 0 #000,
      8px 8px 0 3px #ff2b2b,
      inset 0 0 0 1px #4a1010;
    font: 12.5px/1.45 'Segoe UI', system-ui, -apple-system, Roboto, sans-serif;
    display: flex;
    flex-direction: column;
    z-index: 2147483647;
    overflow: hidden;
    letter-spacing: .1px;
  }

  /* Header */
  .br-h{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: #ff2b2b;
    border-bottom: 3px solid #000;
    flex-shrink: 0;
    color: #fff;
  }
  .br-h-l{ display: flex; align-items: center; gap: 9px; }
  .br-h-logo{
    width: 26px; height: 26px;
    background: #000;
    border: 2px solid #000;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 2px 2px 0 #7a0f0f;
  }
  .br-h-logo svg{ width: 14px; height: 14px; color: #ff2b2b; }
  .br-h-title{
    font-weight: 900; font-size: 14px;
    text-transform: uppercase; letter-spacing: 1.2px;
    text-shadow: 2px 2px 0 #000;
  }
  .br-h-dot{
    width: 10px; height: 10px;
    background: #4ade80; border: 2px solid #000;
    box-shadow: 1px 1px 0 #000;
  }
  .br-h-dot.run{ background: #facc15; }
  .br-h-r{ display: flex; gap: 5px; }
  .br-h-b{
    width: 26px; height: 26px;
    background: #fff;
    border: 2px solid #000;
    color: #000;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 2px 2px 0 #000;
    padding: 0;
  }
  .br-h-b svg{ width: 13px; height: 13px; }
  .br-h-b:active{ box-shadow: 0 0 0 #000; transform: translate(2px, 2px); }

  /* Body split: sidebar + content */
  .br-body{
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  /* Vertical tab rail */
  .br-rail{
    width: 72px;
    background: #2a0e0e;
    border-right: 3px solid #000;
    display: flex;
    flex-direction: column;
    padding: 4px 0;
    flex-shrink: 0;
    overflow-y: auto;
  }
  .br-rail::-webkit-scrollbar{ width: 0; }
  .br-tab{
    background: transparent;
    border: none;
    border-bottom: 2px solid #000;
    color: #a86a6a;
    padding: 9px 4px;
    cursor: pointer;
    font-family: inherit;
    font-size: 8.5px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    border-left: 4px solid transparent;
    text-align: center;
  }
  .br-tab svg{ width: 17px; height: 17px; }
  .br-tab:hover{ color: #fdf0f0; background: #3a1414; }
  .br-tab.on{
    background: #ff2b2b;
    color: #fff;
    border-left-color: #ffcc00;
    text-shadow: 1px 1px 0 #000;
  }
  .br-tab.on svg{ color: #fff; filter: drop-shadow(1px 1px 0 #000); }

  /* Content */
  .br-content{
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    min-width: 0;
    background: #180808;
    scrollbar-width: thin;
    scrollbar-color: #ff2b2b #1c0808;
  }
  .br-content::-webkit-scrollbar{ width: 8px; }
  .br-content::-webkit-scrollbar-track{ background: #1c0808; border-left: 1px solid #000; }
  .br-content::-webkit-scrollbar-thumb{ background: #ff2b2b; border: 1px solid #000; }

  .br-p{ display: none; }
  .br-p.on{ display: block; }

  /* Cards */
  .br-card{
    background: #260c0c;
    border: 2px solid #000;
    box-shadow: 3px 3px 0 #000;
    padding: 10px;
    margin-bottom: 9px;
  }
  .br-card.hi{
    background: #3a0f0f;
    border-color: #ff2b2b;
    box-shadow: 3px 3px 0 #000, inset 0 0 0 1px #ff2b2b;
  }

  .br-tip{
    display: flex; align-items: center; gap: 7px;
    padding: 8px 10px;
    background: #2a0e0e;
    border: 2px solid #000;
    border-left: 5px solid #ffcc00;
    box-shadow: 2px 2px 0 #000;
    color: #ffd9d9;
    font-size: 11px;
    margin-bottom: 9px;
    font-weight: 600;
  }
  .br-tip svg{ width: 13px; height: 13px; color: #ffcc00; flex-shrink: 0; }

  .br-pers{
    padding: 7px 9px;
    background: #1e0808;
    border: 2px solid #000;
    box-shadow: inset 2px 2px 0 rgba(0,0,0,.6);
    color: #d49090;
    font-size: 10px;
    font-style: italic;
    margin-bottom: 9px;
    line-height: 1.5;
    max-height: 52px;
    overflow: hidden;
  }

  /* Buttons */
  .br-btn{
    width: 100%;
    padding: 11px 12px;
    background: #3a1414;
    color: #fdf0f0;
    border: 3px solid #000;
    box-shadow: 4px 4px 0 #000;
    font: 800 12px 'Segoe UI', inherit;
    text-transform: uppercase;
    letter-spacing: .8px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    font-family: inherit;
    padding: 11px;
  }
  .br-btn svg{ width: 15px; height: 15px; }
  .br-btn:active{
    box-shadow: 0 0 0 #000;
    transform: translate(4px, 4px);
  }
  .br-btn:disabled{ opacity: .5; cursor: not-allowed; }
  .br-btn.red{
    background: #ff2b2b;
    color: #fff;
    text-shadow: 2px 2px 0 #000;
    box-shadow: 4px 4px 0 #000, inset 0 -3px 0 rgba(0,0,0,.3);
  }
  .br-btn.yel{
    background: #ffcc00;
    color: #000;
    box-shadow: 4px 4px 0 #000, inset 0 -3px 0 rgba(0,0,0,.2);
  }
  .br-btn.wht{
    background: #fdf0f0;
    color: #000;
    box-shadow: 4px 4px 0 #000;
  }
  .br-btn.dar{
    background: #1a0505;
    color: #f87171;
    box-shadow: 4px 4px 0 #000;
  }
  .br-btn.sm{
    padding: 8px;
    font-size: 10px;
    box-shadow: 3px 3px 0 #000;
  }
  .br-btn.sm svg{ width: 13px; height: 13px; }
  .br-btn.sm:active{ box-shadow: 0 0 0 #000; transform: translate(3px, 3px); }

  .br-g2{ display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .br-g3{ display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
  .mb8{ margin-bottom: 8px; }
  .mt8{ margin-top: 8px; }

  /* Progress bar brutalist */
  .br-bar{
    height: 12px;
    background: #000;
    border: 2px solid #000;
    box-shadow: inset 2px 2px 0 rgba(0,0,0,.8);
    margin-top: 9px;
    display: none;
    overflow: hidden;
  }
  .br-bar.on{ display: block; }
  .br-bar-f{
    height: 100%;
    width: 0%;
    background: repeating-linear-gradient(
      45deg,
      #ff2b2b,
      #ff2b2b 8px,
      #ffcc00 8px,
      #ffcc00 16px
    );
    border-right: 2px solid #000;
  }

  /* Score card */
  .br-sc{
    margin-top: 11px;
    padding: 12px;
    background: #1a0505;
    border: 3px solid #000;
    box-shadow: 4px 4px 0 #000, inset 0 0 0 2px #ff2b2b;
    display: none;
  }
  .br-sc.on{ display: block; }
  .br-sc-t{
    font-size: 9px;
    color: #ffcc00;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 6px;
    display: flex; align-items: center; gap: 5px;
    text-shadow: 1px 1px 0 #000;
  }
  .br-sc-t svg{ width: 12px; height: 12px; }
  .br-sc-v{
    font-size: 34px;
    font-weight: 900;
    color: #ff2b2b;
    line-height: 1;
    text-shadow: 3px 3px 0 #000;
    letter-spacing: -1px;
  }
  .br-sc-d{
    font-size: 10px;
    color: #a86a6a;
    margin-top: 7px;
    font-weight: 700;
  }

  /* Labels */
  .br-lbl{
    display: flex; align-items: center; gap: 5px;
    font-size: 9.5px;
    color: #ffcc00;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1.4px;
    margin-bottom: 5px;
    text-shadow: 1px 1px 0 #000;
  }
  .br-lbl svg{ width: 12px; height: 12px; }
  .br-lbl span{ margin-left: auto; color: #a86a6a; font-size: 9px; letter-spacing: .3px; font-weight: 700; }

  .br-inp, .br-sel{
    width: 100%;
    padding: 9px 10px;
    background: #0e0505;
    border: 2px solid #000;
    box-shadow: inset 2px 2px 0 rgba(0,0,0,.7);
    color: #fdf0f0;
    font: 11.5px inherit;
    font-family: inherit;
    outline: none;
  }
  .br-inp:focus, .br-sel:focus{
    border-color: #ff2b2b;
    box-shadow: inset 2px 2px 0 rgba(0,0,0,.7), 0 0 0 2px #ff2b2b;
  }
  .br-sel{ cursor: pointer; }
  .br-sel option{ background: #1c0808; color: #fdf0f0; }
  .br-iw{ position: relative; }
  .br-iw .br-inp{ padding-right: 36px; }
  .br-iey{
    position: absolute;
    right: 4px; top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #a86a6a;
    cursor: pointer;
    padding: 5px 7px;
  }
  .br-iey svg{ width: 13px; height: 13px; }
  .br-iey:hover{ color: #ff2b2b; }

  /* Switches */
  .br-sw{
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 10px;
    background: #1a0505;
    border: 2px solid #000;
    box-shadow: 2px 2px 0 #000;
    margin-bottom: 6px;
  }
  .br-sw-t{ font-size: 11px; color: #fdf0f0; font-weight: 800; }
  .br-sw-d{ font-size: 9px; color: #a86a6a; margin-top: 2px; font-weight: 600; }
  .br-tg{
    position: relative;
    width: 36px; height: 20px;
    flex-shrink: 0;
  }
  .br-tg input{ opacity: 0; width: 0; height: 0; }
  .br-ts{
    position: absolute;
    inset: 0;
    background: #2a0e0e;
    border: 2px solid #000;
    box-shadow: inset 2px 2px 0 rgba(0,0,0,.7);
    cursor: pointer;
  }
  .br-ts::before{
    content: '';
    position: absolute;
    height: 12px; width: 12px;
    left: 2px; top: 2px;
    background: #4a2020;
    border: 2px solid #000;
  }
  .br-tg input:checked + .br-ts{ background: #ff2b2b; }
  .br-tg input:checked + .br-ts::before{
    transform: translateX(16px);
    background: #ffcc00;
  }

  /* Log */
  .br-log{
    background: #050202;
    border: 3px solid #000;
    box-shadow: 3px 3px 0 #000, inset 2px 2px 0 rgba(0,0,0,.9);
    padding: 9px;
    font: 10px/1.6 'SF Mono', Menlo, Consolas, monospace;
    height: 260px;
    overflow-y: auto;
    color: #a86a6a;
  }
  .br-log div{ margin-bottom: 1px; word-break: break-word; }
  .br-log .ok{ color: #4ade80; }
  .br-log .er{ color: #ff5555; }
  .br-log .in{ color: #fbbf24; }
  .br-log .wn{ color: #f97316; }
  .br-log .ai{ color: #ffcc00; font-weight: 800; }
  .br-log::-webkit-scrollbar{ width: 6px; }
  .br-log::-webkit-scrollbar-thumb{ background: #ff2b2b; border: 1px solid #000; }

  /* Chat */
  .br-cw{
    display: flex;
    flex-direction: column;
    height: 360px;
    background: #120404;
    border: 3px solid #000;
    box-shadow: 3px 3px 0 #000;
    overflow: hidden;
  }
  .br-cw-h{
    padding: 8px 11px;
    background: #ff2b2b;
    border-bottom: 3px solid #000;
    font-size: 10px;
    color: #fff;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    display: flex; align-items: center; justify-content: space-between;
    text-shadow: 1px 1px 0 #000;
  }
  .br-cw-h svg{ width: 13px; height: 13px; }
  .br-cw-m{
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .br-cw-m::-webkit-scrollbar{ width: 6px; }
  .br-cw-m::-webkit-scrollbar-thumb{ background: #ff2b2b; border: 1px solid #000; }

  .br-m{
    max-width: 88%;
    padding: 8px 10px;
    font-size: 11.5px;
    line-height: 1.5;
    word-wrap: break-word;
    white-space: pre-wrap;
    border: 2px solid #000;
    box-shadow: 2px 2px 0 #000;
    font-weight: 600;
  }
  .br-m.u{
    align-self: flex-end;
    background: #ff2b2b;
    color: #fff;
    text-shadow: 1px 1px 0 #000;
  }
  .br-m.a{
    align-self: flex-start;
    background: #2a0e0e;
    color: #fdf0f0;
  }
  .br-m.e{
    align-self: flex-start;
    background: #4a0a0a;
    color: #fca5a5;
    border-color: #ff2b2b;
  }
  .br-m.s{
    align-self: center;
    background: #1a0505;
    color: #ffcc00;
    font-size: 10px;
    text-align: center;
    max-width: 95%;
    border-color: #ffcc00;
  }
  .br-dt{
    display: inline-flex; gap: 3px; padding: 2px 0;
  }
  .br-dt span{
    width: 6px; height: 6px;
    background: #ffcc00;
    border: 1px solid #000;
    animation: brDt 1.2s infinite !important;
  }
  .br-dt span:nth-child(2){ animation-delay: .15s !important; }
  .br-dt span:nth-child(3){ animation-delay: .3s !important; }
  @keyframes brDt{ 0%,100%{ opacity: .3; } 50%{ opacity: 1; } }

  .br-cw-i{
    display: flex;
    gap: 6px;
    padding: 8px;
    border-top: 3px solid #000;
    background: #0e0505;
  }
  .br-cw-i textarea{
    flex: 1;
    padding: 8px 10px;
    background: #050202;
    border: 2px solid #000;
    box-shadow: inset 2px 2px 0 rgba(0,0,0,.7);
    color: #fdf0f0;
    font: 11.5px inherit;
    font-family: inherit;
    resize: none;
    outline: none;
    max-height: 80px;
    min-height: 36px;
    line-height: 1.4;
  }
  .br-cw-i textarea:focus{
    border-color: #ff2b2b;
    box-shadow: inset 2px 2px 0 rgba(0,0,0,.7), 0 0 0 2px #ff2b2b;
  }
  .br-cw-s{
    width: 42px;
    background: #ff2b2b;
    border: 2px solid #000;
    box-shadow: 2px 2px 0 #000;
    color: #fff;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    padding: 0;
  }
  .br-cw-s svg{ width: 15px; height: 15px; }
  .br-cw-s:active{ box-shadow: 0 0 0 #000; transform: translate(2px, 2px); }
  .br-cw-s:disabled{ opacity: .5; cursor: not-allowed; }

  .br-chips{
    display: flex; flex-wrap: wrap; gap: 5px;
    padding: 0 8px 8px;
    background: #0e0505;
  }
  .br-ch{
    padding: 4px 9px;
    background: #2a0e0e;
    border: 2px solid #000;
    box-shadow: 2px 2px 0 #000;
    color: #ffcc00;
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .5px;
    cursor: pointer;
  }
  .br-ch:active{ box-shadow: 0 0 0 #000; transform: translate(2px, 2px); }

  /* Explain list */
  .br-exl{
    background: #050202;
    border: 3px solid #000;
    box-shadow: 3px 3px 0 #000;
    padding: 9px;
    max-height: 320px;
    overflow-y: auto;
  }
  .br-exl::-webkit-scrollbar{ width: 6px; }
  .br-exl::-webkit-scrollbar-thumb{ background: #ff2b2b; border: 1px solid #000; }
  .br-ex{
    padding: 9px;
    margin-bottom: 7px;
    background: #260c0c;
    border: 2px solid #000;
    border-left: 5px solid #4ade80;
    box-shadow: 2px 2px 0 #000;
  }
  .br-ex.err{ border-left-color: #ff2b2b; }
  .br-ex.wrn{ border-left-color: #ffcc00; }
  .br-ex-t{
    font-size: 9px;
    color: #ffcc00;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
    display: flex; align-items: center; gap: 4px;
  }
  .br-ex-t svg{ width: 11px; height: 11px; }
  .br-ex-a{
    font-size: 12px;
    color: #4ade80;
    font-weight: 800;
    margin-bottom: 4px;
    text-shadow: 1px 1px 0 #000;
  }
  .br-ex-a.err{ color: #ff5555; }
  .br-ex-r{
    font-size: 10.5px;
    color: #d49090;
    line-height: 1.5;
    font-weight: 600;
  }
  .br-ex-c{
    font-size: 9px;
    color: #a86a6a;
    margin-top: 4px;
    font-family: monospace;
    font-weight: 700;
  }

  /* Credit */
  .br-cr{
    padding: 18px 14px;
    background: #2a0e0e;
    border: 3px solid #000;
    box-shadow: 4px 4px 0 #000, inset 0 0 0 2px #ff2b2b;
    text-align: center;
  }
  .br-cr-a{
    width: 68px; height: 68px;
    margin: 0 auto 12px;
    background: #ff2b2b;
    border: 3px solid #000;
    box-shadow: 4px 4px 0 #000;
    display: flex; align-items: center; justify-content: center;
  }
  .br-cr-a svg{ width: 30px; height: 30px; color: #fff; }
  .br-cr-n{
    font-size: 20px;
    font-weight: 900;
    color: #ffcc00;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    text-shadow: 3px 3px 0 #000;
  }
  .br-cr-r{
    font-size: 9.5px;
    color: #a86a6a;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-weight: 800;
    margin: 5px 0 14px;
  }
  .br-cr-w{
    display: flex; align-items: center; justify-content: center; gap: 10px;
    padding: 11px;
    background: #4ade80;
    border: 3px solid #000;
    box-shadow: 4px 4px 0 #000;
    color: #000;
    font-weight: 900;
    text-decoration: none;
    text-transform: uppercase;
  }
  .br-cr-w:active{ box-shadow: 0 0 0 #000; transform: translate(4px, 4px); }
  .br-cr-w svg{ width: 20px; height: 20px; }
  .br-cr-w-t{ display: flex; flex-direction: column; align-items: flex-start; line-height: 1.2; }
  .br-cr-w-l{ font-size: 8px; letter-spacing: 1px; opacity: .7; }
  .br-cr-w-n{ font-size: 13px; font-weight: 900; }
  .br-cr-f{
    margin-top: 12px;
    font-size: 9px;
    color: #7a4040;
    font-weight: 700;
    letter-spacing: 1px;
  }

  /* Footer */
  .br-ft{
    display: flex; justify-content: space-between; align-items: center;
    padding: 7px 12px;
    background: #0e0505;
    border-top: 3px solid #000;
    font-size: 9.5px;
    color: #a86a6a;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    flex-shrink: 0;
  }
  .br-bg{
    padding: 3px 9px;
    background: #2a0e0e;
    border: 2px solid #000;
    box-shadow: 2px 2px 0 #000;
    color: #ffcc00;
    font-family: monospace;
    font-size: 9.5px;
    font-weight: 900;
    text-transform: uppercase;
  }
  .br-bg.run{ background: #ffcc00; color: #000; }
  .br-bg.er{ background: #ff2b2b; color: #fff; }
  .br-bg.dn{ background: #4ade80; color: #000; }

  /* Loading splash */
  #gkh-load{
    position: fixed;
    inset: 0;
    background: #0a0303;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #ff2b2b;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }
  #gkh-load-in{
    text-align: center;
    padding: 30px 40px;
    border: 4px solid #000;
    background: #1c0808;
    box-shadow: 8px 8px 0 #000, 8px 8px 0 3px #ff2b2b;
  }
  #gkh-load-logo{
    font-size: 34px;
    font-weight: 900;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #ff2b2b;
    text-shadow: 3px 3px 0 #000, 6px 6px 0 #ffcc00;
    margin-bottom: 8px;
  }
  #gkh-load-sub{
    font-size: 11px;
    color: #a86a6a;
    letter-spacing: 4px;
    text-transform: uppercase;
    font-weight: 800;
    margin-bottom: 22px;
  }
  #gkh-load-bar{
    width: 220px;
    height: 14px;
    background: #000;
    border: 3px solid #000;
    box-shadow: inset 3px 3px 0 rgba(0,0,0,.8);
    margin: 0 auto;
    overflow: hidden;
  }
  #gkh-load-fill{
    height: 100%;
    width: 0%;
    background: repeating-linear-gradient(
      45deg,
      #ff2b2b,
      #ff2b2b 8px,
      #ffcc00 8px,
      #ffcc00 16px
    );
    border-right: 2px solid #000;
  }
  #gkh-load-pct{
    margin-top: 12px;
    font-size: 11px;
    color: #ffcc00;
    font-weight: 900;
    letter-spacing: 2px;
    font-family: monospace;
  }

  /* Pill */
  #gkh-pill{
    position: fixed;
    right: 16px; bottom: 16px;
    width: 52px; height: 52px;
    background: #ff2b2b;
    border: 3px solid #000;
    box-shadow: 4px 4px 0 #000;
    display: none;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
    z-index: 2147483646;
  }
  #gkh-pill svg{ width: 22px; height: 22px; filter: drop-shadow(1px 1px 0 #000); }
  #gkh-pill.on{ display: flex; }
  #gkh-pill:active{ box-shadow: 0 0 0 #000; transform: translate(4px, 4px); }
  `;

  const st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  // ─── LOADING SPLASH ───
  const load = document.createElement('div');
  load.id = 'gkh-load';
  load.innerHTML = `
    <div id="gkh-load-in">
      <div id="gkh-load-logo">KAHOOT</div>
      <div id="gkh-load-sub">SOLVER · BRUTAL EDITION</div>
      <div id="gkh-load-bar"><div id="gkh-load-fill"></div></div>
      <div id="gkh-load-pct">0%</div>
    </div>`;
  document.body.appendChild(load);

  let pct = 0;
  const fillEl = document.getElementById('gkh-load-fill');
  const pctEl = document.getElementById('gkh-load-pct');
  const tick = setInterval(() => {
    pct += 8 + Math.random() * 12;
    if (pct > 100) pct = 100;
    fillEl.style.width = pct + '%';
    pctEl.textContent = Math.floor(pct) + '%';
    if (pct >= 100) {
      clearInterval(tick);
      setTimeout(() => { load.remove(); boot(); }, 220);
    }
  }, 60);

  // ─── PILL ───
  const pill = document.createElement('div');
  pill.id = 'gkh-pill';
  pill.innerHTML = I.bolt;
  pill.onclick = () => { S.stealth = false; root.style.display = 'flex'; pill.classList.remove('on'); };
  document.body.appendChild(pill);

  // ─── ROOT ───
  const root = document.createElement('div');
  root.id = 'gkh-root';
  root.style.display = 'none';
  root.innerHTML = `
  <div class="br-h" id="BRH">
    <div class="br-h-l">
      <div class="br-h-logo">${I.bolt}</div>
      <span class="br-h-title">Kahoot</span>
      <span class="br-h-dot" id="DOT"></span>
    </div>
    <div class="br-h-r">
      <button class="br-h-b" id="MN" title="Min">${I.min}</button>
      <button class="br-h-b" id="ST" title="Stealth">${I.ghost}</button>
      <button class="br-h-b" id="CL" title="Close">${I.x}</button>
    </div>
  </div>
  <div class="br-body">
    <div class="br-rail" id="RAIL">
      <button class="br-tab on" data-t="solve">${I.play}<span>Solve</span></button>
      <button class="br-tab" data-t="chat">${I.chat}<span>Chat</span></button>
      <button class="br-tab" data-t="explain">${I.book}<span>Info</span></button>
      <button class="br-tab" data-t="settings">${I.cog}<span>Conf</span></button>
      <button class="br-tab" data-t="log">${I.code}<span>Log</span></button>
      <button class="br-tab" data-t="credit">${I.heart}<span>Cred</span></button>
    </div>
    <div class="br-content" id="CT">

      <div class="br-p on" data-p="solve">
        <div class="br-tip" id="TIP">${I.spark}<span>Groq · gpt-oss-120b</span></div>
        <div class="br-pers" id="PN">—</div>
        <button class="br-btn red mb8" id="GO">${I.play}<span>Jawab Sekarang</span></button>
        <div class="br-bar" id="BAR"><div class="br-bar-f" id="BARF"></div></div>
        <div class="br-g3 mt8">
          <button class="br-btn wht sm" id="SC">${I.scan}<span>Scan</span></button>
          <button class="br-btn yel sm" id="LP">${I.loop}<span>Auto</span></button>
          <button class="br-btn dar sm" id="RS">${I.trash}<span>Rst</span></button>
        </div>
        <div class="br-sc" id="SCD">
          <div class="br-sc-t">${I.spark}<span>Hasil</span></div>
          <div class="br-sc-v" id="SCV">-</div>
          <div class="br-sc-d" id="SCDD"></div>
        </div>
      </div>

      <div class="br-p" data-p="chat">
        <div class="br-cw">
          <div class="br-cw-h">
            <span style="display:flex;gap:6px;align-items:center">${I.chat}<span id="CM">—</span></span>
            <button style="background:none;border:none;color:#fff;cursor:pointer;padding:2px" id="CC">${I.trash}</button>
          </div>
          <div class="br-cw-m" id="MS">
            <div class="br-m a">Halo! Ketik perintah auto-solve: "kerjain nomor 1-5"</div>
          </div>
          <div class="br-chips">
            <span class="br-ch" data-p="kerjain nomor 1-dst">Semua</span>
            <span class="br-ch" data-p="kerjain nomor 1-5">1-5</span>
            <span class="br-ch" data-p="Jelaskan soal ini">Jelas</span>
            <span class="br-ch" data-p="Ringkas">Ringkas</span>
          </div>
          <div class="br-cw-i">
            <textarea id="CI" placeholder="Ketik..." rows="1"></textarea>
            <button class="br-cw-s" id="CS">${I.send}</button>
          </div>
        </div>
      </div>

      <div class="br-p" data-p="explain">
        <div class="br-exl" id="EX"><div style="color:#a86a6a;font-size:11px;text-align:center;padding:22px;font-weight:700">BELUM ADA DATA</div></div>
      </div>

      <div class="br-p" data-p="settings">
        <div class="mb8"><div class="br-lbl">${I.spark}<span>Provider</span></div><select class="br-sel" id="PR"><option value="groq">Groq</option><option value="cloudflare">Cloudflare</option><option value="openrouter">OpenRouter</option><option value="openai">OpenAI</option></select></div>
        <div class="mb8"><div class="br-lbl">${I.code}<span>Model</span></div><select class="br-sel" id="MD"></select></div>
        <div class="mb8"><div class="br-lbl">${I.bolt}<span>API Key</span><span id="KH">auto</span></div><div class="br-iw"><input class="br-inp" id="KY" type="password"><button class="br-iey" id="EY">${I.eye}</button></div></div>
        <div class="mb8">
          <div class="br-sw"><div><div class="br-sw-t">Auto Scroll</div><div class="br-sw-d">Scroll ke tile</div></div><label class="br-tg"><input type="checkbox" id="OS" checked><span class="br-ts"></span></label></div>
          <div class="br-sw"><div><div class="br-sw-t">Auto Explain</div><div class="br-sw-d">WAJIB ON</div></div><label class="br-tg"><input type="checkbox" id="OE" checked><span class="br-ts"></span></label></div>
          <div class="br-sw"><div><div class="br-sw-t">Show Persona</div><div class="br-sw-d">Preview</div></div><label class="br-tg"><input type="checkbox" id="OP" checked><span class="br-ts"></span></label></div>
        </div>
        <div class="br-g2"><button class="br-btn yel sm" id="SV">Save</button><button class="br-btn wht sm" id="LD">Load</button></div>
      </div>

      <div class="br-p" data-p="log">
        <div class="br-g2 mb8"><button class="br-btn wht sm" id="EXB">Export</button><button class="br-btn dar sm" id="CLB">Clear</button></div>
        <div class="br-log" id="LG"><div>Ready.</div></div>
      </div>

      <div class="br-p" data-p="credit">
        <div class="br-cr">
          <div class="br-cr-a">${I.user}</div>
          <div class="br-cr-n">Alip / Alrect</div>
          <div class="br-cr-r">Developer</div>
          <a class="br-cr-w" href="https://wa.me/6282192401340" target="_blank">${I.wa}<div class="br-cr-w-t"><span class="br-cr-w-l">Order Now</span><span class="br-cr-w-n">+62 821-9240-1340</span></div></a>
          <div class="br-cr-f">GFS KAHOOT · BRUTAL v3 · 2026</div>
        </div>
      </div>

    </div>
  </div>
  <div class="br-ft"><span>⚡ Brutal v3</span><span class="br-bg" id="FST">idle</span></div>`;
  document.body.appendChild(root);

  function boot() {
    root.style.display = 'flex';
    initHandlers();
    log('GKH Brutal v3 loaded.', 'ok');
  }

  // ─── HELPERS ───
  const $ = id => document.getElementById(id);
  const qs = (s, r) => { try { return (r || document).querySelector(s); } catch { return null; } };
  const qsa = (s, r) => { try { return [...(r || document).querySelectorAll(s)]; } catch { return []; } };
  const firstOf = (arr, r) => { for (const s of arr) { const el = qs(s, r); if (el) return el; } return null; };
  const allOf = (arr, r) => { const o = new Set(); for (const s of arr) qsa(s, r).forEach(e => o.add(e)); return [...o]; };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const norm = s => String(s || '').toLowerCase().replace(/\s+/g, ' ').replace(/[.,;:!?'"()\-–—]/g, '').trim();

  const log = (m, c = 'in') => {
    const el = $('LG'); if (!el) return;
    const d = document.createElement('div');
    d.className = c; d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + m;
    el.appendChild(d); el.scrollTop = el.scrollHeight;
    while (el.children.length > 400) el.removeChild(el.firstChild);
  };
  const setSt = t => { const b = $('FST'); if (!b) return; b.textContent = t; b.className = 'br-bg'; if (t === 'running') b.classList.add('run'); else if (t === 'error') b.classList.add('er'); else if (t === 'done') b.classList.add('dn'); };

  // ─── KAHOOT PARSER ───
  const Q_SEL = ['[data-functional-selector="question-title"]','[data-functional-selector*="question"]','[class*="question-title"]','[class*="QuestionTitle"]','[class*="question__title"]','h1[class*="question"]','h2[class*="question"]','[class*="questionText"]','[class*="prompt"]','h1','h2'];
  const O_SEL = ['[data-functional-selector*="answer"]','[data-functional-selector*="choice"]','[class*="answer-tile"]','[class*="AnswerTile"]','[class*="answerButton"]','[class*="answer-button"]','[class*="answer__"]','[class*="choice"]','button[class*="answer"]','[role="button"][class*="answer"]'];
  const N_SEL = ['[data-functional-selector="next-button"]','[data-functional-selector*="next"]','[class*="next-button"]','[class*="nextButton"]','button[class*="next"]'];

  const ex = el => { if (!el) return ''; let t = (el.innerText || el.textContent || '').trim(); t = t.replace(/^[A-Z][.)\-:]\s*/, '').replace(/^\d+[.)\-:]\s*/, '').trim(); return t; };
  const hasAudio = c => { const s = ['audio','[class*="audio"]','[class*="speaker"]','[class*="volume"]','button[aria-label*="play" i]','svg[class*="speaker"]','svg[class*="volume"]']; for (const x of s) { try { if (c.querySelector(x)) return true; } catch {} } return false; };
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
    return { idx: 0, qText: qt, opts, hasAudio: hasAudio(document.body) };
  };
  const parseAll = () => { const c = parseKahoot(); return c.opts.length >= 2 ? [c] : []; };
  const findNext = () => { for (const s of N_SEL) { const b = qs(s); if (b && b.offsetParent !== null && !b.disabled) return b; } return null; };

  // ─── AI CALL ───
  const call = async (prov, key, model, prompt, persona, chatMode = false) => {
    const sys = chatMode ? persona + ' Asisten chat cerdas. Jawab ringkas.' : persona;
    let url, headers = { 'Content-Type': 'application/json' }, body;
    if (prov === 'groq') { url = 'https://api.groq.com/openai/v1/chat/completions'; headers.Authorization = 'Bearer ' + key; body = { model, messages: [{ role: 'system', content: sys }, { role: 'user', content: prompt }], temperature: 0.0, max_tokens: 3000 }; if (!chatMode) body.response_format = { type: 'json_object' }; }
    else if (prov === 'openrouter') { url = 'https://openrouter.ai/api/v1/chat/completions'; headers.Authorization = 'Bearer ' + key; body = { model, messages: [{ role: 'system', content: sys }, { role: 'user', content: prompt }], temperature: 0.0, max_tokens: 3000 }; if (!chatMode) body.response_format = { type: 'json_object' }; }
    else if (prov === 'openai') { url = 'https://api.openai.com/v1/chat/completions'; headers.Authorization = 'Bearer ' + key; body = { model, messages: [{ role: 'system', content: sys }, { role: 'user', content: prompt }], temperature: 0.0, max_tokens: 3000 }; if (!chatMode) body.response_format = { type: 'json_object' }; }
    else { url = 'https://api.cloudflare.com/client/v4/accounts/' + CF_ACC + '/ai/run/' + model; headers.Authorization = 'Bearer ' + key; body = { messages: [{ role: 'system', content: sys }, { role: 'user', content: prompt }] }; }
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
      const d = document.createElement('div'); d.className = 'br-ex';
      if (m.r === 'no-match') d.classList.add('err');
      else if (m.r && m.r.startsWith('contains-best')) d.classList.add('wrn');
      const at = a.tf !== undefined ? (a.tf ? 'BENAR' : 'SALAH') : a.answer;
      const cls = m.r === 'no-match' ? 'err' : '';
      d.innerHTML = '<div class="br-ex-t">' + I.spark + ' Q' + (a.idx + 1) + ' · ' + (m.r || '') + '</div><div class="br-ex-a ' + cls + '">' + (m.r === 'no-match' ? '✗ ' : '✓ ') + at + '</div><div class="br-ex-r">' + (a.reason || q.qText.slice(0, 140)) + '</div><div class="br-ex-c">CONF: ' + (a.confidence * 100).toFixed(0) + '%</div>';
      el.appendChild(d);
    });
  };

  // ─── INIT HANDLERS ───
  function initHandlers() {
    qsa('.br-tab').forEach(b => b.onclick = () => {
      qsa('.br-tab').forEach(x => x.classList.remove('on'));
      qsa('.br-p').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      qs('.br-p[data-p="' + b.dataset.t + '"]').classList.add('on');
      $('CT').scrollTop = 0;
    });

    $('ST').onclick = () => { S.stealth = true; root.style.display = 'none'; pill.classList.add('on'); };
    $('CL').onclick = () => { root.remove(); pill.remove(); if (S.loop) clearInterval(S.loop); window.__GKH_LOADED__ = false; };
    $('MN').onclick = () => { const b = root.querySelector('.br-body'), f = root.querySelector('.br-ft'); const h = b.style.display === 'none'; b.style.display = h ? 'flex' : 'none'; f.style.display = h ? 'flex' : 'none'; $('MN').innerHTML = h ? I.min : I.max; };
    $('EY').onclick = () => { const i = $('KY'); i.type = i.type === 'password' ? 'text' : 'password'; };

    const updateModels = () => {
      const p = $('PR').value; const s = $('MD'); s.innerHTML = '';
      (MODELS[p] || []).forEach(m => { const o = document.createElement('option'); o.value = m; o.textContent = m; s.appendChild(o); });
      if (KEYS[p]) { $('KY').value = KEYS[p]; $('KH').textContent = 'auto'; } else { $('KY').value = ''; $('KH').textContent = 'manual'; }
      $('TIP').innerHTML = I.spark + '<span>' + p + ' · ' + s.value + ' · b' + (BATCH[p] || 2) + '</span>';
      if ($('OP').checked) $('PN').textContent = PERSONA[p] || '—';
      $('CM').textContent = p.toUpperCase() + ' · ' + s.value;
    };
    $('PR').onchange = updateModels;
    $('MD').onchange = () => { $('CM').textContent = $('PR').value.toUpperCase() + ' · ' + $('MD').value; };
    $('OP').onchange = () => { $('PN').style.display = $('OP').checked ? 'block' : 'none'; if ($('OP').checked) $('PN').textContent = PERSONA[$('PR').value] || '—'; };
    $('SV').onclick = () => { localStorage.setItem('gkh3_cfg', JSON.stringify({ p: $('PR').value, m: $('MD').value, k: $('KY').value, s: $('OS').checked, e: $('OE').checked, o: $('OP').checked })); log('Saved.', 'ok'); };
    $('LD').onclick = () => { try { const c = JSON.parse(localStorage.getItem('gkh3_cfg') || '{}'); if (c.p) { $('PR').value = c.p; updateModels(); } if (c.m) $('MD').value = c.m; if (c.k && !KEYS[$('PR').value]) $('KY').value = c.k; if (c.s !== undefined) $('OS').checked = c.s; if (c.e !== undefined) $('OE').checked = c.e; if (c.o !== undefined) $('OP').checked = c.o; log('Loaded.', 'ok'); } catch { log('Load gagal', 'er'); } };
    $('EXB').onclick = () => { const t = [...$('LG').children].map(c => c.textContent).join('\n'); const b = new Blob([t], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'gkh-log.txt'; a.click(); };
    $('CLB').onclick = () => { $('LG').innerHTML = ''; };

    // DRAG
    const H = $('BRH'); let dr = false, dx = 0, dy = 0;
    const sDr = (x, y) => { const r = root.getBoundingClientRect(); dr = true; dx = x - r.left; dy = y - r.top; root.style.transform = 'none'; root.style.left = r.left + 'px'; root.style.top = r.top + 'px'; };
    const mDr = (x, y) => { if (!dr) return; const r = root.getBoundingClientRect(); root.style.left = Math.max(0, Math.min(innerWidth - r.width, x - dx)) + 'px'; root.style.top = Math.max(0, Math.min(innerHeight - 40, y - dy)) + 'px'; };
    H.onmousedown = e => { if (e.target.closest('button')) return; sDr(e.clientX, e.clientY); };
    H.ontouchstart = e => { if (e.target.closest('button')) return; sDr(e.touches[0].clientX, e.touches[0].clientY); };
    document.addEventListener('mousemove', e => mDr(e.clientX, e.clientY));
    document.addEventListener('touchmove', e => { if (dr) mDr(e.touches[0].clientX, e.touches[0].clientY); });
    document.addEventListener('mouseup', () => dr = false);
    document.addEventListener('touchend', () => dr = false);

    // SCAN
    $('SC').onclick = () => {
      const all = parseAll();
      log('Scan: ' + all.length + ' soal', 'ok');
      all.forEach(q => {
        const tf = isTF(q);
        const tag = q.hasAudio ? '[AUDIO]' : (tf ? '[TF]' : '[MCQ/' + q.opts.length + ']');
        log(tag + ' ' + (q.qText || '(no text)').slice(0, 70), q.hasAudio ? 'wn' : 'in');
        q.opts.forEach((o, j) => log('  ' + (j + 1) + '. ' + o.text.slice(0, 60), 'in'));
      });
      if (!all.length) log('Nggak ketemu soal.', 'er');
    };
    $('RS').onclick = () => log('Nggak bisa reset.', 'wn');
    $('LP').onclick = () => {
      if (S.loop) { clearInterval(S.loop); S.loop = null; $('LP').innerHTML = I.loop + '<span>Auto</span>'; log('Auto OFF', 'wn'); return; }
      log('Auto ON 3s', 'ok'); $('LP').innerHTML = I.loop + '<span>Stop</span>';
      S.loop = setInterval(() => { if (!S.running) $('GO').click(); }, 3000);
    };

    // SOLVE
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

      S.running = true; setSt('running'); $('DOT').classList.add('run');
      const btn = $('GO'); btn.disabled = true; btn.innerHTML = I.play + '<span>...</span>';
      $('BAR').classList.add('on');

      const wantEx = $('OE').checked, persona = PERSONA[prov] || '', bs = BATCH[prov] || 2;
      const ans = [], matches = {};
      let done = 0; const total = tfq.length + mcq.length;

      try {
        for (const q of tfq) {
          const p = 'Evaluasi pernyataan. Nilai kebenaran berbasis FAKTA ILMIAH/HISTORIS.\n\nPernyataan [ID ' + q.idx + ']: "' + q.qText + '"\n\nBalas JSON: {"i":' + q.idx + ',"t":<true|false>,"reason":"<1-2 kalimat>"}';
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
          log('MCQ ' + batches + ' batch', 'ai');
          for (let b = 0; b < batches; b++) {
            const bt = mcq.slice(b * bs, b * bs + bs);
            const p = 'Jawab MCQ. Pilih opsi PALING DIDUKUNG FAKTA.\nJSON: {"answers":[{"i":<idx>,"a":"<teks>"' + (wantEx ? ',"reason":"<1 kalimat>"' : '') + '}]}\n\n' + bt.map(q => '[' + q.idx + '] ' + q.qText + '\n' + q.opts.map(o => '- ' + o.text).join('\n')).join('\n\n');
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
            if ($('OS').checked) m.el.scrollIntoView({ behavior: 'auto', block: 'center' });
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
        btn.disabled = false; btn.innerHTML = I.play + '<span>Jawab Sekarang</span>';
        S.running = false; $('DOT').classList.remove('run');
        setTimeout(() => $('BAR').classList.remove('on'), 1000);
      }
    };

    // CHAT
    const MS = $('MS'), CI = $('CI'), CS = $('CS');
    const addMsg = (t, c) => { const d = document.createElement('div'); d.className = 'br-m ' + c; d.textContent = t; MS.appendChild(d); MS.scrollTop = MS.scrollHeight; return d; };
    const addTyp = () => { const d = document.createElement('div'); d.className = 'br-m a'; d.innerHTML = '<div class="br-dt"><span></span><span></span><span></span></div>'; MS.appendChild(d); MS.scrollTop = MS.scrollHeight; return d; };
    CI.addEventListener('input', () => { CI.style.height = 'auto'; CI.style.height = Math.min(CI.scrollHeight, 80) + 'px'; });
    CI.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doChat(); } });
    CS.onclick = doChat;

    async function doChat() {
      const t = CI.value.trim(); if (!t || S.running) return;
      const key = $('KY').value.trim(), prov = $('PR').value, model = $('MD').value;
      if (!key) { addMsg('API key kosong.', 'e'); return; }
      addMsg(t, 'u'); CI.value = ''; CI.style.height = 'auto';
      S.chat.push({ role: 'user', content: t });
      S.running = true; setSt('running'); $('DOT').classList.add('run'); CS.disabled = true;
      const tp = addTyp();
      try {
        const p = S.chat.slice(-20).map(m => (m.role === 'user' ? 'User: ' : 'AI: ') + m.content).join('\n\n');
        const r = await call(prov, key, model, p, PERSONA[prov] || '', true);
        tp.remove(); addMsg(r, 'a');
        S.chat.push({ role: 'assistant', content: r });
        setSt('done');
      } catch (e) { tp.remove(); addMsg('ERR: ' + e.message, 'e'); setSt('error'); }
      finally { S.running = false; CS.disabled = false; $('DOT').classList.remove('run'); }
    }

    qsa('.br-ch').forEach(c => c.onclick = () => { CI.value = c.dataset.p; CI.focus(); });
    $('CC').onclick = () => { S.chat = []; MS.innerHTML = ''; addMsg('Chat cleared.', 'a'); };

    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        if (S.stealth) { root.style.display = 'flex'; pill.classList.remove('on'); S.stealth = false; }
        else { S.stealth = true; root.style.display = 'none'; pill.classList.add('on'); }
      }
    });

    $('PR').value = 'groq';
    updateModels();
  }
})();
