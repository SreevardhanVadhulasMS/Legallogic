import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../page/Dashboard.css";

// ⚠️ Crucial React-Leaflet fix for Vite: Load default marker imagery explicitly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

const FindAdvisors = () => {
  const navigate = useNavigate();
  const [filterSpec, setFilterSpec] = useState("all");
  const [filterLocation, setFilterLocation] = useState("within-5km");
  const [advisors, setAdvisors] = useState([]);

  useEffect(() => {
const mockAdvisors = [
      { id: "adv-001", name: "B. V. Acharya", specialty: "Corporate Law", rating: 4.9, reviews: 154, distance: "2.1 km", availability: "Available", location: "Jayamahal Ext", address: "No.42, 5th Main", email: "BVACHARYA@GMAIL.COM", phone: "080-23331588", avatarColor: "var(--gold)", coords: [12.998, 77.592] },
      { id: "adv-002", name: "Vijaya Shankar S", specialty: "Criminal Defense", rating: 4.8, reviews: 112, distance: "3.4 km", availability: "Available", location: "Abshot Layout", address: "# 23, Sankey Road Cross", email: "VSALAW@YAHOO.COM", phone: "98455 96216", avatarColor: "var(--blue)", coords: [12.992, 77.585] },
      { id: "adv-003", name: "G. Sarangan", specialty: "Property Law", rating: 4.7, reviews: 89, distance: "1.5 km", availability: "Not Available", location: "Millers Road", address: "No. 63/2, Millers Road", email: "Contact", phone: "99001 37508", avatarColor: "var(--teal)", coords: [12.986, 77.595] },
      { id: "adv-004", name: "T. R. Subbanna", specialty: "Family Law", rating: 4.6, reviews: 104, distance: "4.2 km", availability: "Available", location: "Vijayanagar", address: "No.25, Meghasandesha", email: "TRSUBBANNA2016@GMAIL.COM", phone: "98452 44631", avatarColor: "var(--violet)", coords: [12.971, 77.536] },
      { id: "adv-005", name: "H. Subramanya Jois", specialty: "Civil Rights", rating: 4.9, reviews: 201, distance: "3.8 km", availability: "Available", location: "Shankarpuram", address: "No.36, Vagdevi", email: "Contact", phone: "94482 78209", avatarColor: "var(--rose)", coords: [12.951, 77.575] },
      { id: "adv-006", name: "S. S. Ramdas", specialty: "Corporate Law", rating: 4.8, reviews: 120, distance: "2.5 km", availability: "Available", location: "Gandhinagar", address: "No.34, Kalidasa Road", email: "RAMDAS@SUNDARASWAMY.COM", phone: "98440 42333", avatarColor: "var(--gold)", coords: [12.978, 77.573] },
      { id: "adv-007", name: "K. Subba Rao", specialty: "Employment Law", rating: 4.5, reviews: 67, distance: "2.6 km", availability: "Available", location: "Gandhinagar", address: "No.27, 1st Main Road", email: "KSUBBAR435@GMAIL.COM", phone: "98450 25568", avatarColor: "var(--blue)", coords: [12.977, 77.575] },
      { id: "adv-008", name: "M.V. Devaraju", specialty: "Property Law", rating: 4.4, reviews: 45, distance: "1.2 km", availability: "Not Available", location: "Avenue Road", address: "# 103-F, Krishna Building", email: "GURUDARSHINI@HOTMAIL.COM", phone: "98440 69953", avatarColor: "var(--teal)", coords: [12.969, 77.580] },
      { id: "adv-009", name: "A. G. Holla", specialty: "Corporate Law", rating: 4.9, reviews: 178, distance: "6.5 km", availability: "Available", location: "RMV II Stage", address: "No.50, Shree Saila", email: "SHAILAHOLLA@YAHOO.COM", phone: "9632965262", avatarColor: "var(--violet)", coords: [13.033, 77.570] },
      { id: "adv-010", name: "H. N. Narayana", specialty: "Family Law", rating: 4.6, reviews: 92, distance: "6.8 km", availability: "Available", location: "RMV II Stage", address: "No.6, Aditya, I Main", email: "NARAYANHN.NARAYAN@GMAIL.COM", phone: "98453 91851", avatarColor: "var(--rose)", coords: [13.030, 77.572] },
      { id: "adv-011", name: "K. Kasturi", specialty: "Criminal Defense", rating: 4.8, reviews: 110, distance: "4.1 km", availability: "Available", location: "Basavanagudi", address: "No. 54/3, I Floor", email: "KSBY@KASTURIASSOCIATES.COM", phone: "9341967931", avatarColor: "var(--gold)", coords: [12.942, 77.572] },
      { id: "adv-012", name: "Padmanabha Mahale", specialty: "Civil Rights", rating: 4.7, reviews: 130, distance: "3.5 km", availability: "Available", location: "Malleswaram", address: "No.60, Flat No.2", email: "PADMANABHAMAHALE@GMAIL.COM", phone: "93412 13941", avatarColor: "var(--blue)", coords: [13.006, 77.569] },
      { id: "adv-013", name: "S. P. Shankar", specialty: "Corporate Law", rating: 4.8, reviews: 145, distance: "4.3 km", availability: "Available", location: "Basavanagudi", address: "No.1/01, New No.3", email: "SHANKARSP1208@GMAIL.COM", phone: "94498 32060", avatarColor: "var(--teal)", coords: [12.940, 77.575] },
      { id: "adv-014", name: "Pramila Nesargi", specialty: "Family Law", rating: 4.9, reviews: 290, distance: "5.1 km", availability: "Available", location: "Indiranagar", address: "No.844/A, 100 Ft Rd", email: "PRAMILAASSOCIATES007@GMAIL.COM", phone: "98861 30055", avatarColor: "var(--violet)", coords: [12.978, 77.640] },
      { id: "adv-015", name: "K. P. Kumar", specialty: "Corporate Law", rating: 4.7, reviews: 88, distance: "1.0 km", availability: "Not Available", location: "Lavelle Road", address: "No.48, Lavelle Road", email: "KPKUMAR@KARNATAKA.COM", phone: "98450 39039", avatarColor: "var(--rose)", coords: [12.971, 77.596] },
      { id: "adv-016", name: "Udaya Holla", specialty: "Corporate Law", rating: 4.9, reviews: 310, distance: "1.1 km", availability: "Available", location: "Cubbon Road", address: "No.8, Cubbon Road", email: "UDAYAHOLLA@GMAIL.COM", phone: "98868 35343", avatarColor: "var(--gold)", coords: [12.980, 77.600] },
      { id: "adv-017", name: "Srinivas N. Murthy", specialty: "Property Law", rating: 4.6, reviews: 105, distance: "5.5 km", availability: "Available", location: "Jayanagar", address: "No.27/7, II Floor", email: "SNMSENIORADVOCATE@GMAIL.COM", phone: "93428 23628", avatarColor: "var(--blue)", coords: [12.929, 77.582] },
      { id: "adv-018", name: "Jayakumar S. Patil", specialty: "Criminal Defense", rating: 4.8, reviews: 175, distance: "5.8 km", availability: "Available", location: "R. T. Nagar", address: "No.9, Nandi View Layout", email: "JAYAKUMARSPATIL@GMAIL.COM", phone: "94484 77498", avatarColor: "var(--teal)", coords: [13.024, 77.595] },
      { id: "adv-019", name: "Ravivarma Kumar", specialty: "Civil Rights", rating: 4.9, reviews: 260, distance: "7.2 km", availability: "Available", location: "Hebbal", address: "#275, NALANDA", email: "PROFRAVIVARMA@GMAIL.COM", phone: "98452 03090", avatarColor: "var(--violet)", coords: [13.045, 77.595] },
      { id: "adv-020", name: "S. S. Naganand", specialty: "Corporate Law", rating: 4.9, reviews: 330, distance: "2.4 km", availability: "Not Available", location: "Gandhinagar", address: "No.24, Kalidasa Road", email: "NAGANAND@JUSTLAW.CO.IN", phone: "98450 22660", avatarColor: "var(--rose)", coords: [12.977, 77.574] },
      { id: "adv-021", name: "Jaya Vitaal Rao Kolar", specialty: "Property Law", rating: 4.7, reviews: 110, distance: "6.2 km", availability: "Available", location: "Rajajinagar", address: "B204, Pride Pavillion", email: "JVKOLAR@GMAIL.COM", phone: "94483 71706", avatarColor: "var(--gold)", coords: [12.990, 77.551] },
      { id: "adv-022", name: "D. L.N. Rao", specialty: "Corporate Law", rating: 4.6, reviews: 95, distance: "6.9 km", availability: "Available", location: "RMV II Stage", address: "No.9, AECS Layout", email: "ESSEXLLM@YAHOO.COM", phone: "9845031934", avatarColor: "var(--blue)", coords: [13.031, 77.570] },
      { id: "adv-023", name: "M. S. Rajendra Prasad", specialty: "Family Law", rating: 4.8, reviews: 155, distance: "7.1 km", availability: "Available", location: "Jayanagar", address: "No. 42/30, 9th Block", email: "RPATTORNEYIND@GMAIL.COM", phone: "9448478066", avatarColor: "var(--teal)", coords: [12.920, 77.585] },
      { id: "adv-024", name: "Devadas N", specialty: "Civil Rights", rating: 4.5, reviews: 75, distance: "6.4 km", availability: "Available", location: "Ganganagar", address: "No.217, 4th Main", email: "NDEVADAS.SRADVOCATE@GMAIL.COM", phone: "94488 32095", avatarColor: "var(--violet)", coords: [13.025, 77.589] },
      { id: "adv-025", name: "D. N. Nanjunda Reddy", specialty: "Corporate Law", rating: 4.9, reviews: 280, distance: "1.8 km", availability: "Not Available", location: "Mission Road", address: "No.19/1, I floor", email: "DNNOFFICE@GMAIL.COM", phone: "98453 44134", avatarColor: "var(--rose)", coords: [12.960, 77.595] },
      { id: "adv-026", name: "S. K. V. Chalapathy", specialty: "Property Law", rating: 4.8, reviews: 130, distance: "2.3 km", availability: "Available", location: "Gandhinagar", address: "# 21-22, 3rd Main", email: "CANDSADVOCATES@GMAIL.COM", phone: "98805 33448", avatarColor: "var(--gold)", coords: [12.979, 77.575] },
      { id: "adv-027", name: "B. G. Sridharan", specialty: "Criminal Defense", rating: 4.7, reviews: 90, distance: "1.9 km", availability: "Available", location: "Madhavanagar", address: "# 24, Yamunabai Road", email: "KISH886@GMAIL.COM", phone: "99018 43908", avatarColor: "var(--blue)", coords: [12.989, 77.581] },
      { id: "adv-028", name: "E. R. Indrakumar", specialty: "Family Law", rating: 4.6, reviews: 115, distance: "3.2 km", availability: "Available", location: "Chamarajapet", address: "# 118/1, Ist Floor", email: "ELKAL.INDRAKUMAR@GMAIL.COM", phone: "98866 04588", avatarColor: "var(--teal)", coords: [12.960, 77.565] },
      { id: "adv-029", name: "Urval N. Ramanand", specialty: "Corporate Law", rating: 4.5, reviews: 55, distance: "6.7 km", availability: "Available", location: "Anandnagar", address: "13, RBI Colony", email: "URVAL.NR@GMAIL.COM", phone: "99865 69462", avatarColor: "var(--violet)", coords: [13.028, 77.592] },
      { id: "adv-030", name: "Tomy Sebastian", specialty: "Criminal Defense", rating: 4.9, reviews: 210, distance: "6.0 km", availability: "Available", location: "Kodihalli", address: "511, Vars Fantasy", email: "ALWYNSEBASTIAN176@GMAIL.COM", phone: "99809 22551", avatarColor: "var(--rose)", coords: [12.960, 77.638] },
      { id: "adv-031", name: "K. G. Raghavan", specialty: "Corporate Law", rating: 4.9, reviews: 340, distance: "1.6 km", availability: "Available", location: "Madhavanagar", address: "No.51, Kumarakrupa", email: "KGRAGHAVAN@GMAIL.COM", phone: "98450 23803", avatarColor: "var(--gold)", coords: [12.990, 77.585] },
      { id: "adv-032", name: "Madhusudan R. Naik", specialty: "Civil Rights", rating: 4.8, reviews: 165, distance: "7.0 km", availability: "Available", location: "Dollars Colony", address: "# 57, I A Main", email: "SURAJNAIK046@GMAIL.COM", phone: "9845028044", avatarColor: "var(--blue)", coords: [13.033, 77.578] },
      { id: "adv-033", name: "P. S. Rajagopal", specialty: "Employment Law", rating: 4.7, reviews: 150, distance: "8.5 km", availability: "Available", location: "BTM Layout", address: "#56, AICOBOO Nagar", email: "PS_RAJAGOPAL@YAHOO.CO.IN", phone: "99800 68926", avatarColor: "var(--teal)", coords: [12.916, 77.610] },
      { id: "adv-034", name: "M. Sivappa", specialty: "Property Law", rating: 4.6, reviews: 125, distance: "2.5 km", availability: "Available", location: "Gandhinagar", address: "No.20, Jalashambavi", email: "SIVAPPASENIOR@GMAIL.COM", phone: "94482 08552", avatarColor: "var(--violet)", coords: [12.978, 77.575] },
      { id: "adv-035", name: "S. Sreevatsa", specialty: "Corporate Law", rating: 4.8, reviews: 200, distance: "5.5 km", availability: "Available", location: "Indiranagar", address: "No.50, 10th Main", email: "INDIALEX@HOTMAIL.COM", phone: "98480 02898", avatarColor: "var(--rose)", coords: [12.978, 77.641] },
      { id: "adv-036", name: "Ashok Haranahalli", specialty: "Criminal Defense", rating: 4.9, reviews: 285, distance: "7.5 km", availability: "Available", location: "RMV II Stage", address: "No. 558, 1st Main", email: "HARANAHALLI@GMAIL.COM", phone: "98451 85055", avatarColor: "var(--gold)", coords: [13.032, 77.573] },
      { id: "adv-037", name: "C. V. Nagesh", specialty: "Criminal Defense", rating: 4.9, reviews: 310, distance: "4.5 km", availability: "Available", location: "Basavanagudi", address: "No.33, Gange", email: "AJAYTKADKOL@GMAIL.COM", phone: "98456 77779", avatarColor: "var(--blue)", coords: [12.941, 77.574] },
      { id: "adv-038", name: "Sajan Poovayya", specialty: "Corporate Law", rating: 4.9, reviews: 350, distance: "2.1 km", availability: "Available", location: "Dickenson Road", address: "121, The Estate", email: "SAJAN@POOVAYYA.NET", phone: "98459 77447", avatarColor: "var(--teal)", coords: [12.981, 77.618] },
      { id: "adv-039", name: "K. N. Phanindra", specialty: "Civil Rights", rating: 4.7, reviews: 145, distance: "1.9 km", availability: "Available", location: "Cunningham Rd", address: "No.37/3, Kalyan", email: "Contact", phone: "98450 62273", avatarColor: "var(--violet)", coords: [12.986, 77.595] },
      { id: "adv-040", name: "Jayna Kothari", specialty: "Civil Rights", rating: 4.9, reviews: 220, distance: "5.2 km", availability: "Available", location: "Indiranagar", address: "No. 899, 7th Main", email: "Jayna.kothari@gmail.com", phone: "98453 27444", avatarColor: "var(--rose)", coords: [12.973, 77.640] }
    ];
    setAdvisors(mockAdvisors);
  }, []);

  const filteredAdvisors = advisors.filter(advisor => {
    if (filterSpec !== "all" && advisor.specialty !== filterSpec) return false;
    
    const distNum = parseFloat(advisor.distance);
    if (filterLocation === "within-5km" && distNum > 5) return false;
    if (filterLocation === "within-10km" && distNum > 10) return false;
    
    return true;
  });  const specialties = ["all", "Corporate Law", "Criminal Defense", "Family Law", "Property Law", "Employment Law", "Civil Rights"];

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const SvgSignOut = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );

  return (
    <div className="ll-wrap">
      {/* NAV */}
      <nav className="ll-nav">
        <Link to="/dashboard" className="ll-logo">Legal<em>Logic</em></Link>
        <div className="ll-nav-actions">
          <Link to="/dashboard" className="ll-ghost" style={{ border: "none" }}>Dashboard</Link>
          <button className="ll-ghost" onClick={logout}>Sign out <SvgSignOut /></button>
        </div>
      </nav>

      {/* HEADER */}
      <header className="ll-intro" style={{ marginBottom: "2.5rem" }}>
        <p className="ll-label">Verified Professionals</p>
        <h1 className="ll-h1">Discover nearby legal advisors</h1>
        <p className="ll-desc">Browse our curated directory of practicing senior advocates in your jurisdiction based on case specialty and rating.</p>
      </header>

      {/* Filters */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", alignItems: "center" }}>
        <select 
          value={filterSpec} 
          onChange={(e) => setFilterSpec(e.target.value)}
          className="ll-input"
          style={{ maxWidth: "250px" }}
        >
          {specialties.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>

        <select 
          value={filterLocation} 
          onChange={(e) => setFilterLocation(e.target.value)}
          className="ll-input"
          style={{ maxWidth: "250px" }}
        >
          <option value="within-5km">Within 5km</option>
          <option value="within-10km">Within 10km</option>
          <option value="all-locations">All locations</option>
        </select>
        
        <div style={{ flex: 1 }} />
        <span style={{ color: "#a4a4a0", fontSize: "0.95rem" }}>
          Showing {filteredAdvisors.length} advisors matching criteria
        </span>
      </div>

      {/* Interactive Leaflet Map */}
      <div className="ll-panel" style={{ height: "450px", marginBottom: "3rem", padding: 0, overflow: "hidden", position: "relative" }}>
        {/* Map Header Overlay */}
        <div style={{
          position: "absolute", top: "15px", right: "15px", 
          background: "white", padding: "0.5rem 1rem", borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)", fontSize: "0.85rem", color: "#1a1a1a", 
          zIndex: 1000, display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "500",
          fontFamily: "Geist, sans-serif"
        }}>
          🗺️ {filteredAdvisors.length} Verified Advisors shown
        </div>

        {/* Map Container */}
        <MapContainer 
          center={[12.9716, 77.5946]} 
          zoom={12} 
          scrollWheelZoom={true} 
          style={{ height: "100%", width: "100%", zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredAdvisors.map(adv => (
            <Marker position={adv.coords} key={adv.id}>
              <Popup>
                <div style={{ fontFamily: "Outfit, sans-serif", padding: "4px" }}>
                  <strong style={{ fontSize: "1.1rem", color: "var(--text)" }}>{adv.name}</strong><br/>
                  <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{adv.specialty}</span><br/>
                  <div style={{ margin: "6px 0", color: "var(--gold)", fontWeight: "500" }}>⭐ {adv.rating} ({adv.reviews} reviews)</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text)" }}>📍 {adv.distance} — {adv.location}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Advisors List */}
      <div style={{ display: "grid", gap: "1.25rem", marginBottom: "2rem" }}>
        {filteredAdvisors.map((advisor) => (
          <div key={advisor.id} className="ll-panel" style={{ padding: "2rem", display: "flex", alignItems: "center", gap: "2rem", marginBottom: 0 }}>
            {/* Minimal Avatar */}
            <div style={{ width: "64px", height: "64px", borderRadius: "8px", background: "#f2f2ef", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Instrument Serif, serif", fontSize: "1.75rem", color: "#1a1a1a" }}>
              {advisor.name.split(" ").slice(0, 2).map(n => n[0]).join("")}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "0.25rem" }}>
                <h3 style={{ fontFamily: "Instrument Serif, serif", fontSize: "1.8rem", margin: 0, fontWeight: 400, color: "#1a1a1a" }}>{advisor.name}</h3>
                <span className="ll-pill" style={{ color: "#8c7a5e", border: "none", background: "#fcfaf6" }}>
                  {advisor.specialty}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", color: "#6b6b6b", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                <span><strong style={{ color: "#1a1a1a" }}>★ {advisor.rating}</strong> <span style={{ color: "#a4a4a0" }}>({advisor.reviews})</span></span>
                <span style={{ color: "#e2e2de" }}>|</span>
                <span>{advisor.distance} — {advisor.location}</span>
                <span style={{ color: "#e2e2de" }}>|</span>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.8rem", color: advisor.availability === "Available" ? "#2d7a4e" : "#b0b0aa" }}>
                  {advisor.availability}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: "140px" }}>
              <button 
                className="ll-cta"
                onClick={() => alert(`Booking consultation with ${advisor.name}...`)}
              >
                Inquire
              </button>
              <button className="ll-ghost" style={{ justifyContent: "center" }}>
                Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAdvisors.length === 0 && (
        <div className="ll-panel" style={{ textAlign: "center", padding: "4rem 2rem", color: "#6b6b6b" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem", opacity: 0.5 }}>⊘</div>
          <h3 style={{ fontFamily: "Instrument Serif, serif", fontSize: "1.5rem", color: "#1a1a1a", marginBottom: "0.5rem" }}>No advisors found</h3>
          <p>Try broadening your specialty or location preferences</p>
        </div>
      )}

    </div>
  );
};

export default FindAdvisors;
