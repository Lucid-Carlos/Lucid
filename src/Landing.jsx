import { useEffect, useState } from "react";
import { NICHO_ORDER, lensCard } from "./lenses.js";

const T = {
  es: {
    navHow: "Cómo funciona",
    navStart: "Empezar →",
    heroBadge: "🦕 Beta pública",
    heroH1: <>Prompts <span className="l-accent">completos</span><br/>y precisos, siempre.</>,
    heroSub: "Describe lo que necesitas, aunque esté incompleto. Blue Dinosaur te hace las preguntas correctas y genera el prompt perfecto para cualquier IA.",
    heroStart: "Empezar →",
    heroSee: "Ver cómo funciona",
    compatWith: "Compatible con",
    compatMore: "y más",
    nicheTag: "Especializaciones",
    nicheTitle: "¿Para qué lo necesitas?",
    nicheSub: "Elige un tema y Blue Dinosaur se adapta a él, con preguntas y reglas hechas para eso.",
    nicheSoon: "(pronto)",
    howTag: "Cómo funciona",
    howTitle: <>De idea vaga a prompt preciso<br/>en 60 segundos</>,
    howSub: "Sin tecnicismos. Sin saber prompt engineering. Solo dile lo que quieres.",
    mockEyebrow: "Prompts. Completos, Precisos.",
    mockTitle: "Empieza con tu idea",
    mockStep1Label: "Tu idea",
    mockStep1Text: "\"quiero saber algo sobre invertir en México...\"",
    mockStep2Label: "Blue Dinosaur pregunta",
    mockStep2Text: "¿Qué nivel de experiencia tienes con inversiones?",
    mockOpt1: "Principiante",
    mockOpt2: "Experiencia básica",
    mockOpt3: "Avanzado",
    mockResult: "🦕 Actúa como asesor financiero. Tengo experiencia básica en inversiones y quiero entender las mejores opciones disponibles en México en 2025: CETES, ETFs y fondos de inversión. Explica ventajas, riesgos y cómo empezar con menos de $10,000 MXN.",
    valueTag: "Por qué Blue Dinosaur",
    valueTitle: <>El problema no es la IA.<br/>Es la pregunta.</>,
    valueSub: "Las herramientas de IA son poderosas. Pero solo dan lo que les pides, y muchas veces no sabemos exactamente qué pedir.",
    v1Title: "Claridad desde el inicio",
    v1Desc: "Blue Dinosaur descubre lo que realmente necesitas, aunque tú mismo no lo tengas del todo claro todavía.",
    v2Title: "Menos intentos, mejor resultado",
    v2Desc: "Un prompt preciso desde el principio te ahorra varios mensajes de correcciones. Llegas al resultado más rápido.",
    v3Title: "Funciona con cualquier IA",
    v3Desc: "El prompt que genera Blue Dinosaur lo usas en Claude, ChatGPT, Gemini, Midjourney o cualquier herramienta.",
    baTag: "La diferencia",
    baTitle: "Antes y después",
    baBeforeLabel: "Sin Blue Dinosaur",
    baBeforeText: "\"explícame el cambio climático\"",
    baAfterLabel: "Con Blue Dinosaur",
    baAfterText: "Actúa como científico divulgador. Explícame las causas y consecuencias del cambio climático a nivel de México, en términos accesibles para alguien sin formación científica. Incluye datos recientes y 3 acciones concretas que puedo tomar hoy.",
    stat1Label: "para tu prompt listo",
    stat2Label: "preguntas máximo",
    stat3Label: "herramientas compatibles",
    stat4Label: "sin registro",
    proBadge: "🦕 Próximamente",
    proTitle: "Plan Pro está en camino.",
    proSub: "Prompts ilimitados, historial completo y más. Sé el primero en saber cuando esté disponible.",
    proPlaceholder: "tu@email.com",
    proBtn: "Avisarme →",
    proMsg: "✓ Listo, te avisamos cuando esté disponible.",
    waitlistError: "Error al enviar. Intenta de nuevo.",
    ctaTitle: <>La IA ya es poderosa.<br/>Aprende a usarla mejor.</>,
    ctaSub: "Describe lo que necesitas y Blue Dinosaur genera el prompt que realmente funciona.",
    ctaStart: "Empezar →",
    ctaNote: "Sin registro · Sin tarjeta · Listo en segundos",
    footerCopy: "© 2026 Blue Dinosaur · Beta",
  },
  en: {
    navHow: "How it works",
    navStart: "Start →",
    heroBadge: "🦕 Public beta",
    heroH1: <><span style={{ whiteSpace: "nowrap" }}>Complete, precise <span className="l-accent">prompts</span></span><br/>every time.</>,
    heroSub: "Describe what you need, even if it's incomplete. Blue Dinosaur asks the right questions and generates the perfect prompt for any AI.",
    heroStart: "Start →",
    heroSee: "See how it works",
    compatWith: "Works with",
    compatMore: "and more",
    nicheTag: "Specializations",
    nicheTitle: "What do you need it for?",
    nicheSub: "Pick a topic and Blue Dinosaur adapts to it, with questions and rules built for it.",
    nicheSoon: "(soon)",
    howTag: "How it works",
    howTitle: <>From vague idea to precise prompt<br/>in 60 seconds</>,
    howSub: "No jargon. No prompt engineering needed. Just tell it what you want.",
    mockEyebrow: "Prompts. Rich, Precise.",
    mockTitle: "Start with your idea",
    mockStep1Label: "Your idea",
    mockStep1Text: "\"i want to know something about investing in Mexico...\"",
    mockStep2Label: "Blue Dinosaur asks",
    mockStep2Text: "What's your experience level with investing?",
    mockOpt1: "Beginner",
    mockOpt2: "Some experience",
    mockOpt3: "Advanced",
    mockResult: "🦕 Act as a financial advisor. I have some experience with investing and want to understand the best options available in Mexico in 2025: CETES, ETFs and mutual funds. Explain the advantages, risks and how to start with less than $10,000 MXN.",
    valueTag: "Why Blue Dinosaur",
    valueTitle: <>The problem isn't the AI.<br/>It's the question.</>,
    valueSub: "AI tools are powerful. But they only give you what you ask for, and often we don't know exactly what to ask.",
    v1Title: "Clarity from the start",
    v1Desc: "Blue Dinosaur uncovers what you really need, even when you're not fully sure yourself yet.",
    v2Title: "Fewer tries, better results",
    v2Desc: "A precise prompt from the start saves you rounds of corrections. You get to the result faster.",
    v3Title: "Works with any AI",
    v3Desc: "Use the prompt Blue Dinosaur generates in Claude, ChatGPT, Gemini, Midjourney or any tool.",
    baTag: "The difference",
    baTitle: "Before and after",
    baBeforeLabel: "Without Blue Dinosaur",
    baBeforeText: "\"explain climate change to me\"",
    baAfterLabel: "With Blue Dinosaur",
    baAfterText: "Act as a science communicator. Explain the causes and consequences of climate change for Mexico, in terms accessible to someone with no scientific background. Include recent data and 3 concrete actions I can take today.",
    stat1Label: "for your prompt",
    stat2Label: "questions max",
    stat3Label: "compatible tools",
    stat4Label: "no signup",
    proBadge: "🦕 Coming soon",
    proTitle: "Pro plan is on the way.",
    proSub: "Unlimited prompts, full history and more. Be the first to know when it's available.",
    proPlaceholder: "you@email.com",
    proBtn: "Notify me →",
    proMsg: "✓ Done, we'll let you know when it's ready.",
    waitlistError: "Something went wrong. Please try again.",
    ctaTitle: <>AI is already powerful.<br/>Learn to use it better.</>,
    ctaSub: "Describe what you need and Blue Dinosaur generates the prompt that actually works.",
    ctaStart: "Start →",
    ctaNote: "No signup · No card · Ready in seconds",
    footerCopy: "© 2026 Blue Dinosaur · Beta",
  },
};

