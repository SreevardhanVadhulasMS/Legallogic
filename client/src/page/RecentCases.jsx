import { Link, useNavigate } from "react-router-dom";
import "../page/Dashboard.css";

const RecentCases = () => {
  const navigate = useNavigate();

  const cases = [
    {
      id: "#CASE-001",
      title: "Contract Dispute - Equity Vesting",
      status: "analysis-complete",
      date: "2025-01-15",
      advisor: "Ravi Sharma",
      viability: 78,
      nextAction: "Send Legal Notice"
    },
    {
      id: "#CASE-002",
      title: "Wrongful Termination Claim",
      status: "needs-documents",
      date: "2025-01-12",
      advisor: "Priya Krishnan", 
      viability: 62,
      nextAction: "Upload Termination Letter"
    },
    {
      id: "#CASE-003",
      title: "Rental Agreement Dispute",
      status: "advisor-assigned",
      date: "2025-01-10",
      advisor: "Ananya Mehta",
      viability: 89,
      nextAction: "Court Filing Scheduled"
    },
    {
      id: "#CASE-004",
      title: "IP Infringement Notice",
      status: "in-progress",
      date: "2025-01-08",
      advisor: null,
      viability: null,
      nextAction: "AI Analysis Pending"
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      "analysis-complete": "var(--green)",
      "advisor-assigned": "var(--teal)", 
      "in-progress": "var(--gold)",
      "needs-documents": "var(--rose)"
    };
    return colors[status] || "var(--muted)";
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard" style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <header className="dashboard-header">
        <div style={{display: 'flex', flex: 1, alignItems: 'center', gap: '1.5rem'}}>
          <Link to="/dashboard" className="brand" style={{margin: 0}}>
            <div className="brand-mark">LL</div>
            <span className="brand-name">
              Legal<strong>Logic</strong> - Recent Cases
            </span>
          </Link>
          
        </div>
        <button className="logout-btn" onClick={logout}>Logout →</button>
      </header>

      {/* Filters & Stats */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr", marginBottom: "2rem" }}>
        <div className="dashboard-card" style={{ padding: "1.5rem", textAlign: "left" }}>
          <input 
            type="text" 
            placeholder="Search cases by title, ID, or advisor..."
            style={{
              width: "100%", padding: "0.75rem 1rem", border: "1px solid var(--border)",
              borderRadius: "0.5rem", background: "var(--surface)", fontSize: "1rem"
            }}
          />
        </div>
        <div className="dashboard-card" style={{ textAlign: "center" }}>
          <h3 style={{ fontSize: "1.3rem" }}>4 Active</h3>
          <p>All Cases</p>
        </div>
        <div className="dashboard-card" style={{ textAlign: "center" }}>
          <h3 style={{ fontSize: "1.3rem", color: "var(--green)" }}>2 Complete</h3>
          <p>Analysis Ready</p>
        </div>
        <div className="dashboard-card" style={{ textAlign: "center" }}>
          <h3 style={{ fontSize: "1.3rem", color: "var(--rose)" }}>1 Pending</h3>
          <p>Needs Action</p>
        </div>
      </div>

      {/* Cases Table */}
      <div className="activity-section" style={{ borderRadius: "1rem", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--surface)" }}>
              <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontWeight: "600", color: "var(--text)" }}>Case ID</th>
              <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontWeight: "600", color: "var(--text)" }}>Title</th>
              <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontWeight: "600", color: "var(--text)" }}>Status</th>
              <th style={{ padding: "1rem 1.5rem", textAlign: "center", fontWeight: "600", color: "var(--text)" }}>Viability</th>
              <th style={{ padding: "1rem 1.5rem", textAlign: "center", fontWeight: "600", color: "var(--text)" }}>Advisor</th>
              <th style={{ padding: "1rem 1.5rem", textAlign: "center", fontWeight: "600", color: "var(--text)" }}>Next Action</th>
              <th style={{ padding: "1rem 0.5rem", width: "80px" }}></th>
            </tr>
          </thead>
          <tbody>
            {cases.map((caseItem, index) => (
              <tr key={caseItem.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "1.25rem 1.5rem", fontFamily: "'JetBrains Mono', monospace", color: "var(--gold)" }}>
                  {caseItem.id}
                </td>
                <td style={{ padding: "1.25rem 1.5rem" }}>
                  <div style={{ fontWeight: "500", marginBottom: "0.25rem" }}>{caseItem.title}</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{caseItem.date}</div>
                </td>
                <td style={{ padding: "1.25rem 1.5rem" }}>
                  <span style={{
                    background: `color-mix(in srgb, ${getStatusColor(caseItem.status)} 12%, transparent)`,
                    color: getStatusColor(caseItem.status),
                    padding: "0.25rem 0.75rem",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontFamily: "'JetBrains Mono', monospace"
                  }}>
                    {caseItem.status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </td>
                <td style={{ padding: "1.25rem 1.5rem", textAlign: "center" }}>
                  {caseItem.viability ? (
                    <div style={{ 
                      fontFamily: "'JetBrains Mono', monospace", 
                      fontSize: "1.1rem", 
                      color: "var(--gold)",
                      fontWeight: "600"
                    }}>
                      {caseItem.viability}%
                    </div>
                  ) : (
                    <span style={{ color: "var(--muted)" }}>-</span>
                  )}
                </td>
                <td style={{ padding: "1.25rem 1.5rem", textAlign: "center" }}>
                  {caseItem.advisor || <span style={{ color: "var(--muted)" }}>-</span>}
                </td>
                <td style={{ padding: "1.25rem 1.5rem", textAlign: "center" }}>
                  <div style={{ fontWeight: "500", color: "var(--text)" }}>{caseItem.nextAction}</div>
                </td>
                <td style={{ padding: "1.25rem 0.5rem", textAlign: "center" }}>
                  <Link to={`/case/${caseItem.id.replace("#", "")}`} style={{ 
                    padding: "0.5rem 1rem",
                    background: "var(--gold)",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "0.375rem",
                    fontSize: "0.85rem",
                    fontWeight: "500"
                  }}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Bar */}
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <Link to="/upload-case">
          <button className="logout-btn" style={{ background: "var(--blue)", marginRight: "1rem" }}>
            ➕ New Case
          </button>
        </Link>
        <Link to="/dashboard">
          <button className="logout-btn" style={{ background: "var(--muted)" }}>← Dashboard</button>
        </Link>
      </div>
    </div>
  );
};

export default RecentCases;

