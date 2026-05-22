import { useState } from "react";
import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { toast } from "sonner";

function SettingsCard({ title, description, delay = 0, children }: {
  title: string; description: string; delay?: number; children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="bg-[hsl(var(--surface-2))] rounded-card border border-white/[0.07] p-6"
    >
      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-brand/30 to-transparent" />
      
      <div className="mb-6 pt-2">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-[hsl(var(--text-secondary))] mt-1">{description}</p>
      </div>

      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      {hint && <p className="text-xs text-[hsl(var(--text-muted))] mb-2">{hint}</p>}
      {children}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full h-10 px-3 rounded-input bg-[hsl(var(--surface-3))] border border-white/[0.07] text-sm focus:outline-none focus:border-cyan-brand/50 focus:ring-1 focus:ring-cyan-brand/20 transition-all placeholder:text-[hsl(var(--text-muted))]"
    />
  );
}

function Toggle({ value, onChange, label, hint }: {
  value: boolean; onChange: (v: boolean) => void; label: string; hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center justify-between w-full px-4 h-12 rounded-input bg-[hsl(var(--surface-3))] border border-white/[0.07] hover:border-white/10 transition-colors text-left"
    >
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        {hint && <div className="text-xs text-[hsl(var(--text-muted))] mt-0.5">{hint}</div>}
      </div>
      <span className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${value ? "bg-cyan-brand" : "bg-white/10"}`}>
        <motion.span
          animate={{ x: value ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white"
        />
      </span>
    </button>
  );
}

export default function SettingsPage() {
  const [name, setName] = useState("Marcus Kim");
  const [email, setEmail] = useState("marcus@leadforge.app");
  const [groqKey, setGroqKey] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [prefs, setPrefs] = useState({ emailNotifications: true, autoSave: false, darkMode: true });

  // Load API key from localStorage on mount
  React.useEffect(() => {
    const savedKey = localStorage.getItem("groq_api_key") || "";
    setGroqKey(savedKey);
    setIsEditing(!savedKey); // Start in edit mode if no key exists
  }, []);

  const maskApiKey = (key: string) => {
    if (!key) return "No key set";
    const lastFour = key.slice(-4);
    const masked = "•".repeat(Math.max(0, key.length - 4));
    return `gsk_${masked}${lastFour}`;
  };

  return (
    <>
      {/* Page Header */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-10 py-8 border-b border-white/[0.07]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
            Settings
          </h1>
          <p className="mt-2 text-base text-[hsl(var(--text-secondary))]">
            Manage your API keys and preferences
          </p>
        </motion.div>
      </header>

      {/* Main content */}
      <main className="px-4 sm:px-6 lg:px-10 py-8 pb-20 max-w-2xl space-y-6">
        {/* Profile Card */}
        <SettingsCard
          title="Profile"
          description="Update your account information"
          delay={0.1}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name">
              <TextInput value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Email Address">
              <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
          </div>
          <button
            onClick={() => toast.success("Profile updated")}
            className="mt-2 inline-flex items-center gap-2 px-4 h-10 rounded-input bg-cyan-brand text-black font-semibold text-xs transition-all hover:bg-cyan-brand/90 active:scale-95"
          >
            <Check size={14} /> Save Changes
          </button>
        </SettingsCard>

        {/* API Configuration Card */}
        <SettingsCard
          title="API Configuration"
          description="Manage your Groq API credentials"
          delay={0.15}
        >
          <Field label="Groq API Key" hint="Your API key is stored securely in your browser">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="Paste your gsk_... API key"
                  className="flex-1 h-10 px-3 rounded-input bg-[hsl(var(--surface-3))] border border-white/[0.07] font-mono text-sm focus:outline-none focus:border-cyan-brand/50 focus:ring-1 focus:ring-cyan-brand/20 transition-all"
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (groqKey.trim()) {
                      localStorage.setItem("groq_api_key", groqKey);
                      setIsEditing(false);
                      toast.success("Groq API Key saved");
                    } else {
                      toast.error("Please enter a valid API key");
                    }
                  }}
                  className="h-10 px-3 rounded-input bg-cyan-brand text-black font-semibold text-xs whitespace-nowrap transition-all hover:bg-cyan-brand/90"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={maskApiKey(groqKey)}
                  readOnly
                  className="flex-1 h-10 px-3 rounded-input bg-[hsl(var(--surface-3))]/50 border border-white/[0.07] font-mono text-sm text-[hsl(var(--text-secondary))] cursor-default"
                />
                <button
                  onClick={() => setIsEditing(true)}
                  className="h-10 px-3 rounded-input bg-white/[0.05] hover:bg-white/10 border border-white/[0.1] text-foreground font-semibold text-xs whitespace-nowrap transition-colors"
                >
                  Edit
                </button>
                {groqKey && (
                  <button
                    onClick={() => {
                      localStorage.removeItem("groq_api_key");
                      setGroqKey("");
                      setIsEditing(true);
                      toast.success("API Key removed");
                    }}
                    className="h-10 px-3 rounded-input bg-white/[0.05] hover:bg-red-500/10 border border-white/[0.1] hover:border-red-500/30 text-red-500 font-semibold text-xs whitespace-nowrap transition-colors"
                  >
                    Revoke
                  </button>
                )}
              </div>
            )}
          </Field>
          <p className="text-xs text-[hsl(var(--text-muted))] font-mono mt-3">
            Connected to Groq · llama-3.3-70b-versatile · status: <span className="text-[hsl(var(--accent-green))]">active</span>
          </p>
        </SettingsCard>

        {/* Preferences Card */}
        <SettingsCard
          title="Preferences"
          description="Customize how LeadForge works for you"
          delay={0.2}
        >
          <div className="space-y-3">
            <Toggle
              label="Email notifications"
              hint="Get a digest when sessions complete or hot leads appear"
              value={prefs.emailNotifications}
              onChange={(v) => setPrefs({ ...prefs, emailNotifications: v })}
            />
            <Toggle
              label="Auto-save generated leads"
              hint="Automatically push every new lead into your saved library"
              value={prefs.autoSave}
              onChange={(v) => setPrefs({ ...prefs, autoSave: v })}
            />
            <Toggle
              label="Dark mode"
              hint="LeadForge is built for the night shift — recommended"
              value={prefs.darkMode}
              onChange={(v) => setPrefs({ ...prefs, darkMode: v })}
            />
          </div>
        </SettingsCard>
      </main>
    </>
  );
}
