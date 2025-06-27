// frontend/src/components/CourseList.js
/*import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import courseService from '../services/courseService';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await courseService.getAllCourses();
                console.log("Courses from API:", data, Array.isArray(data));

                setCourses(data);
            } catch (err) {
                setError(err.msg || 'Failed to load courses');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div>
       <p >Loading courses...</p>
        </div>
        );
    }

    if (error) {
        return (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-100 text-red-700 rounded-md shadow-sm">Error: {error}</div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto my-8 p-6 bg-white rounded-lg shadow-xl" >
            <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Available Courses</h2>
            {courses.length === 0 ? (
                <p className="text-gray-600 text-lg text-center mt-10">No courses available yet. Check back later!</p>
            ) : (
                <ul>
                
                    {courses.map((course) => (
                        <li key={course._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                            <h3><Link to={`/courses/${course._id}`}>{course.title} </Link></h3>
                            <p>{course.description}</p>
                            <p>Instructor: {course.instructor ? course.instructor.username : 'N/A'}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CourseList; */

// frontend/src/components/CourseList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import courseService from '../services/courseService';
import authService from '../services/authService'; // ✅ Import auth service

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null); // ✅ Track current user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCoursesAndUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser(); // ✅ Get current user
        setUser(currentUser);

        const data = await courseService.getAllCourses();
        setCourses(data);
      } catch (err) {
        setError(err.msg || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-lg">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-100 text-red-700 rounded-md shadow-sm">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-8 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Available Courses</h2>

      {courses.length === 0 ? (
        <p className="text-gray-600 text-lg text-center mt-10">No courses available yet. Check back later!</p>
      ) : (
        <ul className="space-y-4">
          {courses.map((course) => (
            <li
              key={course._id}
              className="border border-gray-300 p-4 rounded-md shadow-sm bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-purple-700">
                  <Link to={`/courses/${course._id}`} className="hover:underline">
                    {course.title}
                  </Link>
                </h3>

                {/* ✅ Show edit button if current user is instructor of the course */}
                {user?.role === 'instructor' && course?.instructor?._id === user._id && (
                  <Link to={`/courses/${course._id}/edit`}>
                    <button className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                      ✏️ Edit
                    </button>
                  </Link>
                )}
              </div>

              <p className="text-gray-600 mt-2">{course.description}</p>
              <p className="text-gray-500 text-sm mt-1">
                Instructor: {course.instructor?.username || 'N/A'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CourseList;




