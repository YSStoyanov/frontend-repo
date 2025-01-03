import React from 'react';
import './Header.css';
import logo from '../assets/kavarna-logo.png'; // Ensure this path is correct

const Header = ({ onAdminAccess }) => {
  return (
    <header className="header">
    <h1>Система за сигнали -</h1>
      <div className="header-logo">
        <img src={logo} alt="Каварна Лого" />
      </div>
      <h2>Община Каварна</h2>
      <button onClick={onAdminAccess} className="admin-btn">
        Администратор
      </button>
    </header>
  );
};

export default Header;