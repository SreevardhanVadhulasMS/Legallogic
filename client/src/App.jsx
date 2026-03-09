import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import HomePage from "./page/Homepage";
import Login from "./page/Login";
import Signup from "./page/Signup";
import Dashboard from "./page/Dashboard";
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

    </Routes>
  );
}