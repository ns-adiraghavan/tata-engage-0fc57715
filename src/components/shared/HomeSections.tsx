import { useState, useEffect, useRef } from "react";
import { ArrowRight, ExternalLink, RefreshCw, ChevronDown } from "lucide-react";
import { Twitter, Instagram, Linkedin } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import {
  B_INDIGO, B_YELLOW, B_RED, B_TEAL, B_BLUE,
  P_INDIGO, P_TEAL, P_RED, P_YELLOW,
  secBg, SectionDivider,
  FLAGSHIP_PROGRAMMES, JOURNEY_MILESTONES, FUN_FACTS,
  HERO_STATS, SOCIAL_POSTS, TICKER_ITEMS, EOEO,
  ACCENT_NAVY,
} from "@/data/homeSharedData";
import doodleCluster1 from "@/assets/doodle-cluster-1.png";
import doodleCluster2 from "@/assets/doodle-cluster-2.png";
import doodleCluster3 from "@/assets/doodle-cluster-3.png";
import doodleCluster4 from "@/assets/doodle-cluster-4.png";
import tataElxsiImg   from "@/assets/tata-elxsi.jpg";
import airIndia from "@/assets/air-india.jpg";
import tataCommunications from "@/assets/tata-communications-1.jpg";
import infiniti from "@/assets/Infiniti_2.jpg";

