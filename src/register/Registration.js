import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Registration.css";

const baseURL = "http://localhost:3000"; 

const Registration = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegistration = async () => {
    // Validate the form data
    if (!name || !email || !password) {
      // Display a validation error message
      setError("Please provide a name, email, and password.");
      return;
    }

    try {
      // Make a request to the backend to create a new user using Axios
      const response = await axios.post(`${baseURL}/register`, {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        // Registration successful, redirect to the login page
        navigate("/login");
      } else {
        // Handle registration failure, e.g., show an error message
        setError(`Registration failed: ${response.data}`);
        console.error("Registration failed:", response.data);
      }
    } catch (error) {
      // Handle network errors or errors from the server
      setError("Error during registration. Please try again later.");
      console.error("Error during registration:", error);
    }
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
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default Registration;
