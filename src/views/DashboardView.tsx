import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Zap, Award, Users, Shield, RefreshCw, Clock } from "lucide-react";
import { IS_PE_SEASON } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
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

// ─── Extended KPI / design colours ────────────────────────────────────────────
const C_PINK      = "#C2185B";
const C_GREEN     = "#2E7D32";
const C_MIDBLUE   = "#1565C0";
const C_TEAL2     = "#00838F";
const C_PINKRED   = "#AD1457";
const CP_PINK     = "#FCE4EC";
const CP_GREEN    = "#E8F5E9";
const CP_MIDBLUE  = "#E3F2FD";
const CP_TEAL2    = "#E0F7FA";
const CP_PINKRED  = "#FCE4EC";
const IS_NEW_VOLUNTEER = false;

const NOTIFICATIONS: Record<string, boolean> = {
  viewOpportunities: true,
  diyActivities: false,
  proEngageProject: true,
};

const notifDot: React.CSSProperties = { position: "absolute", top: -3, right: -6, width: 8, height: 8, borderRadius: "50%", background: "#E8401C", boxShadow: "0 0 0 2px white" };

const VOLUNTEER = {
  firstName: "Priya",
  lastName: "Sharma",
  company: "Tata Consultancy Services",
  designation: "Senior Product Manager",
  city: "Mumbai",
  gender: "Female",
  birthDate: "1990-06-15",
  email: "priya.sharma@tata.com",
  phone: "+91 98765 43210",
  function: "Product Strategy",
  educationQualification: "MBA — Indian Institute of Management, Ahmedabad",
  totalWorkExperience: "12",
  languages: ["English", "Hindi", "Marathi"],
  skills: ["Product Strategy", "Finance", "Data Analytics", "Leadership"],
  interests: ["Education", "Women Empowerment", "Environment"],
  preferredMode: "Either" as "Remote" | "In-Person" | "Either",
  disasterResponseInterest: true,
  notifyProEngage: true,
  notifyTVW: true,
  linkedinUrl: "https://linkedin.com/in/priyasharma",
  stats: {
    hoursVolunteered: IS_NEW_VOLUNTEER ? 0 : 347,
    projectsApplied:  IS_NEW_VOLUNTEER ? 0 : 6,
    projectsCompleted:IS_NEW_VOLUNTEER ? 0 : 4,
    projectsDropped:  IS_NEW_VOLUNTEER ? 0 : 1,
    referrals:        IS_NEW_VOLUNTEER ? 0 : 3,
    badgesEarned:     IS_NEW_VOLUNTEER ? 0 : 7,
  },
  activeApplication: IS_NEW_VOLUNTEER ? null : {
    title: "Digital Marketing Strategy for Livelihood NGO",
    ngo: "Uday Foundation",
    status: "Matched" as const,
    matchDate: "12 Mar 2025",
    edition: "ProEngage Edition 11",
    skillArea: "Marketing",
    startDate: "01 Feb 2025",
    mode: "Online",
    duration: "4 months",
    hoursPerWeek: "3",
  },
};

const TESTIMONIAL = {
  quote: "Priya brought exceptional clarity to our fundraising strategy. Within eight weeks she redesigned our donor communications and helped us raise 40% more than the previous quarter. Her analytical rigour, combined with genuine empathy for our mission, made her an invaluable part of our team.",
  author: "Rekha Iyer",
  role: "Executive Director, Uday Foundation",
  project: "Digital Marketing Strategy for Livelihood NGO",
  edition: "ProEngage Edition 11",
  avatarBg: B_RED,
  avatarInitials: "RI",
};

const TVW_OPPORTUNITIES = [
  { id: "t1", title: "Tree Plantation Drive — Aarey Forest",         company: "Tata Motors",              date: "22 Sep 2025", mode: "In-person · Mumbai",  duration: "Half day", spotsLeft: 12, theme: "Environment",  accentColor: "#65A30D", pastel: "#F7FEE7" },
  { id: "t2", title: "Digital Literacy Workshop for Senior Citizens", company: "Tata Consultancy Services", date: "28 Sep 2025", mode: "Online · Pan-India",  duration: "3 hours",  spotsLeft: 45, theme: "Education",    accentColor: B_BLUE,   pastel: P_BLUE   },
  { id: "t3", title: "Healthcare Camp — Blood Donation Drive",        company: "Tata Steel",               date: "4 Oct 2025",  mode: "In-person · Pune",    duration: "Half day", spotsLeft: 8,  theme: "Health",      accentColor: B_RED,    pastel: P_RED    },
];

const DIY_ACTIVITIES = [
  { id: "d1", title: "Mentor a First-Generation College Student", desc: "1 hour/week for 4 weeks over video call. Set goals, share experience, open doors.", theme: "Education",   effort: "Low",    accentColor: B_INDIGO, pastel: P_INDIGO },
  { id: "d2", title: "Teach Financial Literacy to Youth",         desc: "A 2-hour workshop at a local NGO or school. TSG DIY kit provides all materials.", theme: "Livelihoods", effort: "Medium", accentColor: B_BLUE,   pastel: P_BLUE   },
];

const PE_OPPORTUNITIES = [
  { id: "p1", title: "Build a Fundraising Dashboard for Child Rights NGO",  ngo: "Butterflies India",     skillArea: "Finance / Data",   duration: "3 months", mode: "Online",          closes: "15 Jul 2025", applicants: 14, match: 94, accentColor: B_BLUE,   pastel: P_BLUE   },
  { id: "p2", title: "Marketing Strategy for Women's Skilling Programme",   ngo: "Stree Mukti Sanghatna", skillArea: "Marketing",        duration: "4 months", mode: "Hybrid · Mumbai", closes: "20 Jul 2025", applicants: 9,  match: 89, accentColor: "#65A30D", pastel: "#F7FEE7" },
  { id: "p3", title: "Product Roadmap for Disability Employment Platform",  ngo: "Samarthanam Trust",     skillArea: "Product Strategy", duration: "6 months", mode: "Online",          closes: "30 Jul 2025", applicants: 6,  match: 97, accentColor: B_INDIGO, pastel: P_INDIGO },
];

const HISTORY_APPLICATIONS = [
  { id: "a1", project: "Digital Marketing Strategy — Uday Foundation", edition: "ProEngage 11", year: "2025", status: "Matched",   date: "10 Mar 2025", type: "ProEngage", ngo: "Uday Foundation",     skillArea: "Marketing",      timeline: [{ label: "Applied", date: "10 Mar 2025", done: true }, { label: "Under Review", date: "14 Mar 2025", done: true }, { label: "Shortlisted", date: "18 Mar 2025", done: true }, { label: "Matched", date: "22 Mar 2025", done: true }, { label: "Project Complete", date: "Ongoing", done: false }] },
  { id: "a2", project: "Website Redesign — Red Dot Foundation",        edition: "ProEngage 10", year: "2024", status: "Completed", date: "Aug 2024",    type: "ProEngage", ngo: "Red Dot Foundation",  skillArea: "UX / Marketing", timeline: [{ label: "Applied", date: "2 Aug 2024", done: true }, { label: "Under Review", date: "6 Aug 2024", done: true }, { label: "Shortlisted", date: "10 Aug 2024", done: true }, { label: "Matched", date: "15 Aug 2024", done: true }, { label: "Project Complete", date: "12 Nov 2024", done: true }] },
  { id: "a3", project: "Aarey Tree Plantation Drive",                  edition: "TVW 22",       year: "2024", status: "Completed", date: "14 Sep 2024", type: "TVW",       ngo: "Tata Motors CSR",     skillArea: "Environment",    timeline: [{ label: "Registered", date: "10 Sep 2024", done: true }, { label: "Confirmed", date: "11 Sep 2024", done: true }, { label: "Participated", date: "14 Sep 2024", done: true }] },
  { id: "a4", project: "Financial Literacy for Rural Women — SEWA",    edition: "ProEngage 9",  year: "2024", status: "Completed", date: "Feb 2024",    type: "ProEngage", ngo: "SEWA",                skillArea: "Finance",        timeline: [{ label: "Applied", date: "5 Jan 2024", done: true }, { label: "Under Review", date: "10 Jan 2024", done: true }, { label: "Shortlisted", date: "16 Jan 2024", done: true }, { label: "Matched", date: "22 Jan 2024", done: true }, { label: "Project Complete", date: "28 Apr 2024", done: true }] },
  { id: "a5", project: "Blood Donation Drive — Tata Steel",            edition: "TVW 21",       year: "2024", status: "Completed", date: "22 Mar 2024", type: "TVW",       ngo: "Tata Steel CSR",      skillArea: "Health",         timeline: [{ label: "Registered", date: "18 Mar 2024", done: true }, { label: "Confirmed", date: "19 Mar 2024", done: true }, { label: "Participated", date: "22 Mar 2024", done: true }] },
  { id: "a6", project: "Brand Strategy — Rhizome Cooperative",         edition: "ProEngage 8",  year: "2023", status: "Dropped",   date: "Sep 2023",    type: "ProEngage", ngo: "Rhizome Cooperative", skillArea: "Marketing",      timeline: [{ label: "Applied", date: "4 Sep 2023", done: true }, { label: "Under Review", date: "8 Sep 2023", done: true }, { label: "Matched", date: "14 Sep 2023", done: true }, { label: "Project Dropped", date: "2 Oct 2023", done: true }] },
];

const HISTORY_PROJECTS = [
  { id: "p1", title: "Website Redesign",              ngo: "Red Dot Foundation",   edition: "ProEngage 10", year: "2024", hours: 48, outcome: "Launched new donation portal — 60% uplift in online donations within 8 weeks of go-live.",   skills: ["UX", "Marketing"], cert: true  },
  { id: "p2", title: "Financial Literacy Curriculum", ngo: "SEWA",                 edition: "ProEngage 9",  year: "2024", hours: 72, outcome: "Trained 150 rural women entrepreneurs in bookkeeping and basic financial planning.",        skills: ["Finance", "Training"], cert: true  },
  { id: "p3", title: "Brand Strategy",                ngo: "Rhizome Cooperative",  edition: "ProEngage 8",  year: "2023", hours: 12, outcome: "Project paused due to personal reasons. Partial brand audit delivered to the NGO.",        skills: ["Marketing"],       cert: false },
];

