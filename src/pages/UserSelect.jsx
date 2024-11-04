import React from 'react'
import { Link } from 'react-router-dom'
import { Building2, UserRound, Users, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

const CardLink = ({ to, icon: Icon, children, primary = false }) => (
  <Link
    to={to}
    className={`block w-full ${
      primary ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
    } text-center py-3 rounded-lg transition-colors`}
  >
    <div className="flex items-center justify-center gap-2">
      <Icon size={20} />
      <span>{children}</span>
    </div>
  </Link>
)

export default function UserSelect() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Hospital Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">For <span className="text-emerald-600">Hospitals</span></h2>
          <p className="text-gray-600 mb-8">
            Join our network of healthcare providers. Streamline your operations, manage patient records, and enhance healthcare delivery with our comprehensive hospital management system.
          </p>
          <div className="space-y-4">
            <CardLink to="/hospital/login" icon={Building2} primary>
              Hospital Login
            </CardLink>
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/hospital/signup" className="text-emerald-600 hover:underline inline-flex items-center">
                Signup <ChevronRight size={16} />
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Doctors and Patients Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            For <span className="text-blue-600">Doctors</span> and{' '}
            <span className="text-blue-600">Patients</span>
          </h2>
          <p className="text-gray-600 mb-8">
            Connect with healthcare professionals, manage appointments, access medical records, and receive quality care through our integrated healthcare platform.
          </p>
          <div className="space-y-4">
            <CardLink to="/doctor/login" icon={UserRound} primary>
              Doctor Login
            </CardLink>
            <CardLink to="/login" icon={Users}>
              Patient Login
            </CardLink>
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/doctor/signup" className="text-blue-600 hover:underline inline-flex items-center">
                Sign Up as Doctor <ChevronRight size={16} />
              </Link>
              {' or '}
              <Link to="/signup" className="text-blue-600 hover:underline inline-flex items-center">
                Sign Up as Patient <ChevronRight size={16} />
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}