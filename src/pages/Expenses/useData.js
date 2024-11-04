import { useState } from 'react';
import { google_ngrok_url } from '../../utils/global';
import { useAuth } from '../Auth/useAuth';

const API_BASE_URL = google_ngrok_url; 

export const useData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const {checkAuth}=useAuth()
  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('Token'); 
    checkAuth()

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred');
    }

    return response.json();
  };

  const addExpense = async (expenseData) => {
    setLoading(true);
    setError(null);
    try {
      let requestBody;
      if (expenseData.query_type === 'natural_language') {
        requestBody = {
          "query_type": 'natural_language',
          "query": expenseData.query
        };
      } else {
        requestBody = {
          "query_type": 'normal',
          "expense_type": expenseData.expense_type,
          "amount": expenseData.amount
        };
      }
  
      const result = await fetchWithAuth('/patient/add_expense/', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });
      
      setLoading(false);
      console.log(result)
      return result;
    } catch (err) {
      setLoading(false);
      if (err.message === 'Unauthorized') {
        setError('Authentication failed. Please log in again.');
      } else if (err.message === 'Bad Request') {
        setError('Invalid input. Please check your expense details.');
      } else if (err.message === 'AI server unavailable') {
        setError('AI service is currently unavailable. Please try again later.');
      } else {
        setError('An error occurred while adding the expense. Please try again.');
      }
      throw err;
    }
  };

  const showExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchWithAuth('/patient/show_expenses/', {
        method: 'POST',
      });
      setLoading(false);
      console.log("Called")
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getExpensesDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchWithAuth('/patient/expenses_dashboard/', {
        method: 'POST',
      });
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const deleteExpense = async (expenseId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchWithAuth('/patient/delete_expense/', {
        method: 'POST',
        body: JSON.stringify({ expense_id: expenseId }),
      });
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    addExpense,
    showExpenses,
    getExpensesDashboard,
    deleteExpense,
  };
};