export { SectionDivider };

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STYLES — injected once via ProgrammeSpotlight (first section rendered)
// Defines all custom classes used across HomeSections components.
// Orange is used ONLY as a contrast badge on dark backgrounds (LIVE, Insight).
// ─────────────────────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  /* DM Serif Display for display h1 */
  .te-serif { font-family: 'DM Serif Display', Georgia, serif; }

  /* Section rhythm */
  .section-block { padding: 72px 48px; position: relative; overflow: hidden; }
  .section-header { margin-bottom: 40px; }

  /* Lift on hover */
  .hover-lift { transition: transform 0.25s ease, box-shadow 0.25s ease; }
  .hover-lift:hover { transform: translateY(-3px); }

  /* Definer underline — track + animated fill */
  .te-definer-track {
    height: 2px; border-radius: 2px;
    background: #e8e8f0; margin-top: 5px; overflow: hidden;
  }
  .te-definer-fill {
    height: 100%; border-radius: 2px; width: 0%;
    transition: width 0.65s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .te-definer-fill.on { width: 100%; }

  /* Ticker marquee */
  @keyframes te-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .te-marquee { animation: te-marquee 34s linear infinite; display: flex; gap: 64px; white-space: nowrap; }
  .te-marquee:hover { animation-play-state: paused; }

  /* Shimmer sweep on social card */
  @keyframes te-shimmer { 0% { left: -40%; } 100% { left: 140%; } }

  /* Hero chevron bob */
  @keyframes te-bob {
    0%, 100% { transform: translateY(0);   opacity: 1;    }
    50%       { transform: translateY(6px); opacity: 0.6; }
  }
  .te-bob-1 { animation: te-bob 1.6s ease-in-out infinite 0s;     }
  .te-bob-2 { animation: te-bob 1.6s ease-in-out infinite 0.18s;  }
  .te-bob-3 { animation: te-bob 1.6s ease-in-out infinite 0.36s;  }


  /* Journey: dashed trail draw-on — larger dashoffset for full curved path */
  .te-trail { stroke-dashoffset: 2000; transition: stroke-dashoffset 1.4s ease-out; }
  .te-trail.on { stroke-dashoffset: 0; }

  /* Journey: card fade-slide */
  .te-jcard { opacity: 0; transition: opacity 0.45s ease, transform 0.45s ease; }
  .te-jcard.up   { transform: translateY(12px);  }
  .te-jcard.down { transform: translateY(-12px); }
  .te-jcard.on   { opacity: 1; transform: translateY(0); }

  /* Stat pulse dot */
  @keyframes te-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
  .te-pulse { animation: te-pulse 2s ease-in-out infinite; }

  /* Programme image card hover */
  .prog-img-card { transition: transform 0.3s ease; }
  .prog-img-card:hover { transform: scale(1.012); }
`;

// ─────────────────────────────────────────────────────────────────────────────
// DEFINER UNDERLINE — sweeps left→right on scroll entry
// ─────────────────────────────────────────────────────────────────────────────
function DefinerUnderline({ colour = B_INDIGO, width = 56 }: { colour?: string; width?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="te-definer-track" style={{ width }}>
      <div className={`te-definer-fill${on ? " on" : ""}`} style={{ background: colour }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GEO ICONS — brand palette shapes from the icon set
// Colours: B_INDIGO, B_TEAL, B_BLUE, B_RED — never orange/yellow decoratively
// ─────────────────────────────────────────────────────────────────────────────
const GeoIcon = {
  diamond: (colour: string, size = 24) => (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block" }}>
      <polygon points="50,4 96,50 50,96 4,50" fill={colour} />
    </svg>
  ),
  hexagon: (colour: string, size = 24) => (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block" }}>
      <polygon points="50,4 90,27 90,73 50,96 10,73 10,27" fill={colour} />
    </svg>
  ),
  triangle: (colour: string, size = 24) => (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block" }}>
      <polygon points="50,6 95,94 5,94" fill={colour} />
    </svg>
  ),
  circle: (colour: string, size = 24) => (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: "block" }}>
      <circle cx="50" cy="50" r="46" fill={colour} />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// PROGRAMME CONFIG — solid dark bg colours, geo icons in brand colours (no orange)
// ─────────────────────────────────────────────────────────────────────────────
const PROG_CONFIG = [
  {
    id: "TVW", route: "about-tvw",
    title: "Tata Volunteering Week",
    label: "Bi-annual · Global",
    stat1: "12 Editions", stat2: "50K+ Volunteers",
    colour: "#4A90C4",
    photo: airIndia, photoPos: "center 25%",
  },
  {
    id: "ProEngage", route: "about-proengage",
    title: "ProEngage",
    label: "Skill-based · Year-round",
    stat1: "1,200+ Projects", stat2: "85 NGO Partners",
    colour: "#2E7D4F",
    photo: tataCommunications, photoPos: "center center",
  },
  {
    id: "Disaster Response", route: "disaster-response",
    title: "Disaster Response",
    label: "Rapid Action",
    stat1: "24 Responses", stat2: "8 States",
    colour: "#00A896",
    photo: infiniti, photoPos: "center 20%",
  },
];

const PROG_PASTEL = ["#EEF0FF", "#F5F3FF", "#E6F8F5"];
const PROG_ACCENT_TEXT = ["#333399", "#5b21b6", "#00A896"];

//
// PROGRAMME SPOTLIGHT
// Single card, auto-cycles every 5s. Dot indicators only (no text labels).
// Solid dark coloured bg. Hover: image fades in, desc slides up.
// EOEO panel fixed to the right: headline + CTA dominant.
// ─────────────────────────────────────────────────────────────────────────────
export function ProgrammeSpotlight() {
  const navigate        = useAppNavigate();
  const [idx, setIdx]   = useState(0);
  const timerRef        = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = (nextIdx?: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setIdx((p) => (p + 1) % PROG_CONFIG.length),
      5000
    );
    if (nextIdx !== undefined) setIdx(nextIdx);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const p = PROG_CONFIG[idx];

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <section id="programmes" className="section-block" style={{ background: "#ffffff" }}>
        <img src={doodleCluster2} alt="" style={{
          position: "absolute", top: -10, right: -80, width: 300, opacity: 0.06,
          pointerEvents: "none", userSelect: "none", transform: "rotate(14deg)",
        }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div className="section-header">
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.6px", textTransform: "uppercase", color: B_INDIGO, margin: "0 0 8px", opacity: 0.7 }}>
              Our Programmes
            </p>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: ACCENT_NAVY, letterSpacing: "-0.5px", margin: 0 }}>
              Our Volunteering Opportunities
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 0.85fr 260px", gap: 16, alignItems: "stretch" }}>

            {/* COL 1 — Image tile */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                className="prog-img-card"
                onClick={() => navigate(p.route)}
                style={{
                  clipPath: "polygon(0 0, 100% 0, 92% 100%, 0 100%)",
                  borderRadius: "18px 0 0 18px",
                  flex: 1, minHeight: 300, position: "relative",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
                  cursor: "pointer",
                }}
              >
                {PROG_CONFIG.map((pc, i) => (
                  <div
                    key={pc.id}
                    style={{
                      position: "absolute", inset: 0,
                      backgroundImage: `url(${pc.photo})`,
                      backgroundSize: "cover",
                      backgroundPosition: pc.photoPos,
                      opacity: i === idx ? 1 : 0,
                      transition: "opacity 0.7s ease",
                    }}
                  />
                ))}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 4,
                  background: p.colour, zIndex: 2,
                  transition: "background 0.5s ease",
                }} />
              </div>

              {/* Dot indicators */}
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14 }}>
                {PROG_CONFIG.map((pc, i) => (
                  <button
                    key={i}
                    onClick={() => resetTimer(i)}
                    style={{
                      width: i === idx ? 24 : 8, height: 8,
                      borderRadius: 100, border: "none", cursor: "pointer", padding: 0,
                      background: i === idx ? pc.colour : "#d1d5db",
                      transition: "all 0.35s ease",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* COL 2 — Text tile */}
            <div
              onClick={() => navigate(p.route)}
              style={{
                borderRadius: 18,
                background: PROG_PASTEL[idx],
                border: "1px solid #e8e8f0",
                padding: "36px 32px",
                display: "flex", flexDirection: "column",
                justifyContent: "flex-end",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                cursor: "pointer",
                minHeight: 300,
                transition: "background 0.5s ease, box-shadow 0.2s ease",
              }}
            >
              <div style={{
                width: 3, height: 32, borderRadius: 2,
                background: PROG_ACCENT_TEXT[idx],
                marginBottom: 20,
                transition: "background 0.5s ease",
              }} />
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "1.5px",
                textTransform: "uppercase", color: "#94A3B8",
                marginBottom: 10, display: "block",
                transition: "opacity 0.4s ease",
              }}>
                {p.label}
              </span>
              <h3 style={{
                fontSize: 28, fontWeight: 900, color: ACCENT_NAVY,
                letterSpacing: "-0.4px", lineHeight: 1.2,
                margin: "0 0 20px",
              }}>
                {p.title}
              </h3>
              <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
                {[p.stat1, p.stat2].map((s, i) => (
                  <span key={i} style={{
                    fontSize: 11, fontWeight: 700, color: "#475569",
                    background: "rgba(255,255,255,0.7)",
                    padding: "4px 12px", borderRadius: 100,
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}>{s}</span>
                ))}
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 13, fontWeight: 700, color: PROG_ACCENT_TEXT[idx],
                transition: "color 0.5s ease",
              }}>
                Learn more <ArrowRight size={13} />
              </div>
            </div>

            {/* COL 3 — EOEO tile */}
            <div style={{
              borderRadius: 18,
              background: ACCENT_NAVY,
              padding: "28px 22px",
              display: "flex", flexDirection: "column",
              justifyContent: "flex-start",
              gap: 20,
              boxShadow: "0 4px 20px rgba(0,0,0,0.13)",
              position: "relative",
              overflow: "hidden",
              minHeight: 300,
            }}>
              <img src={doodleCluster3} alt="" style={{
                position: "absolute", bottom: -20, right: -30,
                width: 200, opacity: 0.08,
                pointerEvents: "none", userSelect: "none",
                transform: "rotate(-10deg)",
              }} />

              <span style={{
                display: "inline-block", fontSize: 9, fontWeight: 800,
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase", letterSpacing: "1px",
                alignSelf: "flex-start",
              }}>
                {EOEO.tag}
              </span>

              <h3 style={{
                fontSize: 20, fontWeight: 900, color: "white",
                lineHeight: 1.3, margin: 0,
              }}>
                {EOEO.headline}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                {EOEO.steps.map((step) => (
                  <div key={step.num} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 800, color: B_YELLOW,
                      minWidth: 20, marginTop: 1,
                    }}>{step.num}</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.45 }}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href={EOEO.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "12px 0", borderRadius: 10,
                  fontSize: 13, fontWeight: 800, color: ACCENT_NAVY,
                  background: B_YELLOW, textDecoration: "none", cursor: "pointer",
                }}
              >
                {EOEO.cta} <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// JOURNEY SECTION
// Two-row alternating layout (above / spine / below).
// Spine: dashed SVG trail that animates draw-on via stroke-dashoffset.
// Milestone dots stagger-reveal. Geo icons in brand palette colours.
// ─────────────────────────────────────────────────────────────────────────────
export function JourneySection() {
  const navigate    = useAppNavigate();
  const ref         = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // No yellow/orange on icons — using indigo, teal, blue, red
  const milestoneExtra = [
    { metric: "100K+", label: "Sign-ups",   iconFn: GeoIcon.diamond,  iconColour: B_INDIGO },
    { metric: "1st",   label: "Edition",    iconFn: GeoIcon.hexagon,  iconColour: B_TEAL   },
    { metric: "425+",  label: "Projects",   iconFn: GeoIcon.triangle, iconColour: B_BLUE   },
    { metric: "35K",   label: "Volunteers", iconFn: GeoIcon.diamond,  iconColour: B_RED    },
    { metric: "47K",   label: "Volunteers", iconFn: GeoIcon.hexagon,  iconColour: B_INDIGO },
    { metric: "8.02M", label: "Hours",      iconFn: GeoIcon.circle,   iconColour: B_TEAL   },
  ];

  return (
    <section ref={ref} className="section-block" style={{ background: "#F7F9FF" }}>
      <img src={doodleCluster3} alt="" style={{
        position: "absolute", bottom: -10, right: -70, width: 260, opacity: 0.07,
        pointerEvents: "none", userSelect: "none", transform: "rotate(-6deg)",
      }} />
      <img src={doodleCluster1} alt="" style={{
        position: "absolute", top: 10, left: -50, width: 180, opacity: 0.06,
        pointerEvents: "none", userSelect: "none", transform: "rotate(12deg)",
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <div className="section-header">
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.6px", textTransform: "uppercase", color: B_INDIGO, margin: "0 0 8px", opacity: 0.7 }}>
            Our Journey
          </p>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: ACCENT_NAVY, letterSpacing: "-0.5px", margin: 0 }}>
            A decade of giving back
          </h2>
        </div>

        {/* ── DESKTOP: 3-row flex ── */}
        <div className="hidden lg:block">

          {/* ROW 1 — even milestones above spine */}
          <div style={{ display: "flex" }}>
            {JOURNEY_MILESTONES.map((m, i) => {
              const ex = milestoneExtra[i];
              const isAbove = i % 2 === 0;
              return (
                <div
                  key={`top-${i}`}
                  className={`te-jcard up${vis ? " on" : ""}`}
                  style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    alignItems: "center", textAlign: "center", padding: "0 8px",
                    visibility: isAbove ? "visible" : "hidden",
                    transitionDelay: `${i * 0.08}s`,
                  }}
                >
                  {/* Year — prominent */}
                  <div style={{
                    display: "inline-block",
                    fontSize: 22, fontWeight: 900, color: m.colour,
                    letterSpacing: "-0.5px", lineHeight: 1,
                    background: `${m.colour}12`,
                    borderRadius: 8, padding: "4px 10px",
                    marginBottom: 8,
                  }}>
                    {m.year}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: ACCENT_NAVY, lineHeight: 1.3, marginBottom: 4 }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.5, marginBottom: 6 }}>{m.desc}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: m.colour }}>{ex.metric}</div>
                  <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 700 }}>
                    {ex.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SPINE — curved SVG path + dots */}
          {(() => {
            // 6 columns → 6 dot positions evenly spaced across full width
            // SVG: wide aspect, curve arcs up for even-index segments (connecting above→below), down for odd
            const n = JOURNEY_MILESTONES.length;
            const W = 1000, H = 80;
            const xStep = W / (n - 1);
            // Dots sit at y=40 (centre). Curve arcs to y=10 (up) between col 0-1, y=70 (down) between col 1-2, etc.
            const pts = JOURNEY_MILESTONES.map((_, i) => ({ x: i * xStep, y: H / 2 }));
            // Build smooth cubic bezier path through all 6 points with alternating arcs
            let d = `M ${pts[0].x} ${pts[0].y}`;
            for (let i = 0; i < n - 1; i++) {
              const x1 = pts[i].x, x2 = pts[i + 1].x;
              const midX = (x1 + x2) / 2;
              // arc up (negative offset) for even segments (0,2,4), down for odd (1,3)
              const arcY = i % 2 === 0 ? H * 0.18 : H * 0.82;
              d += ` C ${midX} ${arcY}, ${midX} ${arcY}, ${x2} ${pts[i + 1].y}`;
            }
            return (
              <div style={{ position: "relative", margin: "12px 0", height: H }}>
                <svg
                  width="100%" height={H}
                  viewBox={`0 0 ${W} ${H}`}
                  preserveAspectRatio="none"
                  style={{ position: "absolute", top: 0, left: 0 }}
                >
                  <defs>
                    <linearGradient id="jt-spine" x1="0" y1="0" x2="1" y2="0">
                      {JOURNEY_MILESTONES.map((m, i) => (
                        <stop key={i} offset={`${(i / (n - 1)) * 100}%`} stopColor={m.colour} stopOpacity="0.45" />
                      ))}
                    </linearGradient>
                  </defs>
                  <path
                    d={d}
                    fill="none"
                    stroke="url(#jt-spine)"
                    strokeWidth="2"
                    strokeDasharray="6 5"
                    strokeLinecap="round"
                    className={`te-trail${vis ? " on" : ""}`}
                  />
                  {/* Dots */}
                  {JOURNEY_MILESTONES.map((m, i) => (
                    <circle
                      key={i}
                      cx={pts[i].x}
                      cy={pts[i].y}
                      r="5"
                      fill={m.colour}
                      opacity={vis ? 1 : 0}
                      style={{ transition: `opacity 0.35s ease ${i * 0.11}s` }}
                    />
                  ))}
                </svg>
              </div>
            );
          })()}

          {/* ROW 3 — odd milestones below spine */}
          <div style={{ display: "flex" }}>
            {JOURNEY_MILESTONES.map((m, i) => {
              const ex = milestoneExtra[i];
              const isBelow = i % 2 !== 0;
              return (
                <div
                  key={`bot-${i}`}
                  className={`te-jcard down${vis ? " on" : ""}`}
                  style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    alignItems: "center", textAlign: "center", padding: "0 8px",
                    visibility: isBelow ? "visible" : "hidden",
                    transitionDelay: `${i * 0.08}s`,
                  }}
                >
                  <div style={{
                    display: "inline-block",
                    fontSize: 22, fontWeight: 900, color: m.colour,
                    letterSpacing: "-0.5px", lineHeight: 1,
                    background: `${m.colour}12`,
                    borderRadius: 8, padding: "4px 10px",
                    marginBottom: 8,
                  }}>
                    {m.year}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: ACCENT_NAVY, lineHeight: 1.3, marginBottom: 4 }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.5, marginBottom: 6 }}>{m.desc}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: m.colour }}>{ex.metric}</div>
                  <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 700 }}>
                    {ex.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MOBILE: stacked list ── */}
        <div className="lg:hidden" style={{ paddingLeft: 28, position: "relative" }}>
          <div style={{
            position: "absolute", left: 10, top: 0, bottom: 0, width: 2,
            background: `linear-gradient(180deg, ${B_INDIGO}40, ${B_TEAL}40, ${B_RED}40)`,
            borderRadius: 2,
          }} />
          {JOURNEY_MILESTONES.map((m, i) => {
            const ex = milestoneExtra[i];
            return (
              <div key={i} style={{ position: "relative", marginBottom: 20 }}>
                <div style={{
                  position: "absolute", left: -24, top: 6, width: 10, height: 10,
                  borderRadius: "50%", background: m.colour,
                  border: "2px solid white", boxShadow: `0 0 0 2px ${m.colour}30`,
                }} />
                <div style={{ background: "white", borderRadius: 12, padding: "14px 16px", border: "1px solid #e8e8f0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    {ex.iconFn(ex.iconColour, 13)}
                    <span style={{ fontSize: 9, fontWeight: 900, color: m.colour, textTransform: "uppercase", letterSpacing: "1.2px" }}>
                      {m.year}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: ACCENT_NAVY }}>{m.title}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3, lineHeight: 1.5 }}>{m.desc}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: m.colour, marginTop: 6 }}>
                    {ex.metric}{" "}
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
                      {ex.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 44, display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => navigate("journey")}
            className="hover-lift"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 13, fontWeight: 800,
              padding: "12px 28px", borderRadius: 10,
              background: B_INDIGO, color: "white",
              border: "none", cursor: "pointer",
              boxShadow: `0 4px 16px ${B_INDIGO}40`,
            }}
          >
            Read our full story <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NUMBERS SECTION
// Designer's 2fr/1fr grid: big insight panel left, KPI stat + social stacked right.
// No orange on any decorative element. Geo icons on KPI cards.
// B_YELLOW retained ONLY on white-on-dark contrast badges (insight pill, fact dots).
// ─────────────────────────────────────────────────────────────────────────────
export function NumbersSection() {
  const { triggerToast } = useAppContext();
  const [factIdx,    setFactIdx]    = useState(0);
  const [factFading, setFactFading] = useState(false);
  const [socialIdx,  setSocialIdx]  = useState(0);
  const [shimmer,    setShimmer]    = useState(false);
  const [statIdx,    setStatIdx]    = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStatIdx((p) => (p + 1) % HERO_STATS.length), 3500);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => {
      setFactFading(true);
      setTimeout(() => { setFactIdx((p) => (p + 1) % FUN_FACTS.length); setFactFading(false); }, 280);
    }, 5200);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setSocialIdx((p) => (p + 1) % SOCIAL_POSTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const cycleFact = () => {
    setFactFading(true);
    setTimeout(() => { setFactIdx((p) => (p + 1) % FUN_FACTS.length); setFactFading(false); }, 280);
  };

  // Geo icons for stat cards — brand colours, no orange
  const statIcons = [
    { fn: GeoIcon.diamond,  colour: B_INDIGO },
    { fn: GeoIcon.hexagon,  colour: B_TEAL   },
    { fn: GeoIcon.triangle, colour: B_BLUE   },
  ];

  return (
    <section className="section-block" style={{ background: "#ffffff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <div className="section-header">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.6px", textTransform: "uppercase", color: B_INDIGO, margin: "0 0 8px", opacity: 0.7 }}>
                By the numbers
              </p>
              <h2 style={{ fontSize: 30, fontWeight: 900, color: ACCENT_NAVY, letterSpacing: "-0.5px", margin: 0 }}>
                Community Overview
              </h2>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 100,
              background: "white", border: "1px solid #f0f0f5",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}>
              <span className="te-pulse" style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#22c55e", display: "inline-block",
              }} />
              <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Live · Updated 2h ago</span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

          {/* Tile 1 — Insight (dark, no photo) */}
          <div style={{
            borderRadius: 18, position: "relative", overflow: "hidden", minHeight: 280,
            background: ACCENT_NAVY,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
          }}>
            <div style={{
              position: "relative", zIndex: 10, padding: 28,
              display: "flex", flexDirection: "column",
              justifyContent: "space-between", height: "100%", minHeight: 280,
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 10, fontWeight: 800,
                    background: B_YELLOW, color: ACCENT_NAVY,
                    padding: "4px 12px", borderRadius: 100,
                  }}>
                    ✨ Insight
                  </span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    {"\n"}
                  </span>
                </div>
                <p style={{
                  color: "white", fontSize: 22, fontWeight: 700,
                  lineHeight: 1.5, maxWidth: 520,
                  opacity: factFading ? 0 : 1,
                  transition: "opacity 0.28s", margin: 0,
                }}>
                  {FUN_FACTS[factIdx]}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {FUN_FACTS.map((_, i) => (
                    <button key={i}
                      onClick={() => { setFactFading(true); setTimeout(() => { setFactIdx(i); setFactFading(false); }, 280); }}
                      style={{
                        width: i === factIdx ? 18 : 6, height: 4,
                        borderRadius: 100, border: "none", cursor: "pointer", padding: 0,
                        background: i === factIdx ? B_YELLOW : "rgba(255,255,255,0.2)",
                        transition: "all 0.2s",
                      }}
                    />
                  ))}
                </div>
                <button onClick={cycleFact} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 700,
                  background: "none", border: "none", cursor: "pointer",
                }}>
                  <RefreshCw size={11} /> Next
                </button>
              </div>
            </div>
          </div>

          {/* Tile 2 — KPI stat card */}
          <div style={{ position: "relative", minHeight: 280 }}>
            {HERO_STATS.map((s, i) => {
              const sg = statIcons[i];
              return (
                <div key={s.label} style={{
                  display: i === statIdx ? "flex" : "none",
                  flexDirection: "column", justifyContent: "space-between",
                  borderRadius: 18, padding: 28, position: "relative", overflow: "hidden",
                  background: `${s.colour}14`, minHeight: 280,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
                  border: `1px solid ${s.colour}25`,
                }}>
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: s.colour,
                  }} />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <p className="text-zinc-950" style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", margin: 0 }}>
                        {s.label}
                      </p>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: `${s.colour}12`,
                      }}>
                        {sg.fn(sg.colour, 18)}
                      </div>
                    </div>
                    <p style={{ fontSize: 42, fontWeight: 900, color: s.colour, letterSpacing: "-1px", lineHeight: 1, margin: 0 }}>
                      {s.num}
                    </p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: "6px 0 0" }}>{s.sub}</p>
                  </div>
                  <div style={{ display: "flex", gap: 5, justifyContent: "center", marginTop: 12 }}>
                    {HERO_STATS.map((_, j) => (
                      <button key={j} onClick={() => setStatIdx(j)} style={{
                        width: j === statIdx ? 16 : 6, height: 4,
                        borderRadius: 100, border: "none", cursor: "pointer", padding: 0,
                        background: j === statIdx ? s.colour : "#e2e8f0",
                        transition: "all 0.2s",
                      }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tile 3 — Social feed */}
          <div
            style={{
              borderRadius: 18, background: "white", minHeight: 280,
              overflow: "hidden", position: "relative",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
              border: "1px solid #f0f0f5", display: "flex", flexDirection: "column",
            }}
            onMouseEnter={() => setShimmer(true)}
            onMouseLeave={() => setShimmer(false)}
          >
            {shimmer && (
              <div style={{
                position: "absolute", top: 0, bottom: 0, width: "40%",
                background: "linear-gradient(105deg, transparent 0%, rgba(51,51,153,0.04) 45%, rgba(51,51,153,0.06) 50%, rgba(51,51,153,0.04) 55%, transparent 100%)",
                animation: "te-shimmer 0.6s ease-out forwards",
                pointerEvents: "none", zIndex: 5,
              }} />
            )}

            <div style={{
              padding: "16px 20px 12px", borderBottom: "1px solid #f0f0f5",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.8px", color: "#1e293b" }}>
                Social Feed
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                {[{ Icon: Twitter, c: "#0EA5E9" }, { Icon: Instagram, c: "#EC4899" }, { Icon: Linkedin, c: "#1D4ED8" }].map(({ Icon, c }) => (
                  <div key={c} style={{
                    width: 24, height: 24, borderRadius: 6,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${c}12`, cursor: "pointer",
                  }}>
                    <Icon size={10} style={{ color: c }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, padding: "16px 20px" }}>
              {SOCIAL_POSTS.map((post, i) => (
                <div key={i} style={{ display: i === socialIdx ? "block" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: `linear-gradient(135deg, ${post.iconBg}, ${post.iconBg}cc)`,
                    }}>
                      <post.Icon size={13} color="white" />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 800, color: ACCENT_NAVY, margin: 0 }}>{post.handle}</p>
                      <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{post.time} · {post.platform}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.6, margin: 0 }}>{post.text}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>❤️ {post.likes}</span>
                    <button onClick={() => triggerToast("Opening social post...")}
                      style={{ fontSize: 10, fontWeight: 800, color: B_INDIGO, background: "none", border: "none", cursor: "pointer" }}>
                      View →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "0 20px 16px" }}>
              <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 10 }}>
                {SOCIAL_POSTS.map((_, i) => (
                  <button key={i} onClick={() => setSocialIdx(i)} style={{
                    width: i === socialIdx ? 16 : 6, height: 4,
                    borderRadius: 100, border: "none", cursor: "pointer", padding: 0,
                    background: i === socialIdx ? B_INDIGO : "#e2e8f0",
                    transition: "all 0.2s",
                  }} />
                ))}
              </div>
              <button onClick={() => triggerToast("Opening social media...")} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, padding: "9px 0", borderRadius: 10,
                fontSize: 11, fontWeight: 800,
                background: B_INDIGO,
                color: "white", border: "none", cursor: "pointer",
              }}>
                Follow @TataEngage <ArrowRight size={9} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TICKER BAR
