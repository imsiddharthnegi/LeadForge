import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/leadforge/PageHeader";
import { LeadCard } from "@/components/leadforge/LeadCard";
import type { Lead } from "@/lib/gemini";
import { Search, Filter } from "lucide-react";

const dummy: Lead[] = [
  {
    _id: "s1", company_name: "Helix Cloud", contact_person: "Maya Chen", job_title: "VP of Growth",
    email: "maya.chen@helixcloud.io", phone: "+1 (415) 555-0142", website: "helixcloud.io",
    company_size: "120–200 employees", annual_revenue: "$8M–$15M", funding_stage: "Series B",
    tech_stack: ["AWS", "React", "Postgres", "Datadog"], linkedin_url: "linkedin.com/company/helix-cloud",
    quality_score: 94, intent_signals: ["Hiring 3 SDRs", "Recently raised $20M", "New CRO joined"],
    tags: ["SaaS", "Devtools", "Enterprise"], pain_point: "Outbound conversion stalling below 2% despite doubled SDR headcount.",
    outreach_hook: "Saw your $20M raise — congrats. Most post-Series-B teams hit a wall around lead-quality vs SDR volume; happy to share what's working with similar Datadog-stack teams.",
    best_contact_time: "Tue–Thu, 10am–2pm PT",
  },
  {
    _id: "s2", company_name: "Northwind Studios", contact_person: "Daniel Park", job_title: "Founder & CEO",
    email: "dan@northwindstudios.co", phone: "+1 (646) 555-0188", website: "northwindstudios.co",
    company_size: "12–25 employees", annual_revenue: "$1M–$3M", funding_stage: "Bootstrapped",
    tech_stack: ["Webflow", "HubSpot", "Notion", "Figma"], linkedin_url: "linkedin.com/company/northwind-studios",
    quality_score: 81, intent_signals: ["Posted SDR job", "Launched new service page"],
    tags: ["Agency", "Brand Design", "B2B"], pain_point: "Inconsistent pipeline — feast or famine months on retainer signings.",
    outreach_hook: "Loved the GreenLine rebrand on your site — your team clearly punches above its weight. Quick thought on stabilizing retainer flow…",
    best_contact_time: "Mon–Wed mornings ET",
  },
  {
    _id: "s3", company_name: "Sable & Co.", contact_person: "Priya Anand", job_title: "Head of Marketing",
    email: "priya@sableandco.com", phone: "+44 20 7946 0922", website: "sableandco.com",
    company_size: "60–90 employees", annual_revenue: "$5M–$10M", funding_stage: "Series A",
    tech_stack: ["Shopify Plus", "Klaviyo", "Gorgias", "Yotpo"], linkedin_url: "linkedin.com/company/sable-co",
    quality_score: 88, intent_signals: ["3x ad spend YoY", "Expanding to EU", "Hiring CRM lead"],
    tags: ["E-commerce", "DTC", "Premium"], pain_point: "CAC up 38% YoY while AOV is flat — paid social ROI shrinking.",
    outreach_hook: "Your EU launch is going to be a turning point. We've helped 2 DTC brands at your stage cut CAC ~22% before international expansion — would a 15-min teardown help?",
    best_contact_time: "Tue–Thu, 9am–12pm GMT",
  },
  {
    _id: "s4", company_name: "Atlas Health Group", contact_person: "Dr. Marcus Lee", job_title: "Chief Operating Officer",
    email: "m.lee@atlashealth.org", phone: "+1 (312) 555-0177", website: "atlashealth.org",
    company_size: "300–500 employees", annual_revenue: "$25M–$40M", funding_stage: "Private",
    tech_stack: ["Epic", "Salesforce Health Cloud", "Twilio", "Tableau"], linkedin_url: "linkedin.com/company/atlas-health-group",
    quality_score: 76, intent_signals: ["RFP for patient-engagement vendor", "New CIO hired"],
    tags: ["Healthcare", "Multi-clinic", "Compliance"], pain_point: "Patient no-show rate stuck at 18% across 14 clinics.",
    outreach_hook: "Saw your CIO transition announcement — that's usually when patient-engagement workflows get a real audit. Worth comparing notes?",
    best_contact_time: "Wed–Thu, 1pm–4pm CT",
  },
  {
    _id: "s5", company_name: "Forge Legal Partners", contact_person: "Elena Rossi", job_title: "Managing Partner",
    email: "elena.rossi@forgelegal.com", phone: "+1 (212) 555-0119", website: "forgelegal.com",
    company_size: "40–60 employees", annual_revenue: "$10M–$20M", funding_stage: "Partnership",
    tech_stack: ["Clio", "NetDocuments", "Ironclad", "MS 365"], linkedin_url: "linkedin.com/company/forge-legal-partners",
    quality_score: 72, intent_signals: ["Two senior associates promoted", "Opened second office"],
    tags: ["Legal", "Boutique", "Corporate Law"], pain_point: "Manual intake creating 5–7 day delays from inquiry to engagement letter.",
    outreach_hook: "Congrats on the second office — boutique firms scaling past 50 always hit the intake bottleneck around now. Quick idea on a 48-hour intake SLA…",
    best_contact_time: "Tue & Thu, 8am–10am ET",
  },
  {
    _id: "s6", company_name: "Pulse Studio", contact_person: "Jordan Hayes", job_title: "Director of Member Experience",
    email: "jordan@pulsestudio.fit", phone: "+1 (305) 555-0163", website: "pulsestudio.fit",
    company_size: "25–50 employees", annual_revenue: "$2M–$5M", funding_stage: "Bootstrapped",
    tech_stack: ["Mindbody", "Stripe", "Klaviyo", "Squarespace"], linkedin_url: "linkedin.com/company/pulse-studio",
    quality_score: 91, intent_signals: ["Opening 3rd location", "Launched corporate plan", "Hiring marketer"],
    tags: ["Fitness", "Boutique", "DTC"], pain_point: "Member churn spikes ~28% in the first 60 days — onboarding sequence isn't sticking.",
    outreach_hook: "Spotted your corporate plan launch — that audience usually rescues 60-day churn if the first-2-weeks comms are tight. Want a teardown?",
    best_contact_time: "Mon–Wed, 11am–2pm ET",
  },
];