const BADGES = [
  { id: "b1", name: "First Step",   symbol: "I",   desc: "First volunteering activity",       earned: "Mar 2023", color: "#65A30D" },
  { id: "b2", name: "ProEngager",   symbol: "II",  desc: "First ProEngage project completed", earned: "Sep 2023", color: B_INDIGO },
  { id: "b3", name: "Impact Maker", symbol: "III", desc: "100+ hours volunteered",            earned: "Feb 2024", color: B_BLUE   },
  { id: "b4", name: "Connector",    symbol: "IV",  desc: "Referred 3 volunteers",             earned: "Apr 2024", color: "#65A30D" },
  { id: "b5", name: "TVW Champion", symbol: "V",   desc: "3 TVW editions participated",       earned: "Sep 2024", color: B_RED    },
  { id: "b6", name: "Repeat Hero",  symbol: "VI",  desc: "3 ProEngage projects completed",    earned: "Mar 2025", color: B_INDIGO },
  { id: "b7", name: "300 Club",     symbol: "VII", desc: "300+ volunteering hours",           earned: "Mar 2025", color: B_YELLOW },
];

const RESOURCES = [
  { id: "photos",  label: "Photos",   desc: "Gallery from TVW22, VolCon 2024 and ProEngage projects", count: "247 items",   accentColor: C_PINK,    pastel: CP_PINK,    photo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80" },
  { id: "videos",  label: "Videos",   desc: "Volunteer stories, impact films and event highlights",    count: "38 videos",   accentColor: C_GREEN,   pastel: CP_GREEN,   photo: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80" },
  { id: "stories", label: "Stories",  desc: "Volunteer experiences and community impact narratives",   count: "94 stories",  accentColor: "#65A30D", pastel: "#F7FEE7",   photo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80" },
  { id: "events",  label: "Events",   desc: "VolCon, Volympics and upcoming community gatherings",     count: "12 upcoming", accentColor: C_PINKRED, pastel: CP_PINKRED, photo: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80" },
  { id: "emodule", label: "E-Module", desc: "ProEngage orientation, NGO readiness kit and dos & don'ts", count: "5 modules", accentColor: C_MIDBLUE, pastel: CP_MIDBLUE, photo: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80" },
];

const STAT_TOOLTIPS: Record<string, string> = {
  "Hours Volunteered":  "Total hours logged across all TVW events and ProEngage projects.",
  "Projects Applied":   "ProEngage applications submitted. You can apply to multiple projects per edition.",
  "Projects Completed": "Projects where both you and the NGO have submitted feedback. Unlocks your certificate.",
  "Dropped":            "Projects that ended early. These remain on your record — it's part of honest volunteering.",
  "No of Referrals":    "Colleagues or family members who joined TataEngage via your referral link.",
  "Badges Earned":      "Awarded for key milestones — completing a project, 100 hours, TVW participation and more.",
};

const BADGE_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  b1: Star, b2: Zap, b3: Award, b4: Users, b5: Shield, b6: RefreshCw, b7: Clock,
};

// Activity tab config by season state
const hasActive = !!VOLUNTEER.activeApplication;

function getActivitySlicers() {
  if (IS_PE_SEASON && hasActive) {
    return [
      { id: "opportunities", label: "View Opportunities" },
      { id: "diy",           label: "DIY Activities"     },
      { id: "proengage",     label: "My ProEngage Project"},
    ];
  }
  if (IS_PE_SEASON && !hasActive) {
    return [
      { id: "opportunities", label: "View Opportunities" },
      { id: "diy",           label: "DIY Activities"     },
      { id: "apply",         label: "Apply for a Project"},
    ];
  }
  return [
    { id: "opportunities", label: "View Opportunities"      },
    { id: "diy",           label: "DIY Activities"          },
    { id: "early",         label: "Apply Early for ProEngage"},
  ];
}

const HISTORY_SLICERS = [
  { id: "projects",     label: "My Projects"     },
  { id: "applications", label: "My Applications" },
  { id: "experience",   label: "My Experience"   },
  { id: "certificates", label: "My Certificates" },
  { id: "feedback",     label: "My Feedback"     },
];

const SECTIONS = [
  { id: "snapshot",   label: "Snapshot"   },
  { id: "activities", label: "Activities" },
  { id: "history",    label: "History"    },
  { id: "resources",  label: "Resources"  },
];

// ─── Shared style helpers ─────────────────────────────────────────────────────
const card: React.CSSProperties = { background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, padding: "20px 22px" };

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

// ─── Stat tile ────────────────────────────────────────────────────────────────
function StatTile({ value, suffix = "", label, pastel, accentColor, delay, started }: {
  value: number; suffix?: string; label: string; pastel: string; accentColor: string; delay: number; started: boolean;
}) {
  const [go, setGo] = useState(false);
  const [showTip, setShowTip] = useState(false);
  useEffect(() => {
    if (started) { const t = setTimeout(() => setGo(true), delay); return () => clearTimeout(t); }
  }, [started, delay]);
  const n = useCountUp(value, 1100, go);
  const isZero = value === 0;
  return (
    <div
      style={{ background: isZero ? "#fafafa" : pastel, borderRadius: 14, padding: "20px 14px 16px", textAlign: "center", border: `1px solid ${isZero ? "#e8e8f0" : accentColor + "22"}`, transition: "transform 0.2s, box-shadow 0.2s", cursor: "default", position: "relative" }}
      onMouseEnter={e => { if (!isZero) (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; if (!isZero) (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${accentColor}22`; setShowTip(true); }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; setShowTip(false); }}
    >
      {isZero && <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 32, height: 32, borderRadius: "50%", border: `2px dashed ${accentColor}44`, animation: "pulse-ring 2s ease-in-out infinite" }} />}
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: isZero ? 32 : 38, fontWeight: 900, lineHeight: 1, letterSpacing: "-2px", color: isZero ? "#ccccdd" : accentColor, position: "relative", zIndex: 1 }}>
        {n}{suffix}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: isZero ? "#bbbbcc" : ACCENT_NAVY, marginTop: 8, textTransform: "uppercase", letterSpacing: "0.6px", lineHeight: 1.3 }}>{label}</div>
      {showTip && (
        <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: ACCENT_NAVY, color: "rgba(255,255,255,0.88)", fontSize: 12, lineHeight: 1.5, padding: "10px 14px", borderRadius: 9, width: 200, zIndex: 50, pointerEvents: "none", boxShadow: "0 4px 20px rgba(13,27,62,0.2)", textAlign: "left", fontWeight: 400 }}>
          {STAT_TOOLTIPS[label]}
          <div style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)", width: 10, height: 10, background: ACCENT_NAVY, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
        </div>
      )}
    </div>
  );
}

// ─── Pill slicers ─────────────────────────────────────────────────────────────
function Slicers({ options, active, onChange, accentColor = B_INDIGO, notifications }: { options: { id: string; label: string }[]; active: string; onChange: (id: string) => void; accentColor?: string; notifications?: Record<string, boolean> }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 22 }}>
      {options.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)} style={{ position: "relative", display: "inline-flex", padding: "6px 16px", borderRadius: 100, border: `1.5px solid ${active === o.id ? accentColor : "#dddde8"}`, background: active === o.id ? accentColor : "transparent", color: active === o.id ? "#fff" : "#666", fontSize: 13, fontWeight: active === o.id ? 600 : 400, cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif" }}>
          {o.label}
          {notifications?.[o.id] && <span style={notifDot} />}
        </button>
      ))}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = { Matched: ["#F7FEE7", "#65A30D"], Completed: [P_BLUE, B_BLUE], Dropped: [P_RED, B_RED], Applied: [P_INDIGO, B_INDIGO], Pending: [P_YELLOW, "#9a6500"] };
  const [bg, color] = map[status] ?? ["#f0f0f0", "#555"];
  return <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, letterSpacing: "0.3px", whiteSpace: "nowrap" }}>{status}</span>;
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 5 }}>{eyebrow}</div>
      <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 21, fontWeight: 900, color: ACCENT_NAVY, margin: 0, letterSpacing: -0.3 }}>{title}</h2>
    </div>
  );
}

// ─── History filters ──────────────────────────────────────────────────────────
function HistoryFilters({ edition, setEdition, year, setYear }: { edition: string; setEdition: (v: string) => void; year: string; setYear: (v: string) => void; }) {
  const sel: React.CSSProperties = { padding: "6px 12px", borderRadius: 8, border: "1.5px solid #dddde8", background: "#fff", fontSize: 13, color: ACCENT_NAVY, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", outline: "none" };
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
      <select value={edition} onChange={e => setEdition(e.target.value)} style={sel}>
        <option value="">All Editions</option>
        {["ProEngage 11","ProEngage 10","ProEngage 9","ProEngage 8","TVW 22","TVW 21"].map(e => <option key={e}>{e}</option>)}
      </select>
      <select value={year} onChange={e => setYear(e.target.value)} style={sel}>
        <option value="">All Years</option>
        {["2025","2024","2023"].map(y => <option key={y}>{y}</option>)}
      </select>
    </div>
  );
}

// ─── Resource card ────────────────────────────────────────────────────────────
function ResourceCard({ r, onClick }: { r: typeof RESOURCES[0]; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, overflow: "hidden", cursor: "pointer", transform: hov ? "translateY(-3px)" : "translateY(0)", boxShadow: hov ? `0 8px 24px ${r.accentColor}18` : "none", transition: "transform 0.18s, box-shadow 0.18s" }}
    >
      <div style={{ height: 90, background: `url(${r.photo}) center/cover`, position: "relative" }}>
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

// ─── DrawerShell — centred modal ──────────────────────────────────────────────
type AppRecord = typeof HISTORY_APPLICATIONS[0];

function DrawerShell({ open, onClose, title, subtitle, accentTag, children }: { open: boolean; onClose: () => void; title: string; subtitle?: string; accentTag?: string; children: React.ReactNode; }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(13,27,62,0.45)", zIndex: 200, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.22s", backdropFilter: "blur(2px)" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: open ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -48%) scale(0.97)", transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", width: 560, maxWidth: "calc(100vw - 40px)", maxHeight: "calc(100vh - 80px)", background: "#fff", borderRadius: 16, zIndex: 201, boxShadow: "0 24px 64px rgba(13,27,62,0.22)", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif", overflowY: "auto" }}>
        <div style={{ background: "#FEF3C7", padding: "24px 28px", borderRadius: "16px 16px 0 0", flexShrink: 0 }}>
          <button onClick={onClose} style={{ background: "rgba(13,27,62,0.1)", border: "none", borderRadius: 7, color: "rgba(13,27,62,0.7)", fontSize: 13, fontWeight: 500, padding: "5px 12px", cursor: "pointer", marginBottom: 16 }}>← Close</button>
          {accentTag && <div style={{ display: "inline-block", background: "rgba(161,98,7,0.12)", border: "1px solid rgba(161,98,7,0.25)", borderRadius: 100, padding: "3px 10px", fontSize: 10.5, fontWeight: 700, color: "#78350F", letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 10 }}>{accentTag}</div>}
          <div style={{ fontSize: 17, fontWeight: 700, color: ACCENT_NAVY, lineHeight: 1.3 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12.5, color: "rgba(13,27,62,0.5)", marginTop: 5 }}>{subtitle}</div>}
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>{children}</div>
      </div>
    </>
  );
}

// ─── Application detail drawer ────────────────────────────────────────────────
function ApplicationDrawer({ app, onClose }: { app: AppRecord | null; onClose: () => void }) {
  return (
    <DrawerShell open={!!app} onClose={onClose} title={app?.project ?? ""} subtitle={app ? `${app.ngo} · ${app.skillArea}` : ""} accentTag={app ? `${app.type} · ${app.edition}` : ""}>
      {app && (
        <>
          <div style={{ padding: "24px 28px 0" }}>
            <StatusBadge status={app.status} />
          </div>
          <div style={{ padding: "20px 28px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 20 }}>Application Timeline</div>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 11, top: 0, bottom: 0, width: 2, background: "#e8e8f0" }} />
              {app.timeline.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 18, marginBottom: 24, position: "relative" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: step.done ? B_INDIGO : "#fff", border: `2.5px solid ${step.done ? B_INDIGO : "#dddde8"}`, flexShrink: 0, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {step.done && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </div>
                  <div style={{ paddingTop: 2 }}>
                    <div style={{ fontSize: 13.5, fontWeight: step.done ? 600 : 400, color: step.done ? ACCENT_NAVY : "#aaaabc" }}>{step.label}</div>
                    <div style={{ fontSize: 12, color: "#aaaabc", marginTop: 2 }}>{step.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: "0 28px 32px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 12 }}>Details</div>
            <div style={{ background: "#f8f8fc", borderRadius: 10, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {[["NGO", app.ngo], ["Programme", `${app.type} · ${app.edition}`], ["Skill Area", app.skillArea], ["Date Applied", app.date], ["Status", app.status]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ fontSize: 12.5, color: "#8888a0" }}>{k}</span>
                  <span style={{ fontSize: 12.5, color: ACCENT_NAVY, fontWeight: 600, textAlign: "right" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </DrawerShell>
  );
}

// ─── Project update drawer ────────────────────────────────────────────────────
function ProjectUpdateDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const reset = () => { onClose(); setSubmitted(false); setText(""); };
  return (
    <DrawerShell open={open} onClose={reset} title="Post Your Monthly Update" subtitle={`${VOLUNTEER.activeApplication?.ngo} · ${VOLUNTEER.activeApplication?.edition}`} accentTag="Monthly Update">
      {submitted ? (
        <div style={{ padding: "40px 28px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F7FEE7", border: "2px solid #84CC16", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9l7 7L20 2" stroke="#65A30D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>Update posted</div>
          <div style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6 }}>Your update has been shared with TSG and your NGO partner at {VOLUNTEER.activeApplication?.ngo}.</div>
        </div>
      ) : (
        <div style={{ padding: "24px 28px" }}>
          <p style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6, marginBottom: 22 }}>Share a brief progress note with TSG and your NGO partner. This helps track the health of your project.</p>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>Update</label>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="What progress have you made this week? Any blockers or next steps?" rows={6} style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 10, padding: "12px 14px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, resize: "vertical", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }} onFocus={e => (e.target.style.borderColor = B_INDIGO)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>Attachment (optional)</label>
            <div style={{ border: "1.5px dashed #dddde8", borderRadius: 10, padding: "16px", textAlign: "center", fontSize: 13, color: "#aaaabc", cursor: "pointer" }}>Drop a file here or click to browse</div>
          </div>
          <button disabled={!text.trim()} onClick={() => setSubmitted(true)} style={{ width: "100%", background: text.trim() ? B_INDIGO : "#e0e0e8", color: text.trim() ? "#fff" : "#aaa", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, cursor: text.trim() ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s" }}>Post Update</button>
        </div>
      )}
    </DrawerShell>
  );
}

// ─── Feedback drawer — matching live site structure ───────────────────────────
function FeedbackDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [completed, setCompleted] = useState<"" | "yes" | "no">("");
  const [months, setMonths] = useState("");
  const [hoursWeek, setHoursWeek] = useState("");
  const [supportRatings, setSupportRatings] = useState([0, 0, 0]);
  const [attrRatings, setAttrRatings] = useState([0, 0, 0, 0, 0]);
  const [address, setAddress] = useState("");
  const [nps, setNps] = useState(0);
  const [npsHov, setNpsHov] = useState(0);
  const [suggestions, setSuggestions] = useState("");
  const [dropoutReason, setDropoutReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const reset = () => { onClose(); setSubmitted(false); setCompleted(""); setMonths(""); setHoursWeek(""); setSupportRatings([0,0,0]); setAttrRatings([0,0,0,0,0]); setAddress(""); setNps(0); setSuggestions(""); setDropoutReason(""); };

  const canSubmit = completed === "yes"
    ? months && hoursWeek && supportRatings.every(r => r > 0) && attrRatings.every(r => r > 0) && nps > 0
    : completed === "no" && dropoutReason !== "";

  const label: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 };
  const inp: React.CSSProperties = { width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 10, padding: "10px 14px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", boxSizing: "border-box" };
  const sel: React.CSSProperties = { ...inp, appearance: "none", cursor: "pointer" };

  function StarRow({ count = 5, value, hover, onHov, onSet }: { count?: number; value: number; hover: number; onHov: (v: number) => void; onSet: (v: number) => void }) {
    return (
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: count }, (_, i) => i + 1).map(i => (
          <span key={i} onMouseEnter={() => onHov(i)} onMouseLeave={() => onHov(0)} onClick={() => onSet(i)}
            style={{ fontSize: count === 10 ? 22 : 26, cursor: "pointer", color: i <= (hover || value) ? B_YELLOW : "#e0e0e8", transition: "color 0.1s", lineHeight: 1 }}>★</span>
        ))}
      </div>
    );
  }

  const [supportHov, setSupportHov] = useState([0, 0, 0]);
  const [attrHov, setAttrHov] = useState([0, 0, 0, 0, 0]);

  const supportItems = ["Easily accessible", "Resolved queries", "Liaising with NGO partners"];
  const attrItems = [
    "Enhanced critical thinking, problem-solving, and adaptability through navigating project challenges",
    "Developed strong communication, interpersonal, and networking skills while collaborating with diverse stakeholders",
    "Gained deep understanding of NGO sector values and behaviours, applying gained knowledge to daily work",
    "Motivated and inspired others through effective leadership and management of ambiguity",
    "Cultivated empathy and confidence, fostering innovation and professional growth",
  ];
  const dropoutReasons = [
    "Change in project scope by NGO / NGO Unresponsive",
    "Personal and professional transitions, including relocation and increased workload, hindered project engagement",
    "I didn't feel motivated to do the project / I lost interest",
  ];

  return (
    <DrawerShell open={open} onClose={reset} title="ProEngage Volunteer Feedback" subtitle={`${VOLUNTEER.activeApplication?.ngo} · ${VOLUNTEER.activeApplication?.edition}`} accentTag="Project Feedback">
      {submitted ? (
        <div style={{ padding: "40px 28px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F7FEE7", border: "2px solid #84CC16", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9l7 7L20 2" stroke="#65A30D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>Feedback submitted</div>
          <div style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6 }}>Thank you. Once the NGO also submits feedback, your certificate will be generated within 24 hours.</div>
        </div>
      ) : (
        <div style={{ padding: "24px 28px" }}>
          {/* Instructions */}
          <div style={{ background: P_INDIGO, border: `1px solid ${B_INDIGO}22`, borderRadius: 10, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: B_INDIGO, lineHeight: 1.6 }}>
            We request you to fill in this feedback form to help us understand about your ProEngage volunteering journey and experience. All fields marked * are mandatory.
          </div>

          {/* Q1 — Overall Experience */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 4 }}>Overall Experience</div>
            <label style={{ ...label, marginBottom: 12 }}>1. Were you able to successfully complete the project? *</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["yes", "Yes"], ["no", "No"]].map(([val, lbl]) => (
                <label key={val} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13.5, color: completed === val ? B_INDIGO : ACCENT_NAVY, fontWeight: completed === val ? 600 : 400 }}>
                  <div onClick={() => setCompleted(val as "yes" | "no")} style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${completed === val ? B_INDIGO : "#dddde8"}`, background: completed === val ? B_INDIGO : "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer" }}>
                    {completed === val && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  {lbl}
                </label>
              ))}
            </div>
          </div>

          {/* YES path */}
          {completed === "yes" && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 16, paddingTop: 4, borderTop: "1px solid #e8e8f0" }}>ProEngage Experience</div>
              <p style={{ fontSize: 12.5, color: "#8888a0", marginBottom: 20 }}>(We would like to know more about your journey.)</p>

              {/* Q2 */}
              <div style={{ marginBottom: 18 }}>
                <label style={label}>2. How many months, in total, have you dedicated to completing this project? *</label>
                <select value={months} onChange={e => setMonths(e.target.value)} style={sel}>
                  <option value="">Select</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              {/* Q3 */}
              <div style={{ marginBottom: 18 }}>
                <label style={label}>3. How many hours per week have you dedicated to completing this project? *</label>
                <select value={hoursWeek} onChange={e => setHoursWeek(e.target.value)} style={sel}>
                  <option value="">Select</option>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              {/* Q4 */}
              <div style={{ marginBottom: 20 }}>
                <label style={label}>4. How would you rate the support received from the ProEngage team? *</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {supportItems.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 12.5, color: "#555", lineHeight: 1.4, flex: 1 }}>{String.fromCharCode(65 + i)}. {item}</span>
                      <StarRow value={supportRatings[i]} hover={supportHov[i]} onHov={v => { const a = [...supportHov]; a[i] = v; setSupportHov(a); }} onSet={v => { const a = [...supportRatings]; a[i] = v; setSupportRatings(a); }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Q5 */}
              <div style={{ marginBottom: 20 }}>
                <label style={label}>5. Which of the following attributes did ProEngage help you improve? *</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {attrItems.map((item, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <span style={{ fontSize: 12.5, color: "#555", lineHeight: 1.4, flex: 1 }}>{String.fromCharCode(65 + i)}. {item}</span>
                      <StarRow value={attrRatings[i]} hover={attrHov[i]} onHov={v => { const a = [...attrHov]; a[i] = v; setAttrHov(a); }} onSet={v => { const a = [...attrRatings]; a[i] = v; setAttrRatings(a); }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Q6 */}
              <div style={{ marginBottom: 18 }}>
                <label style={label}>6. Please provide your current residential or office address *</label>
                <div style={{ background: P_YELLOW, border: `1px solid ${B_YELLOW}33`, borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#78350f", lineHeight: 1.5, marginBottom: 10 }}>
                  Tata Engage Team will send the token to this address. If you live abroad, please provide your India address or Indian office address.
                </div>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Flat / Floor, House No., Building, Company, Apartment" style={{ ...inp, marginBottom: 8 }} onFocus={e => (e.target.style.borderColor = B_INDIGO)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
                <div style={{ fontSize: 11.5, color: "#8888a0", marginBottom: 4 }}>* Please update your mobile no. through 'Edit Profile' for any project related queries, write to tataengage@tata.com</div>
              </div>

              {/* Q7 — NPS */}
              <div style={{ marginBottom: 18 }}>
                <label style={label}>7. How likely are you to recommend us to a friend or colleague? *</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11.5, color: "#8888a0", whiteSpace: "nowrap" }}>Unlikely</span>
                  <StarRow count={10} value={nps} hover={npsHov} onHov={setNpsHov} onSet={setNps} />
                  <span style={{ fontSize: 11.5, color: "#8888a0", whiteSpace: "nowrap" }}>Likely</span>
                </div>
              </div>

              {/* Q8 */}
              <div style={{ marginBottom: 22 }}>
                <label style={label}>8. Do you have any suggestions for the Tata Engage Team regarding the way ProEngage is conducted?</label>
                <textarea value={suggestions} onChange={e => setSuggestions(e.target.value)} rows={3} placeholder="Suggestions if any" style={{ ...inp, resize: "none" }} onFocus={e => (e.target.style.borderColor = B_INDIGO)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
              </div>
            </>
          )}

          {/* NO path */}
          {completed === "no" && (
            <>
              <div style={{ fontSize: 13, fontWeight: 700, color: B_RED, marginBottom: 12, paddingTop: 4, borderTop: "1px solid #e8e8f0" }}>No Completion</div>
              <p style={{ fontSize: 12.5, color: "#8888a0", marginBottom: 16 }}>(Let us know why you were unable to complete this project.)</p>
              <div style={{ marginBottom: 22 }}>
                <label style={label}>2. Reason of no completion *</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {dropoutReasons.map((r, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13, color: dropoutReason === r ? B_INDIGO : ACCENT_NAVY, fontWeight: dropoutReason === r ? 600 : 400, lineHeight: 1.5 }}>
                      <div onClick={() => setDropoutReason(r)} style={{ width: 18, height: 18, minWidth: 18, borderRadius: "50%", border: `2px solid ${dropoutReason === r ? B_INDIGO : "#dddde8"}`, background: dropoutReason === r ? B_INDIGO : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer", marginTop: 2 }}>
                        {dropoutReason === r && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                      </div>
                      {r}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          <button disabled={!canSubmit} onClick={() => setSubmitted(true)} style={{ width: "100%", background: canSubmit ? B_INDIGO : "#e0e0e8", color: canSubmit ? "#fff" : "#aaa", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif", marginTop: 8, transition: "background 0.2s" }}>Submit Feedback</button>
        </div>
      )}
    </DrawerShell>
  );
}

// ─── Grievance drawer ─────────────────────────────────────────────────────────
function GrievanceDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [category, setCategory] = useState("");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const reset = () => { onClose(); setSubmitted(false); setCategory(""); setText(""); };
  const categories = ["Communication issues with NGO", "Project scope changed unexpectedly", "Scheduling conflict", "Platform issue", "Other"];
  const canSubmit = category && text.trim().length > 10;
  return (
    <DrawerShell open={open} onClose={reset} title="Raise a Grievance" subtitle="Your concern will be reviewed by the TSG Admin team" accentTag="Grievance">
      {submitted ? (
        <div style={{ padding: "40px 28px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: P_YELLOW, border: `2px solid ${B_YELLOW}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9l7 7L20 2" stroke={B_YELLOW} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>Grievance submitted</div>
          <div style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6 }}>You'll receive an acknowledgement email shortly. The TSG Admin team will review and respond within 3 working days.</div>
        </div>
      ) : (
        <div style={{ padding: "24px 28px" }}>
          <p style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6, marginBottom: 24 }}>Grievances are reviewed in confidence by the TSG Admin team. You can raise only one open grievance per project at a time.</p>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 10 }}>Category *</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {categories.map(c => (
                <label key={c} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13.5, color: category === c ? B_INDIGO : ACCENT_NAVY, fontWeight: category === c ? 600 : 400 }}>
                  <div onClick={() => setCategory(c)} style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${category === c ? B_INDIGO : "#dddde8"}`, background: category === c ? B_INDIGO : "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer" }}>
                    {category === c && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  {c}
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>Describe the issue *</label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={5} placeholder="Provide as much detail as possible so the team can investigate effectively." style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 10, padding: "12px 14px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, resize: "none", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }} onFocus={e => (e.target.style.borderColor = B_INDIGO)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>Supporting file (optional)</label>
            <div style={{ border: "1.5px dashed #dddde8", borderRadius: 10, padding: "14px", textAlign: "center", fontSize: 13, color: "#aaaabc", cursor: "pointer" }}>Drop a file here or click to browse</div>
          </div>
          <button disabled={!canSubmit} onClick={() => setSubmitted(true)} style={{ width: "100%", background: canSubmit ? B_INDIGO : "#e0e0e8", color: canSubmit ? "#fff" : "#aaa", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s" }}>Submit Grievance</button>
        </div>
      )}
    </DrawerShell>
  );
}

// ─── Apply for Project drawer — matching live site form ───────────────────────
type PEProject = typeof PE_OPPORTUNITIES[0];

function ApplyDrawer({ project, onClose }: { project: PEProject | null; onClose: () => void }) {
  const [designation, setDesignation] = useState("Senior Product Manager");
  const [designationDetail, setDesignationDetail] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [attributes, setAttributes] = useState("");
  const [eduQual, setEduQual] = useState("MBA");
  const [workExp, setWorkExp] = useState("12");
  const [similarTask, setSimilarTask] = useState<"" | "yes" | "no">("");
  const [whyBestFit, setWhyBestFit] = useState("");
  const [threeSteps, setThreeSteps] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reset = () => { onClose(); setSubmitted(false); setAgreed(false); setWhyBestFit(""); setThreeSteps(""); setSimilarTask(""); setSkills([]); setAttributes(""); };

  const SKILL_OPTIONS = ["Accounting and Finance", "Administration", "Coaching and Training", "Content Writing / Documentation", "Fundraising", "IT Enabled Services", "Legal", "Management and Strategy", "Marketing and Communications", "Operations and Logistics", "Research", "Translation"];

  const canSubmit = whyBestFit.trim() && threeSteps.trim() && similarTask && agreed;

  const label: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 };
  const inp: React.CSSProperties = { width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 10, padding: "10px 14px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, outline: "none", boxSizing: "border-box" };
  const sel: React.CSSProperties = { ...inp, appearance: "none", cursor: "pointer", background: "#fff" };

  const undertakingPoints = [
    "I am voluntarily applying for a project of my choice under ProEngage",
    "I understand that these projects, and my contribution through them, are of great value to society",
    "I know that the Tata group has a reputation of doing good and this is an opportunity for me to do good with something I am good at",
    "I am able and willing to commit time over the next several months and complete the project to the best of my ability",
    "I intend to visit the NGO at least once a month (only for on-site projects)",
    "To the best of my knowledge, I am not going to get transferred, change my job or do not have any planned significant events (like long personal leave / holiday etc.) over the project duration",
    "I understand that following these best practices will help me remain true to the Tata values while undertaking the project — acting responsibly towards the communities, being responsible for my own safety, strictly observing the Tata Code of Conduct",
  ];

  const open = !!project;

  return (
    <DrawerShell open={open} onClose={reset} title={project?.title ?? ""} subtitle={project ? `${project.ngo} · ${project.skillArea}` : ""} accentTag="ProEngage Application">
      {project && (
        submitted ? (
          <div style={{ padding: "40px 28px", textAlign: "center" }}>
            {/* Confirmation matching live site modal */}
            <div style={{ background: "#FEFCE8", border: "1px solid #FDE68A", borderRadius: 12, padding: "20px", marginBottom: 20, textAlign: "left" }}>
              <div style={{ fontSize: 13, color: "#064e3b", lineHeight: 1.7 }}>
                <p style={{ marginBottom: 6 }}>Project will start from <strong>{project.closes.replace("15 ", "15-")}</strong></p>
                <p style={{ marginBottom: 6 }}>You will be required to put in <strong>{project.duration.split(" ")[0]} hours</strong> every weekend, for a duration of <strong>{project.duration}</strong></p>
                <p>This being an <strong>{project.mode.includes("Hybrid") ? "HYBRID" : "ONLINE"}</strong> project, you will be required to work on the project remotely and deliver it to the partner organisation: <strong>{project.ngo}</strong></p>
              </div>
            </div>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F7FEE7", border: "2px solid #84CC16", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9l7 7L20 2" stroke="#65A30D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>Application submitted!</div>
            <div style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6 }}>Your application has been sent to {project.ngo}. You'll receive an email confirmation shortly.</div>
          </div>
        ) : (
          <div style={{ padding: "24px 28px" }}>
            {/* Project meta summary */}
            <div style={{ background: P_INDIGO, border: `1px solid ${B_INDIGO}22`, borderRadius: 10, padding: "12px 16px", marginBottom: 24 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px" }}>
                {[["Mode", project.mode], ["Duration", project.duration], ["Closes", project.closes], ["Applicants", `${project.applicants} applied`]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "0.8px" }}>{k}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-filled candidate requirements */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 12 }}>Candidate Requirements (from your profile)</div>
              <div style={{ background: "#f8f8fc", borderRadius: 10, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                {[["Skill Category", project.skillArea], ["Work Experience", "12 years"], ["Languages", "English, Hindi, Marathi"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span style={{ fontSize: 12.5, color: "#8888a0" }}>{k}</span>
                    <span style={{ fontSize: 12.5, color: ACCENT_NAVY, fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11.5, color: B_INDIGO, marginTop: 8 }}>* Please update your location and mobile no. through 'Edit Profile'. For any project related queries, write to <span style={{ textDecoration: "underline" }}>tataengage@tata.com</span></div>
            </div>

            {/* Section: Application Details */}
            <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 16, paddingTop: 4, borderTop: "1px solid #e8e8f0" }}>Application Details <span style={{ fontSize: 11, color: B_RED, fontWeight: 400 }}>* all fields are mandatory</span></div>

            {/* Current Designation */}
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Current Designation and Role *</label>
              <select value={designation} onChange={e => setDesignation(e.target.value)} style={{ ...sel, marginBottom: 8 }}>
                {["Senior Product Manager", "Product Manager", "Software Engineer", "Business Analyst", "Finance Manager", "HR Manager", "Others"].map(d => <option key={d}>{d}</option>)}
              </select>
              <input type="text" value={designationDetail} onChange={e => setDesignationDetail(e.target.value)} placeholder="Specify if 'Others'" style={inp} onFocus={e => (e.target.style.borderColor = B_INDIGO)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
            </div>

            {/* Project-specific skills */}
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Project-specific skills / experience possessed *</label>
              <div style={{ border: "1.5px solid #e0e0e8", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 12px", borderBottom: "1px solid #e8e8f0" }}>
                  {skills.map(s => (
                    <span key={s} style={{ background: P_INDIGO, color: B_INDIGO, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 100, display: "flex", alignItems: "center", gap: 5 }}>
                      {s} <span onClick={() => setSkills(skills.filter(x => x !== s))} style={{ cursor: "pointer", opacity: 0.6 }}>×</span>
                    </span>
                  ))}
                  {skills.length === 0 && <span style={{ fontSize: 13, color: "#aaaabc" }}>Select skills...</span>}
                </div>
                <div style={{ maxHeight: 140, overflowY: "auto" }}>
                  {SKILL_OPTIONS.filter(o => !skills.includes(o)).map(o => (
                    <div key={o} onClick={() => setSkills([...skills, o])} style={{ padding: "8px 14px", fontSize: 13, color: ACCENT_NAVY, cursor: "pointer", transition: "background 0.1s" }} onMouseEnter={e => (e.currentTarget.style.background = P_INDIGO)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>{o}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Attributes */}
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Attributes relevant to project</label>
              <textarea value={attributes} onChange={e => setAttributes(e.target.value)} rows={2} placeholder="Describe relevant attributes" style={{ ...inp, resize: "none" }} onFocus={e => (e.target.style.borderColor = B_INDIGO)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
            </div>

            {/* Education */}
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Educational Qualifications *</label>
              <select value={eduQual} onChange={e => setEduQual(e.target.value)} style={{ ...sel, marginBottom: 8 }}>
                {["MBA", "B.Tech / B.E.", "CA", "LLB", "MBBS", "M.Tech", "BA / B.Com / B.Sc", "Others"].map(q => <option key={q}>{q}</option>)}
              </select>
              <input type="text" placeholder="Specify institution or additional detail" style={inp} onFocus={e => (e.target.style.borderColor = B_INDIGO)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
            </div>

            {/* Work experience */}
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Total Years of Work Experience *</label>
              <input type="number" value={workExp} onChange={e => setWorkExp(e.target.value)} min="0" max="50" style={inp} onFocus={e => (e.target.style.borderColor = B_INDIGO)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
            </div>

            {/* Similar task */}
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Have you done a similar task before? *</label>
              <div style={{ display: "flex", gap: 24 }}>
                {[["yes", "Yes"], ["no", "No"]].map(([val, lbl]) => (
                  <label key={val} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13.5, color: similarTask === val ? B_INDIGO : ACCENT_NAVY, fontWeight: similarTask === val ? 600 : 400 }}>
                    <div onClick={() => setSimilarTask(val as "yes" | "no")} style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${similarTask === val ? B_INDIGO : "#dddde8"}`, background: similarTask === val ? B_INDIGO : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", cursor: "pointer" }}>
                      {similarTask === val && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                    </div>
                    {lbl}
                  </label>
                ))}
              </div>
            </div>

            {/* Why best fit */}
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Why are you the best fit for this project? *</label>
              <textarea value={whyBestFit} onChange={e => setWhyBestFit(e.target.value)} rows={4} placeholder="Describe your motivation and relevant experience" style={{ ...inp, resize: "none" }} onFocus={e => (e.target.style.borderColor = B_INDIGO)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
            </div>

            {/* 3 steps */}
            <div style={{ marginBottom: 16 }}>
              <label style={label}>Describe in 3 steps how you will ensure you complete this project *</label>
              <textarea value={threeSteps} onChange={e => setThreeSteps(e.target.value)} rows={4} placeholder="Step 1: ... Step 2: ... Step 3: ..." style={{ ...inp, resize: "none" }} onFocus={e => (e.target.style.borderColor = B_INDIGO)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
            </div>

            {/* Manager Details */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>Manager Details <span style={{ fontWeight: 400, color: "#8888a0", fontSize: 12 }}>(Optional)</span></div>
              <p style={{ fontSize: 12.5, color: "#8888a0", lineHeight: 1.55, marginBottom: 12 }}>If you are selected for this project would you like us to inform your manager? If yes, please share your immediate supervisor/managers details:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <label style={{ ...label, marginBottom: 6 }}>Full Name</label>
                  <input type="text" value={managerName} onChange={e => setManagerName(e.target.value)} placeholder="Manager's full name" style={inp} onFocus={e => (e.target.style.borderColor = B_INDIGO)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
                </div>
                <div>
                  <label style={{ ...label, marginBottom: 6 }}>Official Email ID</label>
                  <input type="email" value={managerEmail} onChange={e => setManagerEmail(e.target.value)} placeholder="manager@tata.com" style={inp} onFocus={e => (e.target.style.borderColor = B_INDIGO)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
                </div>
              </div>
            </div>

            {/* Volunteer Undertaking */}
            <div style={{ marginBottom: 22, background: "#f8f8fc", borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 4 }}>Volunteer Undertaking</div>
              <div style={{ fontSize: 11.5, color: "#8888a0", marginBottom: 12 }}>(Please read before applying.)</div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                {undertakingPoints.map((pt, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, fontSize: 12.5, color: "#555", lineHeight: 1.5 }}>
                    <span style={{ color: B_INDIGO, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>•</span>
                    {pt}
                  </li>
                ))}
              </ul>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 16, cursor: "pointer" }}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 3, accentColor: B_INDIGO, width: 15, height: 15, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: B_INDIGO, fontWeight: 600, lineHeight: 1.5 }}>I agree to the above mentioned terms of submitting an application under ProEngage</span>
              </label>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={reset} style={{ flex: 1, background: "#fff", border: "1.5px solid #dddde8", borderRadius: 10, padding: "12px", fontSize: 13.5, fontWeight: 600, color: "#6b6b7a", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Save for Later</button>
              <button disabled={!canSubmit} onClick={() => setSubmitted(true)} style={{ flex: 2, background: canSubmit ? B_INDIGO : "#e0e0e8", color: canSubmit ? "#fff" : "#aaa", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s" }}>Submit Application</button>
            </div>
          </div>
        )
      )}
    </DrawerShell>
  );
}

// ─── Referral drawer ──────────────────────────────────────────────────────────
function ReferralDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const refLink = "https://tataengage.com/join?ref=PS7842";
  const copy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <DrawerShell open={open} onClose={onClose} title="Refer a Colleague or Family Member" subtitle="Share your unique referral link below" accentTag="Referral">
      <div style={{ padding: "28px 28px" }}>
        <p style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6, marginBottom: 22 }}>When someone joins TataEngage using your referral link, your Referred count goes up and you're one step closer to earning the Connector badge.</p>
        <div style={{ background: P_INDIGO, border: `1px solid ${B_INDIGO}22`, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: B_INDIGO, wordBreak: "break-all" }}>{refLink}</span>
          <button onClick={copy} style={{ background: copied ? "#65A30D" : B_INDIGO, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s" }}>{copied ? "Copied!" : "Copy Link"}</button>
        </div>
        <div style={{ fontSize: 12, color: "#aaaabc" }}>Link expires in 30 days. You have referred 3 people so far.</div>
      </div>
    </DrawerShell>
  );
}

// ─── Share story drawer ───────────────────────────────────────────────────────
function ShareDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const captions: Record<string, string> = {
    linkedin: `Proud to be volunteering through @TataEngage on the ${VOLUNTEER.activeApplication?.title ?? "ProEngage"} project with ${VOLUNTEER.activeApplication?.ngo ?? "an incredible NGO"}. Giving back with skills you love is the most rewarding thing. #TataEngage #BeTheChange`,
    twitter: `Volunteering through @TataEngage on ${VOLUNTEER.activeApplication?.title ?? "ProEngage"}. Skills + purpose = impact. #TataEngage`,
    whatsapp: `Hey! I'm volunteering through Tata Engage on "${VOLUNTEER.activeApplication?.title}". It's an amazing platform if you want to give back using your professional skills. Check it out: https://tataengage.com`,
  };
  const [active, setActive] = useState("linkedin");
  return (
    <DrawerShell open={open} onClose={onClose} title="Share Your Story" subtitle="Let your network know about your volunteering journey" accentTag="Social Share">
      <div style={{ padding: "28px 28px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {[["linkedin", "LinkedIn"], ["twitter", "Twitter"], ["whatsapp", "WhatsApp"]].map(([id, lbl]) => (
            <button key={id} onClick={() => setActive(id)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1.5px solid ${active === id ? B_INDIGO : "#dddde8"}`, background: active === id ? P_INDIGO : "#fff", color: active === id ? B_INDIGO : "#6b6b7a", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>{lbl}</button>
          ))}
        </div>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>Pre-written caption (you can edit)</label>
        <textarea defaultValue={captions[active]} rows={5} style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 10, padding: "12px 14px", fontSize: 13.5, fontFamily: "'DM Sans', sans-serif", color: ACCENT_NAVY, resize: "none", outline: "none", lineHeight: 1.6, boxSizing: "border-box", marginBottom: 16 }} onFocus={e => (e.target.style.borderColor = B_INDIGO)} onBlur={e => (e.target.style.borderColor = "#e0e0e8")} />
        <div style={{ fontSize: 12, color: "#aaaabc", marginBottom: 20 }}>The platform never auto-posts on your behalf. You'll be taken to the platform to paste and post.</div>
        <button style={{ width: "100%", background: B_INDIGO, color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Open {["linkedin","twitter","whatsapp"].includes(active) ? active.charAt(0).toUpperCase() + active.slice(1) : ""}</button>
      </div>
    </DrawerShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function DashboardView() {
  const navigate = useNavigate();
  const { setShowOrientationModal, triggerToast: ctxToast } = useAppContext();

  // Section tracking
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);
  const [activeSection, setActiveSection] = useState("snapshot");
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // Section tracker observer
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.2 });
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  // Count-up trigger
  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsStarted(true); }, { threshold: 0.3 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  // Activity state
  const activitySlicers = getActivitySlicers();
  const defaultActivity = activitySlicers[0].id;
  const [activeActivity, setActiveActivity] = useState(defaultActivity);

  // History state
  const [activeHistory, setActiveHistory] = useState("projects");
  const [editionFilter, setEditionFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const filteredApplications = HISTORY_APPLICATIONS.filter(a => {
    if (editionFilter && a.edition !== editionFilter) return false;
    if (yearFilter && a.year !== yearFilter) return false;
    return true;
  });

  // Drawer states
  const [drawerApp, setDrawerApp]         = useState<AppRecord | null>(null);
  const [updateOpen, setUpdateOpen]       = useState(false);
  const [feedbackOpen, setFeedbackOpen]   = useState(false);
  const [grievanceOpen, setGrievanceOpen] = useState(false);
  const [applyProject, setApplyProject]   = useState<PEProject | null>(null);
  const [referralOpen, setReferralOpen]   = useState(false);
  const [shareOpen, setShareOpen]         = useState(false);

  return (
    <>
      <div style={{ background: "#f8f9ff", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", paddingBottom: 80 }}>

        {/* Greeting bar */}
        <div style={{ background: "#FEF3C7", padding: "92px 40px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, color: ACCENT_NAVY, letterSpacing: -0.5 }}>Welcome back, {VOLUNTEER.firstName}</div>
            <div style={{ fontSize: 13, color: "rgba(13,27,62,0.55)", marginTop: 4 }}>{VOLUNTEER.designation} · {VOLUNTEER.company} · {VOLUNTEER.city}</div>
          </div>
          {hasActive ? (
            <div style={{ background: "rgba(146,64,14,0.08)", border: "1px solid rgba(146,64,14,0.18)", borderRadius: 12, padding: "14px 20px", maxWidth: 360 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#92400E", marginBottom: 5 }}>Active · {VOLUNTEER.activeApplication!.edition}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT_NAVY, lineHeight: 1.3 }}>{VOLUNTEER.activeApplication!.title}</div>
              <div style={{ fontSize: 12.5, color: "rgba(13,27,62,0.5)", marginTop: 4 }}>{VOLUNTEER.activeApplication!.ngo} · Matched {VOLUNTEER.activeApplication!.matchDate}</div>
            </div>
          ) : IS_PE_SEASON ? (
            <div style={{ background: "rgba(13,27,62,0.08)", border: `1px solid rgba(13,27,62,0.12)`, borderRadius: 12, padding: "14px 20px", maxWidth: 360 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(13,27,62,0.5)", marginBottom: 5 }}>ProEngage Edition 11 · Open now</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: ACCENT_NAVY, lineHeight: 1.4 }}>Applications close 15 July. Browse projects matched to your skills below.</div>
            </div>
          ) : (
            <div style={{ background: "rgba(13,27,62,0.06)", border: "1px solid rgba(13,27,62,0.10)", borderRadius: 12, padding: "14px 20px", maxWidth: 360 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(13,27,62,0.4)", marginBottom: 5 }}>Next ProEngage Edition</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: ACCENT_NAVY, lineHeight: 1.4 }}>Opens January 2026. Explore TVW events and DIY activities below.</div>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto", padding: "40px 40px 100px", gap: 44 }}>

          {/* Main */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* ═══ 1. SNAPSHOT ════════════════════════════════════════════ */}
            <div style={{ background: "#f0f1f8", borderRadius: 16, padding: "24px 22px", marginBottom: 52 }}>
            <section id="snapshot" style={{ scrollMarginTop: 108 }}>
              <SectionHeading eyebrow="Your impact, at a glance" title="Engagement Snapshot" />

              {IS_NEW_VOLUNTEER && (
                <div style={{ background: P_INDIGO, border: `1px solid ${B_INDIGO}22`, borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontSize: 13.5, color: B_INDIGO, lineHeight: 1.6 }}>
                  You're just getting started. Hover over any number below to see how you can earn it.
                </div>
              )}

              {/* Stat tiles */}
              <div ref={statsRef} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
                <StatTile value={VOLUNTEER.stats.hoursVolunteered} suffix=" hrs" label="Hours Volunteered"  pastel={CP_PINK}    accentColor={C_PINK}    delay={0}   started={statsStarted} />
                <StatTile value={VOLUNTEER.stats.projectsApplied}                label="Projects Applied"   pastel={"#FEF9C3"} accentColor={"#A16207"}   delay={100} started={statsStarted} />
                <StatTile value={VOLUNTEER.stats.projectsCompleted}              label="Projects Completed" pastel={CP_MIDBLUE} accentColor={C_MIDBLUE} delay={200} started={statsStarted} />
                <StatTile value={VOLUNTEER.stats.projectsDropped}                label="Dropped"            pastel={P_RED}      accentColor={B_RED}   delay={300} started={statsStarted} />
                <StatTile value={VOLUNTEER.stats.referrals}                      label="No of Referrals"    pastel={P_YELLOW}   accentColor={B_YELLOW}  delay={400} started={statsStarted} />
                <StatTile value={VOLUNTEER.stats.badgesEarned}                   label="Badges Earned"      pastel={CP_PINKRED} accentColor={C_PINKRED} delay={500} started={statsStarted} />
              </div>

              {/* Skills & Interests */}
              <div style={{ ...card, marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 12 }}>Skills You Bring</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {VOLUNTEER.skills.slice(0, 4).map(s => <span key={s} style={{ background: CP_PINK, color: C_PINK, fontSize: 12.5, fontWeight: 600, padding: "4px 12px", borderRadius: 100 }}>{s}</span>)}
                </div>
              </div>

              {/* Badges */}
              {!IS_NEW_VOLUNTEER && (
                <div style={{ ...card, marginBottom: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 14 }}>Badges Earned</div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {BADGES.slice(0, 3).map(b => {
                      const Icon = BADGE_ICONS[b.id];
                      return (
                        <div key={b.id} title={`${b.name} — ${b.desc} (${b.earned})`}
                          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "default", transition: "transform 0.15s" }}
                          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                        >
                          <div style={{ width: 42, height: 42, borderRadius: "50%", background: b.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {Icon && <Icon size={18} color="#fff" />}
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 600, color: "#6b6b7a", textAlign: "center", lineHeight: 1.2, maxWidth: 52 }}>{b.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {IS_NEW_VOLUNTEER && (
                <div style={{ ...card, borderStyle: "dashed", marginBottom: 10 }}>
                  <div style={{ fontSize: 13, color: "#aaaabc", textAlign: "center", padding: "8px 0" }}>Badges appear here as you complete projects, participate in TVW, and hit volunteering milestones.</div>
                </div>
              )}

              {/* Testimonial — embedded in Snapshot */}
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 12 }}>Testimonial from the field</div>
                {IS_NEW_VOLUNTEER ? (
                  <div style={{ ...card, borderStyle: "dashed", textAlign: "center", padding: "32px 28px" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>Your testimonial will appear here</div>
                    <div style={{ fontSize: 13, color: "#8888a0", lineHeight: 1.65, maxWidth: 380, margin: "0 auto" }}>Once you complete a ProEngage project, your NGO partner can write a testimonial about your work.</div>
                  </div>
                ) : (
                  <div style={{ background: "#F7FEE7", borderRadius: 14, padding: "28px 32px", position: "relative", overflow: "hidden", border: "1px solid #d9f99d" }}>
                    <div style={{ position: "absolute", top: -20, left: 20, fontFamily: "Georgia, serif", fontSize: 160, color: "rgba(22,101,52,0.06)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>"</div>
                    <div style={{ display: "inline-block", background: "#ecfccb", border: "1px solid #d9f99d", borderRadius: 100, padding: "3px 10px", fontSize: 10.5, fontWeight: 700, color: "#365314", letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 16 }}>{TESTIMONIAL.edition}</div>
                    <blockquote style={{ fontSize: 15, lineHeight: 1.72, color: "#365314", fontStyle: "italic", fontWeight: 300, margin: "0 0 22px", position: "relative", zIndex: 1 }}>"{TESTIMONIAL.quote}"</blockquote>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1 }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", background: TESTIMONIAL.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{TESTIMONIAL.avatarInitials}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: ACCENT_NAVY, fontSize: 13.5 }}>{TESTIMONIAL.author}</div>
                        <div style={{ fontSize: 12, color: "#6b6b7a", marginTop: 2 }}>{TESTIMONIAL.role}</div>
                      </div>
                      <div style={{ marginLeft: "auto", textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: "#6b6b7a", lineHeight: 1.4 }}>{TESTIMONIAL.project}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
            </div>

            {/* ═══ 2. ACTIVITIES ══════════════════════════════════════════ */}
            <div style={{ background: "#f0f1f8", borderRadius: 16, padding: "24px 22px", marginBottom: 52 }}>
            <section id="activities" style={{ scrollMarginTop: 108 }}>
              <SectionHeading
                eyebrow={IS_PE_SEASON ? "ProEngage Edition 11 · Open · Closes 15 Jul 2025" : "Non-ProEngage season · Next edition opens Jan 2026"}
                title="My Activities"
              />
              <Slicers options={activitySlicers} active={activeActivity} onChange={setActiveActivity} accentColor={B_INDIGO} notifications={{ opportunities: NOTIFICATIONS.viewOpportunities, diy: NOTIFICATIONS.diyActivities, proengage: NOTIFICATIONS.proEngageProject, apply: NOTIFICATIONS.proEngageProject, early: NOTIFICATIONS.proEngageProject }} />

              {/* ── View Opportunities tab ─────────────────────────────── */}
              {activeActivity === "opportunities" && (
                <div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {TVW_OPPORTUNITIES.slice(0, 2).map(ev => (
                      <div key={ev.id}
                        style={{ ...card, display: "flex", gap: 16, alignItems: "center", cursor: "pointer", transition: "box-shadow 0.18s, transform 0.18s", padding: "18px 20px" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(13,27,62,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                      >
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: ev.pastel, border: `1px solid ${ev.accentColor}22`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: ev.accentColor }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: ACCENT_NAVY, marginBottom: 8 }}>{ev.title}</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {[ev.company, ev.date, ev.mode, ev.duration].map((detail, i) => (
                              <span key={i} style={{ background: ev.pastel, color: ev.accentColor, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 100, display: "inline-block" }}>{detail}</span>
                            ))}
                            <span style={{ background: ev.pastel, color: ev.accentColor, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 100 }}>{ev.theme}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                                                    <button onClick={(e) => { e.stopPropagation(); ctxToast("Your SPOC has been notified — Rohan Desai will reach out within 24 hours."); }} style={{ background: ev.accentColor, color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Contact SPOC</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate("/tvw")} style={{ marginTop: 14, background: "none", border: "none", fontSize: 13.5, color: B_YELLOW, fontWeight: 600, cursor: "pointer", padding: 0 }}>
                    View all opportunities →
                  </button>
                </div>
              )}

              {/* ── DIY tab ───────────────────────────────────────────── */}
              {activeActivity === "diy" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    {DIY_ACTIVITIES.map(a => (
                      <div key={a.id}
                        style={{ background: a.pastel, border: "1px solid #e8e8f0", borderRadius: 12, padding: "20px", cursor: "pointer", transition: "transform 0.18s, box-shadow 0.18s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${a.accentColor}18`; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                      >
                        <span style={{ display: "inline-block", background: a.accentColor, color: "#fff", fontSize: 10.5, fontWeight: 700, padding: "2px 9px", borderRadius: 100, textTransform: "uppercase", marginBottom: 10, letterSpacing: "0.3px" }}>{a.theme}</span>
                        <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 7, lineHeight: 1.3 }}>{a.title}</div>
                        <div style={{ fontSize: 13, color: "#555", lineHeight: 1.55 }}>{a.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── My ProEngage Project tab (PE season, active match) ── */}
              {activeActivity === "proengage" && IS_PE_SEASON && hasActive && (
                <div>
                  <div style={{ background: CP_PINKRED, border: `1px solid ${C_PINKRED}33`, borderRadius: 12, padding: "16px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C_PINKRED, flexShrink: 0, boxShadow: `0 0 0 4px ${C_PINKRED}2a` }} />
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: C_PINKRED, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 2 }}>Matched · {VOLUNTEER.activeApplication!.edition}</div>
                      <div style={{ fontSize: 14.5, fontWeight: 700, color: ACCENT_NAVY }}>{VOLUNTEER.activeApplication!.title}</div>
                      <div style={{ fontSize: 12.5, color: "#6b6b7a", marginTop: 2 }}>{VOLUNTEER.activeApplication!.ngo} · {VOLUNTEER.activeApplication!.mode} · {VOLUNTEER.activeApplication!.duration} · Matched {VOLUNTEER.activeApplication!.matchDate}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { label: "Post Your Monthly Update", desc: "Share progress with TSG and your NGO partner.", color: B_INDIGO, pastel: P_INDIGO, action: () => setUpdateOpen(true),   disabled: false },
                      { label: "Access E-Module",        desc: "Orientation, roles and responsibilities.",      color: B_BLUE,   pastel: P_BLUE,   action: () => {},                   disabled: false },
                      { label: "Submit Feedback",        desc: "Rate your experience and share learnings.",     color: "#65A30D", pastel: "#F7FEE7", action: () => setFeedbackOpen(true), disabled: false },
                      { label: "Download Certificate",   desc: "Available once both sides submit feedback.",    color: "#bbb",   pastel: "#f8f8fc", action: () => {},                   disabled: true  },
                    ].map(a => (
                      <button key={a.label} disabled={a.disabled} onClick={a.action}
                        style={{ background: a.pastel, border: `1px solid ${a.disabled ? "#e8e8f0" : a.color + "22"}`, borderRadius: 12, padding: "18px", textAlign: "left", cursor: a.disabled ? "not-allowed" : "pointer", opacity: a.disabled ? 0.5 : 1, transition: "transform 0.18s, box-shadow 0.18s", fontFamily: "'DM Sans', sans-serif" }}
                        onMouseEnter={e => { if (!a.disabled) { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${a.color}22`; }}}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                      >
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: a.disabled ? "#ccc" : a.color, marginBottom: 10 }} />
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: a.disabled ? "#aaa" : ACCENT_NAVY, marginBottom: 4 }}>{a.label}</div>
                        <div style={{ fontSize: 12, color: a.disabled ? "#ccc" : "#6b6b7a", lineHeight: 1.45 }}>{a.desc}</div>
                        {a.disabled && <div style={{ fontSize: 11, color: "#ccc", marginTop: 6, fontStyle: "italic" }}>Awaiting feedback submission</div>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Apply for a Project (PE season, no match) ─────────── */}
              {activeActivity === "apply" && IS_PE_SEASON && !hasActive && (
                <div>
                  <div style={{ background: P_INDIGO, border: `1px solid ${B_INDIGO}22`, borderRadius: 12, padding: "16px 18px", marginBottom: 20 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: B_INDIGO, marginBottom: 4 }}>Applications close 15 July 2025</div>
                    <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>ProEngage Edition 11 is open. The AI has matched these projects to your skills and interests. Apply to up to 3 projects — the first NGO that selects you gets to work with you.</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {PE_OPPORTUNITIES.map(p => (
                      <div key={p.id} style={{ ...card, padding: "20px", border: `1px solid ${p.accentColor}22` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                              <span style={{ background: p.pastel, color: p.accentColor, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 100 }}>{p.match}% match</span>
                              <span style={{ fontSize: 11.5, color: "#aaaabc" }}>{p.skillArea}</span>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: 14.5, color: ACCENT_NAVY, marginBottom: 3 }}>{p.title}</div>
                            <div style={{ fontSize: 12.5, color: "#8888a0" }}>{p.ngo} · {p.mode} · {p.duration}</div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontSize: 11.5, color: "#aaaabc", marginBottom: 8 }}>Closes {p.closes}</div>
                            <div style={{ fontSize: 11.5, color: "#aaaabc", marginBottom: 10 }}>{p.applicants} applicants</div>
                            <button onClick={() => setApplyProject(p)} style={{ background: p.accentColor, color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Apply</button>
                          </div>
                        </div>
                        <button style={{ background: "none", border: "none", fontSize: 12.5, color: "#8888a0", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Save for later</button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate("/proengage")} style={{ marginTop: 14, background: "none", border: "none", fontSize: 13.5, color: B_INDIGO, fontWeight: 600, cursor: "pointer", padding: 0 }}>Browse all ProEngage projects →</button>
                </div>
              )}

              {/* ── Apply Early (non-PE season) ─────────────────────────── */}
              {activeActivity === "early" && !IS_PE_SEASON && (
                <div style={{ ...card, textAlign: "center", padding: "36px 32px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>ProEngage applications open in January 2026</div>
                  <div style={{ fontSize: 13.5, color: "#8888a0", lineHeight: 1.65, maxWidth: 380, margin: "0 auto 20px" }}>The next edition isn't open yet, but you can register your interest early and be first to know when projects are listed.</div>
                  <button style={{ background: B_INDIGO, color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Register Early Interest</button>
                </div>
              )}

              {/* Refer + Share — always below active tab */}
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button onClick={() => setReferralOpen(true)} style={{ flex: 1, background: P_INDIGO, border: `1.5px solid ${B_INDIGO}22`, borderRadius: 10, padding: "13px 16px", fontSize: 13.5, fontWeight: 600, color: B_INDIGO, cursor: "pointer", transition: "border-color 0.18s, transform 0.18s", fontFamily: "'DM Sans', sans-serif" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = B_INDIGO; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${B_INDIGO}22`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                  Refer a Colleague or Family Member
                </button>
                <button onClick={() => setShareOpen(true)} style={{ flex: 1, background: P_BLUE, border: `1.5px solid ${B_BLUE}22`, borderRadius: 10, padding: "13px 16px", fontSize: 13.5, fontWeight: 600, color: B_BLUE, cursor: "pointer", transition: "border-color 0.18s, transform 0.18s", fontFamily: "'DM Sans', sans-serif" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = B_BLUE; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${B_BLUE}22`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                  Share Your Story
                </button>
              </div>
            </section>
            </div>

            {/* ═══ 3. HISTORY ═════════════════════════════════════════════ */}
            <div style={{ background: "#f0f1f8", borderRadius: 16, padding: "24px 22px", marginBottom: 52 }}>
            <section id="history" style={{ scrollMarginTop: 108 }}>
              <SectionHeading eyebrow="Your volunteering trail" title="My History" />

              {IS_NEW_VOLUNTEER ? (
                <div style={{ ...card, borderStyle: "dashed", textAlign: "center", padding: "40px 32px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>No history yet</div>
                  <div style={{ fontSize: 13.5, color: "#8888a0", lineHeight: 1.65, maxWidth: 360, margin: "0 auto" }}>Your applications, completed projects, certificates, and feedback will all appear here as you volunteer.</div>
                </div>
              ) : (
                <>
                  <Slicers options={HISTORY_SLICERS} active={activeHistory} onChange={id => { setActiveHistory(id); setEditionFilter(""); setYearFilter(""); }} accentColor={B_YELLOW} />

                  {["applications", "projects", "certificates", "feedback"].includes(activeHistory) && (
                    <div style={{ marginBottom: 16 }}>
                      <select value={editionFilter} onChange={e => setEditionFilter(e.target.value)} style={{ padding: "6px 12px", borderRadius: 8, border: "1.5px solid #dddde8", background: "#fff", fontSize: 13, color: ACCENT_NAVY, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", outline: "none" }}>
                        <option value="">Latest Edition</option>
                        {["ProEngage 11","ProEngage 10","ProEngage 9","ProEngage 8","TVW 22","TVW 21"].map(e => <option key={e}>{e}</option>)}
                      </select>
                    </div>
                  )}

                  {/* Applications */}
                  {activeHistory === "applications" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {filteredApplications.map(a => (
                        <div key={a.id} onClick={() => setDrawerApp(a)}
                          style={{ ...card, display: "flex", gap: 14, alignItems: "center", cursor: "pointer", transition: "box-shadow 0.15s, transform 0.15s", padding: "13px 18px" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(13,27,62,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateX(2px)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateX(0)"; }}
                        >
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 6, whiteSpace: "nowrap", background: a.type === "ProEngage" ? P_INDIGO : "#F7FEE7", color: a.type === "ProEngage" ? B_INDIGO : "#65A30D" }}>{a.type}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.project}</div>
                            <div style={{ fontSize: 12, color: "#aaaabc", marginTop: 2 }}>{a.edition} · {a.date}</div>
                          </div>
                          <StatusBadge status={a.status} />
                          <span style={{ fontSize: 18, color: "#dddde8", marginLeft: 4 }}>›</span>
                        </div>
                      ))}
                      {filteredApplications.length === 0 && (
                        <div style={{ ...card, textAlign: "center", padding: "28px", color: "#aaaabc", fontSize: 13.5 }}>No applications match this filter.</div>
                      )}
                    </div>
                  )}

                  {/* Projects */}
                  {activeHistory === "projects" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {HISTORY_PROJECTS.map(p => (
                        <div key={p.id} style={{ ...card }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                            <div>
                              <div style={{ fontSize: 14.5, fontWeight: 700, color: ACCENT_NAVY }}>{p.title}</div>
                              <div style={{ fontSize: 12.5, color: "#8888a0", marginTop: 3 }}>{p.ngo} · {p.edition} · {p.hours} hrs</div>
                            </div>
                            {p.cert && <button style={{ background: P_INDIGO, color: B_INDIGO, border: "none", borderRadius: 8, padding: "6px 13px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Download Certificate</button>}
                          </div>
                          <div style={{ background: p.cert ? "#F7FEE7" : P_RED, borderRadius: 9, padding: "11px 14px", fontSize: 13, color: p.cert ? "#365314" : "#7f1d1d", borderLeft: `3px solid ${p.cert ? "#84CC16" : B_RED}`, lineHeight: 1.55 }}>{p.outcome}</div>
                          <div style={{ marginTop: 10, display: "flex", gap: 6 }}>{p.skills.map(s => <span key={s} style={{ background: P_INDIGO, color: B_INDIGO, fontSize: 11.5, fontWeight: 600, padding: "3px 10px", borderRadius: 100 }}>{s}</span>)}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* My Experience (testimonials) */}
                  {activeHistory === "experience" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ background: "#F7FEE7", borderRadius: 14, padding: "28px 32px", position: "relative", overflow: "hidden", border: "1px solid #d9f99d" }}>
                        <div style={{ position: "absolute", top: -20, left: 20, fontFamily: "Georgia, serif", fontSize: 140, color: "rgba(22,101,52,0.06)", lineHeight: 1, pointerEvents: "none" }}>"</div>
                        <div style={{ display: "inline-block", background: "#ecfccb", border: "1px solid #d9f99d", borderRadius: 100, padding: "3px 10px", fontSize: 10.5, fontWeight: 700, color: "#365314", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.5px" }}>ProEngage Edition 11 · Pending approval</div>
                        <blockquote style={{ fontSize: 16, lineHeight: 1.7, color: "#365314", fontStyle: "italic", fontWeight: 300, margin: "0 0 18px", position: "relative", zIndex: 1 }}>"{TESTIMONIAL.quote}"</blockquote>
                        <div style={{ fontSize: 13, color: "#365314", opacity: 0.7 }}>— {TESTIMONIAL.author}, {TESTIMONIAL.role}</div>
                      </div>
                      <div style={{ ...card, fontSize: 13.5, color: "#8888a0", lineHeight: 1.6 }}>Testimonials are written reflections by your NGO partners on your project contribution. They appear here once approved by the TSG Admin team.</div>
                    </div>
                  )}

                  {/* Certificates */}
                  {activeHistory === "certificates" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {HISTORY_PROJECTS.filter(p => p.cert).map(p => (
                        <div key={p.id} style={{ background: P_INDIGO, border: `1px solid ${B_INDIGO}22`, borderRadius: 14, padding: "22px 20px" }}>
                          <div style={{ fontSize: 10.5, fontWeight: 700, color: B_INDIGO, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 6 }}>Certificate of Completion</div>
                          <div style={{ fontSize: 14.5, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 3 }}>{p.title}</div>
                          <div style={{ fontSize: 12.5, color: "#8888a0", marginBottom: 18 }}>{p.ngo} · {p.edition}</div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button style={{ flex: 1, background: ACCENT_NAVY, color: "#fff", border: "none", borderRadius: 8, padding: "8px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Download PDF</button>
                            <button style={{ background: "#0077b5", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Share</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Feedback */}
                  {activeHistory === "feedback" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {HISTORY_PROJECTS.filter(p => p.cert).map(p => (
                        <div key={p.id} style={{ ...card }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: ACCENT_NAVY }}>{p.title}</div>
                              <div style={{ fontSize: 12.5, color: "#8888a0", marginTop: 3 }}>{p.ngo} · {p.edition}</div>
                            </div>
                            <span style={{ background: "#F7FEE7", color: "#65A30D", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, whiteSpace: "nowrap" }}>Submitted</span>
                          </div>
                          <div style={{ marginTop: 10, display: "flex", gap: 2 }}>{[1,2,3,4,5].map(i => <span key={i} style={{ color: B_YELLOW, fontSize: 20, lineHeight: 1 }}>★</span>)}</div>
                        </div>
                      ))}
                      {hasActive && (
                        <div style={{ background: P_YELLOW, border: `1px solid ${B_YELLOW}44`, borderRadius: 12, padding: "16px 18px" }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY, marginBottom: 4 }}>{VOLUNTEER.activeApplication!.title}</div>
                          <div style={{ fontSize: 13, color: "#78350f", lineHeight: 1.5 }}>Feedback can be submitted once your project is marked complete by the NGO.</div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </section>
            </div>

            {/* ═══ 4. RESOURCES ═══════════════════════════════════════════ */}
            <div style={{ background: "#f0f1f8", borderRadius: 16, padding: "24px 22px", marginBottom: 52 }}>
            <section id="resources" style={{ scrollMarginTop: 108 }}>
              <SectionHeading eyebrow="Learning and inspiration" title="Resource Library" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                {RESOURCES.map(r => <ResourceCard key={r.id} r={r} onClick={() => {
                  if (r.id === "emodule") { setShowOrientationModal(true); }
                  else { navigate("/media"); }
                }} />)}
              </div>
            </section>
            </div>

          </div>

          {/* Right rail */}
          <div style={{ width: 148, flexShrink: 0, position: "sticky", top: 108, alignSelf: "flex-start" }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#c0c0cc", marginBottom: 12 }}>On this page</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {SECTIONS.map(s => {
                const on = activeSection === s.id;
                const hasNotif = s.id === "activities" && (NOTIFICATIONS.viewOpportunities || NOTIFICATIONS.diyActivities || NOTIFICATIONS.proEngageProject);
                return (
                  <button key={s.id} onClick={() => scrollTo(s.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, border: "none", background: on ? P_YELLOW : "transparent", cursor: "pointer", textAlign: "left", transition: "background 0.18s", fontFamily: "'DM Sans', sans-serif" }}>
                    <div style={{ width: 2, height: 12, borderRadius: 2, background: on ? B_YELLOW : "#dddde8", flexShrink: 0, transition: "background 0.18s" }} />
                    <span style={{ position: "relative", display: "inline-flex", fontSize: 12.5, fontWeight: on ? 700 : 400, color: on ? B_YELLOW : "#aaaabc", transition: "color 0.18s" }}>{s.label}{hasNotif && <span style={notifDot} />}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: 28 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#c0c0cc", marginBottom: 12 }}>Quick Links</div>
              {[{ label: "Edit Profile", action: () => navigate("/profile") }, { label: "Raise a Grievance", action: () => setGrievanceOpen(true) }].map(a => (
                <button key={a.label} onClick={a.action} style={{ display: "block", width: "100%", background: "none", border: "none", padding: "7px 10px", borderRadius: 8, fontSize: 12.5, color: "#8888a0", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif", transition: "background 0.15s, color 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f0f0f8"; (e.currentTarget as HTMLElement).style.color = ACCENT_NAVY; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "#8888a0"; }}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* All modals */}
      <ApplicationDrawer   app={drawerApp}     onClose={() => setDrawerApp(null)}      />
      <ProjectUpdateDrawer open={updateOpen}   onClose={() => setUpdateOpen(false)}    />
      <FeedbackDrawer      open={feedbackOpen} onClose={() => setFeedbackOpen(false)}  />
      <GrievanceDrawer     open={grievanceOpen} onClose={() => setGrievanceOpen(false)} />
      <ApplyDrawer         project={applyProject} onClose={() => setApplyProject(null)} />
      <ReferralDrawer      open={referralOpen}  onClose={() => setReferralOpen(false)}  />
      <ShareDrawer         open={shareOpen}     onClose={() => setShareOpen(false)}     />
    </>
  );
}
