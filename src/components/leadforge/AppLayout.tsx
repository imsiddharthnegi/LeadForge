import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { BackgroundCanvas } from "./BackgroundCanvas";
import { ApiKeyBanner } from "./ApiKeyBanner";

export function AppLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-[hsl(var(--bg-void))] text-foreground relative overflow-x-hidden">
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
