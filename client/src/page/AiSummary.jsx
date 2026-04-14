import { jsPDF } from "jspdf";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const SvgSignOut = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

/* ─── inline styles (no external CSS dependency) ─── */
const styles = {
  /* layout */
  wrap: {
    minHeight: "100vh",
    background: "#f4f3fb",
    fontFamily: "'Inter', sans-serif",
  },

  /* nav */
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 3rem",
    height: "64px",
    background: "#ffffff",
    borderBottom: "1px solid #e8e6f9",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: "1.25rem",
    color: "#1a1a2e",
    textDecoration: "none",
    letterSpacing: "-0.02em",
  },
  logoEm: {
    color: "#6c47ff",
    fontStyle: "normal",
  },
  navActions: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
  },
  ghostBtn: {
    background: "transparent",
    border: "1px solid #d4cff5",
    borderRadius: "8px",
    padding: "0.45rem 1rem",
    fontSize: "0.875rem",
    color: "#4a3fa0",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    textDecoration: "none",
    transition: "background 0.15s",
  },

  /* header */
  header: {
    maxWidth: "860px",
    margin: "0 auto",
    padding: "3rem 2rem 1.5rem",
    textAlign: "center",
  },
  label: {
    display: "inline-block",
    background: "#eeedfe",
    color: "#6c47ff",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "0.3rem 1rem",
    borderRadius: "999px",
    marginBottom: "1rem",
    border: "1px solid #d4cff5",
  },
  h1: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 800,
    fontSize: "2.4rem",
    color: "#1a1a2e",
    margin: "0 0 0.75rem",
    letterSpacing: "-0.03em",
    lineHeight: 1.15,
  },
  h1Em: {
    color: "#6c47ff",
    fontStyle: "italic",
  },
  desc: {
    color: "#6e6a9a",
    fontSize: "1rem",
    lineHeight: 1.7,
    maxWidth: "600px",
    margin: "0 auto",
  },

  /* toolbar */
  toolbar: {
    maxWidth: "860px",
    margin: "0 auto 1.5rem",
    padding: "0 2rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  ctaBtn: {
    background: "#6c47ff",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "0.55rem 1.25rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    transition: "background 0.15s",
  },

  /* list container */
  list: {
    maxWidth: "860px",
    margin: "0 auto",
    padding: "0 2rem 3rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },

  /* card */
  card: {
    background: "#ffffff",
    border: "1px solid #e8e6f9",
    borderRadius: "14px",
    padding: "2rem 2.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },

  /* pill / badge */
  pill: {
    display: "inline-flex",
    alignItems: "center",
    background: "#eeedfe",
    color: "#4a3fa0",
    border: "1px solid #d4cff5",
    borderRadius: "999px",
    padding: "0.25rem 0.85rem",
    fontSize: "0.78rem",
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  pillMono: {
    display: "inline-flex",
    alignItems: "center",
    background: "#f4f3fb",
    color: "#6c47ff",
    border: "1px solid #e2dff8",
    borderRadius: "999px",
    padding: "0.25rem 0.85rem",
    fontSize: "0.78rem",
    fontFamily: "'JetBrains Mono', monospace",
    whiteSpace: "nowrap",
  },

  /* viability score */
  scoreWrap: {
    textAlign: "right",
    borderLeft: "1px solid #e8e6f9",
    paddingLeft: "2rem",
    flexShrink: 0,
  },
  scoreLabel: {
    fontSize: "0.72rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#a09cc0",
    marginBottom: "0.25rem",
  },
  scoreValue: {
    fontWeight: 800,
    fontSize: "2.5rem",
    color: "#6c47ff",
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
  },

  /* key points box */
  kpBox: {
    background: "#f9f8fe",
    border: "1px solid #e8e6f9",
    borderRadius: "10px",
    padding: "1.25rem 1.75rem",
  },
  kpHeading: {
    fontSize: "0.72rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#a09cc0",
    marginBottom: "0.85rem",
    fontWeight: 600,
  },
  kpList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.65rem",
  },
  kpItem: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "flex-start",
    fontSize: "0.92rem",
    lineHeight: 1.6,
    color: "#1a1a2e",
  },
  kpDash: { color: "#6c47ff", fontWeight: 700, flexShrink: 0 },

  /* card footer */
  footer: {
    display: "flex",
    gap: "0.65rem",
    alignItems: "center",
    marginTop: "0.25rem",
  },
  dangerBtn: {
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    padding: "0.45rem 0.85rem",
    fontSize: "0.875rem",
    color: "#c0392b",
    cursor: "pointer",
    transition: "background 0.15s",
  },

  /* states */
  stateBox: {
    textAlign: "center",
    padding: "3rem 2rem",
    background: "#ffffff",
    border: "1px solid #e8e6f9",
    borderRadius: "14px",
    color: "#6e6a9a",
    maxWidth: "860px",
    margin: "0 auto 1rem",
  },
};

const AiSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }

        const response = await fetch("http://localhost:5000/api/cases", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setCases(data);
        } else {
          console.error("Failed to fetch cases");
        }
      } catch (error) {
        console.error("Error fetching cases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [navigate]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to completely delete this case analysis from the server?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/cases/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setCases(prev => prev.filter(c => c._id !== id));
      } else {
        alert("Failed to delete the case.");
      }
    } catch (error) {
      console.error("Error deleting case:", error);
      alert("Error deleting case.");
    }
  };

  const handleDownloadPdf = (summary) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("LegalLogic - AI Case Summary", 20, 20);

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Case ID: ${summary.caseId}`, 20, 35);
    doc.text(`Prepared: ${new Date(summary.createdAt).toLocaleDateString()}`, 120, 35);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(summary.title, 20, 48);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Status: ${summary.status.toUpperCase()}`, 20, 58);
    doc.text(`Viability Score: ${summary.viabilityScore}%`, 120, 58);

    doc.line(20, 65, 190, 65);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Analysis Details:", 20, 75);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    let yPos = 85;
    (summary.keyPoints || []).forEach(point => {
      const lines = doc.splitTextToSize(`• ${point}`, 170);
      doc.text(lines, 20, yPos);
      yPos += (10 * lines.length);
    });

    doc.save(`${summary.caseId}_LegalLogic.pdf`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.wrap}>

      {/* ── NAV ── */}
      <nav style={styles.nav}>
        <Link to="/dashboard" style={styles.logo}>
          Legal<span style={styles.logoEm}>Logic</span>
        </Link>
        <div style={styles.navActions}>
          <Link to="/dashboard" style={styles.ghostBtn}>Dashboard</Link>
          <button style={styles.ghostBtn} onClick={logout}>
            Sign out <SvgSignOut />
          </button>
        </div>
      </nav>

      {/* ── HEADER ── */}
      <header style={styles.header}>
        <p style={styles.label}>AI Legal Engine</p>
        <h1 style={styles.h1}>
          AI Case <span style={styles.h1Em}>Summary</span>
        </h1>
        <p style={styles.desc}>
          Review your probability-based outcomes and dynamic legal recommendations directly from the ML engine.
        </p>
      </header>

      {/* ── TOOLBAR ── */}
      <div style={styles.toolbar}>
        <Link to="/upload-case" style={styles.ctaBtn}>+ Analyze New Action</Link>
        <div style={{ flex: 1 }} />
      </div>

      {/* ── LOADING ── */}
      {loading && (
        <div style={{ ...styles.stateBox, border: "none", background: "transparent" }}>
          Extracting your latest intelligence cases…
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {!loading && cases.length === 0 && (
        <div style={styles.stateBox}>
          <p style={{ marginBottom: "1.5rem" }}>No documents analyzed yet.</p>
          <Link to="/upload-case" style={styles.ctaBtn}>Start first analysis</Link>
        </div>
      )}

      {/* ── CASE CARDS ── */}
      <div style={styles.list}>
        {cases.map((summary) => (
          <div key={summary._id} style={styles.card}>

            {/* card header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={styles.pillMono}>{summary.caseId}</span>
                <span style={{ fontSize: "0.80rem", color: "#a09cc0", letterSpacing: "0.02em" }}>
                  Prepared: {new Date(summary.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span style={styles.pill}>
                {summary.status.toUpperCase().replace("-", " ")}
              </span>
            </div>

            {/* title + score */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1.5rem", marginTop: "0.25rem" }}>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#1a1a2e", maxWidth: "70%", lineHeight: 1.2, letterSpacing: "-0.02em", margin: 0 }}>
                {summary.title}
              </h3>
              <div style={styles.scoreWrap}>
                <div style={styles.scoreLabel}>Viability Rating</div>
                <div style={styles.scoreValue}>{summary.viabilityScore}%</div>
              </div>
            </div>

            {/* key points */}
            <div style={styles.kpBox}>
              <h4 style={styles.kpHeading}>Analysis Key Points</h4>
              <ul style={styles.kpList}>
                {(summary.keyPoints || []).map((point, i) => (
                  <li key={i} style={styles.kpItem}>
                    <span style={styles.kpDash}>—</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* footer actions */}
            <div style={styles.footer}>
              <div style={{ flex: 1 }} />
              <button style={styles.ghostBtn} onClick={() => handleDownloadPdf(summary)}>
                Export PDF
              </button>
              <Link to="/find-advisors" style={styles.ctaBtn}>
                Instruct Counsel
              </Link>
              <button style={styles.dangerBtn} onClick={() => handleDelete(summary._id)}>
                Drop Case
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default AiSummary;