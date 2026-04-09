import { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Play,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
} from "lucide-react";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useAppContext } from "@/context/AppContext";
import tataLogo from "@/assets/tata-logo.png";
import tataEngageLogo from "@/assets/tata-engage-logo-nobg.png";

// ─── DOODLE ACCENTS ───────────────────────────────────────────────────────────

const DoodleCircle = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M40 6 C60 4, 76 18, 74 40 C72 62, 56 76, 36 74 C16 72, 2 56, 4 36 C6 16, 20 8, 40 6Z"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeDasharray="5 3" />
  </svg>
);

const DoodleStar = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M20 3 L22.5 15 L34 10 L26 20 L37 27 L25 27 L23 39 L18 28 L6 33 L14 22 L3 15 L16 17 Z"
      stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
  </svg>
);

const DoodleWave = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M2 10 C14 2, 26 18, 38 10 C50 2, 62 18, 74 10 C86 2, 98 18, 110 10 C116 6, 118 8, 120 10"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const DoodleUnderline = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 160 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M2 8 C40 2, 80 12, 120 6 C140 3, 152 5, 158 8"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
  </svg>
);

const DoodleDots = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <circle cx="6" cy="10" r="3.5" fill="currentColor" opacity="0.6" />
    <circle cx="20" cy="6" r="2.5" fill="currentColor" opacity="0.4" />
    <circle cx="34" cy="13" r="4" fill="currentColor" opacity="0.5" />
    <circle cx="48" cy="5" r="2" fill="currentColor" opacity="0.35" />
    <circle cx="56" cy="14" r="3" fill="currentColor" opacity="0.5" />
  </svg>
);

const DoodleArrow = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M2 22 C14 8, 30 6, 46 14 C52 17, 55 20, 57 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M50 16 L57 22 L50 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// ─── DATA ────────────────────────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    gradient: "from-[#FF6B35] via-[#FFAD7A] to-[#FFF3EC]",
    inkColor: "#2D1000",
    doodleColor: "#FF6B35",
    tag: "Education",
    tagBg: "bg-[#FF6B35] text-white",
    headline: "Teaching coding to 200 girls in Pune",
    sub: "Changing what an entire generation believes is possible.",
    illustration: "👩‍💻",
  },
  {
    gradient: "from-[#003580] via-[#005CC8] to-[#D6E9FF]",
    inkColor: "#001833",
    doodleColor: "#F5C842",
    tag: "Health",
    tagBg: "bg-[#F5C842] text-zinc-900",
    headline: "10,000 rural families reached by free health camps",
    sub: "Across Maharashtra, one community at a time.",
    illustration: "🏥",
  },
  {
    gradient: "from-[#1A4731] via-[#2A7A50] to-[#D6F5E6]",
    inkColor: "#0D2B1A",
    doodleColor: "#6EE7B7",
    tag: "Environment",
    tagBg: "bg-[#6EE7B7] text-zinc-900",
    headline: "1 million trees planted across Tata campuses",
    sub: "A greener future, built branch by branch.",
    illustration: "🌱",
  },
  {
    gradient: "from-[#4C1D95] via-[#7C3AED] to-[#EDE9FE]",
    inkColor: "#1E0A45",
    doodleColor: "#00b4d8",
    tag: "Disaster Response",
    tagBg: "bg-[#00b4d8] text-zinc-900",
    headline: "Tata volunteers on-ground within 48 hrs of Kerala floods",
    sub: "The fastest humanitarian response in Tata history.",
    illustration: "🚁",
  },
];

