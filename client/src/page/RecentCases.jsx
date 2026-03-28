import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../page/Dashboard.css";

const SvgSignOut = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const RecentCases = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Cases from MongoDB
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

  // Delete Case from MongoDB
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to completely delete this case and its documents?");
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
    }
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
      <header className="ll-intro" style={{ marginBottom: "2.5rem" }}>
        <p className="ll-label">Case Management</p>
        <h1 className="ll-h1">Ledger & Recent Analysis</h1>
        <p className="ll-desc">Review your uploaded contracts, disputes, and compliance flags. Manage advisor assignments and check viability scores.</p>
      </header>

      {/* Filters & Stats */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", alignItems: "center" }}>
        <input 
          type="text" 
          className="ll-input"
          placeholder="Search cases by ID or title..."
          style={{ maxWidth: "400px" }}
        />
        <div style={{ flex: 1 }} />
        <Link to="/upload-case" className="ll-cta">+ New Case</Link>
      </div>

      {/* Cases Table */}
      <div className="ll-panel" style={{ padding: "0", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#a4a4a0", fontFamily: "Geist, sans-serif" }}>Loading your ledger...</div>
        ) : cases.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "#1a1a1a" }}>
            <p style={{ marginBottom: "1rem" }}>You haven't added any cases to the ledger yet.</p>
            <Link to="/upload-case" className="ll-ghost">Upload your first document</Link>
          </div>
        ) : (
          <table className="ll-table">
            <thead>
              <tr style={{ background: "#faf9f7" }}>
                <th style={{ width: "120px" }}>Reference</th>
                <th>Case Title</th>
                <th style={{ textAlign: "center" }}>Status</th>
                <th style={{ textAlign: "center" }}>Score</th>
                <th style={{ textAlign: "center" }}>Advisor</th>
                <th style={{ width: "150px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((caseItem) => (
                <tr key={caseItem._id} style={{ transition: "background 0.2s" }} className="tr-hover">
                  <td style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.85rem", color: "#8c7a5e" }}>
                     {caseItem.caseId}
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, marginBottom: "0.25rem", color: "#1a1a1a" }}>{caseItem.title}</div>
                    <div style={{ color: "#a4a4a0", fontSize: "0.80rem" }}>
                      Created {new Date(caseItem.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span className="ll-pill">
                      {caseItem.status === "ready" && <span style={{ color: "#2d7a4e" }}>●</span>}
                      {caseItem.status === "needs-more" && <span style={{ color: "#e8a74f" }}>●</span>}
                      {caseItem.status === "strong" && <span style={{ color: "#2563a8" }}>●</span>}
                      {caseItem.status === "in-progress" && <span style={{ color: "#6b3fa0" }}>●</span>}
                      {caseItem.status.replace("-", " ")}
                    </span>
                  </td>
                  <td style={{ textAlign: "center", fontFamily: "Instrument Serif, serif", fontSize: "1.4rem", color: "#1a1a1a" }}>
                    {caseItem.viabilityScore ? `${caseItem.viabilityScore}%` : <span style={{ color: "#d4d4ce" }}>-</span>}
                  </td>
                  <td style={{ textAlign: "center", fontSize: "0.9rem", color: "#8c8c88" }}>
                    {caseItem.advisor || "-"}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button 
                        onClick={() => navigate("/ai-summary", { state: { newAnalysis: caseItem } })}
                        className="ll-ghost"
                        style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", border: "1px solid #e2e2de", flex: 1, justifyContent: "center" }}
                      >
                        Summary
                      </button>
                      <button 
                        onClick={() => handleDelete(caseItem._id)}
                        className="ll-ghost"
                        style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem", border: "1px solid #e2e2de", color: "#c0392b" }}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default RecentCases;
