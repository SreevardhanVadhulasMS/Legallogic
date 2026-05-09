import { useEffect, useRef, useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

export default function AIChatLayout() {
  const [chats, setChats] = useState([
    {
      id: 1,
      title: "New Consultation",
      messages: [],
    },
  ]);

  const [activeChatId, setActiveChatId] = useState(1);

  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  useEffect(() => {
    const savedChats = localStorage.getItem("legalChats");

    const savedActiveChatId = localStorage.getItem("activeLegalChatId");

    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);

      setChats(parsedChats);

      if (savedActiveChatId) {
        setActiveChatId(Number(savedActiveChatId));
      } else if (parsedChats.length > 0) {
        setActiveChatId(parsedChats[0].id);
      }
    }
  }, []);

  const suggestions = [
    "Investment fraud complaint",
    "Cyber crime FIR help",
    "Property dispute guidance",
  ];

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeChat?.messages, loading]);

  useEffect(() => {
    localStorage.setItem("legalChats", JSON.stringify(chats));

    localStorage.setItem("activeLegalChatId", activeChatId);
  }, [chats, activeChatId]);

  const createNewChat = () => {
    const emptyChatExists = chats.some((chat) => chat.messages.length === 0);

    if (emptyChatExists) {
      const existingEmptyChat = chats.find(
        (chat) => chat.messages.length === 0,
      );

      setActiveChatId(existingEmptyChat.id);
      return;
    }

    const newChat = {
      id: Date.now(),
      title: "New Consultation",
      messages: [],
    };

    setChats((prev) => [newChat, ...prev]);

    setActiveChatId(newChat.id);
  };

  const updateChatMessages = (messages) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages,
            }
          : chat,
      ),
    );
  };

  const updateChatTitle = (text) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId && chat.title === "New Consultation"
          ? {
              ...chat,
              title: text.length > 28 ? text.slice(0, 28) + "..." : text,
            }
          : chat,
      ),
    );
  };
  const deleteChat = (id) => {
    const filtered = chats.filter((chat) => chat.id !== id);

    setChats(filtered);

    if (activeChatId === id && filtered.length > 0) {
      setActiveChatId(filtered[0].id);
    }
  };

  const renameChat = (id, title) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id
          ? {
              ...chat,
              title,
            }
          : chat,
      ),
    );
  };

  const handleSend = async (text) => {
    if (!text.trim()) return;

    updateChatTitle(text);

    const userMessage = {
      role: "user",
      content: text,
    };

    const updatedMessages = [...activeChat.messages, userMessage];

    updateChatMessages(updatedMessages);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await response.json();

      const aiMessage = {
        role: "assistant",
        content: data.reply || "Legal AI could not generate response.",
      };

      const finalMessages = [...updatedMessages, aiMessage];

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: finalMessages,

                insights: {
                  category: "Cyber Fraud",
                  viability: "82%",
                  evidence: "Strong",
                  urgency: "High",

                  summary:
                    "Possible cyber impersonation and identity misuse case with strong evidence and high urgency.",
                },
              }
            : chat,
        ),
      );
    } catch (error) {
      console.error(error);

      updateChatMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Something went wrong processing request.",
        },
      ]);
    }

    setLoading(false);
  };

  const latestMessage =
    activeChat?.messages?.findLast((msg) => msg.role === "assistant")
      ?.content || "";

  const getCaseType = () => {
    const text = latestMessage.toLowerCase();

    if (
      text.includes("fraud") ||
      text.includes("scam") ||
      text.includes("cyber")
    ) {
      return {
        type: "Cyber Fraud",
        viability: "82%",
        evidence: "Strong",
        urgency: "High",
      };
    } else if (
      text.includes("property") ||
      text.includes("civil") ||
      text.includes("apartment") ||
      text.includes("partition")
    ) {
      return {
        type: "Civil Dispute",
        viability: "78%",
        evidence: "Moderate",
        urgency: "Medium",
      };
    } else if (text.includes("harassment") || text.includes("abuse")) {
      return {
        type: "Harassment Case",
        viability: "85%",
        evidence: "Strong",
        urgency: "High",
      };
    }

    return {
      type: "General Case",
      viability: "72%",
      evidence: "Moderate",
      urgency: "Medium",
    };
  };

  const insight = getCaseType();
  const cleanedSummary = latestMessage
    ?.replace(/[#*]/g, "")
    ?.replace(/\n/g, " ")
    ?.split(". ")
    ?.slice(0, 2)
    ?.join(". ");

  return (
    <div style={styles.page}>
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        createNewChat={createNewChat}
        deleteChat={deleteChat}
        renameChat={renameChat}
      />

      <div style={styles.main}>
        {activeChat.messages.length > 0 && (
          <div style={styles.topHeader}>
            <h1 style={styles.topTitle}>AI Legal Consultation</h1>

            <p style={styles.topSubtitle}>Secure AI-powered legal assistance</p>
          </div>
        )}

        <div style={styles.chatArea}>
          <ChatWindow messages={activeChat.messages} loading={loading} />

          <div ref={bottomRef}></div>
        </div>

        {activeChat.messages.length === 0 && (
          <div style={styles.hero}>
            <h1 style={styles.heroTitle}>AI Legal Consultation</h1>

            <p style={styles.heroSubtitle}>
              Legal intelligence for the modern world.
            </p>

            <p style={styles.heroSmall}>Secure AI-powered legal assistance</p>
          </div>
        )}

        <div style={styles.inputArea}>
          <ChatInput
            onSend={handleSend}
            hasMessages={activeChat.messages.length > 0}
            suggestions={suggestions}
          />
        </div>
      </div>

      <div style={styles.insightCard}>
        <p style={styles.insightLabel}>AI Insight</p>

        <h2 style={styles.caseTitle}>
          {activeChat?.insights?.category || insight.type}
        </h2>

        <div style={styles.stat}>
          <span>Viability</span>

          <span>{activeChat?.insights?.viability || insight.viability}</span>
        </div>

        <div style={styles.stat}>
          <span>Evidence Strength</span>

          <span>{activeChat?.insights?.evidence || insight.evidence}</span>
        </div>

        <div style={styles.stat}>
          <span>Urgency</span>

          <span>{activeChat?.insights?.urgency || insight.urgency}</span>
        </div>

        <div style={styles.aiSummary}>
          <p style={styles.aiSummaryTitle}>Case Summary</p>

          <p style={styles.aiSummaryText}>
            {cleanedSummary
              ? cleanedSummary + "."
              : "AI-generated legal summary will appear here."}
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    height: "100vh",
    background: "#020617",
    overflow: "hidden",
  },

  main: {
    flex: 1,
    overflowY: "auto",
    scrollBehavior: "smooth",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    height: "100vh",
  },

  topHeader: {
    padding: "26px 40px 10px",
    flexShrink: 0,
  },

  topTitle: {
    color: "white",
    fontSize: "26px",
    fontWeight: "700",
  },

  topSubtitle: {
    color: "#94a3b8",
    marginTop: "6px",
  },

  hero: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    paddingBottom: "160px",
  },

  heroTitle: {
    fontSize: "82px",
    fontWeight: "700",
    letterSpacing: "-0.05em",
    background: "linear-gradient(to right, white, #c4b5fd)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  heroSubtitle: {
    marginTop: "18px",
    fontSize: "34px",
    color: "#e2e8f0",
  },

  heroSmall: {
    marginTop: "14px",
    fontSize: "20px",
    color: "#64748b",
  },

  chatArea: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 40px 180px",
  },

  inputArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "24px 40px 34px",
    background: "linear-gradient(to top, #020617 72%, transparent)",
    display: "flex",
    justifyContent: "center",
  },

  rightPanel: {
    width: "260px",
    padding: "24px",
    borderLeft: "1px solid rgba(255,255,255,0.05)",
    background: "#020817",
  },

  online: {
    color: "#22c55e",
    marginBottom: "24px",
  },

  card: {
    background:
      "linear-gradient(to bottom, rgba(15,23,42,0.9), rgba(2,6,23,0.95))",
    borderRadius: "24px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.05)",
  },

  cardMini: {
    color: "#a78bfa",
    marginBottom: "18px",
  },

  cardTitle: {
    color: "white",
    marginBottom: "30px",
  },

  metric: {
    display: "flex",
    justifyContent: "space-between",
    color: "#e2e8f0",
    padding: "16px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },

  aiSummary: {
    marginTop: "28px",
    padding: "18px",
    borderRadius: "18px",

    background:
      "linear-gradient(to bottom right, rgba(15,23,42,0.72), rgba(30,41,59,0.38))",

    border: "1px solid rgba(139,92,246,0.08)",

    boxShadow: "0 0 24px rgba(139,92,246,0.08)",
  },

  aiSummaryTitle: {
    color: "#a78bfa",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "12px",
  },

  aiSummaryText: {
    color: "#e2e8f0",
    fontSize: "14px",
    lineHeight: "1.9",

    textAlign: "left",

    opacity: 0.92,
  },

  insightCard: {
    width: "300px",
    padding: "24px",
    borderLeft: "1px solid rgba(255,255,255,0.06)",
    background: "#020617",

    display: "flex",
    flexDirection: "column",
    backdropFilter: "blur(16px)",
  },

  insightLabel: {
    color: "#8b5cf6",
    fontSize: "14px",
    marginBottom: "14px",
  },

  caseTitle: {
    color: "white",
    fontSize: "38px",
    fontWeight: "700",
    lineHeight: "1.1",
    marginBottom: "26px",
  },

  stat: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",

    color: "#e2e8f0",
  },
};
