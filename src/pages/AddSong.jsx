import { useNavigate } from 'react-router-dom';
import showToast from '../components/showToast';
import axiosInstance from '../services/axiosConfig';
import handleSessionExpiration from '../utils/sessionUtils';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function AddSong() {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    songName: Yup.string().required('Track Name is required'),
    performer: Yup.string().required('Performer Name(s) is required'),
    album: Yup.string().required('Album Name is required'),
    length: Yup.number().required('Length (ms) is required').positive('Length should be a positive number'),
    genres: Yup.string().required('Genre(s) is required'),
    releaseDate: Yup.string()
      .required('Release Date is required')
      .matches(
        /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
        'Release Date should be in the format YYYY-MM-DD'
      ),
  });

  const formik = useFormik({
    initialValues: {
      songName: '',
      performer: '',
      album: '',
      length: '',
      genres: '',
      releaseDate: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await handleAddSong(values);
    },
  });

  const handleAddSong = async (values) => {
    try {
      showToast('info', 'Adding song...');

      const payload = {
        title: values.songName,
        performers: values.performer,
        album: values.album,
        length: values.length,
        genres: values.genres,
        releaseDate: values.releaseDate,
      }
      console.log('payload:', payload);

      // Use Axios to make the POST request
      const response = await axiosInstance.post('/song/addCustomSong', payload);

      if (response.status === 200) {
        formik.resetForm();
        showToast('ok', 'Song added successfully!');
      }
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        handleSessionExpiration(navigate);
      } else {
        console.error('Error during adding song:', error);
        showToast('err', 'An error occurred while adding the song.');
      }
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
              value={formik.values.songName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="songName"
              placeholder="Enter Track Name"
              className="input input-bordered input-primary w-full"
              required
              disabled={formik.isSubmitting}
            />
            {formik.touched.songName && formik.errors.songName ? (
              <div className='label'>
                <div className="label-text-alt text-error">{formik.errors.songName}</div>
              </div>
            ) : null}
          </label>
          <label className="form-control mb-4">
            <div className="label">
              <span className="label-text">Performer Name(s)</span>
            </div>
            <input
              type="text"
              value={formik.values.performer}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="performer"
              placeholder="Enter Performer Name(s)"
              className="input input-bordered input-primary w-full"
              required
              disabled={formik.isSubmitting}
            />
            {formik.touched.performer && formik.errors.performer ? (
              <div className='label'>
                <div className="label-text-alt text-error">{formik.errors.performer}</div>
              </div>
            ) : null}
          </label>
          <label className="form-control mb-4">
            <div className="label">
              <span className="label-text">Album Name</span>
            </div>
            <input
              type="text"
              value={formik.values.album}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="album"
              placeholder="Enter Album Name"
              className="input input-bordered input-primary w-full"
              required
              disabled={formik.isSubmitting}
            />
            {formik.touched.album && formik.errors.album ? (
              <div className='label'>
                <div className="label-text-alt text-error">{formik.errors.album}</div>
              </div>
            ) : null}
          </label>
          <label className="form-control mb-4">
            <div className="label">
              <span className="label-text">Length (ms)</span>
            </div>
            <input
              type="text"
              value={formik.values.length}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="length"
              placeholder="Enter Length (ms)"
              className="input input-bordered input-primary w-full"
              required
              disabled={formik.isSubmitting}
            />
            {formik.touched.length && formik.errors.length ? (
              <div className='label'>
                <div className="label-text-alt text-error">{formik.errors.length}</div>
              </div>
            ) : null}
          </label>
          <label className="form-control mb-4">
            <div className="label">
              <span className="label-text">Genre(s)</span>
            </div>
            <input
              type="text"
              value={formik.values.genres}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="genres"
              placeholder="Enter Genre(s)"
              className="input input-bordered input-primary w-full"
              required
              disabled={formik.isSubmitting}
            />
            {formik.touched.genres && formik.errors.genres ? (
              <div className='label'>
                <div className="label-text-alt text-error">{formik.errors.genres}</div>
              </div>
            ) : null}
          </label>
          <label className="form-control mb-4">
            <div className="label">
              <span className="label-text">Release Date</span>
            </div>
            <input
              type="text"
              value={formik.values.releaseDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="releaseDate"
              placeholder="Enter Release Date"
              className="input input-bordered input-primary w-full"
              required
              disabled={formik.isSubmitting}
            />
            {formik.touched.releaseDate && formik.errors.releaseDate ? (
              <div className='label'>
                <div className="label-text-alt text-error">{formik.errors.releaseDate}</div>
              </div>
            ) : null}
          </label>
        </div>
        <div className='mt-8'>
          <button
            type='submit' 
            className="btn btn-primary" 
            disabled={formik.isSubmitting || !formik.isValid} 
            onClick={formik.handleSubmit}>
            {formik.isSubmitting ? (
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