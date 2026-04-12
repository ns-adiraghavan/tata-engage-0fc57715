import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── Brand tokens (identical to DashboardView) ────────────────────────────────
const B_INDIGO    = "#333399";
const B_YELLOW    = "#F5A623";
const B_TEAL      = "#00A896";
const B_RED       = "#E8401C";
const B_BLUE      = "#1E6BB8";
const ACCENT_NAVY = "#0D1B3E";

const P_INDIGO    = "#EEF0FF";
const P_YELLOW    = "#FEF6E4";
const P_RED       = "#FFF0EE";
const P_TEAL      = "#E6F8F5";
const P_BLUE      = "#EBF4FF";

// ─── SPOC-specific accent ─────────────────────────────────────────────────────
const B_SPOC      = "#333399";  // same as B_INDIGO per spec
const P_SPOC      = "#EEEDFE";

// ─── Mock data (inline — no imports needed, consistent with DashboardView pattern) ─
const SPOC = {
  firstName: "Rohan",
  lastName: "Desai",
  company: "Tata Consultancy Services",
  designation: "Program Manager",
  city: "Mumbai",
  email: "rohan.desai@tcs.com",
  tier: "Corporate SPOC",
  skills: ["Project Management", "Stakeholder Coordination", "Strategy", "Operations"],
  interests: ["Education", "Digital Literacy", "Mentorship"],
  hoursVolunteered: 70,
  projectsApplied: 4,
  projectsCompleted: 2,
  projectsDropped: 0,
  referrals: 5,
  badgesEarned: 4,
  spocStats: {
    totalVolunteers: 4520,
    activeProEngage: 124,
    tvwEvents: 45,
    pendingApprovals: 3,
    matched: 86,
    completed: 12,
    paused: 8,
    dropped: 4,
    rejected: 15,
  },
  activeApplication: {
    title: "Financial Literacy Programme",
    ngo: "Udayan Care",
    status: "Applied",
    edition: "ProEngage Edition 11",
    mode: "Online",
    skillArea: "Finance",
    duration: "3 months",
    hoursPerWeek: "2",
    matchDate: "",
  },
  leaderboardRank: 2,
  leaderboardMatched: 1240,
  leaderboardTrend: "+12 this week",
  badges: [
    { id: "b1", name: "Top Contributor", symbol: "I",   desc: "Most volunteer hours — Q1 2026", earned: "Jan 2026", color: B_TEAL   },
    { id: "b2", name: "2× ProEngager",   symbol: "II",  desc: "2 ProEngage projects completed", earned: "Mar 2026", color: B_INDIGO },
    { id: "b3", name: "Edition Champion",symbol: "III", desc: "ProEngage Edition Champion",      earned: "Mar 2025", color: B_YELLOW },
    { id: "b4", name: "Top Mobiliser",   symbol: "IV",  desc: "Mobilised most volunteers",       earned: "Sep 2024", color: B_RED    },
  ],
};

const STAT_TOOLTIPS: Record<string, string> = {
  "Hours Volunteered": "Total hours logged across all TVW events and ProEngage projects.",
  "Projects Applied": "ProEngage applications submitted across all editions.",
  "Completed": "Projects where both you and the NGO submitted feedback. Unlocks certificate.",
  "Dropped": "Projects that ended early. Remain on your record.",
  "Referred": "Colleagues or family who joined via your referral link.",
  "Badges Earned": "Awarded for milestones — completing projects, hours, TVW participation.",
};

const SPOC_STAT_TOOLTIPS: Record<string, string> = {
  "Total Volunteers": "Registered volunteers across all TCS entities in your scope.",
  "Active PE Projects": "Volunteers currently engaged in a ProEngage project.",
  "TVW Events": "Events posted by TCS SPOCs in this edition.",
  "Pending Approvals": "Retiree & no-email employee registrations awaiting your approval.",
  "Matched": "Volunteers selected by an NGO and currently active.",
  "Completed": "Projects both parties closed with feedback submitted.",
  "Paused": "Projects temporarily on hold.",
  "Dropped": "Projects terminated before completion.",
};

const PE_PIPELINE = [
  { id: 1, name: "Amit Shah",     project: "Digital Literacy",       ngo: "Pratham",           status: "Active",    match: 95, daysInactive: 2,  isAtRisk: false, email: "amit.s@tcs.com",    city: "Mumbai" },
  { id: 2, name: "Sneha Patil",   project: "Financial Literacy",     ngo: "Swayam Krishi",     status: "Matched",   match: 88, daysInactive: 1,  isAtRisk: false, email: "sneha.p@tcs.com",   city: "Pune"   },
  { id: 3, name: "Rahul Sharma",  project: "Water Conservation",     ngo: "Arpan",             status: "Applied",   match: 92, daysInactive: 0,  isAtRisk: false, email: "rahul.s@tcs.com",   city: "Delhi"  },
  { id: 4, name: "Priya Das",     project: "Rural Education",        ngo: "Teach For India",   status: "Completed", match: 82, daysInactive: 0,  isAtRisk: false, email: "priya.d@tcs.com",   city: "Kolkata"},
  { id: 5, name: "Vikram Singh",  project: "Skill Development",      ngo: "Skill India",       status: "Dropped",   match: 78, daysInactive: 0,  isAtRisk: false, email: "vikram.s@tcs.com",  city: "Noida"  },
  { id: 6, name: "Ananya Iyer",   project: "Women Empowerment",      ngo: "SEWA",             status: "Active",    match: 90, daysInactive: 0,  isAtRisk: false, email: "ananya.i@tcs.com",  city: "Mumbai" },
  { id: 7, name: "Rajesh Kumar",  project: "Digital Literacy",       ngo: "Pratham",           status: "Active",    match: 85, daysInactive: 14, isAtRisk: true,  email: "rajesh.k@tcs.com",  city: "Mumbai" },
  { id: 8, name: "Meena Gupta",   project: "Financial Literacy",     ngo: "Swayam Krishi",     status: "Matched",   match: 80, daysInactive: 3,  isAtRisk: true,  email: "meena.g@tcs.com",   city: "Delhi"  },
];

