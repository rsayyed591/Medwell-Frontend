import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MessageSquare, PenTool, Users, FileText, Calendar, Lock, MessageCircle, Activity, DollarSign } from 'lucide-react';
import { Link } from "react-router-dom";

// Access environment variables
const EMAIL_PUBLIC_KEY = import.meta.env.VITE_EMAIL_PUBLIC_KEY;
const EMAIL_TEMPLATE_ID = import.meta.env.VITE_EMAIL_TEMPLATE_ID;

const AnimatedSection = ({ children, className }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  React.useEffect(() => {
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

const ServiceCard = ({ icon: Icon, title, description }) => (
  <div className="bg-[#FFFFFF] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center">
    <div className="w-16 h-16 mb-6 rounded-full bg-[#AEDFF7] flex items-center justify-center">
      <Icon className="w-8 h-8 text-[#005B96]" />
    </div>
    <h3 className="text-xl mb-3 text-[#005B96] font-semibold">{title}</h3>
    <p className="text-[#003E5C] mb-6 leading-relaxed">{description}</p>
    <button className="mt-auto px-6 py-2 text-[#005B96] border border-[#AEDFF7] rounded-full hover:bg-[#AEDFF7] transition-colors duration-300">
      Read More
    </button>
  </div>
);

const RollingTestimonials = ({ testimonials }) => {
  const [width, setWidth] = useState(0);
  const containerRef = useRef(null);
  const controls = useAnimation();
  
  useEffect(() => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.scrollWidth / 2;
      setWidth(scrollWidth);
    }
  }, [testimonials]);

  useEffect(() => {
    if (width > 0) {
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
            <div className="bg-[#FFFFFF] rounded-lg shadow-lg p-6 h-full border border-[#AEDFF7]">
              <div className="h-full flex flex-col justify-between">
                <p className="text-[#005B96] text-base sm:text-lg mb-4">{testimonial.comment}</p>
                <cite className="block text-right font-semibold text-[#003E5C]">- {testimonial.author}</cite>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default function Hero() {
  const [formStatus, setFormStatus] = useState('');
  
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

  const sendEmail = (e) => {
    e.preventDefault();
    setFormStatus('Sending...');

    const templateParams = {
      user_name: e.target.user_name.value,
      user_email: e.target.user_email.value,
      message: e.target.message.value,
    };

    emailjs.send(
      'default_service',
      EMAIL_TEMPLATE_ID,
      templateParams,
      EMAIL_PUBLIC_KEY
    )
      .then((result) => {
        setFormStatus('Message sent successfully!');
        e.target.reset();
      }, (error) => {
        setFormStatus('Failed to send message. Please try again.');
        console.error('EmailJS Error:', error);
      });
  };

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <AnimatedSection className="py-12 lg:py-24 lg:px-12 w-full overflow-hidden bg-[#F5F5F5]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-6/12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Great <span className="text-[#8FCB9B]">Healthcare</span> is{' '}
                  <br className="hidden sm:block" />
                  <span className="mt-2 sm:mt-4 inline-block">built by great <span className="text-[#005B96]">teams</span></span>
                </h1>
                <p className="text-[#003E5C] text-lg max-w-xl leading-relaxed">
                  We help build and manage a team of world-class healthcare professionals
                  to bring your wellness vision to life
                </p>
                <Link
                  to="/auth"
                  className="w-full lg:w-auto px-8 py-3 bg-[#005B96] text-[#FFFFFF] rounded-lg hover:bg-[#003E5C] transition-colors focus:outline-none inline-block text-center">
                  Let's get started!
                </Link>
              </motion.div>
            </div>
            <div className="lg:w-6/12">
              <motion.img
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                src="/HealthcareGroup.png"
                alt="Healthcare Team"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Services Section */}
      <AnimatedSection className="py-24 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#005B96] text-center mb-16">
            Our Features & Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <ServiceCard 
              icon={MessageSquare}
              title="Communication"
              description="Connect with healthcare providers seamlessly through our integrated messaging platform."
            />
            <ServiceCard 
              icon={PenTool}
              title="Smart Design"
              description="User-friendly interface designed to make your healthcare journey smoother."
            />
            <ServiceCard 
              icon={Users}
              title="Happy Customers"
              description="Join thousands of satisfied users managing their health effectively."
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Features Grid */}
      <AnimatedSection className="py-24 bg-[#FFFFFF]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#005B96] text-center mb-16">
            Additional Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: DollarSign, title: "Cost Tracking", description: "Monitor and manage your healthcare expenses efficiently" },
              { icon: Calendar, title: "Smart Scheduling", description: "Book and manage appointments with ease" },
              { icon: FileText, title: "Digital Records", description: "Access your medical history anytime, anywhere" },
              { icon: Activity, title: "Health Monitoring", description: "Track your vital signs and health metrics" },
              { icon: Lock, title: "Secure Platform", description: "Your data is protected with enterprise-grade security" },
              { icon: MessageCircle, title: "24/7 Support", description: "Get help whenever you need it" }
            ].map((feature, index) => (
              <div key={index} className="bg-[#FFFFFF] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <feature.icon className="w-10 h-10 text-[#005B96] mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-[#005B96]">{feature.title}</h3>
                <p className="text-[#003E5C]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection className="py-24 bg-[#AEDFF7]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#005B96] text-center mb-16">
            What Our Users Say
          </h2>
          <RollingTestimonials testimonials={testimonials} />
        </div>
      </AnimatedSection>

      {/* Contact Section */}
      <AnimatedSection className="py-24 bg-[#FFFFFF]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#005B96] text-center mb-16">
            Get in Touch
          </h2>
          <form onSubmit={sendEmail} className="max-w-lg mx-auto space-y-6">
            <input 
              type="text" 
              name="user_name" 
              placeholder="Your Name" 
              className="w-full px-4 py-3 rounded-lg border border-[#AEDFF7] focus:outline-none focus:ring-2 focus:ring-[#005B96]" 
              required 
            />
            <input 
              type="email" 
              name="user_email" 
              placeholder="Your Email" 
              className="w-full px-4 py-3 rounded-lg border border-[#AEDFF7] focus:outline-none focus:ring-2 focus:ring-[#005B96]" 
              required 
            />
            <textarea 
              name="message" 
              placeholder="Your Message" 
              rows={4} 
              className="w-full px-4 py-3 rounded-lg border border-[#AEDFF7] focus:outline-none focus:ring-2 focus:ring-[#005B96]" 
              required 
            />
            <button 
              type="submit" 
              className="w-full px-6 py-3 text-[#FFFFFF] bg-[#005B96] rounded-lg hover:bg-[#003E5C] transition-colors duration-300"
            >
              Send Message
            </button>
            {formStatus && (
              <p className={`text-${formStatus.includes('success') ? '[#8FCB9B]' : '[#FF0000]'} text-center`}>
                {formStatus}
              </p>
            )}
          </form>
        </div>
      </AnimatedSection>
    </div>
  );
}

