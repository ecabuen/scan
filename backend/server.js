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

//get student
// Fetch students with attendance status for today
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



// update student
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


// Endpoint to check and update attendance
app.post('/update-attendance', (req, res) => {
  const { teacherId } = req.body;
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
  
  // Query to fetch students and their attendance for the current date
  const fetchSql = `
    SELECT s.studentID AS studentId, s.name, a.status
    FROM student s
    LEFT JOIN attendance a ON s.studentID = a.studentID AND a.date = CURDATE()
    WHERE s.teacher_id = ?;
  `;

  db.query(fetchSql, [teacherId], (err, results) => {
    if (err) {
      console.error('SQL error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to fetch students' });
    }

    // Iterate through results and update attendance if necessary
    const updates = results.map(student => {
      if (!student.status) {
        // Mark as absent if no attendance record exists for the current date
        return new Promise((resolve, reject) => {
          const insertSql = 'INSERT INTO attendance (studentID, date, status) VALUES (?, ?, ?)';
          db.query(insertSql, [student.studentID, currentDate, 'Absent'], (err, result) => {
            if (err) {
              console.error('SQL error:', err);
              return reject(err);
            }
            resolve();
          });
        });
      }
      return Promise.resolve();
    });

    Promise.all(updates)
      .then(() => {
        res.status(200).json({
          status: 'success',
          data: results.map(student => ({
            ...student,
            status: student.status || 'Absent',
          })),
        });
      })
      .catch(err => {
        res.status(500).json({ status: 'error', message: 'Failed to update attendance' });
      });
  });
});

//update attendance status
app.post('/update-student-status', (req, res) => {
  console.log('Received request to update status:', req.body);
  const { studentId, newStatus } = req.body;
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

  const updateSql = `
    UPDATE attendance
    SET status = ?
    WHERE studentID = ? AND date = CURDATE();
  `;

  db.query(updateSql, [newStatus, studentId], (err, result) => {
    if (err) {
      console.error('SQL error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to update attendance status' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'No record found to update' });
    }
    res.status(200).json({ status: 'success', message: 'Attendance status updated' });
  });
});

// Change password endpoint
app.put('/change-password/:id', (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  // Fetch the user's current password from the database
  const sql = 'SELECT password FROM users WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('SQL error:', err);
      return res.status(500).send('Server error');
    }
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Current password is incorrect');
    }

    // Hash the new password before storing it in the database
    const hashedNewPassword = bcrypt.hashSync(newPassword, 8);
    const updateSql = 'UPDATE users SET password = ? WHERE id = ?';
    db.query(updateSql, [hashedNewPassword, id], (err, result) => {
      if (err) {
        console.error('SQL error:', err);
        return res.status(500).send('Server error');
      }
      res.status(200).send('Password changed successfully');
    });
  });
});


//dashboard
app.get('/attendance/today', (req, res) => {
  const teacherId = req.query.teacherId;

  const presentQuery = `
    SELECT COUNT(*) AS present
    FROM attendance
    WHERE status = 'Present' AND date = CURDATE() AND studentID IN (
      SELECT studentID
      FROM student
      WHERE teacher_Id = ?
    );
  `;

  const lateQuery = `
    SELECT COUNT(*) AS late
    FROM attendance
    WHERE status = 'Late' AND date = CURDATE() AND studentID IN (
      SELECT studentID
      FROM student
      WHERE teacher_Id = ?
    );
  `;

  const absentQuery = `
    SELECT COUNT(*) AS absent
    FROM attendance
    WHERE status = 'Absent' AND date = CURDATE() AND studentID IN (
      SELECT studentID
      FROM student
      WHERE teacher_Id = ?
    );
  `;

  const totalQuery = `
    SELECT COUNT(*) AS total
    FROM student
    WHERE teacher_Id = ?;
  `;

  const genderQuery = `
    SELECT gender, COUNT(*) AS count
    FROM student
    WHERE teacher_Id = ?
    GROUP BY gender;
  `;

  db.query(presentQuery, [teacherId], (err, presentResult) => {
    if (err) {
      return res.status(500).send(err);
    }
    db.query(lateQuery, [teacherId], (err, lateResult) => {
      if (err) {
        return res.status(500).send(err);
      }
      db.query(absentQuery, [teacherId], (err, absentResult) => {
        if (err) {
          return res.status(500).send(err);
        }
        db.query(totalQuery, [teacherId], (err, totalResult) => {
          if (err) {
            return res.status(500).send(err);
          }
          db.query(genderQuery, [teacherId], (err, genderResult) => {
            if (err) {
              return res.status(500).send(err);
            }
            res.json({
              present: presentResult[0].present,
              late: lateResult[0].late,
              absent: absentResult[0].absent,
              total: totalResult[0].total,
              gender: genderResult
            });
          });
        });
      });
    });
  });
});



