import React, { useState, useEffect } from 'react';
import api from '../api';

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: 'present' | 'absent' }
  const [error, setError] = useState('');
  const today = getToday();

  useEffect(() => {
    fetchStudents();
    fetchAttendance();
    // eslint-disable-next-line
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (err) {
      setError('Failed to fetch students');
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await api.get('/attendance', { params: { date: today } });
      // Map attendance records to { studentId: status }
      const att = {};
      res.data.forEach(r => {
        att[r.student._id] = r.status;
      });
      setAttendance(att);
    } catch (err) {
      setError('Failed to fetch attendance');
    }
  };

  const handleMark = async (studentId, status) => {
    try {
      await api.post('/attendance', { studentId, date: today, status });
      setAttendance({ ...attendance, [studentId]: status });
      setError('');
    } catch (err) {
      setError('Failed to mark attendance (maybe already marked)');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Attendance for {today}</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <table border="1" cellPadding="8" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Class</th>
            <th>Status</th>
            <th>Mark</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.rollNo}</td>
              <td>{student.class}</td>
              <td>{attendance[student._id] || 'Not marked'}</td>
              <td>
                <button
                  onClick={() => handleMark(student._id, 'present')}
                  style={{ marginRight: '0.5rem', background: attendance[student._id] === 'present' ? '#cfc' : '' }}
                  disabled={!!attendance[student._id]}
                >
                  Present
                </button>
                <button
                  onClick={() => handleMark(student._id, 'absent')}
                  style={{ background: attendance[student._id] === 'absent' ? '#fcc' : '' }}
                  disabled={!!attendance[student._id]}
                >
                  Absent
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendancePage; 