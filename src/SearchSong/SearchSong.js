import React, { useState } from "react";
import axios from "axios";

const SearchSong = () => {
  const [trackName, setTrackName] = useState("");
  const [performerName, setPerformerName] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:3000/spotifyapi/searchsong", {
        body: {
          trackName,
          performerName,
          albumName,
        },
      });

      if (response.status === 200) {
        setSearchResults(response.data.data);
      } else {
        setError("Failed to fetch search results");
      }
    } catch (error) {
      setError("Error during search. Please try again later.");
    }
  };

  return (
    <div>
      <h1>Search Song</h1>
      <div>
        <label>Track Name:</label>
        <input type="text" value={trackName} onChange={(e) => setTrackName(e.target.value)} />
      </div>
      <div>
        <label>Performer Name:</label>
        <input type="text" value={performerName} onChange={(e) => setPerformerName(e.target.value)} />
      </div>
      <div>
        <label>Album Name:</label>
        <input type="text" value={albumName} onChange={(e) => setAlbumName(e.target.value)} />
      </div>
      <button onClick={handleSearch}>Search</button>

      {error && <p className="error-message">{error}</p>}

      <div>
        <h2>Search Results:</h2>
        {searchResults.map((result) => (
          <div key={result.SpotifyId}>
            <h3>{result.Title}</h3>
            <p>Performer: {result.Performer[0].name}</p>
            <p>Album: {result.Album.name}</p>
            <img src={result.Album.images[0].url} alt="Album Cover" />
            {/* Add more details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchSong;
