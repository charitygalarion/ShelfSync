// authentication/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        "http://localhost:8000/api/login", 
        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      const { user, token } = response.data;
      
      // Store user data and token in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      
      // Redirect based on user role
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response?.status === 422) {
        // Validation errors from Laravel
        const validationErrors = error.response.data.errors;
        const formattedErrors = {};
        Object.keys(validationErrors).forEach(key => {
          formattedErrors[key] = validationErrors[key][0];
        });
        setErrors(formattedErrors);
      } else if (error.response?.status === 401) {
        setErrors({ general: error.response.data.message || "Invalid email or password" });
      } else if (error.response?.status === 500) {
        setErrors({ general: "Server error. Please try again later." });
      } else if (!error.response) {
        setErrors({ general: "Network error. Please check if Laravel server is running." });
      } else {
        setErrors({ general: "Login failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            <span className="logo-icon">📚</span>
            <h1>ShelfSync</h1>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        {errors.general && (
          <div className="alert alert-error">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
              placeholder="Enter your email"
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "input-error" : ""}
              placeholder="Enter your password"
              required
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="demo-accounts">
          <h4>Test Accounts (Make sure these exist in your Laravel database):</h4>
          <p><strong>Admin:</strong> admin@library.com / password</p>
          <p><strong>User:</strong> john@example.com / password</p>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="link-button">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}