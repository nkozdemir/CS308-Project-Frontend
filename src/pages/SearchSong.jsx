import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import showToast from "../components/showToast";
import axiosInstance from "../services/axiosConfig";

const SearchSong = () => {
  const navigate = useNavigate();

  const [trackName, setTrackName] = useState("");
  const [performerName, setPerformerName] = useState("");
  const [albumName, setAlbumName] = useState("");
  
  const [searchResults, setSearchResults] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = async () => {
    try {
      setIsLoading(true); // Set isLoading to true before making the API request

      if (!trackName) {
        showToast("warn", "Please enter track name.");
        return;
      }

      const response = await axiosInstance.post(`/spotifyapi/searchSong`,
        {
          trackName,
          performerName,
          albumName,
        },
      );
        
      setSearchResults(response.data.data);
      setNoResults(false);
    } catch (error) {
      if (error.response.status === 404) {
        setNoResults(true);
      } else if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        showToast("warn", "Your session has expired. Please log in again.");
        setTimeout(() => { 
          navigate("/login"); 
        }, 3000);
      } else {
        console.error("Error fetching search results:", error.message);
        showToast("err", "Error fetching search results.");
      }
    } finally {
      setIsLoading(false); // Set isLoading to false after the API request is completed
    }
  };

  const handleAddToUser = async (song) => {
    try {
      setIsAdding(true); // Set isAdding to true before adding the song
      showToast("info", "Adding song...");

      const response = await axiosInstance.post('/song/addSpotifySong', 
        {
          spotifyId: song.SpotifyId,
        });

      if (response.status === 200) {
        showToast("ok", "Song added successfully.");
      }
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        showToast("warn", "Your session has expired. Please log in again.");
        setTimeout(() => { 
          navigate("/login"); 
        }, 3000);
      } else {
        console.error("Error adding song:", error.message);
        showToast("err", "Error adding song.");
      }
    } finally {
      setIsAdding(false); // Set isAdding to false after adding the song
    }
  };

  return (
    <div className="my-20 p-4">
      <div className="mb-16">
        <h1 className="font-bold mb-8 flex items-center justify-center text-3xl">Search Song</h1>
        <div className="flex items-center justify-center">
          <div className="flex space-x-4">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Track Name</span>
              </div>
              <input 
                type="text"
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)} 
                placeholder="Enter Track Name" 
                className="input input-bordered input-primary w-full max-w-xs" 
                required
                disabled={isAdding || isLoading}
              />
            </label>
          </div>
          <div className="mx-8">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Performer Name</span>
              </div>
              <input 
                type="text"
                value={performerName}
                onChange={(e) => setPerformerName(e.target.value)}
                placeholder="Enter Performer Name" 
                className="input input-bordered input-primary w-full max-w-xs"
                disabled={isAdding || isLoading} 
              />
            </label>
          </div>
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Album Name</span>
              </div>
              <input 
                type="text"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
                placeholder="Enter Album Name" 
                className="input input-bordered input-primary w-full max-w-xs"
                disabled={isAdding || isLoading} 
              />
            </label>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <button className="btn btn-primary" onClick={handleSearch} disabled={isAdding || isLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 512 512">
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
            </svg>
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : noResults ? (
        <p className='flex items-center justify-center'>No results found. You add songs from <Link to="/song/add" className="text-indigo-600 hover:text-indigo-700 ml-1">here</Link>.</p>
      ) : searchResults.length > 0 ? (
        <div className="overflow-x-auto shadow-lg">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Artists</th>
                <th>Album</th>
                <th>Release Date</th>
                <th>Genres</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((song) => (
                <tr key={song.SpotifyId} className="hover">
                  <td>
                    <figure>
                      <img 
                        src={song.Album.images[2].url} alt={song.Title}
                        style={{ width: "100px", height: "100px" }}
                      />
                    </figure>
                  </td>
                  <td className="font-bold">{song.Title}</td>
                  <td className="font-bold">{song.Performer.map(performer => performer.name).join(", ")}</td>
                  <td className="font-bold">{song.Album.name}</td>
                  <td className="font-bold">{song.Album.release_date}</td>
                  <td className="font-bold">{song.Genres.join(", ")}</td>
                  <td>
                    <button className="btn btn-success btn-circle" onClick={() => handleAddToUser(song)} disabled={isAdding}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 448 512">
                        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default SearchSong;