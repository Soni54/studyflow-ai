// frontend/src/components/CourseForm.js
/*import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import courseService from '../services/courseService';
import authService from '../services/authService';

const CourseForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [lectures, setLectures] = useState([]); // For managing lectures
    const [quizzes, setQuizzes] = useState([]); // For managing quizzes
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { id } = useParams(); // For editing existing course

    useEffect(() => {
        
        const checkRoleAndLoadCourse = async () => {
            try{
            const user = await authService.getCurrentUser();
            console.log("Logged in user:", user);

            if (!user || user.role !== 'instructor') {
                navigate('/login'); // Redirect if not instructor
                return;
            }

            if (id) { // If editing an existing course
                
                    const courseData = await courseService.getCourseById(id);
                    if (courseData.instructor._id !== user._id) { // Check if current user is the instructor of this course
                        setMessage('You are not authorized to edit this course.');
                        setTimeout(() => navigate('/courses'), 2000);
                        return;
                    }
                    setTitle(courseData.title);
                    setDescription(courseData.description);
                    setLectures(courseData.lectures || []);
                    setQuizzes(courseData.quizzes || []);
                }
             } catch (error) {
                    setMessage(error);
                } finally {
                    setLoading(false);
            }
        };
        checkRoleAndLoadCourse();
    }, [id, navigate]);

    const handleSubmitCourse = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const courseData = { title, description };
            if (id) {
                await courseService.updateCourse(id, courseData);
                setMessage('Course updated successfully!');
            } else {
                const newCourse = await courseService.createCourse(courseData);
                setMessage('Course created successfully!');
                navigate(`/courses/${newCourse._id}/edit`); // Go to edit page of new course to add content
            }
        } catch (error) {
            setMessage(error);
        }
    };

    // --- Lecture Management ---
    /*const handleAddLecture = async () => {
        if (!id) {
            setMessage("Please create the course first before adding lectures.");
            return;
        }
        const newLectureTitle = prompt("Enter new lecture title:");
        if (newLectureTitle) {
            const newLectureDescription = prompt("Enter lecture description (optional):");
            const newLectureVideoUrl = prompt("Enter video URL (optional):");
            const newLectureContent = prompt("Enter text content (optional):");

            try {
                const addedLecture = await courseService.addLecture({
                    courseId: id,
                    title: newLectureTitle,
                    description: newLectureDescription,
                    videoUrl: newLectureVideoUrl,
                    content: newLectureContent,
                    order: lectures.length + 1 // Simple ordering
                });
                //setLectures([...lectures, addedLecture]);
                const updatedCourse = await courseService.getCourseById(id);
            setLectures(updatedCourse.lectures || []);
                setMessage('Lecture added successfully!');
            } catch (error) {
                setMessage(error);
            }
        }
    };

    const handleSubmitNewLecture = async (e) => {
        e.preventDefault();
        if (!id) {
            setMessage("Please create the course first before adding lectures.");
            return;
        }
        try {
            const addedLecture = await courseService.addLecture({
                courseId: id,
                ...newLecture,
                order: lectures.length + 1
            });
            setLectures([...lectures, addedLecture]);
            setMessage('Lecture added successfully!');
            setShowLectureForm(false);
            setNewLecture({ title: '', description: '', videoUrl: '', content: '' });
        } catch (error) {
            setMessage(error?.response?.data?.msg || 'Failed to add lecture');
        }
    };


    const handleDeleteLecture = async (lectureId) => {
        if (window.confirm("Are you sure you want to delete this lecture?")) {
            try {
                await courseService.deleteLecture(lectureId);
                setLectures(lectures.filter(lec => lec._id !== lectureId));
                setMessage('Lecture deleted successfully!');
            } catch (error) {
                setMessage(error);
            }
        }
    };

    // --- Quiz Management ---
    const handleAddQuiz = async () => {
        if (!id) {
            setMessage("Please create the course first before adding quizzes.");
            return;
        }
        const newQuizTitle = prompt("Enter new quiz title:");
        if (newQuizTitle) {
            // For simplicity, let's add one sample question immediately
            const questions = [{
                questionText: "Sample Question?",
                options: ["Option A", "Option B"],
                correctAnswer: "Option A"
            }];
            try {
                const addedQuiz = await courseService.addQuiz({
                    courseId: id,
                    title: newQuizTitle,
                    questions: questions
                });
                setQuizzes([...quizzes, addedQuiz]);
                setMessage('Quiz added successfully!');
            } catch (error) {
                setMessage(error);
            }
        }
    };

    const handleDeleteQuiz = async (quizId) => {
        if (window.confirm("Are you sure you want to delete this quiz?")) {
            try {
                await courseService.deleteQuiz(quizId);
                setQuizzes(quizzes.filter(q => q._id !== quizId));
                setMessage('Quiz deleted successfully!');
            } catch (error) {
                setMessage(error);
            }
        }
    };

     if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl">
            <h2>{id ? 'Edit Course' : 'Create New Course'}</h2>
            <form onSubmit={handleSubmitCourse} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">{id ? 'Update Course Info' : 'Create Course'}</button>
            </form>

            {id && ( // Show lecture/quiz management only after course is created/selected for edit
                <>
                  <h3 className="mt-8 font-semibold text-lg">Lectures</h3>
                    <button onClick={() => setShowLectureForm(!showLectureForm)} className="mt-2 text-blue-600 underline">
                        {showLectureForm ? 'Cancel' : 'Add New Lecture'}
                    </button>

                    {showLectureForm && (
                        <form onSubmit={handleSubmitNewLecture} className="mt-4 space-y-4 bg-gray-50 p-4 rounded-md">
                            <input
                                type="text"
                                placeholder="Lecture Title"
                                value={newLecture.title}
                                onChange={(e) => setNewLecture({ ...newLecture, title: e.target.value })}
                                required
                                className="w-full p-2 border rounded"
                            />
                            <textarea
                                placeholder="Lecture Description"
                                value={newLecture.description}
                                onChange={(e) => setNewLecture({ ...newLecture, description: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="text"
                                placeholder="Video URL (optional)"
                                value={newLecture.videoUrl}
                                onChange={(e) => setNewLecture({ ...newLecture, videoUrl: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                            <textarea
                                placeholder="Text Content (optional)"
                                value={newLecture.content}
                                onChange={(e) => setNewLecture({ ...newLecture, content: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                                Submit Lecture
                            </button>
                        </form>
                    )}

                    <ul className="mt-4">
                        {lectures.map((lecture) => (
                            <li key={lecture._id} className="flex justify-between items-center py-2 border-b">
                                {lecture.title} (Order: {lecture.order})
                                <button onClick={() => handleDeleteLecture(lecture._id)} className="text-red-600 ml-4">
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>

                    <h3>Quizzes</h3>
                    <button onClick={handleAddQuiz}>Add New Quiz</button>
                    <ul>
                        {quizzes.map((quiz) => (
                            <li key={quiz._id}>
                                {quiz.title}
                                <button onClick={() => handleDeleteQuiz(quiz._id)}>Delete</button>
                                
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
        </div>
    );
};

export default CourseForm; */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import courseService from '../services/courseService';
import authService from '../services/authService';

const CourseForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [lectures, setLectures] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const [showLectureForm, setShowLectureForm] = useState(false);
    const [newLecture, setNewLecture] = useState({
        title: '',
        description: '',
        videoUrl: '',
        content: ''
    });
    const [showQuizForm, setShowQuizForm] = useState(false);
const [newQuizTitle, setNewQuizTitle] = useState('');


    const navigate = useNavigate();
    const { id } = useParams();

    const extractYouTubeUrl = (url) => {
        const match = url.match(
            /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
        );
        return match ? `https://www.youtube.com/watch?v=${match[1]}` : null;
    };

    useEffect(() => {
        const checkRoleAndLoadCourse = async () => {
            try {
                const user = await authService.getCurrentUser();
                if (!user || user.role !== 'instructor') {
                    navigate('/login');
                    return;
                }

                if (id) {
                    const courseData = await courseService.getCourseById(id);
                   const courseInstructorId = courseData.instructor._id || courseData.instructor;
if (courseInstructorId !== user._id) {
    setMessage('You are not authorized to edit this course.');
    setTimeout(() => navigate('/courses'), 2000);
    return;
}

                    setTitle(courseData.title);
                    setDescription(courseData.description);
                    setLectures(courseData.lectures || []);
                    setQuizzes(courseData.quizzes || []);
                }
            } catch (error) {
                setMessage(error.message || 'Error loading course');
            } finally {
                setLoading(false);
            }
        };
        checkRoleAndLoadCourse();
    }, [id, navigate]);

    const handleSubmitCourse = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const courseData = { title, description };
           if (id) {
  await courseService.updateCourse(id, courseData);
  setMessage('Course updated successfully!');
} else {
  const newCourse = await courseService.createCourse(courseData);
  if (newCourse && newCourse._id) {
    setMessage('Course created successfully!');
    navigate(`/courses/${newCourse._id}/edit`);
  } else {
    setMessage('Failed to get course ID after creation');
  }
}

        } catch (error) {
            setMessage(error.message || 'Failed to submit course');
        }
    };

    const handleAddLecture = async (e) => {
        e.preventDefault();
        if (!id) {
            setMessage('Please create the course first.');
            return;
        }
        const cleanedUrl = extractYouTubeUrl(newLecture.videoUrl.trim());

        if (newLecture.videoUrl && !cleanedUrl) {
            setMessage('❌ Please enter a valid YouTube video URL.');
            return;
        }
        try {
         const res = await courseService.addLecture({
          courseId: id,
          ...newLecture,
             order: lectures.length + 1
          });
           const addedLecture = res.data;
          console.log("Added lecture:", addedLecture);

        if (!addedLecture || !addedLecture._id) {
       setMessage('Lecture added but no ID returned.');
       return;
       }

       setLectures([...lectures, addedLecture]);
       setMessage('Lecture added successfully!');
       setNewLecture({ title: '', description: '', videoUrl: '', content: '' });
       setShowLectureForm(false);
       } 
         catch (error) {
            setMessage(error.message || 'Failed to add lecture');
        }
    };

    const handleDeleteLecture = async (lectureId) => {
        if (window.confirm('Are you sure you want to delete this lecture?')) {
            try {
                await courseService.deleteLecture(lectureId);
                setLectures(lectures.filter(lec => lec._id !== lectureId));
                setMessage('Lecture deleted successfully!');
            } catch (error) {
                setMessage(error.message || 'Failed to delete lecture');
            }
        }
    };

    const handleInputChange = (e) => {
        setNewLecture({ ...newLecture, [e.target.name]: e.target.value });
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Course' : 'Create New Course'}</h2>
            <form onSubmit={handleSubmitCourse} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                    {id ? 'Update Course Info' : 'Create Course'}
                </button>
            </form>

            {id && (
                <>
                    {/* LECTURES */}
                    <div className="mt-10">
                        <h3 className="text-xl font-semibold">Lectures</h3>
                        <button
                            className="mt-2 mb-4 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
                            onClick={() => setShowLectureForm(!showLectureForm)}
                        >
                            {showLectureForm ? 'Cancel' : 'Add New Lecture'}
                        </button>

                        {showLectureForm && (
                            <form onSubmit={handleAddLecture} className="space-y-4 bg-gray-50 p-4 rounded-lg border">
                                <input
                                    type="text"
                                    name="title"
                                    value={newLecture.title}
                                    onChange={handleInputChange}
                                    placeholder="Lecture Title"
                                    required
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <textarea
                                    name="description"
                                    value={newLecture.description}
                                    onChange={handleInputChange}
                                    placeholder="Lecture Description"
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <input
                                    type="text"
                                    name="videoUrl"
                                    value={newLecture.videoUrl}
                                    onChange={handleInputChange}
                                    placeholder="Video URL (optional)"
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <textarea
                                    name="content"
                                    value={newLecture.content}
                                    onChange={handleInputChange}
                                    placeholder="Text Content (optional)"
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                                    Save Lecture
                                </button>
                            </form>
                        )}
                            <h3 className="mt-6 text-lg font-semibold">Quizzes</h3>
<button onClick={() => setShowQuizForm(true)} className="bg-purple-600 text-white px-4 py-2 rounded">Add New Quiz</button>

{showQuizForm && (
  <div className="mt-4 border p-4 rounded bg-gray-100">
    <label className="block text-sm font-medium mb-1">Quiz Title</label>
    <input
      type="text"
      value={newQuizTitle}
      onChange={(e) => setNewQuizTitle(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded"
    />
    <div className="mt-3 space-x-2">
      <button
        onClick={async () => {
          try {
            const addedQuiz = await courseService.addQuiz({
              courseId: id,
              title: newQuizTitle,
              questions: [
                {
                  questionText: "Sample Question?",
                  options: ["Option A", "Option B"],
                  correctAnswer: "Option A"
                }
              ]
            });
            setQuizzes([...quizzes, addedQuiz]);
            setMessage("Quiz added successfully!");
            setNewQuizTitle('');
            setShowQuizForm(false);
          } catch (error) {
            setMessage(error.toString());
          }
        }}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Quiz
      </button>
      <button onClick={() => setShowQuizForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
    </div>
  </div>
)}

                        <ul className="mt-4 space-y-4">
  {lectures.map((lecture, index) => (
    <li key={lecture._id} className="border p-4 rounded shadow-sm bg-gray-50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={lecture.title}
            onChange={(e) => {
              const updatedLectures = [...lectures];
              updatedLectures[index].title = e.target.value;
              setLectures(updatedLectures);
            }}
            className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 text-lg font-medium bg-transparent"
          />
          <p className="text-sm text-gray-500">Order: {lecture.order}</p>
        </div>

        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            onClick={async () => {
              try {
                await courseService.updateLecture(lecture._id, {
                  title: lecture.title,
                  description: lecture.description,
                  videoUrl: lecture.videoUrl,
                  content: lecture.content,
                  order: lecture.order
                });
                setMessage('Lecture updated successfully!');
              } catch (err) {
                setMessage('Failed to update lecture');
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            Update
          </button>
          <button
            onClick={() => handleDeleteLecture(lecture._id)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  ))}
</ul>

                        <ul className="mt-2 space-y-2">
  {quizzes.map((quiz) => (
    <li key={quiz._id} className="flex justify-between items-center border p-2 rounded">
      <span>{quiz.title}</span>
      <button
        onClick={() => handleDeleteQuiz(quiz._id)}
        className="text-red-600 hover:underline"
      >
        Delete
      </button>
    </li>
  ))}
</ul>
                    </div>
                   
                </>
            )}

            {message && (
                <p className={`mt-4 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default CourseForm;
