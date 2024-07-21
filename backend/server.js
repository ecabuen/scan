const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Import bcrypt
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

  // Hash the password before storing it in the database
  const hashedPassword = bcrypt.hashSync(password, 8);

  const sql = 'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [firstname, lastname, email, hashedPassword], (err, result) => {
    if (err) {
      console.error('SQL error:', err);
      return res.status(500).send('Server error');
    }
    console.log('User registered:', result);
    res.status(201).send('User registered');
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
    const dir = '../scan/teacherimages';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
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



//Add student

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = '../scan/studentimages';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${req.body.name}.jpg`);
  }
});

const upload = multer({ storage: storage });

app.post('/add-student', upload.single('profilePic'), (req, res) => {
  const { name, gmail, id } = req.body; //add
  const profilePic = req.file ? req.file.filename : null;

  // Insert student data into database
  const sql = 'INSERT INTO student (name, gmail, profile_pic, teacher_id) VALUES (?, ?, ?, ?)'; //add
  db.query(sql, [name, gmail, profilePic, id], (err, result) => {
    if (err) {
      console.error('SQL error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to register student' });
    }

    res.status(201).json({
      status: 'success',
      message: 'Student registered successfully',
      data: { name, gmail, profilePic } //add
    });
  });
});

//get student
app.get('/students/:id', (req, res) => {
  const teacherId = req.params.id;

  const sql = 'SELECT * FROM student WHERE teacher_id = ?';
  db.query(sql, [teacherId], (err, results) => {
    if (err) {
      console.error('SQL error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to fetch students' });
    }

    res.status(200).json({
      status: 'success',
      data: results,
    });
  });
});


// update student
app.put('/update-student/:studentID', (req, res) => {
  const studentID = req.params.studentID;
  const { name, gmail, profilePic } = req.body;

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
      data: { id: studentID, name, gmail, profilePic }
    });
  });
});





app.post('/upload-image', upload.single('profilePic'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'No file uploaded' });
  }

  res.status(201).json({
    status: 'success',
    message: 'Image uploaded successfully'
  });
});

// Fetch students and their attendance by teacherId
app.get('/students/:teacherId', (req, res) => {
  const { teacherId } = req.params;
  console.log('Fetching students for teacher ID:', teacherId); // Log teacher ID

  const sql = `
    SELECT s.*, a.status AS attendance_status
    FROM student s
    LEFT JOIN attendance a ON s.id = a.student_id
    WHERE s.teacher_id = ?
  `;

  db.query(sql, [teacherId], (err, results) => {
    if (err) {
      console.error('SQL error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to fetch students' });
    }
    
    console.log('Query results:', results); // Log query results
    res.status(200).json({
      status: 'success',
      data: results,
    });
  });
});

// Delete student endpoint
// Verify password and delete student endpoint
app.post('/verify-password-and-delete', (req, res) => {
  const { userId, password, studentID } = req.body;

  // Fetch the user's hashed password from the database
  const sql = 'SELECT password FROM users WHERE id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('SQL error:', err);
      return res.status(500).json({ status: 'error', message: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: 'error', message: 'Incorrect password' });
    }

    // Delete the student if the password is correct
    const deleteSql = 'DELETE FROM student WHERE studentID = ?';
    db.query(deleteSql, [studentID], (err, result) => {
      if (err) {
        console.error('SQL error:', err);
        return res.status(500).json({ status: 'error', message: 'Failed to delete student' });
      }
      res.status(200).json({ status: 'success', message: 'Student deleted successfully' });
    });
  });
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
