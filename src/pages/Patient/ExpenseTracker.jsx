import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowLeft, DollarSign, PlusCircle, Trash2 } from 'lucide-react';

const expenseTypes = ['Medicines', 'Doctor Fees', 'Reports'];

const AddExpenseView = ({ onAddExpense, onBack }) => {
  const [inputMethod, setInputMethod] = useState(null);
  const [newExpense, setNewExpense] = useState({
    type: '',
    amount: '',
  });
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((e) => {
    setNewExpense((prev) => ({ ...prev, type: e.target.value }));
  }, []);

  const handleNaturalLanguageSubmit = () => {
    // Here you would implement the logic to parse the natural language input
    // For this example, we'll just create a simple expense object
    const expenseToAdd = {
      id: Date.now(),
      type: 'Other',
      amount: 0, // You would extract this from the natural language input
      date: new Date(),
    };
    onAddExpense(expenseToAdd);
    setInputMethod(null);
  };

  const handleAddExpense = useCallback(() => {
    if (!newExpense.type || !newExpense.amount) return;

    const expenseToAdd = {
      id: Date.now(),
      type: newExpense.type,
      amount: parseFloat(newExpense.amount),
      date: new Date(),
    };

    onAddExpense(expenseToAdd);
    setInputMethod(null);
  }, [newExpense, onAddExpense]);

  if (!inputMethod) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">How would you like to add the expense?</h2>
        <button
          onClick={() => setInputMethod('normal')}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Normal Input
        </button>
        <button
          onClick={() => setInputMethod('natural')}
          className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Natural Language Input
        </button>
      </div>
    );
  }

  if (inputMethod === 'natural') {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Describe your expense</h2>
        <textarea
          value={naturalLanguageInput}
          onChange={(e) => setNaturalLanguageInput(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows={4}
          placeholder="E.g., I spent 500 rupees on medicine yesterday"
        />
        <button
          onClick={handleNaturalLanguageSubmit}
          className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Add Expense
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <button className="mb-6 flex items-center text-blue-600 hover:text-blue-800 text-lg transition-colors duration-300" onClick={onBack}>
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
            className="w-full text-lg py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          >
            <option value="">Select expense type</option>
            {expenseTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-lg mb-2">Amount</label>
          <input
            id="amount"
            name="amount"
            type="number"
            value={newExpense.amount}
            onChange={handleInputChange}
            placeholder="Enter amount"
            className="w-full text-lg py-3 px-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddExpense} 
          className="w-full text-lg py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
        >
          Add Expense
        </motion.button>
      </div>
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-0">Expense Tracker</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddExpense(true)}
          className="flex items-center text-lg py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
        >
          <PlusCircle className="w-6 h-6 mr-2" /> Add New Expense
        </motion.button>
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 sm:p-8  rounded-xl shadow-lg"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 flex items-center">
          <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-green-600" /> Total Expenses
        </h2>
        <p className="text-4xl sm:text-5xl font-bold text-green-600">₹{totalAmount.toFixed(2)}</p>
      </motion.div>
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Expense List</h2>
        <AnimatePresence>
          {expenses.map((expense) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-100 p-4 rounded-lg text-lg mb-4"
            >
              <span className="font-medium mb-2 sm:mb-0">{expense.type}</span>
              <span className="text-green-600 font-semibold mb-2 sm:mb-0">₹{expense.amount.toFixed(2)}</span>
              <span className="text-gray-600 mb-2 sm:mb-0">{format(expense.date, 'dd/MM/yyyy')}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDeleteExpense(expense.id)}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-300"
                aria-label={`Delete ${expense.type} expense`}
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  ), [expenses, totalAmount, handleDeleteExpense]);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 bg-gray-100">
      <AnimatePresence mode="wait">
        {showAddExpense ? (
          <AddExpenseView 
            key="add-expense"
            onAddExpense={handleAddExpense} 
            onBack={() => setShowAddExpense(false)} 
          />
        ) : (
          <motion.div
            key="main-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {MainView}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}