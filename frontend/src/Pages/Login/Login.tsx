import React, { useState, useContext } from "react";
import { UserData } from "../../Context/UserDataContext";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";

function Login() {
  const userContext = useContext(UserData);
  if (!userContext) throw new Error("useContext(UserData) must be used within a UserContextProvider");
  const { user, updateUserData } = userContext;


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const location = useLocation();
  const goTo = location.state?.from || "/dashboard";


  // Handle login logic here
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username: username, Password: password })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Error:', data.message);
        setError(data.message);
        return;
      }

      // Clear localStorage except "theme"
      const theme = localStorage.getItem("theme");
      localStorage.clear();
      if (theme) localStorage.setItem("theme", theme);

      // Set localStorage
      localStorage.setItem("username", username);  // Set username
      localStorage.setItem("loggedIn", "true");   // Set loggedIn to true
      localStorage.setItem('token', data.token); // Store token

      console.log("Logging in with username:", username );
      
      updateUserData(); // Update UserData

      navigate(goTo); // Navigate to the goTo route 
    }
    catch (error) {
      console.error('Error during login:', error);
    }
  };


  return (
    <div className="login-page">
      <img src="/Images/mit-logo-banner1.png" alt="MIT WPU" className="login-mit-logo" />

      <div className="footer-links">
        <a href="/privacy-policy" className="footer-link" target="_blank" rel="noopener noreferrer">Privacy Policy</a> {/* Opens link in new tab with security*/}
        <a className="footer-gap">|</a>
        <a href="/terms-&-conditions" className="footer-link" target="_blank" rel="noopener noreferrer">Terms & Conditions</a> {/* Opens link in new tab with security*/}
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
          <div className="actions-flex">
            <div className="remember-me">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>
            </div>

            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
