import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
    const [username, setUsername] =useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        console.log("Submitting:", { username, email, password, role });

        try {
            await authService.register(username, email, password, role);
            setMessage('Registration Successful! Redirecting to profile..');
            navigate('/profile');
        } catch (err) {
          console.log(
      'Register error (frontend):',
      err.response?.data?.msg || err.message
    );
    console.log("Full error:", err);
    setMessage(err.response?.data?.msg || 'Registration failed.');
        }
    };
    
   return (
     <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl">
        <h2 className='text-3xl font-extrabold text-gray-900 mb-6 text-center'>Register</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
                <input 
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                />

            </div>

            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                    />
                </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role:</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black">

                    <option value="student">student</option>
                    <option value="instructor">Instructor</option>
                </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Register</button>
        </form>
        {message && <p>{message}</p>}
    </div>
   );
};

export default Register;