// ─────────────────────────────────────────────────────────────────────────────
export function TickerBar({ fixed = false }: { fixed?: boolean }) {
  const tickerDouble = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{
      ...(fixed ? { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50 } : {}),
      padding: "10px 0", overflow: "hidden",
      background: "#3E7EB0",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flexShrink: 0, paddingLeft: 24 }}>
          {/* B_YELLOW LIVE badge — justified: dark background contrast */}
          <span style={{
            fontSize: 11, fontWeight: 900,
            background: B_YELLOW, color: ACCENT_NAVY,
            padding: "3px 12px", borderRadius: 100, whiteSpace: "nowrap",
          }}>
            🔴 LIVE
          </span>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div className="te-marquee">
            {tickerDouble.map((item, i) => (
              <span key={i}
                style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", flexShrink: 0, cursor: "pointer", transition: "color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO BANNER — exported for use in HomeView.tsx
// Full-bleed tata-elxsi.jpg. Pure dark overlay (no colour tint).
// Scroll parallax: image translates up at 0.4× scroll speed.
// DM Serif Display h1. Definer underline on eyebrow. Chevron inside hero.
//
// Usage in HomeView.tsx:
//   <HeroBanner
//     eyebrow="Netscribes × Tata Sons Group"
//     title={<>Volunteering that<br />moves the world</>}
//     description="Connecting 50,000+ Tata employees with meaningful causes across India and beyond."
//     scrollTargetId="programmes"
//   />
// ─────────────────────────────────────────────────────────────────────────────
export function HeroBanner({
  title,
  eyebrow,
  description,
  scrollTargetId = "programmes",
}: {
  title: React.ReactNode;
  eyebrow: string;
  description: string;
  scrollTargetId?: string;
}) {
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!imgRef.current) return;
      imgRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollDown = () =>
    document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{
        position: "relative", overflow: "hidden",
        height: "100vh", minHeight: 600,
        display: "flex", flexDirection: "column",
        alignItems: "flex-start", justifyContent: "center",
      }}>
        {/* Parallax image layer — oversized so parallax never shows gaps */}
        <div
          ref={imgRef}
          style={{
            position: "absolute",
            top: "-20%", left: 0, right: 0, bottom: "-20%",
            backgroundImage: `url(${tataElxsiImg})`,
            backgroundSize: "cover", backgroundPosition: "center",
            willChange: "transform",
          }}
        />

        {/* Pure dark overlay — no blue/purple colour tint */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(155deg, rgba(8,12,22,0.74) 0%, rgba(8,12,22,0.50) 100%)",
        }} />

        {/* Doodle — subtle top right */}
        <img src={doodleCluster4} alt="" style={{
          position: "absolute", top: 40, right: -60, width: 280, opacity: 0.06,
          pointerEvents: "none", userSelect: "none", transform: "rotate(-10deg)",
        }} />

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 10, padding: "0 64px", maxWidth: 760 }}>
          {/* Eyebrow + definer underline */}
          <p style={{
            fontSize: 11, fontWeight: 800, letterSpacing: "2.5px",
            textTransform: "uppercase", color: "rgba(255,255,255,0.5)",
            margin: 0, fontFamily: "'DM Mono', monospace",
          }}>
            {eyebrow}
          </p>
          <DefinerUnderline colour={B_TEAL} width={60} />

          {/* H1 — DM Serif Display */}
          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: 52, lineHeight: 1.1, letterSpacing: "-0.5px",
            color: "white", margin: "18px 0 20px",
          }}>
            {title}
          </h1>

          <p style={{
            fontSize: 16, lineHeight: 1.7, fontWeight: 300,
            color: "rgba(255,255,255,0.65)",
            maxWidth: 520, margin: 0,
          }}>
            {description}
          </p>
        </div>

        {/* Scroll chevrons — inside hero, bottom-centre */}
        <button
          onClick={scrollDown}
          style={{
            position: "absolute", bottom: 40, left: "50%",
            transform: "translateX(-50%)",
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 2, padding: 8, zIndex: 10,
          }}
          aria-label="Scroll down"
        >
          <ChevronDown size={22} color="rgba(255,255,255,0.9)"  className="te-bob-1" />
          <ChevronDown size={22} color="rgba(255,255,255,0.55)" className="te-bob-2" />
          <ChevronDown size={22} color="rgba(255,255,255,0.28)" className="te-bob-3" />
        </button>
      </div>
    </>
  );
}
