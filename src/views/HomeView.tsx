import { useState, useEffect, useRef } from "react";
import Footer from "@/components/layout/Footer";
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

// ─── DATA ────────────────────────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    photo:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1600",
    label: "Community",
    tag: "Education",
    headline:
      "Teaching coding to 200 girls in Pune — and changing what they think is possible",
    type: "story",
  },
  {
    photo:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1600",
    label: "Health",
    tag: "Impact",
    headline:
      "Free health camps reaching 10,000 rural families across Maharashtra",
    type: "video",
  },
  {
    photo:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1600",
    label: "Environment",
    tag: "Disaster Response",
    headline: "Tata volunteers deployed within 48 hours of Kerala floods",
    type: "story",
  },
  {
    photo:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600",
    label: "Skills",
    tag: "ProEngage",
    headline:
      "50 finance professionals mentoring rural entrepreneurs in Tier-3 cities",
    type: "video",
  },
];

const FLAGSHIP_PROGRAMMES = [
  {
    id: "TVW",
    colour: "tata-cyan",
    bgClass: "from-[#003a4f] to-[#005a72]",
    accentClass: "bg-tata-cyan text-zinc-900",
    label: "Bi-annual · Global",
    title: "Tata Volunteering Week",
    desc: "A bi-annual celebration of collective action. Join employees across all Tata companies for a week of volunteering that moves the needle.",
    stat1: "12 Editions",
    stat2: "50,000+ Volunteers",
  },
  {
    id: "ProEngage",
    colour: "violet-400",
    bgClass: "from-[#2e1065] to-[#4c1d95]",
    accentClass: "bg-violet-400 text-zinc-900",
    label: "Skill-based",
    title: "ProEngage",
    desc: "Match your professional skills to NGO projects. Work remotely or in-person on meaningful, high-impact engagements.",
    stat1: "1,200+ Projects",
    stat2: "85 NGO Partners",
  },
  {
    id: "DR",
    colour: "red-400",
    bgClass: "from-[#450a0a] to-[#7f1d1d]",
    accentClass: "bg-red-400 text-white",
    label: "Rapid Action",
    title: "Disaster Response",
    desc: "When disaster strikes, Tata volunteers deploy within 48 hours to provide relief and support across affected communities.",
    stat1: "24 Responses",
    stat2: "8 States covered",
  },
];

const COMPANY_PROGRAMMES = [
  { name: "TCS", desc: "Green Earth Initiative — 1,000 trees planted", colour: "bg-blue-600" },
  { name: "Titan", desc: "Skill India workshops for rural women", colour: "bg-amber-600" },
  { name: "Tata Steel", desc: "Community health camps — 20,000 beneficiaries", colour: "bg-slate-700" },
  { name: "Tata Motors", desc: "Road safety awareness across 12 cities", colour: "bg-red-700" },
  { name: "Tata Power", desc: "Solar literacy programme in Jharkhand", colour: "bg-yellow-600" },
  { name: "Taj Hotels", desc: "Culinary skills for underprivileged youth", colour: "bg-emerald-700" },
];

const JOURNEY_MILESTONES = [
  { year: "2007", title: "The Seed", desc: "TataEngage founded with a single programme across 4 companies." },
  { year: "2010", title: "TVW Born", desc: "Tata Volunteering Week launched — 8,000 volunteers in Year 1." },
  { year: "2015", title: "Going Digital", desc: "Platform launched to connect volunteers and NGOs online." },
  { year: "2018", title: "ProEngage", desc: "Skill-based volunteering programme introduced across Tata Group." },
  { year: "2020", title: "COVID Response", desc: "15,000 volunteers mobilised in 72 hours for pandemic relief." },
  { year: "2024", title: "50K Strong", desc: "50,000+ active volunteers across 100+ Tata companies globally." },
];

const FUN_FACTS = [
  { emoji: "🌍", fact: "Tata volunteers have collectively logged over 2.5 million hours of service since 2007." },
  { emoji: "🏫", fact: "1 in 4 ProEngage projects directly benefits children's education in rural India." },
  { emoji: "💡", fact: "85% of volunteers say their professional skills grew through ProEngage projects." },
  { emoji: "🌱", fact: "Tata companies have planted 1.2 million trees through volunteering drives." },
  { emoji: "🤝", fact: "NGOs report 3× faster project delivery when paired with skilled Tata volunteers." },
];

const IN_NUMBERS = [
  { num: "50,000+", label: "Active Volunteers" },
  { num: "85", label: "NGO Partners" },
  { num: "12", label: "TVW Editions" },
  { num: "150+", label: "Years of Legacy" },
  { num: "24", label: "Disaster Responses" },
  { num: "1,200+", label: "Projects Delivered" },
];

