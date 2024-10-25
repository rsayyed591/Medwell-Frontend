import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin } from "lucide-react";


const teamMembers = [
    {
      name: "Vivek Chouhan",
      role: "Backend Developer",
      image: './../../public/Vivek.jpg',
      github: "https://github.com/vivi",
      linkedin: "https://linkedin.com/in/vivi",
    },
    {
      name: "Nishikant Raut",
      role: "FullStack Developer",
      image: './../../public/Nishi.jpg',
      github: "https://github.com/Nishikant00",
      linkedin: "https://linkedin.com/in/nishi",
    },
    {
      name: "Rehan Sayyed",
      role: "FullStack Developer",
      image: './../../public/Rehan.jpg',
      github: "https://github.com/rsayyed591",
      linkedin: "https://linkedin.com/in/rehan42",
    },
    {
      name: "Rohit Deshmukh",
      role: "UX Designer",
      image: './../../public/Rohit.jpg',
      github: "https://github.com/ardie",
      linkedin: "https://linkedin.com/in/rohit",
    },
  ]
  

export default function About() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#2c5364] via-[#203a43] to-[#0f2027]">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          About MedWell
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mb-16 max-w-3xl text-center text-lg text-gray-300"
        >
          At MedWell, we're dedicated to revolutionizing healthcare through artificial intelligence. Our team of medical professionals, AI researchers, and technology experts work tirelessly to develop cutting-edge solutions that improve patient care, streamline diagnoses, and empower healthcare providers with data-driven insights.
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12 text-center text-3xl font-bold text-white"
        >
          Meet Our Team
        </motion.h2>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="flex flex-col items-center rounded-lg bg-white bg-opacity-10 p-6 text-center shadow-lg transition-all hover:bg-opacity-20 hover:shadow-xl"
            >
              <img
                src={member.image}
                alt={member.name}
                className="mb-4 h-32 w-32 rounded-full object-cover"
                width={128}
                height={128}
              />
              <h3 className="mb-1 text-xl font-semibold text-white">{member.name}</h3>
              <p className="mb-4 text-sm text-gray-400">{member.role}</p>
              <div className="flex space-x-4">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github className="h-6 w-6" />
                  <span className="sr-only">GitHub</span>
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="h-6 w-6" />
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