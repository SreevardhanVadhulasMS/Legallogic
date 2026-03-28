import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  console.log("[ProtectedRoute] token:", token);
  if (!token) {
    console.warn("[ProtectedRoute] No token found, redirecting to /login");
    return <Navigate to="/login" replace />;
  }
  console.log("[ProtectedRoute] Token found, rendering children");
  return children;
}

export default ProtectedRoute;