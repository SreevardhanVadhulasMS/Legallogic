import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../page/Dashboard.css";

const FindAdvisors = () => {
  const navigate = useNavigate();
  const [filterSpec, setFilterSpec] = useState("all");
  const [filterLocation, setFilterLocation] = useState("within-5km");
  const [advisors, setAdvisors] = useState([]);

  useEffect(() => {
    // Mock advisors data
    const mockAdvisors = [
      {
        id: "adv-001",
        name: "Ravi Sharma, LLB",
        specialty: "Corporate Law",
        rating: 4.9,
        reviews: 127,
        distance: "1.2 km",
        availability: "Available now",
        location: "Koramangala, Bangalore",
        avatarColor: "var(--gold)"
      },
      {
        id: "adv-002",
        name: "Priya Krishnan, LLM",
        specialty: "Criminal Defense", 
        rating: 4.8,
        reviews: 89,
        distance: "2.7 km",
        availability: "Next: 2PM today",
        location: "Indiranagar, Bangalore",
        avatarColor: "var(--blue)"
      },
      {
        id: "adv-003",
        name: "Ananya Mehta, LLB",
        specialty: "Family Law",
        rating: 4.7,
        reviews: 156,
        distance: "3.4 km",
        availability: "Available tomorrow",
        location: "Jayanagar, Bangalore",
        avatarColor: "var(--teal)"
      },
      {
        id: "adv-004",
        name: "Vikram Nair, LLM",
        specialty: "Property Law",
        rating: 4.9,
        reviews: 203,
        distance: "4.8 km", 
        availability: "Available now",
        location: "Whitefield, Bangalore",
        avatarColor: "var(--violet)"
      },
      {
        id: "adv-005",
        name: "Sunita Rao, LLB",
        specialty: "Employment Law",
        rating: 4.6,
        reviews: 67,
        distance: "1.8 km",
        availability: "Next: 4PM today",
        location: "MG Road, Bangalore",
        avatarColor: "var(--rose)"
      }
    ];
    setAdvisors(mockAdvisors);
  }, []);

  const filteredAdvisors = advisors.filter(advisor => {
    if (filterSpec !== "all" && advisor.specialty !== filterSpec) return false;
    if (filterLocation === "within-5km" && parseFloat(advisor.distance) > 5) return false;
    return true;
  });

  const specialties = ["all", "Corporate Law", "Criminal Defense", "Family Law", "Property Law", "Employment Law"];

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard" style={{ maxWidth: "1400px" }}>
      {/* Header */}
      <header className="dashboard-header">
        <div style={{display: 'flex', flex: 1, alignItems: 'center', gap: '1.5rem'}}>
          <Link to="/dashboard" className="brand" style={{margin: 0}}>
            <div className="brand-mark">LL</div>
            <span className="brand-name">
              Legal<strong>Logic</strong> - Find Advisors
            </span>
          </Link>
          
        </div>
        <button className="logout-btn" onClick={logout}>Logout →</button>
      </header>

      {/* Filters */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: "1fr auto 1fr auto", gap: "1rem", marginBottom: "2rem" }}>
        <div className="dashboard-card" style={{ padding: "1.5rem" }}>
          <select 
            value={filterSpec} 
            onChange={(e) => setFilterSpec(e.target.value)}
            style={{
              width: "100%", padding: "0.75rem", border: "1px solid var(--border)",
              borderRadius: "0.5rem", background: "var(--surface)", fontSize: "1rem"
            }}
          >
            {specialties.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "var(--muted)", fontSize: "0.95rem", whiteSpace: "nowrap" }}>
            {filteredAdvisors.length} advisors
          </span>
        </div>
        <div className="dashboard-card" style={{ padding: "1.5rem" }}>
          <select 
            value={filterLocation} 
            onChange={(e) => setFilterLocation(e.target.value)}
            style={{
              width: "100%", padding: "0.75rem", border: "1px solid var(--border)",
              borderRadius: "0.5rem", background: "var(--surface)", fontSize: "1rem"
            }}
          >
            <option value="within-5km">Within 5km</option>
            <option value="within-10km">Within 10km</option>
            <option value="all-locations">All locations</option>
          </select>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="welcome-card" style={{ height: "300px", marginBottom: "2rem", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{
          position: "absolute", top: "20px", left: "20px", 
          background: "white", padding: "0.5rem 1rem", borderRadius: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: "0.85rem", color: "var(--muted)"
        }}>
          📍 Your location
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🗺️</div>
          <h3>Interactive Map Coming Soon</h3>
          <p>12 verified advisors nearby ({filteredAdvisors.length} filtered)</p>
        </div>
      </div>

      {/* Advisors List */}
      <div style={{ display: "grid", gap: "1.5rem", marginBottom: "2rem" }}>
        {filteredAdvisors.map((advisor) => (
          <div key={advisor.id} className="dashboard-card" style={{ display: "flex", alignItems: "center", padding: "2rem", gap: "1.5rem", position: "relative" }}>
            <div 
              className="dashboard-card-icon" 
              style={{ 
                width: "64px", height: "64px", borderRadius: "50%", 
                fontSize: "1.5rem", fontFamily: "'Playfair Display', serif",
                background: advisor.avatarColor
              }}
            >
              {advisor.name.split(" ").map(n => n[0]).join("")}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.4rem" }}>{advisor.name}</h3>
                <div style={{ 
                  color: advisor.avatarColor, 
                  fontFamily: "'JetBrains Mono', monospace", 
                  fontSize: "0.85rem", 
                  padding: "0.25rem 0.75rem",
                  borderRadius: "20px",
                  border: `1px solid ${advisor.avatarColor}`,
                  background: `color-mix(in srgb, ${advisor.avatarColor} 10%, transparent)`
                }}>
                  {advisor.specialty}
                </div>
              </div>
              <div style={{ display: "flex", gap: "1.5rem", color: "var(--muted)", fontSize: "0.95rem" }}>
                <div>★ {advisor.rating} ({advisor.reviews})</div>
                <div>{advisor.distance} • {advisor.location}</div>
                <div style={{ color: "var(--green)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}>
                  {advisor.availability}
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: "right" }}>
              <button 
                style={{
                  padding: "0.75rem 2rem",
                  background: advisor.avatarColor,
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginBottom: "0.5rem",
                  width: "100%"
                }}
                onClick={() => alert(`Booking consultation with ${advisor.name}...`)}
              >
                Book Now
              </button>
              <button 
                style={{
                  padding: "0.5rem 1rem",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  borderRadius: "0.375rem",
                  fontSize: "0.85rem",
                  cursor: "pointer"
                }}
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAdvisors.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted)" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
          <h3>No advisors match your filters</h3>
          <p>Try adjusting your specialty or location preferences</p>
        </div>
      )}

      {/* Action Bar */}
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <Link to="/dashboard">
          <button className="logout-btn" style={{ background: "var(--muted)" }}>← Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
};

export default FindAdvisors;

