import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { calculateConversion, calculateDirectIndirect, calculateSpecificVariables, calculateFundFlows, calculateAvailableAmount, calculateIndicators, calculateDiscountedValue, calculateReceivedValue, calculateFinalValue, calculateTCEA, calculateDelayedValue, calculateLoanAmount, calculateMonthlyPayment, calculatePrepaymentAmount } from '../components/utils/financialCalculations';
import './gestion.css';
import walletIcon from './images/logo.png'; 
import profileIcon from './images/profile.png';

const Gestion = () => {
  const [formData, setFormData] = useState({
    initialCapital: '',
    interestRate: '',
    days: '',
    directCosts: '',
    indirectCosts: '',
    variable1: '',
    variable2: '',
    years: '',
    paymentFrequency: '',
    fundFlowAmount: '',
    fundFlowDay: '',
    closingDay: '',
    nominalRate: '',  // TNA
    delayDays: '',    // Días de mora
    savings: '',      // Ahorros
    expenses: '',     // Gastos
    loanTerm: '',     // Tiempo del préstamo (años)
    remainingPayments: '', // Cuotas restantes
  });

  const [fundFlows, setFundFlows] = useState([]);
  const [indicators, setIndicators] = useState(null);
  const [availableAmount, setAvailableAmount] = useState(null);
  const [results, setResults] = useState({
    netValue: null,
    receivedValue: null,
    finalValue: null,
    tcea: null,
    delayedValue: null,
    delayedTCEA: null,
    loanAmount: null,
    monthlyPayment: null,
    prepaymentAmount: null,
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddFundFlow = () => {
    if (formData.fundFlowAmount && formData.fundFlowDay) {
      setFundFlows([...fundFlows, { day: parseFloat(formData.fundFlowDay), amount: parseFloat(formData.fundFlowAmount) }]);
      setFormData({ ...formData, fundFlowAmount: '', fundFlowDay: '' });
    }
  };

  const handleCalculateIndicators = () => {
    const result = calculateIndicators({
      cashFlows: fundFlows,
      discountRate: parseFloat(formData.interestRate) / 100
    });
    setIndicators(result);
  };

  const handleCalculateAvailableAmount = () => {
    const amount = calculateAvailableAmount({
      initialCapital: parseFloat(formData.initialCapital),
      interestRate: parseFloat(formData.interestRate) / 100,
      closingDay: parseFloat(formData.closingDay),
      cashFlows: fundFlows,
    });
    setAvailableAmount(amount);
  };

  const handleCalculate = () => {
    const nominalValue = parseFloat(formData.initialCapital);
    const annualRate = parseFloat(formData.nominalRate) / 100;
    const days = parseFloat(formData.days);
    const retention = nominalValue * 0.16;
    const initialCosts = 75 + 5 + (nominalValue * 0.0025);
    const finalCosts = 30 + 7;

    const { netValue, discount } = calculateDiscountedValue(nominalValue, days, annualRate, 30);
    const receivedValue = calculateReceivedValue(netValue, initialCosts, retention);
    const finalValue = calculateFinalValue(nominalValue, finalCosts, retention);
    const tcea = calculateTCEA(finalValue, receivedValue, days);

    // Calcular valores en caso de mora
    const delayDays = parseFloat(formData.delayDays);
    const additionalCosts = 80 + 70 + 62.35;  // Protesto + Comisión por pago tardío + Icomp
    const interestDelay = nominalValue * (Math.pow(1 + 0.492537313, delayDays / 120) - 1);
    const delayedValue = calculateDelayedValue(nominalValue, finalCosts + additionalCosts, interestDelay, retention);
    const delayedTCEA = calculateTCEA(delayedValue, receivedValue, days + delayDays);

    setResults({
      netValue,
      receivedValue,
      finalValue,
      tcea,
      delayedValue,
      delayedTCEA
    });
  };

  const handleCalculateLoan = () => {
    const savings = parseFloat(formData.savings);
    const expenses = formData.expenses.split(',').map(e => parseFloat(e));
    const loanAmount = calculateLoanAmount(savings, expenses);
    const monthlyPayment = calculateMonthlyPayment(loanAmount, parseFloat(formData.nominalRate) / 100, parseFloat(formData.loanTerm));
    const remainingPayments = parseFloat(formData.remainingPayments);
    const monthlyInterestRate = Math.pow(1 + parseFloat(formData.nominalRate) / 100 / 180, 30) - 1;
    const prepaymentAmount = calculatePrepaymentAmount(monthlyPayment, monthlyInterestRate, remainingPayments);

    setResults({
      ...results,
      loanAmount,
      monthlyPayment,
      prepaymentAmount
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="gestion-container">
      <header className="gestion-header">
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
        <div className="profile">
          <Link to="/profile">
            <img src={profileIcon} alt="Profile" className="profile-icon" />
          </Link>
        </div>
      </header>
      <main className="gestion-content">
        <h2>Calculadora Financiera</h2>
        <div className="gestion-inputs">
          <label>Valor Nominal (S/):</label>
          <input type="number" name="initialCapital" value={formData.initialCapital} onChange={handleInputChange} />
          <label>Tasa Nominal Anual (%):</label>
          <input type="number" name="nominalRate" value={formData.nominalRate} onChange={handleInputChange} />
          <label>Días:</label>
          <input type="number" name="days" value={formData.days} onChange={handleInputChange} />
          <label>Días de Mora:</label>
          <input type="number" name="delayDays" value={formData.delayDays} onChange={handleInputChange} />
          <label>Capital inicial:</label>
          <input type="number" name="initialCapital" value={formData.initialCapital} onChange={handleInputChange} />
          <label>Tasa de interés (%):</label>
          <input type="number" name="interestRate" value={formData.interestRate} onChange={handleInputChange} />
          <label>Días:</label>
          <input type="number" name="days" value={formData.days} onChange={handleInputChange} />
          <label>Costos directos:</label>
          <input type="number" name="directCosts" value={formData.directCosts} onChange={handleInputChange} />
          <label>Costos indirectos:</label>
          <input type="number" name="indirectCosts" value={formData.indirectCosts} onChange={handleInputChange} />
          <label>Tiempo en años:</label>
          <input type="number" name="years" value={formData.years} onChange={handleInputChange} />
          <label>Frecuencia de pago:</label>
          <input type="text" name="paymentFrequency" value={formData.paymentFrequency} onChange={handleInputChange} />
          <label>Flujo de fondos:</label>
          <input type="number" name="fundFlowAmount" value={formData.fundFlowAmount} onChange={handleInputChange} />
          <label>Día del flujo:</label>
          <input type="number" name="fundFlowDay" value={formData.fundFlowDay} onChange={handleInputChange} />
          <label>Día de cierre:</label>
          <input type="number" name="closingDay" value={formData.closingDay} onChange={handleInputChange} />
          <label>Ahorros (US$):</label>
          <input type="number" name="savings" value={formData.savings} onChange={handleInputChange} />
          <label>Gastos (US$, separados por comas):</label>
          <input type="text" name="expenses" value={formData.expenses} onChange={handleInputChange} />
          <label>Tiempo del préstamo (años):</label>
          <input type="number" name="loanTerm" value={formData.loanTerm} onChange={handleInputChange} />
          <label>Cuotas restantes:</label>
          <input type="number" name="remainingPayments" value={formData.remainingPayments} onChange={handleInputChange} />
        </div>
        <div className="gestion-buttons">
          <button onClick={handleAddFundFlow}>Añadir Flujo de Fondos</button>
          <button onClick={handleCalculateIndicators}>Calcular Indicadores</button>
          <button onClick={handleCalculateAvailableAmount}>Calcular Monto Disponible</button>
          <button onClick={handleCalculate}>Calcular Valor Completo (3)</button>
          <button onClick={handleCalculateLoan}>Calcular Prestamo (4)</button>
        </div>
        {indicators && (
          <div className="gestion-result">
            <p>VAN (Valor Actual Neto): {indicators.npv}</p>
            <p>TIR (Tasa Interna de Retorno): {indicators.irr}</p>
            <p>B/C (Beneficio/Costo): {indicators.bcr}</p>
            <p>PRD (Periodo de Recuperación Descontado): {indicators.pp}</p>
          </div>
        )}
        {availableAmount !== null && (
          <div className="gestion-result">
            <p>Monto Disponible al Cierre (Día {formData.closingDay}): {availableAmount}</p>
          </div>
        )}
        {results.netValue && (
          <div className="gestion-result">
            <p>Valor Neto del pagaré al momento del descuento: S/ {results.netValue.toFixed(2)}</p>
            <p>Monto recibido a la firma del pagaré: S/ {results.receivedValue.toFixed(2)}</p>
            <p>Monto a cancelar al vencimiento: S/ {results.finalValue.toFixed(2)}</p>
            <p>TCEA de la operación: {results.tcea.toFixed(7)}%</p>
            <p>Monto a cancelar {formData.delayDays} días después del vencimiento: S/ {results.delayedValue.toFixed(2)}</p>
            <p>TCEA de la operación incluyendo la mora: {results.delayedTCEA.toFixed(7)}%</p>
          </div>
        )}
        {results.loanAmount && (
          <div className="gestion-result">
            <p>Monto del Préstamo: US$ {results.loanAmount.toFixed(2)}</p>
            <p>Pago Mensual: US$ {results.monthlyPayment.toFixed(2)}</p>
            <p>Prepago con {formData.remainingPayments} cuotas restantes: US$ {results.prepaymentAmount.toFixed(2)}</p>
          </div>
        )}
      </main>
      <footer className="gestion-footer">
        <p>&copy; 2024 Smart Wallet. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Gestion;
