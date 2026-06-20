import { useState } from "react";

const SYSTEM_PROMPT = `Eres un experto en prompt engineering. Ayudas al usuario a clarificar lo que quiere preguntar a un LLM.

REGLAS ESTRICTAS DE FORMATO:

Si necesitas hacer una pregunta de clarificación, responde EXACTAMENTE así (sin nada más):
PREGUNTA: [tu pregunta aquí]
OPCION: [opción 1]
OPCION: [opción 2]
OPCION: [opción 3]
OPCION: Otro / lo escribo yo

Si ya tienes suficiente información para generar el prompt final, responde EXACTAMENTE así (sin nada más):
PROMPT: [el prompt optimizado aquí]

REGLAS:
- Máximo 3 preguntas en total durante la conversación
- Las opciones deben ser cortas (máximo 6 palabras)
- El prompt final debe ser específico, con contexto y rol si aplica
- NO escribas nada fuera de este formato
- NO uses markdown, JSON, ni explicaciones`;

function parseResponse(raw) {
  const text = raw.trim();
  if (text.startsWith("PROMPT:")) {
    return { type: "prompt", content: text.replace("PROMPT:", "").trim() };
  }
  if (text.includes("PREGUNTA:")) {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const questionLine = lines.find(l => l.startsWith("PREGUNTA:"));
    const options = lines.filter(l => l.startsWith("OPCION:")).map(l => l.replace("OPCION:", "").trim());
    if (questionLine && options.length > 0) {
      return { type: "question", question: questionLine.replace("PREGUNTA:", "").trim(), options };
    }
  }
  return { type: "prompt", content: text };
}

