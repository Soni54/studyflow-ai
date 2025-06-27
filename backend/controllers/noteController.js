const asyncHandler = require('express-async-handler');
const Note = require('../models/Note');

const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(notes);
});

const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note || note.user.toString() !== req.user.id) {
    return res.status(404).json({ msg: 'Note not found or unauthorized' });
  }
  res.json(note);
});

const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const newNote = new Note({ user: req.user.id, title, content });
  const saved = await newNote.save();
  res.status(201).json(saved);
});

const updateNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.findById(req.params.id);
  if (!note || note.user.toString() !== req.user.id) {
    return res.status(404).json({ msg: 'Note not found or unauthorized' });
  }
  note.title = title;
  note.content = content;
  const updated = await note.save();
  res.json(updated);
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note || note.user.toString() !== req.user.id) {
    return res.status(404).json({ msg: 'Note not found or unauthorized' });
  }
  await note.deleteOne();
  res.json({ msg: 'Note deleted' });
});

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};
