import { useState, useEffect, useRef } from "react";

const PROMPTS = {
  es: `Eres un experto en prompt engineering. Ayudas al usuario a clarificar lo que quiere preguntarle a un LLM o herramienta de IA (imágenes, video, etc.).

El usuario puede proporcionar una o más imágenes como referencia. Si lo hace, analízalas y úsalas para generar un prompt más específico y preciso.

REGLAS ESTRICTAS DE FORMATO:

Si necesitas hacer una pregunta de clarificación, responde EXACTAMENTE así (nada más):
QUESTION: [tu pregunta aquí]
OPTION: [opción 1]
OPTION: [opción 2]
OPTION: [opción 3]
OPTION: Otro / lo escribo yo

Si ya tienes suficiente información para generar el prompt final, responde EXACTAMENTE así (nada más):
PROMPT: [el prompt optimizado aquí]

REGLAS:
- Máximo 3 preguntas en total durante la conversación
- Las opciones deben ser cortas (máximo 6 palabras)
- El prompt final debe ser específico, con contexto y rol si aplica
- Si se proporcionaron imágenes, describe sus elementos visuales clave en el prompt
- NO escribas nada fuera de este formato
- NO uses markdown, JSON ni explicaciones`,

  en: `You are an expert in prompt engineering. You help users clarify what they want to ask an LLM or AI image/video tool.

The user may provide one or more images as reference. If they do, analyze them and use them to generate a more specific and accurate prompt.

STRICT FORMAT RULES:

If you need to ask a clarifying question, respond EXACTLY like this (nothing else):
QUESTION: [your question here]
OPTION: [option 1]
OPTION: [option 2]
OPTION: [option 3]
OPTION: Other / I'll write it myself

If you already have enough information to generate the final prompt, respond EXACTLY like this (nothing else):
PROMPT: [the optimized prompt here]

RULES:
- Maximum 3 questions total during the conversation
- Options must be short (maximum 6 words)
- The final prompt must be specific, with context and role if applicable
- If images were provided, describe their key visual elements in the prompt
- Do NOT write anything outside this format
- Do NOT use markdown, JSON, or explanations`
};

const UI = {
  es: {
    eyebrow: "Prompts. Completos, Precisos.",
    heading: "Empieza con tu idea",
    body: "Comparte tu idea o sube imágenes. Te damos el prompt perfecto en 60 segundos.",
    placeholder: "Escribe tu idea aquí, aunque esté incompleta...",
    placeholderImages: "Describe qué quieres hacer con estas imágenes (opcional)...",
    uploadBtn: "Subir imágenes (opcional, hasta 5)",
    analyzeBtn: "Analizar →",
    questionLabel: "Pregunta",
    yourAnswer: "Tu respuesta",
    answerPlaceholder: "Escribe tu respuesta aquí...",
    back: "← Atrás",
    continueBtn: "Continuar →",
    promptReady: "Tu prompt está listo",
    readyToUse: "Listo para usar",
    promptBody: "Cópialo y pégalo en Claude, ChatGPT, Midjourney o cualquier herramienta de IA.",
    newBtn: "← Nuevo",
    copyBtn: "Copiar prompt",
    copiedBtn: "✓ Copiado",
    historyBtn: "Historial",
    clearAll: "Borrar todo",
    historyEmpty: "Tus prompts generados aparecerán aquí.",
    footer: "Blue Dinosaur AI · Hecho para pensar mejor antes de preguntar",
    maxImages: "Máximo 5 imágenes permitidas.",
    invalidType: "Solo se permiten imágenes JPG, PNG, GIF o WebP.",
    maxSize: "Cada imagen debe ser menor a 5MB.",
    networkError: "Error de red. Intenta de nuevo.",
    customOption: ["otro", "escribo"],
  },
  en: {
    eyebrow: "Prompts. Rich, Precise.",
    heading: "Start with your idea",
    body: "Drop your idea or upload images. We'll give you the perfect prompt in 60 seconds.",
    placeholder: "Write your idea here, even if it's incomplete...",
    placeholderImages: "Describe what you want to do with these images (optional)...",
    uploadBtn: "Upload images (optional, up to 5)",
    analyzeBtn: "Analyze →",
    questionLabel: "Question",
    yourAnswer: "Your answer",
    answerPlaceholder: "Write your answer here...",
    back: "← Back",
    continueBtn: "Continue →",
    promptReady: "Your prompt is ready",
    readyToUse: "Ready to use",
    promptBody: "Copy and paste it into Claude, ChatGPT, Midjourney or any AI tool.",
    newBtn: "← New",
    copyBtn: "Copy prompt",
    copiedBtn: "✓ Copied",
    historyBtn: "History",
    clearAll: "Clear all",
    historyEmpty: "Your generated prompts will appear here.",
    footer: "Blue Dinosaur AI · Made to think better before you ask",
    maxImages: "Maximum 5 images allowed.",
    invalidType: "Only JPG, PNG, GIF or WebP images are allowed.",
    maxSize: "Each image must be smaller than 5MB.",
    networkError: "Network error. Please try again.",
    customOption: ["other", "write"],
  }
};

