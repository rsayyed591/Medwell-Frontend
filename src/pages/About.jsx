import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Heart, Brain, Stethoscope, Microscope } from "lucide-react";

const teamMembers = [
  {
    name: "Vivek Chouhan",
    role: "Backend Developer",
    image: '/Vivek.jpg',
    github: "https://github.com/vivi",
    linkedin: "https://linkedin.com/in/vivi",
  },
  {
    name: "Nishikant Raut",
    role: "FullStack Developer",
    image: '/Nishi.jpg',
    github: "https://github.com/Nishikant00",
    linkedin: "https://linkedin.com/in/nishi",
  },
  {
    name: "Rehan Sayyed",
    role: "FullStack Developer",
    image: '/Rehan.jpg',
    github: "https://github.com/rsayyed591",
    linkedin: "https://linkedin.com/in/rehan42",
  },
  {
    name: "Rohit Deshmukh",
    role: "Full stack Developer",
    image: '/Rohit.jpg',
    github: "https://github.com/ardie",
    linkedin: "https://linkedin.com/in/rohit",
  },
];

export default function About() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 text-center text-3xl font-bold tracking-tight text-blue-800 sm:text-4xl md:text-5xl"
        >
          About MedWell
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mb-12 max-w-3xl text-center text-base sm:text-lg text-blue-600"
        >
          At MedWell, we're dedicated to revolutionizing healthcare through artificial intelligence. Our team of medical professionals, AI researchers, and technology experts work tirelessly to develop cutting-edge solutions that improve patient care, streamline diagnoses, and empower healthcare providers with data-driven insights.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8"
        >
          <div className="flex flex-col items-center">
            <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-red-500 mb-2" />
            <p className="text-blue-700 font-semibold text-center text-sm sm:text-base">Improved Patient Care</p>
          </div>
          <div className="flex flex-col items-center">
            <Brain className="h-10 w-10 sm:h-12 sm:w-12 text-purple-500 mb-2" />
            <p className="text-blue-700 font-semibold text-center text-sm sm:text-base">AI-Powered Diagnostics</p>
          </div>
          <div className="flex flex-col items-center">
            <Stethoscope className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mb-2" />
            <p className="text-blue-700 font-semibold text-center text-sm sm:text-base">Empowering Healthcare Providers</p>
          </div>
          <div className="flex flex-col items-center">
            <Microscope className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 mb-2" />
            <p className="text-blue-700 font-semibold text-center text-sm sm:text-base">Cutting-Edge Research</p>
          </div>
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-8 text-center text-2xl sm:text-3xl font-bold text-blue-800"
        >
          Meet Our Team
        </motion.h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="flex flex-col items-center rounded-lg bg-white p-4 sm:p-6 text-center shadow-lg transition-all hover:shadow-xl"
            >
              <img
                src={member.image}
                alt={member.name}
                className="mb-4 h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-blue-200"
                width={128}
                height={128}
              />
              <h3 className="mb-1 text-lg sm:text-xl font-semibold text-blue-800">{member.name}</h3>
              <p className="mb-4 text-xs sm:text-sm text-blue-600">{member.role}</p>
              <div className="flex space-x-4">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Github className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="sr-only">GitHub</span>
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Linkedin className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}