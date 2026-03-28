import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./Dashboard.css";

const SvgAI = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 1 0 10 10H12z"/><path d="M12 6v6l3 3"/><circle cx="18.5" cy="5.5" r="2.5"/>
  </svg>
);
const SvgViability = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const SvgAdvisors = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const SvgExpense = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const SvgDoc = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const SvgManage = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);
const SvgArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const SvgSignOut = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const FEATURES = [
  { Icon: SvgAI,        color: "var(--pur)",    title: "AI Legal Advice",   tech: "GPT-4 Turbo · RAG", path: "/ai-summary",      desc: "Jurisdiction-aware guidance across 14 legal domains — criminal, family, corporate, IP, employment — with structured answers instantly.", delay: "0ms" },
  { Icon: SvgViability, color: "#6366f1",        title: "Case Viability ML", tech: "ML Model v2.6",     path: "/recent-cases",    desc: "Trained on 200K+ outcomes. Analyses your facts, jurisdiction, evidence strength and gives a probability-based viability score.", delay: "75ms" },
  { Icon: SvgAdvisors,  color: "var(--pur-lt)",  title: "Nearby Advisors",   tech: "Live · Maps API",   path: "/find-advisors",   desc: "Discover and book verified legal professionals in your city. Filter by specialty, rating, availability and fee.", delay: "150ms" },
  { Icon: SvgExpense,   color: "#7c3aed",        title: "Expense Tracker",   tech: "Multi-Currency",    path: "/expense-tracker", desc: "Track every legal cost — attorney fees, filings, expert witnesses, travel — with budget alerts and exportable PDF/CSV reports.", delay: "225ms" },
  { Icon: SvgManage,    color: "#a78bfa",        title: "Case Management",   tech: "E2E Encrypted",     path: "/case-management", desc: "Manage all cases in one encrypted dashboard — timelines, court dates, reminders, advisor notes and version-controlled document storage.", delay: "300ms" },
];

export default function Dashboard() {
  const statsRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("ll-in");
          if (e.target.classList.contains("ll-stats")) initCounters();
        }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-ll]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const initCounters = () => {
    if (!statsRef.current) return;
    const els = statsRef.current.querySelectorAll(".ll-stat-n");
    const targets = [52, 94, 3100, 14];
    const formats = [
      (n) => `${Math.round(n)}`,
      (n) => `${Math.round(n)}%`,
      (n) => `${Math.round(n).toLocaleString()}+`,
      (n) => `${Math.round(n)}`,
    ];
    targets.forEach((target, i) => {
      const el = els[i];
      if (!el || el.dataset.animated === "true") return;
      el.dataset.animated = "true";
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const prog = Math.min((ts - start) / 2000, 1);
        const ease = 1 - Math.pow(1 - prog, 3);
        el.textContent = formats[i](target * ease);
        if (prog < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };

  return (
    <div className="ll-wrap">
      <div className="ll-hero-orb ll-hero-orb--1" />
      <div className="ll-hero-orb ll-hero-orb--2" />
      <nav className="ll-nav" data-ll>
        <a href="/dashboard" className="ll-logo">Legal<span>Logic</span></a>
        <div className="ll-nav-actions">
          <button className="ll-ghost" onClick={logout}>Sign out <SvgSignOut /></button>
        </div>
      </nav>
      <header className="ll-intro ll-reveal" data-ll>
        <p className="ll-label">Legal Intelligence Platform</p>
        <h1 className="ll-h1">Your legal workspace,<br /><span>all in one place.</span></h1>
        <p className="ll-desc">Six modules to upload, analyse, track and manage every case — from document AI to verified lawyer discovery.</p>
        <div className="ll-stats ll-reveal" data-ll ref={statsRef}>
          <div className="ll-stat"><span className="ll-stat-n">0</span><span className="ll-stat-l">Cases Analyzed</span></div>
          <div className="ll-stat"><span className="ll-stat-n">0</span><span className="ll-stat-l">ML Accuracy</span></div>
          <div className="ll-stat"><span className="ll-stat-n">0</span><span className="ll-stat-l">Advisors Found</span></div>
          <div className="ll-stat"><span className="ll-stat-n">0</span><span className="ll-stat-l">Legal Domains</span></div>
        </div>
      </header>
      <div className="ll-bar ll-reveal" data-ll>
      </div>
      <div className="ll-grid">
        {FEATURES.filter(f => f.title !== "Document Analysis").map((f) => (
          <Link key={f.title} to={f.path} className="ll-card" style={{ "--c": f.color, "--delay": f.delay }}>
            <div className="ll-icon" style={{ "--c": f.color }}><f.Icon /></div>
            <h3 className="ll-card-h">{f.title}</h3>
            <p className="ll-card-p">{f.desc}</p>
            <div className="ll-card-footer">
              <span className="ll-tag">{f.tech}</span>
              <span className="ll-arr"><SvgArrow /></span>
            </div>
          </Link>
        ))}
      </div>
      <footer className="ll-footer ll-reveal" data-ll>
        <span>© 2026 Legal<em>Logic</em> · All rights reserved</span>
      </footer>
    </div>
  );
}
