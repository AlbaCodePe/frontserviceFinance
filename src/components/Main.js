import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importar jwtDecode como exportación nombrada
import './Main.css';
import walletIcon from './images/logo.png'; 
import profileIcon from './images/profile.png'; 
import welcomeImage from './images/image.png'; 

const Main = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserName(decodedToken.user.name); // Suponiendo que el nombre del usuario está en decodedToken.user.name
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="main-container">
      <header className="main-header">
        <div className="logo">
          <img src={walletIcon} alt="Logo" />
        </div>
        <nav className="main-nav">
          <Link to="/">Inicio</Link>
          <Link to="/operations">Realizar Operación</Link>
          <Link to="/gestion">Gestiones</Link>
          <Link to="/simulations">Simulaciones</Link>
          <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </nav>
        <div className="profile">
          <Link to="/profile">
            <img src={profileIcon} alt="Profile" className="profile-icon" />
          </Link>
        </div>
      </header>
      <main className="main-content">
        <div className="welcome-card">
          <h2>Hola {userName}, Bienvenido a Smart Wallet</h2>
          <img src={welcomeImage} alt="Welcome" className="welcome-image" />
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2024 Smart Wallet. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Main;
