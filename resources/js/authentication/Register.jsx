import React, { useState } from "react";
import axios from "../services/api";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/register", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/user";
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>🪶 Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        <input type="password" placeholder="Confirm Password" onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })} />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}
