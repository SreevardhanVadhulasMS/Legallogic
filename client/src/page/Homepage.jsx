import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

/* ─── Navbar ────────────────────────────────────────────────────── */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "nav--stuck" : ""}`}>
      <Link className="nav-brand" to="/">
        <span className="nav-logo-text">Legal<strong>Logic</strong></span>
      </Link>
      <ul className={`nav-links ${menuOpen ? "nav-links--open" : ""}`}>
        {["Features", "Case Analysis", "Find Advisors", "Expenses"].map((item) => (
          <li key={item}><a href={`#${item.toLowerCase().replace(" ", "-")}`}>{item}</a></li>
        ))}
      </ul>
      <div className="nav-actions">
        <Link to="/login"><button className="btn-ghost">Sign In</button></Link>
        <Link to="/signup"><button className="btn-solid">Get Started →</button></Link>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
};

/* ─── Hero ──────────────────────────────────────────────────────── */
const Hero = () => {
  const nums = useRef([]);
  useEffect(() => {
    const targets = [52000, 94, 3100, 14];
    const formats = [
      (n) => `${Math.round(n / 1000)}K+`,
      (n) => `${Math.round(n)}%`,
      (n) => `${Math.round(n).toLocaleString()}+`,
      (n) => `${Math.round(n)}`,
    ];
    targets.forEach((target, i) => {
      let start = null;
      const el = nums.current[i];
      if (!el) return;
      const step = (ts) => {
        if (!start) start = ts;
        const prog = Math.min((ts - start) / 1800, 1);
        const ease = 1 - Math.pow(1 - prog, 3);
        el.textContent = formats[i](target * ease);
        if (prog < 1) requestAnimationFrame(step);
      };
      setTimeout(() => requestAnimationFrame(step), 600 + i * 100);
    });
  }, []);

  return (
    <section className="hero">
      {/* Ambient glow orbs */}
      <div className="hero-orb hero-orb--1" />
      <div className="hero-orb hero-orb--2" />
      {/* Grid overlay */}
      <div className="hero-grid" />

      <div className="hero-inner">
        <div className="hero-pill">
          <span className="pill-dot" />
          AI · Legal · Advisory Platform
        </div>

        <h1 className="hero-h1">
          Your personal<br />
          <em>legal AI assistant.</em>
        </h1>

        <p className="hero-sub">
          LegalLogic gives you instant AI legal advice, ML-powered case viability
          scoring, expense tracking, and verified advisors — all in one intelligent platform.
        </p>

        <div className="hero-btns">
          <Link to="/signup"><button className="hbtn-primary">Try for Free →</button></Link>
          <Link to="/login"><button className="hbtn-ghost">Sign In</button></Link>
        </div>

        <div className="hero-trust">
          <span>For individuals</span>
          <span className="trust-sep" />
          <span>For businesses</span>
          <span className="trust-sep" />
          <span>For startups</span>
        </div>

        <div className="hero-stats">
          {[
            { label: "Cases Analyzed" },
            { label: "ML Accuracy" },
            { label: "Verified Advisors" },
            { label: "Legal Domains" },
          ].map((s, i) => (
            <div className="h-stat" key={s.label}>
              <span className="h-stat-n" ref={(el) => (nums.current[i] = el)}>0</span>
              <span className="h-stat-l">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

/* ─── Features ──────────────────────────────────────────────────── */
const FEATURES = [
  { title: "AI Legal Advice", desc: "Jurisdiction-aware guidance across 14 legal domains — criminal, family, corporate, IP, employment — with structured answers instantly.", badge: "GPT-4 Turbo · RAG", cls: "a" },
  { title: "Case Viability ML", desc: "Our model trained on 200K+ outcomes analyzes your facts, jurisdiction, evidence strength, and opposition to give a probability-based viability score.", badge: "ML Model v2.6", cls: "b" },
  { title: "Nearby Advisors", desc: "Discover and book verified legal professionals in your city. Filter by specialty, rating, availability, and fee. Integrated Google Maps with live slots.", badge: "Live · Maps API", cls: "c" },
  { title: "Expense Tracker", desc: "Track every legal cost — attorney fees, filings, expert witnesses, travel — with smart categorization, budget alerts, and exportable PDF/CSV reports.", badge: "Multi-Currency", cls: "d" },
  { title: "Document Analysis", desc: "Upload contracts, FIRs, or agreements and receive instant AI analysis — key clauses, risk flags, obligations, deadlines, and plain-language summaries.", badge: "OCR + NLP", cls: "e" },
  { title: "Case Management", desc: "Manage all cases in one encrypted dashboard — timelines, court dates, reminders, advisor notes, and secure document storage with version control.", badge: "E2E Encrypted", cls: "f" },
];

const SVG_ICONS = {
  a: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12z"/><path d="M12 6v6l3 3"/></svg>,
  b: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  c: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  d: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  e: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  f: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>,
};

const Features = () => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVis(true), { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="features section" id="features" ref={ref}>
      <div className="section-label">Core Capabilities</div>
      <h2 className="section-h2">Built for every step of your <em>legal journey</em></h2>
      <p className="section-sub">From instant AI guidance to real-world attorney connections — LegalLogic covers the full lifecycle of your case.</p>
      <div className={`feat-grid ${vis ? "feat-grid--vis" : ""}`}>
        {FEATURES.map((f, i) => (
          <div className={`fc fc--${f.cls}`} key={f.title} style={{ "--delay": `${i * 0.07}s` }}>
            <div className={`fc-icon fc-icon--${f.cls}`}>{SVG_ICONS[f.cls]}</div>
            <h3 className="fc-title">{f.title}</h3>
            <p className="fc-desc">{f.desc}</p>
            <span className={`fc-badge fc-badge--${f.cls}`}>{f.badge}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─── Viability ─────────────────────────────────────────────────── */
const FACTORS = [
  { name: "Evidence Strength", val: 82, color: "#7c3aed" },
  { name: "Legal Precedent",   val: 74, color: "#6366f1" },
  { name: "Documentation",     val: 90, color: "#8b5cf6" },
  { name: "Opposition Risk",   val: 38, color: "#dc2626" },
  { name: "Jurisdiction Fit",  val: 68, color: "#a78bfa" },
];

const Viability = () => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVis(true), { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const r = 70, circ = 2 * Math.PI * r;

  return (
    <section className="viability section" id="case-analysis">
      <div className={`viability-inner reveal ${vis ? "reveal--on" : ""}`} ref={ref}>
        <div className="viability-copy">
          <div className="section-label">ML-Powered Analysis</div>
          <h2 className="section-h2">Know your odds <em>before you file</em></h2>
          <p className="section-sub">Our model evaluates 40+ signals — jurisdiction precedents, evidence weight, case type history — to give you an honest viability score.</p>
          <ul className="v-list">
            {[
              "Trained on 200,000+ historical case outcomes",
              "Jurisdiction-specific model variants (India, US, UK)",
              "94% accuracy on held-out validation data",
              "Explains key factors — not a black-box score",
              "Updates automatically as you add evidence",
            ].map((t) => <li key={t}><span className="v-tick">✦</span>{t}</li>)}
          </ul>
        </div>
        <div className="v-card">
          <div className="v-card-top">
            <span className="v-card-title">Case Viability Report</span>
            <span className="v-live"><span className="v-live-dot" />LIVE</span>
          </div>
          <div className="score-wrap">
            <div className="score-ring">
              <svg width="168" height="168" viewBox="0 0 168 168">
                <circle className="ring-bg" cx="84" cy="84" r={r} />
                <circle
                  className={`ring-fill ${vis ? "ring-fill--on" : ""}`}
                  cx="84" cy="84" r={r}
                  strokeDasharray={circ}
                  strokeDashoffset={vis ? circ * 0.25 : circ}
                />
              </svg>
              <div className="score-center">
                <span className="score-n">75</span>
                <span className="score-lbl">VIABILITY</span>
              </div>
            </div>
          </div>
          <div className="v-bars">
            {FACTORS.map((f) => (
              <div className="vb" key={f.name}>
                <span className="vb-name">{f.name}</span>
                <div className="vb-track">
                  <div className={`vb-fill ${vis ? "vb-fill--on" : ""}`} style={{ "--w": `${f.val}%`, "--c": f.color }} />
                </div>
                <span className="vb-val">{f.val}%</span>
              </div>
            ))}
          </div>
          <div className="v-verdict">
            <span className="v-verdict-dot" />
            Verdict: <strong>Strong Case</strong> — Recommend proceeding with legal counsel.
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Expenses ──────────────────────────────────────────────────── */
const EXPENSES = [
  { desc: "Retainer — Sharma & Associates", cat: "Attorney Fee", catCls: "a", date: "12 Jun 2025", amt: "₹1,20,000", paid: true },
  { desc: "High Court Filing Fee — Case No. HC-2025", cat: "Court Fee", catCls: "b", date: "18 Jun 2025", amt: "₹24,500", paid: true },
  { desc: "Forensic Accountant — Expert Witness", cat: "Expert", catCls: "e", date: "25 Jun 2025", amt: "₹75,000", paid: false },
  { desc: "Document Preparation & Notarization", cat: "Doc Prep", catCls: "c", date: "02 Jul 2025", amt: "₹12,000", paid: true },
];

const Expenses = () => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVis(true), { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className={`expenses section reveal ${vis ? "reveal--on" : ""}`} id="expenses" ref={ref}>
      <div className="section-label">Legal Finance</div>
      <h2 className="section-h2">Track every rupee of <em>your legal spend</em></h2>
      <p className="section-sub">Smart categorization, budget alerts, and clean exportable reports.</p>
      <div className="exp-card">
        <div className="exp-tabs">
          {["All Expenses", "Attorney Fees", "Court Costs", "Expert Witnesses"].map((t, i) => (
            <button className={`exp-tab ${i === 0 ? "exp-tab--on" : ""}`} key={t}>{t}</button>
          ))}
        </div>
        <div className="exp-summary">
          <div className="es"><span className="es-lbl">Total Spent</span><span className="es-val">₹2,84,500</span><span className="es-sub">Across 3 active cases</span></div>
          <div className="es"><span className="es-lbl">Budget Remaining</span><span className="es-val">₹1,15,500</span><span className="es-sub">71% of budget used</span></div>
          <div className="es"><span className="es-lbl">This Month</span><span className="es-val">₹48,000</span><span className="es-sub es-sub--up">▲ 12% from last month</span></div>
        </div>
        <div className="exp-table">
          <div className="er er--hd"><span>Description</span><span>Category</span><span>Date</span><span>Amount</span><span>Status</span></div>
          {EXPENSES.map((e) => (
            <div className="er" key={e.desc}>
              <span>{e.desc}</span>
              <span><span className={`e-cat e-cat--${e.catCls}`}>{e.cat}</span></span>
              <span className="er-date">{e.date}</span>
              <span className="er-amt">{e.amt}</span>
              <span className={`er-status er-status--${e.paid ? "paid" : "pending"}`}>
                <span className="s-dot" />{e.paid ? "Paid" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Advisors ──────────────────────────────────────────────────── */
const ADVISORS = [
  { initials: "RS", name: "Ravi Sharma, LLB", spec: "Corporate & Commercial Law", dist: "1.2 km", rating: "4.9", avail: "AVAILABLE TODAY", cls: "a" },
  { initials: "PK", name: "Priya Krishnan, LLM", spec: "Criminal Defense & Civil Rights", dist: "2.7 km", rating: "4.8", avail: "AVAILABLE TODAY", cls: "b" },
  { initials: "AM", name: "Ananya Mehta, LLB", spec: "Family Law & Mediation", dist: "3.4 km", rating: "4.6", avail: "NEXT: TOMORROW 10AM", cls: "c" },
];

const Advisors = () => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVis(true), { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="advisors section" id="find-advisors">
      <div className={`advisors-inner reveal ${vis ? "reveal--on" : ""}`} ref={ref}>
        <div className="advisors-copy">
          <div className="section-label">Find Legal Help</div>
          <h2 className="section-h2">Verified advisors <em>near you</em></h2>
          <p className="section-sub">Filter by specialization, distance, rating, and availability. Book a slot in seconds — no cold calls, no waiting.</p>
          <div className="adv-list">
            {ADVISORS.map((a) => (
              <div className="adv-card" key={a.name}>
                <div className={`adv-av adv-av--${a.cls}`}>{a.initials}</div>
                <div className="adv-info">
                  <div className="adv-name">{a.name}</div>
                  <div className="adv-spec">{a.spec}</div>
                  <span className="adv-avail">{a.avail}</span>
                </div>
                <div className="adv-right">
                  <div className="adv-dist">{a.dist}</div>
                  <div className="adv-stars">★★★★★ {a.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="map-box">
          <svg className="map-svg" viewBox="0 0 520 420" xmlns="http://www.w3.org/2000/svg">
            <rect width="520" height="420" className="map-base"/>
            <rect x="30" y="28" width="88" height="62" rx="6" className="map-park"/>
            <rect x="340" y="290" width="70" height="52" rx="6" className="map-park"/>
            <rect x="200" y="340" width="54" height="38" rx="4" className="map-park"/>
            <path d="M0 310 Q60 290 110 310 Q160 330 200 310 Q240 290 260 310 L260 420 L0 420 Z" className="map-water" opacity="0.6"/>
            <rect x="30" y="108" width="52" height="38" rx="3" className="map-block"/>
            <rect x="92" y="108" width="36" height="38" rx="3" className="map-block"/>
            <rect x="158" y="28" width="60" height="44" rx="3" className="map-block"/>
            <rect x="228" y="28" width="44" height="44" rx="3" className="map-block"/>
            <rect x="302" y="28" width="64" height="52" rx="3" className="map-block"/>
            <rect x="432" y="28" width="60" height="52" rx="3" className="map-block"/>
            <rect x="158" y="138" width="54" height="40" rx="3" className="map-block-hi"/>
            <rect x="222" y="138" width="40" height="40" rx="3" className="map-block-hi"/>
            <rect x="302" y="118" width="52" height="46" rx="3" className="map-block"/>
            <rect x="364" y="118" width="64" height="46" rx="3" className="map-block"/>
            <rect x="302" y="222" width="58" height="52" rx="3" className="map-block"/>
            <line x1="0" y1="100" x2="520" y2="100" className="map-road-maj"/>
            <line x1="0" y1="200" x2="520" y2="200" className="map-road-maj"/>
            <line x1="0" y1="300" x2="520" y2="300" className="map-road-maj"/>
            <line x1="140" y1="0" x2="140" y2="420" className="map-road-maj"/>
            <line x1="280" y1="0" x2="280" y2="420" className="map-road-maj"/>
            <line x1="420" y1="0" x2="420" y2="420" className="map-road-maj"/>
            <line x1="0" y1="150" x2="520" y2="150" className="map-road-min"/>
            <line x1="0" y1="250" x2="520" y2="250" className="map-road-min"/>
            <line x1="70" y1="0" x2="70" y2="420" className="map-road-min"/>
            <line x1="210" y1="0" x2="210" y2="420" className="map-road-min"/>
            <line x1="350" y1="0" x2="350" y2="420" className="map-road-min"/>
            <text x="80" y="96" className="map-lbl">MG Road</text>
            <text x="300" y="96" className="map-lbl">Brigade Rd</text>
            <circle cx="230" cy="210" r="14" className="map-you-pulse"/>
            <circle cx="230" cy="210" r="9" className="map-you-pulse-2"/>
            <circle cx="230" cy="210" r="5" className="map-you-dot"/>
          </svg>
          {[
            { top: "33%", left: "54%", label: "Ravi Sharma · 1.2km", color: "#7c3aed", delay: "0s" },
            { top: "56%", left: "70%", label: "Priya K. · 2.7km", color: "#6366f1", delay: "-.7s" },
            { top: "18%", left: "26%", label: "Ananya M. · 3.4km", color: "#a78bfa", delay: "-1.4s" },
          ].map((p) => (
            <div className="map-pin" style={{ top: p.top, left: p.left, animationDelay: p.delay }} key={p.label}>
              <div className="pin-dot" style={{ background: p.color }} />
              <div className="pin-chip">{p.label}</div>
            </div>
          ))}
          <div className="map-footer">📍 Bengaluru, Karnataka — 12 advisors nearby</div>
        </div>
      </div>
    </section>
  );
};

/* ─── Testimonials ──────────────────────────────────────────────── */
const TESTI = [
  { text: "LegalLogic's AI gave me a clear picture of my wrongful termination case within minutes. The viability score was 81 — my lawyer later confirmed it was a strong case. We won.", name: "Vikram Nair", role: "Employment Law · Bengaluru", cls: "a" },
  { text: "The expense tracker alone saved me so much stress. I could see exactly where our legal budget was going, set limits, and export reports for our CFO. Absolutely essential.", name: "Sunita Rao", role: "Corporate Dispute · Mumbai", cls: "b" },
  { text: "Found a brilliant family law attorney 2 km from my home in under 3 minutes. The booking was seamless — no back and forth, no wasted time. Incredible product.", name: "Arjun Kapoor", role: "Family Law · Delhi", cls: "c" },
];

const Testimonials = () => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVis(true), { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className={`testi section reveal ${vis ? "reveal--on" : ""}`} ref={ref}>
      <div className="section-label">Client Stories</div>
      <h2 className="section-h2">Trusted by thousands across <em>India</em></h2>
      <div className="testi-grid">
        {TESTI.map((t, i) => (
          <div className={`tc tc--${t.cls}`} key={t.name} style={{ "--delay": `${i * 0.1}s` }}>
            <div className="tc-stars">★★★★★</div>
            <p className="tc-text">{t.text}</p>
            <div className="tc-author">
              <div className={`tc-av tc-av--${t.cls}`}>{t.name.split(" ").map(w => w[0]).join("")}</div>
              <div>
                <div className="tc-name">{t.name}</div>
                <div className="tc-role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─── CTA ───────────────────────────────────────────────────────── */
const CTA = () => (
  <section className="cta">
    <div className="cta-glow" />
    <h2 className="cta-h2">Your legal edge starts with <em>LegalLogic</em></h2>
    <p className="cta-sub">Join thousands who've taken control of their legal journey — with AI, data, and expert advisors on their side.</p>
    <Link to="/signup"><button className="hbtn-primary cta-btn">Start Free Today →</button></Link>
    <p className="cta-note">Free AI advice · No credit card required · Cancel anytime</p>
  </section>
);

/* ─── Footer ────────────────────────────────────────────────────── */
const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand-col">
        <span className="footer-logo">Legal<strong>Logic</strong></span>
        <p className="footer-desc">An AI-powered legal advisory platform built for individuals, startups, and businesses navigating the Indian legal system.</p>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© 2025 LegalLogic Technologies Pvt. Ltd. · All rights reserved.</span>
      <span className="footer-disc">LegalLogic provides legal information, not legal advice. Always consult a qualified attorney. AI content does not constitute a lawyer-client relationship.</span>
    </div>
  </footer>
);

/* ─── Main ──────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Features />
      <Viability />
      <Expenses />
      <Advisors />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}