// utils/auth.js

export function registerUser(userData) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const userExists = users.some(user => user.email === userData.email);

  if (userExists) {
    return { success: false, message: 'Пользователь уже существует' };
  }

  users.push(userData);
  localStorage.setItem('users', JSON.stringify(users));
  return { success: true };
}

export function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(user => user.email === email && user.password === password);

  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, user };
  }

  return { success: false, message: 'Неверный email или пароль' };
}

export function logoutUser() {
  localStorage.removeItem('currentUser');
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}