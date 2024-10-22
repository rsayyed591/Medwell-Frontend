import React from 'react';
import QRCode from 'react-qr-code';
import { motion } from 'framer-motion';

export default function ShareWithDoctor() {
  const url = "https://imedwell.vercel.app/";

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center"
            >
              Share Information with Your Doctor
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 text-center"
            >
              Scan this QR code to share your medical information securely with your healthcare provider.
            </motion.p>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              className="flex justify-center mb-6 sm:mb-8"
            >
              <QRCode value={url} size={200} className="w-48 h-48 sm:w-64 sm:h-64" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-center"
            >
              <p className="text-sm text-gray-600 mb-2">Or use this link:</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-300 break-all"
              >
                {url}
              </a>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-6 sm:mt-8 text-center text-gray-600"
        >
          <p className="text-sm sm:text-base">
            Sharing your medical information has never been easier or more secure.
            <br className="hidden sm:inline" />
            Your privacy is our top priority.
          </p>
        </motion.div>
      </div>
    </div>
  );
}