const SOCIAL_POSTS = [
  {
    platform: "twitter",
    handle: "@TataEngage",
    text: "Proud to announce 50,000 volunteers now on the platform! Thank you for making a difference 🙌 #TataEngage #ProEngage",
    likes: "1.2K",
    time: "2h ago",
  },
  {
    platform: "instagram",
    handle: "@tata_engage",
    text: "TVW 2026 is almost here! Tag a colleague you'd love to volunteer with 👇 #TVW2026 #TataVolunteers",
    likes: "3.4K",
    time: "1d ago",
  },
  {
    platform: "linkedin",
    handle: "Tata Engage",
    text: "ProEngage Edition 2026 now open — 400+ skill-based projects waiting for YOU. Link in bio.",
    likes: "892",
    time: "3d ago",
  },
];

const TICKER_ITEMS = [
  "🟢 ProEngage 2026 is now OPEN — 400+ projects live",
  "📅 TVW 2026 registration opens in 14 days",
  "🏅 1,240 volunteers matched this edition — a new record",
  "🌿 TCS: 1,000 trees planted across 8 campuses",
  "🚨 Disaster Response team deployed to Assam floods",
  "🎓 New: Finance Mentorship projects now accepting applications",
];

const SECTION_IDS = ["hero", "programme-spotlight", "our-journey", "facts-numbers", "news-ticker"];
const SECTION_LABELS = ["Home", "Programmes", "Our Journey", "Facts & Numbers", "What's New"];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

