// UserSongs.js
import React, { useState, useEffect } from "react";


const UserSongs = () => {
  const [userSongs, setUserSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSongs = async () => {
      try {
        // Assuming you are using some kind of authentication library or context to get the access token
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
          setUserSongs(songs);
        } else {
          console.error("Failed to fetch user songs");
        }
      } catch (error) {
        console.error("Error during fetch", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSongs();
  }, []);

  return (
    <div>
      <h1>Your Songs</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {userSongs.map((song) => (
            <li key={song.SongID}>
              <p>Title: {song.Title}</p>
              <p>Album: {song.Album}</p>
              <p>Release Date: {song.ReleaseDate}</p>
              <p>Length: {song.Length}</p>
              <p>
                Performers: {song.Performers.map((performer) => performer.Name).join(", ")}
              </p>
              {/* Add more details as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSongs;