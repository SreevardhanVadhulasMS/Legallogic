import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../page/Dashboard.css";  // Reuse dashboard styles

const UploadCase = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);

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
    setFiles(prev => [...prev, ...droppedFiles.slice(0, 3)]);  // Limit to 3 files
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles.slice(0, 3 - prev.length)]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="dashboard" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header */}
      <header className="dashboard-header">
        <div style={{display: 'flex', flex: 1, alignItems: 'center', gap: '1.5rem'}}>
          <Link to="/dashboard" className="brand" style={{margin: 0}}>
            <div className="brand-mark">LL</div>
            <span className="brand-name">
              Legal<strong>Logic</strong> - Upload Case
            </span>
          </Link>
          
        </div>
        <button className="logout-btn" onClick={logout}>Logout →</button>
      </header>

      {/* Upload Area */}
      <div className="welcome-card" style={{ marginBottom: "2rem" }}>
        <h2 className="welcome-title">Drag & drop your documents</h2>
        <p className="welcome-text">
          PDF, DOCX, images (max 10MB each, up to 3 files). We'll extract text and run AI analysis.
        </p>
      </div>

      <div 
        className={`welcome-card ${dragActive ? "drag-active" : ""}`}
        style={{
          border: "3px dashed var(--gold)", 
          padding: "4rem 2rem",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.3s"
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input").click()}
      >
        <div className="dashboard-card-icon" style={{ fontSize: "4rem", marginBottom: "1rem" }}>📎</div>
        <h3>Drop files here or click to browse</h3>
        <p style={{ color: "var(--muted)", marginTop: "0.5rem" }}>Supports PDF, DOC, DOCX, JPG, PNG</p>
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </div>

      {/* Files Preview */}
      {files.length > 0 && (
        <div className="dashboard-grid" style={{ marginTop: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {files.map((file, index) => (
            <div key={index} className="dashboard-card" style={{ position: "relative" }}>
              <div className="dashboard-card-icon">📄</div>
              <h3 style={{ fontSize: "1.1rem" }}>{file.name}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                {Math.round(file.size / 1024)} KB
              </p>
              <button 
                onClick={() => removeFile(index)}
                style={{
                  position: "absolute", top: "1rem", right: "1rem",
                  background: "var(--rose)", color: "white", border: "none",
                  borderRadius: "50%", width: "28px", height: "28px",
                  cursor: "pointer", fontSize: "1rem"
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      {files.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button 
            className="logout-btn" 
            style={{ background: "var(--green)", marginRight: "1rem" }}
            onClick={() => alert("Uploading & analyzing... (Demo)") }
          >
            Analyze Files → 
          </button>
          <Link to="/dashboard">
            <button className="logout-btn" style={{ background: "var(--muted)" }}>Back to Dashboard</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default UploadCase;

