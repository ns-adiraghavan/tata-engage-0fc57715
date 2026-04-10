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

// ─── Season flag — replace with: import { IS_PE_SEASON } from "../data/mockData"
// true  = ProEngage edition is open
// false = non-PE season (apply early, TVW opportunities, DIY)
const IS_PE_SEASON = true;

// ─── Is this a brand new volunteer? (0 projects, 0 history)
const IS_NEW_VOLUNTEER = false;

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
    hoursVolunteered: IS_NEW_VOLUNTEER ? 0 : 347,
    projectsApplied:  IS_NEW_VOLUNTEER ? 0 : 6,
    projectsCompleted:IS_NEW_VOLUNTEER ? 0 : 4,
    projectsDropped:  IS_NEW_VOLUNTEER ? 0 : 1,
    referrals:        IS_NEW_VOLUNTEER ? 0 : 3,
    badgesEarned:     IS_NEW_VOLUNTEER ? 0 : 7,
  },
  // Set to null to see the "no active project" / nudge state
  activeApplication: IS_NEW_VOLUNTEER ? null : {
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
  { id: "t1", title: "Tree Plantation Drive — Aarey Forest",         company: "Tata Motors",              date: "22 Sep 2025", mode: "In-person · Mumbai",  duration: "Half day", spotsLeft: 12, accentColor: B_TEAL,   pastel: P_TEAL   },
  { id: "t2", title: "Digital Literacy Workshop for Senior Citizens", company: "Tata Consultancy Services", date: "28 Sep 2025", mode: "Online · Pan-India",  duration: "3 hours",  spotsLeft: 45, accentColor: B_BLUE,   pastel: P_BLUE   },
  { id: "t3", title: "Healthcare Camp — Blood Donation Drive",        company: "Tata Steel",               date: "4 Oct 2025",  mode: "In-person · Pune",    duration: "Half day", spotsLeft: 8,  accentColor: B_RED,    pastel: P_RED    },
];

const DIY_ACTIVITIES = [
  { id: "d1", title: "Mentor a First-Generation College Student", desc: "1 hour/week for 4 weeks over video call. Set goals, share experience, open doors.",            theme: "Education",   effort: "Low",    accentColor: B_INDIGO, pastel: P_INDIGO },
  { id: "d2", title: "Teach Financial Literacy to Youth",         desc: "A 2-hour workshop at a local NGO or school. TSG DIY kit provides all materials needed.", theme: "Livelihoods", effort: "Medium", accentColor: B_BLUE,   pastel: P_BLUE   },
];

