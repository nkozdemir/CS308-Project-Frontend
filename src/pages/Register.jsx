import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import showToast from '../components/showToast';

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        // Handle registration logic here
        try {
            setLoading(true);
            // Validate the form data
            if (!name || !email || !password) {
              // Display a validation error message
              console.error("Name, email, or password is missing");
              showToast("warn", "Please fill in all fields.");
              setLoading(false);
              return;
            }
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register`, {
              name,
              email,
              password,
            });
            if (response.status === 200) {
              // Registration successful, redirect to the login page
              showToast("ok", "Registration successful.");
              setTimeout(() => {
                navigate("/login");
              }, 3000);
            } 
        } catch (error) {
            console.error("Error during registration:", error.message);
            showToast("err", "An error occurred during registration.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-1/3 shadow-md rounded p-8 mb-4">
                <div>
                    <h2 className="text-3xl font-bold mb-8">Register</h2>
                </div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}>
                    <div className="mb-4">
                        <div className="label">
                            <span className="label-text">Full Name</span>
                        </div>
                        <input 
                            type="text"
                            id='name'
                            name='name'
                            required
                            onChange={(e) => setName(e.target.value)}
                            value={name} 
                            placeholder="Enter your full name" 
                            className="input input-bordered w-full max-w-xs" 
                        />
                    </div>
                    <div className="mb-4">
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
                    <div className="mb-4">
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
                    <div className="flex items-center justify-center mt-8">
                        <button
                            className="btn btn-primary"
                            type="submit"
                        >
                        {loading ? (
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
                <p className='flex justify-center items-center mt-8'>
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
