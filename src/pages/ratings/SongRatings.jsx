import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import showToast from "../../components/showToast";
import convertToMinutes from "../../utils/convertToMinutes";
import DisplayStarRating from "../../components/DisplayStarRating";
import axiosInstance from "../../services/axiosConfig";
import parseDate from "../../utils/parseDate";
import handleSessionExpiration from "../../utils/sessionUtils";

const SongRatings = () => {
  const navigate = useNavigate();
  
  const [ratingData, setRatingData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRatingData, setFilteredRatingData] = useState([]);

  const [loading, setLoading] = useState(false); 
  const [deleting, setDeleting] = useState(false); 
  const [noResults, setNoResults] = useState(false);

  // Sorting
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortColumn, setSortColumn] = useState("Date");

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortOrder === "asc";
    const newSortOrder = isAsc ? "desc" : "asc";
  
    setSortOrder(newSortOrder);
    setSortColumn(column);
  
    const sortedData = [...filteredRatingData].sort((a, b) => {
      const aValue = column === "Rating" ? a[column] : new Date(a[column]);
      const bValue = column === "Rating" ? b[column] : new Date(b[column]);
  
      if (aValue < bValue) {
        return isAsc ? -1 : 1;
      }
      if (aValue > bValue) {
        return isAsc ? 1 : -1;
      }
      return 0;
    });
  
    setFilteredRatingData(sortedData);
  };

  const fetchRatingData = async () => {
    try {
      setLoading(true); 

      const response = await axiosInstance.get('/rating/song/get/userid');

      if (response.status === 200) { 
        //console.log("Song ratings:", response.data.data);
        setRatingData(response.data.data);
        setFilteredRatingData(response.data.data);
      }
    } catch (error) {
      if (error.response.status === 404) {
        setNoResults(true);
      } else if (error.response.status === 401 || error.response.status === 403) {
        handleSessionExpiration(navigate);
      } else {
        console.error("Error during fetching rating data:", error);
        showToast("err", "An error occurred while fetching rating data.");
      }
    } finally {
      setLoading(false); // Set loading to false after the API request is completed
    }
  };

  const removeRating = async (songRatingId) => {
    try {
      setDeleting(true); 
      showToast("info", "Deleting rating...");

      const response = await axiosInstance.post('/rating/song/delete/songratingid', { songRatingId });

      if (response.status === 200) {
        showToast("ok", "Rating deleted successfully.");
      }
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 403) {
        handleSessionExpiration(navigate);
      } else {
        console.error("Error during deleting rating:", error);
        showToast("err", "An error occurred while deleting rating.");
      }
    } finally {
      setDeleting(false); 
      fetchRatingData();
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);

    // Update userSongs based on the search query
    const filteredSongs = event.target.value
      ? ratingData.filter(song =>
          song.SongInfo.Title.toLowerCase().includes(event.target.value.toLowerCase()) ||
          //song.SongInfo.Performers.some(performer => performer.Name.toLowerCase().includes(event.target.value.toLowerCase())) ||
          song.SongInfo.Album.toLowerCase().includes(event.target.value.toLowerCase())
        )
      : ratingData;

    setFilteredRatingData(filteredSongs);
  };

  useEffect(() => {
    fetchRatingData();
  }, []);

  return (
    <div>
      <h1 className="font-bold mb-8 flex items-center justify-center text-3xl">Your Song Ratings</h1>
      <div className="join flex items-center justify-center mb-16">
        <div>
          <input 
            className="input input-bordered input-primary join-item" 
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            disabled={loading || deleting || noResults}
          />
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : noResults ? (
        <p className='flex items-center justify-center'>No song rating data found. You can rate songs from <Link to="/library" className="text-indigo-600 hover:text-indigo-700 ml-1">here</Link>.</p>
      ) : filteredRatingData.length === 0 ? (
        <p className='flex items-center justify-center'>No results found.</p>
      ) : (
        <div className="relative overflow-x-auto shadow-lg sm:max-h-[500px] max-h-[400px]">
          <table className="table">
            <thead className="sticky top-0 z-50 bg-base-200">
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Performer(s)</th>
                <th>Album</th>
                <th>Genre(s)</th>
                <th>Release Date</th>
                <th>Duration</th>
                <th onClick={() => handleSort("Rating")}>
                  Rating
                  {sortColumn === "Rating" && (
                    <span>{sortOrder === "desc" ? " ▲" : " ▼"}</span>
                  )}
                </th>
                <th onClick={() => handleSort("Date")}>
                  Date
                  {sortColumn === "Date" && (
                    <span>{sortOrder === "desc" ? " ▲" : " ▼"}</span>
                  )}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRatingData.map((rating) => (
                <tr key={rating.SongRatingID}>
                  <td>
                    <figure>
                      {rating.SongInfo.Image && JSON.parse(rating.SongInfo.Image)?.[1] ? (
                        <img 
                          src={JSON.parse(rating.SongInfo.Image)[1].url} alt={rating.SongInfo.Title}
                          style={{ width: "100px", height: "100px" }} 
                        />
                      ) : (
                        <img 
                          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
                          alt={rating.SongInfo.Title} 
                          style={{ width: "100px", height: "100px" }} 
                        />
                      )}
                    </figure>
                  </td>
                  <td className="font-bold">{rating.SongInfo.Title}</td>
                  <td className="font-bold">{rating.SongInfo.Performers.map(performer => performer.Name).join(", ")}</td>
                  <td className="font-bold">{rating.SongInfo.Album}</td>
                  <td className="font-bold">{rating.SongInfo.Genres.map(genre => genre.Name).join(", ")}</td>
                  <td className="font-bold">{rating.SongInfo.ReleaseDate}</td>
                  <td className="font-bold">{convertToMinutes(rating.SongInfo.Length)}</td>
                  <td><DisplayStarRating rating={rating.Rating}/></td>
                  <td className="font-bold">{parseDate(rating.Date)}</td>
                  <td>
                    <button onClick={() => removeRating(parseInt(rating.SongRatingID))} disabled={deleting} className="btn btn-error btn-circle">
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
}

export default SongRatings;