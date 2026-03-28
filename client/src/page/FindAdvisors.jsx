import { useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import useReveal from "../hooks/useReveal";

const FindAdvisors = () => {
  useReveal();

  const [filterSpec, setFilterSpec] = useState("all");
  const [filterLocation, setFilterLocation] = useState("within-5km");

  const advisors = [
    { id: "adv-001", name: "Ravi Sharma, LLB",   specialty: "Corporate Law",    rating: 4.9, reviews: 127, distance: "1.2 km", availability: "Available now",     location: "Koramangala, Bangalore" },
    { id: "adv-002", name: "Priya Krishnan, LLM", specialty: "Criminal Defense", rating: 4.8, reviews: 89,  distance: "2.7 km", availability: "Next: 2PM today",   location: "Indiranagar, Bangalore" },
    { id: "adv-003", name: "Ananya Mehta, LLB",   specialty: "Family Law",       rating: 4.7, reviews: 156, distance: "3.4 km", availability: "Available tomorrow", location: "Jayanagar, Bangalore"   },
    { id: "adv-004", name: "Vikram Nair, LLM",    specialty: "Property Law",     rating: 4.9, reviews: 203, distance: "4.8 km", availability: "Available now",      location: "Whitefield, Bangalore"  },
    { id: "adv-005", name: "Sunita Rao, LLB",     specialty: "Employment Law",   rating: 4.6, reviews: 67,  distance: "1.8 km", availability: "Next: 4PM today",   location: "MG Road, Bangalore"     }
  ];

  const specialties = ["all", "Corporate Law", "Criminal Defense", "Family Law", "Property Law", "Employment Law"];
  const filteredAdvisors = advisors.filter(a => {
    if (filterSpec !== "all" && a.specialty !== filterSpec) return false;
    if (filterLocation === "within-5km" && parseFloat(a.distance) > 5) return false;
    return true;
  });
  const logout = () => { localStorage.removeItem("token"); window.location.href = "/login"; };

  return (
    <div className="ll-wrap">
      <nav className="ll-nav ll-reveal" data-ll>
        <Link to="/dashboard" className="ll-page-back">← Back to Dashboard</Link>
        <div className="ll-nav-actions">
          <Link to="/ai-summary" className="ll-cta">Analyze Case First</Link>
          <button className="ll-ghost" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <header className="ll-page-header ll-reveal" data-ll>
        <h1 className="ll-page-title">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--pur)" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Find Legal Advisors
        </h1>
      </header>

      <div className="ll-data-stats ll-reveal" data-ll>
        <div className="ll-data-stat"><span className="ll-data-stat-n">{filteredAdvisors.length}</span><span className="ll-data-stat-l">Verified Advisors</span></div>
        <div className="ll-data-stat"><span className="ll-data-stat-n">4.8</span><span className="ll-data-stat-l">Avg Rating</span></div>
        <div className="ll-data-stat"><span className="ll-data-stat-n">12</span><span className="ll-data-stat-l">Nearby (5km)</span></div>
      </div>

      <div className="ll-bar ll-reveal" data-ll style={{ marginBottom: "2rem" }}>
        <span>Filters</span>
        <div style={{ display: "flex", gap: "1rem" }}>
          <select value={filterSpec} onChange={(e) => setFilterSpec(e.target.value)} style={{ padding: "0.5rem 0.75rem", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", background: "var(--bg)" }}>
            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} style={{ padding: "0.5rem 0.75rem", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", background: "var(--bg)" }}>
            <option value="within-5km">Within 5km</option>
            <option value="within-10km">Within 10km</option>
            <option value="all-locations">All locations</option>
          </select>
        </div>
      </div>

      <div className="ll-data-grid ll-reveal" data-ll>
        {filteredAdvisors.map((advisor) => (
          <div key={advisor.id} className="ll-data-card">
            <div className="ll-data-meta">
              <span className="ll-data-id">{advisor.name.split(" ").map(n => n[0]).join("")}</span>
              <span>{advisor.distance} • {advisor.location}</span>
            </div>
            <h3 className="ll-data-title">{advisor.name}</h3>
            <div className="ll-data-meta">
              <span style={{ color: "var(--pur)" }}>★ {advisor.rating} ({advisor.reviews} reviews)</span>
              <span>{advisor.availability}</span>
            </div>
            <div className="ll-data-points">
              <div className="ll-data-point"><span className="ll-data-point-dot">📋</span><span>{advisor.specialty}</span></div>
            </div>
            <div className="ll-actions">
              <button className="ll-btn-primary" onClick={() => alert(`Booking ${advisor.name}...`)}>Book Consultation</button>
              <Link to="/case-management" className="ll-btn-secondary">Add to Case</Link>
            </div>
          </div>
        ))}
      </div>

      {filteredAdvisors.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted)" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
          <h3 style={{ fontSize: "1.5rem" }}>No advisors found</h3>
          <p>Try adjusting your filters or expanding your search radius</p>
        </div>
      )}
    </div>
  );
};

export default FindAdvisors;