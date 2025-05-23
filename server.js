const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 4000;
const USERS_FILE = './users.json';

app.use(cors());
app.use(express.json());

// Вспомогательные функции
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Регистрация пользователя
app.post('/api/register', (req, res) => {
  const { email, password, nickname, avatar } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const users = loadUsers();
  if (users.find(u => u.email === email || (nickname && u.nickname === nickname))) {
    return res.status(409).json({ error: 'User exists' });
  }
  users.push({ email, password, nickname: nickname || '', avatar: avatar || '' });
  saveUsers(users);
  res.json({ success: true });
});

// Вход пользователя
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ success: true, user });
});

// Получить всех пользователей
app.get('/api/users', (req, res) => {
  const users = loadUsers();
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
