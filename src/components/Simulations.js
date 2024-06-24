import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Simulations.css';
import walletIcon from './images/logo.png'; 
import profileIcon from './images/profile.png'; 

const Simulations = () => {
  const [cashFlows, setCashFlows] = useState([]);
  const [discountRate, setDiscountRate] = useState('');
  const [van, setVan] = useState(null);
  const [tir, setTir] = useState(null);
  const [bc, setBc] = useState(null);
  const [prd, setPrd] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAddCashFlow = () => {
    setCashFlows([...cashFlows, { period: cashFlows.length + 1, amount: '' }]);
  };

  const handleCashFlowChange = (index, value) => {
    const newCashFlows = [...cashFlows];
    newCashFlows[index].amount = parseFloat(value);
    setCashFlows(newCashFlows);
  };

  const calculateIndicators = () => {
    const dr = parseFloat(discountRate) / 100;

    // VAN Calculation
    const vanValue = cashFlows.reduce((acc, flow) => {
      return acc + flow.amount / Math.pow(1 + dr, flow.period);
    }, 0);

    // TIR Calculation using Newton-Raphson method
    const calculateIRR = (cashFlows, guess = 0.1) => {
      const maxIter = 1000;
      const tol = 0.0001;

      const f = (r) => cashFlows.reduce((acc, flow) => acc + flow.amount / Math.pow(1 + r, flow.period), 0);
      const fPrime = (r) => cashFlows.reduce((acc, flow) => acc - (flow.period * flow.amount) / Math.pow(1 + r, flow.period + 1), 0);

      let rate = guess;
      for (let i = 0; i < maxIter; i++) {
        const newRate = rate - f(rate) / fPrime(rate);
        if (Math.abs(newRate - rate) < tol) {
          return newRate * 100;
        }
        rate = newRate;
      }
      return 'No Convergence';
    };

    // B/C Calculation
    const benefits = cashFlows.filter(flow => flow.amount > 0).reduce((acc, flow) => acc + flow.amount / Math.pow(1 + dr, flow.period), 0);
    const costs = Math.abs(cashFlows.filter(flow => flow.amount < 0).reduce((acc, flow) => acc + flow.amount / Math.pow(1 + dr, flow.period), 0));
    const bcValue = benefits / costs;

    // PRD Calculation
    let cumulativeCashFlow = 0;
    let prdValue = null;
    for (let i = 0; i < cashFlows.length; i++) {
      cumulativeCashFlow += cashFlows[i].amount / Math.pow(1 + dr, cashFlows[i].period);
      if (cumulativeCashFlow >= 0) {
        prdValue = cashFlows[i].period;
        break;
      }
    }
    prdValue = prdValue !== null ? prdValue : 'N/A';

    setVan(vanValue.toFixed(2));
    setTir(calculateIRR(cashFlows).toFixed(2));
    setBc(bcValue.toFixed(2));
    setPrd(prdValue);
  };

  return (
    <div className="simulations-container">
      <header className="simulations-header">
        <div className="logo">
          <img src={walletIcon} alt="FlowFinance Logo" />
        </div>
        <nav className="main-nav">
          <Link to="/">Inicio</Link>
          <Link to="/operations">Realizar Operación</Link>
          <Link to="/gestion">Gestiones</Link>
          <Link to="/simulations">Simulaciones</Link>
          <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </nav>
        <div className="user-icon">
          <img src={profileIcon} alt="User Profile" />
        </div>
      </header>
      <main className="simulations-main">
        <div className="simulations-content">
          <h2 className="simulation-title">Simulaciones Financieras</h2>
          <div className="form-group">
            <label>Tasa de descuento (%):</label>
            <input
              type="number"
              value={discountRate}
              onChange={(e) => setDiscountRate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Flujos de fondos:</label>
            {cashFlows.map((flow, index) => (
              <div key={index} className="cash-flow-group">
                <label>Periodo {flow.period}:</label>
                <input
                  type="number"
                  value={flow.amount}
                  onChange={(e) => handleCashFlowChange(index, e.target.value)}
                />
              </div>
            ))}
            <button onClick={handleAddCashFlow} className="add-cash-flow-button">Añadir Flujo de Fondos</button>
          </div>
          <button onClick={calculateIndicators} className="calculate-button">Calcular Indicadores</button>
          {van !== null && (
            <div className="results">
              <p className="simulation-paragraph"><strong>VAN (Valor Actual Neto):</strong> {van}</p>
              <p className="simulation-paragraph"><strong>TIR (Tasa Interna de Retorno):</strong> {tir}</p>
              <p className="simulation-paragraph"><strong>B/C (Beneficio/Costo):</strong> {bc}</p>
              <p className="simulation-paragraph"><strong>PRD (Periodo de Recuperación de la Inversión):</strong> {prd}</p>
            </div>
          )}
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2024 Smart Wallet. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Simulations;
