import { Link } from "react-router-dom";
import "./Dashboard.css";
import useReveal from "../hooks/useReveal";

const AiSummary = () => {
  useReveal();

  const summaries = [
    { id: "#CASE-001", title: "Contract Dispute - Co-founder Equity Vesting", date: "2 hours ago", viability: 78, keyPoints: ["Strong breach claim (87%)", "Supporting docs complete", "Precedents favorable", "Recommend legal notice"], status: "ready" },
    { id: "#CASE-002", title: "Employment Termination - Wrongful Dismissal", date: "1 day ago", viability: 62, keyPoints: ["Moderate case strength", "Need termination letter", "Witness statements pending", "Gather more evidence"], status: "needs" },
    { id: "#CASE-003", title: "Property Dispute - Rental Agreement Breach", date: "3 days ago", viability: 89, keyPoints: ["Excellent case viability", "Clear lease violation", "Security deposit recoverable", "File in consumer court"], status: "strong" }
  ];

  const logout = () => { localStorage.removeItem("token"); window.location.href = "/login"; };

  return (
    <div className="ll-wrap">
      <nav className="ll-nav ll-reveal" data-ll>
        <Link to="/dashboard" className="ll-page-back">← Back to Dashboard</Link>
        <div className="ll-nav-actions">
          <Link to="/upload-case" className="ll-cta">Upload New Case</Link>
          <button className="ll-ghost" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <header className="ll-page-header ll-reveal" data-ll>
        <h1 className="ll-page-title">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--pur)" strokeWidth="2">
            <path d="M12 2a10 10 0 1 0 10 10H12z"/>
            <path d="M12 6v6l3 3"/>
            <circle cx="18.5" cy="5.5" r="2.5"/>
          </svg>
          AI Case Summaries
        </h1>
      </header>

      <div className="ll-data-stats ll-reveal" data-ll>
        <div className="ll-data-stat"><span className="ll-data-stat-n">3</span><span className="ll-data-stat-l">Cases Analyzed</span></div>
        <div className="ll-data-stat"><span className="ll-data-stat-n">82%</span><span className="ll-data-stat-l">Avg Viability</span></div>
        <div className="ll-data-stat"><span className="ll-data-stat-n">12 min</span><span className="ll-data-stat-l">Avg Time</span></div>
      </div>

      <div className="ll-data-grid ll-reveal" data-ll>
        {summaries.map((summary) => (
          <div key={summary.id} className="ll-data-card">
            <span className="ll-data-id">{summary.id}</span>
            <h3 className="ll-data-title">{summary.title}</h3>
            <div className="ll-data-meta">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{summary.date}</span>
              <div style={{ width: "1px", height: "16px", background: "var(--line)" }} />
              <strong style={{ color: "var(--pur)", fontSize: "1.1rem" }}>{summary.viability}%</strong>
            </div>
            <div className="ll-data-points">
              {summary.keyPoints.map((point, i) => (
                <div key={i} className="ll-data-point">
                  <span className="ll-data-point-dot">•</span><span>{point}</span>
                </div>
              ))}
            </div>
            <span className={`ll-data-badge ll-data-badge--${summary.status}`}>
              {summary.status === "ready" && "✅ Ready"}
              {summary.status === "needs" && "⚠️ Needs More"}
              {summary.status === "strong" && "🚀 Strong Case"}
            </span>
            <div className="ll-actions">
              <button className="ll-btn-primary" onClick={() => alert("Downloading PDF...")}>📥 Download PDF</button>
              <button className="ll-btn-secondary">✏️ Edit Analysis</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiSummary;