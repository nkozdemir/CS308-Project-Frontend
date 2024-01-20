import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../services/axiosConfig';
import handleSessionExpiration from '../../utils/sessionUtils';
import showToast from '../../components/showToast';
import convertToMinutes from '../../utils/convertToMinutes';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AddSongToPlaylist = () => {
    const navigate = useNavigate();
    const [userSongs, setUserSongs] = useState([]);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noResults, setNoResults] = useState(false);
    const [noPlaylists, setNoPlaylists] = useState(false);
    const [reverseOrder, setReverseOrder] = useState(false);

    const fetchUserSongs = async (playlistID) => {
        try {
            setLoading(true);
            const response = await axiosInstance.post(`/playlist/getSongsToAdd`, { playlistID });
            const userSongs = response.data.data;
            //console.log('User Songs:', userSongs);
            setUserSongs(userSongs);
            setNoResults(false);
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

    const fetchUserPlaylists = async () => {
        try {
            const response = await axiosInstance.get(`/playlist/getAllUserPlaylists`);
            //console.log('User Playlists:', response.data.data);
            setUserPlaylists(response.data.data);
            setNoPlaylists(false);
            formik.setFieldValue('playlistID', response.data.data[0].PlaylistID);
        } catch (error) {
            if (error.response.status === 404) {
                setNoPlaylists(true);
            } else if (error.response.status === 401 || error.response.status === 403) {
                handleSessionExpiration(navigate);
            } else {
                console.error("Error during fetching playlist data:", error);
                showToast("err", "An error occurred while fetching playlist data.");
            }
        }
    }

    const addSongsToPlaylist = async (playlistID, songIDs) => {
        try {
            await axiosInstance.post(`/playlist/addSongsToPlaylist`, { playlistID, songIDs });
            showToast("ok", "Song(s) successfully added to playlist.");
        } catch (error) {
            if (error.response.status === 401 || error.response.status === 403) {
                handleSessionExpiration(navigate);
            } else {
                console.error("Error during adding song to playlist:", error);
                showToast("err", "An error occurred while adding song to playlist.");
            }
        } finally {
            formik.resetForm();
            fetchUserSongs(playlistID);
        }
    }

    const handleSelectAll = (e) => {
        const allSongIDs = userSongs.map(song => song.SongID);
        formik.setFieldValue('selectedSongs', e.target.checked ? allSongIDs : []);
    };

    const handleSelectSong = (e, songID) => {
        const isChecked = e.target.checked;
        const selectedSongs = formik.values.selectedSongs;
    
        if (isChecked) {
            formik.setFieldValue('selectedSongs', [...selectedSongs, songID]);
        } else {
            formik.setFieldValue('selectedSongs', selectedSongs.filter((id) => id !== songID));
        }
    };

    // Form validation schema
    const validationSchema = Yup.object().shape({
        playlistID: Yup.number().min(1, 'Playlist Name is required.'),
    });

    // Formik form management
    const formik = useFormik({
        initialValues: {
            playlistID: 0,
            selectedSongs: [],
        },
        validationSchema,
        onSubmit: async (values) => {
            await addSongsToPlaylist(values.playlistID, values.selectedSongs);
        },
    });

    const toggleSortDirection = () => {
        setUserSongs((prevSongs) => [...prevSongs].reverse()); 
        setReverseOrder((prevOrder) => !prevOrder); 
    };

    useEffect(() => {
        fetchUserPlaylists();
    }, []);

    useEffect(() => {
        if (formik.values.playlistID !== 0) {
            fetchUserSongs(formik.values.playlistID);
        }
    }, [formik.values.playlistID]);

    return (
        <div>
            <h1 className="font-bold mb-8 flex items-center justify-center text-3xl">Add Songs To Playlist</h1>
            <div>
                <form onSubmit={formik.handleSubmit}>
                    <div className='flex flex-col items-center justify-center mb-16 sm:flex-row'>
                        <label className="form-control w-full max-w-xs mb-4 sm:mb-0">
                            <div className="label">
                                <span className="label-text">Choose Playlist</span>
                            </div>
                            <select 
                                className={`select select-bordered ${formik.touched.playlistID && formik.errors.playlistID ? 'select-error' : 'select-primary'}`}
                                name='playlistID'
                                id='playlistID'
                                value={formik.values.playlistID}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={formik.isSubmitting || userPlaylists.length === 0 || loading}
                            >
                                {userPlaylists.map((playlist) => (
                                    <option key={playlist.PlaylistID} value={playlist.PlaylistID}>
                                        {playlist.Name}
                                    </option>
                                ))}
                            </select>
                            <div className='label'>
                            {formik.touched.playlistID && formik.errors.playlistID && (
                                <div className="label-text-alt text-error">{formik.errors.playlistImage}</div>
                            )}
                            </div>
                        </label>
                        <button 
                            type='submit'
                            className="btn btn-primary sm:ml-8 sm:mt-4"
                            disabled={formik.isSubmitting || !formik.isValid || loading || formik.values.selectedSongs.length === 0} 
                        >
                            {formik.isSubmitting ? (
                                <>
                                    <span className="animate-spin mr-2">&#9696;</span>
                                    Adding Songs 
                                </>
                            ) : (
                                'Add Songs'
                            )}
                        </button>
                    </div>
                </form>
                {loading ? (
                    <div className="flex items-center justify-center">
                        <span className="loading loading-bars loading-lg"></span>
                    </div>
                ) : noPlaylists ? (
                    <p className="flex items-center justify-center font-bold text-xl">No playlists found. You can create playlists from <Link to="/playlist" className="text-indigo-600 hover:text-indigo-700 ml-1">here</Link>.</p>
                ) : noResults ? (
                    <p className='flex items-center justify-center font-bold text-xl'>No songs available to add.</p>
                ) : (
                    <>
                        <h2 className='font-bold text-2xl mb-8'>Choose Songs To Add</h2>
                        <div className='relative overflow-x-auto max-h-[400px] shadow-lg'>
                            <table className='table'>
                                <thead className='sticky top-0 z-50 bg-base-200'>
                                    <tr>
                                        <th>
                                            <input 
                                                type="checkbox" 
                                                name="selectAll" 
                                                value="selectAll"
                                                className='checkbox checkbox-accent' 
                                                onChange={(e) => handleSelectAll(e)}
                                                disabled={formik.isSubmitting}
                                                checked={formik.values.selectedSongs.length === userSongs.length}
                                            />
                                        </th>
                                        <th onClick={toggleSortDirection} style={{ cursor: 'pointer' }}>
                                            Image
                                            {!reverseOrder ? ' ▲' : ' ▼'}
                                        </th>
                                        <th>Title</th>
                                        <th>Album</th>
                                        <th>Performer(s)</th>
                                        <th>Genre(s)</th>
                                        <th>Duration</th>
                                        <th>Release Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userSongs
                                        .map((song) => (
                                        <tr key={song.SongID} className='hover'>
                                            <td>
                                                <input 
                                                    type="checkbox" 
                                                    name="selectedSongs"
                                                    className='checkbox checkbox-accent' 
                                                    value={song.SongID}
                                                    onChange={(e) => handleSelectSong(e, song.SongID)}
                                                    disabled={formik.isSubmitting}
                                                    checked={formik.values.selectedSongs.includes(song.SongID)}
                                                />
                                            </td>
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
                                            <td className="font-bold">{song.Performers.map(genre => genre.Name).join(", ")}</td>
                                            <td className="font-bold">{song.Album}</td>
                                            <td className="font-bold">{song.Genres.length > 0 ? song.Genres.map(genre => genre.Name).join(", ") : "N/A"}</td>
                                            <td className="font-bold">{convertToMinutes(song.Length)}</td>
                                            <td className="font-bold">{song.ReleaseDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
};

export default AddSongToPlaylist;