import { LayoutDashboard, Sparkles, Bookmark, BarChart3, Settings, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";

const items = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { id: "generate", label: "Generate", icon: Sparkles, to: "/" },
  { id: "saved", label: "Saved Leads", icon: Bookmark, to: "/saved" },
  { id: "analytics", label: "Analytics", icon: BarChart3, to: "/analytics" },
];

export function Sidebar() {
  const location = useLocation();
  const userName = "Marcus Kim";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <motion.aside
      className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-[220px] flex-col py-5 px-3 bg-[hsl(var(--bg-void))]"
      style={{ borderRight: "1px solid hsl(0 0% 100% / 0.07)" }}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-2 mb-6">
        <div className="w-10 h-10 shrink-0 grid place-items-center rounded-lg bg-gradient-to-br from-[hsl(var(--accent-cyan)/0.2)] to-[hsl(var(--accent-cyan)/0.05)] border border-[hsl(var(--accent-cyan)/0.3)]">
          <span className="font-display font-bold text-cyan-brand text-lg leading-none">LF</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-semibold text-foreground tracking-tight whitespace-nowrap">LeadForge</span>
            <span className="px-1.5 py-0.5 rounded-badge text-[8px] font-mono font-bold tracking-wider bg-cyan-brand/10 text-cyan-brand border border-cyan-brand/25 shrink-0">
              v1.0
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0 mb-6" />

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = location.pathname === it.to;
          return (
            <NavLink
              key={it.id}
              to={it.to}
              className={`group relative flex items-center gap-3 px-3 h-9 rounded-input transition-all ${
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
              <Icon size={18} strokeWidth={1.5} className="shrink-0" />
              <span className="text-sm font-medium truncate">{it.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="space-y-3 pt-4 border-t border-white/[0.07]">
        {/* Profile Card */}
        <div className="flex items-center gap-3 px-2.5 py-2 rounded-input bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
          <div className="w-8 h-8 rounded-badge bg-gradient-to-br from-cyan-brand/30 to-violet-brand/20 grid place-items-center shrink-0 border border-cyan-brand/20">
            <span className="text-xs font-bold text-cyan-brand">{userInitials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{userName}</p>
            <p className="text-[10px] text-[hsl(var(--text-muted))]">You</p>
          </div>
        </div>

        {/* Settings Link */}
        <NavLink
          to="/settings"
          className={`flex items-center gap-3 px-3 h-8 rounded-input text-sm transition-all ${
            location.pathname === "/settings"
              ? "text-cyan-brand bg-cyan-brand/8"
              : "text-[hsl(var(--text-secondary))] hover:text-foreground hover:bg-white/[0.04]"
          }`}
        >
          <Settings size={16} strokeWidth={1.5} />
          <span>Settings</span>
        </NavLink>
      </div>
    </motion.aside>
  );
}
