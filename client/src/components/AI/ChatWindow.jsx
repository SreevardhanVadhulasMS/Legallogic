import ReactMarkdown from "react-markdown";
import TypingIndicator from "./TypingIndicator";
import ScrollToBottom from "./ScrollToBottom";

export default function ChatWindow({ messages = [], loading }) {
  return (
    <ScrollToBottom dependency={messages}>
      <div style={styles.wrapper}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={msg.role === "user" ? styles.userRow : styles.aiRow}
          >
            <div
              style={msg.role === "user" ? styles.userBubble : styles.aiBubble}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {loading && <TypingIndicator />}
      </div>
    </ScrollToBottom>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    maxWidth: "920px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "38px",
  },

  userRow: {
    display: "flex",
    justifyContent: "flex-end",
  },

  aiRow: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },

  userBubble: {
    maxWidth: "75%",
    padding: "24px 28px",
    borderRadius: "28px",
    background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    color: "white",
    lineHeight: "1.9",
    fontSize: "16px",
    boxShadow: "0 10px 40px rgba(139,92,246,0.22)",
  },

  aiBubble: {
    maxWidth: "850px",
    width: "100%",
    color: "#e2e8f0",
    lineHeight: "2",
    fontSize: "17px",
    paddingLeft: "8px",
    animation: "fadeIn 0.4s ease",
  },
};
