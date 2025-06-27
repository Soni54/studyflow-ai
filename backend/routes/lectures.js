// backend/routes/lectures.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lecture = require('../models/Lecture');
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

// @route   POST /api/lectures
// @desc    Add a lecture to a course
// @access  Private (Instructor only, must own the course)
router.post('/', auth, authorize('instructor'), async (req, res) => {
    const { courseId, title, description, videoUrl, content, order } = req.body;

    try {
        // Check if course exists and belongs to the instructor
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        if (course.instructor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to add lectures to this course' });
        }

        const newLecture = new Lecture({
            course: courseId,
            title,
            description,
            videoUrl,
            content,
            order: order || (course.lectures.length + 1) // Simple auto-order if not provided
        });

        const lecture = await newLecture.save();

        // Add lecture to course's lectures array
        course.lectures.push(lecture.id);
        await course.save();

        res.status(201).json(lecture);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/lectures/:id
// @desc    Get a lecture by ID
// @access  Private (students or instructors)
router.get('/:id', auth, async (req, res) => {
    try {
        const lecture = await Lecture.findById(req.params.id).populate('course', 'title');
        if (!lecture) {
            return res.status(404).json({ msg: 'Lecture not found' });
        }
        res.json(lecture);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   DELETE /api/lectures/:id
// @desc    Delete a lecture
// @access  Private (Instructor only, must own the course)
router.delete('/:id', auth, authorize('instructor'), async (req, res) => {
    try {
        const lecture = await Lecture.findById(req.params.id);
        if (!lecture) {
            return res.status(404).json({ msg: 'Lecture not found' });
        }

        const course = await Course.findById(lecture.course);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to delete this lecture' });
        }

        await Lecture.findByIdAndDelete(req.params.id);

        // Remove lecture from course's lectures array
        course.lectures = course.lectures.filter(lecId => lecId.toString() !== req.params.id);
        await course.save();

        res.json({ msg: 'Lecture removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid Lecture ID' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/lectures/:id
// @desc    Update a lecture
// @access  Private (Instructor only, must own the course)
router.put('/:id', auth, authorize('instructor'), async (req, res) => {
    const { title, description, videoUrl, content, order } = req.body;
    const lectureFields = {};
    if (title) lectureFields.title = title;
    if (description) lectureFields.description = description;
    if (videoUrl) lectureFields.videoUrl = videoUrl;
    if (content) lectureFields.content = content;
    if (order !== undefined) lectureFields.order = order;

    try {
        let lecture = await Lecture.findById(req.params.id);
        if (!lecture) {
            return res.status(404).json({ msg: 'Lecture not found' });
        }

        const course = await Course.findById(lecture.course);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to update this lecture' });
        }

        lecture = await Lecture.findByIdAndUpdate(
            req.params.id,
            { $set: lectureFields },
            { new: true }
        );
        res.json(lecture);

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid Lecture ID' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;