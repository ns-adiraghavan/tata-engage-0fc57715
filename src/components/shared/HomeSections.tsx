import { useState, useEffect, useRef } from "react";
import { ArrowRight, ExternalLink, RefreshCw } from "lucide-react";
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

export { SectionDivider };

// ─────────────────────────────────────────────────────────────
// GEOMETRIC ICONS — exact shapes from the brand icon palette.
// Used as inline SVGs inside programme text panels and
// milestone cards. Colours match brand tokens.
// ─────────────────────────────────────────────────────────────
const GeoIcon = {
  // Solid diamond ◆  (TVW)
  diamond: (colour: string, size = 28) => (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <polygon points="50,4 96,50 50,96 4,50" fill={colour} />
    </svg>
  ),
  // Regular hexagon ⬡  (ProEngage)
  hexagon: (colour: string, size = 28) => (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <polygon points="50,4 90,27 90,73 50,96 10,73 10,27" fill={colour} />
    </svg>
  ),
  // Equilateral triangle ▲  (Disaster Response)
  triangle: (colour: string, size = 28) => (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <polygon points="50,6 95,94 5,94" fill={colour} />
    </svg>
  ),
};

// Small tab-pill shape icons (9px)
const TAB_SHAPES = [
  (colour: string) => (
    <svg viewBox="0 0 10 10" width={9} height={9}>
      <polygon points="5,0.5 9.5,5 5,9.5 0.5,5" fill={colour} />
    </svg>
  ),
  (colour: string) => (
    <svg viewBox="0 0 10 10" width={9} height={9}>
      <polygon points="5,0.5 9,2.75 9,7.25 5,9.5 1,7.25 1,2.75" fill={colour} />
    </svg>
  ),
  (colour: string) => (
    <svg viewBox="0 0 10 10" width={9} height={9}>
      <polygon points="5,0.8 9.2,9.2 0.8,9.2" fill={colour} />
    </svg>
  ),
];

