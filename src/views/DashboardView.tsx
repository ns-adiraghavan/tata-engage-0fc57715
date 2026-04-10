import { useState, useEffect, useRef } from "react";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { IS_PE_SEASON, PRIYA_SHARMA, TVW_EVENTS, PROENGAGE_PROJECTS, MOCK_APPLICANTS, VOLUNTEER_CERTIFICATES } from "@/data/mockData";

// ─── Mock data — grounded in real Tata Engage programme details ──────────────
const VOLUNTEER = {
  firstName: "Priya",
  lastName: "Sharma",
  company: "Tata Consultancy Services",
  designation: "Senior Product Manager",
  city: "Mumbai",
  avatarInitials: "PS",
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
    status: "Matched",
    matchDate: "12 Mar 2025",
    edition: "ProEngage Edition 11",
    skillArea: "Marketing",
  },
};

const TESTIMONIAL = {
  quote:
    "Priya brought exceptional clarity to our fundraising strategy. Within eight weeks she redesigned our donor communications and helped us raise 40% more than our previous quarter. Her Finance and Marketing expertise, combined with genuine empathy, made her an invaluable part of our team.",
  author: "Rekha Iyer",
  role: "Executive Director, Uday Foundation",
  type: "NGO Partner",
  project: "Digital Marketing Strategy for Livelihood NGO",
  edition: "ProEngage 11",
  avatar: "RI",
  avatarColor: "#c14d00",
};

const TVW_OPPORTUNITIES = [
  {
    id: "t1",
    title: "Tree Plantation Drive — Aarey Forest",
    company: "Tata Motors",
    date: "22 Sep 2025",
    mode: "In-person",
    location: "Mumbai",
    duration: "Half day",
    theme: "Environment",
    spotsLeft: 12,
    color: "#0d7c52",
  },
  {
    id: "t2",
    title: "Digital Literacy Workshop for Senior Citizens",
    company: "Tata Consultancy Services",
    date: "28 Sep 2025",
    mode: "Online",
    location: "Pan-India",
    duration: "3 hours",
    theme: "Education",
    spotsLeft: 45,
    color: "#0046e6",
  },
  {
    id: "t3",
    title: "Healthcare Camp — Blood Donation Drive",
    company: "Tata Steel",
    date: "4 Oct 2025",
    mode: "In-person",
    location: "Pune",
    duration: "Half day",
    theme: "Health",
    spotsLeft: 8,
    color: "#b91c1c",
  },
];

const DIY_ACTIVITIES = [
  {
    id: "d1",
    title: "Mentor a First-Generation College Student",
    desc: "Commit 1 hour/week for 4 weeks over video call",
    theme: "Education",
    effort: "Low",
    color: "#5b21b6",
  },
  {
    id: "d2",
    title: "Teach Financial Literacy to Youth",
    desc: "Run a 2-hour workshop at a local NGO or school",
    theme: "Livelihoods",
    effort: "Medium",
    color: "#c14d00",
  },
];

const PE_OPPORTUNITIES = [
  {
    id: "p1",
    title: "Build a Fundraising Dashboard for Child Rights NGO",
    ngo: "Butterflies India",
    skillArea: "Finance / Data",
    duration: "3 months",
    mode: "Online",
    closes: "15 Jul 2025",
    applicants: 14,
    match: 94,
    color: "#0046e6",
  },
  {
    id: "p2",
    title: "Marketing Strategy for Women's Skilling Programme",
    ngo: "Stree Mukti Sanghatna",
    skillArea: "Marketing",
    duration: "4 months",
    mode: "Hybrid · Mumbai",
    closes: "20 Jul 2025",
    applicants: 9,
    match: 89,
    color: "#0d7c52",
  },
  {
    id: "p3",
    title: "Product Roadmap for Disability Employment Platform",
    ngo: "Samarthanam Trust",
    skillArea: "Product Strategy",
    duration: "6 months",
    mode: "Online",
    closes: "30 Jul 2025",
    applicants: 6,
    match: 97,
    color: "#5b21b6",
  },
];

const HISTORY_APPLICATIONS = [
  { id: "a1", project: "Digital Marketing Strategy — Uday Foundation", edition: "ProEngage 11", status: "Matched", date: "10 Mar 2025", type: "ProEngage" },
  { id: "a2", project: "Website Redesign — Red Dot Foundation", edition: "ProEngage 10", status: "Completed", date: "Aug 2024", type: "ProEngage" },
  { id: "a3", project: "Aarey Tree Plantation Drive", edition: "TVW 22 · Sep 2024", status: "Completed", date: "14 Sep 2024", type: "TVW" },
  { id: "a4", project: "Financial Literacy for Rural Women — SEWA", edition: "ProEngage 9", status: "Completed", date: "Feb 2024", type: "ProEngage" },
  { id: "a5", project: "Blood Donation Drive — Tata Steel", edition: "TVW 21 · Mar 2024", status: "Completed", date: "22 Mar 2024", type: "TVW" },
  { id: "a6", project: "Brand Strategy — Rhizome Cooperative", edition: "ProEngage 8", status: "Dropped", date: "Sep 2023", type: "ProEngage" },
];

