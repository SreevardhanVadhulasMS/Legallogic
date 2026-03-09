import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

// ─── Sub-components ────────────────────────────────────────────────────────

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--stuck" : ""}`}>

      <Link className="nav-brand" to="/">
        <div className="brand-mark">LL</div>
        <span className="brand-name">
          Legal<strong>Logic</strong>
        </span>
      </Link>

      <ul className={`nav-links ${menuOpen ? "nav-links--open" : ""}`}>
        {["Features", "Case Analysis", "Find Advisors", "Expenses"].map((item) => (
          <li key={item}>
            <a href={`#${item.toLowerCase().replace(" ", "-")}`}>{item}</a>
          </li>
        ))}
      </ul>

      <div className="nav-actions">

        <Link to="/login">
          <button className="btn-ghost">Sign In</button>
        </Link>

        <Link to="/signup">
          <button className="btn-solid">Get Started →</button>
        </Link>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

      </div>
    </nav>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

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
      setTimeout(() => requestAnimationFrame(step), 800 + i * 120);
    });
  }, []);

  return (
    <section className="hero">
      <div className="hero__grid" />
      <div className="hero__orb hero__orb--1" />
      <div className="hero__orb hero__orb--2" />
      <div className="hero__orb hero__orb--3" />
      <div className="hero__deco" aria-hidden="true">⚖</div>

      <div className="hero__pill">
        <span className="pill-dot" />
        AI · Legal · Advisory Platform
      </div>

      <h1 className="hero__title">
        Law Meets<br />
        <em>Intelligence</em>
        <span className="hero__subtitle-line">Your Legal Edge Starts Here</span>
      </h1>

      <p className="hero__desc">
        LegalLogic gives you instant AI legal advice, ML-powered case viability
        scoring, expense tracking, and verified advisors — all in one intelligent
        platform.
      </p>

      <div className="hero__btns">
        <button className="hbtn-primary">⚖️ Start Your Case</button>
      </div>

      <div className="hero__stats">
        {[
          { label: "Cases Analyzed" },
          { label: "ML Accuracy" },
          { label: "Verified Advisors" },
          { label: "Legal Domains" },
        ].map((s, i) => (
          <>
            {i > 0 && <div className="stat-divider" key={`div-${i}`} />}
            <div className="stat" key={s.label}>
              <span className="stat__num" ref={(el) => (nums.current[i] = el)}>0</span>
              <span className="stat__label">{s.label}</span>
            </div>
          </>
        ))}
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const AiPreview = () => (
  <div className="ai-section">
    <div className="ai-card">
      <div className="ai-card__bar">
        <span className="winbtn" style={{ background: "#ff6b6b" }} />
        <span className="winbtn" style={{ background: "#fbbf24", marginLeft: 6 }} />
        <span className="winbtn" style={{ background: "#34d399", marginLeft: 6 }} />
        <span className="ai-card__title">LegalLogic AI Advisor</span>
        <span className="ai-live"><span className="ai-live__dot" />LIVE SESSION</span>
      </div>
      <div className="ai-card__body">
        <div className="ai-col ai-col--query">
          <div className="ai-col__tag ai-col__tag--gold">▸ Your Query</div>
          <div className="ai-meta">
            <span className="ai-chip">Corporate Law</span>
            <span className="ai-chip">India · MCA</span>
          </div>
          <p className="ai-q">
            "My co-founder stopped contributing after 6 months but is still
            claiming the full equity vesting we agreed on. Our agreement was
            signed 18 months ago. What are my options and how strong is my case?"
          </p>
        </div>
        <div className="ai-col ai-col--response">
          <div className="ai-col__tag ai-col__tag--blue">
            <span className="typing-dots">
              <span /><span /><span />
            </span>
            LegalLogic AI
          </div>
          <div className="ai-a">
            Based on your description, you have a{" "}
            <strong className="highlight">strong case for breach of contract</strong>{" "}
            under the Indian Contract Act, 1872.
            <br /><br />
            <strong>Key Points:</strong><br />
            • Vesting agreements are fully enforceable — courts uphold cliff & vesting provisions.<br />
            • Non-performance clauses may void their unvested equity entirely.<br />
            • Remedies include <strong>specific performance</strong> or monetary damages (§§10–17).
            <br /><br />
            <strong>Action:</strong> Send a legal notice within 30 days, preserve all communication
            records, and engage a corporate attorney.{" "}
            <span className="highlight">Viability score: 78/100.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: "⚖️", title: "AI Legal Advice",
    desc: "Jurisdiction-aware guidance across 14 legal domains. Ask anything — criminal, family, corporate, IP, employment — and get structured answers instantly.",
    badge: "GPT-4 Turbo · RAG", cls: "a",
  },
  {
    icon: "🔬", title: "Case Viability ML",
    desc: "Our model trained on 200K+ outcomes analyzes your facts, jurisdiction, evidence strength, and opposition to give a probability-based viability score.",
    badge: "ML Model v2.6", cls: "b",
  },
  {
    icon: "📍", title: "Nearby Advisors",
    desc: "Discover and book verified legal professionals in your city. Filter by specialty, rating, availability, and fee. Integrated Google Maps with live slots.",
    badge: "Live · Maps API", cls: "c",
  },
  {
    icon: "💰", title: "Expense Tracker",
    desc: "Track every legal cost — attorney fees, filings, expert witnesses, travel — with smart categorization, budget alerts, and exportable PDF/CSV reports.",
    badge: "Multi-Currency", cls: "d",
  },
  {
    icon: "📄", title: "Document Analysis",
    desc: "Upload contracts, FIRs, or agreements and receive instant AI analysis — key clauses, risk flags, obligations, deadlines, and plain-language summaries.",
    badge: "OCR + NLP", cls: "e",
  },
  {
    icon: "🛡️", title: "Case Management",
    desc: "Manage all cases in one encrypted dashboard — timelines, court dates, reminders, advisor notes, and secure document storage with version control.",
    badge: "E2E Encrypted", cls: "f",
  },
];

