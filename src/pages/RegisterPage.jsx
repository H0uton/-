import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/auth';
import './RegisterPage.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setMsg('');
    const result = registerUser({ email: username, password });
    if (result.success) {
      setMsg('Регистрация успешна!');
      setTimeout(() => navigate('/login'), 1000);
    } else {
      setMsg('Ошибка: ' + result.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Зарегистрируйся!</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Логин"
          required
          value={username}
          maxLength={100}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: '13px 14px',
            border: '1.5px solid #cbe7b6',
            borderRadius: '8px',
            fontSize: '1.08rem',
            background: '#f3eedf',
            color: '#0d341c',
            outline: 'none',
            transition: 'border 0.2s',
            width: '100%',
            marginBottom: '20px',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}
          onFocus={e => e.target.style.background = '#f6fbe9'}
          onBlur={e => e.target.style.background = '#f3eedf'}
        />
        <input
          type="password"
          placeholder="Пароль"
          required
          value={password}
          maxLength={100}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: '13px 14px',
            border: '1.5px solid #cbe7b6',
            borderRadius: '8px',
            fontSize: '1.08rem',
            background: '#f3eedf',
            color: '#0d341c',
            outline: 'none',
            transition: 'border 0.2s',
            width: '100%',
            marginBottom: '20px',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}
          onFocus={e => e.target.style.background = '#f6fbe9'}
          onBlur={e => e.target.style.background = '#f3eedf'}
        />
        <button className="start-button" type="submit">Зарегистрироваться</button>
      </form>
      {msg && <p className="register-message">{msg}</p>}
      <p className="register-link">
        Уже есть аккаунт? <Link to="/login">войти в аккаунт</Link>
      </p>
    </div>
  );
}

export default RegisterPage;