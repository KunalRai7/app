import React, { useState } from 'react';
import './App.css';

function InputField({ label, id, type, value, onChange, placeholder, step, min }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

    // Open new window with results
    const resultWindow = window.open('', '_blank');
    resultWindow.document.write(`
      <html>
        <head>
          <title>Payment Summary</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            h1 { color: #b05a4e; }
            .summary { background-color: #f4f4f4; padding: 20px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>Payment Summary</h1>
          <div class="summary">
            <p><strong>Employee Name:</strong> ${employeeName}</p>
            <p><strong>Total Payment Due:</strong> $${totalPaymentDue.toFixed(2)}</p>
            <p><strong>Advance Deducted:</strong> $${advanceTakenNum.toFixed(2)}</p>
            <p><strong>Final Payment:</strong> $${Math.max(0, netPayment).toFixed(2)}</p>
            <p><strong>Balance Carried Forward:</strong> $${balanceCarriedForward.toFixed(2)}</p>
          </div>
        </body>
      </html>
    `);
    resultWindow.document.close();
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
    </div>
  );
}

export default App;
