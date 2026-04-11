import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Play, BookOpen } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useAppContext } from "@/context/AppContext";
import tataLogo from "@/assets/tata-logo.png";
import tataEngageLogo from "@/assets/tata-engage-logo-nobg.png";
import {
  B_INDIGO, B_YELLOW, B_TEAL, B_BLUE, ACCENT_NAVY,
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
    photo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1400",
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
    photo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1400",
    accent: "#E8401C", tag: "Community", cta: "video" as const,
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
    photo: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1400",
    accent: B_TEAL, tag: "Environment", cta: "story" as const,
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
    photo: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=1400",
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

const SECTION_IDS    = ["hero", "programmes", "journey", "numbers"];
const SECTION_LABELS = ["Home", "Programmes", "Journey", "Numbers"];

// ── Component ─────────────────────────────────────────────────────────────────
const HomeView = () => {
  const navigate         = useAppNavigate();
  const { triggerToast } = useAppContext();

  const [activeSection, setActiveSection] = useState(0);
  const [heroSlide,     setHeroSlide]     = useState(0);

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

  const slide        = HERO_SLIDES[heroSlide];
  const d            = slide.doodles;

  return (
    <div className="relative font-sans pb-10">

      {/* ── Section dot rail ─────────────────────────────────────────────────── */}
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
          1. HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-[560px] flex items-center overflow-hidden pt-16 bg-white">

        <div className="absolute top-16 left-0 right-0 h-0.5 z-20 transition-colors duration-700"
          style={{ backgroundColor: slide.accent }} />

        <div className="absolute inset-0 flex justify-end">
          {HERO_SLIDES.map((s, i) => (
            <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${heroSlide === i ? "opacity-100" : "opacity-0"}`}>
              <img src={s.photo} alt={s.tag}
                className="absolute right-0 top-0 h-full w-[65%] object-cover object-center"
                referrerPolicy="no-referrer"
                style={{ transition: "transform 6s ease-out", transform: heroSlide === i ? "scale(1.04)" : "scale(1)" }}
              />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to right, #ffffff 0%, #ffffff 28%, rgba(255,255,255,0.85) 42%, rgba(255,255,255,0.35) 58%, rgba(255,255,255,0) 72%)"
              }} />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 18%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.6) 100%)"
              }} />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 pointer-events-none z-10">
          <InkSpiral className="absolute transition-all duration-700"
            style={{ top: d.spiral.top, right: d.spiral.right, width: d.spiral.size, height: d.spiral.size, color: slide.accent, opacity: d.spiral.opacity }} />
          <InkDots className="absolute transition-all duration-700"
            style={{ top: d.dots.top, bottom: (d.dots as any).bottom, right: d.dots.right, width: d.dots.size, color: slide.accent, opacity: d.dots.opacity }} />
          <InkStar className="absolute transition-all duration-700"
            style={{ top: d.star.top, bottom: (d.star as any).bottom, right: d.star.right, width: d.star.size, height: d.star.size, color: slide.accent, opacity: d.star.opacity }} />
          <InkSwish className="absolute transition-all duration-700"
            style={{ top: (d.swish as any).top, bottom: (d.swish as any).bottom, right: d.swish.right, width: d.swish.size, color: slide.accent, opacity: d.swish.opacity }} />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full py-12">
          <div className="max-w-[480px]">
            <span className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full mb-5 tracking-wide text-white"
              style={{ backgroundColor: slide.accent }}>
              {slide.tag}
            </span>
            <h1 className="text-3xl md:text-[2.5rem] font-bold text-slate-900 leading-[1.2] mb-4 tracking-tight">
              {slide.headline}
            </h1>
            <p className="text-base text-slate-500 leading-relaxed mb-8 max-w-md">{slide.sub}</p>
            <div className="flex flex-wrap gap-3 mb-8">
              {slide.cta === "story" ? (
                <button onClick={() => triggerToast("Opening full story...")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all cursor-pointer"
                  style={{ backgroundColor: B_INDIGO }}>
                  <BookOpen size={14} /> Read Story
                </button>
              ) : (
                <button onClick={() => triggerToast("Opening video...")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all cursor-pointer"
                  style={{ backgroundColor: B_INDIGO }}>
                  <Play size={14} /> Watch More
                </button>
              )}
            </div>
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

      {/* FIXED BOTTOM TICKER */}
      <TickerBar fixed />

      {/* Floating social cluster */}
      <div className="fixed bottom-24 left-5 z-40 flex flex-col gap-2 items-center">
        {[
          { icon: <Linkedin size={15} />, label: "LinkedIn" },
          { icon: <Instagram size={15} />, label: "Instagram" },
          { icon: <Twitter size={15} />, label: "X (Twitter)" },
        ].map(({ icon, label }) => (
          <button
            key={label}
            onClick={() => triggerToast(`Opening ${label}...`)}
            title={label}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer"
            style={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              color: B_INDIGO,
              boxShadow: "0 1px 6px rgba(0,0,0,0.10)",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#EEF0FF")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "white")}
          >
            {icon}
          </button>
        ))}
        <div className="w-px h-5" style={{ backgroundColor: "#e2e8f0" }} />
      </div>
    </div>
  );
};

export default HomeView;
