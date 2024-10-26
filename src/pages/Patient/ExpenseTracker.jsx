import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowLeft, DollarSign, PlusCircle, Trash2, MessageSquare } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const expenseTypes = ['reports', 'doctor', 'medicines'];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AddExpenseView = ({ onAddExpense, onBack, inputMethod }) => {
  const [newExpense, setNewExpense] = useState({
    expense_type: '',
    amount: '',
  });
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((e) => {
    setNewExpense((prev) => ({ ...prev, expense_type: e.target.value }));
  }, []);

  const handleNaturalLanguageSubmit = () => {
    // Here you would implement the logic to parse the natural language input
    // For this example, we'll just create a simple expense object
    const expenseToAdd = {
      expense_type: 'other',
      amount: '0', // You would extract this from the natural language input
      date: format(new Date(), 'yyyy-MM-dd'),
    };
    onAddExpense(expenseToAdd);
  };

  const handleAddExpense = useCallback(() => {
    if (!newExpense.expense_type || !newExpense.amount) return;

    const expenseToAdd = {
      expense_type: newExpense.expense_type,
      amount: newExpense.amount,
      date: format(new Date(), 'yyyy-MM-dd'),
    };

    onAddExpense(expenseToAdd);
  }, [newExpense, onAddExpense]);

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
      {inputMethod === 'natural' ? (
        <div className="space-y-4">
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
      ) : (
        <div className="space-y-6">
          <div>
            <label htmlFor="expenseType" className="block text-lg mb-2">Expense Type</label>
            <select
              id="expenseType"
              name="expense_type"
              value={newExpense.expense_type}
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
      )}
    </motion.div>
  );
};

