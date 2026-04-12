import { ArrowRight } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { ROHAN_DESAI_VOLUNTEER } from "@/data/mockData";
import RoleToggle from "@/components/shared/RoleToggle";
import tataLogo from "@/assets/tata-logo.png";
import tataEngageLogo from "@/assets/tata-engage-logo-nobg.png";
import { B_INDIGO, B_YELLOW } from "@/data/homeSharedData";
import { ProgrammeSpotlight, JourneySection, NumbersSection, TickerBar, SectionDivider } from "@/components/shared/HomeSections";

// ── Component ─────────────────────────────────────────────────────────────────
const VolunteerHubView = () => {
  const { user: authUser } = useAuth();
  const navigate = useAppNavigate();
  const { referralCount, triggerToast } = useAppContext();

  const user = authUser?.role === "corporate_spoc" ? ROHAN_DESAI_VOLUNTEER : authUser;

  const copyReferralLink = () => {
    navigator.clipboard.writeText("https://tataengage.com/refer/priya123");
    triggerToast("Referral link copied to clipboard!");
  };

  return (
    <div className="pt-20 min-h-screen bg-white pb-12">

      {/* ══════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════ */}
      <div className="px-6 md:px-12 pt-8 pb-0 max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: 480 }}>
          <img
            src="https://images.unsplash.com/photo-1593113616828-6f22bca04804?auto=format&fit=crop&q=80&w=1600"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(120deg, rgba(5,5,20,0.88) 0%, rgba(5,5,20,0.72) 40%, rgba(5,5,20,0.35) 70%, rgba(5,5,20,0.15) 100%)"
          }} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, rgba(5,5,20,0.6) 0%, transparent 35%)"
          }} />

          <div className="relative z-10 flex flex-col justify-between px-8 md:px-12 py-8" style={{ minHeight: 480 }}>
            {/* Top row — welcome + role pill */}
            <div>
              {(user?.role?.includes("spoc") || user?.role === "corporate_spoc") && (
                <RoleToggle activeView="volunteer" className="mb-3" />
              )}
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white/60 text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Volunteer Hub
              </span>
              <p className="text-white/55 mt-1 text-5xl font-sans">
                Welcome back, <span className="text-white font-bold">{user?.firstName ?? "there"}!</span>
              </p>
              <p className="text-white/30 text-xs mt-0.5 font-medium">{user?.company} · {user?.designation}</p>
            </div>

            {/* Centre — quote */}
            <div className="max-w-lg">
              <svg width="24" height="20" viewBox="0 0 28 22" fill="none" className="mb-3 opacity-25">
                <path d="M0 22V13.5C0 5.8 4.5 1.5 13.5 0L15 3C10.5 4.2 8 7 7.5 11H12V22H0ZM16 22V13.5C16 5.8 20.5 1.5 29.5 0L31 3C26.5 4.2 24 7 23.5 11H28V22H16Z" fill="white"/>
              </svg>
              <h2 className="text-white font-bold text-xl md:text-2xl leading-snug tracking-tight mb-3">
                The smallest act of kindness is worth more than the grandest intention.
              </h2>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">— Oscar Wilde</p>
            </div>

            {/* Bottom row — CTA */}
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
        </div>
      </div>

      <SectionDivider />

      {/* PROGRAMME SPOTLIGHT */}
      <ProgrammeSpotlight />

      <SectionDivider />

      {/* JOURNEY */}
      <JourneySection />

      <SectionDivider />

      {/* NUMBERS + SOCIAL */}
      <NumbersSection />

      {/* TICKER */}
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
