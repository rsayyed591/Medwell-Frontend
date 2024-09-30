import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export const AnimatedCard = ({ children, index, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.5, delay: index * 0.1 + delay }}
    >
      {children}
    </motion.div>
  )
}

export const CircularMetric = ({ value, total, label, icon: Icon, color }) => {
  const percentage = (value / total) * 100;
  return (
    <div className="flex items-center space-x-6">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e6e6e6"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-12 h-12 text-gray-600" />
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold" style={{ color }}>
          {value}
        </div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  );
};