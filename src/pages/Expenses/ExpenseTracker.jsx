import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, DollarSign, PlusCircle, Trash2, MessageSquare, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { useData } from './useData';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const expenseTypes = ['reports', 'doctor', 'medicines', 'tests'];

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

  const handleAddExpense = useCallback(() => {
    if (!newExpense.expense_type || !newExpense.amount) return;

    const expenseToAdd = {
      query_type: 'normal',
      expense_type: newExpense.expense_type,
      amount: newExpense.amount
    };

    onAddExpense(expenseToAdd);
  }, [newExpense, onAddExpense]);

  const handleNaturalLanguageSubmit = useCallback(() => {
    if (!naturalLanguageInput) return;

    const expenseToAdd = {
      query_type: 'natural_language',
      query: naturalLanguageInput
    };

    onAddExpense(expenseToAdd);
  }, [naturalLanguageInput, onAddExpense]);

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
      <p><strong>Amount:</strong> ₹{parseFloat(expense.amount).toFixed(2)}</p>
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
  const { loading, error, addExpense, showExpenses, getExpensesDashboard, deleteExpense } = useData();
  const [expenseData, setExpenseData] = useState({ overall_expense: "0", expenses: [] });
  const [chartData, setChartData] = useState({
    expense_trend: { expenses: [] },
    expenses_per_month: { month_name: [], expenses: [] },
    expenses_per_month_per_type: [],
    expenses_per_type: { expense_type: [], total: [] },
    expenses_per_year: { year: [], expenses: [] },
    expenses_per_year_per_type: []
  });
  const [showAddExpense, setShowAddExpense] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showMobileModal, setShowMobileModal] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const expenses = await showExpenses();
      const dashboard = await getExpensesDashboard();
      setExpenseData({
        overall_expense: expenses.overall_expense,
        expenses: expenses.expenses
      });
      setChartData(dashboard);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const handleAddExpense = useCallback(async (newExpense) => {
    try {
      await addExpense(newExpense);
      await fetchExpenses(); 
      setShowAddExpense(null);
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  }, [addExpense]);

  const handleDeleteExpense = useCallback(async (expenseId) => {
    try {
      await deleteExpense(expenseId);
      await fetchExpenses(); 
      setSelectedExpense(null);
      setShowMobileModal(false);
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  }, [deleteExpense]);

  const paginatedExpenses = useMemo(() => {
    const startIndex = currentPage * 4;
    return expenseData.expenses.slice(startIndex, startIndex + 4);
  }, [expenseData.expenses, currentPage]);

  const totalPages = Math.ceil(expenseData.expenses.length / 4);

  const expenseChartData = useMemo(() => ({
    labels: chartData.expenses_per_type.expense_type,
    datasets: [
      {
        data: chartData.expenses_per_type.total,
        backgroundColor: COLORS,
      },
    ],
  }), [chartData.expenses_per_type]);

  const expenseTrendData = useMemo(() => {
    const expenses = chartData.expense_trend.expenses;
    const numberOfDays = expenses.length;

    return {
      labels: Array.from({ length: numberOfDays }, (_, i) => `Day ${i + 1}`),
      datasets: [
        {
          label: 'Daily Expenses',
          data: expenses,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
  }, [chartData.expense_trend]);

  const monthlyExpenseData = useMemo(() => ({
    labels: chartData.expenses_per_month.month_name,
    datasets: [
      {
        label: 'Monthly Expenses',
        data: chartData.expenses_per_month.expenses,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  }), [chartData.expenses_per_month]);

  const yearlyExpenseData = useMemo(() => ({
    labels: chartData.expenses_per_year.year,
    datasets: [
      {
        label: 'Yearly Expenses',
        data: chartData.expenses_per_year.expenses,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  }), [chartData.expenses_per_year]);

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

  const averageExpenseData = useMemo(() => {
    const data = {};
    expenseData.expenses.forEach((expense) => {
      const amount = parseFloat(expense.amount) || 0;
      if (data[expense.expense_type]) {
        data[expense.expense_type].sum += amount;
        data[expense.expense_type].count++;
      } else {
        data[expense.expense_type] = { sum: amount, count: 1 };
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

  const MainView = useMemo(() => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
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
                onClick={() =>   setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
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
                        key={expense.id || index}
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
                        <td className="p-2 text-green-600 font-semibold border">₹{parseFloat(expense.amount).toFixed(2)}</td>
                        <td className="p-2 text-gray-600 border">{expense.date}</td>
                        <td className="p-2 border">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteExpense(expense.id);
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
        </div>
        <div className="space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Add Expense</h2>
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
                <MessageSquare className="w-6 h-6 mr-2" /> Add in Natural Language
              </motion.button>
            </div>
          </div>
          {selectedExpense && !showMobileModal && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4">Expense Details</h3>
              <p><strong>Type:</strong> {selectedExpense.expense_type}</p>
              <p><strong>Amount:</strong> ₹{parseFloat(selectedExpense.amount).toFixed(2)}</p>
              <p><strong>Date:</strong> {selectedExpense.date}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteExpense(selectedExpense.id)}
                className="mt-4 flex items-center justify-center text-lg py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 w-full"
              >
                <Trash2 className="w-5 h-5 mr-2" /> Delete Expense
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg h-[400px] flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Expense Distribution</h3>
          <div className="flex-grow">
            <Pie data={expenseChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg h-[400px] flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Expense Trend</h3>
          <div className="flex-grow">
            <Line data={expenseTrendData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg h-[400px] flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Monthly Expenses</h3>
          <div className="flex-grow">
            <Bar data={monthlyExpenseData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg h-[400px] flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Yearly Expenses</h3>
          <div className="flex-grow">
            <Bar data={yearlyExpenseData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg h-[400px] flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Expense Types</h3>
          <div className="flex-grow">
            <Bar data={expenseTypeData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg h-[400px] flex flex-col">
          <h3 className="text-xl font-semibold mb-4">Average Expense by Type</h3>
          <div className="flex-grow">
            <Bar data={averageExpenseData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

    </motion.div>
  ), [expenseData, paginatedExpenses, currentPage, totalPages, handleDeleteExpense, expenseChartData, expenseTrendData, monthlyExpenseData, yearlyExpenseData, expenseTypeData, averageExpenseData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-[1600px] w-full mx-auto p-2 sm:p-4 md:p-6 lg:p-8 bg-gray-100">
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
      {showMobileModal && selectedExpense && (
        <ExpenseDetailsModal
          expense={selectedExpense}
          onClose={() => setShowMobileModal(false)}
          onDelete={() => handleDeleteExpense(selectedExpense.id)}
        />
      )}
    </div>
  );
}