import ReactMarkdown from "react-markdown";

export default function MessageBubble({ message }) {
  const isUser = message.sender === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "22px",
      }}
    >
      <div
        className="message-content"
        style={{
          maxWidth: "78%",
          padding: "20px 24px",
          borderRadius: "24px",
          lineHeight: "1.8",

          background: isUser
            ? "linear-gradient(135deg,#8b5cf6,#a855f7)"
            : "rgba(255,255,255,0.03)",

          color: "white",

          boxShadow: isUser
            ? "0 0 30px rgba(139,92,246,0.35)"
            : "none",

          border: isUser
            ? "none"
            : "1px solid rgba(255,255,255,0.06)",

          backdropFilter: "blur(12px)",
        }}
      >
        <ReactMarkdown>
          {message.text}
        </ReactMarkdown>
      </div>
    </div>
  );
}