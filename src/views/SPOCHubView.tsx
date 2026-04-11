import { ROHAN_DESAI, PENDING_APPROVALS_DATA } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useAuth } from "@/context/AuthContext";
import RoleToggle from "@/components/shared/RoleToggle";
import { ArrowRight } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import tataLogo from "@/assets/tata-logo.png";
import tataEngageLogo from "@/assets/tata-engage-logo-nobg.png";
import { B_INDIGO, B_YELLOW } from "@/data/homeSharedData";
import { ProgrammeSpotlight, JourneySection, NumbersSection, TickerBar, SectionDivider } from "@/components/shared/HomeSections";

// ── Component ─────────────────────────────────────────────────────────────────
const SPOCHubView = () => {
  const spoc = ROHAN_DESAI;
  const navigate = useAppNavigate();
  const { triggerToast } = useAppContext();
  const { user } = useAuth();
  const showToggle = user?.role?.includes("spoc") || user?.role === "corporate_spoc";

  return (
    <div className="pt-20 min-h-screen bg-white">

      {/* HERO */}
      <div className="px-6 md:px-12 pt-8 pb-0 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden" style={{ minHeight: 560 }}>
          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1600"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(135deg, rgba(10,12,45,0.94) 0%, rgba(10,12,45,0.74) 48%, rgba(10,12,45,0.38) 100%)"
          }} />

          <div className="absolute top-6 left-8 z-10">
            {showToggle && <RoleToggle activeView="spoc" className="mb-3" />}
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/70 text-sm font-semibold px-3 py-1.5 rounded-full tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-tata-cyan inline-block" />
              SPOC Hub · {spoc.company}
            </span>
            <p className="text-white/50 text-lg mt-2">
              Welcome back, <span className="text-white font-semibold">{spoc.firstName}</span>
            </p>
            <p className="text-white/35 text-sm mt-0.5">{spoc.company} · Corporate SPOC</p>
          </div>

          <div className="relative z-10 flex flex-col items-start justify-center px-8 md:px-16" style={{ minHeight: 560 }}>
            <div className="max-w-xl mt-16">
              <p className="text-white/35 text-4xl font-black leading-none mb-3 select-none">"</p>
              <h2 className="text-white font-bold text-xl md:text-2xl leading-snug tracking-tight mb-4">
                The function of leadership is to produce more leaders, not more followers.
              </h2>
              <p className="text-white/45 text-xs font-semibold uppercase tracking-widest">
                — Ralph Nader
              </p>
            </div>
          </div>

          <div className="absolute bottom-6 right-8 z-10">
            <button
              onClick={() => navigate("spoc-dashboard")}
              className="flex items-center gap-2 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-lg"
              style={{ backgroundColor: B_INDIGO }}
            >
              My Space <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      <SectionDivider />

      <ProgrammeSpotlight />

      <SectionDivider />

      <JourneySection />

      <SectionDivider />

      <NumbersSection />

      {/* TICKER */}
      <TickerBar />

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

export default SPOCHubView;
