import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/auth';
import './RegisterPage.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg('');
    const res = await fetch('http://localhost:4000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      setMsg('Регистрация успешна!');
      navigate('/login');
    } else {
      setMsg('Ошибка: ' + (await res.json()).error);
    }
  };

  return (
    <div className="register-container">
      <h2>Зарегистрируйся!</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          marginBottom: 8,
        }}>
          <span
            style={{
              position: 'absolute',
              left: 14,
              color: '#b6c92f',
              fontSize: 20,
              pointerEvents: 'none',
              zIndex: 2
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <path d="M2.5 5.5l7.5 6 7.5-6" stroke="#b6c92f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="#b6c92f" strokeWidth="1.5"/>
            </svg>
          </span>
          <input
            type="email"
            placeholder="Email"
            required
            value={username}
            maxLength={100}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              paddingLeft: 44,
              paddingRight: 14,
              height: 48,
              borderRadius: 10,
              border: '1.5px solid #b6c92f',
              background: '#faffd6',
              fontSize: '1.08rem',
              color: '#1a5c3e',
              outline: 'none',
              transition: 'border 0.2s, background 0.2s',
              boxSizing: 'border-box',
              width: '100%',
            }}
            onFocus={e => e.target.style.background = '#fffde4'}
            onBlur={e => e.target.style.background = '#faffd6'}
          />
        </div>
        <input
          type="password"
          placeholder="Пароль"
          required
          value={password}
          maxLength={100}
          onChange={(e) => setPassword(e.target.value)}
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