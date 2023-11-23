import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const baseURL = "http://localhost:3000"; 

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    // Validate the form data
    if (!username || !password) {
      // Display a validation error message
      setError("Please provide a username and password.");
      return;
    }

    // Make a request to the backend to log in using Axios
    axios
      .post(`${baseURL}/login`, {
        email: username, // Assuming the backend expects 'email' instead of 'username'
        password,
      })
      .then((response) => {
        if (response.status === 200) {
          // Login successful, redirect to the home page
          navigate("/home");
        } else {
          // Handle login failure, e.g., show an error message
          setError(`Login failed: ${response.data}`);
          console.error("Login failed:", response.data);
        }
      })
      .catch((error) => {
        // Handle network errors or errors from the server
        setError("Error during login. Please try again later.");
        console.error("Error during login:", error);
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
};

export default Login;
