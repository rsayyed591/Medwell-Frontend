import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Link, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Chat from "../Chatbots/Chat"
import { google_ngrok_url } from '../../utils/global';

export default function ShareWithDoctor() {
  const [scanResult, setScanResult] = useState('');
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let scanner;
    if (isScannerVisible) {
      scanner = new Html5QrcodeScanner('reader', { 
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      });
      
      scanner.render(success, error);

      function success(result) {
        scanner.clear();
        setScanResult(result);
        setIsScannerVisible(false);
        handleProvideAccess(result);
      }

      function error(err) {
        console.error(err);
      }
    }

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [isScannerVisible]);

  const handleProvideAccess = async (encData) => {
    setStatus(null);
    setMessage('');

    try {
      const response = await fetch(google_ngrok_url+'/patient/provide_access/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('Token')}` 
        },
        body: JSON.stringify({"enc_data": encData })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.mssg);
      } else {
        setStatus('error');
        setMessage(data.mssg || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden border border-blue-100"
        >
          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold text-blue-800 mb-4 sm:mb-6 text-center"
            >
              Share Information with Your Doctor
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-base sm:text-lg text-blue-600 mb-6 sm:mb-8 text-center"
            >
              Scan a QR code to share your medical information securely with your healthcare provider.
            </motion.p>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              className="flex flex-col items-center mb-6 sm:mb-8"
            >
              {isScannerVisible ? (
                <div id="reader" className="w-full max-w-sm border-4 border-blue-200 rounded-lg overflow-hidden"></div>
              ) : (
                <button
                  onClick={() => setIsScannerVisible(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full flex items-center transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                >
                  <Camera className="mr-2" />
                  Scan QR Code
                </button>
              )}
            </motion.div>

            {scanResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-center mb-6 bg-blue-50 p-4 rounded-lg"
              >
                <p className="text-lg font-semibold mb-2 text-blue-800">QR DATA:</p>
                <p className="text-blue-600 break-all flex items-center justify-center">
                  <Link className="mr-2" />
                  {scanResult}
                </p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-center"
            >
            </motion.div>

            {status && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`mt-4 p-4 rounded-md ${
                  status === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    {status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-6 sm:mt-8 text-center text-blue-600 bg-blue-50 p-4 rounded-lg shadow-md"
        >
          <div className="flex items-center justify-center mb-2">
            <Shield className="text-blue-500 mr-2" />
            <p className="text-lg font-semibold">Secure Information Sharing</p>
          </div>
          <p className="text-sm sm:text-base">
            Sharing your medical information has never been easier or more secure.
            <br className="hidden sm:inline" />
            Your privacy is our top priority.
          </p>
        </motion.div>
      </div>
      <div className="mt-8">
        <Chat />
      </div>
    </div>
  );
}