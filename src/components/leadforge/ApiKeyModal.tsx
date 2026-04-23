import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { KeyRound, ExternalLink, X, Check } from "lucide-react";
import { getApiKey, setApiKey } from "@/lib/gemini";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function ApiKeyModal({ open, onClose, onSaved }: Props) {
  const [val, setVal] = useState("");

  useEffect(() => {
    if (open) setVal(getApiKey() ?? "");
  }, [open]);

  const save = () => {
    if (!val.trim()) return;
    setApiKey(val.trim());
    onSaved();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center p-4"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative glass-strong rounded-2xl p-7 max-w-md w-full"
            style={{ boxShadow: "0 30px 80px -20px hsl(var(--accent-cyan) / 0.3), 0 0 0 1px hsl(0 0% 100% / 0.07)" }}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-[hsl(var(--text-secondary))] hover:text-foreground">
              <X size={16} />
            </button>

            <div className="grid place-items-center w-12 h-12 rounded-xl bg-cyan-brand/10 border border-cyan-brand/30 mb-4">
              <KeyRound size={20} className="text-cyan-brand" />
            </div>

            <h3 className="font-display text-xl font-semibold">Connect your Groq key</h3>
            <p className="mt-1.5 text-sm text-[hsl(var(--text-secondary))] leading-relaxed">
              LeadForge calls the Groq API directly from your browser. Your key is stored only in <span className="font-mono text-cyan-brand">localStorage</span> on this device.
            </p>

            <ol className="mt-5 space-y-2 text-sm text-[hsl(var(--text-secondary))]">
              <li className="flex gap-2.5"><span className="font-mono text-cyan-brand text-xs mt-0.5">01</span>
                <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer"
                   className="inline-flex items-center gap-1 text-foreground hover:text-cyan-brand">
                  Open Groq Console <ExternalLink size={11} />
                </a>
              </li>
              <li className="flex gap-2.5"><span className="font-mono text-cyan-brand text-xs mt-0.5">02</span>Click "Create API Key" and copy it.</li>
              <li className="flex gap-2.5"><span className="font-mono text-cyan-brand text-xs mt-0.5">03</span>Paste it below — that's it.</li>
            </ol>

            <div className="mt-5">
              <label className="block text-[11px] uppercase tracking-wider text-[hsl(var(--text-secondary))] mb-1.5 font-mono">Groq API Key</label>
              <input
                value={val}
                onChange={(e) => setVal(e.target.value)}
                placeholder="gsk_..."
                type="password"
                className="w-full h-11 px-3.5 rounded-lg bg-white/[0.025] border border-white/[0.08] text-sm font-mono focus:outline-none focus:border-cyan-brand/50"
                onKeyDown={(e) => e.key === "Enter" && save()}
              />
            </div>

            <button
              onClick={save}
              disabled={!val.trim()}
              className="mt-5 w-full h-11 rounded-lg bg-gradient-brand text-black font-semibold text-sm disabled:opacity-40 inline-flex items-center justify-center gap-2"
            >
              <Check size={15} /> I've added my key
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
