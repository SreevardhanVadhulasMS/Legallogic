import { Link } from "react-router-dom";
import "./Dashboard.css";
import useReveal from "../hooks/useReveal";

const CaseManagement = () => {
  useReveal();

  const activeCase = { id: "#CASE-001", status: "active", documents: 12, notesCount: 8, viability: 78 };
  const timeline = [
    { date: "2025-01-10", event: "Case Created", icon: "📋" },
    { date: "2025-01-12", event: "Documents Uploaded", icon: "📎" },
    { date: "2025-01-15", event: "AI Analysis Complete", icon: "🤖" },
    { date: "2025-01-18", event: "Advisor Assigned", icon: "👨‍⚖️" },
    { date: "2025-01-22", event: "Legal Notice Sent", icon: "📤" },
    { date: "2025-02-15", event: "Next Hearing", icon: "⚖️" }
  ];
  const quickActions = [
    { icon: "➕", label: "Add Document", color: "var(--pur)" },
    { icon: "✏️", label: "Add Note", color: "var(--pur-lt)" },
    { icon: "📅", label: "Schedule Hearing", color: "#7c3aed" },
    { icon: "💰", label: "Add Expense", color: "#6366f1" },
    { icon: "📧", label: "Send Message", color: "#8b5cf6" }
  ];
  const logout = () => { localStorage.removeItem("token"); window.location.href = "/login"; };

  return (
    <div className="ll-wrap">
      <nav className="ll-nav ll-reveal" data-ll>
        <Link to="/dashboard" className="ll-page-back">← All Cases</Link>
        <div className="ll-nav-actions">
          <Link to="/upload-case" className="ll-cta">Upload Document</Link>
          <button className="ll-ghost" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <header className="ll-page-header ll-reveal" data-ll>
        <h1 className="ll-page-title">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--pur)" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
            <rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>
          </svg>
          Case Management
        </h1>
      </header>

      <div className="ll-data-stats ll-reveal" data-ll>
        <div className="ll-data-stat"><span className="ll-data-stat-n">{activeCase.documents}</span><span className="ll-data-stat-l">Documents</span></div>
        <div className="ll-data-stat"><span className="ll-data-stat-n">{activeCase.notesCount}</span><span className="ll-data-stat-l">Notes</span></div>
        <div className="ll-data-stat"><span className="ll-data-stat-n">{activeCase.viability}%</span><span className="ll-data-stat-l">AI Viability</span></div>
      </div>

      <div className="ll-grid ll-reveal" data-ll style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {quickActions.map((action) => (
          <div key={action.label} className="ll-card" style={{ "--c": action.color }}>
            <div className="ll-icon" style={{ "--c": action.color }}><span style={{ fontSize: "1.4rem" }}>{action.icon}</span></div>
            <h3 className="ll-card-h">{action.label}</h3>
          </div>
        ))}
      </div>

      <div className="ll-bar ll-reveal" data-ll style={{ margin: "3rem 0 2rem 0" }}>
        <span>Case Timeline</span><span>{timeline.length}</span>
      </div>

      <div className="ll-data-grid ll-reveal" data-ll>
        {timeline.map((event, i) => (
          <div key={i} className="ll-data-card">
            <div className="ll-data-meta"><span className="ll-data-id">{event.date}</span></div>
            <div className="ll-data-title">{event.event}</div>
            <div className="ll-icon" style={{ "--c": "var(--pur-dim)" }}><span style={{ fontSize: "1.8rem" }}>{event.icon}</span></div>
            <div className="ll-actions"><button className="ll-btn-primary" style={{ fontSize: "0.85rem" }}>Details</button></div>
          </div>
        ))}
      </div>

      <div className="ll-actions ll-reveal" data-ll style={{ justifyContent: "center", marginTop: "3rem" }}>
        <Link to="/recent-cases" className="ll-btn-primary">📋 View All Cases</Link>
        <Link to="/dashboard" className="ll-btn-secondary">← Dashboard</Link>
      </div>
    </div>
  );
};

export default CaseManagement;