const FLAGSHIP_PROGRAMMES = [
  {
    id: "TVW",
    bg: "bg-[#003580]",
    accent: "bg-[#F5C842] text-zinc-900",
    label: "Bi-annual · Global",
    title: "Tata Volunteering Week",
    desc: "A bi-annual celebration of collective action across all Tata companies.",
    stat1: "12 Editions",
    stat2: "50K+ Volunteers",
    emoji: "📅",
  },
  {
    id: "ProEngage",
    bg: "bg-[#4C1D95]",
    accent: "bg-violet-300 text-zinc-900",
    label: "Skill-based",
    title: "ProEngage",
    desc: "Match your professional expertise to NGO projects that need it most.",
    stat1: "1,200+ Projects",
    stat2: "85 NGO Partners",
    emoji: "🤝",
  },
  {
    id: "Disaster",
    bg: "bg-[#7f1d1d]",
    accent: "bg-red-300 text-zinc-900",
    label: "Rapid Action",
    title: "Disaster Response",
    desc: "Volunteers deployed within 48 hours when communities need it most.",
    stat1: "24 Responses",
    stat2: "8 States",
    emoji: "🚨",
  },
];

const COMPANY_PROGRAMMES = [
  { name: "TCS", desc: "Green Earth — 1,000 trees planted", colour: "bg-tata-blue", textColour: "text-white" },
  { name: "Titan", desc: "Skill India workshops for rural women", colour: "bg-accent-yellow", textColour: "text-zinc-900" },
  { name: "Tata Steel", desc: "Community health camps — 20K beneficiaries", colour: "bg-slate-700", textColour: "text-white" },
  { name: "Tata Motors", desc: "Road safety awareness, 12 cities", colour: "bg-red-600", textColour: "text-white" },
  { name: "Tata Power", desc: "Solar literacy programme, Jharkhand", colour: "bg-amber-500", textColour: "text-zinc-900" },
  { name: "Taj Hotels", desc: "Culinary skills for underprivileged youth", colour: "bg-emerald-700", textColour: "text-white" },
];

const JOURNEY_MILESTONES = [
  { year: "2007", emoji: "🌱", title: "The Seed", desc: "TataEngage founded with 4 companies." },
  { year: "2010", emoji: "📅", title: "TVW Born", desc: "8,000 volunteers in Year 1." },
  { year: "2015", emoji: "💻", title: "Going Digital", desc: "Platform launched for NGO connections." },
  { year: "2018", emoji: "🤝", title: "ProEngage", desc: "Skill-based volunteering introduced." },
  { year: "2020", emoji: "🚨", title: "COVID Response", desc: "15,000 volunteers in 72 hours." },
  { year: "2024", emoji: "🏅", title: "50K Strong", desc: "50K+ volunteers, 100+ companies." },
];

const FUN_FACTS = [
  { emoji: "🌍", fact: "Tata volunteers have collectively logged over 2.5 million hours of service since 2007." },
  { emoji: "🏫", fact: "1 in 4 ProEngage projects directly benefits children's education in rural India." },
  { emoji: "💡", fact: "85% of volunteers say their professional skills grew through ProEngage projects." },
  { emoji: "🌱", fact: "Tata companies have planted 1.2 million trees through volunteering drives." },
  { emoji: "🤝", fact: "NGOs report 3x faster delivery when paired with skilled Tata volunteers." },
];

const IN_NUMBERS = [
  { num: "50,000+", label: "Active Volunteers", colour: "text-tata-blue" },
  { num: "85", label: "NGO Partners", colour: "text-violet-600" },
  { num: "12", label: "TVW Editions", colour: "text-tata-blue" },
  { num: "150+", label: "Years of Legacy", colour: "text-amber-500" },
  { num: "24", label: "Disaster Responses", colour: "text-red-500" },
  { num: "1,200+", label: "Projects Delivered", colour: "text-emerald-600" },
];

const SOCIAL_POSTS = [
  {
    platform: "twitter",
    handle: "@TataEngage",
    text: "Proud to announce 50,000 volunteers now on the platform! Thank you 🙌 #TataEngage",
    likes: "1.2K",
    time: "2h ago",
    colour: "bg-sky-500",
    icon: <Twitter size={13} />,
  },
  {
    platform: "instagram",
    handle: "@tata_engage",
    text: "TVW 2026 is almost here! Tag a colleague you'd volunteer with 👇 #TVW2026",
    likes: "3.4K",
    time: "1d ago",
    colour: "bg-pink-500",
    icon: <Instagram size={13} />,
  },
  {
    platform: "linkedin",
    handle: "Tata Engage",
    text: "ProEngage Edition 2026 now open — 400+ skill-based projects waiting for YOU.",
    likes: "892",
    time: "3d ago",
    colour: "bg-blue-700",
    icon: <Linkedin size={13} />,
  },
];

