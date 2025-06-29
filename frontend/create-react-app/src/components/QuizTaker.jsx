import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const QuizTaker = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
         const token = localStorage.getItem('token'); 
        const res = await api.get(`/quizzes/${id}`);
        setQuiz(res.data);
      } catch (err) {
        setError('Failed to load quiz');
      }
    };

    fetchQuiz();
  }, [id]);

  const handleChange = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = () => {
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) {
        correct += 1;
      }
    });
    setScore(correct);
    setSubmitted(true);
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!quiz) {
    return <p className="text-gray-600">Loading quiz...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
      {quiz.questions.map((q, index) => (
        <div key={index} className="mb-6">
          <p className="font-semibold">{index + 1}. {q.questionText}</p>
          {q.options.map((option, i) => (
            <div key={i}>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  onChange={() => handleChange(index, option)}
                  disabled={submitted}
                />
                <span>{option}</span>
              </label>
            </div>
          ))}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Quiz
        </button>
      ) : (
        <p className="text-green-600 mt-4 font-bold">
          Your Score: {score} / {quiz.questions.length}
        </p>
      )}
    </div>
  );
};

export default QuizTaker;

