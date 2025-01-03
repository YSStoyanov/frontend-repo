import React, { useState } from 'react';
import './AdminLogin.css';

const AdminLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Проверка за валидни потребителско име и парола
    if (username === 'admin' && password === 'admin123') {
      onLoginSuccess();
    } else {
      setError('Невалидно потребителско име или парола');
    }
  };

  return (
    <div className="admin-login">
      <h2>Вход за администратор</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Потребителско име"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Парола"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Вход</button>
      </form>
    </div>
  );
};

export default AdminLogin;