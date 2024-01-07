import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import StarRating from "../components/StarRating";
import convertToMinutes from "../utils/convertToMinutes";
import calculateAverageRating from "../utils/calculateAverageRating";
import showToast from "../components/showToast";
import axiosInstance from "../services/axiosConfig";
import handleSessionExpiration from "../utils/sessionUtils";

const UserSongs = () => {
  const navigate = useNavigate();

  const [userSongs, setUserSongs] = useState([]);
  const [songRatings, setSongRatings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);

  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [operating, setOperating] = useState(false);

  const fetchUserSongs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/song/getAllUserSongs`);

      if (response.status === 200) {
        //console.log('User Songs:', response.data.data);
        setUserSongs(response.data.data);
        setFilteredSongs(response.data.data);
        fetchSongRatings();
      }
    } catch (error) {
      if (error.response.status === 404) {
        setNoResults(true);
      } else if (error.response.status === 401 || error.response.status === 403) {
        handleSessionExpiration(navigate);
      } else {
        console.error("Error during fetching song data:", error);
        showToast("err", "An error occurred while fetching song data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSongRatings = async () => {
    try {
      const response = await axiosInstance.get(`/rating/song/get/userid`);

      if (response.status === 200) {
        setSongRatings(response.data.data);
      }
    } catch (error) {
      if (error.response.status === 404) {
        showToast("warn", "You have not rated any songs yet.");
      } else if (error.response.status === 401 || error.response.status === 403) {
        handleSessionExpiration(navigate);
      } else {
        console.error("Error during fetching rating data:", error);
        showToast("err", "An error occurred while fetching rating data.");
      }
    }
  };

  const rateSong = async (songID, ratingData) => {
    try {
      if (!ratingData || ratingData < 1 || ratingData > 5) {
        showToast("warn", "Please provide a rating between 1 and 5.");
        return;
      }
      setOperating(true);
      showToast("info", "Rating song...");

      const rating = parseInt(ratingData);
      const songId = parseInt(songID);

      const response = await axiosInstance.post(`/rating/song/create`, { songId, rating });

      if (response.status === 200) {
        showToast("ok", "Song rated successfully!");
      }
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 403) {
        handleSessionExpiration(navigate);
      } else {
        console.error("Error during rating song:", error);
        showToast("err", "An error occurred while rating song.");
      }
    } finally {
      setOperating(false);
      fetchSongRatings();
    }
  }

  const removeSong = async (songId) => {
    try {
      setOperating(true);
      showToast("info", "Deleting song...");

      const response = await axiosInstance.post(`/song/deleteSong/User`, { songId });

      if (response.status === 200) {
        showToast("ok", "Song deleted successfully!");
      }
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 403) {
        handleSessionExpiration(navigate);
      } else {
        console.error("Error during deleting song:", error);
        showToast("err", "An error occurred while deleting song.");
      }
    } finally {
      setOperating(false);
      fetchUserSongs();
    }
  }
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);

    // Update userSongs based on the search query
    const filteredSongs = event.target.value
      ? userSongs.filter(song =>
          song.Title.toLowerCase().includes(event.target.value.toLowerCase()) ||
          song.Performers.some(performer => performer.Name.toLowerCase().includes(event.target.value.toLowerCase())) ||
          song.Album.toLowerCase().includes(event.target.value.toLowerCase())
        )
      : userSongs;

    setFilteredSongs(filteredSongs);
    setNoResults(filteredSongs.length === 0);
  };

  useEffect(() => {
    fetchUserSongs();
  }, []);

  return (
    <div>
      <h1 className="font-bold mb-8 flex items-center justify-center text-3xl">Your Songs</h1>
      <div className="join flex items-center justify-center mb-16">
        <input 
          className="input input-bordered input-primary join-item" 
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          disabled={loading || operating || noResults}
        />
      </div>
      {loading ? (
        <div className="flex items-center justify-center">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : noResults ? (
        <p className='flex items-center justify-center'>No songs found. You add songs from <Link to="/song/search" className="text-indigo-600 hover:text-indigo-700 ml-1">here</Link>.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSongs.map((song) => (
            <div key={song.SongID} className="card w-96 bg-base-100 shadow-xl">
              <figure>
                {song.Image && JSON.parse(song.Image)?.[1] ? (
                  <img src={JSON.parse(song.Image)[1].url} alt={song.Title} />
                ) : (
                  <img 
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
                    alt={song.Title}
                    style={{ width: "300px", height: "300px" }} 
                  />
                )}
              </figure>
              <div className="card-body">
                <h2 className="card-title">{song.Title}</h2>
                <p>Performer(s): {song.Performers.map(genre => genre.Name).join(", ")}</p>
                <p>Album: {song.Album}</p>
                <p>Genre(s): {song.Genres.length > 0 ? song.Genres.map(genre => genre.Name).join(", ") : "N/A"}</p>
                <p>Release Date: {song.ReleaseDate}</p>
                <p>Length: {convertToMinutes(song.Length)}</p>
                <p>Avg. Rating: {calculateAverageRating(songRatings, song.SongID)}</p>
                <div className="card-actions flex items-center justify-center">
                  <div className="mr-4">
                    <StarRating
                      onStarClick={(rating) => rateSong(parseInt(song.SongID), rating)}
                      disabled={operating}
                    />
                  </div>
                  <button onClick={() => removeSong(parseInt(song.SongID))} disabled={operating} className="btn btn-error btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 448 512">
                      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSongs;