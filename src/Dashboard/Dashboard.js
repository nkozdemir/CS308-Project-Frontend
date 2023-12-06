// Dashboard.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserSongs from '../SeeAddedSongs/UserSongs';
import "./Dashboard.css"; // Import the dashboard styles

const Dashboard = () => {
  const [userStats, setUserStats] = useState({
    totalSongs: 0,
    favorites: 0,
  });

  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
  });

  const [userSongsCount, setUserSongsCount] = useState(0);

  // Recommended Music State
  const [recommendedMusic, setRecommendedMusic] = useState([]);

  useEffect(() => {
    // Simulate fetching user details (username, email)
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    setUserDetails({
      username: storedUsername || "User",
      email: storedEmail || "user@example.com",
    });

    // Fetch user songs count
    const fetchUserSongsCount = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch("http://localhost:3000/song/getAllUserSongs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const songs = await response.json();
          setUserSongsCount(songs.length);
        } else {
          console.error("Failed to fetch user songs");
        }
      } catch (error) {
        console.error("Error during fetch", error);
      }
    };

    fetchUserSongsCount();
  }, []);

  useEffect(() => {
    // Simulate generating recommended music
    const generateRecommendedMusic = () => {
      // For demonstration purposes, generate random data
      const artists = ["The Weekend"];
      const songs = ["After hours", "Star Boy", "Blinding Lights", "Moth to flame" ];

      const recommended = [];
      for (let i = 0; i < 3; i++) {
        const randomArtist = artists[Math.floor(Math.random() * artists.length)];
        const randomSong = songs[Math.floor(Math.random() * songs.length)];
        recommended.push({
          artist: randomArtist,
          song: randomSong,
        });
      }

      setRecommendedMusic(recommended);
    };

    generateRecommendedMusic();
  }, []);

  useEffect(() => {
    setUserStats((prevUserStats) => ({
      ...prevUserStats,
      totalSongs: userSongsCount,
    }));
  }, [userSongsCount]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1>Dashboard</h1>
        <div className="user-details">
          <h2>Welcome, {userDetails.username || userDetails.email}!</h2>
          <div className="user-stats">
            <p>Your Statistics:</p>
            <ul>
              <li>Total Songs: {userStats.totalSongs}</li>
              <li>Favorites: {userStats.favorites}</li>
            </ul>
          </div>

          <div className="recent-songs">
            <p>Recent Songs:</p>
            <UserSongs updateUserStats={setUserSongsCount} limit={5} />
          </div>

          <div className="recommended-music">
            <p>Recommended Music:</p>
            <ul>
              {recommendedMusic.map((item, index) => (
                <li key={index}>
                  <strong>{item.artist}</strong> - {item.song}
                </li>
              ))}
            </ul>
          </div>

          <div className="button-container">
            <Link to="/add-song">
              <button>Add New Song</button>
            </Link>
            <Link to="/user-songs">
              <button>Your Songs ({userSongsCount})</button>
            </Link>
            {/* Add more dashboard functionality as needed */}
          </div>
        </div>
      </div>

      <div className="image-container">
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d3XqDIAxAlfivoO//tEOZWzvbVTEpic252W3PF0gAIcsyRVEURVEURVEURVEURVEURVEURVEURVEURVEURflgAFL/AirAqzXO9R7XNBVcy9TbuMHmxjN6lr92cNVVLKEurVfK/zCORVvW8iUBnC02dj+Wpu0z0Y6QlaN5phcwZqjkOkK5HZyPAjkIjSO4fIdfcOwFKkJlX4zPu7Ha1tIcwR3wWxyFhRG6g4Je0YpSPDJCV8a2Sv2zd1O1x/2WMDZCwljH+clRrHfWCLGK8REMiql//2si5+DKWKcWeAGcFMzzNrXC/0TUwQ2s6+LhlcwjTMlYsUIQzPOCb7YBiyHopyLXIEKPEkI/TgeuiidK/R9FniUDOjRDpvm0RhqjMyyXNjDhCfIMYl1gGjIMIuYsnGEYRMRZOMMunaLVwpWRW008v6fYKDIzxCwVAeNSO90BJW6emelYBRF/kHpYGVaoxTDAaxOFsfP9y8hpJ4xd7gOcij7JNGQ1EYFgkPJa1jQEiYZXRaRINKxSDUW9n+FT82lSKadkiru9/4XPqSLWOekGPoY05TAvLm9orm+YWuwHoBHkZKijNBJGmeb61eL6Ff/6q7bLr7yvv3vKGhpDRjvgjGaPz+gUg6YgcvpyAR2FIZ9U6nEEyZRTovmEU32KichpGn7C17XrfyH9gK/c0CMP05HZIM2uf9sEveizKveBy9/6Qt7o89ne33D525cfcIMW6ab+TMEukQbQbu+xu7X3A9bChmWaCeAkG17bpntwXgWxHaMzGPmUaR5dQZiKqRVeUZ3047fi3nAu28h4CHxCsZAgmEH8Y27jJAhm8c+5RQzRQNVGhVFSfxOYIjp/pP7RxzjevYXVGf4eLt+BJ1vCuLuLkrgABgCGXZ2wik5uty+oBvNirI6mkzhAf4Gsb58Hcm67Jzd+KwD10BYPLL3e0MjvKrgAULnOfveF/O4N2Xb9BZom3gJes3F9X5Zze8/6Yt09b4CrqsEjUv8oFBaR2rl+6CZr2xVrp24o/WitBKuGrrpl1+bFkmK2qXTON4VpbdfLa7o7y/WdLxG7lm2Lqh2clOwTegbvc/vj2U78CwhA87Bn8G5Nk3eOb0Nsr9flz3sG78UUtue4kpv1xvjg3TMay62BMlTlP+vrOMnJsRmt/ze0jsfkPPYdAH57hK+34PeOyc8XIXu5xT2HsUkdZz+adwg8HGFfQ3K5jtDvbUiO4Di9/ywHGrL88pDizZ++oTp+an+SMX/ndymUCwmHMdO7yuOx83pUx/eEMU0AvxWndwgidAqOZ8ypCwdEfvvEo6D9HwpA8wzvmOJEqAg9ySu8g4x0Hb9hSB/BANEKJ+LbPBU0lzbAJs4xt1AoshKkUGQmiH8/jJ0gdhTTLmSegHlPE0oOdXALnqDjKYh3px//fSgSWG8UqfrrIICzYYSJXRr9BSPbpNzw7gBjKjKOYI7ReIGqQRIap5+5MdjyvuDkExvGeXSlONWZAP3/AZBwJohU7QJRGU+cTVH18ELmRPNBmibW6MT/k1b0XhdkRBvyT6SB6EYv/GvhSmRNpGngRULsAlxMCGNXp7w3FfdEbTEEDdLI9TdIKRUzUesa3I461ER8cpNT7gMRhpKmYVS9ELOgCUQsa4SsulciKiLbY+AnHD8cpuhISsnxpamI84sbDq9qYJgf8wiiOBrC7Ml7M7ZECCqKoiiKoiiKoiiKoijv5AvJxlZRyNWWLwAAAABJRU5ErkJggg=="
          alt="User"
          className="user-image"
        />
      </div>
    </div>
  );
};

export default Dashboard;
