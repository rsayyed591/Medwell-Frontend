import React, { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'

// Mock JSON data for inventory
const initialInventoryData = [
  { id: 1, name: "Paracetamol", category: "Medicine", quantity: 500, unit: "tablets", reorderLevel: 100 },
  { id: 2, name: "Surgical Masks", category: "Equipment", quantity: 1000, unit: "pieces", reorderLevel: 200 },
  { id: 3, name: "Insulin", category: "Medicine", quantity: 50, unit: "vials", reorderLevel: 10 },
  { id: 4, name: "Stethoscope", category: "Equipment", quantity: 20, unit: "pieces", reorderLevel: 5 },
  { id: 5, name: "Bandages", category: "Supplies", quantity: 300, unit: "rolls", reorderLevel: 50 },
  { id: 6, name: "Antibiotics", category: "Medicine", quantity: 200, unit: "bottles", reorderLevel: 30 },
  { id: 7, name: "Gloves", category: "Supplies", quantity: 5000, unit: "pairs", reorderLevel: 1000 },
  { id: 8, name: "X-ray Machine", category: "Equipment", quantity: 2, unit: "units", reorderLevel: 1 },
]

export default function Inventory() {
  const [inventory, setInventory] = useState(initialInventoryData)
  const [searchTerm, setSearchTerm] = useState("")
  const [newItem, setNewItem] = useState({ name: "", category: "", quantity: "", unit: "", reorderLevel: "" })
  const [editingItem, setEditingItem] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState({
    Medicine: true,
    Equipment: true,
    Supplies: true,
  })

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedInventory = filteredInventory.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {})

  const handleAddItem = (e) => {
    e.preventDefault()
    const newId = Math.max(...inventory.map(item => item.id)) + 1
    setInventory([...inventory, { ...newItem, id: newId, quantity: parseInt(newItem.quantity), reorderLevel: parseInt(newItem.reorderLevel) }])
    setNewItem({ name: "", category: "", quantity: "", unit: "", reorderLevel: "" })
    setIsAdding(false)
  }

  const handleEditItem = (item) => {
    setEditingItem(item)
  }

  const handleUpdateItem = (e) => {
    e.preventDefault()
    setInventory(inventory.map(item => item.id === editingItem.id ? editingItem : item))
    setEditingItem(null)
  }

  const handleDeleteItem = (id) => {
    setInventory(inventory.filter(item => item.id !== id))
  }

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{
          backgroundImage: "url('/hospital/bg7.jpg')",
          filter: "brightness(0.7)"
        }}
      ></div>
      <div className="relative z-10 p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Inventory Management</h1>
        
        <div className="bg-white bg-opacity-90 p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Item
            </button>
          </div>
          
          <div className="space-y-4">
            {Object.entries(groupedInventory).map(([category, items]) => (
              <div key={category} className="bg-gray-50 rounded-lg overflow-hidden">
                <div 
                  className="bg-gray-200 p-3 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  <h2 className="text-lg font-semibold">{category}</h2>
                  {expandedCategories[category] ? <ChevronUp /> : <ChevronDown />}
                </div>
                {expandedCategories[category] && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.quantity}
                              {item.quantity <= item.reorderLevel && (
                                <AlertTriangle className="h-5 w-5 text-yellow-500 inline-block ml-2" />
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.unit}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.reorderLevel}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button onClick={() => handleEditItem(item)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                <Edit className="h-5 w-5" />
                              </button>
                              <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {isAdding && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Item</h3>
              <form onSubmit={handleAddItem}>
                <input
                  type="text"
                  placeholder="Name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="mb-2 w-full p-2 border rounded"
                  required
                />
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="mb-2 w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Supplies">Supplies</option>
                </select>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                  className="mb-2 w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={newItem.unit}
                  onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                  className="mb-2 w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Reorder Level"
                  value={newItem.reorderLevel}
                  onChange={(e) => setNewItem({...newItem, reorderLevel: e.target.value})}
                  className="mb-4 w-full p-2 border rounded"
                  required
                />
                <div className="flex justify-end">
                  <button type="button" onClick={() => setIsAdding(false)} className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Item</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editingItem && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit Item</h3>
              <form onSubmit={handleUpdateItem}>
                <input
                  type="text"
                  placeholder="Name"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="mb-2 w-full p-2 border rounded"
                  required
                />
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                  className="mb-2 w-full p-2 border rounded"
                  required
                >
                  <option value="Medicine">Medicine</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Supplies">Supplies</option>
                </select>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={editingItem.quantity}
                  onChange={(e) => setEditingItem({...editingItem, quantity: parseInt(e.target.value)})}
                  className="mb-2 w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={editingItem.unit}
                  onChange={(e) => setEditingItem({...editingItem, unit: e.target.value})}
                  className="mb-2 w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Reorder Level"
                  value={editingItem.reorderLevel}
                  onChange={(e) => setEditingItem({...editingItem, reorderLevel: parseInt(e.target.value)})}
                  className="mb-4 w-full p-2 border rounded"
                  required
                />
                <div className="flex justify-end">
                  <button type="button" onClick={() => setEditingItem(null)} className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Update Item</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}