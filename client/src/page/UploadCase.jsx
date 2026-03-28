import { useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import useReveal from "../hooks/useReveal";

const UploadCase = () => {
  useReveal();

  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files).slice(0, 3 - prev.length)]);
  };
  const handleFileSelect = (e) => {
    setFiles(prev => [...prev, ...Array.from(e.target.files).slice(0, 3 - prev.length)]);
  };
  const removeFile = (index) => setFiles(prev => prev.filter((_, i) => i !== index));
  const logout = () => { localStorage.removeItem("token"); window.location.href = "/login"; };

  return (
    <div className="ll-wrap">
      <nav className="ll-nav ll-reveal" data-ll>
        <Link to="/dashboard" className="ll-page-back">← Back to Dashboard</Link>
        <div className="ll-nav-actions">
          <Link to="/ai-summary" className="ll-cta">View Summaries</Link>
          <button className="ll-ghost" onClick={logout}>Sign out</button>
        </div>
      </nav>

      <header className="ll-page-header ll-reveal" data-ll>
        <h1 className="ll-page-title">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--pur)" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          Upload Documents
        </h1>
      </header>

      <div className="ll-data-stats ll-reveal" data-ll>
        <div className="ll-data-stat"><span className="ll-data-stat-n">{files.length}</span><span className="ll-data-stat-l">Files Selected</span></div>
        <div className="ll-data-stat"><span className="ll-data-stat-n">Max 3 files</span><span className="ll-data-stat-l">10MB each</span></div>
        <div className="ll-data-stat"><span className="ll-data-stat-n">PDF, DOC, IMG</span><span className="ll-data-stat-l">Supported formats</span></div>
      </div>

      <div
        className="ll-data-card ll-reveal" data-ll
        style={{ border: `3px dashed ${dragActive ? "var(--pur-lt)" : "var(--pur)"}`, padding: "4rem 2rem", textAlign: "center", cursor: "pointer", background: dragActive ? "var(--pur-dim)" : "var(--card)" }}
        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        onClick={() => document.getElementById("file-input").click()}
      >
        <div className="ll-icon" style={{ "--c": "var(--pur)", margin: "0 auto 1rem", width: "80px", height: "80px" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="8 17 12 21 16 17"/><line x1="12" y1="13" x2="12" y2="21"/>
            <path d="M20.88 18.09A5 5 0 0 1 18 9h-1.26A8 8 0 1 0 3 16.09"/>
          </svg>
        </div>
        <h3 className="ll-card-h">Drop files here or click to browse</h3>
        <p className="ll-card-p">PDF, DOCX, JPG, PNG (max 10MB each, up to 3 files)</p>
        <input id="file-input" type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileSelect} style={{ display: "none" }} />
      </div>

      {files.length > 0 && (
        <div className="ll-data-grid ll-reveal" data-ll style={{ marginTop: "2rem" }}>
          {files.map((file, index) => (
            <div key={index} className="ll-data-card">
              <div className="ll-data-meta">
                <span className="ll-data-id">{file.name}</span>
                <span>{Math.round(file.size / 1024)} KB</span>
              </div>
              <button className="ll-ghost" style={{ position: "absolute", top: "1rem", right: "1rem" }} onClick={(e) => { e.stopPropagation(); removeFile(index); }}>×</button>
            </div>
          ))}
        </div>
      )}

      <div className="ll-actions ll-reveal" data-ll style={{ justifyContent: "center", marginTop: "3rem" }}>
        {files.length > 0
          ? <button className="ll-btn-primary" onClick={() => alert("Analyzing with AI... (Demo)")}>🚀 Analyze with AI</button>
          : <Link to="/ai-summary" className="ll-btn-primary">View Recent Analysis</Link>
        }
        <Link to="/dashboard" className="ll-btn-secondary">← Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default UploadCase;