export default function App() {
  const [stage, setStage] = useState("input");
  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [finalPrompt, setFinalPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [customAnswer, setCustomAnswer] = useState("");

  async function callClaude(messages) {
    const response = await fetch("/.netlify/functions/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: SYSTEM_PROMPT, messages }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `Error ${response.status}`);
    const raw = data.content.map((b) => b.text || "").join("");
    return parseResponse(raw);
  }

  async function processResult(result, newHistory) {
    setHistory(newHistory);
    if (result.type === "question" && questionCount < 3) {
      setCurrentQuestion(result);
      setQuestionCount(q => q + 1);
      setStage("questioning");
    } else {
      setFinalPrompt(result.content || "");
      setStage("final");
    }
  }

  async function handleSubmitInput() {
    if (!userInput.trim()) return;
    setLoading(true);
    setError("");
    try {
      const msgs = [{ role: "user", content: userInput.trim() }];
      const result = await callClaude(msgs);
      await processResult(result, msgs);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }

  async function handleAnswer(answer) {
    if (answer === "__custom__") { setStage("custom"); return; }
    const newHistory = [
      ...history,
      { role: "assistant", content: `PREGUNTA: ${currentQuestion.question}\n${currentQuestion.options.map(o => `OPCION: ${o}`).join("\n")}` },
      { role: "user", content: answer },
    ];
    setLoading(true);
    setError("");
    try {
      const result = await callClaude(newHistory);
      await processResult(result, newHistory);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }

  async function handleCustomAnswer() {
    if (!customAnswer.trim()) return;
    const answer = customAnswer.trim();
    setCustomAnswer("");
    setStage("questioning");
    await handleAnswer(answer);
  }

  function handleCopy() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(finalPrompt).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => fallbackCopy());
      } else {
        fallbackCopy();
      }
    } catch(e) { fallbackCopy(); }
  }

  function fallbackCopy() {
    const el = document.createElement("textarea");
    el.value = finalPrompt;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.focus();
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() {
    setStage("input"); setUserInput(""); setHistory([]);
    setCurrentQuestion(null); setQuestionCount(0);
    setFinalPrompt(""); setError(""); setCopied(false); setCustomAnswer("");
  }

  const progressStep = stage === "input" ? 0 : stage === "final" ? 2 : 1;

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #c8f135; color: #0a0a0a; }
        textarea:focus { outline: none; }
        textarea { font-family: 'IBM Plex Mono', monospace; resize: none; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .fade-up { animation: fadeUp 0.35s ease forwards; }
        .dot { display:inline-block;width:6px;height:6px;background:#c8f135;border-radius:50%;animation:pulse 1s ease infinite;margin:0 3px; }
        .dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
        .opt-btn:hover { background: #c8f135 !important; color: #0a0a0a !important; border-color: #c8f135 !important; }
        .opt-btn:active { transform: scale(0.98); }
        .main-btn:hover { background: #c8f135 !important; color: #0a0a0a !important; }
        .ghost-btn:hover { color: #c8f135 !important; border-color: #c8f135 !important; }
        .copy-btn:hover { background: #c8f135 !important; color: #0a0a0a !important; border-color: #c8f135 !important; }
      `}</style>

      <div style={s.header}>
        <div style={s.logo}><span style={s.logoIcon}>⬡</span><span style={s.logoText}>SHARPENER</span></div>
        <div style={s.tagline}>Tu filtro antes del LLM</div>
      </div>

      <div style={s.progress}>
        {[0,1,2].map(i => <div key={i} style={{...s.bar, background: i <= progressStep ? "#c8f135" : "#222"}} />)}
      </div>

      <div style={s.card}>

        {stage === "input" && (
          <div className="fade-up">
            <div style={s.label}>¿QUÉ QUIERES SABER O HACER?</div>
            <div style={s.sub}>No te preocupes por ser preciso. Eso es nuestro trabajo.</div>
            <textarea style={s.textarea} placeholder="Ej: quiero entender por qué México no tiene tecnología propia..." value={userInput} onChange={e => setUserInput(e.target.value)} rows={5} autoFocus />
            {error && <div style={s.error}>{error}</div>}
            <button className="main-btn" style={{...s.mainBtn, opacity: loading||!userInput.trim()?0.4:1}} onClick={handleSubmitInput} disabled={loading||!userInput.trim()}>
              {loading ? <><span className="dot"/><span className="dot"/><span className="dot"/></> : "ANALIZAR →"}
            </button>
          </div>
        )}

        {stage === "questioning" && currentQuestion && (
          <div className="fade-up">
            <div style={s.counter}>PREGUNTA {questionCount}</div>
            <div style={s.question}>{currentQuestion.question}</div>
            <div style={s.opts}>
              {currentQuestion.options?.map((opt, i) => {
                const isCustom = opt.toLowerCase().includes("otro") || opt.toLowerCase().includes("escribo");
                return (
                  <button key={i} className="opt-btn" style={{...s.optBtn, ...(isCustom ? s.optCustom : {})}}
                    onClick={() => isCustom ? handleAnswer("__custom__") : handleAnswer(opt)} disabled={loading}>
                    {opt}
                  </button>
                );
              })}
            </div>
            {loading && <div style={{textAlign:"center",marginTop:16}}><span className="dot"/><span className="dot"/><span className="dot"/></div>}
            {error && <div style={s.error}>{error}</div>}
          </div>
        )}

        {stage === "custom" && (
          <div className="fade-up">
            <div style={s.label}>TU RESPUESTA</div>
            <div style={s.question}>{currentQuestion?.question}</div>
            <textarea style={s.textarea} placeholder="Escribe tu respuesta aquí..." value={customAnswer} onChange={e => setCustomAnswer(e.target.value)} rows={3} autoFocus />
            {error && <div style={s.error}>{error}</div>}
            <div style={s.row}>
              <button className="ghost-btn" style={s.ghostBtn} onClick={() => setStage("questioning")}>← VOLVER</button>
              <button className="main-btn" style={{...s.mainBtn, flex:1, opacity: loading||!customAnswer.trim()?0.4:1}} onClick={handleCustomAnswer} disabled={loading||!customAnswer.trim()}>
                {loading ? <><span className="dot"/><span className="dot"/><span className="dot"/></> : "CONTINUAR →"}
              </button>
            </div>
          </div>
        )}

        {stage === "final" && (
          <div className="fade-up">
            <div style={s.label}>TU PROMPT LISTO</div>
            <div style={s.sub}>Cópialo y pégalo en Claude, ChatGPT o Gemini.</div>
            <div style={s.promptBox}><div style={s.promptText}>{finalPrompt}</div></div>
            <div style={s.row}>
              <button className="ghost-btn" style={s.ghostBtn} onClick={handleReset}>← NUEVO</button>
              <button className="copy-btn" style={{...s.mainBtn, flex:1, background:copied?"#c8f135":"transparent", color:copied?"#0a0a0a":"#c8f135", border:"1.5px solid #c8f135"}} onClick={handleCopy}>
                {copied ? "✓ COPIADO" : "COPIAR PROMPT"}
              </button>
            </div>
          </div>
        )}

      </div>
      <div style={s.footer}>Powered by Claude · Hecho para pensar mejor antes de preguntar</div>
    </div>
  );
}

const s = {
  root:{minHeight:"100vh",background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",padding:"40px 20px 60px",fontFamily:"'Syne',sans-serif",color:"#f0f0f0"},
  header:{textAlign:"center",marginBottom:28},
  logo:{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:6},
  logoIcon:{fontSize:26,color:"#c8f135"},
  logoText:{fontSize:24,fontWeight:800,letterSpacing:"0.15em"},
  tagline:{fontSize:11,color:"#555",letterSpacing:"0.1em",textTransform:"uppercase"},
  progress:{display:"flex",gap:6,marginBottom:28},
  bar:{width:40,height:3,borderRadius:2,transition:"background 0.3s"},
  card:{width:"100%",maxWidth:540,background:"#141414",border:"1px solid #222",borderRadius:12,padding:"28px 24px"},
  label:{fontSize:11,fontWeight:700,letterSpacing:"0.12em",color:"#666",marginBottom:8,textTransform:"uppercase"},
  sub:{fontSize:13,color:"#444",marginBottom:14,fontFamily:"'IBM Plex Mono',monospace"},
  textarea:{width:"100%",background:"#0d0d0d",border:"1px solid #2a2a2a",borderRadius:8,padding:"12px 14px",color:"#e0e0e0",fontSize:14,lineHeight:1.6,marginBottom:16},
  counter:{fontSize:10,fontWeight:700,letterSpacing:"0.15em",color:"#c8f135",marginBottom:12,textTransform:"uppercase"},
  question:{fontSize:16,fontWeight:600,color:"#f0f0f0",lineHeight:1.5,marginBottom:20},
  opts:{display:"flex",flexDirection:"column",gap:10},
  optBtn:{width:"100%",padding:"13px 16px",background:"#0d0d0d",border:"1px solid #2a2a2a",borderRadius:8,color:"#d0d0d0",fontSize:14,fontWeight:500,textAlign:"left",fontFamily:"'Syne',sans-serif",cursor:"pointer",transition:"all 0.15s"},
  optCustom:{border:"1px dashed #333",color:"#555"},
  mainBtn:{display:"block",width:"100%",padding:"13px 20px",background:"transparent",border:"1.5px solid #f0f0f0",borderRadius:8,color:"#f0f0f0",fontSize:13,fontWeight:700,letterSpacing:"0.1em",fontFamily:"'Syne',sans-serif",textAlign:"center",cursor:"pointer",transition:"all 0.15s"},
  ghostBtn:{padding:"13px 16px",background:"transparent",border:"1.5px solid #2a2a2a",borderRadius:8,color:"#555",fontSize:12,fontWeight:700,letterSpacing:"0.08em",fontFamily:"'Syne',sans-serif",whiteSpace:"nowrap",cursor:"pointer",transition:"all 0.15s"},
  row:{display:"flex",gap:10,alignItems:"center"},
  promptBox:{background:"#0d0d0d",border:"1px solid #2a2a2a",borderLeft:"3px solid #c8f135",borderRadius:8,padding:"16px 18px",marginBottom:20,maxHeight:260,overflowY:"auto"},
  promptText:{fontSize:13,color:"#d0d0d0",lineHeight:1.75,fontFamily:"'IBM Plex Mono',monospace",whiteSpace:"pre-wrap"},
  error:{fontSize:12,color:"#ff6b6b",fontFamily:"'IBM Plex Mono',monospace",marginBottom:12},
  footer:{marginTop:28,fontSize:11,color:"#2a2a2a",fontFamily:"'IBM Plex Mono',monospace",textAlign:"center"},
};
