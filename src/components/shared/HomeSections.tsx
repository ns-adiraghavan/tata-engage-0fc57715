import { useState, useEffect, useRef } from "react";
import { ArrowRight, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Twitter, Instagram, Linkedin } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import {
  B_INDIGO, B_YELLOW, B_RED, B_TEAL, B_BLUE, B_TICKER,
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
import drPhoto from "@/assets/dr_photo.jpg";
import tajSatsImg from "@/assets/tata-motors-2.jpg";
import titanImg from "@/assets/titain.jpeg";

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

  /* Definer underline — track + animated fill (thinner: 2px → 1.4px, rounded to 1px for hero) */
  .te-definer-track {
    height: 1.4px; border-radius: 2px;
    background: #e8e8f0; margin-top: 5px; overflow: hidden;
  }
  .te-definer-fill {
    height: 100%; border-radius: 2px; width: 0%;
    transition: width 0.65s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .te-definer-fill.on { width: 100%; }

  /* Definer draw animation — for section headings */
  @keyframes te-draw {
    from { width: 0%; }
    to   { width: 100%; }
  }
  .te-draw { animation: te-draw 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

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

  /* CVP/EOI card mini-scroll indicator */
  .prog-extra-dot {
    width: 5px; height: 5px; border-radius: 50%;
    display: inline-block;
    transition: all 0.3s;
  }
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
    colour: "#3E7EB0",    // Ticker Blue
    photo: airIndia, photoPos: "center 25%",
  },
  {
    id: "ProEngage", route: "about-proengage",
    title: "ProEngage",
    label: "Skill-based · Year-round",
    stat1: "1,200+ Projects", stat2: "85 NGO Partners",
    colour: "#3D9970",    // Lighter green — design kit
    photo: tataCommunications, photoPos: "center center",
  },
  {
    id: "Disaster Response", route: "disaster-response",
    title: "Disaster Response",
    label: "Rapid Action",
    stat1: "24 Responses", stat2: "8 States",
    colour: "#00A896",    // Teal (B_TEAL)
    photo: drPhoto, photoPos: "center 20%",
  },
];

const PROG_PASTEL = ["#3E7EB0", "#3D9970", "#00A896"];
const PROG_ACCENT_TEXT = ["#ffffff", "#ffffff", "#ffffff"];
const PROG_SUBS = [
  "Volunteering together, amplifying community impact",
  "Where professional expertise creates lasting change.",
  "Standing together when communities need it most.",
];

//
// PROGRAMME SPOTLIGHT
// Single card, auto-cycles every 5s. Dot indicators only (no text labels).
// Merged image+text tile (angled cut on left). Two right boxes: CVP + EOI.
// ─────────────────────────────────────────────────────────────────────────────
export function ProgrammeSpotlight() {
  const navigate        = useAppNavigate();
  const [idx, setIdx]   = useState(0);
  const [rightBox, setRightBox] = useState(0); // 0 = CVP, 1 = EOI
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

          {/* ── Section header ── */}
          <div className="section-header">
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.6px", textTransform: "uppercase", color: B_INDIGO, margin: "0 0 8px", opacity: 0.7 }}>
              Our Programmes
            </p>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: ACCENT_NAVY, letterSpacing: "-0.5px", margin: 0 }}>
              Volunteering Opportunities
            </h2>
            <div style={{ width: 120, height: 1.4, borderRadius: 2, background: "#e8e8f0", marginTop: 10, overflow: "hidden" }}>
              <div className="te-draw" style={{ height: "100%", background: B_INDIGO, borderRadius: 2 }} />
            </div>
          </div>

          {/* ── Main grid: [merged-tile, right-col] ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 16, alignItems: "start" }}>

            {/* LEFT col: merged image+text tile + dots */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Merged image + text tile */}
              <div
                onClick={() => navigate(p.route)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 0.9fr",
                  gap: 0,
                  minHeight: 340,
                  borderRadius: 18,
                  overflow: "hidden",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
                  cursor: "pointer",
                }}
              >
                {/* Image portion — angled right edge (juts left into text) */}
                <div
                  className="prog-img-card"
                  style={{
                    position: "relative",
                    clipPath: "polygon(0 0, 100% 0, 88% 100%, 0 100%)",
                    zIndex: 1,
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
  
                </div>

                {/* Text portion */}
                <div style={{
                  background: PROG_PASTEL[idx],
                  padding: "36px 28px 36px 16px",
                  display: "flex", flexDirection: "column",
                  justifyContent: "center",
                  transition: "background 0.5s ease",
                }}>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h3 style={{
                      fontSize: 28, fontWeight: 900, color: "#ffffff",
                      letterSpacing: "-0.4px", lineHeight: 1.2, margin: "0 0 8px",
                    }}>
                      {p.title}
                    </h3>
                    <div style={{ width: 40, height: 2, background: "rgba(255,255,255,0.6)", borderRadius: 1, margin: "6px 0 10px" }} />
                    <p style={{
                      fontSize: 13, color: "rgba(255,255,255,0.8)",
                      lineHeight: 1.5, margin: "0 0 0",
                    }}>
                      {PROG_SUBS[idx]}
                    </p>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#ffffff" }}>
                      Learn more <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dot indicators below merged tile */}
              <div style={{ display: "flex", gap: 8, paddingLeft: 4 }}>
                {PROG_CONFIG.map((pc, i) => (
                  <button
                    key={i}
                    onClick={() => resetTimer(i)}
                    style={{
                      width: i === idx ? 24 : 8, height: 7,
                      borderRadius: 100, border: "none", cursor: "pointer", padding: 0,
                      background: i === idx ? pc.colour : "#d1d5db",
                      transition: "all 0.35s ease",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT col: 2 full tiles with chevron navigation */}
            <div style={{ position: "relative", overflow: "hidden", borderRadius: 14, minHeight: 340 }}>

              {/* Tile 0 — CVP (yellow) */}
              <div style={{
                position: "absolute", inset: 0,
                background: B_YELLOW,
                padding: "28px 20px 16px",
                display: "flex", flexDirection: "column",
                justifyContent: "center",
                borderRadius: 14,
                opacity: rightBox === 0 ? 1 : 0,
                transform: rightBox === 0 ? "translateY(0)" : "translateY(-24px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                pointerEvents: rightBox === 0 ? "auto" : "none",
              }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h3 style={{
                    fontSize: 22, fontWeight: 900, color: "#ffffff",
                    lineHeight: 1.2, margin: "0 0 8px", letterSpacing: "-0.4px",
                  }}>
                    Company Volunteering Programme (CVP)
                  </h3>
                  <div style={{ width: 40, height: 2, background: "rgba(255,255,255,0.6)", borderRadius: 1, margin: "6px 0 10px" }} />
                  <p style={{
                    fontSize: 13, color: "rgba(255,255,255,0.8)",
                    lineHeight: 1.5, margin: "0 0 0",
                  }}>
                    Company led volunteering programme or opportunities customised for operating context and needs of the local communities
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#ffffff" }}>
                    Learn More <ArrowRight size={13} />
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setRightBox(1); }}
                    style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: `${ACCENT_NAVY}18`, border: `1px solid ${ACCENT_NAVY}28`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: ACCENT_NAVY,
                    }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>

              {/* Tile 1 — EOI (pink) */}
              <div style={{
                position: "absolute", inset: 0,
                background: "#F2778A",
                padding: "28px 20px 16px",
                display: "flex", flexDirection: "column",
                justifyContent: "center",
                borderRadius: 14,
                opacity: rightBox === 1 ? 1 : 0,
                transform: rightBox === 1 ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                pointerEvents: rightBox === 1 ? "auto" : "none",
              }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h3 style={{
                    fontSize: 22, fontWeight: 900, color: "#ffffff",
                    lineHeight: 1.2, margin: "0 0 8px", letterSpacing: "-0.4px",
                  }}>
                    Employees' Own Initiatives (EOI)
                  </h3>
                  <div style={{ width: 40, height: 2, background: "rgba(255,255,255,0.6)", borderRadius: 1, margin: "6px 0 10px" }} />
                  <p style={{
                    fontSize: 13, color: "rgba(255,255,255,0.8)",
                    lineHeight: 1.5, margin: "0 0 0",
                  }}>
                    Empowering employees to volunteer their way for causes close to their heart
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#ffffff" }}>
                    Learn More <ArrowRight size={13} />
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setRightBox(0); }}
                    style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: "#F9A8D460", border: "1px solid #F9A8D4",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: "#9D174D",
                    }}
                  >
                    <ChevronUp size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

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

  const milestones = JOURNEY_MILESTONES;

  return (
    <section ref={ref} className="section-block" style={{
      backgroundImage: `url(${titanImg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative", overflow: "hidden",
      padding: "72px 48px",
    }}>
      {/* Dark overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(5,5,20,0.60) 0%, rgba(5,5,20,0.54) 100%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>

        {/* Header + train icon row */}
        <div style={{ marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.6px", textTransform: "uppercase", color: "#ffffff", margin: "0 0 8px" }}>
              Our Journey
            </p>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: "white", letterSpacing: "-0.5px", margin: 0 }}>
              A Decade of Giving Back
            </h2>
            <div style={{ width: 48, height: 1.4, borderRadius: 2, background: B_YELLOW, marginTop: 10 }} />
          </div>


        </div>

        {/* ── DESKTOP: Train track ── */}
        <div className="hidden lg:block">

          {/* ROW 1 — even milestones above track: year + title stacked, then stem down */}
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            {milestones.map((m, i) => {
              const isAbove = i % 2 === 0;
              return (
                <div
                  key={`top-${i}`}
                  style={{
                    flex: 1,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", textAlign: "center",
                    visibility: isAbove ? "visible" : "hidden",
                    minHeight: 100,
                    opacity: vis ? 1 : 0,
                    transform: vis ? "translateY(0)" : "translateY(-10px)",
                    transition: `opacity 0.45s ease ${i * 0.09}s, transform 0.45s ease ${i * 0.09}s`,
                  }}
                >
                  {/* Year — same column as title */}
                  <span style={{
                    fontSize: 18, fontWeight: 900, color: m.colour,
                    background: `${m.colour}14`,
                    borderRadius: 5, padding: "2px 7px",
                    letterSpacing: "-0.3px", marginBottom: 5,
                    display: "inline-block",
                  }}>
                    {m.year}
                  </span>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "white", lineHeight: 1.3, marginBottom: 8 }}>
                    {m.title}
                  </div>
                  {/* Stem line down to track */}
                  <div style={{
                    width: 1.5, flex: 1, minHeight: 16,
                    background: `linear-gradient(to bottom, ${m.colour}, ${m.colour}44)`,
                    opacity: vis ? 1 : 0,
                    transition: `opacity 0.55s ease ${i * 0.09 + 0.25}s`,
                  }} />
                </div>
              );
            })}
          </div>

          {/* TRACK — single thin line */}
          <div style={{ position: "relative", height: 18 }}>
            <svg width="100%" height="18" viewBox="0 0 1000 18" preserveAspectRatio="none"
              style={{ position: "absolute", top: 0, left: 0 }}>
              {/* Single thin line */}
              <line x1="0" y1="9" x2="1000" y2="9" stroke="rgba(255,255,255,0.30)" strokeWidth="1.2" />
              {/* Milestone dots */}
              {milestones.map((m, i) => {
                const cx = (i / (milestones.length - 1)) * 1000;
                return (
                  <circle key={i} cx={cx} cy="9" r="5"
                    fill={m.colour} stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"
                    opacity={vis ? 1 : 0}
                    style={{ transition: `opacity 0.35s ease ${i * 0.1 + 0.35}s` }}
                  />
                );
              })}
            </svg>
          </div>

          {/* ROW 3 — odd milestones below track: stem up then year + title */}
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            {milestones.map((m, i) => {
              const isBelow = i % 2 !== 0;
              return (
                <div
                  key={`bot-${i}`}
                  style={{
                    flex: 1,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", textAlign: "center",
                    visibility: isBelow ? "visible" : "hidden",
                    minHeight: 100,
                    opacity: vis ? 1 : 0,
                    transform: vis ? "translateY(0)" : "translateY(10px)",
                    transition: `opacity 0.45s ease ${i * 0.09}s, transform 0.45s ease ${i * 0.09}s`,
                  }}
                >
                  {/* Stem from track down */}
                  <div style={{
                    width: 1.5, flex: 1, minHeight: 16,
                    background: `linear-gradient(to bottom, ${m.colour}44, ${m.colour})`,
                    opacity: vis ? 1 : 0,
                    transition: `opacity 0.55s ease ${i * 0.09 + 0.25}s`,
                  }} />
                  {/* Year — same column as title */}
                  <span style={{
                    fontSize: 18, fontWeight: 900, color: m.colour,
                    background: `${m.colour}14`,
                    borderRadius: 5, padding: "2px 7px",
                    letterSpacing: "-0.3px", marginTop: 8, marginBottom: 4,
                    display: "inline-block",
                  }}>
                    {m.year}
                  </span>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "white", lineHeight: 1.3 }}>
                    {m.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className="lg:hidden" style={{ paddingLeft: 24, position: "relative" }}>
          <div style={{
            position: "absolute", left: 8, top: 0, bottom: 0, width: 1.5,
            background: `linear-gradient(180deg, ${B_TICKER}60, ${B_TEAL}60)`,
          }} />
          {milestones.map((m, i) => (
            <div key={i} style={{ position: "relative", marginBottom: 18 }}>
              <div style={{
                position: "absolute", left: -20, top: 6, width: 8, height: 8,
                borderRadius: "50%", background: m.colour,
              }} />
              <span style={{ fontSize: 16, fontWeight: 900, color: m.colour }}>{m.year}</span>
              <div style={{ fontSize: 12, fontWeight: 800, color: "white", marginTop: 2 }}>{m.title}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => navigate("journey")}
            className="hover-lift"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 13, fontWeight: 800,
              padding: "12px 28px", borderRadius: 10,
              background: B_TICKER, color: "white",
              border: "none", cursor: "pointer",
              boxShadow: `0 4px 16px ${B_TICKER}40`,
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
// 3-column: "Did you know?" insight (dark) | KPI stat cards (mustard, varied text) | Social feed
// Consistent block headers across all three tiles.
// ─────────────────────────────────────────────────────────────────────────────


export function NumbersSection() {
  const { triggerToast } = useAppContext();
  const [factIdx,    setFactIdx]    = useState(0);
  const [factFading, setFactFading] = useState(false);
  const [socialIdx,  setSocialIdx]  = useState(0);
  const [shimmer,    setShimmer]    = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSocialIdx((p) => (p + 1) % SOCIAL_POSTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const cycleFact = () => {
    setFactFading(true);
    setTimeout(() => { setFactIdx((p) => (p + 1) % FUN_FACTS.length); setFactFading(false); }, 280);
  };

  // Shared block header style — eyebrow label above each tile
  const blockEyebrow = (label: string, dark = false) => (
    <span style={{
      fontSize: 10, fontWeight: 800, letterSpacing: "1.4px",
      textTransform: "uppercase",
      color: dark ? "#ffffff" : "#64748b",
      display: "block",
      marginBottom: 10,
    }}>
      {label}
    </span>
  );

  return (
    <section className="section-block" style={{ background: "#ffffff", padding: "48px 48px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <div className="section-header">
          <div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.6px", textTransform: "uppercase", color: B_INDIGO, margin: "0 0 8px", opacity: 0.7 }}>
                By the numbers
              </p>
              <h2 style={{ fontSize: 30, fontWeight: 900, color: ACCENT_NAVY, letterSpacing: "-0.5px", margin: 0 }}>
                In the Spotlight
              </h2>
              <div style={{ width: 48, height: 1.4, borderRadius: 2, background: B_TEAL, marginTop: 10 }} />
            </div>

          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, alignItems: "center" }}>

          {/* Tile 1 — "Did you know?" (dark) */}
          <div style={{
            borderRadius: 18, position: "relative", overflow: "hidden", minHeight: 280,
            background: "#F2778A",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
            alignSelf: "center",
          }}>
            <div style={{
              position: "relative", zIndex: 10, padding: "20px 28px",
              display: "flex", flexDirection: "column",
              justifyContent: "space-between", height: "100%", minHeight: 280, gap: 14,
            }}>
              {blockEyebrow("Did you know?", true)}
              <p style={{
                color: "#ffffff", fontSize: 18, fontWeight: 700,
                lineHeight: 1.55, maxWidth: 520,
                opacity: factFading ? 0 : 1,
                transition: "opacity 0.28s", margin: 0,
              }}>
                {FUN_FACTS[factIdx]}
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                {/* Refresh only — no dot indicators */}
                <button
                  onClick={cycleFact}
                  title="Next fact"
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "rgba(13,27,62,0.08)",
                    border: "1px solid rgba(13,27,62,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "rgba(13,27,62,0.6)",
                    flexShrink: 0,
                  }}
                >
                  {/* Refresh / rotate arrow SVG */}
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M11 6.5A4.5 4.5 0 1 1 6.5 2c1.2 0 2.3.47 3.1 1.24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    <polyline points="9.5,1 9.5,3.5 12,3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Tile 2 — KPI cards — pink bg, matching EOI palette */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, minHeight: 280, alignSelf: "center" }}>
            <div style={{ flex: 1, position: "relative" }}>
              {HERO_STATS.map((s, i) => {
                const textColour = "#ffffff";
                const subColour  = "rgba(255,255,255,0.75)";
                const labelColour = "rgba(255,255,255,0.9)";
                  return (
                  <div key={s.label} style={{
                    position: "absolute", inset: 0,
                    display: "flex",
                    flexDirection: "column", justifyContent: "flex-start", alignItems: "center", textAlign: "center",
                    borderRadius: 18, padding: "20px 28px",
                    background: B_YELLOW,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                    opacity: i === 0 ? 1 : 0,
                    transition: "opacity 0.5s ease",
                    animation: `kpiCycle${i} ${HERO_STATS.length * 3.5}s ${i * 3.5}s infinite`,
                  }}>
                    {/* Top accent line */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 1.4,
                      background: "rgba(255,255,255,0.35)",
                    }} />
                    {/* "In the numbers" eyebrow — inside the tile */}
                    <p style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.4px", margin: 0, color: "#ffffff", alignSelf: "flex-start", textAlign: "left" }}>
                      In the numbers
                    </p>
                    <div style={{ flex: 1 }} />
                    <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.2px", margin: "0 0 8px", color: labelColour }}>
                      {s.label}
                    </p>
                    <p style={{ fontSize: 62, fontWeight: 900, color: textColour, letterSpacing: "-1.5px", lineHeight: 1, margin: 0 }}>
                      {s.num}
                    </p>
                    <p style={{ fontSize: 12, margin: "8px 0 0", color: subColour }}>{s.sub}</p>
                    <div style={{ flex: 1 }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tile 3 — Social feed */}
          <div
            style={{
              borderRadius: 18, background: "white", minHeight: 280,
              overflow: "hidden", position: "relative",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
              border: "1px solid #f0f0f5", display: "flex", flexDirection: "column",
              alignSelf: "start",
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
              {blockEyebrow("Social Feed")}
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
                      style={{ fontSize: 10, fontWeight: 800, color: B_TICKER, background: "none", border: "none", cursor: "pointer" }}>
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
                    background: i === socialIdx ? B_TICKER : "#e2e8f0",
                    transition: "all 0.2s",
                  }} />
                ))}
              </div>
              <button onClick={() => triggerToast("Opening social media...")} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6, padding: "9px 0", borderRadius: 10,
                fontSize: 11, fontWeight: 800,
                background: B_TICKER,
                color: "white", border: "none", cursor: "pointer",
              }}>
                Follow @TataEngage <ArrowRight size={9} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI cycle keyframes — staggered opacity cycling for 3 cards */}
      <style>{`
        @keyframes kpiCycle0 { 0%,30%{opacity:1} 33%,96%{opacity:0} 100%{opacity:1} }
        @keyframes kpiCycle1 { 0%,30%{opacity:0} 33%,63%{opacity:1} 66%,100%{opacity:0} }
        @keyframes kpiCycle2 { 0%,63%{opacity:0} 66%,96%{opacity:1} 100%{opacity:0} }
      `}</style>
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
      background: B_TICKER,
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
