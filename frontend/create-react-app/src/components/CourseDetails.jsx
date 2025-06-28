// frontend/src/components/CourseDetails.js
/*import React, { useEffect, useState } from 'react';
import { useParams, Link , useNavigate} from 'react-router-dom';
import courseService from '../services/courseService';
import authService from '../services/authService';

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false); // NEW state for enrollment status
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseAndStatus = async () => {
            try {
                const userData = await authService.getCurrentUser();
                const currentRole = userData ? userData.role : null;
                setUserRole(currentRole);

                const data = await courseService.getCourseById(id);
                setCourse(data);
                     
                 if (currentRole === 'student' && authService.isLoggedIn()) {
                    const enrolledCourses = await courseService.getMyEnrolledCourses();
                    setIsEnrolled(enrolledCourses.some(c => c._id === id));
                }

            } catch (err) {
                setError(err?.response?.data?.msg || 'Failed to load course details');
            } finally {
                setLoading(false);
            }
        };
        fetchCourseAndStatus();
    }, [id]);

      const handleEnroll = async () => {
        if (!authService.isLoggedIn()) {
            navigate('/login'); // Redirect to login if not logged in
            return;
        }
        try {
            await courseService.enrollCourse(id);
            setIsEnrolled(true);
            alert('Successfully enrolled!');
        } catch (err) {
            alert(err);
        }
    };

    const handleUnenroll = async () => {
        if (!authService.isLoggedIn()) {
            navigate('/login');
            return;
        }
        try {
            await courseService.unenrollCourse(id);
            setIsEnrolled(false);
            alert('Successfully unenrolled!');
        } catch (err) {
            alert(err);
        }
    };

    if (loading) {
        return (
           <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-lg">Loading course details...</p>
      </div> 
        );//<div>Loading course details...</div>;
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-100 text-red-700 rounded-md shadow-sm">
        <p>{error}</p>
      </div>
        );//<div style={{ color: 'red' }}>Error: {error}</div>;
    }

    if (!course) {
        return(
         <div className="max-w-4xl mx-auto mt-8 p-4 bg-yellow-100 text-yellow-700 rounded-md shadow-sm">
        <p>Course not found.</p>
      </div>   
        );// <div>Course not found.</div>;
    }

    return (
        <div>
            <h2>{course.title}</h2>
            <p><strong>Description:</strong> {course.description}</p>
            <p><strong>Instructor:</strong> {course.instructor ? course.instructor.username : 'N/A'}</p>

            {userRole === 'instructor' && course.instructor._id === (authService.getCurrentUser() && authService.getCurrentUser()._id) && (
                <Link to={`/courses/${course._id}/edit`}>
                    <button>Edit Course</button>
                </Link>
            )}
              {userRole === 'student' && (
                isEnrolled ? (
                    <button onClick={handleUnenroll} style={{ backgroundColor: 'orange', color: 'white' }}>Unenroll</button>
                ) : (
                    <button onClick={handleEnroll} style={{ backgroundColor: 'green', color: 'white' }}>Enroll</button>
                )
              )}

            <hr />

            <h3>Lectures ({course.lectures.length})</h3>
            {course.lectures.length === 0 ? (
                <p className="text-gray-600 text-lg text-center">No lectures available yet.</p>
            ) : (
                <ul>
                    {course.lectures.map((lecture) => (
                        <li key={lecture._id}>
                            <Link to={`/lectures/${lecture._id}`}>{lecture.title}</Link> (Order: {lecture.order})
                            // In a real app, link to a LectureViewer component 
                        </li>
                    ))}
                </ul>
            )}

            <h3>Quizzes ({course.quizzes.length})</h3>
            {course.quizzes.length === 0 ? (
                <p className="text-gray-600 text-lg text-center">No quizzes available yet.</p>
            ) : (
                <ul>
                    {course.quizzes.map((quiz) => (
                        <li key={quiz._id}>
                            <Link to={`/quizzes/${quiz._id}`}>{quiz.title}</Link>
                            // In a real app, link to a QuizTaker component 
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CourseDetails;*/

