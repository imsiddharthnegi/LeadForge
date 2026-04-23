import { LayoutDashboard, Sparkles, Bookmark, BarChart3, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const items = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { id: "generate", label: "Generate", icon: Sparkles, to: "/" },
  { id: "saved", label: "Saved Leads", icon: Bookmark, to: "/saved" },
  { id: "analytics", label: "Analytics", icon: BarChart3, to: "/analytics" },
  { id: "settings", label: "Settings", icon: Settings, to: "/settings" },
];

export function Sidebar() {
  const [hover, setHover] = useState(false);
  const expanded = hover;
  const location = useLocation();

  return (
    <motion.aside
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      animate={{ width: expanded ? 220 : 64 }}
      transition={{ type: "spring", stiffness: 280, damping: 30 }}
      className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 flex-col py-4 px-3 glass-strong overflow-hidden"
      style={{ borderRight: "1px solid hsl(0 0% 100% / 0.06)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-10 mt-1">
        <div className="relative w-10 h-10 shrink-0 grid place-items-center rounded-xl bg-[hsl(var(--accent-cyan)/0.08)] border border-[hsl(var(--accent-cyan)/0.25)]">
          <span className="font-display font-bold text-cyan-brand text-lg leading-none">LF</span>
          <motion.span
            className="absolute inset-0 rounded-xl"
            style={{ boxShadow: "0 0 0 1px hsl(var(--accent-cyan) / 0.4)" }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.08, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        {expanded && (
          <motion.span
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            className="font-display text-base font-semibold tracking-tight whitespace-nowrap"
          >
            LeadForge
          </motion.span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = location.pathname === it.to;
          return (
            <NavLink
              key={it.id}
              to={it.to}
              className={`group relative flex items-center gap-3 px-2.5 h-10 rounded-lg transition-colors ${
                isActive ? "text-foreground" : "text-[hsl(var(--text-secondary))] hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-bar"
                  className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-cyan-brand"
                  style={{ boxShadow: "0 0 12px hsl(var(--accent-cyan))" }}
                />
              )}
              <span
                className={`grid place-items-center w-9 h-9 rounded-lg shrink-0 transition-colors ${
                  isActive ? "bg-[hsl(var(--accent-cyan)/0.1)]" : "group-hover:bg-white/[0.04]"
                }`}
              >
                <Icon size={18} className={isActive ? "text-cyan-brand" : ""} strokeWidth={1.7} />
              </span>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  className="text-sm whitespace-nowrap"
                >
                  {it.label}
                </motion.span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Brand footer */}
      <div className="flex items-center gap-3 px-1.5 pt-3 mt-3 border-t border-white/[0.05]">
        <div className="w-9 h-9 rounded-lg shrink-0 bg-[hsl(var(--accent-cyan)/0.08)] border border-[hsl(var(--accent-cyan)/0.25)] grid place-items-center">
          <span className="font-display font-bold text-cyan-brand text-[11px] leading-none">LF</span>
        </div>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col leading-tight whitespace-nowrap"
          >
            <span className="text-xs font-medium">LeadForge</span>
            <span className="text-[10px] text-[hsl(var(--text-muted))] font-mono uppercase tracking-wider">v2.4.1</span>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}
