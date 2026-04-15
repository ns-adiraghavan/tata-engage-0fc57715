import { useState, useEffect } from "react";
import { ArrowRight, Calendar, Users, Globe, CheckCircle } from "lucide-react";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { useAuth } from "@/context/AuthContext";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/layout/Footer";

// ── Brand tokens ──────────────────────────────────────────────────────────────
const ACCENT_NAVY = "#0D1B3E";
const B_INDIGO    = "#333399";
const B_YELLOW    = "#F5A623";
const B_TEAL      = "#00A896";
const P_INDIGO    = "#EEF0FF";

// ── Section config ────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "tvw-overview",   label: "Overview"    },
  { id: "tvw-who",        label: "Who"         },
  { id: "tvw-how",        label: "How it works" },
  { id: "tvw-tsg",        label: "TSG Role"    },
  { id: "tvw-editions",   label: "Editions"    },
];

// ── Data ──────────────────────────────────────────────────────────────────────
const CATEGORIES = ["Tata Employees", "Their Family Members", "Retired Tata Employees"];

const TSG_FEATURES = [
  "Centralised Campaigns",
  "Cross-collaboration Support",
  "Regional Meets",
  "Trackers & Announcements",
  "Rewards & Recognition",
];

const HOW_STEPS = [
  { num: "01", title: "Company organises",  desc: "Each Tata company arranges its own events — half-day group sessions coordinated by Corporate SPOCs and NGO partners."  },
  { num: "02", title: "Employees sign up",  desc: "Team members register via TataEngage, choose activities aligned with their interests, and participate together."       },
  { num: "03", title: "Impact is logged",   desc: "Volunteering hours, participation and outcomes are tracked in real time on the platform for reporting and recognition." },
  { num: "04", title: "Stories are shared", desc: "Highlights, photos and testimonials are curated into TVW Vibe — the living record of each edition."                    },
];

const EDITIONS = [
  { label: "TVW25", detail: "3rd Mar – 31st Mar 2025" },
  { label: "TVW24", detail: "2nd Sep – 30th Sep 2024" },
  { label: "TVW23", detail: "3rd Mar – 31st Mar 2024" },
  { label: "TVW22", detail: "4th Sep – 30th Sep 2023" },
  { label: "TVW21", detail: "6th Mar – 31st Mar 2023" },
  { label: "TVW20", detail: "5th Sep – 30th Sep 2022" },
  { label: "TVW19", detail: "7th Mar – 31st Mar 2022" },
  { label: "TVW18", detail: "6th Sep – 30th Sep 2021" },
  { label: "TVW17", detail: "1st Mar – 31st Mar 2021" },
  { label: "TVW16", detail: "7th Sep – 30th Sep 2020" },
  { label: "TVW15", detail: "2nd Mar – 31st Mar 2020" },
  { label: "TVW14", detail: "2nd Sep – 30th Sep 2019" },
];

