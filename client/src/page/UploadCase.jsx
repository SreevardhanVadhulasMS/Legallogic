import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../page/Dashboard.css";

const SvgSignOut = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const UploadCase = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [caseText, setCaseText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles.slice(0, 3)]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles.slice(0, 3 - prev.length)]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!caseText.trim() && files.length === 0) {
      alert("Please upload a file or type some case details.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to upload cases.");
        navigate("/login");
        return;
      }

      const textToAnalyze = caseText.trim() || `Analyzing uploaded files: ${files.map(f => f.name).join(", ")}. Please assess viability based on these documents.`;
      
      const response = await fetch("http://localhost:5000/api/cases", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text: textToAnalyze })
      });

      if (!response.ok) throw new Error("Analysis failed");

      const result = await response.json();
      
      navigate("/ai-summary", { state: { newAnalysis: result } });
    } catch (error) {
      console.error(error);
      alert("Error during model analysis or saving case. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
      <header className="ll-intro" style={{ marginBottom: "2rem" }}>
        <p className="ll-label">Document Analysis</p>
        <h1 className="ll-h1">Upload Case Files</h1>
        <p className="ll-desc">Drop your contracts, FIRs, or agreements below for instant OCR and jurisdiction-aware ML analysis.</p>
      </header>

      {/* UPLOAD PANEL */}
      <div 
        className={`ll-panel ${dragActive ? "drag-active" : ""}`}
        style={{
          border: dragActive ? "2px dashed #1a1a1a" : "1px dashed #d4d4ce", 
          textAlign: "center",
          cursor: "pointer",
          padding: "4rem 2rem",
          transition: "all 0.2s ease"
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input").click()}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#1a1a1a" }}>+</div>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 500, color: "#1a1a1a", marginBottom: "0.5rem" }}>Click to upload or drag and drop</h3>
        <p style={{ color: "#a4a4a0", fontSize: "0.9rem" }}>PDF, DOCX, or images (max 10MB per file)</p>
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </div>

      {files.length > 0 && (
        <div className="ll-panel">
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Selected Files</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {files.map((file, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1rem", border: "1px solid #e2e2de", background: "#fdfcfc", borderRadius: "8px" }}>
                <span style={{ fontSize: "0.9rem", color: "#1a1a1a" }}>{file.name} 
                  <span style={{ color: "#a4a4a0", marginLeft: "0.5rem" }}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </span>
                <button onClick={() => removeFile(index)} style={{ border: "none", background: "transparent", color: "#c0392b", cursor: "pointer", fontWeight: 500 }}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEXT AREA */}
      <div className="ll-panel">
        <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Or transcribe manually:</h3>
        <textarea
          className="ll-input"
          value={caseText}
          onChange={(e) => setCaseText(e.target.value)}
          placeholder="I entered into a co-founder contract on Jan 2024..."
          style={{ height: "160px", resize: "vertical" }}
        />
      </div>

      {/* ACTIONS */}
      <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
        <button className="ll-ghost" onClick={() => navigate("/dashboard")}>Cancel</button>
        <button 
          className="ll-cta" 
          onClick={handleAnalyze} 
          disabled={loading}
          style={{ padding: "0.75rem 2rem", fontSize: "0.95rem" }}
        >
          {loading ? "Analyzing..." : "Analyze Case →"}
        </button>
      </div>
    </div>
  );
};

export default UploadCase;
