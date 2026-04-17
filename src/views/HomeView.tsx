import { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronLeft, Play, BookOpen, Bell, X, Check } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import tataLogo from "@/assets/Tata-removebg-preview.png";
import tataEngageLogo from "@/assets/tata-engage-logo-nobg.png";
import tataAIG from "@/assets/Tata_AIG_2.jpg";
import tataMotors1 from "@/assets/Tata_Motors_1.jpg";
import voltasImg from "@/assets/Voltas.JPG";
import tajSats from "@/assets/Taj_Sats.jpeg";
import drHeroPhoto from "@/assets/dr_photo_2.jpg";
import {
  B_INDIGO, B_YELLOW, B_TEAL, B_BLUE, B_TICKER, ACCENT_NAVY,
} from "@/data/homeSharedData";
import { ProgrammeSpotlight, JourneySection, NumbersSection, TickerBar, SectionDivider } from "@/components/shared/HomeSections";

// ── Ink doodle SVGs ───────────────────────────────────────────────────────────
const InkSpiral = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M30 30 C30 22, 38 18, 42 24 C46 30, 42 40, 34 42 C26 44, 18 38, 18 30 C18 20, 26 12, 36 12 C48 12, 56 22, 54 34 C52 46, 42 54, 28 52"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
  </svg>
);
const InkDots = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <circle cx="6"  cy="8"  r="2.5" fill="currentColor" opacity="0.55" />
    <circle cx="18" cy="22" r="1.8" fill="currentColor" opacity="0.4"  />
    <circle cx="30" cy="6"  r="3"   fill="currentColor" opacity="0.45" />
    <circle cx="42" cy="20" r="1.5" fill="currentColor" opacity="0.35" />
    <circle cx="48" cy="10" r="2"   fill="currentColor" opacity="0.4"  />
  </svg>
);
const InkStar = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M16 2 L17.5 14 L28 8 L18.5 16 L28 24 L17.5 18 L16 30 L14.5 18 L4 24 L13.5 16 L4 8 L14.5 14 Z"
      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
  </svg>
);
const InkSwish = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 70 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M4 32 C10 16, 28 6, 50 14 C60 18, 65 26, 66 34"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path d="M60 28 L66 34 L60 38"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// ── HomeView-only data ────────────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    photo: tataAIG,
    accent: B_YELLOW, tag: "Education", cta: "story" as const,
    headline: "Teaching skills that change what young people think is possible",
    sub: "Tata volunteers are in classrooms, training centres, and communities — every day.",
    doodles: {
      spiral: { top: "12%",    right: "36%", size: 52, opacity: 0.18 },
      dots:   { top: "60%",    right: "42%", size: 60, opacity: 0.20 },
      star:   { top: "20%",    right: "28%", size: 28, opacity: 0.22 },
      swish:  { bottom: "18%", right: "30%", size: 72, opacity: 0.16 },
    },
  },
  {
    photo: tataMotors1,
    accent: B_BLUE, tag: "Community", cta: "video" as const,
    headline: "10,000 rural families reached through free health camps",
    sub: "When professionals volunteer their expertise, communities transform.",
    doodles: {
      spiral: { top: "8%",     right: "38%", size: 48, opacity: 0.16 },
      dots:   { bottom: "22%", right: "44%", size: 56, opacity: 0.18 },
      star:   { top: "55%",    right: "32%", size: 24, opacity: 0.20 },
      swish:  { top: "30%",    right: "26%", size: 68, opacity: 0.14 },
    },
  },
  {
    photo: voltasImg,
    accent: B_YELLOW, tag: "Environment", cta: "story" as const,
    headline: "1 million trees planted across Tata campuses nationwide",
    sub: "A greener legacy, growing branch by branch.",
    doodles: {
      spiral: { top: "15%",    right: "40%", size: 50, opacity: 0.18 },
      dots:   { top: "65%",    right: "34%", size: 58, opacity: 0.20 },
      star:   { bottom: "25%", right: "28%", size: 26, opacity: 0.22 },
      swish:  { top: "42%",    right: "22%", size: 70, opacity: 0.15 },
    },
  },
  {
    photo: drHeroPhoto,
    accent: B_BLUE, tag: "Disaster Response", cta: "video" as const,
    headline: "Volunteers on-ground within 48 hours of the Kerala floods",
    sub: "Organised, rapid, human — Tata's fastest ever humanitarian response.",
    doodles: {
      spiral: { top: "10%",    right: "36%", size: 52, opacity: 0.16 },
      dots:   { bottom: "20%", right: "40%", size: 60, opacity: 0.18 },
      star:   { top: "48%",    right: "30%", size: 28, opacity: 0.20 },
      swish:  { top: "28%",    right: "24%", size: 72, opacity: 0.14 },
    },
  },
];