const TVW_EVENTS = [
  { id: 1, title: "Digital Literacy for Seniors",   date: "22 Sep 2025", mode: "In-Person · Mumbai",  registered: 28, capacity: 40, status: "Upcoming" },
  { id: 2, title: "Tree Plantation Drive",           date: "28 Sep 2025", mode: "In-Person · Pune",   registered: 35, capacity: 35, status: "Full"     },
  { id: 3, title: "Healthcare Awareness Camp",       date: "4 Oct 2025",  mode: "In-Person · Delhi",  registered: 18, capacity: 50, status: "Upcoming" },
];

const PENDING_APPROVALS = [
  { id: 1, name: "Arun Kumar",     type: "Retiree",            email: "arun.k@gmail.com",    date: "01 Apr 2026", status: "Pending"  },
  { id: 2, name: "Sunita Williams",type: "No-email Employee",  email: "sunita.w@yahoo.com",  date: "02 Apr 2026", status: "Pending"  },
  { id: 3, name: "David Miller",   type: "Retiree",            email: "david.m@outlook.com", date: "03 Apr 2026", status: "Pending"  },
];

const SPOC_DIRECTORY = [
  { id: 1, name: "Rohan Desai",       role: "Corporate SPOC", geography: "Global",      status: "Active",   lastActive: "2 mins ago" },
  { id: 2, name: "Anjali Gupta",      role: "Regional SPOC",  geography: "North India", status: "Active",   lastActive: "1 hour ago" },
  { id: 3, name: "Vikram Malhotra",   role: "Regional SPOC",  geography: "West India",  status: "Inactive", lastActive: "3 days ago" },
  { id: 4, name: "Karan Johar",       role: "Regional SPOC",  geography: "East India",  status: "Active",   lastActive: "1 day ago"  },
];

const LEADERBOARD = [
  { rank: 1, name: "Tata Steel",    matched: 1420, delta: "+18" },
  { rank: 2, name: "TCS",           matched: 1240, delta: "+12", isUs: true },
  { rank: 3, name: "Tata Motors",   matched: 980,  delta: "+7"  },
  { rank: 4, name: "Titan",         matched: 750,  delta: "+5"  },
  { rank: 5, name: "Tata Power",    matched: 620,  delta: "+3"  },
];

const VOL_HISTORY = [
  { id: "a1", project: "NGO Digitisation Support",       ngo: "Saksham Foundation", edition: "ProEngage 10", year: "2025", status: "Completed", hours: 42 },
  { id: "a2", project: "Volunteer Coordination System",  ngo: "Teach For India",    edition: "ProEngage 9",  year: "2024", status: "Completed", hours: 28 },
];

