import React, { useState, useCallback, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ArrowLeft, DollarSign, PlusCircle, Trash2 } from 'lucide-react';

const expenseTypes = ['Medicines', 'Tests', 'Doctor Fees', 'Admit Fees', 'Other'];

const AddExpenseView = ({ onAddExpense, onBack }) => {
  const [newExpense, setNewExpense] = useState({
    type: '',
    otherType: '',
    amount: '',
    date: new Date(),
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((e) => {
    setNewExpense((prev) => ({ ...prev, type: e.target.value }));
  }, []);

  const handleDateChange = useCallback((date) => {
    setNewExpense((prev) => ({ ...prev, date: date || new Date() }));
  }, []);

  const handleAddExpense = useCallback(() => {
    if (!newExpense.type || !newExpense.amount || !newExpense.date) return;

    const expenseToAdd = {
      id: Date.now(),
      type: newExpense.type === 'Other' ? newExpense.otherType : newExpense.type,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date,
    };

    onAddExpense(expenseToAdd);

    // Reset form
    setNewExpense({
      type: '',
      otherType: '',
      amount: '',
      date: new Date(),
    });
  }, [newExpense, onAddExpense]);

  return (
    <div className="space-y-8">
      <button className="mb-6 flex items-center text-blue-600 hover:text-blue-800 text-lg" onClick={onBack}>
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Expenses
      </button>
      <h2 className="text-3xl font-semibold mb-6">Add New Expense</h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="expenseType" className="block text-lg mb-2">Expense Type</label>
          <select
            id="expenseType"
            name="type"
            value={newExpense.type}
            onChange={handleSelectChange}
            className="w-full text-lg py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select expense type</option>
            {expenseTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {newExpense.type === 'Other' && (
          <div>
            <label htmlFor="otherType" className="block text-lg mb-2">Specify Other Expense</label>
            <input
              id="otherType"
              name="otherType"
              type='text'
              value={newExpense.otherType}
              onChange={handleInputChange}
              placeholder="Enter expense type"
              className="w-full text-lg py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <label htmlFor="amount" className="block text-lg mb-2">Amount</label>
          <input
            id="amount"
            name="amount"
            type="number"
            value={newExpense.amount}
            onChange={handleInputChange}
            placeholder="Enter amount"
            className="w-full text-lg py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-lg mb-2">Date</label>
          <DatePicker
            selected={newExpense.date}
            onChange={handleDateChange}
            maxDate={new Date()}
            className="w-full text-lg py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          onClick={handleAddExpense} 
          className="w-full text-lg py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const handleAddExpense = useCallback((newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    setShowAddExpense(false);
  }, []);

  const handleDeleteExpense = useCallback((id) => {
    setExpenses((prevExpenses) => prevExpenses.filter(expense => expense.id !== id));
  }, []);

  const MainView = useMemo(() => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-0">Expense Tracker</h1>
        <button onClick={() => setShowAddExpense(true)} className="flex items-center text-lg py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
          <PlusCircle className="w-6 h-6 mr-2" /> Add New Expense
        </button>
      </div>
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 flex items-center">
          <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-green-600" /> Total Expenses
        </h2>
        <p className="text-4xl sm:text-5xl font-bold text-green-600">₹{totalAmount.toFixed(2)}</p>
      </div>
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Expense List</h2>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-100 p-4 rounded-lg text-lg">
              <span className="font-medium mb-2 sm:mb-0">{expense.type}</span>
              <span className="text-green-600 font-semibold mb-2 sm:mb-0">₹{expense.amount.toFixed(2)}</span>
              <span className="text-gray-600 mb-2 sm:mb-0">{format(expense.date, 'dd/MM/yyyy')}</span>
              <button
                onClick={() => handleDeleteExpense(expense.id)}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                aria-label={`Delete ${expense.type} expense`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  ), [expenses, totalAmount, handleDeleteExpense]);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 bg-gray-100">
      {showAddExpense ? (
        <AddExpenseView 
          onAddExpense={handleAddExpense} 
          onBack={() => setShowAddExpense(false)} 
        />
      ) : (
        MainView
      )}
    </div>
  );
}