const HISTORY_PROJECTS = [
  { id: "p1", title: "Website Redesign", ngo: "Red Dot Foundation", edition: "ProEngage 10", hours: 48, outcome: "Launched new donation portal — 60% uplift in online donations", skills: ["UX", "Marketing"], cert: true },
  { id: "p2", title: "Financial Literacy Curriculum", ngo: "SEWA", edition: "ProEngage 9", hours: 72, outcome: "Trained 150 rural women entrepreneurs in basic bookkeeping", skills: ["Finance", "Training"], cert: true },
  { id: "p3", title: "Brand Strategy", ngo: "Rhizome Cooperative", edition: "ProEngage 8", hours: 12, outcome: "Project paused — personal reasons", skills: ["Marketing"], cert: false },
];

const BADGES = [
  { id: "b1", name: "First Step", icon: "🌱", desc: "First volunteering activity", earned: "Mar 2023" },
  { id: "b2", name: "ProEngager", icon: "⚡", desc: "Completed first ProEngage project", earned: "Sep 2023" },
  { id: "b3", name: "Impact Maker", icon: "🎯", desc: "100+ hours volunteered", earned: "Feb 2024" },
  { id: "b4", name: "Connector", icon: "🔗", desc: "Referred 3 volunteers", earned: "Apr 2024" },
  { id: "b5", name: "TVW Champion", icon: "🏆", desc: "Participated in 3 TVW editions", earned: "Sep 2024" },
  { id: "b6", name: "Repeat Hero", icon: "🌟", desc: "Completed 3 ProEngage projects", earned: "Mar 2025" },
  { id: "b7", name: "300 Club", icon: "💫", desc: "300+ volunteering hours", earned: "Mar 2025" },
];

const RESOURCE_SECTIONS = [
  { id: "photos", label: "Photos", icon: "📷", desc: "Gallery from TVW22, VolCon 2024 & ProEngage projects", count: "247 items", color: "#eef2ff" },
  { id: "videos", label: "Videos", icon: "🎥", desc: "Volunteer stories, impact films & event highlights", count: "38 videos", color: "#fff0e6" },
  { id: "stories", label: "Stories", icon: "📖", desc: "Volunteer experiences and community impact narratives", count: "94 stories", color: "#e6f5ee" },
  { id: "events", label: "Events", icon: "📅", desc: "VolCon, Volympics & upcoming community events", count: "12 upcoming", color: "#fdf4ff" },
  { id: "emodule", label: "E-Module", icon: "🎓", desc: "ProEngage orientation, dos & don'ts, NGO readiness kit", count: "5 modules", color: "#ecfeff" },
];

// ─── Section IDs for the right-rail tracker ─────────────────────────────────
const SECTIONS = [
  { id: "engagement",  label: "Engagement" },
  { id: "testimonial", label: "Testimonial" },
  { id: "activities",  label: "My Activities" },
  { id: "history",     label: "My History" },
  { id: "resources",   label: "Resources" },
];

// ─── Stat counter animation hook ─────────────────────────────────────────────
function useCountUp(target: number, duration = 1200, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

// ─── Individual animated stat ─────────────────────────────────────────────────
function AnimatedStat({ value, label, suffix = "", delay = 0, started }: {
  value: number; label: string; suffix?: string; delay?: number; started: boolean;
}) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (started) {
      const t = setTimeout(() => setActive(true), delay);
      return () => clearTimeout(t);
    }
  }, [started, delay]);
  const displayed = useCountUp(value, 1000, active);
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e8e8f0",
      borderRadius: 16,
      padding: "20px 16px",
      textAlign: "center",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,53,128,0.1)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <div style={{
        fontFamily: "'Georgia', serif",
        fontSize: 36,
        fontWeight: 700,
        color: ACCENT_NAVY,
        lineHeight: 1,
        letterSpacing: -1,
      }}>
        {displayed}{suffix}
      </div>
      <div style={{ fontSize: 11.5, color: "#6b6b7a", marginTop: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.6px" }}>
        {label}
      </div>
    </div>
  );
}

