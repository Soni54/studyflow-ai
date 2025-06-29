const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');
const Lecture = require('../models/Lecture');
const Quiz = require('../models/Quiz');

const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    } 
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Access denied: You do not have the required role'});
        }
        next();
    };
};

router.post('/', auth, authorize('instructor'), async (req, res) => {
    const { title, description } = req.body;
    try {
        const newCourse = new Course({
            title,
            description,
            instructor: req.user.id
        });

        const course = await newCourse.save();
        res.status(201).json(course);
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', async (req, res) => {
    try {
        // Populate the 'instructor' field with username and email
        const courses = await Course.find()
                                   .populate('instructor', 'username email') // Only get username and email
                                   .sort({ createdAt: -1 }); // Sort by newest first
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', async (req,res) => {
    try {
        const course = await Course.findById(req.params.id)
                                   .populate('instructor','username email')
                                   .populate({
                                    path: 'lectures',
                                    options: {sort: { 'order': 1}}
                                   })
                                   .populate('quizzes');

        if (!course) {
            return res.status(404).json({ msg: 'Course not found'});
        }
        res.json(course);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid Course ID'});
        }
        res.status(500).send('Server Error');
    }
});

router.put('/:id', auth, authorize('instructor'), async (req,res) => {
    const {title, description} =req.body;
    const courseFields = {};
    if(title) courseFields.title = title;
    if(description) courseFields.description = description;
     try {
        let course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Check if the logged-in user is the instructor of this course
        if (course.instructor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to update this course' });
        }

        course = await Course.findByIdAndUpdate(
            req.params.id,
            { $set: courseFields },
            { new: true } // Return the updated document
        );
        res.json(course);

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid Course ID' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private (Instructor only, and must be the course owner)
router.delete('/:id', auth, authorize('instructor'), async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Check if the logged-in user is the instructor of this course
        if (String(course.instructor?._id || course.instructor) !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to delete this course' });
        }

        // Also delete associated lectures and quizzes
        await Lecture.deleteMany({ course: req.params.id });
        await Quiz.deleteMany({ course: req.params.id });
        await Course.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Course, associated lectures, and quizzes removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid Course ID' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
