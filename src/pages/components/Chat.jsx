import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Bot, Send, X } from 'lucide-react'
import { google_ngrok_url } from '../../utils/global';
export default function Chat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const API_URL = `${google_ngrok_url}/query/`

  const toggleChat = () => setIsOpen(!isOpen)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    const token=localStorage.getItem("Token")

    const userMessage = { text: inputValue, isUser: true }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await axios.post(API_URL, { question: inputValue },{headers:{
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }})
      const botMessage = { text: response.data.data, isUser: false }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = { text: 'Sorry, there was an error processing your request.', isUser: false }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Chat</h3>
            <button onClick={toggleChat} className="text-primary-foreground hover:text-gray-200">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-2 ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground p-2 rounded-r-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Bot size={24} />
        </button>
      )}
    </div>
  )
}