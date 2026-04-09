import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Play, BookOpen, ArrowRight, RefreshCw } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useAppContext } from "@/context/AppContext";
import tataLogo from "@/assets/tata-logo.png";
import tataEngageLogo from "@/assets/tata-engage-logo-nobg.png";

// ── Brand tokens ─────────────────────────────────────────────────────────────
const B_INDIGO = "#333399";
const B_YELLOW = "#F5A623";
const B_RED    = "#E8401C";
const B_TEAL   = "#00A896";
const B_BLUE   = "#1E6BB8";

// ── Ink doodle SVGs — sparse, hand-drawn feel ────────────────────────────────

// Loose spiral
const InkSpiral = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M30 30 C30 22, 38 18, 42 24 C46 30, 42 40, 34 42 C26 44, 18 38, 18 30 C18 20, 26 12, 36 12 C48 12, 56 22, 54 34 C52 46, 42 54, 28 52"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
  </svg>
);

// Small scattered dots — hand-stamped feel
const InkDots = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <circle cx="6"  cy="8"  r="2.5" fill="currentColor" opacity="0.55" />
    <circle cx="18" cy="22" r="1.8" fill="currentColor" opacity="0.4"  />
    <circle cx="30" cy="6"  r="3"   fill="currentColor" opacity="0.45" />
    <circle cx="42" cy="20" r="1.5" fill="currentColor" opacity="0.35" />
    <circle cx="48" cy="10" r="2"   fill="currentColor" opacity="0.4"  />
  </svg>
);

// Star burst — 4-point
const InkStar = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M16 2 L17.5 14 L28 8 L18.5 16 L28 24 L17.5 18 L16 30 L14.5 18 L4 24 L13.5 16 L4 8 L14.5 14 Z"
      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
  </svg>
);

// Small arc / swish
const InkSwish = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 70 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M4 32 C10 16, 28 6, 50 14 C60 18, 65 26, 66 34"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path d="M60 28 L66 34 L60 38"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// Five-dot section divider
const SectionDivider = () => (
  <div className="flex items-center justify-center gap-2 py-5">
    {[B_INDIGO, B_YELLOW, B_RED, B_TEAL, B_BLUE].map((c) => (
      <span key={c} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
    ))}
  </div>
);

// ── Data ─────────────────────────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    // Portrait-heavy photo — face on right third, bg fades to white left
    photo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1400",
    accent: B_YELLOW,
    tag: "Education",
    headline: "Teaching skills that change what young people think is possible",
    sub: "Tata volunteers are in classrooms, training centres, and communities — every day.",
    // Which doodles appear and where — positioned relative to section
    doodles: {
      spiral:  { top: "12%",  right: "36%",  size: 52, opacity: 0.18 },
      dots:    { top: "60%",  right: "42%",  size: 60, opacity: 0.20 },
      star:    { top: "20%",  right: "28%",  size: 28, opacity: 0.22 },
      swish:   { bottom: "18%", right: "30%", size: 72, opacity: 0.16 },
    },
  },
  {
    photo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1400",
    accent: B_RED,
    tag: "Community",
    headline: "10,000 rural families reached through free health camps",
    sub: "When professionals volunteer their expertise, communities transform.",
    doodles: {
      spiral:  { top: "8%",   right: "38%", size: 48, opacity: 0.16 },
      dots:    { bottom: "22%",right: "44%", size: 56, opacity: 0.18 },
      star:    { top: "55%",  right: "32%", size: 24, opacity: 0.20 },
      swish:   { top: "30%",  right: "26%", size: 68, opacity: 0.14 },
    },
  },
  {
    photo: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1400",
    accent: B_TEAL,
    tag: "Environment",
    headline: "1 million trees planted across Tata campuses nationwide",
    sub: "A greener legacy, growing branch by branch.",
    doodles: {
      spiral:  { top: "15%",  right: "40%", size: 50, opacity: 0.18 },
      dots:    { top: "65%",  right: "34%", size: 58, opacity: 0.20 },
      star:    { bottom: "25%",right: "28%",size: 26, opacity: 0.22 },
      swish:   { top: "42%",  right: "22%", size: 70, opacity: 0.15 },
    },
  },
  {
    photo: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1400",
    accent: B_BLUE,
    tag: "Disaster Response",
    headline: "Volunteers on-ground within 48 hours of the Kerala floods",
    sub: "Organised, rapid, human — Tata's fastest ever humanitarian response.",
    doodles: {
      spiral:  { top: "10%",  right: "36%", size: 52, opacity: 0.16 },
      dots:    { bottom: "20%",right: "40%",size: 60, opacity: 0.18 },
      star:    { top: "48%",  right: "30%", size: 28, opacity: 0.20 },
      swish:   { top: "28%",  right: "24%", size: 72, opacity: 0.14 },
    },
  },
];

