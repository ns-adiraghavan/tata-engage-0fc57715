import { useState, useEffect } from "react";
import { ChevronRight, ArrowRight, RefreshCw, FileText, Mail, MessageSquare } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { COMMUNITY_TESTIMONIALS, IS_PE_SEASON, ROHAN_DESAI_VOLUNTEER } from "@/data/mockData";
import RoleToggle from "@/components/shared/RoleToggle";
import tataLogo from "@/assets/tata-logo.png";
import tataEngageLogo from "@/assets/tata-engage-logo-nobg.png";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const B_INDIGO = "#333399";
const B_YELLOW = "#F5A623";
const B_RED    = "#E8401C";
const B_TEAL   = "#00A896";
const B_BLUE   = "#1E6BB8";

// ── Section divider ───────────────────────────────────────────────────────────
const SectionDivider = () => (
  <div className="flex items-center justify-center gap-2 py-5">
    {[B_INDIGO, B_YELLOW, B_RED, B_TEAL, B_BLUE].map((c) => (
      <span key={c} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
    ))}
  </div>
);

const secBg = (i: number) => i % 2 === 0 ? "bg-white" : "bg-[#F0F4FA]";

// ── Shared data (identical to HomeView) ──────────────────────────────────────
const FLAGSHIP_PROGRAMMES = [
  { id: "TVW", bg: B_INDIGO, accent: B_YELLOW, label: "Bi-annual · Global", title: "Tata Volunteering Week", desc: "A bi-annual celebration of collective action across every Tata company, worldwide.", stat1: "12 Editions", stat2: "50K+ Volunteers" },
  { id: "ProEngage", bg: "#3B1E8E", accent: "#C4B5FD", label: "Skill-based", title: "ProEngage", desc: "Match your professional expertise to NGO projects that need it most.", stat1: "1,200+ Projects", stat2: "85 NGO Partners" },
  { id: "Disaster Response", bg: "#7f1d1d", accent: "#FCA5A5", label: "Rapid Action", title: "Disaster Response", desc: "Volunteers deployed within 48 hours when communities need urgent support.", stat1: "24 Responses", stat2: "8 States" },
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

// ── Component ─────────────────────────────────────────────────────────────────
const VolunteerHubView = () => {
  const { user: authUser } = useAuth();
  const navigate = useAppNavigate();
  const { referralCount, triggerToast } = useAppContext();

  const user = authUser?.role === "corporate_spoc" ? ROHAN_DESAI_VOLUNTEER : authUser;

  const [flagshipIdx, setFlagshipIdx] = useState(0);
  const [factIdx, setFactIdx]         = useState(0);
  const [factFading, setFactFading]   = useState(false);
  const [socialIdx, setSocialIdx]     = useState(0);

  const prog = FLAGSHIP_PROGRAMMES[flagshipIdx];

  // Auto-rotate programme spotlight
  useEffect(() => {
    const t = setInterval(() => setFlagshipIdx((p) => (p + 1) % FLAGSHIP_PROGRAMMES.length), 4200);
    return () => clearInterval(t);
  }, []);

  // Auto-rotate social
  useEffect(() => {
    const t = setInterval(() => setSocialIdx((p) => (p + 1) % SOCIAL_POSTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const cycleFact = () => {
    setFactFading(true);
    setTimeout(() => { setFactIdx((p) => (p + 1) % FUN_FACTS.length); setFactFading(false); }, 280);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText("https://tataengage.com/refer/priya123");
    triggerToast("Referral link copied to clipboard!");
  };

  const tickerDouble = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="pt-20 min-h-screen bg-white">

      {/* ══════════════════════════════════════════════════════════════════
          HERO — banner image + gradient + quote + welcome top-left
      ══════════════════════════════════════════════════════════════════ */}
      <div className="px-6 md:px-12 pt-8 pb-0 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden" style={{ minHeight: 560 }}>
          {/* Banner image */}
          <img
            src="https://images.unsplash.com/photo-1593113616828-6f22bca04804?auto=format&fit=crop&q=80&w=1600"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Gradient overlay — dark left + bottom, slightly open top-right */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(135deg, rgba(10,10,30,0.92) 0%, rgba(10,10,30,0.75) 45%, rgba(10,10,30,0.45) 100%)"
          }} />

          {/* Welcome — top left */}
          <div className="absolute top-6 left-8 z-10">
            {(user?.role?.includes("spoc") || user?.role === "corporate_spoc") && (
              <RoleToggle activeView="volunteer" className="mb-3" />
            )}
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/70 text-sm font-semibold px-3 py-1.5 rounded-full tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-tata-cyan inline-block" />
              Volunteer Hub
            </span>
            <p className="text-white/50 text-lg mt-2">
              Welcome back, <span className="text-white font-semibold">{user?.firstName ?? "there"}</span>
            </p>
            <p className="text-white/35 text-sm mt-0.5">{user?.company} · {user?.designation}</p>
          </div>

          {/* Motivational quote — centred vertically */}
          <div className="relative z-10 flex flex-col items-start justify-center px-8 md:px-16" style={{ minHeight: 560 }}>
            <div className="max-w-xl mt-16">
              <p className="text-white/35 text-4xl font-black leading-none mb-3 select-none">"</p>
              <h2 className="text-white font-bold text-xl md:text-2xl leading-snug tracking-tight mb-4">
                The smallest act of kindness is worth more than the grandest intention.
              </h2>
              <p className="text-white/45 text-xs font-semibold uppercase tracking-widest">
                — Oscar Wilde
              </p>
            </div>
          </div>

          {/* Dashboard CTA — bottom right */}
          <div className="absolute bottom-6 right-8 z-10">
            <button
              onClick={() => navigate("dashboard")}
              className="flex items-center gap-2 text-zinc-900 text-sm font-bold px-6 py-2.5 rounded-xl hover:brightness-105 transition-all cursor-pointer shadow-lg"
              style={{ backgroundColor: B_YELLOW }}
            >
              My Space <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* ══════════════════════════════════════════════════════════════════
          PROGRAMME SPOTLIGHT — 70/30 (identical to HomeView)
      ══════════════════════════════════════════════════════════════════ */}
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
                <button onClick={() => navigate("proengage")}
                  className="flex-1 bg-white text-zinc-900 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-all cursor-pointer">
                  Find Projects
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

      {/* ══════════════════════════════════════════════════════════════════
          OUR JOURNEY — dotted timeline
      ══════════════════════════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════════════════════════
          FACTS + 3 STATS + SOCIAL
      ══════════════════════════════════════════════════════════════════ */}
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

            {/* 3 Stats */}
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

      {/* ══════════════════════════════════════════════════════════════════
          TICKER
      ══════════════════════════════════════════════════════════════════ */}
      <div id="ticker" className="py-3.5 overflow-hidden" style={{ backgroundColor: B_INDIGO }}>
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

      {/* ══════════════════════════════════════════════════════════════════
          FOOTER (shared)
      ══════════════════════════════════════════════════════════════════ */}
      <footer className="bg-zinc-950 text-white pt-10 pb-7 px-6 md:px-12">
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
              </div>
              <img src={tataLogo} alt="Tata" className="h-6 object-contain brightness-0 invert opacity-40" />
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 32s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
};

export default VolunteerHubView;
