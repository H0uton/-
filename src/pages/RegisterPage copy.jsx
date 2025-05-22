import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/auth';

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
  
    <div>
      <section>
           <h2>Готовы начать?</h2>
        <button className="start-button">Зарегистрироваться</button>
        <p>или <a href="/login">войти</a>, если у вас уже есть аккаунт.</p>
      </section>
      
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          maxLength={100}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br/>
        <input
          type="password"
          placeholder="Пароль"
          required
          value={password}
          maxLength={100}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br/>
        <button type="submit">Зарегистрироваться</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}

export default RegisterPage;