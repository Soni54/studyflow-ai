import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import courseService from "../services/courseService";
import authService from "../services/authService";

const RecommendedCourses = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isStudent, setIsStudent] = useState(false);

    useEffect(() => {

        const fetchRecommendations = async () => {
            const user = await authService.getCurrentUser();
            if (user && user.role === 'student') {
                setIsStudent(true);
                try {
                    const data = await courseService.getRecommendedCourses();
                    setRecommendations(data);
                } catch (err) {
                    setError(err.msg || 'Failed to load recommendations');
                }
            } else {
                setError('Login as a student to see recommendations.');
            }
            setLoading(false);
        };
        fetchRecommendations();
    }, []);

    if (loading) {
        return <div>Loading recommendations...</div>;
    }

    if (error) {
        return <div style={{ color: 'gray', fontStyle: 'italic' }}>{error}</div>;
    }

    if (!isStudent) {
        return <div style={{ color: 'gray', fontStyle: 'italic' }}>Login as a student to see personalized recommendations.</div>;
    }

    if (recommendations.length === 0) {
        return <div style={{ color: 'gray', fontStyle: 'italic' }}>No new recommendations at the moment. Explore more courses!</div>;
    }
    return (
        <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <h3>✨ Recommended For You ✨</h3>
            <ul>
                {recommendations.map((course) => (
                    <li key={course._id} style={{ border: '1px solid #eee', padding: '8px', margin: '8px 0', borderRadius: '5px' }}>
                        <h4><Link to={`/courses/${course._id}`}>{course.title}</Link></h4>
                        <p style={{ fontSize: '0.9em', color: '#555' }}>{course.description.substring(0, 100)}...</p>
                        <p style={{ fontSize: '0.8em', color: '#777' }}>Instructor: {course.instructor ? course.instructor.username : 'N/A'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecommendedCourses;