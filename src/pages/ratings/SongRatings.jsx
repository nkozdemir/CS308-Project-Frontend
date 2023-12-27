import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import showToast from "../../components/showToast";
import convertToMinutes from "../../utils/convertToMinutes";
import DisplayStarRating from "../../components/DisplayStarRating";
import axiosInstance from "../../services/axiosConfig";

const SongRatings = () => {
  const navigate = useNavigate();
  
  const [ratingData, setRatingData] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [deleting, setDeleting] = useState(false); 
  const [noResults, setNoResults] = useState(false);

  const fetchRatingData = async () => {
    try {
      setLoading(true); 

      const response = await axiosInstance.get('/rating/song/get/userid');

      if (response.status === 200) { 
        if (response.data.data.length === 0) {
          setNoResults(true);
        } else {
          setRatingData(response.data.data);
        }
      }
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
        console.error("Error during fetch", error);
        showToast("err", "Error fetching ratings.");
      }
    } finally {
      setLoading(false); // Set loading to false after the API request is completed
    }
  };

  useEffect(() => {
    fetchRatingData();
  }, []);
  
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
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        showToast("warn", "Your session has expired. Please log in again.");
        setTimeout(() => {
            navigate("/login");
        }, 3000);
      } else {
        console.error("Error deleting rating:", error);
        showToast("err", "Error deleting rating.");
      }
    } finally {
      setDeleting(false); 
      fetchRatingData();
    }
  }

  return (
    <div>
      <div className="my-20 p-4">
        <h1 className="font-bold mb-8 flex items-center justify-center text-3xl">Your Song Ratings</h1>
        {loading ? (
          <div className="flex items-center justify-center">
            <span className="loading loading-bars loading-lg"></span>
          </div>
        ) : noResults ? (
          <p>No results found. You can rate your songs from <Link to="/song/user">here</Link>.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ratingData.map((rating) => (
              <div key={rating.SongRatingID} className="card w-96 bg-base-100 shadow-xl">
                <figure>
                  {rating.SongInfo.Image && JSON.parse(rating.SongInfo.Image)?.[1] && (
                    <img src={JSON.parse(rating.SongInfo.Image)[1].url} alt={rating.SongInfo.Image} />
                  )}
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{rating.SongInfo.Title}</h2>
                  <p>Album: {rating.SongInfo.Album}</p>
                  <p>Release Date: {rating.SongInfo.ReleaseDate}</p>
                  <p>Length: {convertToMinutes(rating.SongInfo.Length)}</p>
                  <p>Rating:</p> 
                  <DisplayStarRating rating={rating.Rating}/>
                  <p>Date Created: {rating.Date}</p>
                </div>
                <div className="card-actions flex items-center justify-center mb-8">
                  <button onClick={() => removeRating(parseInt(rating.SongRatingID))} disabled={deleting} className="btn btn-error">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                    </svg>
                  </button>
                </div>
              </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SongRatings;