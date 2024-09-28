import React, { useState, useEffect } from 'react'
import { EyeIcon, EyeOffIcon, Heart, Stethoscope, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom' // Adjust Link import as per your routing
import { google_ngrok_url } from '../utils/global';
export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  useEffect(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_KEY,
      callback: handleCallbackResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    );
  }, []);
  const handleCallbackResponse = (response) => {
    const formData = new FormData();
    formData.append("token", response.credential);

    fetch(`${google_ngrok_url}/login/`, {
      method: "POST",
      body: formData,  
    })
      .then(res => res.json())
      .then(data => {
        console.log("Backend response: ", data);
        localStorage.setItem("User", JSON.stringify(data));
      })
      .catch(err => console.error("Error in Google login: ", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email",email);
    formData.append("password1",password);

    fetch(`${ngrok_url}/auth/register_user/`, {
      method: "POST",
      body: formData,  
    })
      .then(res => res.json())
      .then(data => {
        console.log("Backend response: ", data);
        localStorage.setItem("Bearer", JSON.stringify(data.access_token));
      })
      .catch(err => console.error("Error in SignUp: ", err));
    
  }

  return (
    <div className="flex min-h-screen bg-blue-50 items-center justify-center p-4">
      <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl max-w-5xl w-full">
        <div className="flex flex-col md:flex-row">
          {/* Left Section */}
          <div className="bg-blue-100 p-12 md:w-1/2 relative flex flex-col justify-between">
            <div className="text-2xl text-gray-800 font-semibold mb-12">
              We at MedWell are<br />always fully focused on<br />helping you.
            </div>
            <div className="flex items-center justify-center flex-grow">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-blue-200 rounded-full"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4">
                    <Heart size={64} className="text-blue-600" />
                    <Stethoscope size={64} className="text-blue-600" />
                    <UserPlus size={64} className="text-blue-600" />
                    <Heart size={64} className="text-blue-600" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="p-12 md:w-1/2">
            <h2 className="text-3xl font-bold text-center mb-8">Log In</h2>
            <div id="signInDiv" className="flex justify-center mb-8">
              <button className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Log in with Google
              </button>
            </div>
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
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
              Don&apos;t have an account? <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
