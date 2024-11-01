import React from 'react'
import { Link } from 'react-router-dom'
import { Building2, UserRound, Users } from 'lucide-react'

export default function UserSelect() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hospital Section */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-4xl font-bold mb-4">For <span className="text-emerald-600">Hospitals</span></h2>
          <p className="text-gray-600 mb-8">
            Join our network of healthcare providers. Streamline your operations, manage patient records, and enhance healthcare delivery with our comprehensive hospital management system.
          </p>
          <div className="space-y-4">
            <Link
              to="/hospital/login"
              className="block w-full bg-emerald-600 text-white text-center py-3 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <Building2 size={20} />
                <span>Hospital Login</span>
              </div>
            </Link>
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/hospital/signup" className="text-emerald-600 hover:underline">
                Signup
              </Link>
            </p>
          </div>
        </div>

        {/* Doctors and Patients Section */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-4xl font-bold mb-4">
            For <span className="text-blue-600">Doctors</span> and{' '}
            <span className="text-blue-600">Patients</span>
          </h2>
          <p className="text-gray-600 mb-8">
            Connect with healthcare professionals, manage appointments, access medical records, and receive quality care through our integrated healthcare platform.
          </p>
          <div className="space-y-4">
            <Link
              to="/doctor/login"
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <UserRound size={20} />
                <span>Doctor Login</span>
              </div>
            </Link>
            <Link
              to="/login"
              className="block w-full bg-blue-100 text-blue-600 text-center py-3 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <Users size={20} />
                <span>Patient Login</span>
              </div>
            </Link>
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/doctor/signup" className="text-blue-600 hover:underline">
                Sign Up as Doctor
              </Link>
              {' or '}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign Up as Patient
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}