const HERO_PARTICLES = [
  { top: "8%",  left: "5%",  size: 6, opacity: 0.08, dur: "7s",  delay: "0s"   },
  { top: "15%", left: "82%", size: 4, opacity: 0.06, dur: "9s",  delay: "1.2s" },
  { top: "35%", left: "12%", size: 8, opacity: 0.10, dur: "8s",  delay: "0.5s" },
  { top: "60%", left: "90%", size: 5, opacity: 0.07, dur: "6s",  delay: "2.8s" },
  { top: "72%", left: "25%", size: 7, opacity: 0.12, dur: "10s", delay: "1.5s" },
  { top: "20%", left: "68%", size: 4, opacity: 0.06, dur: "7.5s",delay: "3.2s" },
  { top: "48%", left: "55%", size: 6, opacity: 0.09, dur: "8.5s",delay: "0.8s" },
  { top: "80%", left: "40%", size: 5, opacity: 0.07, dur: "9.5s",delay: "2.0s" },
  { top: "12%", left: "45%", size: 8, opacity: 0.10, dur: "6.5s",delay: "3.8s" },
  { top: "55%", left: "8%",  size: 4, opacity: 0.06, dur: "7s",  delay: "1.0s" },
  { top: "42%", left: "78%", size: 7, opacity: 0.11, dur: "8s",  delay: "2.5s" },
  { top: "88%", left: "65%", size: 5, opacity: 0.08, dur: "9s",  delay: "0.3s" },
];

const SECTION_IDS    = ["hero", "programmes", "journey", "numbers"];
const SECTION_LABELS = ["Home", "Programmes", "Journey", "Numbers"];

