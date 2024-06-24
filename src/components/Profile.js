import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importar jwtDecode como exportación nombrada
import { getUserDetails } from '../api';
import profileIcon from './images/profile.png'; // Importar imagen de perfil
import walletIcon from './images/logo.png'; 
import moment from 'moment'; // Importar moment.js

import './Profile.css';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token); // Usar jwt_decode
      fetchUserDetails(decodedToken.user.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserDetails = async (userId) => {
    try {
      const data = await getUserDetails(userId);
      if (data) {
        setUserDetails(data);
      } else {
        console.error('User not found');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <div className="profile-container">
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
        <div className="profile-card">
          <img src={profileIcon} alt="Profile" className="profile-image" />
          <h2>Profile</h2>
          <div className="profile-details">
            <p><strong>DNI:</strong> {userDetails.dni}</p>
            <p><strong>Full Name:</strong> {userDetails.fullName}</p>
            <p><strong>Birth Date:</strong> {moment(userDetails.birthDate).format('DD/MM/YYYY')}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Username:</strong> {userDetails.username}</p>
          </div>
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2024 Smart Wallet. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Profile;
