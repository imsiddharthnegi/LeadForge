import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/leadforge/PageHeader";
import { LeadCard } from "@/components/leadforge/LeadCard";
import type { Lead } from "@/lib/gemini";
import { Search, Filter, ChevronDown, Bookmark } from "lucide-react";

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
const TIMESTAMPS_KEY = "leadforge_saved_timestamps";

const getSavedTimestamps = (): Record<string, number> => {
  try { return JSON.parse(localStorage.getItem(TIMESTAMPS_KEY) || "{}"); } catch { return {}; }
};

const getOrSeedTimestamps = (ids: Set<string>): Record<string, number> => {
  const stored = getSavedTimestamps();
  let updated = { ...stored };
  let neededUpdate = false;

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const seedTimes: Record<string, number> = {
    s1: now - 1 * dayMs,
    s2: now - 2 * dayMs,
    s3: now - 3 * dayMs,
    s4: now - 5 * dayMs,
    s5: now - 7 * dayMs,
    s6: now - 10 * dayMs,
  };

  ids.forEach((id) => {
    if (!updated[id]) {
      updated[id] = seedTimes[id] || now;
      neededUpdate = true;
    }
  });

  if (neededUpdate) {
    localStorage.setItem(TIMESTAMPS_KEY, JSON.stringify(updated));
  }
  return updated;
};

const getDaysAgoText = (timestamp: number) => {
  const diffMs = Date.now() - timestamp;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours <= 0) {
      return "saved just now";
    }
    return `saved ${diffHours}h ago`;
  }
  if (diffDays === 1) return "saved 1 day ago";
  return `saved ${diffDays} days ago`;
};

const getLeadNiche = (lead: Lead): string => {
  if (lead.tags.includes("SaaS")) return "SaaS Startups";
  if (lead.tags.includes("E-commerce") || lead.tags.includes("DTC")) return "E-commerce";
  if (lead.tags.includes("Agency")) return "Agencies";
  if (lead.tags.includes("Healthcare")) return "Healthcare";
  if (lead.tags.includes("Legal")) return "Legal Services";
  if (lead.tags.includes("Fitness")) return "Fitness & Wellness";
  return "Other Niches";
};

