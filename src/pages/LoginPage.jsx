import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../utils/auth';
import './LoginPage.css';

function LoginPage() {
  const [loginType, setLoginType] = useState('email'); // 'email' or 'nickname'
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    let result;
    if (loginType === 'email') {
      result = loginUser(email, password);
    } else {
      // Поиск пользователя по nickname
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.nickname === nickname && u.password === password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        result = { success: true, user };
      } else {
        result = { success: false, message: 'Неверный никнейм или пароль' };
      }
    }

    if (result.success) {
      navigate('/profile');
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Вход</h2>
      <div className="login-type-switch">
        <button
          type="button"
          className={loginType === 'email' ? 'login-type-btn active' : 'login-type-btn'}
          onClick={() => setLoginType('email')}
        >
          По Email
        </button>
        <button
          type="button"
          className={loginType === 'nickname' ? 'login-type-btn active' : 'login-type-btn'}
          onClick={() => setLoginType('nickname')}
        >
          По никнейму
        </button>
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        {loginType === 'email' ? (
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            maxLength={100}
            onChange={(e) => setEmail(e.target.value)}
          />
        ) : (
          <input
            type="text"
            placeholder="Никнейм"
            required
            value={nickname}
            maxLength={32}
            onChange={(e) => setNickname(e.target.value)}
          />
        )}
        <input
          type="password"
          placeholder="Пароль"
          required
          value={password}
          maxLength={100}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-btn" type="submit">Войти</button>
      </form>
      {message && <p className="login-message">{message}</p>}
      <p className="login-link">
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
}

export default LoginPage;