import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { NotebookTabs, EyeIcon, EyeOffIcon, Mail, Lock, Building2 } from 'lucide-react'
import { ngrok_url, google_ngrok_url } from '../../utils/global'
import Loader from '../components/Loader'

export default function HospitalSignUp() {
  const [hospitalName, setHospitalName] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showCPassword, setShowCPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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
          { theme: "outline", size: "large", width: isMobile ? 300 : 400 }
        )
      } else {
        setTimeout(initializeGoogleSignIn, 100)
      }
    }

    initializeGoogleSignIn()
  }, [navigate, isMobile])

  const handleCallbackResponse = (response) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append("token", response.credential)

    fetch(`${google_ngrok_url}/auth/google_login_hospital/`, {
      method: "POST",
      body: formData,  
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("Token", data.access)
        navigate("/Dashboard")
      })
      .catch(() => {
        setErrorMessage("An error occurred during Google sign-up. Please try again.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const validateForm = () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return false
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.")
      return false
    }
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password1", password)
    formData.append("password2", confirmPassword)
    formData.append("hospital_name", hospitalName)
    formData.append("registration_number", registrationNumber)

    fetch(`${ngrok_url}/auth/register_userhospital/`, {
      method: "POST",
      body: formData,  
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === false) {
          setErrorMessage(data.mssg)
        } else {
          localStorage.setItem("Token", data.access_token)
          localStorage.setItem("User", JSON.stringify({ email: email, hospitalName: hospitalName, registrationNumber: registrationNumber, role: 'hospital' }))
          navigate("/Dashboard")
        }
      })
      .catch(() => {
        setErrorMessage("An error occurred during sign-up. Please try again.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  if (isLoading) {
    return <Loader />
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#FFF5F5] flex flex-col">
        <div className="relative w-full">
          <div className="absolute inset-x-0 top-0 h-[225px] bg-[#B7A6F3] rounded-b-full" />
          
          <div className="relative pt-8 px-6 flex flex-col items-center">
            <h1 className="text-[#2D2D2D] text-3xl font-bold mb-0">Sign-Up</h1>
            <img
              src="/auth/hospital_signup_mobile.png"
              alt="Hospital"
              className="w-40 h-40 object-contain mb-0"
            />
            
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
              {errorMessage && (
                <div className="text-red-500 text-sm text-center">{errorMessage}</div>
              )}
              <div className="relative">
                <label className="text-sm text-gray-600 mb-1 block">Hospital Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="Enter hospital name"
                  />
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="relative">
                <label className="text-sm text-gray-600 mb-1 block">Registration Number</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="Enter hospital name"
                  />
                  <NotebookTabs className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="relative">
                <label className="text-sm text-gray-600 mb-1 block">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@gmail.com"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="relative">
                <label className="text-sm text-gray-600 mb-1 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="text-sm text-gray-600 mb-1 block">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showCPassword ? "text" : "password"}
                    required
                    className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onClick={() => setShowCPassword(!showCPassword)}
                  >
                    {showCPassword ? (
                      <EyeOffIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#7C3AED] text-white rounded-full font-medium hover:bg-[#6D28D9] transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#FFF5F5] text-gray-500">or</span>
                </div>
              </div>

              <div id="signInDiv" className="flex justify-center"></div>

              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <Link to="/hospital/login" className="text-[#7C3AED] font-medium">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF5F5] flex">
      <div className="hidden lg:flex flex-1 bg-[#F5F0FF] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 w-[70%] bg-[#B7A6F3] rounded-t-full translate-x-[120px] translate-y-20" />
        </div>
        <img
          src="/auth/hospital_signup.png"
          alt="Hospital"
          className="relative w-[40%] h-auto object-contain"
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-[#2D2D2D] text-4xl font-bold mb-6">Create Account</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="text-red-500 text-sm text-center">{errorMessage}</div>
            )}
            <div className="relative">
              <label className="text-sm text-gray-600 mb-1 block">Hospital Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="Enter hospital name"
                />
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <label className="text-sm text-gray-600 mb-1 block">Registration Number</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="Enter hospital registration number"
                />
                <NotebookTabs className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@gmail.com"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <label className="text-sm text-gray-600 mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <label className="text-sm text-gray-600 mb-1 block">Confirm Password</label>
              <div className="relative">
                <input
                  type={showCPassword ? "text" : "password"}
                  required
                  className="w-full px-12 py-3 bg-white rounded-full border border-gray-200"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={() => setShowCPassword(!showCPassword)}
                >
                  {showCPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#7C3AED] text-white rounded-full font-medium  hover:bg-[#6D28D9] transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#FFF5F5] text-gray-500">or</span>
              </div>
            </div>

            <div id="signInDiv" className="flex justify-center"></div>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <Link to="/hospital/login" className="text-[#7C3AED] font-medium">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}