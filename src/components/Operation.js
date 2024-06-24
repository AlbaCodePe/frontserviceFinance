import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Operation.css';
import walletIcon from './images/logo.png'; 
import profileIcon from './images/profile.png'; 

const Operation = () => {
  const [currency, setCurrency] = useState('soles');
  const [creditValue, setCreditValue] = useState('');
  const [installments, setInstallments] = useState('');
  const [initialQuota, setInitialQuota] = useState('');
  const [rateType, setRateType] = useState('efectiva');
  const [capitalization, setCapitalization] = useState('Mensual');
  const [rateTime, setRateTime] = useState('');
  const [rateValue, setRateValue] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState('Mensual');
  const [gracePeriod, setGracePeriod] = useState('');
  const [gracePeriodsCount, setGracePeriodsCount] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  const handleCalculate = () => {
    let principal = parseFloat(creditValue);
    let interestRate = parseFloat(rateValue) / 100;
    let numPayments = parseInt(installments, 10);

    // Ejemplo de cálculo simple de interés compuesto
    let payment = (principal * interestRate) / (1 - Math.pow(1 + interestRate, -numPayments));
    setMonthlyPayment(payment.toFixed(2));
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="operation-container">
      <header className="operation-header">
        <div className="logo">
          <img src={walletIcon} alt="FlowFinance Logo" />
        </div>
        <nav className="main-nav">
          <Link to="/">Inicio</Link>
          <Link to="/operations">Realizar Operación</Link>
          <Link to="/simulations">Simulaciones</Link>
          <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </nav>
        <div className="user-icon">
          <img src={profileIcon} alt="User Profile" />
        </div>
      </header>
      <main className="operation-main">
        <div className="operation-content">
          <div className="form-column">
            <div className="form-group">
              <label>1. Seleccionar moneda:</label>
              <div>
                <label>
                  <input
                    type="radio"
                    value="soles"
                    checked={currency === 'soles'}
                    onChange={() => setCurrency('soles')}
                  />
                  Soles
                </label>
                <label>
                  <input
                    type="radio"
                    value="dolares"
                    checked={currency === 'dolares'}
                    onChange={() => setCurrency('dolares')}
                  />
                  Dólares
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>2. Valor del crédito:</label>
              <input
                type="number"
                value={creditValue}
                onChange={(e) => setCreditValue(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>3. Número de cuotas:</label>
              <input
                type="number"
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>4. Porcentaje de cuota inicial:</label>
              <input
                type="number"
                value={initialQuota}
                onChange={(e) => setInitialQuota(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>5. Seleccionar tipo de tasa:</label>
              <div>
                <label>
                  <input
                    type="radio"
                    value="efectiva"
                    checked={rateType === 'efectiva'}
                    onChange={() => setRateType('efectiva')}
                  />
                  Efectiva
                </label>
                <label>
                  <input
                    type="radio"
                    value="nominal"
                    checked={rateType === 'nominal'}
                    onChange={() => setRateType('nominal')}
                  />
                  Nominal
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>6. Seleccionar capitalización:</label>
              <select
                value={capitalization}
                onChange={(e) => setCapitalization(e.target.value)}
              >
                <option value="Diaria">Diaria</option>
                <option value="Semanal">Semanal</option>
                <option value="Quincenal">Quincenal</option>
                <option value="Mensual">Mensual</option>
                <option value="Bimestral">Bimestral</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Semestral">Semestral</option>
                <option value="Anual">Anual</option>
              </select>
            </div>
          </div>
          <div className="form-column">
            <div className="form-group">
              <label>7. Seleccionar tiempo de la tasa:</label>
              <input
                type="number"
                value={rateTime}
                onChange={(e) => setRateTime(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>8. Ingresa el valor de la tasa:</label>
              <input
                type="number"
                value={rateValue}
                onChange={(e) => setRateValue(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>9. Selecciona frecuencia de pago:</label>
              <select
                value={paymentFrequency}
                onChange={(e) => setPaymentFrequency(e.target.value)}
              >
                <option value="Diario">Diario</option>
                <option value="Semanal">Semanal</option>
                <option value="Quincenal">Quincenal</option>
                <option value="Mensual">Mensual</option>
                <option value="Bimestral">Bimestral</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Semestral">Semestral</option>
                <option value="Anual">Anual</option>
              </select>
            </div>
            <div className="form-group">
              <label>10. Seleccionar plazo de gracia:</label>
              <input
                type="number"
                value={gracePeriod}
                onChange={(e) => setGracePeriod(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>11. Número de períodos de gracia:</label>
              <input
                type="number"
                value={gracePeriodsCount}
                onChange={(e) => setGracePeriodsCount(e.target.value)}
              />
            </div>
            <button onClick={handleCalculate}>Calcular</button>
          </div>
          <div className="operation-details">
            <p>{monthlyPayment !== null ? `Pago mensual: ${monthlyPayment}` : 'Aquí se mostrarán los detalles de la operación'}</p>
          </div>
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2024 Smart Wallet. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Operation;
