import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── Brand tokens — exact match to HomeView ───────────────────────────────────
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

// ─── IS_PE_SEASON — replace with: import { IS_PE_SEASON } from "../data/mockData"
const IS_PE_SEASON = true;

// ─── Mock persona — replace with PRIYA_SHARMA from mockData ──────────────────
const VOLUNTEER = {
  firstName: "Priya",
  lastName: "Sharma",
  company: "Tata Consultancy Services",
  designation: "Senior Product Manager",
  city: "Mumbai",
  skills: ["Product Strategy", "Finance", "Data Analytics", "Leadership"],
  interests: ["Education", "Women Empowerment", "Environment"],
  stats: {
    hoursVolunteered: 347,
    projectsApplied: 6,
    projectsCompleted: 4,
    projectsDropped: 1,
    referrals: 3,
    badgesEarned: 7,
  },
  activeApplication: {
    title: "Digital Marketing Strategy for Livelihood NGO",
    ngo: "Uday Foundation",
    status: "Matched" as const,
    matchDate: "12 Mar 2025",
    edition: "ProEngage Edition 11",
    skillArea: "Marketing",
  },
};

const TESTIMONIAL = {
  quote:
    "Priya brought exceptional clarity to our fundraising strategy. Within eight weeks she redesigned our donor communications and helped us raise 40% more than the previous quarter. Her analytical rigour, combined with genuine empathy for our mission, made her an invaluable part of our team.",
  author: "Rekha Iyer",
  role: "Executive Director, Uday Foundation",
  project: "Digital Marketing Strategy for Livelihood NGO",
  edition: "ProEngage Edition 11",
  avatarBg: B_RED,
  avatarInitials: "RI",
};

const TVW_OPPORTUNITIES = [
  { id: "t1", title: "Tree Plantation Drive — Aarey Forest",          company: "Tata Motors",             date: "22 Sep 2025", mode: "In-person · Mumbai",  duration: "Half day", theme: "Environment", spotsLeft: 12, accentColor: B_TEAL,   pastel: P_TEAL   },
  { id: "t2", title: "Digital Literacy Workshop for Senior Citizens",  company: "Tata Consultancy Services", date: "28 Sep 2025", mode: "Online · Pan-India", duration: "3 hours",  theme: "Education",   spotsLeft: 45, accentColor: B_BLUE,   pastel: P_BLUE   },
  { id: "t3", title: "Healthcare Camp — Blood Donation Drive",         company: "Tata Steel",              date: "4 Oct 2025",  mode: "In-person · Pune",   duration: "Half day", theme: "Health",      spotsLeft: 8,  accentColor: B_RED,    pastel: P_RED    },
];

const DIY_ACTIVITIES = [
  { id: "d1", title: "Mentor a First-Generation College Student", desc: "Commit 1 hour per week for 4 weeks over a video call. Set goals, share experience, open doors.", theme: "Education",   effort: "Low",    accentColor: B_INDIGO, pastel: P_INDIGO },
  { id: "d2", title: "Teach Financial Literacy to Youth",         desc: "Run a 2-hour workshop at a local NGO or school. TSG DIY kit provides all the materials you need.", theme: "Livelihoods", effort: "Medium", accentColor: B_YELLOW, pastel: P_YELLOW },
];

const PE_OPPORTUNITIES = [
  { id: "p1", title: "Build a Fundraising Dashboard for Child Rights NGO",    ngo: "Butterflies India",       skillArea: "Finance / Data",    duration: "3 months", mode: "Online",          closes: "15 Jul 2025", applicants: 14, match: 94, accentColor: B_BLUE,   pastel: P_BLUE   },
  { id: "p2", title: "Marketing Strategy for Women's Skilling Programme",     ngo: "Stree Mukti Sanghatna",   skillArea: "Marketing",         duration: "4 months", mode: "Hybrid · Mumbai", closes: "20 Jul 2025", applicants: 9,  match: 89, accentColor: B_TEAL,   pastel: P_TEAL   },
  { id: "p3", title: "Product Roadmap for Disability Employment Platform",    ngo: "Samarthanam Trust",       skillArea: "Product Strategy",  duration: "6 months", mode: "Online",          closes: "30 Jul 2025", applicants: 6,  match: 97, accentColor: B_INDIGO, pastel: P_INDIGO },
];

