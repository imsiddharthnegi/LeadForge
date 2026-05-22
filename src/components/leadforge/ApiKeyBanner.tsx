import { motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ApiKeyBanner() {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();
  const hasKey = !!localStorage.getItem("groq_api_key");

  if (hasKey || dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 mx-6 mt-4 rounded-lg bg-gradient-to-r from-amber-brand/[0.15] to-orange-brand/[0.1] border border-amber-brand/40 px-4 py-3 flex items-center gap-3 shadow-lg"
    >
      <AlertCircle size={16} className="text-amber-brand shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-amber-brand">Groq API key required</p>
        <p className="text-[11px] text-amber-brand/80 mt-0.5">Add your API key in Settings to generate leads</p>
      </div>
      <button
        onClick={() => navigate("/settings")}
        className="px-3 h-7 rounded-md bg-amber-brand/20 hover:bg-amber-brand/30 text-amber-brand text-xs font-semibold whitespace-nowrap transition-colors"
      >
        Add Key
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-brand/50 hover:text-amber-brand p-1 transition-colors"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
