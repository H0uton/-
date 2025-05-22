import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../utils/auth';
import './Header.css';

function Header() {
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUser(getCurrentUser());
  }, [location.pathname]);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/register');
  };

  return (
    <header className="header">
      <div className="header-logo">
        Финансовый сад
      </div>
      <nav className="header-nav-center">
        {user ? (
          <>
            <Link
              to="/"
              className="header-link-main start-button header-anim"
              style={{
                background: 'linear-gradient(90deg, #e87d56 0%, #e87d56 100%)',
                color: '#fff',
                fontWeight: 700,
                border: 'none',
                borderRadius: 14,
                padding: '10px 32px',
                fontSize: '1.08rem',
                marginRight: 8,
                minWidth: 120,
                textAlign: 'center',
                transition: 'background 0.2s, color 0.2s, transform 0.15s',
                boxShadow: '0 2px 8px rgba(79,209,197,0.10)',
                textDecoration: 'none',
                letterSpacing: '0.5px',
                display: 'inline-block',
              }}
            >
              Главная
            </Link>
            <Link
              to="/profile"
              className="header-link-profile start-button header-anim"
              style={{
                background: 'linear-gradient(90deg, #e87d56 0%, #e87d56 100%)',
                color: '#fff',
                fontWeight: 700,
                border: 'none',
                borderRadius: 14,
                padding: '10px 32px',
                fontSize: '1.08rem',
                marginRight: 8,
                minWidth: 120,
                textAlign: 'center',
                transition: 'background 0.2s, color 0.2s, transform 0.15s',
                boxShadow: '0 2px 8px rgba(79,209,197,0.10)',
                textDecoration: 'none',
                letterSpacing: '0.5px',
                display: 'inline-block',
              }}
            >
              Профиль
            </Link>
            <button
              className="header-link-profile start-button header-anim"
              style={{
                background: 'linear-gradient(90deg, #e87d56 0%, #e87d56 100%)',
                color: '#fff',
                fontWeight: 700,
                border: 'none',
                borderRadius: 14,
                padding: '10px 32px',
                fontSize: '1.08rem',
                marginRight: 8,
                minWidth: 120,
                textAlign: 'center',
                transition: 'background 0.2s, color 0.2s, transform 0.15s',
                boxShadow: '0 2px 8px rgba(79,209,197,0.10)',
                letterSpacing: '0.5px',
                display: 'inline-block',
              }}
              onClick={handleLogout}
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="header-link-main">Вход</Link>
            <Link to="/register" className="header-link-profile">Регистрация</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;