const HISTORY_APPLICATIONS = [
  { id: "a1", project: "Digital Marketing Strategy — Uday Foundation", edition: "ProEngage 11", status: "Matched",   date: "10 Mar 2025", type: "ProEngage", ngo: "Uday Foundation",    skillArea: "Marketing",        timeline: [{ label: "Applied", date: "10 Mar 2025", done: true }, { label: "Under Review", date: "14 Mar 2025", done: true }, { label: "Shortlisted", date: "18 Mar 2025", done: true }, { label: "Matched", date: "22 Mar 2025", done: true }, { label: "Project Complete", date: "Ongoing", done: false }] },
  { id: "a2", project: "Website Redesign — Red Dot Foundation",        edition: "ProEngage 10", status: "Completed", date: "Aug 2024",    type: "ProEngage", ngo: "Red Dot Foundation", skillArea: "UX / Marketing",   timeline: [{ label: "Applied", date: "2 Aug 2024",  done: true }, { label: "Under Review", date: "6 Aug 2024",  done: true }, { label: "Shortlisted", date: "10 Aug 2024", done: true }, { label: "Matched", date: "15 Aug 2024", done: true }, { label: "Project Complete", date: "12 Nov 2024", done: true }] },
  { id: "a3", project: "Aarey Tree Plantation Drive",                  edition: "TVW 22",       status: "Completed", date: "14 Sep 2024", type: "TVW",       ngo: "Tata Motors CSR",    skillArea: "Environment",      timeline: [{ label: "Registered", date: "10 Sep 2024", done: true }, { label: "Confirmed", date: "11 Sep 2024", done: true }, { label: "Participated", date: "14 Sep 2024", done: true }] },
  { id: "a4", project: "Financial Literacy for Rural Women — SEWA",    edition: "ProEngage 9",  status: "Completed", date: "Feb 2024",    type: "ProEngage", ngo: "SEWA",               skillArea: "Finance",          timeline: [{ label: "Applied", date: "5 Jan 2024",  done: true }, { label: "Under Review", date: "10 Jan 2024", done: true }, { label: "Shortlisted", date: "16 Jan 2024", done: true }, { label: "Matched", date: "22 Jan 2024", done: true }, { label: "Project Complete", date: "28 Apr 2024", done: true }] },
  { id: "a5", project: "Blood Donation Drive — Tata Steel",            edition: "TVW 21",       status: "Completed", date: "22 Mar 2024", type: "TVW",       ngo: "Tata Steel CSR",     skillArea: "Health",           timeline: [{ label: "Registered", date: "18 Mar 2024", done: true }, { label: "Confirmed", date: "19 Mar 2024", done: true }, { label: "Participated", date: "22 Mar 2024", done: true }] },
  { id: "a6", project: "Brand Strategy — Rhizome Cooperative",         edition: "ProEngage 8",  status: "Dropped",   date: "Sep 2023",    type: "ProEngage", ngo: "Rhizome Cooperative",skillArea: "Marketing",         timeline: [{ label: "Applied", date: "4 Sep 2023",  done: true }, { label: "Under Review", date: "8 Sep 2023",  done: true }, { label: "Matched", date: "14 Sep 2023", done: true }, { label: "Project Dropped", date: "2 Oct 2023", done: true }] },
];

const HISTORY_PROJECTS = [
  { id: "p1", title: "Website Redesign",              ngo: "Red Dot Foundation",   edition: "ProEngage 10", year: "2024", hours: 48, outcome: "Launched new donation portal — 60% uplift in online donations within 8 weeks of go-live.",                         skills: ["UX", "Marketing"], cert: true  },
  { id: "p2", title: "Financial Literacy Curriculum", ngo: "SEWA",                 edition: "ProEngage 9",  year: "2024", hours: 72, outcome: "Trained 150 rural women entrepreneurs in bookkeeping and basic financial planning.",                              skills: ["Finance", "Training"], cert: true  },
  { id: "p3", title: "Brand Strategy",                ngo: "Rhizome Cooperative",  edition: "ProEngage 8",  year: "2023", hours: 12, outcome: "Project paused due to personal reasons. Partial brand audit delivered to the NGO.",                             skills: ["Marketing"],       cert: false },
];

const BADGES = [
  { id: "b1", name: "First Step",    symbol: "I",    desc: "First volunteering activity",       earned: "Mar 2023", color: B_TEAL   },
  { id: "b2", name: "ProEngager",    symbol: "II",   desc: "First ProEngage project completed", earned: "Sep 2023", color: B_INDIGO },
  { id: "b3", name: "Impact Maker",  symbol: "III",  desc: "100+ hours volunteered",            earned: "Feb 2024", color: B_BLUE   },
  { id: "b4", name: "Connector",     symbol: "IV",   desc: "Referred 3 volunteers",             earned: "Apr 2024", color: B_TEAL   },
  { id: "b5", name: "TVW Champion",  symbol: "V",    desc: "3 TVW editions participated",       earned: "Sep 2024", color: B_RED    },
  { id: "b6", name: "Repeat Hero",   symbol: "VI",   desc: "3 ProEngage projects completed",    earned: "Mar 2025", color: B_INDIGO },
  { id: "b7", name: "300 Club",      symbol: "VII",  desc: "300+ volunteering hours",           earned: "Mar 2025", color: B_YELLOW },
];