export default function Landing() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("bd_lang") || "en"; } catch { return "en"; }
  });
  const t = T[lang];

  function toggleLang() {
    setLang(prev => {
      const next = prev === "es" ? "en" : "es";
      try { localStorage.setItem("bd_lang", next); } catch {}
      return next;
    });
  }

  useEffect(() => {
    // Inject styles
    const style = document.createElement("style");
    style.id = "landing-styles";
    style.textContent = `
      .landing * { box-sizing: border-box; }
      .landing { font-family: 'DM Sans', sans-serif; background: #F5F3EF; color: #1A1A1A; line-height: 1.6; }
      .l-nav { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 14px 40px; background: rgba(245,243,239,0.94); backdrop-filter: blur(12px); border-bottom: 1px solid #C9D8E8; }
      .l-nav-logo { display: flex; align-items: center; gap: 10px; font-size: 16px; font-weight: 600; letter-spacing: -0.3px; color: #1A1A1A; text-decoration: none; cursor: pointer; }
      .l-nav-logo img { width: 28px; height: 28px; object-fit: contain; }
      .l-nav-logo-dino { width: 28px; height: 28px; background: #7EB8D4; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
      .l-nav-cta { display: flex; align-items: center; gap: 10px; }
      .l-btn-ghost-nav { font-family: 'DM Sans', sans-serif; font-size: 13px; color: #6B7E96; background: none; border: none; cursor: pointer; padding: 6px 12px; border-radius: 8px; text-decoration: none; transition: color 0.2s, background 0.2s; }
      .l-btn-ghost-nav:hover { color: #1A1A1A; background: #EDF2F7; }
      .l-btn-primary-nav { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: #fff; background: #1B4F72; border: none; cursor: pointer; padding: 8px 18px; border-radius: 8px; text-decoration: none; transition: opacity 0.2s; }
      .l-btn-primary-nav:hover { opacity: 0.85; }
      .l-btn-lang { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; color: #6B7E96; background: transparent; border: 1px solid #C9D8E8; cursor: pointer; padding: 6px 10px; border-radius: 8px; letter-spacing: 0.05em; transition: color 0.2s, border-color 0.2s; }
      .l-btn-lang:hover { color: #1A1A1A; border-color: #1B4F72; }
      .l-hero { min-height: 82vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px 24px 40px; position: relative; overflow: hidden; }
      .l-dino-tracks { position: absolute; font-size: 18px; opacity: 0.06; pointer-events: none; user-select: none; letter-spacing: 8px; }
      .l-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 500; color: #1B4F72; background: #D6EAF8; border: 1px solid rgba(27,79,114,0.2); padding: 5px 14px; border-radius: 20px; margin-bottom: 32px; letter-spacing: 0.05em; text-transform: uppercase; font-family: 'DM Mono', monospace; }
      .l-dino-hero { width: 140px; height: 140px; object-fit: contain; margin-bottom: 28px; animation: l-float 4s ease-in-out infinite; filter: drop-shadow(0 8px 24px rgba(126,184,212,0.3)); }
      @keyframes l-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      .l-h1 { font-size: clamp(36px, 6vw, 68px); font-weight: 700; line-height: 1.1; letter-spacing: -2px; max-width: 1100px; margin-bottom: 20px; }
      .l-accent { color: #1B4F72; }
      .l-hero-sub { font-size: 17px; color: #5A6E84; max-width: 440px; margin-bottom: 28px; line-height: 1.65; font-weight: 300; }
      .l-hero-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; justify-content: center; margin-bottom: 32px; }
      .l-btn-primary { font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; color: #fff; background: #1B4F72; border: none; cursor: pointer; padding: 14px 28px; border-radius: 10px; text-decoration: none; display: inline-block; box-shadow: 0 4px 16px rgba(27,79,114,0.25); transition: opacity 0.2s, transform 0.15s; }
      .l-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
      .l-btn-ghost { font-family: 'DM Sans', sans-serif; font-size: 15px; color: #6B7E96; background: transparent; border: 1.5px solid #C9D8E8; cursor: pointer; padding: 13px 24px; border-radius: 10px; text-decoration: none; display: inline-block; transition: border-color 0.2s, color 0.2s; }
      .l-btn-ghost:hover { border-color: #1B4F72; color: #1B4F72; }
      .l-compatible { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #6B7E96; font-family: 'DM Mono', monospace; flex-wrap: wrap; justify-content: center; }
      .l-dot { width: 3px; height: 3px; background: #C9D8E8; border-radius: 50%; }
      .l-mockup-section { background: #EDF2F7; border-top: 1px solid #C9D8E8; border-bottom: 1px solid #C9D8E8; padding: 80px 24px; }
      .l-section-inner { max-width: 880px; margin: 0 auto; }
      .l-section-tag { font-size: 11px; font-weight: 500; color: #1B4F72; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'DM Mono', monospace; margin-bottom: 14px; display: block; }
      .l-section-title { font-size: clamp(26px, 3.5vw, 38px); font-weight: 700; letter-spacing: -1.5px; line-height: 1.15; margin-bottom: 14px; }
      .l-section-sub { font-size: 16px; color: #5A6E84; max-width: 440px; line-height: 1.65; font-weight: 300; }
      .l-mockup { width: 100%; max-width: 580px; background: #fff; border: 1px solid #C9D8E8; border-radius: 14px; overflow: hidden; box-shadow: 0 16px 48px rgba(27,79,114,0.08); margin: 48px auto 0; }
      .l-mockup-bar { display: flex; align-items: center; gap: 6px; padding: 10px 14px; border-bottom: 1px solid #C9D8E8; background: #EDF2F7; }
      .l-mdot { width: 10px; height: 10px; border-radius: 50%; }
      .l-mockup-body { padding: 24px; }
      .l-mockup-eyebrow { font-size: 10px; color: #6B7E96; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'DM Mono', monospace; margin-bottom: 8px; }
      .l-mockup-title { font-size: 20px; font-weight: 600; letter-spacing: -0.5px; margin-bottom: 18px; }
      .l-mockup-step { display: flex; gap: 12px; margin-bottom: 10px; padding: 12px 14px; background: #F5F3EF; border: 1px solid #C9D8E8; border-radius: 8px; }
      .l-step-num { font-size: 11px; color: #6B7E96; font-family: 'DM Mono', monospace; min-width: 20px; margin-top: 1px; }
      .l-step-label { font-size: 10px; color: #6B7E96; font-family: 'DM Mono', monospace; text-transform: uppercase; margin-bottom: 4px; }
      .l-step-text { font-size: 13px; color: #5A6E84; line-height: 1.5; }
      .l-step-opts { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
      .l-opt { font-size: 11px; padding: 4px 10px; border: 1px solid #C9D8E8; border-radius: 6px; color: #5A6E84; font-family: 'DM Mono', monospace; }
      .l-opt-sel { background: #1B4F72; color: #fff; border-color: #1B4F72; }
      .l-mockup-result { font-size: 12px; color: #1B4F72; line-height: 1.6; font-family: 'DM Mono', monospace; padding: 12px 14px; background: #D6EAF8; border: 1px solid rgba(27,79,114,0.2); border-radius: 8px; margin-top: 12px; }
      .l-section { padding: 80px 24px; }
      .l-value-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #C9D8E8; border: 1px solid #C9D8E8; border-radius: 14px; overflow: hidden; margin-top: 48px; }
      .l-value-card { background: #F5F3EF; padding: 28px 24px; transition: background 0.2s; }
      .l-value-card:hover { background: #EDF2F7; }
      .l-value-icon { font-size: 22px; margin-bottom: 14px; }
      .l-value-title { font-size: 15px; font-weight: 600; margin-bottom: 8px; }
      .l-value-desc { font-size: 13.5px; color: #5A6E84; line-height: 1.6; }
      .l-ba-grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: center; margin-top: 48px; }
      .l-ba-box { background: #F5F3EF; border: 1px solid #C9D8E8; border-radius: 12px; padding: 20px; }
      .l-ba-label { font-size: 10px; color: #6B7E96; font-family: 'DM Mono', monospace; text-transform: uppercase; margin-bottom: 10px; }
      .l-ba-text { font-size: 13px; color: #5A6E84; line-height: 1.6; font-family: 'DM Mono', monospace; }
      .l-ba-after { border-color: rgba(27,79,114,0.3); background: #D6EAF8; }
      .l-ba-after .l-ba-text { color: #1B4F72; }
      .l-ba-arrow { font-size: 18px; color: #6B7E96; }
      .l-stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #C9D8E8; border: 1px solid #C9D8E8; border-radius: 12px; overflow: hidden; margin-top: 48px; }
      .l-stat { background: #F5F3EF; padding: 28px 20px; text-align: center; }
      .l-stat-num { font-size: 30px; font-weight: 700; letter-spacing: -1.5px; color: #1B4F72; }
      .l-stat-label { font-size: 12px; color: #6B7E96; margin-top: 4px; font-family: 'DM Mono', monospace; }
      .l-pro-section { border-top: 1px solid #C9D8E8; text-align: center; padding: 80px 24px; }
      .l-pro-badge { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 500; color: #1B4F72; background: #D6EAF8; border: 1px solid rgba(27,79,114,0.2); padding: 5px 14px; border-radius: 20px; margin-bottom: 24px; letter-spacing: 0.05em; text-transform: uppercase; font-family: 'DM Mono', monospace; }
      .l-pro-title { font-size: clamp(24px, 3vw, 36px); font-weight: 700; letter-spacing: -1.5px; max-width: 480px; margin: 0 auto 12px; line-height: 1.1; }
      .l-pro-sub { font-size: 16px; color: #5A6E84; max-width: 360px; margin: 0 auto 32px; font-weight: 300; line-height: 1.65; }
      .l-waitlist-form { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; max-width: 420px; margin: 0 auto; }
      .l-email-input { flex: 1; min-width: 200px; padding: 12px 16px; border: 1.5px solid #C9D8E8; border-radius: 10px; font-size: 14px; font-family: 'DM Mono', monospace; background: #fff; color: #1A1A1A; outline: none; transition: border-color 0.2s; }
      .l-email-input:focus { border-color: #1B4F72; }
      .l-submit-btn { padding: 12px 22px; background: #1B4F72; color: #fff; border: none; border-radius: 10px; font-size: 14px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: opacity 0.2s; white-space: nowrap; }
      .l-submit-btn:hover { opacity: 0.85; }
      .l-waitlist-msg { display: none; margin-top: 16px; font-size: 13px; color: #1B4F72; font-family: 'DM Mono', monospace; }
      .l-cta-section { text-align: center; background: #EDF2F7; padding: 80px 24px; }
      .l-cta-dino { width: 72px; height: 72px; object-fit: contain; margin-bottom: 24px; filter: drop-shadow(0 4px 12px rgba(126,184,212,0.3)); }
      .l-cta-title { font-size: clamp(26px, 4vw, 44px); font-weight: 700; letter-spacing: -1.5px; max-width: 520px; margin: 0 auto 16px; line-height: 1.1; }
      .l-cta-sub { font-size: 16px; color: #5A6E84; max-width: 360px; margin: 0 auto 36px; font-weight: 300; line-height: 1.65; }
      .l-cta-note { font-size: 12px; color: #6B7E96; margin-top: 16px; font-family: 'DM Mono', monospace; }
      .l-footer { border-top: 1px solid #C9D8E8; padding: 24px 40px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
      .l-footer-logo { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; color: #6B7E96; }
      .l-footer-dino { width: 18px; height: 18px; background: #7EB8D4; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; opacity: 0.7; }
      .l-footer-copy { font-size: 12px; color: #6B7E96; font-family: 'DM Mono', monospace; }
      .l-niche-section { padding: 72px 24px; border-top: 1px solid #C9D8E8; }
      .l-niche-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-top: 36px; }
      .l-niche-card { display: block; text-align: left; text-decoration: none; background: #EDF2F7; border: 1px solid transparent; border-radius: 14px; padding: 18px; transition: transform 0.15s, box-shadow 0.15s; }
      .l-niche-card:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(27,79,114,0.14); }
      .l-niche-emoji { font-size: 24px; }
      .l-niche-name { font-size: 15px; font-weight: 600; color: #1B4F72; margin-top: 8px; }
      .l-niche-desc { font-size: 12.5px; color: #5A6E84; line-height: 1.4; margin-top: 4px; }
      .l-niche-soon { background: #F1F1EE; border: 1px solid #D8DEE6; opacity: 0.65; cursor: default; }
      .l-niche-tag { font-size: 10px; font-weight: 500; color: #8A97A4; }
      @media (max-width: 768px) {
        .l-nav { padding: 14px 20px; }
        .l-hero { padding: 60px 20px 40px; }
        .l-value-grid { grid-template-columns: 1fr; }
        .l-stats-row { grid-template-columns: repeat(2, 1fr); }
        .l-ba-grid { grid-template-columns: 1fr; }
        .l-ba-arrow { text-align: center; }
        .l-footer { flex-direction: column; text-align: center; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.getElementById("landing-styles")?.remove(); };
  }, []);

  function handleWaitlist(e) {
    e.preventDefault();
    const email = document.getElementById("wl-email").value;

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ "form-name": "waitlist", email }).toString(),
    })
      .then(() => {
        document.getElementById("wl-msg").style.display = "block";
        document.getElementById("wl-email").value = "";
        document.getElementById("wl-email").disabled = true;
        document.querySelector(".l-submit-btn").disabled = true;
      })
      .catch(() => {
        document.getElementById("wl-msg").style.display = "block";
        document.getElementById("wl-msg").textContent = t.waitlistError;
      });
  }

  return (
    <div className="landing">
      {/* NAV */}
      <nav className="l-nav">
        <a href="/" className="l-nav-logo">
          <img src="/dino.png" alt="Blue Dinosaur" onError={e => { e.target.style.display='none'; }} />
          Blue Dinosaur
        </a>
        <div className="l-nav-cta">
          <span className="l-badge" style={{ marginBottom: 0 }}>{t.heroBadge}</span>
          <button className="l-btn-lang" onClick={toggleLang}>{lang === "es" ? "EN" : "ES"}</button>
          <a href="#como-funciona" className="l-btn-ghost-nav">{t.navHow}</a>
          <a href="/app" className="l-btn-primary-nav">{t.navStart}</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="l-hero">
        <div className="l-dino-tracks" style={{top:"15%",left:"5%"}}>🦶🦶</div>
        <div className="l-dino-tracks" style={{bottom:"20%",right:"6%"}}>🦶🦶</div>
        <h1 className="l-h1">{t.heroH1}</h1>
        <p className="l-hero-sub">{t.heroSub}</p>
        <div className="l-hero-actions">
          <a href="/app" className="l-btn-primary">{t.heroStart}</a>
          <a href="#como-funciona" className="l-btn-ghost">{t.heroSee}</a>
        </div>
        <div className="l-compatible">
          <span>{t.compatWith}</span><span className="l-dot"></span>
          <span>Claude</span><span className="l-dot"></span>
          <span>ChatGPT</span><span className="l-dot"></span>
          <span>Gemini</span><span className="l-dot"></span>
          <span>Midjourney</span><span className="l-dot"></span>
          <span>{t.compatMore}</span>
        </div>
      </section>

      {/* ESPECIALIZACIONES */}
      <section className="l-niche-section">
        <div className="l-section-inner" style={{textAlign:"center"}}>
          <span className="l-section-tag">{t.nicheTag}</span>
          <h2 className="l-section-title">{t.nicheTitle}</h2>
          <p className="l-section-sub" style={{margin:"0 auto"}}>{t.nicheSub}</p>
          <div className="l-niche-grid">
            {NICHO_ORDER.map((slug) => {
              const n = lensCard(slug, lang);
              if (n.soon) {
                return (
                  <div key={slug} className="l-niche-card l-niche-soon">
                    <div className="l-niche-emoji">{n.emoji}</div>
                    <div className="l-niche-name">{n.label} <span className="l-niche-tag">{t.nicheSoon}</span></div>
                    <div className="l-niche-desc">{n.tagline}</div>
                  </div>
                );
              }
              return (
                <a key={slug} href={`/app/${slug}`} className="l-niche-card">
                  <div className="l-niche-emoji">{n.emoji}</div>
                  <div className="l-niche-name">{n.label}</div>
                  <div className="l-niche-desc">{n.tagline}</div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* MOCKUP */}
      <section className="l-mockup-section" id="como-funciona">
        <div className="l-section-inner" style={{textAlign:"center"}}>
          <span className="l-section-tag">{t.howTag}</span>
          <h2 className="l-section-title">{t.howTitle}</h2>
          <p className="l-section-sub" style={{margin:"0 auto"}}>{t.howSub}</p>
        </div>
        <div className="l-mockup">
          <div className="l-mockup-bar">
            <div className="l-mdot" style={{background:"#FF5F57"}}></div>
            <div className="l-mdot" style={{background:"#FEBC2E"}}></div>
            <div className="l-mdot" style={{background:"#28C840"}}></div>
            <span style={{fontSize:11,color:"#6B7E96",fontFamily:"DM Mono, monospace",marginLeft:8}}>bluedinosaur.ai/app</span>
          </div>
          <div className="l-mockup-body">
            <div className="l-mockup-eyebrow">{t.mockEyebrow}</div>
            <div className="l-mockup-title">{t.mockTitle}</div>
            <div className="l-mockup-step">
              <div className="l-step-num">01</div>
              <div>
                <div className="l-step-label">{t.mockStep1Label}</div>
                <div className="l-step-text">{t.mockStep1Text}</div>
              </div>
            </div>
            <div className="l-mockup-step">
              <div className="l-step-num">02</div>
              <div>
                <div className="l-step-label">{t.mockStep2Label}</div>
                <div className="l-step-text">{t.mockStep2Text}</div>
                <div className="l-step-opts">
                  <span className="l-opt">{t.mockOpt1}</span>
                  <span className="l-opt l-opt-sel">{t.mockOpt2}</span>
                  <span className="l-opt">{t.mockOpt3}</span>
                </div>
              </div>
            </div>
            <div className="l-mockup-result">{t.mockResult}</div>
          </div>
        </div>
      </section>

      {/* VALUE */}
      <section className="l-section">
        <div className="l-section-inner">
          <span className="l-section-tag">{t.valueTag}</span>
          <h2 className="l-section-title">{t.valueTitle}</h2>
          <p className="l-section-sub">{t.valueSub}</p>
          <div className="l-value-grid">
            <div className="l-value-card"><div className="l-value-icon">🎯</div><div className="l-value-title">{t.v1Title}</div><div className="l-value-desc">{t.v1Desc}</div></div>
            <div className="l-value-card"><div className="l-value-icon">⚡</div><div className="l-value-title">{t.v2Title}</div><div className="l-value-desc">{t.v2Desc}</div></div>
            <div className="l-value-card"><div className="l-value-icon">🔌</div><div className="l-value-title">{t.v3Title}</div><div className="l-value-desc">{t.v3Desc}</div></div>
          </div>
        </div>
      </section>

      {/* BEFORE/AFTER */}
      <section style={{background:"#EDF2F7",borderTop:"1px solid #C9D8E8",borderBottom:"1px solid #C9D8E8",padding:"80px 24px"}}>
        <div className="l-section-inner">
          <span className="l-section-tag">{t.baTag}</span>
          <h2 className="l-section-title">{t.baTitle}</h2>
          <div className="l-ba-grid">
            <div className="l-ba-box"><div className="l-ba-label">{t.baBeforeLabel}</div><div className="l-ba-text">{t.baBeforeText}</div></div>
            <div className="l-ba-arrow">→</div>
            <div className="l-ba-box l-ba-after"><div className="l-ba-label">{t.baAfterLabel}</div><div className="l-ba-text">{t.baAfterText}</div></div>
          </div>
          <div className="l-stats-row">
            <div className="l-stat"><div className="l-stat-num">60s</div><div className="l-stat-label">{t.stat1Label}</div></div>
            <div className="l-stat"><div className="l-stat-num">3</div><div className="l-stat-label">{t.stat2Label}</div></div>
            <div className="l-stat"><div className="l-stat-num">6+</div><div className="l-stat-label">{t.stat3Label}</div></div>
            <div className="l-stat"><div className="l-stat-num">100%</div><div className="l-stat-label">{t.stat4Label}</div></div>
          </div>
        </div>
      </section>

      {/* PRO WAITLIST */}
      <section className="l-pro-section">
        <div className="l-section-inner">
          <div className="l-pro-badge">{t.proBadge}</div>
          <h2 className="l-pro-title">{t.proTitle}</h2>
          <p className="l-pro-sub">{t.proSub}</p>
          <form className="l-waitlist-form" onSubmit={handleWaitlist} data-netlify="true" name="waitlist">
            <input type="hidden" name="form-name" value="waitlist" />
            <input type="email" id="wl-email" className="l-email-input" placeholder={t.proPlaceholder} required />
            <button type="submit" className="l-submit-btn">{t.proBtn}</button>
          </form>
          <p id="wl-msg" className="l-waitlist-msg">{t.proMsg}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="l-cta-section">
        <div className="l-section-inner">
          <img src="/dino.png" alt="Blue Dinosaur" className="l-cta-dino" onError={e => e.target.style.display='none'} />
          <h2 className="l-cta-title">{t.ctaTitle}</h2>
          <p className="l-cta-sub">{t.ctaSub}</p>
          <a href="/app" className="l-btn-primary">{t.ctaStart}</a>
          <p className="l-cta-note">{t.ctaNote}</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="l-footer">
        <div className="l-footer-logo">
          <div className="l-footer-dino">🦕</div>
          Blue Dinosaur
        </div>
        <div className="l-footer-copy">{t.footerCopy}</div>
      </footer>
    </div>
  );
}
