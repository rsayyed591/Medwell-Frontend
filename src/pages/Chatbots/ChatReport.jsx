import React, { useState, useEffect, useRef } from 'react'
import { FileText, X, Send } from 'lucide-react'

export default function ChatReport() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const chatRef = useRef(null)
  const messagesEndRef = useRef(null)

  const toggleChat = () => setIsOpen(!isOpen)

  const handleInputChange = (e) => setInputMessage(e.target.value)

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, sender: 'user' }])
      setInputMessage('')
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: "Thanks for your message! This is a simulated response.", sender: 'bot' }])
      }, 1000)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleChat} />
      )}
      <div className="fixed bottom-20 right-4 z-40">
        {isOpen ? (
          <div 
            ref={chatRef}
            className="bg-white shadow-xl flex flex-col w-full sm:w-[400px] h-[80vh] max-h-[800px] rounded-lg overflow-hidden"
          >
            <div className="bg-green-500 text-white p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">MedBuddy</h2>
              <button 
                onClick={toggleChat} 
                className="text-white hover:text-gray-200"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-lg p-3 ${message.sender === 'user' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="border-t p-4 flex">
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="bg-green-500 text-white rounded-r-lg px-4 py-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={toggleChat}
            className="bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Open chat report"
          >
            <FileText size={24} />
          </button>
        )}
      </div>
    </>
  )
}