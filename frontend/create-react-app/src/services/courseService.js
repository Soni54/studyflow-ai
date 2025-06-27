
/*import axios from 'axios';
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

export default courseService;*/

// frontend/create-react-app/src/services/courseService.js
import api from './api';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'x-auth-token': token } : {};
};

// Courses
const createCourse = (courseData) => api.post('/courses', courseData, { headers: authHeader() });
const getAllCourses = () => api.get('/courses', { headers: authHeader() });
const getCourseById = (id) => api.get(`/courses/${id}`, { headers: authHeader() });
const updateCourse = (id, data) => api.put(`/courses/${id}`, data, { headers: authHeader() });
const deleteCourse = (id) => api.delete(`/courses/${id}`, { headers: authHeader() });

// Lectures
const addLecture = (data) => api.post('/lectures', data, { headers: authHeader() });
const deleteLecture = (id) => api.delete(`/lectures/${id}`, { headers: authHeader() });
const updateLecture = (id, data) => api.put(`/lectures/${id}`, data, { headers: authHeader() });
const getLectureById = (id) => api.get(`/lectures/${id}`, { headers: authHeader() });

// Quizzes
const addQuiz = (data) => api.post('/quizzes', data, { headers: authHeader() });
const deleteQuiz = (id) => api.delete(`/quizzes/${id}`, { headers: authHeader() });
const updateQuiz = (id, data) => api.put(`/quizzes/${id}`, data, { headers: authHeader() });

// Enrollments
const enrollCourse = (id) => api.post(`/enrollments/enroll/${id}`, {}, { headers: authHeader() });
const unenrollCourse = (id) => api.post(`/enrollments/unenroll/${id}`, {}, { headers: authHeader() });
const getMyEnrolledCourses = () => api.get('/enrollments/my-courses', { headers: authHeader() });

// Recommendations
const getRecommendedCourses = () => api.get('/recommendations/courses', { headers: authHeader() });

export default {
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
  enrollCourse,
  unenrollCourse,
  getMyEnrolledCourses,
  getRecommendedCourses,
};

