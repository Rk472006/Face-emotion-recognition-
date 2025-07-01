import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ uid }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar">
      <h2 className="navbar-logo">
        Emotion App
      </h2>
      <div className="navbar-links">
        <button onClick={() => navigate(`/camera/${uid}`)}>Detect Emotion</button>
        <button onClick={() => navigate(`/history/${uid}`)}>History</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