// ─────────────────────────────────────────────────────────────
// ANIMATED DEFINER — horizontal underline that sweeps left→right
// under the section eyebrow text on scroll entry.
// ─────────────────────────────────────────────────────────────
function DefinerUnderline({ colour = B_INDIGO, width = 56 }: { colour?: string; width?: number }) {
  const ref   = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        height: 2, width, borderRadius: 2,
        background: "#e8e8f0",   // track colour
        marginTop: 5, overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: on ? "100%" : "0%",
          background: colour,
          borderRadius: 2,
          transition: "width 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION DIVIDER — exported row of mini brand-shape icons
// ─────────────────────────────────────────────────────────────
export function GeoDivider() {
  const items = [
    { fn: GeoIcon.diamond,  colour: B_INDIGO },
    { fn: GeoIcon.hexagon,  colour: B_YELLOW },
    { fn: GeoIcon.triangle, colour: B_RED    },
    { fn: GeoIcon.diamond,  colour: B_TEAL   },
    { fn: GeoIcon.hexagon,  colour: B_BLUE   },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 0" }}>
      {items.map(({ fn, colour }, i) => (
        <span key={i} style={{ opacity: 0.45, display: "flex" }}>
          {fn(colour, 10)}
        </span>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 1. PROGRAMME SPOTLIGHT
//    Tab-switcher (client-preferred layout).
//    • Tabs use brand geo shape icon + programme name.
//    • Active card: coloured pastel text panel, geo icon top-left.
//    • Image: static + subtle dark gradient. NO zoom effect.
//    • EOEO panel in 30% right column (unchanged from original).
//    • Doodle cluster top-right (from assets).
// ─────────────────────────────────────────────────────────────
const PROGRAMME_ROUTE: Record<string, string> = {
  "TVW":               "about-tvw",
  "ProEngage":         "about-proengage",
  "Disaster Response": "disaster-response",
};

export function ProgrammeSpotlight() {
  const navigate      = useAppNavigate();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % FLAGSHIP_PROGRAMMES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const prog  = FLAGSHIP_PROGRAMMES[idx];
  const route = PROGRAMME_ROUTE[prog.id];
  const ICONS = [GeoIcon.diamond, GeoIcon.hexagon, GeoIcon.triangle];

  return (
    <section
      id="programmes"
      style={{ background: "#ffffff", padding: "72px 48px", position: "relative", overflow: "hidden" }}
    >
      {/* Doodle — top right, very subtle */}
      <img
        src={doodleCluster2}
        alt=""
        style={{
          position: "absolute", top: -10, right: -90,
          width: 320, opacity: 0.07,
          pointerEvents: "none", userSelect: "none",
          transform: "rotate(14deg)",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        {/* Section heading + definer */}
        <div style={{ marginBottom: 32 }}>
          <p style={{
            fontSize: 10, fontWeight: 800, letterSpacing: "1.8px",
            textTransform: "uppercase", color: "#94A3B8", margin: 0,
          }}>
            Our Programmes
          </p>
          <DefinerUnderline colour={B_INDIGO} width={68} />
          <h2 style={{ fontSize: 30, fontWeight: 900, color: ACCENT_NAVY, letterSpacing: "-0.5px", margin: "10px 0 0" }}>
            Ways to make a difference
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "stretch" }}>

          {/* LEFT — tabs + main card */}
          <div style={{ display: "flex", flexDirection: "column" }}>

            {/* Tab pills */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {FLAGSHIP_PROGRAMMES.map((p, i) => {
                const active = i === idx;
                return (
                  <button
                    key={p.id}
                    onClick={() => setIdx(i)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      fontSize: 13, fontWeight: 600,
                      padding: "7px 18px", borderRadius: 100,
                      border: `1.5px solid ${active ? p.accentText + "55" : "#e2e8f0"}`,
                      background: active ? p.pastelBg : "white",
                      color: active ? p.accentText : "#94a3b8",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ color: active ? p.accentText : "#CBD5E1", display: "flex" }}>
                      {TAB_SHAPES[i](active ? p.accentText : "#CBD5E1")}
                    </span>
                    {p.id}
                  </button>
                );
              })}
            </div>

            {/* Main programme card */}
            <div
              onClick={() => route && navigate(route)}
              style={{
                display: "flex", flex: 1, minHeight: 380,
                borderRadius: 18, overflow: "hidden",
                border: `1.5px solid ${prog.accentText}22`,
                background: "white", cursor: "pointer",
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                transition: "box-shadow 0.25s, transform 0.25s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  `0 0 0 2px ${prog.accentText}45, 0 12px 36px rgba(0,0,0,0.09)`;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              {/* Image panel — static, NO zoom */}
              <div style={{
                position: "relative", width: "44%", minWidth: 200,
                flexShrink: 0, overflow: "hidden",
              }}>
                <img
                  src={prog.photo}
                  alt={prog.title}
                  referrerPolicy="no-referrer"
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%", objectFit: "cover",
                    // Intentionally no transform/transition — no zoom
                  }}
                />
                {/* Subtle dark gradient overlay — NOT the aggressive colour tint */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(155deg, rgba(13,27,62,0.32) 0%, transparent 50%)",
                }} />
                {/* Label badge */}
                <div style={{ position: "absolute", bottom: 14, left: 14 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: "rgba(255,255,255,0.92)",
                    background: "rgba(0,0,0,0.26)", backdropFilter: "blur(4px)",
                    padding: "4px 10px", borderRadius: 100,
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}>
                    {prog.label}
                  </span>
                </div>
                {/* Stat pills — top left */}
                <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 6 }}>
                  {[prog.stat1, prog.stat2].map((s, i) => (
                    <span key={i} style={{
                      fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.88)",
                      background: "rgba(0,0,0,0.20)", backdropFilter: "blur(4px)",
                      padding: "4px 10px", borderRadius: 100,
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Text panel — coloured pastel background */}
              <div style={{
                flex: 1, padding: "36px 32px",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                background: `linear-gradient(160deg, ${prog.pastelBg} 0%, #ffffff 65%)`,
              }}>
                <div>
                  {/* Geo shape icon from brand palette — top of text panel */}
                  <div style={{ marginBottom: 14, opacity: 0.8 }}>
                    {ICONS[idx](prog.accentText, 30)}
                  </div>

                  {/* Flagship eyebrow pill */}
                  <span style={{
                    display: "inline-block",
                    fontSize: 10, fontWeight: 800, letterSpacing: "0.7px",
                    textTransform: "uppercase",
                    color: prog.accentText, background: prog.pastelBg,
                    border: `1px solid ${prog.accentText}26`,
                    padding: "3px 10px", borderRadius: 100, marginBottom: 14,
                  }}>
                    Flagship Programme
                  </span>

                  <h3 style={{
                    fontSize: 26, fontWeight: 900, color: prog.accentText,
                    letterSpacing: "-0.4px", lineHeight: 1.2, marginBottom: 10,
                  }}>
                    {prog.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, margin: 0 }}>
                    {prog.desc}
                  </p>
                </div>

                <div style={{
                  display: "flex", alignItems: "center", gap: 6, marginTop: 24,
                  fontSize: 13, fontWeight: 700, color: prog.accentText,
                }}>
                  Learn more <ArrowRight size={13} />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — EOEO panel */}
          <div style={{
            background: "white",
            border: `1.5px solid ${EOEO.tagColour}18`,
            borderRadius: 18, overflow: "hidden",
            display: "flex", flexDirection: "column",
            boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
          }}>
            <div style={{ padding: "22px 22px 18px", background: EOEO.tagPastel }}>
              <span style={{
                display: "inline-block", fontSize: 10, fontWeight: 800,
                color: EOEO.tagColour, background: "white",
                padding: "3px 10px", borderRadius: 100,
                border: `1px solid ${EOEO.tagColour}28`, marginBottom: 10,
              }}>
                {EOEO.tag}
              </span>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: ACCENT_NAVY, lineHeight: 1.3, margin: 0 }}>
                {EOEO.headline}
              </h3>
            </div>

            <div style={{ flex: 1, padding: "20px 22px" }}>
              {EOEO.steps.map((step) => (
                <div key={step.num} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: EOEO.tagColour, color: "white",
                    fontSize: 10, fontWeight: 900, flexShrink: 0,
                  }}>
                    {step.num}
                  </span>
                  <p style={{
                    fontSize: 13, fontWeight: 600, color: "#334155",
                    margin: 0, lineHeight: 1.45, paddingTop: 3,
                  }}>
                    {step.label}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ padding: "0 22px 22px" }}>
              <a
                href={EOEO.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  width: "100%", padding: "10px 0", borderRadius: 10,
                  fontSize: 12, fontWeight: 800, color: "white",
                  background: EOEO.tagColour, textDecoration: "none", cursor: "pointer",
                }}
              >
                {EOEO.cta} <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. JOURNEY SECTION
//    Three-row flex layout (above / spine / below).
//    SPINE: animated dashed SVG path — map trail style.
//    Dots stagger-reveal on IntersectionObserver scroll trigger.
//    Milestone cards show geo shape icon above/below the photo.
//    Doodle clusters bottom-right + top-left from assets.
// ─────────────────────────────────────────────────────────────
export function JourneySection() {
  const navigate    = useAppNavigate();
  const sectionRef  = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Extra data per milestone
  const milestoneExtra = [
    { metric: "100K+", metricLabel: "Sign-ups",   icon: GeoIcon.diamond  },
    { metric: "1st",   metricLabel: "Edition",    icon: GeoIcon.hexagon  },
    { metric: "425+",  metricLabel: "Projects",   icon: GeoIcon.triangle },
    { metric: "35K",   metricLabel: "Volunteers", icon: GeoIcon.diamond  },
    { metric: "47K",   metricLabel: "Volunteers", icon: GeoIcon.hexagon  },
    { metric: "8.02M", metricLabel: "Hours",      icon: GeoIcon.triangle },
  ];

  return (
    <section
      ref={sectionRef}
      style={{ background: "#F7F9FF", padding: "72px 48px", position: "relative", overflow: "hidden" }}
    >
      {/* Doodle clusters — very subtle */}
      <img src={doodleCluster3} alt="" style={{
        position: "absolute", bottom: -10, right: -70,
        width: 280, opacity: 0.07,
        pointerEvents: "none", userSelect: "none",
        transform: "rotate(-6deg)",
      }} />
      <img src={doodleCluster1} alt="" style={{
        position: "absolute", top: 10, left: -50,
        width: 200, opacity: 0.06,
        pointerEvents: "none", userSelect: "none",
        transform: "rotate(12deg)",
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        {/* Heading + definer */}
        <div style={{ marginBottom: 48 }}>
          <p style={{
            fontSize: 10, fontWeight: 800, letterSpacing: "1.8px",
            textTransform: "uppercase", color: "#94A3B8", margin: 0,
          }}>
            Our Journey
          </p>
          <DefinerUnderline colour={B_YELLOW} width={52} />
          <h2 style={{ fontSize: 30, fontWeight: 900, color: ACCENT_NAVY, letterSpacing: "-0.5px", margin: "10px 0 0" }}>
            A decade of giving back
          </h2>
        </div>

        {/* ── DESKTOP ── */}
        <div className="hidden lg:block">

          {/* ROW 1 — even-index milestones above spine */}
          <div style={{ display: "flex" }}>
            {JOURNEY_MILESTONES.map((m, i) => {
              const ex = milestoneExtra[i];
              return (
                <div key={`top-${i}`} style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                  textAlign: "center", padding: "0 6px",
                  visibility: i % 2 === 0 ? "visible" : "hidden",
                  opacity: vis ? 1 : 0,
                  transform: vis ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.45s ${i * 0.08}s, transform 0.45s ${i * 0.08}s`,
                }}>
                  {/* Geo icon — brand palette shape */}
                  <div style={{ marginBottom: 6, opacity: 0.75 }}>
                    {ex.icon(m.colour, 18)}
                  </div>
                  <img
                    src={m.photo} alt={m.title} referrerPolicy="no-referrer"
                    style={{
                      width: 52, height: 52, borderRadius: "50%", objectFit: "cover",
                      border: `2.5px solid ${m.colour}`,
                      marginBottom: 8,
                      boxShadow: `0 0 0 4px ${m.colour}18`,
                    }}
                  />
                  <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: "1.4px", textTransform: "uppercase", color: m.colour, marginBottom: 2 }}>
                    {m.year}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: ACCENT_NAVY, lineHeight: 1.3, marginBottom: 3 }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.5 }}>{m.desc}</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: m.colour, marginTop: 5 }}>{ex.metric}</div>
                  <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 700 }}>
                    {ex.metricLabel}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SPINE ROW — dots + dashed map-trail SVG connector */}
          <div style={{ display: "flex", alignItems: "center", margin: "18px 0" }}>
            {JOURNEY_MILESTONES.map((m, i) => (
              <div key={`spine-${i}`} style={{ flex: 1, display: "flex", alignItems: "center" }}>

                {/* Dot — stagger-reveals on scroll */}
                <div style={{
                  flexShrink: 0, width: 14, height: 14, borderRadius: "50%",
                  background: m.colour,
                  border: "2.5px solid white",
                  boxShadow: `0 0 0 3px ${m.colour}28, 0 2px 8px ${m.colour}40`,
                  margin: "0 auto", position: "relative", zIndex: 2,
                  opacity: vis ? 1 : 0,
                  transform: vis ? "scale(1)" : "scale(0.2)",
                  transition: `opacity 0.35s ${i * 0.11}s, transform 0.35s ${i * 0.11}s`,
                }}>
                  <div style={{ position: "absolute", inset: 3, borderRadius: "50%", background: "white" }} />
                </div>

                {/* Dashed SVG trail between dots */}
                {i < JOURNEY_MILESTONES.length - 1 && (
                  <div style={{ flex: 1, position: "relative", height: 8, margin: "0 -1px" }}>
                    <svg
                      width="100%" height="8"
                      viewBox="0 0 100 8"
                      preserveAspectRatio="none"
                      style={{ position: "absolute", top: 0, left: 0 }}
                    >
                      <defs>
                        <linearGradient id={`jtrail-${i}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%"   stopColor={m.colour} stopOpacity="0.55" />
                          <stop offset="100%" stopColor={JOURNEY_MILESTONES[i + 1].colour} stopOpacity="0.55" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 4 L 100 4"
                        fill="none"
                        stroke={`url(#jtrail-${i})`}
                        strokeWidth="2"
                        strokeDasharray="5 4"
                        strokeLinecap="round"
                        style={{
                          strokeDashoffset: vis ? 0 : 200,
                          transition: `stroke-dashoffset 0.9s ${0.15 + i * 0.14}s ease-out`,
                        }}
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ROW 3 — odd-index milestones below spine */}
          <div style={{ display: "flex" }}>
            {JOURNEY_MILESTONES.map((m, i) => {
              const ex = milestoneExtra[i];
              return (
                <div key={`bot-${i}`} style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                  textAlign: "center", padding: "0 6px",
                  visibility: i % 2 !== 0 ? "visible" : "hidden",
                  opacity: vis ? 1 : 0,
                  transform: vis ? "translateY(0)" : "translateY(-12px)",
                  transition: `opacity 0.45s ${i * 0.08}s, transform 0.45s ${i * 0.08}s`,
                }}>
                  <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: "1.4px", textTransform: "uppercase", color: m.colour, marginBottom: 2 }}>
                    {m.year}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: ACCENT_NAVY, lineHeight: 1.3, marginBottom: 3 }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.5 }}>{m.desc}</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: m.colour, marginTop: 5 }}>{ex.metric}</div>
                  <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 700 }}>
                    {ex.metricLabel}
                  </div>
                  <img
                    src={m.photo} alt={m.title} referrerPolicy="no-referrer"
                    style={{
                      width: 52, height: 52, borderRadius: "50%", objectFit: "cover",
                      border: `2.5px solid ${m.colour}`,
                      marginTop: 10,
                      boxShadow: `0 0 0 4px ${m.colour}18`,
                    }}
                  />
                  <div style={{ marginTop: 6, opacity: 0.75 }}>
                    {ex.icon(m.colour, 18)}
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
                  position: "absolute", left: -24, top: 6,
                  width: 10, height: 10, borderRadius: "50%",
                  background: m.colour, border: "2px solid white",
                  boxShadow: `0 0 0 2px ${m.colour}30`,
                }} />
                <div style={{ background: "white", borderRadius: 12, padding: "14px 16px", border: "1px solid #e8e8f0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    {ex.icon(m.colour, 13)}
                    <span style={{ fontSize: 9, fontWeight: 900, color: m.colour, textTransform: "uppercase", letterSpacing: "1.2px" }}>
                      {m.year}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: ACCENT_NAVY }}>{m.title}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3, lineHeight: 1.5 }}>{m.desc}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: m.colour, marginTop: 6 }}>
                    {ex.metric}{" "}
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
                      {ex.metricLabel}
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
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 13, fontWeight: 800,
              padding: "12px 28px", borderRadius: 10,
              background: B_YELLOW, color: ACCENT_NAVY,
              border: "none", cursor: "pointer",
              boxShadow: `0 4px 16px ${B_YELLOW}50`,
            }}
          >
            Read our full story <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. NUMBERS + SOCIAL SECTION
