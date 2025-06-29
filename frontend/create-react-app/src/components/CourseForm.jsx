

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
                console.log("🎯 Lectures to render:", lectures);

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
  {lectures.map((lecture, index) => {
    if (!lecture || !lecture._id){
       console.warn("❌ Skipping invalid lecture:", lecture); 
     return null;
    }
    return(
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
  );
  })}
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
