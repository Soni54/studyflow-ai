import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom';
import InstructorHome from './components/InstructorHome';
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import CourseForm from './components/CourseForm'; // New
import CourseList from './components/CourseList'; // New
import CourseDetails from './components/CourseDetails'; // New
import LectureViewer from './components/LectureViewer';
import RecommendedCourses from "./components/RecommendedCourse";
import MyCourses from "./components/MyCourses";
import AIChatbot from "./components/AIChatbot";
import Notepad from './components/Notepad';
import QuizTaker from "./components/QuizTaker";

import authService from "./services/authService";



import './index.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isLoggedIn());
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const navigate = useNavigate(); // Hook must be inside Router context

  console.log("isLoggedIn:", isLoggedIn); // true?
console.log("userRole:", userRole); 

  useEffect(() => {
    const checkAuthStatus = async () => {
      const loggedIn = authService.isLoggedIn();
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        try {
          const user = await authService.getCurrentUser();
          setUserRole(user?.role || localStorage.getItem('role'));
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          authService.logout();
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };
    checkAuthStatus();

    // Listen for storage changes (e.g., token removal)
    window.addEventListener('storage', checkAuthStatus);
    return () => {
        window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    localStorage.removeItem('role');

    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/login'); // Redirect to login page
  };

  return (
    
     <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 animate-gradient-x bg-[length:200%_200%] px-4 sm:px-6 lg:px-8 overflow-x-hidden">

      <nav className="bg-gray-800 p-4 rounded-lg shadow-md mb-8">
        <ul className="flex items-center space-x-6 text-white" >
          <li>
            <Link to="/" className="hover:text-blue-400 transition-colors duration-200">Home</Link>
          </li>
          <li>
            <Link to="/courses" className="hover:text-blue-400 transition-colors duration-200">Browse All Courses</Link> {/* Link to view all courses */}
          </li>
          {userRole === 'instructor' && (
            <li>
              <Link to="/create-course" className="hover:text-blue-400 transition-colors duration-200">Create Course</Link> {/* Instructor only */}
            </li>
          )}
           {userRole === 'student' && ( 
            <>  
            <li>
              <Link to="/my-courses" className="hover:text-blue-400 transition-colors duration-200">My Courses</Link>
            </li>
             <li>
                <Link to="/ai-chatbot" className="hover:text-blue-400 transition-colors duration-200">AI Chatbot</Link> {/* NEW NAVIGATION LINK */}
              </li>
              <li>
      <Link to="/notepad" className="hover:text-blue-400 transition-colors duration-200">Make Notes</Link>
    </li>
              </>
          )}
          <div className="flex-grow"></div>
          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/register" className="hover:text-blue-400 transition-colors duration-200">Register</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition-colors duration-200">Login</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/profile" className="hover:text-blue-400 transition-colors duration-200">Profile</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200">Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>

      <hr className="my-8 border-gray-300"/>

      <Routes>
        <Route 
        path="/"
         element={
              <div className="relative overflow-hidden min-h-[80vh]">
      {/* 🔵 Floating Bubbles Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute bg-pink-400 rounded-full opacity-30 w-72 h-72 top-[-50px] left-[-50px] animate-ping-slow"></div>
        <div className="absolute bg-purple-400 rounded-full opacity-20 w-96 h-96 bottom-[-80px] right-[-80px] animate-ping-slower"></div>
        <div className="absolute bg-yellow-300 rounded-full opacity-10 w-48 h-48 top-[30%] left-[40%] animate-bounce-slow"></div>
      </div>

      {/* 💡 Foreground Main Content */}
      <div className="relative z-10 bg-white bg-opacity-90 p-10 rounded-xl shadow-2xl max-w-5xl mx-auto mt-12">
        <h2 className="text-4xl font-extrabold text-center text-indigo-700 mb-4 animate-fade-in-up">
          🎓 Welcome to StudyFlow-AI 🚀!
        </h2>

        {!isLoggedIn && (
          <p className="text-gray-700 text-center text-lg">
            Start learning smarter. Register or login to begin your journey.
          </p>
        )}

        {isLoggedIn && userRole === 'student' && (
          <>
            <p className="text-center text-gray-700 mt-4 mb-6 text-xl">
              Learn faster, stay organized, and master concepts with our smart AI tools.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
              <Link
                to="/my-courses"
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-6 px-4 rounded-lg shadow-md hover:scale-105 transition"
              >
                📚 My Courses
                <p className="text-sm mt-2">Explore your enrolled courses</p>
              </Link>

              <Link
                to="/ai-chatbot"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-6 px-4 rounded-lg shadow-md hover:scale-105 transition"
              >
                🤖 AI Chatbot
                <p className="text-sm mt-2">Ask doubts & get answers instantly</p>
              </Link>

              <Link
                to="/notepad"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold py-6 px-4 rounded-lg shadow-md hover:scale-105 transition"
              >
                📝 Notepad
                <p className="text-sm mt-2">Write and organize your notes</p>
              </Link>
            </div>

            <div className="mt-10">
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-4">
                🌟 Recommended Courses
              </h3>
              <RecommendedCourses />
            </div>
          </>
        )}
         {isLoggedIn && userRole === 'instructor' && (
          <p className="text-center text-gray-600 mt-6">
            Welcome, instructor! Manage your existing courses or{' '}
            <Link to="/create-course" className="text-blue-600 underline hover:text-blue-800">
              create a new one
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  }
/>
             
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        


        {/* Course Routes */}
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/create-course" element={<CourseForm />} /> {/* For creating new course */}
        <Route path="/courses/:id/edit" element={<CourseForm />} /> {/* For editing existing course */}

        {/* Lecture & Quiz Viewers (simple placeholders) */}
        <Route path="/lectures/:id" element={<LectureViewer />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/ai-chatbot" element={<AIChatbot />} />
        <Route path="/notepad" element={<Notepad />} />
        <Route path="/quizzes/:id" element={<QuizTaker />} />

        {/* You'd add a /quizzes/:id route and a QuizTaker component here later */}
      </Routes>
    </div>
  );
}


const AppWrapper = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper; 