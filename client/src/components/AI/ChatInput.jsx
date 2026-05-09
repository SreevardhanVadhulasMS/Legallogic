import { SendHorizonal } from "lucide-react";
import { useState, useRef } from "react";

export default function ChatInput({
  onSend,
  hasMessages,
  suggestions,
  loading,
}) {
  const [message, setMessage] = useState("");

  const inputRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);

    try {
      const currentMessage = message;
      setMessage("");
      if (inputRef.current) {
        inputRef.current.style.height = "56px";
        inputRef.current.style.overflowY = "hidden";
      }
      await onSend(currentMessage);
      
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsSending(false);
      }, 1000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!isSending) {
        handleSubmit();
      }
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* INPUT */}
      <div
        onClick={() => inputRef.current.focus()}
        style={styles.inputContainer}
      >
        {" "}
        <div style={styles.inputGlow}></div>
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          rows={1}
          placeholder="Describe your legal issue..."
          style={styles.input}
          onInput={(e) => {
            e.target.style.height = "auto";
            const newHeight = Math.min(e.target.scrollHeight, 180);
            e.target.style.height = `${newHeight}px`;
            e.target.style.overflowY =
              e.target.scrollHeight > 180 ? "auto" : "hidden";
          }}
        />
        <button
          disabled={isSending || loading}
          onClick={(e) => {
            e.stopPropagation();
            handleSubmit();
          }}
          style={styles.button}
        >
          <div style={styles.buttonGlow}></div>

          <SendHorizonal size={18} color="white" />
        </button>
      </div>

      {/* SUGGESTIONS */}
      {!hasMessages && (
        <div style={styles.suggestions}>
          {suggestions.map((item) => (
            <button
              key={item}
              onClick={async () => {
                if (sending) return;
                setSending(true);
                await onSend(item);
                setSending(false);
              }}
              style={styles.suggestionButton}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    maxWidth: "850px",
  },

  inputContainer: {
    width: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px 18px",
    borderRadius: "28px",
    background: "rgba(15,23,42,0.42)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.05)",
    boxShadow: "0 8px 40px rgba(0,0,0,0.32)",
    overflow: "hidden",
    cursor: "text",
  },

  inputGlow: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to right, rgba(139,92,246,0.10), transparent 30%, transparent 70%, rgba(139,92,246,0.08))",
    pointerEvents: "none",
  },

  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "white",
    fontSize: "15px",
    position: "relative",
    zIndex: 2,
    letterSpacing: "-0.01em",
    minHeight: "24px",
    resize: "none",
    maxHeight: "180px",
    overflowY: "hidden",
    paddingTop: "0px",
    fontFamily: "inherit",
    lineHeight: "1.5",
    display: "block",
    width: "100%",
  },

  button: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "none",
    position: "relative",
    background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    overflow: "hidden",
    boxShadow: "0 0 30px rgba(139,92,246,0.35)",
  },

  buttonGlow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)",
    top: 0,
    left: 0,
  },

  suggestions: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: "22px",
  },

  suggestionButton: {
    padding: "11px 18px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(17,24,39,0.55)",
    color: "#cbd5e1",
    cursor: "pointer",
    fontSize: "14px",
    backdropFilter: "blur(12px)",
    transition: "all 0.25s ease",
    boxShadow: "0 4px 20px rgba(0,0,0,0.16)",
  },
};
