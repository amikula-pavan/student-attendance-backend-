import React, { useState, useEffect } from 'react';
import api from '../api';

function ReportPage() {
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState('');

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
      const res = await api.get('/attendance');
      setAttendanceRecords(res.data);
    } catch (err) {
      setError('Failed to fetch attendance records');
    }
  };

  function getAttendanceSummary() {
    return students.map(student => {
      const records = attendanceRecords.filter(r => r.student._id === student._id);
      const present = records.filter(r => r.status === 'present').length;
      const absent = records.filter(r => r.status === 'absent').length;
      return { ...student, present, absent, total: records.length };
    });
  }

  const summary = getAttendanceSummary();

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Attendance Report</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <table border="1" cellPadding="8" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll No</th>
            <th>Class</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Total Days</th>
          </tr>
        </thead>
        <tbody>
          {summary.map(s => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.rollNo}</td>
              <td>{s.class}</td>
              <td>{s.present}</td>
              <td>{s.absent}</td>
              <td>{s.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportPage; 