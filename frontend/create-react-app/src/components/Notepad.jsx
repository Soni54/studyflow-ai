import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Notepad = () => {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token'); // Ensure token is set on login

  const fetchNotes = async () => {
    try {
      const res = await api.get('/api/notes', {
        headers: { 'x-auth-token': token }
      });
      setNotes(res.data);
    } catch (err) {
      setError('Failed to load notes');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/notes/${editingId}`, form, {
          headers: { 'x-auth-token': token }
        });
      } else {
        await api.post('/api/notes', form, {
          headers: { 'x-auth-token': token }
        });
      }
      setForm({ title: '', content: '' });
      setEditingId(null);
      fetchNotes();
    } catch (err) {
      setError('Error saving note');
    }
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditingId(note._id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/notes/${id}`, {
        headers: { 'x-auth-token': token }
      });
      fetchNotes();
    } catch {
      setError('Error deleting note');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">📝 Notepad</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Write your note here..."
          className="w-full p-2 border rounded h-28"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editingId ? 'Update Note' : 'Add Note'}
        </button>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid gap-4">
        {notes.map(note => (
          <div key={note._id} className="border p-4 rounded shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold">{note.title}</h3>
            <p className="text-gray-700 whitespace-pre-line">{note.content}</p>
            <div className="mt-2 flex gap-2">
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => handleEdit(note)}
              >
                Edit
              </button>
              <button
                className="text-sm text-red-600 hover:underline"
                onClick={() => handleDelete(note._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notepad;
