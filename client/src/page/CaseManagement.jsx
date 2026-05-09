import React, { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  LogOut,
  PlusCircle,
  UploadCloud,
  FileText,
  CalendarDays,
  Wallet,
  Users,
  Sparkles,
  ChevronRight,
  Scale,
  X,
  CheckCircle2,
  Clock3,
  FolderCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import "./CaseManagement.css";

const CaseManagement = () => {
  const navigate = useNavigate();

  const selectedRef = useRef(null);

  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showAllCases, setShowAllCases] = useState(false);

  const [note, setNote] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [newCaseText, setNewCaseText] = useState("");

  const token = localStorage.getItem("token");

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const getProgress = (item) => {
    let progress = 8;

    if (item.notes?.length > 0) progress += 10;
    if (item.schedule?.length > 0) progress += 12;
    if (item.advisor) progress += 15;

    if (item.status === "ready") progress += 18;
    if (item.status === "strong") progress += 30;

    return Math.min(progress, 100);
  };

  const getStatusBadge = (status) => {
    if (status === "strong") {
      return {
        text: "Resolved",
        className: "status-green",
        icon: <CheckCircle2 size={14} />,
      };
    }

    if (status === "ready") {
      return {
        text: "Active",
        className: "status-purple",
        icon: <FolderCheck size={14} />,
      };
    }

    return {
      text: "Pending",
      className: "status-yellow",
      icon: <Clock3 size={14} />,
    };
  };

  const fetchCases = async () => {
    try {
      setLoading(true);

      const res = await api.get("/cases", authHeader);

      setCases(res.data);

      if (res.data.length > 0) {
        setSelectedCase((prev) => {
          if (!prev) return res.data[0];

          const updated = res.data.find((item) => item._id === prev._id);

          return updated || res.data[0];
        });
      } else {
        setSelectedCase(null);
      }
    } catch (error) {
      showToast("Failed to load cases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();

    const isModalOpen = showNewCaseModal || showNotesModal || showScheduleModal;

    document.body.style.overflow = isModalOpen ? "hidden" : "";
    document.body.style.paddingRight = isModalOpen ? "0px" : "";

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [showNewCaseModal, showNotesModal, showScheduleModal]);

  const handleCaseSelect = (item) => {
    setSelectedCase(item);

    setTimeout(() => {
      selectedRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  };

  const createCase = async () => {
    try {
      if (!newCaseText.trim()) {
        showToast("Enter case content");
        return;
      }

      await api.post("/cases", { text: newCaseText }, authHeader);

      setNewCaseText("");
      setShowNewCaseModal(false);

      showToast("Case created");

      fetchCases();
    } catch {
      showToast("Failed to create case");
    }
  };

  const saveNote = async () => {
    try {
      if (!selectedCase) return;

      if (!note.trim()) {
        showToast("Enter note first");
        return;
      }

      await api.post(
        `/cases/${selectedCase._id}/notes`,
        { text: note },
        authHeader,
      );

      setNote("");
      showToast("Note added");
      fetchCases();
    } catch {
      showToast("Failed to save note");
    }
  };

  const scheduleHearing = async () => {
    try {
      if (!selectedCase) return;

      if (!scheduleDate || !scheduleTime) {
        showToast("Choose date & time");
        return;
      }

      await api.post(
        `/cases/${selectedCase._id}/schedule`,
        {
          title: "Primary Hearing",
          date: `${scheduleDate}T${scheduleTime}`,
        },
        authHeader,
      );

      setScheduleDate("");
      setScheduleTime("");

      showToast("Hearing scheduled");
      fetchCases();
    } catch {
      showToast("Failed to schedule");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const shownCases = showAllCases ? cases : cases.slice(0, 3);

  const totalCases = cases.length;

  const activeCases = cases.filter((item) => item.status === "ready").length;

  const hearingCount = cases.reduce(
    (count, item) => count + (item.schedule?.length || 0),
    0,
  );

  const avgScore =
    cases.length > 0
      ? Math.round(
          cases.reduce((sum, item) => sum + item.viabilityScore, 0) /
            cases.length,
        )
      : 0;

  const quickActions = [
    {
      title: "Upload Docs",
      icon: <UploadCloud size={20} />,
      action: () => navigate("/upload-case"),
    },
    {
      title: "Add Notes",
      icon: <FileText size={20} />,
      action: () =>
        document
          .querySelector(".notes-box")
          ?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      title: "Schedule",
      icon: <CalendarDays size={20} />,
      action: () =>
        document
          .querySelector(".schedule-grid")
          ?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      title: "Expenses",
      icon: <Wallet size={20} />,
      action: () => navigate("/expense-tracker"),
    },
    {
      title: "Find Advisor",
      icon: <Users size={20} />,
      action: () => navigate("/find-advisors"),
    },
    {
      title: "AI Summary",
      icon: <Sparkles size={20} />,
      action: () => navigate("/ai-summary"),
    },
  ];

  return (
    <div className="case-page">
      {toast && <div className="toast-msg">{toast}</div>}

      {/* NEW CASE MODAL */}
      {showNewCaseModal && (
        <div className="modal-overlay">
          <div className="modal-box premium-modal">
            <div className="modal-head">
              <h3>Create New Case</h3>

              <button
                className="icon-btn"
                onClick={() => setShowNewCaseModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <textarea
              className="notes-box"
              rows="7"
              placeholder="Describe your issue..."
              value={newCaseText}
              onChange={(e) => setNewCaseText(e.target.value)}
            />

            <button className="btn primary full-btn" onClick={createCase}>
              Create Case
            </button>
          </div>
        </div>
      )}

      {/* NOTES MODAL */}
      {showNotesModal && (
        <div className="modal-overlay">
          <div className="modal-box premium-modal">
            <div className="modal-head">
              <h3>All Notes</h3>

              <button
                className="icon-btn"
                onClick={() => setShowNotesModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="popup-scroll">
              {selectedCase?.notes?.length === 0 ? (
                <p>No notes yet</p>
              ) : (
                selectedCase?.notes?.map((item, index) => (
                  <div className="note-item" key={index}>
                    {item.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE MODAL */}
      {showScheduleModal && (
        <div className="modal-overlay">
          <div className="modal-box premium-modal">
            <div className="modal-head">
              <h3>All Hearings</h3>

              <button
                className="icon-btn"
                onClick={() => setShowScheduleModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="popup-scroll">
              {selectedCase?.schedule?.length === 0 ? (
                <p>No hearings</p>
              ) : (
                selectedCase?.schedule?.map((item, index) => (
                  <div className="note-item" key={index}>
                    {item.title} — {new Date(item.date).toLocaleString()}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <div className="case-navbar">
        <div className="brand-logo">
          Legal<span>Logic</span>
        </div>

        <div className="nav-actions">
          <button
            className="btn secondary"
            onClick={() => navigate("/dashboard")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button className="btn primary" onClick={logout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="hero-section">
        <p className="hero-tag">LEGAL WORKSPACE</p>
        <h1>Case Management</h1>
        <p className="hero-subtitle">
          Manage matters, notes, hearings and progress beautifully.
        </p>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Cases</span>
          <h2>{totalCases}</h2>
        </div>

        <div className="stat-card">
          <span>Active</span>
          <h2>{activeCases}</h2>
        </div>

        <div className="stat-card">
          <span>Hearings</span>
          <h2>{hearingCount}</h2>
        </div>

        <div className="stat-card">
          <span>Avg Score</span>
          <h2>{avgScore}%</h2>
        </div>
      </div>

      {/* TOP GRID */}
      <div className="top-grid">
        {/* CASES */}
        <div className="glass-card">
          <div className="section-head">
            <h3>Your Cases</h3>

            <button
              className="btn primary"
              onClick={() => setShowNewCaseModal(true)}
            >
              <PlusCircle size={18} />
              New Case
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : cases.length === 0 ? (
            <p>No cases yet</p>
          ) : (
            <>
              <div className="case-list-scroll">
                {shownCases.map((item) => {
                  const badge = getStatusBadge(item.status);

                  return (
                    <div
                      key={item._id}
                      className={`case-row ${
                        selectedCase?._id === item._id ? "selected-row" : ""
                      }`}
                      onClick={() => handleCaseSelect(item)}
                    >
                      <div>
                        <h4>{item.title}</h4>

                        <p className="case-meta">
                          {item.caseId}{" "}
                          <span className={`status-chip ${badge.className}`}>
                            {badge.icon}
                            {badge.text}
                          </span>
                        </p>
                      </div>

                      <div className="row-right">
                        <strong>{item.viabilityScore}%</strong>

                        <ChevronRight size={18} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {cases.length > 3 && (
                <button
                  className="view-more-btn"
                  onClick={() => setShowAllCases(!showAllCases)}
                >
                  {showAllCases ? "Show Less" : `View All (${cases.length})`}
                </button>
              )}
            </>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="glass-card">
          <h3 className="mb-20">Quick Actions</h3>

          <div className="action-grid">
            {quickActions.map((item, index) => (
              <button key={index} className="action-card" onClick={item.action}>
                <div className="action-icon">{item.icon}</div>

                <p>{item.title}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SELECTED CASE */}
      {selectedCase && (
        <>
          <div ref={selectedRef} className="glass-card selected-case-card">
            <div className="section-head">
              <div>
                <p className="small-label">Selected Case</p>

                <h2>{selectedCase.title}</h2>

                <p className="case-id">{selectedCase.caseId}</p>
              </div>

              <div className="score-badge">{selectedCase.viabilityScore}%</div>
            </div>

            <div className="details-grid">
              <div className="detail-box">
                <span>Status</span>
                <strong>{getStatusBadge(selectedCase.status).text}</strong>
              </div>

              <div className="detail-box">
                <span>Next</span>
                <strong>{selectedCase.nextAction}</strong>
              </div>

              <div className="detail-box">
                <span>Advisor</span>
                <strong>{selectedCase.advisor || "Pending"}</strong>
              </div>
            </div>

            <div className="progress-wrap">
              <div className="progress-head">
                <span>Case Progress</span>

                <span>{getProgress(selectedCase)}%</span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${getProgress(selectedCase)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* LOWER GRID */}
          <div className="bottom-grid">
            {/* TIMELINE */}
            <div className="glass-card">
              <h3 className="mb-20">Case Timeline</h3>

              <div className="timeline-modern">
                {selectedCase.timeline?.length === 0 ? (
                  <p>No timeline yet</p>
                ) : (
                  selectedCase.timeline.map((item, index) => (
                    <div className="timeline-row" key={index}>
                      <div className="timeline-date">
                        {new Date(item.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </div>

                      <div className="timeline-center">
                        <span className="dot" />
                      </div>

                      <div className="timeline-body">
                        <h4>{item.event}</h4>
                        <p>{item.detail}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* SIDE */}
            <div className="side-column">
              <div className="glass-card">
                <span className="small-label">AI Viability</span>

                <h2>{selectedCase.viabilityScore}%</h2>

                <p className="purple-text">Smart legal estimate</p>
              </div>

              {/* NOTES */}
              <div className="glass-card">
                <span className="small-label">Quick Notes</span>

                <textarea
                  className="notes-box"
                  placeholder="Write note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />

                <div className="dual-btns">
                  <button
                    className="btn secondary"
                    onClick={() => setShowNotesModal(true)}
                  >
                    All Notes
                  </button>

                  <button className="btn primary" onClick={saveNote}>
                    Save Note
                  </button>
                </div>
              </div>

              {/* SCHEDULE */}
              <div className="glass-card">
                <span className="small-label">Schedule Hearing</span>

                <div className="schedule-grid">
                  <input
                    type="date"
                    className="calendar-input"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />

                  <input
                    type="time"
                    className="calendar-input"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>

                <div className="dual-btns">
                  <button
                    className="btn secondary"
                    onClick={() => setShowScheduleModal(true)}
                  >
                    All Hearings
                  </button>

                  <button className="btn primary" onClick={scheduleHearing}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CaseManagement;
