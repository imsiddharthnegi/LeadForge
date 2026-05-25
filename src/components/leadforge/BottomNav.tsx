import { LayoutDashboard, Sparkles, Bookmark, BarChart3, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const items = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { id: "generate", label: "Generate", icon: Sparkles, to: "/" },
  { id: "saved", label: "Saved", icon: Bookmark, to: "/saved" },
  { id: "analytics", label: "Analytics", icon: BarChart3, to: "/analytics" },
  { id: "settings", label: "Settings", icon: Settings, to: "/settings" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.07] bg-[hsl(var(--bg-void))]">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          
          return (
            <Tooltip key={item.id} delayDuration={300}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.to}
                  className={`flex flex-col items-center justify-center w-16 h-16 rounded-none transition-all relative ${
                    isActive
                      ? "text-cyan-brand"
                      : "text-[hsl(var(--text-secondary))]"
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-cyan-brand" />
                  )}
                  <Icon size={24} strokeWidth={1.5} />
                  <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="top" className="mb-2">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </nav>
  );
}
