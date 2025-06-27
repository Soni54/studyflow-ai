const express = require('express');
const  protect = require('../middleware/auth');
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/noteController');

const router = express.Router();

router.route('/')
  .get(protect, getNotes)
  .post(protect, createNote);

router.route('/:id')
  .get(protect, getNoteById)
  .put(protect, updateNote)
  .delete(protect, deleteNote);

module.exports = router;
