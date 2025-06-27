// InstructorHome.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const InstructorHome = () => {
  return (
    <div className="relative min-h-[70vh] bg-cover bg-center rounded-lg shadow-xl overflow-hidden"
         style={{ backgroundImage: `url('https://images.unsplash.com/photo-1532619187608-e5375cab36dc?auto=format&fit=crop&w=1600&q=80')` }}>
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative z-10 text-white p-10">
        <h1 className="text-4xl font-bold mb-4 text-center drop-shadow">Welcome to StudyFlow-AI!</h1>
        <p className="text-xl text-center mb-6">Manage your courses or create a new one.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Link to="/courses" className="bg-white text-gray-800 hover:bg-gray-100 px-6 py-4 rounded-lg text-center font-semibold shadow">
            📚 Browse All Courses
          </Link>
          <Link to="/create-course" className="bg-white text-gray-800 hover:bg-gray-100 px-6 py-4 rounded-lg text-center font-semibold shadow">
            ➕ Create Course
          </Link>
          <Link to="/profile" className="bg-white text-gray-800 hover:bg-gray-100 px-6 py-4 rounded-lg text-center font-semibold shadow">
            🙍‍♂️ Profile
          </Link>
          <Link to="/logout" className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg text-center font-semibold shadow">
            🚪 Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstructorHome;
