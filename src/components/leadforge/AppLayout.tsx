import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { BackgroundCanvas } from "./BackgroundCanvas";
import { ApiKeyBanner } from "./ApiKeyBanner";

export function AppLayout() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

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

  // Track actual sidebar collapse state from data attribute
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebarElement = document.querySelector("[data-state]");
      if (sidebarElement) {
        const state = sidebarElement.getAttribute("data-state");
        setIsSidebarCollapsed(state === "collapsed");
      }
    };

    // Check initial state
    checkSidebarState();

    // Set up observer to watch for state changes
    const observer = new MutationObserver(checkSidebarState);
    const sidebarElement = document.querySelector("[data-state]");
    if (sidebarElement) {
      observer.observe(sidebarElement, { attributes: true, attributeFilter: ["data-state"] });
    }

    return () => observer.disconnect();
  }, []);

  // Close mobile drawer on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        const hamburger = document.querySelector("[data-hamburger]");
        if (hamburger && !hamburger.contains(e.target as Node)) {
          setIsMobileDrawerOpen(false);
        }
      }
    };

    if (isMobileDrawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobileDrawerOpen]);

  // Close drawer on navigation
  useEffect(() => {
    setIsMobileDrawerOpen(false);
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
      <div data-sidebar>
        <Sidebar />
      </div>

      {/* Mobile hamburger menu */}
      <motion.button
        data-hamburger
        onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
        className="md:hidden fixed top-5 left-5 z-50 p-2 rounded-input hover:bg-white/[0.08] transition-colors"
        aria-label="Toggle sidebar"
      >
        {isMobileDrawerOpen ? (
          <X size={24} className="text-foreground" strokeWidth={1.5} />
        ) : (
          <Menu size={24} className="text-foreground" strokeWidth={1.5} />
        )}
      </motion.button>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-black/30 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer sidebar */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <motion.div
            ref={drawerRef}
            className="md:hidden fixed left-0 top-0 bottom-0 z-40 w-[220px] flex flex-col py-5 px-3 bg-[hsl(var(--bg-void))]"
            style={{ borderRight: "1px solid hsl(0 0% 100% / 0.07)" }}
            initial={{ x: -220 }}
            animate={{ x: 0 }}
            exit={{ x: -220 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="relative z-10 transition-[margin-left] duration-200 ease-linear"
        style={{
          marginLeft: isSidebarCollapsed ? 64 : 220,
        }}
      >
        <ApiKeyBanner />
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          className="md:pb-0 pb-24"
        >
          <Outlet />
        </motion.div>
      </motion.div>

      <BottomNav />
    </div>
  );
}
