import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import showToast from "../../components/showToast";
import DisplayStarRating from "../../components/DisplayStarRating";
import axiosInstance from "../../services/axiosConfig";

const PerformerRatings = () => {
    const navigate = useNavigate();
    
    const [ratingData, setRatingData] = useState([]);
    const [performerData, setPerformerData] = useState([]);
    const [selectedPerformer, setSelectedPerformer] = useState(1);
    const [rating, setRating] = useState(1);
    const [filteredRatingData, setFilteredRatingData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [loading, setLoading] = useState(false);
    const [operating, setOperating] = useState(false); 
    const [noResults, setNoResults] = useState(false);

    const fetchRatingData = async () => {
        try {
            setLoading(true); 
            setNoResults(false);

            const response = await axiosInstance.get(`/rating/performer/get/userid`);

            if (response.status === 200) { 
                if (response.data.data.length === 0) {
                    setNoResults(true);
                } else {
                    console.log("Performer ratings:", response.data.data);
                    setRatingData(response.data.data);
                    setFilteredRatingData(response.data.data);
                }
            }
        } catch (error) {
            setNoResults(true);
            if (error.status === 401 || error.status === 403) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                showToast("warn", "Your session has expired. Please log in again.");
                setTimeout(() => {
                    navigate("/login");
                } , 3000);
            } else {
                console.error("Error during fetching rating data:", error);
                showToast("err", "Error fetching ratings.");
            }
        } finally {
            setLoading(false); 
        }
    };

    const fetchPerformers = async () => {
        try {
            const response = await axiosInstance.get(`/performer/getAllPerformers`);

            if (response.status === 200) {
                if (response.data.data.length === 0) {
                    showToast('warn', 'No performers found.');
                } else {
                    setPerformerData(response.data.data);
                }
            }
        } catch (error) {
            if (error.response.status === 401 || error.response.status === 403) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                showToast("warn", "Your session has expired. Please log in again.");
                setTimeout(() => {
                    navigate("/login");
                } , 3000);
            } else {
                console.error("Error during fetching performer data:", error);
                showToast("err", "Error fetching performers.");
            }
        }
    };

    const removeRating = async (performerRatingId) => {
        try {
            setOperating(true); // Set deleting to true before making the API request
            showToast("info", "Deleting rating...");

            const response = await axiosInstance.post(`/rating/performer/delete/performerratingid`, { performerRatingId });

            if (response.status === 200) { 
                showToast("ok", "Rating deleted successfully.");
            }
        } catch (error) {
            if (error.response.status === 404) {
                showToast("warn", "Rating not found.");
            } else if (error.response.status === 401 || error.response.status === 403) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                showToast("warn", "Your session has expired. Please log in again.");
                setTimeout(() => {
                    navigate("/login");
                } , 3000);
            } else {
                console.error("Error during fetch", error);
                showToast("err", "Error deleting rating.");
            }
        } finally {
            setOperating(false); 
            fetchRatingData();
        }
    };

    const addRating = async () => {
        if (rating < 1 || rating > 5) {
            showToast("warn", "Rating must be between 1 and 5.");
            return;
        }
        try {
            setOperating(true); 
            showToast("info", "Adding rating...");

            const payload = {
                performerId: selectedPerformer,
                rating,
            };

            const response = await axiosInstance.post(`/rating/performer/create`, payload);

            if (response.status === 200) { 
                showToast("ok", "Rating added successfully.");
            }
        } catch (error) {
            if (error.response.status === 404) {
                showToast("warn", "Performer not found.");
            } else if (error.response.status === 401 || error.response.status === 403) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                showToast("warn", "Your session has expired. Please log in again.");
                setTimeout(() => {
                    navigate("/login");
                } , 3000);
            } else {
                console.error("Error during fetch", error);
                showToast("err", "Error adding rating.");
            }
        } finally {
            setOperating(false); 
            fetchRatingData();
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    
        // Update userSongs based on the search query
        const filteredSongs = event.target.value
          ? ratingData.filter(song =>
              song.PerformerInfo.Name.toLowerCase().includes(event.target.value.toLowerCase())
            )
          : ratingData;
    
        setFilteredRatingData(filteredSongs);
        setNoResults(filteredSongs.length === 0);
    };

    useEffect(() => {
        fetchPerformers();
        fetchRatingData();
    }, []);

    return (
        <div>
            <div className="my-20 p-4">
                <h1 className="font-bold mb-8 flex items-center justify-center text-3xl">Your Performer Ratings</h1>
                <div className="flex items-center justify-center">
                    <input 
                        className="input input-bordered input-primary" 
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="join flex items-center justify-center my-8">
                    <div className="join-item ml-8">
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Choose Performer</span>
                            </div>
                            <select 
                                className="select select-bordered select-primary"
                                id="performer"
                                value={selectedPerformer}
                                onChange={(e) => setSelectedPerformer(e.target.value)}
                            >
                                <option value="" disabled>Pick one</option>
                                {performerData.map((performer) => (
                                    <option key={performer.PerformerID} value={performer.PerformerID}>
                                        {performer.Name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="join-item mx-8">
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Select Rating</span>
                            </div>
                            <select 
                                className="select select-bordered select-primary"
                                id="rating"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                            >
                                <option value="" disabled>Pick one</option>
                                <option value="1">1 Star</option>
                                <option value="2">2 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="5">5 Stars</option>
                            </select>
                        </label>
                    </div>
                    <div className="join-item">
                        <button onClick={addRating} disabled={operating} className="btn btn-primary mt-8">
                            Add Rating
                        </button>
                    </div>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center">
                        <span className="loading loading-bars loading-lg"></span>
                    </div>
                ) : noResults ? (
                    <div>No results found.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12">
                        {filteredRatingData.map((rating) => (
                            <div key={rating.PerformerRatingID} className="card w-96 bg-base-100 shadow-xl">
                                <figure>
                                    {rating.PerformerInfo.Image && JSON.parse(rating.PerformerInfo.Image)?.[1] && (
                                        <img src={JSON.parse(rating.PerformerInfo.Image)[1].url} alt={rating.PerformerInfo.Name} />
                                    )}
                                </figure>
                                <div className="card-body">
                                    <h2 className="card-title">{rating.PerformerInfo.Name}</h2>
                                    <p>Rating: </p>
                                    <DisplayStarRating rating={rating.Rating} />
                                    <p>Date: {rating.Date}</p>
                                </div>
                                <div className="card-actions flex items-center justify-center mb-8">
                                    <button onClick={() => removeRating(parseInt(rating.PerformerRatingID))} disabled={operating} className="btn btn-error">
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

export default PerformerRatings;