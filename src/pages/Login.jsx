import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import showToast from '../components/showToast';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('accessToken');

    if (isAuthenticated) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      setLoading(true);

      if (!email || !password) {
        showToast('warn', 'Please fill in all fields.');
        setLoading(false);
        return;
      }

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
      if (error.response.status === 400 || error.response.status === 404) {
        showToast('err', 'Wrong email or password.');
      } else {
        console.error('Error during login:', error);
        showToast('err', 'An error occurred while logging in.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="shadow-md rounded p-8 mb-4 w-auto">
        <div>
          <h2 className="text-3xl font-bold mb-8">Login</h2>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className='mb-4'>
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input 
              type="text"
              required
              id='email'
              name='email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Enter your email address" 
              className="input input-bordered w-full max-w-xs" 
            />
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
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Enter your password" 
              className="input input-bordered w-full max-w-xs" 
            />
          </div>
          <div className="mt-8 flex items-center justify-center">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
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
          Dont have an account?
          <Link to="/register" className="text-indigo-600 hover:text-indigo-700 ml-1">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;