import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import showToast from "../../components/showToast";
import DisplayStarRating from "../../components/DisplayStarRating";
import axiosInstance from "../../services/axiosConfig";
import parseDate from "../../utils/parseDate";
import handleSessionExpiration from "../../utils/sessionUtils";

const PerformerRatings = () => {
    const navigate = useNavigate();
    
    const [ratingData, setRatingData] = useState([]);
    const [performerData, setPerformerData] = useState([]);
    const [selectedPerformer, setSelectedPerformer] = useState(0);
    const [rating, setRating] = useState(0);
    const [filteredRatingData, setFilteredRatingData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [loading, setLoading] = useState(false);
    const [operating, setOperating] = useState(false); 
    const [noResults, setNoResults] = useState(false);
    const [loadingPerformers, setLoadingPerformers] = useState(false);
    const [noPerformers, setNoPerformers] = useState(false);

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
            setNoResults(false);

            const response = await axiosInstance.get(`/rating/performer/get/userid`);

            if (response.status === 200) { 
                //console.log("Performer ratings:", response.data.data);
                setRatingData(response.data.data);
                setFilteredRatingData(response.data.data);
            }
        } catch (error) {
            if (error.response.status === 404) {
                setNoResults(true);
            } else if (error.status === 401 || error.status === 403) {
                handleSessionExpiration(navigate);
            } else {
                console.error("Error during fetching rating data:", error);
                showToast("err", "An error occurred while fetching rating data.");
            }
        } finally {
            setLoading(false); 
        }
    };

    const fetchPerformers = async () => {
        try {
            setLoadingPerformers(true);
            const response = await axiosInstance.get(`/rating/song/get/performers`);

            if (response.status === 200) {
                setPerformerData(response.data.data);
            }
        } catch (error) {
            if (error.response.status === 404) {
                setNoPerformers(true);
            } else if (error.response.status === 401 || error.response.status === 403) {
                handleSessionExpiration(navigate);
            } else {
                console.error("Error during fetching performer data:", error);
                showToast("err", "An error occurred while fetching performer data.");
            }
        } finally {
            setLoadingPerformers(false);
        }
    };

    const removeRating = async (performerRatingId) => {
        try {
            setOperating(true);
            showToast("info", "Deleting rating...");

            const response = await axiosInstance.post(`/rating/performer/delete/performerratingid`, { performerRatingId });

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
            setOperating(false); 
            fetchRatingData();
        }
    };

    const addRating = async () => {
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
                setSelectedPerformer(0);
                setRating(0);
            }
        } catch (error) {
            if (error.response.status === 401 || error.response.status === 403) {
                handleSessionExpiration(navigate);
            } else {
                console.error("Error during adding rating:", error);
                showToast("err", "An error occurred while adding rating.");
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
    };

    useEffect(() => {
        fetchPerformers();
        fetchRatingData();
    }, []);

    return (
        <div>
            <h1 className="font-bold mb-8 flex items-center justify-center text-3xl">Your Performer Ratings</h1>
            <div className="flex items-center justify-center">
                <input 
                    className="input input-bordered input-primary" 
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    disabled={loading || operating || noPerformers || noResults}
                />
            </div>
            <div className="join flex items-center justify-center my-8">
                {loadingPerformers && (
                    <div className='join-item mr-8 mt-8'>
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                )}
                <div className="join-item">
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Choose Performer</span>
                        </div>
                        <select 
                            className="select select-bordered select-primary"
                            id="performer"
                            value={selectedPerformer}
                            onChange={(e) => setSelectedPerformer(e.target.value)}
                            disabled={loadingPerformers || operating || noPerformers}
                        >
                            <option value={0} disabled>Pick one</option>
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
                            disabled={loadingPerformers || operating || noPerformers}
                        >
                            <option value={0} disabled>Pick one</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </label>
                </div>
                <div className="join-item">
                    <button onClick={addRating} disabled={operating || loadingPerformers || selectedPerformer === 0 || rating === 0} className="btn btn-primary mt-8">
                        Add Rating
                    </button>
                </div>
            </div>
            {loading ? (
                <div className="flex items-center justify-center">
                    <span className="loading loading-bars loading-lg"></span>
                </div>
            ) : noPerformers ? (
                <p className='flex items-center justify-center'>No performer data found. You must rate songs first.</p>
            ) : noResults ? (
                <p className='flex items-center justify-center'>No performer rating data found. You can rate performers from above.</p>
            ) : filteredRatingData.length === 0 ? (
                <p className='flex items-center justify-center'>No results found.</p>
            ) : (
                <div className="relative overflow-x-auto shadow-lg max-h-[400px]">
                    <table className="table">
                        <thead className="sticky top-0 z-50 bg-base-200">
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
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
                                <tr key={rating.PerformerRatingID} className='hover'>
                                    <td>
                                        <figure>
                                            {rating.PerformerInfo.Image && JSON.parse(rating.PerformerInfo.Image)?.[2] ? (
                                                <img 
                                                    src={JSON.parse(rating.PerformerInfo.Image)[2].url} 
                                                    alt={rating.PerformerInfo.Name} 
                                                    style={{ width: '100px', height: '100px' }}
                                                />
                                            ) : (
                                                <img 
                                                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
                                                    alt={rating.PerformerInfo.Name} 
                                                    style={{ width: '100px', height: '100px' }}
                                                />
                                            )}
                                        </figure>
                                    </td>
                                    <td className="font-bold">{rating.PerformerInfo.Name}</td>
                                    <td><DisplayStarRating rating={rating.Rating} /></td>
                                    <td className="font-bold">{parseDate(rating.Date)}</td>
                                    <td>
                                        <button
                                            onClick={() => removeRating(parseInt(rating.PerformerRatingID))}
                                            disabled={operating}
                                            className='btn btn-error btn-circle'
                                        >
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

export default PerformerRatings;