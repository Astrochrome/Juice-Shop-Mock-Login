const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());
app.use(express.static('.'));

// Initialize an in-memory SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT, password TEXT)");
  db.run("INSERT INTO users (email, password) VALUES ('admin@juice-sh.op', 'SuperSecretAdminPassword123!')");
});

// SECURED LOGIN ROUTE
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Fields missing." });
  }

  // SECURED: Using parameterized queries prevents SQL Injection
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  
  db.get(query, [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Database error." });
    }
    
    if (row) {
      return res.status(200).json({ message: `Success! Authenticated as ${email}.` });
    } else {
      return res.status(401).json({ message: "Invalid email or password." });
    }
  });
});

// SECURE REGISTRATION ROUTE
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Fields missing." });
  }
  if (!email.includes('@')) {
    return res.status(400).json({ message: "A valid email must contain a '@'." });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  const stmt = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
  stmt.run([email, password], function(err) {
    if (err) {
      return res.status(500).json({ message: "Registration failed." });
    }
    return res.status(201).json({ message: "Account created successfully! Please log in." });
  });
  stmt.finalize();
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
  console.log('Test SQLi on the Login form using the admin email: admin@juice-sh.op');
});