// ─────────────────────────────────────────────────────────────
export function NumbersSection() {
  const { triggerToast } = useAppContext();
  const [factIdx, setFactIdx]       = useState(0);
  const [factFading, setFactFading] = useState(false);
  const [socialIdx, setSocialIdx]   = useState(0);
  const [shimmer, setShimmer]       = useState(false);

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

  return (
    <section style={{ background: "#F0F4FA", padding: "72px 48px", position: "relative", overflow: "hidden" }}>
      {/* Doodle — top right */}
      <img src={doodleCluster4} alt="" style={{
        position: "absolute", top: -20, right: -50,
        width: 260, opacity: 0.07,
        pointerEvents: "none", userSelect: "none",
        transform: "rotate(-12deg) scaleX(-1)",
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        {/* Heading + definer */}
        <div style={{ marginBottom: 36 }}>
          <p style={{
            fontSize: 10, fontWeight: 800, letterSpacing: "1.8px",
            textTransform: "uppercase", color: "#94A3B8", margin: 0,
          }}>
            By the numbers
          </p>
          <DefinerUnderline colour={B_TEAL} width={48} />
          <h2 style={{ fontSize: 30, fontWeight: 900, color: ACCENT_NAVY, letterSpacing: "-0.5px", margin: "10px 0 0" }}>
            The scale of our community
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>

          {/* Did You Know — dark ACCENT_NAVY panel */}
          <div style={{
            borderRadius: 18, overflow: "hidden",
            position: "relative", minHeight: 280,
            background: ACCENT_NAVY,
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse at 78% 18%, ${B_INDIGO}55 0%, transparent 55%)`,
            }} />
            {/* Small doodle inside the panel */}
            <img src={doodleCluster2} alt="" style={{
              position: "absolute", bottom: -8, right: -8,
              width: 90, opacity: 0.09,
              pointerEvents: "none", transform: "rotate(22deg)",
            }} />

            <div style={{
              position: "relative", zIndex: 2,
              padding: 28, display: "flex", flexDirection: "column",
              justifyContent: "space-between", height: "100%", minHeight: 280,
            }}>
              <div>
                <span style={{
                  display: "inline-block", fontSize: 11, fontWeight: 800,
                  background: B_YELLOW, color: ACCENT_NAVY,
                  padding: "4px 12px", borderRadius: 100, marginBottom: 16,
                }}>
                  Did You Know?
                </span>
                <p style={{
                  color: "white", fontSize: 17, fontWeight: 700, lineHeight: 1.5,
                  opacity: factFading ? 0 : 1,
                  transition: "opacity 0.28s",
                  margin: 0,
                }}>
                  {FUN_FACTS[factIdx]}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {FUN_FACTS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setFactFading(true); setTimeout(() => { setFactIdx(i); setFactFading(false); }, 280); }}
                      style={{
                        width: i === factIdx ? 16 : 7, height: 5,
                        borderRadius: 100, border: "none", cursor: "pointer",
                        background: i === factIdx ? B_YELLOW : "rgba(255,255,255,0.22)",
                        padding: 0, transition: "all 0.2s",
                      }}
                    />
                  ))}
                </div>
                <button
                  onClick={cycleFact}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 700,
                    background: "none", border: "none", cursor: "pointer",
                  }}
                >
                  <RefreshCw size={11} /> Next
                </button>
              </div>
            </div>
          </div>

          {/* Stats column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {HERO_STATS.map((s) => (
              <div key={s.label} style={{
                flex: 1, display: "flex", alignItems: "center",
                borderRadius: 16, padding: "20px 20px",
                background: s.pastel,
                borderLeft: `4px solid ${s.colour}`,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <div>
                  <p style={{
                    fontSize: 34, fontWeight: 900, color: s.colour,
                    letterSpacing: "-1px", lineHeight: 1, margin: 0,
                  }}>
                    {s.num}
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: ACCENT_NAVY, margin: "4px 0 2px" }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social Spotlight */}
          <div
            style={{
              borderRadius: 18, padding: "24px",
              background: P_INDIGO,
              border: "1.5px solid #d4d8f5",
              display: "flex", flexDirection: "column",
              position: "relative", overflow: "hidden",
            }}
            onMouseEnter={() => setShimmer(true)}
            onMouseLeave={() => setShimmer(false)}
          >
            {shimmer && (
              <div style={{
                position: "absolute", top: 0, bottom: 0, width: "40%",
                background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.15) 55%, transparent 100%)",
                animation: "te-shimmer 0.6s ease-out forwards",
                pointerEvents: "none", zIndex: 5,
              }} />
            )}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{
                fontSize: 10, fontWeight: 800, letterSpacing: "1.4px",
                textTransform: "uppercase", color: B_INDIGO, opacity: 0.6, margin: 0,
              }}>
                Social Spotlight
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { Icon: Twitter,   c: "#0EA5E9" },
                  { Icon: Instagram, c: "#EC4899" },
                  { Icon: Linkedin,  c: "#1D4ED8" },
                ].map(({ Icon, c }) => (
                  <Icon
                    key={c} size={13}
                    style={{ color: B_INDIGO, opacity: 0.35, cursor: "pointer", transition: "color 0.15s, opacity 0.15s" }}
                    onMouseEnter={(e: React.MouseEvent<SVGSVGElement>) => {
                      (e.currentTarget as SVGSVGElement).style.color   = c;
                      (e.currentTarget as SVGSVGElement).style.opacity = "1";
                    }}
                    onMouseLeave={(e: React.MouseEvent<SVGSVGElement>) => {
                      (e.currentTarget as SVGSVGElement).style.color   = B_INDIGO;
                      (e.currentTarget as SVGSVGElement).style.opacity = "0.35";
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              {SOCIAL_POSTS.map((post, i) => (
                <div key={i} style={{ display: i === socialIdx ? "block" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: post.iconBg, flexShrink: 0,
                    }}>
                      <post.Icon size={13} color="white" />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 800, color: ACCENT_NAVY, margin: 0 }}>{post.handle}</p>
                      <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{post.time} · {post.platform}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: ACCENT_NAVY, lineHeight: 1.6, margin: 0 }}>{post.text}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>❤️ {post.likes} likes</span>
                    <button
                      onClick={() => triggerToast("Opening social post...")}
                      style={{
                        fontSize: 11, fontWeight: 800, color: B_INDIGO,
                        background: "none", border: "none", cursor: "pointer",
                      }}
                    >
                      View post →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 6, justifyContent: "center", margin: "14px 0" }}>
              {SOCIAL_POSTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSocialIdx(i)}
                  style={{
                    width: i === socialIdx ? 16 : 7, height: 5,
                    borderRadius: 100, border: "none", cursor: "pointer",
                    background: i === socialIdx ? B_INDIGO : "#c5c8f0",
                    padding: 0, transition: "all 0.2s",
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => triggerToast("Opening social media...")}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, padding: "9px 0", borderRadius: 10,
                fontSize: 12, fontWeight: 800, color: B_INDIGO,
                background: "transparent", border: "1.5px solid #c5c8f0", cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Follow TataEngage
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes te-shimmer {
          0%   { left: -40%; }
          100% { left: 140%; }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. TICKER BAR
// ─────────────────────────────────────────────────────────────
export function TickerBar({ fixed = false }: { fixed?: boolean }) {
  const tickerDouble = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div
      style={{
        ...(fixed ? { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50 } : {}),
        padding: "10px 0", overflow: "hidden",
        background: `linear-gradient(90deg, ${ACCENT_NAVY} 0%, ${B_INDIGO} 50%, ${ACCENT_NAVY} 100%)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flexShrink: 0, paddingLeft: 24 }}>
          <span style={{
            fontSize: 11, fontWeight: 900,
            background: B_YELLOW, color: ACCENT_NAVY,
            padding: "3px 12px", borderRadius: 100, whiteSpace: "nowrap",
          }}>
            🔴 LIVE
          </span>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div className="te-marquee" style={{ display: "flex", gap: 64, whiteSpace: "nowrap" }}>
            {tickerDouble.map((item, i) => (
              <span
                key={i}
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
      <style>{`
        @keyframes te-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .te-marquee { animation: te-marquee 34s linear infinite; }
        .te-marquee:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
