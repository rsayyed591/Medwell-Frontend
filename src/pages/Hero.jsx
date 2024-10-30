import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, FileText, Lock, MessageCircle, DollarSign } from 'lucide-react';
import BG from './../../public/hero.jpg';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="font-sans text-gray-800">
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src={BG}
          alt="Medical background"
          className="absolute inset-0 h-full w-full object-cover filter"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6 font-serif text-5xl font-bold tracking-wide text-white sm:text-6xl md:text-7xl lg:text-8xl"
            >
              MedWell
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="max-w-xs mx-auto text-lg font-medium text-white sm:max-w-sm sm:text-xl md:max-w-lg md:text-2xl lg:max-w-2xl"
            >
              Empowering health, one patient at a time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="mt-8 flex justify-center space-x-4"
            >
              <Link to="/dashboard">
                <button className="px-6 py-3 font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">Get Started</button>
              </Link>
              <button className="px-6 py-3 font-semibold text-blue-500 bg-white rounded-lg border border-blue-500 hover:bg-blue-50 transition">Learn More</button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-gray-800 mb-4"
        >
          About Us
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-gray-600 mb-8"
        >
          MedWell is committed to providing the best health services. From virtual consultations to advanced health tracking, we're here to support your wellness journey.
        </motion.p>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { title: "Report Summarization", description: "Easily distinguish key components of your report" },
            { title: "Patient Management", description: "Organize and manage patient information easily." },
            { title: "Health Tracking", description: "Monitor your health with detailed records." }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="w-64 p-4 bg-gray-100 rounded-lg shadow-md"
            >
              <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-blue-50 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-gray-800 mb-4"
        >
          Our Services
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: DollarSign, title: "Cost Tracker", description: "Track your medical expenses." },
            { icon: Calendar, title: "Appointment Scheduling", description: "Easily schedule and manage appointments." },
            { icon: FileText, title: "Medical Records Access", description: "Access and manage your medical records securely." },
            { icon: Activity, title: "Health Monitoring", description: "Track health metrics and improvements." },
            { icon: Lock, title: "Privacy", description: "Ensure your data is private and inaccessible without your consent." },
            { icon: MessageCircle, title: "Personal Helper", description: "Chat with Rajni to get to know your nutrition and calorie needs." }
          ].map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="p-6 bg-white rounded-lg shadow-lg"
            >
              <service.icon className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-white text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-gray-800 mb-8"
        >
          What Our Users Say
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { quote: "Andheri mai auto nahi hai", author: "Vivek" },
            { quote: "Nabila", author: "Nishi" }
          ].map((testimonial, index) => (
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="w-64 p-4 bg-gray-100 rounded-lg shadow-md"
            >
              <p className="text-gray-600">"{testimonial.quote}"</p>
              <cite className="block mt-2 font-semibold">- {testimonial.author}</cite>
            </motion.blockquote>
          ))}
        </div>
      </section>

      <section className="py-20 bg-blue-50 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-gray-800 mb-8"
        >
          Contact Us
        </motion.h2>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-lg mx-auto space-y-4"
        >
          <input type="text" placeholder="Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="email" placeholder="Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <textarea placeholder="Message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          <button className="w-full px-6 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition">Send Message</button>
        </motion.form>
      </section>
    </div>
  );
}