const Features = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="features section" id="features">
      <div className="section__eyebrow">Core Capabilities</div>
      <h2 className="section__title">Built for every step of your <em>legal journey</em></h2>
      <p className="section__desc">From instant AI guidance to real-world attorney connections — LegalLogic covers the full lifecycle of your case.</p>
      <div className={`feat-grid ${visible ? "feat-grid--visible" : ""}`} ref={ref}>
        {features.map((f, i) => (
          <div className={`fc fc--${f.cls}`} key={f.title} style={{ "--delay": `${i * 0.08}s` }}>
            <div className={`fc__icon fc__icon--${f.cls}`}>{f.icon}</div>
            <h3 className="fc__title">{f.title}</h3>
            <p className="fc__desc">{f.desc}</p>
            <span className={`fc__badge fc__badge--${f.cls}`}>{f.badge}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const factors = [
  { name: "Evidence Strength", val: 82, color: "var(--gold)" },
  { name: "Legal Precedent",   val: 74, color: "var(--blue)" },
  { name: "Documentation",     val: 90, color: "var(--teal)" },
  { name: "Opposition Risk",   val: 38, color: "var(--rose)" },
  { name: "Jurisdiction Fit",  val: 68, color: "var(--violet)" },
];

const Viability = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const r = 70, circ = 2 * Math.PI * r;
  const offset = circ * (1 - 0.75); // 75%

  return (
    <section className="viability section" id="case-analysis">
      <div className={`viability__inner reveal ${visible ? "reveal--on" : ""}`} ref={ref}>
        <div className="viability__copy">
          <div className="section__eyebrow">ML-Powered Analysis</div>
          <h2 className="section__title">Know your odds <em>before you file</em></h2>
          <p className="section__desc">Our model evaluates 40+ signals — jurisdiction precedents, evidence weight, case type history — to give you an honest viability score.</p>
          <ul className="viability__list">
            {["Trained on 200,000+ historical case outcomes",
              "Jurisdiction-specific model variants (India, US, UK)",
              "94% accuracy on held-out validation data",
              "Explains key factors — not a black-box score",
              "Updates automatically as you add evidence",
            ].map((t) => <li key={t}><span>✦</span> {t}</li>)}
          </ul>
        </div>

        <div className="v-ui">
          <div className="v-ui__top">
            <span className="v-ui__heading">Case Viability Report</span>
            <span className="v-live"><span className="ai-live__dot" />LIVE</span>
          </div>

          <div className="score-wrap">
            <div className="score-ring">
              <svg viewBox="0 0 168 168" width="168" height="168">
                <defs>
                  <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--gold)" />
                    <stop offset="100%" stopColor="var(--gold-lt)" />
                  </linearGradient>
                </defs>
                <circle className="ring-track" cx="84" cy="84" r={r} />
                <circle
                  className={`ring-fill ${visible ? "ring-fill--animate" : ""}`}
                  cx="84" cy="84" r={r}
                  stroke="url(#sg)"
                  strokeDasharray={circ}
                  strokeDashoffset={visible ? offset : circ}
                />
              </svg>
              <div className="score-center">
                <span className="score-num">75</span>
                <span className="score-lbl">VIABILITY</span>
              </div>
            </div>
          </div>

          <div className="v-factors">
            {factors.map((f) => (
              <div className="vf" key={f.name}>
                <span className="vf__name">{f.name}</span>
                <div className="vf__track">
                  <div
                    className={`vf__bar ${visible ? "vf__bar--animate" : ""}`}
                    style={{ "--bar-w": `${f.val}%`, "--bar-color": f.color }}
                  />
                </div>
                <span className="vf__val">{f.val}%</span>
              </div>
            ))}
          </div>

          <div className="v-verdict">
            <span>✅</span>
            <span>Verdict: <strong>Strong Case</strong> — Recommend proceeding with legal counsel.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const expenses = [
  { desc: "Retainer — Sharma & Associates", cat: "Attorney Fee", catCls: "a", date: "12 Jun 2025", amt: "₹1,20,000", paid: true },
  { desc: "High Court Filing Fee — Case No. HC-2025", cat: "Court Fee", catCls: "b", date: "18 Jun 2025", amt: "₹24,500", paid: true },
  { desc: "Forensic Accountant — Expert Witness", cat: "Expert", catCls: "e", date: "25 Jun 2025", amt: "₹75,000", paid: false },
  { desc: "Document Preparation & Notarization", cat: "Doc Prep", catCls: "c", date: "02 Jul 2025", amt: "₹12,000", paid: true },
];

const Expenses = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className={`expenses section reveal ${visible ? "reveal--on" : ""}`} id="expenses" ref={ref}>
      <div className="section__eyebrow">Legal Finance</div>
      <h2 className="section__title">Track every rupee of <em>your legal spend</em></h2>
      <p className="section__desc">Smart categorization, budget alerts, and clean exportable reports.</p>

      <div className="exp-card">
        <div className="exp-tabs">
          {["All Expenses", "Attorney Fees", "Court Costs", "Expert Witnesses"].map((t, i) => (
            <button className={`exp-tab ${i === 0 ? "exp-tab--on" : ""}`} key={t}>{t}</button>
          ))}
        </div>
        <div className="exp-summary">
          <div className="es"><span className="es__lbl">Total Spent</span><span className="es__val">₹2,84,500</span><span className="es__sub">Across 3 active cases</span></div>
          <div className="es"><span className="es__lbl">Budget Remaining</span><span className="es__val">₹1,15,500</span><span className="es__sub">71% of budget used</span></div>
          <div className="es"><span className="es__lbl">This Month</span><span className="es__val">₹48,000</span><span className="es__sub es__sub--up">▲ 12% from last month</span></div>
        </div>
        <div className="exp-table">
          <div className="er er--hd">
            <span>Description</span><span>Category</span><span>Date</span><span>Amount</span><span>Status</span>
          </div>
          {expenses.map((e) => (
            <div className="er" key={e.desc}>
              <span>{e.desc}</span>
              <span><span className={`cat cat--${e.catCls}`}>{e.cat}</span></span>
              <span className="er__date">{e.date}</span>
              <span className="er__amt">{e.amt}</span>
              <span className={`er__status er__status--${e.paid ? "paid" : "pending"}`}>
                <span className="sdot" />
                {e.paid ? "Paid" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const advisors = [
  { initials: "RS", name: "Ravi Sharma, LLB", spec: "Corporate & Commercial Law", dist: "1.2 km", rating: "4.9", avail: "AVAILABLE TODAY", cls: "a" },
  { initials: "PK", name: "Priya Krishnan, LLM", spec: "Criminal Defense & Civil Rights", dist: "2.7 km", rating: "4.8", avail: "AVAILABLE TODAY", cls: "b" },
  { initials: "AM", name: "Ananya Mehta, LLB", spec: "Family Law & Mediation", dist: "3.4 km", rating: "4.6", avail: "NEXT: TOMORROW 10AM", cls: "c" },
];

const Advisors = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="advisors-section section" id="find-advisors">
      <div className={`advisors__inner reveal ${visible ? "reveal--on" : ""}`} ref={ref}>
        <div>
          <div className="section__eyebrow">Find Legal Help</div>
          <h2 className="section__title">Verified advisors <em>near you</em></h2>
          <p className="section__desc" style={{ marginBottom: 36 }}>Filter by specialization, distance, rating, and availability. Book a slot in seconds — no cold calls, no waiting.</p>
          <div className="adv-list">
            {advisors.map((a) => (
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
          {/* ── SVG City Map ── */}
          <svg className="map-svg" viewBox="0 0 520 420" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mapDots" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.8" fill="currentColor" opacity="0.18"/>
              </pattern>
            </defs>

            {/* Base fill */}
            <rect width="520" height="420" className="map-base"/>

            {/* Dot texture */}
            <rect width="520" height="420" fill="url(#mapDots)" className="map-dots"/>

            {/* ── Parks / green areas ── */}
            <rect x="30"  y="28"  width="88" height="62" rx="6" className="map-park"/>
            <rect x="340" y="290" width="70" height="52" rx="6" className="map-park"/>
            <rect x="200" y="340" width="54" height="38" rx="4" className="map-park"/>
            <ellipse cx="430" cy="80" rx="38" ry="26" className="map-park"/>

            {/* ── Water body ── */}
            <path d="M0 310 Q60 290 110 310 Q160 330 200 310 Q240 290 260 310 L260 420 L0 420 Z"
              className="map-water" opacity="0.7"/>

            {/* ── City blocks ── */}
            {/* Top-left cluster */}
            <rect x="30"  y="108" width="52" height="38" rx="3" className="map-block"/>
            <rect x="92"  y="108" width="36" height="38" rx="3" className="map-block"/>
            <rect x="30"  y="158" width="36" height="28" rx="3" className="map-block"/>
            <rect x="76"  y="158" width="52" height="28" rx="3" className="map-block"/>

            {/* Top-center cluster */}
            <rect x="158" y="28"  width="60" height="44" rx="3" className="map-block"/>
            <rect x="228" y="28"  width="44" height="44" rx="3" className="map-block"/>
            <rect x="158" y="82"  width="44" height="32" rx="3" className="map-block"/>
            <rect x="212" y="82"  width="60" height="32" rx="3" className="map-block"/>

            {/* Top-right cluster */}
            <rect x="302" y="28"  width="64" height="52" rx="3" className="map-block"/>
            <rect x="376" y="28"  width="46" height="32" rx="3" className="map-block"/>
            <rect x="432" y="28"  width="60" height="52" rx="3" className="map-block"/>
            <rect x="376" y="70"  width="46" height="32" rx="3" className="map-block"/>

            {/* Middle-left */}
            <rect x="30"  y="208" width="68" height="48" rx="3" className="map-block"/>
            <rect x="30"  y="266" width="44" height="34" rx="3" className="map-block"/>
            <rect x="84"  y="208" width="46" height="34" rx="3" className="map-block"/>

            {/* Center cluster — near "you" marker */}
            <rect x="158" y="138" width="54" height="40" rx="3" className="map-block-highlight"/>
            <rect x="222" y="138" width="40" height="40" rx="3" className="map-block-highlight"/>
            <rect x="158" y="188" width="40" height="30" rx="3" className="map-block"/>
            <rect x="208" y="188" width="54" height="30" rx="3" className="map-block"/>
            <rect x="158" y="228" width="68" height="42" rx="3" className="map-block"/>
            <rect x="236" y="228" width="36" height="42" rx="3" className="map-block"/>

            {/* Right cluster */}
            <rect x="302" y="118" width="52" height="46" rx="3" className="map-block"/>
            <rect x="364" y="118" width="64" height="46" rx="3" className="map-block"/>
            <rect x="438" y="118" width="54" height="46" rx="3" className="map-block"/>
            <rect x="302" y="174" width="36" height="38" rx="3" className="map-block"/>
            <rect x="348" y="174" width="80" height="38" rx="3" className="map-block"/>
            <rect x="302" y="222" width="58" height="52" rx="3" className="map-block"/>
            <rect x="370" y="222" width="50" height="52" rx="3" className="map-block"/>
            <rect x="430" y="174" width="62" height="100" rx="3" className="map-block"/>

            {/* Bottom cluster */}
            <rect x="84"  y="310" width="60" height="40" rx="3" className="map-block"/>
            <rect x="154" y="310" width="36" height="40" rx="3" className="map-block"/>
            <rect x="270" y="310" width="54" height="44" rx="3" className="map-block"/>
            <rect x="270" y="364" width="54" height="44" rx="3" className="map-block"/>
            <rect x="430" y="360" width="62" height="48" rx="3" className="map-block"/>

            {/* ── Major roads (thick) ── */}
            {/* Horizontal arterials */}
            <line x1="0"   y1="100" x2="520" y2="100" className="map-road-major"/>
            <line x1="0"   y1="200" x2="520" y2="200" className="map-road-major"/>
            <line x1="0"   y1="300" x2="520" y2="300" className="map-road-major"/>
            {/* Vertical arterials */}
            <line x1="140" y1="0"   x2="140" y2="420" className="map-road-major"/>
            <line x1="280" y1="0"   x2="280" y2="420" className="map-road-major"/>
            <line x1="420" y1="0"   x2="420" y2="420" className="map-road-major"/>

            {/* ── Minor roads ── */}
            <line x1="0"   y1="150" x2="520" y2="150" className="map-road-minor"/>
            <line x1="0"   y1="250" x2="520" y2="250" className="map-road-minor"/>
            <line x1="0"   y1="355" x2="520" y2="355" className="map-road-minor"/>
            <line x1="70"  y1="0"   x2="70"  y2="420" className="map-road-minor"/>
            <line x1="210" y1="0"   x2="210" y2="420" className="map-road-minor"/>
            <line x1="350" y1="0"   x2="350" y2="420" className="map-road-minor"/>
            <line x1="490" y1="0"   x2="490" y2="420" className="map-road-minor"/>

            {/* ── Diagonal road ── */}
            <line x1="0" y1="420" x2="260" y2="80"  className="map-road-diag"/>
            <line x1="280" y1="420" x2="520" y2="160" className="map-road-diag"/>

            {/* ── Road center lines ── */}
            <line x1="0"   y1="100" x2="520" y2="100" className="map-road-center"/>
            <line x1="0"   y1="200" x2="520" y2="200" className="map-road-center"/>
            <line x1="140" y1="0"   x2="140" y2="420" className="map-road-center"/>
            <line x1="280" y1="0"   x2="280" y2="420" className="map-road-center"/>

            {/* ── Park labels ── */}
            <text x="74"  y="64"  className="map-label-park">City Park</text>
            <text x="430" y="84"  className="map-label-park">Garden</text>

            {/* ── Road name labels ── */}
            <text x="80"  y="96"  className="map-label-road">MG Road</text>
            <text x="300" y="96"  className="map-label-road">Brigade Rd</text>
            <text x="155" y="196" className="map-label-road">Residency Rd</text>
            <text x="136" y="170" className="map-label-road" transform="rotate(-90, 136, 170)">Lavelle Rd</text>
            <text x="276" y="130" className="map-label-road" transform="rotate(-90, 276, 130)">Church St</text>

            {/* ── "You are here" pulse ── */}
            <circle cx="230" cy="210" r="14" className="map-you-pulse"/>
            <circle cx="230" cy="210" r="9"  className="map-you-pulse-2"/>
            <circle cx="230" cy="210" r="5"  className="map-you-dot"/>
          </svg>

          {/* ── Floating pin overlays ── */}
          {[
            { top: "33%", left: "54%", label: "Ravi Sharma · 1.2km", color: "var(--gold)",   delay: "0s"    },
            { top: "56%", left: "70%", label: "Priya K. · 2.7km",    color: "var(--blue)",   delay: "-.7s"  },
            { top: "18%", left: "26%", label: "Ananya M. · 3.4km",   color: "var(--teal)",   delay: "-1.4s" },
            { top: "70%", left: "18%", label: "D. Nair · 4.1km",     color: "var(--violet)", delay: "-2s"   },
          ].map((p) => (
            <div className="map-pin" style={{ top: p.top, left: p.left, animationDelay: p.delay }} key={p.label}>
              <div className="pin-head" style={{ background: p.color }} />
              <div className="pin-chip">{p.label}</div>
            </div>
          ))}

          <div className="map-footer">📍 Bengaluru, Karnataka — 12 advisors nearby</div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const testimonials = [
  {
    text: "LegalLogic's AI gave me a clear picture of my wrongful termination case within minutes. The viability score was 81 — my lawyer later confirmed it was a strong case. We won.",
    name: "Vikram Nair", role: "Employment Law Case · Bengaluru", cls: "a",
  },
  {
    text: "The expense tracker alone saved me so much stress. I could see exactly where our legal budget was going, set limits, and export reports for our CFO. Absolutely essential.",
    name: "Sunita Rao", role: "Corporate Dispute · Mumbai", cls: "b",
  },
  {
    text: "Found a brilliant family law attorney 2 km from my home in under 3 minutes. The booking was seamless — no back and forth, no wasted time. Incredible product.",
    name: "Arjun Kapoor", role: "Family Law · Delhi", cls: "c",
  },
];

const Testimonials = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className={`testi section reveal ${visible ? "reveal--on" : ""}`} ref={ref}>
      <div className="section__eyebrow">Client Stories</div>
      <h2 className="section__title">Trusted by thousands across <em>India</em></h2>
      <div className="testi-grid">
        {testimonials.map((t, i) => (
          <div className="tc" key={t.name} style={{ "--delay": `${i * 0.12}s` }}>
            <div className="tc__quote">"</div>
            <div className="tc__stars">★★★★★</div>
            <p className="tc__text">{t.text}</p>
            <div className="tc__author">
              <div className={`tc__av tc__av--${t.cls}`}>{t.name.split(" ").map(w => w[0]).join("")}</div>
              <div>
                <div className="tc__name">{t.name}</div>
                <div className="tc__role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const CTA = () => (
  <section className="cta-section">
    <div className="cta-glow" />
    <div className="cta-ring cta-ring--1" />
    <div className="cta-ring cta-ring--2" />
    <h2 className="cta-title">Your legal edge starts with <em>LegalLogic</em></h2>
    <p className="cta-desc">Join thousands who've taken control of their legal journey — with AI, data, and expert advisors on their side.</p>
    <div className="cta-btns">
      <button className="cbtn-primary">⚖️ Start Free Today</button>
    </div>
    <div className="cta-trust">
      {["Free AI advice "].map((t) => (
        <span key={t}>{t}</span>
      ))}
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer className="footer">
    <div className="footer__grid">
      <div className="footer__brand">
        <div className="fg-brand">
          <div className="brand-mark">LL</div>
          <span className="brand-name">Legal<strong>Logic</strong></span>
        </div>
        <p className="footer__desc">An AI-powered legal advisory platform built for individuals, startups, and businesses navigating the Indian legal system.</p>
        <div className="footer__socials">
        </div>
      </div>
      {[
      ].map((col) => (
        <div key={col.title}>
          <div className="footer__col-title">{col.title}</div>
          <ul className="footer__links">
            {col.links.map((l) => <li key={l}><a href="#">{l}</a></li>)}
          </ul>
        </div>
      ))}
    </div>
    <div className="footer__bottom">
      <span>© 2025 LegalLogic Technologies Pvt. Ltd. · All rights reserved.</span>
      <span className="footer__disc">LegalLogic provides legal information, not legal advice. Always consult a qualified, licensed attorney for legal decisions. AI-generated content does not constitute a lawyer-client relationship.</span>
    </div>
  </footer>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HomePage() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  return (
    <div className="app">
      <Navbar />
      <Hero />
      <AiPreview />
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