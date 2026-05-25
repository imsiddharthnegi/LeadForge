import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CountUpScoreProps {
  targetScore: number;
}

export function CountUpScore({ targetScore }: CountUpScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let current = 0;
    const increment = Math.max(1, Math.floor(targetScore / 20));
    const interval = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setDisplayScore(targetScore);
        clearInterval(interval);
      } else {
        setDisplayScore(current);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [targetScore]);

  return <motion.span>{displayScore}</motion.span>;
}