const FLAGSHIP_PROGRAMMES = [
  {
    id: "TVW", bg: B_INDIGO, accent: B_YELLOW, label: "Bi-annual · Global",
    title: "Tata Volunteering Week",
    desc: "A bi-annual celebration of collective action across every Tata company, worldwide.",
    stat1: "12 Editions", stat2: "50K+ Volunteers",
  },
  {
    id: "ProEngage", bg: "#3B1E8E", accent: "#C4B5FD", label: "Skill-based",
    title: "ProEngage",
    desc: "Match your professional expertise to NGO projects that need it most.",
    stat1: "1,200+ Projects", stat2: "85 NGO Partners",
  },
  {
    id: "Disaster Response", bg: "#7f1d1d", accent: "#FCA5A5", label: "Rapid Action",
    title: "Disaster Response",
    desc: "Volunteers deployed within 48 hours when communities need urgent support.",
    stat1: "24 Responses", stat2: "8 States",
  },
];

const COMPANY_PROGRAMMES = [
  { name: "TCS",         desc: "Green Earth — 1,000 trees planted",           dot: B_INDIGO },
  { name: "Titan",       desc: "Skill India workshops for rural women",         dot: B_YELLOW },
  { name: "Tata Steel",  desc: "Community health camps — 20K beneficiaries",   dot: "#475569" },
  { name: "Tata Motors", desc: "Road safety awareness across 12 cities",        dot: B_RED    },
  { name: "Tata Power",  desc: "Solar literacy programme in Jharkhand",         dot: B_TEAL   },
  { name: "Taj Hotels",  desc: "Culinary skills for underprivileged youth",     dot: B_BLUE   },
];

