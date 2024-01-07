/* eslint-disable react/no-unescaped-entities */
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import showToast from '../components/showToast';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Login = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await handleLogin(values);
    },
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('accessToken');

    if (isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        navigate('/');
      }
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 404)) {
        showToast('err', 'Wrong email or password.');
      } else {
        console.error('Error during login:', error);
        showToast('err', 'An error occurred while logging in.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="shadow-lg rounded p-8 mb-4 w-auto">
        <div>
          <h2 className="text-3xl font-bold mb-8">Login</h2>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className='mb-4'>
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input 
              type="text"
              required
              id='email'
              name='email'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Enter your email address" 
              className={`input ${formik.touched.email && formik.errors.email ? 'input-error' : 'input-primary'} input-bordered w-full max-w-xs`}
              disabled={formik.isSubmitting} 
            />
            {formik.touched.email && formik.errors.email ? (
              <div className='label'>
                <div className="label-text-alt text-error">{formik.errors.email}</div>
              </div>
            ) : null}
          </div>
          <div className='mb-4'>
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <input 
              type="password"
              required
              id='password'
              name='password'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder="Enter your password" 
              className={`input ${formik.touched.password && formik.errors.password ? 'input-error' : 'input-primary'} input-bordered w-full max-w-xs`}
              disabled={formik.isSubmitting}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className='label'>
                <div className="label-text-alt text-error">{formik.errors.password}</div>
              </div>
            ) : null}
          </div>
          <div className="mt-8 flex items-center justify-center">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {formik.isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">&#9696;</span>
                  Logging in
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>
        <p className='flex justify-center items-center mt-8'>
          Don't have an account?
          <Link to="/register" className="text-indigo-600 hover:text-indigo-700 ml-1">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;