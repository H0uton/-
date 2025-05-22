import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../utils/auth';

export default function UsersListPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(getAllUsers());
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>Список аккаунтов</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', padding: 8, textAlign: 'left' }}>Email</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: 8, textAlign: 'left' }}>Никнейм</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: 8, textAlign: 'left' }}>Пароль</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={3} style={{ padding: 12, color: '#888' }}>Нет зарегистрированных пользователей.</td>
            </tr>
          )}
          {users.map((u, i) => (
            <tr key={i}>
              <td style={{ padding: 8 }}>{u.email}</td>
              <td style={{ padding: 8 }}>{u.nickname || '-'}</td>
              <td style={{ padding: 8 }}>{u.password}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
