// authentication/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const API_BASE = "http://localhost:8000";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
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

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrors({});

  try {
    console.log('Sending registration data:', formData);
    
    const response = await axios.post(
      `${API_BASE}/api/register`, 
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // Remove withCredentials for now to avoid CORS issues
        // withCredentials: true
      }
    );

    console.log('Registration response:', response.data);
    
    const { user } = response.data;
    
    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify(user));
    console.log('User stored in localStorage, navigating to dashboard...');
    
    // Redirect to user dashboard
    navigate("/user-dashboard");
    
  } catch (error) {
    console.error("Full registration error:", error);
    console.error("Error response:", error.response);
    
    if (error.response?.status === 422) {
      const validationErrors = error.response.data.errors;
      const formattedErrors = {};
      Object.keys(validationErrors).forEach(key => {
        formattedErrors[key] = validationErrors[key][0];
      });
      setErrors(formattedErrors);
    } else {
      setErrors({ general: error.response?.data?.message || "Registration failed. Please try again." });
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
          <h2>Create Account</h2>
          <p>Join our library community</p>
        </div>

        {errors.general && (
          <div className="alert alert-error">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "input-error" : ""}
              placeholder="Enter your full name"
              required
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

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
              placeholder="Create a password (min. 6 characters)"
              required
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password_confirmation">Confirm Password</label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className={errors.password_confirmation ? "input-error" : ""}
              placeholder="Confirm your password"
              required
            />
            {errors.password_confirmation && (
              <span className="error-message">{errors.password_confirmation}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="link-button">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}