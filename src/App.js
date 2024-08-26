import React, { useState } from 'react';
import './index.css'; // Make sure Tailwind CSS is imported

function InputField({ label, id, type, value, onChange, placeholder, step, min }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          name={id}
          type={type}
          required
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onClick={(e) => e.target.value = ''}
          step={step}
          min={min}
        />
      </div>
    </div>
  );
}

function PaymentSummary({ name, totalDue, advanceDeducted, finalPayment, balanceCarriedForward, onReset }) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Summary for {name}</h3>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <SummaryItem label="Total Payment Due" value={`₹ ${totalDue.toFixed(2)}`} />
          <SummaryItem label="Advance Deducted" value={`-₹ ${advanceDeducted.toFixed(2)}`} isNegative />
          <SummaryItem label="Final Payment" value={`₹ ${finalPayment.toFixed(2)}`} highlight />
          {balanceCarriedForward > 0 && (
            <SummaryItem label="Balance Carried Forward" value={`₹ ${balanceCarriedForward.toFixed(2)}`} isNegative />
          )}
        </dl>
      </div>
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
          onClick={onReset}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          « Calculate Another Payment
        </button>
      </div>
    </div>
  );
}

function SummaryItem({ label, value, isNegative, highlight }) {
  return (
    <div className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ${highlight ? 'bg-gray-50' : ''}`}>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className={`mt-1 text-sm ${isNegative ? 'text-red-600' : 'text-gray-900'} font-semibold sm:mt-0 sm:col-span-2`}>{value}</dd>
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
  const [showSummary, setShowSummary] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState(null);

  const handleCalculatePayment = () => {
    // Input validation
    if (!employeeName || !monthlyPayment || !joinDate || !paymentDate) {
      alert("Please fill in all required fields.");
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
    const daysWorked = Math.max(0, Math.floor((paymentDateObj - joinDateObj) / (1000 * 60 * 60 * 24)) + 1 - absentDays);

    // Calculate gross payment
    const grossPayment = (daysWorked / totalDaysInMonth) * parseFloat(monthlyPayment);

    // Add previous balance to gross payment
    const totalPaymentDue = grossPayment + parseFloat(previousBalance);

    // Calculate net payment after deducting advances
    const netPayment = totalPaymentDue - parseFloat(advanceTaken);

    // Determine if there's any balance carried forward
    const balanceCarriedForward = netPayment < 0 ? Math.abs(netPayment) : 0;

    setPaymentSummary({
      name: employeeName,
      totalDue: isNaN(totalPaymentDue) ? 0 : totalPaymentDue,
      advanceDeducted: isNaN(parseFloat(advanceTaken)) ? 0 : parseFloat(advanceTaken),
      finalPayment: isNaN(netPayment) ? 0 : Math.max(0, netPayment),
      balanceCarriedForward: isNaN(balanceCarriedForward) ? 0 : balanceCarriedForward
    });
    setShowSummary(true);
  };

  const resetCalculator = () => {
    setEmployeeName('');
    setMonthlyPayment('');
    setJoinDate('');
    setPaymentDate('');
    setAbsentDays('');
    setAdvanceTaken('');
    setPreviousBalance('');
    setShowSummary(false);
    setPaymentSummary(null);
  };

  if (showSummary && paymentSummary) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full">
          <PaymentSummary {...paymentSummary} onReset={resetCalculator} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 14h.01M9 11h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 font-inter whitespace-nowrap">
            Employee Payment Calculator
          </h2>
        </div>
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
