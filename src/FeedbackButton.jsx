import { useState, useEffect, useCallback } from "react";

// Brand tokens
const NAVY = "#1B4F72";
const CREAM = "#F5F3EF";
const DINO = "#7EB8D4";
const CARD = "#EDF2F7";
const TEXT = "#1B2A3A";
const MUTED = "#6B7B8C";

// Bilingual copy (EN default, ES fallback via bd_lang)
const COPY = {
  en: {
    open: "Feedback",
    title: "Send feedback",
    subtitle: "Found a bug or have an idea? Tell us. It goes straight to the founder.",
    placeholder: "What worked, what didn't, what you'd love to see...",
    emailLabel: "Email (optional, if you want a reply)",
    emailPlaceholder: "you@email.com",
    submit: "Send",
    sending: "Sending...",
    successTitle: "Thank you!",
    successBody: "Your feedback landed. It genuinely helps.",
    error: "Something went wrong. Please try again.",
    empty: "Please write something first.",
    close: "Close",
  },
  es: {
    open: "Comentarios",
    title: "Danos tu opinión",
    subtitle: "¿Un bug o una idea? Cuéntanos. Le llega directo al fundador.",
    placeholder: "Qué funcionó, qué no, qué te encantaría ver...",
    emailLabel: "Correo (opcional, si quieres respuesta)",
    emailPlaceholder: "tu@correo.com",
    submit: "Enviar",
    sending: "Enviando...",
    successTitle: "¡Gracias!",
    successBody: "Tu comentario llegó. De verdad ayuda.",
    error: "Algo salió mal. Inténtalo de nuevo.",
    empty: "Escribe algo primero.",
    close: "Cerrar",
  },
};

const encode = (data) =>
  Object.keys(data)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k]))
    .join("&");

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [botField, setBotField] = useState(""); // honeypot
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [hoverBtn, setHoverBtn] = useState(false);
  const [hoverSend, setHoverSend] = useState(false);

  const t = COPY[lang] || COPY.en;

  // Read language on mount and whenever the modal opens
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bd_lang");
      if (saved === "es" || saved === "en") setLang(saved);
    } catch (e) {
      /* localStorage unavailable */
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const reset = useCallback(() => {
    setMessage("");
    setEmail("");
    setBotField("");
    setStatus("idle");
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    // small delay so the reset isn't visible during the close
    setTimeout(reset, 200);
  }, [reset]);

  const handleSubmit = useCallback(async () => {
    if (!message.trim()) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "feedback",
          message: message.trim(),
          email: email.trim(),
          lang,
          path: typeof window !== "undefined" ? window.location.pathname : "",
          "bot-field": botField,
        }),
      });

      if (!res.ok) throw new Error("Netlify form submission failed");

      // Optional GA event (safe if gtag isn't present)
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "feedback_submitted", { lang });
      }

      setStatus("success");
      setTimeout(closeModal, 2200);
    } catch (e) {
      setStatus("error");
    }
  }, [message, email, lang, botField, closeModal]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHoverBtn(true)}
        onMouseLeave={() => setHoverBtn(false)}
        aria-label={t.open}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9998,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 18px",
          border: "none",
          borderRadius: "999px",
          background: hoverBtn ? "#153e5b" : NAVY,
          color: CREAM,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: "15px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: hoverBtn
            ? "0 8px 24px rgba(27,79,114,0.35)"
            : "0 4px 14px rgba(27,79,114,0.25)",
          transform: hoverBtn ? "translateY(-2px)" : "translateY(0)",
          transition: "all 0.18s ease",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={CREAM}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {t.open}
      </button>

      {/* Modal */}
      {open && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(11,22,34,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{
              width: "100%",
              maxWidth: "440px",
              background: CREAM,
              borderRadius: "18px",
              boxShadow: "0 20px 60px rgba(11,22,34,0.4)",
              padding: "28px",
              fontFamily: "'DM Sans', system-ui, sans-serif",
              position: "relative",
            }}
          >
            {/* Close X */}
            <button
              onClick={closeModal}
              aria-label={t.close}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "32px",
                height: "32px",
                border: "none",
                borderRadius: "8px",
                background: "transparent",
                color: MUTED,
                fontSize: "20px",
                lineHeight: 1,
                cursor: "pointer",
              }}
            >
              ×
            </button>

            {status === "success" ? (
              <div style={{ textAlign: "center", padding: "24px 8px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    margin: "0 auto 16px",
                    borderRadius: "50%",
                    background: DINO,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={CREAM}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3
                  style={{
                    margin: "0 0 6px",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: TEXT,
                  }}
                >
                  {t.successTitle}
                </h3>
                <p style={{ margin: 0, fontSize: "15px", color: MUTED }}>
                  {t.successBody}
                </p>
              </div>
            ) : (
              <>
                <h3
                  style={{
                    margin: "0 0 6px",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: TEXT,
                  }}
                >
                  {t.title}
                </h3>
                <p
                  style={{
                    margin: "0 0 18px",
                    fontSize: "14px",
                    color: MUTED,
                    lineHeight: 1.5,
                  }}
                >
                  {t.subtitle}
                </p>

                {/* Honeypot (hidden from humans) */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={botField}
                  onChange={(e) => setBotField(e.target.value)}
                  style={{ position: "absolute", left: "-9999px", opacity: 0 }}
                  aria-hidden="true"
                />

                <textarea
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder={t.placeholder}
                  rows={4}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: `1px solid ${CARD}`,
                    background: "#fff",
                    color: TEXT,
                    fontFamily: "inherit",
                    fontSize: "15px",
                    resize: "vertical",
                    outline: "none",
                    marginBottom: "12px",
                  }}
                />

                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    color: MUTED,
                    marginBottom: "6px",
                  }}
                >
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: `1px solid ${CARD}`,
                    background: "#fff",
                    color: TEXT,
                    fontFamily: "inherit",
                    fontSize: "15px",
                    outline: "none",
                    marginBottom: "16px",
                  }}
                />

                {status === "error" && (
                  <p
                    style={{
                      margin: "0 0 12px",
                      fontSize: "13px",
                      color: "#C0392B",
                    }}
                  >
                    {message.trim() ? t.error : t.empty}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  onMouseEnter={() => setHoverSend(true)}
                  onMouseLeave={() => setHoverSend(false)}
                  disabled={status === "sending"}
                  style={{
                    width: "100%",
                    padding: "13px",
                    border: "none",
                    borderRadius: "12px",
                    background:
                      status === "sending"
                        ? "#7d94a6"
                        : hoverSend
                        ? "#153e5b"
                        : NAVY,
                    color: CREAM,
                    fontFamily: "inherit",
                    fontSize: "15px",
                    fontWeight: 600,
                    cursor: status === "sending" ? "default" : "pointer",
                    transition: "background 0.18s ease",
                  }}
                >
                  {status === "sending" ? t.sending : t.submit}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