function parseResponse(raw) {
  const text = raw.trim();
  if (text.startsWith("PROMPT:")) {
    return { type: "prompt", content: text.replace("PROMPT:", "").trim() };
  }
  if (text.includes("QUESTION:")) {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const questionLine = lines.find(l => l.startsWith("QUESTION:"));
    const options = lines.filter(l => l.startsWith("OPTION:")).map(l => l.replace("OPTION:", "").trim());
    if (questionLine && options.length > 0) {
      return { type: "question", question: questionLine.replace("QUESTION:", "").trim(), options };
    }
  }
  return { type: "prompt", content: text };
}

function saveToHistory(idea, prompt) {
  const history = JSON.parse(localStorage.getItem("bluedinosauurai_history") || "[]");
  const entry = {
    id: Date.now(),
    date: new Date().toLocaleDateString("es-MX", { month: "short", day: "numeric", year: "numeric" }),
    idea: idea.slice(0, 80) + (idea.length > 80 ? "..." : ""),
    prompt,
  };
  history.unshift(entry);
  localStorage.setItem("bluedinosauurai_history", JSON.stringify(history.slice(0, 50)));
}

function getHistory() {
  return JSON.parse(localStorage.getItem("bluedinosauurai_history") || "[]");
}

const MAX_IMAGES = 5;

