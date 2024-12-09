import React, { useState, useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { DollarSign, Plus, Search, ArrowUp, ArrowDown } from 'lucide-react'

Chart.register(...registerables)

// Mock JSON data for billing
const billingData = {
  recentActivity: [
    { id: 1, patientName: "John Doe", amount: 500, date: "2023-06-01", type: "Payment" },
    { id: 2, patientName: "Jane Smith", amount: 750, date: "2023-06-02", type: "Invoice" },
    { id: 3, patientName: "Bob Johnson", amount: 300, date: "2023-06-03", type: "Payment" },
  ],
  pendingBills: [
    { id: 1, patientName: "Alice Brown", amount: 1000, dueDate: "2023-06-15" },
    { id: 2, patientName: "Charlie Davis", amount: 550, dueDate: "2023-06-20" },
    { id: 3, patientName: "Eva Wilson", amount: 800, dueDate: "2023-06-25" },
  ],
  expenses: [
    { id: 1, category: "Medical Supplies", amount: 5000, date: "2023-06-01" },
    { id: 2, category: "Salaries", amount: 50000, date: "2023-06-05" },
    { id: 3, category: "Utilities", amount: 3000, date: "2023-06-10" },
  ],
  monthlyRevenue: [
    { month: "Jan", amount: 50000 },
    { month: "Feb", amount: 55000 },
    { month: "Mar", amount: 60000 },
    { month: "Apr", amount: 58000 },
    { month: "May", amount: 62000 },
    { month: "Jun", amount: 65000 },
  ],
}

export default function Billing() {
  const [searchTerm, setSearchTerm] = useState("")
  const [newBill, setNewBill] = useState({ patientName: "", amount: "", dueDate: "" })
  const [pendingBills, setPendingBills] = useState(billingData.pendingBills)
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: billingData.monthlyRevenue.map(item => item.month),
        datasets: [{
          label: 'Monthly Revenue',
          data: billingData.monthlyRevenue.map(item => item.amount),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: false,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Monthly Revenue'
          }
        }
      }
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  const handleAddBill = (e) => {
    e.preventDefault()
    setPendingBills([...pendingBills, { ...newBill, id: pendingBills.length + 1 }])
    setNewBill({ patientName: "", amount: "", dueDate: "" })
  }

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10 p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-6">Billing Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-2">
              {billingData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{activity.patientName}</p>
                    <p className="text-sm text-gray-600">{activity.date}</p>
                  </div>
                  <div className={`font-semibold ${activity.type === 'Payment' ? 'text-green-600' : 'text-blue-600'}`}>
                    {activity.type === 'Payment' ? '-' : '+'} ${activity.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Pending Bills</h2>
            <div className="space-y-2">
              {pendingBills.map((bill) => (
                <div key={bill.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{bill.patientName}</p>
                    <p className="text-sm text-gray-600">Due: {bill.dueDate}</p>
                  </div>
                  <div className="font-semibold text-red-600">
                    ${bill.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Expenses</h2>
            <div className="space-y-2">
              {billingData.expenses.map((expense) => (
                <div key={expense.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{expense.category}</p>
                    <p className="text-sm text-gray-600">{expense.date}</p>
                  </div>
                  <div className="font-semibold text-red-600">
                    ${expense.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Revenue Chart</h2>
            <canvas ref={chartRef}></canvas>
          </div>
          
          <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add New Bill</h2>
            <form onSubmit={handleAddBill} className="space-y-4">
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Patient Name</label>
                <input
                  type="text"
                  id="patientName"
                  value={newBill.patientName}
                  onChange={(e) => setNewBill({...newBill, patientName: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  id="amount"
                  value={newBill.amount}
                  onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  value={newBill.dueDate}
                  onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Add Bill
              </button>
            </form>
          </div>
        </div>
        
        <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Search Bills</h2>
          <div className="flex items-center bg-white rounded-md">
            <input
              type="text"
              placeholder="Search by patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 rounded-l-md focus:outline-none"
            />
            <button className="bg-blue-600 text-white p-2 rounded-r-md">
              <Search className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4">
            {pendingBills.filter(bill => 
              bill.patientName.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((bill) => (
              <div key={bill.id} className="flex justify-between items-center border-b py-2">
                <div>
                  <p className="font-medium">{bill.patientName}</p>
                  <p className="text-sm text-gray-600">Due: {bill.dueDate}</p>
                </div>
                <div className="font-semibold text-red-600">
                  ${bill.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}