import React, { useEffect, useState } from 'react';
import { getAllUsers, getCurrentUser, isAdmin } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function UsersListPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!isAdmin(currentUser)) {
      navigate('/');
      return;
    }
    setUsers(getAllUsers());
  }, [currentUser, navigate]);

  if (!isAdmin(currentUser)) {
    return <div style={{ textAlign: 'center', marginTop: 40, color: '#e87d56' }}>Доступ запрещён</div>;
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto' }}>
      <h2>Список аккаунтов</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Аватар</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Email/Логин</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Никнейм</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Пароль</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: 12, color: '#888' }}>Нет зарегистрированных пользователей.</td>
            </tr>
          )}
          {users.map((u, i) => (
            <tr key={i}>
              <td style={{ padding: 8 }}>
                {u.avatar
                  ? <img src={u.avatar} alt="avatar" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                  : <span style={{ color: '#bbb' }}>—</span>
                }
              </td>
              <td style={{ padding: 8 }}>{u.email || u.username || '-'}</td>
              <td style={{ padding: 8 }}>{u.nickname || '-'}</td>
              <td style={{ padding: 8 }}>{u.password}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
