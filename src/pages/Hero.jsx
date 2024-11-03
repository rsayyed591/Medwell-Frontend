import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Activity, Calendar, FileText, Lock, MessageCircle, DollarSign } from 'lucide-react';
import {Link} from "react-router-dom"
const AnimatedSection = ({ children, className }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const Box3D = ({ children, className }) => (
  <div className={`transform transition-all duration-300 hover:rotate-y-10 hover:rotate-x-10 hover:scale-105 ${className}`}>
    <div className="bg-white rounded-lg shadow-lg p-6 transform preserve-3d perspective-1000">
      {children}
    </div>
  </div>
);

const RollingTestimonials = ({ testimonials }) => {
  const [width, setWidth] = useState(0);
  const containerRef = useRef(null);
  const controls = useAnimation();
  
  useEffect(() => {
    if (containerRef.current) {
      // Calculate the width of a single set of testimonials
      const scrollWidth = containerRef.current.scrollWidth / 2;
      setWidth(scrollWidth);
    }
  }, [testimonials]);

  useEffect(() => {
    if (width > 0) {
      // Start the continuous animation
      controls.start({
        x: -width,
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear"
          }
        }
      });
    }
  }, [controls, width]);

  const handleDrag = (_, info) => {
    controls.stop();
    controls.set({ x: info.point.x % -width });
  };

  const handleDragEnd = (_, info) => {
    const velocity = info.velocity.x;
    const currentPosition = info.point.x % -width;
    
    controls.start({
      x: [currentPosition, -width],
      transition: {
        x: {
          type: "spring",
          stiffness: 400,
          damping: 40,
          restDelta: 0.001,
          restSpeed: 0.001,
        }
      }
    }).then(() => {
      controls.set({ x: 0 });
      controls.start({
        x: -width,
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 15,
            ease: "linear"
          }
        }
      });
    });
  };

  return (
    <div className="overflow-hidden" ref={containerRef}>
      <motion.div
        className="flex"
        animate={controls}
        drag="x"
        dragConstraints={{ left: -width, right: 0 }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ touchAction: "none" }}
      >
        {[...testimonials, ...testimonials].map((testimonial, index) => (
          <motion.div
            key={index}
            className="w-[300px] sm:w-[500px] flex-shrink-0 px-4 mb-8"
            whileHover={{ scale: 1.02 }}
          >
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              <div className="h-full flex flex-col justify-between">
                <p className="text-gray-600 text-base sm:text-lg mb-4">{testimonial.comment}</p>
                <cite className="block text-right font-semibold">- {testimonial.author}</cite>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default function Hero() {
  const testimonials = [
    { comment: "The health tips provided here have been life-changing!", author: "Vivek" },
    { comment: "The articles here are clear and incredibly informative. I trust the advice!", author: "Nishi" },
    { comment: "I've learned so much about preventive care from this site. It's my go-to source.", author: "Rehan" },
    { comment: "Great insights on mental health—easy to understand and implement.", author: "Rohit" },
    { comment: "This site explains complex medical issues in a simple way. Highly recommended!", author: "Azlaan" },
    { comment: "As a fitness enthusiast, the nutrition guides here have been a game-changer.", author: "Shah" },
    { comment: "The expert advice on this platform has improved my family's health choices.", author: "Lavanya" },
    { comment: "The in-depth analysis on medical trends is impressive and reliable.", author: "Bilal" },
    { comment: "I appreciate how the site covers all aspects of health and wellness.", author: "Affan" }
  ];

  return (
    <div className="font-sans text-gray-800">
      <section className="relative h-screen w-full overflow-hidden">
        <img
          src="./hero.jpg"
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
              className="mb-6 font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide text-white"
            >
              MedWell
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="max-w-xs mx-auto text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-white sm:max-w-sm md:max-w-lg lg:max-w-2xl"
            >
              Empowering health, one patient at a time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <button className="px-6 py-3 font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"><Link to="/Dashboard">Get Started</Link></button>
              <button className="px-6 py-3 font-semibold text-blue-500 bg-white rounded-lg border border-blue-500 hover:bg-blue-50 transition">Learn More</button>
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatedSection className="py-20 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">About Us</h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-8 px-4">
          MedWell is committed to providing the best health services. From virtual consultations to advanced health tracking, we're here to support your wellness journey.
        </p>
        <div className="flex flex-wrap justify-center gap-8 px-4">
          {[
            { title: "Report Summarization", description: "Easily distinguish key components of your report" },
            { title: "Patient Management", description: "Organize and manage patient information easily." },
            { title: "Health Tracking", description: "Monitor your health with detailed records." }
          ].map((item, index) => (
            <Box3D key={index} className="w-full sm:w-64">
              <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </Box3D>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 bg-blue-50 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
          {[
            { icon: DollarSign, title: "Cost Tracker", description: "Track your medical expenses." },
            { icon: Calendar, title: "Appointment Scheduling", description: "Easily schedule and manage appointments." },
            { icon: FileText, title: "Medical Records Access", description: "Access and manage your medical records securely." },
            { icon: Activity, title: "Health Monitoring", description: "Track health metrics and improvements." },
            { icon: Lock, title: "Privacy", description: "Ensure your data is private and inaccessible without your consent." },
            { icon: MessageCircle, title: "Personal Helper", description: "Chat with Rajni to get to know your nutrition and calorie needs." }
          ].map((service, index) => (
            <Box3D key={index}>
              <service.icon className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </Box3D>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-20 bg-white">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">What Our Users Say</h2>
        <RollingTestimonials testimonials={testimonials} />
      </AnimatedSection>

      <AnimatedSection className="py-20 bg-blue-50 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Contact Us</h2>
        <form className="max-w-lg mx-auto space-y-4 px-4">
          <input type="text" placeholder="Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="email" placeholder="Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <textarea placeholder="Message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          <button className="w-full px-6 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition">Send Message</button>
        </form>
      </AnimatedSection>
    </div>
  );
}