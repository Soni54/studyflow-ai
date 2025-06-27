// frontend/src/services/courseService.js
/*import axios from 'axios';
import authService from './authService';
// Setup base API instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Auto-attach token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

// --- Course APIs ---
const createCourse = async (courseData) => {
    const res = await api.post('/courses', courseData);
    return res.data;
};

const getAllCourses = async () => {
    const res = await api.get('/courses');
    return res.data;
};

const getCourseById = async (id) => {
    const res = await api.get(`/courses/${id}`);
    return res.data;
};

const updateCourse = async (id, courseData) => {
    const res = await api.put(`/courses/${id}`, courseData);
    return res.data;
};

const deleteCourse = async (id) => {
    const res = await api.delete(`/courses/${id}`);
    return res.data;
};

// --- Lecture APIs ---
const addLecture = async (lectureData) => {
    const res = await api.post('/lectures', lectureData);
    return res.data;
};

const updateLecture = async (id, lectureData) => {
    const res = await api.put(`/lectures/${id}`, lectureData);
    return res.data;
};

const deleteLecture = async (id) => {
    const res = await api.delete(`/lectures/${id}`);
    return res.data;
};

// --- Quiz APIs ---
const addQuiz = async (quizData) => {
    const res = await api.post('/quizzes', quizData);
    return res.data;
};

const updateQuiz = async (id, quizData) => {
    const res = await api.put(`/quizzes/${id}`, quizData);
    return res.data;
};

const deleteQuiz = async (id) => {
    const res = await api.delete(`/quizzes/${id}`);
    return res.data;
};

// --- Enrollment APIs ---
const enrollCourse = async (courseId) => {
    const res = await api.post(`/enrollments/enroll/${courseId}`);
    return res.data;
};

const unenrollCourse = async (courseId) => {
    const res = await api.post(`/enrollments/unenroll/${courseId}`);
    return res.data;
};

const getMyEnrolledCourses = async () => {
    const res = await api.get('/enrollments/my-courses');
    return res.data;
};

// --- Recommendation APIs ---
const getRecommendedCourses = async () => {
    const res = await api.get('/recommendations/courses');
    return res.data;
};

// Export all methods
const courseService = {
    // Course
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,

    // Lecture
    addLecture,
    updateLecture,
    deleteLecture,

    // Quiz
    addQuiz,
    updateQuiz,
    deleteQuiz,

    // Enrollment
    enrollCourse,
    unenrollCourse,
    getMyEnrolledCourses,

    // Recommendations
    getRecommendedCourses
};

export default courseService;*/

// frontend/src/services/courseService.js
import axios from 'axios';
// authService is already imported

const API_URL = '/api/courses';
const LECTURE_API_URL = '/api/lectures';
const QUIZ_API_URL = '/api/quizzes';
const ENROLLMENT_API_URL = '/api/enrollments'; // NEW
const RECOMMENDATION_API_URL = '/api/recommendations'; // NEW

// Helper to get auth header
const authHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { 'x-auth-token': token };
    } else {
        return {};
    }
};

// --- Course APIs (existing) ---
const createCourse = async (courseData) => {
    const res = await axios.post(API_URL, courseData, { headers: authHeader() });
    return res.data;
};

const getAllCourses = async () => {
    const res = await axios.get(API_URL, { headers: authHeader() });
    return res.data;
};

const getCourseById = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`, { headers: authHeader() });
    return res.data;
};

const updateCourse = async (id, courseData) => {
    const res = await axios.put(`${API_URL}/${id}`, courseData, { headers: authHeader() });
    return res.data;
};

const deleteCourse = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
    return res.data;
};

// --- Lecture APIs ---
const addLecture = async (lectureData) => {
    const res = await axios.post(LECTURE_API_URL, lectureData, { headers: authHeader() });
    return res.data;
};

const deleteLecture = async (id) => {
    const res = await axios.delete(`${LECTURE_API_URL}/${id}`, { headers: authHeader() });
    return res.data;
};

const updateLecture = async (id, lectureData) => {
    const res = await axios.put(`${LECTURE_API_URL}/${id}`, lectureData, { headers: authHeader() });
    return res.data;
};

const getLectureById = async (id) => {
    const res = await axios.get(`${LECTURE_API_URL}/${id}`, { headers: authHeader() });
    return res.data;
};


// --- Quiz APIs ---
const addQuiz = async (quizData) => {
    const res = await axios.post(QUIZ_API_URL, quizData, { headers: authHeader() });
    return res.data;
};

const deleteQuiz = async (id) => {
    const res = await axios.delete(`${QUIZ_API_URL}/${id}`, { headers: authHeader() });
    return res.data;
};

const updateQuiz = async (id, quizData) => {
    const res = await axios.put(`${QUIZ_API_URL}/${id}`, quizData, { headers: authHeader() });
    return res.data;
};

// --- NEW ENROLLMENT APIs ---
const enrollCourse = async (courseId) => {
    try {
        const response = await axios.post(`${ENROLLMENT_API_URL}/enroll/${courseId}`, {}, { headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error.response.data.msg || 'Failed to enroll in course';
    }
};

const unenrollCourse = async (courseId) => {
    try {
        const response = await axios.post(`${ENROLLMENT_API_URL}/unenroll/${courseId}`, {}, { headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error.response.data.msg || 'Failed to unenroll from course';
    }
};

const getMyEnrolledCourses = async () => {
    try {
        const response = await axios.get(`${ENROLLMENT_API_URL}/my-courses`, { headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error.response.data.msg || 'Failed to fetch enrolled courses';
    }
};

// --- NEW RECOMMENDATION API ---
const getRecommendedCourses = async () => {
    try {
        const response = await axios.get(`${RECOMMENDATION_API_URL}/courses`, { headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error.response.data.msg || 'Failed to fetch recommendations';
    }
};


const courseService = {
    // ... existing exports
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    addLecture,
    deleteLecture,
    updateLecture,
    getLectureById,
    addQuiz,
    deleteQuiz,
    updateQuiz,
    // NEW exports
    enrollCourse,
    unenrollCourse,
    getMyEnrolledCourses,
    getRecommendedCourses
};

export default courseService;