const PE_OPPORTUNITIES = [
  { id: "p1", title: "Build a Fundraising Dashboard for Child Rights NGO",  ngo: "Butterflies India",     skillArea: "Finance / Data",   duration: "3 months", mode: "Online",          closes: "15 Jul 2025", applicants: 14, match: 94, accentColor: B_BLUE,   pastel: P_BLUE   },
  { id: "p2", title: "Marketing Strategy for Women's Skilling Programme",   ngo: "Stree Mukti Sanghatna", skillArea: "Marketing",        duration: "4 months", mode: "Hybrid · Mumbai", closes: "20 Jul 2025", applicants: 9,  match: 89, accentColor: B_TEAL,   pastel: P_TEAL   },
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
  { id: "p1", title: "Website Redesign",              ngo: "Red Dot Foundation",   edition: "ProEngage 10", year: "2024", hours: 48, outcome: "Launched new donation portal — 60% uplift in online donations within 8 weeks of go-live.",    skills: ["UX", "Marketing"], cert: true  },
  { id: "p2", title: "Financial Literacy Curriculum", ngo: "SEWA",                 edition: "ProEngage 9",  year: "2024", hours: 72, outcome: "Trained 150 rural women entrepreneurs in bookkeeping and basic financial planning.",         skills: ["Finance", "Training"], cert: true  },
  { id: "p3", title: "Brand Strategy",                ngo: "Rhizome Cooperative",  edition: "ProEngage 8",  year: "2023", hours: 12, outcome: "Project paused due to personal reasons. Partial brand audit delivered to the NGO.",         skills: ["Marketing"],       cert: false },
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
  { id: "photos",  label: "Photos",   desc: "Gallery from TVW22, VolCon 2024 and ProEngage projects",          count: "247 items",   accentColor: B_INDIGO, pastel: P_INDIGO, photo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80" },
  { id: "videos",  label: "Videos",   desc: "Volunteer stories, impact films and event highlights",             count: "38 videos",   accentColor: B_RED,    pastel: P_RED,    photo: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80" },
  { id: "stories", label: "Stories",  desc: "Volunteer experiences and community impact narratives",            count: "94 stories",  accentColor: B_TEAL,   pastel: P_TEAL,   photo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80" },
  { id: "events",  label: "Events",   desc: "VolCon, Volympics and upcoming community gatherings",              count: "12 upcoming", accentColor: B_YELLOW, pastel: P_YELLOW, photo: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80" },
  { id: "emodule", label: "E-Module", desc: "ProEngage orientation, NGO readiness kit and dos and don'ts",     count: "5 modules",   accentColor: B_BLUE,   pastel: P_BLUE,   photo: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80" },
];

// Stat tile tooltip copy — what each number means and how to earn it
const STAT_TOOLTIPS: Record<string, string> = {
  "Hours Volunteered":   "Total hours logged across all TVW events and ProEngage projects. Grows as you complete projects and submit feedback.",
  "Projects Applied":    "Number of ProEngage applications you've submitted. You can apply to multiple projects each edition.",
  "Completed":           "Projects where both you and the NGO have submitted feedback. Completing projects unlocks your certificate.",
  "Dropped":             "Projects that ended early. These remain on your record — it's part of honest volunteering.",
  "Referred":            "Colleagues or family members who joined TataEngage via your referral link.",
  "Badges Earned":       "Badges are awarded for key milestones — completing a project, hitting 100 hours, TVW participation, and more.",
};

const SECTIONS = [
  { id: "snapshot",    label: "Snapshot"    },
  { id: "testimonial", label: "Testimonial" },
  { id: "activities",  label: "Activities"  },
  { id: "history",     label: "History"     },
  { id: "resources",   label: "Resources"   },
];

// ─── Shared style helpers ─────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e8e8f0",
  borderRadius: 14,
  padding: "20px 22px",
};

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
  value: number; suffix?: string; label: string;
  pastel: string; accentColor: string; delay: number; started: boolean;
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
      style={{
        background: isZero ? "#fafafa" : pastel,
        borderRadius: 14,
        padding: "20px 14px 16px",
        textAlign: "center",
        border: `1px solid ${isZero ? "#e8e8f0" : accentColor + "22"}`,
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: isZero ? "help" : "default",
        position: "relative",
      }}
      onMouseEnter={e => {
        if (!isZero) (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
        if (!isZero) (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${accentColor}22`;
        setShowTip(true);
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        setShowTip(false);
      }}
    >
      {/* Zero state pulse ring */}
      {isZero && (
        <div style={{
          position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)",
          width: 32, height: 32, borderRadius: "50%",
          border: `2px dashed ${accentColor}44`,
          animation: "pulse-ring 2s ease-in-out infinite",
        }} />
      )}

      <div style={{
        fontFamily: "'Noto Sans', sans-serif",
        fontSize: isZero ? 32 : 38,
        fontWeight: 900,
        lineHeight: 1,
        letterSpacing: "-2px",
        color: isZero ? "#ccccdd" : accentColor,
        position: "relative",
        zIndex: 1,
      }}>
        {n}{suffix}
      </div>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: isZero ? "#bbbbcc" : ACCENT_NAVY,
        marginTop: 8,
        textTransform: "uppercase",
        letterSpacing: "0.6px",
        lineHeight: 1.3,
      }}>
        {label}
      </div>

      {/* Tooltip */}
      {showTip && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: ACCENT_NAVY,
          color: "rgba(255,255,255,0.88)",
          fontSize: 12,
          lineHeight: 1.5,
          padding: "10px 14px",
          borderRadius: 9,
          width: 200,
          zIndex: 50,
          pointerEvents: "none",
          boxShadow: "0 4px 20px rgba(13,27,62,0.2)",
          textAlign: "left",
          fontWeight: 400,
        }}>
          {STAT_TOOLTIPS[label]}
          <div style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)", width: 10, height: 10, background: ACCENT_NAVY, clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
        </div>
      )}
    </div>
  );
}

// ─── Pill slicer nav ──────────────────────────────────────────────────────────
function Slicers({ options, active, onChange, accentColor = B_INDIGO }: {
  options: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  accentColor?: string;
}) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 22 }}>
      {options.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)} style={{
          padding: "6px 16px", borderRadius: 100,
          border: `1.5px solid ${active === o.id ? accentColor : "#dddde8"}`,
          background: active === o.id ? accentColor : "transparent",
          color: active === o.id ? "#fff" : "#666",
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
    Pending:   [P_YELLOW, "#9a6500"],
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
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 5 }}>{eyebrow}</div>
      <h2 style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 21, fontWeight: 900, color: ACCENT_NAVY, margin: 0, letterSpacing: -0.3 }}>{title}</h2>
    </div>
  );
}

// ─── Inline note — design refresh flag ───────────────────────────────────────
// NOTE FOR LOVABLE: The following sub-pages need full design refreshes to match
// the My Space design system (brand tokens, Noto Sans, card language, pastel
// accents). They are currently linked from this dashboard but their internal
// designs are out of sync:
//
//   - ActiveProjectManagementView.tsx   (/projects/active)
//   - ProjectFeedbackView.tsx           (/projects/feedback)
//   - CreateProjectView.tsx             (/projects/create)
//   - ProfileView.tsx                   (/profile)
//   - ProEngageView.tsx                 (/proengage)
//   - TVWHubView.tsx                    (/tvw)
//   - DisasterResponseView.tsx          (/disaster-response)
//   - DRAvailabilityForm.tsx            (/disaster-response/availability)
//
// All links to these pages are intentionally kept — the refresh is second-degree
// work to be done after this dashboard is signed off.

// ─── Drawers ──────────────────────────────────────────────────────────────────
type AppRecord = typeof HISTORY_APPLICATIONS[0];

function DrawerShell({ open, onClose, title, subtitle, accentTag, children }: {
  open: boolean; onClose: () => void;
  title: string; subtitle?: string; accentTag?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(13,27,62,0.3)", zIndex: 200, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.22s" }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 440,
        background: "#fff", zIndex: 201,
        boxShadow: "-6px 0 40px rgba(13,27,62,0.12)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
        fontFamily: "'Noto Sans', sans-serif", overflowY: "auto",
      }}>
        <div style={{ background: ACCENT_NAVY, padding: "24px 28px" }}>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 7, color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500, padding: "5px 12px", cursor: "pointer", marginBottom: 16 }}>
            ← Close
          </button>
          {accentTag && (
            <div style={{ display: "inline-block", background: `${B_YELLOW}22`, border: `1px solid ${B_YELLOW}44`, borderRadius: 100, padding: "3px 10px", fontSize: 10.5, fontWeight: 700, color: B_YELLOW, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 10 }}>
              {accentTag}
            </div>
          )}
          <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", marginTop: 5 }}>{subtitle}</div>}
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </>
  );
}

// Application detail drawer
function ApplicationDrawer({ app, onClose }: { app: AppRecord | null; onClose: () => void }) {
  return (
    <DrawerShell
      open={!!app}
      onClose={onClose}
      title={app?.project ?? ""}
      subtitle={app ? `${app.ngo} · ${app.skillArea}` : ""}
      accentTag={app ? `${app.type} · ${app.edition}` : ""}
    >
      {app && (
        <>
          <div style={{ padding: "24px 28px 0" }}>
            <div style={{ marginBottom: 4 }}><StatusBadge status={app.status} /></div>
          </div>
          <div style={{ padding: "20px 28px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 20 }}>Timeline</div>
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
                  <span style={{ fontSize: 12.5, color: "#8888a0", fontWeight: 400 }}>{k}</span>
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

// Project update drawer
function ProjectUpdateDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <DrawerShell open={open} onClose={() => { onClose(); setSubmitted(false); setText(""); }} title="Post a Project Update" subtitle={`${VOLUNTEER.activeApplication?.ngo} · ${VOLUNTEER.activeApplication?.edition}`} accentTag="Project Update">
      {submitted ? (
        <div style={{ padding: "40px 28px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: P_TEAL, border: `2px solid ${B_TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9l7 7L20 2" stroke={B_TEAL} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>Update posted</div>
          <div style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6 }}>Your update has been shared with TSG and your NGO partner at Uday Foundation.</div>
        </div>
      ) : (
        <div style={{ padding: "24px 28px" }}>
          <p style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6, marginBottom: 22 }}>
            Share a brief progress note with TSG and your NGO partner. This helps track the health of your project and surfaces your work to the team.
          </p>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>Update</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="What progress have you made this week? Any blockers or next steps?"
              rows={6}
              style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 10, padding: "12px 14px", fontSize: 13.5, fontFamily: "'Noto Sans', sans-serif", color: ACCENT_NAVY, resize: "vertical", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }}
              onFocus={e => (e.target.style.borderColor = B_INDIGO)}
              onBlur={e => (e.target.style.borderColor = "#e0e0e8")}
            />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>Attachment (optional)</label>
            <div style={{ border: "1.5px dashed #dddde8", borderRadius: 10, padding: "16px", textAlign: "center", fontSize: 13, color: "#aaaabc", cursor: "pointer" }}>
              Drop a file here or click to browse
            </div>
          </div>
          <button
            disabled={!text.trim()}
            onClick={() => setSubmitted(true)}
            style={{ width: "100%", background: text.trim() ? B_INDIGO : "#e0e0e8", color: text.trim() ? "#fff" : "#aaa", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, cursor: text.trim() ? "pointer" : "not-allowed", fontFamily: "'Noto Sans', sans-serif", transition: "background 0.2s" }}
          >
            Post Update
          </button>
        </div>
      )}
    </DrawerShell>
  );
}

// Volunteer feedback drawer
function FeedbackDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <DrawerShell open={open} onClose={() => { onClose(); setSubmitted(false); setRating(0); setText(""); }} title="Submit Feedback" subtitle={`${VOLUNTEER.activeApplication?.ngo} · ${VOLUNTEER.activeApplication?.edition}`} accentTag="Project Feedback">
      {submitted ? (
        <div style={{ padding: "40px 28px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: P_TEAL, border: `2px solid ${B_TEAL}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9l7 7L20 2" stroke={B_TEAL} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>Feedback submitted</div>
          <div style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6 }}>Thank you. Once the NGO also submits feedback, your certificate will be generated within 24 hours.</div>
        </div>
      ) : (
        <div style={{ padding: "24px 28px" }}>
          <p style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6, marginBottom: 24 }}>
            Your feedback helps TSG improve the ProEngage programme and unlock your certificate of completion. Both you and the NGO must submit before certificates are issued.
          </p>

          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 12 }}>Overall Experience</label>
            <div style={{ display: "flex", gap: 6 }}>
              {[1,2,3,4,5].map(i => (
                <span key={i}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i)}
                  style={{ fontSize: 32, cursor: "pointer", color: i <= (hoverRating || rating) ? B_YELLOW : "#e0e0e8", transition: "color 0.1s", lineHeight: 1 }}
                >★</span>
              ))}
            </div>
            {rating > 0 && (
              <div style={{ fontSize: 12.5, color: B_YELLOW, marginTop: 8, fontWeight: 600 }}>
                {["", "Needs improvement", "Below expectations", "Met expectations", "Above expectations", "Exceptional"][rating]}
              </div>
            )}
          </div>

          {[
            { label: "What went well?",           placeholder: "Describe what worked in this project." },
            { label: "What could be improved?",   placeholder: "Share constructive suggestions for TSG and the NGO." },
            { label: "Your key takeaway",          placeholder: "What did you learn or gain from this experience?" },
          ].map(q => (
            <div key={q.label} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>{q.label}</label>
              <textarea rows={3} placeholder={q.placeholder} style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 10, padding: "10px 14px", fontSize: 13.5, fontFamily: "'Noto Sans', sans-serif", color: ACCENT_NAVY, resize: "none", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }}
                onFocus={e => (e.target.style.borderColor = B_INDIGO)}
                onBlur={e => (e.target.style.borderColor = "#e0e0e8")}
              />
            </div>
          ))}

          <button
            disabled={rating === 0}
            onClick={() => setSubmitted(true)}
            style={{ width: "100%", background: rating > 0 ? B_INDIGO : "#e0e0e8", color: rating > 0 ? "#fff" : "#aaa", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, cursor: rating > 0 ? "pointer" : "not-allowed", fontFamily: "'Noto Sans', sans-serif", marginTop: 8, transition: "background 0.2s" }}
          >
            Submit Feedback
          </button>
        </div>
      )}
    </DrawerShell>
  );
}

