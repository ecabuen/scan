const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'scan'
});

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected...');
});

// Register endpoint
app.post('/register', (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  console.log('Request body:', req.body); // Log the request body

  const hashedPassword = bcrypt.hashSync(password, 8);

  const sql = 'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
  db.query(sql, [firstname, lastname, email, hashedPassword], (err, result) => {
    if (err) {
      console.error('SQL error:', err); // Log the SQL error
      return res.status(500).send('Server error');
    }
    res.status(201).send('User registered');
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).send('Server error');
    }
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Invalid password');
    }

    res.status(200).send('Login successful');
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
