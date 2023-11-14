import React from "react";
import { Link } from "react-router-dom";
import './Home.css'; 

const Home = () => {
  return (
    <div className="home-container">
      <div className="background-image">
        {/*  background image goes here */}
      </div>
      <div className="content">
        <h1>Welcome to Your Music Dashboard</h1>
        <div className="button-container">
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
          <Link to="/dashboard">
            <button className="dashboard-button">Dashboard</button>
          </Link>
          <Link to="/add-song">
            <button className="add-song-button">Add Song</button>
          </Link>
          <Link to="/settings">
            <button className="settings-button">Settings</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;