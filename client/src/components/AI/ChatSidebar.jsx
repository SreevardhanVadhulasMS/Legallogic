import { Plus, MessageSquare, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ChatSidebar({
  chats,
  activeChatId,
  setActiveChatId,
  createNewChat,
  deleteChat,
  renameChat,
}) {
  const [hovered, setHovered] = useState(null);

  return (
    <aside style={styles.sidebar}>
      <div>
        <div style={styles.logo}>
          <span style={styles.logoPrimary}>Legal</span>
          <span style={styles.logoAccent}>Logic</span>
        </div>

        <button onClick={createNewChat} style={styles.newChat}>
          <Plus size={18} />
          New Consultation
        </button>

        <div style={styles.section}>
          <p style={styles.sectionTitle}>Recent Chats</p>

          {chats.map((chat, index) => (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              style={{
                ...styles.chatItem,

                transform:
                  hovered === index ? "translateX(4px)" : "translateX(0px)",

                borderColor:
                  activeChatId === chat.id
                    ? "#8b5cf6"
                    : hovered === index
                      ? "rgba(139,92,246,0.35)"
                      : "rgba(255,255,255,0.05)",

                background:
                  activeChatId === chat.id
                    ? "rgba(139,92,246,0.12)"
                    : "transparent",

                boxShadow:
                  hovered === index ? "0 0 18px rgba(139,92,246,0.12)" : "none",
              }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <span style={styles.chatText}>{chat.title}</span>

              <div
                style={{
                  ...styles.chatActions,
                  opacity: hovered === index ? 1 : 0,
                }}
              >
                <button
                  style={styles.iconBtn}
                  onClick={(e) => {
                    e.stopPropagation();

                    const newTitle = prompt("Rename chat", chat.title);

                    if (newTitle) {
                      renameChat(chat.id, newTitle);
                    }
                  }}
                >
                  <Pencil size={14} />
                </button>

                <button
                  style={styles.iconBtn}
                  onClick={(e) => {
                    e.stopPropagation();

                    deleteChat(chat.id);
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.bottom}>
        <MessageSquare size={18} />
        AI Legal Workspace
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
  width: "290px",
  background: "#0f172a",
  padding: "24px",

  display: "flex",
  flexDirection: "column",

  height: "100vh",

  borderRight: "1px solid rgba(255,255,255,0.05)",

  overflow: "hidden",
},

  logo: {
    fontSize: "40px",
    fontWeight: "700",
    marginBottom: "38px",
  },

  logoPrimary: {
    color: "white",
  },

  logoAccent: {
    color: "#8b5cf6",
    fontStyle: "italic",
  },

  newChat: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: "16px",
    border: "none",

    background: "linear-gradient(135deg,#8b5cf6,#7c3aed)",

    color: "white",
    fontWeight: "600",
    fontSize: "15px",

    cursor: "pointer",

    marginBottom: "30px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",

    whiteSpace: "nowrap",

    boxShadow: "0 10px 30px rgba(139,92,246,0.18)",

    transition: "0.25s ease",
  },

  section: {
  marginTop: "20px",

  flex: 1,

  overflowY: "auto",

  paddingRight: "4px",
},

  sectionTitle: {
    color: "#94a3b8",
    fontSize: "14px",
    marginBottom: "16px",
  },

  chatItem: {
    position: "relative",
    overflow: "hidden",
    padding: "14px 16px",
    borderRadius: "16px",
    marginBottom: "12px",
    color: "#e2e8f0",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.25s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },

  chatText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "block",
  },

  activeBar: {
    position: "absolute",
    left: 0,
    top: 8,
    bottom: 8,
    width: "4px",
    borderRadius: "20px",
    background: "#8b5cf6",
    boxShadow: "0 0 12px #8b5cf6",
  },

  bottom: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#94a3b8",
    paddingTop: "20px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    flexShrink: 0,
  },

  chatText: {
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  chatActions: {
    display: "flex",
    alignItems: "center",
    gap: "6px",

    opacity: 0,
    transition: "0.2s ease",
  },

  iconBtn: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