export default function SavedLeads() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "high" | "hot">("all");
  const [sort, setSort] = useState<"date-desc" | "score-desc" | "name-asc">("date-desc");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(SAVED_KEY);
      if (stored === null) {
        // If not initialized, pre-fill with dummy IDs for demo
        const dummyIds = dummy.map((l) => l._id!);
        localStorage.setItem(SAVED_KEY, JSON.stringify(dummyIds));
        return new Set(dummyIds);
      }
      return new Set(JSON.parse(stored));
    } catch {
      return new Set(dummy.map((l) => l._id!));
    }
  });

  const [timestamps, setTimestamps] = useState<Record<string, number>>(() => {
    return getOrSeedTimestamps(savedIds);
  });

  const toggleSave = (id: string) => {
    const nextIds = new Set(savedIds);
    const nextTimestamps = { ...timestamps };

    if (nextIds.has(id)) {
      nextIds.delete(id);
      delete nextTimestamps[id];
    } else {
      nextIds.add(id);
      nextTimestamps[id] = Date.now();
    }

    setSavedIds(nextIds);
    setTimestamps(nextTimestamps);
    localStorage.setItem(SAVED_KEY, JSON.stringify([...nextIds]));
    localStorage.setItem(TIMESTAMPS_KEY, JSON.stringify(nextTimestamps));
  };

  const filtered = useMemo(() => {
    let out = dummy.filter((l) => savedIds.has(l._id!));
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

    // Apply sorting
    if (sort === "score-desc") {
      out.sort((a, b) => b.quality_score - a.quality_score);
    } else if (sort === "name-asc") {
      out.sort((a, b) => a.company_name.localeCompare(b.company_name));
    } else {
      // date-desc
      out.sort((a, b) => (timestamps[b._id!] || 0) - (timestamps[a._id!] || 0));
    }

    return out;
  }, [search, filter, sort, savedIds, timestamps]);

  const grouped = useMemo(() => {
    const groups: Record<string, Lead[]> = {};
    filtered.forEach((lead) => {
      const niche = getLeadNiche(lead);
      if (!groups[niche]) {
        groups[niche] = [];
      }
      groups[niche].push(lead);
    });
    return groups;
  }, [filtered]);

  const toggleGroup = (niche: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [niche]: !prev[niche],
    }));
  };

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
          className="glass-card rounded-2xl p-3 mb-6 flex flex-col lg:flex-row lg:items-center gap-2 sm:gap-3"
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
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <span className="grid place-items-center w-8 h-9 shrink-0">
                <Filter size={13} className="text-[hsl(var(--text-secondary))]" />
              </span>
              <FilterChip id="all" label="All" />
              <FilterChip id="high" label="High (75+)" />
              <FilterChip id="hot" label="Hot (90+)" />
            </div>

            {/* Sort Dropdown styled to match Index.tsx dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="h-9 px-3 rounded-md bg-white/[0.025] border border-white/[0.06] text-xs font-mono focus:outline-none focus:border-cyan-brand/50 text-[hsl(var(--text-secondary))] focus:text-foreground cursor-pointer"
            >
              <option value="date-desc">Date Saved</option>
              <option value="score-desc">Score (High to Low)</option>
              <option value="name-asc">Company Name (A-Z)</option>
            </select>

            <span className="text-[10px] font-mono text-[hsl(var(--text-muted))] px-2 shrink-0 lg:ml-auto">
              {filtered.length} of {savedIds.size}
            </span>
          </div>
        </motion.div>

        {savedIds.size === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-white/[0.08] bg-[#1a1f28] max-w-lg mx-auto mt-8 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan-brand/10 flex items-center justify-center text-cyan-brand border border-cyan-brand/20">
              <Bookmark size={22} className="text-cyan-brand" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-white mb-1">No saved leads yet</h3>
              <p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed">
                Generate leads and tap the heart icon to save promising ones here in your library.
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="mt-2 h-9 px-4 rounded-md bg-cyan-brand text-black text-xs font-semibold hover:bg-cyan-brand/90 transition-colors shadow-lg active:scale-95"
            >
              Go to Lead Generator
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-xl p-10 text-center text-sm text-[hsl(var(--text-secondary))]">
            No saved leads match your filters.
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([niche, groupLeads]) => {
              const isCollapsed = collapsedGroups[niche];
              return (
                <div key={niche} className="space-y-4">
                  {/* Group Header */}
                  <div
                    onClick={() => toggleGroup(niche)}
                    className="flex items-center justify-between cursor-pointer py-2.5 px-4 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] hover:border-white/[0.05] transition-all group select-none"
                  >
                    <div className="flex items-center gap-2">
                      <ChevronDown
                        size={14}
                        className={`text-cyan-brand transition-transform duration-200 ${
                          isCollapsed ? "-rotate-90" : "rotate-0"
                        }`}
                      />
                      <span className="font-mono text-xs tracking-wider text-slate-300 uppercase font-semibold">
                        {niche}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-[#1a1f28] border border-white/8 text-cyan-brand px-2 py-0.5 rounded-full">
                        {groupLeads.length}
                      </span>
                    </div>
                    <div className="w-1/3 h-[1px] bg-gradient-to-r from-cyan-brand/10 to-transparent flex-1 ml-4 hidden sm:block"></div>
                  </div>

                  {/* Group Content */}
                  {!isCollapsed && (
                    <div className="space-y-4 pl-1 sm:pl-3 border-l border-white/[0.04]">
                      {groupLeads.map((l) => {
                        const globalIdx = filtered.findIndex((lead) => lead._id === l._id);
                        const daysAgoText = timestamps[l._id!] ? getDaysAgoText(timestamps[l._id!]) : "";
                        return (
                          <LeadCard
                            key={l._id}
                            lead={l}
                            index={globalIdx >= 0 ? globalIdx : 0}
                            saved={true}
                            onToggleSave={() => toggleSave(l._id!)}
                            timestampText={daysAgoText}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
