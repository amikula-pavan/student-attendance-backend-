import React, { useState, useEffect } from 'react';
import api from '../api';

function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', rollNo: '', class: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (err) {
      setError('Failed to fetch students');
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async e => {
    e.preventDefault();
    if (!form.name || !form.rollNo || !form.class) return;
    try {
      const res = await api.post('/students', form);
      setStudents([...students, res.data]);
      setForm({ name: '', rollNo: '', class: '' });
      setError('');
    } catch (err) {
      setError('Failed to add student');
    }
  };

  const handleEdit = student => {
    setEditingId(student._id);
    setForm({ name: student.name, rollNo: student.rollNo, class: student.class });
  };

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      const res = await api.put(`/students/${editingId}`, form);
      setStudents(students.map(s => s._id === editingId ? res.data : s));
      setEditingId(null);
      setForm({ name: '', rollNo: '', class: '' });
      setError('');
    } catch (err) {
      setError('Failed to update student');
    }
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/students/${id}`);
      setStudents(students.filter(s => s._id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete student');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Student List</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={editingId ? handleUpdate : handleAdd} style={{ marginBottom: '1rem' }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          name="rollNo"
          placeholder="Roll No"
          value={form.rollNo}
          onChange={handleChange}
          style={{ marginRight: '0.5rem' }}
        />
        <input
          name="class"
          placeholder="Class"
          value={form.class}
          onChange={handleChange}
          style={{ marginRight: '0.5rem' }}
        />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', rollNo: '', class: '' }); }} style={{ marginLeft: '0.5rem' }}>Cancel</button>
        )}
      </form>
      <table border="1" cellPadding="8" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.rollNo}</td>
              <td>{student.class}</td>
              <td>
                <button onClick={() => handleEdit(student)} style={{ marginRight: '0.5rem' }}>Edit</button>
                <button onClick={() => handleDelete(student._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentListPage; 