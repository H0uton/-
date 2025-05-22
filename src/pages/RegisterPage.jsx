import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/auth';
import './RegisterPage.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const result = registerUser({ email, password });

    if (result.success) {
      navigate('/login');
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Зарегистрируйся!</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          maxLength={100}
          onChange={(e) => setEmail(e.target.value)}
        />
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
      {message && <p className="register-message">{message}</p>}
      <p className="register-link">
        Уже есть аккаунт? <Link to="/login">войти в аккаунт</Link>
      </p>
    </div>
  );
}

export default RegisterPage;