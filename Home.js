import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Home.css'; 

const Home = () => {
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const navigate = useNavigate(); // Use the useNavigate hook

  const handleLogout = async () => {
    try {
      // Assuming you are using some kind of authentication library or context to get the access token
      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch("http://localhost:3000/auth/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        // Logout was successful
        setLogoutSuccess(true);
        // Clear the access token from local storage or your authentication context
        localStorage.removeItem("accessToken");
        // Redirect to the login page
        navigate("/login");
      } else {
        // Handle error cases
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <div className="home-container">
      <div className="background-image">
        {/*  background image goes here */}
      </div>
      <div className="content">
        <h1>Welcome to Your Music Dashboard</h1>
        <div className="button-container">
          <Link to="/dashboard">
            <button className="dashboard-button">Dashboard</button>
          </Link>
          <Link to="/add-song">
            <button className="add-song-button">Add Song</button>
          </Link>
          <Link to="/dropsong">
            <button className="settings-button">Drop Song</button>
          </Link>
          {/* Logout Button */}
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
          {logoutSuccess && <p>Logout successful!</p>}
        </div>
      </div>
    </div>
  );
};

export default Home;
