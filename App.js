import React, { useState } from 'react';
import './App.css';


function HomePage() {
  const [songName, setSongName] = useState('');
  const [performer, setPerformer] = useState('');
  const [album, setAlbum] = useState('');
  const [userRating, setUserRating] = useState('');
  const [songList, setSongList] = useState([]);

  const handleAddSong = () => {
    // Create a new song object with user input and add it to the list
    const newSong = {
      name: songName,
      performer,
      album,
      rating: userRating,
    };

    setSongList([...songList, newSong]);

    // Clear the input fields
    setSongName('');
    setPerformer('');
    setAlbum('');
    setUserRating('');
  };

  return (
    <div>
      <h1>Music Analysis and Recommendation</h1>
      <h2>Add a Song</h2>
      <div>
        <label>Song Name:</label>
        <input
          type="text"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
        />
      </div>
      <div>
        <label>Performer(s):</label>
        <input
          type="text"
          value={performer}
          onChange={(e) => setPerformer(e.target.value)}
        />
      </div>
      <div>
        <label>Album:</label>
        <input
          type="text"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
        />
      </div>
      <div>
        <label>User Rating:</label>
        <input
          type="number"
          value={userRating}
          onChange={(e) => setUserRating(e.target.value)}
        />
      </div>
      <button onClick={handleAddSong}>Add Song</button>

      <h2>Song List</h2>
      <ul>
        {songList.map((song, index) => (
          <li key={index}>
            <strong>{song.name}</strong> by {song.performer} from {song.album} (Rating: {song.rating})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
