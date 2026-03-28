import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import HomePage from "./page/Homepage";
import Login from "./page/Login";
import Signup from "./page/Signup";
import Dashboard from "./page/Dashboard";
import UploadCase from "./page/UploadCase";
import AiSummary from "./page/AiSummary";
import RecentCases from "./page/RecentCases";
import FindAdvisors from "./page/FindAdvisors";
import ExpenseTracker from "./page/ExpenseTracker";
import CaseManagement from "./page/CaseManagement";
import ProtectedRoute from "./components/ProtectedRoute";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);
  return error ? (
    <div style={{ padding: 32, color: 'red', fontSize: 20 }}>
      <b>Something went wrong:</b>
      <pre>{error.message || String(error)}</pre>
      <p>Check the browser console for more details.</p>
    </div>
  ) : (
    <ErrorCatcher setError={setError}>{children}</ErrorCatcher>
  );
}

class ErrorCatcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    this.props.setError(error);
  }
  render() {
    return this.props.children;
  }
}

export default function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token check:", token);
  }, []);

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload-case" element={<UploadCase />} />
        <Route path="/ai-summary" element={<AiSummary />} />
        <Route path="/recent-cases" element={<RecentCases />} />
        <Route path="/find-advisors" element={<FindAdvisors />} />
        <Route path="/expense-tracker" element={<ExpenseTracker />} />
        <Route path="/case-management" element={<CaseManagement />} />
      </Routes>
    </ErrorBoundary>
  );
}