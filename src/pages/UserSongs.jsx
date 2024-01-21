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
  };

  useEffect(() => {
    fetchUserSongs();
  }, []);

  return (
    <div>
      <h1 className="font-bold mb-8 flex items-center justify-center text-3xl">Your Songs</h1>
      <div className="flex sm:items-start sm:justify-start items-center justify-center sm:mb-8 mb-12">
        <input 
          className="input input-bordered input-primary" 
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
      ) : filteredSongs.length === 0 ? (
        <p className='flex items-center justify-center'>No results found.</p>
      ) : (
        <div className="relative overflow-x-auto shadow-lg sm:max-h-[520px] max-h-[450px]">
          <table className="table">
            <thead className="sticky top-0 z-50 bg-base-200">
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Performers</th>
                <th>Album</th>
                <th>Genres</th>
                <th>Release Date</th>
                <th>Duration</th>
                <th>Avg. Rating</th>
                <th>Rate</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredSongs.map((song) => (
                <tr key={song.SongID} className="hover">
                  <td>
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
                  </td>
                  <td className="font-bold">{song.Title}</td>
                  <td className="font-bold">{song.Performers.map(performer => performer.Name).join(", ")}</td>
                  <td className="font-bold">{song.Album}</td>
                  <td className="font-bold">{song.Genres.length > 0 ? song.Genres.map(genre => genre.Name).join(", ") : "N/A"}</td>
                  <td className="font-bold">{song.ReleaseDate}</td>
                  <td className="font-bold">{convertToMinutes(song.Length)}</td>
                  <td className="font-bold">{calculateAverageRating(songRatings, song.SongID)}</td>
                  <td>
                    <StarRating
                      onStarClick={(rating) => rateSong(parseInt(song.SongID), rating)}
                      disabled={operating}
                    />
                  </td>
                  <td>
                    <button onClick={() => removeSong(parseInt(song.SongID))} disabled={operating} className="btn btn-error btn-circle">
                      <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 448 512">
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserSongs;