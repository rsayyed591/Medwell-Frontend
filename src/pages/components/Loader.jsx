import React, { useEffect, useState } from 'react'

export default function Loader({ onLoadingComplete }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onLoadingComplete()
    }, 2000) 

    return () => clearTimeout(timer)
  }, [onLoadingComplete])

  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="loading">
        <svg width="128" height="96" viewBox="0 0 128 96">
          <polyline
            points="0.314 47.908, 28 47.908, 43.686 96, 86 0, 100 48, 128 48"
            className="fill-none stroke-[#ff4d5033] stroke-[6] stroke-round"
          />
          <polyline
            points="0.314 47.908, 28 47.908, 43.686 96, 86 0, 100 48, 128 48"
            className="fill-none stroke-[#ff4d4f] stroke-[6] stroke-round animate-dash"
          />
        </svg>
      </div>
    </div>
  )
}