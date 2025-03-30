import React, { useState, useContext } from "react";
import { UserData } from "../../Context/UserDataContext";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";

function Login() {
  const userContext = useContext(UserData);
  if (!userContext) throw new Error("useContext(UserData) must be used within a UserContextProvider");

  const { updateUserData } = userContext;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const goTo = location.state?.from || "/dashboard";

  //  Handle login logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      console.log("Login API Response:", data); // ✅ Log response for debugging
  
      if (!response.ok) {
        console.error("Error:", data.message);
        setError(data.message); // Display error message
        return;
      }
  
      if (!data.user) {
        console.error("Error: No user data received", data);
        setError("Invalid login details");
        return;
      }
  
      updateUserData({ username: data.user.username, email: data.user.email, role: data.user.role });
      localStorage.setItem("token", data.token);
      localStorage.setItem("loggedIn", "true");
  
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (err) {
      console.error("Login Error:", err);
      setError("An error occurred. Please try again.");
    }
  };
  

  return (
    <div className="login-page">
      <img src="/Images/mit-logo-banner1.png" alt="MIT WPU" className="login-mit-logo" />
      <div className="footer-links">
        <a href="/privacy-policy" className="footer-link" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        <a className="footer-gap">|</a>
        <a href="/terms-&-conditions" className="footer-link" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>
      </div>

      <div className="login-container">
        <h2 className="login-heading">Login to MIT-WPU</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span className="material-icons input-icon">person</span>
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="material-icons input-icon password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;


