

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import authService from '../services/authService';

const MyCourses = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyCourses = async () => {
            const user = await authService.getCurrentUser();
            if (!user || user.role !== 'student') {
                navigate('/login'); // Redirect if not logged in as student
                return;
            }

            try {
                const response = await courseService.getMyEnrolledCourses();
                  console.log("⚠️ Full response from /enrollments/my-courses:", response);
                console.log("Fetched enrolled courses:", response); // ✅ Debug log
             if (Array.isArray(response.data)) {
                setEnrolledCourses(response.data);
            } else{
               console.error("Expected array but got:", response.data);
              setEnrolledCourses([]);
            }
          }
              catch (err) {
                console.error("Error fetching enrolled courses:", err);
                setError(err?.response?.data?.msg || 'Failed to load your enrolled courses');
            } finally {
                setLoading(false);
            }
        };
        fetchMyCourses();
    }, [navigate]);

    if (loading) {
       // return <div>Loading your courses...</div>;
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-white text-lg font-semibold drop-shadow-md animate-pulse">Loading your courses...</p>
            </div>
        );
    }

    if (error) {
        return <div style={{ color: 'red' }}>Error: {error}</div>;
    }
    return (
  <div className="max-w-6xl mx-auto my-8 p-6 bg-white rounded-lg shadow-xl">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      My Enrolled Courses
    </h2>

    {enrolledCourses.length === 0 ? (
      <p className="text-gray-600 text-lg text-center mt-10">
        You haven't enrolled in any courses yet.{" "}
        <Link to="/courses" className="text-blue-600 hover:underline">
          Browse available courses
        </Link>
        !
      </p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course) => (
          <div
            key={course._id}
            className="border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition bg-gray-50"
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              {course.title}
            </h3>
            <p className="text-gray-700 text-sm mb-4 line-clamp-3">
              {course.description}
            </p>
            <p className="text-gray-500 text-sm mb-4">
              <span className="font-semibold">Instructor:</span>{" "}
              {course.instructor?.username || "N/A"}
            </p>
            <Link
              to={`/courses/${course._id}`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full text-sm transition"
            >
              View Course
            </Link>
          </div>
        ))}
      </div>
    )}
  </div>
);
};
export default MyCourses;




