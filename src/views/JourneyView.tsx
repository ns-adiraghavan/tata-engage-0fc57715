import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import Footer from "@/components/layout/Footer";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const ACCENT_NAVY = "#0D1B3E";
const B_INDIGO    = "#333399";
const B_YELLOW    = "#F5A623";
const B_TEAL      = "#00A896";
const B_RED       = "#E8401C";
const B_BLUE      = "#1E6BB8";
const P_INDIGO    = "#EEF0FF";

// ── Era sections for dot rail ─────────────────────────────────────────────────
const ERAS = [
  { id: "era-roots",    label: "Genesis"    },
  { id: "era-growth",   label: "Early Growth" },
  { id: "era-digital",  label: "Scaling Up" },
  { id: "era-scale",    label: "Going Virtual" },
  { id: "era-today",    label: "Today"      },
];

// ── Timeline data (source: Tata Sustainability Group official records) ────────
const MILESTONES = [
  // ERA: ROOTS
  {
    era: "era-roots",
    year: "2013",
    title: "The Idea Takes Shape",
    body: "The Tata Sustainability Group is tasked with creating a structured, group-level volunteering platform to mobilise employees across companies and geographies — moving from ad hoc giving to institutionalised impact.",
    stat: "1 mandate",
    statLabel: "from TSG leadership",
    colour: B_INDIGO,
    photo: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800&h=500",
    tag: "Foundation",
  },
  {
    era: "era-roots",
    year: "3 Mar 2014",
    title: "Tata Engage Launches",
    body: "Tata Engage is launched by TSG on 3 March 2014 — the 175th birth anniversary of Jamsetji Tata. The inaugural Tata Volunteering Week (TVW1) invites employees across the Group to take officially sanctioned time off to volunteer. Sign-ups cross 100,000 employees.",
    stat: "100,000+",
    statLabel: "employees signed up in TVW1",
    colour: B_INDIGO,
    photo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=800&h=500",
    tag: "Launch",
  },
  // ERA: GROWTH
  {
    era: "era-growth",
    year: "Dec 2014",
    title: "ProEngage Is Born",
    body: "ProEngage launches on International Volunteer Day — a skill-based format enabling employees, family members, and retirees to take on structured 1–6 month projects for non-profits. Professionals donate expertise, not just time.",
    stat: "Dec 2014",
    statLabel: "International Volunteer Day launch",
    colour: B_YELLOW,
    photo: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800&h=500",
    tag: "Innovation",
  },
  {
    era: "era-growth",
    year: "2014–2016",
    title: "Formats Take Root",
    body: "TVW runs biannually every March and September. ProEngage expands steadily — from hundreds of projects in early editions to a growing network of NGO partners. Families and retirees join as eligible volunteers, widening the community.",
    stat: "3 formats",
    statLabel: "TVW · ProEngage · Disaster Response",
    colour: B_YELLOW,
    photo: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800&h=500",
    tag: "Expansion",
  },
  // ERA: DIGITAL
  {
    era: "era-digital",
    year: "2016–2019",
    title: "Scaling to 1.7 Million Hours",
    body: "Tata Engage matures into the central volunteering mechanism for the Group. By 2019, the platform has clocked more than 1.7 million cumulative volunteering hours through event-based and skill-based projects across dozens of companies.",
    stat: "1.7M+",
    statLabel: "cumulative hours by 2019",
    colour: B_TEAL,
    photo: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800&h=500",
    tag: "Scale",
  },
  {
    era: "era-digital",
    year: "2019",
    title: "ProEngage13: 425+ Projects",
    body: "The 13th ProEngage edition offers more than 425 projects with 120+ non-profit partners — many deliverable remotely from anywhere in the world. The platform demonstrates it can transcend geography.",
    stat: "425+",
    statLabel: "projects with 120+ NGO partners",
    colour: B_TEAL,
    photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800&h=500",
    tag: "Milestone",
  },
  // ERA: SCALE
  {
    era: "era-scale",
    year: "Sep 2020",
    title: "TVW14: First Fully Virtual Edition",
    body: "COVID-19 forces a radical pivot. TVW14, themed 'Work from Heart', becomes the first 100% virtual Tata Volunteering Week — enabling 35,000+ employees to volunteer safely from home, contributing 125,000+ hours across 2,500+ activities and impacting 200,000+ lives.",
    stat: "35,000+",
    statLabel: "volunteers from home",
    colour: B_RED,
    photo: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&q=80&w=800&h=500",
    tag: "Pivot",
  },
  {
    era: "era-scale",
    year: "2021",
    title: "App Launch & TVW16 Record",
    body: "TSG launches the Tata Engage Volunteering App in September 2021 — a one-stop platform for profiles, skill-matching, and sign-ups. TVW16 simultaneously sets a record: 47,000+ volunteers from 35 companies, 190,000+ hours, 3,300+ activities across 100+ cities.",
    stat: "47,000+",
    statLabel: "volunteers in TVW16 alone",
    colour: B_RED,
    photo: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800&h=500",
    tag: "Record",
  },
  {
    era: "era-scale",
    year: "FY23",
    title: "3.67 Million Hours in a Single Year",
    body: "Employees from 54 Group companies across six continents contribute 36.7 lakh volunteering hours in FY23 — 3.77 per capita. Tata Engage formats account for 46.5% of those hours, cementing its role as the Group's primary volunteering engine.",
    stat: "3.67M",
    statLabel: "hours · 54 companies · 6 continents",
    colour: B_BLUE,
    photo: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800&h=500",
    tag: "Milestone",
  },
  // ERA: TODAY
  {
    era: "era-today",
    year: "2023",
    title: "TVW Turns Twenty",
    body: "The 20th edition of Tata Volunteering Week — branded 'Team TVWenty: League of Extraordinary Volunteers' — celebrates nearly a decade of biannual volunteering. Tata Engage is now a one-stop platform: events, skill-based projects, and disaster response under one roof.",
    stat: "20 editions",
    statLabel: "of Tata Volunteering Week",
    colour: B_INDIGO,
    photo: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800&h=500",
    tag: "Anniversary",
  },
  {
    era: "era-today",
    year: "FY24",
    title: "ProEngage at 10 · 4 PCVH Achieved",
    body: "ProEngage completes a decade — scaling from a few hundred projects to 4,392 unique opportunities in FY24, with 8,735+ volunteers helping 1,222 NGOs log 4.99 lakh cumulative hours. The Group achieves 4 per capita volunteering hours a full year ahead of the 2025 target.",
    stat: "8.02M",
    statLabel: "hours in FY24 — target met early",
    colour: B_TEAL,
    photo: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800&h=500",
    tag: "Decade",
  },
  {
    era: "era-today",
    year: "2025–26",
    title: "The Platform Evolves",
    body: "TataEngage relaunches with AI-powered project matching, a rebuilt volunteer experience, real-time SPOC dashboards, and an integrated Disaster Response cadre — designed to carry the Group's volunteering mission into its next decade of impact.",
    stat: "Next chapter",
    statLabel: "begins now",
    colour: B_INDIGO,
    photo: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800&h=500",
    tag: "Now",
  },
];

