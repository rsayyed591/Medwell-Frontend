import React, { useEffect, useState } from 'react';
import { useSpring, animated, config } from '@react-spring/web';

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState('');

  const fadeOut = useSpring({
    opacity: isLoading ? 1 : 0,
    config: { duration: 500 },
    onRest: () => {
      if (!isLoading) {
        console.log('Loader has finished');
      }
    },
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
        setTimeout(() => setIsLoading(false), 500); // Wait for 500ms before ending the loading state
      }
    }, 200); // Change letter every 200ms

    return () => clearInterval(intervalId);
  }, []);

  return (
    <animated.div style={fadeOut} className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-[#2c5364] via-[#203a43] to-[#0f2027] z-50">
      <animated.div style={logoAnimation} className="mb-4">
        <h1 className="text-white text-6xl font-bold tracking-wider">
          {text}
        </h1>
      </animated.div>
    </animated.div>
  );
}