// ─── Pill / slicer nav ────────────────────────────────────────────────────────
function SlicerPills({ options, active, onChange, color = TATA_CYAN }: {
  options: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  color?: string;
}) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
      {options.map(o => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          style={{
            padding: "7px 16px",
            borderRadius: 100,
            border: `1.5px solid ${active === o.id ? color : "#e0e0e8"}`,
            background: active === o.id ? color : "#fff",
            color: active === o.id ? "#fff" : "#444",
            fontSize: 13,
            fontWeight: active === o.id ? 600 : 400,
            cursor: "pointer",
            transition: "all 0.18s",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Matched:   { bg: "#e6f5ee", color: "#0d7c52" },
    Completed: { bg: "#eef2ff", color: "#0046e6" },
    Dropped:   { bg: "#fef2f2", color: "#b91c1c" },
    Pending:   { bg: "#fff7ed", color: "#c2410c" },
    Applied:   { bg: "#f3f0ff", color: "#5b21b6" },
  };
  const style = map[status] || { bg: "#f0f0f0", color: "#555" };
  return (
    <span style={{
      background: style.bg, color: style.color,
      fontSize: 11, fontWeight: 700, padding: "3px 9px",
      borderRadius: 100, letterSpacing: "0.3px",
    }}>
      {status}
    </span>
  );
}

// ─── Section wrapper with scroll target ──────────────────────────────────────
function Section({ id, children, style = {} }: { id: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ marginBottom: 56, scrollMarginTop: 100, ...style }}>
      {children}
    </section>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#9999aa", marginBottom: 4 }}>
        {eyebrow}
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: ACCENT_NAVY, margin: 0, letterSpacing: -0.4 }}>
        {title}
      </h2>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DashboardView() {
  const navigate = useAppNavigate();
  const [activeSection, setActiveSection] = useState("engagement");
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Activity slicers
  const activityOptions = IS_PE_SEASON
    ? [
        { id: "opportunities", label: "TVW Opportunities" },
        { id: "diy", label: "DIY Activities" },
        { id: "proengage", label: "My ProEngage Project" },
      ]
    : [
        { id: "opportunities", label: "View Opportunities" },
        { id: "diy", label: "DIY Activities" },
        { id: "proengage", label: "Apply for ProEngage" },
      ];
  const [activeActivity, setActiveActivity] = useState(activityOptions[2].id);

  // History slicers
  const historyOptions = [
    { id: "applications", label: "Applications" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "My Experience" },
    { id: "certificates", label: "Certificates" },
    { id: "feedback", label: "Feedback" },
  ];
  const [activeHistory, setActiveHistory] = useState("applications");

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const offsets = SECTIONS.map(s => {
        const el = document.getElementById(s.id);
        if (!el) return { id: s.id, top: Infinity };
        return { id: s.id, top: Math.abs(el.getBoundingClientRect().top - 120) };
      });
      const nearest = offsets.reduce((a, b) => (a.top < b.top ? a : b));
      setActiveSection(nearest.id);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Stats intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsStarted(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #f8faff 0%, #ffffff 50%, #f0f4ff 100%)",
      paddingTop: 80,
      fontFamily: "'Noto Sans', sans-serif",
    }}>
      {/* ── Top greeting bar ─────────────────────────────────────────────── */}
      <div style={{
        background: ACCENT_NAVY,
        color: "#fff",
        padding: "24px 56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
      }}>
        <div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>
            My Space
          </div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>
            Welcome back, {VOLUNTEER.firstName} 👋
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>
            {VOLUNTEER.designation} · {VOLUNTEER.company} · {VOLUNTEER.city}
          </div>
        </div>
        {/* Active project pill */}
        {VOLUNTEER.activeApplication && (
          <div style={{
            background: "rgba(0,180,216,0.15)",
            border: "1px solid rgba(0,180,216,0.3)",
            borderRadius: 12,
            padding: "12px 18px",
            maxWidth: 340,
          }}>
            <div style={{ fontSize: 10, color: TATA_CYAN, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 }}>
              🟢 Active · {VOLUNTEER.activeApplication.edition}
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>
              {VOLUNTEER.activeApplication.title}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>
              {VOLUNTEER.activeApplication.ngo} · {VOLUNTEER.activeApplication.status}
            </div>
          </div>
        )}
      </div>

      {/* ── Body: content + right rail ──────────────────────────────────── */}
      <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto", padding: "40px 40px 80px", gap: 40 }}>

        {/* ── Main content ──────────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ══ 1. ENGAGEMENT SNAPSHOTS ══════════════════════════════════ */}
          <Section id="engagement">
            <SectionHeading eyebrow="Your impact, at a glance" title="Engagement Snapshot" />
            <div ref={statsRef} style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              marginBottom: 20,
            }}>
              <AnimatedStat value={VOLUNTEER.stats.hoursVolunteered} label="Hours Volunteered" suffix=" hrs" delay={0} started={statsStarted} />
              <AnimatedStat value={VOLUNTEER.stats.projectsApplied} label="Projects Applied" delay={120} started={statsStarted} />
              <AnimatedStat value={VOLUNTEER.stats.projectsCompleted} label="Projects Completed" delay={240} started={statsStarted} />
              <AnimatedStat value={VOLUNTEER.stats.projectsDropped} label="Dropped" delay={360} started={statsStarted} />
              <AnimatedStat value={VOLUNTEER.stats.referrals} label="Colleagues Referred" delay={480} started={statsStarted} />
              <AnimatedStat value={VOLUNTEER.stats.badgesEarned} label="Badges Earned" delay={600} started={statsStarted} />
            </div>

            {/* Skills offered */}
            <div style={{
              background: "#fff",
              border: "1px solid #e8e8f0",
              borderRadius: 16,
              padding: "18px 20px",
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9999aa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>
                Skills You Offer
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {VOLUNTEER.skills.map(s => (
                  <span key={s} style={{
                    background: "#eef2ff", color: "#0046e6",
                    fontSize: 12.5, fontWeight: 600, padding: "5px 12px",
                    borderRadius: 100,
                  }}>{s}</span>
                ))}
                {VOLUNTEER.interests.map(s => (
                  <span key={s} style={{
                    background: "#e6f5ee", color: "#0d7c52",
                    fontSize: 12.5, fontWeight: 600, padding: "5px 12px",
                    borderRadius: 100,
                  }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div style={{
              background: "#fff",
              border: "1px solid #e8e8f0",
              borderRadius: 16,
              padding: "18px 20px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9999aa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 14 }}>
                Badges Earned
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {BADGES.map(b => (
                  <div key={b.id} title={`${b.name}: ${b.desc} — ${b.earned}`} style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    background: "#f5f5fa", borderRadius: 12, padding: "10px 14px",
                    cursor: "default", transition: "transform 0.15s",
                    minWidth: 72,
                  }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <span style={{ fontSize: 22 }}>{b.icon}</span>
                    <span style={{ fontSize: 10.5, fontWeight: 600, color: ACCENT_NAVY, marginTop: 5, textAlign: "center", lineHeight: 1.2 }}>{b.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* ══ 2. TESTIMONIAL ═══════════════════════════════════════════ */}
          <Section id="testimonial">
            <SectionHeading eyebrow="What others say" title="Testimonial" />
            <div style={{
              background: ACCENT_NAVY,
              borderRadius: 20,
              padding: "36px 40px",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Decorative quote mark */}
              <div style={{
                position: "absolute", top: -10, left: 24,
                fontSize: 140, color: "rgba(255,255,255,0.05)",
                fontFamily: "Georgia, serif", lineHeight: 1, userSelect: "none",
              }}>❝</div>

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(0,180,216,0.15)", border: "1px solid rgba(0,180,216,0.3)",
                  borderRadius: 100, padding: "4px 12px",
                  fontSize: 11, fontWeight: 700, color: TATA_CYAN,
                  letterSpacing: "0.5px", textTransform: "uppercase",
                  marginBottom: 20,
                }}>
                  🤝 {TESTIMONIAL.type}
                </div>

                <blockquote style={{
                  fontSize: 17,
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.92)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  margin: "0 0 28px",
                  letterSpacing: 0.1,
                }}>
                  "{TESTIMONIAL.quote}"
                </blockquote>

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: TESTIMONIAL.avatarColor,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, fontWeight: 700, color: "#fff",
                    flexShrink: 0,
                  }}>
                    {TESTIMONIAL.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{TESTIMONIAL.author}</div>
                    <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{TESTIMONIAL.role}</div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)" }}>{TESTIMONIAL.project}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{TESTIMONIAL.edition}</div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* ══ 3. MY ACTIVITIES ═════════════════════════════════════════ */}
          <Section id="activities">
            <SectionHeading
              eyebrow={IS_PE_SEASON ? "ProEngage Edition 11 is live · Applications close 15 Jul" : "TVW 22 · Sep–Oct 2025"}
              title="My Activities"
            />

            <SlicerPills options={activityOptions} active={activeActivity} onChange={setActiveActivity} color={TATA_CYAN} />

            {/* TVW Opportunities */}
            {activeActivity === "opportunities" && (
              <div>
                <div style={{ fontSize: 13, color: "#6b6b7a", marginBottom: 16 }}>
                  {IS_PE_SEASON
                    ? "Events curated by Tata companies during TVW 22 — September to October 2025."
                    : "Browse all volunteering opportunities available this edition."}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {TVW_OPPORTUNITIES.map(ev => (
                    <div key={ev.id} style={{
                      background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14,
                      padding: "16px 18px", display: "flex", gap: 16, alignItems: "center",
                      cursor: "pointer", transition: "box-shadow 0.18s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,53,128,0.08)")}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: ev.color + "18", display: "flex", alignItems: "center",
                        justifyContent: "center", flexShrink: 0, fontSize: 20,
                      }}>
                        {ev.theme === "Environment" ? "🌳" : ev.theme === "Education" ? "📚" : "🩺"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: ACCENT_NAVY }}>{ev.title}</div>
                        <div style={{ fontSize: 12, color: "#6b6b7a", marginTop: 3 }}>
                          {ev.company} · {ev.date} · {ev.mode} · {ev.duration}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 12, color: ev.spotsLeft < 10 ? "#b91c1c" : "#0d7c52", fontWeight: 600 }}>
                          {ev.spotsLeft} spots left
                        </div>
                        <button style={{
                          marginTop: 6, background: ev.color, color: "#fff",
                          border: "none", borderRadius: 8, padding: "5px 14px",
                          fontSize: 12, fontWeight: 600, cursor: "pointer",
                        }}>
                          Register
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate("tvw")} style={{
                  marginTop: 14, display: "flex", alignItems: "center", gap: 6,
                  fontSize: 13, color: TATA_BLUE, fontWeight: 600,
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                }}>
                  View all TVW opportunities →
                </button>
              </div>
            )}

            {/* DIY Activities */}
            {activeActivity === "diy" && (
              <div>
                <div style={{ fontSize: 13, color: "#6b6b7a", marginBottom: 16 }}>
                  Organise your own volunteering activity — solo, with family, or with colleagues. Use the DIY kit to plan and submit for recognition.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  {DIY_ACTIVITIES.map(a => (
                    <div key={a.id} style={{
                      background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, padding: "18px",
                      cursor: "pointer",
                    }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 6 }}>{a.title}</div>
                      <div style={{ fontSize: 12.5, color: "#6b6b7a", marginBottom: 12, lineHeight: 1.5 }}>{a.desc}</div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ background: a.color + "18", color: a.color, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 100 }}>{a.theme}</span>
                        <span style={{ fontSize: 11.5, color: "#9999aa" }}>Effort: {a.effort}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{
                  background: "#f5f5fa", borderRadius: 12, padding: "14px 18px",
                  fontSize: 13, color: "#555", lineHeight: 1.6,
                }}>
                  💡 Have your own idea? <strong>Create a DIY activity</strong> and invite colleagues and family members to join. TVW DIY kit available in Resources.
                </div>
              </div>
            )}

            {/* ProEngage / Active Project */}
            {activeActivity === "proengage" && (
              <div>
                {VOLUNTEER.activeApplication ? (
                  /* Currently matched — show project management */
                  <div>
                    <div style={{
                      background: "#e6f5ee", border: "1px solid #a7f3d0",
                      borderRadius: 14, padding: "18px 20px", marginBottom: 16,
                    }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 10,
                          background: "#0d7c52", display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: 18, flexShrink: 0,
                        }}>✅</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#064e3b" }}>You're matched!</div>
                          <div style={{ fontSize: 14.5, fontWeight: 600, color: ACCENT_NAVY, marginTop: 2 }}>
                            {VOLUNTEER.activeApplication.title}
                          </div>
                          <div style={{ fontSize: 12.5, color: "#0d7c52", marginTop: 2 }}>
                            {VOLUNTEER.activeApplication.ngo} · {VOLUNTEER.activeApplication.edition} · Matched {VOLUNTEER.activeApplication.matchDate}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {[
                        { icon: "📝", label: "Post a Project Update", desc: "Share your progress with TSG and your NGO", color: "#0046e6" },
                        { icon: "📖", label: "Access E-Module", desc: "Orientation, dos & don'ts, role responsibilities", color: "#5b21b6" },
                        { icon: "💬", label: "Submit Feedback", desc: "Rate your experience and share learnings", color: "#0d7c52" },
                        { icon: "🏅", label: "Download Certificate", desc: "Available once both sides submit feedback", color: "#c14d00", disabled: true },
                      ].map(a => (
                        <button key={a.label} disabled={a.disabled} style={{
                          background: a.disabled ? "#f8f8f8" : "#fff",
                          border: `1px solid ${a.disabled ? "#e0e0e0" : "#e8e8f0"}`,
                          borderRadius: 14, padding: "16px",
                          textAlign: "left", cursor: a.disabled ? "not-allowed" : "pointer",
                          opacity: a.disabled ? 0.55 : 1,
                          transition: "box-shadow 0.18s",
                        }}
                          onMouseEnter={e => { if (!a.disabled) (e.currentTarget.style.boxShadow = `0 4px 14px ${a.color}22`); }}
                          onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
                        >
                          <div style={{ fontSize: 22, marginBottom: 8 }}>{a.icon}</div>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 4 }}>{a.label}</div>
                          <div style={{ fontSize: 12, color: "#6b6b7a", lineHeight: 1.4 }}>{a.desc}</div>
                          {a.disabled && <div style={{ fontSize: 11, color: "#999", marginTop: 6, fontStyle: "italic" }}>Pending feedback submission</div>}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* No active project — show PE opportunities */
                  <div>
                    <div style={{ fontSize: 13, color: "#6b6b7a", marginBottom: 16 }}>
                      {IS_PE_SEASON
                        ? "AI-matched ProEngage projects based on your skills. Apply before the window closes."
                        : "ProEngage applications are not open right now. Check back in January for the next edition."}
                    </div>
                    {IS_PE_SEASON && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {PE_OPPORTUNITIES.map(p => (
                          <div key={p.id} style={{
                            background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14,
                            padding: "16px 18px", display: "flex", gap: 14,
                            cursor: "pointer", transition: "box-shadow 0.18s",
                          }}
                            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,53,128,0.08)")}
                            onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
                          >
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <span style={{ background: p.color + "18", color: p.color, fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 100 }}>
                                  {p.match}% match 🤖
                                </span>
                                <span style={{ fontSize: 11, color: "#9999aa" }}>{p.skillArea}</span>
                              </div>
                              <div style={{ fontWeight: 700, fontSize: 14, color: ACCENT_NAVY }}>{p.title}</div>
                              <div style={{ fontSize: 12, color: "#6b6b7a", marginTop: 3 }}>
                                {p.ngo} · {p.mode} · {p.duration} · Closes {p.closes}
                              </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", flexShrink: 0 }}>
                              <span style={{ fontSize: 11.5, color: "#9999aa" }}>{p.applicants} applicants</span>
                              <button style={{
                                background: p.color, color: "#fff", border: "none",
                                borderRadius: 8, padding: "6px 16px",
                                fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                              }}>
                                Apply
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <button onClick={() => navigate("proengage")} style={{
                      marginTop: 14, display: "flex", alignItems: "center", gap: 6,
                      fontSize: 13, color: TATA_BLUE, fontWeight: 600,
                      background: "none", border: "none", cursor: "pointer", padding: 0,
                    }}>
                      Browse all ProEngage projects →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Refer & Share buttons ──────────────────────────────── */}
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button style={{
                flex: 1, background: "#fff", border: "1.5px solid #e0e0e8",
                borderRadius: 12, padding: "13px 16px",
                fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "border-color 0.18s, box-shadow 0.18s",
              }}
                onMouseEnter={e => {
                  (e.currentTarget.style.borderColor = TATA_CYAN);
                  (e.currentTarget.style.boxShadow = `0 0 0 3px ${TATA_CYAN}22`);
                }}
                onMouseLeave={e => {
                  (e.currentTarget.style.borderColor = "#e0e0e8");
                  (e.currentTarget.style.boxShadow = "none");
                }}
              >
                🔗 Refer a Family Member or Colleague
              </button>
              <button style={{
                flex: 1, background: "#fff", border: "1.5px solid #e0e0e8",
                borderRadius: 12, padding: "13px 16px",
                fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "border-color 0.18s, box-shadow 0.18s",
              }}
                onMouseEnter={e => {
                  (e.currentTarget.style.borderColor = "#5b21b6");
                  (e.currentTarget.style.boxShadow = `0 0 0 3px #5b21b622`);
                }}
                onMouseLeave={e => {
                  (e.currentTarget.style.borderColor = "#e0e0e8");
                  (e.currentTarget.style.boxShadow = "none");
                }}
              >
                ✍️ Share Your Story
              </button>
            </div>
          </Section>

          {/* ══ 4. MY HISTORY ════════════════════════════════════════════ */}
          <Section id="history">
            <SectionHeading eyebrow="Your volunteering trail" title="My History" />

            <SlicerPills options={historyOptions} active={activeHistory} onChange={setActiveHistory} color={TATA_BLUE} />

            {/* Applications */}
            {activeHistory === "applications" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {HISTORY_APPLICATIONS.map(a => (
                  <div key={a.id} style={{
                    background: "#fff", border: "1px solid #e8e8f0", borderRadius: 12,
                    padding: "13px 16px", display: "flex", gap: 12, alignItems: "center",
                  }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                      background: a.type === "ProEngage" ? "#f3f0ff" : "#ecfeff",
                      color: a.type === "ProEngage" ? "#5b21b6" : "#0e7490",
                    }}>
                      {a.type}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY }}>{a.project}</div>
                      <div style={{ fontSize: 11.5, color: "#9999aa", marginTop: 2 }}>{a.edition} · {a.date}</div>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {activeHistory === "projects" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {HISTORY_PROJECTS.map(p => (
                  <div key={p.id} style={{
                    background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, padding: "18px 20px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 14.5, fontWeight: 700, color: ACCENT_NAVY }}>{p.title}</div>
                        <div style={{ fontSize: 12.5, color: "#6b6b7a", marginTop: 2 }}>{p.ngo} · {p.edition} · {p.hours} hrs</div>
                      </div>
                      {p.cert && (
                        <button style={{
                          background: "#eef2ff", color: "#0046e6", border: "none",
                          borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                        }}>
                          🏅 Certificate
                        </button>
                      )}
                    </div>
                    <div style={{
                      background: p.cert ? "#f0fdf4" : "#fff5f5", borderRadius: 8, padding: "10px 14px",
                      fontSize: 13, color: p.cert ? "#064e3b" : "#7f1d1d",
                      borderLeft: `3px solid ${p.cert ? "#0d7c52" : "#ef4444"}`,
                    }}>
                      {p.outcome}
                    </div>
                    <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
                      {p.skills.map(s => (
                        <span key={s} style={{ background: "#eef2ff", color: "#0046e6", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 100 }}>{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* My Experience (testimonials) */}
            {activeHistory === "experience" && (
              <div>
                <div style={{
                  background: "#fff", border: "1px solid #e8e8f0", borderRadius: 14, padding: "20px",
                  marginBottom: 12,
                }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    {["All Editions", "ProEngage 11", "ProEngage 10", "TVW 22"].map(f => (
                      <button key={f} style={{
                        padding: "5px 12px", borderRadius: 100, border: "1px solid #e0e0e8",
                        background: f === "All Editions" ? ACCENT_NAVY : "#fff",
                        color: f === "All Editions" ? "#fff" : "#555",
                        fontSize: 12, cursor: "pointer",
                      }}>{f}</button>
                    ))}
                  </div>
                  <blockquote style={{
                    fontSize: 15, lineHeight: 1.7, color: "#333", fontStyle: "italic",
                    borderLeft: `3px solid ${TATA_CYAN}`, paddingLeft: 16, margin: 0,
                  }}>
                    "{TESTIMONIAL.quote}"
                  </blockquote>
                  <div style={{ fontSize: 12.5, color: "#6b6b7a", marginTop: 12 }}>
                    — {TESTIMONIAL.author}, {TESTIMONIAL.role} · {TESTIMONIAL.edition}
                  </div>
                  <div style={{ marginTop: 10, fontSize: 12, color: "#9999aa" }}>Status: Pending Admin Approval</div>
                </div>
                <div style={{
                  background: "#f8f8fc", borderRadius: 12, padding: "14px 18px",
                  fontSize: 13, color: "#6b6b7a",
                }}>
                  ✍️ Your past testimonials appear here once approved. You can submit a new one from your active project page.
                </div>
              </div>
            )}

            {/* Certificates */}
            {activeHistory === "certificates" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {HISTORY_PROJECTS.filter(p => p.cert).map(p => (
                  <div key={p.id} style={{
                    background: "linear-gradient(135deg, #eef2ff 0%, #f3f0ff 100%)",
                    border: "1px solid #c7d7fd", borderRadius: 14, padding: "20px",
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", top: -10, right: -10,
                      fontSize: 60, opacity: 0.12,
                    }}>🏅</div>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>🏅</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 4 }}>{p.title}</div>
                    <div style={{ fontSize: 12.5, color: "#5b21b6", marginBottom: 12 }}>{p.ngo} · {p.edition}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{
                        flex: 1, background: ACCENT_NAVY, color: "#fff", border: "none",
                        borderRadius: 8, padding: "7px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                      }}>
                        Download PDF
                      </button>
                      <button style={{
                        background: "#0077b5", color: "#fff", border: "none",
                        borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                      }}>
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Feedback */}
            {activeHistory === "feedback" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {HISTORY_PROJECTS.filter(p => p.cert).map(p => (
                  <div key={p.id} style={{
                    background: "#fff", border: "1px solid #e8e8f0", borderRadius: 12, padding: "16px 18px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: ACCENT_NAVY }}>{p.title}</div>
                        <div style={{ fontSize: 12, color: "#9999aa", marginTop: 2 }}>{p.ngo} · {p.edition}</div>
                      </div>
                      <span style={{ background: "#e6f5ee", color: "#0d7c52", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 100 }}>
                        ✓ Submitted
                      </span>
                    </div>
                    <div style={{ marginTop: 10, display: "flex", gap: 2 }}>
                      {"★★★★★".split("").map((s, i) => (
                        <span key={i} style={{ color: "#f5a623", fontSize: 18 }}>{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
                {VOLUNTEER.activeApplication && (
                  <div style={{
                    background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "16px 18px",
                  }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#78350f" }}>
                      {VOLUNTEER.activeApplication.title} — Feedback pending
                    </div>
                    <div style={{ fontSize: 12.5, color: "#92400e", marginTop: 4 }}>
                      Submit feedback once your project is marked complete to unlock your certificate.
                    </div>
                  </div>
                )}
              </div>
            )}
          </Section>

          {/* ══ 5. RESOURCES ═════════════════════════════════════════════ */}
          <Section id="resources">
            <SectionHeading eyebrow="Learning & inspiration" title="Resource Library" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
              {RESOURCE_SECTIONS.map(r => (
                <button key={r.id} style={{
                  background: r.color, border: "1px solid #e8e8f0", borderRadius: 16,
                  padding: "20px 14px", textAlign: "center", cursor: "pointer",
                  transition: "transform 0.18s, box-shadow 0.18s",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                }}
                  onMouseEnter={e => {
                    (e.currentTarget.style.transform = "translateY(-4px)");
                    (e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,53,128,0.1)");
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget.style.transform = "translateY(0)");
                    (e.currentTarget.style.boxShadow = "none");
                  }}
                >
                  <span style={{ fontSize: 28 }}>{r.icon}</span>
                  <div style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY }}>{r.label}</div>
                  <div style={{ fontSize: 10.5, color: "#6b6b7a", lineHeight: 1.4, textAlign: "center" }}>{r.desc}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9999aa" }}>{r.count}</div>
                </button>
              ))}
            </div>

            {/* Preview strip */}
            <div style={{
              marginTop: 16, background: "#fff", border: "1px solid #e8e8f0",
              borderRadius: 16, padding: "18px 20px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9999aa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 14 }}>
                Recent Stories
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { title: "How I helped 150 women find financial freedom", author: "Priya Sharma · ProEngage 9", img: "💚" },
                  { title: "A weekend that changed how I think about impact", author: "Rohan Desai · TVW 22", img: "🌱" },
                  { title: "Building a website for APD in 3 weekends", author: "Ananya Rao · ProEngage 10", img: "💙" },
                ].map((s, i) => (
                  <div key={i} style={{
                    flex: 1, background: "#f8f8fc", borderRadius: 10, padding: "14px",
                    cursor: "pointer",
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 8, textAlign: "center" }}>{s.img}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: ACCENT_NAVY, lineHeight: 1.4, marginBottom: 6 }}>{s.title}</div>
                    <div style={{ fontSize: 11.5, color: "#9999aa" }}>{s.author}</div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>

        {/* ── Right rail: section tracker ────────────────────────────────── */}
        <div style={{
          width: 160,
          flexShrink: 0,
          position: "sticky",
          top: 100,
          alignSelf: "flex-start",
          height: "fit-content",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#c0c0cc", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>
            On this page
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {SECTIONS.map(s => {
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 10px", borderRadius: 8, border: "none",
                    background: isActive ? "#eef2ff" : "transparent",
                    cursor: "pointer", textAlign: "left",
                    transition: "background 0.18s",
                  }}
                >
                  <div style={{
                    width: 3, height: 18, borderRadius: 2, flexShrink: 0,
                    background: isActive ? TATA_BLUE : "#e0e0e8",
                    transition: "background 0.18s",
                  }} />
                  <span style={{
                    fontSize: 12.5,
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? TATA_BLUE : "#9999aa",
                    transition: "color 0.18s",
                  }}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick action */}
          <div style={{ marginTop: 28, padding: "14px", background: "#f5f5fa", borderRadius: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9999aa", marginBottom: 8 }}>QUICK ACTIONS</div>
            {[
              { label: "Edit Profile", icon: "✏️", path: "/profile" },
              { label: "View Notifications", icon: "🔔", path: "#" },
              { label: "Raise Grievance", icon: "🚩", path: "#" },
            ].map(a => (
              <button key={a.label} onClick={() => a.path !== "#" && navigate(a.path as any)} style={{
                display: "flex", alignItems: "center", gap: 7,
                width: "100%", background: "none", border: "none",
                padding: "6px 0", fontSize: 12.5, color: "#555", cursor: "pointer",
                textAlign: "left",
              }}>
                <span>{a.icon}</span> {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
