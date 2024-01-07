import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import showToast from '../components/showToast';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Register = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      await handleSubmit(values);
      setSubmitting(false);
    },
  });

  const handleSubmit = async ({ name, email, password }) => {
    try {
      // Validate the form data using Formik and Yup
      await validationSchema.validate({ name, email, password }, { abortEarly: false });

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register`, {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        // Registration successful, redirect to the login page
        showToast('ok', 'Registration successful! Redirecting to login page...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      if (error.name === 'ValidationError') {
        // Yup validation error, display error messages
        error.errors.forEach((errorMessage) => showToast('warn', errorMessage));
      } else {
        console.error('Error during registration:', error.message);
        showToast('err', 'An error occurred during registration.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-auto shadow-lg rounded p-8 mb-4">
        <div>
          <h2 className="text-3xl font-bold mb-8">Register</h2>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <div className="label">
              <span className="label-text">Full Name</span>
            </div>
            <input
              type="text"
              id="name"
              name="name"
              required
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              placeholder="Enter your full name"
              className={`input ${formik.touched.name && formik.errors.name ? 'input-error' : 'input-primary'} input-bordered w-full max-w-xs`}
              disabled={formik.isSubmitting}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="label">
                <div className="label-text-alt text-error">{formik.errors.name}</div>
              </div>
            ) : null}
          </div>
          <div className="mb-4">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input
              type="text"
              required
              id="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Enter your email address"
              className={`input ${formik.touched.email && formik.errors.email ? 'input-error' : 'input-primary'} input-bordered w-full max-w-xs`}
              disabled={formik.isSubmitting}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="label">
                <div className="label-text-alt text-error">{formik.errors.email}</div>
              </div>
            ) : null}
          </div>
          <div className="mb-4">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <input
              type="password"
              required
              id="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder="Enter your password"
              className={`input ${formik.touched.password && formik.errors.password ? 'input-error' : 'input-primary'} input-bordered w-full max-w-xs`}
              disabled={formik.isSubmitting}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="label">
                <div className="label-text-alt text-error">{formik.errors.password}</div>
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-center mt-8">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {formik.isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">&#9696;</span>
                  Registering
                </>
              ) : (
                'Register'
              )}
            </button>
          </div>
        </form>
        <p className="flex justify-center items-center mt-8">
          Already have an account?
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 ml-1">
            Login from here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;