import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowLeft, DollarSign, PlusCircle, Trash2, MessageSquare, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import CombinedChat from "../Chatbots/CombinedChat"
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

    const expenseToAdd = {
      expense_type: 'other',
      amount: '0', 
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

const ExpenseDetailsModal = ({ expense, onClose, onDelete }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.9 }}
      className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Expense Details</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>
      <p><strong>Type:</strong> {expense.expense_type}</p>
      <p><strong>Amount:</strong> ₹{expense.amount}</p>
      <p><strong>Date:</strong> {expense.date}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onDelete}
        className="mt-4 flex items-center justify-center text-lg py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 w-full"
      >
        <Trash2 className="w-5 h-5 mr-2" /> Delete Expense
      </motion.button>
    </motion.div>
  </motion.div>
);

export default function ExpenseTracker() {
  const [expenseData, setExpenseData] = useState({
    overall_expense: "26500",
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
      },
      {
        expense_type: "medicines",
        amount: "5000",
        date: "2024-10-27"
      },
      {
        expense_type: "reports",
        amount: "1000",
        date: "2024-10-27"
      }
    ]
  });
  const [showAddExpense, setShowAddExpense] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showMobileModal, setShowMobileModal] = useState(false);

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
    setShowMobileModal(false);
  }, []);

  const paginatedExpenses = useMemo(() => {
    const startIndex = currentPage * 4;
    return expenseData.expenses.slice(startIndex, startIndex + 4);
  }, [expenseData.expenses, currentPage]);

  const totalPages = Math.ceil(expenseData.expenses.length / 4);

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
      {/* <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Expense Tracker</h1> */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 sm:p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 flex items-center">
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 mr-3  text-green-600" /> Total Expenses
          </h2>
          <p className="text-4xl sm:text-5xl font-bold text-green-600">₹{parseFloat(expenseData.overall_expense).toFixed(2)}</p>
        </motion.div>
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Expense List</h2>
          <div className="mb-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left border">Type</th>
                  <th className="p-2 text-left border">Amount</th>
                  <th className="p-2 text-left border">Date</th>
                  <th className="p-2 text-left border">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginatedExpenses.map((expense, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedExpense(expense);
                        if (window.innerWidth < 768) {
                          setShowMobileModal(true);
                        }
                      }}
                    >
                      <td className="p-2 border">{expense.expense_type}</td>
                      <td className="p-2 text-green-600 font-semibold border">₹{expense.amount}</td>
                      <td className="p-2 text-gray-600 border">{expense.date}</td>
                      <td className="p-2 border">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExpense(expenseData.expenses.indexOf(expense));
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
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
          {selectedExpense && !showMobileModal && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg mt-4 hidden md:block"
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
  ), [expenseData, selectedExpense, paginatedExpenses, currentPage, totalPages, handleDeleteExpense, showMobileModal, expenseChartData, expenseTrendData, expenseTypeData, monthlyExpenseData, averageExpenseData, cumulativeExpenseData]);

  return (
    <div className="max-w-[1400px] w-full mx-auto p-2 sm:p-4 md:p-6 lg:p-8 bg-gray-100">
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
      {showMobileModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 md:hidden"
          onClick={() => setShowMobileModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Expense Details</h3>
              <button onClick={() => setShowMobileModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <p><strong>Type:</strong> {selectedExpense?.expense_type}</p>
            <p><strong>Amount:</strong> ₹{selectedExpense?.amount}</p>
            <p><strong>Date:</strong> {selectedExpense?.date}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDeleteExpense(expenseData.expenses.indexOf(selectedExpense))}
              className="mt-4 flex items-center justify-center text-lg py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 w-full"
            >
              <Trash2 className="w-5 h-5 mr-2" /> Delete Expense
            </motion.button>
          </motion.div>
        </motion.div>
      )}
      <CombinedChat/>
    </div>
  );
}