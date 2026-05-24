import { LayoutDashboard, Sparkles, Bookmark, BarChart3, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const items = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { id: "generate", label: "Generate", icon: Sparkles, to: "/" },
  { id: "saved", label: "Saved Leads", icon: Bookmark, to: "/saved" },
  { id: "analytics", label: "Analytics", icon: BarChart3, to: "/analytics" },
];

export function Sidebar() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const userName = "Marcus Kim";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const sidebarWidth = isExpanded ? 220 : 64;

  return (
    <motion.aside
      className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 flex-col py-5 px-3 bg-[hsl(var(--bg-void))]"
      style={{ 
        borderRight: "1px solid hsl(0 0% 100% / 0.07)",
        width: sidebarWidth,
      }}
      animate={{ width: sidebarWidth }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-2 mb-6">
        <div className="w-10 h-10 shrink-0 grid place-items-center rounded-lg bg-gradient-to-br from-[hsl(var(--accent-cyan)/0.2)] to-[hsl(var(--accent-cyan)/0.05)] border border-[hsl(var(--accent-cyan)/0.3)]">
          <span className="font-display font-bold text-cyan-brand text-lg leading-none">LF</span>
        </div>
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              key="logo-text"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 min-w-0 overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-semibold text-foreground tracking-tight whitespace-nowrap">LeadForge</span>
                <span className="px-1.5 py-0.5 rounded-badge text-[8px] font-mono font-bold tracking-wider bg-cyan-brand/10 text-cyan-brand border border-cyan-brand/25 shrink-0">
                  v1.0
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0 mb-6" />

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = location.pathname === it.to;
          return (
            <Tooltip key={it.id} delayDuration={300}>
              <TooltipTrigger asChild>
                <NavLink
                  to={it.to}
                  className={`group relative flex items-center justify-center gap-3 h-9 rounded-input transition-all ${
                    isExpanded ? "px-3" : "px-0"
                  } ${
                    isActive
                      ? "text-cyan-brand"
                      : "text-[hsl(var(--text-secondary))] hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-bg"
                      className="absolute inset-0 rounded-input bg-cyan-brand/8 -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="active-border"
                      className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-cyan-brand"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon size={20} strokeWidth={1.5} className="shrink-0" />
                  <AnimatePresence mode="wait">
                    {isExpanded && (
                      <motion.span
                        key={`label-${it.id}`}
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm font-medium truncate whitespace-nowrap"
                      >
                        {it.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              </TooltipTrigger>
              {!isExpanded && (
                <TooltipContent side="right" className="ml-2">
                  {it.label}
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="flex flex-col gap-1 pt-4 border-t border-white/[0.07]">
        {/* Profile Card */}
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              className="flex items-center justify-center gap-3 px-2.5 py-2 rounded-input bg-white/[0.02] hover:bg-white/[0.04] transition-colors w-full"
              onClick={() => location.pathname !== "/settings"}
            >
              <div className="w-8 h-8 rounded-badge bg-gradient-to-br from-cyan-brand/30 to-violet-brand/20 grid place-items-center shrink-0 border border-cyan-brand/20">
                <span className="text-xs font-bold text-cyan-brand">{userInitials}</span>
              </div>
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.div
                    key="user-text"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 min-w-0 text-left"
                  >
                    <p className="text-xs font-medium text-foreground truncate">{userName}</p>
                    <p className="text-[10px] text-[hsl(var(--text-muted))]">You</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </TooltipTrigger>
          {!isExpanded && (
            <TooltipContent side="right" className="ml-2">
              {userName}
            </TooltipContent>
          )}
        </Tooltip>

        {/* Settings Link */}
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <NavLink
              to="/settings"
              className={`flex items-center justify-center gap-3 px-3 h-9 rounded-input text-sm transition-all ${
                isExpanded ? "" : "px-0"
              } ${
                location.pathname === "/settings"
                  ? "text-cyan-brand bg-cyan-brand/8"
                  : "text-[hsl(var(--text-secondary))] hover:text-foreground hover:bg-white/[0.04]"
              }`}
            >
              <Settings size={20} strokeWidth={1.5} className="shrink-0" />
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.span
                    key="settings-label"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Settings
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          </TooltipTrigger>
          {!isExpanded && (
            <TooltipContent side="right" className="ml-2">
              Settings
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </motion.aside>
  );
}
