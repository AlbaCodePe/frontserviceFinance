export const calculateConversion = ({ initialAmount, rate, days }) => {
    const result = initialAmount * Math.pow((1 + rate), days / 365);
    return result;
  };
  
  export const calculateDirectIndirect = ({ directCosts, indirectCosts }) => {
    const result = directCosts + indirectCosts;
    return result;
  };
  
  export const calculateSpecificVariables = ({ variable1, variable2, days }) => {
    const result = variable1 * Math.pow((1 + variable2), days / 365);
    return result;
  };
  
  export const calculateFundFlows = (initialAmount, rate, days, transactions) => {
    let amount = initialAmount;
    for (let i = 0; i < transactions.length; i++) {
      amount = amount * Math.pow((1 + rate), transactions[i].days / 365) + transactions[i].amount;
    }
    amount = amount * Math.pow((1 + rate), days / 365);
    return amount;
  };
  
  export const calculateLoan = ({ principal, rate, timeInYears, frequency }) => {
    const n = timeInYears * frequency;
    const i = rate / frequency;
    const installment = (principal * i * Math.pow((1 + i), n)) / (Math.pow((1 + i), n) - 1);
    return installment;
  };
  
  export const calculateIndicators = ({ cashFlows, discountRate }) => {
    let npv = 0;
    let bcr = 0;
    let irr = 0;
    let pp = 0;
  
    // Calcula el VAN
    cashFlows.forEach((flow, index) => {
      npv += flow / Math.pow((1 + discountRate), index + 1);
    });
  
    // Calcula el B/C
    const benefits = cashFlows.filter(flow => flow > 0).reduce((acc, flow, index) => acc + flow / Math.pow((1 + discountRate), index + 1), 0);
    const costs = cashFlows.filter(flow => flow < 0).reduce((acc, flow, index) => acc + Math.abs(flow) / Math.pow((1 + discountRate), index + 1), 0);
    bcr = benefits / costs;
  
    // Calcula el TIR (aproximación simple)
    const calculateIRR = (cashFlows, guess) => {
      let npvGuess = 0;
      cashFlows.forEach((flow, index) => {
        npvGuess += flow / Math.pow((1 + guess), index + 1);
      });
      return npvGuess;
    };
  
    let irrGuess = 0.1;
    let npvGuess = calculateIRR(cashFlows, irrGuess);
    while (npvGuess > 0) {
      irrGuess += 0.001;
      npvGuess = calculateIRR(cashFlows, irrGuess);
    }
    irr = irrGuess;
  
    // Calcula el PRD
    let accumulatedCashFlow = 0;
    for (let i = 0; i < cashFlows.length; i++) {
      accumulatedCashFlow += cashFlows[i];
      if (accumulatedCashFlow >= 0) {
        pp = i + 1;
        break;
      }
    }
  
    return { npv, irr, bcr, pp };
  };
  