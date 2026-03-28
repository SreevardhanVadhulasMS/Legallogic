import { jsPDF } from "jspdf";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../page/Dashboard.css";

const SvgSignOut = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const AiSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all cases from the database
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/cases", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
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

  // Handle case deletion
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to completely delete this case analysis from the server?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/cases/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
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
    
    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("LegalLogic - AI Case Summary", 20, 20);
    
    // Details Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Case ID: ${summary.caseId}`, 20, 35);
    doc.text(`Prepared: ${new Date(summary.createdAt).toLocaleDateString()}`, 120, 35);

    // Case Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(summary.title, 20, 48);

    // Status and Score
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Status: ${summary.status.toUpperCase()}`, 20, 58);
    doc.text(`Viability Score: ${summary.viabilityScore}%`, 120, 58);

    // Divider
    doc.line(20, 65, 190, 65);

    // Dynamic Keypoints
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
    <div className="ll-wrap">
      {/* NAV */}
      <nav className="ll-nav">
        <Link to="/dashboard" className="ll-logo">Legal<em>Logic</em></Link>
        <div className="ll-nav-actions">
          <Link to="/dashboard" className="ll-ghost" style={{ border: "none" }}>Dashboard</Link>
          <button className="ll-ghost" onClick={logout}>Sign out <SvgSignOut /></button>
        </div>
      </nav>

      {/* HEADER */}
      <header className="ll-intro" style={{ marginBottom: "2rem" }}>
        <p className="ll-label">AI Legal Engine</p>
        <h1 className="ll-h1">AI Case Summary</h1>
        <p className="ll-desc">Review your probability-based outcomes and dynamic legal recommendations directly from the ML engine.</p>
      </header>

      {/* TOOLS BAR */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", alignItems: "center" }}>
        <Link to="/upload-case" className="ll-cta">+ Analyze New Action</Link>
        <div style={{ flex: 1 }} />
      </div>

      {loading && <div style={{ textAlign: "center", padding: "3rem", color: "#b0b0aa" }}>Extracting your latest intelligence cases...</div>}

      {!loading && cases.length === 0 && (
         <div className="ll-panel" style={{ textAlign: "center" }}>
           <p style={{ marginBottom: "1.5rem", color: "#1a1a1a" }}>No documents analyzed yet.</p>
           <Link to="/upload-case" className="ll-cta">Start first analysis</Link>
         </div>
      )}

      {/* SUMMARIES LISTING */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", paddingBottom: "2rem" }}>
        {cases.map((summary) => (
          <div key={summary._id} className="ll-panel" style={{ padding: "2.5rem 3rem", display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: 0 }}>
            {/* CARD HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignContent: "flex-start", gap: "1rem", alignItems: "center" }}>
                <span className="ll-pill" style={{ color: "#8c7a5e", fontFamily: "JetBrains Mono, monospace", background: "#fcfaf6", border: "1px solid #f0ead9" }}>
                  {summary.caseId}
                </span>
                <span style={{ fontSize: "0.80rem", color: "#a4a4a0", letterSpacing: "0.02em" }}>
                  Prepared: {new Date(summary.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <span className="ll-pill">
                {summary.status.toUpperCase().replace("-", " ")}
              </span>
            </div>

            {/* TITLE & SCORE */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
              <h3 style={{ fontFamily: "Instrument Serif, serif", fontSize: "2rem", color: "#1a1a1a", maxWidth: "70%", lineHeight: 1.1 }}>
                {summary.title}
              </h3>
              <div style={{ textAlign: "right", borderLeft: "1px solid #e2e2de", paddingLeft: "2rem" }}>
                <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#b0b0aa", marginBottom: "0.25rem" }}>Viability Rating</div>
                <div style={{ fontFamily: "Instrument Serif, serif", fontSize: "2.5rem", color: "#1a1a1a", lineHeight: 1 }}>{summary.viabilityScore}%</div>
              </div>
            </div>

            {/* KEY POINTS */}
            <div style={{ marginTop: "1.5rem", background: "#faf9f7", padding: "1.5rem 2rem", borderRadius: "10px", border: "1px solid #ecece8" }}>
              <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#8c8c88", marginBottom: "1rem" }}>Analysis Key Points</h4>
              <ul style={{ listStyleType: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {(summary.keyPoints || []).map((point, i) => (
                  <li key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontSize: "0.95rem", lineHeight: 1.6, color: "#1a1a1a" }}>
                    <span style={{ color: "#8c7a5e" }}>—</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ACTIONS FOOTER */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <div style={{ flex: 1 }} />
              <button 
                className="ll-ghost" 
                onClick={() => handleDownloadPdf(summary)}
              >
                Export PDF
              </button>
              <Link to="/find-advisors" className="ll-cta">
                Instruct Counsel
              </Link>
              <button 
                className="ll-ghost" 
                onClick={() => handleDelete(summary._id)}
                style={{ color: "#c0392b", borderColor: "transparent" }}
              >
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
