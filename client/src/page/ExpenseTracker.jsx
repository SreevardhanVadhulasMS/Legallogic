import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import useReveal from "../hooks/useReveal";
import axios from "../utils/axios";

const ExpenseTracker = () => {
  useReveal();

  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({ totalSpent: 0, totalPending: 0, totalBudget: 500000, budgetUsedPercent: 0 });
  const [currency, setCurrency] = useState('INR');
  const currencyRates = {
    INR: { symbol: '₹', rate: 1 },
    USD: { symbol: '$', rate: 0.012 },
    EUR: { symbol: '€', rate: 0.011 },
    GBP: { symbol: '£', rate: 0.0098 },
    AED: { symbol: 'د.إ', rate: 0.044 }
  };

  const formatAmount = (value) => {
    const currencyData = currencyRates[currency] || currencyRates.INR;
    return `${currencyData.symbol}${(value * currencyData.rate).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    category: "Attorney Fees",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    status: "pending"
  });

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchExpenses();
    fetchStats();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get("/expenses/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amountValue = Number(formData.amount);
    if (!formData.description.trim()) {
      alert("Please enter a description.");
      return;
    }
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }

    // Normalize date formats (YYYY-MM-DD or DD-MM-YYYY) so backend receives valid date
    const parsedDate = (() => {
      const d = (formData.date || "").trim();
      if (!d) return null;
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return new Date(d);
      if (/^\d{2}-\d{2}-\d{4}$/.test(d)) {
        const [dd, mm, yyyy] = d.split("-");
        return new Date(`${yyyy}-${mm}-${dd}`);
      }
      return new Date(d);
    })();

    if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
      alert("Please enter a valid date.");
      return;
    }

    const payload = {
      ...formData,
      amount: amountValue,
      date: parsedDate,
    };

    try {
      if (editingExpense) {
        await axios.put(`/expenses/${editingExpense._id}`, payload);
      } else {
        await axios.post("/expenses", payload);
      }
      await fetchExpenses();
      await fetchStats();
      setShowAddForm(false);
      setEditingExpense(null);
      setFormData({
        description: "",
        category: "Attorney Fees",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        status: "pending"
      });
    } catch (error) {
      console.error("Error saving expense:", error);
      const apiError = error?.response?.data?.message || error?.message || "Unknown error";
      alert(`Failed to save expense: ${apiError}`);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      category: expense.category,
      amount: expense.amount,
      date: new Date(expense.date).toISOString().split('T')[0],
      status: expense.status
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axios.delete(`/expenses/${id}`);
        fetchExpenses();
        fetchStats();
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  const handlePay = async (expense) => {
    try {
      await axios.put(`/expenses/${expense._id}`, { ...expense, status: "paid" });
      fetchExpenses();
      fetchStats();
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const exportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "ID,Description,Category,Amount,Date,Status\n" +
      expenses.map(e => `${e._id},${e.description},${e.category},${e.amount},${e.date},${e.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="ll-wrap" style={{ overflowX: 'hidden' }}>
      <nav className="ll-nav ll-reveal" data-ll>
        <Link to="/dashboard" className="ll-page-back">← Dashboard</Link>
        <div className="ll-nav-center">
          <div className="ll-nav-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--pur)" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Expense Tracker
          </div>
        </div>
        <div className="ll-nav-actions">
          <select
            className="ll-currency-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            aria-label="Currency"
          >
            {Object.keys(currencyRates).map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
          <button className="ll-cta" onClick={() => setShowAddForm(true)}>➕ Add Expense</button>
          <button className="ll-ghost" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <div className="ll-data-stats ll-reveal" data-ll>
        <div className="ll-data-stat"><span className="ll-data-stat-n">{formatAmount(stats.totalSpent)}</span><span className="ll-data-stat-l">Total Spent</span></div>
        <div className="ll-data-stat"><span className="ll-data-stat-n">{stats.budgetUsedPercent}%</span><span className="ll-data-stat-l">Budget Used</span></div>
        <div className="ll-data-stat"><span className="ll-data-stat-n">{formatAmount(stats.totalBudget - stats.totalSpent)}</span><span className="ll-data-stat-l">Remaining</span></div>
      </div>

      {showAddForm && (
        <div className="ll-data-card" style={{ marginBottom: "2rem", maxWidth: "600px" }}>
          <h3>{editingExpense ? "Edit Expense" : "Add New Expense"}</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              style={{ padding: "0.5rem", border: "1px solid var(--line)", borderRadius: "4px" }}
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{ padding: "0.5rem", border: "1px solid var(--line)", borderRadius: "4px" }}
            >
              <option value="Attorney Fees">Attorney Fees</option>
              <option value="Court Fees">Court Fees</option>
              <option value="Expert Fees">Expert Fees</option>
              <option value="Document Prep">Document Prep</option>
              <option value="Travel">Travel</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="number"
              placeholder="Amount (₹)"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
              required
              style={{ padding: "0.5rem", border: "1px solid var(--line)", borderRadius: "4px" }}
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              style={{ padding: "0.5rem", border: "1px solid var(--line)", borderRadius: "4px" }}
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{ padding: "0.5rem", border: "1px solid var(--line)", borderRadius: "4px" }}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="submit" className="ll-btn-primary">{editingExpense ? "Update" : "Add"} Expense</button>
              <button type="button" className="ll-btn-secondary" onClick={() => { setShowAddForm(false); setEditingExpense(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="ll-data-grid ll-reveal" data-ll>
        {expenses.length === 0 ? (
          <div className="ll-data-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
            <h3 style={{ margin: 0, color: 'var(--muted)' }}>No expenses yet</h3>
            <p style={{ marginTop: '0.5rem', color: 'var(--muted-lt)' }}>Click Add Expense to start tracking your case spend</p>
          </div>
        ) : (
          expenses.map((expense) => (
            <div key={expense._id} className="ll-data-card">
              <span className="ll-data-id">#{expense._id.slice(-6).toUpperCase()}</span>
              <h3 className="ll-data-title">{expense.description}</h3>
              <div className="ll-data-meta">
                <span>{new Date(expense.date).toLocaleDateString()}</span>
                <span style={{ fontWeight: "600", color: "var(--pur)" }}>{formatAmount(expense.amount)}</span>
              </div>
            <div className="ll-data-points">
              <div className="ll-data-point"><span className="ll-data-point-dot">🏷️</span><span>{expense.category}</span></div>
            </div>
            <span className={`ll-data-badge ll-data-badge--${expense.status === "paid" ? "ready" : "needs"}`}>
              {expense.status === "paid" ? "✅ Paid" : "⏳ Pending"}
            </span>
            <div className="ll-actions">
              {expense.status === "pending" ? (
                <button className="ll-btn-primary" onClick={() => handlePay(expense)}>💳 Pay Now</button>
              ) : (
                <button className="ll-btn-primary" disabled>✅ Paid</button>
              )}
              <button className="ll-btn-secondary" onClick={() => handleEdit(expense)}>📋 Edit</button>
              <button className="ll-btn-secondary" onClick={() => handleDelete(expense._id)}>🗑️ Delete</button>
            </div>
          </div>
        )))}
      </div>

      <div className="ll-actions" style={{ justifyContent: "center", marginTop: "2rem" }}>
        <button className="ll-btn-primary" onClick={exportReport}>📥 Export Report</button>
      </div>
    </div>
  );
};

export default ExpenseTracker;