import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ExpenseTracker.css";

const STORAGE_KEY = "legalLogic.expenses";
const BUDGET_KEY = "legalLogic.expenseBudget";
const CURRENCY_KEY = "legalLogic.expenseCurrency";

const currencyRates = {
  INR: { symbol: "₹", rate: 1 },
  USD: { symbol: "$", rate: 0.012 },
  EUR: { symbol: "€", rate: 0.011 },
  GBP: { symbol: "£", rate: 0.0098 },
  AED: { symbol: "د.إ", rate: 0.044 },
};

const categoryOptions = [
  "Attorney Fees",
  "Court Fees",
  "Expert Fees",
  "Document Prep",
  "Travel",
  "Investigation",
  "Research",
  "Settlement",
  "Other",
];

const statusOptions = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
];

const initialForm = {
  description: "",
  category: "Attorney Fees",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  status: "pending",
  notes: "",
};

const formatAmountValue = (value) => Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

const toDisplayDate = (value) => {
  if (!value) return "--";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeExpense = (expense) => ({
  id: expense.id || `exp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  description: expense.description || "",
  category: expense.category || "Other",
  amount: Number(expense.amount) || 0,
  date: expense.date || new Date().toISOString().slice(0, 10),
  status: expense.status || "pending",
  notes: expense.notes || "",
});

const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const ExpenseTracker = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(500000);
  const [currency, setCurrency] = useState("INR");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [budgetDraft, setBudgetDraft] = useState("500000");
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    setExpenses(readStorage(STORAGE_KEY, []));
    const storedBudget = readStorage(BUDGET_KEY, 500000);
    setBudget(Number(storedBudget) || 500000);
    setBudgetDraft(String(Number(storedBudget) || 500000));
    setCurrency(readStorage(CURRENCY_KEY, "INR"));
  }, []);

  useEffect(() => {
    if (expenses.length || localStorage.getItem(STORAGE_KEY) !== null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    }
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, JSON.stringify(currency));
  }, [currency]);

  const currencyData = currencyRates[currency] || currencyRates.INR;

  const formatAmount = (value) => `${currencyData.symbol}${formatAmountValue((Number(value) || 0) * currencyData.rate)}`;

  const totalSpent = expenses
    .filter((expense) => expense.status === "paid")
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  const totalPending = expenses
    .filter((expense) => expense.status === "pending")
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  const budgetRemaining = Math.max(budget - totalSpent, 0);
  const budgetUsedPercent = budget > 0 ? Math.min(Math.round((totalSpent / budget) * 100), 100) : 0;

  const categorySummary = expenses.reduce((accumulator, expense) => {
    accumulator[expense.category] = (accumulator[expense.category] || 0) + Number(expense.amount || 0);
    return accumulator;
  }, {});

  const visibleExpenses = expenses
    .filter((expense) => {
      const matchesStatus = filterStatus === "all" || expense.status === filterStatus;
      const haystack = `${expense.description} ${expense.category} ${expense.notes}`.toLowerCase();
      const matchesSearch = haystack.includes(searchTerm.trim().toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((left, right) => new Date(right.date) - new Date(left.date));

  const recentExpenses = [...expenses]
    .sort((left, right) => new Date(right.date) - new Date(left.date))
    .slice(0, 4);

  const categoryEntries = Object.entries(categorySummary)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 6);

  const openCreateForm = () => {
    setEditingId(null);
    setFormData(initialForm);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const description = formData.description.trim();
    const amount = Number(formData.amount);

    if (!description) {
      alert("Please enter an expense description.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!formData.date) {
      alert("Please choose a valid date.");
      return;
    }

    const nextExpense = normalizeExpense({
      ...(editingId ? expenses.find((expense) => expense.id === editingId) : null),
      ...formData,
      description,
      amount,
    });

    if (editingId) {
      setExpenses((current) => current.map((expense) => (expense.id === editingId ? { ...expense, ...nextExpense } : expense)));
    } else {
      setExpenses((current) => [nextExpense, ...current]);
    }

    closeForm();
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setFormData({
      description: expense.description,
      category: expense.category,
      amount: String(expense.amount),
      date: expense.date,
      status: expense.status,
      notes: expense.notes || "",
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Delete this expense entry?");
    if (!confirmed) {
      return;
    }

    setExpenses((current) => current.filter((expense) => expense.id !== id));
  };

  const handlePay = (id) => {
    setExpenses((current) => current.map((expense) => (expense.id === id ? { ...expense, status: "paid" } : expense)));
  };

  const updateBudget = () => {
    const parsedBudget = Number(budgetDraft);
    if (!Number.isFinite(parsedBudget) || parsedBudget <= 0) {
      alert("Please enter a valid budget amount.");
      return;
    }

    setBudget(parsedBudget);
  };

  const exportReport = () => {
    const header = ["ID", "Description", "Category", "Amount", "Date", "Status", "Notes"];
    const rows = expenses.map((expense) => [
      expense.id,
      expense.description,
      expense.category,
      expense.amount,
      expense.date,
      expense.status,
      expense.notes || "",
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = "legal-logic-expenses.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="expense-page">
      <div className="expense-page__orb expense-page__orb--one" />
      <div className="expense-page__orb expense-page__orb--two" />

      <div className="expense-page__shell">
        <header className="expense-header">
          <div className="expense-header__left">
            <Link to="/dashboard" className="expense-back-link">
              ← Dashboard
            </Link>

            <div className="expense-brand">
              <div className="expense-brand__mark">LL</div>
              <div>
                <p>LegalLogic</p>
                <h1>Expense Tracker</h1>
              </div>
            </div>
          </div>

          <div className="expense-header__actions">
            <select
              className="expense-select"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              aria-label="Currency"
            >
              {Object.keys(currencyRates).map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>

            <button className="expense-btn expense-btn--primary" onClick={openCreateForm}>
              Add Expense
            </button>
            <button className="expense-btn expense-btn--secondary" onClick={exportReport}>
              Export CSV
            </button>
            <button className="expense-btn expense-btn--ghost" onClick={logout}>
              Sign out
            </button>
          </div>
        </header>

        <section className="expense-hero">
          <div>
            <span className="expense-kicker">Case cost control</span>
            <h2>Track every rupee tied to a matter with clear status, budget visibility, and exportable records.</h2>
            <p>
              Keep attorney fees, filings, travel, and expert costs in one professional workspace designed for logged-in users.
            </p>
          </div>

          <div className="expense-ring-card">
            <div className="expense-ring" style={{ ["--expense-progress"]: `${budgetUsedPercent}%` }}>
              <div className="expense-ring__inner">
                <strong>{budgetUsedPercent}%</strong>
                <span>Budget used</span>
              </div>
            </div>
            <div className="expense-ring-card__meta">
              <div>
                <span>Budget</span>
                <strong>{formatAmount(budget)}</strong>
              </div>
              <div>
                <span>Remaining</span>
                <strong>{formatAmount(budgetRemaining)}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="expense-metrics">
          <article className="expense-metric-card">
            <span>Total Spent</span>
            <strong>{formatAmount(totalSpent)}</strong>
            <small>Paid expenses only</small>
          </article>
          <article className="expense-metric-card">
            <span>Pending</span>
            <strong>{formatAmount(totalPending)}</strong>
            <small>Awaiting settlement</small>
          </article>
          <article className="expense-metric-card">
            <span>Budget Remaining</span>
            <strong>{formatAmount(budgetRemaining)}</strong>
            <small>{budgetUsedPercent}% of budget consumed</small>
          </article>
          <article className="expense-metric-card">
            <span>Entries</span>
            <strong>{expenses.length}</strong>
            <small>{expenses.filter((expense) => expense.status === "paid").length} paid</small>
          </article>
        </section>

        <section className="expense-budget-panel">
          <div>
            <span className="expense-panel-label">Budget control</span>
            <h3>Set the working budget for the active matter.</h3>
            <p>Update the ceiling whenever the scope changes. The progress bar and remaining amount refresh instantly.</p>
          </div>

          <div className="expense-budget-panel__form">
            <label className="expense-field">
              <span>Budget amount</span>
              <input
                type="number"
                min="0"
                step="1"
                value={budgetDraft}
                onChange={(event) => setBudgetDraft(event.target.value)}
                placeholder="500000"
              />
            </label>
            <button className="expense-btn expense-btn--primary" onClick={updateBudget}>
              Update Budget
            </button>
          </div>

          <div className="expense-progress">
            <div className="expense-progress__track">
              <div className="expense-progress__fill" style={{ width: `${budgetUsedPercent}%` }} />
            </div>
            <div className="expense-progress__labels">
              <span>{formatAmount(0)}</span>
              <span>{formatAmount(totalSpent)} spent</span>
              <span>{formatAmount(budget)}</span>
            </div>
          </div>
        </section>

        <div className="expense-toolbar">
          <label className="expense-search">
            <span>Search</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Description, notes, or category"
            />
          </label>

          <div className="expense-filters">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                className={`expense-filter ${filterStatus === option.value ? "expense-filter--active" : ""}`}
                onClick={() => setFilterStatus(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="expense-grid">
          <section className="expense-panel expense-panel--wide">
            <div className="expense-panel__head">
              <div>
                <span className="expense-panel-label">Transactions</span>
                <h3>Recent expense entries</h3>
              </div>
              <span className="expense-panel__count">{visibleExpenses.length} shown</span>
            </div>

            {showForm && (
              <form className="expense-form" onSubmit={handleSubmit}>
                <div className="expense-form__head">
                  <div>
                    <h4>{editingId ? "Edit Expense" : "Add New Expense"}</h4>
                    <p>Capture a case-related cost in a clean, auditable format.</p>
                  </div>
                  <button type="button" className="expense-btn expense-btn--ghost" onClick={closeForm}>
                    Close
                  </button>
                </div>

                <div className="expense-form__grid">
                  <label className="expense-field">
                    <span>Description</span>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                      placeholder="Retainer fee, filing fee, expert opinion..."
                      required
                    />
                  </label>

                  <label className="expense-field">
                    <span>Category</span>
                    <select
                      value={formData.category}
                      onChange={(event) => setFormData((current) => ({ ...current, category: event.target.value }))}
                    >
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="expense-field">
                    <span>Amount ({currency})</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={(event) => setFormData((current) => ({ ...current, amount: event.target.value }))}
                      placeholder="25000"
                      required
                    />
                  </label>

                  <label className="expense-field">
                    <span>Date</span>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(event) => setFormData((current) => ({ ...current, date: event.target.value }))}
                      required
                    />
                  </label>

                  <label className="expense-field">
                    <span>Status</span>
                    <select
                      value={formData.status}
                      onChange={(event) => setFormData((current) => ({ ...current, status: event.target.value }))}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                    </select>
                  </label>

                  <label className="expense-field expense-field--full">
                    <span>Notes</span>
                    <textarea
                      rows="3"
                      value={formData.notes}
                      onChange={(event) => setFormData((current) => ({ ...current, notes: event.target.value }))}
                      placeholder="Optional context, invoice reference, hearing details..."
                    />
                  </label>
                </div>

                <div className="expense-form__actions">
                  <button type="submit" className="expense-btn expense-btn--primary">
                    {editingId ? "Update Expense" : "Save Expense"}
                  </button>
                  <button type="button" className="expense-btn expense-btn--secondary" onClick={closeForm}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {!showForm && visibleExpenses.length === 0 ? (
              <div className="expense-empty">
                <h4>No expense entries found</h4>
                <p>Use Add Expense to create your first case cost record, or clear the filters/search.</p>
                <button className="expense-btn expense-btn--primary" onClick={openCreateForm}>
                  Add First Expense
                </button>
              </div>
            ) : (
              <div className="expense-list">
                {visibleExpenses.map((expense) => (
                  <article key={expense.id} className="expense-item">
                    <div className="expense-item__top">
                      <div>
                        <span className={`expense-badge expense-badge--${expense.status === "paid" ? "paid" : "pending"}`}>
                          {expense.status === "paid" ? "Paid" : "Pending"}
                        </span>
                        <h4>{expense.description}</h4>
                        <p>{expense.notes || "No additional notes provided."}</p>
                      </div>
                      <strong>{formatAmount(expense.amount)}</strong>
                    </div>

                    <div className="expense-item__meta">
                      <span>{toDisplayDate(expense.date)}</span>
                      <span>{expense.category}</span>
                      <span>#{String(expense.id).slice(-6).toUpperCase()}</span>
                    </div>

                    <div className="expense-item__actions">
                      {expense.status === "pending" ? (
                        <button className="expense-btn expense-btn--primary" onClick={() => handlePay(expense.id)}>
                          Mark Paid
                        </button>
                      ) : (
                        <button className="expense-btn expense-btn--secondary" type="button" disabled>
                          Already Paid
                        </button>
                      )}
                      <button className="expense-btn expense-btn--secondary" onClick={() => handleEdit(expense)}>
                        Edit
                      </button>
                      <button className="expense-btn expense-btn--ghost" onClick={() => handleDelete(expense.id)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="expense-panel expense-panel--aside">
            <div className="expense-panel__head">
              <div>
                <span className="expense-panel-label">Category mix</span>
                <h3>Where the budget is going</h3>
              </div>
            </div>

            <div className="expense-category-list">
              {categoryEntries.length === 0 ? (
                <p className="expense-muted">No category data yet.</p>
              ) : (
                categoryEntries.map(([category, amount]) => {
                  const percent = budget > 0 ? Math.min(Math.round((amount / budget) * 100), 100) : 0;

                  return (
                    <div key={category} className="expense-category-item">
                      <div className="expense-category-item__row">
                        <span>{category}</span>
                        <strong>{formatAmount(amount)}</strong>
                      </div>
                      <div className="expense-category-item__bar">
                        <span style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="expense-panel__subhead">
              <span className="expense-panel-label">Latest activity</span>
            </div>

            <div className="expense-activity-list">
              {recentExpenses.length === 0 ? (
                <p className="expense-muted">Recent activity will appear here once you add items.</p>
              ) : (
                recentExpenses.map((expense) => (
                  <div key={expense.id} className="expense-activity-item">
                    <div>
                      <strong>{expense.description}</strong>
                      <span>{toDisplayDate(expense.date)}</span>
                    </div>
                    <em>{formatAmount(expense.amount)}</em>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>

        <div className="expense-footer-actions">
          <button className="expense-btn expense-btn--primary" onClick={openCreateForm}>
            Add Expense
          </button>
          <button className="expense-btn expense-btn--secondary" onClick={exportReport}>
            Export CSV
          </button>
          <Link to="/dashboard" className="expense-btn expense-btn--ghost expense-btn--link">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;

