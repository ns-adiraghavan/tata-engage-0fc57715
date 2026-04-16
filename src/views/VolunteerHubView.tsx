import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { ROHAN_DESAI_VOLUNTEER } from "@/data/mockData";
import RoleToggle from "@/components/shared/RoleToggle";
import tataLogo from "@/assets/tata-logo.png";
import tataEngageLogo from "@/assets/tata-engage-logo-nobg.png";
import heroImg from "@/assets/Taj_Sats_1.jpeg";
import { B_TICKER, B_YELLOW, ACCENT_NAVY } from "@/data/homeSharedData";
import { ProgrammeSpotlight, JourneySection, NumbersSection, TickerBar, SectionDivider } from "@/components/shared/HomeSections";

const DOT_SECTIONS = [
  { id: "hub-hero", label: "Home" },
  { id: "programmes", label: "Programmes" },
  { id: "journey", label: "Journey" },
  { id: "numbers", label: "Numbers" },
];
const ACCENT = B_YELLOW;

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const VolunteerHubView = () => {
  const { user: authUser } = useAuth();
  const navigate = useAppNavigate();
  const { triggerToast } = useAppContext();

  const user = authUser?.role === "corporate_spoc" ? ROHAN_DESAI_VOLUNTEER : authUser;

  const [activeSection, setActiveSection] = useState(0);
  const [showLabel, setShowLabel] = useState(false);
  const [inHero, setInHero] = useState(true);
  const labelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    DOT_SECTIONS.forEach((s, idx) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const o = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          setActiveSection(idx);
          setShowLabel(true);
          if (labelTimer.current) clearTimeout(labelTimer.current);
          labelTimer.current = setTimeout(() => setShowLabel(false), 1800);
        }
      }, { threshold: 0.2 });
      o.observe(el);
      obs.push(o);
    });
    return () => { obs.forEach((o) => o.disconnect()); if (labelTimer.current) clearTimeout(labelTimer.current); };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const heroEl = document.getElementById("hub-hero");
      if (heroEl) setInHero(window.scrollY < heroEl.offsetHeight - 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white pb-12">

      {/* Dot rail */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end" style={{ gap: 0 }}>
        {DOT_SECTIONS.map((s, i) => {
          const active = activeSection === i;
          const isLast = i === DOT_SECTIONS.length - 1;
          const dotColor = inHero ? "white" : ACCENT;
          const inactiveColor = inHero ? "rgba(255,255,255,0.4)" : "#CBD5E1";
          const lineColor = inHero ? "rgba(255,255,255,0.25)" : `${ACCENT}50`;
          return (
            <div key={s.id} className="flex flex-col items-end">
              <button
                onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
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
                      backgroundColor: inHero ? "rgba(0,0,0,0.85)" : "rgba(13,27,62,0.92)",
                      border: `1px solid ${inHero ? "rgba(255,255,255,0.25)" : ACCENT_NAVY}`,
                      color: "#ffffff",
                    }}>
                    {s.label}
                  </span>
                )}
                <span
                  className="transition-all duration-300"
                  style={{
                    width: active ? 9 : 6, height: active ? 9 : 6,
                    borderRadius: 2,
                    backgroundColor: active ? dotColor : inactiveColor,
                    border: `1px solid ${active ? dotColor : inactiveColor}`,
                    display: "block",
                    flexShrink: 0,
                  }}
                />
              </button>
              {!isLast && (
                <div style={{
                  width: 1,
                  height: 28,
                  marginLeft: "auto",
                  marginRight: active ? "4px" : "2.5px",
                  backgroundImage: `repeating-linear-gradient(to bottom, ${lineColor} 0px, ${lineColor} 3px, transparent 3px, transparent 7px)`,
                  transition: "all 0.3s",
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          HERO — full-bleed edge-to-edge
      ══════════════════════════════════════════════════════════════════ */}
      <section id="hub-hero" className="relative w-full overflow-hidden" style={{ minHeight: "92vh" }}>

        {/* Background image */}
        <img
          src={heroImg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 30%", transform: "scaleX(-1)" }}
        />

        {/* Left-heavy dark gradient — lets image breathe on the right */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(105deg, rgba(5,5,20,0.92) 0%, rgba(5,5,20,0.78) 35%, rgba(5,5,20,0.38) 62%, rgba(5,5,20,0.08) 100%)"
        }} />
        {/* Subtle bottom vignette for CTA legibility */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, rgba(5,5,20,0.55) 0%, transparent 40%)"
        }} />

        <div className="relative z-10 flex flex-col justify-between px-8 md:px-16 py-8" style={{ minHeight: "92vh", paddingTop: 80 }}>

            {/* Top — greeting */}
            <div>
              {(user?.role?.includes("spoc") || user?.role === "corporate_spoc") && (
                <RoleToggle activeView="volunteer" className="mb-3" />
              )}
              <p className="text-white/50 text-sm font-medium tracking-wide mb-1">
                {"\n"}
              </p>
              <p className="text-white text-5xl font-sans font-bold" style={{ letterSpacing: "-0.5px", lineHeight: 1.1 }}>
                Welcome, {user?.firstName ?? "there"}.
              </p>
              <p className="text-white/70 text-lg mt-3 font-light">Let's make today count.</p>
            </div>

            {/* Centre — quote */}
            <div className="max-w-lg">
              <svg width="24" height="20" viewBox="0 0 28 22" fill="none" className="mb-3 opacity-20">
                <path d="M0 22V13.5C0 5.8 4.5 1.5 13.5 0L15 3C10.5 4.2 8 7 7.5 11H12V22H0ZM16 22V13.5C16 5.8 20.5 1.5 29.5 0L31 3C26.5 4.2 24 7 23.5 11H28V22H16Z" fill="white"/>
              </svg>
              <h2 className="text-white font-bold text-xl md:text-2xl leading-snug tracking-tight mb-3">
                The smallest act of kindness is worth more than the grandest intention.
              </h2>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">— Oscar Wilde</p>
            </div>

            {/* Bottom — CTA */}
            <div className="flex justify-end">
              <button
                onClick={() => navigate("dashboard")}
                className="flex items-center gap-2 text-zinc-900 text-sm font-bold px-6 py-2.5 rounded-xl hover:brightness-105 transition-all cursor-pointer shadow-lg"
                style={{ backgroundColor: B_YELLOW }}
              >
                My Space <ArrowRight size={15} />
              </button>
            </div>
        </div>
      </section>

      <SectionDivider />
      <div id="programmes"><ProgrammeSpotlight /></div>
      <SectionDivider />
      <div id="journey"><JourneySection /></div>
      <SectionDivider />
      <div id="numbers"><NumbersSection /></div>

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
              color: B_TICKER,
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

      {/* FOOTER */}
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
    </div>
  );
};

export default VolunteerHubView;
