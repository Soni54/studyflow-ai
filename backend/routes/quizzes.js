// backend/routes/quizzes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');

// Helper for authorization (same as in courses.js)
const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Access denied: You do not have the required role' });
        }
        next();
    };
};

// @route   POST /api/quizzes
// @desc    Add a quiz to a course
// @access  Private (Instructor only, must own the course)
router.post('/', auth, authorize('instructor'), async (req, res) => {
    const { courseId, title, questions } = req.body;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        if (course.instructor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to add quizzes to this course' });
        }

        const newQuiz = new Quiz({
            course: courseId,
            title,
            questions
        });

        const quiz = await newQuiz.save();

        // Add quiz to course's quizzes array
        course.quizzes.push(quiz.id);
        await course.save();

        res.status(201).json(quiz);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/quizzes/:id
// @desc    Delete a quiz
// @access  Private (Instructor only, must own the course)
router.delete('/:id', auth, authorize('instructor'), async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ msg: 'Quiz not found' });
        }

        const course = await Course.findById(quiz.course);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to delete this quiz' });
        }

        await Quiz.findByIdAndDelete(req.params.id);

        // Remove quiz from course's quizzes array
        course.quizzes = course.quizzes.filter(quizId => quizId.toString() !== req.params.id);
        await course.save();

        res.json({ msg: 'Quiz removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid Quiz ID' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/quizzes/:id
// @desc    Update a quiz
// @access  Private (Instructor only, must own the course)
router.put('/:id', auth, authorize('instructor'), async (req, res) => {
    const { title, questions } = req.body;
    const quizFields = {};
    if (title) quizFields.title = title;
    if (questions) quizFields.questions = questions; // Be careful with direct array replacement

    try {
        let quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ msg: 'Quiz not found' });
        }

        const course = await Course.findById(quiz.course);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to update this quiz' });
        }

        quiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            { $set: quizFields },
            { new: true }
        );
        res.json(quiz);

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid Quiz ID' });
        }
        res.status(500).send('Server Error');
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ msg: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid Quiz ID' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;