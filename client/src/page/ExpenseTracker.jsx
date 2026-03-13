import { Link, useNavigate } from "react-router-dom";
import "../page/Dashboard.css";

const ExpenseTracker = () => {
  const navigate = useNavigate();

  const expenses = [
    {
      id: "#EXP-001",
      description: "Retainer Fee - Sharma & Associates",
      category: "Attorney Fees",
      categoryColor: "var(--gold)",
      amount: "₹1,20,000",
      date: "2025-01-15",
      status: "paid"
    },
    {
      id: "#EXP-002",
      description: "High Court Filing - Case #HC-2025/001",
      category: "Court Fees", 
      categoryColor: "var(--blue)",
      amount: "₹24,500",
      date: "2025-01-12",
      status: "paid"
    },
    {
      id: "#EXP-003",
      description: "Forensic Accountant - Expert Witness",
      category: "Expert Fees",
      categoryColor: "var(--violet)",
      amount: "₹75,000",
      date: "2025-01-10",
      status: "pending"
    },
    {
      id: "#EXP-004",
      description: "Document Notarization & Prep",
      category: "Document Prep",
      categoryColor: "var(--teal)",
      amount: "₹12,000",
      date: "2025-01-08",
      status: "paid"
    },
    {
      id: "#EXP-005",
      description: "Travel - Court Appearance",
      category: "Travel",
      categoryColor: "var(--rose)",
      amount: "₹8,500",
      date: "2025-01-05",
      status: "paid"
    }
  ];

  const totalSpent = expenses
    .filter(exp => exp.status === "paid")
    .reduce((sum, exp) => sum + parseInt(exp.amount.replace(/[₹,]/g, "")), 0);
    
  const totalBudget = 500000;
  const budgetRemaining = totalBudget - totalSpent;
  const budgetUsedPercent = Math.round((totalSpent / totalBudget) * 100);

  const categories = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + parseInt(exp.amount.replace(/[₹,]/g, ""));
    return acc;
  }, {});

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
              Legal<strong>Logic</strong> - Expense Tracker
            </span>
          </Link>
          
        </div>
        <button className="logout-btn" onClick={logout}>Logout →</button>
      </header>

      {/* Summary Cards */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: "2rem" }}>
        <div className="dashboard-card">
          <div className="dashboard-card-icon" style={{ fontSize: "2.5rem" }}>💰</div>
          <h3 style={{ fontSize: "2rem", margin: "0.5rem 0" }}>₹{totalSpent.toLocaleString()}</h3>
          <p style={{ color: "var(--muted)" }}>Total Spent</p>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-icon" style={{ fontSize: "2.5rem" }}>📉</div>
          <h3 style={{ fontSize: "2rem", margin: "0.5rem 0", color: budgetRemaining > 0 ? "var(--green)" : "var(--rose)" }}>
            ₹{budgetRemaining.toLocaleString()}
          </h3>
          <p style={{ color: "var(--muted)" }}>Budget Remaining</p>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-icon" style={{ fontSize: "2.5rem" }}>📊</div>
          <h3 style={{ fontSize: "2rem", margin: "0.5rem 0", color: "var(--gold)" }}>{budgetUsedPercent}%</h3>
          <p style={{ color: "var(--muted)" }}>Budget Used</p>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="welcome-card" style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="dashboard-card-icon">📈</div> Budget Progress
        </h3>
        <div style={{ 
          height: "12px", 
          background: "var(--surface)", 
          borderRadius: "6px", 
          overflow: "hidden",
          marginBottom: "0.5rem"
        }}>
          <div style={{ 
            height: "100%", 
            width: `${budgetUsedPercent}%`, 
            background: `linear-gradient(90deg, var(--gold), var(--gold-lt))`,
            borderRadius: "6px",
            transition: "width 0.5s ease"
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: "0.9rem" }}>
          <span>₹0</span>
          <span>₹{budgetUsedPercent}% used</span> 
          <span>₹{totalBudget.toLocaleString()}</span>
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="dashboard-card-icon">📋</div> By Category
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {Object.entries(categories).map(([category, amount]) => (
            <div key={category} className="dashboard-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>{category}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>₹{amount.toLocaleString()}</div>
              </div>
              <div style={{ 
                width: "120px", height: "8px", 
                background: "var(--surface)", 
                borderRadius: "4px", overflow: "hidden"
              }}>
                <div style={{ 
                  height: "100%", 
                  width: "65%", 
                  background: "var(--gold-dim)",
                  borderRadius: "4px"
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Expenses Table */}
      <div className="activity-section">
        <h2 className="activity-title" style={{ marginBottom: "1.5rem" }}>Recent Transactions</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
            <thead>
              <tr style={{ background: "var(--surface)" }}>
                <th style={{ padding: "1rem 1.25rem", textAlign: "left", fontWeight: "600" }}>ID</th>
                <th style={{ padding: "1rem 1.25rem", textAlign: "left", fontWeight: "600" }}>Description</th>
                <th style={{ padding: "1rem 1.25rem", textAlign: "left", fontWeight: "600" }}>Category</th>
                <th style={{ padding: "1rem 1.25rem", textAlign: "right", fontWeight: "600" }}>Amount</th>
                <th style={{ padding: "1rem 1.25rem", textAlign: "center", fontWeight: "600" }}>Date</th>
                <th style={{ padding: "1rem 0.75rem", width: "100px" }}></th>
              </tr>
            </thead>
            <tbody>
              {expenses.slice(0, 5).map((expense) => (
                <tr key={expense.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "1rem 1.25rem", fontFamily: "'JetBrains Mono', monospace", color: "var(--gold)" }}>
                    {expense.id}
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>{expense.description}</td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span style={{
                      padding: "0.25rem 0.75rem",
                      background: `color-mix(in srgb, ${expense.categoryColor} 12%, transparent)`,
                      color: expense.categoryColor,
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontFamily: "'JetBrains Mono', monospace"
                    }}>
                      {expense.category}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", textAlign: "right", fontWeight: "600", fontSize: "1.1rem" }}>
                    {expense.amount}
                  </td>
                  <td style={{ padding: "1rem 1.25rem", textAlign: "center", color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace" }}>
                    {expense.date}
                  </td>
                  <td style={{ padding: "1rem 0.75rem", textAlign: "center" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "0.375rem 0.875rem",
                      background: expense.status === "paid" ? "var(--green)" : "var(--gold)",
                      color: "white",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "500"
                    }}>
                      {expense.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ textAlign: "center", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
        <button 
          className="logout-btn" 
          style={{ background: "var(--teal)", marginRight: "1rem" }}
          onClick={() => alert("Add new expense...")}
        >
          ➕ Add Expense
        </button>
        <button 
          className="logout-btn" 
          style={{ background: "var(--blue)", marginRight: "1rem" }}
          onClick={() => alert("Download report (PDF/CSV)...")}
        >
          📥 Export Report
        </button>
        <Link to="/dashboard">
          <button className="logout-btn" style={{ background: "var(--muted)" }}>← Dashboard</button>
        </Link>
      </div>
    </div>
  );
};

export default ExpenseTracker;

