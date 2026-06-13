import { useState, useEffect, useRef } from "react";
import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/leadforge/PageHeader";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-mono font-semibold text-slate-300 uppercase tracking-widest leading-none">
        {label}
      </label>
      {hint && <p className="text-[11px] text-[hsl(var(--text-muted))] leading-normal mb-1">{hint}</p>}
      <div className="relative">{children}</div>
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full h-10 px-3 rounded-input bg-white/[0.025] border border-white/[0.07] text-sm focus:outline-none focus:border-cyan-brand/50 focus:ring-2 focus:ring-cyan-brand/10 transition-all placeholder:text-[hsl(var(--text-muted))]"
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
      className="flex items-center justify-between w-full px-4 py-3 rounded-input bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors text-left"
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
  const [activeTab, setActiveTab] = useState<"profile" | "api" | "preferences">("profile");
  const [name, setName] = useState("Marcus Kim");
  const [email, setEmail] = useState("marcus@leadforge.app");
  const [savedKey, setSavedKey] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [prefs, setPrefs] = useState({ emailNotifications: true, autoSave: false, darkMode: true });
  const inputRef = useRef<HTMLInputElement>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem("groq_api_key") || "";
    setSavedKey(storedKey);
    if (storedKey) {
      // If key exists, show masked version as readOnly
      const lastFour = storedKey.slice(-4);
      const masked = "•".repeat(Math.max(0, storedKey.length - 4));
      setInputValue(`gsk_${masked}${lastFour}`);
      setIsReadOnly(true);
    } else {
      // If no key, start with empty editable input
      setInputValue("");
      setIsReadOnly(false);
    }
  }, []);

  const handleEdit = () => {
    setInputValue("");
    setIsReadOnly(false);
    // Focus after state update
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveKey = () => {
    // Only save if user typed a new key (not the masked version)
    if (inputValue.trim() && !inputValue.startsWith("gsk_•")) {
      localStorage.setItem("groq_api_key", inputValue.trim());
      setSavedKey(inputValue.trim());
      
      // Show masked version and make readOnly
      const lastFour = inputValue.trim().slice(-4);
      const masked = "•".repeat(Math.max(0, inputValue.trim().length - 4));
      setInputValue(`gsk_${masked}${lastFour}`);
      setIsReadOnly(true);
      toast.success("Groq API Key saved");
    } else if (inputValue.startsWith("gsk_•")) {
      toast.error("Please enter a new API key");
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem("groq_api_key");
    setSavedKey("");
    setInputValue("");
    setIsReadOnly(false);
    toast.success("API Key removed");
  };

  return (
    <>
      <PageHeader
        eyebrow="Config"
        title="Settings"
        subtitle="Manage your API keys, profile, and preferences."
      />

      <main className="px-4 sm:px-6 lg:px-10 pb-20 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 items-start">
          
          {/* Left Navigation: Narrow Column */}
          <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none border-b md:border-b-0 md:border-r border-white/[0.07] md:pr-4">
            <button
              onClick={() => setActiveTab("profile")}
              className={`relative flex items-center h-10 px-3.5 rounded-input transition-all text-[11px] font-mono font-semibold uppercase tracking-wider text-left select-none whitespace-nowrap ${
                activeTab === "profile"
                  ? "text-cyan-brand font-bold"
                  : "text-[hsl(var(--text-secondary))] hover:text-foreground hover:bg-white/[0.02]"
              }`}
            >
              {activeTab === "profile" && (
                <motion.span
                  layoutId="settings-active-bg"
                  className="absolute inset-0 rounded-input bg-cyan-brand/12 -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              Profile
            </button>
            <button
              onClick={() => setActiveTab("api")}
              className={`relative flex items-center h-10 px-3.5 rounded-input transition-all text-[11px] font-mono font-semibold uppercase tracking-wider text-left select-none whitespace-nowrap ${
                activeTab === "api"
                  ? "text-cyan-brand font-bold"
                  : "text-[hsl(var(--text-secondary))] hover:text-foreground hover:bg-white/[0.02]"
              }`}
            >
              {activeTab === "api" && (
                <motion.span
                  layoutId="settings-active-bg"
                  className="absolute inset-0 rounded-input bg-cyan-brand/12 -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              API Configuration
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`relative flex items-center h-10 px-3.5 rounded-input transition-all text-[11px] font-mono font-semibold uppercase tracking-wider text-left select-none whitespace-nowrap ${
                activeTab === "preferences"
                  ? "text-cyan-brand font-bold"
                  : "text-[hsl(var(--text-secondary))] hover:text-foreground hover:bg-white/[0.02]"
              }`}
            >
              {activeTab === "preferences" && (
                <motion.span
                  layoutId="settings-active-bg"
                  className="absolute inset-0 rounded-input bg-cyan-brand/12 -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              Preferences
            </button>
          </div>

          {/* Right Column: Content Panel */}
          <div className="w-full">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden border w-full"
              style={{ backgroundColor: "#1a1f28", borderColor: "rgba(255, 255, 255, 0.08)" }}
            >
              {/* Top border accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-brand/20 to-transparent" />
              
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Profile Settings</h3>
                    <p className="text-sm text-[hsl(var(--text-secondary))] mt-0.5">Update your account information</p>
                  </div>
                  <div className="space-y-4 max-w-md">
                    <Field label="Full Name">
                      <TextInput value={name} onChange={(e) => setName(e.target.value)} />
                    </Field>
                    <Field label="Email Address">
                      <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Field>
                  </div>
                  <div className="pt-4 border-t border-white/[0.05]">
                    <button
                      onClick={() => toast.success("Profile updated")}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 h-10 rounded-input bg-cyan-brand text-[#0d1117] font-bold text-xs transition-all hover:bg-cyan-brand/90 active:scale-95 shadow-md shadow-cyan-brand/10"
                    >
                      <Check size={14} /> Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "api" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">API Configuration</h3>
                    <p className="text-sm text-[hsl(var(--text-secondary))] mt-0.5">Manage your Groq API credentials</p>
                  </div>
                  <div className="space-y-4 max-w-2xl">
                    <Field label="Groq API Key" hint="Your API key is stored securely in your browser">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-1">
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          readOnly={isReadOnly}
                          placeholder="Paste your gsk_... API key"
                          className={`flex-1 h-10 px-3 rounded-input border font-mono text-sm transition-all focus:outline-none ${
                            isReadOnly
                              ? "bg-white/[0.015] border-white/[0.05] text-[hsl(var(--text-secondary))] cursor-default"
                              : "bg-white/[0.025] border-white/[0.07] focus:border-cyan-brand/50 focus:ring-2 focus:ring-cyan-brand/10"
                          }`}
                        />
                        {isReadOnly && savedKey ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleEdit}
                              className="h-10 px-4 rounded-input bg-white/[0.05] hover:bg-white/10 border border-white/[0.1] text-foreground font-semibold text-xs whitespace-nowrap transition-colors flex-1 sm:flex-none"
                            >
                              Edit
                            </button>
                            <button
                              onClick={handleRemoveKey}
                              className="h-10 px-4 rounded-input bg-white/[0.05] hover:bg-red-500/10 border border-white/[0.1] hover:border-red-500/30 text-red-500 font-semibold text-xs whitespace-nowrap transition-colors flex-1 sm:flex-none"
                            >
                              Revoke
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={handleSaveKey}
                            className="h-10 px-4 rounded-input bg-cyan-brand text-[#0d1117] font-bold text-xs whitespace-nowrap transition-all hover:bg-cyan-brand/90 active:scale-95 shadow-md shadow-cyan-brand/10"
                          >
                            Save Key
                          </button>
                        )}
                      </div>
                    </Field>
                    <p className="text-[11px] text-[hsl(var(--text-muted))] font-mono">
                      Connected to Groq · llama-3.3-70b-versatile · status: <span className="text-[hsl(var(--accent-green))]">active</span>
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "preferences" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Preferences</h3>
                    <p className="text-sm text-[hsl(var(--text-secondary))] mt-0.5">Customize how LeadForge works for you</p>
                  </div>
                  <div className="space-y-3 max-w-xl">
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
                </div>
              )}
            </motion.div>
          </div>
          
        </div>
      </main>
    </>
  );
}
