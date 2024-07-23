const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'scan',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected...');
});

// Register endpoint
app.post('/register', (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // Check if email already exists
  const checkEmailSql = 'SELECT * FROM users WHERE email = ?';
  db.query(checkEmailSql, [email], (err, results) => {
    if (err) {
      console.error('SQL error:', err);
      return res.status(500).send('Server error');
    }
    if (results.length > 0) {
      return res.status(400).send('Email already in use');
    }

    // Hash the password before storing it in the database
    const hashedPassword = bcrypt.hashSync(password, 8);

    const insertSql = 'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
    db.query(insertSql, [firstname, lastname, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('SQL error:', err);
        return res.status(500).send('Server error');
      }
      console.log('User registered:', result);
      res.status(201).send('User registered');
    });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE BINARY email = ?'; // Case-sensitive email comparison
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('SQL error:', err);
      return res.status(500).send('Server error');
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Wrong username or password' });
    }

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Wrong username or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      id: user.id
    });
  });
});

// Update profile endpoint
const teacherImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../scan/teacherimages');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const { firstname, lastname } = req.body;
    const filename = `${firstname}-${lastname}.jpg`;
    cb(null, filename);
  },
});

const uploadTeacherImage = multer({ storage: teacherImageStorage }).single('profilePic');

app.put('/update-profile/:id', uploadTeacherImage, (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email } = req.body;
  const profilePicFilename = req.file ? req.file.filename : req.body.profilePic;

  const sql = 'UPDATE users SET firstname = ?, lastname = ?, email = ?, profile_pic = ? WHERE id = ?';
  const params = [firstname, lastname, email, profilePicFilename, id];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('SQL error:', err);
      return res.status(500).send('Server error');
    }
    res.status(200).json({
      message: 'Profile updated successfully',
      data: { id, firstname, lastname, email, profilePic: profilePicFilename },
    });
  });
});

// Add student
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../scan/studentimages');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${req.body.name}.jpg`);
  }
});

const upload = multer({ storage: storage });

app.post('/add-student', upload.single('profilePic'), (req, res) => {
  const { name, gmail, gender, id } = req.body;
  const profilePic = req.file ? req.file.filename : null;

  // Insert student data into database
  const sql = 'INSERT INTO student (name, gmail, gender, profile_pic, teacher_id) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, gmail, gender, profilePic, id], (err, result) => {
    if (err) {
      console.error('SQL error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to register student' });
    }

    res.status(201).json({
      status: 'success',
      message: 'Student registered successfully',
      data: { name, gmail, gender, profilePic }
    });
  });
});

// Get student
app.get('/students/:id', (req, res) => {
  const teacherId = req.params.id;

  const sql = `
    SELECT s.*, a.status AS attendanceStatus
    FROM student s
    LEFT JOIN (
      SELECT studentID, status
      FROM attendance
      WHERE date = CURDATE()
    ) a ON s.studentID = a.studentID
    WHERE s.teacher_id = ?
  `;

  db.query(sql, [teacherId], (err, results) => {
    if (err) {
      console.error('SQL error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to fetch students' });
    }
    res.status(200).json({ status: 'success', data: results });
  });
});

// Update student
app.put('/update-student/:studentID', (req, res) => {
  const studentID = req.params.studentID;
  const { name, gmail, profilePic, gender } = req.body;

  // Build SQL query dynamically based on which fields are provided
  let sql = 'UPDATE student SET ';
  const params = [];
  const fields = [];

  if (name) {
    fields.push('name = ?');
    params.push(name);
  }
  if (gmail) {
    fields.push('gmail = ?');
    params.push(gmail);
  }
  if (profilePic) {
    fields.push('profile_pic = ?');
    params.push(profilePic);
  }
  if (gender) {
    fields.push('gender = ?');
    params.push(gender);
  }
  
  if (fields.length === 0) {
    return res.status(400).json({ status: 'error', message: 'No fields to update' });
  }

  sql += fields.join(', ') + ' WHERE studentID = ?';
  params.push(studentID);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('SQL error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to update student' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Student not found or no changes made' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Student information updated successfully',
      data: { id: studentID, name, gmail, profilePic, gender }
    });
  });
});

// Upload image
app.post('/upload-image', upload.single('profilePic'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'No file uploaded' });
  }

  res.status(201).json({
    status: 'success',
    message: 'Image uploaded successfully'
  });
});

