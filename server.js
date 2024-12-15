const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3001;

const secretKey = 'your_secret_key'; // Replace with your actual secret key

app.use(express.json());

// In-Memory User Data Storage
const users = [];

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// User Registration Route
app.post('/register', (req, res) => {
  const { username, password, email, phone } = req.body;
  if (username && password && email && phone) {
    users.push({ username, password, email, phone });
    res.status(201).send('User registered successfully');
  } else {
    res.status(400).send('Invalid input');
  }
});

// User Authentication Route
app.post('/authenticate', (req, res) => {
  const { username, password } = req.body;
  console.log(`Received: ${username}, ${password}`); // Logging request data
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    console.log(`Generated Token: ${token}`); // Logging generated token
    res.json({ message: 'Authentication successful', token });
  } else {
    console.log('Authentication failed'); // Logging failure
    res.status(401).send('Authentication failed');
  }
});

// Middleware to Verify Token with Logging
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token
  console.log(`Token received: ${token}`); // Log received token
  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.log(`Token verification error: ${err.message}`); // Log token error
        return res.status(401).send('Invalid token');
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    console.log('No token provided'); // Log no token
    return res.status(403).send('No token provided');
  }
};

// User Profile Route (Protected)
app.put('/profile', verifyToken, (req, res) => {
  const { username, newProfileData } = req.body;
  const user = users.find(user => user.username === username);
  if (user) {
    Object.assign(user, newProfileData);
    res.send('Profile updated successfully');
  } else {
    res.status(404).send('User not found');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
