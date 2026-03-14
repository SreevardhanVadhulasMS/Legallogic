import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();


  const features = [
    { icon: "📂", title: "Upload Case", desc: "Upload legal documents and analyze them using AI.", path: "/upload-case" },
    { icon: "🤖", title: "AI Case Summary", desc: "Generate instant AI summaries for legal documents.", path: "/ai-summary" },
    { icon: "📑", title: "Recent Cases", desc: "View your previously uploaded and analyzed cases.", path: "/recent-cases" },
    { icon: "📍", title: "Find Advisors", desc: "Locate verified lawyers near your location.", path: "/find-advisors" },
    { icon: "💰", title: "Expense Tracker", desc: "Track legal spending and maintain budgets.", path: "/expense-tracker" },
    { icon: "🛡", title: "Case Management", desc: "Organize case timelines, documents and notes.", path: "/case-management" },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCardClick = (e, path) => {
    // Ripple effect
    const ripple = document.createElement("div");
    ripple.className = "card-ripple";
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    e.currentTarget.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    navigate(path);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-show');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="dashboard">

      {/* Header */}
      <header className="dashboard-header reveal" id="header">
        <div style={{display: 'flex', flex: 1, alignItems: 'center', gap: '1.5rem'}}>
          <a href="/dashboard" className="brand" style={{margin: 0}}>
            <div className="brand-mark">LL</div>
            <span className="brand-name">
              Legal<strong>Logic</strong> - Dashboard
            </span>
          </a>
          
        </div>
        <button className="logout-btn" onClick={logout}>
          Logout →
        </button>
      </header>


      {/* Welcome Card */}
      <div className="welcome-card reveal" id="welcome">
        <h2 className="welcome-title">Welcome back</h2>
        <p className="welcome-text">
          Manage your legal cases, analyze documents using AI, 
          track expenses and connect with verified advisors — all in one place.
        </p>
      </div>


      {/* Feature Cards */}
      <div className="dashboard-grid reveal" id="grid">
        {features.map((feature, index) => (
          <div 
            key={feature.path}
            className="dashboard-card reveal" 
            id={`card-${index}`}
            onClick={(e) => handleCardClick(e, feature.path)}
          >
            <div className="dashboard-card-icon">{feature.icon}</div>
            <h3 className="dashboard-card-title">{feature.title}</h3>
            <p className="dashboard-card-desc">{feature.desc}</p>
          </div>
        ))}
      </div>


      {/* Recent Activity */}
      <div className="activity-section reveal" id="activity">
        <h2 className="activity-title">Recent Activity</h2>
        <div className="activity-item">
          <div className="activity-icon">📄</div>
          <div className="activity-content">
            <div className="activity-text">Case document uploaded</div>
            <div className="activity-time">2 hours ago</div>
          </div>
        </div>
        <div className="activity-item">
          <div className="activity-icon">🤖</div>
          <div className="activity-content">
            <div className="activity-text">AI analysis completed</div>
            <div className="activity-time">1 day ago</div>
          </div>
        </div>
        <div className="activity-item">
          <div className="activity-icon">💰</div>
          <div className="activity-content">
            <div className="activity-text">Added new expense</div>
            <div className="activity-time">3 days ago</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
