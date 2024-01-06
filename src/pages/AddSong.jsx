import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import showToast from '../components/showToast';
import axiosInstance from '../services/axiosConfig';
import handleSessionExpiration from '../utils/sessionUtils';

function AddSong() {
  const navigate = useNavigate();

  const [songData, setSongData] = useState({
    songName: '',
    performer: '',
    album: '',
    length: '',
    genres: '',
    releaseDate: '',
  });

  const [adding, setAdding] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSongData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddSong = async () => {
    try {
      setAdding(true);

      // Validate input before making a request to the backend
      if (!Object.values(songData).every(Boolean)) {
        showToast('warn', 'Please fill in all fields.');
        setAdding(false);
        return;
      }

      const payload = {
        title: songData.songName,
        performers: songData.performer,
        album: songData.album,
        length: songData.length,
        genres: songData.genres,
        releaseDate: songData.releaseDate,
      };

      // Use Axios to make the POST request
      const response = await axiosInstance.post('/song/addCustomSong', payload);

      if (response.status === 200) {
        setSongData({
          songName: '',
          performer: '',
          album: '',
          length: '',
          genres: '',
          releaseDate: '',
        });
        showToast('ok', 'Song added successfully!');
      }
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 403) {
        handleSessionExpiration(navigate);
      } else {
        console.error('Error during adding song:', error);
        showToast('err', 'An error occurred while adding the song.');
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <div className="my-20 p-4 flex flex-col items-center">
        <h1 className="font-bold mb-8 text-3xl">Add Song</h1>
        <div className="w-full max-w-xs">
          <label className="form-control mb-4">
            <div className="label">
              <span className="label-text">Track Name</span>
            </div>
            <input
              type="text"
              value={songData.songName}
              onChange={handleInputChange}
              name="songName"
              placeholder="Enter Track Name"
              className="input input-bordered input-primary w-full"
              required
              disabled={adding}
            />
          </label>
          <label className="form-control mb-4">
            <div className="label">
              <span className="label-text">Performer Name(s)</span>
            </div>
            <input
              type="text"
              value={songData.performer}
              onChange={handleInputChange}
              name="performer"
              placeholder="Enter Performer Name(s)"
              className="input input-bordered input-primary w-full"
              required
              disabled={adding}
            />
          </label>
          <label className="form-control mb-4">
            <div className="label">
              <span className="label-text">Album Name</span>
            </div>
            <input
              type="text"
              value={songData.album}
              onChange={handleInputChange}
              name="album"
              placeholder="Enter Album Name"
              className="input input-bordered input-primary w-full"
              required
              disabled={adding}
            />
          </label>
          <label className="form-control mb-4">
            <div className="label">
              <span className="label-text">Length (ms)</span>
            </div>
            <input
              type="text"
              value={songData.length}
              onChange={handleInputChange}
              name="length"
              placeholder="Enter Length (ms)"
              className="input input-bordered input-primary w-full"
              required
              disabled={adding}
            />
          </label>
          <label className="form-control mb-4">
            <div className="label">
              <span className="label-text">Genre(s)</span>
            </div>
            <input
              type="text"
              value={songData.genres}
              onChange={handleInputChange}
              name="genres"
              placeholder="Enter Genre(s)"
              className="input input-bordered input-primary w-full"
              required
              disabled={adding}
            />
          </label>
          <label className="form-control mb-4">
            <div className="label">
              <span className="label-text">Release Date</span>
            </div>
            <input
              type="text"
              value={songData.releaseDate}
              onChange={handleInputChange}
              name="releaseDate"
              placeholder="Enter Release Date"
              className="input input-bordered input-primary w-full"
              required
              disabled={adding}
            />
          </label>
        </div>
        <div className='mt-8'>
          <button className="btn btn-primary" disabled={adding} onClick={handleAddSong}>
            {adding ? (
                <>
                  <span className="animate-spin mr-2">&#9696;</span>
                  Adding song 
                </>
            ) : (
              'Add Song'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddSong;
