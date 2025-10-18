import React, { useState } from "react";
import axios from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = res.data.user.role === "admin" ? "/admin" : "/user";
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <h2>📚 ShelfSync Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <p>Don’t have an account? <a href="/register">Register</a></p>
    </div>
  );
}