// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const uid = localStorage.getItem("uid");
  return uid ? children : <Navigate to="/" replace />;
}

