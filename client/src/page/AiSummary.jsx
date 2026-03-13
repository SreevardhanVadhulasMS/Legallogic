import { Link, useNavigate } from "react-router-dom";
import "../page/Dashboard.css";  // Reuse styles

const AiSummary = () => {
  const navigate = useNavigate();

  const summaries = [
    {
      id: "#CASE-001",
      title: "Contract Dispute - Co-founder Equity Vesting",
      date: "2 hours ago",
      viability: 78,
      keyPoints: ["Strong breach claim (87%)", "Supporting docs complete", "Precedents favorable", "Recommend legal notice"],
      status: "ready"
    },
    {
      id: "#CASE-002", 
      title: "Employment Termination - Wrongful Dismissal",
      date: "1 day ago",
      viability: 62,
      keyPoints: ["Moderate case strength", "Need termination letter", "Witness statements pending", "Gather more evidence"],
      status: "needs-more"
    },
    {
      id: "#CASE-003",
      title: "Property Dispute - Rental Agreement Breach",
      date: "3 days ago", 
      viability: 89,
      keyPoints: ["Excellent case viability", "Clear lease violation", "Security deposit recoverable", "File in consumer court"],
      status: "strong"
    }
  ];

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <header className="dashboard-header">
        <div style={{display: 'flex', flex: 1, alignItems: 'center', gap: '1.5rem'}}>
          <Link to="/dashboard" className="brand" style={{margin: 0}}>
            <div className="brand-mark">LL</div>
            <span className="brand-name">
              Legal<strong>Logic</strong> - AI Case Summary
            </span>
          </Link>
          
        </div>
        <button className="logout-btn" onClick={logout}>Logout →</button>
      </header>

      {/* Stats Header */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: "2rem" }}>
        <div className="dashboard-card">
          <div className="dashboard-card-icon">📊</div>
          <h3 style={{ fontSize: "1.3rem" }}>3 Cases</h3>
          <p>Analyzed this month</p>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-icon">⭐</div>
          <h3 style={{ fontSize: "1.3rem" }}>82%</h3>
          <p>Avg viability score</p>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-icon">⚡</div>
          <h3 style={{ fontSize: "1.3rem" }}>12 min</h3>
          <p>Avg analysis time</p>
        </div>
      </div>

      {/* Summaries Grid */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr)", gap: "1.5rem" }}>
        {summaries.map((summary, index) => (
          <div key={summary.id} className="dashboard-card" style={{ padding: "2.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <span style={{ 
                  fontFamily: "'JetBrains Mono', monospace", 
                  fontSize: "0.85rem", 
                  color: "var(--gold)",
                  background: "color-mix(in srgb, var(--gold) 8%, transparent)",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "20px",
                  border: "1px solid var(--gold-dim)"
                }}>
                  {summary.id}
                </span>
              </div>
              <div className={`status-badge status-${summary.status}`}>
                {summary.status === "ready" && "✅ Ready"}
                {summary.status === "needs-more" && "⚠️ Needs More"}
                {summary.status === "strong" && "🚀 Strong Case"}
              </div>
            </div>

            <h3 className="dashboard-card-title" style={{ marginBottom: "1rem", fontSize: "1.4rem" }}>
              {summary.title}
            </h3>
            
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.75rem", 
              marginBottom: "1.5rem",
              fontFamily: "'JetBrains Mono', monospace",
              color: "var(--muted)"
            }}>
              <div className="dashboard-card-icon" style={{ fontSize: "1.2rem" }}>📅</div>
              <span>{summary.date}</span>
              <div style={{ width: "1px", height: "20px", background: "var(--border)" }} />
              <span>Viability: <strong style={{ color: "var(--gold)", fontSize: "1.2rem" }}>{summary.viability}%</strong></span>
            </div>

            <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {summary.keyPoints.map((point, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <span style={{ color: "var(--gold)", fontWeight: "600", fontSize: "1.1rem", marginTop: "0.15rem" }}>•</span>
                  <span style={{ lineHeight: "1.5" }}>{point}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button 
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "var(--gold)",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontFamily: "'Outfit', sans-serif",
                  cursor: "pointer"
                }}
                onClick={() => alert("Downloading PDF summary...")}
              >
                📥 Download PDF
              </button>
              <button 
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "transparent",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  fontFamily: "'Outfit', sans-serif",
                  cursor: "pointer"
                }}
              >
                ✏️ Edit Analysis
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div style={{ textAlign: "center", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
        <Link to="/upload-case">
          <button className="logout-btn" style={{ background: "var(--blue)", marginRight: "1rem" }}>
            📂 Upload New Case
          </button>
        </Link>
        <Link to="/dashboard">
          <button className="logout-btn" style={{ background: "var(--muted)" }}>← Back to Dashboard</button>
        </Link>
      </div>

      <style jsx>{`
        .status-ready { background: color-mix(in srgb, var(--green) 12%, transparent); color: var(--green); }
        .status-needs-more { background: color-mix(in srgb, var(--gold) 12%, transparent); color: var(--gold); }
        .status-strong { background: color-mix(in srgb, var(--teal) 12%, transparent); color: var(--teal); }
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default AiSummary;