export default function ExpenseTracker() {
  const [expenseData, setExpenseData] = useState({
    overall_expense: "20500",
    expenses: [
      {
        expense_type: "reports",
        amount: "500",
        date: "2024-10-26"
      },
      {
        expense_type: "doctor",
        amount: "10000",
        date: "2024-10-26"
      },
      {
        expense_type: "doctor",
        amount: "10000",
        date: "2024-10-26"
      }
    ]
  });
  const [showAddExpense, setShowAddExpense] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleAddExpense = useCallback((newExpense) => {
    setExpenseData((prevData) => ({
      overall_expense: (parseFloat(prevData.overall_expense) + parseFloat(newExpense.amount)).toString(),
      expenses: [...prevData.expenses, newExpense]
    }));
    setShowAddExpense(null);
  }, []);

  const handleDeleteExpense = useCallback((index) => {
    setExpenseData((prevData) => ({
      overall_expense: (parseFloat(prevData.overall_expense) - parseFloat(prevData.expenses[index].amount)).toString(),
      expenses: prevData.expenses.filter((_, i) => i !== index)
    }));
    setSelectedExpense(null);
  }, []);

  const expenseChartData = useMemo(() => {
    const data = {};
    expenseData.expenses.forEach((expense) => {
      if (data[expense.expense_type]) {
        data[expense.expense_type] += parseFloat(expense.amount);
      } else {
        data[expense.expense_type] = parseFloat(expense.amount);
      }
    });
    return {
      labels: Object.keys(data),
      datasets: [
        {
          data: Object.values(data),
          backgroundColor: COLORS,
        },
      ],
    };
  }, [expenseData.expenses]);

  const expenseTrendData = useMemo(() => {
    const dates = [...new Set(expenseData.expenses.map(expense => expense.date))].sort();
    const data = dates.map(date => {
      return {
        date,
        amount: expenseData.expenses
          .filter(expense => expense.date === date)
          .reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
      };
    });

    return {
      labels: data.map(item => item.date),
      datasets: [
        {
          label: 'Daily Expenses',
          data: data.map(item => item.amount),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
  }, [expenseData.expenses]);

  const expenseTypeData = useMemo(() => {
    const data = {};
    expenseData.expenses.forEach((expense) => {
      if (data[expense.expense_type]) {
        data[expense.expense_type]++;
      } else {
        data[expense.expense_type] = 1;
      }
    });

    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: 'Number of Expenses',
          data: Object.values(data),
          backgroundColor: COLORS,
        },
      ],
    };
  }, [expenseData.expenses]);

  const monthlyExpenseData = useMemo(() => {
    const data = {};
    expenseData.expenses.forEach((expense) => {
      const month = expense.date.substring(0, 7); // Get YYYY-MM
      if (data[month]) {
        data[month] += parseFloat(expense.amount);
      } else {
        data[month] = parseFloat(expense.amount);
      }
    });

    return {
      labels: Object.keys(data),
      datasets: [
        {
          label: 'Monthly Expenses',
          data: Object.values(data),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
  }, [expenseData.expenses]);

  const averageExpenseData = useMemo(() => {
    const data = {};
    expenseData.expenses.forEach((expense) => {
      if (data[expense.expense_type]) {
        data[expense.expense_type].sum += parseFloat(expense.amount);
        data[expense.expense_type].count++;
      } else {
        data[expense.expense_type] = { sum: parseFloat(expense.amount), count: 1 };
      }
    });

    const averages = Object.entries(data).map(([type, { sum, count }]) => ({
      type,
      average: sum / count
    }));

    return {
      labels: averages.map(item => item.type),
      datasets: [
        {
          label: 'Average Expense',
          data: averages.map(item => item.average),
          backgroundColor: COLORS,
        },
      ],
    };
  }, [expenseData.expenses]);

  const cumulativeExpenseData = useMemo(() => {
    let cumulative = 0;
    const data = expenseData.expenses
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(expense => {
        cumulative += parseFloat(expense.amount);
        return { date: expense.date, amount: cumulative };
      });

    return {
      labels: data.map(item => item.date),
      datasets: [
        {
          label: 'Cumulative Expenses',
          data: data.map(item => item.amount),
          borderColor: 'rgb(153, 102, 255)',
          tension: 0.1
        }
      ]
    };
  }, [expenseData.expenses]);

  const MainView = useMemo(() => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Expense Tracker</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 sm:p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 flex items-center">
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-green-600" /> Total Expenses
          </h2>
          <p className="text-4xl sm:text-5xl font-bold text-green-600">₹{parseFloat(expenseData.overall_expense).toFixed(2)}</p>
        </motion.div>
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Expense List</h2>
          <AnimatePresence>
            {expenseData.expenses.map((expense, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg text-lg mb-4 cursor-pointer"
                onClick={() => setSelectedExpense(expense)}
              >
                <span className="font-medium">{expense.expense_type}</span>
                <span className="text-green-600 font-semibold">₹{expense.amount}</span>
                <span className="text-gray-600">{expense.date}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex flex-col space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddExpense('normal')}
            className="flex items-center justify-center text-lg py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
          >
            <PlusCircle className="w-6 h-6 mr-2" /> Add Expense
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddExpense('natural')}
            className="flex items-center justify-center text-lg py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300"
          >
            <MessageSquare className="w-6 h-6 mr-2" /> Add Expense in Natural Language
          </motion.button>
          {selectedExpense && (
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg mt-4"
            >
              <h3 className="text-xl font-semibold mb-4">Expense Details</h3>
              <p><strong>Type:</strong> {selectedExpense.expense_type}</p>
              <p><strong>Amount:</strong> ₹{selectedExpense.amount}</p>
              <p><strong>Date:</strong> {selectedExpense.date}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteExpense(expenseData.expenses.indexOf(selectedExpense))}
                className="mt-4 flex items-center justify-center text-lg py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
              >
                <Trash2 className="w-5 h-5 mr-2" /> Delete Expense
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Expense Distribution</h3>
          <Pie data={expenseChartData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Expense Trend</h3>
          <Line data={expenseTrendData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Expense Types</h3>
          <Bar data={expenseTypeData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Monthly Expenses</h3>
          <Bar data={monthlyExpenseData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Average Expense by Type</h3>
          <Bar data={averageExpenseData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Cumulative Expenses</h3>
          <Line data={cumulativeExpenseData} />
        </div>
      </div>
    </motion.div>
  ), [expenseData, selectedExpense, expenseChartData, expenseTrendData, expenseTypeData, monthlyExpenseData, averageExpenseData, cumulativeExpenseData, handleDeleteExpense]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 bg-gray-100">
      <AnimatePresence mode="wait">
        {showAddExpense ? (
          <AddExpenseView 
            key="add-expense"
            onAddExpense={handleAddExpense} 
            onBack={() => setShowAddExpense(null)}
            inputMethod={showAddExpense}
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