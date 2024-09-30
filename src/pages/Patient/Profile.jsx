import { motion } from 'framer-motion'
import { Edit, Save } from 'lucide-react'
import Patient from './../../../public/patient.png'

export default function Profile({ patientInfo, isEditMode, setIsEditMode, handleInputChange, handleSave }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => (isEditMode ? handleSave() : setIsEditMode(true))}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          {isEditMode ? (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save
            </>
          ) : (
            <>
              <Edit className="w-5 h-5 mr-2" />
              Edit Profile
            </>
          )}
        </motion.button>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center mb-6"
      >
        <img src={Patient} alt="Patient" className="w-32 h-32 rounded-full mr-6" />
        <div>
          {isEditMode ? (
            <motion.input
              type="text"
              name="name"
              value={patientInfo.name}
              onChange={handleInputChange}
              className="text-2xl font-bold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            />
          ) : (
            <h2 className="text-2xl font-bold text-gray-800">{patientInfo.name}</h2>
          )}
          <p className="text-gray-600">Patient ID: {patientInfo.id}</p>
        </div>
      </motion.div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {Object.entries(patientInfo).map(([key, value]) => (
          key !== 'name' && key !== 'id' && (
            <motion.div
              key={key}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <p className="text-gray-600 font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              {isEditMode ? (
                <motion.input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  className="w-full text-gray-800 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              ) : (
                <p className="text-gray-800">{value}</p>
              )}
            </motion.div>
          )
        ))}
      </motion.div>
    </motion.div>
  )
}