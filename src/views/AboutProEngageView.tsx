import { useState, useEffect } from "react";
import { ArrowRight, Clock, Briefcase, CheckCircle, Award, BarChart2 } from "lucide-react";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/layout/Footer";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const ACCENT_NAVY = "#0D1B3E";
const B_INDIGO    = "#333399";
const B_YELLOW    = "#F5A623";
const B_TEAL      = "#00A896";
const P_INDIGO    = "#EEF0FF";
const P_TEAL      = "#E6F8F5";

// ── Sections ──────────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "pe-overview",  label: "Overview"  },
  { id: "pe-who",       label: "Who"       },
  { id: "pe-time",      label: "Time"      },
  { id: "pe-how",       label: "How it works" },
  { id: "pe-tsg",       label: "TSG Role"  },
];

// ── Data ──────────────────────────────────────────────────────────────────────
const CATEGORIES = ["Tata Employees", "Their Family Members", "Retired Tata Employees"];

const SKILL_AREAS = [
  "HR & People Management",
  "Finance & Accounting",
  "Business Planning",
  "Information Technology",
  "Web Design & UX",
  "Social Media & Marketing",
  "Mentoring & Coaching",
  "Legal & Compliance",
  "Data & Analytics",
  "Project Management",
];

const TSG_ROLES = [
  { icon: BarChart2, text: "Sourcing meaningful projects from verified NGO partners" },
  { icon: CheckCircle, text: "Inviting and reviewing volunteer applications" },
  { icon: Briefcase,  text: "Conducting orientation workshops for selected volunteers" },
  { icon: Clock,      text: "Periodic tracking and milestone reviews throughout the project" },
  { icon: Award,      text: "Awarding certificates to volunteers who successfully complete projects" },
  { icon: BarChart2,  text: "Documentation and knowledge banking for future editions" },
];

const HOW_STEPS = [
  { step: "01", title: "NGOs submit briefs",       desc: "Partner NGOs submit project briefs specifying skills needed, expected outcomes, and timeline." },
  { step: "02", title: "TSG curates & approves",   desc: "TSG reviews each brief for quality, feasibility, and impact. Only the best projects go live." },
  { step: "03", title: "Volunteers apply",          desc: "Tata employees browse open projects, filter by skill and cause, and submit applications with a motivation statement." },
  { step: "04", title: "AI-assisted matching",     desc: "A matching algorithm pairs the best-fit volunteers with each project based on skills, experience, and availability." },
  { step: "05", title: "Orientation & kick-off",   desc: "TSG conducts an orientation workshop before the project begins. Volunteers get all context they need to start strong." },
  { step: "06", title: "Deliver & get certified",  desc: "Volunteers complete the project with periodic TSG check-ins. Certificates are issued upon successful completion." },
];

