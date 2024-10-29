import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <img
        src="/hero.jpg"
        alt="Medical background"
        className="absolute inset-0 h-full w-full object-cover filter"
        // className="absolute inset-0 h-full w-full object-cover filter blur-sm"
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
            Artificial Intelligence: Revolutionizing healthcare, one algorithm at a time.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
