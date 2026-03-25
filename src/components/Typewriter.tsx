import { useState, useEffect } from "react";

interface TypewriterProps {
  text: string;
  delay?: number;
}

export function Typewriter({ text, delay = 50 }: TypewriterProps) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return (
    <span className="flex items-center justify-center">
      {currentText}
      <span 
        className={`inline-block w-1.5 h-[1em] bg-primary ml-1.5 rounded-sm ${currentIndex < text.length ? 'animate-pulse' : 'animate-pulse opacity-50'}`} 
      />
    </span>
  );
}
