import React, { useEffect, useState } from 'react';
import { useSpring, animated, config } from '@react-spring/web';

export default function Loader({ onLoadingComplete }) {
  const [text, setText] = useState('');

  const slideUp = useSpring({
    from: { transform: 'translateY(0%)' },
    to: { transform: 'translateY(-100%)' },
    config: { duration: 500 },
    delay: 2500, // Delay the slide up animation
    onRest: onLoadingComplete,
  });

  const logoAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.5)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: config.molasses,
  });

  useEffect(() => {
    const fullText = 'MEDWELL';
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 200); // Change letter every 200ms

    return () => clearInterval(intervalId);
  }, []);

  return (
    <animated.div style={slideUp} className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-[#2c5364] via-[#203a43] to-[#0f2027] z-50">
      <animated.div style={logoAnimation} className="mb-4">
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider">
          {text}
        </h1>
      </animated.div>
    </animated.div>
  );
}