const STATS = [
  { icon: Calendar, num: "25+",    label: "Editions",        colour: B_YELLOW },
  { icon: Users,    num: "50,000+",label: "Volunteers",       colour: B_TEAL   },
  { icon: Globe,    num: "100+",   label: "Tata companies",   colour: B_INDIGO },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function AboutTVWView() {
  const navigate = useAppNavigate();
  const { isLoggedIn } = useAuth();
  const { triggerToast } = useAppContext();
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
                backgroundColor: active ? B_INDIGO : "#CBD5E1",
                transition: "all 0.25s",
              }} />
            </button>
          );
        })}
      </div>

      {/* ── 2px accent line ── */}
      <div style={{ height: 2, background: B_INDIGO, width: "100%" }} />

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1800"
          alt=""
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center 30%",
          }}
          referrerPolicy="no-referrer"
        />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${ACCENT_NAVY}f2 0%, ${ACCENT_NAVY}cc 50%, ${ACCENT_NAVY}88 100%)`,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(45deg, rgba(51,51,153,0.05) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "100px 40px 72px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: "0 0 14px" }}>
            Programme · Bi-Annual
          </p>
          <h1 style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 900,
            fontSize: 52, color: "#fff", margin: "0 0 16px", lineHeight: 1.1, letterSpacing: "-1px",
          }}>
            Tata Volunteering Week
          </h1>
          <span style={{
            display: "inline-block", marginBottom: 24,
            background: B_YELLOW, color: "#fff", fontStyle: "italic",
            fontWeight: 700, fontSize: 15, padding: "8px 20px", borderRadius: 8,
          }}>
            experience THE CHANGE
          </span>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, maxWidth: 560, margin: "0 0 40px" }}>
            A 4-week group celebration of volunteering held twice a year — bringing together the entire Tata family across the world.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            {STATS.map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${s.colour}28`,
                  border: `1px solid ${s.colour}50`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <s.icon size={18} style={{ color: s.colour }} />
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          OVERVIEW
      ════════════════════════════════════════ */}
      <section id="tvw-overview" style={{ maxWidth: 860, margin: "0 auto", padding: "72px 40px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#94A3B8", margin: "0 0 10px" }}>Overview</p>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: ACCENT_NAVY, margin: "0 0 28px", letterSpacing: "-0.5px" }}>
          Two decades of walking the talk
        </h2>

        {/* Pull quote */}
        <div style={{
          borderLeft: `4px solid ${B_INDIGO}`,
          background: P_INDIGO, borderRadius: "0 12px 12px 0",
          padding: "20px 24px", marginBottom: 32,
        }}>
          <p style={{ fontSize: 18, fontStyle: "italic", color: B_INDIGO, lineHeight: 1.65, margin: 0 }}>
            "Talks and planning can help determine the right path to herald change. But to effect change, we need to walk the talk."
          </p>
        </div>

        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Tata Volunteering Week is a 4-week group celebration of volunteering held twice a year — bringing together the Tata family across the world. Over 25+ editions, TVW has consistently broken participation records, mobilising lakhs of employees, their families, and retired colleagues.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
          From environmental clean-ups and education workshops to health camps and skill-building sessions, TVW covers a wide spectrum of community impact — making volunteering accessible, inclusive, and impactful for everyone.
        </p>

        {/* Timing callout */}
        <div style={{
          marginTop: 32, display: "flex", gap: 16,
        }}>
          {[
            { period: "March Edition", dates: "Starts 3rd March", colour: B_INDIGO },
            { period: "September Edition", dates: "Starts 5th September", colour: B_TEAL },
          ].map((t) => (
            <div key={t.period} style={{
              flex: 1, background: "#f5f5fa", borderRadius: 12,
              padding: "18px 22px", borderTop: `3px solid ${t.colour}`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.colour, marginBottom: 4 }}>{t.period}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: ACCENT_NAVY }}>{t.dates}</div>
              <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>4-week run</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          WHO CAN VOLUNTEER
      ════════════════════════════════════════ */}
      <section id="tvw-who" style={{ background: "#f5f5fa", padding: "72px 40px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#94A3B8", margin: "0 0 10px" }}>Who can volunteer</p>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: ACCENT_NAVY, margin: "0 0 32px", letterSpacing: "-0.5px" }}>
            TVW is open to everyone in the Tata family
          </h2>
          <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => (
              <div key={c} style={{
                background: "#fff", border: "1px solid #e8e8f0",
                borderRadius: 12, padding: "16px 22px",
                display: "flex", alignItems: "center", gap: 10, flex: "1 1 200px",
              }}>
                <CheckCircle size={18} style={{ color: B_TEAL, flexShrink: 0 }} />
                <span style={{ fontSize: 15, fontWeight: 600, color: ACCENT_NAVY }}>{c}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 24 }}>
            Activities are designed for all — from generic awareness drives open to everyone, to specialised skill-based projects. Volunteering guidelines ensure safety, inclusivity, and meaningful engagement.
          </p>
          <button
            onClick={() => navigate("register-role")}
            style={{
              background: B_INDIGO, color: "#fff", border: "none",
              borderRadius: 10, padding: "12px 24px", fontWeight: 700,
              fontSize: 14, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}
          >
            Register Now <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS — dark
      ════════════════════════════════════════ */}
      <section id="tvw-how" style={{ background: ACCENT_NAVY, padding: "72px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", margin: "0 0 10px" }}>
            How it works
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "#fff", margin: "0 0 40px", letterSpacing: "-0.5px" }}>
            Four steps to impact
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {HOW_STEPS.map((step) => (
              <div key={step.num} style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 14, padding: 28,
              }}>
                <div style={{
                  fontSize: 28, fontWeight: 900, color: B_YELLOW,
                  lineHeight: 1, marginBottom: 12, letterSpacing: "-1px",
                }}>
                  {step.num}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.62)", lineHeight: 1.7 }}>{step.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, textAlign: "center" }}>
            <button
              onClick={() => navigate(isLoggedIn ? "tvw" : "login")}
              style={{
                background: B_YELLOW, color: ACCENT_NAVY, border: "none",
                borderRadius: 10, padding: "13px 28px", fontWeight: 700,
                fontSize: 15, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
            >
              View Volunteering Opportunities <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TSG ROLE
      ════════════════════════════════════════ */}
      <section id="tvw-tsg" style={{ padding: "72px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#94A3B8", margin: "0 0 10px" }}>
            Role of TSG
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: ACCENT_NAVY, margin: "0 0 32px", letterSpacing: "-0.5px" }}>
            What the Tata Sustainability Group does
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {TSG_FEATURES.map((f) => (
              <div key={f} style={{
                background: P_INDIGO, border: "1px solid #d4d8f5",
                borderRadius: 10, padding: "14px 20px",
                fontSize: 15, fontWeight: 600, color: B_INDIGO,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: B_INDIGO, flexShrink: 0,
                }} />
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          EDITIONS — dark
      ════════════════════════════════════════ */}
      <section id="tvw-editions" style={{ background: "#f5f5fa", padding: "72px 40px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "#94A3B8", margin: "0 0 10px" }}>
            Memory lane
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: ACCENT_NAVY, margin: "0 0 10px", letterSpacing: "-0.5px" }}>
            25 editions and counting
          </h2>
          <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.7, margin: "0 0 32px" }}>
            Each edition has been bigger and more impactful than the last. Explore the archive.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {EDITIONS.map((ed) => (
              <button
                key={ed.label}
                onClick={() => triggerToast(`Opening ${ed.label} archive…`)}
                style={{
                  background: "#fff", border: "1px solid #e8e8f0",
                  borderRadius: 10, padding: "14px 18px", textAlign: "left",
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = B_INDIGO;
                  (e.currentTarget as HTMLElement).style.background = P_INDIGO;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#e8e8f0";
                  (e.currentTarget as HTMLElement).style.background = "#fff";
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: ACCENT_NAVY }}>{ed.label}</div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>{ed.detail}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
