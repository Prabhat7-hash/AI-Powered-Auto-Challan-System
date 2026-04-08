import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Create this new CSS file

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json(); // ✅ MUST come before using data

      if (!response.ok) {
        throw new Error(data.detail || data.message || "Login failed");
      }

      // ✅ success
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Network error");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">LOGIN</h2>
      {error && <div className="error-message">{error}</div>}
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;