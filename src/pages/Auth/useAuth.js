import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ngrok_url, google_ngrok_url } from '../../utils/global'

export const useAuth = () => {
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const notifyAuthStateChange = () => {
    window.dispatchEvent(new Event('authStateChange'))
  }
  const login = async (email, password, role) => {
    setErrorMessage('')
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    try {
      const response = await fetch(`${ngrok_url}/auth/login_user/`, {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      if (data.mssg === 'Incorrect Credentials' && data.status === 0) {
        setErrorMessage('Incorrect email or password. Please try again.')
        return false
      } else {
        localStorage.setItem("Token", data.access_token)
        localStorage.setItem("Role", role)
        notifyAuthStateChange()
        navigate("/patient")
        return true
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.")
      return false
    }
  }

  const signup = async (email, password, confirmPassword, fullName, role) => {
    setErrorMessage('')
    
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password1", password)
    formData.append("password2", confirmPassword)
    formData.append("role", role)
    formData.append("name", fullName)

    try {
      const response = await fetch(`${ngrok_url}/auth/register_user/`, {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      if (data.status === false) {
        setErrorMessage(data.mssg)
        return false
      } else {
        localStorage.setItem("Token", data.access_token)
        localStorage.setItem("Role",role)
        notifyAuthStateChange()
        navigate("/patient")
        return true
      }
    } catch (error) {
      setErrorMessage("An error occurred during sign-up. Please try again.")
      return false
    }
  }

  const googleLogin = async (credential,role) => {
    setErrorMessage('')
    const formData = new FormData()
    formData.append("token", credential)
    formData.append("role", role)

    try {
      const response = await fetch(`${google_ngrok_url}/auth/google_login/`, {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      
      localStorage.setItem("Token", data.access)
      localStorage.setItem("Role", role)
      notifyAuthStateChange()
      navigate("/patient")
      return true
    } catch (error) {
      setErrorMessage("An error occurred during Google login. Please try again.")
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("Token")
    localStorage.removeItem("Role")
    notifyAuthStateChange()
    navigate("/auth")
  }

  const checkAuth = () => {
    const token = localStorage.getItem("Token")
    if (token) {
      navigate("/patient")
      return true
    }
    return false
  }

  return {
    login,
    signup,
    googleLogin,
    logout,
    checkAuth,
    errorMessage,
    setErrorMessage
  }
}