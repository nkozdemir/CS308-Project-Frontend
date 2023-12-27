import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosConfig';
import showToast from '../showToast';
import convertToMinutes from '../../utils/convertToMinutes';

const Recommendations = () => {
  const navigate = useNavigate();

  const [songRecommendations, setSongRecommendations] = useState([]);
  const [loadingSongRecommendations, setLoadingSongRecommendations] = useState(false);
  const [addingSong, setAddingSong] = useState(false);
  const [noRecommendations, setNoRecommendations] = useState(false);

  const getSongRecommendations = async () => {
    try {
      setLoadingSongRecommendations(true);
      setNoRecommendations(false);
      const response = await axiosInstance.post('/recommendation/get', { numberOfResults: 6 });

      if (response.status === 200) {
        if (response.data.data.length === 0) {
          setNoRecommendations(true);
        } else {
          setSongRecommendations(response.data.data);
        }
      }
    } catch (error) {
      if (error.response.status === 404) {
        setNoRecommendations(true);
      } else if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        showToast('warn', 'Your session has expired. Please log in again.');
        setTimeout(() => {
            navigate('/login');
        }, 3000);
      } else {
        console.error('Error fetching song recommendations: ', error);
        showToast('error', 'Error fetching song recommendations. Please try again later.');
        setNoRecommendations(true);
      }
    } finally {
      setLoadingSongRecommendations(false);
    }
  };

  useEffect(() => {
    getSongRecommendations();
  }, []);

  const addSong = async (spotifyId) => {
    try {
      setAddingSong(true);
      showToast('info', 'Adding song...');
      const response = await axiosInstance.post('/song/addSpotifySong', { spotifyId });

      if (response.status === 200) {
        showToast('success', 'Song added successfully!');
      }
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 403) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        showToast('warn', 'Your session has expired. Please log in again.');
        setTimeout(() => {
            navigate('/login');
        }, 3000);
      } else {
        console.error('Error during fetch', error);
        showToast('error', 'Error adding song. Please try again later.');
      }
    } finally {
      setAddingSong(false);
    }
  };

  return (
    <div className='mt-8'>
      <div className="flex items-center justify-center">
        <h1 className="font-bold flex items-center justify-center text-3xl">Recommended Songs For You</h1>
        <button
          onClick={() => {
            setNoRecommendations(false);
            getSongRecommendations();
          }}
          disabled={loadingSongRecommendations}
          className='btn btn-info btn-circle btn-md ml-4'
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
            <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H352c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32s-32 14.3-32 32v35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V432c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"/>
          </svg>
        </button>
      </div>
      {loadingSongRecommendations ? (
        <div className="flex items-center justify-center mt-8">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : noRecommendations ? (
        <p>No recommendations found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-16">
          {songRecommendations.map((song) => (
            <div key={song.SpotifyId} className="card w-96 bg-base-100 shadow-xl">
              <figure>
                <img src={song.Album.images[1].url} alt={song.Title} />
              </figure>
              <div className='card-body'>
                <h2 className="card-title">{song.Title}</h2>
                <p>Performers: {song.Performer.map((performer) => performer.name).join(', ')}</p>
                <p>Album: {song.Album.name}</p>
                <p>Release Date: {song.Album.release_date}</p>
                <p>Length: {convertToMinutes(song.Length)}</p>
              </div>
              <div className='card-actions flex items-center justify-center'>
                <button 
                  onClick={() => addSong(song.SpotifyId)} 
                  disabled={addingSong}
                  className='btn btn-success btn-circle mb-4'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512">
                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;