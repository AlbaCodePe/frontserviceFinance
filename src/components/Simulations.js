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
    const vanValue = cashFlows.reduce((acc, flow, index) => {
      return acc + flow.amount / Math.pow(1 + dr, flow.period);
    }, 0);

    // TIR Calculation (simple trial and error approach)
    const irr = (cashFlows, iterations, step) => {
      let rate = 0.1;

      const calculateNpv = (rate) => {
        return cashFlows.reduce((acc, flow) => {
          return acc + flow.amount / Math.pow(1 + rate, flow.period);
        }, 0);
      };

      for (let i = 0; i < iterations; i++) {
        let npv = calculateNpv(rate);

        if (Math.abs(npv) < 0.0001) return rate * 100;
        if (npv > 0) rate += step;
        else rate -= step;
      }

      return 'No Convergence';
    };

    // B/C Calculation
    const bcValue = cashFlows.reduce((acc, flow) => {
      if (flow.amount > 0) {
        return acc + flow.amount / Math.pow(1 + dr, flow.period);
      }
      return acc;
    }, 0) / -cashFlows[0].amount;

    // PRD Calculation
    let cumulativeCashFlow = 0;
    const prdValue = cashFlows.find(flow => {
      cumulativeCashFlow += flow.amount;
      return cumulativeCashFlow >= 0;
    })?.period;

    setVan(vanValue.toFixed(2));
    setTir(irr(cashFlows, 10000, 0.0001));
    setBc(bcValue.toFixed(2));
    setPrd(prdValue !== undefined ? prdValue : 'N/A');
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
        <h2 className="simulation-title">Simulaciones Financieras</h2>          <div className="form-group">
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
              <p className="simulation-paragrah"><strong>VAN (Valor Actual Neto):</strong> {van}</p>
              <p className="simulation-paragrah"><strong>TIR (Tasa Interna de Retorno):</strong> {tir}</p>
              <p className="simulation-paragrah"><strong>B/C (Beneficio/Costo):</strong> {bc}</p>
              <p className="simulation-paragrah"><strong>PRD (Periodo de Recuperación de la Inversión):</strong> {prd}</p>
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