const RESOURCES = [
  { id: "photos",  label: "Photos",   desc: "Gallery from TVW22, VolCon 2024 and ProEngage projects",             count: "247 items",   accentColor: B_INDIGO, pastel: P_INDIGO, photo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80" },
  { id: "videos",  label: "Videos",   desc: "Volunteer stories, impact films and event highlights",                count: "38 videos",   accentColor: B_RED,    pastel: P_RED,    photo: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80" },
  { id: "stories", label: "Stories",  desc: "Volunteer experiences and community impact narratives",               count: "94 stories",  accentColor: B_TEAL,   pastel: P_TEAL,   photo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80" },
  { id: "events",  label: "Events",   desc: "VolCon, Volympics and upcoming community gatherings",                 count: "12 upcoming", accentColor: B_YELLOW, pastel: P_YELLOW, photo: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80" },
  { id: "emodule", label: "E-Module", desc: "ProEngage orientation, NGO readiness kit and dos and don'ts",        count: "5 modules",   accentColor: B_BLUE,   pastel: P_BLUE,   photo: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80" },
];

const SECTIONS = [
  { id: "snapshot",    label: "Snapshot"    },
  { id: "testimonial", label: "Testimonial" },
  { id: "activities",  label: "Activities"  },
  { id: "history",     label: "History"     },
  { id: "resources",   label: "Resources"   },
];

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1400, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
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
  value: number; suffix?: string; label: string;
  pastel: string; accentColor: string; delay: number; started: boolean;
}) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (started) { const t = setTimeout(() => setGo(true), delay); return () => clearTimeout(t); }
  }, [started, delay]);
  const n = useCountUp(value, 1200, go);
  return (
    <div
      style={{ background: pastel, borderRadius: 16, padding: "22px 16px 18px", textAlign: "center", border: `1px solid ${accentColor}1a`, transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 28px ${accentColor}28`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 40, lineHeight: 1, color: accentColor, letterSpacing: -1 }}>
        {n}{suffix}
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: ACCENT_NAVY, marginTop: 8, textTransform: "uppercase", letterSpacing: "0.7px", lineHeight: 1.3 }}>
        {label}
      </div>
    </div>
  );
}

// ─── Pill slicers ─────────────────────────────────────────────────────────────
function Slicers({ options, active, onChange, accentColor = B_INDIGO }: {
  options: { id: string; label: string }[]; active: string;
  onChange: (id: string) => void; accentColor?: string;
}) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 22 }}>
      {options.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)} style={{
          padding: "7px 18px", borderRadius: 100,
          border: `1.5px solid ${active === o.id ? accentColor : "#dddde8"}`,
          background: active === o.id ? accentColor : "#fff",
          color: active === o.id ? "#fff" : "#555",
          fontSize: 13, fontWeight: active === o.id ? 600 : 400,
          cursor: "pointer", transition: "all 0.15s",
          fontFamily: "'Noto Sans', sans-serif",
        }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    Matched:   [P_TEAL,   B_TEAL  ],
    Completed: [P_BLUE,   B_BLUE  ],
    Dropped:   [P_RED,    B_RED   ],
    Applied:   [P_INDIGO, B_INDIGO],
    Pending:   [P_YELLOW, B_YELLOW],
  };
  const [bg, color] = map[status] ?? ["#f0f0f0", "#555"];
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, letterSpacing: "0.3px", whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 5, fontFamily: "'Noto Sans', sans-serif" }}>
        {eyebrow}
      </div>
      <h2 style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 22, fontWeight: 900, color: ACCENT_NAVY, margin: 0, letterSpacing: -0.4 }}>
        {title}
      </h2>
    </div>
  );
}

// ─── Application drawer ───────────────────────────────────────────────────────
type AppRecord = typeof HISTORY_APPLICATIONS[0];

function ApplicationDrawer({ app, onClose }: { app: AppRecord | null; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(13,27,62,0.35)", zIndex: 200, opacity: app ? 1 : 0, pointerEvents: app ? "auto" : "none", transition: "opacity 0.22s" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 420,
        background: "#fff", zIndex: 201,
        boxShadow: "-8px 0 48px rgba(13,27,62,0.14)",
        transform: app ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
        fontFamily: "'Noto Sans', sans-serif", overflowY: "auto",
      }}>
        {app && (
          <>
            <div style={{ background: ACCENT_NAVY, padding: "28px 28px 26px" }}>
              <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, padding: "5px 14px", cursor: "pointer", marginBottom: 18 }}>
                ← Close
              </button>
              <div style={{ display: "inline-block", background: `${B_YELLOW}22`, border: `1px solid ${B_YELLOW}44`, borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: B_YELLOW, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 10 }}>
                {app.type} · {app.edition}
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 6 }}>{app.project}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>{app.ngo} · {app.skillArea}</div>
              <StatusBadge status={app.status} />
            </div>

            <div style={{ padding: "28px 28px 0" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 22 }}>
                Application Timeline
              </div>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 11, top: 0, bottom: 0, width: 2, background: "#e8e8f0" }} />
                {app.timeline.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 18, marginBottom: 26, position: "relative" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: step.done ? B_INDIGO : "#fff", border: `2.5px solid ${step.done ? B_INDIGO : "#dddde8"}`, flexShrink: 0, zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {step.done && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div style={{ paddingTop: 2 }}>
                      <div style={{ fontSize: 14, fontWeight: step.done ? 600 : 400, color: step.done ? ACCENT_NAVY : "#aaaabc" }}>{step.label}</div>
                      <div style={{ fontSize: 12, color: "#aaaabc", marginTop: 2 }}>{step.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "4px 28px 36px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 14 }}>Details</div>
              <div style={{ background: "#f8f8fc", borderRadius: 12, padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
                {[["NGO", app.ngo], ["Programme", `${app.type} · ${app.edition}`], ["Skill Area", app.skillArea], ["Date Applied", app.date], ["Status", app.status]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span style={{ fontSize: 12.5, color: "#8888a0", fontWeight: 500 }}>{k}</span>
                    <span style={{ fontSize: 12.5, color: ACCENT_NAVY, fontWeight: 600, textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── Resource card — Programme Spotlight pattern ──────────────────────────────
function ResourceCard({ r, onClick }: { r: typeof RESOURCES[0]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 18, overflow: "hidden", cursor: "pointer",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered ? `0 16px 40px ${r.accentColor}28` : "0 2px 8px rgba(13,27,62,0.05)",
        transition: "transform 0.22s, box-shadow 0.22s",
        border: `1px solid ${r.accentColor}18`,
      }}
    >
      <div style={{ position: "relative", height: 110, overflow: "hidden" }}>
        <img src={r.photo} alt={r.label} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.07)" : "scale(1)", transition: "transform 0.4s" }} />
        <div style={{ position: "absolute", inset: 0, background: `${r.accentColor}c0`, opacity: hovered ? 0.88 : 0.72, transition: "opacity 0.22s" }} />
        <div style={{ position: "absolute", bottom: 10, left: 14, fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 18, color: "#fff" }}>
          {r.label}
        </div>
      </div>
      <div style={{ background: r.pastel, padding: "14px 16px" }}>
        <div style={{ fontSize: 12, color: ACCENT_NAVY, lineHeight: 1.45, marginBottom: 8 }}>{r.desc}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: r.accentColor, textTransform: "uppercase", letterSpacing: "0.8px", display: "flex", justifyContent: "space-between" }}>
          <span>{r.count}</span><span>→</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardView() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("snapshot");
  useEffect(() => {
    const onScroll = () => {
      const offsets = SECTIONS.map(s => { const el = document.getElementById(s.id); return { id: s.id, top: el ? Math.abs(el.getBoundingClientRect().top - 130) : Infinity }; });
      setActiveSection(offsets.reduce((a, b) => (a.top < b.top ? a : b)).id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsStarted(true); }, { threshold: 0.25 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const activitySlicers = IS_PE_SEASON
    ? [{ id: "tvw", label: "TVW Opportunities" }, { id: "diy", label: "DIY Activities" }, { id: "proengage", label: "ProEngage Project" }]
    : [{ id: "tvw", label: "View Opportunities" }, { id: "diy", label: "DIY Activities" }, { id: "proengage", label: "Apply for ProEngage" }];
  const [activeActivity, setActiveActivity] = useState("proengage");

  const historySlicers = [
    { id: "applications", label: "Applications" },
    { id: "projects",     label: "Projects"     },
    { id: "experience",   label: "Experience"   },
    { id: "certificates", label: "Certificates" },
    { id: "feedback",     label: "Feedback"     },
  ];
  const [activeHistory, setActiveHistory] = useState("applications");

  const editionOptions = ["All Editions", "ProEngage 11", "ProEngage 10", "ProEngage 9", "TVW 22", "TVW 21"];
  const yearOptions    = ["All Years", "2025", "2024", "2023"];
  const [editionFilter, setEditionFilter] = useState("All Editions");
  const [yearFilter,    setYearFilter]    = useState("All Years");

  const filteredApplications = HISTORY_APPLICATIONS.filter(a => {
    const eOk = editionFilter === "All Editions" || a.edition.includes(editionFilter.replace("ProEngage ", "").replace("TVW ", ""));
    const yOk = yearFilter === "All Years" || a.date.includes(yearFilter);
    return eOk && yOk;
  });

  const [drawerApp, setDrawerApp] = useState<AppRecord | null>(null);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(165deg, #f8f9ff 0%, #fff 55%, #f4f6ff 100%)", paddingTop: 80, fontFamily: "'Noto Sans', sans-serif" }}>

      {/* Greeting bar */}
      <div style={{ background: ACCENT_NAVY, padding: "24px 56px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>My Space</div>
          <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 26, color: "#fff", lineHeight: 1.15 }}>
            Welcome back, {VOLUNTEER.firstName}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
            {VOLUNTEER.designation} · {VOLUNTEER.company} · {VOLUNTEER.city}
          </div>
        </div>
        {VOLUNTEER.activeApplication && (
          <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "14px 20px", maxWidth: 360 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: B_TEAL, marginBottom: 5 }}>
              Active · {VOLUNTEER.activeApplication.edition}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>{VOLUNTEER.activeApplication.title}</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
              {VOLUNTEER.activeApplication.ngo} · Matched {VOLUNTEER.activeApplication.matchDate}
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto", padding: "44px 40px 100px", gap: 44 }}>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* 1 — SNAPSHOT */}
          <section id="snapshot" style={{ marginBottom: 60, scrollMarginTop: 108 }}>
            <SectionHeading eyebrow="Your impact, at a glance" title="Engagement Snapshot" />
            <div ref={statsRef} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 18 }}>
              <StatTile value={VOLUNTEER.stats.hoursVolunteered} suffix=" hrs" label="Hours Volunteered" pastel={P_INDIGO} accentColor={B_INDIGO} delay={0}   started={statsStarted} />
              <StatTile value={VOLUNTEER.stats.projectsApplied}               label="Projects Applied"   pastel={P_BLUE}   accentColor={B_BLUE}   delay={100} started={statsStarted} />
              <StatTile value={VOLUNTEER.stats.projectsCompleted}             label="Completed"          pastel={P_TEAL}   accentColor={B_TEAL}   delay={200} started={statsStarted} />
              <StatTile value={VOLUNTEER.stats.projectsDropped}               label="Dropped"            pastel={P_RED}    accentColor={B_RED}    delay={300} started={statsStarted} />
              <StatTile value={VOLUNTEER.stats.referrals}                     label="Referred"           pastel={P_YELLOW} accentColor={B_YELLOW} delay={400} started={statsStarted} />
              <StatTile value={VOLUNTEER.stats.badgesEarned}                  label="Badges Earned"      pastel={P_INDIGO} accentColor={B_INDIGO} delay={500} started={statsStarted} />
            </div>

            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 16, padding: "18px 20px", marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 12 }}>Skills You Bring</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {VOLUNTEER.skills.map(s    => <span key={s} style={{ background: P_INDIGO, color: B_INDIGO, fontSize: 12.5, fontWeight: 600, padding: "5px 13px", borderRadius: 100 }}>{s}</span>)}
                {VOLUNTEER.interests.map(s => <span key={s} style={{ background: P_TEAL,   color: B_TEAL,   fontSize: 12.5, fontWeight: 600, padding: "5px 13px", borderRadius: 100 }}>{s}</span>)}
              </div>
            </div>

            <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 16, padding: "18px 20px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 14 }}>Badges Earned</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {BADGES.map(b => (
                  <div key={b.id} title={`${b.name} — ${b.desc} (${b.earned})`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "default", transition: "transform 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: b.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 12, color: "#fff" }}>{b.symbol}</span>
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: ACCENT_NAVY, textAlign: "center", lineHeight: 1.2, maxWidth: 54 }}>{b.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 2 — TESTIMONIAL */}
          <section id="testimonial" style={{ marginBottom: 60, scrollMarginTop: 108 }}>
            <SectionHeading eyebrow="Words from the field" title="Testimonial" />
            <div style={{ background: ACCENT_NAVY, borderRadius: 20, padding: "40px 44px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, left: 24, fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 200, color: "rgba(255,255,255,0.04)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>"</div>
              <div style={{ display: "inline-block", background: `${B_YELLOW}22`, border: `1px solid ${B_YELLOW}44`, borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: B_YELLOW, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 22 }}>
                {TESTIMONIAL.edition}
              </div>
              <blockquote style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 19, lineHeight: 1.72, color: "rgba(255,255,255,0.88)", fontStyle: "italic", margin: "0 0 30px", position: "relative", zIndex: 1 }}>
                "{TESTIMONIAL.quote}"
              </blockquote>
              <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: TESTIMONIAL.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {TESTIMONIAL.avatarInitials}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{TESTIMONIAL.author}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{TESTIMONIAL.role}</div>
                </div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>{TESTIMONIAL.project}</div>
                </div>
              </div>
            </div>
          </section>

          {/* 3 — ACTIVITIES */}
          <section id="activities" style={{ marginBottom: 60, scrollMarginTop: 108 }}>
            <SectionHeading
              eyebrow={IS_PE_SEASON ? "ProEngage Edition 11 · Applications close 15 Jul" : "TVW 22 · September – October 2025"}
              title="My Activities"
            />
            <Slicers options={activitySlicers} active={activeActivity} onChange={setActiveActivity} accentColor={B_INDIGO} />

            {activeActivity === "tvw" && (
              <div>
                <p style={{ fontSize: 13.5, color: "#6b6b7a", marginBottom: 18, lineHeight: 1.6, margin: "0 0 18px" }}>
                  Events curated by Tata companies during TVW 22 — September to October 2025.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {TVW_OPPORTUNITIES.map(ev => (
                    <div key={ev.id}
                      style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, padding: "18px 20px", display: "flex", gap: 16, alignItems: "center", cursor: "pointer", transition: "box-shadow 0.18s, transform 0.18s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${ev.accentColor}1a`; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                    >
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: ev.pastel, border: `1px solid ${ev.accentColor}22`, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: ACCENT_NAVY }}>{ev.title}</div>
                        <div style={{ fontSize: 12.5, color: "#8888a0", marginTop: 3 }}>{ev.company} · {ev.date} · {ev.mode} · {ev.duration}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: ev.spotsLeft < 10 ? B_RED : B_TEAL, marginBottom: 6 }}>{ev.spotsLeft} spots left</div>
                        <button style={{ background: ev.accentColor, color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Register</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate("/tvw")} style={{ marginTop: 16, background: "none", border: "none", fontSize: 13.5, color: B_INDIGO, fontWeight: 600, cursor: "pointer", padding: 0 }}>
                  View all TVW opportunities →
                </button>
              </div>
            )}

            {activeActivity === "diy" && (
              <div>
                <p style={{ fontSize: 13.5, color: "#6b6b7a", marginBottom: 18, lineHeight: 1.6, margin: "0 0 18px" }}>
                  Organise your own activity with colleagues, friends, or family. Use the TSG DIY kit available in the Resource Library below.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  {DIY_ACTIVITIES.map(a => (
                    <div key={a.id}
                      style={{ background: a.pastel, border: `1px solid ${a.accentColor}22`, borderRadius: 16, padding: "22px 20px", cursor: "pointer", transition: "transform 0.18s, box-shadow 0.18s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${a.accentColor}22`; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                    >
                      <span style={{ display: "inline-block", background: a.accentColor, color: "#fff", fontSize: 10.5, fontWeight: 700, padding: "3px 10px", borderRadius: 100, textTransform: "uppercase", marginBottom: 12 }}>
                        {a.theme} · {a.effort} effort
                      </span>
                      <div style={{ fontSize: 14.5, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8, lineHeight: 1.3 }}>{a.title}</div>
                      <div style={{ fontSize: 13, color: "#555", lineHeight: 1.55 }}>{a.desc}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 12, padding: "14px 18px", fontSize: 13, color: "#6b6b7a", lineHeight: 1.6 }}>
                  Have your own idea?{" "}
                  <span style={{ color: B_INDIGO, fontWeight: 600, cursor: "pointer" }}>Create a DIY activity</span>
                  {" "}and invite colleagues and family members to join.
                </div>
              </div>
            )}

            {activeActivity === "proengage" && (
              <div>
                {VOLUNTEER.activeApplication ? (
                  <>
                    <div style={{ background: P_TEAL, border: `1px solid ${B_TEAL}33`, borderRadius: 14, padding: "18px 20px", marginBottom: 18, display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: B_TEAL, flexShrink: 0, boxShadow: `0 0 0 4px ${B_TEAL}33` }} />
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: B_TEAL, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 3 }}>Matched · {VOLUNTEER.activeApplication.edition}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: ACCENT_NAVY }}>{VOLUNTEER.activeApplication.title}</div>
                        <div style={{ fontSize: 12.5, color: "#6b6b7a", marginTop: 2 }}>{VOLUNTEER.activeApplication.ngo} · Matched {VOLUNTEER.activeApplication.matchDate}</div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {[
                        { label: "Post a Project Update", desc: "Share progress with TSG and your NGO partner", color: B_INDIGO, pastel: P_INDIGO, disabled: false },
                        { label: "Access E-Module",        desc: "Orientation, roles and responsibilities",      color: B_BLUE,   pastel: P_BLUE,   disabled: false },
                        { label: "Submit Feedback",        desc: "Rate your experience and share learnings",     color: B_TEAL,   pastel: P_TEAL,   disabled: false },
                        { label: "Download Certificate",   desc: "Available once both sides submit feedback",    color: "#bbb",   pastel: "#f8f8fc", disabled: true  },
                      ].map(a => (
                        <button key={a.label} disabled={a.disabled}
                          style={{ background: a.pastel, border: `1px solid ${a.disabled ? "#e0e0e8" : a.color + "33"}`, borderRadius: 14, padding: "20px", textAlign: "left", cursor: a.disabled ? "not-allowed" : "pointer", opacity: a.disabled ? 0.5 : 1, transition: "transform 0.18s, box-shadow 0.18s", fontFamily: "'Noto Sans', sans-serif" }}
                          onMouseEnter={e => { if (!a.disabled) { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${a.color}28`; } }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                        >
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.disabled ? "#ccc" : a.color, marginBottom: 12 }} />
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: a.disabled ? "#aaa" : ACCENT_NAVY, marginBottom: 5 }}>{a.label}</div>
                          <div style={{ fontSize: 12, color: a.disabled ? "#ccc" : "#6b6b7a", lineHeight: 1.45 }}>{a.desc}</div>
                          {a.disabled && <div style={{ fontSize: 11, color: "#ccc", marginTop: 8, fontStyle: "italic" }}>Pending feedback submission</div>}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div>
                    <p style={{ fontSize: 13.5, color: "#6b6b7a", marginBottom: 18, lineHeight: 1.6, margin: "0 0 18px" }}>
                      {IS_PE_SEASON ? "Top matches for your skills — apply before the window closes on 15 July." : "ProEngage applications are not open right now. The next edition opens in January."}
                    </p>
                    {IS_PE_SEASON && (
                      <>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {PE_OPPORTUNITIES.map(p => (
                            <div key={p.id}
                              style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, padding: "18px 20px", display: "flex", gap: 16, cursor: "pointer", transition: "box-shadow 0.18s, transform 0.18s" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${p.accentColor}1a`; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                            >
                              <div style={{ width: 4, borderRadius: 2, background: p.accentColor, flexShrink: 0, alignSelf: "stretch" }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                                  <span style={{ background: p.pastel, color: p.accentColor, fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 100 }}>{p.match}% match</span>
                                  <span style={{ fontSize: 11.5, color: "#aaaabc" }}>{p.skillArea}</span>
                                </div>
                                <div style={{ fontWeight: 700, fontSize: 14, color: ACCENT_NAVY, lineHeight: 1.3 }}>{p.title}</div>
                                <div style={{ fontSize: 12.5, color: "#8888a0", marginTop: 4 }}>{p.ngo} · {p.mode} · {p.duration} · Closes {p.closes}</div>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", flexShrink: 0 }}>
                                <span style={{ fontSize: 11.5, color: "#aaaabc" }}>{p.applicants} applicants</span>
                                <button style={{ background: p.accentColor, color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Apply</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => navigate("/proengage")} style={{ marginTop: 16, background: "none", border: "none", fontSize: 13.5, color: B_INDIGO, fontWeight: 600, cursor: "pointer", padding: 0 }}>
                          Browse all ProEngage projects →
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              {[
                { label: "Refer a Colleague or Family Member", color: B_INDIGO, pastel: P_INDIGO },
                { label: "Share Your Story",                   color: B_TEAL,   pastel: P_TEAL   },
              ].map(btn => (
                <button key={btn.label}
                  style={{ flex: 1, background: btn.pastel, border: `1.5px solid ${btn.color}22`, borderRadius: 12, padding: "14px 16px", fontSize: 13.5, fontWeight: 600, color: btn.color, cursor: "pointer", transition: "border-color 0.18s, box-shadow 0.18s, transform 0.18s", fontFamily: "'Noto Sans', sans-serif" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = btn.color; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${btn.color}22`; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${btn.color}22`; (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </section>

          {/* 4 — HISTORY */}
          <section id="history" style={{ marginBottom: 60, scrollMarginTop: 108 }}>
            <SectionHeading eyebrow="Your volunteering trail" title="My History" />
            <Slicers options={historySlicers} active={activeHistory} onChange={setActiveHistory} accentColor={B_BLUE} />

            {["applications", "projects", "experience", "feedback"].includes(activeHistory) && (
              <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
                {editionOptions.map(o => (
                  <button key={o} onClick={() => setEditionFilter(o)} style={{ padding: "5px 12px", borderRadius: 100, border: "none", background: editionFilter === o ? ACCENT_NAVY : "#f0f0f8", color: editionFilter === o ? "#fff" : "#6b6b7a", fontSize: 12, fontWeight: editionFilter === o ? 600 : 400, cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>{o}</button>
                ))}
                <div style={{ width: 1, height: 20, background: "#e0e0e8", margin: "0 2px" }} />
                {yearOptions.map(o => (
                  <button key={o} onClick={() => setYearFilter(o)} style={{ padding: "5px 12px", borderRadius: 100, border: "none", background: yearFilter === o ? B_INDIGO : "#f0f0f8", color: yearFilter === o ? "#fff" : "#6b6b7a", fontSize: 12, fontWeight: yearFilter === o ? 600 : 400, cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>{o}</button>
                ))}
              </div>
            )}

            {activeHistory === "applications" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filteredApplications.map(a => (
                  <div key={a.id} onClick={() => setDrawerApp(a)}
                    style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 12, padding: "14px 18px", display: "flex", gap: 14, alignItems: "center", cursor: "pointer", transition: "box-shadow 0.15s, transform 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(13,27,62,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateX(2px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateX(0)"; }}
                  >
                    <span style={{ fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 6, whiteSpace: "nowrap", background: a.type === "ProEngage" ? P_INDIGO : P_TEAL, color: a.type === "ProEngage" ? B_INDIGO : B_TEAL }}>
                      {a.type}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.project}</div>
                      <div style={{ fontSize: 12, color: "#aaaabc", marginTop: 2 }}>{a.edition} · {a.date}</div>
                    </div>
                    <StatusBadge status={a.status} />
                    <span style={{ fontSize: 18, color: "#dddde8", marginLeft: 4 }}>›</span>
                  </div>
                ))}
                {filteredApplications.length === 0 && (
                  <div style={{ background: "#f8f8fc", borderRadius: 12, padding: "32px", textAlign: "center", color: "#aaaabc", fontSize: 13.5 }}>
                    No applications match this filter combination.
                  </div>
                )}
              </div>
            )}

            {activeHistory === "projects" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {HISTORY_PROJECTS.map(p => (
                  <div key={p.id} style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 16, padding: "22px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: ACCENT_NAVY }}>{p.title}</div>
                        <div style={{ fontSize: 12.5, color: "#8888a0", marginTop: 3 }}>{p.ngo} · {p.edition} · {p.hours} hrs contributed</div>
                      </div>
                      {p.cert && (
                        <button style={{ background: P_INDIGO, color: B_INDIGO, border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                          Download Certificate
                        </button>
                      )}
                    </div>
                    <div style={{ background: p.cert ? P_TEAL : P_RED, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: p.cert ? "#064e3b" : "#7f1d1d", borderLeft: `3px solid ${p.cert ? B_TEAL : B_RED}`, lineHeight: 1.55 }}>
                      {p.outcome}
                    </div>
                    <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
                      {p.skills.map(s => <span key={s} style={{ background: P_INDIGO, color: B_INDIGO, fontSize: 11.5, fontWeight: 600, padding: "3px 10px", borderRadius: 100 }}>{s}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeHistory === "experience" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: ACCENT_NAVY, borderRadius: 16, padding: "28px 32px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -12, left: 18, fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 130, color: "rgba(255,255,255,0.04)", lineHeight: 1, pointerEvents: "none" }}>"</div>
                  <div style={{ display: "inline-block", background: `${B_YELLOW}22`, border: `1px solid ${B_YELLOW}44`, borderRadius: 100, padding: "3px 10px", fontSize: 11, fontWeight: 700, color: B_YELLOW, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    ProEngage Edition 11 · Pending approval
                  </div>
                  <blockquote style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 17, lineHeight: 1.7, color: "rgba(255,255,255,0.85)", fontStyle: "italic", margin: "0 0 20px", position: "relative", zIndex: 1 }}>
                    "{TESTIMONIAL.quote}"
                  </blockquote>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>— {TESTIMONIAL.author}, {TESTIMONIAL.role}</div>
                </div>
                <div style={{ background: "#f8f8fc", borderRadius: 12, padding: "16px 20px", fontSize: 13.5, color: "#8888a0", lineHeight: 1.6 }}>
                  Past testimonials appear here once approved by the TSG Admin team.
                </div>
              </div>
            )}

            {activeHistory === "certificates" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {HISTORY_PROJECTS.filter(p => p.cert).map(p => (
                  <div key={p.id} style={{ background: P_INDIGO, border: `1px solid ${B_INDIGO}22`, borderRadius: 16, padding: "24px 22px" }}>
                    <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 13, color: B_INDIGO, marginBottom: 6, letterSpacing: "0.3px" }}>Certificate of Completion</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 4 }}>{p.title}</div>
                    <div style={{ fontSize: 12.5, color: "#8888a0", marginBottom: 18 }}>{p.ngo} · {p.edition}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ flex: 1, background: ACCENT_NAVY, color: "#fff", border: "none", borderRadius: 9, padding: "8px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Download PDF</button>
                      <button style={{ background: "#0077b5", color: "#fff", border: "none", borderRadius: 9, padding: "8px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Share</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeHistory === "feedback" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {HISTORY_PROJECTS.filter(p => p.cert).map(p => (
                  <div key={p.id} style={{ background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: ACCENT_NAVY }}>{p.title}</div>
                        <div style={{ fontSize: 12.5, color: "#8888a0", marginTop: 3 }}>{p.ngo} · {p.edition}</div>
                      </div>
                      <span style={{ background: P_TEAL, color: B_TEAL, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, whiteSpace: "nowrap" }}>Submitted</span>
                    </div>
                    <div style={{ marginTop: 12, display: "flex", gap: 1 }}>
                      {[1,2,3,4,5].map(i => <span key={i} style={{ color: B_YELLOW, fontSize: 20, lineHeight: 1 }}>★</span>)}
                    </div>
                  </div>
                ))}
                {VOLUNTEER.activeApplication && (
                  <div style={{ background: P_YELLOW, border: `1px solid ${B_YELLOW}44`, borderRadius: 12, padding: "16px 18px" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: ACCENT_NAVY, marginBottom: 4 }}>{VOLUNTEER.activeApplication.title}</div>
                    <div style={{ fontSize: 13, color: "#92400e", lineHeight: 1.5 }}>Feedback can be submitted once your project is marked complete by the NGO.</div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* 5 — RESOURCES */}
          <section id="resources" style={{ scrollMarginTop: 108 }}>
            <SectionHeading eyebrow="Learning and inspiration" title="Resource Library" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
              {RESOURCES.map(r => <ResourceCard key={r.id} r={r} onClick={() => {}} />)}
            </div>
          </section>

        </div>

        {/* Right rail */}
        <div style={{ width: 152, flexShrink: 0, position: "sticky", top: 108, alignSelf: "flex-start" }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#c0c0cc", marginBottom: 12 }}>On this page</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {SECTIONS.map(s => {
              const on = activeSection === s.id;
              return (
                <button key={s.id} onClick={() => scrollTo(s.id)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, border: "none", background: on ? P_INDIGO : "transparent", cursor: "pointer", textAlign: "left", transition: "background 0.18s", fontFamily: "'Noto Sans', sans-serif" }}
                >
                  <div style={{ width: 3, height: 16, borderRadius: 2, background: on ? B_INDIGO : "#dddde8", flexShrink: 0, transition: "background 0.18s" }} />
                  <span style={{ fontSize: 12.5, fontWeight: on ? 700 : 400, color: on ? B_INDIGO : "#aaaabc", transition: "color 0.18s" }}>{s.label}</span>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#c0c0cc", marginBottom: 12 }}>Quick Links</div>
            {[{ label: "Edit Profile", path: "/profile" }, { label: "Notifications", path: "#" }, { label: "Raise a Grievance", path: "#" }].map(a => (
              <button key={a.label} onClick={() => a.path !== "#" && navigate(a.path)}
                style={{ display: "block", width: "100%", background: "none", border: "none", padding: "7px 10px", borderRadius: 8, fontSize: 12.5, color: "#8888a0", cursor: "pointer", textAlign: "left", fontFamily: "'Noto Sans', sans-serif", transition: "background 0.15s, color 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f0f0f8"; (e.currentTarget as HTMLElement).style.color = ACCENT_NAVY; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "#8888a0"; }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ApplicationDrawer app={drawerApp} onClose={() => setDrawerApp(null)} />
    </div>
  );
}
