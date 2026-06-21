import { useState } from "react";

const SYSTEM_PROMPT = `You are an expert in prompt engineering. You help users clarify what they want to ask an LLM.

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
- Do NOT write anything outside this format
- Do NOT use markdown, JSON, or explanations`;

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

export default function Lucid() {
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
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { throw new Error("Network error. Please try again."); }
    if (!response.ok) throw new Error(data.error?.message || `Error ${response.status}`);
    const raw = data.content.map(b => b.text || "").join("");
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
    setLoading(true); setError("");
    try {
      const msgs = [{ role: "user", content: userInput.trim() }];
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

  function handleCopy() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(finalPrompt).then(() => {
          setCopied(true); setTimeout(() => setCopied(false), 2000);
        }).catch(() => fallbackCopy());
      } else { fallbackCopy(); }
    } catch(e) { fallbackCopy(); }
  }

  function fallbackCopy() {
    const el = document.createElement("textarea");
    el.value = finalPrompt;
    el.style.position = "fixed"; el.style.opacity = "0";
    document.body.appendChild(el); el.focus(); el.select();
    document.execCommand("copy"); document.body.removeChild(el);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  function handleReset() {
    setStage("input"); setUserInput(""); setHistory([]);
    setCurrentQuestion(null); setQuestionCount(0);
    setFinalPrompt(""); setError(""); setCopied(false); setCustomAnswer("");
  }

  const progress = stage === "input" ? 0 : stage === "final" ? 100 : questionCount * 30;

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F5F3EF; }
        textarea { font-family: 'DM Mono', monospace; resize: none; }
        textarea:focus { outline: none; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
        .opt:hover { background: #1A1A1A !important; color: #F5F3EF !important; }
        .opt:active { transform: scale(0.99); }
        .primary:hover { background: #2A2A2A !important; }
        .primary:active { transform: scale(0.99); }
        .ghost:hover { border-color: #1A1A1A !important; color: #1A1A1A !important; }
        .copy:hover { background: #1A1A1A !important; color: #F5F3EF !important; }
        .progress-bar { transition: width 0.6s cubic-bezier(0.16,1,0.3,1); }
      `}</style>

      <header style={s.header}>
        <div style={s.wordmark}>Lucid</div>
        <div style={s.headerRight}>
          <span style={s.pill}>Beta</span>
        </div>
      </header>

      <div style={s.progressTrack}>
        <div className="progress-bar" style={{...s.progressFill, width: `${progress}%`}} />
      </div>

      <main style={s.main}>

        {stage === "input" && (
          <div className="fade-up" style={s.section}>
            <div style={s.eyebrow}>Turn vague ideas into precise prompts</div>
            <h1 style={s.heading}>Describe the result<br/>you want to achieve</h1>
            <p style={s.body}>Bring your idea. We'll give you the perfect prompt in 60 seconds.</p>
            <textarea
              style={s.textarea}
              placeholder="Write your idea here, even if it's incomplete..."
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              rows={4}
              autoFocus
            />
            {error && <p style={s.error}>{error}</p>}
            <button
              className="primary"
              style={{...s.primary, opacity: loading || !userInput.trim() ? 0.4 : 1}}
              onClick={handleSubmitInput}
              disabled={loading || !userInput.trim()}
            >
              {loading ? <span style={s.spinner} /> : "Analyze →"}
            </button>
          </div>
        )}

        {stage === "questioning" && currentQuestion && (
          <div className="fade-up" style={s.section}>
            <div style={s.eyebrow}>Question {questionCount}</div>
            <h2 style={s.heading}>{currentQuestion.question}</h2>
            <div style={s.options}>
              {currentQuestion.options?.map((opt, i) => {
                const isCustom = opt.toLowerCase().includes("other") || opt.toLowerCase().includes("write");
                return (
                  <button
                    key={i}
                    className="opt"
                    style={{...s.opt, ...(isCustom ? s.optMuted : {})}}
                    onClick={() => isCustom ? handleAnswer("__custom__") : handleAnswer(opt)}
                    disabled={loading}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {loading && <div style={s.loadingRow}><span style={s.spinner} /></div>}
            {error && <p style={s.error}>{error}</p>}
          </div>
        )}

        {stage === "custom" && (
          <div className="fade-up" style={s.section}>
            <div style={s.eyebrow}>Your answer</div>
            <h2 style={s.heading}>{currentQuestion?.question}</h2>
            <textarea
              style={s.textarea}
              placeholder="Write your answer here..."
              value={customAnswer}
              onChange={e => setCustomAnswer(e.target.value)}
              rows={3}
              autoFocus
            />
            {error && <p style={s.error}>{error}</p>}
            <div style={s.row}>
              <button className="ghost" style={s.ghost} onClick={() => setStage("questioning")}>← Back</button>
              <button
                className="primary"
                style={{...s.primary, flex: 1, opacity: loading || !customAnswer.trim() ? 0.4 : 1}}
                onClick={handleCustomAnswer}
                disabled={loading || !customAnswer.trim()}
              >
                {loading ? <span style={s.spinner} /> : "Continue →"}
              </button>
            </div>
          </div>
        )}

        {stage === "final" && (
          <div className="fade-up" style={s.section}>
            <div style={s.eyebrow}>Your prompt is ready</div>
            <h2 style={{...s.heading, fontSize: 22}}>Ready to use</h2>
            <p style={s.body}>Copy and paste it into Claude, ChatGPT or Gemini.</p>
            <div style={s.promptBox}>
              <p style={s.promptText}>{finalPrompt}</p>
            </div>
            <div style={s.row}>
              <button className="ghost" style={s.ghost} onClick={handleReset}>← New</button>
              <button
                className="copy"
                style={{...s.primary, flex: 1, background: copied ? "#1A1A1A" : "#F5F3EF", color: copied ? "#F5F3EF" : "#1A1A1A", border: "1.5px solid #1A1A1A"}}
                onClick={handleCopy}
              >
                {copied ? "✓ Copied" : "Copy prompt"}
              </button>
            </div>
          </div>
        )}

      </main>

      <footer style={s.footer}>
        <span>Lucid · Made to think better before you ask</span>
      </footer>
    </div>
  );
}

const s = {
  root: { minHeight: "100vh", background: "#F5F3EF", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", color: "#1A1A1A" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px", borderBottom: "1px solid #E8E4DC" },
  wordmark: { fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", color: "#1A1A1A" },
  headerRight: { display: "flex", alignItems: "center", gap: 12 },
  pill: { fontSize: 11, fontWeight: 500, letterSpacing: "0.06em", color: "#888", background: "#ECEAE4", padding: "3px 10px", borderRadius: 99, textTransform: "uppercase" },
  progressTrack: { height: 2, background: "#E8E4DC", width: "100%" },
  progressFill: { height: "100%", background: "#1A1A1A", borderRadius: 99 },
  main: { flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "60px 24px 40px" },
  section: { width: "100%", maxWidth: 480 },
  eyebrow: { fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", color: "#999", textTransform: "uppercase", marginBottom: 14 },
  heading: { fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.2, color: "#1A1A1A", marginBottom: 14 },
  body: { fontSize: 14, color: "#777", lineHeight: 1.6, marginBottom: 24, fontWeight: 400 },
  textarea: { width: "100%", background: "#ECEAE4", border: "1.5px solid transparent", borderRadius: 10, padding: "14px 16px", color: "#1A1A1A", fontSize: 14, lineHeight: 1.6, marginBottom: 16, transition: "border-color 0.2s" },
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
};
