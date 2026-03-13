import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

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

export default function App() {

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token check:", token);
  }, []);

  return (
    <Routes>

      <Route path="/" element={<HomePage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload-case"
        element={
          <ProtectedRoute>
            <UploadCase />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-summary"
        element={
          <ProtectedRoute>
            <AiSummary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recent-cases"
        element={
          <ProtectedRoute>
            <RecentCases />
          </ProtectedRoute>
        }
      />
      <Route
        path="/find-advisors"
        element={
          <ProtectedRoute>
            <FindAdvisors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expense-tracker"
        element={
          <ProtectedRoute>
            <ExpenseTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/case-management"
        element={
          <ProtectedRoute>
            <CaseManagement />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}