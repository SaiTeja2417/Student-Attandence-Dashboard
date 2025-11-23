// index.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'attendanceRecords.json');

// ------------------ DUMMY TEACHER LOGIN ------------------ //
const TEACHER_EMAIL = "teacher@gmail.com";
const TEACHER_PASSWORD = "teacher123";

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email or Password missing" });
  }

  if (email === TEACHER_EMAIL && password === TEACHER_PASSWORD) {
    return res.json({ success: true, message: "Login successful" });
  }

  return res.status(401).json({ success: false, message: "Invalid credentials" });
});

// ---------------------------------------------------------- //


// master student list
const students = [
  { id: 101, name: "Emma Watson", roll: 101 },
  { id: 102, name: "Liam Smith", roll: 102 },
  { id: 103, name: "Olivia Brown", roll: 103 },
  { id: 104, name: "Noah Davis", roll: 104 },
  { id: 105, name: "Ava Wilson", roll: 105 },
  { id: 106, name: "Ethan Martinez", roll: 106 },
  { id: 107, name: "Mason Lee", roll: 107 },
  { id: 108, name: "James Clark", roll: 108 },
  { id: 109, name: "Sophia Hall", roll: 109 },
  { id: 110, name: "Isabella King", roll: 110 }
];

// ensure file exists
function loadRecords() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([]));
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    console.error('Failed to load records:', e);
    return [];
  }
}
function saveRecords(records) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2));
}

// GET students
app.get('/students', (req, res) => {
  res.json(students);
});

// POST save attendance
app.post('/attendance', (req, res) => {
  const { date, students: attendance } = req.body;
  if (!date || !Array.isArray(attendance)) {
    return res.status(400).json({ message: 'Invalid payload' });
  }

  const normalized = attendance.map(a => {
    let s = a.status;
    if (typeof s === 'string') {
      s = s.toLowerCase() === 'present' ? 'Present' : 'Absent';
    } else if (typeof s === 'boolean') {
      s = s ? 'Present' : 'Absent';
    } else {
      s = s === 1 ? 'Present' : 'Absent';
    }
    return { id: a.id, status: s };
  });

  const records = loadRecords();
  const filtered = records.filter(r => r.date !== date);
  filtered.push({ date, students: normalized });

  saveRecords(filtered);
  res.json({ message: 'Saved', date, students: normalized });
});

// GET attendance
app.get('/attendance', (req, res) => {
  const { date } = req.query;
  const records = loadRecords();
  if (!date) return res.json(records);

  const rec = records.find(r => r.date === date);
  return res.json(rec || null);
});

// REPORT API
app.get('/attendance/report', (req, res) => {
  const records = loadRecords();

  const reportMap = {};
  students.forEach(s => {
    reportMap[s.id] = {
      id: s.id,
      name: s.name,
      roll: s.roll,
      present: 0,
      absent: 0,
      days: 0
    };
  });

  records.forEach(record => {
    const dayMap = {};
    (record.students || []).forEach(a => {
      let status = 'Absent';
      if (typeof a.status === 'string') status = a.status.toLowerCase() === 'present' ? 'Present' : 'Absent';
      else if (typeof a.status === 'boolean') status = a.status ? 'Present' : 'Absent';
      else status = a.status === 1 ? 'Present' : 'Absent';

      dayMap[a.id] = status;
    });

    Object.keys(reportMap).forEach(idStr => {
      const id = parseInt(idStr, 10);
      const st = dayMap[id] || 'Absent';

      reportMap[id].days += 1;
      if (st === 'Present') reportMap[id].present += 1;
      else reportMap[id].absent += 1;
    });
  });

  const report = Object.values(reportMap);

  const totals = {
    totalDaysRecorded: records.length,
    totalStudents: students.length,
    totalPresent: report.reduce((s, r) => s + r.present, 0),
    totalAbsent: report.reduce((s, r) => s + r.absent, 0)
  };

  res.json({ report, totals });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running http://localhost:${PORT}`));
