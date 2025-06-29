
// frontend/src/components/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState(''); // Used for error messages
    const [loading, setLoading] = useState(true); // Added loading state for better UX
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true); // Set loading true at the start
            setMessage(''); // Clear any previous messages
            if (!authService.isLoggedIn()) {
                navigate('/login');
                return;
            }

            try {
                const fullProfile = await authService.fetchUserProfile();
                console.log('Full Profile:', fullProfile);
                setUser(fullProfile);
            } catch (error) {
                // Assuming error.response.data.message or error.message provides details
                setMessage(error?.response?.data?.message || error.message || 'Failed to load profile.');
                authService.logout(); // Logout on profile fetch failure (e.g., token expired)
                navigate('/login');
            } finally {
                setLoading(false); // Set loading false after fetch
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
        window.location.reload(); // Often helpful to force a re-render of App.js nav state
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-white text-lg font-semibold drop-shadow-md animate-pulse">Loading profile...</p>
            </div>
        );
    }

    if (message) { // Display error messages with specific styling
        return (
            <div className="max-w-xl mx-auto mt-8 p-4 bg-red-100 text-red-700 rounded-md shadow-sm">
                <p>Error: {message}</p>
            </div>
        );
    }

    // If not loading and no message, user should be available
    if (!user) {
        // This case should theoretically be caught by 'loading' or 'message' checks
        // But as a fallback, display a generic message if user is null after loading
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-600 text-lg">Profile data not available.</p>
            </div>
        );
    }

    return (
        // Main container for the profile: centered, padded, rounded, shadowed
        <div className="min-h-screen w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 animate-gradient-x bg-[length:200%_200%] overflow-x-hidden px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto my-8 p-8 bg-white rounded-lg shadow-xl">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">User Profile</h2>

            <div className="space-y-4 text-gray-700 text-lg">
                <p>
                    <span className="font-semibold text-gray-800">Username:</span> {user.username}
                </p>
                <p>
                    <span className="font-semibold text-gray-800">Email:</span> {user.email}
                </p>
                <p>
                    <span className="font-semibold text-gray-800">Role:</span>{' '}
                    <span className="capitalize">{user.role}</span> {/* Capitalize role for better display */}
                </p>
                {/* You can add more profile details here if your user model has them */}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end"> {/* Added flex for button alignment */}
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Logout
                </button>
            </div>
        </div>
        </div>
    );
};

export default Profile;