const TICKER_ITEMS = [
  "🟢  ProEngage 2026 is now OPEN — 400+ projects live",
  "📅  TVW 2026 registration opens in 14 days",
  "🏅  1,240 volunteers matched — a new record",
  "🌿  TCS: 1,000 trees planted across 8 campuses",
  "🚨  Disaster Response deployed to Assam floods",
  "🎓  Finance Mentorship projects now accepting applications",
];

const SECTION_IDS = ["hero", "programme-spotlight", "our-journey", "facts-numbers", "news-ticker"];
const SECTION_LABELS = ["Home", "Programmes", "Journey", "Numbers", "News"];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

const HomeView = () => {
  const navigate = useAppNavigate();
  const { triggerToast } = useAppContext();

  const [activeSection, setActiveSection] = useState(0);
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(idx); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const [heroSlide, setHeroSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setHeroSlide((p) => (p + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const [flagshipIdx, setFlagshipIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setFlagshipIdx((p) => (p + 1) % FLAGSHIP_PROGRAMMES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const [factIdx, setFactIdx] = useState(0);
  const [factFading, setFactFading] = useState(false);
  const cycleFact = () => {
    setFactFading(true);
    setTimeout(() => { setFactIdx((p) => (p + 1) % FUN_FACTS.length); setFactFading(false); }, 280);
  };
  useEffect(() => {
    const t = setInterval(cycleFact, 5000);
    return () => clearInterval(t);
  }, []);

  const [socialIdx, setSocialIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSocialIdx((p) => (p + 1) % SOCIAL_POSTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const slide = HERO_SLIDES[heroSlide];
  const prog = FLAGSHIP_PROGRAMMES[flagshipIdx];
  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative">

      {/* ═══ SECTION DOT RAIL ═══ */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
        {SECTION_IDS.map((id, i) => {
          const isActive = activeSection === i;
          return (
            <button key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center justify-end group">
              {isActive && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full mr-2 whitespace-nowrap border bg-white border-slate-200 text-slate-700 shadow-sm">
                  {SECTION_LABELS[i]}
                </span>
              )}
              <span className={`rounded-full transition-all duration-300 shrink-0 ${isActive ? "w-2.5 h-2.5 bg-tata-blue scale-125" : "w-2 h-2 bg-slate-300 hover:bg-tata-blue/50"}`} />
            </button>
          );
        })}
      </div>

      {/* ═══ CONTACT US ═══ */}
      <button onClick={() => triggerToast("Opening contact form...")}
        className="fixed bottom-6 left-6 z-50 bg-white text-zinc-900 text-sm font-semibold px-4 py-2.5 rounded-full shadow-md border border-zinc-200 hover:bg-zinc-50 transition-all cursor-pointer">
        Contact Us
      </button>

      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative overflow-hidden pt-16">
        {HERO_SLIDES.map((s, i) => (
          <div key={i}
            className={`absolute inset-0 bg-gradient-to-br ${s.gradient} transition-opacity duration-700 ${heroSlide === i ? "opacity-100" : "opacity-0"}`}
          />
        ))}

        {/* Doodle layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <DoodleCircle className="absolute top-6 right-14 w-20 h-20 opacity-20" style={{ color: slide.doodleColor }} />
          <DoodleStar className="absolute top-20 right-48 w-10 h-10 opacity-25" style={{ color: slide.doodleColor }} />
          <DoodleWave className="absolute bottom-16 right-10 w-36 opacity-20" style={{ color: slide.doodleColor }} />
          <DoodleDots className="absolute top-12 left-1/2 w-20 opacity-20" style={{ color: slide.doodleColor }} />
          <DoodleCircle className="absolute bottom-12 left-24 w-14 h-14 opacity-15" style={{ color: slide.doodleColor }} />
          <DoodleStar className="absolute bottom-20 left-12 w-7 h-7 opacity-20" style={{ color: slide.doodleColor }} />
          <span className="absolute right-10 top-1/2 -translate-y-1/2 text-[7rem] opacity-[0.18] select-none hidden lg:block">
            {slide.illustration}
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10">
          <div className="max-w-2xl">
            <span className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5 tracking-wide ${slide.tagBg}`}>
              {slide.tag}
            </span>

            <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] mb-2 tracking-tight" style={{ color: slide.inkColor }}>
              {slide.headline}
            </h1>
            <DoodleUnderline className="w-48 mb-4 opacity-35" style={{ color: slide.doodleColor }} />

            <p className="text-base leading-relaxed mb-6 max-w-lg opacity-65" style={{ color: slide.inkColor }}>
              {slide.sub}
            </p>

            <div className="flex flex-wrap gap-3 mb-5">
              <button onClick={() => triggerToast("Opening full story...")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer bg-white/80 hover:bg-white text-zinc-900 backdrop-blur-sm border border-white/60 shadow-sm">
                <BookOpen size={14} /> Read Story
              </button>
              <button onClick={() => triggerToast("Opening video...")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border border-black/15 hover:bg-black/5"
                style={{ color: slide.inkColor }}>
                <Play size={14} /> Watch More
              </button>
            </div>

            <button onClick={() => navigate("register-role")}
              className="flex items-center gap-1.5 text-sm font-semibold opacity-55 hover:opacity-90 transition-opacity cursor-pointer"
              style={{ color: slide.inkColor }}>
              Not a volunteer yet? Join TataEngage <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Slide controls */}
        <div className="relative z-10 flex items-center justify-between px-6 md:px-12 pb-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <button onClick={() => setHeroSlide((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
              className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-all cursor-pointer">
              <ChevronLeft size={14} style={{ color: slide.inkColor }} />
            </button>
            <button onClick={() => setHeroSlide((p) => (p + 1) % HERO_SLIDES.length)}
              className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-all cursor-pointer">
              <ChevronRight size={14} style={{ color: slide.inkColor }} />
            </button>
            <div className="flex gap-1.5 ml-2">
              {HERO_SLIDES.map((_, i) => (
                <button key={i} onClick={() => setHeroSlide(i)} className="rounded-full transition-all cursor-pointer"
                  style={{ width: heroSlide === i ? "20px" : "8px", height: "8px", backgroundColor: heroSlide === i ? slide.inkColor : slide.inkColor + "40" }} />
              ))}
            </div>
          </div>
          <span className="text-xs font-bold tabular-nums opacity-35" style={{ color: slide.inkColor }}>
            {String(heroSlide + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
          </span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. PROGRAMME SPOTLIGHT — 70/30
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="programme-spotlight" className="py-8 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <DoodleStar className="w-5 h-5 text-accent-yellow" />
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400">What we do</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">

            {/* LEFT 70% */}
            <div className={`lg:col-span-7 relative rounded-3xl overflow-hidden min-h-[360px] ${prog.bg} flex flex-col justify-between p-7 transition-all duration-700`}>
              <div className="absolute inset-0 pointer-events-none">
                <DoodleCircle className="absolute top-5 right-7 w-24 h-24 text-white opacity-[0.07]" />
                <DoodleStar className="absolute bottom-10 right-16 w-14 h-14 text-white opacity-[0.07]" />
                <DoodleWave className="absolute bottom-5 left-7 w-40 text-white opacity-[0.06]" />
                <DoodleDots className="absolute top-8 left-1/2 w-24 text-white opacity-[0.07]" />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[5rem] opacity-[0.10] select-none hidden lg:block">
                  {prog.emoji}
                </span>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full tracking-wide ${prog.accent}`}>
                    {prog.label}
                  </span>
                  <div className="flex gap-1.5">
                    {FLAGSHIP_PROGRAMMES.map((p, i) => (
                      <button key={p.id} onClick={() => setFlagshipIdx(i)}
                        className={`text-xs font-bold px-3 py-1 rounded-lg transition-all cursor-pointer ${i === flagshipIdx ? "bg-white text-zinc-900" : "bg-white/15 text-white/60 hover:bg-white/25"}`}>
                        {p.id}
                      </button>
                    ))}
                  </div>
                </div>

                <h2 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-2">
                  Join the Volunteer Tribe
                </h2>
                <DoodleUnderline className="w-36 text-white opacity-20 mb-4" />

                <p className="text-white/65 text-sm leading-relaxed mb-5 max-w-sm">
                  {prog.desc}
                </p>

                <div className="flex gap-3">
                  <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-1.5">
                    <p className="text-white font-bold text-sm">{prog.stat1}</p>
                  </div>
                  <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-1.5">
                    <p className="text-white font-bold text-sm">{prog.stat2}</p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex gap-3 mt-6">
                <button onClick={() => navigate("register-role")}
                  className="flex-1 bg-white text-zinc-900 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-all cursor-pointer">
                  Start Volunteering
                </button>
                <button onClick={() => triggerToast("Exploring programme...")}
                  className="flex-1 bg-white/10 border border-white/20 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all cursor-pointer">
                  Learn More
                </button>
              </div>
            </div>

            {/* RIGHT 30% */}
            <div className="lg:col-span-3 bg-slate-50 border border-slate-100 rounded-3xl p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <DoodleArrow className="w-7 text-tata-blue opacity-40" />
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400">By company</p>
              </div>
              <h3 className="font-serif text-base text-slate-900 leading-tight mb-4">
                Explore Company Volunteering
              </h3>

              <div className="flex-1 space-y-2">
                {COMPANY_PROGRAMMES.map((co) => (
                  <button key={co.name}
                    onClick={() => triggerToast(`Viewing ${co.name} volunteering programme...`)}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-slate-100 hover:border-tata-blue/20 hover:bg-blue-50/50 transition-all cursor-pointer group text-left">
                    <div className={`w-8 h-8 rounded-xl ${co.colour} flex items-center justify-center ${co.textColour} text-xs font-black shrink-0`}>
                      {co.name.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900">{co.name}</p>
                      <p className="text-xs text-slate-400 truncate leading-tight">{co.desc}</p>
                    </div>
                    <ChevronRight size={12} className="text-slate-300 group-hover:text-tata-blue transition-colors shrink-0" />
                  </button>
                ))}
              </div>

              <button onClick={() => triggerToast("Viewing all company programmes...")}
                className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer">
                View All <ArrowRight size={11} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. OUR JOURNEY
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="our-journey" className="py-8 px-6 md:px-12 bg-[#F0EEFF]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <DoodleCircle className="w-5 h-5 text-tata-blue opacity-50" />
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Our Journey</p>
            <DoodleWave className="w-16 text-tata-blue opacity-25" />
          </div>
          <h2 className="font-serif text-3xl text-slate-900 mb-6 leading-tight">
            Two decades of <span className="text-tata-blue">giving back</span>
          </h2>

          <div className="relative">
            <div className="absolute top-8 left-8 right-8 h-px bg-tata-blue/10 hidden lg:block" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {JOURNEY_MILESTONES.map((m) => (
                <div key={m.year} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-tata-blue/15 flex flex-col items-center justify-center mb-3 group-hover:border-tata-blue transition-colors shadow-sm z-10 relative">
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-[10px] font-black text-tata-blue leading-none">{m.year}</span>
                  </div>
                  <p className="text-xs font-black text-slate-900 mb-0.5">{m.title}</p>
                  <p className="text-xs text-slate-500 leading-snug">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button onClick={() => triggerToast("Full journey coming soon...")}
              className="inline-flex items-center gap-2 text-tata-blue text-sm font-bold hover:underline cursor-pointer">
              Read our full story <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. FACTS + NUMBERS + SOCIAL
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="facts-numbers" className="py-8 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <DoodleDots className="w-14 text-accent-yellow" />
            <p className="text-xs font-bold tracking-widest uppercase text-slate-400">By the numbers</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Fun Fact */}
            <div className="relative bg-tata-blue rounded-3xl p-7 flex flex-col justify-between min-h-[260px] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <DoodleCircle className="absolute top-4 right-4 w-20 h-20 text-white opacity-[0.08]" />
                <DoodleStar className="absolute bottom-8 right-6 w-12 h-12 text-accent-yellow opacity-[0.15]" />
                <DoodleWave className="absolute bottom-3 left-4 w-32 text-white opacity-[0.07]" />
              </div>
              <div className="relative z-10">
                <span className="inline-block bg-accent-yellow text-zinc-900 text-xs font-black px-3 py-1 rounded-full tracking-wide mb-4">
                  Did You Know?
                </span>
                <div className="transition-opacity duration-300" style={{ opacity: factFading ? 0 : 1 }}>
                  <p className="text-4xl mb-3">{FUN_FACTS[factIdx].emoji}</p>
                  <p className="text-white text-sm leading-relaxed font-medium">{FUN_FACTS[factIdx].fact}</p>
                </div>
              </div>
              <div className="relative z-10 flex items-center justify-between mt-4">
                <div className="flex gap-1.5">
                  {FUN_FACTS.map((_, i) => (
                    <button key={i}
                      onClick={() => { setFactFading(true); setTimeout(() => { setFactIdx(i); setFactFading(false); }, 280); }}
                      className="rounded-full transition-all cursor-pointer"
                      style={{ width: i === factIdx ? "16px" : "7px", height: "6px", backgroundColor: i === factIdx ? "#F5C842" : "rgba(255,255,255,0.3)" }} />
                  ))}
                </div>
                <button onClick={cycleFact}
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer">
                  <RefreshCw size={13} />
                </button>
              </div>
            </div>

            {/* In Numbers */}
            <div className="relative bg-[#FFFBEB] border border-amber-100 rounded-3xl p-7 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <DoodleCircle className="absolute -bottom-6 -right-6 w-28 h-28 text-amber-300 opacity-20" />
                <DoodleStar className="absolute top-4 right-6 w-8 h-8 text-amber-400 opacity-20" />
              </div>
              <p className="text-xs font-black tracking-widest uppercase text-amber-600 mb-5">In numbers</p>
              <div className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-5">
                {IN_NUMBERS.map((stat) => (
                  <div key={stat.label}>
                    <p className={`text-3xl font-black tracking-tighter leading-none mb-0.5 ${stat.colour}`}>{stat.num}</p>
                    <p className="text-xs text-slate-500 font-semibold leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="bg-white border border-slate-100 rounded-3xl p-7 flex flex-col shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <DoodleWave className="w-8 text-tata-blue opacity-30" />
                  <p className="text-xs font-black tracking-widest uppercase text-slate-400">Social</p>
                </div>
                <div className="flex gap-2.5">
                  {[
                    { Icon: Facebook, hv: "hover:text-blue-600" },
                    { Icon: Twitter, hv: "hover:text-sky-500" },
                    { Icon: Instagram, hv: "hover:text-pink-500" },
                    { Icon: Linkedin, hv: "hover:text-blue-700" },
                    { Icon: Youtube, hv: "hover:text-red-600" },
                  ].map(({ Icon, hv }) => (
                    <Icon key={hv} size={14} className={`text-slate-400 ${hv} cursor-pointer transition-colors`} />
                  ))}
                </div>
              </div>
              <div className="flex-1">
                {SOCIAL_POSTS.map((post, i) => (
                  <div key={i} className={i === socialIdx ? "block" : "hidden"}>
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={`w-8 h-8 rounded-full ${post.colour} flex items-center justify-center text-white shrink-0`}>
                        {post.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none">{post.handle}</p>
                        <p className="text-xs text-slate-400">{post.time}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed mb-3">{post.text}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">❤️ {post.likes}</span>
                      <button onClick={() => triggerToast("Opening social post...")}
                        className="text-xs font-bold text-tata-blue hover:underline cursor-pointer">View post →</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5 justify-center my-3">
                {SOCIAL_POSTS.map((_, i) => (
                  <button key={i} onClick={() => setSocialIdx(i)}
                    className="rounded-full transition-all cursor-pointer"
                    style={{ width: i === socialIdx ? "16px" : "7px", height: "6px", backgroundColor: i === socialIdx ? "#003580" : "#e2e8f0" }} />
                ))}
              </div>
              <button onClick={() => triggerToast("Opening social media...")}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer">
                Follow TataEngage
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. TICKER
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="news-ticker" className="bg-tata-blue py-3 overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="shrink-0 pl-6 md:pl-12">
            <span className="bg-accent-yellow text-zinc-900 text-xs font-black px-3 py-1.5 rounded-full whitespace-nowrap">
              LIVE
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-16 animate-marquee whitespace-nowrap">
              {tickerContent.map((item, i) => (
                <span key={i} className="text-white/75 text-sm font-medium shrink-0 hover:text-white cursor-pointer transition-colors">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-zinc-950 text-white pt-10 pb-7 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

            <div>
              <img src={tataEngageLogo} alt="TataEngage" className="h-9 object-contain brightness-0 invert mb-3" />
              <p className="text-slate-400 text-sm leading-relaxed">
                Tata Group's platform for volunteering — connecting employees, families, and retirees with meaningful opportunities.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm text-white">Quick Links</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                {["About Us", "Volunteering Policy", "FAQs", "Contact Us"].map((l) => (
                  <li key={l}><span className="hover:text-white transition-colors cursor-pointer">{l}</span></li>
                ))}
                <li><span className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate("login")}>Login</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm text-white">Programmes</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                {["TVW (Tata Volunteering Week)", "ProEngage", "Disaster Response"].map((l) => (
                  <li key={l}><span className="hover:text-white transition-colors cursor-pointer">{l}</span></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-sm text-white">Connect With Us</h4>
              <div className="flex gap-3.5 mb-5">
                {[
                  { Icon: Facebook, hv: "hover:text-blue-400" },
                  { Icon: Twitter, hv: "hover:text-sky-400" },
                  { Icon: Instagram, hv: "hover:text-pink-400" },
                  { Icon: Linkedin, hv: "hover:text-blue-400" },
                  { Icon: Youtube, hv: "hover:text-red-500" },
                ].map(({ Icon, hv }) => (
                  <Icon key={hv} size={17} className={`text-slate-500 ${hv} cursor-pointer transition-colors`} />
                ))}
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Newsletter</p>
              <div className="flex flex-col gap-2">
                <input type="text" placeholder="Your name"
                  className="bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-xs rounded-xl px-3 py-2 outline-none focus:border-tata-cyan transition-colors" />
                <input type="email" placeholder="Your email"
                  className="bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-xs rounded-xl px-3 py-2 outline-none focus:border-tata-cyan transition-colors" />
                <button onClick={() => triggerToast("Subscribed! Welcome to TataEngage updates.")}
                  className="bg-tata-cyan text-zinc-900 text-xs font-bold px-4 py-2 rounded-xl hover:brightness-110 transition-all cursor-pointer">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-5 flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <img src={tataLogo} alt="Tata" className="h-6 object-contain brightness-0 invert opacity-40" />
              <p className="text-xs text-slate-600">© 2026 Tata Sons Private Limited. All rights reserved.</p>
            </div>
            <div className="flex gap-5 text-xs text-slate-500">
              {["Privacy Policy", "Terms of Use", "Cookie Policy"].map((l) => (
                <span key={l} className="hover:text-white cursor-pointer">{l}</span>
              ))}
              <span className="text-zinc-700 hover:text-zinc-400 cursor-pointer" onClick={() => navigate("login")}>Admin</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 32s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
};

export default HomeView;
