import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Dashboard.css";

/* ── Icons ── */
const SvgAI = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10H12z"/><path d="M12 6v6l3 3"/><circle cx="18.5" cy="5.5" r="2.5"/>
  </svg>
);
const SvgViability = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const SvgAdvisors = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const SvgExpense = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const SvgDoc = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const SvgManage = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);
const SvgArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const SvgSignOut = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const FEATURES = [
  { Icon: SvgAI, color: "#8B5CF6", title: "AI Legal Advice", tech: "GPT-4 Turbo · RAG", path: "/ai-summary", desc: "Jurisdiction-aware guidance across 14 legal domains — criminal, family, corporate, IP, employment." },
  { Icon: SvgViability, color: "#A78BFA", title: "Case Viability ML", tech: "ML Model v2.6", path: "/recent-cases", desc: "Analyses facts, jurisdiction, and evidence strength to provide a probability-based viability score." },
  { Icon: SvgAdvisors, color: "#C4B5FD", title: "Nearby Advisors", tech: "Live · Maps API", path: "/find-advisors", desc: "Discover and book verified legal professionals in your city. Filter by specialty, rating, and fee." },
  { Icon: SvgExpense, color: "#8B5CF6", title: "Expense Tracker", tech: "Multi-Currency", path: "/expense-tracker", desc: "Track every legal cost with budget alerts and exportable PDF/CSV reports." },
  { Icon: SvgDoc, color: "#7C3AED", title: "Document Analysis", tech: "OCR · NLD", path: "/upload-case", desc: "Upload contracts or FIRs for instant AI analysis — key clauses, risk flags, and summaries." },
  { Icon: SvgManage, color: "#6D28D9", title: "Case Management", tech: "E2E Encrypted", path: "/case-management", desc: "Manage timelines, court dates, and advisor notes in one encrypted dashboard." },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("ll-in")),
      { threshold: 0.04 }
    );
    document.querySelectorAll("[data-ll]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="ll-wrap">
      <nav className="ll-nav" data-ll>
        <a href="/dashboard" className="ll-logo">Legal<em>Logic</em></a>
        <div className="ll-nav-actions">
          <button className="ll-cta" onClick={() => navigate("/ai-summary")}>New Case</button>
          <button className="ll-ghost" onClick={logout}>
            Sign out <SvgSignOut />
          </button>
        </div>
      </nav>

      <header className="ll-intro" data-ll>
        <h1 className="ll-h1">Secure Legal Workspace,<br /><em>powered by AI.</em></h1>
      </header>

     

      <div className="ll-grid">
        {FEATURES.map((f, i) => (
          <button
            key={f.title}
            className="ll-card"
            style={{ "--c": f.color, "--d": `${i * 60}ms` }}
            onClick={() => navigate(f.path)}
          >
            <div className="ll-icon">
              <f.Icon />
            </div>
            <h3 className="ll-card-h">{f.title}</h3>
            <p className="ll-card-p">{f.desc}</p>
            <div className="ll-card-footer">
              <span className="ll-tag">{f.tech}</span>
              <span className="ll-arr"><SvgArrow /></span>
            </div>
          </button>
        ))}
      </div>

      <footer className="ll-footer" data-ll>
        <span className="ll-footer-logo">Legal<em>Logic</em></span>
        <span>© 2026 </span>
      </footer>
    </div>
  );
}