import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../services/axiosConfig";
import showToast from "../../components/showToast";
import handleSessionExpiration from "../../utils/sessionUtils";
import parseDate from "../../utils/parseDate";
import convertToMinutes from "../../utils/convertToMinutes";

const UserPlaylists = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [selectedPlaylistData, setSelectedPlaylistData] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [loadingPlaylistDetails, setLoadingPlaylistDetails] = useState(false);
  const [operating, setOperating] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSongsQuery, setSearchSongsQuery] = useState('');
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [filteredSelectedPlaylistData, setFilteredSelectedPlaylistData] = useState([]);
  const [noPlaylists, setNoPlaylists] = useState(false);
  const [reverseOrder, setReverseOrder] = useState(false);

  const fetchPlaylists = async () => {
    try {
      setLoadingPlaylists(true);
      setSelectedPlaylist(null);
      setSelectedPlaylistData([]);
      const response = await axiosInstance.get("/playlist/getAllUserPlaylists");
      const sortedPlaylists = response.data.data.sort((a, b) => new Date(b.DateAdded) - new Date(a.DateAdded));
      setPlaylists(sortedPlaylists);
      setFilteredPlaylists(sortedPlaylists);
      setNoPlaylists(false);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        handleSessionExpiration(navigate);
      } else if (error.response && error.response.status === 404) {
        setNoPlaylists(true);
      } else {
        console.error("Error fetching playlists:", error);
        showToast("err", "An error occurred during fetching playlists");
      }
    } finally {
      setLoadingPlaylists(false);
    }
  };

  const fetchPlaylistInformation = async (playlistID) => {
    try {
      setLoadingPlaylistDetails(true);
      const response = await axiosInstance.post("/playlist/getAllSongsForPlaylist", { playlistID });
      //console.log(`Playlist ${playlistID} information:`, response.data.data);
      setSelectedPlaylistData(response.data.data);
      setFilteredSelectedPlaylistData(response.data.data);
      setNoResults(false);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        handleSessionExpiration(navigate);
      } else if (error.response && error.response.status === 404) {
        setSelectedPlaylistData([]);
        setNoResults(true);
      } else {
        console.error("Error fetching playlist information:", error);
        showToast("err", "An error occurred during fetching playlist information");
      }
    } finally {
      setLoadingPlaylistDetails(false);
    }
  };

  const deletePlaylist = async (playlistID) => {
    try {
      setOperating(true);
      showToast("info", "Deleting playlist...");
      await axiosInstance.post("/playlist/deletePlaylist", { playlistID });
      //console.log(`Playlist ${playlistID} deleted:`, response.data.data);
      showToast("ok", "Playlist deleted successfully.");
      await fetchPlaylists();
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        handleSessionExpiration(navigate);
      } else {
        console.error("Error deleting playlist:", error);
        showToast("err", "An error occurred during deleting playlist");
      }
    } finally {
      setOperating(false);
    }
  };

  const deleteSongFromPlaylist = async (playlistID, songID) => {
    try {
      setOperating(true);
      showToast("info", "Deleting song from playlist...");
      await axiosInstance.post("/playlist/deleteSongFromPlaylist", { playlistID, songID });
      //console.log(`Song ${songID} deleted from playlist ${playlistID}:`, response.data.data);
      showToast("ok", "Song deleted from playlist successfully.");
      await fetchPlaylistInformation(playlistID);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        handleSessionExpiration(navigate);
      } else {
        console.error("Error deleting song from playlist:", error);
        showToast("err", "An error occurred during deleting song from playlist");
      }
    } finally {
      setOperating(false);
    }
  };

  const handlePlaylistClick = (playlist) => {
    setSelectedPlaylist(playlist);
    fetchPlaylistInformation(playlist.PlaylistID);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);

    // Update userSongs based on the search query
    const filteredSongs = event.target.value
      ? playlists.filter(song =>
          song.Name.toLowerCase().includes(event.target.value.toLowerCase())
        )
      : playlists;

    setFilteredPlaylists(filteredSongs);
  };

  const handleSearchSongsChange = (event) => {
    setSearchSongsQuery(event.target.value);

    // Filter songs based on the search query in Title, Performers, and Album
    const filteredSongs = event.target.value
      ? selectedPlaylistData.filter(song =>
          song.Title.toLowerCase().includes(event.target.value.toLowerCase()) ||
          song.Performers.some(performer => performer.Name.toLowerCase().includes(event.target.value.toLowerCase())) ||
          song.Album.toLowerCase().includes(event.target.value.toLowerCase())
        )
      : selectedPlaylistData;

    setFilteredSelectedPlaylistData(filteredSongs);
  };

  function calculateTotalDuration(songs) {
    // Ensure the input is valid
    if (!Array.isArray(songs) || songs.length === 0) {
      return "Invalid input. Please provide an array of songs.";
    }

    // Calculate total duration in milliseconds
    const totalDurationInMs = songs.reduce((acc, song) => acc + song.Length, 0);

    // Convert milliseconds to hours and minutes
    const hours = Math.floor(totalDurationInMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalDurationInMs % (1000 * 60 * 60)) / (1000 * 60));

    // Display the overall duration based on conditions
    if (hours === 0) {
      return `${minutes} minutes`;
    } else if (minutes === 0) {
      return `${hours} hours`;
    } else {
      return `${hours} hours and ${minutes} minutes`;
    }
  }

  const toggleSortDirection = () => {
    setFilteredSelectedPlaylistData((prevSongs) => [...prevSongs].reverse()); // Reverse the order of the existing songs
    setReverseOrder((prevOrder) => !prevOrder); // Toggle the reverse order state
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row">
      {/* Left side - List of playlists */}
      <div className="w-full sm:w-1/4 p-4 overflow-y-auto mb-4 sm:mb-0">
        <h1 className="font-bold text-3xl mb-8">Your Playlists</h1>

        {/* Search Bar for Playlists */}
        <div className="mb-12">
          <input 
            className="input input-bordered input-primary" 
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            disabled={loadingPlaylists || operating || noPlaylists}
          />
        </div>

        {loadingPlaylists ? (
          <div className="flex items-center justify-center">
            <span className="loading loading-bars loading-lg"></span>
          </div>
        ) : noPlaylists ? (
          <p className="flex items-center justify-center">No playlists found. You can create playlists from <Link to="/playlist" className="text-indigo-600 hover:text-indigo-700 ml-1">here</Link>.</p>
        ) : filteredPlaylists.length === 0 ? (
          <p className="flex items-center justify-center">No results found.</p>
        ) : (
          <>
            <div className="overflow-x-auto shadow-lg">
              <table className="table">
                <thead className="bg-base-200">
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlaylists.map((playlist) => (
                    <tr key={playlist.PlaylistID} onClick={() => handlePlaylistClick(playlist)} className={`hover ${selectedPlaylist === playlist ? 'active' : ''}`}>
                      <td>
                        <figure>
                          {playlist.Image && JSON.parse(playlist.Image)?.[0] ? (
                            <img
                              src={JSON.parse(playlist.Image)[0].url}
                              alt={playlist.Name}
                              style={{ width: "50px", height: "50px" }}
                            />
                          ) : (
                            <img
                              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                              alt={playlist.Name}
                              style={{ width: "50px", height: "50px" }}
                            />
                          )}
                        </figure>
                      </td>
                      <td className="font-bold">{playlist.Name}</td>
                      <td>
                        <button className="btn btn-error btn-circle" disabled={operating} onClick={() => deletePlaylist(selectedPlaylist.PlaylistID)}>
                          <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 448 512">
                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div className="divider sm:divider-horizontal sm:h-screen"></div>

      {/* Right side - Detailed view of the chosen playlist */}
      <div className="w-full sm:w-3/4 p-4 overflow-y-auto">
        {selectedPlaylist ? !loadingPlaylistDetails ? (
          <>
            <div className="flex items-center mb-8">
              <figure className="mr-4">
                {selectedPlaylist.Image && JSON.parse(selectedPlaylist.Image)?.[0] ? (
                  <img
                    src={JSON.parse(selectedPlaylist.Image)[0].url}
                    alt={selectedPlaylist.Name}
                    style={{ width: "200px", height: "200px" }}
                  />
                ) : (
                  <img
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    alt={selectedPlaylist.Name}
                    style={{ width: "200px", height: "200px" }}
                  />
                )}
              </figure>
              <div>
                <h2 className="font-bold text-2xl mb-2">{selectedPlaylist.Name}</h2>
                <p>{parseDate(selectedPlaylist.DateAdded)}</p>
                {selectedPlaylistData.length !== 0 && (
                  <>
                    <p>{selectedPlaylistData.length} song(s)</p>
                    <p>{calculateTotalDuration(selectedPlaylistData)}</p>
                  </>
                )}
              </div>
            </div>

            {/* Search Bar for Songs */}
            <div className="mb-8">
              <input 
                className="input input-bordered input-primary" 
                placeholder="Search songs"
                value={searchSongsQuery}
                onChange={handleSearchSongsChange}
                disabled={loadingPlaylistDetails || operating || selectedPlaylistData.length === 0}
              />
            </div>

            {noResults ? (
              <p className="flex items-center justify-center">No songs found. You add songs to this playlist from <Link to="/playlist" className="text-indigo-600 hover:text-indigo-700 ml-1">here</Link>.</p>
            ) : filteredSelectedPlaylistData.length === 0 ? (
              <p className="flex items-center justify-center">No results found.</p>
            ) : (
              <div className="relative overflow-x-auto shadow-lg max-h-[400px]">
                <table className="table">
                  <thead className="sticky top-0 z-50 bg-base-200">
                    <tr>
                      <th onClick={toggleSortDirection} style={{ cursor: 'pointer' }}>
                        Image
                        {!reverseOrder ? ' ▲' : ' ▼'}
                      </th>
                      <th>Title</th>
                      <th>Performer(s)</th>
                      <th>Album</th>
                      <th>Genre(s)</th>
                      <th>Release Date</th>
                      <th>Duration</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSelectedPlaylistData.map((song) => (
                      <tr key={song.SongID} className="hover">
                        <td>
                          <figure>
                            {song.Image && JSON.parse(song.Image)?.[1] ? (
                              <img
                                src={JSON.parse(song.Image)[1].url}
                                alt={song.Title}
                                style={{ width: "100px", height: "100px" }}
                              />
                            ) : (
                              <img
                                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                alt={song.Title}
                                style={{ width: "100px", height: "100px" }}
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
                        <td>
                          <button className="btn btn-error btn-circle" disabled={operating} onClick={() => deleteSongFromPlaylist(selectedPlaylist.PlaylistID, song.SongID)}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 448 512">
                              <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center">
            <span className="loading loading-bars loading-lg"></span>
          </div>
        ) : (
          <p className="flex items-center justify-center text-xl font-bold">Select a playlist to view details.</p>
        )}
      </div>
    </div>
  );
};

export default UserPlaylists;