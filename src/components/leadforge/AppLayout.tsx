import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { BackgroundCanvas } from "./BackgroundCanvas";
import { ApiKeyBanner } from "./ApiKeyBanner";

export function AppLayout() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleEnd = () => setIsLoading(false);

    // Simulate page load progress
    window.addEventListener("beforeunload", handleStart);
    
    // Auto-complete after a delay
    const timer = setTimeout(() => setIsLoading(false), 500);
    
    return () => {
      window.removeEventListener("beforeunload", handleStart);
      clearTimeout(timer);
    };
  }, [location]);

  return (
    <div className="min-h-screen bg-[hsl(var(--bg-void))] text-foreground relative overflow-x-hidden">
      {/* Animated gradient progress line */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-brand via-violet-brand to-cyan-brand z-50"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isLoading ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ originX: 0 }}
      />
      
      <BackgroundCanvas />
      <Sidebar />
      <div className="relative md:ml-16 z-10">
        <ApiKeyBanner />
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
