const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET /api/students
router.get('/', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// POST /api/students
router.post('/', async (req, res) => {
  const { name, rollNo, class: className } = req.body;
  if (!name || !rollNo || !className) return res.status(400).json({ message: 'Missing fields' });
  const student = new Student({ name, rollNo, class: className });
  await student.save();
  res.json(student);
});

// PUT /api/students/:id
router.put('/:id', async (req, res) => {
  const { name, rollNo, class: className } = req.body;
  const student = await Student.findByIdAndUpdate(req.params.id, { name, rollNo, class: className }, { new: true });
  if (!student) return res.status(404).json({ message: 'Not found' });
  res.json(student);
});

// DELETE /api/students/:id
router.delete('/:id', async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router; 