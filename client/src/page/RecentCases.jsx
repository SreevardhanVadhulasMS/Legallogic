import { Link } from "react-router-dom";
import "./Dashboard.css";
import useReveal from "../hooks/useReveal";

const RecentCases = () => {
  useReveal();

  const cases = [
    { id: "#CASE-001", title: "Contract Dispute - Equity Vesting",  status: "analysis-complete", date: "2025-01-15", advisor: "Ravi Sharma",    viability: 78,   nextAction: "Send Legal Notice"         },
    { id: "#CASE-002", title: "Wrongful Termination Claim",          status: "needs-documents",   date: "2025-01-12", advisor: "Priya Krishnan", viability: 62,   nextAction: "Upload Termination Letter" },
    { id: "#CASE-003", title: "Rental Agreement Dispute",            status: "advisor-assigned",  date: "2025-01-10", advisor: "Ananya Mehta",   viability: 89,   nextAction: "Court Filing Scheduled"   },
    { id: "#CASE-004", title: "IP Infringement Notice",              status: "in-progress",       date: "2025-01-08", advisor: null,             viability: null, nextAction: "AI Analysis Pending"      }
  ];
  const logout = () => { localStorage.removeItem("token"); window.location.href = "/login"; };

  return (
    <div className="ll-wrap">
      <nav className="ll-nav ll-reveal" data-ll>
        <Link to="/dashboard" className="ll-page-back">← Back to Dashboard</Link>
        <div className="ll-nav-actions">
          <Link to="/upload-case" className="ll-cta">➕ New Case</Link>
          <button className="ll-ghost" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <header className="ll-page-header ll-reveal" data-ll>
        <h1 className="ll-page-title">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--pur)" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          Recent Cases
        </h1>
      </header>

      <div className="ll-data-stats ll-reveal" data-ll>
        <div className="ll-data-stat"><span className="ll-data-stat-n">4</span><span className="ll-data-stat-l">Active Cases</span></div>
        <div className="ll-data-stat"><span className="ll-data-stat-n">78%</span><span className="ll-data-stat-l">Avg Viability</span></div>
        <div className="ll-data-stat"><span className="ll-data-stat-n">2</span><span className="ll-data-stat-l">Ready to Proceed</span></div>
      </div>

      <div className="ll-data-grid ll-reveal" data-ll>
        {cases.map((c) => (
          <div key={c.id} className="ll-data-card">
            <div className="ll-data-meta">
              <span className="ll-data-id">{c.id}</span><span>{c.date}</span>
            </div>
            <h3 className="ll-data-title">{c.title}</h3>
            <div className="ll-data-meta">
              <span style={{ color: "var(--muted)" }}>Viability: {c.viability ? `${c.viability}%` : "-"}</span>
              <span style={{ color: "var(--muted)" }}>Advisor: {c.advisor || "-"}</span>
            </div>
            <div className="ll-data-points">
              <div className="ll-data-point"><span className="ll-data-point-dot">→</span><span>{c.nextAction}</span></div>
            </div>
            <span className={`ll-data-badge ll-data-badge--${c.status === "analysis-complete" ? "ready" : c.status === "advisor-assigned" ? "strong" : "needs"}`}>
              {c.status === "analysis-complete" && "✅ Analysis Complete"}
              {c.status === "advisor-assigned"  && "👩‍⚖️ Advisor Assigned"}
              {c.status === "in-progress"       && "⏳ In Progress"}
              {c.status === "needs-documents"   && "📄 Needs Documents"}
            </span>
            <div className="ll-actions">
              <Link to="/case-management" className="ll-btn-primary">📋 Manage Case</Link>
              <button className="ll-btn-secondary" onClick={() => alert("Opening case details...")}>👁️ View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentCases;