import React, { useState } from 'react';
import { calculateConversion, calculateDirectIndirect, calculateSpecificVariables, calculateFundFlows, calculateLoan, calculateIndicators } from '../components/utils/financialCalculations';
import './gestion.css';

const Gestion = () => {
  const [inputs, setInputs] = useState({
    initialAmount: '',
    rate: '',
    days: '',
    directCosts: '',
    indirectCosts: '',
    variable1: '',
    variable2: '',
    timeInYears: '',
    frequency: ''
  });
  const [result, setResult] = useState(null);
  const [fundFlows, setFundFlows] = useState([{ amount: '', days: '' }]);
  const [indicators, setIndicators] = useState(null);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleAddFundFlow = () => {
    setFundFlows([...fundFlows, { amount: '', days: '' }]);
  };

  const handleFundFlowChange = (index, field, value) => {
    const newFundFlows = [...fundFlows];
    newFundFlows[index][field] = value;
    setFundFlows(newFundFlows);
  };

  const handleCalculate = (type) => {
    switch (type) {
      case 'conversion':
        const conversionResult = calculateConversion(inputs);
        setResult(conversionResult);
        break;
      case 'directIndirect':
        const directIndirectResult = calculateDirectIndirect(inputs);
        setResult(directIndirectResult);
        break;
      case 'specificVariables':
        const specificVariablesResult = calculateSpecificVariables(inputs);
        setResult(specificVariablesResult);
        break;
      case 'fundFlows':
        const fundFlowsResult = calculateFundFlows(inputs.initialAmount, inputs.rate, inputs.days, fundFlows);
        setResult(fundFlowsResult);
        break;
      case 'loan':
        const loanResult = calculateLoan(inputs);
        setResult(loanResult);
        break;
      case 'indicators':
        const cashFlows = fundFlows.map(flow => parseFloat(flow.amount));
        const indicatorsResult = calculateIndicators({ cashFlows, discountRate: parseFloat(inputs.rate) });
        setIndicators(indicatorsResult);
        break;
      default:
        break;
    }
  };

  return (
    <div className="gestion-container">
      <header className="gestion-header">
        <h2>Calculadora Financiera</h2>
      </header>
      <div className="gestion-content">
        <div className="gestion-inputs">
          <label>Capital inicial:</label>
          <input type="number" name="initialAmount" value={inputs.initialAmount} onChange={handleInputChange} />

          <label>Tasa de interés (%):</label>
          <input type="number" name="rate" value={inputs.rate} onChange={handleInputChange} />

          <label>Días:</label>
          <input type="number" name="days" value={inputs.days} onChange={handleInputChange} />

          <label>Costos directos:</label>
          <input type="number" name="directCosts" value={inputs.directCosts} onChange={handleInputChange} />

          <label>Costos indirectos:</label>
          <input type="number" name="indirectCosts" value={inputs.indirectCosts} onChange={handleInputChange} />

          <label>Variable 1:</label>
          <input type="number" name="variable1" value={inputs.variable1} onChange={handleInputChange} />

          <label>Variable 2:</label>
          <input type="number" name="variable2" value={inputs.variable2} onChange={handleInputChange} />

          <label>Tiempo en años:</label>
          <input type="number" name="timeInYears" value={inputs.timeInYears} onChange={handleInputChange} />

          <label>Frecuencia de pago:</label>
          <input type="number" name="frequency" value={inputs.frequency} onChange={handleInputChange} />

          {fundFlows.map((flow, index) => (
            <div key={index} className="fund-flow">
              <label>Flujo de fondos {index + 1}:</label>
              <input type="number" value={flow.amount} onChange={(e) => handleFundFlowChange(index, 'amount', e.target.value)} />
              <label>Días:</label>
              <input type="number" value={flow.days} onChange={(e) => handleFundFlowChange(index, 'days', e.target.value)} />
            </div>
          ))}

          <button onClick={handleAddFundFlow}>Añadir Flujo de Fondos</button>
        </div>
        <div className="gestion-buttons">
          <button onClick={() => handleCalculate('conversion')}>Calcular Conversión</button>
          <button onClick={() => handleCalculate('directIndirect')}>Calcular Directo/Indirecto</button>
          <button onClick={() => handleCalculate('specificVariables')}>Calcular Variables Específicas</button>
          <button onClick={() => handleCalculate('fundFlows')}>Calcular Flujos de Fondos</button>
          <button onClick={() => handleCalculate('loan')}>Calcular Préstamo</button>
          <button onClick={() => handleCalculate('indicators')}>Calcular Indicadores</button>
        </div>
        <div className="gestion-result">
          {result && <p>Resultado: {result}</p>}
          {indicators && (
            <div>
              <p>VAN: {indicators.npv}</p>
              <p>TIR: {indicators.irr}</p>
              <p>B/C: {indicators.bcr}</p>
              <p>PRD: {indicators.pp}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gestion;