const JOURNEY_MILESTONES = [
  { year: "2007", title: "The Seed",     desc: "Founded with 4 Tata companies.",       colour: B_INDIGO, photo: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=120&h=120" },
  { year: "2010", title: "TVW Born",     desc: "8,000 volunteers in Year 1.",           colour: B_YELLOW, photo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=120&h=120" },
  { year: "2015", title: "Digital",      desc: "Platform launched for NGO matching.",   colour: B_RED,    photo: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=120&h=120" },
  { year: "2018", title: "ProEngage",    desc: "Skill-based volunteering introduced.",  colour: B_TEAL,   photo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=120&h=120" },
  { year: "2020", title: "COVID Relief", desc: "15,000 volunteers in 72 hrs.",          colour: B_BLUE,   photo: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&q=80&w=120&h=120" },
  { year: "2024", title: "50K Strong",   desc: "50K+ volunteers, 100+ companies.",      colour: B_INDIGO, photo: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=120&h=120" },
];

const FUN_FACTS = [
  "Tata volunteers have collectively logged over 2.5 million hours of service since 2007.",
  "1 in 4 ProEngage projects directly benefits children's education in rural India.",
  "85% of volunteers say their professional skills grew through ProEngage.",
  "Tata companies have planted 1.2 million trees through volunteering drives.",
  "NGOs report 3× faster project delivery when paired with skilled Tata volunteers.",
];

const HERO_STATS = [
  { num: "50,000+", label: "Active Volunteers",  sub: "Across 100+ Tata companies", colour: B_INDIGO },
  { num: "85",      label: "NGO Partners",        sub: "Across 15 states in India",   colour: B_TEAL   },
  { num: "2.5M+",   label: "Volunteer Hours",     sub: "Logged since 2007",           colour: B_YELLOW },
];

const SOCIAL_POSTS = [
  { handle: "@TataEngage",  platform: "Twitter",   text: "Proud to announce 50,000 volunteers on the platform! Thank you for making a difference. #TataEngage",              likes: "1.2K", time: "2h ago",  Icon: Twitter,   iconBg: "#0EA5E9" },
  { handle: "@tata_engage", platform: "Instagram", text: "TVW 2026 is almost here! Tag a colleague you'd love to volunteer with. #TVW2026 #TataVolunteers",                  likes: "3.4K", time: "1d ago",  Icon: Instagram, iconBg: "#EC4899" },
  { handle: "Tata Engage",  platform: "LinkedIn",  text: "ProEngage Edition 2026 is now open — 400+ skill-based projects waiting for the right volunteers.",                 likes: "892",  time: "3d ago",  Icon: Linkedin,  iconBg: "#1D4ED8" },
];

const TICKER_ITEMS = [
  "🟢  ProEngage 2026 is OPEN — 400+ projects live",
  "📅  TVW 2026 registration opens in 14 days",
  "🏅  1,240 volunteers matched this edition — a record",
  "🌿  TCS: 1,000 trees planted across 8 campuses",
  "🚨  Disaster Response deployed to Assam floods",
  "🎓  Finance Mentorship projects now accepting applications",
];

const SECTION_IDS    = ["hero", "programmes", "journey", "numbers"];
const SECTION_LABELS = ["Home", "Programmes", "Journey", "Numbers"];
const secBg = (i: number) => i % 2 === 0 ? "bg-white" : "bg-[#F0F4FA]";

// ── Component ─────────────────────────────────────────────────────────────────

const HomeView = () => {
  const navigate         = useAppNavigate();
  const { triggerToast } = useAppContext();

  const [activeSection, setActiveSection] = useState(0);
  const [heroSlide,     setHeroSlide]     = useState(0);
  const [flagshipIdx,   setFlagshipIdx]   = useState(0);
  const [factIdx,       setFactIdx]       = useState(0);
  const [factFading,    setFactFading]    = useState(false);
  const [socialIdx,     setSocialIdx]     = useState(0);

  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActiveSection(idx); }, { threshold: 0.2 });
      o.observe(el); obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => { const t = setInterval(() => setHeroSlide((p) => (p + 1) % HERO_SLIDES.length), 6000); return () => clearInterval(t); }, []);
  useEffect(() => { const t = setInterval(() => setFlagshipIdx((p) => (p + 1) % FLAGSHIP_PROGRAMMES.length), 4200); return () => clearInterval(t); }, []);

  const cycleFact = () => { setFactFading(true); setTimeout(() => { setFactIdx((p) => (p + 1) % FUN_FACTS.length); setFactFading(false); }, 280); };
  useEffect(() => { const t = setInterval(cycleFact, 5200); return () => clearInterval(t); }, []);
  useEffect(() => { const t = setInterval(() => setSocialIdx((p) => (p + 1) % SOCIAL_POSTS.length), 4200); return () => clearInterval(t); }, []);

  const slide        = HERO_SLIDES[heroSlide];
  const prog         = FLAGSHIP_PROGRAMMES[flagshipIdx];
  const tickerDouble = [...TICKER_ITEMS, ...TICKER_ITEMS];
  const d            = slide.doodles;

  return (
    <div className="relative font-sans">

      {/* ── Section dot rail ─────────────────────────────────────────────── */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
        {SECTION_IDS.map((id, i) => {
          const active = activeSection === i;
          return (
            <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center justify-end">
              {active && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full mr-2 whitespace-nowrap bg-white border border-slate-200 text-slate-700 shadow-sm">
                  {SECTION_LABELS[i]}
                </span>
              )}
              <span className="rounded-full transition-all duration-300"
                style={{ width: active ? 10 : 7, height: active ? 10 : 7, backgroundColor: active ? B_INDIGO : "#CBD5E1" }} />
            </button>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          1. HERO — white bg, photo vignetted to white on left, doodles float
      ════════════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-[560px] flex items-center overflow-hidden pt-16 bg-white">

        {/* Thin accent bar just below navbar */}
        <div className="absolute top-16 left-0 right-0 h-0.5 z-20 transition-colors duration-700"
          style={{ backgroundColor: slide.accent }} />

        {/* ── Photo layer — right-anchored, fades to white on left ── */}
        <div className="absolute inset-0 flex justify-end">
          {HERO_SLIDES.map((s, i) => (
            <div key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ${heroSlide === i ? "opacity-100" : "opacity-0"}`}>
              {/* The photo itself */}
              <img src={s.photo} alt={s.tag}
                className="absolute right-0 top-0 h-full w-[65%] object-cover object-center"
                referrerPolicy="no-referrer"
                style={{ transition: "transform 6s ease-out", transform: heroSlide === i ? "scale(1.04)" : "scale(1)" }}
              />
              {/* Radial vignette — white from left, fading right — simulates cutout effect */}
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to right, #ffffff 0%, #ffffff 28%, rgba(255,255,255,0.85) 42%, rgba(255,255,255,0.35) 58%, rgba(255,255,255,0) 72%)"
              }} />
              {/* Soft top + bottom white fade so person doesn't look cropped */}
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 18%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.6) 100%)"
              }} />
            </div>
          ))}
        </div>

        {/* ── Ink doodles — positioned in the transition zone between text and photo ── */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Spiral — top area of transition zone */}
          <InkSpiral
            className="absolute transition-all duration-700"
            style={{ top: d.spiral.top, right: d.spiral.right, width: d.spiral.size, height: d.spiral.size, color: slide.accent, opacity: d.spiral.opacity }}
          />
          {/* Scattered dots */}
          <InkDots
            className="absolute transition-all duration-700"
            style={{ top: d.dots.top, bottom: (d.dots as any).bottom, right: d.dots.right, width: d.dots.size, color: slide.accent, opacity: d.dots.opacity }}
          />
          {/* Star burst */}
          <InkStar
            className="absolute transition-all duration-700"
            style={{ top: d.star.top, bottom: (d.star as any).bottom, right: d.star.right, width: d.star.size, height: d.star.size, color: slide.accent, opacity: d.star.opacity }}
          />
          {/* Swish arrow */}
          <InkSwish
            className="absolute transition-all duration-700"
            style={{ top: (d.swish as any).top, bottom: (d.swish as any).bottom, right: d.swish.right, width: d.swish.size, color: slide.accent, opacity: d.swish.opacity }}
          />
        </div>

        {/* ── Text content — left column ── */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full py-12">
          <div className="max-w-[480px]">
            {/* Tag */}
            <span className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full mb-5 tracking-wide text-white"
              style={{ backgroundColor: slide.accent }}>
              {slide.tag}
            </span>

            {/* Headline */}
            <h1 className="text-3xl md:text-[2.5rem] font-bold text-slate-900 leading-[1.2] mb-4 tracking-tight">
              {slide.headline}
            </h1>

            <p className="text-base text-slate-500 leading-relaxed mb-8 max-w-md">
              {slide.sub}
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <button onClick={() => triggerToast("Opening full story...")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all cursor-pointer"
                style={{ backgroundColor: B_INDIGO }}>
                <BookOpen size={14} /> Read Story
              </button>
              <button onClick={() => triggerToast("Opening video...")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer">
                <Play size={14} /> Watch More
              </button>
            </div>

            {/* Slide controls */}
            <div className="flex items-center gap-3">
              <button onClick={() => setHeroSlide((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-400 transition-all cursor-pointer">
                <ChevronLeft size={14} />
              </button>
              <div className="flex gap-2">
                {HERO_SLIDES.map((_, i) => (
                  <button key={i} onClick={() => setHeroSlide(i)}
                    className="rounded-full transition-all duration-300 cursor-pointer"
                    style={{ width: heroSlide === i ? 24 : 8, height: 8, backgroundColor: heroSlide === i ? slide.accent : "#CBD5E1" }} />
                ))}
              </div>
              <button onClick={() => setHeroSlide((p) => (p + 1) % HERO_SLIDES.length)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-400 transition-all cursor-pointer">
                <ChevronRight size={14} />
              </button>
              <span className="text-xs text-slate-400 font-semibold tabular-nums ml-1">
                {String(heroSlide + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ════════════════════════════════════════════════════════════════════
          2. PROGRAMME SPOTLIGHT — 70/30
      ════════════════════════════════════════════════════════════════════ */}
      <section id="programmes" className={`${secBg(1)} py-10 px-6 md:px-12`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-7">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-1">Our Programmes</p>
            <h2 className="text-2xl font-bold text-slate-900">Ways to make a difference</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">

            {/* LEFT 70% */}
            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden min-h-[340px] flex flex-col justify-between p-8 transition-all duration-700"
              style={{ backgroundColor: prog.bg }}>
              <div className="absolute top-0 left-0 w-1 h-full transition-colors duration-700"
                style={{ backgroundColor: prog.accent }} />

              <div className="relative z-10">
                <div className="flex gap-2 mb-5">
                  {FLAGSHIP_PROGRAMMES.map((p, i) => (
                    <button key={p.id} onClick={() => setFlagshipIdx(i)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      style={{ backgroundColor: i === flagshipIdx ? prog.accent : "rgba(255,255,255,0.1)", color: i === flagshipIdx ? "#111" : "rgba(255,255,255,0.6)" }}>
                      {p.id}
                    </button>
                  ))}
                </div>

                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-white/20 text-white/65">
                  {prog.label}
                </span>

                <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
                  Join the Volunteer Tribe
                </h3>

                <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">{prog.desc}</p>

                <div className="flex gap-3">
                  {[prog.stat1, prog.stat2].map((s) => (
                    <div key={s} className="bg-white/10 border border-white/15 rounded-xl px-4 py-1.5">
                      <p className="text-white font-bold text-sm">{s}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 flex gap-3 mt-6">
                <button onClick={() => navigate("register-role")}
                  className="flex-1 bg-white text-zinc-900 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-all cursor-pointer">
                  Start Volunteering
                </button>
                <button onClick={() => triggerToast("Exploring programme...")}
                  className="flex-1 bg-white/10 border border-white/20 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all cursor-pointer">
                  Learn More →
                </button>
              </div>
            </div>

            {/* RIGHT 30% */}
            <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-5 flex flex-col shadow-sm">
              <div className="mb-4">
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-0.5">By company</p>
                <h3 className="text-sm font-bold text-slate-900">Explore Company Volunteering</h3>
              </div>
              <div className="flex-1 space-y-1.5">
                {COMPANY_PROGRAMMES.map((co) => (
                  <button key={co.name}
                    onClick={() => triggerToast(`Viewing ${co.name} volunteering programme...`)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group text-left">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: co.dot }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-none mb-0.5">{co.name}</p>
                      <p className="text-xs text-slate-400 truncate">{co.desc}</p>
                    </div>
                    <ChevronRight size={11} className="text-slate-300 group-hover:text-slate-500 shrink-0" />
                  </button>
                ))}
              </div>
              <button onClick={() => triggerToast("Viewing all company programmes...")}
                className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
                View All Companies <ArrowRight size={11} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ════════════════════════════════════════════════════════════════════
          3. JOURNEY — dotted line + photo circles
      ════════════════════════════════════════════════════════════════════ */}
      <section id="journey" className={`${secBg(2)} py-10 px-6 md:px-12`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-1">Our Journey</p>
            <h2 className="text-2xl font-bold text-slate-900">Two decades of giving back</h2>
          </div>

          <div className="relative">
            <div className="absolute top-[36px] left-10 right-10 hidden lg:block"
              style={{ borderTop: "2px dashed #CBD5E1" }} />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {JOURNEY_MILESTONES.map((m) => (
                <div key={m.year} className="flex flex-col items-center text-center group">
                  <div className="relative z-10 mb-3">
                    <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-[3px] shadow-md transition-transform duration-200 group-hover:-translate-y-1"
                      style={{ borderColor: m.colour }}>
                      <img src={m.photo} alt={m.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white whitespace-nowrap"
                        style={{ backgroundColor: m.colour }}>
                        {m.year}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-bold text-slate-800 mb-0.5">{m.title}</p>
                    <p className="text-xs text-slate-500 leading-snug">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button onClick={() => triggerToast("Full journey coming soon...")}
              className="inline-flex items-center gap-2 text-sm font-bold hover:underline cursor-pointer"
              style={{ color: B_INDIGO }}>
              Read our full story <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ════════════════════════════════════════════════════════════════════
          4. FACTS + 3 STATS + SOCIAL
      ════════════════════════════════════════════════════════════════════ */}
      <section id="numbers" className={`${secBg(3)} py-10 px-6 md:px-12`}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-7">
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-1">By the numbers</p>
            <h2 className="text-2xl font-bold text-slate-900">The scale of our community</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Did You Know */}
            <div className="rounded-2xl p-7 flex flex-col justify-between min-h-[240px]"
              style={{ backgroundColor: B_INDIGO }}>
              <div>
                <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4"
                  style={{ backgroundColor: B_YELLOW, color: "#111" }}>
                  Did You Know?
                </span>
                <p className="text-white text-sm leading-relaxed font-medium transition-opacity duration-300"
                  style={{ opacity: factFading ? 0 : 1 }}>
                  {FUN_FACTS[factIdx]}
                </p>
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="flex gap-1.5">
                  {FUN_FACTS.map((_, i) => (
                    <button key={i}
                      onClick={() => { setFactFading(true); setTimeout(() => { setFactIdx(i); setFactFading(false); }, 280); }}
                      className="rounded-full transition-all cursor-pointer"
                      style={{ width: i === factIdx ? 16 : 7, height: 6, backgroundColor: i === factIdx ? B_YELLOW : "rgba(255,255,255,0.3)" }} />
                  ))}
                </div>
                <button onClick={cycleFact}
                  className="flex items-center gap-1 text-xs text-white/50 hover:text-white/80 transition-colors cursor-pointer font-semibold">
                  <RefreshCw size={11} /> Next
                </button>
              </div>
            </div>

            {/* 3 Stats — left-border colour distinction */}
            <div className="flex flex-col gap-3">
              {HERO_STATS.map((s) => (
                <div key={s.label} className="flex items-center gap-5 rounded-2xl p-5 bg-white border border-slate-100 shadow-sm"
                  style={{ borderLeft: `4px solid ${s.colour}` }}>
                  <div>
                    <p className="font-black tracking-tighter leading-none mb-0.5 text-4xl" style={{ color: s.colour }}>
                      {s.num}
                    </p>
                    <p className="text-sm font-bold text-slate-800">{s.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="bg-white border border-slate-100 rounded-2xl p-7 flex flex-col shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Social Spotlight</p>
                <div className="flex gap-2.5">
                  {[{ Icon: Facebook, c: "#2563EB" }, { Icon: Twitter, c: "#0EA5E9" }, { Icon: Instagram, c: "#EC4899" }, { Icon: Linkedin, c: "#1D4ED8" }, { Icon: Youtube, c: "#DC2626" }].map(({ Icon, c }) => (
                    <Icon key={c} size={14} className="text-slate-400 cursor-pointer transition-colors"
                      onMouseEnter={(e) => (e.currentTarget.style.color = c)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "")} />
                  ))}
                </div>
              </div>
              <div className="flex-1">
                {SOCIAL_POSTS.map((post, i) => (
                  <div key={i} className={i === socialIdx ? "block" : "hidden"}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: post.iconBg }}>
                        <post.Icon size={13} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none">{post.handle}</p>
                        <p className="text-xs text-slate-400">{post.time} · {post.platform}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3">{post.text}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">❤️ {post.likes} likes</span>
                      <button onClick={() => triggerToast("Opening social post...")}
                        className="text-xs font-bold hover:underline cursor-pointer" style={{ color: B_INDIGO }}>
                        View post →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5 justify-center mt-4 mb-4">
                {SOCIAL_POSTS.map((_, i) => (
                  <button key={i} onClick={() => setSocialIdx(i)}
                    className="rounded-full transition-all cursor-pointer"
                    style={{ width: i === socialIdx ? 16 : 7, height: 6, backgroundColor: i === socialIdx ? B_INDIGO : "#E2E8F0" }} />
                ))}
              </div>
              <button onClick={() => triggerToast("Opening social media...")}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
                Follow TataEngage
              </button>
            </div>
          </div>
        </div>
      </section>

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
                {["About Us", "Volunteering Policy", "FAQs", "Contact Us"].map((l) => (
                  <li key={l}><span className="hover:text-white transition-colors cursor-pointer">{l}</span></li>
                ))}
                <li><span className="hover:text-white cursor-pointer" onClick={() => navigate("login")}>Login</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm">Programmes</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                {["TVW — Tata Volunteering Week", "ProEngage", "Disaster Response"].map((l) => (
                  <li key={l}><span className="hover:text-white transition-colors cursor-pointer">{l}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-sm">Connect With Us</h4>
              <div className="flex gap-3.5 mb-5">
                {[{ Icon: Facebook, c: "hover:text-blue-400" }, { Icon: Twitter, c: "hover:text-sky-400" }, { Icon: Instagram, c: "hover:text-pink-400" }, { Icon: Linkedin, c: "hover:text-blue-400" }, { Icon: Youtube, c: "hover:text-red-500" }].map(({ Icon, c }) => (
                  <Icon key={c} size={17} className={`text-slate-500 ${c} cursor-pointer transition-colors`} />
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
                <span className="text-zinc-700 hover:text-zinc-400 cursor-pointer" onClick={() => navigate("login")}>Admin</span>
              </div>
              <img src={tataLogo} alt="Tata" className="h-6 object-contain brightness-0 invert opacity-40" />
            </div>
          </div>
        </div>
      </footer>

      {/* ════════════════════════════════════════════════════════════════════
          FIXED BOTTOM TICKER — persists as you scroll, HomeView only
      ════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 py-2.5 overflow-hidden"
        style={{ backgroundColor: B_INDIGO }}>
        <div className="flex items-center gap-4">
          <div className="shrink-0 pl-6 md:pl-12">
            <span className="text-xs font-black px-3 py-1.5 rounded-full whitespace-nowrap"
              style={{ backgroundColor: B_YELLOW, color: "#111" }}>
              LIVE
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-16 animate-marquee whitespace-nowrap">
              {tickerDouble.map((item, i) => (
                <span key={i} className="text-white/75 text-sm font-medium shrink-0 hover:text-white cursor-pointer transition-colors">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 32s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
};

export default HomeView;
