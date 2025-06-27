const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Authentication middleware
const User = require('../models/User');
const Course = require('../models/Course');



router.post('/enroll/:courseId', auth, async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        // Ensure the user is a student (optional but good practice)
        if (req.user.role !== 'student') {
            return res.status(403).json({ msg: 'Only students can enroll in courses' });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Find the user and add course to enrolledCourses if not already present
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ msg: 'Already enrolled in this course' });
        }

        user.enrolledCourses.push(courseId);
        await user.save();

        res.json({ msg: 'Successfully enrolled in course', courseId });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/unenroll/:courseId', auth, async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        if (req.user.role !== 'student') {
            return res.status(403).json({ msg: 'Only students can unenroll from courses' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (!user.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ msg: 'Not enrolled in this course' });
        }

        user.enrolledCourses = user.enrolledCourses.filter(
            (id) => id.toString() !== courseId
        );
        await user.save();

        res.json({ msg: 'Successfully unenrolled from course', courseId });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/my-courses', auth, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ msg: 'Only students can view their enrolled courses' });
        }

        const user = await User.findById(req.user.id).populate('enrolledCourses');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user.enrolledCourses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;