import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/leadforge/PageHeader";
import { User, KeyRound, Sliders, Eye, EyeOff, Check } from "lucide-react";
import { toast } from "sonner";

function Section({ icon: Icon, eyebrow, title, children, delay = 0 }: {
  icon: any; eyebrow: string; title: string; children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass rounded-2xl p-6 lg:p-7"
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-[hsl(var(--accent-cyan)/0.08)] border border-[hsl(var(--accent-cyan)/0.25)]">
          <Icon size={17} className="text-cyan-brand" strokeWidth={1.8} />
        </span>
        <div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-brand uppercase">{eyebrow}</span>
          <h3 className="font-display text-lg font-semibold mt-0.5">{title}</h3>
        </div>
      </div>
      {children}
    </motion.section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider text-[hsl(var(--text-secondary))] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full h-11 px-3.5 rounded-lg bg-white/[0.025] border border-white/[0.07] text-sm focus:outline-none focus:border-cyan-brand/50 transition-colors"
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
      className="flex items-center justify-between w-full px-4 h-14 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors text-left"
    >
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-[11px] text-[hsl(var(--text-muted))] mt-0.5">{hint}</div>}
      </div>
      <span className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 ${value ? "bg-cyan-brand" : "bg-white/10"}`} style={{ height: "22px" }}>
        <motion.span
          animate={{ x: value ? 18 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
        />
      </span>
    </button>
  );
}

export default function SettingsPage() {
  const [name, setName] = useState("Marcus Kim");
  const [email, setEmail] = useState("marcus@leadforge.app");
  const [showKey, setShowKey] = useState(false);
  const [prefs, setPrefs] = useState({ emailNotifications: true, autoSave: false, darkMode: true });

  return (
    <>
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        subtitle="Manage your account, API access, and preferences for how LeadForge behaves."
      />
      <main className="px-6 lg:px-10 pb-20 max-w-3xl space-y-5">
        <Section icon={User} eyebrow="Profile" title="Account" delay={0}>
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
            className="mt-5 inline-flex items-center gap-2 px-4 h-10 rounded-lg bg-cyan-brand/10 hover:bg-cyan-brand/20 border border-cyan-brand/30 text-cyan-brand text-xs font-medium transition-colors"
          >
            <Check size={13} /> Save changes
          </button>
        </Section>

        <Section icon={KeyRound} eyebrow="Credentials" title="API Configuration" delay={0.08}>
          <Field label="Groq API Key">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 h-11 px-3.5 rounded-lg bg-white/[0.025] border border-white/[0.07] font-mono text-sm">
                <KeyRound size={14} className="text-cyan-brand shrink-0" />
                <span className="truncate">
                  {showKey ? "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" : "gsk_••••••••••••••••••••••••••••"}
                </span>
                <button
                  onClick={() => setShowKey((v) => !v)}
                  className="ml-auto text-[hsl(var(--text-secondary))] hover:text-foreground transition-colors"
                  aria-label="Toggle key visibility"
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button
                onClick={() => toast("Key updates are managed by your administrator")}
                className="h-11 px-4 rounded-lg bg-gradient-to-r from-[hsl(var(--accent-cyan))] to-[hsl(var(--accent-violet))] text-black font-semibold text-xs whitespace-nowrap"
                style={{ boxShadow: "0 8px 24px -8px hsl(var(--accent-cyan) / 0.5)" }}
              >
                Update Key
              </button>
            </div>
            <p className="mt-2 text-[11px] text-[hsl(var(--text-muted))] font-mono">
              Connected to Groq · llama-3.3-70b-versatile · status: <span className="text-[hsl(var(--accent-green))]">active</span>
            </p>
          </Field>
        </Section>

        <Section icon={Sliders} eyebrow="Behavior" title="Preferences" delay={0.16}>
          <div className="space-y-2.5">
            <Toggle
              label="Email notifications"
              hint="Get a digest when sessions complete or hot leads appear."
              value={prefs.emailNotifications}
              onChange={(v) => setPrefs({ ...prefs, emailNotifications: v })}
            />
            <Toggle
              label="Auto-save generated leads"
              hint="Automatically push every new lead into your saved library."
              value={prefs.autoSave}
              onChange={(v) => setPrefs({ ...prefs, autoSave: v })}
            />
            <Toggle
              label="Dark mode"
              hint="LeadForge is built for the night shift — recommended."
              value={prefs.darkMode}
              onChange={(v) => setPrefs({ ...prefs, darkMode: v })}
            />
          </div>
        </Section>
      </main>
    </>
  );
}
