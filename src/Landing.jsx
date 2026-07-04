import { useEffect } from "react";

export default function Landing() {
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
      .l-hero { min-height: 88vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 80px 24px 60px; position: relative; overflow: hidden; }
      .l-dino-tracks { position: absolute; font-size: 18px; opacity: 0.06; pointer-events: none; user-select: none; letter-spacing: 8px; }
      .l-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 500; color: #1B4F72; background: #D6EAF8; border: 1px solid rgba(27,79,114,0.2); padding: 5px 14px; border-radius: 20px; margin-bottom: 32px; letter-spacing: 0.05em; text-transform: uppercase; font-family: 'DM Mono', monospace; }
      .l-dino-hero { width: 140px; height: 140px; object-fit: contain; margin-bottom: 28px; animation: l-float 4s ease-in-out infinite; filter: drop-shadow(0 8px 24px rgba(126,184,212,0.3)); }
      @keyframes l-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      .l-h1 { font-size: clamp(36px, 6vw, 68px); font-weight: 700; line-height: 1.1; letter-spacing: -2px; max-width: 680px; margin-bottom: 20px; }
      .l-accent { color: #1B4F72; }
      .l-hero-sub { font-size: 17px; color: #5A6E84; max-width: 440px; margin-bottom: 40px; line-height: 1.65; font-weight: 300; }
      .l-hero-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; justify-content: center; margin-bottom: 52px; }
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
    const list = JSON.parse(localStorage.getItem("bd_waitlist") || "[]");
    if (!list.includes(email)) list.push(email);
    localStorage.setItem("bd_waitlist", JSON.stringify(list));
    document.getElementById("wl-msg").style.display = "block";
    document.getElementById("wl-email").value = "";
    document.getElementById("wl-email").disabled = true;
    document.querySelector(".l-submit-btn").disabled = true;
  }

  return (
    <div className="landing">
      {/* NAV */}
      <nav className="l-nav">
        <a href="/" className="l-nav-logo">
          <img src="/dino.png" alt="Blue Dinosaur AI" onError={e => { e.target.style.display='none'; }} />
          Blue Dinosaur AI
        </a>
        <div className="l-nav-cta">
          <a href="#como-funciona" className="l-btn-ghost-nav">Cómo funciona</a>
          <a href="/app" className="l-btn-primary-nav">Empezar →</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="l-hero">
        <div className="l-dino-tracks" style={{top:"15%",left:"5%"}}>🦶🦶</div>
        <div className="l-dino-tracks" style={{bottom:"20%",right:"6%"}}>🦶🦶</div>
        <div className="l-badge">🦕 Beta pública</div>
        <img src="/dino.png" alt="Blue Dinosaur AI" className="l-dino-hero" onError={e => e.target.style.display='none'} />
        <h1 className="l-h1">Prompts <span className="l-accent">completos</span><br/>y precisos, siempre.</h1>
        <p className="l-hero-sub">Describe lo que necesitas, aunque esté incompleto. Blue Dinosaur AI te hace las preguntas correctas y genera el prompt perfecto para cualquier IA.</p>
        <div className="l-hero-actions">
          <a href="/app" className="l-btn-primary">Empezar →</a>
          <a href="#como-funciona" className="l-btn-ghost">Ver cómo funciona</a>
        </div>
        <div className="l-compatible">
          <span>Compatible con</span><span className="l-dot"></span>
          <span>Claude</span><span className="l-dot"></span>
          <span>ChatGPT</span><span className="l-dot"></span>
          <span>Gemini</span><span className="l-dot"></span>
          <span>Midjourney</span><span className="l-dot"></span>
          <span>y más</span>
        </div>
      </section>

      {/* MOCKUP */}
      <section className="l-mockup-section" id="como-funciona">
        <div className="l-section-inner" style={{textAlign:"center"}}>
          <span className="l-section-tag">Cómo funciona</span>
          <h2 className="l-section-title">De idea vaga a prompt preciso<br/>en 60 segundos</h2>
          <p className="l-section-sub" style={{margin:"0 auto"}}>Sin tecnicismos. Sin saber prompt engineering. Solo dile lo que quieres.</p>
        </div>
        <div className="l-mockup">
          <div className="l-mockup-bar">
            <div className="l-mdot" style={{background:"#FF5F57"}}></div>
            <div className="l-mdot" style={{background:"#FEBC2E"}}></div>
            <div className="l-mdot" style={{background:"#28C840"}}></div>
            <span style={{fontSize:11,color:"#6B7E96",fontFamily:"DM Mono, monospace",marginLeft:8}}>bluedinosaur.ai/app</span>
          </div>
          <div className="l-mockup-body">
            <div className="l-mockup-eyebrow">Prompts. Completos, Precisos.</div>
            <div className="l-mockup-title">Empieza con tu idea</div>
            <div className="l-mockup-step">
              <div className="l-step-num">01</div>
              <div>
                <div className="l-step-label">Tu idea</div>
                <div className="l-step-text">"quiero saber algo sobre invertir en México..."</div>
              </div>
            </div>
            <div className="l-mockup-step">
              <div className="l-step-num">02</div>
              <div>
                <div className="l-step-label">Blue Dinosaur AI pregunta</div>
                <div className="l-step-text">¿Qué nivel de experiencia tienes con inversiones?</div>
                <div className="l-step-opts">
                  <span className="l-opt">Principiante</span>
                  <span className="l-opt l-opt-sel">Experiencia básica</span>
                  <span className="l-opt">Avanzado</span>
                </div>
              </div>
            </div>
            <div className="l-mockup-result">🦕 Actúa como asesor financiero. Tengo experiencia básica en inversiones y quiero entender las mejores opciones disponibles en México en 2025: CETES, ETFs y fondos de inversión. Explica ventajas, riesgos y cómo empezar con menos de $10,000 MXN.</div>
          </div>
        </div>
      </section>

      {/* VALUE */}
      <section className="l-section">
        <div className="l-section-inner">
          <span className="l-section-tag">Por qué Blue Dinosaur AI</span>
          <h2 className="l-section-title">El problema no es la IA.<br/>Es la pregunta.</h2>
          <p className="l-section-sub">Las herramientas de IA son poderosas. Pero solo dan lo que les pides, y muchas veces no sabemos exactamente qué pedir.</p>
          <div className="l-value-grid">
            <div className="l-value-card"><div className="l-value-icon">🎯</div><div className="l-value-title">Claridad desde el inicio</div><div className="l-value-desc">Blue Dinosaur AI descubre lo que realmente necesitas, aunque tú mismo no lo tengas del todo claro todavía.</div></div>
            <div className="l-value-card"><div className="l-value-icon">⚡</div><div className="l-value-title">Menos intentos, mejor resultado</div><div className="l-value-desc">Un prompt preciso desde el principio te ahorra varios mensajes de correcciones. Llegas al resultado más rápido.</div></div>
            <div className="l-value-card"><div className="l-value-icon">🔌</div><div className="l-value-title">Funciona con cualquier IA</div><div className="l-value-desc">El prompt que genera Blue Dinosaur AI lo usas en Claude, ChatGPT, Gemini, Midjourney o cualquier herramienta.</div></div>
          </div>
        </div>
      </section>

      {/* BEFORE/AFTER */}
      <section style={{background:"#EDF2F7",borderTop:"1px solid #C9D8E8",borderBottom:"1px solid #C9D8E8",padding:"80px 24px"}}>
        <div className="l-section-inner">
          <span className="l-section-tag">La diferencia</span>
          <h2 className="l-section-title">Antes y después</h2>
          <div className="l-ba-grid">
            <div className="l-ba-box"><div className="l-ba-label">Sin Blue Dinosaur AI</div><div className="l-ba-text">"explícame el cambio climático"</div></div>
            <div className="l-ba-arrow">→</div>
            <div className="l-ba-box l-ba-after"><div className="l-ba-label">Con Blue Dinosaur AI</div><div className="l-ba-text">Actúa como científico divulgador. Explícame las causas y consecuencias del cambio climático a nivel de México, en términos accesibles para alguien sin formación científica. Incluye datos recientes y 3 acciones concretas que puedo tomar hoy.</div></div>
          </div>
          <div className="l-stats-row">
            <div className="l-stat"><div className="l-stat-num">60s</div><div className="l-stat-label">para tu prompt listo</div></div>
            <div className="l-stat"><div className="l-stat-num">3</div><div className="l-stat-label">preguntas máximo</div></div>
            <div className="l-stat"><div className="l-stat-num">6+</div><div className="l-stat-label">herramientas compatibles</div></div>
            <div className="l-stat"><div className="l-stat-num">100%</div><div className="l-stat-label">sin registro</div></div>
          </div>
        </div>
      </section>

      {/* PRO WAITLIST */}
      <section className="l-pro-section">
        <div className="l-section-inner">
          <div className="l-pro-badge">🦕 Próximamente</div>
          <h2 className="l-pro-title">Plan Pro está en camino.</h2>
          <p className="l-pro-sub">Prompts ilimitados, historial completo y más. Sé el primero en saber cuando esté disponible.</p>
          <form className="l-waitlist-form" onSubmit={handleWaitlist} data-netlify="true" name="waitlist">
            <input type="hidden" name="form-name" value="waitlist" />
            <input type="email" id="wl-email" className="l-email-input" placeholder="tu@email.com" required />
            <button type="submit" className="l-submit-btn">Avisarme →</button>
          </form>
          <p id="wl-msg" className="l-waitlist-msg">✓ Listo, te avisamos cuando esté disponible.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="l-cta-section">
        <div className="l-section-inner">
          <img src="/dino.png" alt="Blue Dinosaur AI" className="l-cta-dino" onError={e => e.target.style.display='none'} />
          <h2 className="l-cta-title">La IA ya es poderosa.<br/>Aprende a usarla mejor.</h2>
          <p className="l-cta-sub">Describe lo que necesitas y Blue Dinosaur AI genera el prompt que realmente funciona.</p>
          <a href="/app" className="l-btn-primary">Empezar →</a>
          <p className="l-cta-note">Sin registro · Sin tarjeta · Listo en segundos</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="l-footer">
        <div className="l-footer-logo">
          <div className="l-footer-dino">🦕</div>
          Blue Dinosaur AI
        </div>
        <div className="l-footer-copy">© 2026 Blue Dinosaur AI · Beta</div>
      </footer>
    </div>
  );
}
