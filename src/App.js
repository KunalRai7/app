import React, { useState } from 'react';
import './App.css';

function InputField({ label, id, type, value, onChange, placeholder, step, min }) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        step={step}
        min={min}
      />
    </div>
  );
}

function App() {
  const [employeeName, setEmployeeName] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [absentDays, setAbsentDays] = useState('');
  const [advanceTaken, setAdvanceTaken] = useState('');
  const [previousBalance, setPreviousBalance] = useState('');
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const handleCalculatePayment = () => {
    const monthlyPaymentNum = parseFloat(monthlyPayment);
    const absentDaysNum = parseInt(absentDays) || 0;
    const advanceTakenNum = parseFloat(advanceTaken) || 0;
    const previousBalanceNum = parseFloat(previousBalance) || 0;

    // Input validation
    if (!employeeName || isNaN(monthlyPaymentNum) || !joinDate || !paymentDate) {
      alert("Please fill in all required fields with valid values.");
      return;
    }

    const joinDateObj = new Date(joinDate);
    const paymentDateObj = new Date(paymentDate);

    // Validate dates
    if (paymentDateObj < joinDateObj) {
      alert("Payment date cannot be earlier than join date.");
      return;
    }

    const totalDaysInMonth = 30; // Assuming 30 days per month for simplicity

    // Calculate days worked
    const daysWorked = Math.max(0, Math.floor((paymentDateObj - joinDateObj) / (1000 * 60 * 60 * 24)) + 1 - absentDaysNum);

    // Calculate gross payment
    const grossPayment = (daysWorked / totalDaysInMonth) * monthlyPaymentNum;

    // Add previous balance to gross payment
    const totalPaymentDue = grossPayment + previousBalanceNum;

    // Calculate net payment after deducting advances
    const netPayment = totalPaymentDue - advanceTakenNum;

    // Determine if there's any balance carried forward
    const balanceCarriedForward = netPayment < 0 ? Math.abs(netPayment) : 0;

    setPaymentSummary({
      name: employeeName,
      totalDue: isNaN(totalPaymentDue) ? 0 : totalPaymentDue,
      advanceDeducted: isNaN(advanceTakenNum) ? 0 : advanceTakenNum,
      finalPayment: isNaN(netPayment) ? 0 : Math.max(0, netPayment),
      balanceCarriedForward: isNaN(balanceCarriedForward) ? 0 : balanceCarriedForward
    });
    setShowSummary(true);
  };

  return (
    <div className="App">
      <div className="calculator">
        <h1>Employee Payment Calculator</h1>
        <form className="mt-8 space-y-6">
          <InputField label="Employee Name" id="employeeName" type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder="Enter employee name" />
          <InputField label="Monthly Payment" id="monthlyPayment" type="number" value={monthlyPayment} onChange={(e) => setMonthlyPayment(e.target.value)} placeholder="Enter monthly payment" step="0.01" min="0" />
          <InputField label="Join Date" id="joinDate" type="date" value={joinDate} onChange={(e) => setJoinDate(e.target.value)} />
          <InputField label="Payment Date" id="paymentDate" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
          <InputField label="Absent Days" id="absentDays" type="number" value={absentDays} onChange={(e) => setAbsentDays(e.target.value)} step="1" min="0" />
          <InputField label="Advance Taken" id="advanceTaken" type="number" value={advanceTaken} onChange={(e) => setAdvanceTaken(e.target.value)} step="0.01" min="0" />
          <InputField label="Previous Balance" id="previousBalance" type="number" value={previousBalance} onChange={(e) => setPreviousBalance(e.target.value)} step="0.01" />
          <div>
            <button
              type="button"
              onClick={handleCalculatePayment}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Calculate Payment
            </button>
          </div>
        </form>
      </div>
      {showSummary && paymentSummary && (
        <div className="payment-summary">
          <h1>Payment Summary</h1>
          <p>Employee Name: {paymentSummary.name}</p>
          <p>Total Payment Due: ${paymentSummary.totalDue.toFixed(2)}</p>
          <p>Advance Deducted: ${paymentSummary.advanceDeducted.toFixed(2)}</p>
          <p>Final Payment: ${paymentSummary.finalPayment.toFixed(2)}</p>
          <p>Balance Carried Forward: ${paymentSummary.balanceCarriedForward.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default App;
