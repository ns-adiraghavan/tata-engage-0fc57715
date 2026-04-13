import { useState, useEffect } from "react";
import { ArrowRight, RefreshCw, ExternalLink } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import {
  B_INDIGO, B_YELLOW, B_RED, B_TEAL, B_BLUE,
  P_INDIGO, P_TEAL, P_RED,
  secBg, SectionDivider,
  FLAGSHIP_PROGRAMMES, JOURNEY_MILESTONES, FUN_FACTS,
  HERO_STATS, SOCIAL_POSTS, TICKER_ITEMS, EOEO,
  ACCENT_NAVY,
} from "@/data/homeSharedData";

export { SectionDivider };

// ── Programme Spotlight section ───────────────────────────────────────────────
const PROGRAMME_ROUTE: Record<string, string> = {
  "TVW": "about-tvw",
  "ProEngage": "about-proengage",
  "Disaster Response": "disaster-response",
};

export function ProgrammeSpotlight() {
  const { triggerToast } = useAppContext();
  const navigate = useAppNavigate();
  const [flagshipIdx, setFlagshipIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setFlagshipIdx((p) => (p + 1) % FLAGSHIP_PROGRAMMES.length), 4200);
    return () => clearInterval(t);
  }, []);

  const prog = FLAGSHIP_PROGRAMMES[flagshipIdx];

  return (
    <section className={`${secBg(1)} py-16 px-6 md:px-12`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-extrabold tracking-widest uppercase text-slate-400 mb-2">Our Programmes</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Ways to make a difference</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">

          {/* LEFT 70% */}
          <div className="lg:col-span-7 flex flex-col h-full">
            {/* Pastel tab pills */}
            <div className="flex gap-2 mb-4">
              {FLAGSHIP_PROGRAMMES.map((p, i) => (
                <button key={p.id} onClick={() => setFlagshipIdx(i)}
                  className="text-sm font-bold px-5 py-2 rounded-full transition-all cursor-pointer border"
                  style={
                    i === flagshipIdx
                      ? { backgroundColor: prog.pastelBg, color: prog.accentText, borderColor: "transparent" }
                      : { backgroundColor: "white", color: "#94a3b8", borderColor: "#e2e8f0" }
                  }>
                  {p.id}
                </button>
              ))}
            </div>

            {/* Card: image left, text right */}
            <div
              onClick={() => { const r = PROGRAMME_ROUTE[prog.id]; if (r) navigate(r); }}
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[420px] flex-1 cursor-pointer transition-all duration-300"
              style={{ transition: "box-shadow 0.3s, transform 0.3s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 2px ${prog.accentText}, 0 8px 32px rgba(0,0,0,0.1)`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}>
              {/* Image panel with tint */}
              <div className="relative md:w-[45%] min-h-[200px] md:min-h-0 shrink-0 overflow-hidden">
                <img src={prog.photo} alt={prog.title}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                  referrerPolicy="no-referrer" />
                <div className="absolute inset-0 transition-all duration-700"
                  style={{ backgroundColor: prog.tint }} />
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: "rgba(0,0,0,0.32)", color: "rgba(255,255,255,0.9)" }}>
                    {prog.label}
                  </span>
                </div>
              </div>

              {/* Text panel */}
              <div className="flex-1 p-9 flex flex-col justify-between"
                style={{ background: `linear-gradient(135deg, ${prog.pastelBg} 0%, #ffffff 60%)` }}>
                <div>
                  <h3 className="text-2xl font-extrabold leading-snug mb-2 tracking-tight"
                    style={{ color: prog.accentText }}>
                    {prog.title}
                  </h3>
                  <p className="text-base text-slate-500 leading-relaxed line-clamp-2">{prog.desc}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 30% — EOEO showcase */}
          <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 pt-6 pb-5" style={{ backgroundColor: EOEO.tagPastel }}>
              <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-2"
                style={{ backgroundColor: "white", color: EOEO.tagColour }}>
                {EOEO.tag}
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{EOEO.headline}</h3>
            </div>
            <div className="flex-1 px-5 py-5">
              <div className="space-y-2.5">
                {EOEO.steps.map((step) => (
                  <div key={step.num} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black shrink-0"
                      style={{ backgroundColor: EOEO.tagColour }}>
                      {step.num}
                    </span>
                    <p className="text-xs font-semibold text-slate-700">{step.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-5 pb-5">
              <a href={EOEO.ctaUrl} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white hover:brightness-110 transition-all cursor-pointer"
                style={{ backgroundColor: EOEO.tagColour }}>
                {EOEO.cta} <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Journey section ───────────────────────────────────────────────────────────
export function JourneySection() {
  const navigate = useAppNavigate();

  return (
    <section className={`${secBg(2)} py-16 px-6 md:px-12`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-extrabold tracking-widest uppercase text-slate-400 mb-2">Our Journey</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">A decade of giving back</h2>
        </div>

        {/* Desktop horizontal alternating timeline */}
        <div className="hidden lg:block">
          <div className="relative" style={{ height: 340 }}>
            {/* Spine line at vertical center */}
            <div className="absolute left-0 right-0" style={{ top: 140, height: 2, background: `linear-gradient(to right, ${B_INDIGO}, ${B_TEAL}, ${B_YELLOW})`, opacity: 0.3 }} />

            {JOURNEY_MILESTONES.map((m, i) => {
              const above = i % 2 === 0;
              const leftPct = `${(i / (JOURNEY_MILESTONES.length - 1)) * 100}%`;

              return (
                <div key={`${m.year}-${i}`} className="absolute" style={{ left: leftPct, transform: "translateX(-50%)", top: 0, bottom: 0, width: 120 }}>
                  {/* Dot on spine */}
                  <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 134 }}>
                    <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: m.colour }}>
                      <div className="w-1 h-1 rounded-full bg-white" />
                    </div>
                  </div>

                  {above ? (
                    <>
                      {/* Card above */}
                      <div className="absolute left-1/2 -translate-x-1/2 text-center" style={{ bottom: 156, width: 120 }}>
                        <div className="flex justify-center mb-2">
                          <img src={m.photo} alt={m.title} className="rounded-full object-cover" style={{ width: 80, height: 80, border: `2px solid ${m.colour}` }} referrerPolicy="no-referrer" />
                        </div>
                        <div className="font-extrabold tracking-widest uppercase mb-0.5" style={{ color: m.colour, fontSize: 11 }}>{m.year}</div>
                        <div className="font-bold text-slate-900 leading-snug" style={{ fontSize: 13 }}>{m.title}</div>
                        <div className="text-slate-400 leading-relaxed mt-0.5" style={{ fontSize: 11 }}>{m.desc}</div>
                      </div>
                      {/* Connector line down to dot */}
                      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 124, width: 1, height: 10, background: m.colour, opacity: 0.35 }} />
                    </>
                  ) : (
                    <>
                      {/* Connector line up from dot */}
                      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 147, width: 1, height: 10, background: m.colour, opacity: 0.35 }} />
                      {/* Card below */}
                      <div className="absolute left-1/2 -translate-x-1/2 text-center" style={{ top: 160, width: 120 }}>
                        <div className="font-extrabold tracking-widest uppercase mb-0.5" style={{ color: m.colour, fontSize: 11 }}>{m.year}</div>
                        <div className="font-bold text-slate-900 leading-snug" style={{ fontSize: 13 }}>{m.title}</div>
                        <div className="text-slate-400 leading-relaxed mt-0.5" style={{ fontSize: 11 }}>{m.desc}</div>
                        <div className="flex justify-center mt-2">
                          <img src={m.photo} alt={m.title} className="rounded-full object-cover" style={{ width: 80, height: 80, border: `2px solid ${m.colour}` }} referrerPolicy="no-referrer" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile fallback: vertical list */}
        <div className="lg:hidden grid grid-cols-2 md:grid-cols-3 gap-6">
          {JOURNEY_MILESTONES.map((m, i) => (
            <div key={`${m.year}-${i}`} className="flex flex-col items-center text-center">
              <img src={m.photo} alt={m.title} className="rounded-full object-cover mb-2" style={{ width: 64, height: 64, border: `2px solid ${m.colour}` }} referrerPolicy="no-referrer" />
              <div className="font-extrabold tracking-widest uppercase mb-0.5" style={{ color: m.colour, fontSize: 11 }}>{m.year}</div>
              <div className="font-bold text-slate-900 leading-snug" style={{ fontSize: 13 }}>{m.title}</div>
              <div className="text-slate-400 leading-relaxed mt-0.5" style={{ fontSize: 11 }}>{m.desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button onClick={() => navigate("journey")}
            className="inline-flex items-center gap-2 text-sm font-bold hover:underline cursor-pointer"
            style={{ color: B_INDIGO }}>
            Read our full story <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Numbers + Social section ──────────────────────────────────────────────────
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
    <section className={`${secBg(3)} py-16 px-6 md:px-12`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-extrabold tracking-widest uppercase text-slate-400 mb-2">By the numbers</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">The scale of our community</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Did You Know */}
          <div className="rounded-2xl flex flex-col justify-between min-h-[280px] relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0" style={{ backgroundColor: "rgba(51,51,153,0.82)" }} />
            <div className="relative z-10 p-7 flex flex-col justify-between h-full min-h-[280px]">
              <div>
                <span className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4"
                  style={{ backgroundColor: B_YELLOW, color: "#111" }}>
                  Did You Know?
                </span>
                <p className="text-white text-xl font-bold leading-snug transition-opacity duration-300"
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
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-3">
            {HERO_STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-5 rounded-2xl p-5 shadow-sm"
                style={{ backgroundColor: s.pastel, borderLeft: `4px solid ${s.colour}` }}>
                <div>
                  <p className="font-black tracking-tighter leading-none mb-0.5 text-4xl" style={{ color: s.colour }}>
                    {s.num}
                  </p>
                  <p className="text-sm font-bold text-slate-800">{s.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social Spotlight */}
          <div className="rounded-2xl p-7 flex flex-col shadow-sm relative overflow-hidden"
            style={{ background: P_INDIGO, border: "1px solid #d4d8f5" }}
            onMouseEnter={() => setShimmer(true)}
            onMouseLeave={() => setShimmer(false)}
          >
            {shimmer && (
              <div style={{
                position: "absolute", top: 0, bottom: 0, width: "40%",
                background: "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 100%)",
                animation: "te-shimmer 0.6s ease-out forwards",
                pointerEvents: "none", zIndex: 5,
              }} />
            )}
            <div className="flex items-center justify-between mb-5">
              <div className="flex gap-2.5">
                {[{ Icon: Facebook, c: "#2563EB" }, { Icon: Twitter, c: "#0EA5E9" }, { Icon: Instagram, c: "#EC4899" }, { Icon: Linkedin, c: "#1D4ED8" }, { Icon: Youtube, c: "#DC2626" }].map(({ Icon, c }) => (
                  <Icon key={c} size={14} className="cursor-pointer transition-colors"
                    style={{ color: B_INDIGO, opacity: 0.35 }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = c; e.currentTarget.style.opacity = "1"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = B_INDIGO; e.currentTarget.style.opacity = "0.35"; }} />
                ))}
              </div>
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: B_INDIGO, opacity: 0.5 }}>Social Spotlight</p>
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
                      <p className="text-sm font-bold leading-none" style={{ color: ACCENT_NAVY }}>{post.handle}</p>
                      <p className="text-xs text-slate-400">{post.time} · {post.platform}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: ACCENT_NAVY }}>{post.text}</p>
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
                  style={{ width: i === socialIdx ? 16 : 7, height: 6, backgroundColor: i === socialIdx ? B_INDIGO : "#c5c8f0" }} />
              ))}
            </div>
            <button onClick={() => triggerToast("Opening social media...")}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              style={{ border: "1px solid #c5c8f0", color: B_INDIGO, background: "transparent" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.5)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              Follow TataEngage
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Ticker bar ────────────────────────────────────────────────────────────────
export function TickerBar({ fixed = false }: { fixed?: boolean }) {
  const tickerDouble = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className={`${fixed ? "fixed bottom-0 left-0 right-0 z-50" : ""} py-2.5 overflow-hidden`}
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
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 32s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