const STATS = [
  { num: "1,200+", label: "Projects completed" },
  { num: "85",     label: "NGO partners"        },
  { num: "85%",    label: "Say skills grew"     },
  { num: "6mo",    label: "Max project length"  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function AboutProEngageView() {
  const navigate = useAppNavigate();
  const { isLoggedIn } = useAuth();
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(idx); },
        { threshold: 0.25 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div style={{ paddingTop: 0, paddingBottom: 0, background: "#fff", minHeight: "100vh", position: "relative" }}>

      {/* ── Dot rail ── */}
      <div style={{
        position: "fixed", right: 16, top: "50%", transform: "translateY(-50%)",
        display: "flex", flexDirection: "column", gap: 12, zIndex: 40,
      }}>
        {SECTIONS.map(({ id, label }, i) => {
          const active = activeSection === i;
          return (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              style={{
                display: "flex", alignItems: "center", justifyContent: "flex-end",
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}
            >
              {active && (
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "3px 10px",
                  borderRadius: 100, marginRight: 8, whiteSpace: "nowrap",
                  background: "#fff", border: "1px solid #e2e8f0",
                  color: "#334155", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  {label}
                </span>
              )}
              <span style={{
                display: "block", borderRadius: "50%",
                width: active ? 10 : 7, height: active ? 10 : 7,
                backgroundColor: active ? B_TEAL : "#CBD5E1",
                transition: "all 0.25s",
              }} />
            </button>
          );
        })}
      </div>

      {/* ── 2px accent line ── */}
      <div style={{ height: 2, background: B_TEAL, width: "100%" }} />

      {/* ════════════════════════════════════════
          HERO — split layout
      ════════════════════════════════════════ */}
      <div style={{ background: ACCENT_NAVY, position: "relative", overflow: "hidden" }}>
        {/* Subtle texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(45deg, rgba(0,168,150,0.04) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }} />
        <div style={{
          position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto",
          padding: "100px 40px 72px",
          display: "flex", gap: 60, alignItems: "center", flexWrap: "wrap",
        }}>
          {/* Left */}
          <div style={{ flex: "1 1 480px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: "0 0 14px" }}>
              Programme · Skill-based
            </p>
            <h1 style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 900,
              fontSize: 56, color: "#fff", margin: "0 0 16px", lineHeight: 1.05, letterSpacing: "-2px",
            }}>
              ProEngage
            </h1>
            <span style={{
              display: "inline-block", marginBottom: 24,
              background: B_TEAL, color: "#fff", fontStyle: "italic",
              fontWeight: 700, fontSize: 15, padding: "8px 20px", borderRadius: 8,
            }}>
              accelerate THE CHANGE
            </span>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, margin: "0 0 36px", maxWidth: 480 }}>
              A part-time, skill-based volunteering programme that lets you contribute your domain expertise to projects that create lasting impact for non-profit organisations.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => navigate(isLoggedIn ? "proengage" : "login")}
                style={{
                  background: B_TEAL, color: "#fff", border: "none",
                  borderRadius: 10, padding: "13px 24px", fontWeight: 700,
                  fontSize: 14, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 8,
                }}
              >
                Browse Projects <ArrowRight size={15} />
              </button>
              <button
                onClick={() => navigate("register-role")}
                style={{
                  background: "rgba(255,255,255,0.1)", color: "#fff",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 10, padding: "13px 24px", fontWeight: 700,
                  fontSize: 14, cursor: "pointer",
                }}
              >
                Register Now
              </button>
            </div>
          </div>

          {/* Right — stats */}
          <div style={{ flex: "0 0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {STATS.map((s) => (
                <div key={s.label} style={{
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14, padding: "22px 20px", textAlign: "center", minWidth: 140,
                }}>
                  <div style={{ fontSize: 30, fontWeight: 900, color: B_YELLOW, lineHeight: 1, letterSpacing: "-0.5px" }}>{s.num}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          OVERVIEW
      ════════════════════════════════════════ */}
      <section id="pe-overview" style={{ maxWidth: 860, margin: "0 auto", padding: "72px 40px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#94A3B8", margin: "0 0 10px" }}>Overview</p>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: ACCENT_NAVY, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
          Your skills. Their transformation.
        </h2>

        <div style={{
          borderLeft: `4px solid ${B_TEAL}`,
          background: P_TEAL, borderRadius: "0 12px 12px 0",
          padding: "20px 24px", marginBottom: 32,
        }}>
          <p style={{ fontSize: 18, fontStyle: "italic", color: "#0a4a35", lineHeight: 1.65, margin: 0 }}>
            "Under ProEngage, TSG provides exciting volunteering projects in HR, finance, IT, web design, marketing, mentoring, and coaching — helping non-profits build and sustain their capacity."
          </p>
        </div>

        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          ProEngage is unlike any other volunteering programme. Instead of time-based effort, it asks for your professional expertise — the skills you've built over years in your career, applied to an NGO project that genuinely needs them.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
          Duration ranges from one to six months. Volunteering happens primarily on weekends and holidays, so your working life isn't disrupted — but your impact on a community can be profound.
        </p>

        {/* Skill areas */}
        <div style={{ marginTop: 32 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", letterSpacing: "1px", textTransform: "uppercase", margin: "0 0 14px" }}>
            Skill areas
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {SKILL_AREAS.map((s) => (
              <span key={s} style={{
                background: P_TEAL, border: "1px solid #9FE1CB",
                borderRadius: 100, padding: "6px 14px",
                fontSize: 13, fontWeight: 600, color: "#0a4a35",
              }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          WHO
      ════════════════════════════════════════ */}
      <section id="pe-who" style={{ background: "#f5f5fa", padding: "72px 40px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#94A3B8", margin: "0 0 10px" }}>Who can ProEngage</p>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: ACCENT_NAVY, margin: "0 0 32px", letterSpacing: "-0.5px" }}>
            Open to the whole Tata family
          </h2>
          <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => (
              <div key={c} style={{
                background: "#fff", border: "1px solid #e8e8f0", borderRadius: 12,
                padding: "16px 22px", display: "flex", alignItems: "center", gap: 10, flex: "1 1 200px",
              }}>
                <CheckCircle size={18} style={{ color: B_TEAL, flexShrink: 0 }} />
                <span style={{ fontSize: 15, fontWeight: 600, color: ACCENT_NAVY }}>{c}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            Volunteers already engaged with a non-profit in an individual capacity can also route their projects through ProEngage to gain recognition and structured TSG support.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TIME COMMITMENT
      ════════════════════════════════════════ */}
      <section id="pe-time" style={{ padding: "72px 40px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#94A3B8", margin: "0 0 10px" }}>Time commitment</p>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: ACCENT_NAVY, margin: "0 0 32px", letterSpacing: "-0.5px" }}>
            Designed to fit around your career
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              {
                icon: Clock,
                title: "When",
                body: "Weekends, public holidays, and after-work hours. Your professional commitments always come first.",
                colour: B_INDIGO, pastel: P_INDIGO,
              },
              {
                icon: Award,
                title: "Time off",
                body: "Two working days per quarter off from work. Four total days for a six-month project. Structured and fair.",
                colour: B_TEAL, pastel: P_TEAL,
              },
            ].map((item) => (
              <div key={item.title} style={{
                background: item.pastel, borderRadius: 14,
                padding: 28, border: `1px solid ${item.colour}28`,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, marginBottom: 16,
                  background: `${item.colour}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <item.icon size={20} style={{ color: item.colour }} />
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: ACCENT_NAVY, marginBottom: 8 }}>{item.title}</div>
                <div style={{ fontSize: 15, color: "#475569", lineHeight: 1.7 }}>{item.body}</div>
              </div>
            ))}
          </div>

          {/* Announcement dates */}
          <div style={{
            marginTop: 20, background: ACCENT_NAVY, borderRadius: 14,
            padding: "24px 28px", display: "flex", alignItems: "center", gap: 32,
          }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", margin: "0 0 6px" }}>
                ProEngage opens
              </p>
              <p style={{ fontSize: 22, fontWeight: 900, color: B_YELLOW, margin: 0 }}>
                15th June & 5th December
              </p>
            </div>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
            <button
              onClick={() => navigate(isLoggedIn ? "proengage" : "login")}
              style={{
                background: B_YELLOW, color: ACCENT_NAVY, border: "none",
                borderRadius: 10, padding: "12px 22px", fontWeight: 700,
                fontSize: 14, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0,
              }}
            >
              Browse open projects <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS — dark
      ════════════════════════════════════════ */}
      <section id="pe-how" style={{ background: ACCENT_NAVY, padding: "72px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", margin: "0 0 10px" }}>
            How it works
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "#fff", margin: "0 0 40px", letterSpacing: "-0.5px" }}>
            Six steps from application to certificate
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {HOW_STEPS.map((step) => (
              <div key={step.step} style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 14, padding: 24,
              }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: B_YELLOW, marginBottom: 10, letterSpacing: "-0.5px" }}>
                  {step.step}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TSG ROLE
      ════════════════════════════════════════ */}
      <section id="pe-tsg" style={{ padding: "72px 40px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#94A3B8", margin: "0 0 10px" }}>
            Role of TSG
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: ACCENT_NAVY, margin: "0 0 32px", letterSpacing: "-0.5px" }}>
            What the Tata Sustainability Group does
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {TSG_ROLES.map((r) => (
              <div key={r.text} style={{
                display: "flex", gap: 14, alignItems: "flex-start",
                padding: "18px 20px", background: "#f5f5fa",
                borderRadius: 12, border: "1px solid #e8e8f0",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: P_TEAL,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <r.icon size={16} style={{ color: B_TEAL }} />
                </div>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65, margin: 0 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════ */}
      <div style={{ background: B_INDIGO, padding: "56px 40px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.5px" }}>
          Ready to contribute your skills?
        </h2>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", margin: "0 0 28px" }}>
          Hundreds of NGOs are waiting for someone with exactly your expertise.
        </p>
        <button
          onClick={() => navigate(isLoggedIn ? "proengage" : "login")}
          style={{
            background: "#fff", color: B_INDIGO, border: "none",
            borderRadius: 10, padding: "14px 32px", fontWeight: 700,
            fontSize: 15, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 8,
          }}
        >
          Browse ProEngage Projects <ArrowRight size={15} />
        </button>
      </div>

      <Footer />
    </div>
  );
}