const RESOURCES = [
  { id: "photos",  label: "Photos",   desc: "TVW22, VolCon 2024 and ProEngage galleries",   count: "247 items",  accentColor: B_INDIGO, pastel: P_INDIGO, photo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80" },
  { id: "emodule", label: "E-Module", desc: "SPOC orientation, readiness kit, dos & don'ts", count: "5 modules",  accentColor: B_BLUE,   pastel: P_BLUE,   photo: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80" },
  { id: "media",   label: "Media",    desc: "TVW + PE campaign assets and brand materials",   count: "94 items",   accentColor: B_TEAL,   pastel: P_TEAL,   photo: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80" },
];

// ─── Shared style helpers ─────────────────────────────────────────────────────
const card: React.CSSProperties = { background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, padding: "20px 22px" };
const spocCard: React.CSSProperties = { background: "#fff", border: `1.5px solid #c8c6f0`, borderRadius: 14, padding: "20px 22px" };

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start || target === 0) { setValue(0); return; }
    let t0: number | null = null;
    const tick = (now: number) => {
      if (!t0) t0 = now;
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setValue(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return value;
}

// ─── Stat tile (volunteer) ────────────────────────────────────────────────────
function StatTile({ value, label, pastel, accentColor, delay, started, tooltipText }: {
  value: number; label: string; pastel: string; accentColor: string; delay: number; started: boolean; tooltipText?: string;
}) {
  const [go, setGo] = useState(false);
  const [showTip, setShowTip] = useState(false);
  useEffect(() => {
    if (started) { const t = setTimeout(() => setGo(true), delay); return () => clearTimeout(t); }
  }, [started, delay]);
  const n = useCountUp(value, 1100, go);
  return (
    <div
      style={{ background: pastel, borderRadius: 14, padding: "20px 14px 16px", textAlign: "center", border: `1px solid ${accentColor}22`, transition: "transform 0.2s, box-shadow 0.2s", cursor: "default", position: "relative" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${accentColor}22`; setShowTip(true); }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; setShowTip(false); }}
    >
      <div style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 38, fontWeight: 900, lineHeight: 1, letterSpacing: "-2px", color: accentColor }}>
        {n}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: ACCENT_NAVY, marginTop: 8, textTransform: "uppercase", letterSpacing: "0.6px", lineHeight: 1.3 }}>{label}</div>
      {showTip && tooltipText && (
        <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: ACCENT_NAVY, color: "rgba(255,255,255,0.88)", fontSize: 12, lineHeight: 1.5, padding: "10px 14px", borderRadius: 9, width: 200, zIndex: 50, pointerEvents: "none", boxShadow: "0 4px 20px rgba(13,27,62,0.2)", textAlign: "left", fontWeight: 400 }}>
          {tooltipText}
          <div style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)", width: 10, height: 10, background: ACCENT_NAVY, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
        </div>
      )}
    </div>
  );
}

// ─── SPOC Stat tile (indigo accent) ──────────────────────────────────────────
function SPOCStatTile({ value, label, pastel, accentColor, delay, started, tooltipText }: {
  value: number; label: string; pastel: string; accentColor: string; delay: number; started: boolean; tooltipText?: string;
}) {
  const [go, setGo] = useState(false);
  const [showTip, setShowTip] = useState(false);
  useEffect(() => {
    if (started) { const t = setTimeout(() => setGo(true), delay); return () => clearTimeout(t); }
  }, [started, delay]);
  const n = useCountUp(value, 1100, go);
  return (
    <div
      style={{ background: pastel, borderRadius: 12, padding: "16px 12px 14px", textAlign: "center", border: `1px solid ${accentColor}30`, transition: "transform 0.2s, box-shadow 0.2s", cursor: "default", position: "relative" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; setShowTip(true); }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; setShowTip(false); }}
    >
      <div style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 28, fontWeight: 900, lineHeight: 1, letterSpacing: "-1.5px", color: accentColor }}>
        {n.toLocaleString()}
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, color: ACCENT_NAVY, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.5px", lineHeight: 1.3 }}>{label}</div>
      {showTip && tooltipText && (
        <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: ACCENT_NAVY, color: "rgba(255,255,255,0.88)", fontSize: 11.5, lineHeight: 1.5, padding: "9px 13px", borderRadius: 9, width: 190, zIndex: 50, pointerEvents: "none", boxShadow: "0 4px 20px rgba(13,27,62,0.2)", textAlign: "left", fontWeight: 400 }}>
          {tooltipText}
          <div style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)", width: 10, height: 10, background: ACCENT_NAVY, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
        </div>
      )}
    </div>
  );
}

// ─── Section heading (same as DashboardView) ──────────────────────────────────
function SectionHeading({ eyebrow, title, spocMode = false }: { eyebrow: string; title: string; spocMode?: boolean }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: spocMode ? "#8882cc" : "#aaaabc", marginBottom: 5 }}>{eyebrow}</div>
      <h2 style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 21, fontWeight: 900, color: ACCENT_NAVY, margin: 0, letterSpacing: -0.3 }}>{title}</h2>
    </div>
  );
}

// ─── Pill slicers ─────────────────────────────────────────────────────────────
function Slicers({ options, active, onChange, accentColor = B_INDIGO }: { options: { id: string; label: string }[]; active: string; onChange: (id: string) => void; accentColor?: string }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 22 }}>
      {options.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)} style={{ padding: "6px 16px", borderRadius: 100, border: `1.5px solid ${active === o.id ? accentColor : "#dddde8"}`, background: active === o.id ? accentColor : "transparent", color: active === o.id ? "#fff" : "#666", fontSize: 13, fontWeight: active === o.id ? 600 : 400, cursor: "pointer", transition: "all 0.15s", fontFamily: "'Noto Sans', sans-serif" }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    Active:    [P_TEAL,   B_TEAL],
    Matched:   [P_TEAL,   B_TEAL],
    Completed: [P_BLUE,   B_BLUE],
    Dropped:   [P_RED,    B_RED],
    Applied:   [P_INDIGO, B_INDIGO],
    Pending:   [P_YELLOW, "#9a6500"],
    Approved:  [P_TEAL,   B_TEAL],
    Full:      [P_RED,    B_RED],
    Upcoming:  [P_INDIGO, B_INDIGO],
    Paused:    [P_YELLOW, "#9a6500"],
    Inactive:  ["#f0f0f4", "#888"],
  };
  const [bg, color] = map[status] ?? ["#f0f0f0", "#555"];
  return <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, letterSpacing: "0.3px", whiteSpace: "nowrap" }}>{status}</span>;
}

// ─── Resource card ────────────────────────────────────────────────────────────
function ResourceCard({ r }: { r: typeof RESOURCES[0] }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, overflow: "hidden", cursor: "pointer", transform: hov ? "translateY(-3px)" : "translateY(0)", boxShadow: hov ? `0 8px 24px ${r.accentColor}18` : "none", transition: "transform 0.18s, box-shadow 0.18s" }}
    >
      <div style={{ height: 80, background: `url(${r.photo}) center/cover`, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: `${r.accentColor}88` }} />
      </div>
      <div style={{ background: r.pastel, padding: "12px 14px" }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: ACCENT_NAVY, marginBottom: 3 }}>{r.label}</div>
        <div style={{ fontSize: 11, color: "#6b6b7a", lineHeight: 1.4, marginBottom: 6 }}>{r.desc}</div>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: r.accentColor }}>{r.count}</div>
      </div>
    </div>
  );
}

// ─── Risk dot ─────────────────────────────────────────────────────────────────
function RiskDot({ severity }: { severity: "high" | "medium" | "low" }) {
  const c = severity === "high" ? B_RED : severity === "medium" ? B_YELLOW : B_TEAL;
  return <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: c, marginRight: 6 }} />;
}

// ─── Action card (SPOC quick actions) ─────────────────────────────────────────
function ActionCard({ icon, title, desc, cta, onClick }: { icon: string; title: string; desc: string; cta: string; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? P_SPOC : "#fafafa", border: "1px solid #e8e8f0", borderRadius: 12, padding: "16px", transition: "background 0.18s, border-color 0.18s", borderColor: hov ? "#c8c6f0" : "#e8e8f0" }}
    >
      <div style={{ fontSize: 18, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 12, color: "#6b6b7a", lineHeight: 1.5, marginBottom: 12 }}>{desc}</div>
      <button onClick={onClick} style={{ fontSize: 12, fontWeight: 600, color: B_SPOC, background: "none", border: `1px solid #c8c6f0`, borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>
        {cta} →
      </button>
    </div>
  );
}

// ─── Toast helper ─────────────────────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const show = (m: string) => { setMsg(m); setTimeout(() => setMsg(null), 3000); };
  return { msg, show };
}

// ─── SPOC sections config ─────────────────────────────────────────────────────
const SPOC_SECTIONS = [
  { id: "spoc-kpis",      label: "Impact KPIs"     },
  { id: "spoc-tvw",       label: "TVW Actions"      },
  { id: "spoc-oversight", label: "Manage & Oversight"},
  { id: "spoc-mgt",       label: "SPOC Mgt"         },
  { id: "spoc-resources", label: "Resources"         },
];

const VOL_SECTIONS = [
  { id: "snapshot",   label: "Snapshot"   },
  { id: "activities", label: "Activities" },
  { id: "history",    label: "History"    },
  { id: "resources",  label: "Resources"  },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SPOCDashboardView() {
  const navigate = useNavigate();
  const { show: toast, msg: toastMsg } = useToast();

  // Mode
  const [spocMode, setSpocMode] = useState(false);

  // Volunteer section state
  const [snapStarted,   setSnapStarted]   = useState(false);
  const [spocStarted,   setSpocStarted]   = useState(false);
  const [actTab,        setActTab]        = useState("opportunities");
  const [histTab,       setHistTab]       = useState("applications");
  const [activeSection, setActiveSection] = useState("snapshot");
  const snapRef = useRef<HTMLDivElement>(null);
  const spocRef = useRef<HTMLDivElement>(null);

  // SPOC pipeline state
  const [pipelineSearch, setPipelineSearch] = useState("");
  const [pipelineFilter, setPipelineFilter] = useState("All");
  const [nudged, setNudged] = useState<Set<number>>(new Set());
  const [approvals, setApprovals] = useState(PENDING_APPROVALS);
  const [activeSpocSection, setActiveSpocSection] = useState("spoc-kpis");

  // Count-up trigger on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.target === snapRef.current && e.isIntersecting) setSnapStarted(true);
        if (e.target === spocRef.current && e.isIntersecting) setSpocStarted(true);
      });
    }, { threshold: 0.2 });
    if (snapRef.current) obs.observe(snapRef.current);
    if (spocRef.current) obs.observe(spocRef.current);
    return () => obs.disconnect();
  }, []);

  // Scroll to section
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  // Scroll observer for right rail
  useEffect(() => {
    const ids = spocMode
      ? [...SPOC_SECTIONS.map(s => s.id), ...VOL_SECTIONS.map(s => s.id)]
      : VOL_SECTIONS.map(s => s.id);
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.25 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [spocMode]);

  const handleNudge = (id: number) => {
    setNudged(prev => new Set([...prev, id]));
    toast("Nudge sent to volunteer and logged in activity trail.");
  };

  const handleApprove = (id: number) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: "Approved" } : a));
    toast("Volunteer approved — welcome email sent.");
  };
  const handleReject = (id: number) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: "Rejected" } : a));
    toast("Application rejected — reason sent to applicant.");
  };

  const filteredPipeline = PE_PIPELINE.filter(v => {
    const matchesSearch = !pipelineSearch || v.name.toLowerCase().includes(pipelineSearch.toLowerCase()) || v.project.toLowerCase().includes(pipelineSearch.toLowerCase());
    const matchesFilter = pipelineFilter === "All" || v.status === pipelineFilter || (pipelineFilter === "At Risk" && v.isAtRisk);
    return matchesSearch && matchesFilter;
  });

  // ─── Right rail ──────────────────────────────────────────────────────────────
  const RightRail = () => (
    <div style={{ width: 148, flexShrink: 0, position: "sticky", top: 88, alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: 10 }}>
      {spocMode ? (
        <>
          {/* SPOC sections */}
          <div style={{ ...card, padding: "14px 16px" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: B_SPOC, marginBottom: 10, opacity: 0.8 }}>SPOC Corner</div>
            {SPOC_SECTIONS.map(s => (
              <div key={s.id} onClick={() => scrollTo(s.id)}
                style={{ fontSize: 12, padding: "5px 0", borderBottom: "1px solid #f0f0f8", cursor: "pointer", color: activeSection === s.id ? B_SPOC : "#6b6b7a", fontWeight: activeSection === s.id ? 700 : 400, transition: "color 0.15s" }}>
                {activeSection === s.id ? "↑ " : ""}{s.label}
              </div>
            ))}
          </div>
          {/* Volunteer sections */}
          <div style={{ ...card, padding: "14px 16px" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 10 }}>Volunteer</div>
            {VOL_SECTIONS.map(s => (
              <div key={s.id} onClick={() => scrollTo(s.id)}
                style={{ fontSize: 12, padding: "5px 0", borderBottom: "1px solid #f0f0f8", cursor: "pointer", color: activeSection === s.id ? B_BLUE : "#6b6b7a", fontWeight: activeSection === s.id ? 700 : 400, transition: "color 0.15s" }}>
                {activeSection === s.id ? "↑ " : ""}{s.label}
              </div>
            ))}
          </div>
          {/* Quick links */}
          <div style={{ ...card, padding: "14px 16px" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 10 }}>Quick links</div>
            {[
              { label: "Edit Profile",       action: () => navigate("/profile") },
              { label: "Add Opportunity",    action: () => toast("Opening TVW event creator…") },
              { label: "Pending Approvals",  action: () => { scrollTo("spoc-mgt"); } },
              { label: "Download Certs",     action: () => toast("Preparing ZIP of all certificates…") },
            ].map(l => (
              <div key={l.label} onClick={l.action} style={{ fontSize: 12, padding: "5px 0", borderBottom: "1px solid #f0f0f8", cursor: "pointer", color: B_SPOC, fontWeight: 500, transition: "opacity 0.15s" }}>
                {l.label}
              </div>
            ))}
          </div>
          {/* Leaderboard mini */}
          <div style={{ background: P_SPOC, border: `1.5px solid #c8c6f0`, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: B_SPOC, marginBottom: 8, opacity: 0.8 }}>Leaderboard</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#3C3489" }}>#{SPOC.leaderboardRank} · TCS</div>
            <div style={{ fontSize: 11, color: B_SPOC, marginTop: 3 }}>{SPOC.leaderboardMatched.toLocaleString()} matched</div>
            <div style={{ fontSize: 10, color: "#7F77DD", marginTop: 2 }}>↑ {SPOC.leaderboardTrend}</div>
          </div>
        </>
      ) : (
        <>
          {/* Volunteer only mode */}
          <div style={{ ...card, padding: "14px 16px" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 10 }}>Sections</div>
            {VOL_SECTIONS.map(s => (
              <div key={s.id} onClick={() => scrollTo(s.id)}
                style={{ fontSize: 12, padding: "5px 0", borderBottom: "1px solid #f0f0f8", cursor: "pointer", color: activeSection === s.id ? B_BLUE : "#6b6b7a", fontWeight: activeSection === s.id ? 700 : 400, transition: "color 0.15s" }}>
                {activeSection === s.id ? "↑ " : ""}{s.label}
              </div>
            ))}
          </div>
          <div style={{ ...card, padding: "14px 16px" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 10 }}>Quick links</div>
            <div onClick={() => navigate("/profile")} style={{ fontSize: 12, padding: "5px 0", borderBottom: "1px solid #f0f0f8", cursor: "pointer", color: B_BLUE, fontWeight: 500 }}>Edit Profile</div>
            <div onClick={() => toast("Grievance form opened.")} style={{ fontSize: 12, padding: "5px 0", cursor: "pointer", color: B_BLUE, fontWeight: 500 }}>Raise Grievance</div>
          </div>
        </>
      )}
    </div>
  );

  // ─── SPOC Sections (rendered above volunteer when spocMode ON) ────────────────
  const SPOCSections = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── I. Impact KPIs ─────────────────────────────────────── */}
      <div id="spoc-kpis" ref={spocRef} style={spocCard}>
        <SectionHeading eyebrow="SPOC Corner · I" title="Company Impact KPIs" spocMode />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
          {[
            { value: SPOC.spocStats.totalVolunteers, label: "Total Volunteers", pastel: P_SPOC,   accentColor: B_SPOC,   delay: 0   },
            { value: SPOC.spocStats.activeProEngage, label: "Active PE Projects",pastel: P_TEAL,  accentColor: B_TEAL,   delay: 100 },
            { value: SPOC.spocStats.tvwEvents,       label: "TVW Events",        pastel: P_BLUE,  accentColor: B_BLUE,   delay: 200 },
            { value: SPOC.spocStats.pendingApprovals,label: "Pending Approvals", pastel: P_YELLOW,accentColor: "#9a6500", delay: 300 },
          ].map((t, i) => (
            <SPOCStatTile key={i} {...t} started={spocStarted} tooltipText={SPOC_STAT_TOOLTIPS[t.label]} />
          ))}
        </div>
        {/* PE pipeline mini stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
          {[
            { value: SPOC.spocStats.matched,   label: "Matched",   pastel: P_TEAL,  accentColor: B_TEAL   },
            { value: SPOC.spocStats.completed,  label: "Completed", pastel: P_BLUE,  accentColor: B_BLUE   },
            { value: SPOC.spocStats.paused,     label: "Paused",    pastel: P_YELLOW,accentColor: "#9a6500" },
            { value: SPOC.spocStats.dropped,    label: "Dropped",   pastel: P_RED,   accentColor: B_RED    },
            { value: SPOC.spocStats.rejected,   label: "Rejected",  pastel: "#f4f4f4",accentColor:"#888"   },
          ].map((t, i) => (
            <SPOCStatTile key={i} {...t} delay={i * 80} started={spocStarted} tooltipText={SPOC_STAT_TOOLTIPS[t.label]} />
          ))}
        </div>

        {/* At-risk alert row */}
        {PE_PIPELINE.filter(v => v.isAtRisk).length > 0 && (
          <div style={{ marginTop: 16, background: P_RED, border: `1px solid ${B_RED}22`, borderRadius: 10, padding: "12px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: B_RED, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>⚠ At-Risk Volunteers</div>
            {PE_PIPELINE.filter(v => v.isAtRisk).map(v => (
              <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, fontSize: 13 }}>
                <RiskDot severity={v.daysInactive > 10 ? "high" : "medium"} />
                <span style={{ fontWeight: 600, color: ACCENT_NAVY }}>{v.name}</span>
                <span style={{ color: "#6b6b7a" }}>{v.project} · {v.daysInactive} days inactive</span>
                <button onClick={() => handleNudge(v.id)}
                  style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: nudged.has(v.id) ? B_TEAL : B_RED, background: "none", border: `1px solid ${nudged.has(v.id) ? B_TEAL : B_RED}`, borderRadius: 6, padding: "3px 10px", cursor: nudged.has(v.id) ? "default" : "pointer", fontFamily: "'Noto Sans', sans-serif" }}>
                  {nudged.has(v.id) ? "✓ Sent" : "Send Nudge"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── II. TVW Actions ────────────────────────────────────── */}
      <div id="spoc-tvw" style={spocCard}>
        <SectionHeading eyebrow="SPOC Corner · II" title="TVW Actions" spocMode />
        <div style={{ display: "flex", gap: 10, marginBottom: 16, justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13, color: "#6b6b7a" }}>TVW Edition 23 · Active · 3 events posted</div>
          <button onClick={() => toast("Opening event creation form…")}
            style={{ fontSize: 12, fontWeight: 600, color: "#fff", background: B_SPOC, border: "none", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>
            + Post New Event
          </button>
        </div>
        {TVW_EVENTS.map(ev => (
          <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid #f0f0f8" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: ACCENT_NAVY }}>{ev.title}</div>
              <div style={{ fontSize: 12, color: "#6b6b7a", marginTop: 2 }}>{ev.date} · {ev.mode}</div>
            </div>
            <StatusBadge status={ev.status} />
            <div style={{ fontSize: 12, color: "#6b6b7a", whiteSpace: "nowrap" }}>{ev.registered}/{ev.capacity}</div>
            <button onClick={() => toast("Opening vibe update form…")} style={{ fontSize: 11, fontWeight: 600, color: B_SPOC, background: P_SPOC, border: `1px solid #c8c6f0`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif", whiteSpace: "nowrap" }}>
              Submit Vibe
            </button>
          </div>
        ))}
        <button onClick={() => toast("Opening campaign materials kit…")} style={{ marginTop: 14, fontSize: 12, fontWeight: 600, color: B_SPOC, background: "none", border: `1px solid #c8c6f0`, borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>
          📦 Download Campaign Kit
        </button>
      </div>

      {/* ── III. Manage & Oversight ────────────────────────────── */}
      <div id="spoc-oversight" style={spocCard}>
        <SectionHeading eyebrow="SPOC Corner · III" title="Manage & Oversight" spocMode />
        {/* Pipeline filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
          <input value={pipelineSearch} onChange={e => setPipelineSearch(e.target.value)} placeholder="Search volunteer or project…"
            style={{ flex: "1 1 180px", border: "1.5px solid #e0e0e8", borderRadius: 9, padding: "7px 12px", fontSize: 13, fontFamily: "'Noto Sans', sans-serif", color: ACCENT_NAVY, outline: "none" }} />
          {["All", "Active", "Matched", "Applied", "Completed", "Dropped", "At Risk"].map(f => (
            <button key={f} onClick={() => setPipelineFilter(f)}
              style={{ fontSize: 11.5, fontWeight: pipelineFilter === f ? 700 : 400, padding: "5px 12px", borderRadius: 100, border: `1.5px solid ${pipelineFilter === f ? B_SPOC : "#dddde8"}`, background: pipelineFilter === f ? B_SPOC : "transparent", color: pipelineFilter === f ? "#fff" : "#666", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Pipeline table */}
        <div style={{ border: "1px solid #e8e8f0", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr", gap: 12, padding: "10px 16px", background: "#f8f8fc", borderBottom: "1px solid #e8e8f0" }}>
            {["Volunteer", "Project", "NGO", "Status", ""].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</div>
            ))}
          </div>
          {filteredPipeline.map((v, i) => (
            <div key={v.id} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr", gap: 12, padding: "11px 16px", borderBottom: i < filteredPipeline.length - 1 ? "1px solid #f0f0f8" : "none", background: v.isAtRisk ? `${B_RED}08` : "#fff", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY, display: "flex", alignItems: "center", gap: 6 }}>
                  {v.isAtRisk && <RiskDot severity={v.daysInactive > 10 ? "high" : "medium"} />}
                  {v.name}
                </div>
                <div style={{ fontSize: 11, color: "#aaaabc" }}>{v.email}</div>
              </div>
              <div style={{ fontSize: 12.5, color: "#555" }}>{v.project}</div>
              <div style={{ fontSize: 12, color: "#6b6b7a" }}>{v.ngo}</div>
              <StatusBadge status={v.status} />
              <button onClick={() => toast(`Viewing ${v.name}'s profile…`)} style={{ fontSize: 11, fontWeight: 600, color: B_SPOC, background: "none", border: `1px solid #c8c6f0`, borderRadius: 6, padding: "3px 9px", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif", whiteSpace: "nowrap" }}>
                View →
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button onClick={() => toast("Downloading volunteer list as Excel…")} style={{ fontSize: 12, fontWeight: 600, color: B_SPOC, background: "none", border: `1px solid #c8c6f0`, borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>⬇ Download Volunteer List</button>
          <button onClick={() => toast("Preparing ZIP of all certificates…")} style={{ fontSize: 12, fontWeight: 600, color: B_SPOC, background: "none", border: `1px solid #c8c6f0`, borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>🏅 Bulk Download Certs</button>
        </div>
      </div>

      {/* ── IV. SPOC Management ────────────────────────────────── */}
      <div id="spoc-mgt" style={spocCard}>
        <SectionHeading eyebrow="SPOC Corner · IV" title="SPOC Management" spocMode />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Directory */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT_NAVY, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>SPOC Directory</div>
            {SPOC_DIRECTORY.map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f0f0f8" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: s.status === "Active" ? P_SPOC : "#f0f0f4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: s.status === "Active" ? B_SPOC : "#aaa", flexShrink: 0 }}>
                  {s.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: ACCENT_NAVY }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "#6b6b7a" }}>{s.role} · {s.geography}</div>
                </div>
                <StatusBadge status={s.status} />
              </div>
            ))}
            <button onClick={() => toast("Opening SPOC management form…")} style={{ marginTop: 10, fontSize: 12, fontWeight: 600, color: B_SPOC, background: "none", border: `1px solid #c8c6f0`, borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>
              + Add Regional SPOC
            </button>
          </div>
          {/* Pending approvals */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT_NAVY, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              Pending Approvals
              {approvals.filter(a => a.status === "Pending").length > 0 && (
                <span style={{ background: B_RED, color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 100 }}>
                  {approvals.filter(a => a.status === "Pending").length}
                </span>
              )}
            </div>
            {approvals.map(a => (
              <div key={a.id} style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f8" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: ACCENT_NAVY, flex: 1 }}>{a.name}</div>
                  <StatusBadge status={a.status} />
                </div>
                <div style={{ fontSize: 11, color: "#6b6b7a", marginBottom: a.status === "Pending" ? 6 : 0 }}>{a.type} · {a.date}</div>
                {a.status === "Pending" && (
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => handleApprove(a.id)} style={{ fontSize: 11, fontWeight: 600, color: "#fff", background: B_TEAL, border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>Approve</button>
                    <button onClick={() => handleReject(a.id)} style={{ fontSize: 11, fontWeight: 600, color: B_RED, background: P_RED, border: `1px solid ${B_RED}33`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── V. SPOC Resources ─────────────────────────────────── */}
      <div id="spoc-resources" style={spocCard}>
        <SectionHeading eyebrow="SPOC Corner · V" title="SPOC Resources" spocMode />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <ActionCard icon="📚" title="E-Module (Orientation)" desc="Mandatory SPOC orientation. Progress tracked by Admin. 2 of 5 modules completed." cta="Continue" onClick={() => toast("Opening orientation module…")} />
          <ActionCard icon="🖼" title="Media Library" desc="TVW + PE assets, campaign materials. View-only access for SPOC." cta="Browse" onClick={() => toast("Opening media library…")} />
          <ActionCard icon="📋" title="Open PE Projects" desc="Downloadable real-time list of open projects with direct apply links to share with volunteers." cta="Download list" onClick={() => toast("Preparing project list PDF…")} />
        </div>
      </div>

      {/* ── Leaderboard (SPOC only) ─────────────────────────── */}
      <div style={spocCard}>
        <SectionHeading eyebrow="SPOC Corner · Leaderboard" title="Company Rankings" spocMode />
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 4 }}>
          {LEADERBOARD.map(co => (
            <div key={co.rank} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: co.isUs ? P_SPOC : "#fafafa", borderRadius: 10, border: co.isUs ? `1.5px solid #c8c6f0` : "1px solid #f0f0f8" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: co.rank <= 3 ? B_SPOC : "#e8e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: co.rank <= 3 ? "#fff" : "#aaa", flexShrink: 0 }}>{co.rank}</div>
              <div style={{ flex: 1, fontSize: 13.5, fontWeight: co.isUs ? 800 : 500, color: ACCENT_NAVY }}>{co.name}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: co.isUs ? B_SPOC : ACCENT_NAVY }}>{co.matched.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "#6b6b7a", minWidth: 60, textAlign: "right" }}>{co.delta}</div>
              {co.isUs && <span style={{ background: B_SPOC, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100 }}>YOU</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── Volunteer Sections ───────────────────────────────────────────────────────
  const VolunteerSections = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* ── Engagement Snapshot ──────────────────────────────── */}
      <div id="snapshot" ref={snapRef} style={card}>
        <SectionHeading eyebrow="My Space · I" title="Engagement Snapshot" />

        {/* Stat tiles — 6-up grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { value: SPOC.hoursVolunteered, label: "Hours Volunteered", pastel: P_TEAL,  accentColor: B_TEAL,   delay: 0   },
            { value: SPOC.projectsApplied,  label: "Projects Applied",  pastel: P_INDIGO,accentColor: B_INDIGO,  delay: 100 },
            { value: SPOC.projectsCompleted,label: "Completed",         pastel: P_BLUE,  accentColor: B_BLUE,   delay: 200 },
            { value: SPOC.projectsDropped,  label: "Dropped",           pastel: P_RED,   accentColor: B_RED,    delay: 300 },
            { value: SPOC.referrals,        label: "Referred",          pastel: P_YELLOW,accentColor: B_YELLOW,  delay: 400 },
            { value: SPOC.badgesEarned,     label: "Badges Earned",     pastel: P_SPOC,  accentColor: B_SPOC,   delay: 500 },
          ].map((t, i) => (
            <StatTile key={i} {...t} started={snapStarted} tooltipText={STAT_TOOLTIPS[t.label]} />
          ))}
        </div>

        {/* Skills & interests */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 8 }}>Skills</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {SPOC.skills.map(s => <span key={s} style={{ background: P_INDIGO, color: B_INDIGO, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 100 }}>{s}</span>)}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 8 }}>Interests</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {SPOC.interests.map(s => <span key={s} style={{ background: P_TEAL, color: B_TEAL, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 100 }}>{s}</span>)}
          </div>
        </div>

        {/* Badges shelf */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 10 }}>Badges</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {SPOC.badges.map(b => (
              <div key={b.id} title={`${b.name} — ${b.desc} (${b.earned})`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: b.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "'Noto Sans', sans-serif" }}>{b.symbol}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: ACCENT_NAVY, textAlign: "center", maxWidth: 60, lineHeight: 1.2 }}>{b.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SPOC role badges */}
        <div style={{ marginTop: 20, padding: "14px 16px", background: P_SPOC, borderRadius: 12, border: `1px solid #c8c6f0` }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: B_SPOC, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>SPOC Achievements</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { emoji: "🏅", label: "Edition Champion", sub: "ProEngage 2025" },
              { emoji: "⭐", label: "Top Mobiliser",    sub: "TVW 2024" },
              { emoji: "🤝", label: "Community Builder", sub: "ProEngage 2024" },
            ].map(b => (
              <div key={b.label} style={{ background: "#fff", border: `1px solid #c8c6f0`, borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>{b.emoji}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: B_SPOC }}>{b.label}</div>
                  <div style={{ fontSize: 10, color: "#6b6b7a" }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Activities ───────────────────────────────────────── */}
      <div id="activities" style={card}>
        <SectionHeading eyebrow="My Space · II" title="My Activities" />
        <Slicers
          options={[
            { id: "opportunities", label: "View Opportunities" },
            { id: "diy",           label: "DIY Activities"     },
            { id: "proengage",     label: "My ProEngage Project"},
          ]}
          active={actTab}
          onChange={setActTab}
          accentColor={B_BLUE}
        />

        {actTab === "opportunities" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 13, color: "#6b6b7a", marginBottom: 4 }}>TVW Edition 23 · Active · 3 open events</div>
            {[
              { title: "Digital Literacy for Seniors", date: "22 Sep 2025", mode: "In-Person · Mumbai", spots: 12, accent: B_TEAL, pastel: P_TEAL },
              { title: "Healthcare Awareness Camp",    date: "4 Oct 2025",  mode: "In-Person · Delhi",  spots: 32, accent: B_RED,  pastel: P_RED  },
            ].map((ev, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px", background: ev.pastel, borderRadius: 12, border: `1px solid ${ev.accent}18` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: ACCENT_NAVY }}>{ev.title}</div>
                  <div style={{ fontSize: 12, color: "#6b6b7a", marginTop: 3 }}>{ev.date} · {ev.mode} · {ev.spots} spots left</div>
                </div>
                <button onClick={() => toast(`Registered for: ${ev.title}`)} style={{ fontSize: 12, fontWeight: 600, color: "#fff", background: ev.accent, border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif", whiteSpace: "nowrap" }}>Register</button>
              </div>
            ))}
          </div>
        )}

        {actTab === "diy" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { title: "Mentor a First-Gen Student", desc: "1 hr/week for 4 weeks. Set goals, share experience.", effort: "Low", accent: B_INDIGO, pastel: P_INDIGO },
              { title: "Teach Digital Skills",       desc: "A 2-hour workshop at a local school or NGO.", effort: "Medium", accent: B_BLUE, pastel: P_BLUE },
            ].map((d, i) => (
              <div key={i} style={{ padding: "14px", background: d.pastel, borderRadius: 12, border: `1px solid ${d.accent}18` }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: ACCENT_NAVY }}>{d.title}</div>
                    <div style={{ fontSize: 12, color: "#6b6b7a", marginTop: 4, lineHeight: 1.5 }}>{d.desc}</div>
                  </div>
                  <span style={{ background: d.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 100, whiteSpace: "nowrap", marginTop: 2 }}>{d.effort}</span>
                </div>
                <button onClick={() => toast("Opening DIY activity guide…")} style={{ marginTop: 10, fontSize: 12, fontWeight: 600, color: d.accent, background: "none", border: `1px solid ${d.accent}`, borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>Get started</button>
              </div>
            ))}
          </div>
        )}

        {actTab === "proengage" && SPOC.activeApplication && (
          <div>
            <div style={{ background: P_TEAL, border: `1px solid ${B_TEAL}22`, borderRadius: 12, padding: "16px", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: ACCENT_NAVY }}>{SPOC.activeApplication.title}</div>
                  <div style={{ fontSize: 12, color: "#6b6b7a", marginTop: 4 }}>{SPOC.activeApplication.ngo} · {SPOC.activeApplication.edition} · {SPOC.activeApplication.mode}</div>
                </div>
                <StatusBadge status={SPOC.activeApplication.status} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Post Project Update", icon: "📝", cta: "Post update" },
                { label: "Access E-Module",     icon: "📖", cta: "Open module" },
                { label: "Submit Feedback",     icon: "⭐", cta: "Give feedback" },
                { label: "Download Certificate",icon: "🏅", cta: "Download" },
              ].map(a => (
                <div key={a.label} style={{ background: "#fafafa", border: "1px solid #e8e8f0", borderRadius: 12, padding: "14px" }}>
                  <div style={{ fontSize: 16, marginBottom: 6 }}>{a.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY, marginBottom: 8 }}>{a.label}</div>
                  <button onClick={() => toast(`${a.label}…`)} style={{ fontSize: 11.5, fontWeight: 600, color: B_BLUE, background: P_BLUE, border: `1px solid ${B_BLUE}22`, borderRadius: 7, padding: "4px 10px", cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>{a.cta} →</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── History ──────────────────────────────────────────── */}
      <div id="history" style={card}>
        <SectionHeading eyebrow="My Space · III" title="My History" />
        <Slicers
          options={[
            { id: "applications", label: "My Applications" },
            { id: "projects",     label: "My Projects"     },
            { id: "certificates", label: "My Certificates" },
          ]}
          active={histTab}
          onChange={setHistTab}
          accentColor={B_BLUE}
        />

        {histTab === "applications" && (
          <div style={{ border: "1px solid #e8e8f0", borderRadius: 10, overflow: "hidden" }}>
            {VOL_HISTORY.map((a, i) => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderBottom: i < VOL_HISTORY.length - 1 ? "1px solid #f0f0f8" : "none", background: "#fff" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{a.project}</div>
                  <div style={{ fontSize: 11, color: "#6b6b7a", marginTop: 2 }}>{a.ngo} · {a.edition} · {a.hours}h</div>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        )}
        {histTab === "projects" && (
          <div style={{ fontSize: 13, color: "#6b6b7a", padding: "16px 0" }}>Completed projects are shown here with outcomes and skill impacts. Rohan has 2 completed projects.</div>
        )}
        {histTab === "certificates" && (
          <div style={{ fontSize: 13, color: "#6b6b7a", padding: "16px 0" }}>Certificates available for download. LinkedIn share enabled on each.</div>
        )}
      </div>

      {/* ── Resources ────────────────────────────────────────── */}
      <div id="resources" style={card}>
        <SectionHeading eyebrow="My Space · IV" title="Resources" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {RESOURCES.map(r => <ResourceCard key={r.id} r={r} />)}
        </div>
      </div>
    </div>
  );

  // ─── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "#f8f9ff", minHeight: "100vh", fontFamily: "'Noto Sans', sans-serif", paddingTop: 80, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px" }}>

        {/* ── Profile row ──────────────────────────────────────── */}
        <div style={{ background: ACCENT_NAVY, borderRadius: "0 0 18px 18px", padding: "24px 32px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: B_SPOC, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0, border: "3px solid rgba(255,255,255,0.15)" }}>
            RD
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 19, fontWeight: 900, color: "#fff", lineHeight: 1.2 }}>{SPOC.firstName} {SPOC.lastName}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 3 }}>{SPOC.designation} · {SPOC.company}</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ background: P_SPOC, color: B_SPOC, fontSize: 11.5, fontWeight: 700, padding: "4px 12px", borderRadius: 100 }}>Corporate SPOC</span>
            <span style={{ background: P_TEAL, color: B_TEAL, fontSize: 11.5, fontWeight: 700, padding: "4px 12px", borderRadius: 100 }}>Verified</span>
          </div>
        </div>

        {/* ── SPOC Toggle ──────────────────────────────────────── */}
        <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 12, padding: "12px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 13, color: spocMode ? "#aaaabc" : ACCENT_NAVY, fontWeight: spocMode ? 400 : 600, transition: "all 0.2s" }}>Volunteer View</span>
          <div onClick={() => setSpocMode(m => !m)}
            style={{ position: "relative", width: 44, height: 24, borderRadius: 12, background: spocMode ? B_SPOC : "#d0d0e0", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 3, left: spocMode ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
          </div>
          <span style={{ fontSize: 13, color: spocMode ? B_SPOC : "#aaaabc", fontWeight: spocMode ? 700 : 400, transition: "all 0.2s" }}>SPOC Corner</span>
          <span style={{ fontSize: 11.5, color: "#aaaabc", marginLeft: "auto" }}>Toggle to access SPOC management tools</span>
        </div>

        {/* ── Main layout ──────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          {/* Left scroll area */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>
            {spocMode ? (
              <>
                <SPOCSections />
                <div style={{ borderTop: "2px dashed #c8c6f0", paddingTop: 24, position: "relative" }}>
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#f8f9ff", padding: "0 12px", fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px" }}>Your Volunteer Profile</div>
                  <VolunteerSections />
                </div>
              </>
            ) : (
              <VolunteerSections />
            )}
          </div>

          {/* Right rail */}
          <RightRail />
        </div>
      </div>

      {/* ── Toast ── */}
      {toastMsg && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: ACCENT_NAVY, color: "#fff", fontSize: 13, fontWeight: 500, padding: "12px 24px", borderRadius: 100, zIndex: 9999, boxShadow: "0 8px 32px rgba(13,27,62,0.3)", pointerEvents: "none", whiteSpace: "nowrap" }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
}
