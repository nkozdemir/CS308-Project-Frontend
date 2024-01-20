import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../services/axiosConfig';
import handleSessionExpiration from '../../utils/sessionUtils';
import showToast from '../../components/showToast';
import convertToMinutes from '../../utils/convertToMinutes';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CreatePlaylist = () => {
    const navigate = useNavigate();
    const [userSongs, setUserSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [reverseOrder, setReverseOrder] = useState(false);

    const fetchUserSongs = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/song/getAllUserSongs`);
            //console.log('User Songs:', response.data.data);
            setUserSongs(response.data.data);
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

    const createPlaylist = async (values) => {
        try {
            await axiosInstance.post(`/playlist/createPlaylist`, {
                playlistName: values.playlistName,
                playlistImage: values.playlistImage,
                songIDs: values.selectedSongs
            });
            showToast("ok", "Playlist created successfully.");
        } catch (error) {
            if (error.response.status === 401 || error.response.status === 403) {
                handleSessionExpiration(navigate);
            } else {
                console.error("Error during creating playlist:", error);
                showToast("err", "An error occurred while creating playlist.");
            }
        } finally {
            formik.resetForm();
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
        playlistName: Yup.string().required('Playlist Name is required.'),
        playlistImage: Yup.string(),
    });

    // Formik form management
    const formik = useFormik({
        initialValues: {
            playlistName: '',
            playlistImage: '',
            selectedSongs: [],
        },
        validationSchema,
        onSubmit: async (values) => {
            await createPlaylist(values);
        },
    });

    const toggleSortDirection = () => {
        setUserSongs((prevSongs) => [...prevSongs].reverse()); // Reverse the order of the existing songs
        setReverseOrder((prevOrder) => !prevOrder); // Toggle the reverse order state
    };

    useEffect(() => {
        fetchUserSongs();
    }, []);

    return (
        <div>
            <h1 className="font-bold mb-8 flex items-center justify-center text-3xl">Create Playlist</h1>
            <div>
                <form onSubmit={formik.handleSubmit}>
                    <div className='flex flex-col items-center justify-center mb-16 sm:flex-row'>
                        <label className="form-control w-full max-w-xs mb-4 sm:mb-0">
                            <div className="label">
                                <span className="label-text">Playlist Name</span>
                            </div>
                            <input 
                                type="text"
                                name='playlistName'
                                id='playlistName' 
                                placeholder="Playlist Name" 
                                className={`input input-bordered ${formik.touched.playlistName && formik.errors.playlistName ? 'input-error' : 'input-primary'} w-full`}
                                value={formik.values.playlistName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={formik.isSubmitting || loading}
                            />
                            <div className='label'>
                            {formik.touched.playlistName && formik.errors.playlistName ? (
                                <div className="label-text-alt text-error">{formik.errors.playlistName}</div>
                            ) : (
                                <div className="label-text-alt">Playlist name must be unique.</div>
                            )}
                            </div>
                        </label>
                        <label className="form-control w-full max-w-xs sm:ml-8">
                            <div className="label">
                                <span className="label-text">Playlist Image</span>
                            </div>
                            <input 
                                type="text"
                                name='playlistImage' 
                                id='playlistImage'
                                placeholder="Image URL" 
                                className={`input input-bordered ${formik.touched.playlistImage && formik.errors.playlistImage ? 'input-error' : 'input-primary'} w-full`}
                                value={formik.values.playlistImage}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={formik.isSubmitting || loading}
                            />
                            <div className='label'>
                            {formik.touched.playlistImage && formik.errors.playlistImage ? (
                                <div className="label-text-alt text-error">{formik.errors.playlistImage}</div>
                            ) : (
                                <div className="label-text-alt">Provide an image object.</div>
                            )}
                            </div>
                        </label>
                        <button 
                            type='submit'
                            className="btn btn-primary mt-8 sm:mt-0 ml-0 sm:ml-8"
                            disabled={formik.isSubmitting || !formik.isValid || loading} 
                        >
                            {formik.isSubmitting ? (
                                <>
                                    <span className="animate-spin mr-2">&#9696;</span>
                                    Creating Playlist 
                                </>
                            ) : (
                                'Create Playlist'
                            )}
                        </button>
                    </div>
                </form>
                {loading ? (
                    <div className="flex items-center justify-center">
                        <span className="loading loading-bars loading-lg"></span>
                    </div>
                ) : noResults ? (
                    <p className='flex items-center justify-center'>No songs found. You add songs from <Link to="/song/search" className="text-indigo-600 hover:text-indigo-700 ml-1">here</Link>.</p>
                ) : (
                    <>
                        <h2 className='font-bold text-2xl mb-8'>Choose Songs (Optional)</h2>
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
                                    {userSongs.map((song) => (
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
    );
};

export default CreatePlaylist;