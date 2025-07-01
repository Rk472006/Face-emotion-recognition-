// Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "./Register.css"; // ⬅️ import the CSS

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function isValidPassword(password) {
    const minLength = 6;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    return (
      password.length >= minLength &&
      hasUpper &&
      hasLower &&
      hasDigit &&
      hasSpecial
    );
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isValidPassword(password)) {
      toast.error(
        "Password must be at least 6 characters long and contain uppercase, lowercase, digit, and special character."
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await axios.post(`http://localhost:5000/api/user/register`, {
        email: firebaseUser.email,
        uid: firebaseUser.uid,
      });

      toast.success("Registered successfully!");
      localStorage.setItem("uid", firebaseUser.uid);
      navigate(`/camera/${firebaseUser.uid}`, { replace: true });
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error("Register failed:", error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
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
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}