const SAVED_KEY = "leadforge_saved_ids";

export default function SavedLeads() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "high" | "hot">("all");
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]")); } catch { return new Set(); }
  });

  const toggleSave = (id: string) => {
    const next = new Set(savedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSavedIds(next);
    localStorage.setItem(SAVED_KEY, JSON.stringify([...next]));
  };

  const filtered = useMemo(() => {
    let out = dummy.slice();
    if (filter === "high") out = out.filter((l) => l.quality_score >= 75);
    if (filter === "hot") out = out.filter((l) => l.quality_score >= 90);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((l) =>
        l.company_name.toLowerCase().includes(q) ||
        l.contact_person.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return out;
  }, [search, filter]);

  const FilterChip = ({ id, label }: { id: typeof filter; label: string }) => (
    <button
      onClick={() => setFilter(id)}
      className={`relative px-3.5 h-9 rounded-md text-xs font-medium transition-colors ${
        filter === id ? "text-black" : "text-[hsl(var(--text-secondary))] hover:text-foreground"
      }`}
    >
      {filter === id && (
        <motion.span layoutId="saved-filter-bg" className="absolute inset-0 rounded-md bg-cyan-brand"
          transition={{ type: "spring", stiffness: 380, damping: 32 }} />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="Saved Leads"
        subtitle="Hand-picked prospects you want to come back to. Search, filter, and pick up the conversation."
      />
      <main className="px-4 sm:px-6 lg:px-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-3 mb-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
        >
          <div className="flex items-center gap-2 px-3 h-9 rounded-md bg-white/[0.025] border border-white/[0.06] flex-1 min-w-0">
            <Search size={14} className="text-[hsl(var(--text-secondary))] shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search saved leads, companies, tags…"
              className="flex-1 bg-transparent text-sm focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.02] border border-white/[0.06] overflow-x-auto">
            <span className="grid place-items-center w-8 h-9 shrink-0">
              <Filter size={13} className="text-[hsl(var(--text-secondary))]" />
            </span>
            <FilterChip id="all" label="All" />
            <FilterChip id="high" label="High (75+)" />
            <FilterChip id="hot" label="Hot (90+)" />
          </div>
          <span className="text-[10px] font-mono text-[hsl(var(--text-muted))] px-2 shrink-0">
            {filtered.length} of {dummy.length}
          </span>
        </motion.div>

        <div className="space-y-4">
          {filtered.map((l, i) => (
            <LeadCard
              key={l._id}
              lead={l}
              index={i}
              saved={savedIds.has(l._id!) || true}
              onToggleSave={() => toggleSave(l._id!)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="glass-card rounded-xl p-10 text-center text-sm text-[hsl(var(--text-secondary))]">
              No saved leads match your filters.
            </div>
          )}
        </div>
      </main>
    </>
  );
}
