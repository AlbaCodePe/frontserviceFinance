export const calculateConversion = ({ initialAmount, rate, days }) => {
  try {
    const result = initialAmount * Math.pow((1 + rate), days / 365);
    return result;
  } catch (error) {
    console.error("Error en calcular conversión:", error);
    return null;
  }
};

export const calculateDirectIndirect = ({ directCosts, indirectCosts }) => {
  try {
    const result = directCosts + indirectCosts;
    return result;
  } catch (error) {
    console.error("Error en calcular costos directos e indirectos:", error);
    return null;
  }
};

export const calculateSpecificVariables = ({ variable1, variable2, days }) => {
  try {
    const result = variable1 * Math.pow((1 + variable2), days / 365);
    return result;
  } catch (error) {
    console.error("Error en calcular variables específicas:", error);
    return null;
  }
};

export const calculateFundFlows = (initialAmount, rate, days, transactions) => {
  try {
    let amount = initialAmount;
    for (let i = 0; i < transactions.length; i++) {
      amount = amount * Math.pow((1 + rate), transactions[i].days / 365) + transactions[i].amount;
    }
    amount = amount * Math.pow((1 + rate), days / 365);
    return amount;
  } catch (error) {
    console.error("Error en calcular flujos de fondos:", error);
    return null;
  }
};

export const calculateLoan = ({ principal, rate, timeInYears, frequency }) => {
  try {
    const n = timeInYears * frequency;
    const i = rate / frequency;
    const installment = (principal * i * Math.pow((1 + i), n)) / (Math.pow((1 + i), n) - 1);
    return installment;
  } catch (error) {
    console.error("Error en calcular préstamo:", error);
    return null;
  }
};

export const calculateAvailableAmount = ({ initialCapital, interestRate, closingDay, cashFlows }) => {
  let availableAmount = initialCapital;
  const daysInYear = 365;

  cashFlows.forEach(flow => {
    if (flow.day <= closingDay) {
      availableAmount = availableAmount * Math.pow((1 + interestRate), (flow.day / daysInYear)) + flow.amount;
    }
  });

  availableAmount = availableAmount * Math.pow((1 + interestRate), ((closingDay - cashFlows[cashFlows.length - 1].day) / daysInYear));

  return availableAmount;
};

export const calculateIndicators = ({ cashFlows, discountRate }) => {
  let npv = 0;
  let bcr = 0;
  let irr = 0;
  let pp = 0;
  const daysInYear = 365;

  // Calcula el VAN
  cashFlows.forEach((flow) => {
    npv += flow.amount / Math.pow((1 + discountRate), flow.day / daysInYear);
  });

  // Calcula el B/C
  const benefits = cashFlows.filter(flow => flow.amount > 0).reduce((acc, flow) => acc + flow.amount / Math.pow((1 + discountRate), flow.day / daysInYear), 0);
  const costs = cashFlows.filter(flow => flow.amount < 0).reduce((acc, flow) => acc + Math.abs(flow.amount) / Math.pow((1 + discountRate), flow.day / daysInYear), 0);
  bcr = benefits / costs;

  // Calcula el TIR (aproximación simple)
  const calculateIRR = (cashFlows, guess) => {
    let npvGuess = 0;
    cashFlows.forEach((flow) => {
      npvGuess += flow.amount / Math.pow((1 + guess), flow.day / daysInYear);
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
    accumulatedCashFlow += cashFlows[i].amount;
    if (accumulatedCashFlow >= 0) {
      pp = cashFlows[i].day;
      break;
    }
  }

  return { npv, irr, bcr, pp };
};

export const calculateDiscountedValue = (nominalValue, days, annualRate, capitalizationPeriods) => {
  const periods = 360 / capitalizationPeriods;
  const n = days / capitalizationPeriods;
  const effectiveRate = Math.pow((1 + annualRate / periods), n) - 1;
  const discountRate = effectiveRate / (1 + effectiveRate);
  const discount = nominalValue * discountRate;
  const netValue = nominalValue - discount;
  return { netValue, discount };
};

export const calculateReceivedValue = (netValue, initialCosts, retention) => {
  const receivedValue = netValue - initialCosts - retention;
  return receivedValue;
};

export const calculateFinalValue = (nominalValue, finalCosts, retention) => {
  const finalValue = nominalValue + finalCosts - retention;
  return finalValue;
};

export const calculateTCEA = (finalValue, receivedValue, days) => {
  const tcea = Math.pow((finalValue / receivedValue), (360 / days)) - 1;
  return tcea * 100;  // Convert to percentage
};

export const calculateDelayedValue = (nominalValue, finalCostsWithDelay, interestDelay, retention) => {
  const delayedValue = nominalValue + finalCostsWithDelay + interestDelay - retention;
  return delayedValue;
};



// Existing functions...
export const calculateLoanAmount = (savings, expenses) => {
  const totalExpenses = expenses.reduce((total, expense) => total + expense, 0);
  return totalExpenses - savings;
};

export const calculateMonthlyPayment = (loanAmount, annualInterestRate, loanTermYears) => {
  const months = loanTermYears * 12;
  const monthlyInterestRate = Math.pow(1 + annualInterestRate / 180, 30) - 1;
  const numerator = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months);
  const denominator = Math.pow(1 + monthlyInterestRate, months) - 1;
  return numerator / denominator;
};

export const calculatePrepaymentAmount = (monthlyPayment, monthlyInterestRate, remainingPayments) => {
  return monthlyPayment + monthlyPayment * (Math.pow(1 + monthlyInterestRate, remainingPayments - 1) - 1) / (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, remainingPayments - 1));
};

