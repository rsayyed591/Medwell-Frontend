'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Bot, X } from 'lucide-react'

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const chatRef = useRef(null)

  const toggleChat = () => setIsOpen(!isOpen)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIframeLoaded(true)
      }, 1000) 

      return () => clearTimeout(timer)
    } else {
      setIframeLoaded(false)
    }
  }, [isOpen])

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

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={chatRef}>
      {isOpen ? (
        <div className="bg-blue-400 rounded-lg shadow-xl w-[350px] h-[430px] flex flex-col overflow-hidden">
          <div className="bg-primary text-primary-foreground p-2 flex justify-end items-center">
            <button 
              onClick={toggleChat} 
              className="text-primary-foreground hover:text-gray-200"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 relative">
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            <iframe
              allow="microphone;"
              width="100%"
              height="100%"
              src="https://console.dialogflow.com/api-client/demo/embedded/23f22ced-19cc-4886-832d-3f7ca260a6c6"
              className={`w-full h-full ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIframeLoaded(true)}
              title="Agasthya"
            ></iframe>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Open chat"
        >
          <Bot size={24} />
        </button>
      )}
    </div>
  )
}