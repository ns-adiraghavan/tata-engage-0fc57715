import { useState, useEffect } from "react";
import { ArrowRight, Users, Lightbulb, Target, Heart, BookOpen } from "lucide-react";
import { useAppNavigate } from "@/hooks/useAppNavigate";
import { SectionDivider } from "@/components/shared/HomeSections";
import Footer from "@/components/layout/Footer";

const DIAG_TEXTURE = {
  position: "absolute" as const, inset: 0,
  backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 22px)",
  backgroundSize: "22px 22px",
  pointerEvents: "none" as const,
};

const cardHover = {
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; },
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; },
};

// ── Brand tokens ──────────────────────────────────────────────────────────────
const ACCENT_NAVY = "#0D1B3E";
const B_INDIGO    = "#333399";
const B_YELLOW    = "#F5A623";
const B_TEAL      = "#00A896";
const B_RED       = "#E8401C";
const B_BLUE      = "#1E6BB8";
const P_INDIGO    = "#EEF0FF";
const P_TEAL      = "#E6F8F5";

// ── Section config for dot rail ───────────────────────────────────────────────
const SECTIONS = [
  { id: "about-vision",   label: "Vision"    },
  { id: "about-what",     label: "What We Do" },
  { id: "about-impact",   label: "Impact"    },
  { id: "about-programmes", label: "Programmes" },
  { id: "about-team",     label: "Team"      },
];

// ── Data ──────────────────────────────────────────────────────────────────────
const PILLS = [
  "breeds empathy",
  "demonstrates commitment",
  "precipitates solutions",
  "improves understanding",
  "spurs action",
];

const FEATURES = [
  { icon: Users,     heading: "Bringing together",            desc: "Not only Tata employees, but also their families and retired Tata employees — one unified volunteer community.", colour: B_INDIGO },
  { icon: Heart,     heading: "Connecting volunteers",        desc: "With causes close to their hearts and the NGOs who work towards them most competently.", colour: B_RED },
  { icon: Lightbulb, heading: "Donating talent",              desc: "Helping employees contribute not just their time but their professional skills to bring about a greater difference.", colour: B_YELLOW },
  { icon: BookOpen,  heading: "Curating opportunities",       desc: "Ranging from a one-hour experiential activity to a six-month professional project.", colour: B_TEAL },
  { icon: Target,    heading: "Designing for dual growth",    desc: "Programmes that contribute to community development and to the volunteer's professional and personal growth.", colour: B_BLUE },
];

const STATS = [
  { num: "50,000+", label: "Active Volunteers", sub: "Across 100+ Tata companies" },
  { num: "85",      label: "NGO Partners",       sub: "Across 15 states in India"  },
  { num: "2.5M+",   label: "Volunteer Hours",    sub: "Logged since 2007"           },
  { num: "16+",     label: "TVW Editions",       sub: "And counting"                },
];

const PROGRAMMES = [
  {
    name: "Tata Volunteering Week",
    tag: "Bi-annual · Global",
    desc: "A 4-week celebration of volunteering held twice a year, bringing together the Tata family worldwide through hundreds of community events.",
    nav: "about-tvw",
    colour: B_INDIGO,
    pastel: P_INDIGO,
  },
  {
    name: "ProEngage",
    tag: "Skill-based · Year-round",
    desc: "Matches professional expertise with NGO projects spanning HR, finance, IT, marketing, and more. Duration: one to six months.",
    nav: "about-proengage",
    colour: B_TEAL,
    pastel: P_TEAL,
  },
  {
    name: "Disaster Response",
    tag: "Rapid Action",
    desc: "Volunteers deployed within 48 hours when communities need urgent support. Part of the One Tata Response Framework.",
    nav: "disaster-response",
    colour: B_RED,
    pastel: "#FFF0EE",
  },
];