// ── Component ─────────────────────────────────────────────────────────────────
const HomeView = () => {
  const navigate         = useAppNavigate();
  const { triggerToast } = useAppContext();
  const { isLoggedIn }   = useAuth();

  const [activeSection,  setActiveSection]  = useState(0);
  const [showLabel,      setShowLabel]      = useState(false);
  const labelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [heroSlide,      setHeroSlide]      = useState(0);
  const [subOpen,        setSubOpen]        = useState(false);
  const [subName,        setSubName]        = useState("");
  const [subEmail,       setSubEmail]       = useState("");
  const [subDone,        setSubDone]        = useState(false);
  const [inHero,         setInHero]         = useState(true);

  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          setActiveSection(idx);
          setShowLabel(true);
          if (labelTimer.current) clearTimeout(labelTimer.current);
          labelTimer.current = setTimeout(() => setShowLabel(false), 1800);
        }
      }, { threshold: 0.2 });
      o.observe(el); obs.push(o);
    });
    return () => { obs.forEach((o) => o.disconnect()); if (labelTimer.current) clearTimeout(labelTimer.current); };
  }, []);

  useEffect(() => { const t = setInterval(() => setHeroSlide((p) => (p + 1) % HERO_SLIDES.length), 6000); return () => clearInterval(t); }, []);

  const heroImgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (heroImgRef.current) {
        heroImgRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`;
      }
      const heroEl = document.getElementById("hero");
      if (heroEl) {
        setInHero(window.scrollY < heroEl.offsetHeight - 300);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const slide        = HERO_SLIDES[heroSlide];
  const d            = slide.doodles;

  return (
    <div className="relative font-sans pb-10">

      {/* ── Section dot rail — dotted vertical line + square label pill ──────── */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end" style={{ gap: 0 }}>
        {SECTION_IDS.map((id, i) => {
          const active = activeSection === i;
          const isLast = i === SECTION_IDS.length - 1;
          return (
            <div key={id} className="flex flex-col items-end">
              <button
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center justify-end"
                style={{ marginBottom: 0 }}
              >
                {active && showLabel && (
                  <span
                    className="whitespace-nowrap shadow-sm transition-all duration-300 mr-2"
                    style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.3px",
                      padding: "3px 9px",
                      borderRadius: 4,
                      backgroundColor: "rgba(13,27,62,0.92)",
                      border: `1px solid ${ACCENT_NAVY}`,
                      color: "#ffffff",
                    }}>
                    {SECTION_LABELS[i]}
                  </span>
                )}
                {/* Node dot */}
                <span
                  className="transition-all duration-300"
                  style={{
                    width: active ? 9 : 6, height: active ? 9 : 6,
                    borderRadius: 2,
                    backgroundColor: ACCENT_NAVY,
                    border: `1px solid rgba(13,27,62,0.25)`,
                    display: "block",
                    flexShrink: 0,
                  }}
                />
              </button>

              {/* Dotted connector line between nodes */}
              {!isLast && (
                <div style={{
                  width: 1,
                  height: 28,
                  marginLeft: "auto",
                  marginRight: active ? "4px" : "2.5px",
                  backgroundImage: `repeating-linear-gradient(to bottom, ${ACCENT_NAVY}50 0px, ${ACCENT_NAVY}50 3px, transparent 3px, transparent 7px)`,
                  transition: "all 0.3s",
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          1. HERO — full-bleed dark overlay, slow pan, chevrons inside
      ════════════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative flex items-center overflow-hidden" style={{ minHeight: "92vh", paddingTop: 64 }}>

        {/* Parallax image layer — one div per slide, JS scroll moves it */}
        <div
          ref={heroImgRef}
          style={{
            position: "absolute",
            top: "-25%", left: 0, right: 0, bottom: "-25%",
            willChange: "transform",
            zIndex: 0,
          }}
        >
          {HERO_SLIDES.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute", inset: 0,
                backgroundImage: `url(${s.photo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: heroSlide === i ? 1 : 0,
                transition: "opacity 1s ease",
              }}
            />
          ))}
        </div>

        {/* Dark overlay — heavy on left (text side), lighter on right to reveal image */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(8,12,22,0.82) 0%, rgba(8,12,22,0.65) 40%, rgba(8,12,22,0.18) 75%, rgba(8,12,22,0.10) 100%)",
          zIndex: 1,
        }} />

        {/* Subtle ink doodles — kept but white/very faint on dark bg */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          <InkSpiral className="absolute transition-all duration-700"
            style={{ top: d.spiral.top, right: d.spiral.right, width: d.spiral.size, height: d.spiral.size, color: "white", opacity: 0.06 }} />
          <InkDots className="absolute transition-all duration-700"
            style={{ top: d.dots.top, bottom: (d.dots as any).bottom, right: d.dots.right, width: d.dots.size, color: "white", opacity: 0.07 }} />
        </div>


        {/* Hero content */}
        <div className="relative w-full max-w-7xl mx-auto px-6 md:px-16 py-16" style={{ zIndex: 3 }}>
          <div style={{ maxWidth: 580 }}>

            {/* Eyebrow tag + definer underline */}
            <span style={{
              display: "inline-block",
              fontSize: 10, fontWeight: 800, letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#ffffff",
              marginBottom: 0,
              fontFamily: "'DM Mono', monospace",
            }}>
              {slide.tag}
            </span>
            {/* Definer underline — sweeps in under the eyebrow */}
            <div style={{ height: 1.4, width: 80, borderRadius: 2, background: "rgba(255,255,255,0.12)", marginTop: 4, marginBottom: 20, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 2,
                background: slide.accent,
                animation: "definerSweep 0.7s cubic-bezier(0.22,1,0.36,1) forwards",
              }} />
            </div>

            <h1 style={{
              fontFamily: "'DM Sans', ui-sans-serif, sans-serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.12, letterSpacing: "-0.5px",
              color: "white", margin: "0 0 18px", fontWeight: 400,
            }}>
              {slide.headline}
            </h1>

            <p style={{
              fontSize: 15, lineHeight: 1.7, fontWeight: 300,
              color: "rgba(255,255,255,0.65)",
              margin: "0 0 32px", maxWidth: 460,
            }}>
              {slide.sub}
            </p>

            {/* CTA button */}
            <div style={{ marginBottom: 36 }}>
              {slide.cta === "story" ? (
                <button onClick={() => triggerToast("Opening full story...")}
                  className="flex items-center gap-2 cursor-pointer cta-btn"
                  style={{
                    padding: "11px 24px", borderRadius: 10,
                    fontSize: 13, fontWeight: 800, color: "white",
                    background: "#3E7EB0", border: "none",
                    position: "relative", overflow: "hidden",
                  }}>
                  <BookOpen size={14} />
                  <span className="cta-shimmer">Read Story</span>
                </button>
              ) : (
                <button onClick={() => triggerToast("Opening video...")}
                  className="flex items-center gap-2 cursor-pointer cta-btn"
                  style={{
                    padding: "11px 24px", borderRadius: 10,
                    fontSize: 13, fontWeight: 800, color: "white",
                    background: "#3E7EB0", border: "none",
                    position: "relative", overflow: "hidden",
                  }}>
                  <Play size={14} />
                  <span className="cta-shimmer">Watch More</span>
                </button>
              )}
            </div>

            {/* Slide controls — prev / dots / next / counter */}
            <div className="flex items-center gap-3">
              <button onClick={() => setHeroSlide((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  background: "rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "white",
                }}>
                <ChevronLeft size={14} />
              </button>
              <div className="flex gap-2">
                {HERO_SLIDES.map((_, i) => (
                  <button key={i} onClick={() => setHeroSlide(i)}
                    className="rounded-full transition-all duration-300 cursor-pointer"
                    style={{
                      width: heroSlide === i ? 24 : 8, height: 8, border: "none", padding: 0,
                      backgroundColor: heroSlide === i ? slide.accent : "rgba(255,255,255,0.3)",
                    }} />
                ))}
              </div>
              <button onClick={() => setHeroSlide((p) => (p + 1) % HERO_SLIDES.length)}
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  background: "rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "white",
                }}>
                <ChevronRight size={14} />
              </button>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginLeft: 4 }}>
                {String(heroSlide + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Scroll chevrons — INSIDE the hero, bottom-centre */}
        <button
          onClick={() => document.getElementById("programmes")?.scrollIntoView({ behavior: "smooth" })}
          aria-label="Scroll to programmes"
          style={{
            position: "absolute", bottom: 32, left: "50%",
            transform: "translateX(-50%)",
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 2, padding: 8, zIndex: 4,
          }}
        >
          {[0, 1, 2].map((i) => (
            <svg key={i} viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{
                width: 28, height: 14,
                opacity: 1 - i * 0.28,
                color: "white",
                animation: `chevronBob 1.4s ease-in-out ${i * 0.18}s infinite`,
              }}>
              <path d="M2 2 L12 10 L22 2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ))}
        </button>

        <style>{`
          @keyframes chevronBob {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(4px); }
          }
          @keyframes definerSweep {
            from { width: 0%; }
            to   { width: 100%; }
          }
          @keyframes ctaWordBounce {
            0%, 100% { transform: translateY(0); }
            45%       { transform: translateY(-2px); }
            65%       { transform: translateY(-1px); }
          }
          .cta-shimmer {
            display: inline-block;
            animation: ctaWordBounce 2.6s ease-in-out infinite;
          }
        `}</style>
      </section>

      {/* 2. PROGRAMME SPOTLIGHT */}
      <div id="programmes">
        <ProgrammeSpotlight />
      </div>

      <SectionDivider />

      {/* 3. JOURNEY */}
      <div id="journey">
        <JourneySection />
      </div>

      <SectionDivider />

      {/* 4. NUMBERS + SOCIAL */}
      <div id="numbers">
        <NumbersSection />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-zinc-950 text-white pt-10 pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <img src={tataEngageLogo} alt="TataEngage" className="h-9 object-contain brightness-0 invert mb-3" />
              <p className="text-slate-400 text-sm leading-relaxed">Tata Group's platform for volunteering — connecting employees, families, and retirees with meaningful opportunities across India.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><span className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate("about")}>About Tata Engage</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate("journey")}>Our Journey</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate("disaster-response")}>Disaster Response</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate("partner")}>Partner With Us</span></li>
                <li><span className="hover:text-white cursor-pointer" onClick={() => navigate("login")}>Login</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm">Programmes</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><span className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate("about-tvw")}>TVW — Tata Volunteering Week</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate("about-proengage")}>ProEngage</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate("disaster-response")}>Disaster Response</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-sm">Connect With Us</h4>
              <div className="flex gap-3.5 mb-5">
                {[{ Icon: Facebook, c: "hover:text-blue-400", k: "fb" }, { Icon: Twitter, c: "hover:text-sky-400", k: "tw" }, { Icon: Instagram, c: "hover:text-pink-400", k: "ig" }, { Icon: Linkedin, c: "hover:text-blue-400", k: "li" }, { Icon: Youtube, c: "hover:text-red-500", k: "yt" }].map(({ Icon, c, k }) => (
                  <Icon key={k} size={17} className={`text-slate-500 ${c} cursor-pointer transition-colors`} />
                ))}
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Newsletter</p>
              <div className="flex flex-col gap-2">
                <input type="text" placeholder="Your name" className="bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-xs rounded-xl px-3 py-2 outline-none focus:border-white/30 transition-colors" />
                <input type="email" placeholder="Your email" className="bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-xs rounded-xl px-3 py-2 outline-none focus:border-white/30 transition-colors" />
                <button onClick={() => triggerToast("Subscribed! Welcome to TataEngage updates.")}
                  className="text-xs font-bold px-4 py-2 rounded-xl hover:brightness-110 transition-all cursor-pointer"
                  style={{ backgroundColor: B_YELLOW, color: "#111" }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-5 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-slate-600">© 2026 Tata Sons Private Limited. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <div className="flex gap-5 text-xs text-slate-500">
                {["Privacy Policy", "Terms of Use", "Cookie Policy"].map((l) => (
                  <span key={l} className="hover:text-white cursor-pointer">{l}</span>
                ))}
                <span className="text-zinc-700 hover:text-zinc-400 cursor-pointer" onClick={() => navigate("admin-login")}>Admin</span>
              </div>
              <img src={tataLogo} alt="Tata" className="h-6 object-contain opacity-50" />
            </div>
          </div>
        </div>
      </footer>

      {/* FIXED BOTTOM TICKER */}
      <TickerBar fixed />

      {/* Floating social cluster */}
      <div className="fixed bottom-24 left-5 z-40 flex flex-col gap-2 items-center transition-colors duration-300">
        {[
          { icon: <Linkedin size={15} />, label: "LinkedIn" },
          { icon: <Instagram size={15} />, label: "Instagram" },
          { icon: <Twitter size={15} />, label: "X (Twitter)" },
        ].map(({ icon, label }) => (
          <button
            key={label}
            onClick={() => triggerToast(`Opening ${label}...`)}
            title={label}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
            style={{
              backgroundColor: inHero ? "rgba(255,255,255,0.12)" : "white",
              border: inHero ? "1px solid rgba(255,255,255,0.25)" : "1px solid #e2e8f0",
              color: inHero ? "white" : B_TICKER,
              boxShadow: inHero ? "0 1px 6px rgba(0,0,0,0.20)" : "0 1px 6px rgba(0,0,0,0.10)",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = inHero ? "rgba(255,255,255,0.22)" : "#EEF0FF")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = inHero ? "rgba(255,255,255,0.12)" : "white")}
          >
            {icon}
          </button>
        ))}
        <div className="w-px h-5 transition-colors duration-300" style={{ backgroundColor: inHero ? "rgba(255,255,255,0.25)" : "#e2e8f0" }} />

        {/* Subscribe — only when not logged in */}
        {!isLoggedIn && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => { setSubOpen(o => !o); if (subDone) { setSubDone(false); setSubName(""); setSubEmail(""); } }}
              title="Subscribe to newsletter"
              style={{
                width: 36, height: 36, borderRadius: "50%",
                backgroundColor: subDone ? "#0d7c52" : B_TICKER,
                border: "none", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                transition: "background 0.3s",
              }}
            >
              {subDone ? <Check size={14} /> : <Bell size={14} />}
            </button>

            {subOpen && (
              <div style={{
                position: "absolute", left: 44, bottom: 0,
                width: 232, background: "#fff",
                border: "1px solid #e2e8f0", borderRadius: 14,
                boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
                padding: "16px 14px", zIndex: 50,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0D1B3E" }}>Stay in the loop</span>
                  <button onClick={() => setSubOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 2 }}>
                    <X size={13} />
                  </button>
                </div>
                <p style={{ fontSize: 11.5, color: "#64748b", marginBottom: 10, lineHeight: 1.5 }}>
                  TVW dates, new ProEngage projects &amp; impact stories — straight to your inbox.
                </p>
                <input
                  type="text" placeholder="Your name" value={subName}
                  onChange={e => setSubName(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", fontSize: 12.5, border: "1px solid #e2e8f0", borderRadius: 7, marginBottom: 6, outline: "none", boxSizing: "border-box" as const }}
                />
                <input
                  type="email" placeholder="Your email" value={subEmail}
                  onChange={e => setSubEmail(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", fontSize: 12.5, border: "1px solid #e2e8f0", borderRadius: 7, marginBottom: 8, outline: "none", boxSizing: "border-box" as const }}
                />
                <button
                  onClick={() => {
                    if (!subEmail) return;
                    setSubDone(true);
                    setSubOpen(false);
                    triggerToast("You're subscribed! Welcome to TataEngage updates.");
                  }}
                  style={{
                    width: "100%", padding: "8px 0",
                    backgroundColor: B_TICKER, color: "#fff",
                    border: "none", borderRadius: 7,
                    fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  Subscribe →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView;
