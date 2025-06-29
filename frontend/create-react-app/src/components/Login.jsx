import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const Login = () => {
   
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      setMessage('');
      try{
       await authService.login(email, password);
const user = await authService.getCurrentUser(); // Get logged-in user's role

setMessage(`Login successful! Redirecting...`);

window.dispatchEvent(new Event("storage"));

if (user.role === 'instructor') {
  navigate('/create-course');
} else {
  navigate('/courses'); // or '/profile' or wherever you want
}

      } catch(error) {
       
  setMessage(error);
      }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Login</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
               
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" >Login</button>
            </form>
     {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}


        </div>
    );

};
export default Login;