

// frontend/create-react-app/src/services/courseService.js
import api from './api';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'x-auth-token': token } : {};
};

// Courses
const createCourse = async (courseData) => {
  const res = await api.post('/courses', courseData, { headers: authHeader() });
  return res.data; 
};

const getAllCourses = () => api.get('/courses', { headers: authHeader() });
const getCourseById = async (id) => {
  const res = await api.get(`/courses/${id}`, { headers: authHeader() });
  return res.data;
};

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
const getRecommendedCourses = async () => {
  const res = await api.get('/recommendations/courses', { headers: authHeader() });
  return res.data; // ✅ Now it's already an array
};

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

