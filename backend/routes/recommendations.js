const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course');

router.get('/courses', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        if (req.user.role !== 'student') {
            return res.status(403).json({ msg: 'Recommendations are for students only' });
        }

        const user = await User.findById(userId).populate('enrolledCourses');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const enrolledCourseIds = user.enrolledCourses.map(course => course._id);

        // --- Simple Recommendation Logic (Initial AI) ---
        // Find all courses that the user is NOT already enrolled in.
        // For a more advanced AI, you'd integrate content-based filtering, collaborative filtering,
        // or a machine learning model here based on course categories, tags, user behavior, etc.
        const recommendedCourses = await Course.find({
            _id: { $nin: enrolledCourseIds }, // Exclude courses the user is already enrolled in
            instructor: { $ne: userId } // Exclude courses created by the student themselves (if they're also an instructor)
        }).populate('instructor', 'username email'); // Get instructor details

        // You could sort them by popularity, recency, or apply more complex scoring here.
        // For now, let's just limit to a few.
        res.json(recommendedCourses.slice(0, 5)); // Return up to 5 recommendations
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;