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

  /* Brand gradient text — indigo → blue → teal (no orange) */
  .gradient-text {
    background: linear-gradient(135deg, ${B_INDIGO} 0%, ${B_BLUE} 50%, ${B_TEAL} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

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

  /* Flip card */
  .flip-card { perspective: 1000px; }
  .flip-card-inner {
    position: relative; width: 100%; height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.55s ease;
  }
  .flip-card:hover .flip-card-inner { transform: rotateY(180deg); }
  .flip-front, .flip-back {
    position: absolute; inset: 0;
    backface-visibility: hidden; -webkit-backface-visibility: hidden;
    border-radius: 18px; overflow: hidden;
  }
  .flip-back { transform: rotateY(180deg); }
  .prog-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
  .prog-card:hover { transform: translateY(-4px); box-shadow: 0 20px 56px rgba(0,0,0,0.22) !important; }

  /* Journey: dashed trail draw-on */
  .te-trail { stroke-dashoffset: 300; transition: stroke-dashoffset 1s ease-out; }
  .te-trail.on { stroke-dashoffset: 0; }

  /* Journey: dot scale-in */
  .te-dot { opacity: 0; transform: scale(0.15); transition: opacity 0.35s ease, transform 0.35s ease; }
  .te-dot.on { opacity: 1; transform: scale(1); }

  /* Journey: card fade-slide */
  .te-jcard { opacity: 0; transition: opacity 0.45s ease, transform 0.45s ease; }
  .te-jcard.up   { transform: translateY(12px);  }
  .te-jcard.down { transform: translateY(-12px); }
  .te-jcard.on   { opacity: 1; transform: translateY(0); }

  /* Stat pulse dot */
  @keyframes te-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
  .te-pulse { animation: te-pulse 2s ease-in-out infinite; }
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
    id: "TVW",              route: "about-tvw",
    bg: B_INDIGO,
    iconFn: GeoIcon.diamond,  iconColour: B_TEAL,
    title: "Tata Volunteering Week",
    label: "Bi-annual · Global",
    stat1: "12 Editions",    stat2: "50K+ Volunteers",
    desc: "A bi-annual celebration of collective action across every Tata company, worldwide.",
    photo: airIndia,         photoPos: "center 40%",
  },
  {
    id: "ProEngage",        route: "about-proengage",
    bg: "#3B1E8E",
    iconFn: GeoIcon.hexagon,  iconColour: B_TEAL,
    title: "ProEngage",
    label: "Skill-based",
    stat1: "1,200+ Projects", stat2: "85 NGO Partners",
    desc: "Match your professional expertise to NGO projects that need it most.",
    photo: tataCommunications, photoPos: "center top",
  },
  {
    id: "Disaster Response", route: "disaster-response",
    bg: "#8B1A1A",
    iconFn: GeoIcon.triangle, iconColour: B_BLUE,
    title: "Disaster Response",
    label: "Rapid Action",
    stat1: "24 Responses",   stat2: "8 States",
    desc: "Volunteers deployed within 48 hours when communities need urgent support.",
    photo: infiniti,         photoPos: "center 30%",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
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
            <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "1.8px", textTransform: "uppercase", color: "#94A3B8", margin: 0 }}>
              Our Programmes
            </p>
            <DefinerUnderline colour={B_INDIGO} width={68} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 260px", gap: 20, alignItems: "stretch" }}>

            {/* LEFT — standalone photo card (EOEO hero style) */}
            <div style={{
              borderRadius: 18, overflow: "hidden", position: "relative",
              boxShadow: "0 4px 24px rgba(0,0,0,0.14)", cursor: "default",
              minHeight: 400,
            }}>
              {/* Full-bleed photo */}
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `url(${tataElxsiImg})`,
                backgroundSize: "cover", backgroundPosition: "center 20%",
              }} />
              {/* Dark overlay — heavier at bottom */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.10) 100%)",
              }} />
              {/* Text — anchored to bottom */}
              <div style={{
                position: "relative", zIndex: 2,
                padding: "32px 28px",
                height: "100%", minHeight: 400,
                display: "flex", flexDirection: "column", justifyContent: "flex-end",
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "1.5px",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.55)",
                  marginBottom: 8, display: "block",
                }}>
                  Each One Empowers One
                </span>
                <h3 style={{
                  fontSize: 26, fontWeight: 900, color: "white",
                  letterSpacing: "-0.3px", lineHeight: 1.2, margin: "0 0 6px",
                }}>
                  Become a TCS Literacy Champion
                </h3>
                <p style={{
                  fontSize: 13, color: "rgba(255,255,255,0.72)",
                  lineHeight: 1.6, margin: 0,
                }}>
                  Building foundation for livelihood
                </p>
              </div>
            </div>

            {/* MIDDLE — single cycling flip card */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                className="flip-card prog-card"
                onClick={() => navigate(p.route)}
                style={{
                  flex: 1, borderRadius: 18, overflow: "hidden",
                  background: p.bg, cursor: "pointer", position: "relative",
                  minHeight: 400, boxShadow: "0 4px 24px rgba(0,0,0,0.14)",
                  transition: "background 0.45s ease",
                }}
              >
                <div className="flip-card-inner">
                  {/* Front face */}
                  <div className="flip-front" style={{ background: p.bg, position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(155deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.14) 100%)" }} />
                    <div style={{ position: "relative", zIndex: 2, padding: "36px 36px 32px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                      <div style={{ marginBottom: 20 }}>
                        {p.iconFn(p.iconColour, 38)}
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "1.2px",
                        textTransform: "uppercase", color: "rgba(255,255,255,0.55)",
                      }}>
                        {p.label}
                      </span>
                      <h3 style={{
                        fontSize: 36, fontWeight: 900, color: "white",
                        letterSpacing: "-0.4px", lineHeight: 1.2, margin: "10px 0 0",
                      }}>
                        {p.title}
                      </h3>
                    </div>
                  </div>

                  {/* Back face */}
                  <div className="flip-back" style={{ background: p.bg, position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(155deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.28) 100%)" }} />
                    <div style={{ position: "relative", zIndex: 2, padding: "36px 36px 32px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                          <span style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: "1.2px",
                            textTransform: "uppercase", color: "rgba(255,255,255,0.55)",
                          }}>
                            {p.label}
                          </span>
                          <h3 style={{
                            fontSize: 20, fontWeight: 800, color: "white",
                            letterSpacing: "-0.4px", lineHeight: 1.2, margin: "8px 0 16px",
                          }}>
                            {p.title}
                          </h3>
                          <p style={{
                            fontSize: 14, color: "rgba(255,255,255,0.82)",
                            lineHeight: 1.65, margin: 0,
                          }}>
                            {p.desc}
                          </p>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ display: "flex", gap: 8 }}>
                            {[p.stat1, p.stat2].map((s, i) => (
                              <span key={i} style={{
                                fontSize: 11, fontWeight: 700,
                                color: "rgba(255,255,255,0.88)",
                                background: "rgba(255,255,255,0.13)",
                                backdropFilter: "blur(4px)",
                                padding: "4px 11px", borderRadius: 100,
                                border: "1px solid rgba(255,255,255,0.16)",
                              }}>{s}</span>
                            ))}
                          </div>
                          <div style={{
                            display: "flex", alignItems: "center", gap: 6,
                            fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.72)",
                          }}>
                            Learn more <ArrowRight size={13} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Dot indicators — no text labels */}
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
                {PROG_CONFIG.map((pc, i) => (
                  <button
                    key={i}
                    onClick={() => resetTimer(i)}
                    style={{
                      width: i === idx ? 24 : 8, height: 8,
                      borderRadius: 100, border: "none", cursor: "pointer", padding: 0,
                      background: i === idx ? pc.bg : "#d1d5db",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT — EOEO: headline + CTA only */}
            <div style={{
              borderRadius: 18,
              background: P_INDIGO,
              border: `1.5px solid ${B_INDIGO}18`,
              display: "flex", flexDirection: "column",
              padding: "28px 22px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
              justifyContent: "flex-start",
              gap: 24,
            }}>
              <span style={{
                display: "inline-block", fontSize: 9, fontWeight: 800,
                color: B_INDIGO, background: "white",
                padding: "3px 9px", borderRadius: 100,
                border: `1px solid ${B_INDIGO}25`,
                textTransform: "uppercase", letterSpacing: "0.8px",
                alignSelf: "flex-start",
              }}>
                {EOEO.tag}
              </span>

              <h3 style={{
                fontSize: 19, fontWeight: 900, color: ACCENT_NAVY,
                lineHeight: 1.3, margin: 0,
              }}>
                {EOEO.headline}
              </h3>

              <a
                href={EOEO.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "12px 0", borderRadius: 10,
                  fontSize: 13, fontWeight: 800, color: "white",
                  background: B_INDIGO, textDecoration: "none", cursor: "pointer",
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
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "1.8px", textTransform: "uppercase", color: "#94A3B8", margin: 0 }}>
            Our Journey
          </p>
          <DefinerUnderline colour={B_TEAL} width={52} />
          <h2 style={{ fontSize: 30, fontWeight: 900, color: ACCENT_NAVY, letterSpacing: "-0.5px", margin: "10px 0 0" }}>
            A decade of <span className="gradient-text">giving back</span>
          </h2>
        </div>

        {/* ── DESKTOP: 3-row flex ── */}
        <div className="hidden lg:block">

          {/* ROW 1 — even milestones above spine */}
          <div style={{ display: "flex" }}>
            {JOURNEY_MILESTONES.map((m, i) => {
              const ex = milestoneExtra[i];
              return (
                <div
                  key={`top-${i}`}
                  className={`te-jcard up${vis ? " on" : ""}`}
                  style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    alignItems: "center", textAlign: "center", padding: "0 6px",
                    visibility: i % 2 === 0 ? "visible" : "hidden",
                    transitionDelay: `${i * 0.08}s`,
                  }}
                >
                  <div style={{ marginBottom: 6 }}>{ex.iconFn(ex.iconColour, 18)}</div>
                  <img src={m.photo} alt={m.title} referrerPolicy="no-referrer" style={{
                    width: 52, height: 52, borderRadius: "50%", objectFit: "cover",
                    border: `2.5px solid ${m.colour}`, marginBottom: 8,
                    boxShadow: `0 0 0 4px ${m.colour}18`,
                  }} />
                  <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: "1.4px", textTransform: "uppercase", color: m.colour, marginBottom: 2 }}>
                    {m.year}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: ACCENT_NAVY, lineHeight: 1.3, marginBottom: 3 }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.5 }}>{m.desc}</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: m.colour, marginTop: 5 }}>{ex.metric}</div>
                  <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 700 }}>
                    {ex.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SPINE — dots + dashed SVG trail (draws on scroll) */}
          <div style={{ display: "flex", alignItems: "center", margin: "18px 0" }}>
            {JOURNEY_MILESTONES.map((m, i) => (
              <div key={`spine-${i}`} style={{ flex: 1, display: "flex", alignItems: "center" }}>

                {/* Dot — scale-in on scroll */}
                <div
                  className={`te-dot${vis ? " on" : ""}`}
                  style={{
                    flexShrink: 0, width: 14, height: 14, borderRadius: "50%",
                    background: m.colour, border: "2.5px solid white",
                    boxShadow: `0 0 0 3px ${m.colour}28, 0 2px 8px ${m.colour}40`,
                    margin: "0 auto", position: "relative", zIndex: 2,
                    transitionDelay: `${i * 0.11}s`,
                  }}
                >
                  <div style={{ position: "absolute", inset: 3, borderRadius: "50%", background: "white" }} />
                </div>

                {/* Dashed trail — fixed viewBox so dashes always render */}
                {i < JOURNEY_MILESTONES.length - 1 && (
                  <div style={{ flex: 1, position: "relative", height: 12, margin: "0 -1px" }}>
                    <svg
                      width="100%" height="12"
                      viewBox="0 0 200 12"
                      preserveAspectRatio="none"
                      style={{ position: "absolute", top: 0, left: 0 }}
                    >
                      <defs>
                        <linearGradient id={`jt-${i}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%"   stopColor={m.colour}                          stopOpacity="0.6" />
                          <stop offset="100%" stopColor={JOURNEY_MILESTONES[i + 1].colour} stopOpacity="0.6" />
                        </linearGradient>
                      </defs>
                      {/* line element — dashes guaranteed to show */}
                      <line
                        x1="2" y1="6" x2="198" y2="6"
                        stroke={`url(#jt-${i})`}
                        strokeWidth="2.5"
                        strokeDasharray="7 5"
                        strokeLinecap="round"
                        className={`te-trail${vis ? " on" : ""}`}
                        style={{ transitionDelay: `${0.15 + i * 0.14}s` }}
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ROW 3 — odd milestones below spine */}
          <div style={{ display: "flex" }}>
            {JOURNEY_MILESTONES.map((m, i) => {
              const ex = milestoneExtra[i];
              return (
                <div
                  key={`bot-${i}`}
                  className={`te-jcard down${vis ? " on" : ""}`}
                  style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    alignItems: "center", textAlign: "center", padding: "0 6px",
                    visibility: i % 2 !== 0 ? "visible" : "hidden",
                    transitionDelay: `${i * 0.08}s`,
                  }}
                >
                  <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: "1.4px", textTransform: "uppercase", color: m.colour, marginBottom: 2 }}>
                    {m.year}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: ACCENT_NAVY, lineHeight: 1.3, marginBottom: 3 }}>
                    {m.title}
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.5 }}>{m.desc}</div>
                  <div style={{ fontSize: 17, fontWeight: 900, color: m.colour, marginTop: 5 }}>{ex.metric}</div>
                  <div style={{ fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 700 }}>
                    {ex.label}
                  </div>
                  <img src={m.photo} alt={m.title} referrerPolicy="no-referrer" style={{
                    width: 52, height: 52, borderRadius: "50%", objectFit: "cover",
                    border: `2.5px solid ${m.colour}`, marginTop: 10,
                    boxShadow: `0 0 0 4px ${m.colour}18`,
                  }} />
                  <div style={{ marginTop: 6 }}>{ex.iconFn(ex.iconColour, 18)}</div>
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
    <section className="section-block" style={{ background: "#f8faff" }}>
      <img src={doodleCluster3} alt="" style={{
        position: "absolute", top: -10, right: -200, width: 460, opacity: 0.15,
        pointerEvents: "none", userSelect: "none",
        transform: "scaleX(-1) scaleY(-1) rotate(3deg)",
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <div className="section-header">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "1.8px", textTransform: "uppercase", color: "#94A3B8", margin: 0 }}>
                By the numbers
              </p>
              <DefinerUnderline colour={B_TEAL} width={48} />
              <h2 style={{ fontSize: 30, fontWeight: 900, color: ACCENT_NAVY, letterSpacing: "-0.5px", margin: "10px 0 0" }}>
                Community <span className="gradient-text">Overview</span>
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

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>

          {/* LEFT — insight / did you know panel, dark with tata-elxsi image */}
          <div style={{
            borderRadius: 18, position: "relative", overflow: "hidden", minHeight: 300,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
            border: "1px solid #f0f0f5",
          }}>
            <img src={tataElxsiImg} alt="" style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            }} />
            {/* Dark overlay — pure dark, no colour tint */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg, rgba(13,27,62,0.90), rgba(13,27,62,0.72))",
            }} />

            <div style={{
              position: "relative", zIndex: 10, padding: 36,
              display: "flex", flexDirection: "column",
              justifyContent: "space-between", height: "100%", minHeight: 300,
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  {/* B_YELLOW badge — justified: white text needs contrast on dark bg */}
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 10, fontWeight: 800,
                    background: B_YELLOW, color: ACCENT_NAVY,
                    padding: "4px 12px", borderRadius: 100,
                  }}>
                    ✨ Insight
                  </span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                    Auto-rotating
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
                        /* B_YELLOW active dot — contrast on dark */ 
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

          {/* RIGHT — rotating KPI card + social feed */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* KPI stat card — rotates every 3.5s */}
            <div style={{ position: "relative" }}>
              {HERO_STATS.map((s, i) => {
                const sg = statIcons[i];
                return (
                  <div key={s.label} style={{
                    display: i === statIdx ? "block" : "none",
                    borderRadius: 18, padding: 22, position: "relative", overflow: "hidden",
                    background: "white",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
                    border: "1px solid #f0f0f5",
                  }}>
                    {/* Colour top bar */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 3,
                      background: `linear-gradient(90deg, ${s.colour}, ${s.colour}70)`,
                    }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", margin: 0 }}>
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
                    <p style={{ fontSize: 34, fontWeight: 900, color: s.colour, letterSpacing: "-1px", lineHeight: 1, margin: 0 }}>
                      {s.num}
                    </p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: "6px 0 0" }}>{s.sub}</p>
                    <svg style={{ marginTop: 12, width: "100%", height: 24 }} viewBox="0 0 100 20" preserveAspectRatio="none">
                      <path
                        d={`M0 18 Q10 ${16 - i * 2},20 ${14 - i} T40 ${12 - i} T60 ${10 - i * 2} T80 ${6 + i} T100 ${4 - i}`}
                        fill="none" stroke={s.colour} strokeWidth="1.5" strokeLinecap="round" opacity="0.3"
                      />
                      <path
                        d={`M0 18 Q10 ${16 - i * 2},20 ${14 - i} T40 ${12 - i} T60 ${10 - i * 2} T80 ${6 + i} T100 ${4 - i} L100 20 L0 20 Z`}
                        fill={`${s.colour}08`}
                      />
                    </svg>
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

            {/* Social feed */}
            <div
              style={{
                borderRadius: 18, background: "white", flex: 1,
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
                  background: `linear-gradient(135deg, ${B_INDIGO}, ${B_BLUE})`,
                  color: "white", border: "none", cursor: "pointer",
                }}>
                  Follow @TataEngage <ArrowRight size={9} />
                </button>
              </div>
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
      background: "#4A90C4",
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
