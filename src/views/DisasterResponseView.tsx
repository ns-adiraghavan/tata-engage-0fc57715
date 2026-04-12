import { motion } from "framer-motion";
import { Heart, Globe, Award, LayoutGrid, ArrowRight, Zap, Activity } from "lucide-react";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import SubPageDotRail from "@/components/shared/SubPageDotRail";
import { B_RED, ACCENT_NAVY } from "@/data/homeSharedData";

const SECTIONS = [
  { id: "dr-hero", label: "Overview" },
  { id: "dr-framework", label: "Framework" },
  { id: "dr-how", label: "How to Help" },
  { id: "dr-process", label: "Deployment" },
  { id: "dr-register", label: "Register" },
];

const STRIPE_BG = {
  backgroundImage: `repeating-linear-gradient(45deg, rgba(232,64,28,0.05) 0px, rgba(232,64,28,0.05) 1px, transparent 1px, transparent 20px)`,
  backgroundSize: "20px 20px",
};

const GRID_BG = {
  backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 32px)`,
  backgroundSize: "32px 32px",
};

const PHASES = [
  { phase: "Phase 1: Relief", desc: "Immediate provision of food, water, medical aid, and temporary shelter within the first 72 hours.", icon: Zap, color: "#f59e0b" },
  { phase: "Phase 2: Restoration", desc: "Restoring essential services, sanitation, and supporting livelihoods in the weeks following a disaster.", icon: Activity, color: "#3b82f6" },
  { phase: "Phase 3: Rehabilitation", desc: "Long-term reconstruction of infrastructure, schools, and resilient community systems.", icon: Heart, color: B_RED },
];

const HELP_TYPES = [
  { title: "On-Ground Relief", skills: "Logistics, Medical, Distribution", icon: Globe, desc: "Direct deployment to affected areas to manage supply chains and distribution centers.", accent: "#f59e0b", pastel: "#fef3c7" },
  { title: "Remote Support", skills: "Data, Tech, Coordination", icon: LayoutGrid, desc: "Supporting operations from your location through information management and technical aid.", accent: "#3b82f6", pastel: "#dbeafe" },
  { title: "Specialized Skills", skills: "Engineering, Psychosocial, Legal", icon: Award, desc: "Providing professional expertise for infrastructure assessment or trauma counseling.", accent: B_RED, pastel: "#fee2e2" },
];

const STEPS = [
  { step: "01", title: "Registration", desc: "Register your interest and skills in the Disaster Response pool." },
  { step: "02", title: "Activation", desc: "Receive an alert when a crisis matches your profile and location." },
  { step: "03", title: "Briefing", desc: "Mandatory safety and operational briefing before deployment." },
  { step: "04", title: "Impact", desc: "Execute assigned tasks and contribute to community recovery." },
];

const CASES = [
  { title: "Odisha Cyclone Relief (2024)", impact: "50,000+ Meals Distributed", desc: "Rapid deployment of volunteers to manage community kitchens and medical camps in the aftermath of Cyclone Dana.", img: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80" },
  { title: "Assam Flood Restoration (2023)", impact: "12 Schools Rebuilt", desc: "Long-term rehabilitation project focusing on restoring educational infrastructure and sanitation in flood-hit districts.", img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80" },
];

const HERO_STATS = [
  { label: "48h Deployment" },
  { label: "3 Response Phases" },
  { label: "50,000+ Lives Touched" },
];

const DisasterResponseView = () => {
  const navigate = useAppNavigate();

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Accent line */}
      <div style={{ background: B_RED, height: 2, width: "100%" }} />

      {/* Dot rail */}
      <SubPageDotRail sections={SECTIONS} accentColor={B_RED} />

      {/* ═══ HERO ═══ */}
      <section
        id="dr-hero"
        className="text-center py-20 px-6 md:px-16 relative overflow-hidden"
        style={{ backgroundColor: ACCENT_NAVY, ...STRIPE_BG }}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div
            className="mb-6"
            style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, color: "rgba(255,255,255,0.5)" }}
          >
            ONE TATA RESPONSE FRAMEWORK
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: B_RED }} />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: B_RED }} />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: B_RED }}>Response Ready</span>
          </div>

          <h1 style={{ fontSize: 52, fontWeight: 900, color: "white", letterSpacing: -1, lineHeight: 1.1 }} className="mb-6">
            Disaster Response
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.65)", fontWeight: 300 }}>
            The Tata Group's disaster response mechanism leverages our collective resources,
            expertise, and volunteer spirit to provide immediate relief and long-term rehabilitation
            to communities affected by natural calamities.
          </p>

          {/* Stat pills */}
          <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
            {HERO_STATS.map((s) => (
              <span
                key={s.label}
                className="px-5 py-2 rounded-full text-xs font-semibold tracking-wide"
                style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
              >
                {s.label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("register-role")}
              className="w-full sm:w-auto px-10 py-5 rounded-2xl font-semibold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              style={{ backgroundColor: B_RED, color: "white" }}
            >
              Register as Volunteer <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById("dr-framework")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full sm:w-auto px-10 py-5 rounded-2xl font-semibold uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer"
              style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              View Framework
            </button>
          </div>
        </motion.div>
      </section>

      {/* ═══ FRAMEWORK ═══ */}
      <section id="dr-framework" className="px-6 md:px-16 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-4" style={{ color: ACCENT_NAVY }}>The One Tata Framework</h2>
              <p className="text-slate-500 leading-relaxed">
                Our response is structured into three critical phases, ensuring that we move from
                immediate life-saving interventions to sustainable community rebuilding.
              </p>
            </div>
            <div className="space-y-4">
              {PHASES.map((item, i) => (
                <div key={i} className="flex gap-6 p-6 bg-white rounded-2xl border border-slate-100 transition-all hover:shadow-sm" style={{ borderLeftWidth: 3, borderLeftColor: item.color }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}1a`, color: item.color }}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold uppercase tracking-wide mb-1" style={{ color: ACCENT_NAVY }}>{item.phase}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute top-4 left-4 right-[-16px] bottom-[-16px] rounded-2xl" style={{ backgroundColor: ACCENT_NAVY }} />
            <div className="aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-2xl relative z-10">
              <img
                src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80"
                alt="Disaster Response"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW YOU CAN HELP ═══ */}
      <section id="dr-how" className="px-6 md:px-16 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-4" style={{ color: ACCENT_NAVY }}>How You Can Help</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Different crises require different skills. We match your expertise to the specific needs on the ground.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HELP_TYPES.map((type, i) => (
            <div
              key={i}
              className="bg-white p-10 rounded-2xl border border-slate-100 flex overflow-hidden group cursor-default"
              style={{ transition: "transform 0.2s, box-shadow 0.2s", borderLeftWidth: 3, borderLeftColor: type.accent }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div className="flex-1">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-8" style={{ backgroundColor: type.pastel, color: type.accent }}>
                  <type.icon size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: ACCENT_NAVY }}>{type.title}</h3>
                <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: type.accent }}>{type.skills}</div>
                <p className="text-sm text-slate-500 leading-relaxed">{type.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ DEPLOYMENT JOURNEY ═══ */}
      <section id="dr-process" className="rounded-2xl mx-4 md:mx-12 p-12 md:p-20 text-white mb-16 relative overflow-hidden" style={{ backgroundColor: ACCENT_NAVY }}>
        <div className="absolute inset-0" style={GRID_BG} />
        <div className="relative z-10">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-16 text-center">The Deployment Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            <div className="hidden md:block absolute top-10 left-20 right-20 h-px border-t border-dashed border-white/20" />
            {STEPS.map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 text-2xl font-black shadow-2xl backdrop-blur-md" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: B_RED }}>
                  {item.step}
                </div>
                <h4 className="font-semibold uppercase tracking-widest mb-4">{item.title}</h4>
                <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CASE STUDIES ═══ */}
      <section className="px-6 md:px-16 py-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-4" style={{ color: ACCENT_NAVY }}>Past Case Studies</h2>
            <p className="text-slate-500 max-w-xl">A legacy of standing with the nation during its most challenging times.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {CASES.map((c, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-video rounded-2xl overflow-hidden mb-8 shadow-lg border border-slate-100 relative">
                <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-6 left-6 right-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                  <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: B_RED }}>Impact Highlight</div>
                  <div className="text-xl font-semibold">{c.impact}</div>
                </div>
              </div>
              <h3 className="text-2xl font-black mb-3 transition-colors" style={{ color: ACCENT_NAVY }}>{c.title}</h3>
              <p className="text-slate-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ REGISTER ═══ */}
      <section id="dr-register" className="px-6 md:px-16 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black tracking-tight mb-4" style={{ color: ACCENT_NAVY }}>Ready to respond?</h2>
          <p className="text-slate-500 text-lg mb-10">Register your interest now and be part of the Tata disaster response cadre.</p>
          <button
            onClick={() => navigate("register-role")}
            className="px-12 py-5 text-white rounded-2xl font-semibold uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-black/10 cursor-pointer"
            style={{ backgroundColor: B_RED }}
          >
            Register as Volunteer
          </button>
          <div className="mt-6">
            <button
              onClick={() => navigate("dashboard")}
              className="text-sm font-semibold uppercase tracking-widest hover:underline transition-all cursor-pointer"
              style={{ color: ACCENT_NAVY }}
            >
              Already registered? Go to your dashboard →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DisasterResponseView;
