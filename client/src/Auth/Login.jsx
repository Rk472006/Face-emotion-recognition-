// Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { toast, Toaster } from "react-hot-toast";
import "./Login.css"; // 🔥 Import the CSS

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function isValidPassword(password) {
    const minlength = 6;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    return (
      password.length >= minlength &&
      hasUpper &&
      hasLower &&
      hasDigit &&
      hasSpecial
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isValidPassword(password)) {
      toast.error(
        "Password must be at least 6 characters long and contain uppercase, lowercase, digit, and special character."
      );
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      localStorage.setItem("uid", userCredential.user.uid);
      navigate(`/camera/${userCredential.user.uid}`, { replace: true });
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </div>
    </div>
  );
}
