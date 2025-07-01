import React, { useState } from "react";
import {  Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Camera from "./Emotion_Detection/Camera";
import Upload from "./Emotion_Detection/Upload";
import History from "./History/History";
import ProtectedRoute from "./Auth/ProtectedRoute";

export default function App() {
  return (
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
        
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/camera/:uid" element={<ProtectedRoute><Camera /></ProtectedRoute>} />
          <Route path="/upload/:uid" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="/history/:uid" element={<ProtectedRoute><History /></ProtectedRoute>} />
        </Routes>
      </div>
  );
}

        