const HomeView = () => {
  const navigate = useAppNavigate();
  const { triggerToast } = useAppContext();

  // Section dot rail
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

  // Hero carousel
  const [heroSlide, setHeroSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setHeroSlide((p) => (p + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  // Flagship programme autoscroll
  const [flagshipIdx, setFlagshipIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setFlagshipIdx((p) => (p + 1) % FLAGSHIP_PROGRAMMES.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Fun fact rotation
  const [factIdx, setFactIdx] = useState(0);
  const [factFading, setFactFading] = useState(false);
  const cycleFact = () => {
    setFactFading(true);
    setTimeout(() => {
      setFactIdx((p) => (p + 1) % FUN_FACTS.length);
      setFactFading(false);
    }, 300);
  };
  useEffect(() => {
    const t = setInterval(cycleFact, 5000);
    return () => clearInterval(t);
  }, []);

  // Social post cycling
  const [socialIdx, setSocialIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSocialIdx((p) => (p + 1) % SOCIAL_POSTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Ticker duplicate for seamless loop
  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS];

  const isDarkSection = (i: number) => i === 0 || i === 4;

  const platformIcon = (platform: string) => {
    if (platform === "twitter") return <Twitter size={14} />;
    if (platform === "instagram") return <Instagram size={14} />;
    return <Linkedin size={14} />;
  };

  return (
    <div className="relative">

      {/* ═══ SECTION DOT RAIL ═══ */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
        {SECTION_IDS.map((id, i) => {
          const dark = isDarkSection(i);
          const isActive = activeSection === i;
          return (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center justify-end group"
              aria-label={`Scroll to ${SECTION_LABELS[i]}`}
            >
              {isActive && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mr-2 whitespace-nowrap border ${
                  dark ? "text-white bg-white/15 border-white/20" : "text-slate-700 bg-white border-slate-200 shadow-sm"
                }`}>
                  {SECTION_LABELS[i]}
                </span>
              )}
              <span className={`rounded-full transition-all duration-300 shrink-0 ${
                isActive
                  ? dark ? "w-2.5 h-2.5 bg-white scale-125" : "w-2.5 h-2.5 bg-slate-700 scale-125"
                  : dark ? "w-2 h-2 bg-white/30 hover:bg-white/60" : "w-2 h-2 bg-slate-300 hover:bg-slate-500"
              }`} />
            </button>
          );
        })}
      </div>

      {/* ═══ CONTACT US ═══ */}
      <button
        onClick={() => triggerToast("Opening contact form...")}
        className="fixed bottom-6 left-6 z-50 bg-white text-zinc-900 text-sm font-semibold px-4 py-2.5 rounded-full shadow-md border border-zinc-200 hover:bg-zinc-50 transition-all cursor-pointer"
      >
        Contact Us
      </button>

      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO — Story Carousel
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-[88vh] bg-zinc-950 flex items-end overflow-hidden pt-16">

        {/* Carousel backgrounds */}
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${heroSlide === i ? "opacity-100" : "opacity-0"}`}
          >
            <img
              src={slide.photo}
              alt={slide.label}
              className="w-full h-full object-cover opacity-30"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full pb-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-tata-cyan inline-block" />
              Tata Group · Volunteering Platform
            </span>

            <div className="mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-tata-cyan">
                {HERO_SLIDES[heroSlide].tag}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] mb-6 tracking-tight">
              {HERO_SLIDES[heroSlide].headline}
            </h1>

            {/* CTA row */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => triggerToast("Opening full story...")}
                className="flex items-center gap-2 bg-white text-zinc-900 px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-all cursor-pointer"
              >
                <BookOpen size={16} />
                Read Story
              </button>
              <button
                onClick={() => triggerToast("Opening video...")}
                className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all cursor-pointer"
              >
                <Play size={16} />
                Watch More
              </button>
            </div>

            {/* Register prompt */}
            <button
              onClick={() => navigate("register-role")}
              className="flex items-center gap-2 text-white/50 text-sm hover:text-white/80 transition-colors cursor-pointer"
            >
              Not a volunteer yet? Join TataEngage <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Slide counter + controls */}
        <div className="absolute bottom-6 left-6 md:left-12 z-20 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHeroSlide((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
              className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setHeroSlide((p) => (p + 1) % HERO_SLIDES.length)}
              className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
            <span className="text-white/40 text-xs font-semibold ml-2 tabular-nums">
              {String(heroSlide + 1).padStart(2, "0")} / {String(HERO_SLIDES.length).padStart(2, "0")}
            </span>
          </div>
          <div className="flex gap-1.5">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlide(i)}
                className={`rounded-full transition-all cursor-pointer ${heroSlide === i ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/30"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. PROGRAMME SPOTLIGHT — two-column
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="programme-spotlight" className="py-16 px-6 md:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-8">
            What we do
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* LEFT: Join the Volunteer Tribe — autoscroll through programmes */}
            <div className={`relative rounded-3xl overflow-hidden min-h-[440px] bg-gradient-to-br ${FLAGSHIP_PROGRAMMES[flagshipIdx].bgClass} flex flex-col justify-between p-8 transition-all duration-700`}>
              {/* Decorative geometric lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 440" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <circle cx="420" cy="80" r="240" fill="none" stroke="white" strokeWidth="0.5" opacity="0.08" />
                <circle cx="420" cy="80" r="140" fill="none" stroke="white" strokeWidth="0.5" opacity="0.06" />
                <line x1="0" y1="400" x2="500" y2="80" stroke="white" strokeWidth="0.5" opacity="0.07" />
                <circle cx="60" cy="400" r="60" fill="none" stroke="white" strokeWidth="0.5" opacity="0.07" />
              </svg>

              <div className="relative z-10">
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full tracking-wide mb-5 ${FLAGSHIP_PROGRAMMES[flagshipIdx].accentClass}`}>
                  {FLAGSHIP_PROGRAMMES[flagshipIdx].label}
                </span>
                <h2 className="text-3xl font-black text-white leading-tight mb-3">
                  Join the<br />Volunteer Tribe
                </h2>
                <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
                  {FLAGSHIP_PROGRAMMES[flagshipIdx].desc}
                </p>
                <div className="flex gap-4 mb-8">
                  <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2">
                    <p className="text-white font-bold text-sm">{FLAGSHIP_PROGRAMMES[flagshipIdx].stat1}</p>
                  </div>
                  <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2">
                    <p className="text-white font-bold text-sm">{FLAGSHIP_PROGRAMMES[flagshipIdx].stat2}</p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-3">
                {/* Programme tabs */}
                <div className="flex gap-2 mb-2">
                  {FLAGSHIP_PROGRAMMES.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => setFlagshipIdx(i)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${i === flagshipIdx ? "bg-white text-zinc-900" : "bg-white/15 text-white/70 hover:bg-white/25"}`}
                    >
                      {p.id}
                    </button>
                  ))}
                </div>
                {/* CTA buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate("register-role")}
                    className="flex-1 bg-white text-zinc-900 py-3 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-all cursor-pointer"
                  >
                    Start Volunteering
                  </button>
                  <button
                    onClick={() => triggerToast("Exploring programme...")}
                    className="flex-1 bg-white/10 border border-white/20 text-white py-3 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all cursor-pointer"
                  >
                    Learn More →
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: Explore Company Volunteering Programmes */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col min-h-[440px] shadow-sm">
              <div className="mb-6">
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-1">By company</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Explore Company Volunteering Programmes</h3>
              </div>

              <div className="flex-1 space-y-3">
                {COMPANY_PROGRAMMES.map((co) => (
                  <button
                    key={co.name}
                    onClick={() => triggerToast(`Viewing ${co.name} volunteering programme...`)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer group text-left"
                  >
                    <div className={`w-10 h-10 rounded-xl ${co.colour} flex items-center justify-center text-white text-sm font-black shrink-0`}>
                      {co.name.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900">{co.name}</p>
                      <p className="text-xs text-slate-500 truncate">{co.desc}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => triggerToast("Viewing all company programmes...")}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
              >
                View All Companies <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. OUR JOURNEY — Timeline
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="our-journey" className="py-16 px-6 md:px-12 bg-zinc-950 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-zinc-500 mb-2">
            Our Journey
          </p>
          <h2 className="text-3xl font-black text-white mb-12 tracking-tight">
            Two decades of giving back
          </h2>

          {/* Timeline */}
          <div className="relative">
            {/* Horizontal line */}
            <div className="absolute top-[22px] left-0 right-0 h-px bg-zinc-800" />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {JOURNEY_MILESTONES.map((m, i) => (
                <div key={m.year} className="relative flex flex-col items-start pt-1">
                  {/* Dot */}
                  <div className="w-11 h-11 rounded-full bg-zinc-900 border-2 border-tata-blue flex items-center justify-center mb-4 z-10 shrink-0 self-center">
                    <span className="text-xs font-black text-tata-cyan">{m.year.slice(2)}</span>
                  </div>
                  <p className="text-tata-cyan text-xs font-bold tracking-widest mb-1">{m.year}</p>
                  <p className="text-white font-bold text-sm mb-1 leading-tight">{m.title}</p>
                  <p className="text-zinc-500 text-xs leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 flex items-center justify-center">
            <button
              onClick={() => triggerToast("Full journey story coming soon...")}
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-white/70 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              Read our full story <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. FACTS · NUMBERS · SOCIAL
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="facts-numbers" className="py-16 px-6 md:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-8">
            By the numbers
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* LEFT: Fun Fact */}
            <div className="relative bg-zinc-950 rounded-3xl p-8 flex flex-col justify-between min-h-[320px] overflow-hidden">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <circle cx="340" cy="40" r="200" fill="none" stroke="white" strokeWidth="0.5" opacity="0.07" />
                <line x1="0" y1="280" x2="400" y2="80" stroke="white" strokeWidth="0.5" opacity="0.06" />
                <circle cx="60" cy="310" r="60" fill="none" stroke="white" strokeWidth="0.5" opacity="0.07" />
              </svg>

              <div className="relative z-10">
                <span className="inline-block bg-amber-400 text-zinc-900 text-xs font-bold px-3 py-1 rounded-full tracking-wide mb-5">
                  Did You Know?
                </span>
                <div
                  className="transition-opacity duration-300"
                  style={{ opacity: factFading ? 0 : 1 }}
                >
                  <p className="text-5xl mb-4">{FUN_FACTS[factIdx].emoji}</p>
                  <p className="text-white text-base leading-relaxed font-medium">
                    {FUN_FACTS[factIdx].fact}
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between mt-6">
                <div className="flex gap-1.5">
                  {FUN_FACTS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setFactFading(true); setTimeout(() => { setFactIdx(i); setFactFading(false); }, 300); }}
                      className={`rounded-full transition-all cursor-pointer ${i === factIdx ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/30"}`}
                    />
                  ))}
                </div>
                <button
                  onClick={cycleFact}
                  className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
                >
                  <RefreshCw size={13} />
                </button>
              </div>
            </div>

            {/* MIDDLE: In Numbers */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-6">In numbers</p>
              <div className="grid grid-cols-2 gap-5">
                {IN_NUMBERS.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-1">{stat.num}</p>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Mini impact bar */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-400 mb-3">Volunteer hours by programme</p>
                <div className="space-y-2">
                  {[
                    { label: "TVW", pct: 45, color: "bg-tata-cyan" },
                    { label: "ProEngage", pct: 38, color: "bg-violet-500" },
                    { label: "Disaster Response", pct: 17, color: "bg-red-500" },
                  ].map((bar) => (
                    <div key={bar.label} className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 w-28 shrink-0">{bar.label}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div className={`${bar.color} h-1.5 rounded-full`} style={{ width: `${bar.pct}%` }} />
                      </div>
                      <span className="text-xs text-slate-500 w-8 text-right">{bar.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Social Media Spotlight */}
            <div className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Social spotlight</p>
                <div className="flex gap-3">
                  <Facebook size={16} className="text-slate-400 hover:text-blue-600 cursor-pointer transition-colors" />
                  <Twitter size={16} className="text-slate-400 hover:text-sky-500 cursor-pointer transition-colors" />
                  <Instagram size={16} className="text-slate-400 hover:text-pink-500 cursor-pointer transition-colors" />
                  <Linkedin size={16} className="text-slate-400 hover:text-blue-700 cursor-pointer transition-colors" />
                  <Youtube size={16} className="text-slate-400 hover:text-red-600 cursor-pointer transition-colors" />
                </div>
              </div>

              {/* Post card */}
              <div className="flex-1 flex flex-col justify-between">
                {SOCIAL_POSTS.map((post, i) => (
                  <div
                    key={i}
                    className={`transition-all duration-500 ${i === socialIdx ? "block" : "hidden"}`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-tata-blue to-tata-cyan flex items-center justify-center text-white">
                        {platformIcon(post.platform)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{post.handle}</p>
                        <p className="text-xs text-slate-400">{post.time}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">{post.text}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">❤️ {post.likes} likes</span>
                      <button
                        onClick={() => triggerToast("Opening social post...")}
                        className="text-xs font-semibold text-tata-blue hover:underline cursor-pointer"
                      >
                        View post →
                      </button>
                    </div>
                  </div>
                ))}

                {/* Post navigation dots */}
                <div className="flex gap-1.5 mt-6 justify-center">
                  {SOCIAL_POSTS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSocialIdx(i)}
                      className={`rounded-full transition-all cursor-pointer ${i === socialIdx ? "w-4 h-1.5 bg-tata-blue" : "w-1.5 h-1.5 bg-slate-200"}`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => triggerToast("Opening social media feed...")}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Follow TataEngage
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          5. TICKER — News marquee
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="news-ticker" className="bg-zinc-950 border-t border-white/5 py-4 overflow-hidden">
        <div className="flex items-center gap-4">
          {/* Label */}
          <div className="shrink-0 pl-6 md:pl-12">
            <span className="bg-tata-cyan text-zinc-900 text-xs font-black px-3 py-1.5 rounded-full tracking-wide whitespace-nowrap">
              LIVE
            </span>
          </div>

          {/* Scrolling track */}
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-12 animate-marquee whitespace-nowrap">
              {tickerContent.map((item, i) => (
                <span key={i} className="text-white/60 text-sm font-medium shrink-0 cursor-pointer hover:text-white transition-colors">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER (with subscribe box)
      ══════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-zinc-950 text-white pt-16 pb-8 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Subscribe row */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
            <div>
              <p className="font-bold text-white mb-1">Stay in the loop</p>
              <p className="text-sm text-slate-400">Get updates on TVW, ProEngage seasons, and impact stories.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Your name"
                className="flex-1 md:w-36 bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-tata-cyan transition-colors"
              />
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 md:w-48 bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-tata-cyan transition-colors"
              />
              <button
                onClick={() => triggerToast("Subscribed! Welcome to TataEngage updates.")}
                className="bg-tata-cyan text-zinc-900 text-sm font-bold px-5 py-2.5 rounded-xl hover:brightness-110 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* Footer grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <p className="font-black text-lg text-white mb-4 tracking-tight">TataEngage</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                The Tata Group's volunteering platform — connecting employees, families, and retirees with meaningful opportunities across India and the world.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><span className="hover:text-white transition-colors cursor-pointer">About Us</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Volunteering Policy</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">FAQs</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Contact Us</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate("login")}>Login</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-white">Programmes</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><span className="hover:text-white transition-colors cursor-pointer">TVW (Tata Volunteering Week)</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">ProEngage</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Disaster Response</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-white">Connect With Us</h4>
              <div className="flex gap-4 mb-6">
                <Facebook size={20} className="text-slate-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter size={20} className="text-slate-400 hover:text-white cursor-pointer transition-colors" />
                <Instagram size={20} className="text-slate-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin size={20} className="text-slate-400 hover:text-white cursor-pointer transition-colors" />
                <Youtube size={20} className="text-slate-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© 2026 Tata Sons Private Limited. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer">Terms of Use</span>
              <span className="hover:text-white cursor-pointer">Cookie Policy</span>
              <span className="text-zinc-700 hover:text-zinc-400 transition-colors cursor-pointer" onClick={() => navigate("login")}>Admin access</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Marquee keyframe — inject via style tag */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default HomeView;