// ── Single milestone card ─────────────────────────────────────────────────────
function MilestoneCard({ m, index }: { m: typeof MILESTONES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isLeft = index % 2 === 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        justifyContent: isLeft ? "flex-start" : "flex-end",
        marginBottom: 0,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        transitionDelay: `${(index % 3) * 0.1}s`,
      }}
    >
      <div style={{
        width: "46%", background: "#fff",
        border: "1px solid #e8e8f0",
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)"; }}
      >
        {/* Photo strip */}
        <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
          <img
            src={m.photo}
            alt={m.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            referrerPolicy="no-referrer"
          />
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to top, ${m.colour}cc 0%, transparent 55%)`,
          }} />
          {/* Year badge */}
          <div style={{
            position: "absolute", top: 14, left: 14,
            background: m.colour, color: "#fff",
            fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px",
            padding: "6px 14px", borderRadius: 8,
          }}>
            {m.year}
          </div>
          {/* Tag */}
          <div style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "#fff", fontSize: 10, fontWeight: 700,
            padding: "4px 10px", borderRadius: 100,
            letterSpacing: "1px", textTransform: "uppercase",
          }}>
            {m.tag}
          </div>
          {/* Stat overlay at bottom */}
          <div style={{
            position: "absolute", bottom: 14, left: 14,
            display: "flex", alignItems: "baseline", gap: 6,
          }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{m.stat}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{m.statLabel}</span>
          </div>
        </div>

        {/* Text */}
        <div style={{ padding: "20px 22px 24px" }}>
          <div style={{
            display: "inline-block", marginBottom: 10,
            fontSize: 10, fontWeight: 700, letterSpacing: "1.5px",
            textTransform: "uppercase", color: m.colour,
          }}>
            {m.year}
          </div>
          <h3 style={{
            fontSize: 18, fontWeight: 800, color: ACCENT_NAVY,
            margin: "0 0 10px", lineHeight: 1.25,
          }}>
            {m.title}
          </h3>
          <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.72, margin: 0 }}>
            {m.body}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Era heading ───────────────────────────────────────────────────────────────
const ERA_META: Record<string, { label: string; range: string; colour: string }> = {
  "era-roots":   { label: "Roots",    range: "2007 – 2009", colour: B_INDIGO },
  "era-growth":  { label: "Growth",   range: "2010 – 2015", colour: B_YELLOW },
  "era-digital": { label: "Digital",  range: "2015 – 2018", colour: B_TEAL   },
  "era-scale":   { label: "At Scale", range: "2020 – 2022", colour: B_RED    },
  "era-today":   { label: "Today",    range: "2024 – 2026", colour: B_BLUE   },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function JourneyView() {
  const navigate = useAppNavigate();
  const [activeEra, setActiveEra] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ERAS.forEach(({ id }, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveEra(idx); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div style={{ paddingTop: 0, paddingBottom: 0, background: "#fff", minHeight: "100vh", position: "relative" }}>

      {/* ── Dot rail ── */}
      <div style={{
        position: "fixed", right: 16, top: "50%", transform: "translateY(-50%)",
        display: "flex", flexDirection: "column", gap: 12, zIndex: 40,
      }}>
        {ERAS.map(({ id, label }, i) => {
          const active = activeEra === i;
          const eraMeta = ERA_META[id];
          return (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              style={{
                display: "flex", alignItems: "center", justifyContent: "flex-end",
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}
            >
              {active && (
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "3px 10px",
                  borderRadius: 100, marginRight: 8, whiteSpace: "nowrap",
                  background: "#fff", border: "1px solid #e2e8f0",
                  color: "#334155", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  {label}
                </span>
              )}
              <span style={{
                display: "block", borderRadius: "50%",
                width: active ? 10 : 7, height: active ? 10 : 7,
                backgroundColor: active ? eraMeta.colour : "#CBD5E1",
                transition: "all 0.25s",
              }} />
            </button>
          );
        })}
      </div>

      {/* ── 2px accent line — gradient across all colours ── */}
      <div style={{
        height: 3,
        background: `linear-gradient(to right, ${B_INDIGO}, ${B_YELLOW}, ${B_TEAL}, ${B_RED}, ${B_BLUE})`,
        width: "100%",
      }} />

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <div style={{ background: ACCENT_NAVY, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        {/* Gradient colour bar at bottom of hero */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(to right, ${B_INDIGO}, ${B_YELLOW}, ${B_TEAL}, ${B_RED}, ${B_BLUE})`,
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "96px 40px 72px" }}>
          <button
            onClick={() => navigate("about")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.45)", fontSize: 13, fontWeight: 600,
              marginBottom: 28, padding: 0,
            }}
          >
            <ArrowLeft size={14} /> Back to About
          </button>

          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: "0 0 14px" }}>
            TataEngage · 2007 – 2026
          </p>
          <h1 style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 900,
            fontSize: 56, color: "#fff", margin: "0 0 16px", lineHeight: 1.05, letterSpacing: "-2px",
          }}>
            Our Journey
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.68)", lineHeight: 1.7, maxWidth: 560, margin: "0 0 40px" }}>
            From four companies and a single idea, to 50,000 volunteers, 85 NGO partners, and over 2.5 million hours of service. Fifteen years of walking the talk.
          </p>

          {/* Era pills */}
          <div style={{ position: "relative" }}>
            {/* Radial glow behind pills */}
            <div style={{
              position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%)",
              width: 600, height: 300, pointerEvents: "none",
              background: "radial-gradient(ellipse 600px 300px at 50% 100%, rgba(51,51,153,0.15), transparent)",
            }} />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
              {ERAS.map(({ id, label }, i) => {
                const meta = ERA_META[id];
                return (
                  <button
                    key={id}
                    onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                    style={{
                      background: i === activeEra ? meta.colour : "rgba(255,255,255,0.08)",
                      border: `1px solid ${i === activeEra ? meta.colour : "rgba(255,255,255,0.15)"}`,
                      color: "#fff", borderRadius: 100, padding: "7px 16px",
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {label} · {meta.range}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          TIMELINE ERAS
      ════════════════════════════════════════ */}
      {ERAS.map(({ id }) => {
        const meta = ERA_META[id];
        const items = MILESTONES.filter((m) => m.era === id);
        const globalStart = MILESTONES.findIndex((m) => m.era === id);

        return (
          <section
            key={id}
            id={id}
            style={{ padding: "80px 40px", position: "relative" }}
          >
            {/* Era heading */}
            <div style={{
              maxWidth: 960, margin: "0 auto 48px",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{
                width: 4, height: 48, borderRadius: 2,
                background: meta.colour, flexShrink: 0,
              }} />
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#94A3B8", margin: "0 0 4px" }}>
                  {meta.range}
                </p>
                <h2 style={{ fontSize: 28, fontWeight: 900, color: ACCENT_NAVY, margin: 0, letterSpacing: "-0.5px" }}>
                  {meta.label}
                </h2>
              </div>
            </div>

            {/* Centre spine */}
            <div style={{
              position: "absolute",
              left: "50%", top: 140, bottom: 0,
              width: 2,
              background: `linear-gradient(to bottom, ${meta.colour}40, ${meta.colour}10)`,
              transform: "translateX(-50%)",
            }} />

            {/* Cards */}
            <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
              {items.map((m, i) => (
                <MilestoneCard key={m.year + m.title} m={m} index={globalStart + i} />
              ))}
            </div>
          </section>
        );
      })}

      {/* ════════════════════════════════════════
          CTA FOOTER STRIP
      ════════════════════════════════════════ */}
      <div style={{
        background: `linear-gradient(135deg, ${ACCENT_NAVY} 0%, #1a2a5e 100%)`,
        padding: "64px 40px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: "0 0 12px" }}>
            The next chapter
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "#fff", margin: "0 0 14px", letterSpacing: "-0.5px" }}>
            Be part of what comes next
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Fifty thousand volunteers can't be wrong. Join the Tata family's longest-running commitment to community.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("register-role")}
              style={{
                background: B_YELLOW, color: ACCENT_NAVY, border: "none",
                borderRadius: 10, padding: "13px 28px", fontWeight: 700,
                fontSize: 15, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
            >
              Register as Volunteer <ArrowRight size={15} />
            </button>
            <button
              onClick={() => navigate("about")}
              style={{
                background: "rgba(255,255,255,0.1)", color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 10, padding: "13px 28px", fontWeight: 700,
                fontSize: 15, cursor: "pointer",
              }}
            >
              About TataEngage
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
