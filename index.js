const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const router = express.Router();

// Middleware to parse JSON bodies
app.use(express.json());
// Home route
router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

// Profile route
router.get('/profile', (req, res) => {
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading user data');
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Login route
router.post('/login', (req, res) => {
  console.log('Received body:', req.body); // Log the entire request body
  const { username, password } = req.body;

  console.log('Received username:', username); // Log received username
  console.log('Received password:', password);
  
  fs.readFile(path.join(__dirname, 'user.json'), 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading user.json:', err); // Log the error
          return res.status(500).send('Server Error');
      }

      const userData = JSON.parse(data);
      console.log('Stored username:', userData.username); // Log stored username
      console.log('Stored password:', userData.password); // Log stored password

      // Check username
      if (username !== userData.username) {
          return res.json({
              status: false,
              message: "User Name is invalid"
          });
      } 
      
      // Check password
      if (password !== userData.password) {
          return res.json({
              status: false,
              message: "Password is invalid"
          });
      }

      // If both username and password are valid
      return res.json({
          status: true,
          message: "User Is valid"
      });
  });
});

// Logout route
router.get('/logout/:username', (req, res) => {
  const { username } = req.params;
  res.send(`<b>${username} successfully logout.</b>`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

app.use('/', router);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log('Web Server is listening at port ' + PORT);
});