export default function BlueDinosaurAI() {
  const [lang, setLang] = useState("es");
  const [stage, setStage] = useState("input");
  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyStack, setHistoryStack] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [finalPrompt, setFinalPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [customAnswer, setCustomAnswer] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [promptHistory, setPromptHistory] = useState([]);
  const [originalIdea, setOriginalIdea] = useState("");
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const t = UI[lang];

  useEffect(() => {
    setPromptHistory(getHistory());
  }, []);

  function toggleLang() {
    setLang(l => l === "es" ? "en" : "es");
  }

  function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) { setError(t.maxImages); return; }
    const filesToProcess = files.slice(0, remaining);
    setError("");
    filesToProcess.forEach(file => {
      if (!validTypes.includes(file.type)) { setError(t.invalidType); return; }
      if (file.size > 5 * 1024 * 1024) { setError(t.maxSize); return; }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target.result;
        const base64 = result.split(",")[1];
        setImages(prev => {
          if (prev.length >= MAX_IMAGES) return prev;
          return [...prev, { base64, mediaType: file.type, preview: result }];
        });
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(index) {
    setImages(prev => prev.filter((_, i) => i !== index));
  }

  async function callClaude(messages) {
    const response = await fetch("/.netlify/functions/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: PROMPTS[lang], messages }),
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { throw new Error(t.networkError); }
    if (!response.ok) throw new Error(data.error?.message || `Error ${response.status}`);
    const raw = data.content.map(b => b.text || "").join("");
    return parseResponse(raw);
  }

  async function processResult(result, newHistory) {
    setHistory(newHistory);
    if (result.type === "question" && questionCount < 3) {
      setHistoryStack(prev => [...prev, { history: newHistory, question: currentQuestion, questionCount, stage }]);
      setCurrentQuestion(result);
      setQuestionCount(q => q + 1);
      setStage("questioning");
    } else {
      saveToHistory(originalIdea, result.content || "");
      setPromptHistory(getHistory());
      setFinalPrompt(result.content || "");
      setStage("final");
    }
  }

  function handleBack() {
    if (historyStack.length === 0) {
      setStage("input"); setHistory([]); setCurrentQuestion(null); setQuestionCount(0); setError(""); return;
    }
    const prev = historyStack[historyStack.length - 1];
    setHistoryStack(stack => stack.slice(0, -1));
    if (prev.questionCount === 0) {
      setStage("input"); setHistory([]); setCurrentQuestion(null); setQuestionCount(0); setError(""); return;
    }
    setHistory(prev.history.slice(0, -2));
    setCurrentQuestion(prev.question);
    setQuestionCount(prev.questionCount);
    setStage("questioning");
    setError("");
  }

  async function handleSubmitInput() {
    if (!userInput.trim() && images.length === 0) return;
    const idea = userInput.trim() || "Generate a prompt based on these images";
    setOriginalIdea(idea);
    setHistoryStack([]);
    setLoading(true); setError("");
    try {
      let userContent;
      if (images.length > 0) {
        userContent = [
          ...images.map(img => ({ type: "image", source: { type: "base64", media_type: img.mediaType, data: img.base64 } })),
          { type: "text", text: userInput.trim() || "Generate a prompt based on these images" },
        ];
      } else {
        userContent = userInput.trim();
      }
      const msgs = [{ role: "user", content: userContent }];
      const result = await callClaude(msgs);
      await processResult(result, msgs);
    } catch(e) { setError(e.message); }
    setLoading(false);
  }

  async function handleAnswer(answer) {
    if (answer === "__custom__") { setStage("custom"); return; }
    const newHistory = [
      ...history,
      { role: "assistant", content: `QUESTION: ${currentQuestion.question}\n${currentQuestion.options.map(o => `OPTION: ${o}`).join("\n")}` },
      { role: "user", content: answer },
    ];
    setLoading(true); setError("");
    try {
      const result = await callClaude(newHistory);
      await processResult(result, newHistory);
    } catch(e) { setError(e.message); }
    setLoading(false);
  }

  async function handleCustomAnswer() {
    if (!customAnswer.trim()) return;
    const answer = customAnswer.trim();
    setCustomAnswer(""); setStage("questioning");
    await handleAnswer(answer);
  }

  function handleCopy(text, id = null) {
    const doCopy = () => {
      if (id) { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); }
      else { setCopied(true); setTimeout(() => setCopied(false), 2000); }
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(doCopy).catch(() => fallbackCopy(text, doCopy));
      } else { fallbackCopy(text, doCopy); }
    } catch(e) { fallbackCopy(text, doCopy); }
  }

  function fallbackCopy(text, cb) {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed"; el.style.opacity = "0";
    document.body.appendChild(el); el.focus(); el.select();
    document.execCommand("copy"); document.body.removeChild(el);
    cb();
  }

  function handleReset() {
    setStage("input"); setUserInput(""); setHistory([]);
    setCurrentQuestion(null); setQuestionCount(0);
    setFinalPrompt(""); setError(""); setCopied(false);
    setCustomAnswer(""); setOriginalIdea("");
    setImages([]); setHistoryStack([]);
  }

  function clearHistory() {
    localStorage.removeItem("bluedinosauurai_history");
    setPromptHistory([]);
  }

  const progress = stage === "input" ? 0 : stage === "final" ? 100 : questionCount * 30;
  const canSubmit = userInput.trim() || images.length > 0;

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F5F3EF; }
        textarea { font-family: 'DM Mono', monospace; resize: none; }
        textarea:focus { outline: none; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
        .slide-in { animation: slideIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards; }
        .opt:hover { background: #1A1A1A !important; color: #F5F3EF !important; }
        .opt:active { transform: scale(0.99); }
        .primary:hover { background: #2A2A2A !important; }
        .primary:active { transform: scale(0.99); }
        .ghost:hover { border-color: #1A1A1A !important; color: #1A1A1A !important; }
        .copy:hover { background: #1A1A1A !important; color: #F5F3EF !important; }
        .back:hover { color: #1A1A1A !important; }
        .lang-btn:hover { background: #ECEAE4 !important; color: #1A1A1A !important; }
        .wordmark:hover { opacity: 0.7; }
        .progress-bar { transition: width 0.6s cubic-bezier(0.16,1,0.3,1); }
        .hist-btn:hover { background: #ECEAE4 !important; }
        .hist-copy:hover { background: #1A1A1A !important; color: #F5F3EF !important; }
        .clear-btn:hover { color: #C0392B !important; }
        .upload-btn:hover { border-color: #1A1A1A !important; color: #1A1A1A !important; }
        .remove-img:hover { background: rgba(192,57,43,0.15) !important; color: #C0392B !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D8D4CC; border-radius: 2px; }
      `}</style>

      <header style={s.header}>
        <div className="wordmark" style={s.wordmark} onClick={handleReset}>Blue Dinosaur AI</div>
        <div style={s.headerRight}>
          <button className="lang-btn" style={s.langBtn} onClick={toggleLang}>
            {lang === "es" ? "EN" : "ES"}
          </button>
          <button
            style={{...s.historyBtn, background: showHistory ? "#1A1A1A" : "transparent", color: showHistory ? "#F5F3EF" : "#888", border: showHistory ? "1px solid #1A1A1A" : "1px solid #D8D4CC"}}
            className="hist-btn"
            onClick={() => setShowHistory(!showHistory)}
          >
            {promptHistory.length > 0 && <span style={s.badge}>{promptHistory.length}</span>}
            {t.historyBtn}
          </button>
          <span style={s.pill}>Beta</span>
        </div>
      </header>

      <div style={s.progressTrack}>
        <div className="progress-bar" style={{...s.progressFill, width: `${progress}%`}} />
      </div>

      <div style={s.layout}>
        <main style={{...s.main, marginRight: showHistory ? 340 : 0, transition: "margin-right 0.3s cubic-bezier(0.16,1,0.3,1)"}}>

          {stage === "input" && (
            <div className="fade-up" style={s.section}>
              <div style={s.eyebrow}>{t.eyebrow}</div>
              <h1 style={s.heading}>{t.heading}</h1>
              <p style={s.body}>{t.body}</p>

              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple style={{ display: "none" }} onChange={handleImageUpload} />

              {images.length > 0 && (
                <div style={s.imageGrid}>
                  {images.map((img, i) => (
                    <div key={i} style={s.imageThumbnailContainer}>
                      <img src={img.preview} alt={`Upload ${i + 1}`} style={s.imageThumbnail} />
                      <button className="remove-img" style={s.removeImageBtn} onClick={() => removeImage(i)}>✕</button>
                    </div>
                  ))}
                  {images.length < MAX_IMAGES && (
                    <button className="upload-btn" style={s.addMoreBtn} onClick={() => fileInputRef.current?.click()}>
                      <span style={{ fontSize: 22, lineHeight: 1 }}>+</span>
                      <span style={{ fontSize: 10, marginTop: 4 }}>{images.length}/{MAX_IMAGES}</span>
                    </button>
                  )}
                </div>
              )}

              {images.length === 0 && (
                <button className="upload-btn" style={s.uploadBtn} onClick={() => fileInputRef.current?.click()}>
                  <span style={{ fontSize: 18, marginRight: 8 }}>📎</span>
                  {t.uploadBtn}
                </button>
              )}

              <textarea
                style={{...s.textarea, marginTop: 12}}
                placeholder={images.length > 0 ? t.placeholderImages : t.placeholder}
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                rows={4}
                autoFocus
              />
              {error && <p style={s.error}>{error}</p>}
              <button className="primary" style={{...s.primary, opacity: loading || !canSubmit ? 0.4 : 1}} onClick={handleSubmitInput} disabled={loading || !canSubmit}>
                {loading ? <span style={s.spinner} /> : t.analyzeBtn}
              </button>
            </div>
          )}

          {stage === "questioning" && currentQuestion && (
            <div className="fade-up" style={s.section}>
              <div style={s.questionNav}>
                <button className="back" style={s.backBtn} onClick={handleBack}>{t.back}</button>
                <div style={s.eyebrow}>{t.questionLabel} {questionCount}</div>
              </div>
              <h2 style={s.heading}>{currentQuestion.question}</h2>
              <div style={s.options}>
                {currentQuestion.options?.map((opt, i) => {
                  const isCustom = t.customOption.some(kw => opt.toLowerCase().includes(kw));
                  return (
                    <button key={i} className="opt"
                      style={{...s.opt, ...(isCustom ? s.optMuted : {})}}
                      onClick={() => isCustom ? handleAnswer("__custom__") : handleAnswer(opt)}
                      disabled={loading}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {loading && <div style={s.loadingRow}><span style={{...s.spinner, borderTopColor: "#1A1A1A", borderColor: "rgba(0,0,0,0.1)"}} /></div>}
              {error && <p style={s.error}>{error}</p>}
            </div>
          )}

          {stage === "custom" && (
            <div className="fade-up" style={s.section}>
              <div style={s.eyebrow}>{t.yourAnswer}</div>
              <h2 style={s.heading}>{currentQuestion?.question}</h2>
              <textarea
                style={s.textarea}
                placeholder={t.answerPlaceholder}
                value={customAnswer}
                onChange={e => setCustomAnswer(e.target.value)}
                rows={3}
                autoFocus
              />
              {error && <p style={s.error}>{error}</p>}
              <div style={s.row}>
                <button className="ghost" style={s.ghost} onClick={handleBack}>{t.back}</button>
                <button className="primary"
                  style={{...s.primary, flex: 1, opacity: loading || !customAnswer.trim() ? 0.4 : 1}}
                  onClick={handleCustomAnswer} disabled={loading || !customAnswer.trim()}>
                  {loading ? <span style={s.spinner} /> : t.continueBtn}
                </button>
              </div>
            </div>
          )}

          {stage === "final" && (
            <div className="fade-up" style={s.section}>
              <div style={s.eyebrow}>{t.promptReady}</div>
              <h2 style={{...s.heading, fontSize: 22}}>{t.readyToUse}</h2>
              <p style={s.body}>{t.promptBody}</p>
              <div style={s.promptBox}>
                <p style={s.promptText}>{finalPrompt}</p>
              </div>
              <div style={s.row}>
                <button className="ghost" style={s.ghost} onClick={handleReset}>{t.newBtn}</button>
                <button className="copy"
                  style={{...s.primary, flex: 1, background: copied ? "#1A1A1A" : "#F5F3EF", color: copied ? "#F5F3EF" : "#1A1A1A", border: "1.5px solid #1A1A1A"}}
                  onClick={() => handleCopy(finalPrompt)}>
                  {copied ? t.copiedBtn : t.copyBtn}
                </button>
              </div>
            </div>
          )}

        </main>

        {showHistory && (
          <div className="slide-in" style={s.historyPanel}>
            <div style={s.historyHeader}>
              <span style={s.historyTitle}>{t.historyBtn}</span>
              {promptHistory.length > 0 && (
                <button className="clear-btn" style={s.clearBtn} onClick={clearHistory}>{t.clearAll}</button>
              )}
            </div>
            <div style={s.historyList}>
              {promptHistory.length === 0 ? (
                <div style={s.historyEmpty}>
                  <p style={{fontSize: 13, color: "#999", textAlign: "center", lineHeight: 1.6}}>{t.historyEmpty}</p>
                </div>
              ) : (
                promptHistory.map(entry => (
                  <div key={entry.id} style={s.historyCard}>
                    <div style={s.historyDate}>{entry.date}</div>
                    <div style={s.historyIdea}>"{entry.idea}"</div>
                    <div style={s.historyPrompt}>{entry.prompt}</div>
                    <button className="hist-copy"
                      style={{...s.histCopyBtn, background: copiedId === entry.id ? "#1A1A1A" : "transparent", color: copiedId === entry.id ? "#F5F3EF" : "#888"}}
                      onClick={() => handleCopy(entry.prompt, entry.id)}>
                      {copiedId === entry.id ? t.copiedBtn : "Copy"}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      <footer style={s.footer}>
        <span>{t.footer}</span>
      </footer>
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", background: "#F5F3EF", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", borderBottom: "1px solid #E8E4DC", position: "sticky", top: 0, background: "#F5F3EF", zIndex: 10 },
  wordmark: { fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", color: "#1A1A1A", cursor: "pointer", transition: "opacity 0.15s" },
  headerRight: { display: "flex", alignItems: "center", gap: 10 },
  langBtn: { fontSize: 12, fontWeight: 600, padding: "5px 10px", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s", background: "transparent", border: "1px solid #D8D4CC", color: "#888", letterSpacing: "0.05em" },
  historyBtn: { fontSize: 12, fontWeight: 500, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6, position: "relative" },
  badge: { background: "#1A1A1A", color: "#F5F3EF", fontSize: 10, fontWeight: 600, padding: "1px 5px", borderRadius: 10, lineHeight: 1.4 },
  pill: { fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", color: "#888", background: "#ECEAE4", padding: "3px 10px", borderRadius: 99, textTransform: "uppercase" },
  progressTrack: { height: 2, background: "#E8E4DC", width: "100%" },
  progressFill: { height: "100%", background: "#1A1A1A", borderRadius: 99 },
  layout: { flex: 1, display: "flex", position: "relative" },
  main: { flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "60px 24px 40px", transition: "margin-right 0.3s" },
  section: { width: "100%", maxWidth: 480 },
  questionNav: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  eyebrow: { fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", color: "#999", textTransform: "uppercase" },
  backBtn: { fontSize: 12, color: "#BBB", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "color 0.15s", padding: 0, fontWeight: 500 },
  heading: { fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.2, color: "#1A1A1A", marginBottom: 14 },
  body: { fontSize: 14, color: "#777", lineHeight: 1.6, marginBottom: 24, fontWeight: 400 },
  textarea: { width: "100%", background: "#ECEAE4", border: "1.5px solid transparent", borderRadius: 10, padding: "14px 16px", color: "#1A1A1A", fontSize: 14, lineHeight: 1.6, marginBottom: 16, transition: "border-color 0.2s" },
  uploadBtn: { width: "100%", padding: "12px 16px", background: "transparent", border: "1.5px dashed #D8D4CC", borderRadius: 10, color: "#999", fontSize: 13, fontWeight: 400, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.15s", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" },
  imageGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 8, marginBottom: 12 },
  imageThumbnailContainer: { position: "relative", borderRadius: 8, overflow: "hidden", border: "1.5px solid #E8E4DC", aspectRatio: "1", backgroundColor: "#ECEAE4" },
  imageThumbnail: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  removeImageBtn: { position: "absolute", top: 4, right: 4, width: 20, height: 20, background: "rgba(255,255,255,0.85)", border: "none", borderRadius: 4, fontSize: 10, color: "#888", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s", padding: 0 },
  addMoreBtn: { border: "1.5px dashed #D8D4CC", borderRadius: 8, background: "transparent", color: "#999", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", aspectRatio: "1", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" },
  options: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 },
  opt: { width: "100%", padding: "14px 18px", background: "#ECEAE4", border: "1.5px solid transparent", borderRadius: 10, color: "#1A1A1A", fontSize: 14, fontWeight: 400, textAlign: "left", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.15s" },
  optMuted: { background: "transparent", border: "1.5px solid #E0DDD6", color: "#999" },
  primary: { display: "block", width: "100%", padding: "13px 20px", background: "#1A1A1A", border: "none", borderRadius: 10, color: "#F5F3EF", fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.15s", textAlign: "center" },
  ghost: { padding: "13px 18px", background: "transparent", border: "1.5px solid #D8D4CC", borderRadius: 10, color: "#888", fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" },
  row: { display: "flex", gap: 8, alignItems: "center" },
  promptBox: { background: "#ECEAE4", borderRadius: 10, padding: "18px 20px", marginBottom: 20, maxHeight: 240, overflowY: "auto" },
  promptText: { fontSize: 13, color: "#333", lineHeight: 1.75, fontFamily: "'DM Mono', monospace", whiteSpace: "pre-wrap" },
  error: { fontSize: 12, color: "#C0392B", marginBottom: 12, fontFamily: "'DM Mono', monospace" },
  loadingRow: { display: "flex", justifyContent: "center", paddingTop: 16 },
  spinner: { display: "inline-block", width: 16, height: 16, border: "2px solid rgba(0,0,0,0.1)", borderTop: "2px solid #1A1A1A", borderRadius: "50%", animation: "spin 0.7s linear infinite" },
  footer: { padding: "20px 28px", borderTop: "1px solid #E8E4DC", fontSize: 11, color: "#BBB", textAlign: "center", letterSpacing: "0.02em" },
  historyPanel: { position: "fixed", top: 57, right: 0, width: 320, height: "calc(100vh - 57px)", background: "#FAFAF7", borderLeft: "1px solid #E8E4DC", display: "flex", flexDirection: "column", zIndex: 9 },
  historyHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #E8E4DC" },
  historyTitle: { fontSize: 13, fontWeight: 600, color: "#1A1A1A", letterSpacing: "-0.2px" },
  clearBtn: { fontSize: 11, color: "#BBB", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "color 0.15s" },
  historyList: { flex: 1, overflowY: "auto", padding: "12px" },
  historyEmpty: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: "20px" },
  historyCard: { background: "#fff", border: "1px solid #E8E4DC", borderRadius: 10, padding: "14px", marginBottom: 10 },
  historyDate: { fontSize: 10, color: "#BBB", fontFamily: "'DM Mono', monospace", marginBottom: 6, letterSpacing: "0.3px" },
  historyIdea: { fontSize: 12, color: "#888", lineHeight: 1.5, marginBottom: 8, fontStyle: "italic" },
  historyPrompt: { fontSize: 12, color: "#444", lineHeight: 1.6, fontFamily: "'DM Mono', monospace", marginBottom: 10, maxHeight: 80, overflowY: "auto", whiteSpace: "pre-wrap" },
  histCopyBtn: { fontSize: 11, fontWeight: 500, padding: "4px 10px", border: "1px solid #E8E4DC", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" },
};