const TEAM = [
  { name: "Shrirang Dhavale",    title: "Cluster Head & General Manager" },
  { name: "Gauri Rajadhyaksha", title: "Deputy General Manager"          },
  { name: "Supriya Ramachandran", title: "Manager"                       },
  { name: "Trupti Prabhu",      title: "Assistant Manager"               },
];

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("");

// ── Eyebrow helper ────────────────────────────────────────────────────────────
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p style={{
    fontSize: 11, fontWeight: 700, letterSpacing: "1.8px",
    textTransform: "uppercase", color: "#94A3B8", marginBottom: 10, marginTop: 0,
  }}>
    {children}
  </p>
);

// ── Component ─────────────────────────────────────────────────────────────────
export default function AboutView() {
  const navigate = useAppNavigate();
  const [activeSection, setActiveSection] = useState(0);

  // Dot rail: track active section via IntersectionObserver
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

      {/* ── Right-side dot rail (same pattern as HomeView) ── */}
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

      {/* ── 2px accent line at top ── */}
      <div style={{ height: 2, background: B_INDIGO, width: "100%" }} />

      {/* ════════════════════════════════════════
          HERO — full-bleed with photo overlay
      ════════════════════════════════════════ */}
      <div style={{ position: "relative", overflow: "hidden", paddingTop: 64 }}>
        {/* Background photo */}
        <img
          src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1800"
          alt=""
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center 40%",
          }}
          referrerPolicy="no-referrer"
        />
        {/* Dark gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${ACCENT_NAVY}f0 0%, ${ACCENT_NAVY}cc 45%, ${ACCENT_NAVY}88 100%)`,
        }} />
        {/* Subtle diagonal texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(45deg, rgba(51,51,153,0.06) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "80px 40px 72px" }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "2px",
            textTransform: "uppercase", color: "rgba(255,255,255,0.45)",
            marginBottom: 14, marginTop: 0,
          }}>
            Tata Sustainability Group · Est. 2007
          </p>
          <h1 style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 900,
            fontSize: 52, color: "#fff", margin: "0 0 16px", lineHeight: 1.1,
            letterSpacing: "-1px",
          }}>
            About Tata Engage
          </h1>
          <p style={{
            fontStyle: "italic", fontWeight: 300, fontSize: 19,
            color: "rgba(255,255,255,0.72)", marginBottom: 32, maxWidth: 560,
          }}>
            Institutionalising the spirit of giving across the Tata Group
          </p>

          {/* Pill tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 40 }}>
            {PILLS.map((p) => (
              <span key={p} style={{
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff", fontSize: 13, fontWeight: 600,
                padding: "6px 16px", borderRadius: 100,
              }}>
                {p}
              </span>
            ))}
          </div>

          {/* Hero stat strip */}
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            {[
              { num: "50,000+", label: "Volunteers" },
              { num: "85",      label: "NGO Partners" },
              { num: "16+",     label: "TVW Editions" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 28, fontWeight: 900, color: B_YELLOW, lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4, letterSpacing: "0.5px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          VISION SECTION
      ════════════════════════════════════════ */}
      <section id="about-vision" style={{ maxWidth: 860, margin: "0 auto", padding: "72px 40px" }}>
        <Eyebrow>TE Vision</Eyebrow>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: ACCENT_NAVY, margin: "0 0 32px", letterSpacing: "-0.5px" }}>
          Why Tata Engage exists
        </h2>

        {/* Quote */}
        <div style={{ marginBottom: 40 }}>
          <svg width="28" height="22" viewBox="0 0 28 22" fill="none" style={{ marginBottom: 12, opacity: 0.2 }}>
            <path d="M0 22V13.5C0 5.8 4.5 1.5 13.5 0L15 3C10.5 4.2 8 7 7.5 11H12V22H0ZM16 22V13.5C16 5.8 20.5 1.5 29.5 0L31 3C26.5 4.2 24 7 23.5 11H28V22H16Z" fill={ACCENT_NAVY} />
          </svg>
          <p style={{
            fontSize: 20, fontStyle: "italic", color: B_INDIGO,
            lineHeight: 1.65, margin: 0, maxWidth: 680,
          }}>
            To encourage Tata volunteers around the globe to engage with the community by contributing their time and skills — making volunteerism accessible, measurable, and rewarding for every Tata stakeholder.
          </p>
        </div>

        {/* Legacy text */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32,
        }}>
          <div>
            <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, margin: "0 0 16px" }}>
              Jamsetji Tata's foresight went far beyond pure business. His spirit of selfless giving and philosophy of constructive philanthropy became a tradition for the group he founded.
            </p>
            <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, margin: 0 }}>
              While every Tata employee and Tata company is distinctive, what binds them is the Tata values and the ethos of giving back to society.
            </p>
          </div>
          <div style={{
            background: ACCENT_NAVY, borderRadius: 16, padding: 28,
            position: "relative", overflow: "hidden",
          }}>
            <div style={DIAG_TEXTURE} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: "0 0 12px" }}>
                by Tata Sustainability Group
              </p>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.75, margin: "0 0 12px" }}>
                The Tata Sustainability Group (TSG) guides Tata companies on sustainability and social responsibility, embedding the ethos of giving into everyday business.
              </p>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: 0 }}>
                TSG conceptualised TataEngage as the unified digital vehicle for volunteering — connecting employees, NGOs, and communities on a single platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ════════════════════════════════════════
          WHAT WE DO
      ════════════════════════════════════════ */}
      <section id="about-what" style={{ background: "#f5f5fa", padding: "72px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Eyebrow>What TataEngage does</Eyebrow>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: ACCENT_NAVY, margin: "0 0 40px", letterSpacing: "-0.5px" }}>
            Five ways we create impact
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {FEATURES.map((f) => (
              <div key={f.heading} style={{
                background: "#fff", borderRadius: 14, padding: 24,
                border: "1px solid #e8e8f0",
                borderLeft: `4px solid ${f.colour}`,
                display: "flex", gap: 16, alignItems: "flex-start",
                transition: "transform 0.2s, box-shadow 0.2s",
              }} {...cardHover}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: `${f.colour}14`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <f.icon size={18} style={{ color: f.colour }} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 6 }}>
                    {f.heading}
                  </div>
                  <div style={{ fontSize: 14, color: "#64748B", lineHeight: 1.65 }}>{f.desc}</div>
                </div>
              </div>
            ))}
            {/* Purpose CTA card — spans both columns on the 5th */}
            <div style={{
              background: ACCENT_NAVY, borderRadius: 14, padding: 28,
              display: "flex", gap: 24, alignItems: "center",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Volunteer with us</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                  Turn intent into impact — join thousands of Tata colleagues already volunteering.
                </div>
              </div>
              <button
                onClick={() => navigate("register-role")}
                style={{
                  background: B_YELLOW, color: "#fff", border: "none",
                  borderRadius: 10, padding: "10px 20px", fontWeight: 700,
                  fontSize: 14, cursor: "pointer", whiteSpace: "nowrap",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                Register <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ════════════════════════════════════════
          IMPACT — dark section
      ════════════════════════════════════════ */}
      <section id="about-impact" style={{ background: ACCENT_NAVY, padding: "72px 40px", position: "relative", overflow: "hidden" }}>
        <div style={DIAG_TEXTURE} />
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.8px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", margin: "0 0 10px" }}>
            Impact & Reach
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: "#fff", margin: "0 0 48px", letterSpacing: "-0.5px" }}>
            Fifteen years of giving back
          </h2>

          {/* Stat tiles */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 48 }}>
            {STATS.map((s) => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 14, padding: "24px 20px", textAlign: "center",
              }}>
                <div style={{ fontSize: 38, fontWeight: 900, color: B_YELLOW, lineHeight: 1, letterSpacing: "-1px" }}>{s.num}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginTop: 8 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Journey teaser */}
          <div style={{
            background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.25)",
            borderRadius: 16, padding: "24px 32px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
          }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
                From 4 companies to 100+ — see the full story
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
                Explore our interactive journey from 2007 to today.
              </div>
            </div>
            <button
              onClick={() => navigate("journey")}
              style={{
                background: B_YELLOW, color: "#0D1B3E", border: "none",
                borderRadius: 10, padding: "10px 22px", fontWeight: 700,
                fontSize: 14, cursor: "pointer", whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
              }}
            >
              Our Journey <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ════════════════════════════════════════
          PROGRAMMES
      ════════════════════════════════════════ */}
      <section id="about-programmes" style={{ padding: "72px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Eyebrow>The Programmes</Eyebrow>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: ACCENT_NAVY, margin: "0 0 40px", letterSpacing: "-0.5px" }}>
            Three ways to volunteer
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {PROGRAMMES.map((pr) => (
              <div key={pr.name} style={{
                border: "1px solid #e8e8f0", borderRadius: 16, overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
              }} {...cardHover}>
                <div style={{ background: pr.pastel, padding: "20px 24px 16px" }}>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "1.5px",
                    textTransform: "uppercase", color: pr.colour, marginBottom: 8,
                  }}>
                    {pr.tag}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: ACCENT_NAVY }}>
                    {pr.name}
                  </div>
                </div>
                <div style={{ padding: "16px 24px 24px" }}>
                  <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, margin: "0 0 20px" }}>{pr.desc}</p>
                  <button
                    onClick={() => navigate(pr.nav)}
                    style={{
                      background: "none", border: `1.5px solid ${pr.colour}`,
                      borderRadius: 8, padding: "8px 16px",
                      fontSize: 13, fontWeight: 700, color: pr.colour,
                      cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                    }}
                  >
                    Learn more <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Partner CTA */}
          <div style={{
            marginTop: 20, background: "#f5f5fa", borderRadius: 16,
            padding: "24px 32px", display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: 24,
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: ACCENT_NAVY, marginBottom: 4 }}>Are you an NGO?</div>
              <div style={{ fontSize: 14, color: "#64748B" }}>
                Partner with us to access skilled Tata volunteers for your projects.
              </div>
            </div>
            <button
              onClick={() => navigate("partner")}
              style={{
                background: ACCENT_NAVY, color: "#fff", border: "none",
                borderRadius: 10, padding: "10px 22px", fontWeight: 700,
                fontSize: 14, cursor: "pointer", whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
              }}
            >
              Partner with us <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ════════════════════════════════════════
          TEAM
      ════════════════════════════════════════ */}
      <section id="about-team" style={{ background: "#f5f5fa", padding: "72px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <Eyebrow>The Team</Eyebrow>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: ACCENT_NAVY, margin: "0 0 40px", letterSpacing: "-0.5px" }}>
            Meet Tata Engage
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {TEAM.map((t) => (
              <div key={t.name} style={{
                background: "#fff", border: "1px solid #e8e8f0",
                borderRadius: 16, padding: 28, textAlign: "center",
                transition: "transform 0.2s, box-shadow 0.2s",
              }} {...cardHover}>
                {/* Avatar with initials */}
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: ACCENT_NAVY, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, fontWeight: 700, margin: "0 auto 16px",
                  letterSpacing: "0.5px",
                }}>
                  {initials(t.name)}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: ACCENT_NAVY }}>{t.name}</div>
                <div style={{ fontSize: 13, color: "#64748B", marginTop: 4, lineHeight: 1.4 }}>{t.title}</div>
                <div style={{
                  fontSize: 11, fontWeight: 600, color: B_INDIGO,
                  background: P_INDIGO, borderRadius: 100,
                  padding: "3px 10px", display: "inline-block", marginTop: 10,
                }}>
                  Social Services Cluster
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
