const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs'); // ✅ Use bcryptjs instead of bcrypt

const app = express();
const users = []; // Temporary storage

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
  })
);

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10); // ✅ bcryptjs
  users.push({ username, password: hashedPassword });
  res.send('User registered successfully!');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(400).send('User not found');
  }

  const isMatch = bcrypt.compareSync(password, user.password); // ✅ bcryptjs

  if (!isMatch) {
    return res.status(400).send('Incorrect password');
  }

  req.session.user = user;
  res.send(`Welcome, ${username}!`);
});

// ✅ Use Render's PORT instead of hardcoded 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
