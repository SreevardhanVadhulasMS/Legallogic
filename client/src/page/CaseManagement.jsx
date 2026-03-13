import { Link, useNavigate } from "react-router-dom";
import "../page/Dashboard.css";

const CaseManagement = () => {
  const navigate = useNavigate();

  const activeCase = {
    id: "#CASE-001",
    title: "Contract Dispute - Co-founder Equity Vesting",
    status: "active",
    created: "2025-01-10",
    nextHearing: "2025-02-15",
    advisor: "Ravi Sharma",
    documents: 12,
    notesCount: 8,
    viability: 78
  };

  const timeline = [
    {
      date: "2025-01-10",
      event: "Case Created",
      type: "milestone",
      icon: "📋"
    },
    {
      date: "2025-01-12", 
      event: "Documents Uploaded",
      type: "upload",
      icon: "📎",
      details: "5 files (2.4 MB total)"
    },
    {
      date: "2025-01-15",
      event: "AI Analysis Complete",
      type: "ai-analysis",
      icon: "🤖",
      details: "Viability score: 78%"
    },
    {
      date: "2025-01-18",
      event: "Advisor Assigned",
      type: "advisor",
      icon: "👨‍⚖️",
      details: "Ravi Sharma (4.9★)"
    },
    {
      date: "2025-01-22",
      event: "Legal Notice Sent",
      type: "action",
      icon: "📤"
    },
    {
      date: "2025-02-15",
      event: "Next Hearing",
      type: "hearing",
      icon: "⚖️"
    }
  ];

  const quickActions = [
    { icon: "➕", label: "Add Document", action: "upload", color: "var(--blue)" },
    { icon: "✏️", label: "Add Note", action: "note", color: "var(--teal)" },
    { icon: "📅", label: "Schedule Hearing", action: "hearing", color: "var(--violet)" },
    { icon: "💰", label: "Add Expense", action: "expense", color: "var(--gold)" },
    { icon: "📧", label: "Send Message", action: "message", color: "var(--rose)" }
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
              Legal<strong>Logic</strong>
            </span>
          </Link>
          <div style={{flex: 1}}>
            <h1 className="dashboard-title" style={{fontSize: '2rem', margin: '0 0 0.25rem 0'}}>{activeCase.title}</h1>
            <p className="dashboard-subtitle" style={{margin: 0, fontSize: '1rem'}}>
              Case #{activeCase.id} • {activeCase.status.toUpperCase()}
            </p>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>Logout →</button>
      </header>

      {/* Case Overview */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: "2fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
        <div className="welcome-card">
          <h2 style={{ marginBottom: "1.5rem" }}>Case Overview</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Created</div>
              <div style={{ fontSize: "1.1rem", fontWeight: "500" }}>{activeCase.created}</div>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Next Hearing</div>
              <div style={{ fontSize: "1.1rem", fontWeight: "500", color: "var(--gold)" }}>{activeCase.nextHearing}</div>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Advisor</div>
              <div style={{ fontSize: "1.1rem", fontWeight: "500" }}>{activeCase.advisor}</div>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>AI Viability</div>
              <div style={{ 
                fontSize: "1.3rem", 
                color: "var(--green)", 
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                {activeCase.viability}% <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Excellent</div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="dashboard-card">
            <div className="dashboard-card-icon">📄</div>
            <h3>{activeCase.documents}</h3>
            <p>Documents</p>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-icon">📝</div>
            <h3>{activeCase.notesCount}</h3>
            <p>Notes</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="welcome-card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>Quick Actions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {quickActions.map((action, index) => (
            <button 
              key={action.action}
              className="dashboard-card"
              style={{ 
                border: "2px solid var(--border)", 
                textAlign: "left", 
                cursor: "pointer",
                position: "relative",
                background: action.color + "10"
              }}
              onClick={() => alert(`Opening ${action.label.toLowerCase()}...`)}
            >
              <div className="dashboard-card-icon" style={{ 
                background: action.color, 
                width: "48px", 
                height: "48px", 
                fontSize: "1.2rem",
                marginBottom: "0.75rem"
              }}>
                {action.icon}
              </div>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{action.label}</h4>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="activity-section">
        <h2 style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="dashboard-card-icon">📅</div> Case Timeline
        </h2>
        <div style={{ maxWidth: "1000px" }}>
          {timeline.map((event, index) => (
            <div key={event.date} style={{ 
              display: "flex", 
              alignItems: "flex-start", 
              gap: "1.5rem", 
              padding: "1.5rem 0",
              borderBottom: index < timeline.length - 1 ? "1px solid var(--border2)" : "none"
            }}>
              <div style={{ 
                minWidth: "60px", 
                textAlign: "center", 
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.85rem",
                color: "var(--muted)",
                fontWeight: "500"
              }}>
                {event.date}
              </div>
              <div className="dashboard-card-icon" style={{ 
                background: "var(--gold-dim)", 
                margin: "0.25rem 1rem 0 0",
                width: "44px",
                height: "44px",
                flexShrink: 0
              }}>
                {event.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "600", marginBottom: "0.25rem", fontSize: "1.1rem" }}>
                  {event.event}
                </div>
                {event.details && (
                  <div style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
                    {event.details}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Bar */}
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <Link to="/recent-cases">
          <button className="logout-btn" style={{ background: "var(--blue)", marginRight: "1rem" }}>
            📋 All Cases
          </button>
        </Link>
        <Link to="/dashboard">
          <button className="logout-btn" style={{ background: "var(--muted)" }}>← Dashboard</button>
        </Link>
      </div>
    </div>
  );
};

export default CaseManagement;

