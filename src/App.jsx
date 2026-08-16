import { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

import { useParams } from "react-router-dom";
import { getLens } from "./lenses.js";

const PROMPTS = {
  es: `Eres un experto en prompt engineering. Ayudas al usuario a clarificar lo que quiere preguntarle a un LLM o herramienta de IA (imágenes, video, etc.).

El usuario puede proporcionar una o más imágenes como referencia. Si lo hace, analízalas y úsalas para generar un prompt más específico y preciso.

El usuario también puede adjuntar un documento PDF. Si lo hace, su contenido aparecerá entre triple comillas ("""), precedido de [Documento adjunto: ...]. Úsalo como contexto para entender mejor lo que necesita y generar un prompt más preciso.

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

The user may also attach a PDF document. If they do, its content will appear between triple quotes ("""), preceded by [Attached document: ...]. Use it as context to better understand what they need and generate a more accurate prompt.

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
    pdfBtn: "Subir PDF (opcional)",
    pdfReady: "Documento listo",
    pdfTruncated: "Documento largo: se usará solo una parte",
    pdfInvalid: "Solo se permiten archivos PDF.",
    pdfTooBig: "El PDF debe ser menor a 10MB.",
    pdfNoText: "No pude leer texto de este PDF (puede ser un escaneo o imagen).",
    pdfError: "No pude procesar el PDF. Intenta con otro.",
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
    shareBtn: "Compartir",
    sharedLinkCopied: "✓ Link copiado",
    sharedEyebrow: "Hecho con Blue Dinosaur",
    sharedHeading: "Mira este prompt",
    sharedBody: "Alguien armó este prompt en Blue Dinosaur. Cópialo, o adáptalo a lo que tú necesitas.",
    sharedIdeaLabel: "La idea original",
    sharedPromptLabel: "El prompt que salió",
    adaptBtn: "Adaptar a lo mío →",
    tryItBtn: "Crear el mío →",
    historyBtn: "Historial",
    clearAll: "Borrar todo",
    historyEmpty: "Tus prompts generados aparecerán aquí.",
    footer: "Blue Dinosaur · Hecho para pensar mejor antes de preguntar",
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
    pdfBtn: "Upload PDF (optional)",
    pdfReady: "Document ready",
    pdfTruncated: "Long document: only part will be used",
    pdfInvalid: "Only PDF files are allowed.",
    pdfTooBig: "The PDF must be smaller than 10MB.",
    pdfNoText: "I couldn't read text from this PDF (it may be a scan or image).",
    pdfError: "I couldn't process the PDF. Try another one.",
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
    shareBtn: "Share",
    sharedLinkCopied: "✓ Link copied",
    sharedEyebrow: "Made with Blue Dinosaur",
    sharedHeading: "Check out this prompt",
    sharedBody: "Someone built this prompt in Blue Dinosaur. Copy it, or adapt it to what you need.",
    sharedIdeaLabel: "The original idea",
    sharedPromptLabel: "The prompt it produced",
    adaptBtn: "Adapt it to mine →",
    tryItBtn: "Create my own →",
    historyBtn: "History",
    clearAll: "Clear all",
    historyEmpty: "Your generated prompts will appear here.",
    footer: "Blue Dinosaur · Made to think better before you ask",
    maxImages: "Maximum 5 images allowed.",
    invalidType: "Only JPG, PNG, GIF or WebP images are allowed.",
    maxSize: "Each image must be smaller than 5MB.",
    networkError: "Network error. Please try again.",
    customOption: ["other", "write"],
  }
};

// Empaqueta la idea y el prompt en base64 seguro para URL (maneja acentos y ñ).
function encodeShare(payload) {
  try {
    const json = JSON.stringify(payload);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch (e) {
    return "";
  }
}

function decodeShare(str) {
  try {
    let b64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const json = decodeURIComponent(escape(atob(b64)));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

// Lee el parámetro ?s= de la URL actual y devuelve el payload compartido, o null.
function readShareFromURL() {
  try {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("s");
    if (!s) return null;
    return decodeShare(s);
  } catch (e) {
    return null;
  }
}

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

function track(eventName, params) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, params || {});
    }
  } catch {}
}

const MAX_IMAGES = 5;
const MAX_PDF_CHARS = 12000; // tope de texto del PDF para controlar el costo de tokens

// Brand colors matching landing page
const C = {
  bg: "#F5F3EF",
  bgCard: "#EDF2F7",
  border: "#C9D8E8",
  text: "#1A1A1A",
  textMuted: "#6B7E96",
  textLight: "#5A6E84",
  accent: "#1B4F72",
  accentLight: "#7EB8D4",
  accentSoft: "#D6EAF8",
};

export default function BlueDinosaurAI() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("bd_lang") || "en"; } catch { return "en"; }
  });
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
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [sharedData, setSharedData] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const t = UI[lang];

  const { nicho } = useParams();
  const lens = getLens(nicho, lang);

  useEffect(() => { setPromptHistory(getHistory()); }, []);

  // Al cargar, si la URL trae ?s=..., muestra la pantalla de prompt compartido.
  useEffect(() => {
    const shared = readShareFromURL();
    if (shared && shared.prompt) {
      setSharedData(shared);
      if (shared.lang) {
        setLang(shared.lang);
        try { localStorage.setItem("bd_lang", shared.lang); } catch {}
      }
      setStage("shared");
    }
  }, []);

  function toggleLang() { setLang(l => { const next = l === "es" ? "en" : "es"; try { localStorage.setItem("bd_lang", next); } catch {} return next; }); }

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
        setImages(prev => prev.length >= MAX_IMAGES ? prev : [...prev, { base64, mediaType: file.type, preview: result }]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeImage(index) { setImages(prev => prev.filter((_, i) => i !== index)); }

  async function extractPdfText(file) {
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(it => it.str).join(" ") + "\n\n";
      if (text.length > MAX_PDF_CHARS) break;
    }
    return text.trim();
  }

  async function handlePdfUpload(e) {
    const file = e.target.files?.[0];
    if (pdfInputRef.current) pdfInputRef.current.value = "";
    if (!file) return;
    setError("");
    if (file.type !== "application/pdf") { setError(t.pdfInvalid); return; }
    if (file.size > 10 * 1024 * 1024) { setError(t.pdfTooBig); return; }
    setPdfLoading(true);
    try {
      let text = await extractPdfText(file);
      if (!text) { setError(t.pdfNoText); setPdfLoading(false); return; }
      const truncated = text.length > MAX_PDF_CHARS;
      if (truncated) text = text.slice(0, MAX_PDF_CHARS);
      setPdfDoc({ name: file.name, text, truncated });
    } catch (err) {
      setError(t.pdfError);
    }
    setPdfLoading(false);
  }

  function removePdf() { setPdfDoc(null); }

  async function callClaude(messages) {
    const lensBlock = lens.lens
      ? `\n\nMODO ESPECIALIZADO ACTIVO: ${lens.label}.\nUsa lo siguiente para decidir que preguntar y como redactar el PROMPT final. Respeta SIEMPRE el formato de arriba (QUESTION/OPTION o PROMPT), sin excepciones.\n${lens.lens}`
      : "";
    const system = PROMPTS[lang] + lensBlock + "\n\nREGLA DE IDIOMA (máxima prioridad): Detecta el idioma en que el usuario escribió su idea inicial y escribe TODO (QUESTION, OPTION y el PROMPT final) en ESE idioma, sin importar el idioma de la interfaz.";
    const response = await fetch("/.netlify/functions/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, messages }),
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
      track("prompt_generado", { lens: lens.slug });
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
    if (!userInput.trim() && images.length === 0 && !pdfDoc) return;
    track("idea_enviada", { lens: lens.slug });
    const typed = userInput.trim();
    const idea = typed || (pdfDoc ? (lang === "es" ? `Prompt basado en ${pdfDoc.name}` : `Prompt based on ${pdfDoc.name}`) : "Generate a prompt based on these images");
    setOriginalIdea(idea);
    setHistoryStack([]);
    setLoading(true); setError("");
    try {
      const pdfContext = pdfDoc ? `[Documento adjunto: ${pdfDoc.name}]\n"""\n${pdfDoc.text}\n"""\n\n` : "";
      const fallback = images.length > 0
        ? "Generate a prompt based on these images"
        : (pdfDoc ? (lang === "es" ? "Genera un prompt usando el documento adjunto." : "Generate a prompt using the attached document.") : "");
      const textForModel = pdfContext + (typed || fallback);
      let userContent;
      if (images.length > 0) {
        userContent = [
          ...images.map(img => ({ type: "image", source: { type: "base64", media_type: img.mediaType, data: img.base64 } })),
          { type: "text", text: textForModel },
        ];
      } else {
        userContent = textForModel;
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
      else { setCopied(true); setTimeout(() => setCopied(false), 2000); track("prompt_copiado", { lens: lens.slug }); }
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

  // Genera el link con la idea y el prompt empaquetados, y lo copia al portapapeles.
  function handleShare() {
    const payload = { idea: originalIdea, prompt: finalPrompt, lang };
    const encoded = encodeShare(payload);
    if (!encoded) return;
    const url = `${window.location.origin}${window.location.pathname}?s=${encoded}`;
    const doCopy = () => { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2500); track("prompt_compartido", { lens: lens.slug }); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(doCopy).catch(() => fallbackCopy(url, doCopy));
      } else { fallbackCopy(url, doCopy); }
    } catch (e) { fallbackCopy(url, doCopy); }
  }

  // Quita el ?s=... de la barra de direcciones sin recargar la página.
  function clearShareURL() {
    try { window.history.replaceState({}, "", window.location.pathname); } catch (e) {}
  }

  // "Adaptar": carga la idea compartida en el input y arranca el flujo normal.
  function handleAdapt() {
    const idea = sharedData?.idea || "";
    clearShareURL();
    setSharedData(null);
    setUserInput(idea);
    setStage("input");
    setError("");
  }

  // "Crear el mío": empieza de cero, sin precargar nada.
  function handleFreshStart() {
    clearShareURL();
    setSharedData(null);
    handleReset();
  }

  function handleReset() {
    clearShareURL();
    setSharedData(null);
    setStage("input"); setUserInput(""); setHistory([]);
    setCurrentQuestion(null); setQuestionCount(0);
    setFinalPrompt(""); setError(""); setCopied(false);
    setCustomAnswer(""); setOriginalIdea("");
    setImages([]); setHistoryStack([]); setPdfDoc(null);
  }

  function clearHistory() {
    localStorage.removeItem("bluedinosauurai_history");
    setPromptHistory([]);
  }

  const progress = stage === "input" ? 0 : (stage === "final" || stage === "shared") ? 100 : questionCount * 30;
  const canSubmit = userInput.trim() || images.length > 0 || !!pdfDoc;

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
        .opt:hover { background: #1B4F72 !important; color: #fff !important; border-color: #1B4F72 !important; }
        .opt:active { transform: scale(0.99); }
        .primary:hover { background: #154060 !important; }
        .primary:active { transform: scale(0.99); }
        .ghost:hover { border-color: #1B4F72 !important; color: #1B4F72 !important; }
        .copy-btn:hover { background: #1B4F72 !important; color: #fff !important; border-color: #1B4F72 !important; }
        .back:hover { color: #1B4F72 !important; }
        .lang-btn:hover { background: #D6EAF8 !important; color: #1B4F72 !important; border-color: #C9D8E8 !important; }
        .wordmark:hover { opacity: 0.7; }
        .progress-bar { transition: width 0.6s cubic-bezier(0.16,1,0.3,1); }
        .hist-btn-active { background: #1B4F72 !important; color: #fff !important; border-color: #1B4F72 !important; }
        .hist-btn:hover { background: #D6EAF8 !important; color: #1B4F72 !important; }
        .hist-copy:hover { background: #1B4F72 !important; color: #fff !important; }
        .clear-btn:hover { color: #C0392B !important; }
        .upload-btn:hover { border-color: #1B4F72 !important; color: #1B4F72 !important; }
        .remove-img:hover { background: rgba(192,57,43,0.15) !important; color: #C0392B !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #C9D8E8; border-radius: 2px; }
      `}</style>

      <header style={s.header}>
        <div style={s.logoArea} className="wordmark" onClick={handleReset}>
          <img src="/dino.png" alt="" style={s.dinoIcon} onError={e => e.target.style.display='none'} />
          <span style={s.wordmark}>
            {lens.slug === "general" ? "Blue Dinosaur" : `Blue Dinosaur ${lens.label}`}
          </span>
        </div>
        <div style={s.headerRight}>
          <button className="lang-btn" style={s.langBtn} onClick={toggleLang}>
            {lang === "es" ? "EN" : "ES"}
          </button>
          <button
            style={{...s.historyBtn, ...(showHistory ? {background: C.accent, color: "#fff", borderColor: C.accent} : {})}}
            className={`hist-btn${showHistory ? " hist-btn-active" : ""}`}
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

          {stage === "shared" && sharedData && (
            <div className="fade-up" style={s.section}>
              <div style={s.eyebrow}>{t.sharedEyebrow}</div>
              <h2 style={{...s.heading, fontSize: 22}}>{t.sharedHeading}</h2>
              <p style={s.body}>{t.sharedBody}</p>
              {sharedData.idea && (
                <>
                  <div style={s.sharedLabel}>{t.sharedIdeaLabel}</div>
                  <div style={s.sharedIdeaBox}>"{sharedData.idea}"</div>
                </>
              )}
              <div style={s.sharedLabel}>{t.sharedPromptLabel}</div>
              <div style={s.promptBox}>
                <p style={s.promptText}>{sharedData.prompt}</p>
              </div>
              <div style={s.row}>
                <button className="copy-btn"
                  style={{...s.primary, flex: 1, background: copied ? C.accent : C.accentSoft, color: copied ? "#fff" : C.accent, border: `1.5px solid ${C.accent}`}}
                  onClick={() => handleCopy(sharedData.prompt)}>
                  {copied ? t.copiedBtn : t.copyBtn}
                </button>
                <button className="primary" style={{...s.primary, flex: 1}} onClick={handleAdapt}>{t.adaptBtn}</button>
              </div>
              <button className="ghost" style={{...s.ghost, width: "100%", marginTop: 10, textAlign: "center"}} onClick={handleFreshStart}>{t.tryItBtn}</button>
            </div>
          )}

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

              <input ref={pdfInputRef} type="file" accept="application/pdf" style={{ display: "none" }} onChange={handlePdfUpload} />
              {pdfDoc ? (
                <div style={s.pdfChip}>
                  <span style={{ fontSize: 18 }}>📄</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={s.pdfName}>{pdfDoc.name}</div>
                    <div style={s.pdfMeta}>{pdfDoc.truncated ? t.pdfTruncated : t.pdfReady}</div>
                  </div>
                  <button className="remove-img" style={s.pdfRemove} onClick={removePdf}>✕</button>
                </div>
              ) : (
                <button className="upload-btn" style={{...s.uploadBtn, marginTop: 10}} onClick={() => pdfInputRef.current?.click()} disabled={pdfLoading}>
                  {pdfLoading
                    ? <span style={{...s.spinner, borderTopColor: C.accent, borderColor: "rgba(27,79,114,0.2)"}} />
                    : <><span style={{ fontSize: 16, marginRight: 8 }}>📄</span>{t.pdfBtn}</>}
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
              {loading && <div style={s.loadingRow}><span style={{...s.spinner, borderTopColor: C.accent, borderColor: "rgba(27,79,114,0.15)"}} /></div>}
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
                <button className="copy-btn"
                  style={{...s.primary, flex: 1, background: copied ? C.accent : C.accentSoft, color: copied ? "#fff" : C.accent, border: `1.5px solid ${C.accent}`}}
                  onClick={() => handleCopy(finalPrompt)}>
                  {copied ? t.copiedBtn : t.copyBtn}
                </button>
                <button className="ghost" style={s.ghost} onClick={handleShare}>
                  {linkCopied ? t.sharedLinkCopied : t.shareBtn}
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
                  <p style={{fontSize: 13, color: C.textMuted, textAlign: "center", lineHeight: 1.6}}>{t.historyEmpty}</p>
                </div>
              ) : (
                promptHistory.map(entry => (
                  <div key={entry.id} style={s.historyCard}>
                    <div style={s.historyDate}>{entry.date}</div>
                    <div style={s.historyIdea}>"{entry.idea}"</div>
                    <div style={s.historyPrompt}>{entry.prompt}</div>
                    <button className="hist-copy"
                      style={{...s.histCopyBtn, background: copiedId === entry.id ? C.accent : "transparent", color: copiedId === entry.id ? "#fff" : C.textMuted}}
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
  root: { minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", color: C.text },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 28px", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, background: "rgba(245,243,239,0.94)", backdropFilter: "blur(12px)", zIndex: 10 },
  logoArea: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "opacity 0.15s" },
  dinoIcon: { width: 28, height: 28, objectFit: "contain" },
  wordmark: { fontSize: 16, fontWeight: 600, letterSpacing: "-0.3px", color: C.text },
  headerRight: { display: "flex", alignItems: "center", gap: 10 },
  langBtn: { fontSize: 12, fontWeight: 600, padding: "5px 10px", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s", background: "transparent", border: `1px solid ${C.border}`, color: C.textMuted, letterSpacing: "0.05em" },
  historyBtn: { fontSize: 12, fontWeight: 500, padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6, background: "transparent", border: `1px solid ${C.border}`, color: C.textMuted },
  badge: { background: C.accent, color: "#fff", fontSize: 10, fontWeight: 600, padding: "1px 5px", borderRadius: 10, lineHeight: 1.4 },
  pill: { fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", color: C.accent, background: C.accentSoft, padding: "3px 10px", borderRadius: 99, textTransform: "uppercase", border: `1px solid rgba(27,79,114,0.2)` },
  progressTrack: { height: 2, background: C.border, width: "100%" },
  progressFill: { height: "100%", background: C.accent, borderRadius: 99 },
  layout: { flex: 1, display: "flex", position: "relative" },
  main: { flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "60px 24px 40px", transition: "margin-right 0.3s" },
  section: { width: "100%", maxWidth: 480 },
  questionNav: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  eyebrow: { fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", color: C.accent, textTransform: "uppercase", marginBottom: 14, fontFamily: "'DM Mono', monospace" },
  backBtn: { fontSize: 12, color: C.textMuted, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "color 0.15s", padding: 0, fontWeight: 500 },
  heading: { fontSize: 28, fontWeight: 700, letterSpacing: "-1px", lineHeight: 1.2, color: C.text, marginBottom: 14 },
  body: { fontSize: 14, color: C.textLight, lineHeight: 1.6, marginBottom: 24, fontWeight: 300 },
  textarea: { width: "100%", background: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", color: C.text, fontSize: 14, lineHeight: 1.6, marginBottom: 16, transition: "border-color 0.2s" },
  uploadBtn: { width: "100%", padding: "12px 16px", background: "transparent", border: `1.5px dashed ${C.border}`, borderRadius: 10, color: C.textMuted, fontSize: 13, fontWeight: 400, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.15s", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" },
  imageGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 8, marginBottom: 12 },
  imageThumbnailContainer: { position: "relative", borderRadius: 8, overflow: "hidden", border: `1.5px solid ${C.border}`, aspectRatio: "1", backgroundColor: C.bgCard },
  imageThumbnail: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  removeImageBtn: { position: "absolute", top: 4, right: 4, width: 20, height: 20, background: "rgba(255,255,255,0.85)", border: "none", borderRadius: 4, fontSize: 10, color: "#888", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s", padding: 0 },
  addMoreBtn: { border: `1.5px dashed ${C.border}`, borderRadius: 8, background: "transparent", color: C.textMuted, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", aspectRatio: "1", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" },
  options: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 },
  opt: { width: "100%", padding: "14px 18px", background: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: 14, fontWeight: 400, textAlign: "left", fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.15s" },
  optMuted: { background: "transparent", border: `1.5px dashed ${C.border}`, color: C.textMuted },
  primary: { display: "block", width: "100%", padding: "13px 20px", background: C.accent, border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.15s", textAlign: "center", boxShadow: "0 4px 12px rgba(27,79,114,0.2)" },
  ghost: { padding: "13px 18px", background: "transparent", border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.textMuted, fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" },
  row: { display: "flex", gap: 8, alignItems: "center" },
  promptBox: { background: C.accentSoft, border: `1px solid rgba(27,79,114,0.2)`, borderRadius: 10, padding: "18px 20px", marginBottom: 20 },
  promptText: { fontSize: 13, color: C.accent, lineHeight: 1.75, fontFamily: "'DM Mono', monospace", whiteSpace: "pre-wrap" },
  sharedLabel: { fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: C.textMuted, textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Mono', monospace" },
  sharedIdeaBox: { fontSize: 13, color: C.textLight, fontStyle: "italic", lineHeight: 1.6, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 18 },
  error: { fontSize: 12, color: "#C0392B", marginBottom: 12, fontFamily: "'DM Mono', monospace" },
  loadingRow: { display: "flex", justifyContent: "center", paddingTop: 16 },
  spinner: { display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" },
  footer: { padding: "20px 28px", borderTop: `1px solid ${C.border}`, fontSize: 11, color: C.textMuted, textAlign: "center", letterSpacing: "0.02em", fontFamily: "'DM Mono', monospace" },
  historyPanel: { position: "fixed", top: 57, right: 0, width: 320, height: "calc(100vh - 57px)", background: "#FAFCFF", borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", zIndex: 9 },
  historyHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${C.border}` },
  historyTitle: { fontSize: 13, fontWeight: 600, color: C.text, letterSpacing: "-0.2px" },
  clearBtn: { fontSize: 11, color: C.textMuted, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "color 0.15s" },
  historyList: { flex: 1, overflowY: "auto", padding: "12px" },
  historyEmpty: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: "20px" },
  historyCard: { background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px", marginBottom: 10 },
  historyDate: { fontSize: 10, color: C.textMuted, fontFamily: "'DM Mono', monospace", marginBottom: 6, letterSpacing: "0.3px" },
  historyIdea: { fontSize: 12, color: C.textLight, lineHeight: 1.5, marginBottom: 8, fontStyle: "italic" },
  historyPrompt: { fontSize: 12, color: C.textLight, lineHeight: 1.6, fontFamily: "'DM Mono', monospace", marginBottom: 10, maxHeight: 80, overflowY: "auto", whiteSpace: "pre-wrap" },
  histCopyBtn: { fontSize: 11, fontWeight: 500, padding: "4px 10px", border: `1px solid ${C.border}`, borderRadius: 6, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" },
  pdfChip: { display: "flex", alignItems: "center", gap: 10, background: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", marginTop: 10, marginBottom: 4 },
  pdfName: { fontSize: 13, color: C.text, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  pdfMeta: { fontSize: 11, color: C.textMuted, fontFamily: "'DM Mono', monospace", marginTop: 2 },
  pdfRemove: { width: 22, height: 22, background: "rgba(0,0,0,0.05)", border: "none", borderRadius: 6, fontSize: 11, color: "#888", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s", padding: 0, flexShrink: 0 },
};
