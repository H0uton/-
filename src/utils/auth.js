// utils/auth.js

export function registerUser(userData) {
  return fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  }).then(res => res.json());
}

export function loginUser(email, password) {
  return fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(res => res.json());
}

export function logoutUser() {
  localStorage.removeItem('currentUser');
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

// Получить всех пользователей (логины и пароли)
export function getAllUsers() {
  return fetch(`${import.meta.env.VITE_API_URL}/api/users`).then(res => res.json());
}

export function isAdmin(user) {
  // Замените email на свой
  return user && user.email === 'admin@example.com';
}
export function isAdmin(user) {
  // Замените email на свой
  return user && user.email === 'admin@example.com';
}