app.get('/attendance/daily', (req, res) => {
  const teacherId = req.query.teacherId;

  const dailyAttendanceQuery = `
    SELECT DATE_FORMAT(date, '%a') AS day, COUNT(*) AS presentCount
    FROM attendance
    WHERE (status = 'Present' OR status = 'Late') AND WEEK(date) = WEEK(CURDATE()) AND studentID IN (
      SELECT studentID
      FROM student
      WHERE teacher_Id = ?
    )
    GROUP BY day;
  `;

  db.query(dailyAttendanceQuery, [teacherId], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});


app.get('/attendance/weekly', (req, res) => {
  const teacherId = req.query.teacherId;

  const weeklyQuery = `
    SELECT
      CONCAT('Week ', WEEK(date, 1) - WEEK(DATE_SUB(CURDATE(), INTERVAL DAYOFMONTH(CURDATE())-1 DAY), 1) + 1) AS week,
      COUNT(*) AS presentCount
    FROM attendance
    WHERE (status = 'Present' OR status = 'Late') AND MONTH(date) = MONTH(CURDATE()) AND studentID IN (SELECT studentID FROM student WHERE teacher_Id = ?)
    GROUP BY week;
  `;

  db.query(weeklyQuery, [teacherId], (err, weeklyResult) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(weeklyResult);
  });
});



app.get('/attendance/monthly', (req, res) => {
  const teacherId = req.query.teacherId;

  const earliestMonthQuery = `
    SELECT MIN(MONTH(date)) AS earliestMonth
    FROM attendance
    WHERE YEAR(date) = YEAR(CURDATE()) AND studentID IN (SELECT studentID FROM student WHERE teacher_Id = ?)
  `;

  db.query(earliestMonthQuery, [teacherId], (err, earliestMonthResult) => {
    if (err) {
      return res.status(500).send(err);
    }

    const earliestMonth = earliestMonthResult[0].earliestMonth;

    if (!earliestMonth) {
      // No attendance data for the current year
      return res.json([]);
    }

    const monthlyQuery = `
      SELECT DATE_FORMAT(date, '%b') AS month, COUNT(*) AS presentCount
      FROM attendance
      WHERE (status = 'Present' OR status = 'Late') AND YEAR(date) = YEAR(CURDATE()) AND studentID IN (SELECT studentID FROM student WHERE teacher_Id = ?)
      GROUP BY month
      ORDER BY
        FIELD(MONTH(date), ${earliestMonth}, ${earliestMonth + 1}, ${earliestMonth + 2}, ${earliestMonth + 3}, ${earliestMonth + 4}, ${earliestMonth + 5}, ${earliestMonth + 6}, ${earliestMonth + 7}, ${earliestMonth + 8}, ${earliestMonth + 9}, ${earliestMonth + 10}, ${earliestMonth + 11})
    `;

    db.query(monthlyQuery, [teacherId], (err, monthlyResult) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(monthlyResult);
    });
  });
});



// Endpoint for fetching filtered students
app.get('/students/:id/filter', (req, res) => {
  const teacherId = req.params.id;
  const { startDate, endDate } = req.query;

  // Adjust SQL query to use startDate and endDate
  const sql = `
SELECT s.*, a.date AS attendanceDate, a.status AS attendanceStatus
FROM student s
LEFT JOIN (
  SELECT studentID, date, status
  FROM attendance
  WHERE date BETWEEN ? AND ?
) a ON s.studentID = a.studentID
WHERE s.teacher_id = ?

  `;

  db.query(sql, [startDate, endDate, teacherId], (err, results) => {
    if (err) {
      console.error('SQL error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to fetch filtered students' });
    }
    res.status(200).json({ status: 'success', data: results });
  });
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
