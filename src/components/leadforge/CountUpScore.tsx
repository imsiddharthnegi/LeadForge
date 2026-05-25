import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CountUpScoreProps {
  targetScore: number;
  duration?: number; // milliseconds, default 600ms
}

export function CountUpScore({ targetScore, duration = 600 }: CountUpScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const animationInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const eased = progress < 0.5 
        ? 2 * progress * progress 
        : -1 + (4 - 2 * progress) * progress;
      
      const current = Math.round(eased * targetScore);
      setDisplayScore(current);

      if (progress >= 1) {
        clearInterval(animationInterval);
        setDisplayScore(targetScore);
      }
    }, 16); // ~60fps

    return () => clearInterval(animationInterval);
  }, [targetScore, duration]);

  return <motion.span>{displayScore}</motion.span>;
}
