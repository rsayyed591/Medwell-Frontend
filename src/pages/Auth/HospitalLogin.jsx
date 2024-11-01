import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { EyeIcon, EyeOffIcon, Building2 } from 'lucide-react'
import { google_ngrok_url, ngrok_url } from '../../utils/global'

export function HospitalLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("Token")
    if (token) {
      navigate("/Dashboard")
    }
    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_KEY,
          callback: handleCallbackResponse
        })
        window.google.accounts.id.renderButton(
          document.getElementById("signInDiv"),
          { theme: "outline", size: "large" }
        )
      } else {
        setTimeout(initializeGoogleSignIn, 100)
      }
    }

    initializeGoogleSignIn()
  }, [navigate])

  const handleCallbackResponse = (response) => {
    const formData = new FormData()
    formData.append("token", response.credential)

    fetch(`${google_ngrok_url}/auth/google_login_hospital/`, {
      method: "POST",
      body: formData,  
    })
      .then(res => res.json())
      .then(data => {
        console.log("Backend response: ", data)
        localStorage.setItem("Token", data.access)
        navigate("/Dashboard")
      })
      .catch(err => {
        console.error("Error in Google login: ", err)
        setErrorMessage("An error occurred during Google login. Please try again.")
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage('')
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    fetch(`${ngrok_url}/auth/login_userhospital/`, {
      method: "POST",
      body: formData,  
    })
      .then(res => res.json())
      .then(data => {
        console.log("Backend response: ", data)
        if (data.mssg === 'Incorrect Credentials' && data.status === 0) {
          setErrorMessage('Incorrect email or password. Please try again.')
        } else {
          localStorage.setItem("Token", data.access_token)
          localStorage.setItem("User", JSON.stringify({ email: email, role: 'hospital' }))
          navigate("/Dashboard")
        }
      })
      .catch(err => {
        console.error("Error in Login: ", err)
        setErrorMessage("An error occurred. Please try again.")
      })
  }

  return (
    <div className="flex min-h-screen bg-blue-50 items-center justify-center p-4">
      <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl max-w-5xl w-full">
        <div className="flex flex-col md:flex-row">
          <div className="bg-blue-100 p-12 md:w-1/2 relative flex flex-col justify-between">
            <div className="text-2xl text-gray-800 font-semibold mb-12">
              Welcome back!<br />Manage your hospital<br />efficiently with MedWell.
            </div>
            <div className="flex items-center justify-center flex-grow">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-blue-200 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Building2 size={100} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>
          <div className="p-12 md:w-1/2">
            <h2 className="text-3xl font-bold text-center mb-8">Hospital Login</h2>
            <div id="signInDiv" className="flex justify-center mb-8"></div>
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="text-red-500 text-sm text-center">{errorMessage}</div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Log In
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account? <Link to="/hospital/signup" className="font-medium text-blue-600 hover:text-blue-500">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}