// Delete student endpoint
app.post('/verify-password-and-delete', (req, res) => {
  const { userId, password, studentID } = req.body;

  // Fetch the user's hashed password from the database
  const sql = 'SELECT password FROM users WHERE id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('SQL error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to verify user' });
    }

    if (results.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const hashedPassword = results[0].password;

    // Compare the provided password with the hashed password
    const passwordMatch = bcrypt.compareSync(password, hashedPassword);
    if (!passwordMatch) {
      return res.status(401).json({ status: 'error', message: 'Incorrect password' });
    }

    // If password is correct, proceed with deletion
    const deleteSql = 'DELETE FROM student WHERE studentID = ?';
    db.query(deleteSql, [studentID], (err, deleteResult) => {
      if (err) {
        console.error('SQL error:', err);
        return res.status(500).json({ status: 'error', message: 'Failed to delete student' });
      }

      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ status: 'error', message: 'Student not found' });
      }

      res.status(200).json({ status: 'success', message: 'Student deleted successfully' });
    });
  });
});


//ito yung para sa homescreen
app.get('/attendance-summary/:teacherId', (req, res) => {
  const teacherId = req.params.teacherId;

  const queries = {
    totalStudents: 'SELECT COUNT(*) AS total FROM student WHERE teacher_Id = ?',
    presentStudents: `
      SELECT COUNT(*) AS present
      FROM attendance
      WHERE status = 'present' AND date = CURDATE() AND studentID IN (SELECT studentID FROM student WHERE teacher_Id = ?)
    `,
    absentStudents: `
      SELECT COUNT(*) AS absent
      FROM attendance
      WHERE status = 'absent' AND date = CURDATE() AND studentID IN (SELECT studentID FROM student WHERE teacher_Id = ?)
    `,
    lateStudents: `
      SELECT COUNT(*) AS late
      FROM attendance
      WHERE status = 'late' AND date = CURDATE() AND studentID IN (SELECT studentID FROM student WHERE teacher_Id = ?)
    `,
    genderData: `
      SELECT gender, COUNT(*) AS count
      FROM student
      WHERE teacher_Id = ?
      GROUP BY gender
    `,
  };

  const results = {};

  const executeQuery = (queryKey, query, params) => {
    return new Promise((resolve, reject) => {
      db.query(query, params, (err, result) => {
        if (err) {
          console.error(`SQL error for ${queryKey}:`, err);
          reject({ queryKey, error: err });
        } else {
          results[queryKey] = result[0] || {};
          resolve();
        }
      });
    });
  };

  Promise.all([
    executeQuery('totalStudents', queries.totalStudents, [teacherId]),
    executeQuery('presentStudents', queries.presentStudents, [teacherId]),
    executeQuery('absentStudents', queries.absentStudents, [teacherId]),
    executeQuery('lateStudents', queries.lateStudents, [teacherId]),
    executeQuery('genderData', queries.genderData, [teacherId]),
  ])
    .then(() => {
      res.status(200).json({
        status: 'success',
        data: {
          totalStudents: results.totalStudents.total || 0,
          presentStudents: results.presentStudents.present || 0,
          absentStudents: results.absentStudents.absent || 0,
          lateStudents: results.lateStudents.late || 0,
          genderData: results.genderData,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({ status: 'error', message: 'Failed to fetch attendance summary', error });
    });
});

app.get('/attendance-chart/:teacherId/:type', (req, res) => {
  const { teacherId, type } = req.params;

  const queries = {
    daily: `
      SELECT DATE_FORMAT(date, '%a') AS day, COUNT(*) AS presentCount
      FROM attendance
      WHERE status = 'present' AND WEEK(date) = WEEK(CURDATE()) AND studentID IN (SELECT studentID FROM student WHERE teacher_Id = ?)
      GROUP BY day
    `,
    weekly: `
      SELECT CONCAT('Week ', WEEK(date)) AS week, COUNT(*) AS presentCount
      FROM attendance
      WHERE status = 'present' AND MONTH(date) = MONTH(CURDATE()) AND studentID IN (SELECT studentID FROM student WHERE teacher_Id = ?)
      GROUP BY week
    `,
    monthly: `
      SELECT DATE_FORMAT(date, '%b') AS month, COUNT(*) AS presentCount
      FROM attendance
      WHERE status = 'present' AND YEAR(date) = YEAR(CURDATE()) AND studentID IN (SELECT studentID FROM student WHERE teacher_Id = ?)
      GROUP BY month
    `,
  };

  const sql = queries[type];

  if (!sql) {
    return res.status(400).json({ status: 'error', message: 'Invalid type' });
  }

  db.query(sql, [teacherId], (err, results) => {
    if (err) {
      console.error('SQL error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to fetch attendance data', error: err });
    }

    res.status(200).json({
      status: 'success',
      data: results,
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