import React, { useEffect, useState } from 'react';
import { useParams, Link , useNavigate} from 'react-router-dom';
import courseService from '../services/courseService';
import authService from '../services/authService';

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false); // NEW state for enrollment status
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseAndStatus = async () => {
            try {
                const userData = await authService.getCurrentUser();
                const currentRole = userData ? userData.role : null;
                setUserRole(currentRole);

                const response = await courseService.getCourseById(id);
                console.log("Course details response:", response);
                setCourse(response.data);
                     
                 if (currentRole === 'student' && authService.isLoggedIn()) {
                    const enrolledRes = await courseService.getMyEnrolledCourses();
                    console.log("Enrolled courses response:", enrolledRes); // debug

                    const enrolledCourses = enrolledRes.data; // ✅ extract .data array
                    setIsEnrolled(enrolledCourses.some(c => c._id === id));
                }

            } catch (err) {
                setError(err?.response?.data?.msg || 'Failed to load course details');
            } finally {
                setLoading(false);
            }
        };
        fetchCourseAndStatus();
    }, [id]);

      const handleEnroll = async () => {
        if (!authService.isLoggedIn()) {
            navigate('/login'); // Redirect to login if not logged in
            return;
        }
        try {
            await courseService.enrollCourse(id);
            setIsEnrolled(true);
            alert('Successfully enrolled!');
        } catch (err) {
            alert(err);
        }
    };

    const handleUnenroll = async () => {
        if (!authService.isLoggedIn()) {
            navigate('/login');
            return;
        }
        try {
            await courseService.unenrollCourse(id);
            setIsEnrolled(false);
            alert('Successfully unenrolled!');
        } catch (err) {
            alert(err);
        }
    };

    if (loading) {
        return (
           <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-lg">Loading course details...</p>
      </div> 
        );//<div>Loading course details...</div>;
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-100 text-red-700 rounded-md shadow-sm">
        <p>{error}</p>
      </div>
        );//<div style={{ color: 'red' }}>Error: {error}</div>;
    }

    if (!course) {
        return(
         <div className="max-w-4xl mx-auto mt-8 p-4 bg-yellow-100 text-yellow-700 rounded-md shadow-sm">
        <p>Course not found.</p>
      </div>   
        );// <div>Course not found.</div>;
    }
    return (
  <div className="max-w-4xl mx-auto mt-10 px-6 py-8 bg-white rounded-xl shadow-lg">
    <h2 className="text-3xl font-bold text-purple-700 mb-4">{course.title}</h2>
    <p className="text-gray-700 mb-2">
      <span className="font-semibold">Description:</span> {course.description}
    </p>
    <p className="text-gray-700 mb-4">
      <span className="font-semibold">Instructor:</span>{" "}
      {course.instructor ? course.instructor.username : "N/A"}
    </p>

    {/* Edit button for instructor */}
    {userRole === "instructor" &&
      course.instructor._id ===
        (authService.getCurrentUser() &&
          authService.getCurrentUser()._id) && (
        <Link to={`/courses/${course._id}/edit`}>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full mb-4 transition">
            ✏️ Edit Course
          </button>
        </Link>
      )}

    {/* Enroll/Unenroll buttons for students */}
    {userRole === "student" && (
      isEnrolled ? (
        <button
          onClick={handleUnenroll}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full mb-4 transition"
        >
          🔓 Unenroll
        </button>
      ) : (
        <button
          onClick={handleEnroll}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full mb-4 transition"
        >
          🔐 Enroll
        </button>
      )
    )}

    <hr className="my-6 border-gray-300" />

    {/* Lectures */}
    <h3 className="text-2xl font-semibold text-blue-600 mb-2">
      📚 Lectures ({course.lectures.length})
    </h3>
    {course.lectures.length === 0 ? (
      <p className="text-gray-500 text-center mb-4">
        No lectures available yet.
      </p>
    ) : (
      <ul className="list-disc list-inside space-y-2 mb-6">
        {course.lectures.map((lecture) => (
          <li key={lecture._id}>
            <Link
              to={`/lectures/${lecture._id}`}
              className="text-blue-500 hover:underline"
            >
              {lecture.title}
            </Link>{" "}
            <span className="text-sm text-gray-500">(Order: {lecture.order})</span>
          </li>
        ))}
      </ul>
    )}

    {/* Quizzes */}
    <h3 className="text-2xl font-semibold text-pink-600 mb-2">
      📝 Quizzes ({course.quizzes.length})
    </h3>
    {course.quizzes.length === 0 ? (
      <p className="text-gray-500 text-center">No quizzes available yet.</p>
    ) : (
      <ul className="list-disc list-inside space-y-2">
        {course.quizzes.map((quiz) => (
          <li key={quiz._id}>
            <Link
              to={`/quizzes/${quiz._id}`}
              className="text-pink-500 hover:underline"
            >
              {quiz.title}
            </Link>
          </li>
        ))}
      </ul>
    )}
  </div>
);
};
export default CourseDetails;
