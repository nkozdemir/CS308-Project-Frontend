// Registration.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Registration.css"; 

const Registration = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegistration = () => {
    // Implement registration logic here, e.g., sending a request to the backend to create a new user.

    // After successful registration, you can redirect to the login page or home page.
    navigate("/home");
  };

  return (
    <div className="registration-container">
      <h2>Register</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRegistration();
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
        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default Registration;