// Grievance drawer
function GrievanceDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [category, setCategory] = useState("");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const categories = ["Communication issues with NGO", "Project scope changed unexpectedly", "Scheduling conflict", "Platform issue", "Other"];

  return (
    <DrawerShell open={open} onClose={() => { onClose(); setSubmitted(false); setCategory(""); setText(""); }} title="Raise a Grievance" subtitle="Your concern will be reviewed by the TSG Admin team" accentTag="Grievance">
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
          <p style={{ fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6, marginBottom: 24 }}>
            Grievances are reviewed in confidence by the TSG Admin team. You can raise only one open grievance per project at a time.
          </p>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 10 }}>Category</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {categories.map(c => (
                <label key={c} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13.5, color: category === c ? B_INDIGO : ACCENT_NAVY, fontWeight: category === c ? 600 : 400 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${category === c ? B_INDIGO : "#dddde8"}`, background: category === c ? B_INDIGO : "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }} onClick={() => setCategory(c)}>
                    {category === c && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  {c}
                </label>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#aaaabc", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 8 }}>Describe the issue</label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={5} placeholder="Provide as much detail as possible so the team can investigate effectively." style={{ width: "100%", border: "1.5px solid #e0e0e8", borderRadius: 10, padding: "12px 14px", fontSize: 13.5, fontFamily: "'Noto Sans', sans-serif", color: ACCENT_NAVY, resize: "none", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }}
              onFocus={e => (e.target.style.borderColor = B_INDIGO)}
              onBlur={e => (e.target.style.borderColor = "#e0e0e8")}
            />
          </div>
          <button
            disabled={!category || !text.trim()}
            onClick={() => setSubmitted(true)}
            style={{ width: "100%", background: (category && text.trim()) ? B_INDIGO : "#e0e0e8", color: (category && text.trim()) ? "#fff" : "#aaa", border: "none", borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700, cursor: (category && text.trim()) ? "pointer" : "not-allowed", fontFamily: "'Noto Sans', sans-serif", transition: "background 0.2s" }}
          >
            Submit Grievance
          </button>
        </div>
      )}
    </DrawerShell>
  );
}

// ─── Resource card — Programme Spotlight pattern ──────────────────────────────
function ResourceCard({ r }: { r: typeof RESOURCES[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: 14, overflow: "hidden", cursor: "pointer", transform: hovered ? "translateY(-4px)" : "translateY(0)", boxShadow: hovered ? `0 12px 32px ${r.accentColor}22` : "0 2px 8px rgba(13,27,62,0.05)", transition: "transform 0.22s, box-shadow 0.22s", border: "1px solid #e8e8f0" }}
    >
      <div style={{ position: "relative", height: 100, overflow: "hidden" }}>
        <img src={r.photo} alt={r.label} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.07)" : "scale(1)", transition: "transform 0.4s" }} />
        <div style={{ position: "absolute", inset: 0, background: `${r.accentColor}cc`, opacity: hovered ? 0.9 : 0.78, transition: "opacity 0.22s" }} />
        <div style={{ position: "absolute", bottom: 10, left: 12, fontSize: 15, fontWeight: 900, color: "#fff", letterSpacing: -0.3 }}>{r.label}</div>
      </div>
      <div style={{ background: r.pastel, padding: "12px 14px" }}>
        <div style={{ fontSize: 11.5, color: ACCENT_NAVY, lineHeight: 1.45, marginBottom: 7 }}>{r.desc}</div>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: r.accentColor, textTransform: "uppercase", letterSpacing: "0.8px", display: "flex", justifyContent: "space-between" }}>
          <span>{r.count}</span><span>→</span>
        </div>
      </div>
    </div>
  );
}

// ─── History filter dropdowns ─────────────────────────────────────────────────
function HistoryFilters({ edition, setEdition, year, setYear }: {
  edition: string; setEdition: (v: string) => void;
  year: string; setYear: (v: string) => void;
}) {
  const selectStyle: React.CSSProperties = {
    padding: "7px 32px 7px 12px",
    border: "1.5px solid #e0e0e8",
    borderRadius: 9,
    fontSize: 13,
    fontFamily: "'Noto Sans', sans-serif",
    color: ACCENT_NAVY,
    background: "#fff",
    cursor: "pointer",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23aaaabc' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
  };
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center" }}>
      <select value={edition} onChange={e => setEdition(e.target.value)} style={selectStyle}>
        {["All Editions", "ProEngage 11", "ProEngage 10", "ProEngage 9", "TVW 22", "TVW 21"].map(o => <option key={o}>{o}</option>)}
      </select>
      <select value={year} onChange={e => setYear(e.target.value)} style={selectStyle}>
        {["All Years", "2025", "2024", "2023"].map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsStarted(true); }, { threshold: 0.2 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  // PE season drives the activity default tab
  const activitySlicers = IS_PE_SEASON
    ? [{ id: "proengage", label: "My ProEngage Project" }, { id: "tvw", label: "Other Opportunities" }, { id: "diy", label: "DIY Activities" }]
    : [{ id: "tvw", label: "Volunteering Opportunities" }, { id: "diy", label: "DIY Activities" }, { id: "proengage", label: "Apply Early for ProEngage" }];
  const [activeActivity, setActiveActivity] = useState(IS_PE_SEASON ? "proengage" : "tvw");

  const historySlicers = [
    { id: "applications", label: "Applications" },
    { id: "projects",     label: "Projects"     },
    { id: "experience",   label: "Testimonials" },
    { id: "certificates", label: "Certificates" },
    { id: "feedback",     label: "Feedback"     },
  ];
  const [activeHistory, setActiveHistory] = useState("applications");
  const [editionFilter, setEditionFilter] = useState("All Editions");
  const [yearFilter,    setYearFilter]    = useState("All Years");

  const filteredApplications = HISTORY_APPLICATIONS.filter(a => {
    const edNum = editionFilter.split(" ").pop() ?? "";
    const eOk = editionFilter === "All Editions" || a.edition.includes(edNum);
    const yOk = yearFilter === "All Years" || a.year === yearFilter;
    return eOk && yOk;
  });

  // Drawer states
  const [drawerApp,     setDrawerApp]     = useState<AppRecord | null>(null);
  const [updateOpen,    setUpdateOpen]    = useState(false);
  const [feedbackOpen,  setFeedbackOpen]  = useState(false);
  const [grievanceOpen, setGrievanceOpen] = useState(false);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const hasActive = !!VOLUNTEER.activeApplication;

  return (
    <>
      {/* Pulse ring animation */}
      <style>{`
        @keyframes pulse-ring {
          0%   { transform: translateX(-50%) scale(1);   opacity: 0.6; }
          50%  { transform: translateX(-50%) scale(1.3); opacity: 0.2; }
          100% { transform: translateX(-50%) scale(1);   opacity: 0.6; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f8f9ff", paddingTop: 80, fontFamily: "'Noto Sans', sans-serif" }}>

        {/* ── Greeting bar ─────────────────────────────────────────────── */}
        <div style={{ background: ACCENT_NAVY, padding: "24px 56px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>My Space</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: -0.5, fontFamily: "'Noto Sans', sans-serif" }}>
              Welcome back, {VOLUNTEER.firstName}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
              {VOLUNTEER.designation} · {VOLUNTEER.company} · {VOLUNTEER.city}
            </div>
          </div>

          {hasActive ? (
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 20px", maxWidth: 360 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: B_TEAL, marginBottom: 5 }}>
                Active · {VOLUNTEER.activeApplication!.edition}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{VOLUNTEER.activeApplication!.title}</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{VOLUNTEER.activeApplication!.ngo} · Matched {VOLUNTEER.activeApplication!.matchDate}</div>
            </div>
          ) : IS_PE_SEASON ? (
            <div style={{ background: `${B_INDIGO}33`, border: `1px solid ${B_INDIGO}44`, borderRadius: 12, padding: "14px 20px", maxWidth: 360 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 5 }}>ProEngage Edition 11 · Open now</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", lineHeight: 1.4 }}>Applications close 15 July. Browse projects matched to your skills below.</div>
            </div>
          ) : (
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 20px", maxWidth: 360 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 5 }}>Next ProEngage Edition</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>Opens January 2026. In the meantime, explore TVW events and DIY activities.</div>
            </div>
          )}
        </div>

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto", padding: "40px 40px 100px", gap: 44 }}>

          {/* Main */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* ═══ 1. SNAPSHOT ════════════════════════════════════════════ */}
            <section id="snapshot" style={{ marginBottom: 52, scrollMarginTop: 108 }}>
              <SectionHeading eyebrow="Your impact, at a glance" title="Engagement Snapshot" />

              {IS_NEW_VOLUNTEER && (
                <div style={{ background: P_INDIGO, border: `1px solid ${B_INDIGO}22`, borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontSize: 13.5, color: B_INDIGO, lineHeight: 1.6 }}>
                  You're just getting started. Hover over any number below to see how you can earn it.
                </div>
              )}

              <div ref={statsRef} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
                <StatTile value={VOLUNTEER.stats.hoursVolunteered} suffix=" hrs" label="Hours Volunteered" pastel={P_INDIGO} accentColor={B_INDIGO} delay={0}   started={statsStarted} />
                <StatTile value={VOLUNTEER.stats.projectsApplied}                label="Projects Applied"   pastel={P_BLUE}   accentColor={B_BLUE}   delay={100} started={statsStarted} />
                <StatTile value={VOLUNTEER.stats.projectsCompleted}              label="Completed"          pastel={P_TEAL}   accentColor={B_TEAL}   delay={200} started={statsStarted} />
                <StatTile value={VOLUNTEER.stats.projectsDropped}                label="Dropped"            pastel={P_RED}    accentColor={B_RED}    delay={300} started={statsStarted} />
                <StatTile value={VOLUNTEER.stats.referrals}                      label="Referred"           pastel={P_YELLOW} accentColor={B_YELLOW} delay={400} started={statsStarted} />
                <StatTile value={VOLUNTEER.stats.badgesEarned}                   label="Badges Earned"      pastel={P_INDIGO} accentColor={B_INDIGO} delay={500} started={statsStarted} />
              </div>

              <div style={{ ...card, marginBottom: 10 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 12 }}>Skills You Bring</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {VOLUNTEER.skills.map(s    => <span key={s} style={{ background: P_INDIGO, color: B_INDIGO, fontSize: 12.5, fontWeight: 600, padding: "4px 12px", borderRadius: 100 }}>{s}</span>)}
                  {VOLUNTEER.interests.map(s => <span key={s} style={{ background: P_TEAL,   color: B_TEAL,   fontSize: 12.5, fontWeight: 600, padding: "4px 12px", borderRadius: 100 }}>{s}</span>)}
                </div>
              </div>

              {!IS_NEW_VOLUNTEER && (
                <div style={{ ...card }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaaabc", marginBottom: 14 }}>Badges Earned</div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {BADGES.map(b => (
                      <div key={b.id} title={`${b.name} — ${b.desc} (${b.earned})`}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "default", transition: "transform 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                      >
                        <div style={{ width: 42, height: 42, borderRadius: "50%", background: b.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 11, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>{b.symbol}</span>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, color: "#6b6b7a", textAlign: "center", lineHeight: 1.2, maxWidth: 52 }}>{b.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {IS_NEW_VOLUNTEER && (
                <div style={{ ...card, borderStyle: "dashed" }}>
                  <div style={{ fontSize: 13, color: "#aaaabc", textAlign: "center", padding: "8px 0" }}>Badges appear here as you complete projects, participate in TVW, and hit volunteering milestones.</div>
                </div>
              )}
            </section>

            {/* ═══ 2. TESTIMONIAL ═════════════════════════════════════════ */}
            <section id="testimonial" style={{ marginBottom: 52, scrollMarginTop: 108 }}>
              <SectionHeading eyebrow="Words from the field" title="Testimonial" />

              {IS_NEW_VOLUNTEER ? (
                <div style={{ ...card, borderStyle: "dashed", textAlign: "center", padding: "40px 32px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>Your testimonial will appear here</div>
                  <div style={{ fontSize: 13.5, color: "#8888a0", lineHeight: 1.65, maxWidth: 400, margin: "0 auto" }}>
                    Once you complete a ProEngage project, your NGO partner can write a testimonial about your work. It'll live here for you and future applicants to see.
                  </div>
                </div>
              ) : (
                <div style={{ background: ACCENT_NAVY, borderRadius: 14, padding: "36px 40px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -28, left: 24, fontFamily: "Georgia, serif", fontSize: 220, color: "rgba(255,255,255,0.04)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>"</div>
                  <div style={{ display: "inline-block", background: `${B_YELLOW}22`, border: `1px solid ${B_YELLOW}44`, borderRadius: 100, padding: "3px 11px", fontSize: 10.5, fontWeight: 700, color: B_YELLOW, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 20 }}>
                    {TESTIMONIAL.edition}
                  </div>
                  <blockquote style={{ fontSize: 17, lineHeight: 1.72, color: "rgba(255,255,255,0.88)", fontStyle: "italic", fontWeight: 300, margin: "0 0 28px", position: "relative", zIndex: 1 }}>
                    "{TESTIMONIAL.quote}"
                  </blockquote>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: TESTIMONIAL.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                      {TESTIMONIAL.avatarInitials}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{TESTIMONIAL.author}</div>
                      <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{TESTIMONIAL.role}</div>
                    </div>
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.28)", lineHeight: 1.4 }}>{TESTIMONIAL.project}</div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* ═══ 3. ACTIVITIES ══════════════════════════════════════════ */}
            <section id="activities" style={{ marginBottom: 52, scrollMarginTop: 108 }}>
              <SectionHeading
                eyebrow={IS_PE_SEASON ? "ProEngage Edition 11 · Open · Closes 15 Jul 2025" : "Non-ProEngage season · Next edition opens Jan 2026"}
                title="My Activities"
              />
              <Slicers options={activitySlicers} active={activeActivity} onChange={setActiveActivity} accentColor={B_INDIGO} />

              {/* ── ProEngage tab ──────────────────────────────────── */}
              {activeActivity === "proengage" && (
                <div>
                  {IS_PE_SEASON ? (
                    hasActive ? (
                      /* Active project — management cards */
                      <>
                        <div style={{ background: P_TEAL, border: `1px solid ${B_TEAL}33`, borderRadius: 12, padding: "16px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: B_TEAL, flexShrink: 0, boxShadow: `0 0 0 4px ${B_TEAL}2a` }} />
                          <div>
                            <div style={{ fontSize: 10.5, fontWeight: 700, color: B_TEAL, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 2 }}>Matched · {VOLUNTEER.activeApplication!.edition}</div>
                            <div style={{ fontSize: 14.5, fontWeight: 700, color: ACCENT_NAVY }}>{VOLUNTEER.activeApplication!.title}</div>
                            <div style={{ fontSize: 12.5, color: "#6b6b7a", marginTop: 2 }}>{VOLUNTEER.activeApplication!.ngo} · Matched {VOLUNTEER.activeApplication!.matchDate}</div>
                          </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          {[
                            { label: "Post a Project Update", desc: "Share progress with TSG and your NGO partner.", color: B_INDIGO, pastel: P_INDIGO, action: () => setUpdateOpen(true),   disabled: false },
                            { label: "Access E-Module",        desc: "Orientation, roles and responsibilities.",      color: B_BLUE,   pastel: P_BLUE,   action: () => {},                  disabled: false },
                            { label: "Submit Feedback",        desc: "Rate your experience and share learnings.",     color: B_TEAL,   pastel: P_TEAL,   action: () => setFeedbackOpen(true), disabled: false },
                            { label: "Download Certificate",   desc: "Available once both sides submit feedback.",    color: "#bbb",   pastel: "#f8f8fc", action: () => {},                  disabled: true  },
                          ].map(a => (
                            <button key={a.label}
                              disabled={a.disabled}
                              onClick={a.action}
                              style={{ background: a.pastel, border: `1px solid ${a.disabled ? "#e8e8f0" : a.color + "22"}`, borderRadius: 12, padding: "18px", textAlign: "left", cursor: a.disabled ? "not-allowed" : "pointer", opacity: a.disabled ? 0.5 : 1, transition: "transform 0.18s, box-shadow 0.18s", fontFamily: "'Noto Sans', sans-serif" }}
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
                      </>
                    ) : (
                      /* PE season, no active project — nudge to apply */
                      <>
                        <div style={{ background: P_INDIGO, border: `1px solid ${B_INDIGO}22`, borderRadius: 12, padding: "16px 18px", marginBottom: 18 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: B_INDIGO, marginBottom: 4 }}>Applications close 15 July 2025</div>
                          <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>ProEngage Edition 11 is open. Apply to up to 3 projects — the first NGO that selects you gets to work with you.</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {PE_OPPORTUNITIES.map(p => (
                            <div key={p.id}
                              style={{ ...card, display: "flex", gap: 14, cursor: "pointer", transition: "box-shadow 0.18s, transform 0.18s", padding: "16px 20px" }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${p.accentColor}18`; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                            >
                              <div style={{ width: 3, borderRadius: 2, background: p.accentColor, flexShrink: 0, alignSelf: "stretch" }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                                  <span style={{ background: p.pastel, color: p.accentColor, fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 100 }}>{p.match}% match</span>
                                  <span style={{ fontSize: 11.5, color: "#aaaabc" }}>{p.skillArea}</span>
                                </div>
                                <div style={{ fontWeight: 700, fontSize: 14, color: ACCENT_NAVY }}>{p.title}</div>
                                <div style={{ fontSize: 12.5, color: "#8888a0", marginTop: 3 }}>{p.ngo} · {p.mode} · {p.duration} · Closes {p.closes}</div>
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", flexShrink: 0 }}>
                                <span style={{ fontSize: 11.5, color: "#aaaabc" }}>{p.applicants} applicants</span>
                                <button style={{ background: p.accentColor, color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Apply</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => navigate("/proengage")} style={{ marginTop: 14, background: "none", border: "none", fontSize: 13.5, color: B_INDIGO, fontWeight: 600, cursor: "pointer", padding: 0 }}>
                          Browse all ProEngage projects →
                        </button>
                      </>
                    )
                  ) : (
                    /* Non-PE season — apply early prompt */
                    <div style={{ ...card, textAlign: "center", padding: "36px 32px" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>ProEngage applications open in January 2026</div>
                      <div style={{ fontSize: 13.5, color: "#8888a0", lineHeight: 1.65, maxWidth: 380, margin: "0 auto 20px" }}>
                        The next edition isn't open yet, but you can register your interest early and be first to know when projects are listed.
                      </div>
                      <button style={{ background: B_INDIGO, color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans', sans-serif" }}>
                        Register Early Interest
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── TVW / Opportunities tab ────────────────────────── */}
              {activeActivity === "tvw" && (
                <div>
                  <p style={{ fontSize: 13.5, color: "#6b6b7a", marginBottom: 18, lineHeight: 1.6 }}>
                    {IS_PE_SEASON
                      ? "Events curated by Tata companies during TVW 22 — September to October 2025."
                      : "Volunteering opportunities available year-round, including TVW events and community initiatives."}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {TVW_OPPORTUNITIES.map(ev => (
                      <div key={ev.id}
                        style={{ ...card, display: "flex", gap: 16, alignItems: "center", cursor: "pointer", transition: "box-shadow 0.18s, transform 0.18s", padding: "16px 20px" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(13,27,62,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                      >
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: ev.pastel, border: `1px solid ${ev.accentColor}22`, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: ACCENT_NAVY }}>{ev.title}</div>
                          <div style={{ fontSize: 12.5, color: "#8888a0", marginTop: 3 }}>{ev.company} · {ev.date} · {ev.mode} · {ev.duration}</div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: ev.spotsLeft < 10 ? B_RED : B_TEAL, marginBottom: 6 }}>{ev.spotsLeft} spots left</div>
                          <button style={{ background: ev.accentColor, color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Register</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate("/tvw")} style={{ marginTop: 14, background: "none", border: "none", fontSize: 13.5, color: B_INDIGO, fontWeight: 600, cursor: "pointer", padding: 0 }}>
                    View all opportunities →
                  </button>
                </div>
              )}

              {/* ── DIY tab ───────────────────────────────────────── */}
              {activeActivity === "diy" && (
                <div>
                  <p style={{ fontSize: 13.5, color: "#6b6b7a", marginBottom: 18, lineHeight: 1.6 }}>
                    Organise your own activity with colleagues or family. Use the TSG DIY kit available in the Resource Library below.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    {DIY_ACTIVITIES.map(a => (
                      <div key={a.id}
                        style={{ background: a.pastel, border: "1px solid #e8e8f0", borderRadius: 12, padding: "20px", cursor: "pointer", transition: "transform 0.18s, box-shadow 0.18s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${a.accentColor}18`; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                      >
                        <span style={{ display: "inline-block", background: a.accentColor, color: "#fff", fontSize: 10.5, fontWeight: 700, padding: "2px 9px", borderRadius: 100, textTransform: "uppercase", marginBottom: 10, letterSpacing: "0.3px" }}>
                          {a.theme} · {a.effort} effort
                        </span>
                        <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 7, lineHeight: 1.3 }}>{a.title}</div>
                        <div style={{ fontSize: 13, color: "#555", lineHeight: 1.55 }}>{a.desc}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ ...card, fontSize: 13.5, color: "#6b6b7a", lineHeight: 1.6 }}>
                    Have your own idea?{" "}
                    <span style={{ color: B_INDIGO, fontWeight: 600, cursor: "pointer" }}>Create a DIY activity</span>
                    {" "}and invite colleagues and family to join.
                  </div>
                </div>
              )}

              {/* Refer + Share */}
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                {[
                  { label: "Refer a Colleague or Family Member", color: B_INDIGO, pastel: P_INDIGO },
                  { label: "Share Your Story",                   color: B_BLUE,   pastel: P_BLUE   },
                ].map(btn => (
                  <button key={btn.label}
                    style={{ flex: 1, background: btn.pastel, border: `1.5px solid ${btn.color}22`, borderRadius: 10, padding: "13px 16px", fontSize: 13.5, fontWeight: 600, color: btn.color, cursor: "pointer", transition: "border-color 0.18s, transform 0.18s", fontFamily: "'Noto Sans', sans-serif" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = btn.color; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${btn.color}22`; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </section>

            {/* ═══ 4. HISTORY ═════════════════════════════════════════════ */}
            <section id="history" style={{ marginBottom: 52, scrollMarginTop: 108 }}>
              <SectionHeading eyebrow="Your volunteering trail" title="My History" />

              {IS_NEW_VOLUNTEER ? (
                <div style={{ ...card, borderStyle: "dashed", textAlign: "center", padding: "40px 32px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 8 }}>No history yet</div>
                  <div style={{ fontSize: 13.5, color: "#8888a0", lineHeight: 1.65, maxWidth: 360, margin: "0 auto" }}>
                    Your applications, completed projects, certificates, and feedback will all appear here as you volunteer.
                  </div>
                </div>
              ) : (
                <>
                  <Slicers options={historySlicers} active={activeHistory} onChange={setActiveHistory} accentColor={B_BLUE} />

                  {["applications", "projects", "experience", "feedback"].includes(activeHistory) && (
                    <HistoryFilters edition={editionFilter} setEdition={setEditionFilter} year={yearFilter} setYear={setYearFilter} />
                  )}

                  {activeHistory === "applications" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {filteredApplications.map(a => (
                        <div key={a.id} onClick={() => setDrawerApp(a)}
                          style={{ ...card, display: "flex", gap: 14, alignItems: "center", cursor: "pointer", transition: "box-shadow 0.15s, transform 0.15s", padding: "13px 18px" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(13,27,62,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateX(2px)"; }}
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
                        <div style={{ ...card, textAlign: "center", padding: "28px", color: "#aaaabc", fontSize: 13.5 }}>No applications match this filter.</div>
                      )}
                    </div>
                  )}

                  {activeHistory === "projects" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {HISTORY_PROJECTS.map(p => (
                        <div key={p.id} style={{ ...card }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                            <div>
                              <div style={{ fontSize: 14.5, fontWeight: 700, color: ACCENT_NAVY }}>{p.title}</div>
                              <div style={{ fontSize: 12.5, color: "#8888a0", marginTop: 3 }}>{p.ngo} · {p.edition} · {p.hours} hrs</div>
                            </div>
                            {p.cert && (
                              <button style={{ background: P_INDIGO, color: B_INDIGO, border: "none", borderRadius: 8, padding: "6px 13px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                                Download Certificate
                              </button>
                            )}
                          </div>
                          <div style={{ background: p.cert ? P_TEAL : P_RED, borderRadius: 9, padding: "11px 14px", fontSize: 13, color: p.cert ? "#064e3b" : "#7f1d1d", borderLeft: `3px solid ${p.cert ? B_TEAL : B_RED}`, lineHeight: 1.55 }}>
                            {p.outcome}
                          </div>
                          <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
                            {p.skills.map(s => <span key={s} style={{ background: P_INDIGO, color: B_INDIGO, fontSize: 11.5, fontWeight: 600, padding: "3px 10px", borderRadius: 100 }}>{s}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeHistory === "experience" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ background: ACCENT_NAVY, borderRadius: 14, padding: "28px 32px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: -20, left: 20, fontFamily: "Georgia, serif", fontSize: 140, color: "rgba(255,255,255,0.04)", lineHeight: 1, pointerEvents: "none" }}>"</div>
                        <div style={{ display: "inline-block", background: `${B_YELLOW}22`, border: `1px solid ${B_YELLOW}44`, borderRadius: 100, padding: "3px 10px", fontSize: 10.5, fontWeight: 700, color: B_YELLOW, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          ProEngage Edition 11 · Pending approval
                        </div>
                        <blockquote style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.85)", fontStyle: "italic", fontWeight: 300, margin: "0 0 18px", position: "relative", zIndex: 1 }}>
                          "{TESTIMONIAL.quote}"
                        </blockquote>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>— {TESTIMONIAL.author}, {TESTIMONIAL.role}</div>
                      </div>
                      <div style={{ ...card, fontSize: 13.5, color: "#8888a0", lineHeight: 1.6 }}>
                        Testimonials are written reflections on your project. They appear here once approved by the TSG Admin team. You can submit your own from your active project page.
                      </div>
                    </div>
                  )}

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

                  {activeHistory === "feedback" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {HISTORY_PROJECTS.filter(p => p.cert).map(p => (
                        <div key={p.id} style={{ ...card }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: ACCENT_NAVY }}>{p.title}</div>
                              <div style={{ fontSize: 12.5, color: "#8888a0", marginTop: 3 }}>{p.ngo} · {p.edition}</div>
                            </div>
                            <span style={{ background: P_TEAL, color: B_TEAL, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, whiteSpace: "nowrap" }}>Submitted</span>
                          </div>
                          <div style={{ marginTop: 10, display: "flex", gap: 2 }}>
                            {[1,2,3,4,5].map(i => <span key={i} style={{ color: B_YELLOW, fontSize: 20, lineHeight: 1 }}>★</span>)}
                          </div>
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

            {/* ═══ 5. RESOURCES ═══════════════════════════════════════════ */}
            <section id="resources" style={{ scrollMarginTop: 108 }}>
              <SectionHeading eyebrow="Learning and inspiration" title="Resource Library" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                {RESOURCES.map(r => <ResourceCard key={r.id} r={r} />)}
              </div>
            </section>

          </div>

          {/* Right rail */}
          <div style={{ width: 148, flexShrink: 0, position: "sticky", top: 108, alignSelf: "flex-start" }}>
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
              {[
                { label: "Edit Profile",      action: () => navigate("/profile")      },
                { label: "Raise a Grievance", action: () => setGrievanceOpen(true)   },
              ].map(a => (
                <button key={a.label} onClick={a.action}
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
      </div>

      {/* Drawers */}
      <ApplicationDrawer  app={drawerApp}   onClose={() => setDrawerApp(null)}     />
      <ProjectUpdateDrawer open={updateOpen}  onClose={() => setUpdateOpen(false)}   />
      <FeedbackDrawer      open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <GrievanceDrawer     open={grievanceOpen} onClose={() => setGrievanceOpen(false)} />
    </>
  );
}
